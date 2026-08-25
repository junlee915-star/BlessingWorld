// §/admin/members 전용 — 전체 회원 목록 + 각자의 강좌 이수 현황을 묶어서 돌려줍니다.
// profiles 조회는 RLS("self or staff can read profile")가 staff/admin에게만 전체 행을
// 허용하므로, 이 함수는 RequireAdmin으로 보호된 화면에서만 의미 있는 값을 돌려줍니다.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { fetchAllMemberCompletions } from "@/lib/courseCompletions";
import type { ProfileRole } from "@/integrations/supabase/types";

export interface MemberRow {
  id: string;
  displayName: string;
  email: string | null;
  role: ProfileRole;
  createdAt: string;
  completedCourseIds: string[];
}

export async function fetchMembersWithCompletion(): Promise<MemberRow[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  // 설치된 @supabase/supabase-js(2.112.x)의 select() 타입이 이 프로젝트의 손으로 쓴
  // Database 타입과 맞물리면(profiles select("*")도 포함) 결과 타입을 `never`로 좁혀버리는
  // 라이브러리 쪽 타입 버그가 있습니다 — §src/lib/auth.tsx가 profiles를 읽을 때 쓰는 것과
  // 같은 우회(수동 캐스트)를 씁니다. 실제 요청은 정상 동작합니다.
  const [{ data: profiles, error }, completions] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, 위 주석 참고
    (supabase.from("profiles") as any).select("*").order("created_at", { ascending: false }),
    fetchAllMemberCompletions(),
  ]);

  if (error || !profiles) return [];

  const rows = profiles as {
    id: string;
    display_name: string;
    email: string | null;
    role: ProfileRole;
    created_at: string;
  }[];

  return rows.map((row) => ({
    id: row.id,
    displayName: row.display_name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    completedCourseIds: completions[row.id] ?? [],
  }));
}
