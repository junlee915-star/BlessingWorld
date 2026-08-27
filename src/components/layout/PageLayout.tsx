import type { ReactNode } from "react";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileCtaBar } from "./MobileCtaBar";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        본문 바로가기
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      {/* 모바일 고정 CTA 바가 가리지 않도록 아래 여백을 둡니다(바 높이 72px + 여유). */}
      <div aria-hidden="true" className="h-[72px] md:hidden" />
      <MobileCtaBar />
    </div>
  );
}
