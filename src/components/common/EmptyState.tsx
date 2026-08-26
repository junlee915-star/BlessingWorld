import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: { label: string; to: string };
}

export function EmptyState({ icon: Icon, title, description, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/60 px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      {/* 유일한 현재 사용처(§pages/Stories.tsx)가 페이지 h1 바로 다음에 이 컴포넌트를 두고
          있어 h2여야 합니다(§9.1 heading-order, Lighthouse 실측) — 새 사용처를 추가할 때
          그 자리의 헤딩 레벨을 다시 확인해주세요. */}
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="max-w-prose text-sm leading-[1.75] text-muted-foreground">{description}</p>
      {cta ? (
        <Button asChild className="mt-2">
          <Link to={cta.to}>{cta.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}
