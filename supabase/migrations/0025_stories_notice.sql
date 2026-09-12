-- 축복의 꽃에 "본부 소식"(가정연합 홈페이지 뉴스 등)을 게시할 수 있도록 stories를 확장합니다.
-- 배경: §0021_stories_education_category.sql이 category에 'education'을 추가한 것과 같은 이유로,
-- 이번엔 'notice'(본부 소식)를 추가합니다. 이런 소식은 원문 링크와 여러 장의 사진(갤러리)을
-- 함께 신는 경우가 많은데, 기존 stories에는 cover_image_url 1장만 있어 부족했습니다.

alter table stories drop constraint if exists stories_category_check;
alter table stories add constraint stories_category_check
  check (category in ('interview', 'case', 'video', 'education', 'notice'));

alter table stories add column if not exists source_url text;
alter table stories add column if not exists gallery_image_urls text[]
  check (array_length(gallery_image_urls, 1) is null or array_length(gallery_image_urls, 1) <= 20);

-- 이번 마일스톤에서 실제로 게시하는 첫 '본부 소식' 글 — §content/stories.ts의 DEFAULT_STORIES
-- 오프라인 기본값과 같은 내용입니다(§0013_seed_stories.sql과 같은 패턴). slug 충돌 시
-- 아무것도 하지 않습니다 — 운영자가 admin에서 고쳐 둔 내용을 덮어쓰지 않기 위해서입니다.
insert into stories
  (slug, title, quote, blessing_type, excerpt, body, cover_image_url,
   category, family_name, region, source_url, gallery_image_urls, is_published, published_at)
values
  ($BW$hyojeong-gamun-sangsok-camp-2026$BW$,
   $BW$김종출 정정순 천보가정 제1회 효정가문 상속 캠프예배$BW$,
   $BW$효정가문 상속 캠프예배 현장의 기록입니다.$BW$,
   $BW$효정가문 상속$BW$,
   $BW$김종출·정정순 천보가정이 주관한 제1회 효정가문 상속 캠프예배 소식을 가정연합 홈페이지에서 옮겨왔습니다.$BW$,
   $BW$가정연합(세계평화통일가정연합) 홈페이지에 게시된 본부 소식을 옮겨 싣습니다.

김종출·정정순 천보가정이 주관한 제1회 효정가문 상속 캠프예배 현장 소식입니다. 원문 게시글에는 캠프예배 현장 사진과 함께 결과보고서(PDF)가 첨부되어 있습니다.

자세한 내용과 원문 결과보고서는 아래 "원문 보기" 링크에서 확인하실 수 있습니다.$BW$,
   $BW$https://www.ffwp.org/ffwpData/ckeditor/content/202609/20260908233730_65.jpg$BW$,
   'notice', null, null,
   $BW$https://www.ffwp.org/list/blank_view_all.php?menuKey=13&subKey=98&numberKey=28174&page=1$BW$,
   ARRAY[
     $BW$https://www.ffwp.org/ffwpData/ckeditor/content/202609/20260908223730_32.jpg$BW$,
     $BW$https://www.ffwp.org/ffwpData/ckeditor/content/202609/20260908223730_52.jpg$BW$,
     $BW$https://www.ffwp.org/ffwpData/ckeditor/content/202609/20260908223749_87.jpg$BW$,
     $BW$https://www.ffwp.org/ffwpData/ckeditor/content/202609/20260908223749_29.jpg$BW$,
     $BW$https://www.ffwp.org/ffwpData/ckeditor/content/202609/20260908223806_76.jpg$BW$,
     $BW$https://www.ffwp.org/ffwpData/ckeditor/content/202609/20260908223806_13.jpg$BW$,
     $BW$https://www.ffwp.org/ffwpData/ckeditor/content/202609/20260908223806_50.jpg$BW$,
     $BW$https://www.ffwp.org/ffwpData/ckeditor/content/202609/20260908223806_65.jpg$BW$,
     $BW$https://www.ffwp.org/ffwpData/ckeditor/content/202609/20260908223806_66.jpg$BW$
   ]::text[],
   true, '2026-09-08T00:00:00+09:00')
on conflict (slug) do nothing;
