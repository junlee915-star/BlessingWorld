import { useEffect, useState } from "react";
import { Printer, Trash2 } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { ParentsSiblingLinks } from "@/components/parents/ParentsSiblingLinks";
import { ParentsFinalCta } from "@/components/parents/ParentsFinalCta";
import { PLAN_SHEET_COPY, PLAN_SHEET_HERO, PLAN_SHEET_SECTIONS } from "@/content/parentsPlanSheet";
import {
  clearPlanSheetAnswers,
  getPlanSheetAnswers,
  savePlanSheetAnswers,
  type PlanSheetAnswers,
} from "@/lib/parentsPlanSheet";

// 매칭플랜 시트 `/parents/plan-sheet` — §14 개선안 P-12 ②, AC-25·AC-26.
// 부모와 자녀가 각자 채워보는 워크시트. 서버 전송 없이 이 기기의 localStorage에만
// 저장하고, 인쇄 시 두 열이 그대로 유지됩니다(@media print — Tailwind print: variant).
export default function ParentsPlanSheet() {
  const [answers, setAnswers] = useState<PlanSheetAnswers>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAnswers(getPlanSheetAnswers());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) savePlanSheetAnswers(answers);
  }, [answers, loaded]);

  function updateAnswer(questionId: string, who: "parent" | "child", value: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { parent: prev[questionId]?.parent ?? "", child: prev[questionId]?.child ?? "", [who]: value },
    }));
  }

  function handleClear() {
    if (typeof window !== "undefined" && !window.confirm(PLAN_SHEET_COPY.clearConfirm)) return;
    setAnswers({});
    clearPlanSheetAnswers();
  }

  return (
    <>
      <SEO
        path="/parents/plan-sheet"
        title="매칭플랜 시트 — 부모와 함께"
        description="부모와 자녀가 각자 채워보고 서로 다른 생각을 확인하는 워크시트. 입력 내용은 이 기기에만 저장됩니다."
      />

      <section className="mx-auto max-w-3xl px-5 pb-8 pt-16 text-center md:px-8 md:pt-24 print:pt-4">
        <EyebrowLabel>{PLAN_SHEET_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 text-[26px] font-bold leading-[1.4] text-foreground md:text-[36px]">
          {PLAN_SHEET_HERO.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.8] text-muted-foreground md:text-base">
          {PLAN_SHEET_HERO.body}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <Button type="button" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" aria-hidden="true" />
            {PLAN_SHEET_COPY.printCta}
          </Button>
          <Button type="button" variant="outline" onClick={handleClear} className="gap-2">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {PLAN_SHEET_COPY.clearCta}
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground print:hidden">{PLAN_SHEET_COPY.privacyNote}</p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-16 md:px-8 md:pb-24 print:px-0">
        <div className="mb-4 hidden grid-cols-[1fr_1fr_1fr] gap-4 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid print:grid">
          <span />
          <span>{PLAN_SHEET_COPY.parentColumn}</span>
          <span>{PLAN_SHEET_COPY.childColumn}</span>
        </div>

        <div className="space-y-8">
          {PLAN_SHEET_SECTIONS.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card print:break-inside-avoid print:border-none print:p-0 print:shadow-none"
            >
              <p className="eyebrow text-accent-deep">{section.title}</p>
              <div className="mt-4 space-y-6">
                {section.questions.map((question) => (
                  <div
                    key={question.id}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr] sm:items-start print:grid-cols-[1fr_1fr_1fr]"
                  >
                    <p className="text-sm font-medium text-foreground sm:pt-2">{question.label}</p>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-muted-foreground sm:hidden">
                        {PLAN_SHEET_COPY.parentColumn}
                      </span>
                      <textarea
                        value={answers[question.id]?.parent ?? ""}
                        onChange={(e) => updateAnswer(question.id, "parent", e.target.value)}
                        placeholder={question.placeholder}
                        rows={2}
                        className="w-full rounded-lg border border-input bg-background p-2.5 text-sm leading-[1.6] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring print:border-border print:p-1"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-muted-foreground sm:hidden">
                        {PLAN_SHEET_COPY.childColumn}
                      </span>
                      <textarea
                        value={answers[question.id]?.child ?? ""}
                        onChange={(e) => updateAnswer(question.id, "child", e.target.value)}
                        placeholder={question.placeholder}
                        rows={2}
                        className="w-full rounded-lg border border-input bg-background p-2.5 text-sm leading-[1.6] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring print:border-border print:p-1"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">{PLAN_SHEET_COPY.footnote}</p>
      </section>

      <div className="print:hidden">
        <ParentsSiblingLinks current="plan-sheet" />
        <ParentsFinalCta />
      </div>
    </>
  );
}
