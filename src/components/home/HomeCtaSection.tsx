import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { HOME_CTA, HOME_CTA_BAND } from "@/content/home";

export function HomeCtaSection() {
  return (
    <section className="bg-primary-deep text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-16 text-center md:px-8 md:py-20">
        {/* bg-primary-deep(다크) 위라 accent-soft — §HeroCarousel.tsx와 같은 이유(§9.1). */}
        <p className="eyebrow text-accent-soft">{HOME_CTA_BAND.eyebrow}</p>
        <h2 className="max-w-xl text-2xl font-bold leading-[1.4] md:text-[32px]">
          {HOME_CTA_BAND.title}
        </h2>
        <p className="text-[15px] leading-[1.75] text-white/75">{HOME_CTA_BAND.body}</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
            <Link to={HOME_CTA.primary.to}>{HOME_CTA.primary.label} →</Link>
          </Button>
          <Button asChild variant="outline-light" size="lg" className="w-full sm:w-auto">
            <Link to={HOME_CTA.secondary.to}>{HOME_CTA.secondary.label} ↗</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
