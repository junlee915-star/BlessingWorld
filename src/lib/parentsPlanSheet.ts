// 매칭플랜 시트 저장소 — §14 개선안 P-12 ②, AC-26.
// 다른 lib/*.ts 파일과 달리 의도적으로 Supabase 계층이 없습니다. 개인정보를 수집하지 않는
// 도구로 유지하기 위해(AC-26) 이 시트의 답은 방문자의 기기에만 저장하고 어디로도
// 전송하지 않습니다.
const STORAGE_KEY = "blessingworld:parents-plan-sheet";

export type PlanSheetAnswers = Record<string, { parent: string; child: string }>;

export function getPlanSheetAnswers(): PlanSheetAnswers {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as PlanSheetAnswers) : {};
  } catch {
    return {};
  }
}

export function savePlanSheetAnswers(answers: PlanSheetAnswers): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // 저장 불가 환경(예: 프라이빗 모드)은 무시 — 입력 자체는 계속 가능합니다.
  }
}

export function clearPlanSheetAnswers(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장 불가 환경은 무시.
  }
}
