import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { GUIDE_FINAL_CTA } from "@/content/guide";

export function GuideFinalCta() {
  return (
    <section className="bg-primary-soft py-16 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8">
        <h2 className="text-2xl font-bold leading-[1.4] text-primary-deep md:text-[30px]">
          {GUIDE_FINAL_CTA.title}
        </h2>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-foreground/75 md:text-base">
          {GUIDE_FINAL_CTA.body}
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to={GUIDE_FINAL_CTA.cta.to}>{GUIDE_FINAL_CTA.cta.label}</Link>
        </Button>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-primary-deep/80">
          {GUIDE_FINAL_CTA.badges.map((badge) => (
            <li key={badge}>· {badge}</li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-muted-foreground">
          {GUIDE_FINAL_CTA.fineprint}{" "}
          <Link to="/privacy" className="underline hover:text-foreground">
            개인정보처리방침
          </Link>
        </p>
      </div>
    </section>
  );
}
