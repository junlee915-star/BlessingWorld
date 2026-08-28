import { cn } from "@/lib/utils";

// §logo/ 원본 브랜드 자산 — public/logo/blessingworld-symbol-dark.png
// (밝은 배경용, 라벤더 지구본 심볼). 어두운 배경에는 -symbol-light.png를 쓰세요.
// GitHub Pages처럼 "/"가 아닌 하위 경로(§vite.config.ts의 VITE_BASE_PATH)에 배포될 때도
// 깨지지 않도록 BASE_URL을 앞에 붙입니다.
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo/blessingworld-symbol-dark.png`}
      alt=""
      aria-hidden="true"
      className={cn("h-8 w-8 shrink-0 object-contain", className)}
    />
  );
}
