import { Info } from "lucide-react";

import type { DocumentCategory } from "@/content/documents";

export function DocumentChecklist({ category }: { category: DocumentCategory }) {
  return (
    <div>
      <div className="flex flex-col gap-1 border-b border-border pb-6">
        <p className="text-sm text-muted-foreground">
          {category.eligibility} · {category.effectiveDate} · {category.issuedBy}
        </p>
        <h3 className="text-lg font-bold text-foreground">{category.fullTitle}</h3>
      </div>

      <ol className="mt-8 space-y-4">
        {category.items.map((item) => (
          <li
            key={item.no}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:gap-5 sm:p-6"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-fit min-w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft px-2 text-xs font-bold text-primary-deep"
            >
              {item.no}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-semibold text-foreground">{item.title}</h4>
              <ul className="mt-2 space-y-1.5">
                {item.criteria.map((line, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm leading-[1.75] text-muted-foreground"
                  >
                    <span aria-hidden="true" className="text-primary/50">
                      ·
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              {item.note ? (
                <p className="mt-3 inline-flex items-start gap-1.5 rounded-lg bg-muted/70 px-3 py-2 text-xs text-foreground/70">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                  {item.note}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-2xl border border-accent/30 bg-accent-soft/40 p-5 sm:p-6">
        <p className="text-sm font-semibold text-accent-foreground">참고사항 (＊ 표시 항목 포함)</p>
        <ul className="mt-3 space-y-2">
          {category.footnotes.map((note, index) => (
            <li key={index} className="text-sm leading-[1.75] text-foreground/75">
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
