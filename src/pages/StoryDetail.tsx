import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Flower2, Share2 } from "lucide-react";
import { toast } from "sonner";

import { SEO } from "@/components/common/SEO";
import { ComingSoon } from "@/components/common/ComingSoon";
import { Button } from "@/components/ui/button";
import { STORY_CATEGORY_LABELS, type Story } from "@/content/stories";
import { fetchPublishedStories } from "@/lib/stories";

function formatPublishedDate(story: Story): string {
  const raw = story.publishedAt ?? story.createdAt;
  return new Date(raw).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

async function shareStory(story: Story) {
  const url = `${window.location.origin}/stories/${story.slug}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: story.title, text: story.excerpt, url });
    } catch {
      // 사용자가 공유 시트를 취소한 경우 등 — 조용히 무시합니다.
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.success("링크가 복사되었어요.");
  } catch {
    toast.error("링크 복사에 실패했어요. 주소창에서 직접 복사해주세요.");
  }
}

export default function StoryDetail() {
  const { slug } = useParams();
  const [stories, setStories] = useState<Story[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedStories().then((data) => {
      if (!cancelled) setStories(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const index = useMemo(
    () => (stories ? stories.findIndex((story) => story.slug === slug) : -1),
    [stories, slug],
  );
  const story = index >= 0 ? stories![index] : null;
  // §lib/stories.ts fetchPublishedStories()는 최신순 배열을 돌려주므로, 바로 앞이 더 최근,
  // 바로 뒤가 더 예전 글입니다.
  const newerStory = index > 0 ? stories![index - 1] : null;
  const olderStory = stories && index >= 0 && index < stories.length - 1 ? stories[index + 1] : null;

  if (stories === null) {
    return (
      <>
        <SEO path="/stories" />
        <p className="mx-auto max-w-2xl px-5 py-24 text-center text-sm text-muted-foreground">
          불러오는 중이에요…
        </p>
      </>
    );
  }

  if (!story) {
    return (
      <>
        <SEO path="/stories" noindex />
        <ComingSoon
          icon={BookOpen}
          title="이야기를 찾을 수 없어요"
          description={`요청하신 글${slug ? `(${slug})` : ""}을 찾을 수 없어요. 삭제되었거나 아직 게시되지 않은 글일 수 있습니다.`}
          backTo={{ label: "행복의 꽃으로 돌아가기", to: "/stories" }}
        />
      </>
    );
  }

  return (
    <>
      <SEO
        path={`/stories/${story.slug}`}
        title={`${story.title} — 행복의 꽃`}
        description={story.excerpt || story.title}
      />

      <article className="mx-auto max-w-3xl px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        {story.coverImageUrl ? (
          <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
            <img src={story.coverImageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-primary-soft text-primary-deep">
            <Flower2 className="h-12 w-12" aria-hidden="true" />
          </div>
        )}

        <span className="mt-8 inline-flex w-fit items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-deep">
          {STORY_CATEGORY_LABELS[story.category]}
        </span>
        <h1 className="mt-3 text-2xl font-bold leading-[1.35] text-foreground md:text-[32px]">
          {story.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {story.familyName || story.region || "축복가정"}
          {story.familyName && story.region ? ` · ${story.region}` : ""} · {formatPublishedDate(story)}
        </p>

        {story.body ? (
          <div className="mt-8 whitespace-pre-wrap text-[15px] leading-[1.9] text-foreground">
            {story.body}
          </div>
        ) : null}

        <Button variant="outline" className="mt-8" onClick={() => void shareStory(story)}>
          <Share2 className="h-4 w-4" /> 공유하기
        </Button>

        <div className="mt-10 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
          {olderStory ? (
            <Link
              to={`/stories/${olderStory.slug}`}
              className="flex flex-col gap-1 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> 이전 이야기
              </span>
              <span className="line-clamp-1 text-sm font-medium text-foreground">{olderStory.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newerStory ? (
            <Link
              to={`/stories/${newerStory.slug}`}
              className="flex flex-col items-end gap-1 rounded-xl border border-border p-4 text-right transition-colors hover:border-primary sm:col-start-2"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                다음 이야기 <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="line-clamp-1 text-sm font-medium text-foreground">{newerStory.title}</span>
            </Link>
          ) : null}
        </div>

        <div className="mt-10 rounded-2xl border border-primary/30 bg-primary-soft/40 p-6 text-center">
          <p className="text-sm font-medium text-foreground">
            이 이야기처럼, 당신의 축복결혼도 시작될 수 있어요.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/onboarding">축복결혼 안내 신청하기</Link>
          </Button>
        </div>
      </article>
    </>
  );
}
