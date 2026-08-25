import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HERO_COPY, HERO_SLIDES, HOME_CTA } from "@/content/home";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL = 5000;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);
  return reduced;
}

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = useCallback((next: number) => {
    setIndex((next + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [reducedMotion, index]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="블레싱월드 소개 이미지"
      className="relative h-[560px] w-full overflow-hidden text-white sm:h-[620px] md:h-[680px]"
    >
      {HERO_SLIDES.map((slide, i) => (
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
          style={{ transitionDuration: "1100ms" }}
          loading={i === 0 ? "eager" : "lazy"}
          {...(i === 0 ? { fetchpriority: "high" } : {})}
          aria-hidden={i !== index}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/45 to-primary-deep/10" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-5 md:px-8">
        <p className="eyebrow text-accent">{HERO_COPY.eyebrow}</p>
        <h1 className="mt-4 max-w-2xl whitespace-pre-line text-[32px] font-bold leading-[1.28] md:text-[48px]">
          {HERO_COPY.title}
        </h1>
        <p className="mt-6 max-w-md whitespace-pre-line text-[15px] leading-[1.85] text-white/85">
          {HERO_COPY.body}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
            <Link to={HOME_CTA.primary.to}>{HOME_CTA.primary.label} →</Link>
          </Button>
          <Button asChild variant="outline-light" size="lg" className="w-full sm:w-auto">
            <Link to={HOME_CTA.secondary.to}>{HOME_CTA.secondary.label} ↗</Link>
          </Button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-3 text-white">
          <span className="text-sm font-semibold tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-white/40" aria-hidden="true" />
          <span className="text-sm text-white/60 tabular-nums">
            {String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden gap-2 sm:flex">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`슬라이드 ${i + 1}로 이동`}
                aria-current={i === index}
                className={cn(
                  "h-[3px] w-8 rounded-full bg-white/35 transition-colors",
                  i === index && "bg-accent",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="이전 슬라이드"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="다음 슬라이드"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
