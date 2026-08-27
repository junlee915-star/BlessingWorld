import { Link } from "react-router-dom";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GUIDE_FINAL_CTA } from "@/content/guide";

// 2열 카드 — 왼쪽 사진, 오른쪽 안내 패널(제목·본문·CTA·체크 목록·고지).
export function GuideFinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:grid lg:grid-cols-2">
        <div className="relative min-h-[240px] lg:min-h-full">
          <img
            src={GUIDE_FINAL_CTA.image}
            alt={GUIDE_FINAL_CTA.imageAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col p-6 md:p-10">
          <h2 className="whitespace-pre-line text-2xl font-bold leading-[1.4] text-foreground md:text-[30px]">
            {GUIDE_FINAL_CTA.title}
          </h2>
          <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground md:text-base">
            {GUIDE_FINAL_CTA.body}
          </p>

          <Button asChild size="lg" className="mt-8 w-full sm:w-fit">
            <Link to={GUIDE_FINAL_CTA.cta.to}>{GUIDE_FINAL_CTA.cta.label}</Link>
          </Button>

          <ul className="mt-8 space-y-2.5 text-sm text-muted-foreground">
            {GUIDE_FINAL_CTA.badges.map((badge) => (
              <li key={badge} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {badge}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-muted-foreground">
            {GUIDE_FINAL_CTA.fineprint}{" "}
            <Link to="/privacy" className="underline hover:text-foreground">
              개인정보처리방침 보기
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
