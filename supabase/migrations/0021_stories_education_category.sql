-- stories.category에 '교육'(education)을 추가 — 행복의 꽃 스토리 카테고리 확장.
-- 0001_init.sql의 check 제약은 ('interview', 'case', 'video')만 허용했습니다.
-- src/integrations/supabase/types.ts의 StoryCategory, src/content/stories.ts의
-- STORY_CATEGORIES / STORY_CATEGORY_LABELS와 맞춥니다.

alter table stories drop constraint if exists stories_category_check;
alter table stories
  add constraint stories_category_check
  check (category in ('interview', 'case', 'video', 'education'));
