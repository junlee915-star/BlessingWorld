import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 아직 Supabase 프로젝트가 연결되지 않은 상태(M1+M2)에서도 앱이 크래시하지
// 않도록 가드합니다. .env에 값이 채워지면 자동으로 실제 클라이언트가 생성됩니다.
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// GitHub Pages 배포(§App.tsx, VITE_USE_HASH_ROUTER)는 HashRouter를 씁니다. Supabase가
// 이메일 인증·비밀번호 재설정 뒤 `#access_token=...&type=signup` 형태로 리다이렉트하면
// HashRouter가 그 해시를 라우트 경로로 오인해 충돌합니다(→ NotFound, 세션 미생성).
// 이 경우 자동 감지를 끄고 §lib/authHashRedirect.ts가 React Router 마운트 전에 직접
// 파싱해서 세션을 만들고 해시를 정상 경로로 바꿔치기합니다.
const USE_HASH_ROUTER = import.meta.env.VITE_USE_HASH_ROUTER === "true";

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { detectSessionInUrl: !USE_HASH_ROUTER },
    })
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 설정되지 않았습니다. " +
      ".env를 채우기 전까지 온보딩 폼 제출 등 백엔드 연동 기능은 동작하지 않습니다.",
  );
}
