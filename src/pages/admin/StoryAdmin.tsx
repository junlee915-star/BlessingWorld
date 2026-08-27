import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { STORY_CATEGORY_LABELS, type Story } from "@/content/stories";
import { fetchAllStories, saveStories } from "@/lib/stories";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import type { StoryCategory } from "@/integrations/supabase/types";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const CATEGORY_OPTIONS: StoryCategory[] = ["interview", "case", "video"];

function makeEmptyStory(): Story {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `story-${Date.now()}`,
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    coverImageUrl: "",
    category: "interview",
    familyName: "",
    quote: "",
    blessingType: "",
    region: "",
    viewCount: 0,
    isPublished: false,
    publishedAt: null,
    createdAt: new Date().toISOString(),
  };
}

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// §RequireAdmin.tsx가 이 페이지를 감싸서 staff/admin 로그인을 이미 확인했습니다.
export default function StoryAdmin() {
  const [stories, setStories] = useState<Story[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAllStories().then((data) => {
      if (!cancelled) setStories(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateStory(id: string, patch: Partial<Story>) {
    setStories((prev) => (prev ? prev.map((s) => (s.id === id ? { ...s, ...patch } : s)) : prev));
  }

  function addStory() {
    setStories((prev) => [makeEmptyStory(), ...(prev ?? [])]);
  }

  function removeStory(id: string) {
    setStories((prev) => (prev ? prev.filter((s) => s.id !== id) : prev));
  }

  async function handleSave() {
    if (!stories) return;

    const incomplete = stories.find((s) => !s.title.trim());
    if (incomplete) {
      toast.error("제목은 비어있을 수 없어요.");
      return;
    }

    // slug를 비워두면 제목에서 자동으로 만듭니다. 그래도 겹치면 저장을 막습니다.
    const withSlugs = stories.map((s) => ({ ...s, slug: s.slug.trim() || slugify(s.title) }));
    const emptySlug = withSlugs.find((s) => !s.slug);
    if (emptySlug) {
      toast.error("슬러그(URL 주소)를 자동으로 만들 수 없는 제목이 있어요. 슬러그를 직접 입력해주세요.");
      return;
    }
    const slugCounts = new Map<string, number>();
    for (const s of withSlugs) slugCounts.set(s.slug, (slugCounts.get(s.slug) ?? 0) + 1);
    const duplicateSlug = [...slugCounts.entries()].find(([, count]) => count > 1);
    if (duplicateSlug) {
      toast.error(`슬러그가 중복돼요: "${duplicateSlug[0]}". 서로 다른 값으로 바꿔주세요.`);
      return;
    }

    // 방금 "공개"로 체크했는데 게시 시각이 없는 글은 지금 시각으로 채웁니다.
    const withPublishedAt = withSlugs.map((s) =>
      s.isPublished && !s.publishedAt ? { ...s, publishedAt: new Date().toISOString() } : s,
    );

    setStories(withPublishedAt);
    setSaving(true);
    try {
      const target = await saveStories(withPublishedAt);
      if (target === "supabase") {
        toast.success("저장했어요. Supabase에 반영되어 모든 방문자에게 보여요.");
      } else {
        toast.success("이 브라우저에 저장했어요.", {
          description: "Supabase가 연결되면 모든 방문자에게 반영되는 저장으로 자동 전환돼요.",
        });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SEO path="/admin/stories" noindex />

      <AdminHeader
        title="스토리 관리"
        description={
          <>
            /stories(행복의 꽃)에 노출되는 글을 관리해요. "공개"를 체크해야 방문자에게
            보이고, 체크를 해제하면 초안으로만 남아요.
            {isSupabaseConfigured
              ? " 저장하면 Supabase에 반영되어 모든 방문자에게 보여요."
              : " 현재 Supabase가 연결되어 있지 않아 저장하면 이 브라우저에만 임시로 보관돼요."}
          </>
        }
      />

      <section className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        {stories === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : (
          <div className="space-y-5">
            <button
              type="button"
              onClick={addStory}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary-deep"
            >
              <Plus className="h-4 w-4" /> 새 스토리 추가
            </button>

            {stories.map((story) => (
              <div key={story.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    조회수 {story.viewCount.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeStory(story.id)}
                    aria-label="스토리 삭제"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-1 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">제목</span>
                    <input
                      className={inputClass}
                      value={story.title}
                      onChange={(e) => updateStory(story.id, { title: e.target.value })}
                      placeholder="예: 20년을 함께, 여전히 서로를 배워가요"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">
                      슬러그(URL) <span className="font-normal text-muted-foreground">— 비우면 제목으로 자동 생성</span>
                    </span>
                    <input
                      className={inputClass}
                      value={story.slug}
                      onChange={(e) => updateStory(story.id, { slug: e.target.value })}
                      placeholder="예: 20-years-together"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">카테고리</span>
                    <select
                      className={inputClass}
                      value={story.category}
                      onChange={(e) => updateStory(story.id, { category: e.target.value as StoryCategory })}
                    >
                      {CATEGORY_OPTIONS.map((value) => (
                        <option key={value} value={value}>
                          {STORY_CATEGORY_LABELS[value]}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">가정의 한마디 (카드 제목)</span>
                    <input
                      className={inputClass}
                      value={story.quote}
                      onChange={(e) => updateStory(story.id, { quote: e.target.value })}
                      placeholder="예: 완벽한 사람을 찾기보다, 함께 자랄 사람을 만났어요."
                    />
                    <span className="text-xs text-muted-foreground">
                      목록 카드의 제목으로 쓰입니다. 비워두면 위의 글 제목이 대신 노출돼요.
                    </span>
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">축복 유형 배지</span>
                    <input
                      className={inputClass}
                      value={story.blessingType}
                      onChange={(e) => updateStory(story.id, { blessingType: e.target.value })}
                      placeholder="예: 합동축복 / 축복자녀"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">가정 표기</span>
                    <input
                      className={inputClass}
                      value={story.familyName}
                      onChange={(e) => updateStory(story.id, { familyName: e.target.value })}
                      placeholder="예: 김ㅇㅇ·이ㅇㅇ 가정 (익명 표기 권장)"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">지역</span>
                    <input
                      className={inputClass}
                      value={story.region}
                      onChange={(e) => updateStory(story.id, { region: e.target.value })}
                      placeholder="예: 서울 강남"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">커버 이미지 URL</span>
                    <input
                      className={inputClass}
                      value={story.coverImageUrl}
                      onChange={(e) => updateStory(story.id, { coverImageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">요약 (카드에 노출)</span>
                    <textarea
                      className={inputClass}
                      rows={2}
                      value={story.excerpt}
                      onChange={(e) => updateStory(story.id, { excerpt: e.target.value })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">본문</span>
                    <textarea
                      className={inputClass}
                      rows={6}
                      value={story.body}
                      onChange={(e) => updateStory(story.id, { body: e.target.value })}
                    />
                  </label>

                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={story.isPublished}
                      onChange={(e) => updateStory(story.id, { isPublished: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span>공개 (체크 해제하면 방문자에게 보이지 않아요)</span>
                  </label>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} size="lg">
                {saving ? "저장 중…" : "저장하기"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
