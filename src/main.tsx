import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { resolveAuthRedirectHash } from "./lib/authHashRedirect";
import "./index.css";

// HashRouter 배포에서 Supabase 인증 콜백 해시(#access_token=...)를 React Router가
// 마운트되기 전에 먼저 처리합니다. §lib/authHashRedirect.ts 참고.
resolveAuthRedirectHash().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
