// 글로벌 내비게이션(GNB).
// 가치(씨앗) → 사례(꽃) → 학습(기술) → 절차(로드맵) → 행동(센터) 순서 원칙을 그대로
// 최상위 항목 순서로 씁니다. "일정·공지"는 별도 페이지 없이 폐지했습니다.
export interface NavItem {
  label: string;
  path: string;
  captionEn: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "축복의 씨앗", path: "/guide", captionEn: "Discover" },
  { label: "행복의 꽃", path: "/stories", captionEn: "Stories" },
  { label: "사랑의 기술", path: "/curriculum", captionEn: "Curriculum" },
  { label: "축복로드맵", path: "/roadmap", captionEn: "Your Roadmap" },
  { label: "축복센터", path: "/center", captionEn: "Blessing Center" },
  { label: "부모와 함께", path: "/parents", captionEn: "With Parents" },
];

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
