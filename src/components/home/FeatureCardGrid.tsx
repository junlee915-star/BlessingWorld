import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { HOME_CARDS } from "@/content/home";
import { cn } from "@/lib/utils";

export function FeatureCardGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-6 lg:grid-cols-3">
        {HOME_CARDS.map((card) => {
          const content = (
            <>
              <div className="relative overflow-hidden">
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  loading="lazy"
                  className={cn(
                    "w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105",
                    card.size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]",
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <Badge className="w-fit">{card.badge}</Badge>
                <h3 className="flex items-center gap-1.5 text-xl font-semibold text-foreground">
                  {card.title}
                  {card.external ? (
                    <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  ) : null}
                </h3>
                <p className="flex-1 text-sm leading-[1.7] text-muted-foreground">
                  {card.description}
                </p>
                <span className="text-sm font-semibold text-primary-deep">{card.cta}</span>
              </div>
            </>
          );

          const className = cn(
            "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg",
            card.size === "lg" && "lg:col-span-2",
          );

          if (card.external) {
            return (
              <a
                key={card.title}
                href={card.to}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={card.title} to={card.to} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
