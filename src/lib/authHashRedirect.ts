// GitHub Pages(HashRouter, VITE_USE_HASH_ROUTER=true) 배포에서 Supabase 이메일 인증·
// 비밀번호 재설정 링크를 정상적으로 처리하기 위한 부트스트랩.
//
// Supabase는 확인 링크 클릭 후 브라우저를
//   https://<host>/BlessingWorld/#access_token=...&refresh_token=...&type=signup
// 형태로 리다이렉트합니다. 하지만 이 앱의 정상 라우트는 항상 `#/`로 시작하므로
// (예: `#/guide`), HashRouter는 위 해시를 "/access_token=...&refresh_token=...&type=signup"
// 라는 존재하지 않는 경로로 해석해 NotFound를 렌더링하고, 세션도 만들어지지 않습니다.
// §integrations/supabase/client.ts에서 이 배포에 한해 detectSessionInUrl을 꺼두었으니,
// React Router가 마운트되기 전에 이 함수가 먼저 해시를 파싱해 세션을 만들고
// 정상적인 앱 경로로 바꿔치기합니다. main.tsx에서 렌더링 전에 await로 호출하세요.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

const AUTH_CALLBACK_HASH_PATTERN = /(?:^|&)(?:access_token|error|error_description)=/;

export async function resolveAuthRedirectHash(): Promise<void> {
  if (import.meta.env.VITE_USE_HASH_ROUTER !== "true") return;
  if (!isSupabaseConfigured || !supabase) return;

  const rawHash = window.location.hash.replace(/^#/, "");
  // 정상적인 앱 라우트("/guide" 등)는 반드시 "/"로 시작합니다. Supabase 콜백 해시는
  // 슬래시 없이 곧장 access_token=... 형태로 오므로 이걸로 구분합니다.
  if (rawHash.startsWith("/") || !AUTH_CALLBACK_HASH_PATTERN.test(rawHash)) return;

  const params = new URLSearchParams(rawHash);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  // type=recovery는 비밀번호 재설정 링크입니다 — 새 비밀번호를 입력받는 화면으로 보냅니다.
  // signup/magiclink 등은 그대로 로그인된 상태로 마이페이지로 보냅니다.
  const type = params.get("type");
  const errorDescription = params.get("error_description") || params.get("error");

  let nextHash = "#/login";

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    nextHash = error
      ? `#/login?authError=${encodeURIComponent(error.message)}`
      : type === "recovery"
        ? "#/reset-password"
        : "#/mypage";
  } else if (errorDescription) {
    // 링크가 만료됐거나 이미 사용된 경우 등 — 로그인 화면에서 안내 문구로 보여줍니다.
    nextHash = `#/login?authError=${encodeURIComponent(errorDescription)}`;
  }

  window.history.replaceState(null, "", window.location.pathname + window.location.search + nextHash);
}
