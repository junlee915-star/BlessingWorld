-- 관리자 로그인 — §src/pages/admin/Login.tsx, §src/lib/auth.tsx
-- 0001/0002와 마찬가지로 아직 실제 프로젝트에 적용되지 않았다면 순서대로 실행하세요.

-- ─────────────────────────────────────────────
-- auth.users에 새 계정이 생기면 profiles 행도 함께 만듭니다.
-- role은 항상 'user'로 시작합니다 — staff/admin 승격은 운영자가 SQL로 직접 부여하세요
-- (예: update profiles set role = 'admin' where email = '...';).
-- ─────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.email,
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- 자기 자신의 role을 staff/admin으로 셀프 승격하는 것을 막습니다.
-- (§7.3 "self can update profile" 정책은 role 컬럼을 별도로 막지 않으므로 필요)
-- ─────────────────────────────────────────────
-- auth.uid()가 NULL이 아닐 때만(= PostgREST를 거쳐 로그인한 사용자가 직접 호출했을 때만)
-- 가드를 적용합니다. postgres 역할로 직접 SQL을 실행하는 운영자(대시보드 SQL 편집기,
-- `psql`을 통한 초기 관리자 부여 등)는 이 가드의 대상이 아닙니다 — 그런 접근은 이미
-- DB 자격 증명 자체로 신뢰됩니다.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    if not exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('staff', 'admin')
    ) then
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();
