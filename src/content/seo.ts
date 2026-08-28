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
  "/curriculum": {
    title: "사랑의 기술 — 축복가치교육 4강좌",
    description: "사랑은 감정이 아니라 배울 수 있는 기술입니다. 4개의 강좌로 차근차근 익혀보세요.",
  },
  "/roadmap": {
    title: "축복로드맵 — 축복까지 가는 8단계",
    description:
      "알아보기부터 축복식까지, 축복결혼이 어떤 순서로 진행되는지 8단계로 안내합니다.",
    ogDescription: "축복결혼은 어떤 순서로 진행될까요? 8단계 로드맵으로 확인해보세요.",
  },
  "/center": {
    title: "축복센터 — 상담 신청·교회 찾기·서류 안내",
    description:
      "축복을 결심하셨다면 여기서 시작하세요. 상담 신청, 지역가정교회 찾기, 제출서류 안내를 한곳에 모았습니다.",
  },
  "/center/apply": {
    title: "축복상담 신청 — 축복센터",
    description:
      "이름과 연락처, 원하시는 상담 방식만 알려주시면 지역가정교회에서 연락드립니다.",
  },
  "/center/churches": {
    title: "지역가정교회 찾기 — 축복센터",
    description: "지역을 선택하면 담당 지역가정교회의 연락처를 안내해드려요.",
  },
  "/center/documents": {
    title: "제출서류·심사기준 — 축복센터",
    description:
      "미혼1세·축복자녀 축복후보자가 준비할 제출서류와 심사기준을 유형별로 확인해보세요.",
  },
  "/values": {
    title: "가치관 진단 12문항 — 블레싱월드",
    description:
      "대화·가족·신앙·생활 4가지 영역 12문항으로 나의 성향과 잘 맞는 상대 스타일을 확인해보세요.",
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
    title: "사랑의 기술 관리 — 블레싱월드 관리자",
    description: "사랑의 기술 강좌 목록과 확인 퀴즈를 관리합니다.",
  },
  "/admin/roadmap": {
    title: "축복로드맵 관리 — 블레싱월드 관리자",
    description: "축복로드맵 8단계의 제목·설명·소요 기간을 관리합니다.",
  },
  "/admin/stats": {
    title: "홈 수치 관리 — 블레싱월드 관리자",
    description: "홈에 노출되는 지표와 기준일을 관리합니다. 기준일이 없으면 노출되지 않습니다.",
  },
  "/admin/churches": {
    title: "지역가정교회 관리 — 블레싱월드 관리자",
    description: "지역가정교회 찾기(/center/churches)에 노출되는 목록을 관리합니다.",
  },
  "/admin/stories": {
    title: "스토리 관리 — 블레싱월드 관리자",
    description: "행복의 꽃(/stories)에 노출되는 글을 관리합니다.",
  },
  "/admin/faq": {
    title: "FAQ 관리 — 블레싱월드 관리자",
    description: "/guide에 노출되는 자주 묻는 질문을 관리합니다.",
  },
  "/admin/guidance": {
    title: "신청 관리 — 블레싱월드 관리자",
    description: "안내 신청 목록을 확인하고 담당자 배정·상태 변경을 관리합니다.",
  },
  "/admin/members": {
    title: "회원관리 — 블레싱월드 관리자",
    description: "전체 회원 목록과 각자의 사랑의 기술 이수 현황을 확인합니다.",
  },
  "/login": {
    title: "로그인 — 블레싱월드",
    description: "이메일과 비밀번호로 로그인하고, 내가 수강한 강좌를 확인해보세요.",
  },
  "/reset-password": {
    title: "비밀번호 재설정 — 블레싱월드",
    description: "새 비밀번호를 설정합니다.",
  },
  "/mypage": {
    title: "마이페이지 — 블레싱월드",
    description: "내가 수강한 사랑의 기술 강좌 현황을 확인합니다.",
  },
};

export const OG_IMAGE_URL =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";
