// 공지 데이터 접근 계층 — §lib/events.ts와 같은 패턴(Supabase 우선, localStorage 대체).
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { DEFAULT_NOTICES, type Notice } from "@/content/notices";
import type { Database } from "@/integrations/supabase/types";

const LOCAL_STORAGE_KEY = "blessingworld:notices";

export type NoticePersistTarget = "supabase" | "local";

type NoticeRow = Database["public"]["Tables"]["notices"]["Row"];

function readLocalOverride(): Notice[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Notice[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalOverride(notices: Notice[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notices));
  } catch {
    // 프라이빗 모드 등으로 저장 공간을 쓸 수 없는 경우 조용히 무시합니다.
  }
}

function rowToNotice(row: NoticeRow): Notice {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    level: row.level,
    startsAt: row.starts_at ?? undefined,
    endsAt: row.ends_at ?? undefined,
    isPublished: row.is_published,
    createdAt: row.created_at,
  };
}

function noticeToRow(notice: Notice): NoticeRow {
  return {
    id: notice.id,
    title: notice.title,
    body: notice.body,
    level: notice.level,
    starts_at: notice.startsAt ?? null,
    ends_at: notice.endsAt ?? null,
    is_published: notice.isPublished,
    created_at: notice.createdAt,
  };
}

function sortByCreatedAtDesc(notices: Notice[]): Notice[] {
  return [...notices].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** 지금 시각 기준으로 게시 기간 안에 있는지 — §content/notices.ts 참고(기간 없으면 항상 게시 중). */
export function isNoticeActive(notice: Notice, now: Date = new Date()): boolean {
  if (!notice.isPublished) return false;
  if (notice.startsAt && new Date(notice.startsAt) > now) return false;
  if (notice.endsAt && new Date(notice.endsAt) < now) return false;
  return true;
}

/** 공개 페이지·홈 슬롯에서 씁니다 — 게시된 공지만 최신순으로 돌려줍니다. */
export async function fetchPublishedNotices(): Promise<Notice[]> {
  const all = await fetchAllNotices();
  return sortByCreatedAtDesc(all.filter((notice) => notice.isPublished));
}

/** 관리 화면(/admin/notices)에서 씁니다 — 비공개 항목도 함께 돌려줍니다. */
export async function fetchAllNotices(): Promise<Notice[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return sortByCreatedAtDesc((data as NoticeRow[]).map(rowToNotice));
    }
  }
  return sortByCreatedAtDesc(readLocalOverride() ?? DEFAULT_NOTICES);
}

export async function saveNotices(notices: Notice[]): Promise<NoticePersistTarget> {
  if (isSupabaseConfigured && supabase) {
    const rows = notices.map(noticeToRow);
    // §lib/courses.ts saveCourses() 주석 참고 — upsert() 타입 버그 우회.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회
    const { error: upsertError } = await (supabase.from("notices") as any).upsert(rows);
    const ids = notices.map((notice) => notice.id);
    const { error: deleteError } =
      ids.length > 0
        ? await supabase.from("notices").delete().not("id", "in", `(${ids.join(",")})`)
        : { error: null };
    if (!upsertError && !deleteError) {
      return "supabase";
    }
  }
  writeLocalOverride(notices);
  return "local";
}
