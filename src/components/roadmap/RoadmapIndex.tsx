import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import { DEFAULT_ROADMAP_STEPS, type RoadmapStep } from "@/content/roadmap";
import { getFirstRoadmapDetailPage } from "@/content/roadmapDetail";
import { cn } from "@/lib/utils";

// 사이트 전역 로드맵 색인 — §14 개선안 P-11. 참조 사이트(familymatching.info)가 모든
// 하위 페이지 하단에 INDEX 0~7을 반복 노출하는 패턴을 따라, 어느 페이지에 있든 "축복까지
// 8단계 중 지금 어디쯤인지"를 한눈에 보여주고 다음 걸음으로 이어줍니다(AC-21).
// 06~08단계는 상세 페이지가 있어 그리로, 01~05단계는 각 카드에 이미 있는 다음 행동 링크
// (step.to — 예: 01은 /guide, 03은 /center/apply)로 이어줍니다. 그마저 없으면 /roadmap으로.
const HIDDEN_PREFIXES = ["/admin", "/login", "/reset-password", "/mypage", "/privacy", "/terms"];

const STAGE_PATH_TO_KEY: Record<string, string> = {
  "06-review": "step_06",
  "07-matching": "step_07",
  "08-ceremony": "step_08",
};

function stepHref(step: RoadmapStep): string {
  const stage = Object.entries(STAGE_PATH_TO_KEY).find(([, key]) => key === step.key)?.[0];
  if (stage) {
    const firstPage = getFirstRoadmapDetailPage(stage);
    if (firstPage) return `/roadmap/${firstPage.stage}/${firstPage.slug}`;
  }
  return step.to?.href ?? "/roadmap";
}

export function RoadmapIndex() {
  const { pathname } = useLocation();
  const containerRef = useRef<HTMLOListElement>(null);
  const currentRef = useRef<HTMLAnchorElement>(null);

  const stageMatch = Object.keys(STAGE_PATH_TO_KEY).find((stage) =>
    pathname.startsWith(`/roadmap/${stage}`),
  );
  const currentStepKey = stageMatch ? STAGE_PATH_TO_KEY[stageMatch] : null;

  // 훅은 조건부 return보다 먼저 항상 같은 순서로 호출해야 합니다(Rules of Hooks).
  useEffect(() => {
    const container = containerRef.current;
    const current = currentRef.current;
    if (!container || !current) return;
    // scrollIntoView는 이 가로 스크롤 목록만이 아니라 페이지 전체(세로 스크롤)까지 건드려서,
    // 다른 페이지로 이동했을 때 이 목록이 있는 아래쪽으로 화면이 끌려가 버립니다. 그래서
    // 페이지 스크롤에는 손대지 않고 이 목록의 scrollLeft만 직접 계산해 옮깁니다.
    const targetLeft = current.offsetLeft - container.clientWidth / 2 + current.offsetWidth / 2;
    container.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, [currentStepKey]);

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <nav
      aria-label="축복로드맵 8단계 색인"
      className="border-t border-border bg-muted/40 py-4"
    >
      <ol
        ref={containerRef}
        className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 md:px-8 md:flex-wrap md:justify-center md:overflow-visible"
      >
        {DEFAULT_ROADMAP_STEPS.map((step) => {
          const isCurrent = step.key === currentStepKey;
          return (
            <li key={step.key} className="shrink-0">
              <Link
                ref={isCurrent ? currentRef : undefined}
                to={stepHref(step)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary-deep",
                )}
              >
                <span className="tabular-nums">{step.no}</span>
                {step.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
