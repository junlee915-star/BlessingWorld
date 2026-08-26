import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import type { FaqItem } from "@/content/faq";
import { fetchAllFaqs, saveFaqs } from "@/lib/faq";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function makeEmptyFaq(sortOrder: number): FaqItem {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `faq-${Date.now()}`,
    question: "",
    answer: "",
    sortOrder,
    isDefaultVisible: false,
    isPublished: true,
  };
}

function withReindexedOrder(faqs: FaqItem[]): FaqItem[] {
  return faqs.map((faq, index) => ({ ...faq, sortOrder: index + 1 }));
}

// §RequireAdmin.tsx가 이 페이지를 감싸서 staff/admin 로그인을 이미 확인했습니다.
export default function FaqAdmin() {
  const [faqs, setFaqs] = useState<FaqItem[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAllFaqs().then((data) => {
      if (!cancelled) setFaqs(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateFaq(id: string, patch: Partial<FaqItem>) {
    setFaqs((prev) => (prev ? prev.map((f) => (f.id === id ? { ...f, ...patch } : f)) : prev));
  }

  function moveFaq(id: string, direction: -1 | 1) {
    setFaqs((prev) => {
      if (!prev) return prev;
      const index = prev.findIndex((f) => f.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return withReindexedOrder(next);
    });
  }

  function addFaq() {
    setFaqs((prev) => withReindexedOrder([...(prev ?? []), makeEmptyFaq((prev?.length ?? 0) + 1)]));
  }

  function removeFaq(id: string) {
    setFaqs((prev) => (prev ? withReindexedOrder(prev.filter((f) => f.id !== id)) : prev));
  }

  async function handleSave() {
    if (!faqs) return;
    const incomplete = faqs.find((f) => !f.question.trim() || !f.answer.trim());
    if (incomplete) {
      toast.error("질문과 답변은 비어있을 수 없어요.");
      return;
    }
    setSaving(true);
    try {
      const target = await saveFaqs(faqs);
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
      <SEO path="/admin/faq" noindex />

      <AdminHeader
        title="FAQ 관리"
        description={
          <>
            /guide 하단에 노출되는 자주 묻는 질문을 관리해요. "기본 노출"을 체크한 항목만
            항상 보이고, 나머지는 "질문 더 보기"를 눌러야 나타나요.
            {isSupabaseConfigured
              ? " 저장하면 Supabase에 반영되어 모든 방문자에게 보여요."
              : " 현재 Supabase가 연결되어 있지 않아 저장하면 이 브라우저에만 임시로 보관돼요."}
          </>
        }
      />

      <section className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        {faqs === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : (
          <div className="space-y-5">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-deep">
                    {faq.sortOrder}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveFaq(faq.id, -1)}
                      disabled={index === 0}
                      aria-label="위로 이동"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFaq(faq.id, 1)}
                      disabled={index === faqs.length - 1}
                      aria-label="아래로 이동"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFaq(faq.id)}
                      aria-label="FAQ 삭제"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">질문</span>
                    <input
                      className={inputClass}
                      value={faq.question}
                      onChange={(e) => updateFaq(faq.id, { question: e.target.value })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">답변</span>
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={faq.answer}
                      onChange={(e) => updateFaq(faq.id, { answer: e.target.value })}
                    />
                  </label>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={faq.isDefaultVisible}
                        onChange={(e) => updateFaq(faq.id, { isDefaultVisible: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <span>기본 노출 (체크 해제하면 "더 보기" 뒤에 숨어요)</span>
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={faq.isPublished}
                        onChange={(e) => updateFaq(faq.id, { isPublished: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <span>공개 (체크 해제하면 방문자에게 보이지 않아요)</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addFaq}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary-deep"
            >
              <Plus className="h-4 w-4" /> FAQ 추가
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
