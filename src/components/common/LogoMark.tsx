import { cn } from "@/lib/utils";

// 원본 로고 파일명(`mark-lavender.png`)을 참고해 라벤더 톤의 인라인 마크로 재구성.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-8 w-8 shrink-0", className)}
    >
      <circle cx="16" cy="16" r="16" fill="hsl(var(--primary))" />
      <path
        d="M16 8c1.8 2 2.8 4 2.8 5.8A2.8 2.8 0 1 1 13.2 13.8C13.2 12 14.2 10 16 8Z"
        fill="hsl(var(--primary-foreground))"
      />
      <path
        d="M16 15.5c2.7 1.6 4.6 3.4 5.4 5.1a3.1 3.1 0 1 1-5.4 3 3.1 3.1 0 1 1-5.4-3c.8-1.7 2.7-3.5 5.4-5.1Z"
        fill="hsl(var(--primary-foreground))"
        opacity="0.9"
      />
    </svg>
  );
}
