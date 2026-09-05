// "축복"이라는 나무가 씨앗에서 꽃까지 자라나는 모습을 8단계에 걸쳐 보여주는 배경 장식입니다.
// 실제 이미지 파일 대신 사이트 색상 토큰(primary/accent)만 쓰는 인라인 SVG라서 다크/라이트
// 전환이나 배포 크기 걱정 없이 단계별로 조금씩 더 무성해지는 나무를 그립니다.
// 순수 장식(aria-hidden)이므로 스크린리더/키보드 흐름에 영향을 주지 않습니다.

interface RoadmapTreeMotifProps {
  /** 1~8. 클수록 나무가 자란 모습입니다(1=씨앗, 8=만개). */
  stage: number;
  className?: string;
}

interface Dot {
  cx: number;
  cy: number;
  r: number;
}

interface StageConfig {
  trunkTop: number;
  trunkWidth: number;
  canopy: Dot[];
  /** 아직 피지 않은 봉오리 — 테두리만 그립니다. */
  buds: Dot[];
  /** 만개한 꽃 — 채워서 그립니다. */
  flowers: Dot[];
}

const GROUND_Y = 128;

// 단계가 오를수록 줄기가 자라고, 잎이 늘고, 봉오리가 꽃으로 바뀝니다.
const STAGE_CONFIG: Record<number, StageConfig> = {
  3: { trunkTop: 96, trunkWidth: 4, canopy: [{ cx: 50, cy: 90, r: 13 }], buds: [], flowers: [] },
  4: {
    trunkTop: 84,
    trunkWidth: 5,
    canopy: [
      { cx: 50, cy: 78, r: 15 },
      { cx: 39, cy: 87, r: 11 },
      { cx: 61, cy: 87, r: 11 },
    ],
    buds: [],
    flowers: [],
  },
  5: {
    trunkTop: 76,
    trunkWidth: 6,
    canopy: [
      { cx: 50, cy: 68, r: 18 },
      { cx: 35, cy: 79, r: 12 },
      { cx: 65, cy: 79, r: 12 },
    ],
    buds: [
      { cx: 40, cy: 62, r: 2.6 },
      { cx: 58, cy: 58, r: 2.6 },
      { cx: 50, cy: 78, r: 2.6 },
    ],
    flowers: [],
  },
  6: {
    trunkTop: 72,
    trunkWidth: 6,
    canopy: [
      { cx: 50, cy: 64, r: 19 },
      { cx: 33, cy: 77, r: 13 },
      { cx: 67, cy: 77, r: 13 },
    ],
    buds: [
      { cx: 38, cy: 58, r: 2.8 },
      { cx: 60, cy: 54, r: 2.8 },
      { cx: 50, cy: 44, r: 2.8 },
      { cx: 44, cy: 76, r: 2.8 },
      { cx: 62, cy: 74, r: 2.8 },
    ],
    flowers: [],
  },
  7: {
    trunkTop: 66,
    trunkWidth: 7,
    canopy: [
      { cx: 50, cy: 58, r: 21 },
      { cx: 31, cy: 73, r: 14 },
      { cx: 69, cy: 73, r: 14 },
    ],
    buds: [
      { cx: 46, cy: 40, r: 2.6 },
      { cx: 66, cy: 66, r: 2.6 },
    ],
    flowers: [
      { cx: 38, cy: 50, r: 3.2 },
      { cx: 58, cy: 46, r: 3.2 },
      { cx: 31, cy: 70, r: 3.2 },
      { cx: 65, cy: 80, r: 3.2 },
      { cx: 50, cy: 60, r: 3.2 },
    ],
  },
  8: {
    trunkTop: 60,
    trunkWidth: 8,
    canopy: [
      { cx: 50, cy: 52, r: 24 },
      { cx: 27, cy: 69, r: 15 },
      { cx: 73, cy: 69, r: 15 },
      { cx: 50, cy: 76, r: 14 },
    ],
    buds: [],
    flowers: [
      { cx: 38, cy: 42, r: 3.4 },
      { cx: 60, cy: 38, r: 3.4 },
      { cx: 21, cy: 65, r: 3.4 },
      { cx: 79, cy: 65, r: 3.4 },
      { cx: 50, cy: 30, r: 3.4 },
      { cx: 33, cy: 77, r: 3.4 },
      { cx: 67, cy: 81, r: 3.4 },
      { cx: 50, cy: 58, r: 3.4 },
      { cx: 46, cy: 86, r: 3.4 },
    ],
  },
};

const PRIMARY = "hsl(var(--primary))";
const ACCENT = "hsl(var(--accent))";
const ACCENT_DEEP = "hsl(var(--accent-deep))";

export function RoadmapTreeMotif({ stage, className }: RoadmapTreeMotifProps) {
  const clamped = Math.min(8, Math.max(1, Math.round(stage)));

  return (
    <svg viewBox="0 0 100 140" className={className} aria-hidden="true" focusable="false">
      {/* 땅 */}
      <ellipse cx="50" cy={GROUND_Y + 4} rx="28" ry="4" fill={PRIMARY} fillOpacity={0.08} />

      {clamped === 1 ? (
        // 1단계: 씨앗 — 아직 땅 위로 나오지 않은 시작점.
        <>
          <path
            d={`M 34 ${GROUND_Y} Q 50 ${GROUND_Y - 9} 66 ${GROUND_Y}`}
            stroke={PRIMARY}
            strokeOpacity={0.3}
            strokeWidth={2}
            fill="none"
          />
          <ellipse cx="50" cy={GROUND_Y - 3} rx="6" ry="4.5" fill={PRIMARY} fillOpacity={0.45} />
        </>
      ) : (
        <>
          {/* 줄기 */}
          <path
            d={`M 50 ${GROUND_Y} L 50 ${clamped === 2 ? 108 : STAGE_CONFIG[clamped].trunkTop}`}
            stroke={PRIMARY}
            strokeOpacity={0.4}
            strokeWidth={clamped === 2 ? 3 : STAGE_CONFIG[clamped].trunkWidth}
            strokeLinecap="round"
            fill="none"
          />

          {clamped === 2 ? (
            // 2단계: 새싹 — 잎 두 장만 펼칩니다.
            <>
              <path
                d="M 50 112 Q 40 108 38 100"
                stroke={PRIMARY}
                strokeOpacity={0.5}
                strokeWidth={3}
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 50 108 Q 60 103 62 95"
                stroke={PRIMARY}
                strokeOpacity={0.5}
                strokeWidth={3}
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              {STAGE_CONFIG[clamped].canopy.map((c, i) => (
                <circle
                  key={`canopy-${i}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill={PRIMARY}
                  fillOpacity={0.14}
                  stroke={PRIMARY}
                  strokeOpacity={0.3}
                />
              ))}
              {STAGE_CONFIG[clamped].buds.map((b, i) => (
                <circle
                  key={`bud-${i}`}
                  cx={b.cx}
                  cy={b.cy}
                  r={b.r}
                  fill="none"
                  stroke={ACCENT_DEEP}
                  strokeOpacity={0.55}
                  strokeWidth={1.4}
                />
              ))}
              {STAGE_CONFIG[clamped].flowers.map((f, i) => (
                <g key={`flower-${i}`}>
                  <circle cx={f.cx} cy={f.cy} r={f.r} fill={ACCENT} fillOpacity={0.75} />
                  <circle cx={f.cx} cy={f.cy} r={f.r * 0.4} fill={ACCENT_DEEP} fillOpacity={0.8} />
                </g>
              ))}
            </>
          )}
        </>
      )}
    </svg>
  );
}
