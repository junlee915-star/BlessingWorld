#!/usr/bin/env node
// artifact-preview.html 을 생성합니다 — Claude Artifact처럼 임의 경로에 정적
// 파일 하나로 서빙되는 곳에 공유하기 위한 단일 파일 번들입니다.
//
// 실제 배포(Vercel/Netlify/자체 서버 등)에는 이 스크립트가 필요 없습니다.
// 그냥 `npm run build`(BrowserRouter + 원격 이미지)를 쓰세요.
//
// 이 스크립트가 하는 일:
//   1. VITE_USE_HASH_ROUTER=true 로 별도 빌드 — 아티팩트는 "/"가 아닌 임의
//      경로에 서빙되므로 BrowserRouter 대신 HashRouter가 필요합니다.
//   2. 빌드 결과 JS에서 참조하는 모든 원격(Unsplash) 이미지 URL을 자동으로
//      찾아 다운로드한 뒤 base64 data URI로 치환 — 아티팩트 CSP는 외부
//      이미지 요청을 막기 때문입니다(Google Fonts만 예외).
//   3. CSS+JS를 인라인한 단일 HTML(`artifact-preview.html`)을 프로젝트
//      루트에 씁니다. Artifact 도구로 이 파일을 publish하면 됩니다.
//
// 실행: node scripts/build-artifact-preview.mjs

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(projectDir, "dist");
const distAssetsDir = join(distDir, "assets");
const cacheDir = join(projectDir, "scripts", ".image-cache");
const outPath = join(projectDir, "artifact-preview.html");

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd: projectDir, stdio: "inherit", env: { ...process.env, VITE_USE_HASH_ROUTER: "true" } });
}

// 1. 아티팩트용 빌드 (해시 라우터)
run("npx vite build");

const files = readdirSync(distAssetsDir);
const jsFile = files.find((f) => f.endsWith(".js"));
const cssFile = files.find((f) => f.endsWith(".css"));
if (!jsFile || !cssFile) throw new Error("dist/assets 에서 JS/CSS 번들을 찾지 못했습니다.");

let js = readFileSync(join(distAssetsDir, jsFile), "utf-8");
const css = readFileSync(join(distAssetsDir, cssFile), "utf-8");

// 2. 번들에 박혀있는 원격 이미지 URL을 전부 찾아 data URI로 치환
const urlPattern = /https:\/\/images\.unsplash\.com\/[^"'\\)]+/g;
const urls = [...new Set(js.match(urlPattern) ?? [])];
console.log(`발견한 원격 이미지 ${urls.length}개, 다운로드 중...`);

if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

for (const url of urls) {
  const cacheKey = Buffer.from(url).toString("base64url") + ".jpg";
  const cachePath = join(cacheDir, cacheKey);

  let bin;
  if (existsSync(cachePath)) {
    bin = readFileSync(cachePath);
  } else {
    // 아티팩트 페이로드 절약을 위해 원본보다 작고 압축된 버전을 받습니다.
    const compact = url.replace(/([?&])(w|q)=\d+/g, "").replace(/\?$/, "") + "&w=1200&q=55&fm=jpg";
    const res = await fetch(compact);
    if (!res.ok) throw new Error(`이미지 다운로드 실패: ${url} (${res.status})`);
    bin = Buffer.from(await res.arrayBuffer());
    writeFileSync(cachePath, bin);
  }

  const dataUri = `data:image/jpeg;base64,${bin.toString("base64")}`;
  js = js.split(url).join(dataUri);
}

const remaining = (js.match(/images\.unsplash\.com/g) ?? []).length;
if (remaining > 0) {
  console.warn(`경고: 치환되지 않은 원격 이미지 참조가 ${remaining}건 남아있습니다.`);
}

// 3. 단일 HTML 조립 (doctype/html/head/body 없이 — Artifact 도구가 감싸줌)
const title = "블레싱월드";
const description = "축복결혼·가정생활 통합 안내 서비스 블레싱월드 미리보기";

const html = `<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;

writeFileSync(outPath, html, "utf-8");
const sizeMB = (Buffer.byteLength(html, "utf-8") / (1024 * 1024)).toFixed(2);
console.log(`완료: ${outPath} (${sizeMB} MB)`);
