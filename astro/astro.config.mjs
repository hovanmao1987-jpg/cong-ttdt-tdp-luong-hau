// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

/**
 * Cấu hình Astro — Cổng TTĐT TDP Lương Hậu (phường Hương Thủy, TP. Huế)
 *
 *  · root        : thư mục gốc dự án (chứa index.html, noi_bo.html, assets/, data/)
 *  · output      : "static" — xuất HTML tĩnh, deploy thẳng lên Vercel/Netlify/GitHub Pages
 *  · outDir      : dist/ (không đụng vào index.html tĩnh ở thư mục gốc)
 *  · redirects   : /noi-bo → /noi_bo  (đáp ứng yêu cầu truy cập /noi-bo hoặc #/noi-bo/dashboard)
 *  · build       : inline toàn bộ CSS/JS vào HTML để bản SSG chạy độc lập, không cần CDN
 *
 * Chạy:  npm run dev      (dev server 0.0.0.0:4321)
 *        npm run build    (xuất dist/)
 *        npm run preview  (build + phục vụ dist/)
 */
export default defineConfig({
  root: fileURLToPath(new URL("..", import.meta.url)),
  site: "https://tdpluonghau.vercel.app",
  base: "/",
  trailingSlash: "ignore",
  output: "static",
  outDir: "./dist",
  build: {
    inlineStylesheets: "auto",
    assets: "_assets",
  },
  /* /noi-bo và /noi-bo/dashboard là các trang .astro thật (src/pages/noi-bo/)
     vì redirect tĩnh của Astro không giữ được hash (#/noi-bo/...). */
  redirects: {
    "/phan-anh": "/#phananh",
    "/bieu-mau": "/#bieumau",
    "/can-bo": "/#canbo",
  },
  devToolbar: { enabled: false },
  compressHTML: true,
  vite: {
    build: { assetsInlineLimit: 4096 },
    server: { host: true, port: 4321, strictPort: false },
  },
});
