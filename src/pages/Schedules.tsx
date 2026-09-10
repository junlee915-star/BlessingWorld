import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/schedules/EventCard";
import {
  EVENT_CATEGORY_LABELS,
  SCHEDULES_COPY,
  SCHEDULES_HERO,
  type BlessingEvent,
  type EventCategory,
} from "@/content/events";
import { fetchPublishedEvents } from "@/lib/events";

const CATEGORY_TABS: Array<{ value: "all" | EventCategory; label: string }> = [
  { value: "all", label: SCHEDULES_COPY.allCategory },
  ...(Object.entries(EVENT_CATEGORY_LABELS) as [EventCategory, string][]).map(([value, label]) => ({
    value,
    label,
  })),
];

function formatUpdatedDate(events: BlessingEvent[]): string | null {
  if (events.length === 0) return null;
  const latest = events.reduce((max, event) => (event.updatedAt > max ? event.updatedAt : max), events[0].updatedAt);
  return new Date(latest).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

// 일정·공지 `/schedules` — §14 개선안 P-13(§14.4.1).
// 기한 있는 정보(축복식·수련회·교육·교류회)를 안내할 방법이 전화뿐이었던 문제를 보완합니다.
// 등록된 일정이 없으면(§content/events.ts DEFAULT_EVENTS=[]) 안내 문구만 보여주고,
// Header.tsx가 이 상태를 함께 확인해 GNB에서도 이 페이지 링크를 숨깁니다.
export default function Schedules() {
  const [events, setEvents] = useState<BlessingEvent[] | null>(null);
  const [category, setCategory] = useState<"all" | EventCategory>("all");
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedEvents().then((data) => {
      if (!cancelled) setEvents(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!events) return [];
    return category === "all" ? events : events.filter((event) => event.category === category);
  }, [events, category]);

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    return {
      upcoming: filtered.filter((event) => new Date(event.startsAt).getTime() >= now),
      past: filtered.filter((event) => new Date(event.startsAt).getTime() < now).reverse(),
    };
  }, [filtered]);

  const loading = events === null;
  const hasAnyEvents = (events?.length ?? 0) > 0;
  const updatedDate = events ? formatUpdatedDate(events) : null;

  return (
    <>
      <SEO path="/schedules" />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
        <EyebrowLabel>{SCHEDULES_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 max-w-3xl text-[28px] font-bold leading-[1.3] text-foreground md:text-[40px]">
          {SCHEDULES_HERO.title}
        </h1>
        <p className="prose-copy mt-5 max-w-2xl text-[15px] md:text-[17px]">{SCHEDULES_HERO.body}</p>
        {updatedDate ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {updatedDate} {SCHEDULES_COPY.updatedNotePrefix}
          </p>
        ) : null}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        {loading ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : !hasAnyEvents ? (
          <p className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center text-sm leading-[1.8] text-muted-foreground">
            {SCHEDULES_COPY.emptyState}
          </p>
        ) : (
          <>
            <Tabs value={category} onValueChange={(v) => setCategory(v as "all" | EventCategory)}>
              <TabsList>
                {CATEGORY_TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="mt-8">
              <h2 className="text-lg font-bold text-foreground">{SCHEDULES_COPY.upcomingHeading}</h2>
              {upcoming.length > 0 ? (
                <ul className="mt-4 grid gap-4 md:grid-cols-2">
                  {upcoming.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">{SCHEDULES_COPY.emptyStateFiltered}</p>
              )}
            </div>

            {past.length > 0 ? (
              <div className="mt-12 border-t border-border pt-8">
                <button
                  type="button"
                  onClick={() => setShowPast((v) => !v)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary-deep"
                  aria-expanded={showPast}
                >
                  {showPast ? SCHEDULES_COPY.pastToggleHide : SCHEDULES_COPY.pastToggleShow} ({past.length})
                  <ChevronDown className={showPast ? "h-4 w-4 rotate-180 transition-transform" : "h-4 w-4 transition-transform"} />
                </button>
                {showPast ? (
                  <ul className="mt-4 grid gap-4 md:grid-cols-2">
                    {past.map((event) => (
                      <EventCard key={event.id} event={event} isPast />
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
