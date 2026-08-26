import { cn } from "@/lib/utils";

interface EyebrowLabelProps {
  children: React.ReactNode;
  tone?: "primary" | "accent" | "light";
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<EyebrowLabelProps["tone"]>, string> = {
  primary: "text-primary-deep",
  // 밝은 배경(대부분의 페이지 상단 히어로) 전용 — 다크 배경에는 tone="light"를 쓰세요.
  accent: "text-accent-deep",
  light: "text-accent-soft",
};

export function EyebrowLabel({ children, tone = "accent", className }: EyebrowLabelProps) {
  return <p className={cn("eyebrow", TONE_CLASSES[tone], className)}>{children}</p>;
}
