import { SEO } from "@/components/common/SEO";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { IntroTriad } from "@/components/home/IntroTriad";
import { HomeCtaSection } from "@/components/home/HomeCtaSection";
import { FeatureCardGrid } from "@/components/home/FeatureCardGrid";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "블레싱월드",
  url: "https://blessingworld.example/",
  description:
    "세계평화통일가정연합 한국협회 가정행복지원국 축복가정부가 운영하는 축복결혼·가정생활 통합 안내 서비스",
};

export default function Home() {
  return (
    <>
      <SEO path="/" jsonLd={[ORGANIZATION_JSON_LD]} />
      <HeroCarousel />
      <IntroTriad />
      <FeatureCardGrid />
      <HomeCtaSection />
    </>
  );
}
