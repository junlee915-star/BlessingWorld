import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
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

interface ValuesAssessmentSectionProps {
  /** 12문항을 모두 답하고 "첨부" 체크가 켜져 있을 때만 결과를 전달합니다. 그 외엔 null. */
  onChange: (result: ValuesAssessmentResult | null) => void;
}

// 축복상담 신청(§Onboarding.tsx)과 한 화면에 있는 선택 섹션 — 가치관 12문항 진단(DESIGN 목업 기반).
// 단계 전환 없이 스크롤만으로 응답→결과 확인→(선택)첨부까지 끝나도록 한 화면에 이어붙였습니다.
export function ValuesAssessmentSection({ onChange }: ValuesAssessmentSectionProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [attach, setAttach] = useState(true);

  const allAnswered = Object.keys(answers).length === VALUES_QUESTIONS.length;
  const result = allAnswered
    ? scoreValuesAssessment(VALUES_QUESTIONS.map((q) => answers[q.id]))
    : null;

  useEffect(() => {
    onChange(result && attach ? result : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- result는 answers에서 매 렌더 새로 계산되어 참조가 바뀝니다. answers/attach 변화에만 반응하면 충분합니다.
  }, [answers, attach]);

  function selectAnswer(questionId: number, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 text-left shadow-card md:p-8">
      <EyebrowLabel>{VALUES_ASSESSMENT_COPY.eyebrow}</EyebrowLabel>
      <div className="mt-2 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          {VALUES_ASSESSMENT_COPY.title}
        </h2>
        <span className="shrink-0 text-sm font-medium text-muted-foreground">
          {Object.keys(answers).length} / {VALUES_QUESTIONS.length}
        </span>
      </div>
      <p className="mt-3 text-sm leading-[1.75] text-muted-foreground">
        {VALUES_ASSESSMENT_COPY.body}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="muted">{VALUES_ASSESSMENT_COPY.timeBadge}</Badge>
        <Badge variant="muted">선택 사항 — 건너뛰어도 신청할 수 있어요</Badge>
      </div>

      <div className="mt-6 space-y-8">
        {VALUES_CATEGORIES.map((category, categoryIndex) => (
          <div key={category.key}>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-deep">
              0{categoryIndex + 1} {category.title}
            </p>
            <div className="mt-3 space-y-4">
              {VALUES_QUESTIONS.filter((q) => q.category === category.key).map((question) => (
                <div
                  key={question.id}
                  className="rounded-2xl border border-border bg-background p-4"
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

      {result ? (
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-sm font-semibold text-foreground">{VALUES_ASSESSMENT_COPY.resultTitle}</p>
          <p className="mt-1 text-sm leading-[1.75] text-muted-foreground">
            {VALUES_ASSESSMENT_COPY.resultIntro}
          </p>

          <div className="mt-5 space-y-4">
            {VALUES_CATEGORIES.map((category) => {
              const pole = result.styles[category.key];
              const style = STYLE_COPY[category.key][pole];
              return (
                <div key={category.key} className="rounded-2xl border border-border bg-background p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-deep">
                    {category.title}
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground">{style.name}</p>
                  <p className="mt-1.5 text-sm leading-[1.7] text-muted-foreground">
                    {style.description}
                  </p>
                  <p className="mt-3 rounded-xl bg-primary-soft p-3 text-sm leading-[1.7] text-primary-deep">
                    <span className="font-semibold">{VALUES_ASSESSMENT_COPY.partnerHeading}</span>{" "}
                    — {style.partnerSuggestion}
                  </p>
                </div>
              );
            })}
          </div>

          <label className="mt-6 flex items-start gap-2.5 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={attach}
              onChange={(e) => setAttach(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span>
              <span className="font-medium text-foreground">이 결과를 신청서에 함께 보낼게요.</span>{" "}
              {attach ? VALUES_ASSESSMENT_COPY.savedNote : VALUES_ASSESSMENT_COPY.discardedNote}
            </span>
          </label>
        </div>
      ) : null}
    </div>
  );
}
