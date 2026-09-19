/* =====================================================================
   sync-public.mjs — đồng bộ tài nguyên dùng chung vào public/ để bản
   Astro build (dist/) tự chứa đầy đủ CSS/JS/data, deploy thẳng lên Vercel.

   public/assets/css/portal.css   ← assets/css/portal.css
   public/assets/js/*.js          ← assets/js/*.js
   public/data/data.js            ← data/data.js  (do build-data.mjs sinh)

   Chạy: npm run sync
   ===================================================================== */
import { copyFileSync, mkdirSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const jobs = [
  { from: "assets/css/portal.css", to: "public/assets/css/portal.css" },
  ...readdirSync(join(ROOT, "assets/js"))
    .filter((f) => f.endsWith(".js"))
    .map((f) => ({ from: `assets/js/${f}`, to: `public/assets/js/${f}` })),
  { from: "data/data.js", to: "public/data/data.js" },
];

let n = 0, bytes = 0;
for (const j of jobs) {
  const src = join(ROOT, j.from), dst = join(ROOT, j.to);
  if (!existsSync(src) || !statSync(src).isFile()) {
    console.warn(`  ⚠ bỏ qua (không tìm thấy): ${j.from}`);
    continue;
  }
  mkdirSync(dirname(dst), { recursive: true });
  copyFileSync(src, dst);
  bytes += statSync(dst).size;
  n++;
  console.log(`  ✔ ${j.from}  →  ${j.to}`);
}
console.log(`\n✔ Đã đồng bộ ${n} tệp (${(bytes / 1024).toFixed(1)} KB) vào public/`);
