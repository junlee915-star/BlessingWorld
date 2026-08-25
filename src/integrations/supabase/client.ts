import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 아직 Supabase 프로젝트가 연결되지 않은 상태(M1+M2)에서도 앱이 크래시하지
// 않도록 가드합니다. .env에 값이 채워지면 자동으로 실제 클라이언트가 생성됩니다.
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 설정되지 않았습니다. " +
      ".env를 채우기 전까지 온보딩 폼 제출 등 백엔드 연동 기능은 동작하지 않습니다.",
  );
}
