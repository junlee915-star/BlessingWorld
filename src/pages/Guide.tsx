import { useEffect, useMemo, useState } from "react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { WhatIsBlessing } from "@/components/guide/WhatIsBlessing";
import { ValuePillars } from "@/components/guide/ValuePillars";
import { RoadmapBanner } from "@/components/guide/RoadmapBanner";
import { FaqAccordion } from "@/components/guide/FaqAccordion";
import { GuideFinalCta } from "@/components/guide/GuideFinalCta";
import { GUIDE_HERO } from "@/content/guide";
import type { FaqItem } from "@/content/faq";
import { fetchPublishedFaqs } from "@/lib/faq";

export default function Guide() {
  // FaqAccordion과 아래 JSON-LD가 같은 값을 써야 해서 여기서 한 번만 가져와 내려줍니다.
  const [faqs, setFaqs] = useState<FaqItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedFaqs().then((data) => {
      if (!cancelled) setFaqs(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const faqJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (faqs ?? []).map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }),
    [faqs],
  );

  return (
    <>
      <SEO path="/guide" jsonLd={[faqJsonLd]} />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
        <EyebrowLabel>{GUIDE_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 max-w-3xl whitespace-pre-line text-[28px] font-bold leading-[1.3] text-foreground md:text-[40px]">
          {GUIDE_HERO.title}
        </h1>
        {/* 신뢰 배지(무료·본인 결정·중단 가능)는 하단 CTA(GuideFinalCta)에 이미 있어서,
            히어로에는 원본처럼 방향을 요약한 해시태그를 둡니다. */}
        <ul className="mt-8 flex flex-wrap gap-2">
          {GUIDE_HERO.hashtags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary-deep"
            >
              #{tag}
            </li>
          ))}
        </ul>
      </section>

      <WhatIsBlessing />
      <ValuePillars />
      <RoadmapBanner />
      <FaqAccordion items={faqs} />
      <GuideFinalCta />
    </>
  );
}
