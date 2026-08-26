// FAQ — §6 P-02 ⑤, §10 I-06
//
// 원본 사이트에는 질문 9개가 있었으나, 접힘 상태로 남아있던 6~9번은 질문·답변 본문을
// 확보하지 못했습니다(§0 정확도 고지). 2~5번은 질문 원문과 답변의 "취지"만 확보되어,
// 아래 기본값의 답변은 그 취지에 맞춰 작성한 초안입니다 — 운영 담당자(가정행복지원국)
// 확인을 받아 최종 문구로 교체할 것. §/admin/faq에서 언제든 실제 문구로 바꿀 수 있고,
// 6~9번 콘텐츠가 확보되면 거기서 추가하면 됩니다(총 9개, AC-06).
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  /** true면 "질문 더 보기" 없이도 항상 보입니다. false면 더보기를 눌러야 나타납니다. */
  isDefaultVisible: boolean;
  isPublished: boolean;
}

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-01",
    question: "축복결혼을 전혀 몰라도 상담할 수 있나요?",
    answer:
      "네. 처음 오시는 분도 편안하게 이야기 나눌 수 있습니다. 지역 담당자가 눈높이에 맞춰 안내해 드립니다.",
    sortOrder: 1,
    isDefaultVisible: true,
    isPublished: true,
  },
  {
    id: "faq-02",
    question: "상담을 받으면 바로 결혼해야 하나요?",
    answer:
      "아니요. 상담은 결혼을 전제로 하지 않습니다. 상담과 결혼 결정은 완전히 별개이며, 원하시면 언제든 중단하실 수 있습니다. 충분히 알아보신 뒤 스스로 다음 걸음을 선택하시면 됩니다.",
    sortOrder: 2,
    isDefaultVisible: true,
    isPublished: true,
  },
  {
    id: "faq-03",
    question: "가정연합 회원이 아니어도 상담할 수 있나요?",
    answer:
      "네. 세계평화통일가정연합 회원이 아니어도 누구나 상담받으실 수 있습니다. 축복결혼이 궁금하신 분이라면 편안하게 문의해 주세요.",
    sortOrder: 3,
    isDefaultVisible: true,
    isPublished: true,
  },
  {
    id: "faq-04",
    question: "축복을 준비하려면 어떤 교육을 받나요?",
    answer:
      "축복교육에서는 가정연합의 가치와 참부모님의 삶, 축복가정의 의미를 배웁니다. 상담을 통해 나에게 맞는 교육 일정과 과정을 자세히 안내받으실 수 있습니다.",
    sortOrder: 4,
    isDefaultVisible: true,
    isPublished: true,
  },
  {
    id: "faq-05",
    question: "배우자를 소개받을 수도 있나요?",
    answer:
      "네. 필요한 교육을 모두 마친 뒤, 같은 기준으로 준비된 상대와의 만남을 지역 담당자가 안내해 드립니다. 만남은 두 사람의 뜻이 확인된 이후에만 다음 단계로 이어집니다.",
    sortOrder: 5,
    isDefaultVisible: true,
    isPublished: true,
  },
];
