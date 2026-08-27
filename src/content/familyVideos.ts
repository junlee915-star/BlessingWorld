// 행복의 꽃 `/stories` 영상 블록 — 원본 사이트(온기정원)의 FAMILY WORSHIP /
// BLESSED FAMILY INTERVIEW 두 섹션을 옮긴 것입니다(2026-08-27 실측).
//
// 영상은 YouTube에 있고 이 사이트는 링크만 겁니다. 썸네일도 유튜브가 제공하는
// i.ytimg.com 주소를 그대로 쓰므로 별도 이미지 관리가 필요 없습니다.
// 새 영상이 올라오면 이 파일의 배열 맨 앞에 추가하고, 이전 항목의 isNew만 지우세요.

export interface FamilyVideo {
  /** YouTube watch id — 링크와 썸네일이 이 값에서 만들어집니다. */
  id: string;
  title: string;
  /** 화면 표기용 날짜 문자열. 원본 표기를 그대로 옮깁니다. */
  publishedLabel: string;
  /** 최신 영상 한 건에만 붙입니다. */
  isNew?: boolean;
}

export interface VideoRail {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  /** "전체 보기"가 향하는 YouTube 재생목록. */
  playlistUrl: string;
  videos: FamilyVideo[];
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** 유튜브가 제공하는 기본 썸네일. 별도 이미지 업로드·관리가 필요 없습니다. */
export function youtubeThumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}

// 노출 순서: 축복가정 인터뷰 → 가정예배.
// 글 목록(아름다운 가정 이야기)이 먼저 오고, 그다음 실제 가정의 인터뷰, 마지막이 예배 영상입니다
// — 방문자가 사람 이야기부터 만나고 신앙 콘텐츠로 넘어가는 순서입니다.
export const VIDEO_RAILS: VideoRail[] = [
  {
    id: "blessed-family-interview",
    eyebrow: "BLESSED FAMILY INTERVIEW",
    title: "축복가정 인터뷰",
    playlistUrl: "https://www.youtube.com/playlist?list=PLwgyuMsn4VC1lTi-QHQP1vKM-hXQz0kxZ",
    videos: [
      {
        id: "qhqXVE9q32k",
        title:
          "[축복가정인터뷰] 한국과 일본, 서로 다른 두 나라의 만남… 🌊 하지만 너무나 닮은 한일 국제부부의 축복스토리 💞",
        publishedLabel: "2026년 3월 10일",
        isNew: true,
      },
      {
        id: "chPMmv9uGQY",
        title: "[축복가정인터뷰] 경상도와 제주의 만남,,,🌴꿀뚝뚝 동갑내기 신혼부부의 축복스토리🍯",
        publishedLabel: "2026년 7월 21일",
      },
      {
        id: "Y7s6hdmmC3w",
        title:
          "[축복가정인터뷰] 공직이라는 공통점으로 만난 운명적 만남…🧡서로를 배려하며 이제는 같은 꿈을 꾸기까지💌 축복스토리",
        publishedLabel: "2026년 7월 21일",
      },
      {
        id: "gmxZPK7EgXg",
        title:
          "[축복가정인터뷰] 헌수를 하며 만난 나의 짝…🧡어색한 첫 만남을 뒤로하고 서로 보듬기까지💌 축복스토리",
        publishedLabel: "2026년 7월 21일",
      },
    ],
  },
  {
    id: "family-worship",
    eyebrow: "FAMILY WORSHIP",
    title: "우리 가족 행복한 날 가정예배",
    playlistUrl: "https://www.youtube.com/playlist?list=PLwgyuMsn4VC1k6QzqBnRDK_Fm_3mCGFHm",
    videos: [
      {
        id: "J6aFq2VbZnM",
        title: "천일국 가정예배 | 26년 8월 둘째 주 | 노력",
        publishedLabel: "2026년 8월 6일",
        isNew: true,
      },
      {
        id: "m2BB3cEZ1ow",
        title: "천일국 가정예배 | 26년 8월 첫째 주 | 목표",
        publishedLabel: "2026년 7월 30일",
      },
    ],
  },
];

export const VIDEO_RAIL_MORE_LABEL = "전체 보기";
