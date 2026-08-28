// 안내 신청(온보딩 폼, §P-07) 제출 로직. §src/lib/courses.ts / churches.ts와 달리
// 이 데이터는 로컬 대체 저장이 의미가 없습니다(관리 화면에서 다시 읽어올 방법이 없는
// 리드 데이터라서) — Supabase가 연결되지 않았다면 실패로 보고하고, 화면에서 전화
// 문의로 안내하세요.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { ConsultMethod, Gender } from "@/integrations/supabase/types";
import type { ValuesAssessmentResult } from "@/content/valuesAssessment";

export interface GuidanceRequestPayload {
  name: string;
  phone: string;
  email?: string;
  gender: Gender;
  birthYear: number;
  regionSido: string;
  regionSigungu: string;
  /** URL의 ref 파라미터 등 유입 경로. 비우면 Supabase 기본값('web')이 적용됩니다. */
  source?: string;
  /** §P-04 이수 완료 강좌 id 목록(§src/lib/courses.ts getCompletedCourses()). */
  completedCourses: string[];
  /** 희망 상담 방식(6축 개편 §4.6) — 일정 예약 대신 방식만 받습니다. */
  consultMethod: ConsultMethod;
  /** 가치관 진단 12문항(§content/valuesAssessment.ts) 결과 — 신청자가 첨부를 선택했을 때만 전달됩니다. */
  valuesAssessment?: ValuesAssessmentResult;
}

export type GuidanceSubmitResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "duplicate_phone" | "rate_limited" | "error" };

const RATE_LIMIT_STORAGE_KEY = "blessingworld:onboarding:submit-attempts";
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1시간
const RATE_LIMIT_MAX_ATTEMPTS = 3;

/**
 * §P-07 "스팸 방지: honeypot + 제출 rate limit (IP당 시간당 3회)" 중 rate limit 쪽의
 * 최선 노력(best-effort) 근사치입니다. 진짜 IP 기준 제한은 요청 IP를 볼 수 있는
 * 서버(엣지 함수)가 필요한데 이 마일스톤 범위 밖이라, 대신 "이 브라우저에서 최근
 * 1시간 내 제출 시도"를 localStorage로 세어 같은 효과를 냅니다. 시크릿 모드나 다른
 * 기기로는 우회되지만, 폼을 반복 새로고침하는 단순 스팸은 막아줍니다.
 */
function isClientRateLimited(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const attempts: number[] = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
    return attempts.filter((ts) => ts > cutoff).length >= RATE_LIMIT_MAX_ATTEMPTS;
  } catch {
    return false;
  }
}

function recordClientSubmitAttempt(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const attempts: number[] = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
    const next = [...attempts.filter((ts) => ts > cutoff), Date.now()];
    window.localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 프라이빗 모드 등으로 저장 공간을 쓸 수 없는 경우 조용히 무시합니다 — 최선 노력 제한이라 실패해도 제출은 계속 진행합니다.
  }
}

/** Supabase `guidance_requests`에 안내 신청을 insert합니다. */
export async function submitGuidanceRequest(
  payload: GuidanceRequestPayload,
): Promise<GuidanceSubmitResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, reason: "not_configured" };
  }

  if (isClientRateLimited()) {
    return { ok: false, reason: "rate_limited" };
  }

  const row = {
    name: payload.name,
    phone: payload.phone,
    email: payload.email && payload.email.length > 0 ? payload.email : undefined,
    gender: payload.gender,
    birth_year: payload.birthYear,
    region_sido: payload.regionSido,
    region_sigungu: payload.regionSigungu,
    privacy_agreed_at: new Date().toISOString(),
    source: payload.source ?? "web",
    completed_courses: payload.completedCourses.length > 0 ? payload.completedCourses : undefined,
    consult_method: payload.consultMethod,
    values_assessment: payload.valuesAssessment ?? undefined,
  };

  recordClientSubmitAttempt();

  // 설치된 @supabase/supabase-js(2.112.x)의 insert() 타입이 이 프로젝트의 손으로 쓴
  // Database 타입과 맞물리면 Insert 타입을 `never`로 좁혀버리는 라이브러리 쪽 타입 버그가
  // 있습니다(§src/lib/courses.ts saveCourses()와 동일 사안). 실제 요청은 정상 동작하므로
  // 이 한 줄만 우회합니다.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, 위 주석 참고
  const { error } = await (supabase.from("guidance_requests") as any).insert(row);

  if (error) {
    // §supabase/migrations/0008_guidance_dedupe.sql의 트리거가 24시간 내 동일 전화번호
    // 재신청을 이 메시지로 거부합니다. 문구를 바꾸면 여기도 함께 바꿔야 합니다.
    if (error.message?.includes("duplicate_phone_24h")) {
      return { ok: false, reason: "duplicate_phone" };
    }
    console.error("[guidance] 안내 신청 제출 실패", error);
    return { ok: false, reason: "error" };
  }
  return { ok: true };
}
