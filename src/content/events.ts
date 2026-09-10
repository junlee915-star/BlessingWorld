// 일정·공지 `/schedules` — §14 개선안 P-13(§14.4.1).
// Supabase의 `events` 테이블이 연결되지 않은 환경에서는 아래 기본값(빈 배열)을 그대로 쓰고,
// 연결되면 실제 테이블 값으로 대체됩니다. §src/lib/events.ts 참고.
//
// churches.ts와 달리 예시(placeholder) 행사를 심지 않습니다 — 실데이터 없이 예시 데이터가
// 그대로 배포되어 방치된 문제(§14 개선안 I-25)를 반복하지 않기 위함입니다. 빈 배열이면
// /schedules는 "등록된 일정이 없습니다" 안내만 보여주고, GNB에서도 자연히 숨겨집니다.
export type EventCategory = "ceremony" | "retreat" | "education" | "matching_meet" | "parents_seminar";
export type EventFormat = "offline" | "online" | "hybrid";

export interface BlessingEvent {
  id: string;
  category: EventCategory;
  title: string;
  /** ISO 8601 문자열 */
  startsAt: string;
  endsAt?: string;
  format?: EventFormat;
  venue?: string;
  audience?: string;
  fee?: string;
  applyDeadline?: string;
  paymentDeadline?: string;
  applyMethod?: string;
  host?: string;
  contact?: string;
  sourceNote?: string;
  isPublished: boolean;
  updatedAt: string;
}

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  ceremony: "축복식",
  retreat: "수련회",
  education: "교육",
  matching_meet: "교류회",
  parents_seminar: "부모 세미나",
};

export const EVENT_FORMAT_LABELS: Record<EventFormat, string> = {
  offline: "대면",
  online: "온라인",
  hybrid: "온·오프라인 병행",
};

export const DEFAULT_EVENTS: BlessingEvent[] = [];

export const SCHEDULES_HERO = {
  eyebrow: "SCHEDULES",
  title: "일정·공지",
  body: "축복식·수련회·교육·교류회 등 기한 있는 소식을 모았습니다.",
};

export const SCHEDULES_COPY = {
  updatedNotePrefix: "기준 갱신",
  upcomingHeading: "다가오는 일정",
  pastHeading: "지난 일정",
  pastToggleShow: "지난 일정 보기",
  pastToggleHide: "지난 일정 접기",
  deadlineSoonBadge: "신청 마감 임박",
  allCategory: "전체",
  emptyState: "지금은 등록된 일정이 없습니다. 새로운 일정이 등록되면 이곳에서 안내해 드립니다.",
  emptyStateFiltered: "이 카테고리에는 등록된 일정이 없습니다.",
};
