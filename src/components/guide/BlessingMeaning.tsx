import { Link } from "react-router-dom";

import { SectionHeading } from "@/components/common/SectionHeading";
import { BLESSING_MEANING } from "@/content/guide";

export function BlessingMeaning() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <SectionHeading
        eyebrow={BLESSING_MEANING.eyebrow}
        title={BLESSING_MEANING.title}
        description={BLESSING_MEANING.lead}
        align="center"
      />
      <ol className="mt-10 grid gap-5 md:grid-cols-3">
        {BLESSING_MEANING.points.map((point) => (
          <li
            key={point.no}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <span className="text-xs font-semibold tracking-wide text-primary-deep">STEP {point.no}</span>
            <h3 className="mt-3 whitespace-pre-line text-lg font-semibold leading-snug text-foreground">
              {point.title}
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-[1.8] text-muted-foreground">
              {point.description}
            </p>

            <div className="mt-5 flex gap-2">
              <Link
                to={`/guide/storybook/${point.no}/male`}
                className="flex-1 rounded-full border border-border px-3 py-2 text-center text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary-deep"
              >
                지호 이야기
              </Link>
              <Link
                to={`/guide/storybook/${point.no}/female`}
                className="flex-1 rounded-full border border-border px-3 py-2 text-center text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary-deep"
              >
                지우 이야기
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
