import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";

import { HOME_NOTICE_BAND_COPY, NOTICE_LEVEL_LABELS, type Notice } from "@/content/notices";
import { fetchPublishedNotices, isNoticeActive } from "@/lib/notices";
import { cn } from "@/lib/utils";

// 홈 공지 슬롯 — §14 개선안 P-13(§14.4.2), AC-30. 히어로 바로 아래 배치하되, 게시 중인
// 공지가 하나도 없으면 DOM에서 완전히 사라집니다(참조 사이트의 "지금은 공지가 없습니다"
// 상시 노출은 따라하지 않습니다).
export function NoticeBand() {
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

  const activeNotices = (notices ?? []).filter((notice) => isNoticeActive(notice));
  if (activeNotices.length === 0) return null;

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl space-y-2 px-5 py-4 md:px-8">
        {activeNotices.map((notice) => (
          <div
            key={notice.id}
            className={cn(
              "flex flex-wrap items-start gap-2.5 rounded-xl px-4 py-3 text-sm",
              notice.level === "important" ? "bg-accent-soft text-accent-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            <Megaphone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold">
                [{NOTICE_LEVEL_LABELS[notice.level]}] {notice.title}
              </span>
              <span className="ml-1.5">{notice.body}</span>
            </div>
          </div>
        ))}
        <Link
          to={HOME_NOTICE_BAND_COPY.moreLink.to}
          className="inline-block text-xs font-medium text-primary-deep hover:underline"
        >
          {HOME_NOTICE_BAND_COPY.moreLink.label} →
        </Link>
      </div>
    </div>
  );
}
