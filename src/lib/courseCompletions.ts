// 로그인한 회원의 강좌 이수 현황(course_completions 테이블) 접근 계층.
// 비로그인 방문자의 진행 상태는 그대로 §src/lib/courses.ts의 localStorage
// (getCompletedCourses/saveCompletedCourses)에 남습니다 — 이 파일은 로그인한 회원에
// 한해 같은 정보를 계정에도 함께 남겨서, 기기 간 동기화(§/mypage)와 관리자 열람
// (§/admin/members)을 가능하게 합니다. Supabase가 연결되지 않았으면 모든 함수가
// 조용히 빈 값/실패를 돌려줍니다.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

/** 로그인한 본인(userId)이 이수 완료로 표시한 강좌 id 목록. */
export async function fetchCompletedCourseIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  // 설치된 @supabase/supabase-js(2.112.x)의 select() 타입이 이 프로젝트의 손으로 쓴
  // Database 타입과 맞물리면(이 테이블에 한해 select("*")도 포함) 결과 타입을 `never`로
  // 좁혀버리는 라이브러리 쪽 타입 버그가 있습니다(§src/lib/courses.ts saveCourses()의
  // upsert 우회와 같은 원인). 실제 요청은 정상 동작하므로 이 한 줄만 우회합니다.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, 위 주석 참고
  const { data, error } = await (supabase.from("course_completions") as any)
    .select("course_id")
    .eq("user_id", userId);
  if (error || !data) return [];
  return (data as { course_id: string }[]).map((row) => row.course_id);
}

/** courseId의 이수 여부를 계정에 저장(완료)하거나 지웁니다(취소). 성공 여부를 돌려줍니다. */
export async function setCourseCompletion(
  userId: string,
  courseId: string,
  completed: boolean,
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  if (!completed) {
    const { error } = await supabase
      .from("course_completions")
      .delete()
      .eq("user_id", userId)
      .eq("course_id", courseId);
    return !error;
  }

  // 설치된 @supabase/supabase-js(2.112.x)의 upsert() 타입이 이 프로젝트의 손으로 쓴
  // Database 타입과 맞물리면 Insert 타입을 `never`로 좁혀버리는 라이브러리 쪽 타입 버그가
  // 있습니다(§src/lib/courses.ts saveCourses()와 동일 사안). 실제 요청은 정상 동작하므로
  // 이 한 줄만 우회합니다.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, 위 주석 참고
  const { error } = await (supabase.from("course_completions") as any).upsert(
    { user_id: userId, course_id: courseId },
    { onConflict: "user_id,course_id" },
  );
  return !error;
}

/** staff/admin 전용(§/admin/members) — 전체 회원의 이수 현황을 { user_id: course_id[] }로 묶어 돌려줍니다. */
export async function fetchAllMemberCompletions(): Promise<Record<string, string[]>> {
  if (!isSupabaseConfigured || !supabase) return {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, fetchCompletedCourseIds() 주석 참고
  const { data, error } = await (supabase.from("course_completions") as any).select(
    "user_id, course_id",
  );
  if (error || !data) return {};
  const byUser: Record<string, string[]> = {};
  for (const row of data as { user_id: string; course_id: string }[]) {
    (byUser[row.user_id] ??= []).push(row.course_id);
  }
  return byUser;
}
