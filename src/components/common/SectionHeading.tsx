import { cn } from "@/lib/utils";
import { EyebrowLabel } from "./EyebrowLabel";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  tone?: "primary" | "accent" | "light";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "accent",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <EyebrowLabel tone={tone}>{eyebrow}</EyebrowLabel>
      <h2 className="max-w-prose text-[28px] font-bold leading-[1.35] text-foreground md:text-[30px]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-prose text-[15px] leading-[1.75] text-muted-foreground md:text-[17px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
