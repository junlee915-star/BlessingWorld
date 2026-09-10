import { PARENTS_PRINCIPLE } from "@/content/parents";

// 부모 트랙 전 페이지에서 반복 노출하는 "재촉하지 않는 태도" 배너(§14 개선안 P-12 콘텐츠 원칙).
export function ParentsPrincipleBand() {
  return (
    <section className="bg-muted/60 py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-5 text-center md:px-8">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">{PARENTS_PRINCIPLE.title}</h2>
        <p className="mt-4 text-[15px] leading-[1.8] text-muted-foreground md:text-base">
          {PARENTS_PRINCIPLE.body}
        </p>
      </div>
    </section>
  );
}
