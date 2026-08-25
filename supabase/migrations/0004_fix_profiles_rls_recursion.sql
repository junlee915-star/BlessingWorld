-- profiles를 포함한 여러 정책이 "본인 또는 staff/admin"을 확인할 때
-- `exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('staff','admin'))`
-- 형태로 profiles 테이블 자신을 다시 조회했습니다. 이 서브쿼리도 profiles의 SELECT RLS를
-- 다시 타면서 "infinite recursion detected in policy for relation profiles" 오류가
-- 발생합니다(courses에 로그인한 staff가 쓰기를 시도할 때도 같은 오류가 납니다).
--
-- 해결: role 조회를 RLS를 우회하는 SECURITY DEFINER 함수로 분리합니다. 함수 소유자가
-- (마이그레이션을 실행하는) postgres 역할이라 BYPASSRLS가 적용되어 재귀가 끊깁니다.

create or replace function public.is_staff_or_admin(check_uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p where p.id = check_uid and p.role in ('staff', 'admin')
  );
$$;

-- profiles
drop policy if exists "self or staff can read profile" on profiles;
create policy "self or staff can read profile" on profiles
  for select to authenticated
  using (id = auth.uid() or public.is_staff_or_admin(auth.uid()));

-- guidance_requests
drop policy if exists "owner or staff can read guidance request" on guidance_requests;
create policy "owner or staff can read guidance request" on guidance_requests
  for select to authenticated
  using (user_id = auth.uid() or public.is_staff_or_admin(auth.uid()));

drop policy if exists "staff can update guidance request" on guidance_requests;
create policy "staff can update guidance request" on guidance_requests
  for update to authenticated
  using (public.is_staff_or_admin(auth.uid()));

-- member_verifications
drop policy if exists "self or staff can read verification" on member_verifications;
create policy "self or staff can read verification" on member_verifications
  for select to authenticated
  using (user_id = auth.uid() or public.is_staff_or_admin(auth.uid()));

-- blessing_progress
drop policy if exists "self or staff can read progress" on blessing_progress;
create policy "self or staff can read progress" on blessing_progress
  for select to authenticated
  using (user_id = auth.uid() or public.is_staff_or_admin(auth.uid()));

drop policy if exists "staff can upsert progress" on blessing_progress;
create policy "staff can upsert progress" on blessing_progress
  for all to authenticated
  using (public.is_staff_or_admin(auth.uid()));

-- courses (§0002_courses.sql)
drop policy if exists "staff can manage courses" on courses;
create policy "staff can manage courses" on courses
  for all to authenticated
  using (public.is_staff_or_admin(auth.uid()))
  with check (public.is_staff_or_admin(auth.uid()));

-- profiles 셀프 승격 방지 트리거(§0003_auth.sql)도 같은 헬퍼로 통일합니다.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    if not public.is_staff_or_admin(auth.uid()) then
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$;
