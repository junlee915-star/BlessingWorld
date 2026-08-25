-- guidance_requests.completed_courses — §P-04(온라인교육과정) ↔ §P-07(온보딩) 연계.
-- /onboarding 제출 시점에 이 방문자의 브라우저(localStorage)에서 이수 완료로 표시된
-- 강좌 id 목록(§src/lib/courses.ts, courses.id)을 함께 기록해, 담당자가 상담 전에
-- 교육 이수 여부를 파악할 수 있게 합니다. 회원 로그인이 없는 흐름이라 FK는 걸지 않습니다.

alter table guidance_requests
  add column if not exists completed_courses text[];
