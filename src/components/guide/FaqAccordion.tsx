import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { FaqItem } from "@/content/faq";
import { FAQ_SECTION_HEADING } from "@/content/guide";

interface FaqAccordionProps {
  /** §pages/Guide.tsx가 fetchPublishedFaqs()로 미리 가져와 JSON-LD 생성과 함께 씁니다. */
  items: FaqItem[] | null;
}

export function FaqAccordion({ items: faqs }: FaqAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  // §admin/faq의 "기본 노출" 체크 여부(is_default_visible)로 나눕니다 — 고정된 개수(예: 5개)가
  // 아니라 관리자가 직접 고른 항목만 항상 보이고, 나머지는 "질문 더 보기" 뒤에 숨습니다(AC-06).
  const { visibleItems, hiddenItems } = useMemo(() => {
    const all = faqs ?? [];
    return {
      visibleItems: all.filter((item) => item.isDefaultVisible),
      hiddenItems: all.filter((item) => !item.isDefaultVisible),
    };
  }, [faqs]);

  const items = expanded ? [...visibleItems, ...hiddenItems] : visibleItems;

  if (faqs !== null && faqs.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeading
        align="center"
        eyebrow={FAQ_SECTION_HEADING.eyebrow}
        title={FAQ_SECTION_HEADING.title}
        className="mx-auto"
      />

      <div className="mx-auto mt-10 max-w-3xl">
        <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-3">
          {items.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={`faq-${index}`}
              // AccordionItem 기본 클래스의 last:border-b-0이 마지막 카드의 아래 테두리를 지우므로
              // last:border-b로 되돌립니다(행 구분선이 아니라 카드 테두리라서 필요합니다).
              className="rounded-2xl border border-border bg-card px-5 shadow-card last:border-b"
            >
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {hiddenItems.length > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mx-auto mt-8 flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary-deep transition-colors hover:border-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {expanded ? "질문 접기" : `질문 더 보기 (${hiddenItems.length})`}
            <ChevronDown className={expanded ? "h-4 w-4 rotate-180 transition-transform" : "h-4 w-4 transition-transform"} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
