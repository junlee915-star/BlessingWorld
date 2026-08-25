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
  primary: { label: "축복결혼 알아보기", to: "/guide" },
  secondary: { label: "축복결혼 안내 신청", to: "/onboarding" },
};

export const HOME_CTA_BAND = {
  eyebrow: "READY TO BEGIN",
  title: "축복결혼, 이제 첫걸음을 내딛어보세요",
  body: "궁금한 것부터 하나씩, 블레싱월드가 끝까지 함께합니다.",
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
    badge: "행복의 꽃",
    title: "가정의 이야기",
    description:
      "실제 축복가정의 인터뷰와 사례를 통해 따뜻한 가정 문화를 만나보세요.",
    to: "/stories",
    cta: "자세히 보기 →",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "집에서 함께 시간을 보내는 축복가정",
    size: "lg",
  },
  {
    badge: "온라인교육과정",
    title: "축복교육 4강좌",
    description:
      "축복결혼이 궁금한 분들을 위한 4개의 강좌. 순서대로, 또는 궁금한 것부터 들어보세요.",
    to: "/curriculum",
    cta: "강좌 보기 →",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "온라인 강의를 듣는 모습",
    size: "lg",
  },
  {
    badge: "지역가정교회",
    title: "가까운 지역가정교회 찾기",
    description: "지역을 선택하면 담당 지역가정교회의 연락처를 안내해드려요.",
    to: "/churches",
    cta: "지역가정교회 찾기 →",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    imageAlt: "지역가정교회 안내",
    size: "sm",
  },
];
