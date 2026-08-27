import { Link, useLocation } from "react-router-dom";

import { PRIMARY_CTA } from "@/content/nav";

// 모바일 고정 CTA 바(6축 개편 §4.1-8) — 듀오가 전 페이지에서 "간편상담신청"을 띄워두는 패턴.
// 신청 페이지 자신과 관리자 화면에서는 숨깁니다(중복·방해).
const HIDDEN_PREFIXES = ["/center/apply", "/admin", "/login", "/reset-password"];

export function MobileCtaBar() {
  const { pathname } = useLocation();
  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <div
      role="complementary"
      aria-label="축복상담 신청 바로가기"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md md:hidden"
    >
      <Link
        to={PRIMARY_CTA.to}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {PRIMARY_CTA.label}
      </Link>
    </div>
  );
}
