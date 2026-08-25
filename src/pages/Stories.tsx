import { useState } from "react";
import { Flower2 } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EmptyState } from "@/components/common/EmptyState";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { STORIES_EMPTY_STATE, STORIES_HERO, STORY_CATEGORIES, STORY_SORTS } from "@/content/stories";
import { cn } from "@/lib/utils";

export default function Stories() {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");

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
              onChange={(event) => setSort(event.target.value)}
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
          <EmptyState
            icon={Flower2}
            title={STORIES_EMPTY_STATE.title}
            description={STORIES_EMPTY_STATE.description}
            cta={STORIES_EMPTY_STATE.cta}
          />
        </div>
      </section>
    </>
  );
}
