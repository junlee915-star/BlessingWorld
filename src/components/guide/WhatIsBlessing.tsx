import { SectionHeading } from "@/components/common/SectionHeading";
import { WHAT_IS_BLESSING } from "@/content/guide";

export function WhatIsBlessing() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <SectionHeading
          eyebrow={WHAT_IS_BLESSING.eyebrow}
          title={WHAT_IS_BLESSING.title}
        />
        <div className="flex flex-col gap-6">
          {WHAT_IS_BLESSING.bodyParagraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-prose text-[15px] leading-[1.75] text-muted-foreground md:text-[17px]">
              {paragraph}
            </p>
          ))}
          <blockquote className="whitespace-pre-line rounded-2xl border-l-4 border-accent bg-accent-soft px-6 py-5 text-[15px] italic leading-[1.8] text-accent-foreground">
            {WHAT_IS_BLESSING.quote}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
