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

  const [{ data: profiles, error }, completions] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, email, role, created_at")
      .order("created_at", { ascending: false }),
    fetchAllMemberCompletions(),
  ]);

  if (error || !profiles) return [];

  return profiles.map((row) => ({
    id: row.id,
    displayName: row.display_name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    completedCourseIds: completions[row.id] ?? [],
  }));
}
