import { ExternalLink, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import {
  VIDEO_RAIL_MORE_LABEL,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
  type VideoRail as VideoRailData,
} from "@/content/familyVideos";

interface VideoRailProps {
  rail: VideoRailData;
}

// 영상 블록 — 재생은 YouTube에서 하고 이 사이트는 링크만 겁니다.
// iframe 임베드를 쓰지 않은 이유: 카드마다 플레이어를 붙이면 목록 페이지가 무거워지고
// (§9.2 성능 예산) 쿠키·추적 스크립트가 방문자 동의 없이 붙습니다.
export function VideoRailSection({ rail }: VideoRailProps) {
  return (
    <section aria-labelledby={`rail-${rail.id}`} className="mt-14 first:mt-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <EyebrowLabel>{rail.eyebrow}</EyebrowLabel>
          <h2 id={`rail-${rail.id}`} className="mt-2 text-xl font-bold text-foreground md:text-2xl">
            {rail.title}
          </h2>
          {rail.description ? (
            <p className="mt-2 max-w-prose text-sm leading-[1.75] text-muted-foreground">
              {rail.description}
            </p>
          ) : null}
        </div>

        <a
          href={rail.playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-primary hover:text-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {VIDEO_RAIL_MORE_LABEL}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">(YouTube 재생목록, 새 창에서 열림)</span>
        </a>
      </div>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {rail.videos.map((video) => (
          <li key={video.id}>
            <a
              href={youtubeWatchUrl(video.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={youtubeThumbnailUrl(video.id)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary-deep">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </span>
                {video.isNew ? (
                  <Badge variant="accent" className="absolute left-2 top-2">
                    NEW
                  </Badge>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary-deep">
                  {video.title}
                </h3>
                <p className="mt-auto text-xs text-muted-foreground">
                  {video.publishedLabel}
                  <span className="sr-only"> · YouTube, 새 창에서 열림</span>
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
