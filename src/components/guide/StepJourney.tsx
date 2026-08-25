import { Link } from "react-router-dom";

import { SectionHeading } from "@/components/common/SectionHeading";
import { STEP_JOURNEY } from "@/content/guide";

export function StepJourney() {
  return (
    <section className="bg-muted/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow={STEP_JOURNEY.eyebrow}
          title={STEP_JOURNEY.title}
          description={STEP_JOURNEY.lead}
        />

        <div className="mt-12 space-y-14">
          {STEP_JOURNEY.groups.map((group, groupIndex) => (
            <div key={group.label}>
              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-sm font-bold text-primary">{group.label}</span>
                <h3 className="text-xl font-bold text-foreground">{group.title}</h3>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {group.description}
                </span>
              </div>

              <div className="relative border-l border-border pl-8 sm:pl-10">
                {group.steps.map((step, stepIndex) => (
                  <div
                    key={step.no}
                    className="animate-fade-in-up relative pb-10 last:pb-0"
                    style={{
                      animationDelay: `${(groupIndex * 2 + stepIndex) * 80}ms`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-[41px] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-background text-xs font-bold text-primary sm:-left-[49px]"
                    >
                      {step.no}
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-2 top-0 select-none text-[44px] font-bold leading-none text-primary/10 sm:text-[56px]"
                    >
                      {step.no}
                    </span>
                    <div className="relative rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
                      <h4 className="text-base font-semibold text-foreground">{step.title}</h4>
                      <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">
                        {step.description}
                      </p>
                      {step.to ? (
                        <Link
                          to={step.to.href}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-deep hover:underline"
                        >
                          {step.to.label} →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
