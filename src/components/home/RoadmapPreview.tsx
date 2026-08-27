import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { HOME_ROADMAP_PREVIEW } from "@/content/home";
import { DEFAULT_ROADMAP_STEPS } from "@/content/roadmap";

// 홈 로드맵 미리보기(6축 개편 §4.1-4) — 앞 3단계만 보여주고 나머지는 /roadmap으로 넘깁니다.
// 홈에서 8단계를 모두 나열하면 로드맵 페이지가 존재할 이유가 없어지고, 첫 화면이 무거워집니다.
const PREVIEW_STEPS = DEFAULT_ROADMAP_STEPS.slice(0, 3);

export function RoadmapPreview() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeading
        eyebrow={HOME_ROADMAP_PREVIEW.eyebrow}
        title={HOME_ROADMAP_PREVIEW.title}
        description={HOME_ROADMAP_PREVIEW.body}
      />

      <ol className="mt-10 grid gap-5 md:grid-cols-3">
        {PREVIEW_STEPS.map((step, index) => (
          <li
            key={step.key}
            className="animate-fade-in-up rounded-2xl border border-border bg-card p-6 shadow-card"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-deep"
            >
              {step.no}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <Button asChild variant="outline" size="lg">
          <Link to={HOME_ROADMAP_PREVIEW.cta.to}>
            {HOME_ROADMAP_PREVIEW.cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
