import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { DEFAULT_ROADMAP_STEPS, type RoadmapStep } from "@/content/roadmap";
import { fetchRoadmapSteps, saveRoadmapSteps } from "@/lib/roadmap";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// 축복로드맵 관리 — 단계 수(8개)는 blessing_progress의 step_key 제약과 묶여 있어
// 여기서는 **추가·삭제를 허용하지 않고** 문구·기간·링크만 고칩니다.
// 단계를 늘리거나 줄이려면 마이그레이션(0012)의 CHECK 제약부터 바꿔야 합니다.
export default function RoadmapAdmin() {
  const [steps, setSteps] = useState<RoadmapStep[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchRoadmapSteps().then((data) => {
      if (!cancelled) setSteps(data.length > 0 ? data : DEFAULT_ROADMAP_STEPS);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateStep(key: string, patch: Partial<RoadmapStep>) {
    setSteps((prev) => (prev ? prev.map((s) => (s.key === key ? { ...s, ...patch } : s)) : prev));
  }

  async function handleSave() {
    if (!steps) return;
    const emptyTitle = steps.find((step) => step.title.trim().length === 0);
    if (emptyTitle) {
      toast.error("제목이 비어 있는 단계가 있어요.");
      return;
    }
    setSaving(true);
    try {
      const target = await saveRoadmapSteps(steps);
      toast.success(
        target === "supabase"
          ? "저장했어요. 모든 방문자에게 반영돼요."
          : "이 브라우저에 저장했어요. Supabase가 연결되면 자동으로 전환돼요.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SEO path="/admin/roadmap" noindex />

      <AdminHeader
        title="축복로드맵 관리"
        description={
          <>
            /roadmap의 8단계 문구·소요 기간·연결 링크를 고칠 수 있어요. 소요 기간은 확정된
            단계만 채우세요 — 비워두면 화면에서 기간 배지가 아예 표시되지 않습니다(추정치
            표기를 피하기 위한 동작이에요).
            {isSupabaseConfigured
              ? " 저장하면 Supabase에 반영돼요."
              : " 현재 Supabase가 연결되어 있지 않아 이 브라우저에만 임시 보관돼요."}
          </>
        }
      />

      <section className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        {steps === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : (
          <div className="space-y-5">
            {steps.map((step) => (
              <div key={step.key} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-deep">
                    {step.no}
                  </span>
                  <span className="text-xs text-muted-foreground">{step.key}</span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">제목</span>
                    <input
                      className={inputClass}
                      value={step.title}
                      onChange={(e) => updateStep(step.key, { title: e.target.value })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">소요 기간 (확정된 경우만)</span>
                    <input
                      className={inputClass}
                      value={step.durationLabel ?? ""}
                      onChange={(e) =>
                        updateStep(step.key, { durationLabel: e.target.value || undefined })
                      }
                      placeholder="예: 1~2주 / 비워두면 표시 안 함"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">설명</span>
                    <textarea
                      className={inputClass}
                      rows={2}
                      value={step.description}
                      onChange={(e) => updateStep(step.key, { description: e.target.value })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">연결 링크 경로</span>
                    <input
                      className={inputClass}
                      value={step.to?.href ?? ""}
                      onChange={(e) =>
                        updateStep(step.key, {
                          to: e.target.value
                            ? { href: e.target.value, label: step.to?.label ?? "자세히 보기" }
                            : undefined,
                        })
                      }
                      placeholder="예: /center/apply"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">링크 문구</span>
                    <input
                      className={inputClass}
                      value={step.to?.label ?? ""}
                      disabled={!step.to?.href}
                      onChange={(e) =>
                        updateStep(step.key, {
                          to: step.to?.href
                            ? { href: step.to.href, label: e.target.value }
                            : undefined,
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} disabled={saving} size="lg">
                {saving ? "저장 중…" : "저장하기"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
