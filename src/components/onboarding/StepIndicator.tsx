import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

// §P-07 스텝 인디케이터 — 실측 5단계(성별→출생년도→지역→연락처→완료).
// 완료(5번째) 스텝은 실제 성공 화면(별도 렌더)에 도달했을 때만 의미가 있어서, 이 컴포넌트는
// 위저드 진행 중(1~4단계)에만 쓰입니다 — 마지막 노드는 항상 "아직 도달 전" 상태로 보여줍니다.
export const ONBOARDING_STEP_LABELS = ["성별", "출생년도", "지역", "연락처", "완료"] as const;

interface StepIndicatorProps {
  /** 1~4. */
  currentStep: number;
  className?: string;
}

export function StepIndicator({ currentStep, className }: StepIndicatorProps) {
  const total = ONBOARDING_STEP_LABELS.length;

  return (
    <div className={cn("w-full", className)}>
      {/* 모바일: 축약형 "n / 5" + 프로그레스 바 */}
      <div className="flex items-center gap-3 sm:hidden">
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          {currentStep} / {total}
        </span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / total) * 100}%` }}
          />
        </div>
      </div>

      {/* 데스크톱: 가로 스텝 바 */}
      <ol className="hidden items-center sm:flex" aria-hidden="true">
        {ONBOARDING_STEP_LABELS.map((label, index) => {
          const stepNo = index + 1;
          const isCompleted = stepNo < currentStep;
          const isCurrent = stepNo === currentStep;
          return (
            <li key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isCurrent && "bg-primary text-primary-foreground",
                    isCompleted && "bg-primary-soft text-primary-deep",
                    !isCurrent && !isCompleted && "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : stepNo}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {stepNo < total ? (
                <span
                  className={cn(
                    "mx-2 h-px flex-1",
                    isCompleted ? "bg-primary-soft" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
