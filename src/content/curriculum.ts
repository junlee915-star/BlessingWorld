// 사랑의 기술 강좌 — 축복로드맵 02단계 "배우기"와 연결되는 학습 콘텐츠(6축 개편 §4.4).
// 명칭은 "사랑의 기술"로 통일합니다(구 축복가치교육 / 축복교육 4강좌).
// Supabase의 `courses` 테이블이 연결되지 않은 환경(M1+M2)에서는 아래 기본값을
// 그대로 사용하고, 연결되면 실제 테이블 값으로 대체됩니다. §src/lib/courses.ts 참고.

export const CURRICULUM_HERO = {
  eyebrow: "THE ART OF LOVE",
  title: "사랑은 감정이 아니라\n배울 수 있는 기술입니다",
  body: "좋은 가정을 이루는 데 필요한 네 가지 기술을 강좌로 담았습니다. 순서대로 들어도, 궁금한 강좌부터 골라 들어도 괜찮아요.",
  subtitle: "축복가치교육 4강좌",
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

export const DEFAULT_COURSES: Course[] = [
  {
    id: "step-01",
    order: 1,
    title: "1강. 축복결혼이란 무엇인가",
    instructor: "가정행복지원국",
    durationMinutes: 25,
    description: "축복결혼의 정의와 역사, 왜 '축복'이라 부르는지를 소개합니다.",
    videoUrl: "",
    isPublished: true,
  },
  {
    id: "step-02",
    order: 2,
    title: "2강. 참사랑과 가정의 가치",
    instructor: "가정행복지원국",
    durationMinutes: 30,
    description: "참사랑의 의미와 가정이 사랑과 평화가 시작되는 자리인 이유를 배웁니다.",
    videoUrl: "",
    isPublished: true,
  },
  {
    id: "step-03",
    order: 3,
    title: "3강. 참부모님의 삶과 축복의 역사",
    instructor: "가정행복지원국",
    durationMinutes: 35,
    description: "참부모님의 삶의 여정과 축복결혼이 걸어온 역사를 함께 돌아봅니다.",
    videoUrl: "",
    isPublished: true,
  },
  {
    id: "step-04",
    order: 4,
    title: "4강. 축복가정으로 살아가기",
    instructor: "가정행복지원국",
    durationMinutes: 28,
    description: "축복을 받은 이후 가정생활에서 실천하는 태도와 준비를 안내합니다.",
    videoUrl: "",
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
  title: "4강좌를 모두 들으셨나요?",
  body: "이제 지역 담당자와 함께 다음 걸음을 이야기해보세요.",
  // ref=curriculum: /onboarding이 §P-04 교육 이수를 거쳐 왔음을 알고 안내 문구와
  // 제출 페이로드(completed_courses)에 반영할 수 있게 하는 연계 파라미터(§P-07).
  cta: { label: "축복결혼 안내 신청하기", to: "/center/apply?ref=curriculum" },
};
