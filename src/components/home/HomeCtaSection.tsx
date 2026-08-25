import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { HOME_CTA } from "@/content/home";

export function HomeCtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-4 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to={HOME_CTA.primary.to}>{HOME_CTA.primary.label} →</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link to={HOME_CTA.secondary.to}>{HOME_CTA.secondary.label} ↗</Link>
        </Button>
      </div>
    </section>
  );
}
