import { Link } from "react-router-dom";

import { SectionHeading } from "@/components/common/SectionHeading";
import {
  STORYBOOK_CHARACTERS_HEADING,
  STORYBOOK_FAMILY_CHARACTER,
  STORYBOOK_PROTAGONISTS,
} from "@/content/storybooks";

const ALL_CHARACTERS = [...STORYBOOK_PROTAGONISTS, STORYBOOK_FAMILY_CHARACTER];

// "축복의 의미와 가치"(BlessingMeaning) 바로 아래에서 스토리북 주인공(지호/지우)과
// 지호의 가족을 한 줄 3장으로 소개한다. 사진은 인물 소개용 레퍼런스 시트를 그대로 쓴다.
export function StorybookCharacters() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <SectionHeading
        eyebrow={STORYBOOK_CHARACTERS_HEADING.eyebrow}
        title={STORYBOOK_CHARACTERS_HEADING.title}
        description={STORYBOOK_CHARACTERS_HEADING.lead}
        align="center"
      />

      <ul className="mt-10 grid gap-5 sm:grid-cols-3">
        {ALL_CHARACTERS.map((character) => {
          const content = (
            <>
              <img
                src={character.image}
                alt={character.imageAlt}
                loading="lazy"
                className="aspect-square w-full object-cover object-top"
              />
              <div className="p-5">
                <span className="text-xs font-semibold tracking-wide text-primary-deep">
                  {character.role}
                </span>
                <h3 className="mt-2 text-base font-semibold text-foreground">{character.name}</h3>
                <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">
                  {character.description}
                </p>
              </div>
            </>
          );

          return (
            <li
              key={character.name}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-lg"
            >
              {character.to ? (
                <Link to={character.to} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
