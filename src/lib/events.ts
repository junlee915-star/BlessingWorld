// 일정 데이터 접근 계층 — §lib/churches.ts와 같은 패턴(Supabase 우선, localStorage 대체).
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { DEFAULT_EVENTS, type BlessingEvent } from "@/content/events";
import type { Database } from "@/integrations/supabase/types";

const LOCAL_STORAGE_KEY = "blessingworld:events";

export type EventPersistTarget = "supabase" | "local";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

function readLocalOverride(): BlessingEvent[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BlessingEvent[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalOverride(events: BlessingEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // 프라이빗 모드 등으로 저장 공간을 쓸 수 없는 경우 조용히 무시합니다.
  }
}

function rowToEvent(row: EventRow): BlessingEvent {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    format: row.format ?? undefined,
    venue: row.venue ?? undefined,
    audience: row.audience ?? undefined,
    fee: row.fee ?? undefined,
    applyDeadline: row.apply_deadline ?? undefined,
    paymentDeadline: row.payment_deadline ?? undefined,
    applyMethod: row.apply_method ?? undefined,
    host: row.host ?? undefined,
    contact: row.contact ?? undefined,
    sourceNote: row.source_note ?? undefined,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

function eventToRow(event: BlessingEvent): EventRow {
  return {
    id: event.id,
    category: event.category,
    title: event.title,
    starts_at: event.startsAt,
    ends_at: event.endsAt ?? null,
    format: event.format ?? null,
    venue: event.venue ?? null,
    audience: event.audience ?? null,
    fee: event.fee ?? null,
    apply_deadline: event.applyDeadline ?? null,
    payment_deadline: event.paymentDeadline ?? null,
    apply_method: event.applyMethod ?? null,
    host: event.host ?? null,
    contact: event.contact ?? null,
    source_note: event.sourceNote ?? null,
    is_published: event.isPublished,
    // 저장할 때마다 항상 지금 시각으로 갱신 — 화면 상단 "○○ 기준 갱신"이 이 값의 최댓값을 씁니다.
    updated_at: new Date().toISOString(),
  };
}

function sortByStartsAt(events: BlessingEvent[]): BlessingEvent[] {
  return [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/** 공개 페이지(/schedules)에서 씁니다 — 게시된 일정만 시작일순으로 돌려줍니다. */
export async function fetchPublishedEvents(): Promise<BlessingEvent[]> {
  const all = await fetchAllEvents();
  return sortByStartsAt(all.filter((event) => event.isPublished));
}

/** 관리 화면(/admin/events)에서 씁니다 — 비공개 항목도 함께 돌려줍니다. */
export async function fetchAllEvents(): Promise<BlessingEvent[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("starts_at", { ascending: true });
    if (!error && data) {
      return sortByStartsAt((data as EventRow[]).map(rowToEvent));
    }
  }
  return sortByStartsAt(readLocalOverride() ?? DEFAULT_EVENTS);
}

export async function saveEvents(events: BlessingEvent[]): Promise<EventPersistTarget> {
  if (isSupabaseConfigured && supabase) {
    const rows = events.map(eventToRow);
    // §lib/courses.ts saveCourses() 주석 참고 — upsert() 타입 버그 우회.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회
    const { error: upsertError } = await (supabase.from("events") as any).upsert(rows);
    const ids = events.map((event) => event.id);
    const { error: deleteError } =
      ids.length > 0
        ? await supabase.from("events").delete().not("id", "in", `(${ids.join(",")})`)
        : { error: null };
    if (!upsertError && !deleteError) {
      return "supabase";
    }
  }
  writeLocalOverride(events);
  return "local";
}
