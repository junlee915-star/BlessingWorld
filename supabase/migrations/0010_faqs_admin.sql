-- faqs 관리자 쓰기 정책 — §8.4 FAQ 관리(/admin/faq).
-- 0001_init.sql은 공개 조회 정책만 만들고 쓰기 정책은 비워뒀습니다(stories와 같은 사안,
-- §0009_stories_admin.sql 참고). courses/churches/stories와 같은 패턴으로
-- is_staff_or_admin() 헬퍼(§0004_fix_profiles_rls_recursion.sql)를 그대로 씁니다.

create policy "staff can manage faqs" on faqs
  for all to authenticated
  using (public.is_staff_or_admin(auth.uid()))
  with check (public.is_staff_or_admin(auth.uid()));
