import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

/**
 * 로그인한 회원이면(역할 무관) 통과시키는 가드. staff/admin만 허용하는
 * §RequireAdmin.tsx와 달리 일반 회원용 페이지(§/mypage)에 씁니다.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { loading, session } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center px-5 py-24 text-center md:px-8">
        <TriangleAlert className="h-10 w-10 text-warning" aria-hidden="true" />
        <h1 className="mt-5 text-xl font-bold text-foreground">로그인을 쓸 수 없어요</h1>
        <p className="mt-3 text-sm leading-[1.75] text-muted-foreground">
          Supabase가 연결되어 있지 않아요. .env에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY를
          채운 뒤 다시 시도해주세요.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        확인하는 중이에요…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
