import { SEARCH_INDEX, type SearchEntry } from "@/content/searchIndex";

const MAX_RESULTS = 8;

/** 아주 단순한 부분일치 검색 — 서버 없이 정적 색인(§content/searchIndex.ts)만으로 충분합니다.
 * 제목 일치를 설명 일치보다 높게, 단어 전부가 매칭되면 하나만 매칭될 때보다 높게 점수를 줍니다. */
export function searchSite(rawQuery: string): SearchEntry[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const words = query.split(/\s+/).filter(Boolean);

  const scored = SEARCH_INDEX.map((entry) => {
    const title = entry.title.toLowerCase();
    const description = entry.description.toLowerCase();
    let score = 0;

    for (const word of words) {
      if (title.includes(word)) score += 3;
      if (description.includes(word)) score += 1;
    }

    return { entry, score };
  }).filter(({ score }) => score > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, MAX_RESULTS).map(({ entry }) => entry);
}
