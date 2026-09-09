# 구글 로그인(Google OAuth) 설정

`/login`·`/admin/login`에 "구글 계정으로 계속하기" 버튼이 있습니다. 코드는 준비돼 있고,
**아래 대시보드 설정을 마쳐야 실제로 동작**합니다. (Supabase 미연결 환경에서는 버튼이
"Supabase가 연결되어 있지 않아요." 를 돌려줍니다.)

## 1. Google Cloud Console — OAuth 클라이언트 만들기

1. <https://console.cloud.google.com> → 프로젝트 생성/선택
2. **APIs & Services → OAuth consent screen**
   - User type: External, 앱 이름·지원 이메일 입력, 게시(Publish)
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorized redirect URIs** 에 아래를 추가:
     ```
     https://<프로젝트-ref>.supabase.co/auth/v1/callback
     ```
     (`<프로젝트-ref>` = Supabase 프로젝트 URL의 서브도메인. Supabase의 Google provider
     설정 화면에도 이 콜백 URL이 그대로 적혀 있으니 복사해 붙이면 됩니다.)
   - 생성 후 **Client ID / Client secret** 확보

## 2. Supabase 대시보드

1. **Authentication → Providers → Google**
   - Enable, 위에서 받은 Client ID / Client secret 입력, 저장
2. **Authentication → URL Configuration**
   - **Site URL**: `https://junlee915-star.github.io/BlessingWorld/`
   - **Redirect URLs** (Additional)에 아래를 모두 추가:
     ```
     https://junlee915-star.github.io/BlessingWorld/
     http://localhost:5173/
     ```
   - 커스텀 도메인/브라우저 라우터로 배포한다면 그 주소(끝 슬래시 포함)도 추가

## 3. DB 마이그레이션

`supabase/migrations/0020_google_oauth_profile_names.sql` 적용
(SQL 편집기 또는 `supabase db push`). 구글 계정의 이름(`full_name`/`name`)이
`profiles.display_name` 으로 들어가게 `handle_new_user()` 를 넓힌 것입니다. 적용 전에는
구글 가입자의 표시 이름이 이메일 아이디(`@` 앞부분)로 채워집니다.

## 동작 방식(코드)

- `src/lib/auth.tsx` `signInWithGoogle()` → `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } })`
  - `redirectTo = window.location.origin + import.meta.env.BASE_URL` (사이트 루트)
- 콜백은 `#access_token=...` 해시로 돌아오며, 이메일 인증 링크와 같은 경로로 처리됩니다:
  - HashRouter 배포(GitHub Pages): `src/lib/authHashRedirect.ts` 가 마운트 전에 파싱 → `#/mypage`
  - 그 외: `detectSessionInUrl`(§`client.ts`)이 자동 처리
- 신규 사용자는 `on_auth_user_created` 트리거로 `profiles` 행이 생기고 role은 항상 `user`
