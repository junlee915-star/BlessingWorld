import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { resolveAuthRedirectHash } from "./lib/authHashRedirect";
import { resolveLegacyHashRoute } from "./lib/legacyHashRedirect";
import "./index.css";

// 경로 라우팅 전환(§14 개선안 §14.6) 이전에 공유된 해시 링크(#/guide 등)를 실제 경로로
// 바꿔치기합니다. §lib/legacyHashRedirect.ts 참고.
resolveLegacyHashRoute();

// HashRouter 배포에서 Supabase 인증 콜백 해시(#access_token=...)를 React Router가
// 마운트되기 전에 먼저 처리합니다. §lib/authHashRedirect.ts 참고.
resolveAuthRedirectHash().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
