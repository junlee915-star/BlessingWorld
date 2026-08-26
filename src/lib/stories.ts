// 스토리(행복의 꽃) 데이터 접근 계층 — §lib/churches.ts / courses.ts와 같은 패턴
// (Supabase 우선, localStorage 대체). 조회수(view_count) 증가는 이번 마일스톤 범위에
// 넣지 않았습니다 — 익명 방문자가 안전하게 view_count만 올리려면 RLS를 우회하는
// SECURITY DEFINER RPC 함수가 필요한데, 이 프로젝트의 Database 타입은 아직 함수를
// 전혀 쓰지 않는 전제로 손으로 작성되어 있어(§src/integrations/supabase/types.ts
// Functions: Record<string, never> 주석 참고) 섣불리 건드리면 다른 .from() 호출들의
// 타입이 함께 깨질 위험이 있습니다. "조회 많은순" 정렬 자체는 관리자가 채워 넣은
// view_count 값으로 동작하니, 실제 증가 로직은 후속 작업으로 남겨둡니다.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { DEFAULT_STORIES, type Story } from "@/content/stories";
import type { StoryCategory } from "@/integrations/supabase/types";

const LOCAL_STORAGE_KEY = "blessingworld:stories";

export type StoryPersistTarget = "supabase" | "local";

function readLocalOverride(): Story[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Story[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalOverride(stories: Story[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stories));
  } catch {
    // 프라이빗 모드 등으로 저장 공간을 쓸 수 없는 경우 조용히 무시합니다.
  }
}

function rowToStory(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  category: StoryCategory;
  family_name: string | null;
  region: string | null;
  view_count: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}): Story {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body: row.body ?? "",
    coverImageUrl: row.cover_image_url ?? "",
    category: row.category,
    familyName: row.family_name ?? "",
    region: row.region ?? "",
    viewCount: row.view_count,
    isPublished: row.is_published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

function storyToRow(story: Story) {
  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    excerpt: story.excerpt,
    body: story.body,
    cover_image_url: story.coverImageUrl,
    category: story.category,
    family_name: story.familyName,
    region: story.region,
    view_count: story.viewCount,
    is_published: story.isPublished,
    published_at: story.publishedAt,
    created_at: story.createdAt,
  };
}

function sortByPublishedDesc(stories: Story[]): Story[] {
  return [...stories].sort((a, b) => {
    const aTime = new Date(a.publishedAt ?? a.createdAt).getTime();
    const bTime = new Date(b.publishedAt ?? b.createdAt).getTime();
    return bTime - aTime;
  });
}

/**
 * 공개 페이지(/stories, /stories/:slug)에서 씁니다 — 게시된 스토리만, 최신순으로
 * 돌려줍니다. `/stories`의 "조회 많은순" 정렬과 `/stories/:slug`의 이전/다음 이동은
 * 이 배열의 순서를 기준으로 클라이언트에서 다시 계산합니다.
 */
export async function fetchPublishedStories(): Promise<Story[]> {
  const all = await fetchAllStories();
  return sortByPublishedDesc(all.filter((story) => story.isPublished));
}

/** 관리 화면(/admin/stories)에서 씁니다 — 비공개(초안) 글도 함께 돌려줍니다. */
export async function fetchAllStories(): Promise<Story[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map(rowToStory);
    }
  }
  return readLocalOverride() ?? DEFAULT_STORIES;
}

/**
 * 스토리 목록 전체를 저장합니다. Supabase가 연결돼 있으면 upsert하고(로컬에서 지운 글은
 * 삭제), 아니면 이 브라우저의 localStorage에만 저장합니다. §lib/churches.ts saveChurches()와
 * 동일한 패턴입니다.
 */
export async function saveStories(stories: Story[]): Promise<StoryPersistTarget> {
  if (isSupabaseConfigured && supabase) {
    const rows = stories.map(storyToRow);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- §lib/courses.ts와 같은 라이브러리 타입 버그 우회
    const { error: upsertError } = await (supabase.from("stories") as any).upsert(rows);
    const ids = stories.map((story) => story.id);
    const { error: deleteError } =
      ids.length > 0
        ? await supabase.from("stories").delete().not("id", "in", `(${ids.join(",")})`)
        : { error: null };
    if (!upsertError && !deleteError) {
      return "supabase";
    }
  }
  writeLocalOverride(stories);
  return "local";
}
