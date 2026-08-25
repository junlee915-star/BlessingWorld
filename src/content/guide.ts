// 축복의 씨앗 `/guide` — §6 P-02

export const GUIDE_HERO = {
  eyebrow: "BLESSING GUIDE",
  title: "두 사람의 약속이 한 가정의 시작이 됩니다",
};

export const TRUST_BADGES = [
  "상담은 언제나 무료예요",
  "결정은 본인이 해요",
  "원할 때 중단할 수 있어요",
];

export const WHAT_IS_BLESSING = {
  eyebrow: "What is the Blessing?",
  title: "결혼을 넘어, 함께 살아갈 방향을 약속합니다",
  bodyParagraphs: [
    "축복결혼은 단지 두 사람이 만나는 예식이 아닙니다. 서로의 다름을 존중하고, 어려움 속에서도 사랑을 선택하며, 행복한 가정을 함께 만들어 가겠다는 삶의 약속입니다.",
    "세계평화통일가정연합은 가정을 사랑과 평화가 시작되는 가장 소중한 자리로 바라봅니다.",
  ],
  quote:
    "완벽한 사람을 찾기보다, 함께 성장할 사람을 만나는 것.\n축복결혼은 그 진솔한 약속에서 시작됩니다.",
};

export const OUR_DIRECTION = {
  eyebrow: "Our Direction",
  title: "우리가 소중히 여기는 것",
  lead: "완벽한 가정보다 서로 배우고 성장하는 가정을 꿈꿉니다.",
  pillars: [
    {
      icon: "Heart",
      title: "존중",
      description: "서로의 다름을 인정하고 있는 그대로의 삶을 귀하게 여깁니다.",
    },
    {
      icon: "HandHeart",
      title: "책임",
      description: "사랑을 말에만 두지 않고 배려와 돌봄으로 실천합니다.",
    },
    {
      icon: "Sprout",
      title: "성장",
      description: "갈등을 피하기보다 함께 풀어가며 더 깊은 관계로 나아갑니다.",
    },
    {
      icon: "Users",
      title: "나눔",
      description: "우리 가정의 행복을 이웃과 나누며 더 따뜻한 세상을 만들어 갑니다.",
    },
  ],
};

interface JourneyStep {
  no: string;
  title: string;
  description: string;
  /** 이 단계와 연결된 페이지가 있으면 링크를 노출합니다 (예: 축복교육 → 4강좌 보기). */
  to?: { label: string; href: string };
}

interface JourneyGroup {
  label: string;
  title: string;
  description: string;
  steps: JourneyStep[];
}

export const STEP_JOURNEY: { eyebrow: string; title: string; lead: string; groups: JourneyGroup[] } = {
  eyebrow: "Step by Step",
  title: "천천히 배우고, 충분히 준비합니다",
  lead: "축복결혼은 한 번의 신청으로 결정되는 과정이 아닙니다. 상담과 교육을 통해 나와 가정을 준비하고, 충분히 이해한 뒤 다음 걸음을 선택합니다.",
  groups: [
    {
      label: "A",
      title: "알아보기",
      description: "가정을 향한 마음을 천천히 나눕니다",
      steps: [
        {
          no: "01",
          title: "축복 알아보기",
          description: "축복결혼의 의미와 전체 과정을 이해합니다.",
        },
        {
          no: "02",
          title: "첫 상담",
          description: "지역 담당자와 현재 상황과 궁금한 점을 이야기합니다.",
        },
      ],
    },
    {
      label: "B",
      title: "배우고 자라기",
      description: "사랑과 관계를 배우며 나를 준비합니다",
      steps: [
        {
          no: "03",
          title: "축복교육",
          description: "가정연합의 가치와 참부모님의 삶, 축복가정의 의미를 배웁니다.",
          to: { label: "4강좌 보기", href: "/curriculum" },
        },
        {
          no: "04",
          title: "나를 준비하기",
          description: "관계와 생활, 건강과 책임감을 돌아보며 가정생활을 준비합니다.",
        },
      ],
    },
    {
      label: "C",
      title: "만남과 가정의 시작",
      description: "함께할 사람을 만나, 새로운 가정을 시작합니다",
      steps: [
        {
          no: "05",
          title: "만남 준비와 소개",
          description:
            "필요한 교육을 마친 뒤, 같은 기준으로 준비된 상대와의 만남을 안내받습니다.",
        },
        {
          no: "06",
          title: "축복 신청과 가정 출발",
          description:
            "두 사람의 뜻을 확인하고 필요한 서류와 예식, 이후의 가정생활을 준비합니다.",
        },
      ],
    },
  ],
};

export const FAQ_SECTION_HEADING = {
  eyebrow: "FAQ",
  title: "처음 오신 분들이 자주 묻는 질문",
};

export const GUIDE_FINAL_CTA = {
  title: "축복을 향한 첫걸음, 궁금함에서 시작해도 좋습니다",
  body: "축복결혼이 낯설어도 괜찮습니다. 좋은 가정을 꿈꾸는 마음이 있다면, 지금부터 천천히 함께 알아가 보세요.",
  cta: { label: "축복결혼 안내 신청하기", to: "/onboarding" },
  badges: ["무료 상담", "1~2영업일 내 지역 안내", "언제든 연락 중단 가능"],
  fineprint: "개인정보는 안내 목적에만 사용됩니다.",
};
