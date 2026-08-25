import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import type { Church } from "@/content/churches";
import { fetchAllChurches, saveChurches } from "@/lib/churches";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function makeEmptyChurch(): Church {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `church-${Date.now()}`,
    regionSido: "",
    regionSigungu: "",
    name: "",
    address: "",
    phone: "",
    contactName: "",
    isPublished: true,
  };
}

// §RequireAdmin.tsx가 이 페이지를 감싸서 staff/admin 로그인을 이미 확인했습니다.
export default function ChurchAdmin() {
  const [churches, setChurches] = useState<Church[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAllChurches().then((data) => {
      if (!cancelled) setChurches(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateChurch(id: string, patch: Partial<Church>) {
    setChurches((prev) => (prev ? prev.map((c) => (c.id === id ? { ...c, ...patch } : c)) : prev));
  }

  function addChurch() {
    setChurches((prev) => [...(prev ?? []), makeEmptyChurch()]);
  }

  function removeChurch(id: string) {
    setChurches((prev) => (prev ? prev.filter((c) => c.id !== id) : prev));
  }

  async function handleSave() {
    if (!churches) return;
    const incomplete = churches.find(
      (c) => !c.name.trim() || !c.regionSido.trim() || !c.regionSigungu.trim(),
    );
    if (incomplete) {
      toast.error("교회명·시·도·시·군·구는 비어있을 수 없어요.");
      return;
    }
    setSaving(true);
    try {
      const target = await saveChurches(churches);
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
      <SEO path="/admin/churches" noindex />

      <AdminHeader
        title="지역가정교회 관리"
        description={
          <>
            /churches(지역가정교회)에 노출되는 목록을 관리해요. 방문자는
            시·도/시·군·구로 검색해서 이름·주소·연락처를 확인합니다.
            {isSupabaseConfigured
              ? " 저장하면 Supabase에 반영되어 모든 방문자에게 보여요."
              : " 현재 Supabase가 연결되어 있지 않아 저장하면 이 브라우저에만 임시로 보관돼요."}
          </>
        }
      />

      <section className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        {churches === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : (
          <div className="space-y-5">
            {churches.map((church) => (
              <div key={church.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => removeChurch(church.id)}
                    aria-label="교회 삭제"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-1 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">시·도</span>
                    <input
                      className={inputClass}
                      value={church.regionSido}
                      onChange={(e) => updateChurch(church.id, { regionSido: e.target.value })}
                      placeholder="예: 서울"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">시·군·구</span>
                    <input
                      className={inputClass}
                      value={church.regionSigungu}
                      onChange={(e) => updateChurch(church.id, { regionSigungu: e.target.value })}
                      placeholder="예: 강남구"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">교회명</span>
                    <input
                      className={inputClass}
                      value={church.name}
                      onChange={(e) => updateChurch(church.id, { name: e.target.value })}
                      placeholder="예: 서울강남교회"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">주소</span>
                    <input
                      className={inputClass}
                      value={church.address}
                      onChange={(e) => updateChurch(church.id, { address: e.target.value })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">전화번호</span>
                    <input
                      className={inputClass}
                      value={church.phone}
                      onChange={(e) => updateChurch(church.id, { phone: e.target.value })}
                      placeholder="02-000-0000"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">담당자</span>
                    <input
                      className={inputClass}
                      value={church.contactName}
                      onChange={(e) => updateChurch(church.id, { contactName: e.target.value })}
                    />
                  </label>

                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={church.isPublished}
                      onChange={(e) => updateChurch(church.id, { isPublished: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span>공개 (체크 해제하면 방문자에게 보이지 않아요)</span>
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addChurch}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary-deep"
            >
              <Plus className="h-4 w-4" /> 지역교회 추가
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
