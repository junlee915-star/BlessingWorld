// 라우트별 메타 태그 — §5.3
export interface RouteSeo {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}

const SITE_TITLE = "블레싱월드 — 축복결혼을 처음 만나는 곳";
const SITE_DESCRIPTION =
  "축복결혼이 처음이신 분을 위한 따뜻한 안내소. 궁금한 것부터 하나씩, 블레싱월드가 함께합니다.";

export const SEO_DEFAULTS: RouteSeo = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export const ROUTE_SEO: Record<string, RouteSeo> = {
  "/": SEO_DEFAULTS,
  "/guide": {
    title: "축복의 씨앗 — 축복결혼 안내",
    description:
      "축복결혼이 무엇인지, 그 가치와 의미부터 실제 준비 절차까지 처음 오신 분을 위한 안내.",
    ogDescription: "축복결혼의 정의·가치·의미·사례·절차를 하나의 흐름으로 안내합니다.",
  },
  "/stories": {
    title: "행복의 꽃 — 축복가정의 이야기",
    description:
      "실제 축복가정의 인터뷰와 사례를 통해 축복결혼이 삶에서 어떻게 피어나는지 만나보세요.",
    ogDescription:
      "축복결혼이 실제 삶에서 어떻게 피어나는지, 가정들의 이야기로 만나보세요.",
  },
  "/churches": {
    title: "지역가정교회 — 블레싱월드",
    description: "지역을 선택하면 담당 지역가정교회의 연락처를 안내해드려요.",
  },
  "/curriculum": {
    title: "축복가치교육 — 축복교육 4강좌",
    description: "축복결혼이 궁금한 분들을 위한 4개의 강좌를 순서대로, 또는 골라서 들어보세요.",
  },
  "/documents": {
    title: "제출서류 안내 — 축복후보자 제출서류 및 심사기준",
    description:
      "미혼1세·축복자녀 축복후보자가 준비할 제출서류와 심사기준을 유형별로 확인해보세요.",
  },
  "/onboarding": {
    title: "처음 오셨나요? — 블레싱월드 안내",
    description:
      "축복결혼이 처음이신 분을 위한 간단한 안내 신청 — 이름과 연락처만으로 시작할 수 있어요.",
  },
  "/privacy": {
    title: "개인정보처리방침 — 블레싱월드",
    description: "블레싱월드 개인정보처리방침을 안내합니다.",
  },
  "/terms": {
    title: "이용약관 — 블레싱월드",
    description: "블레싱월드 이용약관을 안내합니다.",
  },
  "/admin/curriculum": {
    title: "축복가치교육 관리 — 블레싱월드 관리자",
    description: "축복교육 강좌 목록을 관리합니다.",
  },
  "/admin/churches": {
    title: "지역가정교회 관리 — 블레싱월드 관리자",
    description: "지역가정교회(/churches)에 노출되는 목록을 관리합니다.",
  },
  "/admin/members": {
    title: "회원관리 — 블레싱월드 관리자",
    description: "전체 회원 목록과 각자의 축복교육 이수 현황을 확인합니다.",
  },
  "/login": {
    title: "로그인 — 블레싱월드",
    description: "이메일과 비밀번호로 로그인하고, 내가 수강한 교육을 확인해보세요.",
  },
  "/mypage": {
    title: "마이페이지 — 블레싱월드",
    description: "내가 수강한 축복교육 강좌 현황을 확인합니다.",
  },
};

export const OG_IMAGE_URL =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";
