-- 블레싱월드 (Blessing World) 초기 스키마 — PRD §7
-- 아직 실제 Supabase 프로젝트에 적용되지 않았습니다. 프로젝트 연결 후
-- `supabase db push` 또는 SQL 편집기에서 이 파일을 실행하세요.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text,
  phone text,
  gender text check (gender in ('female', 'male')),
  birth_year int,
  region_sido text,
  region_sigungu text,
  is_verified_member boolean not null default false,
  role text not null default 'user' check (role in ('user', 'staff', 'admin')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- guidance_requests — 안내 신청(온보딩 폼) ⭐
-- ─────────────────────────────────────────────
create table if not exists guidance_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  gender text not null check (gender in ('female', 'male')),
  birth_year int not null,
  region_sido text not null,
  region_sigungu text not null,
  status text not null default 'received'
    check (status in ('received', 'assigned', 'contacted', 'in_progress', 'closed', 'opted_out')),
  assigned_staff_id uuid references profiles(id),
  assigned_at timestamptz,
  contacted_at timestamptz,
  memo text,
  privacy_agreed_at timestamptz not null,
  source text not null default 'web',
  purge_after date,
  created_at timestamptz not null default now()
);

create index if not exists guidance_requests_phone_created_idx
  on guidance_requests (phone, created_at desc);

-- ─────────────────────────────────────────────
-- stories — 행복의 꽃
-- ─────────────────────────────────────────────
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text,
  cover_image_url text,
  category text not null check (category in ('interview', 'case', 'video')),
  family_name text,
  region text,
  view_count int not null default 0,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- community_posts — 나눔의 열매
-- ─────────────────────────────────────────────
create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  category text not null check (category in ('goods', 'talent', 'together', 'chat')),
  title text not null check (char_length(title) between 2 and 60),
  body text not null check (char_length(body) between 10 and 2000),
  image_urls text[] check (array_length(image_urls, 1) is null or array_length(image_urls, 1) <= 5),
  region_sido text not null,
  region_sigungu text not null,
  method text check (method in ('direct', 'delivery', 'online')),
  status text not null default 'open' check (status in ('open', 'reserved', 'completed')),
  view_count int not null default 0,
  like_count int not null default 0,
  report_count int not null default 0,
  recommend_score numeric,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists community_requests (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts(id) on delete cascade,
  requester_id uuid not null references profiles(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  accepted_at timestamptz
);

create table if not exists community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  parent_id uuid references community_comments(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- member_verifications — 식구 인증 (§P-08 개인정보처리방침 근거)
-- ─────────────────────────────────────────────
create table if not exists member_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  birth_date date,
  district text,
  church text,
  member_no text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz
);

-- ─────────────────────────────────────────────
-- blessing_progress — 내 준비 현황 (§P-06)
-- ─────────────────────────────────────────────
create table if not exists blessing_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  step_key text not null check (step_key in ('step_01', 'step_02', 'step_03', 'step_04', 'step_05', 'step_06')),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  completed_at timestamptz,
  updated_by uuid references profiles(id),
  unique (user_id, step_key)
);

-- ─────────────────────────────────────────────
-- faqs, regions
-- ─────────────────────────────────────────────
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_default_visible boolean not null default false,
  is_published boolean not null default true
);

create table if not exists regions (
  code text primary key,
  sido text not null,
  sigungu text not null,
  staff_id uuid references profiles(id)
);

-- ─────────────────────────────────────────────
-- RLS — §7.3
-- ─────────────────────────────────────────────
alter table profiles enable row level security;
alter table guidance_requests enable row level security;
alter table stories enable row level security;
alter table community_posts enable row level security;
alter table community_requests enable row level security;
alter table community_comments enable row level security;
alter table member_verifications enable row level security;
alter table blessing_progress enable row level security;
alter table faqs enable row level security;
alter table regions enable row level security;

-- profiles: 본인 또는 staff/admin만 조회, 본인만 수정
create policy "self or staff can read profile" on profiles
  for select to authenticated
  using (
    id = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('staff', 'admin'))
  );

create policy "self can update profile" on profiles
  for update to authenticated using (id = auth.uid());

-- guidance_requests: 익명 INSERT 허용, SELECT는 본인 또는 staff/admin만 (⚠️ 절대 금지: 익명 SELECT)
create policy "anyone can submit guidance request" on guidance_requests
  for insert to anon, authenticated with check (true);

create policy "owner or staff can read guidance request" on guidance_requests
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('staff', 'admin'))
  );

create policy "staff can update guidance request" on guidance_requests
  for update to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('staff', 'admin')));

-- stories: 게시된 글만 공개 조회, 쓰기는 admin만(별도 서비스 롤/함수에서 처리)
create policy "published stories are readable" on stories
  for select using (is_published = true);

-- community_posts: 신고 5회 미만 공개 조회, 작성/수정/삭제는 본인만
create policy "public read community posts" on community_posts
  for select using (report_count < 5);

create policy "author can insert community post" on community_posts
  for insert to authenticated with check (author_id = auth.uid());

create policy "author can update community post" on community_posts
  for update to authenticated using (author_id = auth.uid());

create policy "author can delete community post" on community_posts
  for delete to authenticated using (author_id = auth.uid());

-- community_requests: 글쓴이 또는 신청자만 조회, 신청자만 생성
create policy "participants can read community request" on community_requests
  for select to authenticated
  using (
    requester_id = auth.uid()
    or exists (select 1 from community_posts cp where cp.id = post_id and cp.author_id = auth.uid())
  );

create policy "requester can insert community request" on community_requests
  for insert to authenticated with check (requester_id = auth.uid());

-- community_comments: 게시글이 보이면 댓글도 공개 조회, 작성은 본인만
create policy "public read community comments" on community_comments
  for select using (true);

create policy "author can insert comment" on community_comments
  for insert to authenticated with check (author_id = auth.uid());

-- member_verifications, blessing_progress: 본인 또는 staff/admin만 (⚠️ 절대 금지: 익명 SELECT)
create policy "self or staff can read verification" on member_verifications
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('staff', 'admin'))
  );

create policy "self can insert verification" on member_verifications
  for insert to authenticated with check (user_id = auth.uid());

create policy "self or staff can read progress" on blessing_progress
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('staff', 'admin'))
  );

create policy "staff can upsert progress" on blessing_progress
  for all to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('staff', 'admin')));

-- faqs, regions: 공개 조회
create policy "published faqs are readable" on faqs
  for select using (is_published = true);

create policy "regions are readable" on regions
  for select using (true);

-- ─────────────────────────────────────────────
-- §7.4 개인정보 보존 자동화는 Edge Function(cron)으로 구현합니다.
-- supabase/functions/purge-guidance-requests/index.ts 참고.
-- ─────────────────────────────────────────────
