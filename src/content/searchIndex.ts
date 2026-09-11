// 사이트 내 검색 색인 — §14 개선안 §14.6 "사이트 내 검색: 빌드 시 정적 색인(JSON) 생성 +
// 클라이언트 검색으로 충분".
//
// 여기서는 별도 node 스크립트로 JSON 파일을 만드는 대신, 이미 이 저장소가 쓰는
// "content/*.ts 정적 데이터 + Vite 번들" 관행을 그대로 따릅니다. 이 배열은 빌드 시점에
// 번들에 포함되는 정적 데이터이므로 결과물은 동일합니다(런타임 fetch·서버 없음).
//
// 의도적으로 빠진 것: 스토리(행복의 꽃)·관리자가 Supabase에서 고친 FAQ 등
// **런타임에 바뀌는 콘텐츠**는 넣지 않았습니다. 빌드 시 정적 색인은 그 시점의 content/*.ts
// 기본값만 알 수 있어서, admin이 Supabase에서 실시간으로 바꾼 값과 검색 결과가 어긋날 수
// 있기 때문입니다. 이 정적 콘텐츠들이 늘어나면(§14.7 콘텐츠 제작 목록) 검색 결과도 함께
// 늘어납니다 — 새 항목을 추가했다면 이 파일에도 함께 등록해주세요.
import { DEFAULT_FAQS } from "./faq";
import { PARENTS_FAQ_ITEMS } from "./parentsFaq";
import { DOCUMENT_CATEGORIES } from "./documents";
import { ROADMAP_DETAIL_PAGES } from "./roadmapDetail";
import { DEFAULT_COURSES } from "./curriculum";
import { CENTER_ENTRIES } from "./center";
import { PARENTS_CARDS } from "./parents";

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  to: string;
  category: string;
}

const HUB_ENTRIES: SearchEntry[] = [
  { id: "hub-guide", title: "축복의 씨앗", description: "축복결혼의 의미와 가치를 처음부터 알아봅니다.", to: "/guide", category: "알아보기" },
  { id: "hub-stories", title: "행복의 꽃", description: "실제 축복가정의 인터뷰와 사례를 만나봅니다.", to: "/stories", category: "알아보기" },
  { id: "hub-curriculum", title: "사랑의 기술", description: "축복결혼을 이해하는 데 도움이 되는 영상 강좌 모음.", to: "/curriculum", category: "알아보기" },
  { id: "hub-roadmap", title: "축복로드맵", description: "알아보기부터 축복식까지 8단계 진행 순서.", to: "/roadmap", category: "축복로드맵" },
  { id: "hub-center", title: "축복센터", description: "상담 신청·교회 찾기·서류·가치관 진단을 한곳에서.", to: "/center", category: "축복센터" },
  { id: "hub-parents", title: "부모와 함께", description: "자녀의 축복을 준비하는 부모님을 위한 안내.", to: "/parents", category: "부모와 함께" },
];

const FAQ_ENTRIES: SearchEntry[] = DEFAULT_FAQS.map((faq) => ({
  id: `faq-${faq.id}`,
  title: faq.question,
  description: faq.answer,
  to: "/guide",
  category: "자주 묻는 질문",
}));

const PARENTS_FAQ_ENTRIES: SearchEntry[] = PARENTS_FAQ_ITEMS.map((faq) => ({
  id: `parents-faq-${faq.id}`,
  title: faq.question,
  description: faq.answer,
  to: "/parents/faq",
  category: "부모용 FAQ",
}));

const DOCUMENT_ENTRIES: SearchEntry[] = DOCUMENT_CATEGORIES.map((category) => ({
  id: `document-${category.id}`,
  title: category.fullTitle,
  description: `${category.eligibility} · ${category.effectiveDate} · ${category.items.length}개 항목`,
  to: "/center/documents",
  category: "제출서류·심사기준",
}));

const ROADMAP_DETAIL_ENTRIES: SearchEntry[] = ROADMAP_DETAIL_PAGES.map((page) => ({
  id: `roadmap-${page.stage}-${page.slug}`,
  title: page.title,
  description: page.intro,
  to: `/roadmap/${page.stage}/${page.slug}`,
  category: "축복로드맵",
}));

const COURSE_ENTRIES: SearchEntry[] = DEFAULT_COURSES.map((course) => ({
  id: `course-${course.id}`,
  title: course.title,
  description: course.description,
  to: `/curriculum/${course.id}`,
  category: "사랑의 기술",
}));

const CENTER_ENTRIES_SEARCH: SearchEntry[] = CENTER_ENTRIES.map((entry) => ({
  id: `center-${entry.id}`,
  title: entry.title,
  description: entry.description,
  to: entry.to,
  category: "축복센터",
}));

const PARENTS_CARD_ENTRIES: SearchEntry[] = PARENTS_CARDS.map((card) => ({
  id: `parents-${card.id}`,
  title: card.title,
  description: card.description,
  to: card.to,
  category: "부모와 함께",
}));

export const SEARCH_INDEX: SearchEntry[] = [
  ...HUB_ENTRIES,
  ...CENTER_ENTRIES_SEARCH,
  ...PARENTS_CARD_ENTRIES,
  ...ROADMAP_DETAIL_ENTRIES,
  ...COURSE_ENTRIES,
  ...DOCUMENT_ENTRIES,
  ...FAQ_ENTRIES,
  ...PARENTS_FAQ_ENTRIES,
];
