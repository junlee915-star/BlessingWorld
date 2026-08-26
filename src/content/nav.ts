// 글로벌 내비게이션(GNB) — §2.3.
// 원래 원본 재구현 스펙(PRD)에는 "4개 항목 고정, 순서 변경 금지"로 못박혀 있었으나,
// 2026-08-26 사용자 요청으로 5번째 항목(제출서류 안내)을 추가했습니다. 앞 4개 항목의
// 순서는 여전히 바꾸지 않습니다. PRD §2.3도 함께 갱신했습니다.
export interface NavItem {
  label: string;
  path: string;
  captionEn: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "축복의 씨앗", path: "/guide", captionEn: "Blessing Guide" },
  { label: "행복의 꽃", path: "/stories", captionEn: "Our Stories" },
  { label: "축복가치교육", path: "/curriculum", captionEn: "Online Courses" },
  { label: "지역가정교회", path: "/churches", captionEn: "Local Family Churches" },
  { label: "제출서류 안내", path: "/documents", captionEn: "Required Documents" },
];

export const BRAND = {
  name: "블레싱월드",
  logoAlt: "블레싱월드 마크",
  homeLabel: "블레싱월드 홈",
};
