import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Search, User } from "lucide-react";

import { LogoMark } from "@/components/common/LogoMark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SiteSearchDialog } from "@/components/search/SiteSearchDialog";
import { BRAND, NAV_ITEMS, PRIMARY_CTA, SCHEDULES_NAV_ITEM, type NavItem } from "@/content/nav";
import { fetchPublishedEvents } from "@/lib/events";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

/** 이 항목(또는 하위 항목 중 하나)의 경로에 지금 있는지 — §14 개선안 §14.6 "알아보기" 드롭다운은
 * 하위 3페이지 중 어디에 있든 활성 표시가 되어야 합니다. */
function isNavItemActive(item: NavItem, pathname: string): boolean {
  const paths = item.children ? item.children.map((c) => c.path) : [item.path];
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  // GNB 4개 항목(§14 개선안 §14.6)과 별개인 계정 진입점 — §/login, §/mypage.
  const { session, profile } = useAuth();
  const accountLink = session
    ? { to: "/mypage", label: profile?.displayName ? `${profile.displayName}님` : "마이페이지" }
    : { to: "/login", label: "로그인" };

  // §14 개선안 P-13 — 등록된 일정이 있을 때만 GNB에 "일정·공지"를 붙입니다(AC 요건).
  const [hasEvents, setHasEvents] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetchPublishedEvents().then((events) => {
      if (!cancelled) setHasEvents(events.length > 0);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const navItems = hasEvents ? [...NAV_ITEMS, SCHEDULES_NAV_ITEM] : NAV_ITEMS;

  // 사이트 내 검색(§14 개선안 §14.6) — Cmd/Ctrl+K로도 어디서든 열 수 있게 합니다.
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
          {navItems.map((item) =>
            item.children ? (
              <div key={item.path} className="group relative">
                <Link
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-1 whitespace-nowrap py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-primary-deep lg:text-[15px]",
                    isNavItemActive(item, pathname) &&
                      "text-primary after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:rounded-full after:bg-primary",
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                    aria-hidden="true"
                  />
                </Link>
                <div className="invisible absolute left-0 top-full z-10 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div
                    role="menu"
                    aria-label={item.label}
                    className="min-w-[168px] rounded-xl border border-border bg-card p-1.5 shadow-lg"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        role="menuitem"
                        className={cn(
                          "block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary-soft hover:text-primary-deep",
                          (pathname === child.path || pathname.startsWith(`${child.path}/`)) &&
                            "bg-primary-soft text-primary-deep",
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
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
            ),
          )}
        </nav>

        <button
          type="button"
          aria-label="검색 (Ctrl+K)"
          onClick={() => setSearchOpen(true)}
          className="hidden h-9 w-9 items-center justify-center rounded-full text-foreground/75 transition hover:bg-muted hover:text-primary-deep md:flex"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>

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

        <button
          type="button"
          aria-label="검색"
          onClick={() => setSearchOpen(true)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          <Search className="h-5 w-5" />
        </button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="메뉴 열기"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
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
              {navItems.map((item) => (
                <div key={item.path}>
                  <SheetClose asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "block rounded-lg px-3 py-3 text-base font-medium text-foreground/80 transition hover:bg-muted",
                          isActive && "bg-primary-soft text-primary-deep",
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </SheetClose>
                  {item.children ? (
                    <div className="ml-4 flex flex-col gap-0.5 border-l border-border pl-3">
                      {item.children.map((child) => (
                        <SheetClose asChild key={child.path}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              cn(
                                "rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted",
                                isActive && "bg-primary-soft text-primary-deep",
                              )
                            }
                          >
                            {child.label}
                          </NavLink>
                        </SheetClose>
                      ))}
                    </div>
                  ) : null}
                </div>
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

      <SiteSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
