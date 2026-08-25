// 축복교육 강좌 — Guide §STEP_JOURNEY 03 "축복교육"과 연결되는 학습 콘텐츠.
// Supabase의 `courses` 테이블이 연결되지 않은 환경(M1+M2)에서는 아래 기본값을
// 그대로 사용하고, 연결되면 실제 테이블 값으로 대체됩니다. §src/lib/courses.ts 참고.

export const CURRICULUM_HERO = {
  eyebrow: "BLESSING EDUCATION",
  title: "축복교육 4강좌로 차근차근 알아가요",
  body: "축복결혼이 궁금한 분들을 위한 4개의 강좌입니다. 순서대로 들어도, 궁금한 강좌부터 골라 들어도 괜찮아요.",
};

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
}

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

export const CURRICULUM_FINAL_CTA = {
  title: "4강좌를 모두 들으셨나요?",
  body: "이제 지역 담당자와 함께 다음 걸음을 이야기해보세요.",
  cta: { label: "축복결혼 안내 신청하기", to: "/onboarding" },
};
