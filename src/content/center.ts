// 축복센터 `/center` — 6축 개편 §4.6.
// "지금 무엇을 하면 되는가"만 답하는 허브입니다. 가치 설명(=/guide)이나 절차 나열(=/roadmap)을
// 여기서 반복하지 마세요.
export const CENTER_HERO = {
  eyebrow: "BLESSING CENTER",
  title: "축복을 결심하셨다면, 여기서 시작하세요",
  body: "상담 신청부터 지역가정교회 찾기, 제출서류 확인까지 한곳에 모았습니다.",
};

export interface CenterEntry {
  id: string;
  badge: string;
  title: string;
  description: string;
  to: string;
  cta: string;
  icon: "ClipboardList" | "MapPin" | "FileCheck";
}

export const CENTER_ENTRIES: CenterEntry[] = [
  {
    id: "apply",
    badge: "STEP 03",
    title: "축복상담 신청",
    description:
      "이름과 연락처, 편한 상담 방식만 알려주시면 가까운 지역가정교회에서 연락드립니다.",
    to: "/center/apply",
    cta: "신청서 작성하기",
    icon: "ClipboardList",
  },
  {
    id: "churches",
    badge: "STEP 04",
    title: "지역가정교회 찾기",
    description: "우리 지역 담당 가정교회의 위치와 연락처를 확인하고 직접 문의하실 수 있습니다.",
    to: "/center/churches",
    cta: "우리 지역 찾기",
    icon: "MapPin",
  },
  {
    id: "documents",
    badge: "STEP 05",
    title: "제출서류·심사기준",
    description: "축복후보자 유형별로 준비할 서류와 심사기준을 원문 그대로 확인하실 수 있습니다.",
    to: "/center/documents",
    cta: "서류 확인하기",
    icon: "FileCheck",
  },
];

/** 상담 방식 — 듀오식 '상담 일정 예약' 대신 방식만 받습니다(6축 개편 확정사항 3). */
export const CONSULT_METHODS = [
  { value: "visit", label: "교회 방문", hint: "가까운 지역가정교회에서 직접 만나요" },
  { value: "phone", label: "전화", hint: "통화로 편하게 이야기해요" },
  { value: "video", label: "화상", hint: "영상통화로 얼굴 보며 이야기해요" },
] as const;

export const CENTER_ASSURANCE = {
  title: "상담 전에 알아두시면 좋아요",
  items: [
    { title: "상담은 무료입니다", body: "어떤 비용도 청구되지 않습니다." },
    { title: "결정은 본인이 합니다", body: "상담을 받았다고 축복을 신청해야 하는 것은 아닙니다." },
    { title: "언제든 중단할 수 있습니다", body: "연락을 원하지 않으시면 바로 중단해드립니다." },
  ],
};
