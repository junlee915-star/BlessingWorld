import { useEffect, useMemo, useState } from "react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { TrustBadges } from "@/components/guide/TrustBadges";
import { WhatIsBlessing } from "@/components/guide/WhatIsBlessing";
import { ValuePillars } from "@/components/guide/ValuePillars";
import { StepJourney } from "@/components/guide/StepJourney";
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
        <h1 className="mt-4 max-w-3xl text-[28px] font-bold leading-[1.3] text-foreground md:text-[40px]">
          {GUIDE_HERO.title}
        </h1>
        <TrustBadges className="mt-8" />
      </section>

      <WhatIsBlessing />
      <ValuePillars />
      <StepJourney />
      <FaqAccordion items={faqs} />
      <GuideFinalCta />
    </>
  );
}
