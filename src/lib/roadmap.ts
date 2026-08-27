// 로드맵 단계 데이터 접근 계층 — §lib/courses.ts와 같은 패턴(Supabase 우선 → localStorage
// → content/roadmap.ts 기본값). 관리자(/admin/roadmap)가 문구·기간을 고쳐도 코드 배포가
// 필요 없도록 분리했습니다.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { DEFAULT_ROADMAP_STEPS, type RoadmapStep } from "@/content/roadmap";

const LOCAL_STORAGE_KEY = "blessingworld:roadmap-steps";

export type RoadmapPersistTarget = "supabase" | "local";

function readLocalOverride(): RoadmapStep[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RoadmapStep[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalOverride(steps: RoadmapStep[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(steps));
  } catch {
    // 프라이빗 모드 등 저장 불가 환경은 조용히 무시합니다.
  }
}

function rowToStep(row: {
  key: string;
  order_no: number;
  title: string;
  description: string;
  duration_label: string | null;
  link_to: string | null;
  link_label: string | null;
}): RoadmapStep {
  return {
    key: row.key,
    no: String(row.order_no).padStart(2, "0"),
    title: row.title,
    description: row.description,
    durationLabel: row.duration_label ?? undefined,
    to: row.link_to && row.link_label ? { label: row.link_label, href: row.link_to } : undefined,
    waiting: DEFAULT_ROADMAP_STEPS.find((step) => step.key === row.key)?.waiting,
  };
}

function stepToRow(step: RoadmapStep, index: number) {
  return {
    key: step.key,
    order_no: index + 1,
    title: step.title,
    description: step.description,
    duration_label: step.durationLabel ?? null,
    link_to: step.to?.href ?? null,
    link_label: step.to?.label ?? null,
    is_published: true,
  };
}

export async function fetchRoadmapSteps(): Promise<RoadmapStep[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("roadmap_steps")
      .select("*")
      .order("order_no", { ascending: true });
    if (!error && data && data.length > 0) {
      return data.map(rowToStep);
    }
  }
  return readLocalOverride() ?? DEFAULT_ROADMAP_STEPS;
}

export async function saveRoadmapSteps(steps: RoadmapStep[]): Promise<RoadmapPersistTarget> {
  if (isSupabaseConfigured && supabase) {
    const rows = steps.map(stepToRow);
    // §lib/courses.ts saveCourses() 주석 참고 — upsert() 타입 버그 우회.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회
    const { error } = await (supabase.from("roadmap_steps") as any).upsert(rows);
    if (!error) return "supabase";
  }
  writeLocalOverride(steps);
  return "local";
}
