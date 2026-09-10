import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  EVENT_CATEGORY_LABELS,
  EVENT_FORMAT_LABELS,
  SCHEDULES_COPY,
  type BlessingEvent,
} from "@/content/events";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

/** 신청기한이 오늘부터 7일 이내(과거 제외)면 임박 배지를 붙입니다. */
function isDeadlineSoon(deadline?: string): boolean {
  if (!deadline) return false;
  const daysLeft = (new Date(deadline).getTime() - Date.now()) / MS_PER_DAY;
  return daysLeft >= 0 && daysLeft <= 7;
}

interface FieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}

interface EventCardProps {
  event: BlessingEvent;
  isPast?: boolean;
}

export function EventCard({ event, isPast }: EventCardProps) {
  const deadlineSoon = !isPast && isDeadlineSoon(event.applyDeadline);

  return (
    <li
      className={`rounded-2xl border border-border bg-card p-5 shadow-card ${isPast ? "opacity-70" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="muted">{EVENT_CATEGORY_LABELS[event.category]}</Badge>
        {deadlineSoon ? <Badge variant="accent">{SCHEDULES_COPY.deadlineSoonBadge}</Badge> : null}
      </div>
      <h3 className="mt-3 text-lg font-bold text-foreground">{event.title}</h3>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        <Field label="일시">
          {formatDateTime(event.startsAt)}
          {event.endsAt ? ` ~ ${formatDateTime(event.endsAt)}` : ""}
        </Field>
        {event.format ? <Field label="형식">{EVENT_FORMAT_LABELS[event.format]}</Field> : null}
        {event.venue ? <Field label="장소">{event.venue}</Field> : null}
        {event.audience ? <Field label="대상">{event.audience}</Field> : null}
        {event.fee ? <Field label="참가비">{event.fee}</Field> : null}
        {event.applyDeadline ? (
          <Field label="신청기한">
            <span className={deadlineSoon ? "font-semibold text-accent-deep" : undefined}>
              {formatDate(event.applyDeadline)}
            </span>
          </Field>
        ) : null}
        {event.paymentDeadline ? (
          <Field label="입금기한">{formatDate(event.paymentDeadline)}</Field>
        ) : null}
        {event.applyMethod ? <Field label="신청방법">{event.applyMethod}</Field> : null}
        {event.host ? <Field label="주최">{event.host}</Field> : null}
        {event.contact ? <Field label="문의">{event.contact}</Field> : null}
      </dl>
    </li>
  );
}
