import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { ArticleSections } from "@/components/common/ArticleSections";
import { ComingSoon } from "@/components/common/ComingSoon";
import { Button } from "@/components/ui/button";
import { SiblingArticles } from "@/components/roadmap/SiblingArticles";
import { findRoadmapDetailPage } from "@/content/roadmapDetail";
import { ROADMAP_FINAL_CTA } from "@/content/roadmap";

// 로드맵 상세 페이지 `/roadmap/:stage/:slug` — §14 개선안 P-11.
// 06(심사)·07(매칭·약혼)·08(축복식) 카드에 눌러볼 것이 없던 문제를 해결합니다.
export default function RoadmapDetail() {
  const { stage, slug } = useParams();
  const page = stage && slug ? findRoadmapDetailPage(stage, slug) : null;

  if (!page) {
    return (
      <>
        <SEO path="/roadmap" title="페이지를 찾을 수 없어요 — 축복로드맵" noindex />
        <ComingSoon
          title="페이지를 찾을 수 없어요"
          description="주소가 바뀌었거나 아직 준비되지 않은 페이지일 수 있어요."
          backTo={{ label: "전체 로드맵 보기", to: "/roadmap" }}
        />
      </>
    );
  }

  return (
    <>
      <SEO path={`/roadmap/${page.stage}/${page.slug}`} />

      <section className="mx-auto max-w-3xl px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <Link
          to="/roadmap"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-deep hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          전체 로드맵 보기
        </Link>

        <EyebrowLabel className="mt-8">{page.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 text-[26px] font-bold leading-[1.4] text-foreground md:text-[36px]">
          {page.title}
        </h1>
        <p className="mt-5 text-[15px] leading-[1.85] text-muted-foreground md:text-base">
          {page.intro}
        </p>
      </section>

      <div className="pb-16 md:pb-24">
        <ArticleSections sections={page.sections} />
      </div>

      <SiblingArticles stage={page.stage} slug={page.slug} />

      <section className="bg-primary py-16 text-white md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8">
          <h2 className="text-2xl font-bold leading-[1.4] md:text-[30px]">
            {ROADMAP_FINAL_CTA.title}
          </h2>
          <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-white/80 md:text-base">
            {ROADMAP_FINAL_CTA.body}
          </p>
          <Button asChild variant="light" size="lg" className="mt-8">
            <Link to={ROADMAP_FINAL_CTA.cta.to}>{ROADMAP_FINAL_CTA.cta.label}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
