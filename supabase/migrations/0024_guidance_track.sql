-- guidance_requests에 본인/부모 분기 컬럼 추가 — §14 개선안 P-13(§14.4.3).
-- 현재 거의 모든 CTA가 축복상담 신청 하나로 수렴해, 자녀의 축복을 준비하는 부모가
-- 신청서를 채울 때 본인 전용 문구·항목만 보게 되는 문제를 보완합니다. §14.8②에서
-- "별도 접수 경로를 둘지, 기존 테이블에 컬럼만 추가할지"를 결정 필요 사항으로 남겨뒀는데,
-- 이 마이그레이션은 그중 더 단순한 쪽(기존 테이블에 nullable 컬럼 추가)을 택했습니다 —
-- 기존 조회·정렬·파기 로직을 전혀 건드리지 않는 완전히 부가적인 변경입니다.
alter table guidance_requests
  add column if not exists track text not null default 'self' check (track in ('self', 'parent'));

alter table guidance_requests
  add column if not exists child_age_band text
    check (child_age_band is null or child_age_band in ('10s', '20s', '30s', '40s_plus'));

alter table guidance_requests
  add column if not exists child_awareness text
    check (child_awareness is null or child_awareness in ('aware_positive', 'aware_undecided', 'unaware'));

create index if not exists guidance_requests_track_idx on guidance_requests (track);
