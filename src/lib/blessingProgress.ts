// 로드맵 진행 상태 — "지금 여기" 표시용.
// 로그인 + Supabase 연결 시에는 담당자가 관리자 화면에서 갱신하는 `blessing_progress`를
// 읽고, 그렇지 않으면 방문자가 직접 고른 값(localStorage)을 씁니다. 둘 다 없으면 표시하지
// 않습니다 — 임의로 "1단계"라고 단정하지 않습니다.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { BlessingStepStatus } from "@/integrations/supabase/types";

const LOCAL_STORAGE_KEY = "blessingworld:roadmap-current-step";

export type ProgressMap = Record<string, BlessingStepStatus>;

export function getLocalCurrentStep(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LOCAL_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setLocalCurrentStep(stepKey: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (stepKey) window.localStorage.setItem(LOCAL_STORAGE_KEY, stepKey);
    else window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // 저장 불가 환경은 무시 — 표시만 못 할 뿐 기능은 정상입니다.
  }
}

/** 로그인 사용자의 단계별 상태. 미연결·미로그인·실패 시 빈 객체를 돌려줍니다. */
export async function fetchMyProgress(userId: string | undefined): Promise<ProgressMap> {
  if (!userId || !isSupabaseConfigured || !supabase) return {};
  // 설치된 @supabase/supabase-js의 select() 타입이 이 프로젝트의 손으로 쓴 Database 타입과
  // 맞물리면 결과를 `never`로 좁혀버립니다(§lib/courseCompletions.ts 주석과 같은 사안).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회
  const { data, error } = await (supabase.from("blessing_progress") as any)
    .select("step_key, status")
    .eq("user_id", userId);
  if (error || !data) return {};
  return Object.fromEntries(
    (data as { step_key: string; status: BlessingStepStatus }[]).map((row) => [
      row.step_key,
      row.status,
    ]),
  ) as ProgressMap;
}

/** 관리자 화면에서 특정 회원의 단계 상태를 바꿉니다. */
export async function setProgress(
  userId: string,
  stepKey: string,
  status: BlessingStepStatus,
  updatedBy: string | null,
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const row = {
    user_id: userId,
    step_key: stepKey,
    status,
    completed_at: status === "completed" ? new Date().toISOString() : null,
    updated_by: updatedBy,
  };
  // §lib/courses.ts saveCourses() 주석 참고 — upsert() 타입 버그 우회.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회
  const { error } = await (supabase.from("blessing_progress") as any).upsert(row, {
    onConflict: "user_id,step_key",
  });
  return !error;
}

/**
 * 진행 상태 맵에서 "지금 여기"에 해당하는 단계 키를 고릅니다.
 * in_progress가 있으면 그것, 없으면 completed 다음 단계, 둘 다 없으면 null.
 */
export function deriveCurrentStep(progress: ProgressMap, orderedKeys: string[]): string | null {
  const inProgress = orderedKeys.find((key) => progress[key] === "in_progress");
  if (inProgress) return inProgress;
  const lastCompletedIndex = orderedKeys.reduce(
    (acc, key, index) => (progress[key] === "completed" ? index : acc),
    -1,
  );
  if (lastCompletedIndex < 0) return null;
  return orderedKeys[lastCompletedIndex + 1] ?? orderedKeys[lastCompletedIndex];
}
