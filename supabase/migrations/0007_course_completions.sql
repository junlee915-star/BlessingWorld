-- course_completions — 회원 마이페이지(/mypage) · 관리자 회원 현황판(/admin/members).
-- 로그인한 회원이 /curriculum에서 "다 들었어요"를 누르면 계정에 저장되어 기기 간
-- 동기화되고, staff/admin이 전체 회원의 이수 현황을 확인할 수 있습니다. 비로그인
-- 방문자의 진행 상태는 여전히 §P-04②대로 이 브라우저의 localStorage에만 남습니다
-- (§src/lib/courses.ts getCompletedCourses/saveCompletedCourses) — 이 테이블은 그
-- 로컬 기록을 대체하지 않고, 로그인한 회원에 한해 서버에도 함께 남기는 것입니다.

create table if not exists course_completions (
  user_id uuid not null references profiles(id) on delete cascade,
  course_id text not null references courses(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create index if not exists course_completions_user_idx on course_completions (user_id);

alter table course_completions enable row level security;

-- 본인 것은 스스로 자유롭게 읽고 쓰고 지울 수 있습니다(로그인 후 /curriculum 토글, /mypage 조회).
create policy "self can manage own course completions" on course_completions
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- staff/admin은 /admin/members에서 전체 회원의 이수 현황을 조회만 할 수 있습니다(쓰기는 본인만).
create policy "staff can read all course completions" on course_completions
  for select to authenticated
  using (public.is_staff_or_admin(auth.uid()));
