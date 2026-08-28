// 가치관 진단 12문항 `/center/apply` 신청 흐름 내 선택 단계 — DESIGN 목업(가치관 12문항 진단.pdf) 기반.
// 정답이 없는 자기 성향 체크로, 응답은 상담 담당자가 대화를 준비하는 참고 자료로만 쓰입니다
// (§src/lib/guidance.ts에 guidance_requests.values_assessment로 함께 저장·선택적 첨부).

export const LIKERT_LABELS = ["전혀 아니다", "아닌 편이다", "보통이다", "그런 편이다", "매우 그렇다"] as const;

export type CategoryKey = "conversation" | "family" | "faith" | "life";
/** 각 영역 점수(3문항 평균, 1~5)가 3을 넘으면 A, 아니면 B — 우열이 아니라 성향 차이입니다. */
export type StylePole = "A" | "B";

export interface ValuesQuestion {
  id: number;
  category: CategoryKey;
  text: string;
}

export interface CategoryMeta {
  key: CategoryKey;
  title: string;
}

export const VALUES_CATEGORIES: CategoryMeta[] = [
  { key: "conversation", title: "대화와 갈등" },
  { key: "family", title: "가족과 관계" },
  { key: "faith", title: "신앙과 삶의 방향" },
  { key: "life", title: "생활과 계획" },
];

export const VALUES_QUESTIONS: ValuesQuestion[] = [
  { id: 1, category: "conversation", text: "갈등이 생기면 그날 안에 이야기해서 푸는 편이다" },
  { id: 2, category: "conversation", text: "속상한 일이 있으면 상대가 묻기 전에 먼저 말하는 편이다" },
  { id: 3, category: "conversation", text: "의견이 다를 때는 결론보다 서로의 이유를 듣는 시간이 더 중요하다" },
  { id: 4, category: "family", text: "결혼 후에도 양가 부모님과 가까이 지내고 싶다" },
  { id: 5, category: "family", text: "명절과 가족 행사는 두 사람이 함께 정하는 일정에 맞추고 싶다" },
  { id: 6, category: "family", text: "배우자의 가족과도 편하게 연락하며 지내고 싶다" },
  { id: 7, category: "faith", text: "가정의 신앙생활은 부부가 함께 이어가고 싶다" },
  { id: 8, category: "faith", text: "중요한 결정을 내릴 때 기도하거나 마음을 정리하는 시간을 갖는다" },
  { id: 9, category: "faith", text: "가정을 통해 이웃과 공동체에 기여하고 싶다" },
  { id: 10, category: "life", text: "가계는 두 사람이 함께 관리하고 함께 결정하고 싶다" },
  { id: 11, category: "life", text: "결혼 후 맞벌이를 이어가며 집안일을 나누고 싶다" },
  { id: 12, category: "life", text: "자녀 계획은 두 사람의 준비가 되었을 때 시작하고 싶다" },
];

export const VALUES_ASSESSMENT_COPY = {
  eyebrow: "VALUES ASSESSMENT",
  title: "가치관 진단 12문항",
  body: "정답은 없습니다. 지금 드는 방식을 그대로 골라주세요. 진단은 상담 담당자에게만 보이며, 다른 회원에게 공개되지 않습니다.",
  timeBadge: "총 3분 소요",
  retakeBadge: "언제든 다시 응답 가능",
  startCta: "가치관 진단 시작하기",
  skipCta: "건너뛰고 신청서 작성하기",
  resultTitle: "진단 결과",
  resultIntro: "정답이 아니라 성향의 차이예요. 상담에서 이야기 나눌 때 참고해보세요.",
  partnerHeading: "나에게 잘 맞는 상대 스타일",
  saveCta: "결과 첨부하고 신청서 작성하기",
  discardCta: "첨부하지 않고 신청서 작성하기",
  savedNote: "신청서와 함께 상담 담당자에게 전달돼요.",
  discardedNote: "이 결과는 저장하지 않고 신청서 작성으로 넘어가요.",
};

export interface StyleDescription {
  name: string;
  description: string;
  partnerSuggestion: string;
}

/** 영역별 A/B 성향 설명 — A는 점수가 높을 때(3 초과), B는 낮거나 보통일 때(3 이하)입니다. */
export const STYLE_COPY: Record<CategoryKey, Record<StylePole, StyleDescription>> = {
  conversation: {
    A: {
      name: "즉시 대화형",
      description: "감정이나 갈등을 오래 담아두지 않고, 바로 이야기해서 풀어가는 편이에요.",
      partnerSuggestion:
        "대화를 피하지 않고 시간을 내어 함께 이야기해줄 수 있는 상대와 잘 맞아요. 다만 상대가 생각을 정리할 시간이 필요할 때는 조금 기다려주는 여유도 도움이 될 거예요.",
    },
    B: {
      name: "숙고 후 대화형",
      description: "감정이나 의견을 바로 꺼내기보다, 스스로 정리한 뒤 이야기하는 편이에요.",
      partnerSuggestion:
        "다그치지 않고 생각할 시간을 기다려주는 상대와 잘 맞아요. 대화를 아예 피하기보다, 시간을 두고서라도 꼭 이야기를 나누려는 상대라면 더 좋아요.",
    },
  },
  family: {
    A: {
      name: "가족 중심형",
      description: "결혼 후에도 양가 가족과 가까운 관계를 유지하고 싶어해요.",
      partnerSuggestion: "양가와의 교류를 부담스러워하지 않고, 함께 챙겨가려는 상대와 잘 맞아요.",
    },
    B: {
      name: "독립적 관계형",
      description: "가족 간 교류보다 부부 두 사람만의 공간과 시간을 더 편하게 느끼는 편이에요.",
      partnerSuggestion:
        "서로의 거리감을 존중해주고, 가족 행사도 두 사람이 먼저 상의해서 정하고 싶어하는 상대와 잘 맞아요.",
    },
  },
  faith: {
    A: {
      name: "신앙 동행형",
      description: "신앙생활과 중요한 결정을 배우자와 함께 나누고 싶어해요.",
      partnerSuggestion: "신앙의 자리를 함께 지켜가고, 공동체 활동에도 마음을 여는 상대와 잘 맞아요.",
    },
    B: {
      name: "개인 신앙형",
      description: "신앙을 겉으로 드러내기보다, 자기만의 방식과 속도로 지켜가는 편이에요.",
      partnerSuggestion:
        "신앙의 방식을 강요하지 않고 존중해주면서도, 필요한 순간에는 함께 나눌 수 있는 상대라면 더 좋아요.",
    },
  },
  life: {
    A: {
      name: "동행 계획형",
      description: "생활의 크고 작은 결정을 배우자와 함께 상의해서 정하고 싶어해요.",
      partnerSuggestion: "가계·집안일·계획을 '내 일, 네 일'로 나누기보다 함께 의논하려는 상대와 잘 맞아요.",
    },
    B: {
      name: "역할 존중형",
      description: "모든 걸 같이 정하기보다, 각자 맡은 영역을 자율적으로 꾸려가는 편을 더 편하게 느껴요.",
      partnerSuggestion: "역할을 나누고 서로의 방식을 믿어주는 상대, 필요할 때만 함께 상의해도 편안한 상대와 잘 맞아요.",
    },
  },
};

export interface ValuesAssessmentResult {
  /** 문항 id(1~12) 순서대로의 응답(1~5). */
  answers: number[];
  /** 영역별 평균 점수(1~5, 소수 첫째 자리). */
  scores: Record<CategoryKey, number>;
  /** 영역별 성향(A/B). */
  styles: Record<CategoryKey, StylePole>;
}

/** answers는 VALUES_QUESTIONS와 같은 순서(문항 1~12)의 1~5 응답이어야 합니다. */
export function scoreValuesAssessment(answers: number[]): ValuesAssessmentResult {
  const scores = {} as Record<CategoryKey, number>;
  const styles = {} as Record<CategoryKey, StylePole>;

  for (const category of VALUES_CATEGORIES) {
    const values = VALUES_QUESTIONS.filter((q) => q.category === category.key).map(
      (q) => answers[q.id - 1],
    );
    const average = values.reduce((sum, v) => sum + v, 0) / values.length;
    scores[category.key] = Math.round(average * 10) / 10;
    styles[category.key] = average > 3 ? "A" : "B";
  }

  return { answers, scores, styles };
}
