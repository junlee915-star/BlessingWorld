import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { WHAT_IS_BLESSING } from "@/content/guide";

// 2열 카드 — 왼쪽 사진 위에 제목이 얹히고, 오른쪽 흰 패널에 본문과 인용문이 들어갑니다.
// 사진 위 텍스트는 대비 확보를 위해 아래쪽 그라디언트를 깔고 흰 글자를 씁니다(§9.1).
export function WhatIsBlessing() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative min-h-[240px] lg:min-h-full">
          <img
            src={WHAT_IS_BLESSING.image}
            alt={WHAT_IS_BLESSING.imageAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* 글자 대비용 그라디언트 — 사진이 밝아도 흰 글자가 읽힙니다. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/25 to-transparent"
          />
          <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
            <EyebrowLabel tone="light">{WHAT_IS_BLESSING.eyebrow}</EyebrowLabel>
            <h2 className="mt-3 whitespace-pre-line text-[22px] font-bold leading-[1.35] text-white md:text-[26px]">
              {WHAT_IS_BLESSING.title}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6 md:p-10">
          {WHAT_IS_BLESSING.bodyParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="max-w-prose text-[15px] leading-[1.8] text-muted-foreground md:text-[17px]"
            >
              {paragraph}
            </p>
          ))}
          <blockquote className="mt-auto whitespace-pre-line rounded-xl bg-primary-soft px-5 py-4 text-[15px] leading-[1.8] text-primary-deep">
            {WHAT_IS_BLESSING.quote}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
