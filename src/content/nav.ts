// 글로벌 내비게이션(GNB) — §2.3. 4개 항목 고정, 순서 변경 금지.
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
];

export const BRAND = {
  name: "블레싱월드",
  logoAlt: "블레싱월드 마크",
  homeLabel: "블레싱월드 홈",
};
