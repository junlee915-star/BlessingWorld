interface ArticleSection {
  heading: string;
  body: string;
}

interface ArticleSectionsProps {
  sections: ArticleSection[];
}

// 부모 트랙 장문 서술형 콘텐츠(부모의 준비/자녀와 이야기하기) 공용 본문 레이아웃.
export function ArticleSections({ sections }: ArticleSectionsProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-5 md:px-8">
      {sections.map((section) => (
        <div key={section.heading}>
          <h2 className="text-lg font-bold text-foreground md:text-xl">{section.heading}</h2>
          <p className="mt-3 text-[15px] leading-[1.85] text-muted-foreground md:text-base">
            {section.body}
          </p>
        </div>
      ))}
    </div>
  );
}
