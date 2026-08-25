# 블레싱월드 (Blessing World)

`BlessingWorld_PRD.md`(§1~§12) 기반으로 재구현한 축복결혼·가정생활 통합 안내 서비스입니다.

## 이번 빌드 범위 (M1 + M2)

PRD §11 마일스톤 기준 M1(기반)·M2(정적 페이지)까지 구현했습니다.

| 완성 | 페이지 |
|---|---|
| ✅ 전체 | 홈 `/`, 축복의 씨앗 `/guide`, 가정민원실 `/civil-affairs`, 개인정보처리방침 `/privacy`, 이용약관 `/terms`, 404 |
| ✅ 부분(빈 상태 UI) | 행복의 꽃 `/stories` — 필터 UI + EmptyState (원본도 콘텐츠 0건) |
| ✅ 부분(빈 상태 UI) | 나눔의 열매 `/community` — 가이드라인 + 필터 UI + EmptyState |
| 🚧 준비중 안내만 | `/stories/:slug`, `/community/new`, `/community/:id`, `/civil-affairs/blessing-marriage`, `/onboarding` |

라우팅 구조(§2.1)는 9개 라우트 + 404가 모두 존재하므로 내비게이션·CTA를 눌러도 깨지지 않습니다.
다만 위 "준비중" 페이지들은 온보딩 5단계 위저드, 나눔 CRUD, 스토리 상세 등 **Supabase 백엔드
연동이 필요한 기능**(§11 M3~M5)이라 이번 범위에서는 안내 화면만 제공합니다.

## 공유용 미리보기 (Claude Artifact)

`npm run build:preview` 를 실행하면 `artifact-preview.html` 하나로 합쳐진 정적
스냅샷이 생성됩니다(라우터를 HashRouter로 전환 + 원격 이미지를 base64로 인라인 —
임의 경로에 정적 파일로 서빙되는 공유 링크용입니다). 실제 배포에는 필요 없고,
그냥 `npm run build`(BrowserRouter + 원격 이미지 URL)를 쓰면 됩니다.

## 시작하기

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # 프로덕션 빌드
```

> ⚠️ **이 폴더는 Google Drive(`내 드라이브`)로 실시간 동기화되고 있습니다.**
> `npm install`이 `EPERM` / `EBADF` / `ENOTEMPTY` 오류로 실패하면 Google Drive
> 동기화 클라이언트가 파일을 잠그고 있는 것입니다(node_modules는 파일 수만
> 수만 개라 특히 취약). 해결법:
> 1. Google Drive 동기화를 잠시 일시정지한 뒤 `npm install` 재시도, 또는
> 2. 동기화되지 않는 로컬 경로(예: `C:\dev\blessing-world`)에 프로젝트를
>    두고 작업 — `node_modules`, `dist`는 어차피 `.gitignore` 대상이라
>    동기화될 필요가 없습니다.

## Supabase 연동 (M3 이후)

`supabase/migrations/0001_init.sql` 에 §7 데이터 모델 전체(테이블 + RLS 정책)가 준비되어
있습니다. 아직 실제 프로젝트에 적용되지 않았습니다.

1. https://supabase.com 에서 프로젝트 생성
2. `.env.example` → `.env` 로 복사 후 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` 입력
3. SQL 편집기(또는 `supabase db push`)로 `supabase/migrations/0001_init.sql` 실행
4. `src/integrations/supabase/client.ts` 는 env 값이 채워지면 자동으로 활성화됩니다
   (값이 없으면 `supabase`가 `null`이라 관련 기능만 비활성화되고 앱은 정상 동작합니다)
5. 개인정보 보존 자동 파기(§7.4)는 `supabase/functions/purge-guidance-requests`
   Edge Function으로 스캐폴딩되어 있습니다. 배포 명령은 파일 상단 주석 참고.

## 알아둘 것 — PRD 대비 의도적 조정

- **§10 I-01**: 성화감사장 Google Forms 링크는 원본이 편집(edit) URL이라는 버그가 있었습니다.
  재구현본은 응답용(`/viewform`) 형태의 **플레이스홀더 URL**을 넣어뒀습니다.
  `src/content/home.ts`, `src/content/civilAffairs.ts` 에서 실제 폼 URL로 교체하세요.
- **§10 I-02, I-03**: 원본은 운영기관 표기·답변 소요시간이 페이지마다 달랐습니다.
  `src/content/footer.ts` 의 `ORG_NAME` / `ORG_DEPARTMENT` / `RESPONSE_TIME` 상수로 전 페이지 통일했습니다.
- **§10 I-06 / FAQ**: 원본 9개 질문 중 1번만 답변이 확보되어 있었습니다. 2~5번은 PRD가 제시한
  "취지"에 맞춰 초안을 작성했고(`src/content/faq.ts`의 `isDraft: true`), 6~9번은 질문조차
  확보되지 않아 **아직 포함하지 않았습니다**. 운영 담당자 확인 후 배열에 추가하면
  "질문 더 보기" 버튼과 9개 노출이 자동으로 동작합니다(AC-06).
- **`/civil-affairs/blessing-marriage`**: 원본이 `/civil-affairs`와 동일 콘텐츠를 렌더링하던
  미구현 상태였음을 그대로 재현하지 않고, 메타 태그를 분리하고 "준비중" 안내로 대체했습니다.
- **`/onboarding`**: 전환 핵심 페이지지만 5단계 위저드(zod 검증, sessionStorage, Supabase
  insert)는 M3 범위라 헤더 카피 + 전화 문의 임시 동선만 제공합니다.

## 다음 단계 (M3~M7)

1. **M3**: `/onboarding` 5단계 위저드 구현 + `guidance_requests` 실제 insert 연동
2. **M4**: `/stories`, `/civil-affairs/blessing-marriage` 콘텐츠/탭/준비현황 위젯
3. **M5**: `/community` CRUD, 추천순 알고리즘(§P-04), 나눔 신청 플로우
4. **M6**: `/admin/*` 관리자 화면(§8), 개인정보 자동 파기 스케줄 배포
5. **M7**: Lighthouse 접근성·SEO 90점 이상 실측 검증(§9), §10 남은 개선 항목 반영

## 디자인 토큰

`src/index.css`의 `:root` 및 `tailwind.config.ts`가 PRD §4 재구성안을 그대로 반영합니다.
실제 원본과 픽셀 단위로 맞추려면 브라우저 개발자도구로 `:root` 값을 확인해 덮어쓰세요(§0 참고).
