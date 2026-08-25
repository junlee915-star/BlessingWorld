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
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/content/footer";
import { DEFAULT_COURSES, type Course } from "@/content/curriculum";
import { fetchPublishedCourses, getCompletedCourses, isAllCompleted } from "@/lib/courses";
import { submitGuidanceRequest } from "@/lib/guidance";
import type { Gender } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_BIRTH_YEAR = 1940;
const MAX_BIRTH_YEAR = CURRENT_YEAR - 18;

// §P-07 필드 명세(이름/연락처/이메일/성별/출생연도/지역/개인정보 동의)의 검증 규칙.
const onboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "이름은 2자 이상 입력해주세요.")
    .max(20, "이름은 20자 이하로 입력해주세요."),
  phone: z
    .string()
    .trim()
    .regex(/^01[0-9]-\d{3,4}-\d{4}$/, "휴대전화 번호 형식을 확인해주세요. 예: 010-1234-5678"),
  email: z.union([z.literal(""), z.string().trim().email("이메일 형식을 확인해주세요.")]).optional(),
  gender: z.enum(["female", "male"], { errorMap: () => ({ message: "성별을 선택해주세요." }) }),
  birthYear: z.coerce
    .number({ invalid_type_error: "출생년도를 입력해주세요." })
    .int("출생년도를 정확히 입력해주세요.")
    .min(MIN_BIRTH_YEAR, `${MIN_BIRTH_YEAR}년 이후로 입력해주세요.`)
    .max(MAX_BIRTH_YEAR, "만 18세 미만은 신청하실 수 없어요."),
  regionSido: z.string().trim().min(1, "시·도를 입력해주세요."),
  regionSigungu: z.string().trim().min(1, "시·군·구를 입력해주세요."),
  privacyAgreed: z.literal(true, {
    errorMap: () => ({ message: "개인정보 수집·이용에 동의해주세요." }),
  }),
});

type FormValues = z.infer<typeof onboardingSchema>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

interface FormState {
  name: string;
  phone: string;
  email: string;
  gender: Gender | "";
  birthYear: string;
  regionSido: string;
  regionSigungu: string;
  privacyAgreed: boolean;
  /** 허니팟 — 사람 사용자에게는 보이지 않는 필드. 채워져 있으면 스팸으로 간주합니다. */
  website: string;
}

const initialFormState: FormState = {
  name: "",
  phone: "",
  email: "",
  gender: "",
  birthYear: "",
  regionSido: "",
  regionSigungu: "",
  privacyAgreed: false,
  website: "",
};

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`;
}

function validate(form: FormState): { values?: FormValues; errors: FormErrors } {
  const result = onboardingSchema.safeParse({
    name: form.name,
    phone: form.phone,
    email: form.email,
    gender: form.gender,
    birthYear: form.birthYear,
    regionSido: form.regionSido,
    regionSigungu: form.regionSigungu,
    privacyAgreed: form.privacyAgreed,
  });
  if (result.success) return { values: result.data, errors: {} };
  const errors: FormErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof FormValues;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { errors };
}

// §6 P-07 ⭐ 전환 핵심. PRD가 그리는 5단계 위저드(성별→출생연도→지역→연락처→완료,
// sessionStorage 복원·rate limit 포함) 전체는 아직 M3 범위로 남겨두고, 이번 구현은
// §P-04↔§P-07 연계(교육 이수 여부를 안내 신청에 포함)에 필요한 단일 화면 폼과
// Supabase 제출 로직을 붙입니다.
export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  const [courses, setCourses] = useState<Course[] | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // 이 브라우저의 §P-04 진행 상태(§src/lib/courses.ts)를 읽어옵니다. 로그인 없이
    // localStorage에만 저장되므로 URL 파라미터(ref=curriculum)와 별개로 항상 확인합니다.
    setCompletedIds(getCompletedCourses());

    let cancelled = false;
    fetchPublishedCourses().then((data) => {
      if (!cancelled) setCourses(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const courseIds = useMemo(() => (courses ?? DEFAULT_COURSES).map((course) => course.id), [courses]);
  const eduCompleted = isAllCompleted(courseIds, completedIds);
  const showEduBanner = ref === "curriculum" || completedIds.length > 0;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (form.website.trim().length > 0) {
      // 허니팟이 채워져 있으면 스팸으로 보고 조용히 무시합니다(사용자에게는 티 내지 않음).
      return;
    }

    const { values, errors: nextErrors } = validate(form);
    setErrors(nextErrors);
    if (!values) {
      toast.error("입력 내용을 다시 확인해주세요.");
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
      source: ref === "curriculum" ? "curriculum" : "web",
      completedCourses: completedIds,
    });
    setSubmitting(false);

    if (result.ok) {
      setSubmitted(true);
      toast.success("신청이 접수되었어요. 영업일 기준 1~2일 이내에 연락드릴게요.");
      return;
    }

    if (result.reason === "not_configured") {
      toast.error(
        `아직 온라인 접수가 연결되지 않았어요. ${CONTACT_PHONE_DISPLAY}로 전화 주시면 바로 안내해드릴게요.`,
      );
    } else {
      toast.error("접수 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  if (submitted) {
    return (
      <>
        <SEO path="/onboarding" />
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
              <Link to="/guide">축복결혼 더 알아보기</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/">홈으로</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO path="/onboarding" />

      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center md:px-8 md:py-24">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
          <Sparkles className="h-8 w-8" aria-hidden="true" />
        </span>
        <EyebrowLabel className="mt-6">처음 오셨나요?</EyebrowLabel>
        <h1 className="mt-3 text-2xl font-bold text-foreground md:text-[32px]">처음 오셨나요?</h1>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
          간단히 알려주시면, 편안하게 안내해 드릴게요. 맞춤 안내를 위해 이름, 연락처, 성별,
          출생연도와 생활지역을 확인합니다.
        </p>

        {showEduBanner ? (
          <div
            className={cn(
              "mt-6 flex w-full max-w-md items-center gap-3 rounded-2xl border p-4 text-left",
              eduCompleted
                ? "border-primary/40 bg-primary-soft/30"
                : "border-border bg-muted/60",
            )}
          >
            <GraduationCap className="h-5 w-5 shrink-0 text-primary-deep" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              {eduCompleted ? (
                <>
                  축복교육 {courseIds.length}강좌를 모두 들으셨네요.{" "}
                  <Badge variant="success" className="align-middle">
                    이수 완료
                  </Badge>{" "}
                  이수 내역을 담당자에게 함께 전달해드릴게요.
                </>
              ) : (
                <>축복교육 {completedIds.length}강좌를 들으셨어요. 이수 내역을 함께 전달해드릴게요.</>
              )}
            </p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} noValidate className="mt-10 w-full max-w-md space-y-5 text-left">
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

          <div>
            <span className="text-sm font-medium text-foreground">성별</span>
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
            {errors.gender ? <p className="mt-1.5 text-xs text-destructive">{errors.gender}</p> : null}
          </div>

          <label className="block">
            <span className="text-sm font-medium text-foreground">출생년도</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="예: 1990"
              value={form.birthYear}
              onChange={(e) => updateField("birthYear", e.target.value)}
              className={cn(inputClass, "mt-1.5")}
            />
            {errors.birthYear ? (
              <p className="mt-1.5 text-xs text-destructive">{errors.birthYear}</p>
            ) : null}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-foreground">시·도</span>
              <input
                type="text"
                placeholder="예: 서울"
                value={form.regionSido}
                onChange={(e) => updateField("regionSido", e.target.value)}
                className={cn(inputClass, "mt-1.5")}
              />
              {errors.regionSido ? (
                <p className="mt-1.5 text-xs text-destructive">{errors.regionSido}</p>
              ) : null}
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">시·군·구</span>
              <input
                type="text"
                placeholder="예: 강남구"
                value={form.regionSigungu}
                onChange={(e) => updateField("regionSigungu", e.target.value)}
                className={cn(inputClass, "mt-1.5")}
              />
              {errors.regionSigungu ? (
                <p className="mt-1.5 text-xs text-destructive">{errors.regionSigungu}</p>
              ) : null}
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-foreground">이름</span>
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={cn(inputClass, "mt-1.5")}
            />
            {errors.name ? <p className="mt-1.5 text-xs text-destructive">{errors.name}</p> : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">휴대전화 번호</span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => updateField("phone", formatPhoneInput(e.target.value))}
              className={cn(inputClass, "mt-1.5")}
            />
            {errors.phone ? <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p> : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">
              이메일 <span className="font-normal text-muted-foreground">(선택)</span>
            </span>
            <input
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={cn(inputClass, "mt-1.5")}
            />
            {errors.email ? <p className="mt-1.5 text-xs text-destructive">{errors.email}</p> : null}
          </label>

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
          {errors.privacyAgreed ? (
            <p className="-mt-3 text-xs text-destructive">{errors.privacyAgreed}</p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "접수하는 중…" : "안내 신청하기"}
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

        <Link to="/guide" className="mt-10 text-sm font-medium text-primary-deep hover:underline">
          축복결혼 더 알아보기 →
        </Link>
      </section>
    </>
  );
}
