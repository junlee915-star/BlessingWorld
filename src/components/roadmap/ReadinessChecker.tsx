import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { DOCUMENT_CATEGORIES } from "@/content/documents";
import { READINESS } from "@/content/roadmap";
import { cn } from "@/lib/utils";

// 듀오의 "나의 가입비 알아보기"를 금액 대신 준비 상태 계산으로 치환한 위젯(6축 개편 §4.5).
// 서버에 아무것도 보내지 않고, 저장도 하지 않습니다 — 서류 목록은 개인정보가 아니지만
// "무엇이 없는지"는 민감할 수 있어 브라우저 메모리에만 둡니다.
export function ReadinessChecker() {
  const [categoryId, setCategoryId] = useState(DOCUMENT_CATEGORIES[0]?.id ?? "");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const category = useMemo(
    () => DOCUMENT_CATEGORIES.find((item) => item.id === categoryId) ?? DOCUMENT_CATEGORIES[0],
    [categoryId],
  );

  const items = category?.items ?? [];
  const doneCount = items.filter((item) => checked[`${category?.id}:${item.no}`]).length;
  const total = items.length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const remaining = items.filter((item) => !checked[`${category?.id}:${item.no}`]);

  return (
    <section className="bg-muted/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow={READINESS.eyebrow}
          title={READINESS.title}
          description={READINESS.body}
        />

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="축복후보자 유형">
          {DOCUMENT_CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === categoryId}
              onClick={() => {
                setCategoryId(item.id);
                setChecked({});
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                item.id === categoryId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/80 hover:bg-primary-soft",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <ul className="space-y-1">
              {items.map((item) => {
                const key = `${category?.id}:${item.no}`;
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5 transition hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={Boolean(checked[key])}
                        onChange={(event) =>
                          setChecked((prev) => ({ ...prev, [key]: event.target.checked }))
                        }
                        className="mt-1 h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <span className="text-sm leading-[1.7] text-foreground">
                        <span className="mr-2 font-semibold text-muted-foreground">{item.no}</span>
                        {item.title}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="h-max rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <p className="eyebrow text-accent-deep">READY</p>
            <p className="mt-3 text-[40px] font-bold leading-none tabular-nums text-primary">
              {doneCount}
              <span className="text-xl text-muted-foreground">/{total}</span>
            </p>
            <div
              className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="서류 준비도"
            >
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            {remaining.length > 0 ? (
              <>
                <p className="mt-5 text-sm font-semibold text-foreground">아직 남은 서류</p>
                <ul className="mt-2 space-y-1.5 text-sm leading-[1.6] text-muted-foreground">
                  {remaining.slice(0, 5).map((item) => (
                    <li key={item.no}>· {item.title}</li>
                  ))}
                  {remaining.length > 5 ? <li>· 외 {remaining.length - 5}건</li> : null}
                </ul>
              </>
            ) : (
              <p className="mt-5 text-sm leading-[1.7] text-foreground">
                필요한 서류를 모두 체크하셨어요. 심사기준까지 한 번 더 확인해보세요.
              </p>
            )}

            <Button asChild variant="outline" className="mt-5 w-full">
              <Link to="/center/documents">심사기준 자세히 보기</Link>
            </Button>
            <p className="mt-3 text-xs leading-[1.6] text-muted-foreground">
              {READINESS.privacyNote}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
