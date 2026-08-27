// 행복의 꽃 `/stories` — §6 P-03
import type { StoryCategory } from "@/integrations/supabase/types";

export const STORIES_HERO = {
  eyebrow: "OUR STORIES",
  title: "행복의 꽃",
  sub: "축복가정의 실제 이야기와 인터뷰를 만나보세요.",
};

/** 글 목록 섹션의 머리말. 아래 영상 블록과 구분해주는 역할입니다. */
export const STORIES_ARCHIVE_HEADING = {
  eyebrow: "STORIES & INSPIRATIONS",
  title: "아름다운 가정 이야기",
  body: "서로를 이해하고 함께 성장해 온 축복가정의 일상에서 길어 올린 이야기입니다.",
};

/** 한 번에 보여줄 카드 수 — 나머지는 "더 보기"로 이어 붙입니다(듀오 §1.5 페이지네이션). */
export const STORIES_PAGE_SIZE = 12;
export const STORIES_LOAD_MORE_LABEL = "더 보기";

export const STORY_CATEGORIES: { value: "all" | StoryCategory; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "interview", label: "인터뷰" },
  { value: "case", label: "사례" },
  { value: "video", label: "영상" },
];

export const STORY_CATEGORY_LABELS: Record<StoryCategory, string> = {
  interview: "인터뷰",
  case: "사례",
  video: "영상",
};

export const STORY_SORTS: { value: "latest" | "views"; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "views", label: "조회 많은순" },
];

export const STORIES_EMPTY_STATE = {
  title: "첫 번째 이야기를 준비하고 있어요",
  description: "곧 축복가정들의 진솔한 이야기를 만나보실 수 있습니다.",
  cta: { label: "축복결혼 알아보기", to: "/guide" },
};

/** 특정 카테고리를 선택했지만 그 카테고리에 글이 아직 없을 때 쓰는 안내(§EMPTY_STATE와 구분). */
export const STORIES_CATEGORY_EMPTY_STATE = {
  title: "이 카테고리에는 아직 이야기가 없어요",
  description: "다른 카테고리를 선택하시거나, 전체 이야기를 둘러보세요.",
};

export interface Story {
  id: string;
  slug: string;
  title: string;
  /**
   * 카드 제목으로 노출할 가정의 한마디(6축 개편 §4.3 — 듀오 성혼 인터뷰 형식).
   * 비어 있으면 title로 폴백합니다.
   */
  quote: string;
  /** 축복 유형 배지(예: 합동축복, 축복자녀). category(콘텐츠 형식)와 다른 축입니다. */
  blessingType: string;
  excerpt: string;
  /** 마크다운/리치텍스트 원문(§7.2). 이 프로젝트에는 아직 렌더러가 없어 줄바꿈만 살려 그대로 보여줍니다. */
  body: string;
  coverImageUrl: string;
  category: StoryCategory;
  /** 가정 표기(예: "김ㅇㅇ·이ㅇㅇ 가정"). 실명 대신 익명 표기를 권장합니다. */
  familyName: string;
  region: string;
  viewCount: number;
  isPublished: boolean;
  /** 게시 시각. 비어있으면(초안) 카드/목록에 노출되지 않습니다. */
  publishedAt: string | null;
  createdAt: string;
}

// 기본 스토리 — 가정행복국이 쓴 에디토리얼입니다.
//
// ⚠ 중요: 이 글들은 **실존 가정의 사연이 아닙니다.** 특정 가정의 1인칭 후기를 지어내
// 진짜처럼 싣는 것은 방문자를 오도하므로 하지 않습니다. 그래서 작성 주체를 협회로 두고
// (familyName을 비움) "우리 가족은 ~했어요"가 아니라 관점을 전하는 문체로 썼습니다.
// 실제 가정 사연은 축복가정 인터뷰 영상(§content/familyVideos.ts)이 맡습니다.
//
// 실제 인터뷰 원고가 확보되면 /admin/stories에서 category: "interview"로 추가하세요.
// Supabase가 연결되면 stories 테이블 값이 이 기본값을 대체합니다(§lib/stories.ts).
export const DEFAULT_STORIES: Story[] = [
  {
    id: "story-conversation-pause",
    slug: "daehwa-meomchum",
    title: "대화가 멈추는 자리에서 시작되는 것",
    quote: "말을 잘하는 것보다, 말이 멈춘 자리를 견디는 편이 더 어렵습니다.",
    blessingType: "대화와 관계",
    excerpt:
      "말문이 막히는 순간을 실패로 여기지 않는 가정이 오래 갑니다. 침묵은 관계가 끝나는 신호가 아니라, 서로의 속도를 맞추는 시간입니다.",
    body: `부부 상담에서 가장 자주 듣는 말은 "대화가 안 통한다"입니다. 그런데 조금 더 들어보면, 대화가 없어서가 아니라 대화가 늘 같은 자리에서 멈춰서인 경우가 많습니다.

멈추는 자리는 대개 정해져 있습니다. 돈, 양가 부모, 아이 교육, 그리고 서로의 신앙 생활. 이 주제가 나오면 목소리가 조금 높아지고, 한 사람은 설명하려 하고 다른 한 사람은 입을 닫습니다.

여기서 중요한 것은 그 자리를 없애는 게 아닙니다. 없앨 수 없습니다. 오래 가는 가정은 그 자리를 알아보고, 그날은 더 밀지 않기로 서로 합의합니다. "이 얘기는 주말에 다시 하자"고 말할 수 있는 사이가 되는 것. 그게 대화의 기술입니다.

말을 잘하는 것보다, 말이 멈춘 자리를 견디는 편이 더 어렵습니다. 그리고 그 견딤이 쌓인 만큼 두 사람은 서로에게 안전해집니다.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
    category: "case",
    familyName: "",
    region: "",
    viewCount: 0,
    isPublished: true,
    publishedAt: "2026-08-20T09:00:00+09:00",
    createdAt: "2026-08-20T09:00:00+09:00",
  },
  {
    id: "story-ordinary-days",
    slug: "pyeongbeomhan-haru",
    title: "평범한 하루가 가정을 만듭니다",
    quote: "가정은 특별한 날이 아니라 반복되는 하루로 지어집니다.",
    blessingType: "일상",
    excerpt:
      "기념일보다 평일 저녁이 가정을 만듭니다. 매일 같은 시간에 마주 앉는 30분이 어떤 이벤트보다 오래 남습니다.",
    body: `축복결혼을 준비하는 분들이 가장 많이 상상하는 장면은 예식입니다. 흰 옷, 함께 선 수많은 부부, 사진. 물론 그날은 특별합니다.

그런데 가정을 실제로 만드는 것은 그다음 날부터의 평범한 하루입니다. 누가 먼저 일어나 물을 끓이는지, 저녁에 무슨 이야기를 나누는지, 지친 날 서로에게 어떤 표정을 짓는지.

한 해에 특별한 날은 며칠뿐이고 나머지는 전부 평일입니다. 그래서 좋은 가정은 큰 결심이 아니라 작은 반복으로 만들어집니다. 매일 같은 시간에 마주 앉아 30분 이야기하기, 자기 전에 하루를 한 문장으로 나누기 같은 것들입니다.

거창하지 않아서 오래 갈 수 있습니다. 오래 가기 때문에 가정이 됩니다.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80",
    category: "case",
    familyName: "",
    region: "",
    viewCount: 0,
    isPublished: true,
    publishedAt: "2026-08-18T09:00:00+09:00",
    createdAt: "2026-08-18T09:00:00+09:00",
  },
  {
    id: "story-different-homes",
    slug: "seoro-dareun-jip",
    title: "서로 다른 집에서 자란 두 사람",
    quote: "다름은 고쳐야 할 문제가 아니라, 먼저 이해해야 할 사실입니다.",
    blessingType: "대화와 관계",
    excerpt:
      "명절에 몇 시에 도착하는지, 아플 때 어떻게 돌보는지. 사소해 보이는 습관이 사실은 서로 다른 집의 문화입니다.",
    body: `결혼은 두 사람의 만남이자 두 집의 문화가 만나는 일입니다.

어떤 집은 아플 때 조용히 혼자 두는 것이 배려입니다. 어떤 집은 곁에 앉아 계속 말을 거는 것이 사랑입니다. 두 사람이 각자의 방식으로 최선을 다하는데도 서운함이 생기는 이유가 여기 있습니다.

이때 필요한 것은 누가 옳은지 가리는 일이 아니라, "우리 집에서는 이랬다"를 서로 말해보는 일입니다. 상대의 행동이 무례가 아니라 습관이었다는 걸 알게 되면 대부분의 서운함은 힘을 잃습니다.

다름은 고쳐야 할 문제가 아니라, 먼저 이해해야 할 사실입니다. 이해한 다음에야 두 사람만의 방식을 새로 정할 수 있습니다.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80",
    category: "case",
    familyName: "",
    region: "",
    viewCount: 0,
    isPublished: true,
    publishedAt: "2026-08-14T09:00:00+09:00",
    createdAt: "2026-08-14T09:00:00+09:00",
  },
  {
    id: "story-quiet-time",
    slug: "gatchi-meomchuneun-sigan",
    title: "같이 멈추는 시간",
    quote: "함께 기도하는 시간은 서로를 설득하지 않아도 되는 유일한 시간입니다.",
    blessingType: "기도와 묵상",
    excerpt:
      "가정예배는 종교 행사가 아니라, 하루에 한 번 두 사람이 같은 방향을 바라보는 시간입니다.",
    body: `가정예배를 부담스럽게 느끼는 분들이 많습니다. 형식을 갖춰야 할 것 같고, 잘 못하면 안 될 것 같아서입니다.

그런데 실제로 오래 이어가는 가정들을 보면 형식은 대개 소박합니다. 짧게 함께 읽고, 각자 한 가지씩 감사한 일을 말하고, 서로를 위해 기도합니다. 십 분이면 충분합니다.

이 시간의 힘은 내용보다 구조에 있습니다. 하루 중 유일하게 서로를 설득하지 않아도 되는 시간이기 때문입니다. 누가 옳은지 따지지 않고, 상대를 바꾸려 하지 않고, 그저 같은 방향을 바라봅니다.

싸운 날에도 이 시간을 지킨 가정은 다음 날 대화를 다시 시작할 자리가 남아 있습니다.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1000&q=80",
    category: "case",
    familyName: "",
    region: "",
    viewCount: 0,
    isPublished: true,
    publishedAt: "2026-08-11T09:00:00+09:00",
    createdAt: "2026-08-11T09:00:00+09:00",
  },
  {
    id: "story-after-conflict",
    slug: "datum-dwie-namneun-geot",
    title: "다툰 뒤에 남는 것",
    quote: "관계의 질은 싸우지 않는 데 있지 않고, 다툰 뒤에 무엇을 하는가에 있습니다.",
    blessingType: "대화와 관계",
    excerpt:
      "싸우지 않는 가정은 없습니다. 다만 회복하는 방법을 아는 가정과, 매번 처음부터 다시 싸우는 가정이 있을 뿐입니다.",
    body: `"저희는 한 번도 싸운 적이 없어요"라는 말을 들으면 오히려 걱정이 됩니다. 갈등이 없는 것이 아니라, 갈등을 꺼내지 못하고 있을 가능성이 크기 때문입니다.

중요한 것은 다투지 않는 것이 아니라 다툰 뒤에 무엇을 하는가입니다. 어떤 가정은 시간이 지나기만 기다립니다. 그러면 같은 문제로 몇 년째 같은 자리에서 다시 싸우게 됩니다.

회복하는 가정은 자기들만의 절차를 가지고 있습니다. 먼저 말을 거는 사람이 정해져 있기도 하고, "아까 그 말은 이런 뜻이었어"라고 다시 설명하는 습관이 있기도 합니다. 대단한 방법이 아니라 정해진 방법이라는 점이 핵심입니다.

관계의 질은 싸우지 않는 데 있지 않고, 다툰 뒤에 무엇을 하는가에 있습니다.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
    category: "case",
    familyName: "",
    region: "",
    viewCount: 0,
    isPublished: true,
    publishedAt: "2026-08-07T09:00:00+09:00",
    createdAt: "2026-08-07T09:00:00+09:00",
  },
  {
    id: "story-neighbors",
    slug: "iutgwa-nanuneun-gajeong",
    title: "문을 여는 가정",
    quote: "가정의 행복은 지킬수록 줄고, 나눌수록 늘어납니다.",
    blessingType: "나눔",
    excerpt:
      "우리 가정만 잘 지내면 된다고 생각할 때 가정은 작아집니다. 문을 열어둔 가정이 오히려 단단해집니다.",
    body: `가정을 잘 지키려는 마음이 때로는 가정을 좁게 만듭니다. 밖의 일에 마음을 쓰지 않고 우리끼리만 화목하면 된다고 생각할 때, 그 가정은 조금씩 작아집니다.

반대로 이웃에게 문을 열어둔 가정은 신기하게도 안이 더 단단해집니다. 손님을 맞으려면 서로 협력해야 하고, 다른 가정의 어려움을 보면 우리 문제가 다르게 보입니다.

거창한 봉사를 말하는 것이 아닙니다. 이사 온 이웃에게 인사하기, 아이 친구를 집에 초대하기, 힘든 시기를 지나는 가정에 밥 한 끼 챙기기 정도입니다.

가정의 행복은 지킬수록 줄고, 나눌수록 늘어납니다.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
    category: "case",
    familyName: "",
    region: "",
    viewCount: 0,
    isPublished: true,
    publishedAt: "2026-08-04T09:00:00+09:00",
    createdAt: "2026-08-04T09:00:00+09:00",
  },
];
