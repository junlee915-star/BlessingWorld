import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShieldOff, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

/** /admin/* 라우트를 감싸서 staff/admin 로그인 여부를 확인합니다. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { loading, session, profile, signOut, refreshProfile } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center px-5 py-24 text-center md:px-8">
        <TriangleAlert className="h-10 w-10 text-warning" aria-hidden="true" />
        <h1 className="mt-5 text-xl font-bold text-foreground">관리자 로그인을 쓸 수 없어요</h1>
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
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!profile || !(profile.role === "staff" || profile.role === "admin")) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center px-5 py-24 text-center md:px-8">
        <ShieldOff className="h-10 w-10 text-destructive" aria-hidden="true" />
        <h1 className="mt-5 text-xl font-bold text-foreground">관리자 권한이 없어요</h1>
        <p className="mt-3 text-sm leading-[1.75] text-muted-foreground">
          {profile?.email ?? "이 계정"}은(는) 아직 staff/admin 권한이 없어요. 방금 Supabase에서
          role을 바꾸셨다면, 로그인된 채로는 반영이 안 될 수 있어요 — 아래에서 다시
          확인해보세요.
        </p>
        <div className="mt-8 flex gap-3">
          <Button onClick={() => void refreshProfile()}>다시 확인하기</Button>
          <Button variant="outline" onClick={() => void signOut()}>
            로그아웃
          </Button>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
