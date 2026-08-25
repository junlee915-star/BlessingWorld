import { Link } from "react-router-dom";

import { LogoMark } from "@/components/common/LogoMark";
import { BRAND } from "@/content/nav";
import { FOOTER_CONTENT } from "@/content/footer";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/60">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-bold text-foreground">{BRAND.name}</span>
        </Link>
        <p className="mt-5 max-w-prose text-sm leading-[1.8] text-muted-foreground">
          {FOOTER_CONTENT.description}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_CONTENT.blocks.map((block) => (
            <div key={block.title}>
              <p className="eyebrow text-accent">{block.title}</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-[1.7] text-foreground/80">
                {block.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>{FOOTER_CONTENT.copyright}</span>
          <div className="flex gap-5">
            {FOOTER_CONTENT.legalLinks.map((link) => (
              <Link key={link.path} to={link.path} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
