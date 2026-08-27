import { Link } from "react-router-dom";
import { Route } from "lucide-react";

import { Button } from "@/components/ui/button";

// 6축 개편 §4.2 — 절차 설명(StepJourney)은 /roadmap으로 옮기고, 축복의 씨앗에는
// 넘어가는 배너만 남깁니다. 같은 내용을 두 페이지에서 설명하지 않기 위한 장치입니다.
export function RoadmapBanner() {
  return (
    <section className="bg-muted/60 py-16 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-deep"
          >
            <Route className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              그래서, 어떤 순서로 진행되나요?
            </h2>
            <p className="mt-2 max-w-prose text-sm leading-[1.75] text-muted-foreground md:text-base">
              알아보기부터 축복식까지 여덟 단계를 한눈에 정리했습니다. 지금 서 있는 자리에서
              다음 한 걸음만 확인해보세요.
            </p>
          </div>
        </div>
        <Button asChild size="lg" variant="outline" className="shrink-0">
          <Link to="/roadmap">축복로드맵 보기</Link>
        </Button>
      </div>
    </section>
  );
}
