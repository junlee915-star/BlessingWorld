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
    // "축복톡톡" 재생목록의 최신 4편(2026-09-10 실측). 이 재생목록 RSS
    // (youtube.com/feeds/videos.xml?playlist_id=PLAqn3szZyCaY)는 중간에 비공개 영상이
    // 하나 있어 최신 3건까지만 내려주므로, 4번째(mjjJo5IZhYo)는 재생목록 페이지에서 직접
    // 확인했습니다. 새 영상이 올라오면 맨 앞에 추가하고, 4편을 넘기면 가장 오래된 항목을
    // 지우고, 이전 1위의 isNew만 떼세요.
    playlistUrl: "https://www.youtube.com/playlist?list=PLAqn3szZyCaY",
    videos: [
      {
        id: "-OzVgb7WOH8",
        title:
          "\"여보 얘기 좀 하자\" 극E 아내를 만난 극I 남편의 최후ㅋㅋ #정반대커플 #장거리연애 #통일교결혼",
        publishedLabel: "2026년 9월 8일",
        isNew: true,
      },
      {
        id: "IkyMDOkdsHw",
        title:
          "15일만에 초고속 약혼, 2달 만에 결혼?! 20대 엄빠의 달달한 신혼 일기💕 #통일교 #가정연합 #초고속결혼 #신혼부부",
        publishedLabel: "2026년 9월 7일",
      },
      {
        id: "BwMO7dd89sI",
        title: "10년 친구사이였다가 부부로?! │ 창원-아산 장거리 커플",
        publishedLabel: "2026년 9월 2일",
      },
      {
        id: "mjjJo5IZhYo",
        title:
          "15년 전 수련회 첫사랑과 결혼! 통일교 축복가정 20대 부부의 진짜 가정행복 스토리💕 #통일교 #가정연합 #축복가정 #신혼부부 #결혼",
        publishedLabel: "2026년 8월 20일",
      },
    ],
  },
  {
    id: "family-worship",
    eyebrow: "FAMILY WORSHIP",
    title: "우리 가족 행복한 날 가정예배",
    // "천일국 가정예배(시즌2)" 재생목록의 최신 4편(2026-09-09 실측). 새 영상이 올라오면
    // 이 재생목록 RSS(youtube.com/feeds/videos.xml?playlist_id=PLJaCQu-qe010)를 보고
    // 맨 앞에 추가하고, 5번째 항목은 지우고, 이전 1위의 isNew만 떼면 됩니다.
    playlistUrl: "https://www.youtube.com/playlist?list=PLJaCQu-qe010",
    videos: [
      {
        id: "ox9lPdyqbfE",
        title: "천일국 가정예배 | 26년 9월 첫째 주 | 전진",
        publishedLabel: "2026년 9월 3일",
        isNew: true,
      },
      {
        id: "WpbM0ZXseNs",
        title: "천일국 가정예배 | 26년 8월 다섯째 주 | 아버지",
        publishedLabel: "2026년 8월 27일",
      },
      {
        id: "_S6kPmpopkU",
        title: "천일국 가정예배 | 26년 8월 넷째 주 | 성장",
        publishedLabel: "2026년 8월 20일",
      },
      {
        id: "8XG27UAV8fY",
        title: "천일국 가정예배 | 26년 8월 셋째 주 | 도전",
        publishedLabel: "2026년 8월 14일",
      },
    ],
  },
];

export const VIDEO_RAIL_MORE_LABEL = "전체 보기";
