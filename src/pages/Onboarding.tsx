import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { TrustBadges } from "@/components/guide/TrustBadges";
import { Button } from "@/components/ui/button";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/content/footer";

// §6 P-07 ⭐ 전환 핵심. 5단계 위저드(성별→출생연도→지역→연락처→완료)와
// Supabase 제출 로직은 §11 M3 범위입니다. 이번 M1+M2 범위에서는 헤더 카피와
// 임시 연결 경로(전화 문의)만 제공해, 전환 동선이 완전히 끊기지 않도록 합니다.
export default function Onboarding() {
  return (
    <>
      <SEO path="/onboarding" />

      <section className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center px-5 py-24 text-center md:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
          <Sparkles className="h-8 w-8" aria-hidden="true" />
        </span>
        <EyebrowLabel className="mt-6">처음 오셨나요?</EyebrowLabel>
        <h1 className="mt-3 text-2xl font-bold text-foreground md:text-[32px]">처음 오셨나요?</h1>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
          간단히 알려주시면, 편안하게 안내해 드릴게요. 축복결혼이 처음이신 분을 위한 안내
          신청 화면을 준비하고 있어요. 이름과 연락처만으로 시작하는 온라인 신청 폼은 곧
          열립니다 — 지금은 전화로 먼저 안내받으실 수 있어요.
        </p>

        <Button asChild size="lg" className="mt-8">
          <a href={CONTACT_PHONE_TEL}>{CONTACT_PHONE_DISPLAY} 로 안내받기</a>
        </Button>

        <TrustBadges className="mt-10 justify-center" />

        <Link to="/guide" className="mt-10 text-sm font-medium text-primary-deep hover:underline">
          축복결혼 더 알아보기 →
        </Link>
      </section>
    </>
  );
}
