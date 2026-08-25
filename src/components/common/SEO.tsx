import { Helmet } from "react-helmet-async";

import { OG_IMAGE_URL, ROUTE_SEO, SEO_DEFAULTS } from "@/content/seo";

interface SEOProps {
  path: string;
  jsonLd?: Record<string, unknown>[];
  /** 검색엔진에 노출하지 않을 페이지(예: /admin/*)에 true로 전달하세요. */
  noindex?: boolean;
}

export function SEO({ path, jsonLd, noindex }: SEOProps) {
  const route = ROUTE_SEO[path] ?? SEO_DEFAULTS;
  const title = route.title;
  const description = route.description;
  const ogTitle = route.ogTitle ?? title;
  const ogDescription = route.ogDescription ?? description;

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
