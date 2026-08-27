-- 지역가정교회 명칭 정리 — "개척"이 붙은 교회명에서 "개척"을 제거합니다(0015에서 실 데이터로
-- 교체된 뒤 발견). 예: "북면 개척" -> "북면".

update churches set name = '북면' where id = '천원특별-북면-개척';
update churches set name = '상면' where id = '천원특별-상면-개척';
update churches set name = '조종' where id = '천원특별-조종-개척';
