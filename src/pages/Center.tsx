import { Link } from "react-router-dom";
import { ClipboardList, FileCheck, MapPin, ShieldCheck } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { CENTER_ASSURANCE, CENTER_ENTRIES, CENTER_HERO } from "@/content/center";
import { CONTACT_HOURS, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/content/footer";

const ICONS = { ClipboardList, MapPin, FileCheck } as const;

// 축복센터 허브 `/center` — 6축 개편 §4.6.
export default function Center() {
  return (
    <>
      <SEO path="/center" />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 text-center md:px-8 md:pt-24">
        <EyebrowLabel>{CENTER_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mx-auto mt-4 max-w-3xl text-[28px] font-bold leading-[1.3] text-foreground md:text-[40px]">
          {CENTER_HERO.title}
        </h1>
        <p className="prose-copy mx-auto mt-5 text-[15px] md:text-[17px]">{CENTER_HERO.body}</p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <ul className="grid gap-6 md:grid-cols-3">
          {CENTER_ENTRIES.map((entry, index) => {
            const Icon = ICONS[entry.icon];
            return (
              <li
                key={entry.id}
                className="animate-fade-in-up flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary-deep"
                >
                  <Icon className="h-6 w-6" />
                </span>
                <p className="eyebrow mt-5 text-accent-deep">{entry.badge}</p>
                <h2 className="mt-2 text-xl font-bold text-foreground">{entry.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-[1.75] text-muted-foreground">
                  {entry.description}
                </p>
                <Button
                  asChild
                  variant={entry.id === "apply" ? "default" : "outline"}
                  className="mt-6 w-full"
                >
                  <Link to={entry.to}>{entry.cta}</Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bg-muted/60 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary-deep" aria-hidden="true" />
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              {CENTER_ASSURANCE.title}
            </h2>
          </div>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {CENTER_ASSURANCE.items.map((item) => (
              <li key={item.title} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-muted-foreground">
            온라인 신청이 어려우시면{" "}
            <a href={CONTACT_PHONE_TEL} className="font-medium text-primary-deep hover:underline">
              {CONTACT_PHONE_DISPLAY}
            </a>
            로 전화 주세요. {CONTACT_HOURS}
          </p>
        </div>
      </section>
    </>
  );
}
