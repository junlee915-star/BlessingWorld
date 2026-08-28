-- 가치관 진단 12문항(§src/content/valuesAssessment.ts) 결과 — 축복상담 신청(§Onboarding.tsx)
-- 안의 선택 단계에서 신청자가 "결과 첨부하고 신청서 작성하기"를 고른 경우에만 채워집니다.
-- 상담 담당자만 조회할 수 있으며(기존 guidance_requests RLS 그대로 적용), 다른 회원에게는
-- 공개되지 않습니다.

alter table guidance_requests add column if not exists values_assessment jsonb;
