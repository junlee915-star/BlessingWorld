import { Link } from "react-router-dom";

import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { PARENTS_FINAL_CTA } from "@/content/parents";

export function ParentsFinalCta() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 text-center md:px-8 md:py-24">
      <EyebrowLabel>{PARENTS_FINAL_CTA.eyebrow}</EyebrowLabel>
      <h2 className="mt-3 text-2xl font-bold text-foreground md:text-[32px]">
        {PARENTS_FINAL_CTA.title}
      </h2>
      <p className="mt-4 text-[15px] leading-[1.8] text-muted-foreground">{PARENTS_FINAL_CTA.body}</p>
      <Button asChild size="lg" className="mt-8">
        <Link to={PARENTS_FINAL_CTA.cta.to}>{PARENTS_FINAL_CTA.cta.label}</Link>
      </Button>
    </section>
  );
}
