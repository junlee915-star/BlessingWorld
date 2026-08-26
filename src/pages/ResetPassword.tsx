import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// §/reset-password — 비밀번호 재설정 메일의 링크를 클릭하면 도착하는 화면.
// §RequireAuth가 감싸서 세션(재설정 메일의 임시 세션 포함)이 없으면 §/login으로 보냅니다.
export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 해요.");
      return;
    }
    if (password !== confirmPassword) {
      setError("두 비밀번호가 서로 달라요.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setSubmitting(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    navigate("/mypage", { replace: true });
  }

  return (
    <>
      <SEO path="/reset-password" noindex />

      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16 md:px-8">
        <EyebrowLabel>RESET PASSWORD</EyebrowLabel>
        <h1 className="mt-3 text-2xl font-bold text-foreground">새 비밀번호 설정</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          사용하실 새 비밀번호를 입력해주세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">새 비밀번호</span>
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
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">새 비밀번호 확인</span>
            <input
              type="password"
              required
              minLength={6}
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" size="lg" disabled={submitting} className="mt-2">
            <KeyRound className="h-4 w-4" /> {submitting ? "저장하는 중…" : "비밀번호 저장"}
          </Button>
        </form>
      </section>
    </>
  );
}
