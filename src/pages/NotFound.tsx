import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SEO path="/404" />
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-24 text-center md:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary-deep">
          <Compass className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-foreground md:text-[28px]">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mt-3 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
          주소가 바뀌었거나 삭제된 페이지일 수 있습니다.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </section>
    </>
  );
}
