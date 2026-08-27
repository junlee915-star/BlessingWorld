import { Plus, Trash2 } from "lucide-react";

import { DEFAULT_PASS_SCORE, type QuizQuestion } from "@/content/curriculum";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface QuizEditorProps {
  questions: QuizQuestion[];
  passScore?: number;
  onChange: (questions: QuizQuestion[]) => void;
  onPassScoreChange: (passScore: number) => void;
}

function makeEmptyQuestion(): QuizQuestion {
  return { q: "", choices: ["", ""], answer: 0 };
}

// 강좌 확인 퀴즈 편집기 — 문항이 하나도 없으면 방문자에게는 퀴즈 없이 '다 들었어요'만 보입니다.
export function QuizEditor({ questions, passScore, onChange, onPassScoreChange }: QuizEditorProps) {
  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    onChange(questions.map((question, i) => (i === index ? { ...question, ...patch } : question)));
  }

  function updateChoice(questionIndex: number, choiceIndex: number, value: string) {
    const question = questions[questionIndex];
    const choices = question.choices.map((choice, i) => (i === choiceIndex ? value : choice));
    updateQuestion(questionIndex, { choices });
  }

  return (
    <div className="rounded-xl border border-dashed border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">
          확인 퀴즈{" "}
          <span className="font-normal text-muted-foreground">
            ({questions.length}문항 · 비우면 퀴즈 없이 이수 처리)
          </span>
        </h3>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          통과 기준(%)
          <input
            type="number"
            min={0}
            max={100}
            value={passScore ?? DEFAULT_PASS_SCORE}
            onChange={(e) => onPassScoreChange(Number(e.target.value) || DEFAULT_PASS_SCORE)}
            className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </div>

      <div className="mt-4 space-y-4">
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-start gap-2">
              <input
                className={inputClass}
                value={question.q}
                onChange={(e) => updateQuestion(questionIndex, { q: e.target.value })}
                placeholder={`${questionIndex + 1}번 문항`}
              />
              <button
                type="button"
                aria-label="문항 삭제"
                onClick={() => onChange(questions.filter((_, i) => i !== questionIndex))}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {question.choices.map((choice, choiceIndex) => (
                <div key={choiceIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`answer-${questionIndex}-${question.q}`}
                    checked={question.answer === choiceIndex}
                    onChange={() => updateQuestion(questionIndex, { answer: choiceIndex })}
                    aria-label={`${choiceIndex + 1}번 보기를 정답으로`}
                    className="h-4 w-4 shrink-0 border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <input
                    className={inputClass}
                    value={choice}
                    onChange={(e) => updateChoice(questionIndex, choiceIndex, e.target.value)}
                    placeholder={`보기 ${choiceIndex + 1}`}
                  />
                  {question.choices.length > 2 ? (
                    <button
                      type="button"
                      aria-label="보기 삭제"
                      onClick={() =>
                        updateQuestion(questionIndex, {
                          choices: question.choices.filter((_, i) => i !== choiceIndex),
                          answer: question.answer >= choiceIndex ? Math.max(0, question.answer - 1) : question.answer,
                        })
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateQuestion(questionIndex, { choices: [...question.choices, ""] })
                }
                className="text-xs font-medium text-primary-deep hover:underline"
              >
                + 보기 추가
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              라디오 버튼으로 정답 보기를 지정하세요.
            </p>
          </div>
        ))}

        <button
          type="button"
          onClick={() => onChange([...questions, makeEmptyQuestion()])}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary-deep"
        >
          <Plus className="h-4 w-4" /> 문항 추가
        </button>
      </div>
    </div>
  );
}
