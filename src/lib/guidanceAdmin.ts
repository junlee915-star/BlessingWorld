// 신청 관리(/admin/guidance, §8.4) 전용 데이터 접근 계층. §lib/guidance.ts(공개 제출 폼)와
// 달리 이 데이터는 로컬 대체 저장이 의미가 없습니다 — 실제 리드 데이터라서 Supabase가
// 연결되지 않으면 그냥 빈 목록을 보여줍니다(다른 admin 화면처럼 로컬에 "임시 관리"할
// 대상이 아닙니다).
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { ConsultMethod, Gender, GuidanceStatus } from "@/integrations/supabase/types";

export interface GuidanceRequestRow {
  id: string;
  /** 로그인 상태로 신청한 경우에만 채워집니다. 로드맵 단계 기록(blessing_progress)의 키입니다. */
  userId: string | null;
  name: string;
  phone: string;
  email: string | null;
  gender: Gender;
  birthYear: number;
  regionSido: string;
  regionSigungu: string;
  status: GuidanceStatus;
  assignedStaffId: string | null;
  assignedAt: string | null;
  contactedAt: string | null;
  closedAt: string | null;
  memo: string | null;
  source: string;
  purgeAfter: string | null;
  createdAt: string;
  completedCourses: string[] | null;
  consultMethod: ConsultMethod | null;
}

export interface StaffOption {
  id: string;
  displayName: string;
  email: string | null;
}

function rowFromDb(row: {
  id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  gender: Gender;
  birth_year: number;
  region_sido: string;
  region_sigungu: string;
  status: GuidanceStatus;
  assigned_staff_id: string | null;
  assigned_at: string | null;
  contacted_at: string | null;
  closed_at: string | null;
  memo: string | null;
  source: string;
  purge_after: string | null;
  created_at: string;
  completed_courses: string[] | null;
  consult_method: ConsultMethod | null;
}): GuidanceRequestRow {
  return {
    id: row.id,
    userId: row.user_id ?? null,
    name: row.name,
    phone: row.phone,
    email: row.email,
    gender: row.gender,
    birthYear: row.birth_year,
    regionSido: row.region_sido,
    regionSigungu: row.region_sigungu,
    status: row.status,
    assignedStaffId: row.assigned_staff_id,
    assignedAt: row.assigned_at,
    contactedAt: row.contacted_at,
    closedAt: row.closed_at,
    memo: row.memo,
    source: row.source,
    purgeAfter: row.purge_after,
    createdAt: row.created_at,
    completedCourses: row.completed_courses,
    consultMethod: row.consult_method ?? null,
  };
}

/** staff/admin만 호출해야 뜻이 있습니다 — RLS("owner or staff can read guidance request")가
 *  본인 신청이 아닌 한 staff/admin에게만 전체 조회를 허용합니다. */
export async function fetchGuidanceRequests(): Promise<GuidanceRequestRow[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from("guidance_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[guidanceAdmin] 신청 목록 조회 실패", error);
    return [];
  }
  return data.map(rowFromDb);
}

/** "담당자 배정" 드롭다운에 쓸 staff/admin 목록. */
export async function fetchStaffOptions(): Promise<StaffOption[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  // §lib/members.ts fetchMembersWithCompletion()과 같은 이유(설치된 supabase-js 타입 버그)로
  // select() 결과를 수동으로 캐스트합니다.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, 위 주석 참고
  const { data, error } = await (supabase.from("profiles") as any)
    .select("id, display_name, email, role")
    .in("role", ["staff", "admin"])
    .order("display_name", { ascending: true });

  if (error || !data) return [];
  return (data as { id: string; display_name: string; email: string | null }[]).map((row) => ({
    id: row.id,
    displayName: row.display_name,
    email: row.email,
  }));
}

export interface GuidanceRequestPatch {
  status?: GuidanceStatus;
  assignedStaffId?: string | null;
  memo?: string | null;
}

/**
 * 한 건을 수정합니다. status를 바꾸면 assigned_at/contacted_at/closed_at·purge_after는
 * §supabase/migrations/0011_guidance_admin.sql 트리거가 서버에서 채우므로, 여기서는
 * 그 결과를 다시 select해 돌려줍니다(화면에 바로 반영하기 위함).
 */
export async function updateGuidanceRequest(
  id: string,
  patch: GuidanceRequestPatch,
): Promise<GuidanceRequestRow | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.assignedStaffId !== undefined) row.assigned_staff_id = patch.assignedStaffId;
  if (patch.memo !== undefined) row.memo = patch.memo;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- §lib/courses.ts와 같은 라이브러리 타입 버그 우회
  const { data, error } = await (supabase.from("guidance_requests") as any)
    .update(row)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    console.error("[guidanceAdmin] 신청 수정 실패", error);
    return null;
  }
  return rowFromDb(data);
}
