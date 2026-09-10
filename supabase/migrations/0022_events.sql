-- events — 일정·공지 `/schedules` §14 개선안 P-13(§14.4.1). 0004의 is_staff_or_admin() 헬퍼를
-- 그대로 씁니다. churches(§0005)와 달리 예시 데이터를 심지 않습니다 — 실데이터 없이 배포된
-- 예시 데이터가 그대로 남는 문제(§14 개선안 I-25)를 반복하지 않기 위해, 빈 테이블로 시작해
-- 관리자가 /admin/events에서 실제 행사를 입력하기 전까지는 화면(및 GNB)에서 자연히 숨겨집니다.

create table if not exists events (
  id text primary key,
  category text not null check (category in ('ceremony', 'retreat', 'education', 'matching_meet', 'parents_seminar')),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  format text check (format in ('offline', 'online', 'hybrid')),
  venue text,
  audience text,
  fee text,
  apply_deadline date,
  payment_deadline date,
  apply_method text,
  host text,
  contact text,
  source_note text,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx on events (starts_at);

alter table events enable row level security;

create policy "published events are readable" on events
  for select using (is_published = true);

create policy "staff can manage events" on events
  for all to authenticated
  using (public.is_staff_or_admin(auth.uid()))
  with check (public.is_staff_or_admin(auth.uid()));
