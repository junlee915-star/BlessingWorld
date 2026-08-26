// FAQ 데이터 접근 계층 — §lib/churches.ts / courses.ts와 같은 패턴(Supabase 우선,
// localStorage 대체).
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { DEFAULT_FAQS, type FaqItem } from "@/content/faq";

const LOCAL_STORAGE_KEY = "blessingworld:faqs";

export type FaqPersistTarget = "supabase" | "local";

function readLocalOverride(): FaqItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FaqItem[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalOverride(faqs: FaqItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(faqs));
  } catch {
    // 프라이빗 모드 등으로 저장 공간을 쓸 수 없는 경우 조용히 무시합니다.
  }
}

function rowToFaq(row: {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_default_visible: boolean;
  is_published: boolean;
}): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    sortOrder: row.sort_order,
    isDefaultVisible: row.is_default_visible,
    isPublished: row.is_published,
  };
}

function faqToRow(faq: FaqItem) {
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    sort_order: faq.sortOrder,
    is_default_visible: faq.isDefaultVisible,
    is_published: faq.isPublished,
  };
}

function sortByOrder(faqs: FaqItem[]): FaqItem[] {
  return [...faqs].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** 공개 화면(/guide FaqAccordion)에서 씁니다 — 게시된 항목만 순서대로 돌려줍니다. */
export async function fetchPublishedFaqs(): Promise<FaqItem[]> {
  const all = await fetchAllFaqs();
  return sortByOrder(all.filter((faq) => faq.isPublished));
}

/** 관리 화면(/admin/faq)에서 씁니다 — 비공개 항목도 함께 돌려줍니다. */
export async function fetchAllFaqs(): Promise<FaqItem[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) {
      return data.map(rowToFaq);
    }
  }
  return sortByOrder(readLocalOverride() ?? DEFAULT_FAQS);
}

/**
 * FAQ 목록 전체를 저장합니다. Supabase가 연결돼 있으면 upsert하고(로컬에서 지운 항목은
 * 삭제), 아니면 이 브라우저의 localStorage에만 저장합니다. §lib/churches.ts saveChurches()와
 * 동일한 패턴입니다.
 */
export async function saveFaqs(faqs: FaqItem[]): Promise<FaqPersistTarget> {
  if (isSupabaseConfigured && supabase) {
    const rows = faqs.map(faqToRow);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- §lib/courses.ts와 같은 라이브러리 타입 버그 우회
    const { error: upsertError } = await (supabase.from("faqs") as any).upsert(rows);
    const ids = faqs.map((faq) => faq.id);
    const { error: deleteError } =
      ids.length > 0
        ? await supabase.from("faqs").delete().not("id", "in", `(${ids.join(",")})`)
        : { error: null };
    if (!upsertError && !deleteError) {
      return "supabase";
    }
  }
  writeLocalOverride(faqs);
  return "local";
}
