-- churches — 지역교회 연결 (가정민원실 §src/components/civil-affairs/ChurchFinder.tsx,
-- 관리 §src/pages/admin/ChurchAdmin.tsx). 0004에서 만든 is_staff_or_admin() 헬퍼를 그대로 씁니다.

create table if not exists churches (
  id text primary key,
  region_sido text not null,
  region_sigungu text not null,
  name text not null,
  address text,
  phone text,
  contact_name text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists churches_region_idx on churches (region_sido, region_sigungu);

alter table churches enable row level security;

create policy "published churches are readable" on churches
  for select using (is_published = true);

create policy "staff can manage churches" on churches
  for all to authenticated
  using (public.is_staff_or_admin(auth.uid()))
  with check (public.is_staff_or_admin(auth.uid()));

-- 예시(placeholder) 데이터 — src/content/churches.ts의 DEFAULT_CHURCHES와 동일.
-- 운영자가 /admin/churches에서 실제 지역교회 명단으로 교체해야 합니다.
insert into churches (id, region_sido, region_sigungu, name, address, phone, contact_name, is_published)
values
  ('seoul-gangnam', '서울', '강남구', '서울강남교회', '서울특별시 강남구 (주소 입력 필요)', '02-000-0001', '담당자 미지정', true),
  ('gyeonggi-suwon', '경기', '수원시', '수원교회', '경기도 수원시 (주소 입력 필요)', '031-000-0002', '담당자 미지정', true),
  ('busan-haeundae', '부산', '해운대구', '부산해운대교회', '부산광역시 해운대구 (주소 입력 필요)', '051-000-0003', '담당자 미지정', true)
on conflict (id) do nothing;
