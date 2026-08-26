import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Flower2 } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EmptyState } from "@/components/common/EmptyState";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import {
  STORIES_CATEGORY_EMPTY_STATE,
  STORIES_EMPTY_STATE,
  STORIES_HERO,
  STORY_CATEGORIES,
  STORY_CATEGORY_LABELS,
  STORY_SORTS,
  type Story,
} from "@/content/stories";
import { fetchPublishedStories } from "@/lib/stories";
import { cn } from "@/lib/utils";

function formatPublishedDate(story: Story): string {
  const raw = story.publishedAt ?? story.createdAt;
  return new Date(raw).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default function Stories() {
  const [stories, setStories] = useState<Story[] | null>(null);
  const [category, setCategory] = useState<(typeof STORY_CATEGORIES)[number]["value"]>("all");
  const [sort, setSort] = useState<(typeof STORY_SORTS)[number]["value"]>("latest");

  useEffect(() => {
    let cancelled = false;
    fetchPublishedStories().then((data) => {
      if (!cancelled) setStories(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // §lib/stories.ts fetchPublishedStories()는 항상 최신순으로 돌려주므로, "조회 많은순"만
  // 다시 정렬하면 됩니다.
  const visibleStories = useMemo(() => {
    if (!stories) return [];
    const filtered = category === "all" ? stories : stories.filter((story) => story.category === category);
    if (sort === "views") {
      return [...filtered].sort((a, b) => b.viewCount - a.viewCount);
    }
    return filtered;
  }, [stories, category, sort]);

  const loading = stories === null;
  const hasAnyStories = (stories?.length ?? 0) > 0;

  return (
    <>
      <SEO path="/stories" />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
        <EyebrowLabel>{STORIES_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 text-[28px] font-bold leading-[1.3] text-foreground md:text-[40px]">
          {STORIES_HERO.title}
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground md:text-base">
          {STORIES_HERO.sub}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="스토리 카테고리">
            {STORY_CATEGORIES.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={category === item.value}
                onClick={() => setCategory(item.value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  category === item.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            정렬
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as (typeof STORY_SORTS)[number]["value"])}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {STORY_SORTS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-10">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground">불러오는 중이에요…</p>
          ) : !hasAnyStories ? (
            <EmptyState
              icon={Flower2}
              title={STORIES_EMPTY_STATE.title}
              description={STORIES_EMPTY_STATE.description}
              cta={STORIES_EMPTY_STATE.cta}
            />
          ) : visibleStories.length === 0 ? (
            <EmptyState
              icon={Flower2}
              title={STORIES_CATEGORY_EMPTY_STATE.title}
              description={STORIES_CATEGORY_EMPTY_STATE.description}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleStories.map((story) => (
                <Link
                  key={story.id}
                  to={`/stories/${story.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {story.coverImageUrl ? (
                      <img
                        src={story.coverImageUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-primary-soft">
                        <Flower2 className="h-10 w-10" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="inline-flex w-fit items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-deep">
                      {STORY_CATEGORY_LABELS[story.category]}
                    </span>
                    <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground">
                      {story.title}
                    </h3>
                    {story.excerpt ? (
                      <p className="line-clamp-3 text-sm leading-[1.7] text-muted-foreground">
                        {story.excerpt}
                      </p>
                    ) : null}
                    <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                      <span>
                        {story.familyName || story.region || "축복가정"} · {formatPublishedDate(story)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" /> {story.viewCount}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
