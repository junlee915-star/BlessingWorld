import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_PASS_SCORE, QUIZ_COPY, type QuizQuestion } from "@/content/curriculum";
import { cn } from "@/lib/utils";

interface CourseQuizProps {
  questions: QuizQuestion[];
  passScore?: number;
  /** 통과했을 때 호출됩니다. 점수(%)를 함께 넘겨 이수 기록에 남깁니다. */
  onPass: (score: number) => void;
}

// 확인 퀴즈 — 평가가 아니라 학습 확인입니다(6축 개편 확정사항 5).
// 재응시 무제한, 점수는 저장만 하고 공개·랭킹은 하지 않습니다.
export function CourseQuiz({ questions, passScore = DEFAULT_PASS_SCORE, onPass }: CourseQuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [graded, setGraded] = useState<{ score: number; passed: boolean } | null>(null);

  const allAnswered = questions.every((_, index) => answers[index] !== undefined);

  function grade() {
    const correct = questions.reduce(
      (acc, question, index) => (answers[index] === question.answer ? acc + 1 : acc),
      0,
    );
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= passScore;
    setGraded({ score, passed });
    if (passed) onPass(score);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="text-xl font-bold text-foreground">{QUIZ_COPY.heading}</h2>
      <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">{QUIZ_COPY.lead}</p>

      <ol className="mt-6 space-y-6">
        {questions.map((question, index) => (
          <li key={`${index}-${question.q}`}>
            <fieldset>
              <legend className="text-sm font-semibold text-foreground">
                {index + 1}. {question.q}
              </legend>
              <div className="mt-3 grid gap-2">
                {question.choices.map((choice, choiceIndex) => {
                  const selected = answers[index] === choiceIndex;
                  const isAnswer = graded && question.answer === choiceIndex;
                  const isWrongPick = graded && selected && question.answer !== choiceIndex;
                  return (
                    <button
                      key={choice}
                      type="button"
                      aria-pressed={selected}
                      disabled={Boolean(graded)}
                      onClick={() => setAnswers((prev) => ({ ...prev, [index]: choiceIndex }))}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default",
                        selected && !graded
                          ? "border-primary bg-primary-soft text-primary-deep"
                          : "border-border text-foreground/85",
                        isAnswer && "border-success bg-success/10 text-foreground",
                        isWrongPick && "border-destructive bg-destructive/10 text-foreground",
                      )}
                    >
                      {isAnswer ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                      ) : isWrongPick ? (
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                      ) : null}
                      {choice}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <div aria-live="polite" className="mt-6">
        {graded ? (
          <p
            className={cn(
              "rounded-lg px-4 py-3 text-sm font-medium",
              graded.passed
                ? "bg-primary-soft text-primary-deep"
                : "bg-accent-soft text-accent-foreground",
            )}
          >
            {graded.passed ? QUIZ_COPY.passed : QUIZ_COPY.failed}
          </p>
        ) : null}
      </div>

      <div className="mt-4">
        {graded ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setAnswers({});
              setGraded(null);
            }}
          >
            {QUIZ_COPY.retry}
          </Button>
        ) : (
          <Button type="button" onClick={grade} disabled={!allAnswered}>
            {QUIZ_COPY.submit}
          </Button>
        )}
      </div>
    </section>
  );
}
