// 홈 `/` — §6 P-01

export const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
    alt: "다양한 국적의 부부들이 함께 참여한 합동축복식",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2000&q=80",
    alt: "따뜻하게 미소짓는 축복가정 부부",
  },
  {
    image:
      "https://images.unsplash.com/photo-1772305436753-e308844ecda2?auto=format&fit=crop&w=2000&q=80",
    alt: "함께 웃으며 즐거운 시간을 보내는 축복가정",
  },
];

export const HERO_COPY = {
  eyebrow: "A WARM PLACE TO BEGIN",
  title: "좋은 가정을 향한\n마음의 씨앗을 심어요",
  body: "축복결혼이 처음이신가요?\n궁금한 것부터 하나씩, 블레싱월드가 함께합니다.",
};

export const INTRO_TRIAD = [
  {
    eyebrow: "축복결혼이란?",
    title: "두 사람의 약속이 한 가정의 시작이 됩니다",
    body: "서로를 존중하고 책임 있는 사랑을 실천하며, 함께 행복한 가정을 만들어 가는 약속입니다.",
  },
  {
    eyebrow: "처음 오셨나요?",
    title: "가정을 향한 마음, 여기서 함께 알아가요",
    body: "축복결혼이 궁금한 분부터 이미 가정을 이룬 분까지, 필요한 이야기와 도움을 편안하게 만나보세요.",
  },
  {
    eyebrow: "행복을 나누는 가정",
    title: "가정의 행복은 나눌수록 깊어집니다",
    body: "먼저 그 길을 걸어간 가정들의 이야기와 따뜻한 공동체를 만나보세요.",
  },
];

export const HOME_CTA = {
  // 6축 개편 §4.1 — 듀오처럼 전환 CTA(상담 신청)를 1순위로 고정하고, 탐색형 CTA를 2순위에 둡니다.
  primary: { label: "축복상담 신청", to: "/center/apply" },
  secondary: { label: "축복결혼 알아보기", to: "/guide" },
};

export const HOME_CTA_BAND = {
  eyebrow: "READY TO BEGIN",
  title: "축복결혼, 이제 첫걸음을 내딛어보세요",
  body: "궁금한 것부터 하나씩, 블레싱월드가 끝까지 함께합니다.",
};

/** 호명 섹션(6축 개편 §4.1-2) — 수치는 site_stats에서 오고, 없으면 섹션 전체가 렌더되지 않습니다. */
export const HOME_STATS_SECTION = {
  eyebrow: "OUR FAMILIES",
  title: "먼저 이 길을 걸어온 가정들이 있습니다",
  body: "아래 수치는 협회가 집계해 공개한 값이며, 기준일을 함께 표기합니다.",
};

export const HOME_ROADMAP_PREVIEW = {
  eyebrow: "YOUR ROADMAP",
  title: "축복까지, 여덟 걸음",
  body: "처음 세 걸음만 먼저 보여드릴게요. 지금 서 있는 자리에서 다음 하나만 보시면 됩니다.",
  cta: { label: "전체 로드맵 보기", to: "/roadmap" },
};

export interface HomeCard {
  badge: string;
  title: string;
  description: string;
  to: string;
  cta: string;
  image: string;
  imageAlt: string;
  external?: boolean;
  size: "lg" | "sm";
}

export const HOME_CARDS: HomeCard[] = [
  {
    badge: "축복의 씨앗",
    title: "축복결혼이란 무엇인가요",
    description:
      "서로를 존중하고 책임 있는 사랑을 실천하겠다는 약속. 그 뜻과 가치를 처음부터 편안하게 살펴보세요.",
    to: "/guide",
    cta: "가치 알아보기 →",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "따뜻하게 미소짓는 축복가정 부부",
    size: "lg",
  },
  {
    badge: "행복의 꽃",
    title: "축복가정의 이야기",
    description:
      "실제 축복가정의 인터뷰와 사례를 통해 축복결혼이 삶에서 어떻게 피어나는지 만나보세요.",
    to: "/stories",
    cta: "이야기 읽기 →",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "집에서 함께 시간을 보내는 축복가정",
    size: "lg",
  },
  {
    badge: "사랑의 기술",
    title: "배울 수 있는 사랑",
    description: "좋은 가정을 이루는 데 필요한 네 가지 기술을 강좌로 담았습니다.",
    to: "/curriculum",
    cta: "강좌 보기 →",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    imageAlt: "온라인 강의를 듣는 모습",
    size: "sm",
  },
  {
    badge: "축복로드맵",
    title: "축복까지 가는 여덟 걸음",
    description: "알아보기부터 축복식까지, 어떤 순서로 진행되는지 한눈에 확인하세요.",
    to: "/roadmap",
    cta: "로드맵 보기 →",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    imageAlt: "여러 가정이 함께한 합동축복식",
    size: "sm",
  },
  {
    badge: "축복센터",
    title: "상담 신청·교회 찾기·서류",
    description: "축복을 결심하셨다면, 필요한 모든 절차를 한곳에서 시작하실 수 있습니다.",
    to: "/center",
    cta: "축복센터 가기 →",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    imageAlt: "지역가정교회 안내",
    size: "sm",
  },
];
