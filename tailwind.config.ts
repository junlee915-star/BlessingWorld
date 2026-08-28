import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1152px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary-soft))",
          deep: "hsl(var(--primary-deep))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          soft: "hsl(var(--accent-soft))",
          deep: "hsl(var(--accent-deep))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "0 0% 100%",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
      },
      // DESIGN.md의 rounded 스케일(sm 0.125rem/DEFAULT 0.25rem/md 0.375rem/lg 0.5rem/xl 0.75rem)이
      // Tailwind 기본 스케일과 정확히 같아서 커스텀 오버라이드 없이 기본값을 그대로 씁니다.
      fontFamily: {
        // 본문/기능적 텍스트 — Plus Jakarta Sans(라틴)는 한글 글리프가 없어 Noto Sans KR로 보완.
        sans: ["Plus Jakarta Sans", "Noto Sans KR", "system-ui", "sans-serif"],
        // 헤드라인/인용구 — Noto Serif KR(한글)·Noto Serif(라틴).
        serif: ["Noto Serif KR", "Noto Serif", "serif"],
      },
      maxWidth: {
        prose: "62ch",
      },
      boxShadow: {
        // 톤온톤 카드 그림자 — Primary Purple을 낮은 불투명도로 은은하게.
        card: "0 8px 30px -12px rgba(79, 55, 138, 0.14)",
        // 고우선순위 카드용 앰비언트 글로우 — 매우 넓고 옅게 퍼지는 형태.
        glow: "0 32px 80px -16px rgba(103, 80, 164, 0.1)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
