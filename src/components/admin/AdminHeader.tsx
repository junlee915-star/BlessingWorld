import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

// 6축 개편 §4.7 — 공개 사이트의 축 순서와 같게 정렬합니다(신청 관리만 매일 쓰는 화면이라 앞에).
const ADMIN_NAV = [
  { label: "신청 관리", path: "/admin/guidance" },
  { label: "행복의 꽃", path: "/admin/stories" },
  { label: "사랑의 기술", path: "/admin/curriculum" },
  { label: "축복로드맵", path: "/admin/roadmap" },
  { label: "지역가정교회", path: "/admin/churches" },
  { label: "홈 수치", path: "/admin/stats" },
  { label: "FAQ", path: "/admin/faq" },
  { label: "회원관리", path: "/admin/members" },
];

interface AdminHeaderProps {
  title: string;
  description: ReactNode;
}

/** /admin/* 관리 페이지 상단 공통 헤더 — 로그인 정보·로그아웃·페이지 간 이동. */
export function AdminHeader({ title, description }: AdminHeaderProps) {
  const { profile, signOut } = useAuth();

  return (
    <section className="mx-auto max-w-4xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <EyebrowLabel>ADMIN</EyebrowLabel>
          <h1 className="mt-4 text-[26px] font-bold leading-[1.3] text-foreground md:text-[34px]">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            {profile?.displayName ?? profile?.email}
            <span className="ml-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary-deep">
              {profile?.role}
            </span>
          </span>
          <Button variant="outline" size="sm" onClick={() => void signOut()}>
            <LogOut className="h-3.5 w-3.5" /> 로그아웃
          </Button>
        </div>
      </div>

      <p className="mt-3 max-w-prose text-sm leading-[1.75] text-muted-foreground">{description}</p>

      <nav aria-label="관리 메뉴" className="mt-6 flex flex-wrap gap-2">
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </section>
  );
}
