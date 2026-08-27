-- courses — 축복교육 강좌 (Guide §STEP_JOURNEY 03과 연결, /guide/curriculum, /admin/curriculum)
-- 0001_init.sql과 마찬가지로 아직 실제 프로젝트에 적용되지 않았습니다.

create table if not exists courses (
  id text primary key,                 -- 사람이 읽을 수 있는 고정 슬러그 (예: 'step-01')
  order_no int not null default 0,
  title text not null,
  instructor text,
  duration_minutes int,
  description text,
  video_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists courses_order_idx on courses (order_no);

alter table courses enable row level security;

-- 공개 조회: 게시된 강좌는 누구나 조회 가능 (강좌 목록 페이지)
create policy "published courses are readable" on courses
  for select using (is_published = true);

-- 관리: staff/admin만 등록·수정·삭제.
-- ⚠️ 이 프로젝트에는 아직 로그인/관리자 인증 화면이 없습니다(src/pages/admin/CourseAdmin.tsx
-- 참고). 실제 운영에 연결하기 전에 관리자 인증을 먼저 구현하고, 그 전까지는 이 정책이
-- 익명 쓰기를 막아주는 유일한 방어선입니다 — 절대 "to anon"으로 완화하지 마세요.
create policy "staff can manage courses" on courses
  for all to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('staff', 'admin')))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('staff', 'admin')));

-- 기본 4강좌 시드 (src/content/curriculum.ts의 DEFAULT_COURSES와 동일)
insert into courses (id, order_no, title, instructor, duration_minutes, description, is_published)
values
  ('step-01', 1, '1강. 축복결혼이란 무엇인가', '가정행복국', 25,
    '축복결혼의 정의와 역사, 왜 ''축복''이라 부르는지를 소개합니다.', true),
  ('step-02', 2, '2강. 참사랑과 가정의 가치', '가정행복국', 30,
    '참사랑의 의미와 가정이 사랑과 평화가 시작되는 자리인 이유를 배웁니다.', true),
  ('step-03', 3, '3강. 참부모님의 삶과 축복의 역사', '가정행복국', 35,
    '참부모님의 삶의 여정과 축복결혼이 걸어온 역사를 함께 돌아봅니다.', true),
  ('step-04', 4, '4강. 축복가정으로 살아가기', '가정행복국', 28,
    '축복을 받은 이후 가정생활에서 실천하는 태도와 준비를 안내합니다.', true)
on conflict (id) do nothing;
