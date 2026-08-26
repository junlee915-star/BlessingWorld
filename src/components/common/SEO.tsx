import { Helmet } from "react-helmet-async";

import { OG_IMAGE_URL, ROUTE_SEO, SEO_DEFAULTS } from "@/content/seo";

interface SEOProps {
  path: string;
  jsonLd?: Record<string, unknown>[];
  /** 검색엔진에 노출하지 않을 페이지(예: /admin/*)에 true로 전달하세요. */
  noindex?: boolean;
  /**
   * `/stories/:slug`처럼 경로만으로 메타를 결정할 수 없는 동적 페이지용 오버라이드.
   * ROUTE_SEO 조회 결과보다 우선합니다.
   */
  title?: string;
  description?: string;
}

export function SEO({ path, jsonLd, noindex, title: titleOverride, description: descriptionOverride }: SEOProps) {
  const route = ROUTE_SEO[path] ?? SEO_DEFAULTS;
  const title = titleOverride ?? route.title;
  const description = descriptionOverride ?? route.description;
  const ogTitle = titleOverride ?? route.ogTitle ?? title;
  const ogDescription = descriptionOverride ?? route.ogDescription ?? description;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={OG_IMAGE_URL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <link rel="canonical" href={`https://blessingworld.example${path}`} />
      {jsonLd?.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}
