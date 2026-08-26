import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const VARIANT_COPY = {
  // /admin/login — staff/admin 로그인. 가입은 누구나 할 수 있지만 기본 role은 항상 'user'.
  admin: {
    eyebrow: "ADMIN",
    title: "관리자 로그인",
    hint: "새 계정은 기본 권한(user)으로 생성돼요. 축복가치교육 관리 권한은 운영자가 별도로 부여합니다.",
  },
  // /login — 일반 회원 로그인. §마이페이지(수강한 교육 확인)로 이어집니다.
  member: {
    eyebrow: "MEMBER",
    title: "로그인",
    hint: "이메일과 비밀번호로 로그인하면, 내가 수강한 교육을 어느 기기에서든 확인할 수 있어요.",
  },
} as const;

interface AuthFormProps {
  variant: keyof typeof VARIANT_COPY;
  /** 로그인·가입 성공 후 이동할 기본 경로. 보호된 페이지에서 넘어왔다면 그 경로를 우선합니다. */
  defaultRedirectTo: string;
}

/** §/admin/login, §/login이 공유하는 이메일·비밀번호 로그인/가입 폼(Supabase Auth). */
export function AuthForm({ variant, defaultRedirectTo }: AuthFormProps) {
  const copy = VARIANT_COPY[variant];
  const { session, signInWithPassword, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? defaultRedirectTo;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // 이미 로그인돼 있으면 바로 보냅니다 (RequireAdmin/RequireAuth가 권한을 다시 확인해요).
  if (session) {
    return <Navigate to={from} replace />;
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signInWithPassword(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate(from, { replace: true });
  }

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (displayName.trim().length < 2) {
      setError("이름을 2자 이상 입력해주세요.");
      return;
    }
    setSubmitting(true);
    const { error: signUpError, needsEmailConfirmation } = await signUp(email, password, displayName);
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError);
      return;
    }
    if (needsEmailConfirmation) {
      setNotice("가입 확인 메일을 보냈어요. 메일함에서 인증 링크를 눌러주세요.");
      return;
    }
    // 이메일 인증이 꺼져 있으면 가입과 동시에 로그인됩니다.
    navigate(from, { replace: true });
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16 md:px-8">
      <EyebrowLabel>{copy.eyebrow}</EyebrowLabel>
      <h1 className="mt-3 text-2xl font-bold text-foreground">{copy.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{copy.hint}</p>

      <Tabs defaultValue="login" className="mt-8">
        <TabsList>
          <TabsTrigger value="login">로그인</TabsTrigger>
          <TabsTrigger value="signup">회원가입</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">이메일</span>
              <input
                type="email"
                required
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">비밀번호</span>
              <input
                type="password"
                required
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" size="lg" disabled={submitting} className="mt-2">
              <LogIn className="h-4 w-4" /> {submitting ? "로그인 중…" : "로그인"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">이름</span>
              <input
                required
                className={inputClass}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">이메일</span>
              <input
                type="email"
                required
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">비밀번호</span>
              <input
                type="password"
                required
                minLength={6}
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <span className="text-xs text-muted-foreground">6자 이상</span>
            </label>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {notice ? <p className="text-sm text-primary-deep">{notice}</p> : null}
            <Button type="submit" size="lg" disabled={submitting} className="mt-2">
              <UserPlus className="h-4 w-4" /> {submitting ? "가입하는 중…" : "회원가입"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </section>
  );
}
