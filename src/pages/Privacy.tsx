import { SEO } from "@/components/common/SEO";
import { PRIVACY_CONTACT, PRIVACY_INTRO, PRIVACY_SECTIONS } from "@/content/privacy";

export default function Privacy() {
  return (
    <>
      <SEO path="/privacy" />
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <h1 className="text-[28px] font-bold leading-[1.3] text-foreground md:text-[36px]">
          블레싱월드 개인정보처리방침
        </h1>
        <p className="mt-5 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
          {PRIVACY_INTRO}
        </p>

        <div className="mt-10 divide-y divide-border border-t border-border">
          {PRIVACY_SECTIONS.map((section) => (
            <section key={section.title} className="py-6">
              <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-[1.8] text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">{PRIVACY_CONTACT}</p>
      </section>
    </>
  );
}
