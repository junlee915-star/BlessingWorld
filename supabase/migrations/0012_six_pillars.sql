-- 6축 개편(docs/2026-08-26_6축개편_설계.md §5.1)
-- 축복의 씨앗 / 행복의 꽃 / 사랑의 기술 / 축복로드맵 / 축복센터 / 축복관리자
-- 기존 테이블은 삭제하지 않고 컬럼만 추가합니다.

-- ─────────────────────────────────────────────
-- 1) 로드맵 8단계 — blessing_progress의 step_key 제약이 step_06까지라 확장이 필요합니다.
-- ─────────────────────────────────────────────
alter table blessing_progress drop constraint if exists blessing_progress_step_key_check;
alter table blessing_progress add constraint blessing_progress_step_key_check
  check (step_key in ('step_01','step_02','step_03','step_04',
                      'step_05','step_06','step_07','step_08'));

create table if not exists roadmap_steps (
  key text primary key check (key ~ '^step_0[1-8]$'),
  order_no int not null,
  title text not null,
  description text not null default '',
  duration_label text,          -- 확정 전에는 null → 화면에서 기간 배지 생략
  link_to text,
  link_label text,
  is_published boolean not null default true
);

alter table roadmap_steps enable row level security;
drop policy if exists "roadmap_steps read published" on roadmap_steps;
create policy "roadmap_steps read published" on roadmap_steps
  for select using (is_published);
drop policy if exists "roadmap_steps admin write" on roadmap_steps;
create policy "roadmap_steps admin write" on roadmap_steps
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','staff'))
  );

-- ─────────────────────────────────────────────
-- 2) 홈 수치 섹션 — 협회 제공값 + 기준일. basis_date가 없으면 화면에 노출하지 않습니다.
-- ─────────────────────────────────────────────
create table if not exists site_stats (
  key text primary key,
  label text not null,
  value bigint,
  basis_date date,
  unit text default '가정',
  display_order int not null default 0
);

alter table site_stats enable row level security;
drop policy if exists "site_stats read all" on site_stats;
create policy "site_stats read all" on site_stats for select using (true);
drop policy if exists "site_stats admin write" on site_stats;
create policy "site_stats admin write" on site_stats
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','staff'))
  );

-- 값(value)과 기준일(basis_date)은 협회 확정치를 관리자 화면에서 입력합니다.
-- 여기서는 노출할 지표의 자리만 만들어 둡니다 — 임의의 숫자를 넣지 마세요.
insert into site_stats (key, label, unit, display_order) values
  ('blessed_families',        '누적 축복가정',        '가정', 1),
  ('yearly_ceremony_families','올해 축복식 참여 가정', '가정', 2),
  ('course_completions',      '사랑의 기술 이수자',    '명',   3)
on conflict (key) do nothing;

-- ─────────────────────────────────────────────
-- 3) 행복의 꽃 — 인용문 제목 + 축복 유형 배지
--    category(interview|case|video)는 콘텐츠 '형식'이므로 재사용하지 않고 축을 분리합니다.
-- ─────────────────────────────────────────────
alter table stories add column if not exists quote text;
alter table stories add column if not exists blessing_type text;

-- ─────────────────────────────────────────────
-- 4) 사랑의 기술 — 강좌 확인 퀴즈
-- ─────────────────────────────────────────────
alter table courses add column if not exists quiz jsonb;
alter table courses add column if not exists pass_score int not null default 60;
alter table course_completions add column if not exists quiz_score int;

-- ─────────────────────────────────────────────
-- 5) 축복센터 신청 — 희망 상담 방식(일정 예약은 받지 않습니다)
-- ─────────────────────────────────────────────
alter table guidance_requests add column if not exists consult_method text;
alter table guidance_requests drop constraint if exists guidance_requests_consult_method_check;
alter table guidance_requests add constraint guidance_requests_consult_method_check
  check (consult_method is null or consult_method in ('visit','phone','video'));
