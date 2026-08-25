// 안내 신청(온보딩 폼, §P-07) 제출 로직. §src/lib/courses.ts / churches.ts와 달리
// 이 데이터는 로컬 대체 저장이 의미가 없습니다(관리 화면에서 다시 읽어올 방법이 없는
// 리드 데이터라서) — Supabase가 연결되지 않았다면 실패로 보고하고, 화면에서 전화
// 문의로 안내하세요.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Gender } from "@/integrations/supabase/types";

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
}

export type GuidanceSubmitResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "error" };

/** Supabase `guidance_requests`에 안내 신청을 insert합니다. */
export async function submitGuidanceRequest(
  payload: GuidanceRequestPayload,
): Promise<GuidanceSubmitResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, reason: "not_configured" };
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
  };

  // 설치된 @supabase/supabase-js(2.112.x)의 insert() 타입이 이 프로젝트의 손으로 쓴
  // Database 타입과 맞물리면 Insert 타입을 `never`로 좁혀버리는 라이브러리 쪽 타입 버그가
  // 있습니다(§src/lib/courses.ts saveCourses()와 동일 사안). 실제 요청은 정상 동작하므로
  // 이 한 줄만 우회합니다.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, 위 주석 참고
  const { error } = await (supabase.from("guidance_requests") as any).insert(row);

  if (error) {
    console.error("[guidance] 안내 신청 제출 실패", error);
    return { ok: false, reason: "error" };
  }
  return { ok: true };
}
