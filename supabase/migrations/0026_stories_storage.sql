-- 축복의 꽃(stories) 커버/갤러리 이미지를 URL 붙여넣기뿐 아니라 파일로 직접 올릴 수
-- 있도록 공개 Storage 버킷을 만듭니다. §lib/stories.ts uploadStoryImage()가 이 버킷에
-- 업로드하고 공개 URL을 받아옵니다.
--
-- 누구나 읽을 수 있어야(공개 이미지) 하고, 올리기/바꾸기/지우기는 stories 테이블과
-- 같은 기준(§0009_stories_admin.sql)으로 staff/admin만 허용합니다.

insert into storage.buckets (id, name, public)
values ('story-images', 'story-images', true)
on conflict (id) do nothing;

create policy "public can read story images" on storage.objects
  for select using (bucket_id = 'story-images');

create policy "staff can upload story images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'story-images' and public.is_staff_or_admin(auth.uid()));

create policy "staff can update story images" on storage.objects
  for update to authenticated
  using (bucket_id = 'story-images' and public.is_staff_or_admin(auth.uid()))
  with check (bucket_id = 'story-images' and public.is_staff_or_admin(auth.uid()));

create policy "staff can delete story images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'story-images' and public.is_staff_or_admin(auth.uid()));
