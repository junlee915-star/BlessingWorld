import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { ArticleSections } from "@/components/common/ArticleSections";
import { ParentsSiblingLinks } from "@/components/parents/ParentsSiblingLinks";
import { ParentsFinalCta } from "@/components/parents/ParentsFinalCta";
import { PARENTS_PREPARATION_ARTICLE } from "@/content/parents";

// 부모의 준비 `/parents/preparation` — §14 개선안 P-12.
export default function ParentsPreparation() {
  return (
    <>
      <SEO
        path="/parents/preparation"
        title="부모의 준비 — 부모와 함께"
        description="자녀의 축복을 앞두고 부모가 먼저 정리해두면 좋은 것들을 안내합니다."
      />

      <section className="mx-auto max-w-3xl px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <EyebrowLabel>{PARENTS_PREPARATION_ARTICLE.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 whitespace-pre-line text-[26px] font-bold leading-[1.4] text-foreground md:text-[36px]">
          {PARENTS_PREPARATION_ARTICLE.title}
        </h1>
        <p className="mt-5 text-[15px] leading-[1.85] text-muted-foreground md:text-base">
          {PARENTS_PREPARATION_ARTICLE.intro}
        </p>
      </section>

      <div className="pb-16 md:pb-24">
        <ArticleSections sections={PARENTS_PREPARATION_ARTICLE.sections} />
      </div>

      <ParentsSiblingLinks current="preparation" />
      <ParentsFinalCta />
    </>
  );
}
