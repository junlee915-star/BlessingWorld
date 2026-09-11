import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { HERO_COPY, HERO_IMAGE, HOME_CTA } from "@/content/home";

export function Hero() {
  return (
    <section
      aria-label="블레싱월드 소개"
      className="relative h-[560px] w-full overflow-hidden text-white sm:h-[620px] md:h-[680px]"
    >
      <img
        src={HERO_IMAGE.image}
        alt={HERO_IMAGE.alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      {/* 사진 속 신랑·신부 얼굴은 상단~중앙에 있어 그대로 두고, 텍스트는 하단(맞잡은 손·부케
          부근)에 배치 — 그 구간이 밝은 흰 꽃이라 가독성용 비네트를 하단에 더 짙게 준다. */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-primary-deep/35 to-primary-deep/5" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-end px-5 pb-12 text-center md:px-8 md:pb-16">
        {/* 다크 히어로 배경 위라 accent-soft(연한 크림 골드) — text-accent-deep은 밝은 배경 전용(§9.1). */}
        <p className="eyebrow text-accent-soft">{HERO_COPY.eyebrow}</p>
        <h1 className="mt-4 max-w-2xl whitespace-pre-line text-[32px] font-bold leading-[1.28] md:text-[48px]">
          {HERO_COPY.title}
        </h1>
        <p className="mt-6 max-w-md whitespace-pre-line text-[15px] leading-[1.85] text-white/85">
          {HERO_COPY.body}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
            <Link to={HOME_CTA.primary.to}>{HOME_CTA.primary.label} →</Link>
          </Button>
          <Button asChild variant="outline-light" size="lg" className="w-full sm:w-auto">
            <Link to={HOME_CTA.secondary.to}>{HOME_CTA.secondary.label} ↗</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
