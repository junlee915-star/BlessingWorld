import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { ReadinessChecker } from "@/components/roadmap/ReadinessChecker";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import { ROADMAP_FINAL_CTA, ROADMAP_HERO, type RoadmapStep } from "@/content/roadmap";
import { DEFAULT_ROADMAP_STEPS } from "@/content/roadmap";
import { fetchRoadmapSteps } from "@/lib/roadmap";
import {
  deriveCurrentStep,
  fetchMyProgress,
  getLocalCurrentStep,
} from "@/lib/blessingProgress";
import { useAuth } from "@/lib/auth";

// 축복로드맵 `/roadmap` — 6축 개편 §4.5. 절차만 담당합니다(가치는 /guide, 행동은 /center).
export default function Roadmap() {
  const { session } = useAuth();
  const [steps, setSteps] = useState<RoadmapStep[]>(DEFAULT_ROADMAP_STEPS);
  const [currentStepKey, setCurrentStepKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchRoadmapSteps().then((data) => {
      if (!cancelled) setSteps(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const orderedKeys = steps.map((step) => step.key);
    // 담당자가 관리하는 실제 진행 상태가 있으면 그것이 우선입니다.
    fetchMyProgress(session?.user.id).then((progress) => {
      if (cancelled) return;
      const derived = deriveCurrentStep(progress, orderedKeys);
      setCurrentStepKey(derived ?? getLocalCurrentStep());
    });
    return () => {
      cancelled = true;
    };
  }, [session?.user.id, steps]);

  const stepListJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "축복결혼 진행 순서",
      step: steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
    }),
    [steps],
  );

  return (
    <>
      <SEO path="/roadmap" jsonLd={[stepListJsonLd]} />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
        <EyebrowLabel>{ROADMAP_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 max-w-3xl font-serif text-[28px] font-bold leading-[1.3] text-foreground md:text-[40px]">
          {ROADMAP_HERO.title}
        </h1>
        <p className="prose-copy mt-5 max-w-2xl text-[15px] md:text-[17px]">{ROADMAP_HERO.body}</p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <RoadmapTimeline steps={steps} currentStepKey={currentStepKey} />
      </section>

      <ReadinessChecker />

      <section className="bg-primary py-16 text-white md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8">
          <h2 className="text-2xl font-bold leading-[1.4] md:text-[30px]">
            {ROADMAP_FINAL_CTA.title}
          </h2>
          <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-white/80 md:text-base">
            {ROADMAP_FINAL_CTA.body}
          </p>
          <Button asChild variant="light" size="lg" className="mt-8">
            <Link to={ROADMAP_FINAL_CTA.cta.to}>{ROADMAP_FINAL_CTA.cta.label}</Link>
          </Button>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/75">
            {ROADMAP_FINAL_CTA.badges.map((badge) => (
              <li key={badge}>· {badge}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
