// 글로벌 내비게이션(GNB) — §14 개선안 §14.6 "GNB 6항목 → 4항목 + CTA" 반영.
// 이전(6축 개편 §3.1)에는 "축복의 씨앗/행복의 꽃/사랑의 기술/축복로드맵/축복센터/가치관 진단"
// 6항목을 평면으로 나열했으나, 라벨이 시적이라 초행자에게 목적이 읽히지 않는 문제가 있었습니다
// (§14 개선안: "'사랑의 기술'이 영상 강좌라는 것을 클릭 전에 알기 어렵다"). 기능이 읽히는
// 이름으로 4항목 + CTA로 줄이고, 브랜드 문구(축복의 씨앗 등)는 각 페이지 제목으로만 남깁니다.
//
// "알아보기"는 이전 3항목(축복의 씨앗·행복의 꽃·사랑의 기술)을 하위로 묶은 드롭다운입니다.
// 가치(씨앗) → 사례(꽃) → 학습(기술) → 절차(로드맵) → 행동(센터) 순서 원칙은 하위 항목
// 순서로 이어집니다. "가치관 진단"은 축복상담 신청과 무관하게 부담 없이 접근하는 성격은
// 유지하되, 최상단 대신 축복센터 하위로 옮겼습니다(§src/content/center.ts CENTER_ENTRIES).
export interface NavChildItem {
  label: string;
  path: string;
}

export interface NavItem {
  label: string;
  path: string;
  captionEn: string;
  /** 있으면 데스크톱은 드롭다운, 모바일은 하위 들여쓰기 목록으로 렌더합니다. */
  children?: NavChildItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "알아보기",
    path: "/guide",
    captionEn: "Discover",
    children: [
      { label: "축복의 씨앗", path: "/guide" },
      { label: "행복의 꽃", path: "/stories" },
      { label: "사랑의 기술", path: "/curriculum" },
    ],
  },
  { label: "축복로드맵", path: "/roadmap", captionEn: "Your Roadmap" },
  { label: "축복센터", path: "/center", captionEn: "Blessing Center" },
  { label: "부모와 함께", path: "/parents", captionEn: "With Parents" },
];

// §14 개선안 P-13(§14.4.1) — 등록된 일정이 하나도 없을 때는 GNB에서 숨깁니다(AC 요건).
// NAV_ITEMS에 고정으로 넣지 않고, Header.tsx가 fetchPublishedEvents() 결과에 따라
// 이 항목을 붙일지 말지 결정합니다.
export const SCHEDULES_NAV_ITEM: NavItem = {
  label: "일정·공지",
  path: "/schedules",
  captionEn: "Schedules",
};

/** 헤더·모바일 시트·홈 히어로가 공유하는 주 전환 CTA. 한 곳에서만 바꾸면 되도록 모아둡니다. */
export const PRIMARY_CTA = {
  label: "축복상담 신청",
  to: "/center/apply",
};

export const BRAND = {
  name: "블레싱월드",
  logoAlt: "블레싱월드 마크",
  homeLabel: "블레싱월드 홈",
};
