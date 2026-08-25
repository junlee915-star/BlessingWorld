// 지역교회 데이터 접근 계층 — §lib/courses.ts와 같은 패턴(Supabase 우선, localStorage 대체).
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { DEFAULT_CHURCHES, type Church } from "@/content/churches";

const LOCAL_STORAGE_KEY = "blessingworld:churches";

export type ChurchPersistTarget = "supabase" | "local";

function readLocalOverride(): Church[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Church[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalOverride(churches: Church[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(churches));
  } catch {
    // 프라이빗 모드 등으로 저장 공간을 쓸 수 없는 경우 조용히 무시합니다.
  }
}

function rowToChurch(row: {
  id: string;
  region_sido: string;
  region_sigungu: string;
  name: string;
  address: string | null;
  phone: string | null;
  contact_name: string | null;
  is_published: boolean;
}): Church {
  return {
    id: row.id,
    regionSido: row.region_sido,
    regionSigungu: row.region_sigungu,
    name: row.name,
    address: row.address ?? "",
    phone: row.phone ?? "",
    contactName: row.contact_name ?? "",
    isPublished: row.is_published,
  };
}

function churchToRow(church: Church) {
  return {
    id: church.id,
    region_sido: church.regionSido,
    region_sigungu: church.regionSigungu,
    name: church.name,
    address: church.address,
    phone: church.phone,
    contact_name: church.contactName,
    is_published: church.isPublished,
  };
}

function sortChurches(churches: Church[]): Church[] {
  return [...churches].sort(
    (a, b) => a.regionSido.localeCompare(b.regionSido, "ko") || a.regionSigungu.localeCompare(b.regionSigungu, "ko"),
  );
}

/** 공개 페이지(ChurchFinder)에서 씁니다 — 게시된 교회만 정렬해 돌려줍니다. */
export async function fetchPublishedChurches(): Promise<Church[]> {
  const all = await fetchAllChurches();
  return sortChurches(all.filter((church) => church.isPublished));
}

/** 관리 화면(/admin/churches)에서 씁니다 — 비공개 항목도 함께 돌려줍니다. */
export async function fetchAllChurches(): Promise<Church[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("churches")
      .select("*")
      .order("region_sido", { ascending: true });
    if (!error && data) {
      return sortChurches(data.map(rowToChurch));
    }
  }
  return sortChurches(readLocalOverride() ?? DEFAULT_CHURCHES);
}

export async function saveChurches(churches: Church[]): Promise<ChurchPersistTarget> {
  if (isSupabaseConfigured && supabase) {
    const rows = churches.map(churchToRow);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- §lib/courses.ts와 같은 라이브러리 타입 버그 우회
    const { error: upsertError } = await (supabase.from("churches") as any).upsert(rows);
    const ids = churches.map((church) => church.id);
    const { error: deleteError } =
      ids.length > 0
        ? await supabase.from("churches").delete().not("id", "in", `(${ids.join(",")})`)
        : { error: null };
    if (!upsertError && !deleteError) {
      return "supabase";
    }
  }
  writeLocalOverride(churches);
  return "local";
}
