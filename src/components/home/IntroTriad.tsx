import { INTRO_TRIAD } from "@/content/home";

export function IntroTriad() {
  return (
    <section className="bg-primary-soft">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        {/* 시각적으로는 별도 섹션 타이틀이 없지만(§4.1 디자인), 헤딩 순서는
            h1(히어로) → h2(섹션) → h3(카드)로 끊김 없이 이어져야 합니다(§9.1 heading-order).
            sr-only h2로 스크린리더 사용자에게만 섹션 경계를 알립니다. */}
        <h2 className="sr-only">축복결혼 소개</h2>
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
