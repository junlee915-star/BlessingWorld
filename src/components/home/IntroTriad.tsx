import { INTRO_TRIAD } from "@/content/home";

export function IntroTriad() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {INTRO_TRIAD.map((item, index) => (
          <article
            key={item.eyebrow}
            className="animate-fade-in-up border-t border-foreground/80 pt-4"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <p className="eyebrow text-primary-deep">{item.eyebrow}</p>
            <h3 className="mt-5 text-xl font-semibold leading-[1.4] text-foreground">
              {item.title}
            </h3>
            <p className="mt-3 max-w-prose text-[15px] leading-[1.75] text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
