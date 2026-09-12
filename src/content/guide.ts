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

/** "우리가 소중히 여기는 것"(가치 4카드)을 대체 — §components/guide/BlessingMeaning.tsx */
export const BLESSING_MEANING = {
  eyebrow: "WHY THE BLESSING MATTERS",
  title: "축복의 의미와 가치",
  lead: "축복결혼이 특별한 이유는, 그 자리에 담긴 세 가지 믿음에 있습니다.",
  points: [
    {
      no: "01",
      title: "천국은 가정 단위로 들어갑니다",
      description:
        "우리가 향해 가는 곳은 나 혼자가 아니라, 가정이 함께 들어가는 곳입니다.\n그래서 가정을 이루는 일이 곧 신앙의 완성과 맞닿아 있습니다.",
    },
    {
      no: "02",
      title: "가정의 중심은 부부입니다",
      description:
        "부모와 자녀의 사랑도 소중하지만, 가정의 뿌리는 부부가 서로 사랑하고 존중하는 관계입니다.\n부부관계가 바로 설 때, 온 가정이 함께 바로 섭니다.",
    },
    {
      no: "03",
      title: "그 준비는 가정에서, 출발은 축복입니다",
      description:
        "가족이 함께 천국에 들어갈 준비는 매일의 가정생활 속에서 이루어집니다.\n그리고 그 준비의 첫걸음이 바로 축복입니다.",
    },
  ],
};

// 절차(단계별 여정) 데이터는 6축 개편에서 /roadmap으로 옮겼습니다 — src/content/roadmap.ts가
// 유일한 출처입니다. 축복의 씨앗은 '가치'만 다룹니다(§4.2).

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
