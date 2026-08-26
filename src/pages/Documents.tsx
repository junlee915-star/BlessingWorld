import { Link } from "react-router-dom";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentChecklist } from "@/components/documents/DocumentChecklist";
import { DOCUMENT_CATEGORIES, DOCUMENTS_FINAL_CTA, DOCUMENTS_HERO } from "@/content/documents";

export default function Documents() {
  return (
    <>
      <SEO path="/documents" />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
        <EyebrowLabel>{DOCUMENTS_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 max-w-2xl text-[28px] font-bold leading-[1.3] text-foreground md:text-[40px]">
          {DOCUMENTS_HERO.title}
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground md:text-base">
          {DOCUMENTS_HERO.body}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <Tabs defaultValue={DOCUMENT_CATEGORIES[0].id}>
          <TabsList>
            {DOCUMENT_CATEGORIES.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {DOCUMENT_CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <DocumentChecklist category={category} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="bg-muted/60 py-16 md:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-5 text-center md:px-8">
          <h2 className="text-2xl font-bold text-foreground">{DOCUMENTS_FINAL_CTA.title}</h2>
          <p className="mt-3 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
            {DOCUMENTS_FINAL_CTA.body}
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to={DOCUMENTS_FINAL_CTA.cta.to}>{DOCUMENTS_FINAL_CTA.cta.label}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
