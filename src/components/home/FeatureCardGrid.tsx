import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { HOME_CARDS } from "@/content/home";
import { cn } from "@/lib/utils";

export function FeatureCardGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      {/* §4.4 카드 그리드 + §P-01④ "매거진형 비대칭 배치": 1·2번 카드(size lg)가
          lg:col-span-2로 크게 자리 잡고, grid-flow-dense가 3·4·5번 작은 카드로
          빈 칸을 채웁니다. DOM 순서(읽기/탭 순서)는 항상 1~5번 그대로입니다. */}
      <h2 className="sr-only">둘러보기</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-flow-row-dense">
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
                <h3 className="flex items-center gap-1.5 text-xl font-semibold text-foreground transition-colors group-hover:text-primary-deep">
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
            "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg",
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
