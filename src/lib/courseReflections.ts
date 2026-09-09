// 사랑의 기술 강좌 "느낀 점"(course_reflections 테이블) 접근 계층.
// course_completions(§src/lib/courseCompletions.ts)와 같은 구조입니다 — 로그인한 회원의
// 소감만 계정(서버)에 남아 기기 간 동기화되고 /admin/reflections에서 열람됩니다. 비로그인
// 방문자의 소감은 이 브라우저의 localStorage에만 남습니다. Supabase가 연결되지 않았으면
// 서버 관련 함수는 조용히 빈 값/실패를 돌려주고, localStorage 경로만 동작합니다.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

const LOCAL_STORAGE_KEY = "blessingworld:course-reflections";

type LocalMap = Record<string, string>;

function readLocalMap(): LocalMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as LocalMap) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalMap(map: LocalMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // 프라이빗 모드 등으로 저장 공간을 쓸 수 없는 경우 조용히 무시합니다.
  }
}

/** 이 브라우저에 저장된 courseId의 소감(없으면 빈 문자열). */
export function getLocalReflection(courseId: string): string {
  return readLocalMap()[courseId] ?? "";
}

/** 이 브라우저에 courseId의 소감을 저장합니다. 빈 문자열이면 항목을 지웁니다. */
export function saveLocalReflection(courseId: string, body: string): void {
  const map = readLocalMap();
  const trimmed = body.trim();
  if (trimmed) map[courseId] = trimmed;
  else delete map[courseId];
  writeLocalMap(map);
}

/** 로그인한 본인(userId)이 courseId에 남긴 소감. 없거나 Supabase 미연결이면 null. */
export async function fetchReflection(userId: string, courseId: string): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  // 설치된 @supabase/supabase-js의 select() 타입이 이 프로젝트의 손으로 쓴 Database 타입과
  // 맞물리면 결과 타입을 `never`로 좁혀버리는 라이브러리 쪽 버그가 있습니다
  // (§src/lib/courseCompletions.ts와 같은 사안). 실제 요청은 정상 동작합니다.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, 위 주석 참고
  const { data, error } = await (supabase.from("course_reflections") as any)
    .select("body")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { body: string }).body ?? null;
}

/**
 * courseId의 소감을 계정에 저장합니다. body가 비어 있으면 기존 소감을 지웁니다.
 * 성공 여부를 돌려줍니다(Supabase 미연결이면 false).
 */
export async function saveReflection(
  userId: string,
  courseId: string,
  body: string,
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const trimmed = body.trim();

  if (!trimmed) {
    const { error } = await supabase
      .from("course_reflections")
      .delete()
      .eq("user_id", userId)
      .eq("course_id", courseId);
    return !error;
  }

  // upsert() 타입이 Insert를 `never`로 좁혀버리는 라이브러리 버그 우회
  // (§src/lib/courses.ts saveCourses()와 동일 사안).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, 위 주석 참고
  const { error } = await (supabase.from("course_reflections") as any).upsert(
    { user_id: userId, course_id: courseId, body: trimmed },
    { onConflict: "user_id,course_id" },
  );
  return !error;
}

export interface ReflectionRow {
  userId: string;
  courseId: string;
  body: string;
  updatedAt: string;
}

/** staff/admin 전용(§/admin/reflections) — 전체 소감을 최신순으로 돌려줍니다. */
export async function fetchAllReflections(): Promise<ReflectionRow[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, fetchReflection() 주석 참고
  const { data, error } = await (supabase.from("course_reflections") as any)
    .select("user_id, course_id, body, updated_at")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return (data as { user_id: string; course_id: string; body: string; updated_at: string }[]).map(
    (row) => ({
      userId: row.user_id,
      courseId: row.course_id,
      body: row.body,
      updatedAt: row.updated_at,
    }),
  );
}
