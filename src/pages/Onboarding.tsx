import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, GraduationCap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { TrustBadges } from "@/components/guide/TrustBadges";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONSULT_METHODS } from "@/content/center";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/content/footer";
import { DEFAULT_COURSES, type Course } from "@/content/curriculum";
import { REGIONS, getSigunguOptions } from "@/content/regions";
import { fetchPublishedCourses, getCompletedCourses, isAllCompleted } from "@/lib/courses";
import { submitGuidanceRequest } from "@/lib/guidance";
import type { ConsultMethod, Gender } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { ValuesAssessmentSection } from "@/components/apply/ValuesAssessmentSection";
import type { ValuesAssessmentResult } from "@/content/valuesAssessment";

// 축복상담 신청 `/center/apply` — 6축 개편 §4.6.
// 이전에는 5단계 위저드였으나, 듀오 간편상담신청(§1.6: 한 화면 7필드, 전부 선택형 위주)의
// 이탈 방지 효과를 따라 **핵심 7필드 한 화면**으로 바꿨습니다. 필드를 더 늘리려면 정말
// 상담 전에 필요한 값인지 먼저 따져보세요 — 여기가 전환의 병목입니다.
const CURRENT_YEAR = new Date().getFullYear();
const MIN_BIRTH_YEAR = 1940;
const MAX_BIRTH_YEAR = CURRENT_YEAR - 18;
const DRAFT_STORAGE_KEY = "blessingworld:onboarding:draft";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "이름은 2자 이상 입력해주세요.")
    .max(20, "이름은 20자 이하로 입력해주세요."),
  gender: z.enum(["female", "male"], { errorMap: () => ({ message: "성별을 선택해주세요." }) }),
  birthYear: z.coerce
    .number({ invalid_type_error: "출생년도를 입력해주세요." })
    .int("출생년도를 정확히 입력해주세요.")
    .min(MIN_BIRTH_YEAR, `${MIN_BIRTH_YEAR}년 이후로 입력해주세요.`)
    .max(MAX_BIRTH_YEAR, "만 18세 미만은 신청하실 수 없어요."),
  regionSido: z.string().trim().min(1, "시·도를 선택해주세요."),
  regionSigungu: z.string().trim().min(1, "시·군·구를 선택해주세요."),
  phone: z
    .string()
    .trim()
    .regex(/^01[0-9]-\d{3,4}-\d{4}$/, "휴대전화 번호 형식을 확인해주세요. 예: 010-1234-5678"),
  consultMethod: z.enum(["visit", "phone", "video"], {
    errorMap: () => ({ message: "원하시는 상담 방식을 선택해주세요." }),
  }),
  email: z.union([z.literal(""), z.string().trim().email("이메일 형식을 확인해주세요.")]).optional(),
  privacyAgreed: z.literal(true, {
    errorMap: () => ({ message: "개인정보 수집·이용에 동의해주세요." }),
  }),
});

type FieldKey = keyof z.input<typeof formSchema>;
type FormErrors = Partial<Record<FieldKey, string>>;

interface FormState {
  name: string;
  gender: Gender | "";
  birthYear: string;
  regionSido: string;
  regionSigungu: string;
  phone: string;
  consultMethod: ConsultMethod | "";
  email: string;
  privacyAgreed: boolean;
  /** 허니팟 — 사람 사용자에게는 보이지 않는 필드. 채워져 있으면 스팸으로 간주합니다. */
  website: string;
}

const initialFormState: FormState = {
  name: "",
  gender: "",
  birthYear: "",
  regionSido: "",
  regionSigungu: "",
  phone: "",
  consultMethod: "",
  email: "",
  privacyAgreed: false,
  website: "",
};

/** 새로고침해도 입력이 날아가지 않게 sessionStorage에 보관합니다. 허니팟은 제외합니다. */
function readDraft(): Omit<FormState, "website"> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FormState> & { form?: Partial<FormState> };
    // 개편 전(5단계 위저드)의 초안은 { step, form } 형태였습니다 — 남아 있으면 form만 씁니다.
    const source = parsed.form ?? parsed;
    if (!source || typeof source !== "object") return null;
    return { ...initialFormState, ...(source as Partial<FormState>), website: undefined } as Omit<
      FormState,
      "website"
    >;
  } catch {
    return null;
  }
}

function writeDraft(form: FormState) {
  if (typeof window === "undefined") return;
  try {
    const { website: _website, ...rest } = form;
    window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // 프라이빗 모드 등으로 저장 공간을 쓸 수 없는 경우 조용히 무시합니다.
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // 위와 동일하게 조용히 무시합니다.
  }
}

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-destructive">
      {message}
    </p>
  );
}

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  const [courses, setCourses] = useState<Course[] | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>(() => {
    const draft = readDraft();
    return draft ? { ...initialFormState, ...draft, website: "" } : initialFormState;
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [valuesAssessment, setValuesAssessment] = useState<ValuesAssessmentResult | null>(null);

  useEffect(() => {
    setCompletedIds(getCompletedCourses());
    let cancelled = false;
    fetchPublishedCourses().then((data) => {
      if (!cancelled) setCourses(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (submitted) return;
    writeDraft(form);
  }, [form, submitted]);

  const courseIds = useMemo(
    () => (courses ?? DEFAULT_COURSES).map((course) => course.id),
    [courses],
  );
  const eduCompleted = isAllCompleted(courseIds, completedIds);
  const showEduBanner = ref === "curriculum" || completedIds.length > 0;
  const sigunguOptions = useMemo(() => getSigunguOptions(form.regionSido), [form.regionSido]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function submit(values: z.output<typeof formSchema>) {
    if (form.website.trim().length > 0) {
      // 허니팟이 채워져 있으면 스팸으로 보고, 사용자에게 티 내지 않고 성공한 것처럼 마무리합니다.
      setSubmitted(true);
      clearDraft();
      return;
    }

    setSubmitting(true);
    const result = await submitGuidanceRequest({
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      gender: values.gender,
      birthYear: values.birthYear,
      regionSido: values.regionSido,
      regionSigungu: values.regionSigungu,
      consultMethod: values.consultMethod,
      source: ref === "curriculum" ? "curriculum" : "web",
      completedCourses: completedIds,
      valuesAssessment: valuesAssessment ?? undefined,
    });
    setSubmitting(false);

    if (result.ok) {
      setSubmitted(true);
      clearDraft();
      toast.success("신청이 접수되었어요. 영업일 기준 1~2일 이내에 연락드릴게요.");
      return;
    }

    if (result.reason === "not_configured") {
      toast.error(
        `아직 온라인 접수가 연결되지 않았어요. ${CONTACT_PHONE_DISPLAY}로 전화 주시면 바로 안내해드릴게요.`,
      );
    } else if (result.reason === "duplicate_phone") {
      toast.error(
        "이미 24시간 이내에 접수된 신청이 있어요. 담당자 연락을 기다려주시거나, 급하시면 전화로 문의해주세요.",
      );
    } else if (result.reason === "rate_limited") {
      toast.error("짧은 시간 동안 신청이 여러 번 접수되었어요. 잠시 후 다시 시도해주세요.");
    } else {
      toast.error("접수 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const result = formSchema.safeParse({
      name: form.name,
      gender: form.gender,
      birthYear: form.birthYear,
      regionSido: form.regionSido,
      regionSigungu: form.regionSigungu,
      phone: form.phone,
      consultMethod: form.consultMethod,
      email: form.email,
      privacyAgreed: form.privacyAgreed,
    });

    if (!result.success) {
      const nextErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as FieldKey;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      // 첫 오류 필드로 스크롤·포커스를 옮겨 어디가 문제인지 바로 보이게 합니다.
      const firstKey = result.error.issues[0]?.path[0] as string | undefined;
      if (firstKey && typeof document !== "undefined") {
        document.getElementById(`field-${firstKey}`)?.scrollIntoView({ block: "center" });
      }
      toast.error("입력 내용을 다시 확인해주세요.");
      return;
    }

    void submit(result.data);
  }

  if (submitted) {
    return (
      <>
        <SEO path="/center/apply" />
        <section className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center px-5 py-24 text-center md:px-8">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-2xl font-bold text-foreground md:text-[32px]">
            신청이 접수되었어요
          </h1>
          <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
            영업일 기준 1~2일 이내에 가까운 지역 담당자가 연락드릴 예정입니다. 연락을 원하지
            않으시면 언제든 중단을 요청하실 수 있어요.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="outline">
              <Link to="/roadmap">다음 단계 확인하기</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/curriculum">사랑의 기술 배우기</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO path="/center/apply" />

      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center md:px-8 md:py-24">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
          <Sparkles className="h-8 w-8" aria-hidden="true" />
        </span>
        <EyebrowLabel className="mt-6">BLESSING CENTER</EyebrowLabel>
        <h1 className="mt-3 text-2xl font-bold text-foreground md:text-[32px]">축복상담 신청</h1>

        <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
          아래 항목만 알려주시면 가까운 지역가정교회에서 연락드립니다. 상담은 무료이고, 원하지
          않으시면 언제든 중단하실 수 있어요.
        </p>
        <p className="mt-2 text-sm font-medium text-primary-deep">30초면 끝나요</p>

        {showEduBanner ? (
          <div
            className={cn(
              "mt-6 flex w-full max-w-md items-center gap-3 rounded-2xl border p-4 text-left",
              eduCompleted ? "border-primary/40 bg-primary-soft/30" : "border-border bg-muted/60",
            )}
          >
            <GraduationCap className="h-5 w-5 shrink-0 text-primary-deep" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              {eduCompleted ? (
                <>
                  사랑의 기술 {courseIds.length}강좌를 모두 들으셨네요.{" "}
                  <Badge variant="success" className="align-middle">
                    이수 완료
                  </Badge>{" "}
                  이수 내역을 담당자에게 함께 전달해드릴게요.
                </>
              ) : (
                <>
                  사랑의 기술 {completedIds.length}강좌를 들으셨어요. 이수 내역을 함께
                  전달해드릴게요.
                </>
              )}
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex w-full justify-center">
          <ValuesAssessmentSection onChange={setValuesAssessment} />
        </div>

        <form
          onSubmit={handleFormSubmit}
          noValidate
          className="mt-10 w-full max-w-md space-y-5 text-left"
        >
          {/* 허니팟 — 실제 사용자에게는 보이지 않습니다. */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
          />

          <div id="field-name">
            <label className="block">
              <span className="text-sm font-medium text-foreground">이름</span>
              <input
                type="text"
                autoComplete="name"
                placeholder="이름을 입력해주세요"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "error-name" : undefined}
                className={cn(inputClass, "mt-1.5")}
              />
            </label>
            <FieldError id="error-name" message={errors.name} />
          </div>

          <fieldset id="field-gender">
            <legend className="text-sm font-medium text-foreground">성별</legend>
            <div className="mt-1.5 grid grid-cols-2 gap-3">
              {(
                [
                  { value: "female", label: "여성" },
                  { value: "male", label: "남성" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={form.gender === option.value}
                  onClick={() => updateField("gender", option.value)}
                  className={cn(
                    "rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                    form.gender === option.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary-deep",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <FieldError id="error-gender" message={errors.gender} />
          </fieldset>

          <div id="field-birthYear">
            <label className="block">
              <span className="text-sm font-medium text-foreground">출생년도</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="예: 1990"
                value={form.birthYear}
                onChange={(e) => updateField("birthYear", e.target.value)}
                aria-invalid={Boolean(errors.birthYear)}
                aria-describedby={errors.birthYear ? "error-birthYear" : undefined}
                className={cn(inputClass, "mt-1.5")}
              />
            </label>
            <FieldError id="error-birthYear" message={errors.birthYear} />
          </div>

          <div id="field-regionSido" className="grid grid-cols-2 gap-3">
            <div>
              <label className="block">
                <span className="text-sm font-medium text-foreground">시·도</span>
                <select
                  value={form.regionSido}
                  onChange={(e) => {
                    updateField("regionSido", e.target.value);
                    updateField("regionSigungu", "");
                  }}
                  aria-invalid={Boolean(errors.regionSido)}
                  className={cn(inputClass, "mt-1.5")}
                >
                  <option value="">선택해주세요</option>
                  {REGIONS.map((group) => (
                    <option key={group.sido} value={group.sido}>
                      {group.sido}
                    </option>
                  ))}
                </select>
              </label>
              <FieldError id="error-regionSido" message={errors.regionSido} />
            </div>
            <div id="field-regionSigungu">
              <label className="block">
                <span className="text-sm font-medium text-foreground">시·군·구</span>
                <select
                  value={form.regionSigungu}
                  disabled={!form.regionSido}
                  onChange={(e) => updateField("regionSigungu", e.target.value)}
                  aria-invalid={Boolean(errors.regionSigungu)}
                  className={cn(inputClass, "mt-1.5")}
                >
                  <option value="">선택해주세요</option>
                  {sigunguOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <FieldError id="error-regionSigungu" message={errors.regionSigungu} />
            </div>
          </div>

          <div id="field-phone">
            <label className="block">
              <span className="text-sm font-medium text-foreground">휴대전화 번호</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="010-0000-0000"
                value={form.phone}
                onChange={(e) => updateField("phone", formatPhoneInput(e.target.value))}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "error-phone" : undefined}
                className={cn(inputClass, "mt-1.5")}
              />
            </label>
            <FieldError id="error-phone" message={errors.phone} />
          </div>

          <fieldset id="field-consultMethod">
            <legend className="text-sm font-medium text-foreground">
              어떤 방식으로 상담받고 싶으세요?
            </legend>
            <div className="mt-1.5 grid gap-2">
              {CONSULT_METHODS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={form.consultMethod === option.value}
                  onClick={() => updateField("consultMethod", option.value)}
                  className={cn(
                    "flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-colors",
                    form.consultMethod === option.value
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:border-primary",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      form.consultMethod === option.value
                        ? "text-primary-deep"
                        : "text-foreground",
                    )}
                  >
                    {option.label}
                  </span>
                  <span className="mt-0.5 text-xs text-muted-foreground">{option.hint}</span>
                </button>
              ))}
            </div>
            <FieldError id="error-consultMethod" message={errors.consultMethod} />
          </fieldset>

          <div id="field-email">
            <label className="block">
              <span className="text-sm font-medium text-foreground">
                이메일 <span className="font-normal text-muted-foreground">(선택)</span>
              </span>
              <input
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "error-email" : undefined}
                className={cn(inputClass, "mt-1.5")}
              />
            </label>
            <FieldError id="error-email" message={errors.email} />
          </div>

          <div id="field-privacyAgreed">
            <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.privacyAgreed}
                onChange={(e) => updateField("privacyAgreed", e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span>
                <span className="font-medium text-foreground">[필수]</span> 개인정보 수집·이용에
                동의합니다.{" "}
                <Link to="/privacy" className="font-medium text-primary-deep hover:underline">
                  자세히 보기
                </Link>
              </span>
            </label>
            <FieldError id="error-privacyAgreed" message={errors.privacyAgreed} />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "접수하는 중…" : "축복상담 신청하기"}
          </Button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground">
          온라인 접수가 어려우시면{" "}
          <a href={CONTACT_PHONE_TEL} className="font-medium text-primary-deep hover:underline">
            {CONTACT_PHONE_DISPLAY}
          </a>
          로 바로 안내받으실 수 있어요.
        </p>

        <TrustBadges className="mt-10 justify-center" />

        <Link to="/roadmap" className="mt-10 text-sm font-medium text-primary-deep hover:underline">
          축복로드맵 먼저 보기 →
        </Link>
      </section>
    </>
  );
}
