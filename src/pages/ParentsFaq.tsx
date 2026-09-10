import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { ParentsSiblingLinks } from "@/components/parents/ParentsSiblingLinks";
import { ParentsPrincipleBand } from "@/components/parents/ParentsPrincipleBand";
import { ParentsFinalCta } from "@/components/parents/ParentsFinalCta";
import { PARENTS_FAQ_HERO, PARENTS_FAQ_ITEMS } from "@/content/parentsFaq";

// 부모용 FAQ `/parents/faq` — §14 개선안 P-12 ③. 초행자 FAQ(/guide)와는 별도 콘텐츠로,
// 안심형 짧은 답변이 아니라 실무 조언 위주의 장문 서술형 답변을 씁니다.
export default function ParentsFaq() {
  return (
    <>
      <SEO
        path="/parents/faq"
        title="부모용 FAQ — 부모와 함께"
        description="자녀의 축복을 준비하는 부모님들이 실제로 물어보신 질문에 자세히 답합니다."
      />

      <section className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-10 pt-16 text-center md:px-8 md:pt-24">
        <EyebrowLabel>{PARENTS_FAQ_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 text-[26px] font-bold leading-[1.4] text-foreground md:text-[36px]">
          {PARENTS_FAQ_HERO.title}
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-[1.8] text-muted-foreground md:text-base">
          {PARENTS_FAQ_HERO.body}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-16 md:px-8 md:pb-24">
        <Accordion type="single" collapsible className="space-y-3">
          {PARENTS_FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={`pfaq-${index}`}
              className="rounded-2xl border border-border bg-card px-5 shadow-card last:border-b"
            >
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent>
                <p className="leading-[1.85]">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <ParentsSiblingLinks current="faq" />
      <ParentsPrincipleBand />
      <ParentsFinalCta />
    </>
  );
}
