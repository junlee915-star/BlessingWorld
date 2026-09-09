import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, LogIn, Mail, UserPlus } from "lucide-react";

import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";

// 재전송 버튼 연타로 Supabase 발송 주기 제한("for security purposes...")에 바로 걸리지
// 않도록 클라이언트에서도 짧은 쿨다운을 둡니다.
const RESEND_COOLDOWN_SECONDS = 60;

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** 구글 브랜드 G 마크. lucide에는 브랜드 아이콘이 없어 공식 색상 SVG를 인라인합니다. */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.64h6.2a5.3 5.3 0 0 1-2.3 3.48v2.9h3.72c2.18-2.01 3.44-4.97 3.44-8.57Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.1 0 5.7-1.03 7.6-2.78l-3.72-2.9c-1.03.7-2.35 1.1-3.88 1.1-2.98 0-5.5-2.01-6.4-4.72H1.75v2.98A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.7a7.2 7.2 0 0 1 0-4.6V7.12H1.75a12 12 0 0 0 0 10.76L5.6 14.7Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.68 0 3.19.58 4.38 1.71l3.28-3.28C17.7 1.19 15.1 0 12 0A11.99 11.99 0 0 0 1.75 7.12L5.6 10.1C6.5 7.39 9.02 4.77 12 4.77Z"
      />
    </svg>
  );
}

const VARIANT_COPY = {
  // /admin/login — staff/admin 로그인. 가입은 누구나 할 수 있지만 기본 role은 항상 'user'.
  admin: {
    eyebrow: "ADMIN",
    title: "관리자 로그인",
    hint: "구글 계정 또는 이메일로 로그인하세요. 새 계정은 기본 권한(user)으로 생성돼요 — 사랑의 기술 관리 권한은 운영자가 별도로 부여합니다.",
  },
  // /login — 일반 회원 로그인. §마이페이지(수강한 교육 확인)로 이어집니다.
  member: {
    eyebrow: "MEMBER",
    title: "로그인",
    hint: "구글 계정 또는 이메일로 로그인하면, 내가 수강한 교육을 어느 기기에서든 확인할 수 있어요.",
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
  const {
    session,
    signInWithPassword,
    signInWithGoogle,
    signUp,
    resendConfirmationEmail,
    requestPasswordReset,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? defaultRedirectTo;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const [resetSending, setResetSending] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(0);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    if (resetCooldown <= 0) return;
    const timer = setInterval(() => setResetCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [resetCooldown]);

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    // §lib/authHashRedirect.ts가 인증 콜백 처리에 실패했을 때(만료·중복 사용된 링크 등)
    // "#/login?authError=..."로 보내는 안내 문구를 여기서 한 번만 꺼내 보여줍니다.
    const authError = searchParams.get("authError");
    if (!authError) return;
    setError(authError);
    const next = new URLSearchParams(searchParams);
    next.delete("authError");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 이미 로그인돼 있으면 바로 보냅니다 (RequireAdmin/RequireAuth가 권한을 다시 확인해요).
  if (session) {
    return <Navigate to={from} replace />;
  }

  async function handleGoogle() {
    setGoogleError(null);
    setGoogleSubmitting(true);
    const { error: oauthError } = await signInWithGoogle();
    // 성공 시 브라우저가 구글 동의 화면으로 이동하므로 아래 코드는 보통 실행되지 않습니다.
    if (oauthError) {
      setGoogleError(oauthError);
      setGoogleSubmitting(false);
    }
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

  async function handleResend() {
    setResendNotice(null);
    setResendError(null);
    if (!email.trim()) {
      setResendError("재전송할 이메일 주소를 먼저 입력해주세요.");
      return;
    }
    setResending(true);
    const { error: resendErrorMessage } = await resendConfirmationEmail(email.trim());
    setResending(false);
    if (resendErrorMessage) {
      setResendError(resendErrorMessage);
      return;
    }
    setResendNotice("인증 메일을 다시 보냈어요. 메일함(스팸함 포함)을 확인해주세요.");
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  }

  async function handlePasswordResetRequest() {
    setResetNotice(null);
    setResetError(null);
    if (!email.trim()) {
      setResetError("재설정 메일을 받을 이메일 주소를 먼저 입력해주세요.");
      return;
    }
    setResetSending(true);
    const { error: resetErrorMessage } = await requestPasswordReset(email.trim());
    setResetSending(false);
    if (resetErrorMessage) {
      setResetError(resetErrorMessage);
      return;
    }
    setResetNotice("비밀번호 재설정 메일을 보냈어요. 메일함(스팸함 포함)을 확인해주세요.");
    setResetCooldown(RESEND_COOLDOWN_SECONDS);
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16 md:px-8">
      <EyebrowLabel>{copy.eyebrow}</EyebrowLabel>
      <h1 className="mt-3 text-2xl font-bold text-foreground">{copy.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{copy.hint}</p>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleSubmitting || submitting}
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon className="h-4 w-4" />
          {googleSubmitting ? "구글로 이동 중…" : "구글 계정으로 계속하기"}
        </button>
        {googleError ? <p className="mt-3 text-sm text-destructive">{googleError}</p> : null}

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          또는 이메일로
          <span className="h-px flex-1 bg-border" />
        </div>
      </div>

      <Tabs defaultValue="login">
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

            <div className="flex flex-col items-start gap-1.5 border-t border-border pt-4">
              <button
                type="button"
                onClick={handlePasswordResetRequest}
                disabled={resetSending || resetCooldown > 0}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-deep underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
              >
                <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                {resetSending
                  ? "재설정 메일을 보내는 중…"
                  : resetCooldown > 0
                    ? `${resetCooldown}초 후 다시 보낼 수 있어요`
                    : "비밀번호를 잊으셨나요? 재설정 메일 받기"}
              </button>
              <p className="text-xs text-muted-foreground">
                위 이메일란에 가입하신 주소를 입력한 뒤 눌러주세요.
              </p>
              {resetNotice ? <p className="text-sm text-primary-deep">{resetNotice}</p> : null}
              {resetError ? <p className="text-sm text-destructive">{resetError}</p> : null}
            </div>
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

            <div className="flex flex-col items-start gap-1.5 border-t border-border pt-4">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || resendCooldown > 0}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-deep underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {resending
                  ? "인증 메일을 다시 보내는 중…"
                  : resendCooldown > 0
                    ? `${resendCooldown}초 후 다시 보낼 수 있어요`
                    : "인증 메일을 받지 못하셨나요? 다시 보내기"}
              </button>
              <p className="text-xs text-muted-foreground">
                위 이메일란에 가입하신 주소를 입력한 뒤 눌러주세요. 스팸함도 함께 확인해보세요.
              </p>
              {resendNotice ? <p className="text-sm text-primary-deep">{resendNotice}</p> : null}
              {resendError ? <p className="text-sm text-destructive">{resendError}</p> : null}
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </section>
  );
}
