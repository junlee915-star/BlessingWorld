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
  icon: "ClipboardList" | "MapPin" | "FileCheck" | "HeartHandshake";
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
  {
    // §14 개선안 §14.6 — GNB 최상단에 있던 "가치관 진단"을 축복센터 하위로 옮겼습니다.
    // 상담 신청과는 별개로 부담 없이 접근하는 성격은 그대로 두되, GNB 항목 수를 줄입니다.
    id: "values",
    badge: "부담 없이",
    title: "가치관 진단",
    description: "12문항으로 나의 성향과 잘 맞는 상대 스타일을 미리 확인해볼 수 있습니다.",
    to: "/values",
    cta: "진단 시작하기",
    icon: "HeartHandshake",
  },
];

/** 상담 방식 — 듀오식 '상담 일정 예약' 대신 방식만 받습니다(6축 개편 확정사항 3). */
export const CONSULT_METHODS = [
  { value: "visit", label: "교회 방문", hint: "가까운 지역가정교회에서 직접 만나요" },
  { value: "phone", label: "전화", hint: "통화로 편하게 이야기해요" },
  { value: "video", label: "화상", hint: "영상통화로 얼굴 보며 이야기해요" },
] as const;

// §14 개선안 P-13(§14.4.3) — 축복상담 신청 CTA 하나로 수렴하던 것을 준비도에 따라
// 나눕니다. 여기서는 ②당사자/③부모 두 갈래를 같은 신청서 안에서 track으로 구분합니다
// (①탐색 저문턱 접점은 별도 논의 — §14.8②).
export const GUIDANCE_TRACK_OPTIONS = [
  { value: "self", label: "본인 신청", hint: "축복을 알아보고 계신 본인이 직접 신청해요" },
  { value: "parent", label: "부모로서 신청", hint: "자녀의 축복을 준비하는 부모님이 신청해요" },
] as const;

export const CHILD_AGE_BAND_OPTIONS = [
  { value: "10s", label: "10대" },
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s_plus", label: "40대 이상" },
] as const;

export const CHILD_AWARENESS_OPTIONS = [
  { value: "aware_positive", label: "자녀도 알고 긍정적이에요" },
  { value: "aware_undecided", label: "자녀는 알지만 아직 마음을 정하지 못했어요" },
  { value: "unaware", label: "아직 자녀에게 이야기하지 않았어요" },
] as const;

export const CENTER_ASSURANCE = {
  title: "상담 전에 알아두시면 좋아요",
  items: [
    { title: "상담은 무료입니다", body: "어떤 비용도 청구되지 않습니다." },
    { title: "결정은 본인이 합니다", body: "상담을 받았다고 축복을 신청해야 하는 것은 아닙니다." },
    { title: "언제든 중단할 수 있습니다", body: "연락을 원하지 않으시면 바로 중단해드립니다." },
  ],
};
