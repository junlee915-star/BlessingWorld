-- course_reflections — 사랑의 기술 강좌를 다 들은 뒤 남기는 "느낀 점".
-- 강좌 상세(/curriculum/:courseId)에서 '다 들었어요' 또는 확인 퀴즈 통과 후 나타나는
-- 입력칸에 회원이 소감을 적으면 이 테이블에 저장되고, staff/admin이 /admin/reflections에서
-- 전체 소감을 모아 볼 수 있습니다.
--
-- course_completions(§0007)와 같은 구조입니다 — 로그인한 회원만 서버에 남고, 비로그인
-- 방문자의 소감은 그대로 이 브라우저의 localStorage에만 남습니다
-- (§src/lib/courseReflections.ts getLocalReflection/saveLocalReflection).

create table if not exists course_reflections (
  user_id uuid not null references profiles(id) on delete cascade,
  course_id text not null references courses(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

-- /admin/reflections는 강좌별·최신순으로 훑어보므로 그 순서에 맞춘 인덱스.
create index if not exists course_reflections_course_idx
  on course_reflections (course_id, updated_at desc);

-- 수정 시 updated_at을 서버가 갱신합니다(관리 화면 정렬 기준).
create or replace function public.touch_course_reflections_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists course_reflections_touch_updated_at on course_reflections;
create trigger course_reflections_touch_updated_at
  before update on course_reflections
  for each row execute function public.touch_course_reflections_updated_at();

alter table course_reflections enable row level security;

-- 본인 소감은 스스로 자유롭게 읽고 쓰고 지울 수 있습니다(강좌 상세에서 작성·수정, /mypage 조회 여지).
create policy "self can manage own course reflections" on course_reflections
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- staff/admin은 /admin/reflections에서 전체 소감을 조회만 할 수 있습니다(쓰기는 본인만).
-- is_staff_or_admin() 헬퍼(§0004_fix_profiles_rls_recursion.sql)를 그대로 씁니다.
create policy "staff can read all course reflections" on course_reflections
  for select to authenticated
  using (public.is_staff_or_admin(auth.uid()));
