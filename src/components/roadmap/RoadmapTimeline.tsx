import { Link } from "react-router-dom";
import { Check, Clock, MapPin } from "lucide-react";

import { WAITING_NOTE, type RoadmapStep } from "@/content/roadmap";
import { cn } from "@/lib/utils";

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
  /** "지금 여기"로 표시할 단계. 알 수 없으면 null — 아무 단계도 강조하지 않습니다. */
  currentStepKey: string | null;
  /** 방문자가 직접 현재 위치를 고를 수 있게 합니다(로그인 없이도 쓰도록). */
  onSelectCurrent?: (stepKey: string) => void;
}

export function RoadmapTimeline({ steps, currentStepKey, onSelectCurrent }: RoadmapTimelineProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStepKey);

  return (
    <ol className="relative border-l border-border pl-8 sm:pl-10">
      {steps.map((step, index) => {
        const isCurrent = step.key === currentStepKey;
        const isPast = currentIndex >= 0 && index < currentIndex;

        return (
          <li
            key={step.key}
            className="animate-fade-in-up relative pb-10 last:pb-0"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute -left-[41px] top-0 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold sm:-left-[49px]",
                isCurrent
                  ? "border-accent-deep bg-accent text-accent-foreground"
                  : isPast
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary bg-background text-primary",
              )}
            >
              {isPast ? <Check className="h-4 w-4" /> : step.no}
            </span>

            <div
              className={cn(
                "relative rounded-2xl border bg-card p-5 shadow-card sm:p-6",
                isCurrent ? "border-accent-deep ring-1 ring-accent-deep/30" : "border-border",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  <span className="sr-only">{`${index + 1}단계 `}</span>
                  {step.title}
                </h3>
                {isCurrent ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-deep">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    지금 여기
                  </span>
                ) : null}
                {step.durationLabel ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-deep">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {step.durationLabel}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">{step.description}</p>

              {step.waiting ? (
                <p className="mt-3 rounded-lg bg-primary-soft px-3 py-2 text-sm leading-[1.7] text-primary-deep">
                  {WAITING_NOTE}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-4">
                {step.to ? (
                  <Link
                    to={step.to.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary-deep hover:underline"
                  >
                    {step.to.label} →
                  </Link>
                ) : null}
                {onSelectCurrent && !isCurrent ? (
                  <button
                    type="button"
                    onClick={() => onSelectCurrent(step.key)}
                    className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary-deep hover:underline"
                  >
                    여기가 지금 제 단계예요
                  </button>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
