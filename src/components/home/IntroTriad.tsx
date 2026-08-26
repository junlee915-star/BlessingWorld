import { INTRO_TRIAD } from "@/content/home";

export function IntroTriad() {
  return (
    <section className="bg-primary-soft">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {INTRO_TRIAD.map((item, index) => (
            <article
              key={item.eyebrow}
              className="animate-fade-in-up rounded-xl bg-white p-7 shadow-card"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-deep text-xs font-bold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="eyebrow mt-5 text-primary-deep">{item.eyebrow}</p>
              {/* 이 섹션엔 별도 SectionHeading(h2)이 없어 카드 제목이 사실상 첫 하위 제목입니다 —
                  h1(히어로) 바로 다음이라 h3로 건너뛰면 안 됩니다(§9.1 heading-order, Lighthouse 실측). */}
              <h2 className="mt-2 text-xl font-semibold leading-[1.4] text-foreground">
                {item.title}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.75] text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
