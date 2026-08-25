import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 프로젝트 사이트(https://<user>.github.io/<repo>/)처럼 "/"가 아닌
  // 하위 경로에 서빙할 때만 .github/workflows/deploy-pages.yml이 VITE_BASE_PATH를
  // 채워줍니다. 로컬 dev/build(npm run dev, npm run build)는 그대로 "/"를 씁니다.
  base: process.env.VITE_BASE_PATH || "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
});
