import { Heart, HandHeart, Home, Sprout, Users, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/common/SectionHeading";
import { OUR_DIRECTION } from "@/content/guide";

const ICONS: Record<string, LucideIcon> = { Heart, HandHeart, Home, Sprout, Users };

// 4열 — 각 열은 [설명 카드] + [사진]입니다.
// 카드에 flex-1을 줘서 남는 높이를 카드가 흡수하게 하면, 설명 길이가 달라도 사진의
// 윗변이 모든 열에서 같은 높이에 놓입니다(엇갈림 배치는 걷어냈습니다).
export function ValuePillars() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <SectionHeading
        eyebrow={OUR_DIRECTION.eyebrow}
        title={OUR_DIRECTION.title}
        description={OUR_DIRECTION.lead}
      />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {OUR_DIRECTION.pillars.map((pillar) => {
          const Icon = ICONS[pillar.icon];
          return (
            <li key={pillar.title} className="flex h-full flex-col gap-5">
              <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-[1.75] text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
              <img
                src={pillar.image}
                alt={pillar.imageAlt}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
