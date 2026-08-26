-- §8.4 신청 관리(/admin/guidance) + §7.4 개인정보 자동 파기 완성.
--
-- guidance_requests에는 이미 purge_after 컬럼과 이를 쓰는 supabase/functions/
-- purge-guidance-requests가 있었지만, purge_after를 실제로 채워주는 로직이 어디에도
-- 없어서 그 함수는 지금까지 아무것도 지우지 못하는 죽은 코드였습니다. 이 마이그레이션이
-- 그 빈 자리(status가 'closed'로 바뀌는 시점을 기록하고, 그로부터 1년 뒤로 purge_after를
-- 계산하는 부분)를 채웁니다.

alter table guidance_requests add column if not exists closed_at timestamptz;

-- status 전이 시 담당 타임스탬프를 자동으로 채웁니다. 관리자 화면(§8.4)은 status만
-- 바꾸면 되고, assigned_at/contacted_at/closed_at·purge_after는 여기서 서버가 채웁니다.
create or replace function public.guidance_requests_stamp_status_transition()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    if new.status = 'assigned' and new.assigned_at is null then
      new.assigned_at := now();
    elsif new.status = 'contacted' and new.contacted_at is null then
      new.contacted_at := now();
    elsif new.status = 'closed' and new.closed_at is null then
      new.closed_at := now();
      new.purge_after := (now() + interval '1 year')::date;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists guidance_requests_guard_status_transition on guidance_requests;
create trigger guidance_requests_guard_status_transition
  before update on guidance_requests
  for each row execute function public.guidance_requests_stamp_status_transition();

-- §7.4 "삭제 이력은 개인식별정보 없이 audit_log 테이블에 건수만 기록".
-- purge-guidance-requests 함수는 SUPABASE_SERVICE_ROLE_KEY로 실행되어 RLS를 우회하므로
-- 별도 insert 정책이 필요 없습니다 — staff/admin의 조회만 허용합니다.
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  count int not null default 0,
  created_at timestamptz not null default now()
);

alter table audit_log enable row level security;

create policy "staff can read audit log" on audit_log
  for select to authenticated
  using (public.is_staff_or_admin(auth.uid()));
