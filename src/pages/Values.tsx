import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { ValuesAssessmentSection } from "@/components/apply/ValuesAssessmentSection";
import { VALUES_ASSESSMENT_COPY } from "@/content/valuesAssessment";

// 가치관 진단 `/values` — GNB 6번째 항목. 축복상담 신청과는 별개로, 누구나 부담 없이
// 자신의 성향과 잘 맞는 상대 스타일을 확인해볼 수 있는 단독 페이지입니다.
export default function Values() {
  return (
    <>
      <SEO path="/values" />

      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center md:px-8 md:py-24">
        <EyebrowLabel>{VALUES_ASSESSMENT_COPY.eyebrow}</EyebrowLabel>
        <h1 className="mt-3 text-2xl font-bold text-foreground md:text-[32px]">
          {VALUES_ASSESSMENT_COPY.title}
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
          {VALUES_ASSESSMENT_COPY.body}
        </p>

        <div className="mt-10 flex w-full justify-center">
          <ValuesAssessmentSection variant="standalone" />
        </div>
      </section>
    </>
  );
}
