/* =====================================================================
   build-data.mjs — sinh data/data.js (UMD) từ data/portal-data.mjs (ESM)
   Chạy: npm run build:data
   Mục đích: bản tĩnh index.html / noi_bo.html mở được bằng double-click
   (file://) mà không cần server, vì <script type="module"> bị CORS chặn.
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "data", "portal-data.mjs");
const OUT = join(ROOT, "data", "data.js");
const OUT_PUB = join(ROOT, "public", "data", "data.js");   // bản sao cho Astro build (dist/data/data.js)

const code = readFileSync(SRC, "utf8");
const m = code.match(/export\s*\{([\s\S]*?)\};/);
if (!m) throw new Error("Không tìm thấy khối export {} trong portal-data.mjs");
const keys = m[1].split(",").map((s) => s.trim()).filter(Boolean);

const body = code.replace(/export\s*\{[\s\S]*?\};\s*/, "");

const banner = `/* =====================================================================
   ⚠ TỆP SINH TỰ ĐỘNG — KHÔNG SỬA TRỰC TIẾP
   Nguồn : data/portal-data.mjs
   Lệnh  : npm run build:data
   Nạp   : <script src="data/data.js"><\/script>  (UMD, chạy cả trên file://)
   ===================================================================== */
`;

const umd =
  banner +
  "(function (root, factory) {\n" +
  '  var api = factory();\n' +
  '  root.LH = api;\n' +
  '  if (typeof module === "object" && module.exports) module.exports = api;\n' +
  "})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {\n" +
  '  "use strict";\n' +
  body
    .split("\n")
    .map((l) => (l.trim() ? "  " + l : ""))
    .join("\n") +
  "\n  return { " + keys.join(", ") + " };\n});\n";

writeFileSync(OUT, umd, "utf8");
mkdirSync(dirname(OUT_PUB), { recursive: true });
writeFileSync(OUT_PUB, umd, "utf8");
console.log(`✔ Đã sinh data/data.js (+ public/data/data.js cho Astro build) — ${keys.length} nhóm dữ liệu: ${keys.join(", ")}`);
