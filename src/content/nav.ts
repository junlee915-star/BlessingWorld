// 글로벌 내비게이션(GNB) — §2.3 / 6축 개편(docs/2026-08-26_6축개편_설계.md §3.1).
// 2026-08-26 개편: "축복의 씨앗 / 행복의 꽃 / 사랑의 기술 / 축복로드맵 / 축복센터" 5축으로
// 재편했습니다. 가치(씨앗) → 사례(꽃) → 학습(기술) → 절차(로드맵) → 행동(센터) 순서가
// 사용자의 의사결정 순서와 같으므로 순서를 바꾸지 마세요.
// 이전 GNB 항목이던 지역가정교회·제출서류 안내는 축복센터 하위로 이동했습니다.
export interface NavItem {
  label: string;
  path: string;
  captionEn: string;
  /** 활성 표시를 하위 경로까지 확장할지 (예: /center/apply 에서도 축복센터가 활성) */
  matchPrefix?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "축복의 씨앗", path: "/guide", captionEn: "The Seed" },
  { label: "행복의 꽃", path: "/stories", captionEn: "Our Stories", matchPrefix: true },
  { label: "사랑의 기술", path: "/curriculum", captionEn: "The Art of Love", matchPrefix: true },
  { label: "축복로드맵", path: "/roadmap", captionEn: "Your Roadmap" },
  { label: "축복센터", path: "/center", captionEn: "Blessing Center", matchPrefix: true },
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
