import { Link } from "react-router-dom";
import { BookOpen, CalendarDays, ClipboardList, HelpCircle, MessageCircle } from "lucide-react";

import { PARENTS_CARDS } from "@/content/parents";

const ICONS = { BookOpen, MessageCircle, ClipboardList, HelpCircle, CalendarDays } as const;

interface ParentsSiblingLinksProps {
  /** 현재 페이지의 PARENTS_CARDS id — 목록에서 제외합니다. */
  current: string;
}

// 참조 사이트(familymatching.info)의 "이 카테고리의 다른 기사" 패턴 — 부모 트랙 상세
// 페이지 하단에서 나머지 부모 트랙 콘텐츠로 계속 이어갈 수 있게 합니다.
export function ParentsSiblingLinks({ current }: ParentsSiblingLinksProps) {
  const siblings = PARENTS_CARDS.filter((card) => card.id !== current);

  return (
    <section className="mx-auto max-w-3xl border-t border-border px-5 py-12 md:px-8">
      <p className="eyebrow text-accent-deep">부모 트랙의 다른 페이지</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {siblings.map((card) => {
          const Icon = ICONS[card.icon];
          return (
            <li key={card.id}>
              <Link
                to={card.to}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary-soft/40"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary-deep" aria-hidden="true" />
                {card.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
