// 행복의 꽃 `/stories` — §6 P-03
import type { StoryCategory } from "@/integrations/supabase/types";

export const STORIES_HERO = {
  eyebrow: "Our Stories",
  title: "행복의 꽃",
  sub: "서로를 이해하고 함께 성장해 온 축복가정의 진솔한 이야기를 만납니다.",
};

export const STORY_CATEGORIES: { value: "all" | StoryCategory; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "interview", label: "인터뷰" },
  { value: "case", label: "사례" },
  { value: "video", label: "영상" },
];

export const STORY_CATEGORY_LABELS: Record<StoryCategory, string> = {
  interview: "인터뷰",
  case: "사례",
  video: "영상",
};

export const STORY_SORTS: { value: "latest" | "views"; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "views", label: "조회 많은순" },
];

export const STORIES_EMPTY_STATE = {
  title: "첫 번째 이야기를 준비하고 있어요",
  description: "곧 축복가정들의 진솔한 이야기를 만나보실 수 있습니다.",
  cta: { label: "축복결혼 알아보기", to: "/guide" },
};

/** 특정 카테고리를 선택했지만 그 카테고리에 글이 아직 없을 때 쓰는 안내(§EMPTY_STATE와 구분). */
export const STORIES_CATEGORY_EMPTY_STATE = {
  title: "이 카테고리에는 아직 이야기가 없어요",
  description: "다른 카테고리를 선택하시거나, 전체 이야기를 둘러보세요.",
};

export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** 마크다운/리치텍스트 원문(§7.2). 이 프로젝트에는 아직 렌더러가 없어 줄바꿈만 살려 그대로 보여줍니다. */
  body: string;
  coverImageUrl: string;
  category: StoryCategory;
  /** 가정 표기(예: "김ㅇㅇ·이ㅇㅇ 가정"). 실명 대신 익명 표기를 권장합니다. */
  familyName: string;
  region: string;
  viewCount: number;
  isPublished: boolean;
  /** 게시 시각. 비어있으면(초안) 카드/목록에 노출되지 않습니다. */
  publishedAt: string | null;
  createdAt: string;
}

// 분석 시점 기준 스토리 콘텐츠 0건(§6 P-03 실측)이라 기본값도 빈 배열입니다.
// Supabase 미연결 상태에서 관리자가 /admin/stories로 글을 추가하면 이 브라우저의
// localStorage에 저장되어 여기 대신 쓰입니다(§src/lib/stories.ts).
export const DEFAULT_STORIES: Story[] = [];
