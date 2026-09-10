import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import type { Notice, NoticeLevel } from "@/content/notices";
import { fetchAllNotices, saveNotices } from "@/lib/notices";
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

function makeEmptyNotice(): Notice {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `notice-${Date.now()}`,
    title: "",
    body: "",
    level: "info",
    isPublished: true,
    createdAt: new Date().toISOString(),
  };
}

// §RequireAdmin.tsx가 이 페이지를 감싸서 staff/admin 로그인을 이미 확인했습니다.
export default function NoticeAdmin() {
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAllNotices().then((data) => {
      if (!cancelled) setNotices(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateNotice(id: string, patch: Partial<Notice>) {
    setNotices((prev) => (prev ? prev.map((n) => (n.id === id ? { ...n, ...patch } : n)) : prev));
  }

  function addNotice() {
    setNotices((prev) => [makeEmptyNotice(), ...(prev ?? [])]);
  }

  function removeNotice(id: string) {
    setNotices((prev) => (prev ? prev.filter((n) => n.id !== id) : prev));
  }

  async function handleSave() {
    if (!notices) return;
    const incomplete = notices.find((n) => !n.title.trim() || !n.body.trim());
    if (incomplete) {
      toast.error("제목과 내용은 비어있을 수 없어요.");
      return;
    }
    setSaving(true);
    try {
      const target = await saveNotices(notices);
      if (target === "supabase") {
        toast.success("저장했어요. Supabase에 반영되어 모든 방문자에게 보여요.");
      } else {
        toast.success("이 브라우저에 저장했어요.", {
          description: "Supabase가 연결되면 모든 방문자에게 반영되는 저장으로 자동 전환돼요.",
        });
      }
      fetchAllNotices().then(setNotices);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SEO path="/admin/notices" noindex />

      <AdminHeader
        title="공지 관리"
        description={
          <>
            홈 공지 슬롯과 /notice에 노출되는 공지를 관리해요. 게시 기간을 비워두면 항상
            게시 중으로 취급되고, 게시 중인 공지가 하나도 없으면 홈에서 슬롯 자체가
            사라집니다.
            {isSupabaseConfigured
              ? " 저장하면 Supabase에 반영되어 모든 방문자에게 보여요."
              : " 현재 Supabase가 연결되어 있지 않아 저장하면 이 브라우저에만 임시로 보관돼요."}
          </>
        }
      />

      <section className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        {notices === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : (
          <div className="space-y-5">
            <button
              type="button"
              onClick={addNotice}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary-deep"
            >
              <Plus className="h-4 w-4" /> 공지 추가
            </button>

            {notices.map((notice) => (
              <div key={notice.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => removeNotice(notice.id)}
                    aria-label="공지 삭제"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-1 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">중요도</span>
                    <select
                      className={inputClass}
                      value={notice.level}
                      onChange={(e) => updateNotice(notice.id, { level: e.target.value as NoticeLevel })}
                    >
                      <option value="info">안내</option>
                      <option value="important">중요</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-2 self-end text-sm">
                    <input
                      type="checkbox"
                      checked={notice.isPublished}
                      onChange={(e) => updateNotice(notice.id, { isPublished: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span>공개</span>
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">제목</span>
                    <input
                      className={inputClass}
                      value={notice.title}
                      onChange={(e) => updateNotice(notice.id, { title: e.target.value })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">내용</span>
                    <textarea
                      rows={3}
                      className={inputClass}
                      value={notice.body}
                      onChange={(e) => updateNotice(notice.id, { body: e.target.value })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">
                      게시 시작 <span className="font-normal text-muted-foreground">(선택)</span>
                    </span>
                    <input
                      type="datetime-local"
                      className={inputClass}
                      value={toDatetimeLocal(notice.startsAt)}
                      onChange={(e) => updateNotice(notice.id, { startsAt: fromDatetimeLocal(e.target.value) })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">
                      게시 종료 <span className="font-normal text-muted-foreground">(선택)</span>
                    </span>
                    <input
                      type="datetime-local"
                      className={inputClass}
                      value={toDatetimeLocal(notice.endsAt)}
                      onChange={(e) => updateNotice(notice.id, { endsAt: fromDatetimeLocal(e.target.value) })}
                    />
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
