// 인증 상태(로그인 세션 + profiles.role) 전역 관리.
// Supabase가 연결되지 않은 환경(§client.ts의 isSupabaseConfigured)에서도 앱이 죽지 않도록
// 항상 "로그인 안 됨" 상태로 조용히 동작합니다.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { ProfileRole } from "@/integrations/supabase/types";

export interface Profile {
  id: string;
  displayName: string;
  email: string | null;
  role: ProfileRole;
}

interface AuthContextValue {
  /** 세션·프로필 최초 로딩 중인지 */
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** profile.role이 staff 또는 admin인지 */
  isStaff: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessionLoading, setSessionLoading] = useState(isSupabaseConfigured);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    if (!session?.user) {
      setProfile(null);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        // 설치된 @supabase/supabase-js(2.112.x)의 .eq().maybeSingle() 체인이 이 프로젝트의
        // 손으로 쓴 Database 타입과 맞물리면 Row 타입을 `never`로 좁혀버리는 라이브러리 쪽
        // 타입 버그가 있습니다(§lib/courses.ts의 upsert 우회와 같은 원인). 실제 응답은
        // profiles.Row 그대로 오므로 이 한 줄만 우회합니다.
        const row = data as {
          id: string;
          display_name: string;
          email: string | null;
          role: Profile["role"];
        } | null;
        setProfile(
          row ? { id: row.id, displayName: row.display_name, email: row.email, role: row.role } : null,
        );
        setProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading: sessionLoading || (Boolean(session?.user) && profileLoading),
      session,
      user: session?.user ?? null,
      profile,
      isStaff: profile?.role === "staff" || profile?.role === "admin",
      async signInWithPassword(email, password) {
        if (!isSupabaseConfigured || !supabase) {
          return { error: "Supabase가 연결되어 있지 않아요." };
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      async signUp(email, password, displayName) {
        if (!isSupabaseConfigured || !supabase) {
          return { error: "Supabase가 연결되어 있지 않아요.", needsEmailConfirmation: false };
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        });
        if (error) return { error: error.message, needsEmailConfirmation: false };
        // 이메일 인증이 켜져 있으면 세션 없이 사용자만 생성됩니다.
        return { error: null, needsEmailConfirmation: !data.session };
      },
      async signOut() {
        if (!isSupabaseConfigured || !supabase) return;
        await supabase.auth.signOut();
      },
    }),
    [session, profile, sessionLoading, profileLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있어요.");
  return ctx;
}
