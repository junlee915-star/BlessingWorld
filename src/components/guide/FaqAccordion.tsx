import { useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FAQ_ITEMS } from "@/content/faq";
import { FAQ_SECTION_HEADING } from "@/content/guide";

const VISIBLE_DEFAULT = 5;

export function FaqAccordion() {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = Math.max(FAQ_ITEMS.length - VISIBLE_DEFAULT, 0);
  const visibleItems = expanded ? FAQ_ITEMS : FAQ_ITEMS.slice(0, VISIBLE_DEFAULT);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeading
        align="center"
        eyebrow={FAQ_SECTION_HEADING.eyebrow}
        title={FAQ_SECTION_HEADING.title}
        className="mx-auto"
      />

      <div className="mx-auto mt-10 max-w-2xl">
        <Accordion type="single" collapsible defaultValue="faq-0">
          {visibleItems.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <p>{item.answer}</p>
                {item.isDraft ? (
                  <p className="mt-2 text-xs text-muted-foreground/70">
                    ※ 담당자 확인 전 초안 답변입니다.
                  </p>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {hiddenCount > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mx-auto mt-6 flex items-center gap-1.5 text-sm font-semibold text-primary-deep hover:underline"
          >
            {expanded ? "질문 접기" : `질문 더 보기 (${hiddenCount})`}
            <ChevronDown className={expanded ? "h-4 w-4 rotate-180 transition-transform" : "h-4 w-4 transition-transform"} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
