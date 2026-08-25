import { SEO } from "@/components/common/SEO";
import { TERMS_ARTICLES } from "@/content/terms";

export default function Terms() {
  return (
    <>
      <SEO path="/terms" />
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <h1 className="text-[28px] font-bold leading-[1.3] text-foreground md:text-[36px]">
          이용약관
        </h1>

        <nav aria-label="목차" className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {TERMS_ARTICLES.map((article) => (
            <a
              key={article.title}
              href={`#${article.title}`}
              className="text-primary-deep hover:underline"
            >
              {article.title}
            </a>
          ))}
        </nav>

        <div className="mt-8 divide-y divide-border border-t border-border">
          {TERMS_ARTICLES.map((article) => (
            <section key={article.title} id={article.title} className="scroll-mt-24 py-6">
              <h2 className="text-lg font-semibold text-foreground">{article.title}</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-[1.8] text-muted-foreground">
                {article.body}
              </p>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
