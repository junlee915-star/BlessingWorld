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
              <h3 className="mt-2 text-xl font-semibold leading-[1.4] text-foreground">
                {item.title}
              </h3>
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
