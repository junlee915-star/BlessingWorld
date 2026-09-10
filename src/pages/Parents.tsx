import { Link } from "react-router-dom";
import { BookOpen, CalendarDays, ClipboardList, HelpCircle, MessageCircle } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { ParentsPrincipleBand } from "@/components/parents/ParentsPrincipleBand";
import { ParentsFinalCta } from "@/components/parents/ParentsFinalCta";
import { PARENTS_CARDS, PARENTS_HERO, PARENTS_SELF_TRACK_LINK } from "@/content/parents";

const ICONS = { BookOpen, MessageCircle, ClipboardList, HelpCircle, CalendarDays } as const;

// 부모 트랙 허브 `/parents` — §14 개선안 P-12. 배포본 전체가 자녀(본인) 1인칭 카피뿐이라
// 부모가 읽을 페이지가 없던 것을 보완합니다. 본인 트랙(/guide)을 대체하지 않습니다.
export default function Parents() {
  return (
    <>
      <SEO path="/parents" />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 text-center md:px-8 md:pt-24">
        <EyebrowLabel>{PARENTS_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mx-auto mt-4 max-w-3xl whitespace-pre-line text-[28px] font-bold leading-[1.35] text-foreground md:text-[40px]">
          {PARENTS_HERO.title}
        </h1>
        <p className="prose-copy mx-auto mt-5 max-w-2xl text-[15px] md:text-[17px]">
          {PARENTS_HERO.body}
        </p>

        <p className="mt-6 text-sm text-muted-foreground">
          {PARENTS_SELF_TRACK_LINK.body}{" "}
          <Link to={PARENTS_SELF_TRACK_LINK.to} className="font-medium text-primary-deep hover:underline">
            {PARENTS_SELF_TRACK_LINK.cta}
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PARENTS_CARDS.map((card, index) => {
            const Icon = ICONS[card.icon];
            return (
              <li
                key={card.id}
                className="animate-fade-in-up flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary-deep"
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-xl font-bold text-foreground">{card.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-[1.75] text-muted-foreground">
                  {card.description}
                </p>
                <Button asChild variant="outline" className="mt-6 w-full">
                  <Link to={card.to}>{card.cta}</Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </section>

      <ParentsPrincipleBand />
      <ParentsFinalCta />
    </>
  );
}
