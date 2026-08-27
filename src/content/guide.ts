// 축복의 씨앗 `/guide` — §6 P-02
// 2026-08-27: 원본 사이트(온기정원)의 개편된 /guide 카피를 반영했습니다.
// 이 페이지는 '가치'만 다룹니다 — 절차는 /roadmap, 행동은 /center(6축 개편 §3.4).

export const GUIDE_HERO = {
  eyebrow: "BLESSING GUIDE",
  title: "사랑이 가정이 되고,\n가정이 평화가 됩니다",
  /** 히어로 하단 해시태그 — 축복의 방향을 세 마디로 요약합니다. */
  hashtags: ["조건 없이 주는", "함께 배우고 성장하는", "가정에서 세상으로"],
};

export const TRUST_BADGES = [
  "상담은 언제나 무료예요",
  "결정은 본인이 해요",
  "원할 때 중단할 수 있어요",
];

export const WHAT_IS_BLESSING = {
  eyebrow: "WHAT IS THE BLESSING?",
  title: "결혼을 넘어,\n함께 살아갈 방향을 약속합니다",
  bodyParagraphs: [
    "축복결혼은 두 사람이 서로의 다름을 존중하며, 사랑과 책임으로 함께 살아갈 삶을 약속하는 예식입니다.",
    "가정연합은 '가정'을 사랑을 배우고, 평화가 시작되는 가장 소중한 자리로 바라봅니다.",
  ],
  quote:
    "완벽한 사람을 찾기보다, 함께 더 좋은 사람이 되어 갈 사람을 만나는 것.\n축복결혼은 그 진솔한 약속에서 시작됩니다.",
  // 좌측 사진 위에 eyebrow·제목이 얹히는 2열 카드 레이아웃(§components/guide/WhatIsBlessing.tsx).
  image:
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
  imageAlt: "서로를 바라보며 미소짓는 부부",
};

export const OUR_DIRECTION = {
  eyebrow: "OUR DIRECTION",
  title: "우리가 소중히 여기는 것",
  lead: "완벽한 가정보다 서로 배우고 성장하는 가정을 꿈꿉니다.",
  pillars: [
    {
      icon: "Heart",
      title: "참사랑",
      description: "먼저 주고,\n더 주고 싶은 마음으로\n서로를 대합니다.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      imageAlt: "마주 보며 이야기 나누는 부부",
    },
    {
      icon: "Sprout",
      title: "함께 성장하는 약속",
      description: "서로의 꿈을 응원하며,\n오늘보다 더 넓은 내일로\n함께 성장합니다.",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      imageAlt: "나란히 걸으며 대화하는 두 사람",
    },
    {
      icon: "Home",
      title: "사랑의 터전",
      description: "사랑을 배우고 생명을 잇는 곳,\n가정은 우리 삶의\n가장 따뜻한 뿌리입니다.",
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      imageAlt: "집에서 함께 시간을 보내는 가정",
    },
    {
      icon: "Users",
      title: "평화의 시작",
      description: "행복한 한 가정이\n이웃을 밝히고,\n세상을 따뜻하게 합니다.",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
      imageAlt: "이웃과 함께 모인 사람들",
    },
  ],
};

/** 절차(=/roadmap)로 넘어가는 다리 역할 섹션. 원본의 TOGETHER, FOR FAMILY 카피입니다. */
export const TOGETHER_FOR_FAMILY = {
  eyebrow: "TOGETHER, FOR FAMILY",
  title: "축복가정을 꿈꾸는 사람들과,\n좋은 사람이 되는 법을 배웁니다",
  body: "축복결혼은 교육과 만남을 통해 사랑하는 법, 대화하는 법, 책임지는 법을 익히며 행복한 가정을 차근차근 준비해 가는 여정입니다.",
  cta: { label: "축복로드맵 보기", to: "/roadmap" },
};

// 절차(단계별 여정) 데이터는 6축 개편에서 /roadmap으로 옮겼습니다 — src/content/roadmap.ts가
// 유일한 출처입니다. 축복의 씨앗은 '가치'만 다루고, 절차는 RoadmapBanner로 넘깁니다(§4.2).

export const FAQ_SECTION_HEADING = {
  eyebrow: "FAQ",
  title: "처음 오신 분들이 자주 묻는 질문",
};

export const GUIDE_FINAL_CTA = {
  // 좌측 사진 + 우측 안내 패널의 2열 카드(§components/guide/GuideFinalCta.tsx).
  image:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  imageAlt: "축복결혼식에서 함께 걷는 신랑 신부",
  title: "축복을 향한 첫걸음,\n궁금함에서 시작해도 좋습니다",
  body: "축복결혼이 낯설어도 괜찮습니다. 좋은 가정을 꿈꾸는 마음이 있다면, 지금부터 천천히 함께 알아가 보세요.",
  cta: { label: "축복결혼 안내 신청하기", to: "/center/apply" },
  badges: ["무료 상담", "1~2영업일 내 지역 안내", "언제든 연락 중단 가능"],
  fineprint: "개인정보는 안내 목적에만 사용됩니다.",
};
