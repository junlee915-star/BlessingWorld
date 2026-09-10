// 매칭플랜 시트 `/parents/plan-sheet` — §14 개선안 P-12 ②.
// 부모와 자녀가 각자 작성해 맞춰보는 워크시트. 참조 사이트(familymatching.info)는 PDF로
// 배포하지만, 여기서는 화면 입력 + 인쇄(@media print)로 구현합니다. 개인정보를 수집하지
// 않는 도구로 유지하기 위해 전송 기능은 두지 않고 localStorage에만 저장합니다
// (§lib/parentsPlanSheet.ts).
export const PLAN_SHEET_HERO = {
  eyebrow: "MATCHING PLAN SHEET",
  title: "매칭플랜 시트",
  body: "부모와 자녀가 같은 질문에 각자 답해보는 워크시트입니다. 정답을 맞추는 표가 아닙니다 — 다른 칸이 대화의 시작점입니다.",
};

export interface PlanSheetQuestion {
  id: string;
  label: string;
  placeholder: string;
}

export interface PlanSheetSection {
  id: string;
  title: string;
  questions: PlanSheetQuestion[];
}

export const PLAN_SHEET_SECTIONS: PlanSheetSection[] = [
  {
    id: "faith",
    title: "신앙과 삶의 방향",
    questions: [
      {
        id: "faith-1",
        label: "가정의 신앙생활을 어느 정도로 함께하기를 바라나요?",
        placeholder: "예: 주일예배는 꼭 함께, 그 외에는 각자 편한 대로",
      },
    ],
  },
  {
    id: "life",
    title: "생활 기반",
    questions: [
      {
        id: "life-1",
        label: "거주 지역, 맞벌이, 거리에 대해 어떻게 생각하나요?",
        placeholder: "예: 맞벌이 희망, 거주지는 직장 접근성 우선",
      },
    ],
  },
  {
    id: "person",
    title: "사람에 대하여",
    questions: [
      {
        id: "person-1",
        label: "성격·대화 방식에서 중요하게 생각하는 점은 무엇인가요?",
        placeholder: "예: 갈등이 있을 때 바로 대화로 푸는 사람",
      },
      {
        id: "person-2",
        label: "반대로, 양보할 수 있는 점은 무엇인가요?",
        placeholder: "예: 외모나 직업 조건은 크게 상관없음",
      },
    ],
  },
  {
    id: "timing",
    title: "시기",
    questions: [
      {
        id: "timing-1",
        label: "언제쯤 축복을 생각하고 있나요?",
        placeholder: "예: 구체적인 시기보다 좋은 상대를 먼저",
      },
    ],
  },
  {
    id: "international",
    title: "국제축복",
    questions: [
      {
        id: "international-1",
        label: "국제축복을 고려하나요? 그렇다면 어느 정도까지 열려 있나요?",
        placeholder: "예: 언어가 통하면 국가는 상관없음 / 국내만 희망",
      },
    ],
  },
];

export const PLAN_SHEET_COPY = {
  parentColumn: "부모",
  childColumn: "자녀",
  footnote: "정답을 맞추는 표가 아닙니다. 다른 칸이 대화의 시작점입니다.",
  printCta: "인쇄하기",
  clearCta: "모두 지우기",
  clearConfirm: "작성한 내용을 모두 지울까요? 이 기기에 저장된 내용만 사라지며, 되돌릴 수 없습니다.",
  privacyNote: "이 시트에 입력한 내용은 이 기기에만 저장되며, 어디로도 전송되지 않습니다.",
};
