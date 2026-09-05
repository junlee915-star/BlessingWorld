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
  Flag,
} from "lucide-react";

import { ROADMAP_SERIES_NAMES, WAITING_NOTE, type RoadmapStep } from "@/content/roadmap";
import { RoadmapTreeMotif } from "@/components/roadmap/RoadmapTreeMotif";
import { cn } from "@/lib/utils";

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
  /** "지금 여기"로 표시할 단계. 알 수 없으면 null — 아무 단계도 강조하지 않습니다. */
  currentStepKey: string | null;
  /** 방문자가 직접 현재 위치를 고를 수 있게 합니다(로그인 없이도 쓰도록). */
  onSelectCurrent?: (stepKey: string) => void;
}

type TrackAlign = "left" | "center" | "right";

// 세로 목록 대신 놀이동산 안내도처럼 굽이치는 길을 걷는 느낌을 주기 위해 좌·중앙·우로
// 번갈아 배치합니다. 4칸 주기로 반복하면 자연스러운 S자 곡선이 만들어집니다.
const TRACK_SEQUENCE: TrackAlign[] = ["left", "center", "right", "center"];
const TRACK_JUSTIFY: Record<TrackAlign, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};
// PathConnector의 SVG viewBox(0~100) 상에서 각 정렬이 대략 위치하는 x좌표.
// w-56/w-64 정류장 칸이 트랙 안에서 시작/중앙/끝에 놓일 때의 중심점과 맞춘 근사치입니다.
const TRACK_X: Record<TrackAlign, number> = { left: 19, center: 50, right: 81 };

function trackAlignOf(index: number): TrackAlign {
  return TRACK_SEQUENCE[index % TRACK_SEQUENCE.length];
}

// 정류장 칸(w-56/w-64)의 반대편 여백에 배경 나무를 심어 길가 풍경처럼 보이게 합니다.
// TRACK_SEQUENCE 4칸 주기에 맞춰 매번 반대쪽에 놓아 카드와 겹치지 않게 합니다.
const TREE_SIDE_SEQUENCE: Array<"left" | "right"> = ["right", "left", "left", "right"];

function treeSideOf(index: number): "left" | "right" {
  return TREE_SIDE_SEQUENCE[index % TREE_SIDE_SEQUENCE.length];
}

// 단계별로 놀이동산 안내판의 탈것 아이콘처럼 한눈에 구분되는 아이콘을 붙입니다.
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

export function RoadmapTimeline({ steps, currentStepKey, onSelectCurrent }: RoadmapTimelineProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStepKey);

  return (
    <ol className="relative mx-auto max-w-2xl">
      {steps.map((step, index) => {
        const isCurrent = step.key === currentStepKey;
        const isPast = currentIndex >= 0 && index < currentIndex;
        const align = trackAlignOf(index);
        // 직전 정류장까지 이미 지나왔다면(=이 구간에 들어섰다면) 길을 밝혀 보여줍니다.
        const segmentLit = currentIndex >= 0 && index <= currentIndex;
        const Icon = STEP_ICONS[step.key] ?? MapPin;
        const seriesName = ROADMAP_SERIES_NAMES[step.key];
        const treeSide = treeSideOf(index);

        return (
          <li
            key={step.key}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            {index > 0 ? (
              <PathConnector from={TRACK_X[trackAlignOf(index - 1)]} to={TRACK_X[align]} lit={segmentLit} />
            ) : null}

            <div className={cn("relative flex", TRACK_JUSTIFY[align])}>
              {/* 길가 풍경 — 단계가 오를수록 무성해지는 나무. 카드와 겹치지 않게 반대쪽 여백에 둡니다. */}
              <RoadmapTreeMotif
                stage={index + 1}
                className={cn(
                  "pointer-events-none absolute top-0 hidden h-full w-16 sm:block md:w-20",
                  treeSide === "left" ? "left-0" : "right-0",
                )}
              />

              <div className="flex w-56 flex-col items-center text-center sm:w-64">
                <div className="relative shrink-0">
                  {isCurrent ? (
                    <span
                      className="absolute -top-8 left-1/2 flex -translate-x-1/2 animate-bounce items-center justify-center rounded-full bg-card p-1.5 shadow-card"
                      aria-hidden="true"
                    >
                      <Flag className="h-4 w-4 text-accent-deep" />
                    </span>
                  ) : null}

                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-card transition-colors",
                      isCurrent
                        ? "border-accent-deep bg-accent text-accent-foreground ring-4 ring-accent/25"
                        : isPast
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-dashed border-primary/40 bg-card text-primary/50",
                    )}
                  >
                    {isPast ? <Check className="h-7 w-7" /> : <Icon className="h-7 w-7" />}
                  </span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background text-[11px] font-bold",
                      isCurrent || isPast
                        ? "bg-primary-deep text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {step.no}
                  </span>
                </div>

                <div
                  className={cn(
                    "relative mt-4 w-full rounded-2xl border bg-card p-5 text-left shadow-card",
                    isCurrent ? "border-accent-deep ring-1 ring-accent-deep/30" : "border-border",
                  )}
                >
                  {seriesName ? (
                    <p className="text-xs font-semibold tracking-wide text-accent-deep">{seriesName}</p>
                  ) : null}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
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
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** 정류장 사이를 잇는 굽이치는 길. viewBox가 0~100이라 폭에 상관없이 항상 같은 비율로 휩니다. */
function PathConnector({ from, to, lit }: { from: number; to: number; lit: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-16 w-full text-border md:h-20"
      aria-hidden="true"
    >
      <path
        d={`M ${from} 0 C ${from} 45, ${to} 55, ${to} 100`}
        fill="none"
        stroke={lit ? "hsl(var(--primary))" : "currentColor"}
        strokeWidth={lit ? 5 : 4}
        strokeLinecap="round"
        strokeDasharray={lit ? undefined : "1 12"}
      />
    </svg>
  );
}
