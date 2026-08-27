// 축복로드맵 `/roadmap` — 6축 개편 §4.5.
// 가치(축복의 씨앗)와 행동(축복센터) 사이에서 "어떤 순서로 진행되는가"만 답하는 페이지입니다.
// 서류 원문은 여기서 나열하지 않고 /center/documents로 넘깁니다.
//
// 단계 키(step_01~step_08)는 Supabase `blessing_progress.step_key` 및 `roadmap_steps.key`와
// 같은 값입니다. 순서를 바꾸려면 세 곳을 함께 바꿔야 합니다.

export const ROADMAP_HERO = {
  eyebrow: "YOUR ROADMAP",
  title: "축복까지, 여덟 걸음",
  body: "한 번에 다 준비하지 않아도 괜찮습니다. 지금 서 있는 자리에서 다음 한 걸음만 보시면 됩니다.",
};

export interface RoadmapStep {
  key: string;
  no: string;
  title: string;
  description: string;
  /** 확정되지 않은 기간은 비워둡니다 — 화면에서 배지 자체가 사라집니다(추정치 표기 금지). */
  durationLabel?: string;
  to?: { label: string; href: string };
  /** 본인이 진행할 수 없고 연락을 기다리는 단계임을 알립니다. */
  waiting?: boolean;
}

export const DEFAULT_ROADMAP_STEPS: RoadmapStep[] = [
  {
    key: "step_01",
    no: "01",
    title: "알아보기",
    description: "축복결혼이 어떤 약속인지 편하게 살펴봅니다. 결심하지 않아도 괜찮은 단계입니다.",
    to: { label: "축복의 씨앗 보기", href: "/guide" },
  },
  {
    key: "step_02",
    no: "02",
    title: "배우기",
    description: "사랑의 기술 4강좌로 가정의 가치를 익힙니다. 순서대로 들어도, 골라 들어도 됩니다.",
    to: { label: "사랑의 기술 4강좌", href: "/curriculum" },
  },
  {
    key: "step_03",
    no: "03",
    title: "상담 신청하기",
    description:
      "온라인 신청서를 작성하면 가까운 지역가정교회에서 연락드립니다. 상담은 무료이고 언제든 중단할 수 있습니다.",
    to: { label: "축복상담 신청하기", href: "/center/apply" },
  },
  {
    key: "step_04",
    no: "04",
    title: "상담 받기",
    description:
      "지역가정교회에서 1:1로 궁금한 점을 나눕니다. 방문·전화·화상 중 편한 방식을 고르실 수 있습니다.",
    to: { label: "우리 지역 교회 찾기", href: "/center/churches" },
  },
  {
    key: "step_05",
    no: "05",
    title: "서류 준비하기",
    description:
      "축복후보자 유형에 맞는 서류를 준비합니다. 아래 준비도 진단으로 남은 서류를 먼저 확인해보세요.",
    to: { label: "제출서류·심사기준 보기", href: "/center/documents" },
  },
  {
    key: "step_06",
    no: "06",
    title: "심사",
    description: "제출한 서류로 축복후보자 심사를 받습니다. 보완이 필요하면 담당자가 안내드립니다.",
  },
  {
    key: "step_07",
    no: "07",
    title: "매칭·약혼",
    description: "상대를 소개받고 서로의 뜻을 확인합니다.",
    waiting: true,
  },
  {
    key: "step_08",
    no: "08",
    title: "축복식",
    description: "축복결혼식에 참여하고, 두 사람의 새로운 가정을 시작합니다.",
  },
];

/** 7단계처럼 본인이 진행할 수 없는 단계에 붙는 안내 — 이탈이 아니라 대기임을 알립니다. */
export const WAITING_NOTE =
  "이 단계는 기다리는 시간입니다. 진행이 멈춘 것이 아니니, 연락이 올 때까지 편히 기다려 주세요.";

export const READINESS = {
  eyebrow: "READINESS CHECK",
  title: "축복 준비도 진단",
  body: "해당하는 유형을 고르고 이미 준비된 서류를 체크해보세요. 남은 서류가 무엇인지 바로 알려드립니다.",
  privacyNote: "체크한 내용은 이 브라우저에만 남고 어디에도 전송되지 않습니다.",
};

export const ROADMAP_FINAL_CTA = {
  title: "다음 한 걸음이 궁금하다면",
  body: "지금 어느 단계에 계시든, 상담에서 남은 과정을 함께 정리해드립니다.",
  cta: { label: "축복상담 신청하기", to: "/center/apply" },
  badges: ["무료 상담", "1~2영업일 내 지역 안내", "언제든 연락 중단 가능"],
};
