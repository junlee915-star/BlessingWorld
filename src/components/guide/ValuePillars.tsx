import { Heart, HandHeart, Sprout, Users, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/common/SectionHeading";
import { OUR_DIRECTION } from "@/content/guide";

const ICONS: Record<string, LucideIcon> = { Heart, HandHeart, Sprout, Users };

export function ValuePillars() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeading
        eyebrow={OUR_DIRECTION.eyebrow}
        title={OUR_DIRECTION.title}
        description={OUR_DIRECTION.lead}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {OUR_DIRECTION.pillars.map((pillar) => {
          const Icon = ICONS[pillar.icon];
          return (
            <div
              key={pillar.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
