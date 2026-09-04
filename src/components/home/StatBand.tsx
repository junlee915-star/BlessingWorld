import { useEffect, useState } from "react";

import { SectionHeading } from "@/components/common/SectionHeading";
import { HOME_STATS_SECTION } from "@/content/home";
import { fetchSiteStats, formatBasisDate, publishableStats, type SiteStat } from "@/lib/siteStats";

// 홈 호명 섹션(6축 개편 §4.1-2). 듀오의 "실시간 회원수·성혼수" 대응이지만, 값과 기준일이
// 모두 채워진 지표만 렌더합니다 — 하나도 없으면 섹션 자체가 나타나지 않습니다.
// 추정치나 플레이스홀더 숫자를 넣지 마세요(§가드레일).
export function StatBand() {
  const [stats, setStats] = useState<SiteStat[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSiteStats().then((data) => {
      if (!cancelled) setStats(publishableStats(data));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 데이터가 아직 오지 않은 동안(로딩) 자리만 잡아 레이아웃 시프트(CLS)를 막습니다.
  // 값+기준일이 모두 있는 지표가 하나도 없다고 확정되면(빈 배열) 섹션 자체를 접습니다.
  if (stats && stats.length === 0) return null;

  return (
    <section className="bg-muted/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow={HOME_STATS_SECTION.eyebrow}
          title={HOME_STATS_SECTION.title}
          description={HOME_STATS_SECTION.body}
        />

        <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {!stats
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="animate-pulse rounded-2xl border border-border bg-card p-6 text-center shadow-card"
                >
                  <div className="mx-auto h-4 w-24 rounded bg-muted" />
                  <div className="mx-auto mt-4 h-10 w-20 rounded bg-muted" />
                  <div className="mx-auto mt-3 h-3 w-16 rounded bg-muted" />
                </div>
              ))
            : stats.map((stat) => (
                <div
                  key={stat.key}
                  className="rounded-2xl border border-border bg-card p-6 text-center shadow-card"
                >
                  <dt className="text-sm font-medium text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-3">
                    <span className="text-[40px] font-bold leading-none tabular-nums text-primary md:text-[48px]">
                      {stat.value?.toLocaleString("ko-KR")}
                    </span>
                    <span className="ml-1 text-lg font-semibold text-primary-deep">{stat.unit}</span>
                    <p className="mt-3 text-[13px] text-muted-foreground">
                      {formatBasisDate(stat.basisDate ?? "")}
                    </p>
                  </dd>
                </div>
              ))}
        </dl>
      </div>
    </section>
  );
}
