import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import {
  EVENT_CATEGORY_LABELS,
  EVENT_FORMAT_LABELS,
  type BlessingEvent,
  type EventCategory,
  type EventFormat,
} from "@/content/events";
import { fetchAllEvents, saveEvents } from "@/lib/events";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** <input type="datetime-local">은 오프셋 없는 "YYYY-MM-DDTHH:mm" 형식만 받습니다. */
function toDatetimeLocal(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

function makeEmptyEvent(): BlessingEvent {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `event-${Date.now()}`,
    category: "ceremony",
    title: "",
    startsAt: new Date().toISOString(),
    isPublished: true,
    updatedAt: new Date().toISOString(),
  };
}

// §RequireAdmin.tsx가 이 페이지를 감싸서 staff/admin 로그인을 이미 확인했습니다.
export default function EventAdmin() {
  const [events, setEvents] = useState<BlessingEvent[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAllEvents().then((data) => {
      if (!cancelled) setEvents(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateEvent(id: string, patch: Partial<BlessingEvent>) {
    setEvents((prev) => (prev ? prev.map((e) => (e.id === id ? { ...e, ...patch } : e)) : prev));
  }

  function addEvent() {
    setEvents((prev) => [...(prev ?? []), makeEmptyEvent()]);
  }

  function removeEvent(id: string) {
    setEvents((prev) => (prev ? prev.filter((e) => e.id !== id) : prev));
  }

  async function handleSave() {
    if (!events) return;
    const incomplete = events.find((e) => !e.title.trim() || !e.startsAt);
    if (incomplete) {
      toast.error("제목과 일시는 비어있을 수 없어요.");
      return;
    }
    setSaving(true);
    try {
      const target = await saveEvents(events);
      if (target === "supabase") {
        toast.success("저장했어요. Supabase에 반영되어 모든 방문자에게 보여요.");
      } else {
        toast.success("이 브라우저에 저장했어요.", {
          description: "Supabase가 연결되면 모든 방문자에게 반영되는 저장으로 자동 전환돼요.",
        });
      }
      fetchAllEvents().then(setEvents);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SEO path="/admin/events" noindex />

      <AdminHeader
        title="일정·공지 관리"
        description={
          <>
            /schedules에 노출되는 행사 일정을 관리해요. 등록된 일정이 하나도 없으면 공개
            화면과 GNB에서 이 메뉴 자체가 자연히 숨겨집니다.
            {isSupabaseConfigured
              ? " 저장하면 Supabase에 반영되어 모든 방문자에게 보여요."
              : " 현재 Supabase가 연결되어 있지 않아 저장하면 이 브라우저에만 임시로 보관돼요."}
          </>
        }
      />

      <section className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        {events === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : (
          <div className="space-y-5">
            {events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => removeEvent(event.id)}
                    aria-label="일정 삭제"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-1 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">분류</span>
                    <select
                      className={inputClass}
                      value={event.category}
                      onChange={(e) => updateEvent(event.id, { category: e.target.value as EventCategory })}
                    >
                      {(Object.entries(EVENT_CATEGORY_LABELS) as [EventCategory, string][]).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">형식</span>
                    <select
                      className={inputClass}
                      value={event.format ?? ""}
                      onChange={(e) =>
                        updateEvent(event.id, {
                          format: e.target.value ? (e.target.value as EventFormat) : undefined,
                        })
                      }
                    >
                      <option value="">(선택 안 함)</option>
                      {(Object.entries(EVENT_FORMAT_LABELS) as [EventFormat, string][]).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">제목</span>
                    <input
                      className={inputClass}
                      value={event.title}
                      onChange={(e) => updateEvent(event.id, { title: e.target.value })}
                      placeholder="예: 국내 축복결혼 교류회"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">시작 일시</span>
                    <input
                      type="datetime-local"
                      className={inputClass}
                      value={toDatetimeLocal(event.startsAt)}
                      onChange={(e) =>
                        updateEvent(event.id, { startsAt: fromDatetimeLocal(e.target.value) ?? event.startsAt })
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">종료 일시</span>
                    <input
                      type="datetime-local"
                      className={inputClass}
                      value={toDatetimeLocal(event.endsAt)}
                      onChange={(e) => updateEvent(event.id, { endsAt: fromDatetimeLocal(e.target.value) })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">장소·플랫폼</span>
                    <input
                      className={inputClass}
                      value={event.venue ?? ""}
                      onChange={(e) => updateEvent(event.id, { venue: e.target.value || undefined })}
                      placeholder="예: ZOOM, 청평수련소"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">대상</span>
                    <input
                      className={inputClass}
                      value={event.audience ?? ""}
                      onChange={(e) => updateEvent(event.id, { audience: e.target.value || undefined })}
                      placeholder="예: 27세 이하 자녀는 부모 동반 필수"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">참가비</span>
                    <input
                      className={inputClass}
                      value={event.fee ?? ""}
                      onChange={(e) => updateEvent(event.id, { fee: e.target.value || undefined })}
                      placeholder="예: 3,000엔, 무료"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">주최</span>
                    <input
                      className={inputClass}
                      value={event.host ?? ""}
                      onChange={(e) => updateEvent(event.id, { host: e.target.value || undefined })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">신청기한</span>
                    <input
                      type="date"
                      className={inputClass}
                      value={event.applyDeadline ?? ""}
                      onChange={(e) => updateEvent(event.id, { applyDeadline: e.target.value || undefined })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">입금기한</span>
                    <input
                      type="date"
                      className={inputClass}
                      value={event.paymentDeadline ?? ""}
                      onChange={(e) => updateEvent(event.id, { paymentDeadline: e.target.value || undefined })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">신청방법</span>
                    <input
                      className={inputClass}
                      value={event.applyMethod ?? ""}
                      onChange={(e) => updateEvent(event.id, { applyMethod: e.target.value || undefined })}
                      placeholder="예: 공식 채널 등록 후 신청"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">문의</span>
                    <input
                      className={inputClass}
                      value={event.contact ?? ""}
                      onChange={(e) => updateEvent(event.id, { contact: e.target.value || undefined })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">근거 공문(내부 참고용, 공개 안 됨)</span>
                    <input
                      className={inputClass}
                      value={event.sourceNote ?? ""}
                      onChange={(e) => updateEvent(event.id, { sourceNote: e.target.value || undefined })}
                    />
                  </label>

                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={event.isPublished}
                      onChange={(e) => updateEvent(event.id, { isPublished: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span>공개 (체크 해제하면 방문자에게 보이지 않아요)</span>
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addEvent}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary-deep"
            >
              <Plus className="h-4 w-4" /> 일정 추가
            </button>

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
