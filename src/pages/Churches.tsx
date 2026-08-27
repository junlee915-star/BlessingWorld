import { useEffect, useMemo, useState } from "react";
import { MapPin, Phone, User } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CHURCH_FINDER_COPY } from "@/content/churches";
import type { Church } from "@/content/churches";
import { fetchPublishedChurches } from "@/lib/churches";
import { CONTACT_HOURS, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/content/footer";

const selectClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

// 지역가정교회 `/churches` — 가정민원실을 대체(§13.1). 지역(시·도/시·군·구)으로 가까운
// 가정교회를 찾아 연락처를 안내하는 디렉터리만 제공합니다.
export default function Churches() {
  const [churches, setChurches] = useState<Church[] | null>(null);
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchPublishedChurches().then((data) => {
      if (!cancelled) setChurches(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sidoOptions = useMemo(() => {
    if (!churches) return [];
    return [...new Set(churches.map((c) => c.regionSido))].sort((a, b) => a.localeCompare(b, "ko"));
  }, [churches]);

  const sigunguOptions = useMemo(() => {
    if (!churches || !sido) return [];
    return [...new Set(churches.filter((c) => c.regionSido === sido).map((c) => c.regionSigungu))].sort(
      (a, b) => a.localeCompare(b, "ko"),
    );
  }, [churches, sido]);

  const results = useMemo(() => {
    if (!churches || !sido) return [];
    return churches.filter((c) => c.regionSido === sido && (!sigungu || c.regionSigungu === sigungu));
  }, [churches, sido, sigungu]);

  return (
    <>
      <SEO path="/center/churches" />

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        <SectionHeading
          eyebrow={CHURCH_FINDER_COPY.eyebrow}
          title={CHURCH_FINDER_COPY.title}
          description={CHURCH_FINDER_COPY.body}
        />

        <div className="mt-8 grid gap-4 sm:max-w-md sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">{CHURCH_FINDER_COPY.sidoLabel}</span>
            <select
              className={selectClass}
              value={sido}
              disabled={!churches}
              onChange={(e) => {
                setSido(e.target.value);
                setSigungu("");
              }}
            >
              <option value="">{CHURCH_FINDER_COPY.placeholder}</option>
              {sidoOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">{CHURCH_FINDER_COPY.sigunguLabel}</span>
            <select
              className={selectClass}
              value={sigungu}
              disabled={!sido}
              onChange={(e) => setSigungu(e.target.value)}
            >
              <option value="">전체</option>
              {sigunguOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {sido ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {results.length > 0 ? (
              results.map((church) => (
                <div key={church.id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-deep">
                    {church.regionSido} {church.regionSigungu}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold text-foreground">{church.name}</h3>
                  <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {church.address ? (
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <dd>{church.address}</dd>
                      </div>
                    ) : null}
                    {church.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <dd>
                          <a
                            href={`tel:${church.phone.replace(/-/g, "")}`}
                            className="font-semibold text-primary-deep hover:underline"
                          >
                            {church.phone}
                          </a>
                        </dd>
                      </div>
                    ) : null}
                    {church.contactName ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <dd>{church.contactName}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground sm:col-span-2">
                {CHURCH_FINDER_COPY.emptyResult}
              </p>
            )}
          </div>
        ) : null}

        <p className="mt-10 text-sm text-muted-foreground">
          목록에 없는 지역이거나 더 궁금한 점이 있으시면 대표 연락처{" "}
          <a href={CONTACT_PHONE_TEL} className="font-semibold text-primary-deep hover:underline">
            {CONTACT_PHONE_DISPLAY}
          </a>
          ({CONTACT_HOURS})로 문의해주세요.
        </p>
      </section>
    </>
  );
}
