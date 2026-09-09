-- 사랑의 기술 강좌 재구성 — 축복결혼 이해를 돕는 YouTube 영상 강좌 6편.
-- src/content/curriculum.ts의 DEFAULT_COURSES와 동일한 내용으로 맞춥니다.
-- 0002_courses.sql의 기존 4강좌 시드(step-01~step-04)를 덮어쓰고 step-05·step-06을 추가합니다.
-- video_url은 YouTube 임베드 형식(https://www.youtube.com/embed/<id>) — CourseDetail이
-- 이 값을 그대로 <iframe src>에 씁니다.

insert into courses (id, order_no, title, instructor, duration_minutes, description, video_url, is_published)
values
  ('step-01', 1, '1강. 통일교 축복결혼 소개 — 인류 한가족의 꿈', '세계평화통일가정연합', null,
    '인류가 국경과 인종을 넘어 한 가족을 이루는 꿈, 그 꿈의 실현을 위한 ''축복''의 의미를 짧게 소개합니다.',
    'https://www.youtube.com/embed/WIuNwgA7SmE', true),
  ('step-02', 2, '2강. 축복 Q&A 몰아보기', '세계평화통일가정연합', null,
    '축복결혼을 두고 자주 나오는 궁금증들을 Q&A 형식으로 한 번에 정리한 영상입니다.',
    'https://www.youtube.com/embed/ZeQOYFvtI8o', true),
  ('step-03', 3, '3강. 축복과 참가정 (1)', '원리 강의 15강', null,
    '축복이 왜 참된 가정으로 이어지는지, 그 원리적 바탕을 15강에서 차근차근 살펴봅니다.',
    'https://www.youtube.com/embed/Xi-xMWoRIS4', true),
  ('step-04', 4, '4강. 축복과 참가정 (2)', '원리 강의 16강', null,
    '앞 강의에 이어, 참가정의 완성과 축복의 섭리적 의미를 16강에서 마저 풀어냅니다.',
    'https://www.youtube.com/embed/4XfK2hpzCCE', true),
  ('step-05', 5, '5강. 축복가정 이야기 — 리칸 소성 시릴 ❤️ 한정인', '세계평화통일가정연합', null,
    '국경과 문화를 넘어 한 가정을 이룬 국제 축복가정의 실제 이야기를 소개 영상으로 만나봅니다.',
    'https://www.youtube.com/embed/yhKySLoLi5M', true),
  ('step-06', 6, '6강. 2026 효정천주축복식 — 참가정의 출발', '세계평화통일가정연합', null,
    '''참가정의 출발''을 주제로 한 2026 효정천주축복식 현장 영상. 축복식이 지니는 의미를 함께 나눕니다.',
    'https://www.youtube.com/embed/cUOPFtZPXds', true)
on conflict (id) do update set
  order_no        = excluded.order_no,
  title           = excluded.title,
  instructor      = excluded.instructor,
  duration_minutes = excluded.duration_minutes,
  description     = excluded.description,
  video_url       = excluded.video_url,
  is_published    = excluded.is_published;
