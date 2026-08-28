import { cn } from "@/lib/utils";

// §logo/ 원본 브랜드 자산 — public/logo/blessingworld-lockup-dark.png
// (밝은 배경용 가로 조합 로고: 지구본 심볼 + BLESSING WORLD + 블레싱월드).
// 어두운 배경에는 -lockup-light.png를 쓰세요. 아이콘만 필요하면 §symbol-dark.png.
// GitHub Pages처럼 "/"가 아닌 하위 경로(§vite.config.ts의 VITE_BASE_PATH)에 배포될 때도
// 깨지지 않도록 BASE_URL을 앞에 붙입니다.
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo/blessingworld-lockup-dark.png`}
      alt=""
      aria-hidden="true"
      className={cn("h-9 w-auto shrink-0 object-contain", className)}
    />
  );
}
