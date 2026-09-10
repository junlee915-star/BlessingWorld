-- notices — 공지 `/notice` + 홈 공지 슬롯 §14 개선안 P-13(§14.4.2). 0004의
-- is_staff_or_admin() 헬퍼를 그대로 씁니다. events(§0022)와 같은 이유로 예시 데이터를
-- 심지 않습니다 — 게시 중인 공지가 없으면 홈 슬롯 자체가 렌더되지 않습니다(AC-30).

create table if not exists notices (
  id text primary key,
  title text not null,
  body text not null,
  level text not null default 'info' check (level in ('info', 'important')),
  starts_at timestamptz,
  ends_at timestamptz,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists notices_created_at_idx on notices (created_at desc);

alter table notices enable row level security;

create policy "published notices are readable" on notices
  for select using (is_published = true);

create policy "staff can manage notices" on notices
  for all to authenticated
  using (public.is_staff_or_admin(auth.uid()))
  with check (public.is_staff_or_admin(auth.uid()));
