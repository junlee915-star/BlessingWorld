// 사랑의 기술 강좌 — 축복로드맵 02단계 "배우기"와 연결되는 학습 콘텐츠(6축 개편 §4.4).
// 명칭은 "사랑의 기술"로 통일합니다(구 축복가치교육 / 축복교육).
// Supabase의 `courses` 테이블이 연결되지 않은 환경(M1+M2)에서는 아래 기본값을
// 그대로 사용하고, 연결되면 실제 테이블 값으로 대체됩니다. §src/lib/courses.ts 참고.

export const CURRICULUM_HERO = {
  eyebrow: "THE ART OF LOVE",
  title: "사랑은 감정이 아니라\n배울 수 있는 기술입니다",
  body: "축복결혼을 이해하는 데 도움이 되는 영상 강좌를 모았습니다. 순서대로 들어도, 궁금한 강좌부터 골라 들어도 괜찮아요.",
  subtitle: "영상 강좌 모음",
};

/** 강좌 확인 퀴즈 문항 — 평가가 아니라 학습 확인이 목적입니다(재응시 무제한·점수 비공개). */
export interface QuizQuestion {
  q: string;
  choices: string[];
  /** 정답 보기의 인덱스(0부터). */
  answer: number;
}

export interface Course {
  /** 사람이 읽을 수 있는 고정 슬러그. Supabase 연결 전에도 진행 상태 저장의 기준 키로 씁니다. */
  id: string;
  order: number;
  title: string;
  instructor: string;
  durationMinutes: number;
  description: string;
  /** 비워두면 "영상 준비 중" 안내로 대체됩니다. */
  videoUrl: string;
  isPublished: boolean;
  /**
   * 확인 퀴즈. 비어 있으면 퀴즈 없이 '다 들었어요'만으로 이수 처리합니다.
   * 문항 작성은 교육 담당자 몫이라 기본값에는 넣지 않았습니다 — /admin/curriculum에서 등록하세요.
   */
  quiz?: QuizQuestion[];
  /** 이수 처리 기준 점수(%). 미지정 시 DEFAULT_PASS_SCORE. */
  passScore?: number;
}

/** 퀴즈 통과 기준 기본값(%) — 확정 사항 5. */
export const DEFAULT_PASS_SCORE = 60;

// 영상은 YouTube 임베드 URL(https://www.youtube.com/embed/<id>)로 넣습니다 —
// CourseDetail이 videoUrl을 그대로 <iframe src>에 씁니다. 원본 링크는 각 줄에 주석으로 남겨둡니다.
export const DEFAULT_COURSES: Course[] = [
  {
    id: "step-01",
    order: 1,
    title: "1강. 통일교 축복결혼 소개 — 인류 한가족의 꿈",
    instructor: "세계평화통일가정연합",
    durationMinutes: 0,
    description:
      "인류가 국경과 인종을 넘어 한 가족을 이루는 꿈, 그 꿈의 실현을 위한 '축복'의 의미를 짧게 소개합니다.",
    // https://youtu.be/WIuNwgA7SmE
    videoUrl: "https://www.youtube.com/embed/WIuNwgA7SmE",
    isPublished: true,
  },
  {
    id: "step-02",
    order: 2,
    title: "2강. 축복 Q&A 몰아보기",
    instructor: "세계평화통일가정연합",
    durationMinutes: 0,
    description:
      "축복결혼을 두고 자주 나오는 궁금증들을 Q&A 형식으로 한 번에 정리한 영상입니다.",
    // https://youtu.be/ZeQOYFvtI8o
    videoUrl: "https://www.youtube.com/embed/ZeQOYFvtI8o",
    isPublished: true,
  },
  {
    id: "step-03",
    order: 3,
    title: "3강. 축복과 참가정 (1)",
    instructor: "원리 강의 15강",
    durationMinutes: 0,
    description:
      "축복이 왜 참된 가정으로 이어지는지, 그 원리적 바탕을 15강에서 차근차근 살펴봅니다.",
    // https://youtu.be/Xi-xMWoRIS4
    videoUrl: "https://www.youtube.com/embed/Xi-xMWoRIS4",
    isPublished: true,
  },
  {
    id: "step-04",
    order: 4,
    title: "4강. 축복과 참가정 (2)",
    instructor: "원리 강의 16강",
    durationMinutes: 0,
    description:
      "앞 강의에 이어, 참가정의 완성과 축복의 섭리적 의미를 16강에서 마저 풀어냅니다.",
    // https://youtu.be/4XfK2hpzCCE
    videoUrl: "https://www.youtube.com/embed/4XfK2hpzCCE",
    isPublished: true,
  },
  {
    id: "step-05",
    order: 5,
    title: "5강. 축복가정 이야기 — 리칸 소성 시릴 ❤️ 한정인",
    instructor: "세계평화통일가정연합",
    durationMinutes: 0,
    description:
      "국경과 문화를 넘어 한 가정을 이룬 국제 축복가정의 실제 이야기를 소개 영상으로 만나봅니다.",
    // https://youtu.be/yhKySLoLi5M
    videoUrl: "https://www.youtube.com/embed/yhKySLoLi5M",
    isPublished: true,
  },
  {
    id: "step-06",
    order: 6,
    title: "6강. 2026 효정천주축복식 — 참가정의 출발",
    instructor: "세계평화통일가정연합",
    durationMinutes: 0,
    description:
      "'참가정의 출발'을 주제로 한 2026 효정천주축복식 현장 영상. 축복식이 지니는 의미를 함께 나눕니다.",
    // https://youtu.be/cUOPFtZPXds
    videoUrl: "https://www.youtube.com/embed/cUOPFtZPXds",
    isPublished: true,
  },
];

export const CURRICULUM_VIDEO_PLACEHOLDER = "강의 영상은 준비 중이에요. 먼저 강좌 소개를 확인해보세요.";

export const QUIZ_COPY = {
  heading: "확인 퀴즈",
  lead: "맞히는 것이 목적이 아니라, 방금 들은 내용을 한 번 되짚어보는 시간입니다. 몇 번이든 다시 풀 수 있어요.",
  submit: "채점하기",
  retry: "다시 풀기",
  passed: "잘 이해하셨어요. 이수 처리해드릴게요.",
  failed: "조금만 더 살펴볼까요? 강의를 다시 보고 한 번 더 풀어보세요.",
};

export const CURRICULUM_FINAL_CTA = {
  title: "강좌를 모두 들으셨나요?",
  body: "이제 지역 담당자와 함께 다음 걸음을 이야기해보세요.",
  // ref=curriculum: /onboarding이 §P-04 교육 이수를 거쳐 왔음을 알고 안내 문구와
  // 제출 페이로드(completed_courses)에 반영할 수 있게 하는 연계 파라미터(§P-07).
  cta: { label: "축복결혼 안내 신청하기", to: "/center/apply?ref=curriculum" },
};
