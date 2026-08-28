import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import {
  LIKERT_LABELS,
  STYLE_COPY,
  VALUES_ASSESSMENT_COPY,
  VALUES_CATEGORIES,
  VALUES_QUESTIONS,
  scoreValuesAssessment,
  type ValuesAssessmentResult,
} from "@/content/valuesAssessment";
import { cn } from "@/lib/utils";

interface ValuesAssessmentStepProps {
  /** null이면 건너뛰거나 결과를 첨부하지 않기로 한 경우입니다. */
  onDone: (result: ValuesAssessmentResult | null) => void;
}

type Phase = "intro" | "questions" | "result";

// 축복상담 신청(§Onboarding.tsx) 안의 선택 단계 — 가치관 12문항 진단(DESIGN 목업 기반).
export function ValuesAssessmentStep({ onDone }: ValuesAssessmentStepProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ValuesAssessmentResult | null>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === VALUES_QUESTIONS.length;

  function selectAnswer(questionId: number, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleShowResult() {
    if (!allAnswered) return;
    const ordered = VALUES_QUESTIONS.map((q) => answers[q.id]);
    setResult(scoreValuesAssessment(ordered));
    setPhase("result");
  }

  if (phase === "intro") {
    return (
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 text-left shadow-card md:p-8">
        <EyebrowLabel>{VALUES_ASSESSMENT_COPY.eyebrow}</EyebrowLabel>
        <h2 className="mt-2 text-xl font-bold text-foreground md:text-2xl">
          {VALUES_ASSESSMENT_COPY.title}
        </h2>
        <p className="mt-3 text-sm leading-[1.75] text-muted-foreground">
          {VALUES_ASSESSMENT_COPY.body}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="muted">{VALUES_ASSESSMENT_COPY.timeBadge}</Badge>
          <Badge variant="muted">{VALUES_ASSESSMENT_COPY.retakeBadge}</Badge>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            size="lg"
            className="sm:flex-1"
            onClick={() => setPhase("questions")}
          >
            {VALUES_ASSESSMENT_COPY.startCta}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="sm:flex-1"
            onClick={() => onDone(null)}
          >
            {VALUES_ASSESSMENT_COPY.skipCta}
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "questions") {
    return (
      <div className="w-full max-w-2xl text-left">
        <div className="flex items-center justify-between gap-3">
          <EyebrowLabel>{VALUES_ASSESSMENT_COPY.title}</EyebrowLabel>
          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            {answeredCount} / {VALUES_QUESTIONS.length}
          </span>
        </div>

        <div className="mt-4 space-y-8">
          {VALUES_CATEGORIES.map((category, categoryIndex) => (
            <div key={category.key}>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-deep">
                0{categoryIndex + 1} {category.title}
              </p>
              <div className="mt-3 space-y-4">
                {VALUES_QUESTIONS.filter((q) => q.category === category.key).map((question) => (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-card"
                  >
                    <p className="text-sm font-medium text-foreground">{question.text}</p>
                    <div className="mt-3 grid grid-cols-5 gap-1.5">
                      {LIKERT_LABELS.map((label, i) => {
                        const value = i + 1;
                        const selected = answers[question.id] === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => selectAnswer(question.id, value)}
                            className={cn(
                              "rounded-lg border px-1 py-2 text-center text-[11px] font-medium leading-tight transition-colors",
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:border-primary hover:text-primary-deep",
                            )}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            size="lg"
            className="sm:flex-1"
            disabled={!allAnswered}
            onClick={handleShowResult}
          >
            {VALUES_ASSESSMENT_COPY.resultTitle} 보기
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="sm:flex-1"
            onClick={() => onDone(null)}
          >
            {VALUES_ASSESSMENT_COPY.skipCta}
          </Button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="w-full max-w-2xl text-left">
      <EyebrowLabel>{VALUES_ASSESSMENT_COPY.resultTitle}</EyebrowLabel>
      <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">
        {VALUES_ASSESSMENT_COPY.resultIntro}
      </p>

      <div className="mt-6 space-y-4">
        {VALUES_CATEGORIES.map((category) => {
          const pole = result.styles[category.key];
          const style = STYLE_COPY[category.key][pole];
          return (
            <div key={category.key} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-deep">
                {category.title}
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">{style.name}</p>
              <p className="mt-1.5 text-sm leading-[1.7] text-muted-foreground">
                {style.description}
              </p>
              <p className="mt-3 rounded-xl bg-primary-soft p-3 text-sm leading-[1.7] text-primary-deep">
                <span className="font-semibold">{VALUES_ASSESSMENT_COPY.partnerHeading}</span> —{" "}
                {style.partnerSuggestion}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button type="button" size="lg" className="sm:flex-1" onClick={() => onDone(result)}>
          {VALUES_ASSESSMENT_COPY.saveCta}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="sm:flex-1"
          onClick={() => onDone(null)}
        >
          {VALUES_ASSESSMENT_COPY.discardCta}
        </Button>
      </div>
    </div>
  );
}
