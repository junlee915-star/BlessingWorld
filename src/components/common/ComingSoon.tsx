import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  backTo?: { label: string; to: string };
}

// M1+M2 범위 밖(§11 M3~M4)의 화면을 위한 공통 준비중 플레이스홀더.
// 라우트/내비게이션 구조는 §2.1 사이트맵대로 전부 살아있도록 하되,
// 실제 폼/목록 로직은 이후 마일스톤에서 구현합니다.
export function ComingSoon({ icon: Icon = Construction, title, description, backTo }: ComingSoonProps) {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-5 py-24 text-center md:px-8">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-foreground md:text-[28px]">{title}</h1>
      <p className="mt-3 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
        {description}
      </p>
      {backTo ? (
        <Button asChild size="lg" className="mt-8">
          <Link to={backTo.to}>{backTo.label}</Link>
        </Button>
      ) : null}
    </section>
  );
}
