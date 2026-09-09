import type { ComponentType, SVGProps } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Clock,
  MapPin,
  Search,
  Users,
  Send,
  MessageSquare,
  Folder,
  ClipboardList,
  Heart,
  Award,
} from "lucide-react";

import { ROADMAP_SERIES_NAMES, WAITING_NOTE, type RoadmapStep } from "@/content/roadmap";
import { getLocalCheckedSteps, setLocalCheckedSteps } from "@/lib/blessingProgress";
import { cn } from "@/lib/utils";

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
  /** 담당자가 관리하는 "지금 여기" 단계. 없으면 체크되지 않은 첫 단계를 현재로 봅니다. */
  currentStepKey: string | null;
}

// 단계별로 한눈에 구분되는 아이콘.
const STEP_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  step_01: Search,
  step_02: Users,
  step_03: Send,
  step_04: MessageSquare,
  step_05: Folder,
  step_06: ClipboardList,
  step_07: Heart,
  step_08: Award,
};

export function RoadmapTimeline({ steps, currentStepKey }: RoadmapTimelineProps) {
  // 방문자가 직접 체크하는 단계 완료 상태(localStorage에만 저장). 진행바 %가 여기에 맞춰집니다.
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const seed: Record<string, boolean> = {};
    for (const key of getLocalCheckedSteps()) seed[key] = true;
    return seed;
  });

  useEffect(() => {
    setLocalCheckedSteps(Object.keys(checked).filter((key) => checked[key]));
  }, [checked]);

  const toggle = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const total = steps.length;
  const doneCount = steps.reduce((count, step) => (checked[step.key] ? count + 1 : count), 0);
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const progressLabel =
    doneCount === 0
      ? "아직 시작 전"
      : doneCount === total
        ? "모든 단계 완료"
        : `${total}단계 중 ${doneCount}단계 완료`;

  // "지금 여기"는 담당자 값이 있으면 그것, 없으면 아직 체크하지 않은 첫 단계.
  const currentKey = currentStepKey ?? steps.find((step) => !checked[step.key])?.key ?? null;

  return (
    <div>
      {/* 선형 진행바 — 체크한 단계 수에 맞춰 % 표시 */}
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-bold text-foreground sm:text-base">{progressLabel}</p>
        <p className="text-sm font-bold text-primary sm:text-base">{pct}%</p>
      </div>
      <div
        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-primary-soft"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={progressLabel}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-2 flex justify-between text-[11px] font-bold tabular-nums" aria-hidden="true">
        {steps.map((step) => (
          <li
            key={step.key}
            className={cn(checked[step.key] ? "text-primary" : "text-muted-foreground/70")}
          >
            {step.no}
          </li>
        ))}
      </ol>

      {/* 카드 격자 — 읽는 순서 그대로. 4단계 다음 5단계는 다음 줄 맨 왼쪽에서 시작합니다. */}
      <ol className="mt-10 grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const isDone = Boolean(checked[step.key]);
          const isCurrent = step.key === currentKey;
          const Icon = STEP_ICONS[step.key] ?? MapPin;
          const seriesName = ROADMAP_SERIES_NAMES[step.key];

          return (
            <li
              key={step.key}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="relative h-full">
                {/* 레이어드 카드 — 뒤로 색지가 어긋나게 겹칩니다(장식). */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 translate-y-[13px] rounded-2xl bg-primary-soft/60"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 translate-y-[6px] rounded-2xl bg-[#f9dbe7]"
                />

                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl bg-card p-5 shadow-card",
                    isCurrent
                      ? "border-2 border-primary"
                      : isDone
                        ? "border border-primary/30"
                        : "border border-border",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                          isDone
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary-soft text-primary",
                        )}
                      >
                        {isDone ? (
                          <Check className="h-[18px] w-[18px]" />
                        ) : (
                          <Icon className="h-[18px] w-[18px]" />
                        )}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {`STEP ${step.no}`}
                      </span>
                    </div>

                    <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggle(step.key)}
                        aria-label={`${step.title} 단계 완료로 표시`}
                        className="h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      완료
                    </label>
                  </div>

                  {seriesName ? (
                    <p className="mt-4 text-xs font-semibold tracking-wide text-accent-deep">
                      {seriesName}
                    </p>
                  ) : null}

                  <h3 className="mt-1 text-base font-bold text-foreground">
                    <span className="sr-only">{`${index + 1}단계 `}</span>
                    {step.title}
                  </h3>

                  {step.durationLabel ? (
                    <span className="mt-2 inline-flex w-max items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-deep">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {step.durationLabel}
                    </span>
                  ) : null}

                  <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">
                    {step.description}
                  </p>

                  {step.waiting ? (
                    <p className="mt-3 rounded-lg bg-primary-soft px-3 py-2 text-sm leading-[1.6] text-primary-deep">
                      {WAITING_NOTE}
                    </p>
                  ) : null}

                  {step.to ? (
                    <div className="mt-auto pt-4">
                      <Link
                        to={step.to.href}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary-deep hover:underline"
                      >
                        {step.to.label} →
                      </Link>
                    </div>
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
