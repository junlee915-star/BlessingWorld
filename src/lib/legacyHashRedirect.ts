// §14 개선안 §14.6 — 해시 라우팅(`#/guide` 등)에서 경로 라우팅(`/guide`)으로 전환하면서,
// 예전에 공유되거나 북마크된 해시 링크가 그냥 홈으로 떨어지지 않도록 실제 경로로
// 바꿔치기합니다. React Router가 마운트되기 전에 main.tsx에서 동기로 호출하세요.
//
// 지금도 해시 라우팅(artifact-preview 등)이면 손대지 않고, `#access_token=...` 같은
// Supabase 콜백 해시(§lib/authHashRedirect.ts가 그 반대 경우를 처리)도 "/"로 시작하지
// 않으니 건드리지 않습니다.
export function resolveLegacyHashRoute(): void {
  if (import.meta.env.VITE_USE_HASH_ROUTER === "true") return;

  const { hash } = window.location;
  if (!hash.startsWith("#/")) return;

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = hash.slice(1);
  window.history.replaceState(null, "", `${base}${path}${window.location.search}`);
}
