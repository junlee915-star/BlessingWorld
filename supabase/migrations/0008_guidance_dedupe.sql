-- guidance_requests 중복 방지 — §P-07 "중복 방지: 동일 전화번호 24시간 내 재신청 시 안내 메시지".
--
-- guidance_requests는 익명 SELECT가 금지되어 있어(§0001_init.sql "owner or staff can read
-- guidance request") 클라이언트(§src/lib/guidance.ts)가 직접 "최근 24시간 내 같은 번호가
-- 있는지" 조회해서 막을 수 없습니다. 대신 INSERT 시점에 서버(트리거)가 검사하고,
-- 중복이면 예외를 던져 클라이언트가 그 실패를 안내 메시지로 바꿔 보여줍니다.
-- is_staff_or_admin()과 같은 이유로 SECURITY DEFINER로 만들어 RLS를 우회해서 조회합니다.

create or replace function public.guidance_requests_check_duplicate_phone()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if exists (
    select 1 from guidance_requests
    where phone = new.phone
      and created_at > now() - interval '24 hours'
  ) then
    -- 메시지 본문을 §src/lib/guidance.ts에서 그대로 문자열 매칭해 reason: "duplicate_phone"으로
    -- 변환합니다. 문구를 바꾸려면 그쪽도 함께 바꿔야 합니다.
    raise exception 'duplicate_phone_24h' using errcode = 'BW001';
  end if;
  return new;
end;
$$;

drop trigger if exists guidance_requests_guard_duplicate_phone on guidance_requests;
create trigger guidance_requests_guard_duplicate_phone
  before insert on guidance_requests
  for each row execute function public.guidance_requests_check_duplicate_phone();
