import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";

import { searchSite } from "@/lib/search";

interface SiteSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 사이트 내 검색 — §14 개선안 §14.6. 정적 색인(§content/searchIndex.ts)을 클라이언트에서
// 바로 필터링합니다. 서류·심사기준·로드맵 상세·강좌·FAQ 등 페이지가 늘어날수록 더 필요해지는
// 기능이라, Header 어디서든 열 수 있게(데스크톱·모바일 아이콘 + Cmd/Ctrl+K) 했습니다.
export function SiteSearchDialog({ open, onOpenChange }: SiteSearchDialogProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchSite(query), [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    // Radix Dialog가 포커스 트랩을 건 다음 프레임에 입력창으로 옮깁니다.
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-[12%] z-50 w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-border bg-card shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">사이트 내 검색</DialogPrimitive.Title>

          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="가치관 진단, 제출서류, 심사 기준…"
              className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <DialogPrimitive.Close
              aria-label="검색 닫기"
              className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {query.trim() === "" ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                궁금한 것을 검색해보세요 — 서류, 심사 기준, 강좌, 자주 묻는 질문까지 찾을 수 있어요.
              </p>
            ) : results.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                "{query}"에 대한 검색 결과가 없어요.
              </p>
            ) : (
              <ul>
                {results.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      to={entry.to}
                      onClick={() => onOpenChange(false)}
                      className="block rounded-xl px-3 py-3 transition-colors hover:bg-primary-soft/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          {entry.category}
                        </span>
                        <span className="text-sm font-semibold text-foreground">{entry.title}</span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{entry.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
