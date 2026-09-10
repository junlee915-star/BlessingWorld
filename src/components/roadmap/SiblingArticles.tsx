import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { getRoadmapSiblingPages } from "@/content/roadmapDetail";

interface SiblingArticlesProps {
  stage: string;
  slug: string;
}

// 같은 단계의 다른 상세 페이지 목록 — §14 개선안 P-11(AC-22). 참조 사이트의
// "이 카테고리의 다른 기사" 패턴입니다.
export function SiblingArticles({ stage, slug }: SiblingArticlesProps) {
  const siblings = getRoadmapSiblingPages(stage, slug);
  if (siblings.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl border-t border-border px-5 py-12 md:px-8">
      <p className="eyebrow text-accent-deep">이 단계의 다른 페이지</p>
      <ul className="mt-5 space-y-3">
        {siblings.map((page) => (
          <li key={page.slug}>
            <Link
              to={`/roadmap/${page.stage}/${page.slug}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary-soft/40"
            >
              {page.navLabel}
              <ArrowRight className="h-4 w-4 shrink-0 text-primary-deep" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
