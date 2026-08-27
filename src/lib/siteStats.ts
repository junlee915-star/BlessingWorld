// 홈 수치 섹션 데이터 접근 계층 — 6축 개편 §4.1.
// 원칙: **기준일(basisDate)이 없으면 노출하지 않습니다.** 추정치·플레이스홀더 숫자를
// 홈에 띄우지 않기 위한 장치이니 이 규칙을 우회하지 마세요.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export interface SiteStat {
  key: string;
  label: string;
  value: number | null;
  /** YYYY-MM-DD. null이면 화면에서 제외됩니다. */
  basisDate: string | null;
  unit: string;
  displayOrder: number;
}

const LOCAL_STORAGE_KEY = "blessingworld:site-stats";

/** 지표의 '자리'만 정의합니다 — 값은 협회 확정치를 관리자가 입력합니다. */
export const DEFAULT_SITE_STATS: SiteStat[] = [
  { key: "blessed_families", label: "누적 축복가정", value: null, basisDate: null, unit: "가정", displayOrder: 1 },
  {
    key: "yearly_ceremony_families",
    label: "올해 축복식 참여 가정",
    value: null,
    basisDate: null,
    unit: "가정",
    displayOrder: 2,
  },
  { key: "course_completions", label: "사랑의 기술 이수자", value: null, basisDate: null, unit: "명", displayOrder: 3 },
];

export type SiteStatsPersistTarget = "supabase" | "local";

function readLocalOverride(): SiteStat[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SiteStat[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function sortStats(stats: SiteStat[]): SiteStat[] {
  return [...stats].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function fetchSiteStats(): Promise<SiteStat[]> {
  if (isSupabaseConfigured && supabase) {
    // §lib/courseCompletions.ts 주석 참고 — select() 결과가 `never`로 좁혀지는 라이브러리
    // 타입 버그 우회.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회
    const { data, error } = await (supabase.from("site_stats") as any)
      .select("*")
      .order("display_order", { ascending: true });
    if (!error && data && data.length > 0) {
      return (
        data as {
          key: string;
          label: string;
          value: number | null;
          basis_date: string | null;
          unit: string | null;
          display_order: number;
        }[]
      ).map((row) => ({
        key: row.key,
        label: row.label,
        value: row.value,
        basisDate: row.basis_date,
        unit: row.unit ?? "",
        displayOrder: row.display_order,
      }));
    }
  }
  return sortStats(readLocalOverride() ?? DEFAULT_SITE_STATS);
}

/** 홈에 실제로 노출할 지표만 걸러냅니다 — 값과 기준일이 모두 있어야 합니다. */
export function publishableStats(stats: SiteStat[]): SiteStat[] {
  return sortStats(stats.filter((stat) => stat.value !== null && Boolean(stat.basisDate)));
}

export async function saveSiteStats(stats: SiteStat[]): Promise<SiteStatsPersistTarget> {
  if (isSupabaseConfigured && supabase) {
    const rows = stats.map((stat) => ({
      key: stat.key,
      label: stat.label,
      value: stat.value,
      basis_date: stat.basisDate,
      unit: stat.unit,
      display_order: stat.displayOrder,
    }));
    // §lib/courses.ts saveCourses() 주석 참고 — upsert() 타입 버그 우회.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회
    const { error } = await (supabase.from("site_stats") as any).upsert(rows);
    if (!error) return "supabase";
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // 저장 불가 환경은 무시합니다.
    }
  }
  return "local";
}

/** 기준일 표기 — "2026.8.24 기준"(듀오 §1.3 규칙). */
export function formatBasisDate(basisDate: string): string {
  const date = new Date(basisDate);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} 기준`;
}
