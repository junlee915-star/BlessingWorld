import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 사람 이름의 가운데 글자를 가립니다 — 듀오 성혼 인터뷰의 "곽*훈" 표기 방식(6축 개편 §4.3).
 * 두 글자 이름은 마지막 글자만, 세 글자 이상은 첫·끝 글자만 남깁니다.
 */
export function maskPersonName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length <= 1) return trimmed;
  if (trimmed.length === 2) return `${trimmed[0]}*`;
  return `${trimmed[0]}${"*".repeat(trimmed.length - 2)}${trimmed[trimmed.length - 1]}`;
}

/**
 * "김민수·이지은 가정"처럼 여러 이름이 붙은 표기를 통째로 마스킹합니다.
 * "가정"·"부부" 같은 꼬리말은 그대로 둡니다. 이미 "김ㅇㅇ"처럼 익명 처리된 값도
 * 한 번 더 마스킹되어 문제되지 않습니다.
 */
export function maskFamilyName(familyName: string): string {
  const SUFFIXES = ["가정", "부부"];
  return familyName
    .split(/[·,]/)
    .map((token) => {
      const raw = token.trim();
      if (!raw) return raw;
      const suffix = SUFFIXES.find((item) => raw.endsWith(item));
      const core = suffix ? raw.slice(0, -suffix.length).trim() : raw;
      const masked = maskPersonName(core);
      return suffix ? `${masked} ${suffix}` : masked;
    })
    .filter(Boolean)
    .join("·");
}
