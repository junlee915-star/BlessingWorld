import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Check, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  fetchReflection,
  getLocalReflection,
  saveLocalReflection,
  saveReflection,
} from "@/lib/courseReflections";

interface CourseReflectionProps {
  courseId: string;
}

// 강좌를 다 들은 뒤 남기는 "느낀 점" 입력칸(6축 개편 §4.4 확장).
// 로그인한 회원의 소감은 계정(course_reflections)에 저장되어 /admin/reflections에서
// 담당자가 모아 보고, 비로그인 방문자의 소감은 이 브라우저에만 남습니다.
export function CourseReflection({ courseId }: CourseReflectionProps) {
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const local = getLocalReflection(courseId);
    if (!cancelled) {
      setValue(local);
      setSaved(local);
    }
    (async () => {
      // 로그인 상태면 계정에 저장된 소감을 우선합니다(다른 기기에서 쓴 내용 이어쓰기).
      if (user) {
        const remote = await fetchReflection(user.id, courseId);
        if (!cancelled && remote != null) {
          setValue(remote);
          setSaved(remote);
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, user]);

  async function handleSave() {
    const next = value.trim();
    setSaving(true);
    saveLocalReflection(courseId, next);
    if (user) {
      const ok = await saveReflection(user.id, courseId, next);
      if (!ok) toast.error("계정에 저장하지 못했어요. 이 브라우저에는 반영되었어요.");
    }
    setSaved(next);
    setValue(next);
    setSaving(false);
    toast.success(next ? "느낀 점을 저장했어요." : "느낀 점을 지웠어요.");
  }

  const dirty = value.trim() !== saved.trim();

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center gap-2">
        <Pencil className="h-4 w-4 text-primary-deep" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-foreground">느낀 점을 남겨보세요</h2>
      </div>
      <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">
        강좌를 들으며 마음에 남은 생각이나 질문을 자유롭게 적어주세요. 정답은 없어요.
      </p>

      <label htmlFor={`reflection-${courseId}`} className="sr-only">
        느낀 점
      </label>
      <textarea
        id={`reflection-${courseId}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading || saving}
        rows={5}
        maxLength={2000}
        placeholder="예) 축복결혼을 '결혼식'이 아니라 새로운 출발로 본다는 말이 오래 남았습니다."
        className="mt-4 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-[1.75] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => void handleSave()} disabled={loading || saving || !dirty}>
          {saved && !dirty ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" /> 저장됨
            </>
          ) : (
            "느낀 점 저장"
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          {user ? (
            "계정에 저장돼요. 언제든 다시 열어 고칠 수 있어요."
          ) : (
            <>
              이 브라우저에만 저장돼요.{" "}
              <Link to="/login" className="font-medium text-primary-deep hover:underline">
                로그인
              </Link>
              하면 담당자와 나눌 수 있어요.
            </>
          )}
        </p>
      </div>
    </section>
  );
}
