import { Check } from "lucide-react";

import { TRUST_BADGES } from "@/content/guide";
import { cn } from "@/lib/utils";

export function TrustBadges({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6", className)}>
      {TRUST_BADGES.map((badge) => (
        <li key={badge} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-accent-foreground">
            <Check className="h-3 w-3" aria-hidden="true" />
          </span>
          {badge}
        </li>
      ))}
    </ul>
  );
}
