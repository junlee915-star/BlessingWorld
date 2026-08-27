// FAQ — §6 P-02 ⑤.
//
// 2026-08-27: 원본 사이트(온기정원)의 개편된 /guide에서 11문항 전부를 실제 답변과 함께
// 확보해 교체했습니다. 이전에는 1번만 확정이고 2~5번은 초안, 6번 이후는 질문조차
// 확보하지 못한 상태였습니다(그래서 isDraft 플래그를 두었으나 이제 불필요해 제거).
//
// 답변에는 비용·개인정보·중단 권리·거절 권리처럼 방문자가 결정을 내리기 전에 알아야 할
// 내용이 들어 있습니다. 임의로 축약하거나 완화하지 마세요 — 문구를 바꿔야 한다면
// 가정행복국 확인을 거쳐 /admin/faq에서 수정하세요.
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
    question: "축복결혼을 몰라도 상담받을 수 있나요?",
    answer:
      "네. 종교적 배경이나 관련 지식이 없어도 상담받을 수 있습니다. 먼저 궁금한 점과 현재 상황을 듣고, 축복결혼의 의미와 과정을 이해하기 쉬운 말로 설명해 드립니다.",
    sortOrder: 1,
    isDefaultVisible: true,
    isPublished: true,
  },
  {
    id: "faq-02",
    question: "상담을 받으면 바로 결혼해야 하나요?",
    answer:
      "아닙니다. 상담은 정보를 듣고 충분히 생각해 보는 과정입니다. 상담 후 참여하지 않아도 됩니다.",
    sortOrder: 2,
    isDefaultVisible: true,
    isPublished: true,
  },
  {
    id: "faq-03",
    question: "가정연합 회원이 아니어도 상담할 수 있나요?",
    answer:
      "네. 상담은 신앙 여부와 관계없이 가능합니다. 축복식의 종교적 의미와 참여 조건은 미리 솔직하게 안내합니다.",
    sortOrder: 3,
    isDefaultVisible: true,
    isPublished: true,
  },
  {
    id: "faq-04",
    question: "축복결혼은 일반 결혼과 무엇이 다른가요?",
    answer:
      "법적으로는 일반적인 결혼과 동일하게 혼인신고가 필요합니다. 축복결혼에는 부부가 하늘부모님을 중심으로 책임 있는 사랑과 가정의 가치를 실천하겠다고 약속하는 종교적 의미가 담겨 있습니다.",
    sortOrder: 4,
    isDefaultVisible: true,
    isPublished: true,
  },
  {
    id: "faq-05",
    question: "상담이나 교육을 받으면 교회에 가입해야 하나요?",
    answer:
      "상담 신청만으로 교회 회원이 되거나 종교 활동 참여가 의무화되지는 않습니다. 축복결혼의 종교적 의미와 이후 활동은 별도로 설명하며, 참여 여부는 본인이 결정합니다.",
    sortOrder: 5,
    isDefaultVisible: true,
    isPublished: true,
  },
  {
    id: "faq-06",
    question: "상담과 교육에 비용이 드나요?",
    answer:
      "상담은 무료입니다. 언제든지 편하게 문의해주세요. 교육·행사에서 발생할 수 있는 비용을 신청 전에 안내합니다.",
    sortOrder: 6,
    isDefaultVisible: false,
    isPublished: true,
  },
  {
    id: "faq-07",
    question: "배우자를 소개받을 수 있나요?",
    answer:
      "만남을 희망하는 경우 가치관과 희망 조건을 확인한 뒤 가능한 절차를 안내합니다. 소개나 만남이 결혼을 의미하지 않으며, 상대방 선택과 관계 지속 여부는 두 사람의 자유로운 의사에 따릅니다.",
    sortOrder: 7,
    isDefaultVisible: false,
    isPublished: true,
  },
  {
    id: "faq-08",
    question: "개인정보는 어디에 사용되나요?",
    answer:
      "상담과 만남 진행에 필요한 최소한의 정보만 수집하며, 수집 항목·이용 목적·보관 기간·공유 범위를 신청 전에 안내합니다. 동의하지 않은 정보는 상대방이나 외부 기관에 제공하지 않습니다.",
    sortOrder: 8,
    isDefaultVisible: false,
    isPublished: true,
  },
  {
    id: "faq-09",
    question: "상담이나 연락을 중간에 그만둘 수 있나요?",
    answer:
      "네. 언제든 상담 중단이나 추가 연락 거부를 요청할 수 있습니다. 중단에 따른 불이익은 없습니다.",
    sortOrder: 9,
    isDefaultVisible: false,
    isPublished: true,
  },
  {
    id: "faq-10",
    question: "부모님이나 담당자의 권유가 있어도 제가 원하지 않으면 거절할 수 있나요?",
    answer:
      "네. 결혼과 축복식 참여는 당사자의 자유롭고 충분한 동의를 바탕으로 이루어져야 합니다. 본인이 원하지 않으면 진행하지 않으며, 고민이 있을 때는 별도로 상담할 수 있습니다.",
    sortOrder: 10,
    isDefaultVisible: false,
    isPublished: true,
  },
  {
    id: "faq-11",
    question: "재혼이나 국제결혼도 상담할 수 있나요?",
    answer:
      "개인의 상황에 따라 안내 과정과 확인 사항이 달라질 수 있습니다. 재혼, 자녀가 있는 경우, 국제결혼을 고려하는 경우에도 먼저 상담을 통해 가능한 절차를 확인할 수 있습니다.",
    sortOrder: 11,
    isDefaultVisible: false,
    isPublished: true,
  },
];
