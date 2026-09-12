import { Link, useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { ComingSoon } from "@/components/common/ComingSoon";
import { STORYBOOKS } from "@/content/storybooks";

const GENDER_LABEL: Record<string, string> = { male: "남성", female: "여성" };

// 그림책(6컷 내레이션) 형식의 스토리북 리더. 축복의 씨앗 "축복의 의미와 가치" 각
// STEP에서 남성/여성을 고르면 들어온다. 나머지 사이트와는 결이 다른 '읽는 경험'이라
// 이 페이지 전용 타이포그래피/팔레트를 scoped <style>로 따로 둔다(다른 페이지의
// Tailwind 토큰과 섞이지 않도록 전부 .storybook-reader 아래로 스코프).
export default function StorybookDetail() {
  const { no, gender } = useParams();
  const genderLabel = gender ? GENDER_LABEL[gender] : undefined;
  const book = STORYBOOKS.find((b) => b.stepNo === no && b.gender === gender);

  if (!genderLabel || !book) {
    return (
      <>
        <SEO path="/guide" noindex />
        <ComingSoon
          icon={BookOpen}
          title="스토리북을 찾을 수 없어요"
          description="요청하신 이야기를 아직 준비하고 있어요. 곧 만나보실 수 있습니다."
          backTo={{ label: "축복의 씨앗으로 돌아가기", to: "/guide" }}
        />
      </>
    );
  }

  return (
    <>
      <SEO
        path={`/guide/storybook/${book.stepNo}/${book.gender}`}
        title={`${book.bylineTitle} — 축복의 의미`}
        description={book.lede}
        noindex
      />

      <style>{`
        .storybook-reader {
          --paper: #FDFBF8;
          --ink: #2E2836;
          --muted: #7A7385;
          --lavender: #7B5EAF;
          --gold: #B58C3C;
          --hair: #E4DDD3;
          --frame: rgba(46, 40, 54, 0.10);
          --serif: 'Nanum Myeongjo', 'Apple SD Gothic Neo', 'Noto Serif KR', serif;
          background: var(--paper);
          color: var(--ink);
          word-break: keep-all;
        }
        .storybook-reader .wrap {
          max-width: 620px;
          margin-inline: auto;
          padding-inline: 20px;
          padding-block: 56px 72px;
        }
        .storybook-reader .eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: var(--gold);
          margin: 0 0 18px;
        }
        .storybook-reader .step {
          font-family: var(--serif);
          font-size: clamp(26px, 7vw, 33px);
          font-weight: 700;
          line-height: 1.38;
          letter-spacing: -0.01em;
          text-wrap: balance;
          margin: 0 0 16px;
          white-space: pre-line;
        }
        .storybook-reader .lede {
          font-size: 15px;
          line-height: 1.85;
          color: var(--muted);
          max-width: 34em;
          margin: 0 0 30px;
        }
        .storybook-reader .byline {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-block: 16px;
          border-block: 1px solid var(--hair);
          font-size: 12.5px;
          color: var(--muted);
        }
        .storybook-reader .byline b {
          font-family: var(--serif);
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
        }
        .storybook-reader .byline .dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--hair);
          flex: none;
        }
        .storybook-reader .panels {
          display: flex;
          flex-direction: column;
          gap: 68px;
          margin-block: 56px 0;
        }
        .storybook-reader figure {
          margin: 0;
        }
        .storybook-reader .marker {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 14px;
        }
        .storybook-reader .marker .n {
          font-family: var(--serif);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--gold);
        }
        .storybook-reader .marker .rule {
          flex: 1 1 auto;
          height: 1px;
          background: var(--hair);
          transform: translateY(-4px);
        }
        .storybook-reader .marker .t {
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--muted);
        }
        .storybook-reader img {
          display: block;
          width: 100%;
          height: auto;
          max-width: 100%;
          border-radius: 4px;
          box-shadow: 0 0 0 1px var(--frame);
        }
        .storybook-reader .nar {
          font-family: var(--serif);
          font-size: clamp(16px, 4.4vw, 18px);
          line-height: 1.95;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 22px 0 0;
          padding-left: 2px;
          max-width: 30em;
          white-space: pre-line;
        }
        .storybook-reader .nar.lead-in {
          color: var(--muted);
        }
        .storybook-reader .quote {
          margin: 26px 0 0;
          padding-left: 18px;
          border-left: 2px solid var(--lavender);
        }
        .storybook-reader .quote p {
          font-family: var(--serif);
          font-size: clamp(18px, 5.2vw, 21px);
          font-weight: 700;
          line-height: 1.75;
          color: var(--ink);
          margin: 0 0 10px;
          white-space: pre-line;
        }
        .storybook-reader .quote .who {
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.14em;
          color: var(--lavender);
        }
        .storybook-reader .final {
          position: relative;
        }
        .storybook-reader .final .sky {
          position: absolute;
          inset: 0 0 auto 0;
          padding: clamp(26px, 7%, 52px) clamp(22px, 7%, 46px) 0;
          text-align: center;
        }
        .storybook-reader .final .sky p {
          font-family: var(--serif);
          font-size: clamp(19px, 5.6vw, 25px);
          font-weight: 700;
          line-height: 1.58;
          letter-spacing: -0.015em;
          color: #322D3B;
          text-wrap: balance;
          margin: 0;
          white-space: pre-line;
        }
        .storybook-reader .final .sky .mark {
          display: block;
          width: 26px;
          height: 1px;
          margin: 0 auto 16px;
          background: #B58C3C;
        }
        .storybook-reader .close {
          margin-top: 72px;
          padding-top: 40px;
          border-top: 1px solid var(--hair);
          text-align: center;
        }
        .storybook-reader .close h2 {
          font-family: var(--serif);
          font-size: clamp(19px, 5.2vw, 22px);
          font-weight: 700;
          line-height: 1.6;
          text-wrap: balance;
          margin: 0 0 14px;
          white-space: pre-line;
        }
        .storybook-reader .close p {
          font-size: 14.5px;
          line-height: 1.9;
          color: var(--muted);
          max-width: 30em;
          margin: 0 auto 28px;
        }
        .storybook-reader .cta {
          display: inline-block;
          padding: 15px 30px;
          border-radius: 999px;
          background: var(--lavender);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          min-height: 48px;
          transition: opacity 0.2s ease;
        }
        .storybook-reader .cta:hover {
          opacity: 0.88;
        }
        .storybook-reader .cta:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 3px;
        }
        .storybook-reader .badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px 18px;
          margin-top: 22px;
          font-size: 12px;
          color: var(--muted);
        }
        .storybook-reader .next {
          margin-top: 44px;
          padding: 20px 22px;
          border: 1px solid var(--hair);
          border-radius: 10px;
          text-align: left;
        }
        .storybook-reader .next .label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--gold);
        }
        .storybook-reader .next .title {
          font-family: var(--serif);
          font-size: 17px;
          font-weight: 700;
          margin-top: 8px;
        }
        .storybook-reader .next .sub {
          font-size: 13px;
          line-height: 1.75;
          color: var(--muted);
          margin-top: 6px;
        }
        .storybook-reader .back {
          display: inline-block;
          margin-bottom: 28px;
          font-size: 13px;
          color: var(--muted);
        }
        .storybook-reader .prev {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 10px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
        }
        .storybook-reader .prev:hover {
          color: var(--lavender);
        }
        .storybook-reader .next.linked {
          text-decoration: none;
          color: inherit;
          display: block;
          transition: border-color 0.2s ease;
        }
        .storybook-reader .next.linked:hover {
          border-color: var(--lavender);
        }
        .storybook-reader .series {
          margin-top: 52px;
          text-align: left;
        }
        .storybook-reader .series .label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--gold);
          margin-bottom: 14px;
        }
        .storybook-reader .series ol {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .storybook-reader .series a,
        .storybook-reader .series .current {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding: 15px 4px;
          border-bottom: 1px solid var(--hair);
          text-decoration: none;
          color: inherit;
        }
        .storybook-reader .series li:first-child a,
        .storybook-reader .series li:first-child .current {
          border-top: 1px solid var(--hair);
        }
        .storybook-reader .series a:hover .name {
          color: var(--lavender);
        }
        .storybook-reader .series .no {
          flex: none;
          font-family: var(--serif);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--gold);
        }
        .storybook-reader .series .name {
          font-family: var(--serif);
          font-size: 16px;
          font-weight: 700;
          transition: color 0.2s ease;
        }
        .storybook-reader .series .tag {
          margin-left: auto;
          flex: none;
          font-size: 11px;
          font-weight: 500;
          color: var(--muted);
        }
        .storybook-reader .series .current .name {
          color: var(--muted);
        }
        @media (max-width: 420px) {
          .storybook-reader .panels {
            gap: 54px;
          }
          .storybook-reader .wrap {
            padding-block: 44px 60px;
          }
        }
      `}</style>

      <div className="storybook-reader">
        <div className="wrap">
          <Link to="/guide" className="back">
            ← 축복의 씨앗으로
          </Link>

          <header>
            {book.prev ? (
              <Link to={book.prev.to} className="prev">
                ← {book.prev.title}
              </Link>
            ) : null}
            <p className="eyebrow">{book.eyebrow}</p>
            <h1 className="step">{book.stepTitle}</h1>
            <p className="lede">{book.lede}</p>
            <div className="byline">
              <b>{book.bylineTitle}</b>
              {book.bylineMeta.map((meta) => (
                <span key={meta} style={{ display: "contents" }}>
                  <span className="dot" aria-hidden="true" />
                  <span>{meta}</span>
                </span>
              ))}
            </div>
          </header>

          <div className="panels">
            {book.panels.map((panel, i) => {
              const isLast = i === book.panels.length - 1;
              return (
                <figure key={panel.no} className={isLast ? "final" : undefined}>
                  <div className="marker">
                    <span className="n">{panel.no}</span>
                    <span className="t">{panel.label}</span>
                    <span className="rule" aria-hidden="true" />
                  </div>
                  <img src={panel.image} alt={panel.imageAlt} loading={i === 0 ? "eager" : "lazy"} />
                  {panel.narration ? (
                    <figcaption className={panel.narrationMuted ? "nar lead-in" : "nar"}>
                      {panel.narration}
                    </figcaption>
                  ) : null}
                  {panel.quote ? (
                    <figcaption className="quote">
                      <p>
                        {panel.quote.lines.map((line, li) => (
                          <span key={li}>
                            {line}
                            {li < panel.quote!.lines.length - 1 ? <br /> : null}
                          </span>
                        ))}
                      </p>
                      <span className="who">{panel.quote.who}</span>
                    </figcaption>
                  ) : null}
                  {panel.overlay ? (
                    <div className="sky">
                      <span className="mark" aria-hidden="true" />
                      <p>{panel.overlay}</p>
                    </div>
                  ) : null}
                </figure>
              );
            })}
          </div>

          <div className="close">
            <h2>{book.closing.title}</h2>
            <p>{book.closing.body}</p>
            <Link to={book.closing.ctaTo} className="cta">
              {book.closing.ctaLabel}
            </Link>
            <div className="badges">
              {book.closing.badges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>

            {book.next ? (
              book.next.to ? (
                <Link to={book.next.to} className="next linked">
                  <div className="label">{book.next.label}</div>
                  <div className="title">{book.next.title}</div>
                  <div className="sub">{book.next.sub}</div>
                </Link>
              ) : (
                <div className="next">
                  <div className="label">{book.next.label}</div>
                  <div className="title">{book.next.title}</div>
                  <div className="sub">{book.next.sub}</div>
                </div>
              )
            ) : null}

            {book.series ? (
              <nav className="series" aria-label="축복의 의미 시리즈 목차">
                <div className="label">{book.series.label}</div>
                <ol>
                  {book.series.items.map((item) =>
                    item.current ? (
                      <li key={item.no}>
                        <div className="current">
                          <span className="no">{item.no}</span>
                          <span className="name">{item.name}</span>
                          <span className="tag">지금 이 편</span>
                        </div>
                      </li>
                    ) : (
                      <li key={item.no}>
                        <Link to={item.to}>
                          <span className="no">{item.no}</span>
                          <span className="name">{item.name}</span>
                          <span className="tag">다시 읽기</span>
                        </Link>
                      </li>
                    ),
                  )}
                </ol>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
