import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { TOGETHER_FOR_FAMILY } from "@/content/guide";

// 6축 개편 §4.2 — 절차 설명(구 StepJourney)은 /roadmap으로 옮기고, 축복의 씨앗에는
// 넘어가는 다리만 둡니다. 카피는 원본의 TOGETHER, FOR FAMILY 섹션을 그대로 옮겼습니다.
// 여기에 단계 목록을 다시 나열하지 마세요 — 절차의 단일 출처는 content/roadmap.ts입니다.
export function RoadmapBanner() {
  return (
    <section className="bg-muted/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow={TOGETHER_FOR_FAMILY.eyebrow}
          title={<span className="whitespace-pre-line">{TOGETHER_FOR_FAMILY.title}</span>}
          description={TOGETHER_FOR_FAMILY.body}
        />
        <Button asChild size="lg" className="mt-8">
          <Link to={TOGETHER_FOR_FAMILY.cta.to}>
            {TOGETHER_FOR_FAMILY.cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
