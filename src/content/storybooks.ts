// 축복의 씨앗 "축복의 의미와 가치" 각 STEP에서 남성/여성을 고르면 보이는 스토리북
// (그림 6컷 + 내레이션 형식의 짧은 이야기). 실제 원고/그림이 준비된 조합만 이 배열에
// 들어있고, 나머지 조합은 src/pages/StorybookDetail.tsx가 ComingSoon으로 대신 보여준다.

const IMG = (file: string) => `${import.meta.env.BASE_URL}image/${file}`;

export interface StorybookCharacter {
  name: string;
  role: string;
  description: string;
  image: string;
  imageAlt: string;
}

/** 축복의 씨앗 "축복의 의미와 가치" 바로 아래에 보여주는 스토리북 등장인물 소개. */
export const STORYBOOK_CHARACTERS_HEADING = {
  eyebrow: "WHO'S IN THE STORY",
  title: "이야기 속 사람들",
  lead: "지호와 지우, 두 사람의 시선으로 축복의 의미를 들여다봅니다.",
};

export const STORYBOOK_PROTAGONISTS: StorybookCharacter[] = [
  {
    name: "지호",
    role: "남성 이야기의 주인공",
    description: "혼자서도 잘 살 수 있다고 믿었던 스물여덟. 할머니의 한마디에서, 그리고 부모님의 오래된 사진 한 장에서 가정의 의미를 다시 배워갑니다.",
    image: IMG("guide-storybook-character-jiho.webp"),
    imageAlt: "안경을 쓰고 베이지색 가디건을 입은 남성 캐릭터 지호의 상반신",
  },
  {
    name: "지우",
    role: "여성 이야기의 주인공",
    description: "혼자서도 꽤 잘 살고 있다고 믿었던 스물여덟. 할머니의 한마디와 엄마의 오래된 앨범 한 장에서 가정의 의미를 다시 배워갑니다.",
    image: IMG("guide-storybook-character-jiwoo.webp"),
    imageAlt: "베이지색 니트 카디건을 입은 여성 캐릭터 지우의 상반신",
  },
];

export const STORYBOOK_FAMILY_CHARACTER: StorybookCharacter = {
  name: "지호의 가족",
  role: "아버지 · 어머니 · 할머니",
  description: "저녁 식탁에서, 그리고 낡은 사진 한 장 속에서 지호가 다시 만나는 사람들입니다.",
  image: IMG("guide-storybook-character-jiho-family.webp"),
  imageAlt: "지호의 아버지, 어머니, 할머니 세 사람이 나란히 서 있는 모습",
};

export interface StorybookPanel {
  no: string;
  label: string;
  image: string;
  imageAlt: string;
  /** 그림 아래 내레이션(캡션). quote와 배타적입니다. */
  narration?: string;
  /** true면 다음 컷으로 이어지는 도입부처럼 살짝 옅은 톤으로 보여줍니다. */
  narrationMuted?: boolean;
  /** 이 컷의 유일한 대사. narration과 배타적입니다. */
  quote?: { lines: string[]; who: string };
  /** 마지막 컷에서 하늘 위에 얹는 짧은 카피(예: 이 STEP의 결론 한 줄). */
  overlay?: string;
}

export interface Storybook {
  stepNo: string;
  gender: "male" | "female";
  eyebrow: string;
  stepTitle: string;
  lede: string;
  bylineTitle: string;
  bylineMeta: string[];
  panels: StorybookPanel[];
  closing: {
    title: string;
    body: string;
    ctaLabel: string;
    ctaTo: string;
    badges: string[];
  };
  /** 이전 STEP으로 돌아가는 링크(첫 STEP에는 없음). */
  prev?: { title: string; to: string };
  /** 다음 STEP 예고. to가 있으면 클릭해서 넘어갈 수 있고, 없으면 "준비 중" 안내로만 보여줍니다. */
  next?: { label: string; title: string; sub: string; to?: string };
  /** 시리즈 마지막 편에서 next 대신 보여주는 전체 목차(각 편 다시 읽기 + 현재 편 표시). */
  series?: {
    label: string;
    items: { no: string; name: string; to: string; current?: boolean }[];
  };
}

export const STORYBOOKS: Storybook[] = [
  {
    stepNo: "01",
    gender: "male",
    eyebrow: "축복의 의미 · STEP 01",
    stepTitle: "천국은 가정 단위로\n들어갑니다",
    lede: "우리가 향해 가는 곳은 나 혼자가 아니라, 가정이 함께 들어가는 곳입니다. 그래서 가정을 이루는 일이 곧 신앙의 완성과 맞닿아 있습니다.",
    bylineTitle: "혼자 가는 길이 아니었다",
    bylineMeta: ["여섯 컷", "읽는 데 2분"],
    panels: [
      {
        no: "01",
        label: "축의금 봉투",
        image: IMG("guide-storybook-01-male-cut1.webp"),
        imageAlt: "결혼식장 하객석. 모두가 단상을 향해 앉은 가운데, 지호 혼자 조용히 박수를 친다.",
        narration: "스물여덟. 올해만 벌써 네 번째 청첩장.",
      },
      {
        no: "02",
        label: "혼자인 밤",
        image: IMG("guide-storybook-01-male-cut2.webp"),
        imageAlt: "밤의 원룸. 좁은 식탁에서 편의점 도시락을 먹는 지호. 세워둔 폰 화면에 결혼식 단체사진이 떠 있다.",
        narration: "나는 그냥, 혼자서도 잘 살면 되는 거라고 생각했다.",
      },
      {
        no: "03",
        label: "본가의 벽",
        image: IMG("guide-storybook-01-male-cut3.webp"),
        imageAlt: "주말 본가 거실. 벽에 걸린 오래된 가족사진 액자들을 올려다보는 지호의 뒷모습.",
        narration: "근데 '잘 산다'는 게, 정확히 뭐였을까.",
      },
      {
        no: "04",
        label: "할머니의 손",
        image: IMG("guide-storybook-01-male-cut4.webp"),
        imageAlt: "할머니의 주름진 손이 액자 유리 위, 사진 속 할아버지의 얼굴을 천천히 쓸어본다.",
        quote: { lines: ["할아버지 만나면…", "우리 손주 얘기부터 해야지."], who: "할머니" },
      },
      {
        no: "05",
        label: "멈춰선 순간",
        image: IMG("guide-storybook-01-male-cut5.webp"),
        imageAlt: "할머니를 바라보는 지호의 얼굴. 웃지도 울지도 않는, 무언가 내려앉은 표정.",
        narration: "할머니에게 그곳은, 혼자 가는 곳이 아니었다.",
      },
      {
        no: "06",
        label: "함께 가는 길",
        image: IMG("guide-storybook-01-male-cut6.webp"),
        imageAlt: "빛나는 언덕길을 손잡고 걸어 올라가는 3대 가족의 실루엣. 지호가 뒤에서 그 모습을 바라본다.",
        overlay: "천국은 가정 단위로\n들어갑니다",
      },
    ],
    closing: {
      title: "가정을 향한 마음, 여기서 함께 알아가요",
      body: "축복결혼이 낯설어도 괜찮습니다. 좋은 가정을 꿈꾸는 마음이 있다면, 지금부터 천천히 함께 알아가 보세요.",
      ctaLabel: "축복결혼 안내 신청하기",
      ctaTo: "/center/apply",
      badges: ["상담은 언제나 무료예요", "결정은 본인이 해요", "원할 때 중단할 수 있어요"],
    },
    next: {
      label: "NEXT",
      title: "STEP 02 · 사진 속 두 사람",
      sub: "나를 중심으로 돌던 집. 낡은 앨범 한 장이 부모님을 다시 서로에게 돌려놓습니다.",
      to: "/guide/storybook/02/male",
    },
  },
  {
    stepNo: "02",
    gender: "male",
    eyebrow: "축복의 의미 · STEP 02",
    stepTitle: "가정의 중심은\n부부입니다",
    lede: "부모와 자녀의 사랑도 소중하지만, 가정의 뿌리는 부부가 서로 사랑하고 존중하는 관계입니다. 부부관계가 바로 설 때, 온 가정이 함께 바로 섭니다.",
    bylineTitle: "사진 속 두 사람",
    bylineMeta: ["여섯 컷", "읽는 데 2분"],
    prev: { title: "STEP 01 · 혼자 가는 길이 아니었다", to: "/guide/storybook/01/male" },
    panels: [
      {
        no: "01",
        label: "나를 향한 식탁",
        image: IMG("guide-storybook-02-male-cut1.webp"),
        imageAlt: "본가 저녁 식탁. 어머니는 지호 밥그릇에 반찬을 올려주고, 아버지는 TV 쪽을 본 채 묵묵히 식사한다.",
        narration: "우리 집은 늘, 나를 중심으로 돌았다.",
      },
      {
        no: "02",
        label: "두 사람 사이의 거리",
        image: IMG("guide-storybook-02-male-cut2.webp"),
        imageAlt: "부엌에서 설거지하는 어머니의 등과, 거실 소파에서 TV를 보는 아버지의 뒷모습. 두 사람 사이에 넓은 마루가 비어 있다.",
        narration: "그런데 두 사람 사이에는, 언제부턴가 말이 없었다.",
      },
      {
        no: "03",
        label: "앨범을 펼치다",
        image: IMG("guide-storybook-02-male-cut3.webp"),
        imageAlt: "바닥에 앉아 낡은 앨범을 펼쳐 든 지호. 사진 속 젊은 부모는 서로를 마주 보며 웃고 있고, 어린 지호는 구석에 있다.",
        narration: "이 사진 속 두 사람은… 서로를 보고 있었는데.",
      },
      {
        no: "04",
        label: "보여주다",
        image: IMG("guide-storybook-02-male-cut4.webp"),
        imageAlt: "거실. 지호가 앨범을 펼쳐 들고, 어머니와 아버지가 양옆에서 같은 페이지를 들여다본다.",
        quote: { lines: ["이때 두 분,", "되게 좋아 보인다."], who: "지호" },
      },
      {
        no: "05",
        label: "작은 움직임",
        image: IMG("guide-storybook-02-male-cut5.webp"),
        imageAlt: "부엌. 설거지하는 어머니 옆에 아버지가 슬며시 서서 헹군 그릇을 받아 든다.",
        narration: "거창한 화해 같은 건 없었다. 그냥, 한 걸음이었다.",
      },
      {
        no: "06",
        label: "뿌리와 가지",
        image: IMG("guide-storybook-02-male-cut6.webp"),
        imageAlt: "한 그루 나무. 뿌리 자리에 손잡은 부부의 실루엣이 빛나고, 가지마다 아이들의 실루엣이 열매처럼 매달려 있다.",
        overlay: "부부관계가 바로 설 때,\n온 가정이 함께 바로 섭니다",
      },
    ],
    closing: {
      title: "완벽한 가정보다, 서로 배우고 성장하는 가정",
      body: "갈등을 피하기보다 함께 풀어가며 더 깊은 관계로 나아갑니다. 축복결혼이 낯설어도 괜찮습니다. 지금부터 천천히 함께 알아가 보세요.",
      ctaLabel: "축복결혼 안내 신청하기",
      ctaTo: "/center/apply",
      badges: ["상담은 언제나 무료예요", "결정은 본인이 해요", "원할 때 중단할 수 있어요"],
    },
    next: {
      label: "NEXT",
      title: "STEP 03 · 준비는 이미 시작되었다",
      sub: "무엇을 얼마나 갖춰야 '준비'인가. 답은 체크리스트가 아니라 오늘 저녁 식탁에 있었습니다.",
      to: "/guide/storybook/03/male",
    },
  },
  {
    stepNo: "03",
    gender: "male",
    eyebrow: "축복의 의미 · STEP 03",
    stepTitle: "그 준비는 가정에서,\n출발은 축복입니다",
    lede: "가족이 함께 천국에 들어갈 준비는 매일의 가정생활 속에서 이루어집니다. 그리고 그 준비의 첫걸음이 바로 축복입니다.",
    bylineTitle: "준비는 이미 시작되었다",
    bylineMeta: ["여섯 컷", "읽는 데 2분"],
    prev: { title: "STEP 02 · 사진 속 두 사람", to: "/guide/storybook/02/male" },
    panels: [
      {
        no: "01",
        label: "남은 한 단어",
        image: IMG("guide-storybook-03-male-cut1.webp"),
        imageAlt: "밤, 책상 위를 내려다본 앵글. 스탠드 불빛 아래 펼쳐진 빈 노트와 펜, 그 옆에 놓인 지호의 손.",
        narration: "준비. 그 말이 계속 남았다.",
      },
      {
        no: "02",
        label: "갖춰야 할 것들",
        image: IMG("guide-storybook-03-male-cut2.webp"),
        imageAlt: "상상 장면. 아파트, 자동차, 동전 더미, 통장, 자격증이 아슬아슬하게 쌓여 있고 그 아래 지호가 아주 작게 올려다본다.",
        narration: "뭘, 얼마나 갖춰야 준비된 걸까.",
      },
      {
        no: "03",
        label: "창밖의 답",
        image: IMG("guide-storybook-03-male-cut3.webp"),
        imageAlt: "창틀 너머 해질녘 골목. 저만치 아버지와 어머니가 나란히 서 있고, 앞쪽에서 지호가 그 모습을 내다본다.",
        narration: "그런데 준비는, 거창한 데 있지 않았다.",
      },
      {
        no: "04",
        label: "매일의 준비",
        image: IMG("guide-storybook-03-male-cut4.webp"),
        imageAlt: "지호가 차린 저녁 식탁. 어머니가 아버지에게 국그릇을 건네고, 세 사람이 서로를 보며 웃는다.",
        narration: "미안하다는 말, 고맙다는 말.\n매일의 가정생활 속에서.",
      },
      {
        no: "05",
        label: "첫걸음",
        image: IMG("guide-storybook-03-male-cut5.webp"),
        imageAlt: "손 클로즈업. 지호의 엄지가 휴대폰 화면 위에 닿을 듯 말 듯 멈춰 있다.",
        narration: "그리고 그 준비의 첫걸음이,",
        narrationMuted: true,
      },
      {
        no: "06",
        label: "출발",
        image: IMG("guide-storybook-03-male-cut6.webp"),
        imageAlt: "아침 햇살 속 야외 합동축복식. 흰옷을 입은 여러 국적의 부부들이 마주 손을 잡고 서 있고, 꽃잎이 흩날린다.",
        overlay: "바로 축복입니다",
      },
    ],
    closing: {
      title: "축복을 향한 첫걸음,\n궁금함에서 시작해도 좋습니다",
      body: "축복결혼이 낯설어도 괜찮습니다. 좋은 가정을 꿈꾸는 마음이 있다면, 지금부터 천천히 함께 알아가 보세요.",
      ctaLabel: "축복결혼 안내 신청하기",
      ctaTo: "/center/apply",
      badges: ["상담은 언제나 무료예요", "결정은 본인이 해요", "원할 때 중단할 수 있어요"],
    },
    series: {
      label: "축복의 의미 · 세 편",
      items: [
        { no: "01", name: "혼자 가는 길이 아니었다", to: "/guide/storybook/01/male" },
        { no: "02", name: "사진 속 두 사람", to: "/guide/storybook/02/male" },
        { no: "03", name: "준비는 이미 시작되었다", to: "/guide/storybook/03/male", current: true },
      ],
    },
  },
  {
    stepNo: "01",
    gender: "female",
    eyebrow: "축복의 의미 · STEP 01",
    stepTitle: "천국은 가정 단위로\n들어갑니다",
    lede: "우리가 향해 가는 곳은 나 혼자가 아니라, 가정이 함께 들어가는 곳입니다. 그래서 가정을 이루는 일이 곧 신앙의 완성과 맞닿아 있습니다.",
    bylineTitle: "부케를 받은 손",
    bylineMeta: ["여섯 컷", "읽는 데 2분"],
    panels: [
      {
        no: "01",
        label: "부케",
        image: IMG("guide-storybook-01-female-cut1.webp"),
        imageAlt: "결혼식장. 신부가 등을 돌린 채 막 던진 부케를 지우가 두 손으로 받아 들고, 둘러선 하객들이 웃으며 박수를 친다.",
        narration: "부케를 받으면 여섯 달 안에 간다던데.",
      },
      {
        no: "02",
        label: "시든 부케",
        image: IMG("guide-storybook-01-female-cut2.webp"),
        imageAlt: "밤의 원룸. 앞쪽 신발장 위에 물 없이 놓인 부케가 시들어 있고, 안쪽 소파에서 지우가 편안한 차림으로 폰을 보고 있다.",
        narration: "나는 혼자서도 꽤 잘 살고 있는데.",
      },
      {
        no: "03",
        label: "손수건에 싼 것",
        image: IMG("guide-storybook-01-female-cut3.webp"),
        imageAlt: "본가 할머니 방. 열린 장롱 앞에 앉은 할머니가 낡은 손수건 꾸러미를 펼치고, 곁에 선 지우가 허리를 숙여 들여다본다.",
        narration: "주말에 들른 본가. 할머니가 장롱에서 뭔가를 꺼내셨다.",
      },
      {
        no: "04",
        label: "할머니의 손",
        image: IMG("guide-storybook-01-female-cut4.webp"),
        imageAlt: "클로즈업. 할머니의 주름진 손이 무릎 위 흑백사진 속 젊은 할아버지의 얼굴을 쓸어본다.",
        quote: { lines: ["할아버지 만나면…", "우리 지우 얘기부터 해야지."], who: "할머니" },
      },
      {
        no: "05",
        label: "멈춰선 순간",
        image: IMG("guide-storybook-01-female-cut5.webp"),
        imageAlt: "지우의 얼굴 클로즈업. 무언가 내려앉은 듯한, 웃지도 울지도 않는 조용한 표정.",
        narration: "할머니에게 그곳은, 혼자 가는 곳이 아니었다.",
      },
      {
        no: "06",
        label: "함께 가는 길",
        image: IMG("guide-storybook-01-female-cut6.webp"),
        imageAlt: "빛나는 언덕길을 손잡고 걸어 올라가는 3대 가족의 실루엣. 지우가 그 모습을 바라보며 서 있다.",
        overlay: "천국은 가정 단위로\n들어갑니다",
      },
    ],
    closing: {
      title: "가정을 향한 마음, 여기서 함께 알아가요",
      body: "축복결혼이 낯설어도 괜찮습니다. 좋은 가정을 꿈꾸는 마음이 있다면, 지금부터 천천히 함께 알아가 보세요.",
      ctaLabel: "축복결혼 안내 신청하기",
      ctaTo: "/center/apply",
      badges: ["상담은 언제나 무료예요", "결정은 본인이 해요", "원할 때 중단할 수 있어요"],
    },
    next: {
      label: "NEXT",
      title: "STEP 02 · 엄마가 나한테만 하던 말",
      sub: "엄마의 하소연을 받아주는 게 딸의 일인 줄 알았습니다. 앨범 한 장이 그 말의 방향을 바꿉니다.",
      to: "/guide/storybook/02/female",
    },
  },
  {
    stepNo: "02",
    gender: "female",
    eyebrow: "축복의 의미 · STEP 02",
    stepTitle: "가정의 중심은\n부부입니다",
    lede: "부모와 자녀의 사랑도 소중하지만, 가정의 뿌리는 부부가 서로 사랑하고 존중하는 관계입니다. 부부관계가 바로 설 때, 온 가정이 함께 바로 섭니다.",
    bylineTitle: "엄마가 나한테만 하던 말",
    bylineMeta: ["여섯 컷", "읽는 데 2분"],
    prev: { title: "STEP 01 · 부케를 받은 손", to: "/guide/storybook/01/female" },
    panels: [
      {
        no: "01",
        label: "부엌의 하소연",
        image: IMG("guide-storybook-02-female-cut1.webp"),
        imageAlt: "본가 부엌. 어머니가 나물을 무치며 지우에게 아버지 이야기를 하고, 지우는 마늘을 까며 눈을 내리깔고 듣는다. 열린 문 너머 거실에 아버지의 뒷모습이 보인다.",
        narration: "엄마는 늘 나한테 아빠 얘기를 했다.\n아빠한테는, 하지 않고.",
      },
      {
        no: "02",
        label: "두 사람 사이의 거리",
        image: IMG("guide-storybook-02-female-cut2.webp"),
        imageAlt: "밤의 거실. 왼쪽 끝 식탁에서 어머니가 폰을 보고, 오른쪽 끝 소파에서 아버지가 TV를 본다. 두 사람 사이의 마루가 넓게 비어 있다.",
        narration: "한 집에 살면서, 두 사람은 각자 다른 화면을 보고 있었다.",
      },
      {
        no: "03",
        label: "스물다섯의 엄마",
        image: IMG("guide-storybook-02-female-cut3.webp"),
        imageAlt: "지우의 옛방. 바닥에 앉아 낡은 앨범을 넘기는 지우. 펼쳐진 사진 속에서 젊은 부모가 서로를 마주 보며 웃고 있다.",
        narration: "사진 속 엄마는, 내가 지금 아는 엄마보다 어렸다.",
      },
      {
        no: "04",
        label: "보여주다",
        image: IMG("guide-storybook-02-female-cut4.webp"),
        imageAlt: "부엌 조리대 위에 펼쳐진 앨범을 지우와 어머니, 아버지가 함께 들여다본다. 어머니의 얼굴이 살짝 붉어져 있다.",
        quote: { lines: ["엄마, 이때 아빠", "되게 좋아했나 보다."], who: "지우" },
      },
      {
        no: "05",
        label: "커피 두 잔",
        image: IMG("guide-storybook-02-female-cut5.webp"),
        imageAlt: "아침 부엌. 아버지가 자기 잔을 든 채, 식탁에 앉은 어머니 앞에 커피잔을 하나 놓아준다. 어머니가 그 잔을 바라본다.",
        narration: "거창한 화해 같은 건 없었다. 그냥, 한 걸음이었다.",
      },
      {
        no: "06",
        label: "뿌리와 가지",
        image: IMG("guide-storybook-02-female-cut6.webp"),
        imageAlt: "한 그루 나무. 뿌리 자리에 손잡은 부부의 실루엣이 금빛으로 빛나고, 라벤더빛 가지마다 아이들의 실루엣이 열매처럼 매달려 있다.",
        overlay: "부부관계가 바로 설 때,\n온 가정이 함께 바로 섭니다",
      },
    ],
    closing: {
      title: "완벽한 가정보다, 서로 배우고 성장하는 가정",
      body: "갈등을 피하기보다 함께 풀어가며 더 깊은 관계로 나아갑니다. 축복결혼이 낯설어도 괜찮습니다. 지금부터 천천히 함께 알아가 보세요.",
      ctaLabel: "축복결혼 안내 신청하기",
      ctaTo: "/center/apply",
      badges: ["상담은 언제나 무료예요", "결정은 본인이 해요", "원할 때 중단할 수 있어요"],
    },
    next: {
      label: "NEXT",
      title: "STEP 03 · 이미 시작된 준비",
      sub: "무엇을 얼마나 갖춰야 '준비'인가. 답은 체크리스트가 아니라 어제의 부엌에 있었습니다.",
      to: "/guide/storybook/03/female",
    },
  },
  {
    stepNo: "03",
    gender: "female",
    eyebrow: "축복의 의미 · STEP 03",
    stepTitle: "그 준비는 가정에서,\n출발은 축복입니다",
    lede: "가족이 함께 천국에 들어갈 준비는 매일의 가정생활 속에서 이루어집니다. 그리고 그 준비의 첫걸음이 바로 축복입니다.",
    bylineTitle: "이미 시작된 준비",
    bylineMeta: ["여섯 컷", "읽는 데 2분"],
    prev: { title: "STEP 02 · 엄마가 나한테만 하던 말", to: "/guide/storybook/02/female" },
    panels: [
      {
        no: "01",
        label: "남은 한 단어",
        image: IMG("guide-storybook-03-female-cut1.webp"),
        imageAlt: "밤, 책상을 위에서 내려다본 앵글. 스탠드 불빛 아래 펼쳐진 빈 다이어리와 펜, 그 위에 놓인 지우의 손.",
        narration: "준비. 그 말이 계속 남았다.",
      },
      {
        no: "02",
        label: "갖춰야 할 것들",
        image: IMG("guide-storybook-03-female-cut2.webp"),
        imageAlt: "상상 장면. 아파트 위로 예단 상자, 통장, 자격증, 드레스가 아슬아슬하게 쌓여 있고 그 옆에 지우가 아주 작게 서서 올려다본다.",
        narration: "뭘, 얼마나 갖춰야 준비된 걸까.",
      },
      {
        no: "03",
        label: "창밖의 답",
        image: IMG("guide-storybook-03-female-cut3.webp"),
        imageAlt: "창틀 너머 해질녘 골목길. 저만치 아버지와 어머니가 나란히 걸어가고, 앞쪽에서 지우가 그 모습을 내다본다.",
        narration: "그런데 준비는, 거창한 데 있지 않았다.",
      },
      {
        no: "04",
        label: "매일의 준비",
        image: IMG("guide-storybook-03-female-cut4.webp"),
        imageAlt: "지우가 차린 저녁 식탁. 어머니가 아버지에게 국그릇을 건네고, 세 사람이 서로를 보며 웃는다. 식탁에는 라벤더 한 다발이 놓여 있다.",
        narration: "미안하다는 말, 고맙다는 말.\n매일의 가정생활 속에서.",
      },
      {
        no: "05",
        label: "첫걸음",
        image: IMG("guide-storybook-03-female-cut5.webp"),
        imageAlt: "손 클로즈업. 지우가 두 손으로 휴대폰을 들고, 손가락이 화면 위에 닿을 듯 말 듯 멈춰 있다.",
        narration: "그리고 그 준비의 첫걸음이,",
        narrationMuted: true,
      },
      {
        no: "06",
        label: "출발",
        image: IMG("guide-storybook-03-female-cut6.webp"),
        imageAlt: "아침 햇살 속 야외 합동축복식. 흰옷을 입은 여러 국적의 부부들이 나란히 손을 잡고 서 있고, 크림빛과 라벤더빛 꽃잎이 흩날린다.",
        overlay: "바로 축복입니다",
      },
    ],
    closing: {
      title: "축복을 향한 첫걸음,\n궁금함에서 시작해도 좋습니다",
      body: "축복결혼이 낯설어도 괜찮습니다. 좋은 가정을 꿈꾸는 마음이 있다면, 지금부터 천천히 함께 알아가 보세요.",
      ctaLabel: "축복결혼 안내 신청하기",
      ctaTo: "/center/apply",
      badges: ["상담은 언제나 무료예요", "결정은 본인이 해요", "원할 때 중단할 수 있어요"],
    },
    series: {
      label: "축복의 의미 · 지우 편 세 편",
      items: [
        { no: "01", name: "부케를 받은 손", to: "/guide/storybook/01/female" },
        { no: "02", name: "엄마가 나한테만 하던 말", to: "/guide/storybook/02/female" },
        { no: "03", name: "이미 시작된 준비", to: "/guide/storybook/03/female", current: true },
      ],
    },
  },
];
