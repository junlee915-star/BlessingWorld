import type { ComponentType, SVGProps } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Clock,
  MapPin,
  Compass,
  GraduationCap,
  Send,
  MessagesSquare,
  FileText,
  ClipboardCheck,
  HeartHandshake,
  PartyPopper,
} from "lucide-react";

import { ROADMAP_SERIES_NAMES, WAITING_NOTE, type RoadmapStep } from "@/content/roadmap";
import { cn } from "@/lib/utils";

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
  /** "지금 여기"로 표시할 단계. 알 수 없으면 null — 아무 단계도 강조하지 않습니다. */
  currentStepKey: string | null;
  /** 방문자가 직접 현재 위치를 고를 수 있게 합니다(로그인 없이도 쓰도록). */
  onSelectCurrent?: (stepKey: string) => void;
}

// 단계별로 한눈에 구분되는 아이콘을 붙입니다.
const STEP_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  step_01: Compass,
  step_02: GraduationCap,
  step_03: Send,
  step_04: MessagesSquare,
  step_05: FileText,
  step_06: ClipboardCheck,
  step_07: HeartHandshake,
  step_08: PartyPopper,
};

// 큰 화면(4열)에서는 1~4를 왼→오로 놓은 뒤 5~8을 오른쪽에서 왼쪽으로 되짚어 배치해
// 뱀처럼 굽이치는 읽기 흐름(1→4행, 이어서 5는 4 바로 아래)을 만듭니다.
// 작은 화면에서는 DOM 순서(1~8) 그대로 세로로 읽힙니다.
// Tailwind가 클래스를 빌드시 인식하도록 정적 문자열로 나열합니다.
const LG_ORDER = [
  "lg:order-1",
  "lg:order-2",
  "lg:order-3",
  "lg:order-4",
  "lg:order-8",
  "lg:order-7",
  "lg:order-6",
  "lg:order-5",
];

export function RoadmapTimeline({ steps, currentStepKey, onSelectCurrent }: RoadmapTimelineProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStepKey);
  const lastIndex = Math.max(steps.length - 1, 1);
  const fraction = currentIndex >= 0 ? currentIndex / lastIndex : 0;
  const percent = Math.round(fraction * 100);

  return (
    <div>
      {/* 상단 진행 바 — 지금 몇 단계인지, 전체에서 어디쯤인지 한눈에 보여줍니다. */}
      <div className="mx-auto max-w-3xl">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold text-foreground">
            {currentIndex >= 0 ? `${currentIndex + 1}단계 진행 중` : "진행 단계를 선택해 주세요"}
          </span>
          <span className="font-semibold text-primary-deep">{percent}%</span>
        </div>

        <div className="relative mt-4 px-4">
          <div
            className="absolute inset-x-4 top-4 h-1 -translate-y-1/2 rounded-full bg-border"
            aria-hidden="true"
          />
          <div
            className="absolute left-4 top-4 h-1 -translate-y-1/2 rounded-full bg-primary transition-all duration-500"
            style={{ width: `calc((100% - 2rem) * ${fraction})` }}
            aria-hidden="true"
          />
          <ol className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCurrent = index === currentIndex;
              const isPast = currentIndex >= 0 && index < currentIndex;
              return (
                <li key={step.key} className="flex flex-col items-center">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-card text-[11px] font-bold transition-colors",
                      isCurrent
                        ? "border-accent-deep bg-accent text-accent-foreground ring-4 ring-accent/25"
                        : isPast
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-dashed border-primary/40 text-primary/50",
                    )}
                  >
                    {isPast ? <Check className="h-4 w-4" /> : step.no}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* 단계 카드 — 큰 화면에서는 4×2 지그재그, 작은 화면에서는 세로 목록. */}
      <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const isCurrent = step.key === currentStepKey;
          const isPast = currentIndex >= 0 && index < currentIndex;
          const Icon = STEP_ICONS[step.key] ?? MapPin;
          const seriesName = ROADMAP_SERIES_NAMES[step.key];

          return (
            <li
              key={step.key}
              className={cn("animate-fade-in-up flex flex-col", LG_ORDER[index] ?? "")}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <p className="text-center text-xs font-bold tracking-[0.2em] text-muted-foreground">
                STEP {step.no}
              </p>

              <div
                className={cn(
                  "mt-3 flex h-full flex-col rounded-2xl border bg-card p-5 shadow-card transition-colors",
                  isCurrent ? "border-accent-deep ring-1 ring-accent-deep/30" : "border-border",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isCurrent
                        ? "border-accent-deep bg-accent text-accent-foreground"
                        : isPast
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-dashed border-primary/40 bg-card text-primary/50",
                    )}
                  >
                    {isPast ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <div>
                    {seriesName ? (
                      <p className="text-xs font-semibold tracking-wide text-accent-deep">
                        {seriesName}
                      </p>
                    ) : null}
                    <h3 className="text-base font-semibold text-foreground">
                      <span className="sr-only">{`${index + 1}단계 `}</span>
                      {step.title}
                    </h3>
                  </div>
                </div>

                {isCurrent || step.durationLabel ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
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
                ) : null}

                <p className="mt-3 text-sm leading-[1.75] text-muted-foreground">{step.description}</p>

                {step.waiting ? (
                  <p className="mt-3 rounded-lg bg-primary-soft px-3 py-2 text-sm leading-[1.7] text-primary-deep">
                    {WAITING_NOTE}
                  </p>
                ) : null}

                <div className="mt-auto pt-4">
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
                      className="mt-2 block text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary-deep hover:underline"
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
    </div>
  );
}
