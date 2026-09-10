import { useEffect, useState } from "react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { NOTICE_LEVEL_LABELS, NOTICE_PAGE_COPY, type Notice } from "@/content/notices";
import { fetchPublishedNotices, isNoticeActive } from "@/lib/notices";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

// 공지사항 `/notice` — §14 개선안 P-13(§14.4.2). 홈 슬롯은 지금 게시 중인 공지만 보여주고,
// 여기서는 지난 공지까지 포함한 전체 목록을 확인할 수 있습니다.
export default function Notice() {
  const [notices, setNotices] = useState<Notice[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedNotices().then((data) => {
      if (!cancelled) setNotices(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SEO path="/notice" />

      <section className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-8 pt-16 text-center md:px-8 md:pt-24">
        <EyebrowLabel>{NOTICE_PAGE_COPY.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 text-[28px] font-bold leading-[1.3] text-foreground md:text-[40px]">
          {NOTICE_PAGE_COPY.title}
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
          {NOTICE_PAGE_COPY.body}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-16 md:px-8 md:pb-24">
        {notices === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : notices.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
            {NOTICE_PAGE_COPY.emptyState}
          </p>
        ) : (
          <ul className="space-y-4">
            {notices.map((notice) => {
              const active = isNoticeActive(notice);
              return (
                <li
                  key={notice.id}
                  className={cn(
                    "rounded-2xl border border-border bg-card p-5 shadow-card",
                    !active && "opacity-70",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        notice.level === "important"
                          ? "bg-accent-soft text-accent-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {NOTICE_LEVEL_LABELS[notice.level]}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(notice.createdAt)}</span>
                    {!active ? (
                      <span className="text-xs text-muted-foreground">· 종료된 공지</span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-foreground">{notice.title}</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-[1.75] text-muted-foreground">
                    {notice.body}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
