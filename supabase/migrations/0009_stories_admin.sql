-- stories 관리자 쓰기 정책 — §8.4 스토리 관리(/admin/stories).
-- 0001_init.sql은 "쓰기는 admin만(별도 서비스 롤/함수에서 처리)"라는 주석만 남기고
-- 실제 정책은 만들지 않았습니다. courses(§0002)/churches(§0005)와 같은 패턴으로
-- is_staff_or_admin() 헬퍼(§0004_fix_profiles_rls_recursion.sql)를 그대로 씁니다.

create policy "staff can manage stories" on stories
  for all to authenticated
  using (public.is_staff_or_admin(auth.uid()))
  with check (public.is_staff_or_admin(auth.uid()));
