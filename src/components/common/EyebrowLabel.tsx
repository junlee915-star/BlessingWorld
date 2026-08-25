import { cn } from "@/lib/utils";

interface EyebrowLabelProps {
  children: React.ReactNode;
  tone?: "primary" | "accent" | "light";
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<EyebrowLabelProps["tone"]>, string> = {
  primary: "text-primary-deep",
  accent: "text-accent",
  light: "text-accent-soft",
};

export function EyebrowLabel({ children, tone = "accent", className }: EyebrowLabelProps) {
  return <p className={cn("eyebrow", TONE_CLASSES[tone], className)}>{children}</p>;
}
