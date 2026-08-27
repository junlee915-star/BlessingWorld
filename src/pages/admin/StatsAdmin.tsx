import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_SITE_STATS,
  fetchSiteStats,
  formatBasisDate,
  saveSiteStats,
  type SiteStat,
} from "@/lib/siteStats";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// 홈 수치 관리 — 값과 기준일이 모두 채워진 지표만 홈에 노출됩니다(§lib/siteStats.ts).
export default function StatsAdmin() {
  const [stats, setStats] = useState<SiteStat[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSiteStats().then((data) => {
      if (!cancelled) setStats(data.length > 0 ? data : DEFAULT_SITE_STATS);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateStat(key: string, patch: Partial<SiteStat>) {
    setStats((prev) => (prev ? prev.map((s) => (s.key === key ? { ...s, ...patch } : s)) : prev));
  }

  async function handleSave() {
    if (!stats) return;
    const halfFilled = stats.find(
      (stat) => (stat.value !== null && !stat.basisDate) || (stat.value === null && stat.basisDate),
    );
    if (halfFilled) {
      toast.error(`"${halfFilled.label}"은 값과 기준일을 함께 채워야 노출돼요.`);
      return;
    }
    setSaving(true);
    try {
      const target = await saveSiteStats(stats);
      toast.success(
        target === "supabase"
          ? "저장했어요. 홈에 반영돼요."
          : "이 브라우저에 저장했어요. Supabase가 연결되면 자동으로 전환돼요.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SEO path="/admin/stats" noindex />

      <AdminHeader
        title="홈 수치 관리"
        description={
          <>
            홈 상단에 노출되는 지표입니다. <strong>값과 기준일이 모두 채워진 지표만</strong>{" "}
            화면에 나타나고, 하나라도 비어 있으면 그 카드는 아예 렌더되지 않아요. 확인되지 않은
            숫자를 임시로 넣지 마세요.
            {isSupabaseConfigured ? "" : " 현재 Supabase 미연결 — 이 브라우저에만 보관돼요."}
          </>
        }
      />

      <section className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        {stats === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : (
          <div className="space-y-5">
            {stats.map((stat) => {
              const willShow = stat.value !== null && Boolean(stat.basisDate);
              return (
                <div
                  key={stat.key}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-foreground">{stat.label}</h2>
                    <span
                      className={
                        willShow
                          ? "rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"
                          : "flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {willShow ? (
                        "홈에 노출됨"
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3" aria-hidden="true" /> 노출 안 됨
                        </>
                      )}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-medium text-foreground">값</span>
                      <input
                        type="number"
                        className={inputClass}
                        value={stat.value ?? ""}
                        onChange={(e) =>
                          updateStat(stat.key, {
                            value: e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        placeholder="예: 12345"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-medium text-foreground">기준일</span>
                      <input
                        type="date"
                        className={inputClass}
                        value={stat.basisDate ?? ""}
                        onChange={(e) =>
                          updateStat(stat.key, { basisDate: e.target.value || null })
                        }
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-medium text-foreground">단위</span>
                      <input
                        className={inputClass}
                        value={stat.unit}
                        onChange={(e) => updateStat(stat.key, { unit: e.target.value })}
                        placeholder="가정 / 명"
                      />
                    </label>
                  </div>

                  {willShow ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      홈 표기 미리보기: <strong className="text-foreground">
                        {stat.value?.toLocaleString("ko-KR")}
                        {stat.unit}
                      </strong>{" "}
                      ({formatBasisDate(stat.basisDate ?? "")})
                    </p>
                  ) : null}
                </div>
              );
            })}

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
