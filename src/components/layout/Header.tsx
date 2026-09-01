import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, User } from "lucide-react";

import { LogoMark } from "@/components/common/LogoMark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BRAND, NAV_ITEMS, PRIMARY_CTA } from "@/content/nav";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  // GNB 5개 항목(§2.3, AC-01)과 별개인 계정 진입점 — §/login, §/mypage.
  const { session, profile } = useAuth();
  const accountLink = session
    ? { to: "/mypage", label: profile?.displayName ? `${profile.displayName}님` : "마이페이지" }
    : { to: "/login", label: "로그인" };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-6xl items-center gap-8 px-5 md:px-8">
        <Link
          to="/"
          aria-label={BRAND.homeLabel}
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
        >
          <LogoMark />
        </Link>

        <nav aria-label="주 메뉴" className="ml-auto hidden items-center gap-5 lg:gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "relative whitespace-nowrap py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-primary-deep lg:text-[15px]",
                  isActive &&
                    "text-primary after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:rounded-full after:bg-primary",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to={accountLink.to}
          className="hidden items-center gap-1.5 text-sm font-medium text-foreground/75 transition-colors hover:text-primary-deep md:flex"
        >
          <User className="h-4 w-4" aria-hidden="true" />
          {accountLink.label}
        </Link>

        <Button asChild size="sm" className="ml-auto hidden md:inline-flex">
          <Link to={PRIMARY_CTA.to}>{PRIMARY_CTA.label}</Link>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="메뉴 열기"
              aria-expanded={open}
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="flex items-center">
              <LogoMark />
              <span className="sr-only">{BRAND.name}</span>
            </SheetTitle>
            <nav aria-label="모바일 메뉴" className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <SheetClose asChild key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "rounded-lg px-3 py-3 text-base font-medium text-foreground/80 transition hover:bg-muted",
                        isActive && "bg-primary-soft text-primary-deep",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </SheetClose>
              ))}
            </nav>
            <SheetClose asChild>
              <NavLink
                to={accountLink.to}
                className="flex items-center gap-1.5 rounded-lg px-3 py-3 text-base font-medium text-foreground/80 transition hover:bg-muted"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                {accountLink.label}
              </NavLink>
            </SheetClose>
            <SheetClose asChild>
              <Button asChild className="mt-2">
                <Link to={PRIMARY_CTA.to}>{PRIMARY_CTA.label}</Link>
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
