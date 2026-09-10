// 공지 `/notice` + 홈 공지 슬롯 — §14 개선안 P-13(§14.4.2).
// Supabase의 `notices` 테이블이 연결되지 않은 환경에서는 아래 기본값(빈 배열)을 그대로
// 쓰고, 연결되면 실제 테이블 값으로 대체됩니다. §src/lib/notices.ts 참고.
//
// events.ts와 같은 이유로 예시 공지를 심지 않습니다 — 게시 중인 공지가 없으면 홈 슬롯이
// 아예 렌더되지 않는 것이 참조 사이트의 "지금은 공지가 없습니다" 상시 노출보다 낫습니다.
export type NoticeLevel = "info" | "important";

export interface Notice {
  id: string;
  title: string;
  body: string;
  level: NoticeLevel;
  /** ISO 8601. 없으면 항상 게시 중으로 취급합니다. */
  startsAt?: string;
  /** ISO 8601. 없으면 기한 없이 게시 중입니다. */
  endsAt?: string;
  isPublished: boolean;
  createdAt: string;
}

export const DEFAULT_NOTICES: Notice[] = [];

export const NOTICE_LEVEL_LABELS: Record<NoticeLevel, string> = {
  info: "안내",
  important: "중요",
};

export const NOTICE_PAGE_COPY = {
  eyebrow: "NOTICE",
  title: "공지사항",
  body: "블레싱월드의 새로운 소식과 안내를 전해드립니다.",
  emptyState: "지금은 등록된 공지가 없습니다.",
};

export const HOME_NOTICE_BAND_COPY = {
  moreLink: { label: "공지사항 전체 보기", to: "/notice" },
};
