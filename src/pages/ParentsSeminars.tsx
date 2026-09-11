import { CalendarDays } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { ParentsSiblingLinks } from "@/components/parents/ParentsSiblingLinks";
import { ParentsFinalCta } from "@/components/parents/ParentsFinalCta";
import { CONTACT_HOURS, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/content/footer";

// 부모 세미나 일정 `/parents/seminars` — §14 개선안 P-12 ⑤.
// 부모 세미나 일정 원천 데이터가 아직 없어(§14.9 P0 범위), 신뢰를 잃지 않도록 §14.7 원칙
// ("미확보 항목은 '준비 중'으로 표기")에 따라 안내형 자리표시 화면으로 둡니다.
export default function ParentsSeminars() {
  return (
    <>
      <SEO
        path="/parents/seminars"
        title="부모 세미나 일정 — 부모와 함께"
        description="부모님을 위한 설명회·세미나 일정 안내 — 현재 준비 중입니다."
      />

      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center md:px-8 md:py-24">
        <EyebrowLabel>PARENTS SEMINARS</EyebrowLabel>
        <span
          aria-hidden="true"
          className="mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary-deep"
        >
          <CalendarDays className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-foreground md:text-[32px]">
          부모 세미나 일정, 준비 중입니다
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
          부모님을 위한 설명회·세미나 일정을 이곳에 안내해 드릴 예정입니다. 지금 예정된 일정이
          궁금하시면 대표 전화로 문의해주세요.
        </p>
        <a
          href={CONTACT_PHONE_TEL}
          className="mt-6 text-lg font-semibold text-primary-deep hover:underline"
        >
          {CONTACT_PHONE_DISPLAY}
        </a>
        <p className="mt-1 text-sm text-muted-foreground">{CONTACT_HOURS}</p>
      </section>

      <ParentsSiblingLinks current="seminars" />
      <ParentsFinalCta />
    </>
  );
}
