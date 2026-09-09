-- 구글(OAuth)로 가입한 회원의 표시 이름 처리.
-- 이메일 가입은 raw_user_meta_data->>'display_name'에 이름이 담기지만, 구글 로그인은
-- 'full_name' / 'name'에 담깁니다. handle_new_user(§0003_auth.sql)가 두 경우를 모두
-- 처리하도록 coalesce 순서를 넓힙니다. 그 밖의 동작(role은 항상 'user', on conflict
-- do nothing)은 그대로입니다.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 트리거 자체는 0003에서 이미 auth.users에 걸려 있으므로 함수 본문만 교체하면 됩니다.
