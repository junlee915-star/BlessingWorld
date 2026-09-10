import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { ArticleSections } from "@/components/common/ArticleSections";
import { ParentsSiblingLinks } from "@/components/parents/ParentsSiblingLinks";
import { ParentsFinalCta } from "@/components/parents/ParentsFinalCta";
import { PARENTS_TALKING_ARTICLE } from "@/content/parents";

// 자녀와 축복을 이야기하는 법 `/parents/talking` — §14 개선안 P-12.
export default function ParentsTalking() {
  return (
    <>
      <SEO
        path="/parents/talking"
        title="자녀와 축복을 이야기하는 법 — 부모와 함께"
        description="자녀에게 축복을 어떻게 말을 꺼내야 할지 막막한 부모님을 위한 대화법을 안내합니다."
      />

      <section className="mx-auto max-w-3xl px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <EyebrowLabel>{PARENTS_TALKING_ARTICLE.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 whitespace-pre-line text-[26px] font-bold leading-[1.4] text-foreground md:text-[36px]">
          {PARENTS_TALKING_ARTICLE.title}
        </h1>
        <p className="mt-5 text-[15px] leading-[1.85] text-muted-foreground md:text-base">
          {PARENTS_TALKING_ARTICLE.intro}
        </p>
      </section>

      <div className="pb-16 md:pb-24">
        <ArticleSections sections={PARENTS_TALKING_ARTICLE.sections} />
      </div>

      <ParentsSiblingLinks current="talking" />
      <ParentsFinalCta />
    </>
  );
}
