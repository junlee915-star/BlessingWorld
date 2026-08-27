import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { IntroTriad } from "@/components/home/IntroTriad";
import { HomeCtaSection } from "@/components/home/HomeCtaSection";
import { FeatureCardGrid } from "@/components/home/FeatureCardGrid";
import { StatBand } from "@/components/home/StatBand";
import { RoadmapPreview } from "@/components/home/RoadmapPreview";
import { TrustBadges } from "@/components/guide/TrustBadges";
import { useAuth } from "@/lib/auth";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "블레싱월드",
  url: "https://blessingworld.example/",
  description:
    "세계평화통일가정연합 한국협회 가정행복국 축복가정부가 운영하는 축복결혼·가정생활 통합 안내 서비스",
};

export default function Home() {
  // §10 I-10 — 기존 준비자(U-2)가 로그인 후 홈에 재방문했을 때 돌아갈 동선이 없었습니다.
  // 로그인 상태에서만 노출되는 조용한 진입점을 추가합니다(비로그인 방문자는 그대로 헤더의
  // "로그인"만 봅니다).
  const { session } = useAuth();

  return (
    <>
      <SEO path="/" jsonLd={[ORGANIZATION_JSON_LD]} />
      <HeroCarousel />
      {session ? (
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-5 py-3 md:px-8">
            <Link
              to="/mypage"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-deep hover:underline"
            >
              내 준비 현황 보기 <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : null}
      {/* 6축 개편 §4.1 — 듀오식 4블록 순서: 감정(히어로·인트로) → 숫자(StatBand)
          → 방법론(5축 카드·로드맵) → 안심(신뢰 배지) → 전환(CTA 밴드). */}
      <IntroTriad />
      <StatBand />
      <FeatureCardGrid />
      <RoadmapPreview />
      <section className="bg-muted/60 py-12">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <TrustBadges className="justify-center" />
        </div>
      </section>
      <HomeCtaSection />
    </>
  );
}
