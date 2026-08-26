# 축복월드(Blessing World) 재구현 PRD

> **문서 목적**: 이 문서는 `https://blessinghome.lovable.app/` 를 동일하게 재구현하기 위한 **AI 코딩 도구 입력용 구현 명세서**입니다.
> Lovable / Claude Code / Cursor / v0 등에 이 문서를 그대로 투입하면 동일한 서비스를 구축할 수 있도록 작성되었습니다.
>
> **작성일**: 2026-08-21
> **분석 대상**: https://blessinghome.lovable.app/ (2026년 8월 기준)
> **버전**: v1.0

---

## 0. AI 코딩 도구 사용 안내 (먼저 읽을 것)

이 PRD는 다음 순서로 구현할 것을 권장합니다.

1. **§3 기술 스택** → 프로젝트 스캐폴딩
2. **§4 디자인 시스템** → `index.css` / `tailwind.config.ts` 토큰 정의
3. **§5 공통 레이아웃** → Header / Footer / SEO 컴포넌트
4. **§7 데이터 모델** → Supabase 스키마 마이그레이션
5. **§6 화면별 명세 (P-01 ~ P-09)** → 라우트 순서대로 구현
6. **§9 수용 기준** → 각 화면 완료 시 체크

> ⚠️ **정확도 고지**
> - **텍스트 카피(§6)** 는 실제 사이트에서 추출한 **원문 그대로**입니다. 그대로 사용하십시오.
> - **디자인 토큰(§4)** 은 원본의 CSS 번들 접근이 제한되어 **로고 파일명(`mark-lavender`)·톤앤매너·서비스 성격에 기반한 재구성안**입니다. 실제 사이트와 픽셀 단위로 동일해야 한다면 브라우저 개발자도구로 `:root` CSS 변수를 확인해 §4 표를 덮어쓰십시오.
> - `/stories`(행복의 꽃)는 분석 시점에 **콘텐츠가 비어 있는 상태**였습니다. 해당 화면의 카드/리스트 명세는 **UI 셸(shell)과 카테고리·정렬 옵션은 실측**, 개별 카드 구조는 **설계 제안**입니다.
> - `/guide`의 FAQ 9개 중 5개는 접힘 상태로 답변 본문을 확보하지 못했습니다. §6.2에 `[답변 본문 필요]` 로 표기했습니다.
>
> **⚠️ 2026-08-24 이후 구현 범위에서 원본과 달라진 점** (원본 분석 내용인 §1~§9 본문은 그대로 두고, 실제 구현 시 아래처럼 대체·추가했습니다 — 상세는 §13 참고)
> - **나눔의 열매(`/community`) 폐기 → 축복가치교육(`/curriculum`)으로 대체.** §6 P-04, §2.3 GNB가 이 문서에서도 이미 대체된 내용으로 수정되어 있습니다. 원본 나눔의 열매 명세는 §13.1에 보존해 두었습니다.
> - **가정민원실(`/civil-affairs`) 폐기 → 지역가정교회(`/churches`)로 대체.** 서비스 카드 3장,
>   축복결혼 행정 안내, 운영 정보 블록은 삭제되고 지역 기반 교회 디렉터리만 남았습니다.
>   §6 P-05, §7 `churches` 테이블. 원본 가정민원실 명세는 §13.5에 보존.
> - **관리자 로그인(`/admin/login`)과 Supabase Auth 기반 인증을 실제로 구현** — §8을 실제 구현(RequireAdmin, `profiles.role`, `is_staff_or_admin()`)에 맞게 갱신했습니다.
> - 실제 Supabase 프로젝트에 연결되어 `courses`/`churches` 테이블까지 마이그레이션이 적용된 상태입니다. `community_*` 테이블은 삭제하지 않고 미사용 상태로 남아 있습니다(§7.2).

---

## 1. 제품 개요

### 1.1 서비스 정의

**축복월드(Blessing World)** 은 세계평화통일가정연합 가정행복국(가정행복지원국 축복가정부)이 운영하는 **축복결혼·가정생활 통합 안내 서비스**입니다.

축복결혼에 처음 관심을 갖는 사람이 **① 알아보고 → ② 상담·교육을 받고 → ③ 만남과 축복을 준비하고 → ④ 가정을 이룬 뒤 공동체 안에서 살아가는** 전 여정을 하나의 웹사이트에서 지원합니다.

### 1.2 핵심 가치 제안

| 구분 | 내용 |
|---|---|
| 대상 | 축복결혼을 전혀 모르는 일반인 ~ 이미 축복가정을 이룬 기존 구성원 |
| 톤앤매너 | 따뜻함, 낮은 문턱, 비강요, 자발성 존중 |
| 차별점 | 종교적 권유가 아닌 **정보 제공 중심**. "상담 무료 / 결정은 본인 / 언제든 중단 가능" 3원칙을 전면에 노출 |
| 전환 목표 | `/onboarding` 안내 신청 폼 제출 (이름·연락처·성별·출생연도·지역) |

### 1.3 타깃 사용자 (Persona)

| ID | 페르소나 | 니즈 | 주 진입 경로 |
|---|---|---|---|
| U-1 | **탐색자** — 축복결혼을 처음 들어본 20~30대 | "이게 뭔지, 부담 없이 알고 싶다" | `/` → `/guide` → `/onboarding` |
| U-2 | **준비자** — 상담을 받고 축복을 준비 중인 사람 | "절차·서류·내 진행 현황을 알고 싶다"(§13.5, 미구현) | `/onboarding` |
| U-3 | **축복가정** — 이미 가정을 이룬 기존 구성원 | "다른 가정 이야기를 보고, 더 배우고 싶다" | `/stories`, `/curriculum` |
| U-4 | **가정 행정 이용자** — 출산·성화 등 행정 신청 필요자 | "HJ Baby Blessing, 성화감사장 신청" | `/` (홈 카드에서 바로 외부 신청 링크로 이동) |
| U-5 | **운영자** — 가정행복국 담당자 | "신청 접수 확인, 지역 담당자 배정, 콘텐츠 관리" | 관리자 화면 |

### 1.4 서비스 원칙 (UI 전반에 반복 노출)

1. 상담은 언제나 **무료**
2. 결정은 **본인**이 함
3. 원할 때 **중단** 가능
4. 개인정보는 **안내 목적에만** 사용
5. 신청 후 **영업일 기준 1~2일 이내** 지역 담당자 연락

---

## 2. 정보구조(IA) 및 라우팅

### 2.1 사이트맵

```
블레싱월드 (/)
├── /guide                          축복의 씨앗 — 축복결혼 안내
├── /stories                        행복의 꽃 — 축복가정의 이야기
│   └── /stories/:slug               (개별 스토리 상세) ※ 설계 제안
├── /curriculum                     축복가치교육 — 축복교육 4강좌 (구 나눔의 열매 자리, §6 P-04)
├── /churches                       지역가정교회 — 지역 기반 교회 디렉터리 (구 가정민원실 자리, §6 P-05)
├── /onboarding                     처음 오셨나요? — 안내 신청 폼 (전환 목표)
├── /privacy                        개인정보처리방침
├── /terms                          이용약관
├── /admin/login                    관리자 로그인·회원가입 (Supabase Auth)
├── /admin/curriculum               [관리자] 축복가치교육(강좌) 관리
├── /admin/churches                 [관리자] 지역가정교회 관리
└── *                               404 Not Found
```

> `/community`, `/community/new`, `/community/:id`(나눔의 열매)와 `/civil-affairs`,
> `/civil-affairs/blessing-marriage`(가정민원실)는 실제 구현에서 폐기되었습니다. 뒤의 둘은
> `/churches`로 리다이렉트됩니다. 원본 명세는 각각 §13.1, §13.5 참고.

### 2.2 외부 링크 (동일 사이트가 아님, 새 탭으로 이동)

| 항목 | URL |
|---|---|
| HJ Baby Blessing | `https://hyojeongbaby-blessing.lovable.app/` |
| 성화감사장 신청 | Google Forms (운영자가 관리하는 폼 URL) |

> ⚠️ 원본 사이트의 성화감사장 링크는 Google Forms **편집 URL(`/edit?usp=drive_web&ouid=...`)** 로 연결되어 있습니다. **이는 명백한 버그이며, 재구현 시 반드시 응답용 URL(`/viewform`)로 교체해야 합니다.** (§10 개선 제안 I-01 참조)

### 2.3 글로벌 내비게이션

헤더 GNB는 **5개 항목 고정**. 앞 4개 항목의 순서 변경 금지.

| 순서 | 라벨 | 경로 | 영문 캡션(내부용) |
|---|---|---|---|
| 1 | 축복의 씨앗 | `/guide` | Blessing Guide |
| 2 | 행복의 꽃 | `/stories` | Our Stories |
| 3 | 축복가치교육 | `/curriculum` | Online Courses |
| 4 | 지역가정교회 | `/churches` | Local Family Churches |
| 5 | 제출서류 안내 | `/documents` | Required Documents |

> 3번 항목은 원본의 "나눔의 열매"(`/community`) 자리를(§13.1), 4번 항목은 원본의
> "가정민원실"(`/civil-affairs`) 자리를(§13.5) 대체합니다.
>
> ⚠️ **원본 재구현 스펙과의 괴리**: 이 문서는 원래 기존 사이트를 재구현하기 위한 스펙으로
> 작성되어 "GNB 4개 항목 고정, 순서 변경 금지"였습니다. 5번 항목(`/documents`)은
> 2026-08-26 사용자 요청으로 **원본에 없던 새 기능**을 추가한 것이며, 협회 가정행복국·
> 가정국이 배포한 "미혼1세/축복자녀 축복후보자 제출서류 및 심사기준(20260814)" 공문
> 두 건을 콘텐츠로 옮긴 페이지입니다. §5.3, §9.5(AC-01), 부록 B 요약표도 함께 갱신했습니다.

- 좌측: 로고 마크(`mark-lavender`) + 워드마크 "블레싱월드" → `/` 링크
- 로고 `alt` 텍스트: `블레싱월드 마크`
- 모바일(<768px): 햄버거 메뉴 → 드로어(Sheet)로 5개 항목 세로 나열
- 스크롤 시 헤더 고정(sticky) + 배경 blur

---

## 3. 기술 스택 및 아키텍처

### 3.1 프론트엔드

```
- 빌드: Vite
- 언어: TypeScript
- 프레임워크: React 18
- 라우팅: react-router-dom v6 (BrowserRouter)
- 스타일: Tailwind CSS + CSS 변수 기반 디자인 토큰
- UI 컴포넌트: shadcn/ui (Radix UI 기반)
- 아이콘: lucide-react
- 폼: react-hook-form + zod (@hookform/resolvers)
- 서버 상태: @tanstack/react-query
- 토스트: sonner
- 애니메이션: tailwindcss-animate (+ 필요 시 framer-motion)
- 메타 태그: react-helmet-async
```

### 3.2 백엔드

```
- BaaS: Supabase
  - Postgres (데이터)
  - Auth (이메일/비밀번호 + 소셜 선택)
  - Storage (스토리/나눔 이미지)
  - Row Level Security (RLS) 필수
  - Edge Functions (알림 발송, 관리자 통계)
```

### 3.3 디렉터리 구조 (권장)

```
src/
├── components/
│   ├── ui/                  # shadcn/ui 프리미티브
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── PageLayout.tsx
│   ├── common/
│   │   ├── SEO.tsx              # noindex 옵션 포함(관리자 화면용)
│   │   ├── SectionHeading.tsx   # 영문 캡션 + 국문 제목 + 설명 3단 구조
│   │   ├── EyebrowLabel.tsx     # "BLESSING GUIDE" 같은 대문자 라벨
│   │   ├── EmptyState.tsx
│   │   ├── ComingSoon.tsx
│   │   ├── LogoMark.tsx
│   │   └── ScrollToTop.tsx
│   ├── home/
│   │   ├── HeroCarousel.tsx
│   │   ├── IntroTriad.tsx
│   │   └── FeatureCardGrid.tsx
│   ├── guide/
│   │   ├── WhatIsBlessing.tsx / ValuePillars.tsx / StepJourney.tsx
│   │   ├── FaqAccordion.tsx / TrustBadges.tsx / GuideFinalCta.tsx
│   └── admin/
│       ├── AdminHeader.tsx      # 관리 화면 공통 헤더(로그인 정보·로그아웃·페이지 탭)
│       └── RequireAdmin.tsx     # /admin/* 라우트 가드
├── pages/
│   ├── Home.tsx / Guide.tsx / Curriculum.tsx / Stories.tsx / StoryDetail.tsx
│   ├── Churches.tsx          # 지역가정교회 디렉터리 — §6 P-05 (가정민원실 대체)
│   ├── Onboarding.tsx / Privacy.tsx / Terms.tsx / NotFound.tsx
│   └── admin/
│       ├── Login.tsx            # 로그인 + 회원가입
│       ├── CourseAdmin.tsx      # 축복가치교육(강좌) 관리
│       └── ChurchAdmin.tsx      # 지역가정교회 관리
├── content/                 # 정적 카피 상수 (i18n 전환 대비) — curriculum.ts, churches.ts 포함
├── lib/
│   ├── auth.tsx              # AuthProvider/useAuth — 세션·profiles.role 전역 상태
│   ├── courses.ts            # 강좌 CRUD (Supabase 우선, 미연결 시 localStorage 대체)
│   ├── churches.ts           # 지역가정교회 CRUD (courses.ts와 동일 패턴)
│   └── utils.ts
├── hooks/  ├── integrations/supabase/
└── App.tsx / main.tsx / index.css
```

> `community/` 컴포넌트 폴더와 `Community.tsx`/`CommunityDetail.tsx`/`CommunityNew.tsx`는 나눔의
> 열매 폐기와 함께(§13.1), `CivilAffairs.tsx`/`BlessingMarriage.tsx`와 `civil-affairs/` 컴포넌트
> 폴더는 가정민원실 폐기와 함께(§13.5) 삭제되었습니다.

### 3.4 카피 관리 원칙

모든 한국어 카피는 **JSX에 하드코딩하지 말고** `src/content/*.ts` 상수 파일에 분리합니다.
운영자가 개발자 도움 없이 문구를 수정할 여지를 남기고, 향후 CMS 전환·다국어 확장을 쉽게 하기 위함입니다.

---

## 4. 디자인 시스템

> 아래 토큰은 **재구성안**입니다(§0 정확도 고지 참조). 원본과 픽셀 일치가 필요하면 실측값으로 교체하십시오.

### 4.1 컨셉

- 서비스명 **블레싱월드(Blessing World)** — "축복(Blessing)이 시작되는 곳"이라는 의미
- 로고 마크 파일명이 `mark-lavender` → **라벤더 계열이 브랜드 프라이머리**
- 전체 톤: 크림/아이보리 배경 위 라벤더 + 뮤트 골드. 채도 낮고 여백 넉넉한 **에디토리얼 레이아웃**
- 종교기관 특유의 무게감을 피하고, 웨딩/라이프스타일 매거진에 가까운 인상

### 4.2 컬러 토큰 (HSL, `index.css` `:root`)

```css
:root {
  /* Base */
  --background: 40 33% 98%;        /* #FCFAF7 웜 아이보리 */
  --foreground: 265 15% 20%;       /* #322D3B 딥 플럼 그레이 */

  /* Brand — Lavender */
  --primary: 265 38% 58%;          /* #8367B8 라벤더 */
  --primary-foreground: 0 0% 100%;
  --primary-soft: 265 45% 94%;     /* #EDE7F6 라벤더 틴트 (배지/호버) */
  --primary-deep: 265 42% 38%;     /* #57388A 강조 텍스트 */

  /* Accent — Muted Gold */
  --accent: 41 55% 56%;            /* #CBA24E 뮤트 골드 */
  --accent-foreground: 265 20% 18%;
  --accent-soft: 41 60% 94%;       /* #FAF2E0 */

  /* Neutral */
  --card: 0 0% 100%;
  --card-foreground: 265 15% 20%;
  --muted: 40 20% 95%;             /* #F5F2ED */
  --muted-foreground: 265 8% 46%;  /* #74707C 보조 텍스트 */
  --border: 40 18% 89%;            /* #E8E3DB */
  --input: 40 18% 89%;
  --ring: 265 38% 58%;

  /* Semantic */
  --destructive: 0 65% 55%;
  --success: 152 45% 42%;
  --warning: 38 85% 55%;

  --radius: 0.875rem;              /* 14px — 카드 기본 */
}
```

**컬러 사용 규칙**

| 용도 | 토큰 |
|---|---|
| 페이지 배경 | `background` |
| 카드/모달 배경 | `card` (흰색) |
| 주요 CTA 버튼 | `primary` 배경 + 흰 글자 |
| 보조 CTA 버튼 | `outline` + `primary` 테두리/글자 |
| 섹션 구분 배경(교차) | `muted` |
| 영문 eyebrow 라벨 | `accent` 또는 `primary` + `tracking-[0.2em]` + `uppercase` |
| 카테고리 배지 | `primary-soft` 배경 + `primary-deep` 글자 |
| 안내/유의 문구 박스 | `accent-soft` 배경 + `accent-foreground` 글자 |

**다크모드**: 원본에 다크모드 없음. 구현하지 않음(또는 `prefers-color-scheme` 대응 시 §4.2 역전 팔레트 별도 정의).

### 4.3 타이포그래피

```
본문/제목 공통: 'Pretendard Variable', Pretendard, -apple-system,
               'Noto Sans KR', system-ui, sans-serif
영문 eyebrow:  'Inter', sans-serif — uppercase, letter-spacing 0.2em, 12px, semibold
```

| 스타일 | 크기(데스크톱) | 크기(모바일) | 굵기 | 행간 |
|---|---|---|---|---|
| Display (히어로) | 48px | 30px | 700 | 1.25 |
| H1 (페이지 제목) | 40px | 28px | 700 | 1.3 |
| H2 (섹션 제목) | 30px | 24px | 700 | 1.35 |
| H3 (카드 제목) | 20px | 18px | 600 | 1.4 |
| Body | 17px | 16px | 400 | 1.75 |
| Body-sm (보조) | 15px | 14px | 400 | 1.7 |
| Caption | 13px | 13px | 500 | 1.6 |
| Eyebrow | 12px | 11px | 600 | 1.4 |

> **한국어 가독성 필수 규칙**
> - 모든 문단에 `word-break: keep-all;` 적용 (어절 단위 줄바꿈)
> - 본문 행간 최소 1.7
> - 문단 최대 폭 `max-w-[62ch]`

### 4.4 레이아웃 · 스페이싱

| 항목 | 값 |
|---|---|
| 컨테이너 최대폭 | `max-w-6xl` (1152px), 좌우 패딩 `px-5 md:px-8` |
| 섹션 상하 여백 | `py-16 md:py-24` |
| 카드 그리드 | `grid gap-6 md:grid-cols-2 lg:grid-cols-3` |
| 카드 라운드 | `rounded-2xl` |
| 카드 그림자 | `shadow-[0_2px_16px_-4px_rgba(50,45,59,0.08)]`, hover 시 `shadow-lg` + `-translate-y-1` |
| 전환 | `transition-all duration-300 ease-out` |

### 4.5 반응형 브레이크포인트

| 이름 | 폭 | 주요 변화 |
|---|---|---|
| Mobile | < 640px | 1단, 햄버거 메뉴, 히어로 이미지 4:5 비율 |
| Tablet | 640 ~ 1023px | 2단 그리드, GNB 노출 시작(768px~) |
| Desktop | ≥ 1024px | 3단 그리드, 히어로 16:9 |

### 4.6 이미지 애셋 요구사항

| 키 | 용도 | 설명(alt) | 비율 |
|---|---|---|---|
| `blessing-ceremony-editorial` | 히어로 슬라이드 1 | `다양한 국적의 부부들이 함께 참여한 합동축복식` | 16:9 |
| `hero-couple` | 히어로 슬라이드 2 | `따뜻하게 미소짓는 축복가정 부부` | 16:9 |
| `hero-community-sharing` | 히어로 슬라이드 3 | `나눔장터에서 서로 나누는 사람들` | 16:9 |
| `home-family-time` | 홈 카드(행복의 꽃) | `집에서 함께 시간을 보내는 축복가정` | 4:3 |
| `home-sharing-market` | 홈 카드(나눔의 열매) | `나눔장터에서 서로 나누는 사람들` | 4:3 |
| `ca-blessing-2027` | 홈 카드(축복결혼) | `2027 축복결혼 안내` | 4:3 |
| `ca-baby-blessing` | 홈 카드(HJ Baby) | `HJ Baby Blessing 가정의 따뜻한 모습` | 4:3 |
| `ca-seonghwa` | 홈 카드(성화감사장) | `성화감사장 안내` | 4:3 |
| `mark-lavender.png` | 로고 마크 | `블레싱월드 마크` | 1:1 |

- 포맷: WebP 우선, PNG 폴백
- `loading="lazy"` (히어로 첫 슬라이드는 `eager` + `fetchpriority="high"`)
- 인물 사진은 **초상권 동의를 받은 이미지만** 사용

---

## 5. 공통 컴포넌트

### 5.1 `<Header />`

```
[로고마크][블레싱월드]                    축복의 씨앗  행복의 꽃  축복가치교육  지역가정교회
```

- `position: sticky; top: 0; z-index: 50`
- 배경 `bg-background/85 backdrop-blur-md`, 하단 `border-b border-border`
- 활성 라우트: `text-primary` + 하단 2px `primary` 언더라인
- 모바일: 우측 햄버거 → shadcn `Sheet` 드로어

### 5.2 `<Footer />` — **모든 페이지 공통, 카피 원문 그대로**

```
블레싱월드

블레싱월드는 세계평화통일가정연합 가정행복국이 운영하는 축복결혼·가정생활 통합 안내 서비스입니다.

┌─────────────────────────┬─────────────────────────┐
│ 운영기관                 │ 답변 소요 시간            │
│ 세계평화통일가정연합       │ 신청 후 영업일 기준       │
│ 가정행복국               │ 1~2일 이내 지역 담당자 연락│
├─────────────────────────┼─────────────────────────┤
│ 개인정보 및 서비스 문의    │ 상담 중단·정보 삭제       │
│ 세계평화통일가정연합       │ 담당자에게 요청하시면      │
│ 가정행복국               │ 연락을 중단하고 관련 절차에 │
│                         │ 따라 개인정보를 파기합니다. │
└─────────────────────────┴─────────────────────────┘

개인정보처리방침    이용약관

© 2026 블레싱월드. All rights reserved.
```

- 4개 정보 블록은 데스크톱 `grid-cols-2`(또는 `4`), 모바일 1단
- 하단 링크: `/privacy`, `/terms`

> ⚠️ **표기 불일치 주의**: 원본은 푸터에서는 `가정행복국`, `/civil-affairs`에서는 `세계평화통일가정연합 한국협회 / 가정행복지원국 축복가정부`로 표기가 다릅니다. 재구현 시 **하나로 통일**할 것 (§10 I-02). (`/civil-affairs` 자체는 실제 구현에서 폐기되었지만(§13.5), 표기 통일 원칙은 그대로 적용해 푸터·다른 화면 어디서나 같은 명칭을 씁니다.)

### 5.3 `<SEO />` (react-helmet-async)

라우트별 메타 태그. **원본 실측값 그대로 사용**.

| 라우트 | `<title>` | `meta description` |
|---|---|---|
| `/` | 블레싱월드 — 축복결혼을 처음 만나는 곳 | 축복결혼이 처음이신 분을 위한 따뜻한 안내소. 궁금한 것부터 하나씩, 블레싱월드가 함께합니다. |
| `/guide` | 축복의 씨앗 — 축복결혼 안내 | 축복결혼이 무엇인지, 그 가치와 의미부터 실제 준비 절차까지 처음 오신 분을 위한 안내. |
| `/stories` | 행복의 꽃 — 축복가정의 이야기 | 실제 축복가정의 인터뷰와 사례를 통해 축복결혼이 삶에서 어떻게 피어나는지 만나보세요. |
| `/curriculum` | 축복가치교육 — 축복교육 4강좌 | 축복결혼이 궁금한 분들을 위한 4개의 강좌를 순서대로, 또는 골라서 들어보세요. |
| `/churches` | 지역가정교회 — 블레싱월드 | 지역을 선택하면 담당 지역가정교회의 연락처를 안내해드려요. |
| `/documents` | 제출서류 안내 — 축복후보자 제출서류 및 심사기준 | 미혼1세·축복자녀 축복후보자가 준비할 제출서류와 심사기준을 유형별로 확인해보세요. |
| `/onboarding` | 처음 오셨나요? — 블레싱월드 안내 | 축복결혼이 처음이신 분을 위한 간단한 안내 신청 — 이름과 연락처만으로 시작할 수 있어요. |

**OG 태그 (공통 기본값 + 페이지 오버라이드)**

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="블레싱월드 — 축복결혼을 처음 만나는 곳" />
<meta property="og:description" content="축복결혼이 처음이신 분을 위한 따뜻한 안내소. 궁금한 것부터 하나씩, 블레싱월드가 함께합니다." />
<meta property="og:image" content="{OG_IMAGE_URL}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="블레싱월드 — 축복결혼을 처음 만나는 곳" />
<meta name="twitter:description" content="축복결혼이 처음이신 분을 위한 따뜻한 안내소. 궁금한 것부터 하나씩, 블레싱월드가 함께합니다." />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

- `/guide` 는 og:title `축복의 씨앗 — 축복결혼 안내`, og:description `축복결혼의 정의·가치·의미·사례·절차를 하나의 흐름으로 안내합니다.` 로 오버라이드
- `/curriculum` 은 §P-04 SEO 표(위) 값을 그대로 사용 (오버라이드 없음)
- `/stories` 는 og:description `축복결혼이 실제 삶에서 어떻게 피어나는지, 가정들의 이야기로 만나보세요.`

### 5.4 `<SectionHeading />`

원본이 전 페이지에서 반복 사용하는 3단 헤딩 패턴.

```tsx
<SectionHeading
  eyebrow="BLESSING GUIDE"     // 영문 대문자, tracking-wide, accent 컬러
  title="두 사람의 약속이 한 가정의 시작이 됩니다"
  description="…"              // 선택
  align="center"               // center | left
/>
```

---

## 6. 화면별 상세 명세

---

### P-01. 홈 `/`

**목표**: 첫 방문자에게 서비스 정체성을 3초 안에 전달하고 `/guide` 또는 `/onboarding`으로 유도.

#### 섹션 구성 (위 → 아래)

**① 히어로 캐러셀**

- 이미지 3장 자동 롤링 (5초 간격, fade 전환, `prefers-reduced-motion` 시 자동재생 정지)
- 좌우 화살표 + 하단 dot 인디케이터
- 이미지 위 어두운 그라디언트 오버레이 + 텍스트

| 슬라이드 | alt 텍스트 |
|---|---|
| 1 | 다양한 국적의 부부들이 함께 참여한 합동축복식 |
| 2 | 따뜻하게 미소짓는 축복가정 부부 |
| 3 | 나눔장터에서 서로 나누는 사람들 |

**② 인트로 3단 블록** — 카피 원문

```
[1] eyebrow: 축복결혼이란?
    title:   두 사람의 약속이 한 가정의 시작이 됩니다
    body:    서로를 존중하고 책임 있는 사랑을 실천하며,
             함께 행복한 가정을 만들어 가는 약속입니다.

[2] eyebrow: 처음 오셨나요?
    title:   가정을 향한 마음, 여기서 함께 알아가요
    body:    축복결혼이 궁금한 분부터 이미 가정을 이룬 분까지,
             필요한 이야기와 도움을 편안하게 만나보세요.

[3] eyebrow: 행복을 나누는 가정
    title:   가정의 행복은 나눌수록 깊어집니다
    body:    먼저 그 길을 걸어간 가정들의 이야기와
             따뜻한 공동체를 만나보세요.
```

**③ 메인 CTA 버튼 2개**

| 라벨 | 스타일 | 링크 |
|---|---|---|
| `축복결혼 알아보기` | Primary (라벤더 채움) | `/guide` |
| `축복결혼 안내 신청` | Outline (라벤더 테두리) | `/onboarding` |

- 모바일: 세로 스택 + `w-full`

**④ 콘텐츠 카드 그리드 (5장)**

각 카드 구조: `[이미지] [카테고리 배지] [제목] [설명] [자세히 보기 →]`

| # | 배지 | 제목 | 설명 | 링크 | CTA 라벨 |
|---|---|---|---|---|---|
| 1 | 행복의 꽃 | 가정의 이야기 | 실제 축복가정의 인터뷰와 사례를 통해 따뜻한 가정 문화를 만나보세요. | `/stories` | `자세히 보기 →` |
| 2 | 축복가치교육 | 축복교육 4강좌 | 축복결혼이 궁금한 분들을 위한 4개의 강좌. 순서대로, 또는 궁금한 것부터 들어보세요. | `/curriculum` | `강좌 보기 →` |
| 3 | 지역가정교회 | 가까운 지역가정교회 찾기 | 지역을 선택하면 담당 지역가정교회의 연락처를 안내해드려요. | `/churches` | `지역가정교회 찾기 →` |
| 4 | 외부 서비스 | HJ Baby Blessing | 새 생명의 탄생을 축하하고, 탄생축하 지원을 신청하세요. | `https://hyojeongbaby-blessing.lovable.app/` (외부, `target="_blank" rel="noopener noreferrer"`) | `자세히 보기 →` |
| 5 | 외부 서비스 | 성화감사장 | 성화하신 분을 기리는 성화감사장을 신청하세요. | Google Forms (외부) | `자세히 보기 →` |

> 3번은 원본의 "2027 축복결혼"(→ `/civil-affairs/blessing-marriage`) 카드 자리를 대체합니다.
> 4·5번의 배지는 원본에서 "가정민원실"이었으나, 가정민원실 자체가 폐기되어(§13.5) "외부
> 서비스"로 바꿨습니다 — 두 카드 모두 원래도 외부 링크였으므로 동작에는 변화가 없습니다.

- 그리드: `lg:grid-cols-3` (1·2번은 `lg:col-span-*`로 크게, 3~5번은 작게 — 매거진형 비대칭 배치 권장)
- 외부 링크 카드에는 `ExternalLink` 아이콘 표시

**⑤ 푸터** (§5.2)

---

### P-02. 축복의 씨앗 `/guide`

**목표**: 축복결혼의 개념·가치·절차를 하나의 스크롤 흐름으로 이해시키고 `/onboarding` 전환.

#### 섹션 구성

**① 히어로**

```
eyebrow: BLESSING GUIDE
title:   두 사람의 약속이 한 가정의 시작이 됩니다
```

바로 아래 **신뢰 배지 3개** (아이콘 + 짧은 문구, 가로 나열 / 모바일 세로)

```
· 상담은 언제나 무료예요
· 결정은 본인이 해요
· 원할 때 중단할 수 있어요
```

> 이 3개 배지는 페이지 최상단 + CTA 섹션 하단에 **두 번** 반복 노출됩니다.

**② What is the Blessing?**

```
eyebrow: What is the Blessing?
title:   결혼을 넘어, 함께 살아갈 방향을 약속합니다

body-1:  축복결혼은 단지 두 사람이 만나는 예식이 아닙니다.
         서로의 다름을 존중하고, 어려움 속에서도 사랑을 선택하며,
         행복한 가정을 함께 만들어 가겠다는 삶의 약속입니다.

body-2:  세계평화통일가정연합은 가정을 사랑과 평화가 시작되는
         가장 소중한 자리로 바라봅니다.

blockquote:
         "완벽한 사람을 찾기보다, 함께 성장할 사람을 만나는 것.
          축복결혼은 그 진솔한 약속에서 시작됩니다."
```

- `blockquote`는 좌측 4px `accent` 세로선 + 이탤릭, `accent-soft` 배경 카드

**③ Our Direction — 가치 4기둥**

```
eyebrow: Our Direction
title:   우리가 소중히 여기는 것
lead:    완벽한 가정보다 서로 배우고 성장하는 가정을 꿈꿉니다.
```

| 가치 | 설명 | 아이콘(lucide) |
|---|---|---|
| **존중** | 서로의 다름을 인정하고 있는 그대로의 삶을 귀하게 여깁니다. | `Heart` |
| **책임** | 사랑을 말에만 두지 않고 배려와 돌봄으로 실천합니다. | `HandHeart` |
| **성장** | 갈등을 피하기보다 함께 풀어가며 더 깊은 관계로 나아갑니다. | `Sprout` |
| **나눔** | 우리 가정의 행복을 이웃과 나누며 더 따뜻한 세상을 만들어 갑니다. | `Users` |

- 레이아웃: `md:grid-cols-2 lg:grid-cols-4`

**④ Step by Step — 6단계 여정** ⭐ 핵심 섹션

```
eyebrow: Step by Step
title:   천천히 배우고, 충분히 준비합니다
lead:    축복결혼은 한 번의 신청으로 결정되는 과정이 아닙니다.
         상담과 교육을 통해 나와 가정을 준비하고,
         충분히 이해한 뒤 다음 걸음을 선택합니다.
```

6단계는 **3개 그룹**으로 묶임. 각 그룹은 그룹 제목 + 그룹 설명 + 스텝 카드 2개.

| 그룹 | 그룹 제목 | 그룹 설명 | 스텝 |
|---|---|---|---|
| A | **알아보기** | 가정을 향한 마음을 천천히 나눕니다 | 01, 02 |
| B | **배우고 자라기** | 사랑과 관계를 배우며 나를 준비합니다 | 03, 04 |
| C | **만남과 가정의 시작** | 함께할 사람을 만나, 새로운 가정을 시작합니다 | 05, 06 |

| No | 스텝 제목 | 스텝 설명 |
|---|---|---|
| 01 | 축복 알아보기 | 축복결혼의 의미와 전체 과정을 이해합니다. |
| 02 | 첫 상담 | 지역 담당자와 현재 상황과 궁금한 점을 이야기합니다. |
| 03 | 축복교육 | 가정연합의 가치와 참부모님의 삶, 축복가정의 의미를 배웁니다. |
| 04 | 나를 준비하기 | 관계와 생활, 건강과 책임감을 돌아보며 가정생활을 준비합니다. |
| 05 | 만남 준비와 소개 | 필요한 교육을 마친 뒤, 같은 기준으로 준비된 상대와의 만남을 안내받습니다. |
| 06 | 축복 신청과 가정 출발 | 두 사람의 뜻을 확인하고 필요한 서류와 예식, 이후의 가정생활을 준비합니다. |

**구현 지침**
- 데스크톱: 좌측 세로 타임라인 라인 + 각 스텝에 원형 번호 노드
- 모바일: 세로 스택 카드, 번호는 카드 좌상단 배지
- 번호(`01`~`06`)는 큰 폰트(32px) + `primary` 컬러 + 낮은 opacity(0.3) 장식 처리
- 스크롤 진입 시 `fade-in-up` 순차 애니메이션 (stagger 80ms)

**⑤ FAQ 아코디언**

```
eyebrow: FAQ
title:   처음 오신 분들이 자주 묻는 질문
```

- shadcn `Accordion` (`type="single" collapsible`)
- **기본 5개 노출 + `질문 더 보기 (4)` 버튼 클릭 시 나머지 4개 추가 노출** (총 9개)
- 첫 항목은 기본 펼침 상태

| # | 질문 | 답변 |
|---|---|---|
| 1 | 축복결혼을 전혀 몰라도 상담할 수 있나요? | 네. 처음 오시는 분도 편안하게 이야기 나눌 수 있습니다. 지역 담당자가 눈높이에 맞춰 안내해 드립니다. |
| 2 | 상담을 받으면 바로 결혼해야 하나요? | `[답변 본문 필요]` — 취지: 상담과 결혼 결정은 별개이며 언제든 중단 가능함을 안내 |
| 3 | 가정연합 회원이 아니어도 상담할 수 있나요? | `[답변 본문 필요]` — 취지: 회원 여부와 무관하게 상담 가능 |
| 4 | 축복을 준비하려면 어떤 교육을 받나요? | `[답변 본문 필요]` — 취지: 축복교육 과정 개요 안내 |
| 5 | 배우자를 소개받을 수도 있나요? | `[답변 본문 필요]` — 취지: 교육 이수 후 만남 안내 절차 설명 |
| 6~9 | `[질문·답변 본문 필요]` | 원본에서 접힘 상태로 확보 불가 |

> ✅ **구현 시 조치**: 운영 담당자(가정행복국)로부터 2~9번 답변 원문을 확보해 `src/content/faq.ts`에 채울 것. 확보 전까지는 5개만 노출.

**⑥ 최종 CTA 섹션**

```
title: 축복을 향한 첫걸음, 궁금함에서 시작해도 좋습니다
body:  축복결혼이 낯설어도 괜찮습니다. 좋은 가정을 꿈꾸는 마음이 있다면,
       지금부터 천천히 함께 알아가 보세요.

[버튼] 축복결혼 안내 신청하기  →  /onboarding

하단 배지 3개:
  · 무료 상담
  · 1~2영업일 내 지역 안내
  · 언제든 연락 중단 가능

미세 문구: 개인정보는 안내 목적에만 사용됩니다. [개인정보처리방침] → /privacy
```

- 섹션 배경: `primary-soft` 또는 부드러운 라벤더 그라디언트

---

### P-03. 행복의 꽃 `/stories`

**목표**: 실제 축복가정의 인터뷰·사례 아카이브.

#### 실측 확인 사항
- 히어로: `eyebrow: Our Stories` / `title: 행복의 꽃` / `sub: 서로를 이해하고 함께 성장해 온 축복가정의 진솔한 이야기를 만납니다.`
- 분석 시점 기준 **스토리 콘텐츠 0건 (빈 상태)**

#### 설계 명세 (제안)

**① 히어로** — 위 실측 카피 그대로

**② 필터 바**
- 카테고리 탭: `전체` / `인터뷰` / `사례` / `영상`
- 정렬: `최신순` / `조회 많은순`

**③ 스토리 카드 그리드** (`md:grid-cols-2 lg:grid-cols-3`)

카드 구조:
```
[썸네일 4:3]
[카테고리 배지]
[제목 — 2줄 클램프]
[요약 — 3줄 클램프]
[가정명 or 지역 · 게시일]
```

**④ 빈 상태 (필수 구현)**

현재 콘텐츠가 없으므로 **`EmptyState` 컴포넌트가 반드시 있어야 함**.

```
[아이콘: Flower2]
첫 번째 이야기를 준비하고 있어요
곧 축복가정들의 진솔한 이야기를 만나보실 수 있습니다.

[버튼] 축복결혼 알아보기 → /guide
```

**⑤ 상세 페이지 `/stories/:slug`**
- 커버 이미지 → 제목 → 메타(가정/지역/게시일) → 본문(리치텍스트) → 공유 버튼 → 이전/다음 스토리 → 관련 CTA(`/onboarding`)

---

### P-04. 축복가치교육 `/curriculum` (실제 구현본 — 원본 나눔의 열매를 대체)

> 원본 사이트의 "나눔의 열매"(`/community`, 지역 나눔장터) 자리는 실제 구현에서 **축복가치교육**으로
> 대체되었습니다. 원본 나눔의 열매 명세는 §13.1에 그대로 보존해 두었습니다.

**목표**: 축복결혼에 관심 있는 사람에게 축복교육 4강좌를 순서대로(또는 원하는 강좌부터) 듣게 하고,
`/guide`의 "축복교육" 단계(StepJourney 3단계)와 연결해 `/onboarding` 전환으로 이어지게 함.

#### 섹션 구성

**① 히어로**
```
eyebrow: BLESSING EDUCATION
title:   축복교육 4강좌로 차근차근 알아가요
body:    축복결혼이 궁금한 분들을 위한 4개의 강좌입니다.
         순서대로 들어도, 궁금한 강좌부터 골라 들어도 괜찮아요.
```

**② 내 진행 상태**
- `완료 강좌 수 / 전체 강좌 수` 표시 + 진행률 바
- 진행 상태는 **로그인 없이 이 브라우저의 `localStorage`에만** 저장(§5.4). 다른 기기·브라우저에서는
  초기화됨을 안내 문구로 명시.

**③ 강좌 목록** (기본 4강좌, 관리자가 추가·삭제 가능 — §admin/curriculum)

| # | 제목 | 설명 |
|---|---|---|
| 1 | 축복결혼이란 무엇인가 | 축복결혼의 정의와 역사, 왜 '축복'이라 부르는지 소개 |
| 2 | 참사랑과 가정의 가치 | 참사랑의 의미와 가정이 사랑과 평화의 출발점인 이유 |
| 3 | 참부모님의 삶과 축복의 역사 | 참부모님의 삶의 여정과 축복결혼이 걸어온 역사 |
| 4 | 축복가정으로 살아가기 | 축복 이후 가정생활에서 실천하는 태도와 준비 |

각 카드: `[순번] [제목] [완료 배지(완료 시)] [강사/담당 · 재생 시간] [소개] [영상 준비 중 안내(영상 URL 없을 때)] [다 들었어요 토글]`

- 영상 URL이 비어 있으면 "강의 영상은 준비 중이에요" 안내로 대체 (강좌 소개까지는 항상 노출)
- 비공개(`is_published=false`) 강좌는 목록에서 제외

**④ 전체 완료 시 CTA**
```
title: 4강좌를 모두 들으셨나요?
body:  이제 지역 담당자와 함께 다음 걸음을 이야기해보세요.
[버튼] 축복결혼 안내 신청하기 → /onboarding
```

#### 데이터 원천

- Supabase `courses` 테이블(§7.2)에서 게시된 강좌만 정렬해 가져옵니다.
- Supabase 미연결 시 `src/content/curriculum.ts`의 `DEFAULT_COURSES` 4개 항목으로 대체됩니다.

---

### P-05. 지역가정교회 `/churches` (실제 구현본 — 원본 가정민원실을 대체)

> 원본 가정민원실(`/civil-affairs`, `/civil-affairs/blessing-marriage`) 명세는 §13.5에 보존해
> 두었습니다. **실제 구현에서는 가정민원실 전체(서비스 카드 3장, 축복결혼 행정 안내 탭·준비
> 현황 위젯, 운영 정보 블록)가 삭제되었고**, 같은 GNB 자리를 지역가정교회 디렉터리가
> 대신합니다. `/civil-affairs`, `/civil-affairs/blessing-marriage`로 들어오면 `/churches`로
> 리다이렉트됩니다.

**목표**: 방문자가 지역(시·도/시·군·구)으로 가까운 지역가정교회를 찾아 연락할 수 있게 함.

#### 섹션 구성

**① 히어로**
```
eyebrow: 지역가정교회
title:   가까운 지역가정교회를 찾아보세요
body:    지역을 선택하면 담당 지역가정교회의 연락처를 안내해드려요.
         목록에 없는 지역은 대표 연락처로 문의해주세요.
```

**② 지역 선택 → 결과**
- 시·도 → 시·군·구 2단 select. 옵션은 `churches` 테이블에 **실제로 등록된 지역만** 동적으로
  채워집니다(전국 행정구역 마스터 데이터를 따로 두지 않음).
- 시·도 선택 시 해당 지역의 교회 카드(이름·주소·전화 `tel:` 링크·담당자) 노출
- 결과 없음: `이 지역에는 아직 등록된 지역가정교회 정보가 없어요. 대표 연락처로 문의해주세요.`
- 게시(`is_published=true`)된 교회만 노출. 관리는 `/admin/churches`(§8.3)

**③ 대표 연락처 안내** (페이지 하단, 고정 문구)
```
목록에 없는 지역이거나 더 궁금한 점이 있으시면
대표 연락처 02-3000-3000(평일 09:00–18:00)로 문의해주세요.
```
- `§footer.ts`의 `CONTACT_PHONE_DISPLAY`/`CONTACT_PHONE_TEL`/`CONTACT_HOURS`를 그대로 재사용
  (가정민원실 운영 정보 블록이 없어진 뒤에도 대표 연락처 접점을 유지하기 위함)

---

### P-07. 안내 신청 온보딩 `/onboarding` ⭐ 전환 핵심

**목표**: 최소 마찰로 리드(이름·연락처·성별·출생연도·지역)를 확보.

#### 헤더 영역 — 카피 원문

```
title:  처음 오셨나요?
sub:    간단히 알려주시면, 편안하게 안내해 드릴게요
body:   축복결혼이 처음이신 분을 위한 안내 신청입니다.
        맞춤 안내를 위해 이름, 연락처, 성별, 출생연도와 생활지역을 확인합니다.
```

#### 스텝 인디케이터 — 실측 5단계

```
성별  →  출생년도  →  지역  →  연락처  →  완료
 ①        ②         ③        ④        ⑤
```

- 상단 가로 스텝 바 + 진행률 표시
- 현재 스텝 `primary` 채움, 완료 스텝 체크 아이콘, 미완료 `muted`
- 모바일: 축약형 `2 / 5` + 프로그레스 바

#### 스텝별 명세

**Step 1 — 성별** (실측)
```
질문: 성별을 선택해주세요
선택지: [여성] [남성]     ← 큰 카드형 라디오 2개, 좌우 배치
```
- 선택 즉시 자동으로 다음 스텝 이동 (auto-advance)

**Step 2 — 출생년도**
```
질문: 출생년도를 알려주세요
입력: Select 또는 4자리 숫자 입력
검증: 1940 ~ (현재연도 - 18). 만 18세 미만 차단 + 안내 문구 노출
```

**Step 3 — 지역**
```
질문: 어디에 살고 계신가요?
입력: 시·도 Select → 시·군·구 Select (2단 연동)
검증: 둘 다 필수. 시·군·구까지만 수집(상세 주소 수집 금지)
```

**Step 4 — 연락처**
```
질문: 연락받으실 정보를 알려주세요
필드:
  · 이름          text        필수, 2~20자
  · 휴대전화 번호  tel         필수, 010-0000-0000 자동 하이픈 포맷
  · 이메일        email       선택
동의 (필수 체크박스):
  · [필수] 개인정보 수집·이용에 동의합니다.  [자세히 보기] → /privacy 모달
    수집 항목: 이름, 연락처, 성별, 출생연도, 거주 지역
    이용 목적: 지역 담당자 연결 및 축복결혼 안내·상담
    보유 기간: 상담 종료 후 1년
```

**Step 5 — 완료**
```
[체크 아이콘 애니메이션]
신청이 접수되었어요

영업일 기준 1~2일 이내에 가까운 지역 담당자가 연락드릴 예정입니다.
연락을 원하지 않으시면 언제든 중단을 요청하실 수 있습니다.

[버튼] 축복결혼 더 알아보기  → /guide
[버튼] 홈으로               → /
```

#### 공통 동작

| 항목 | 사양 |
|---|---|
| 하단 버튼 | `이전` (outline) / `다음` (primary). Step 1은 `이전` 비활성 |
| 유효성 | zod 스키마. 미충족 시 `다음` 비활성 + 필드 하단 에러 메시지 |
| 상태 보존 | `sessionStorage`에 진행 상태 저장, 새로고침 시 복원 |
| 이탈 방지 | Step 2~4에서 페이지 이탈 시 `beforeunload` 확인 |
| 접근성 | 스텝 전환 시 `aria-live="polite"`로 안내, 첫 필드에 자동 포커스 |
| 제출 | Supabase `guidance_requests` insert → 성공 시 Step 5, 실패 시 토스트 에러 + 재시도 |
| 중복 방지 | 동일 전화번호 24시간 내 재신청 시 안내 메시지 |
| 스팸 방지 | honeypot 필드 + 제출 rate limit (IP당 시간당 3회) |

---

### P-08. 개인정보처리방침 `/privacy`

카피 원문 (본문 구조 그대로 재현):

```
블레싱월드 개인정보처리방침

블레싱월드는 축복결혼·가정생활 안내 서비스로서 다음과 같이 개인정보를 관리합니다.

■ 수집 정보
안내 신청 시 이름, 연락처, 성별, 출생연도, 거주 지역(시·도/시·군·구)을 수집합니다.
회원가입 추가 항목으로 이메일과 표시 이름이 수집되며,
식구 인증 신청 시 생년월일, 소속 교구·교회, 교인 번호가 수집됩니다.

■ 이용 목적
개인정보는 가까운 지역 담당자 연결, 축복결혼 안내·상담 진행, 신청 이력 확인,
서비스 문의 응대 목적으로만 활용되며, 제3자 판매나 다른 용도로의 활용은 없습니다.

■ 보관 및 폐기
상담 종료 후 1년간 보관 후 파기되며, 회원 탈퇴 시는 즉시 삭제됩니다.
법령상 보존 필요 시 해당 기간 동안 보관합니다.

■ 정보주체 권리
개인정보 열람, 정정, 삭제, 처리정지를 언제든지 요청 가능하며,
영업일 기준 3일 이내에 처리 결과가 통지됩니다.
상담 중단 요청 시 즉시 연락을 중단하고 개인정보는 파기됩니다.

■ 보안
접근 권한이 부여된 담당자만 열람 가능하도록 권한을 분리하며, 전송 구간은 암호화합니다.

문의처: 02-3000-3000 | 평일 09:00–18:00
```

> 💡 **중요 시사점**: 이 방침은 **회원가입(이메일·표시이름)** 과 **식구 인증(생년월일·소속 교구·교회·교인번호)** 기능의 존재를 전제합니다. 원본 사이트에서 해당 UI는 확인되지 않았으나, **§7 데이터 모델에는 반영**되어야 합니다.

---

### P-09. 이용약관 `/terms`

카피 원문 (조문 구조 그대로 재현):

```
이용약관

제1조 (운영 주체)
블레싱월드는 세계평화통일가정연합 한국협회 가정행복지원국이 운영하는
축복결혼·가정생활 안내 서비스입니다.

제2조 (참여의 자발성)
모든 상담, 교육, 행사 참여는 이용자의 자유로운 선택에 따릅니다.
이용자는 언제든 상담을 중단하거나 참여를 철회할 수 있으며, 이에 따른 불이익은 없습니다.

제3조 (비용)
기본 안내와 상담은 무료입니다.
교육 과정, 행사 참가 등 실비가 발생하는 경우 신청 전에 항목과 금액을
서면 또는 구두로 안내하며, 사전 안내 없이 비용을 청구하지 않습니다.

제4조 (이용자의 게시물)
사용자가 작성한 글과 사진의 저작권은 본인에게 귀속됩니다.
운영자는 서비스 화면 노출을 위한 범위에서만 이를 사용하며,
작성자는 언제든 삭제할 수 있습니다.

제5조 (금지 행위)
개인정보 도용, 허위 정보, 상업적 광고, 비방 및 차별 표현은 금지됩니다.
위반 시 게시물 삭제 또는 이용 제한이 가능합니다.

제6조 (문의)
약관 및 서비스 관련 문의는 02-3000-3000(평일 09:00–18:00)으로 연락해 주세요.
```

- 조문 스타일: 조 제목 `H3`, 본문 들여쓰기, 조 사이 `py-6` 간격
- 상단에 목차(anchor 링크) 제공 권장

---

### P-10. 404 `*`

```
페이지를 찾을 수 없어요
주소가 바뀌었거나 삭제된 페이지일 수 있습니다.
[버튼] 홈으로 돌아가기
```

---

## 7. 데이터 모델 (Supabase)

### 7.1 ERD 요약

```
profiles ──< guidance_requests
   │
   ├──< member_verifications
   └──< blessing_progress

stories (관리자 작성)
regions (마스터)
faqs (관리자 관리)
courses (관리자 관리)   — §P-04 축복가치교육
churches (관리자 관리)  — §P-05 지역가정교회 연결

[미사용] community_posts ──< community_comments
                  └──< community_requests
```

> `community_posts`/`community_requests`/`community_comments`는 나눔의 열매 폐기(§13.1) 이후
> **참조하는 프론트엔드 코드가 없습니다.** 데이터 손실 방지를 위해 테이블은 삭제하지 않고
> 그대로 두었을 뿐, 신규 구현에서는 사용하지 마세요.

### 7.2 테이블 정의

#### `profiles` — 사용자 프로필
| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | PK, FK→auth.users | |
| display_name | text | not null | 표시 이름 |
| email | text | | |
| phone | text | | 암호화 저장 권장 |
| gender | text | check in ('female','male') | |
| birth_year | int | | |
| region_sido | text | | 시·도 |
| region_sigungu | text | | 시·군·구 |
| is_verified_member | boolean | default false | 식구 인증 여부 |
| role | text | default 'user' | user / staff / admin |
| created_at | timestamptz | default now() | |

#### `guidance_requests` — 안내 신청 (온보딩 폼) ⭐
| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | PK default gen_random_uuid() | |
| user_id | uuid | FK→profiles, nullable | 비회원 신청 허용 |
| name | text | not null | |
| phone | text | not null | |
| email | text | | |
| gender | text | not null, check in ('female','male') | |
| birth_year | int | not null | |
| region_sido | text | not null | |
| region_sigungu | text | not null | |
| status | text | default 'received' | received / assigned / contacted / in_progress / closed / opted_out |
| assigned_staff_id | uuid | FK→profiles | 지역 담당자 |
| assigned_at | timestamptz | | |
| contacted_at | timestamptz | | |
| memo | text | | 담당자 메모 |
| privacy_agreed_at | timestamptz | not null | 동의 시각 (법적 근거) |
| source | text | default 'web' | 유입 경로 |
| purge_after | date | | 상담 종료 + 1년 |
| created_at | timestamptz | default now() | |

#### `stories` — 행복의 꽃
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| slug | text unique | URL |
| title | text not null | |
| excerpt | text | 카드 요약 |
| body | text | 마크다운/리치텍스트 |
| cover_image_url | text | |
| category | text | interview / case / video |
| family_name | text | 가정 표기(익명 가능) |
| region | text | |
| view_count | int default 0 | |
| is_published | boolean default false | |
| published_at | timestamptz | |
| created_at | timestamptz default now() | |

#### `courses` — 축복가치교육 (§P-04, 실제 구현 추가)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | text PK | 사람이 읽을 수 있는 고정 슬러그(예: `step-01`) |
| order_no | int | 노출 순서 |
| title | text not null | |
| instructor | text | 강사/담당 |
| duration_minutes | int | |
| description | text | |
| video_url | text | 비어 있으면 "영상 준비 중"으로 표시 |
| is_published | boolean default true | |
| created_at | timestamptz default now() | |

- RLS: 게시된(`is_published=true`) 강좌는 누구나 조회, 쓰기는 `is_staff_or_admin()`(§8)인 로그인 사용자만.
- 진행률(완료 여부)은 별도 테이블 없이 방문자의 `localStorage`에만 저장합니다(로그인 불필요, §P-04②).

#### `churches` — 지역가정교회 (§P-05, 실제 구현 추가)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | text PK | |
| region_sido | text not null | 시·도 |
| region_sigungu | text not null | 시·군·구 |
| name | text not null | 교회명 |
| address | text | |
| phone | text | |
| contact_name | text | 담당자 |
| is_published | boolean default true | |
| created_at | timestamptz default now() | |

- RLS: `courses`와 동일한 패턴(게시된 것만 공개 조회, 쓰기는 `is_staff_or_admin()`).
- 전국 행정구역 마스터를 따로 두지 않고, `region_sido`/`region_sigungu`에 **실제 등록된 값만** 셀렉트 옵션으로 씁니다.

#### [미사용] `community_posts` — 나눔의 열매 폐기(§13.1)로 프론트엔드에서 더 이상 참조하지 않음
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| author_id | uuid FK→profiles not null | |
| category | text not null | goods / talent / together / chat |
| title | text not null | 2~60자 |
| body | text not null | 10~2000자 |
| image_urls | text[] | 최대 5 |
| region_sido | text not null | |
| region_sigungu | text not null | |
| method | text | direct / delivery / online |
| status | text default 'open' | open / reserved / completed |
| view_count | int default 0 | |
| like_count | int default 0 | |
| report_count | int default 0 | |
| recommend_score | numeric | §P-04 산식으로 계산·갱신 |
| completed_at | timestamptz | |
| created_at | timestamptz default now() | |

#### [미사용] `community_requests` — 나눔 신청
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| post_id | uuid FK→community_posts | |
| requester_id | uuid FK→profiles | |
| message | text | |
| status | text default 'pending' | pending / accepted / rejected / cancelled |
| accepted_at | timestamptz | 수락 시점에만 상세 위치·연락처 공개 |

#### [미사용] `community_comments`
| 컬럼 | 타입 |
|---|---|
| id uuid PK / post_id uuid FK / author_id uuid FK / body text / parent_id uuid (대댓글) / created_at timestamptz |

#### `member_verifications` — 식구 인증
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id uuid PK | | |
| user_id | uuid FK→profiles | |
| birth_date | date | 개인정보처리방침 명시 항목 |
| district | text | 소속 교구 |
| church | text | 소속 교회 |
| member_no | text | 교인 번호 |
| status | text default 'pending' | pending / approved / rejected |
| reviewed_by uuid / reviewed_at timestamptz | | |

#### `blessing_progress` — 축복 준비 현황 (원본 P-06 위젯 설계, §13.5 — 아직 미구현)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id uuid PK | | |
| user_id uuid FK→profiles | | |
| step_key | text | step_01 ~ step_06 |
| status | text | not_started / in_progress / completed |
| completed_at | timestamptz | |
| updated_by | uuid | 담당자 |

#### `faqs`
| 컬럼 | 타입 |
|---|---|
| id uuid PK / question text / answer text / sort_order int / is_default_visible boolean / is_published boolean |

- `is_default_visible = true` 인 5개가 기본 노출, 나머지는 `질문 더 보기 (n)` 로 확장

#### `regions` — 지역 마스터
| 컬럼 | 타입 |
|---|---|
| code text PK / sido text / sigungu text / staff_id uuid (지역 담당자) |

### 7.3 RLS 정책 (필수)

```sql
-- guidance_requests: 익명 INSERT 허용, SELECT는 본인 또는 staff/admin만
alter table guidance_requests enable row level security;

create policy "anyone can submit" on guidance_requests
  for insert to anon, authenticated with check (true);

create policy "owner or staff can read" on guidance_requests
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from profiles p
               where p.id = auth.uid() and p.role in ('staff','admin'))
  );

-- community_posts: 게시된 글은 누구나 읽기, 작성/수정/삭제는 본인만
alter table community_posts enable row level security;

create policy "public read" on community_posts
  for select using (report_count < 5);

create policy "author write" on community_posts
  for insert to authenticated with check (author_id = auth.uid());

create policy "author update" on community_posts
  for update to authenticated using (author_id = auth.uid());

create policy "author delete" on community_posts
  for delete to authenticated using (author_id = auth.uid());

-- stories: 게시된 것만 공개 읽기, 쓰기는 admin
create policy "published read" on stories
  for select using (is_published = true);
```

> ⛔ **절대 금지**: `guidance_requests`, `member_verifications`에 대한 익명 SELECT 정책. 개인정보 유출 사고로 직결됩니다.

> 🐛 **실제 구현에서 발견·수정한 버그**: 위 `exists (select 1 from profiles p where p.id = auth.uid() and p.role in (...))`
> 패턴을 `profiles` 자신의 SELECT 정책에 그대로 쓰면 **`infinite recursion detected in policy for
> relation "profiles"`** 오류가 납니다(정책 평가 중 같은 정책을 다시 평가하게 됨). 로그인한
> staff가 `courses`/`churches`에 쓰기를 시도할 때도 같은 오류가 발생합니다.
> **해결**: role 조회를 RLS를 우회하는 `SECURITY DEFINER` 헬퍼 함수로 분리하십시오.
> ```sql
> create or replace function public.is_staff_or_admin(check_uid uuid)
> returns boolean language sql security definer set search_path = public stable as $$
>   select exists (select 1 from public.profiles p where p.id = check_uid and p.role in ('staff','admin'));
> $$;
> ```
> 이 함수를 만든 역할(마이그레이션을 실행하는 `postgres`)이 `BYPASSRLS` 속성을 가지고 있어
> 내부 조회가 RLS를 타지 않으므로 재귀가 끊깁니다. `profiles`를 포함한 모든 정책에서
> 인라인 `exists(...)` 대신 `public.is_staff_or_admin(auth.uid())`를 쓰십시오.

> 🔒 **회원가입 시 profiles 자동 생성 + role 셀프 승격 방지** (실제 구현 추가)
> `auth.users`에 새 계정이 생기면 트리거로 `profiles` 행을 자동 생성하고(`role`은 항상 `'user'`로
> 시작), `profiles.role`을 사용자 스스로 `staff`/`admin`으로 바꾸는 것은 `BEFORE UPDATE` 트리거로
> 차단합니다(단, `auth.uid()`가 없는 DB 직접 접속 — 운영자의 `psql`/대시보드 SQL 편집기 — 은
> 예외로 허용해 최초 관리자 부여가 가능하게 함). 최초 admin은 항상 운영자가
> `update profiles set role='admin' where email='...';` 로 수동 부여합니다.

### 7.4 개인정보 보존 자동화 (Edge Function, 일 1회 cron)

```
1. status = 'closed' 이고 closed_at + 1년 경과한 guidance_requests → 삭제
2. status = 'opted_out' → 즉시 삭제 (요청 접수 시 실행)
3. 삭제 이력은 개인식별정보 없이 audit_log 테이블에 건수만 기록
```

---

## 8. 관리자 요구사항 (별도 화면, `/admin/*`)

> 원본 사이트에는 공개 관리자 화면이 없으나, 서비스 운영에 필수적이므로 포함합니다.
> 아래 ✅ 표시 항목은 **실제로 구현·배포되어 동작 확인까지 마친** 화면이고, 나머지는 아직
> 설계 단계입니다.

### 8.1 로그인 (`/admin/login`) ✅ 구현됨

- Supabase Auth 이메일/비밀번호. 같은 화면에서 로그인·회원가입 탭 전환.
- 회원가입은 누구나 가능하지만 **기본 role은 항상 `'user'`** — staff/admin 권한은 화면에서
  자동 부여되지 않고, 운영자가 DB에서 수동으로 승격합니다(§7.3).
- 이메일 인증(confirm email)이 켜져 있으면 가입 직후 로그인 불가 — 메일 인증 후 로그인.
- `RequireAdmin`(`src/components/admin/RequireAdmin.tsx`)이 `/admin/*` 하위 라우트를 감싸
  ① 비로그인 → `/admin/login`으로 리다이렉트, ② 로그인했지만 `staff`/`admin`이 아니면
  "권한 없음" 화면을 보여줍니다.
- `AdminHeader`(`src/components/admin/AdminHeader.tsx`)가 로그인 정보·로그아웃·관리 화면 간
  이동 탭을 모든 `/admin/*` 화면에 공통 노출합니다.

### 8.2 축복가치교육 관리 (`/admin/curriculum`) ✅ 구현됨

- `courses` 목록 CRUD: 제목·강사·재생 시간·소개·영상 URL·공개 여부, 순서 변경(위/아래), 추가/삭제.
- Supabase 연결 시 저장하면 **모든 방문자에게 즉시 반영**. 미연결 시 이 브라우저의
  `localStorage`에만 저장되고 화면에 그 사실을 안내합니다(§src/lib/courses.ts).

### 8.3 지역가정교회 관리 (`/admin/churches`) ✅ 구현됨

- `churches` 목록 CRUD: 시·도·시·군·구·교회명·주소·전화·담당자·공개 여부.
- 저장 동작은 8.2 축복가치교육 관리와 동일한 패턴(`src/lib/churches.ts`).

### 8.4 나머지 관리 화면 (설계 단계, 미구현)

| 화면 | 기능 |
|---|---|
| 신청 관리 | `guidance_requests` 목록(지역·상태·기간 필터), 지역 담당자 배정, 상태 변경, 메모, CSV 내보내기(권한 제한) |
| 스토리 관리 | 작성/수정/게시·비게시, 커버 이미지 업로드 |
| FAQ 관리 | 문항 CRUD, 노출 순서, 기본 노출 여부 |
| 식구 인증 심사 | 대기 목록, 승인/반려 |
| 준비 현황 관리 | 사용자별 `blessing_progress` 단계 상태 갱신 |
| 통계 | 신청 건수 추이, 지역별 분포, 온보딩 스텝별 이탈률 |

> 원안에 있던 "커뮤니티 관리"(나눔의 열매 신고 게시물 큐)는 §13.1에 따라 대상 기능 자체가
> 폐기되어 제외했습니다.

- 접근 제어: `profiles.role in ('staff','admin')` — 실제로는 `public.is_staff_or_admin(auth.uid())`
  헬퍼로 판정합니다(§7.3). `staff`는 담당 지역 데이터만 조회 가능하도록 하는 세부 정책은 아직 미구현.
- 모든 개인정보 조회를 `access_log`에 기록하는 것도 아직 미구현입니다.

---

## 9. 비기능 요구사항 및 수용 기준

### 9.1 접근성 (WCAG 2.1 AA)

- [ ] 모든 이미지에 의미 있는 `alt` (§4.6 표의 문구 사용)
- [ ] 본문 텍스트 명도 대비 4.5:1 이상, 큰 텍스트 3:1 이상
- [ ] 키보드만으로 전체 내비게이션·폼·아코디언·캐러셀 조작 가능
- [ ] 포커스 링 항상 시각적으로 표시 (`ring-2 ring-ring ring-offset-2`)
- [ ] `Skip to content` 링크 제공
- [ ] 아코디언/탭에 올바른 `aria-expanded`, `aria-controls`
- [ ] 캐러셀 자동재생은 `prefers-reduced-motion: reduce` 시 정지
- [ ] 폼 에러는 `role="alert"` 로 스크린리더 전달

### 9.2 성능

| 지표 | 목표 |
|---|---|
| LCP | < 2.5s (4G) |
| CLS | < 0.1 |
| INP | < 200ms |
| 초기 JS 번들 | < 200KB (gzip) |

- 라우트별 `React.lazy` 코드 스플리팅
- 이미지 WebP + 반응형 `srcset` + `width`/`height` 명시(CLS 방지)
- 폰트 `font-display: swap` + 한글 서브셋

### 9.3 SEO

- [ ] 라우트별 고유 `title`/`description` (§5.3)
- [ ] `sitemap.xml`, `robots.txt`
- [ ] `Organization` + `FAQPage` JSON-LD 구조화 데이터
- [ ] canonical URL
- [ ] SPA인 경우 prerender(vite-plugin-ssg 등)로 크롤러 대응

### 9.4 브라우저 지원

Chrome / Edge / Safari / Firefox 최신 2개 버전, iOS Safari 15+, Android Chrome 최신

### 9.5 화면별 수용 기준 (Acceptance Criteria)

| ID | 기준 |
|---|---|
| AC-01 | GNB 5개 항목이 순서대로 표시되고, 현재 라우트가 시각적으로 강조된다 |
| AC-02 | 푸터가 모든 페이지에 동일하게 표시되고 §5.2 카피와 문자열이 정확히 일치한다 |
| AC-03 | 홈 히어로 캐러셀이 3장을 5초 간격으로 순환하고, 화살표·dot으로 수동 제어된다 |
| AC-04 | 홈 CTA `축복결혼 알아보기` → `/guide`, `축복결혼 안내 신청` → `/onboarding` 로 이동한다 |
| AC-05 | `/guide` 의 6단계 스텝이 3개 그룹으로 묶여 01~06 순서로 표시된다 |
| AC-06 | `/guide` FAQ가 기본 5개 노출되고 `질문 더 보기 (4)` 클릭 시 9개 전체가 노출된다 |
| AC-07 ✅ | `/curriculum` 강좌가 `order_no` 순으로 표시되고, `is_published=false` 강좌는 숨겨진다 |
| AC-08 ✅ | `/curriculum`에서 "다 들었어요" 토글이 진행률 바에 즉시 반영되고, 새로고침 후에도 유지된다(`localStorage`) |
| AC-09 ✅ | `/churches` 대표 연락처가 `tel:` 링크로 동작한다 |
| AC-09b ✅ | `/churches`에서 시·도 선택 시 시·군·구 옵션이 해당 지역 데이터로만 채워진다 |
| AC-10 | `/onboarding` 5스텝(성별→출생년도→지역→연락처→완료)이 순서대로 진행되고, 필수값 미입력 시 `다음`이 비활성화된다 |
| AC-11 | 온보딩 제출 시 `guidance_requests`에 레코드가 생성되고 `privacy_agreed_at`이 기록된다 |
| AC-12 | 개인정보 동의 체크 없이는 제출이 불가하다 |
| AC-13 | `/stories`에 데이터가 없을 때 빈 상태 UI가 표시되고 화면이 깨지지 않는다 |
| AC-14 | 모바일 375px 폭에서 가로 스크롤이 발생하지 않는다 |
| AC-15 ✅ | 익명 사용자가 `guidance_requests`를 SELECT 할 수 없다 (RLS 검증) — `courses`/`churches`도 동일 원칙으로 익명 쓰기가 REST API 레벨에서 401로 거부됨을 확인함 |
| AC-16 | 외부 링크(HJ Baby Blessing, 성화감사장)가 새 탭 + `rel="noopener noreferrer"` 로 열린다 |
| AC-17 | Lighthouse 접근성 점수 90 이상, SEO 점수 90 이상 |
| AC-18 ✅ | `/admin/curriculum`·`/admin/churches`는 비로그인 시 `/admin/login`으로 리다이렉트되고, `user` role 계정으로는 "권한 없음" 화면이 뜬다 |
| AC-19 ✅ | `user` role 계정이 REST API로 자신의 `profiles.role`을 `admin`으로 직접 바꿔도 실제 값은 바뀌지 않는다 (셀프 승격 방지 트리거 검증) |

> ✅ 표시는 실제 구현 후 수동으로 동작 확인까지 마친 항목입니다(§13). 나머지는 아직 자동화된
> 테스트나 수동 점검을 거치지 않았습니다.

---

## 10. 개선 제안 (원본 대비)

> 동일 재현을 기본으로 하되, 아래 항목은 **원본의 결함 또는 개선 여지**입니다. 우선순위 순.

### 🔴 필수 수정 (버그)

| ID | 항목 | 문제 | 조치 |
|---|---|---|---|
| **I-01** | 성화감사장 링크 | Google Forms **편집 URL**(`/edit?usp=drive_web&ouid=...`)로 연결됨. 권한에 따라 **폼 편집 화면이 노출되거나 접근 거부**됨. `ouid` 파라미터로 운영자 Google 계정 식별자가 노출됨 | 응답용 URL(`/viewform` 또는 단축 URL)로 즉시 교체 |
| **I-02** | 부서명 표기 불일치 | 푸터=`가정행복국`, 민원실=`한국협회 / 가정행복지원국 축복가정부` | 공식 명칭 하나로 통일 후 전 페이지 일괄 적용 |
| **I-03** | 답변 소요시간 불일치 | 푸터=`1~2일`, 민원실=`2일 이내` | 하나로 통일 |
| ~~I-04~~ | ~~`/civil-affairs/blessing-marriage` 미구현~~ | 메타 태그는 있으나 실제 콘텐츠는 `/civil-affairs`와 동일 | **해당 없음** — 가정민원실 자체가 폐기됨(§13.5) |
| **I-05** | `/stories` 콘텐츠 0건 | 홈에서 링크로 유도하나 도착하면 빈 화면 | 최소 3~5건 확보 전까지 빈 상태 UI 필수, 또는 홈 카드에 `준비 중` 배지 |
| **I-06** | FAQ 답변 미확보 | 2~9번 답변 원문 확인 불가 | 운영 담당자로부터 확보 |

### 🟡 사용성 개선

| ID | 제안 | 근거 |
|---|---|---|
| **I-07** ✅ | 대표 연락처(02-3000-3000)를 **푸터 외의 페이지에도** 노출 | 가정민원실 폐기 이후 `/civil-affairs`가 없어짐 → `/churches`(§6 P-05③)에 대표 연락처를 노출해 해결. 아직 푸터 자체에는 없음 |
| **I-08** | 온보딩 스텝 순서를 **지역 → 성별 → 출생년도 → 연락처** 로 조정 검토 | 첫 질문이 '성별'이면 일부 사용자에게 민감하게 느껴질 수 있음. 지역이 심리적 문턱이 낮음 |
| **I-09** | 온보딩 진입 전 **예상 소요시간 안내** ("30초면 끝나요") | 폼 이탈률 감소 |
| **I-10** | 홈에 **"내 준비 현황 보기"** 로그인 진입점 추가 | 기존 준비자(U-2)의 재방문 동선이 현재 없음 |
| ~~I-11~~ | ~~커뮤니티 지역 자동 필터~~ | **해당 없음** — 나눔의 열매 자체가 폐기됨(§13.1) |
| **I-12** | 스토리 상세에 **관련 CTA**(`/onboarding`) 배치 | 감정적 몰입 직후가 전환 최적 지점 |
| **I-13** | 카카오톡 채널 / 문의 폼 등 **비전화 문의 채널** 추가 | 20~30대 타깃에게 전화는 높은 문턱 |

### 🟢 확장 제안

| ID | 제안 |
|---|---|
| **I-14** | 다국어(영/일) 지원 — 히어로에 "다양한 국적의 부부" 이미지를 쓰는 만큼 국제 축복 수요 대응 |
| **I-15** | 온보딩 이탈 지점 분석용 이벤트 트래킹 (스텝별 `step_view` / `step_complete`) |
| **I-16** | 신청 접수 시 신청자에게 **알림톡 자동 발송** (접수 확인 + 담당자 연락 예정 안내) |
| **I-17** | `/guide` FAQ에 `FAQPage` JSON-LD 적용 → 구글 검색 리치 결과 노출 |
| **I-18** | 커뮤니티 게시물 신고 누적 시 자동 숨김 + 운영자 알림 (현재 `report_count < 5` 정책의 운영 자동화) |

---

## 11. 구현 마일스톤

| 단계 | 범위 | 산출물 |
|---|---|---|
| **M1 — 기반** | 프로젝트 스캐폴딩, 디자인 토큰(§4), Header/Footer/SEO(§5), 라우팅(§2) | 빈 화면이지만 전 라우트 이동 가능 |
| **M2 — 정적 페이지** | P-01 홈, P-02 가이드, P-08 개인정보, P-09 약관, P-10 404 — 원안의 "P-05 민원실"은 가정민원실 폐기로 대상이 없어짐(§13.5) | 콘텐츠 완성된 정보 사이트 |
| **M3 — 전환 퍼널** | Supabase 스키마 + RLS(§7), P-07 온보딩 폼 | 실제 리드 수집 가능 |
| **M4 — 콘텐츠** | P-03 스토리(목록·상세·관리) — 원안의 "P-06 축복결혼 행정 안내"는 가정민원실 폐기로 대상이 없어짐(§13.5) | 콘텐츠 운영 가능 |
| **M5 — 축복가치교육·지역가정교회 ✅** | P-04 축복가치교육(강좌 목록·진행 표시), P-05 지역가정교회 디렉터리 — 원안의 나눔의 열매(§13.1)·가정민원실(§13.5)은 폐기 | 축복가치교육·지역가정교회 오픈 |
| **M6 — 운영 (부분 완료 ✅)** | 관리자 로그인(§8.1), 축복가치교육 관리(§8.2), 지역가정교회 관리(§8.3) 완료. 신청/스토리/FAQ/식구인증/통계 관리, 개인정보 자동 파기(§7.4)는 미착수 | 축복가치교육·지역가정교회 운영 이관 가능 |
| **M7 — 품질** | 접근성·성능·SEO 점검(§9), 개선 항목(§10) 반영 | 정식 오픈 |

> 실제 구현은 위 순서를 그대로 따르지 않고 M5/M6 중 축복가치교육·지역가정교회·로그인 부분을
> 먼저 완료했습니다. M3(온보딩 제출 연동)·M4(스토리 관리)는 아직 착수 전입니다(§13).

---

## 12. 부록 — AI 코딩 도구용 시작 프롬프트

Lovable / Claude Code 등에 아래를 첫 프롬프트로 사용하십시오.

```
첨부한 PRD(BlessingWorld_PRD.md)를 따라 웹사이트를 구축해줘.

이번 작업 범위는 M1 + M2 (§11 마일스톤)이야:
1. §3.1 기술 스택으로 프로젝트를 세팅해줘.
2. §4 디자인 시스템의 CSS 변수와 타이포그래피를 index.css와
   tailwind.config.ts에 정확히 반영해줘. 색상은 하드코딩하지 말고
   반드시 시맨틱 토큰(bg-background, text-primary 등)만 사용해.
3. §5의 Header, Footer, SEO, SectionHeading 공통 컴포넌트를 만들어줘.
   Footer 문구는 §5.2 원문을 한 글자도 바꾸지 마.
4. §2.1 사이트맵대로 라우팅을 구성해줘.
5. §6의 P-01(홈), P-02(축복의 씨앗), P-05(지역가정교회),
   P-08(개인정보처리방침), P-09(이용약관), P-10(404)을 구현해줘.

지켜야 할 규칙:
- 모든 한국어 카피는 PRD에 적힌 원문 그대로 쓸 것. 임의로 바꾸지 말 것.
- 카피는 JSX에 하드코딩하지 말고 src/content/*.ts 상수로 분리할 것.
- 모든 문단에 word-break: keep-all 적용, 본문 행간 1.75.
- §9.1 접근성 체크리스트를 만족할 것 (alt 텍스트는 §4.6 표의 문구 사용).
- 모바일 375px에서 가로 스크롤이 생기지 않을 것.
- 이미지는 아직 없으니 §4.6의 키와 비율에 맞는 플레이스홀더로 두고,
  alt 텍스트는 표에 적힌 문구를 그대로 넣어줘.
- 성화감사장 링크는 §10 I-01에 따라 Google Forms 응답용 URL 자리표시자로 둘 것.

완료 후 §9.5의 AC-01 ~ AC-06, AC-14, AC-16을 스스로 점검해서
결과를 표로 보고해줘.
```

---

## 13. 구현 반영 변경 이력 (원본 대비)

이 절은 §1~§9 본문에 이미 반영된(현재 시점의) 변경 사항을 한곳에 모아 정리한 변경 이력입니다.
"왜 §6 P-04가 원본 실측 내용과 다른가?" 같은 질문에 답하기 위한 용도입니다.

### 13.1 나눔의 열매(`/community`) 폐기 → 축복가치교육(`/curriculum`)

원본 사이트를 분석해 작성했던 나눔의 열매(지역 기반 재능·물품 나눔장터) 명세를 참고용으로
남겨둡니다. **실제 구현에서는 이 화면 전체와 관련 라우트·컴포넌트가 삭제되었고**, 같은 GNB
자리를 축복가치교육(§6 P-04, 현재 버전)이 대신합니다.

- 폐기된 라우트: `/community`, `/community/new`, `/community/:id`
- 폐기된 파일: `src/pages/Community.tsx`, `CommunityNew.tsx`, `CommunityDetail.tsx`, `src/content/community.ts`, `src/components/community/*`
- **DB 테이블은 삭제하지 않음**: `community_posts`/`community_requests`/`community_comments`는
  데이터 손실 방지를 위해 그대로 남아 있으나(§7.1) 어떤 프론트엔드 코드도 더 이상 참조하지 않습니다.
- 원본 명세(카테고리 탭, 추천순 정렬 산식, 나눔 카드 그리드, 신청/수락 플로우 등)는 이 변경
  이전 시점의 §6 P-04에 있었던 내용이며, 향후 유사 기능을 다시 만들 때 참고할 수 있도록 이
  변경 이력에 그 존재만 기록해 둡니다(전문은 git 이력 참고).

### 13.2 지역가정교회 디렉터리 도입 (초기 버전 — 이후 13.5로 대체)

처음에는 원본에 없던 기능으로 `/civil-affairs`(가정민원실) 안에 지역(시·도/시·군·구) 기반
교회 디렉터리 섹션만 추가했습니다(`churches` 테이블, `/admin/churches` 관리 화면). 이후
§13.5에서 가정민원실 자체가 폐기되면서 이 디렉터리가 `/churches`라는 독립 페이지로
승격되었습니다 — 현재 §6 P-05가 최신 상태입니다.

### 13.3 관리자 로그인 · 인증 실제 구현

§8(관리자 요구사항)은 원래 "접근 제어: profiles.role" 정도만 언급하고 실제 로그인 화면은
설계하지 않았습니다. 실제 구현에서 Supabase Auth 기반 로그인(§8.1)과 그에 딸린 RLS 재귀 버그
수정(§7.3)까지 완료했습니다.

### 13.4 실제 Supabase 프로젝트 연결

§7의 스키마는 실제 Supabase 프로젝트에 마이그레이션까지 적용되어 있습니다
(`supabase/migrations/0001_init.sql` ~ `0005_churches.sql`). `.env`의
`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`가 채워져 있으면 앱이 실제 DB를 사용하고,
비어 있으면 각 기능이 `src/content/*.ts` 기본값 또는 `localStorage`로 조용히 대체됩니다
(§src/integrations/supabase/client.ts의 `isSupabaseConfigured`).

### 13.5 가정민원실(`/civil-affairs`) 폐기 → 지역가정교회(`/churches`)로 대체

원본 사이트를 분석해 작성했던 가정민원실(서비스 허브: 축복결혼 행정 안내·HJ Baby
Blessing·성화감사장 + 운영 정보 블록) 명세를 참고용으로 남겨둡니다. **실제 구현에서는 이
화면 전체와 관련 라우트·컴포넌트·페이지가 삭제되었고**, 같은 GNB 자리를 지역가정교회
디렉터리(§13.2에서 먼저 도입된 기능)가 대신합니다.

- 폐기된 라우트: `/civil-affairs`, `/civil-affairs/blessing-marriage` — 둘 다 `/churches`로
  리다이렉트됩니다(북마크 호환).
- 폐기된 파일: `src/pages/CivilAffairs.tsx`, `BlessingMarriage.tsx`, `src/content/civilAffairs.ts`,
  `src/components/civil-affairs/*`
- **함께 삭제된 내용**: 서비스 카드 3장(축복결혼/HJ Baby Blessing/성화감사장 안내 카드 자체는
  아니고, 이 카드들이 있던 허브 페이지), "2027 축복결혼" 행정 안내(신청 자격·절차·구비서류
  탭, 내 준비 현황 위젯 — 원래도 원본에 미구현 상태였던 §P-06 설계 제안), 운영 정보 블록
  (운영기관·담당부서·상담시간 등)
- **살아남은 것**: HJ Baby Blessing·성화감사장은 원래도 외부 링크 카드였으므로 홈 카드 그리드
  (§6 P-01④)에서 그대로 동작합니다. 대표 연락처(`tel:` 링크)는 `/churches` 페이지 하단으로
  옮겨 계속 노출됩니다(§6 P-05③).
- `blessing_progress` 테이블(§7.2)은 삭제하지 않았지만, 이를 쓰는 화면 자체가 없어져 당분간
  미사용 상태입니다.

---

## 부록 B — 원본 사이트 실측 요약표

| 항목 | 값 |
|---|---|
| 도메인 | blessinghome.lovable.app |
| 플랫폼 | Lovable (Vite + React SPA) |
| 라우트 수 | 9 (+404) |
| GNB 항목 | 5 (원본 재구현 4개 + `/documents` 1개 추가, §2.3) |
| 홈 히어로 슬라이드 | 3 |
| 홈 콘텐츠 카드 | 5 |
| 가이드 가치 기둥 | 4 |
| 가이드 여정 스텝 | 6 (3그룹) |
| 가이드 FAQ | 9 (기본 5 + 더보기 4) |
| 커뮤니티 카테고리 | 5 (전체 포함) |
| 커뮤니티 정렬 | 4 |
| 온보딩 스텝 | 5 |
| 민원실 서비스 | 3 (내부 1 + 외부 2) |
| 약관 조문 | 6 |
| 저작권 표기 | © 2026 블레싱월드. All rights reserved. |

---

*본 PRD는 공개된 웹사이트의 구조·문구를 분석하여 재구현 목적으로 작성되었습니다. 실제 서비스 구축 시 운영기관(세계평화통일가정연합 가정행복국)의 확인을 거쳐 문구·연락처·법적 고지 내용을 최종 확정하십시오.*
