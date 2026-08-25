// 푸터 — §5.2. 모든 페이지 공통.
// ※ §10 I-02, I-03: 원본은 표기(운영기관명·답변 소요시간)가 페이지마다 달랐음.
//   재구현본에서는 "세계평화통일가정연합 한국협회 가정행복지원국 축복가정부" /
//   "영업일 기준 1~2일 이내" 로 전 페이지 통일.
export const ORG_NAME = "세계평화통일가정연합 한국협회";
export const ORG_DEPARTMENT = "가정행복지원국 축복가정부";
export const RESPONSE_TIME = "영업일 기준 1~2일 이내";
export const CONTACT_PHONE_DISPLAY = "02-3000-3000";
export const CONTACT_PHONE_TEL = "tel:0230003000";
export const CONTACT_HOURS = "평일 09:00–18:00";

export const FOOTER_CONTENT = {
  brand: "블레싱월드",
  description: `블레싱월드는 ${ORG_NAME} ${ORG_DEPARTMENT}이 운영하는 축복결혼·가정생활 통합 안내 서비스입니다.`,
  blocks: [
    {
      title: "운영기관",
      body: `${ORG_NAME}\n${ORG_DEPARTMENT}`,
    },
    {
      title: "답변 소요 시간",
      body: `신청 후 ${RESPONSE_TIME}\n지역 담당자 연락`,
    },
    {
      title: "개인정보 및 서비스 문의",
      body: `${ORG_NAME}\n${ORG_DEPARTMENT}`,
    },
    {
      title: "상담 중단·정보 삭제",
      body: "담당자에게 요청하시면 연락을 중단하고\n관련 절차에 따라 개인정보를 파기합니다.",
    },
  ],
  legalLinks: [
    { label: "개인정보처리방침", path: "/privacy" },
    { label: "이용약관", path: "/terms" },
    // /admin/curriculum은 RequireAdmin으로 보호됩니다(§components/admin/RequireAdmin.tsx) —
    // 로그인 안 한 방문자는 /admin/login으로 리다이렉트되고, staff/admin이 아니면 접근이 막혀요.
    { label: "관리자", path: "/admin/curriculum" },
  ],
  copyright: "© 2026 블레싱월드. All rights reserved.",
};
