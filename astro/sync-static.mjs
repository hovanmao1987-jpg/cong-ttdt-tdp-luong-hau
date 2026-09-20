/* =====================================================================
   sync-static.mjs — SINH 2 FILE TĨNH Ở THƯ MỤC GỐC TỪ BẢN ASTRO BUILD
     dist/index.html        →  ./index.html      (khu công khai)
     dist/noi_bo/index.html →  ./noi_bo.html     (khu nội bộ Chi bộ)

   Vì sao cần bước này?
     · Toàn bộ nội dung chỉ được viết DUY NHẤT trong src/pages/*.astro (SSG).
     · Bản Astro dùng đường dẫn tuyệt đối (/assets/..., /noi_bo) vì deploy Vercel.
     · Bản tĩnh ở thư mục gốc phải dùng đường dẫn TƯƠNG ĐỐI để mở được bằng
       double-click (file://) và chạy trên local server mà không cần build.
   Bước xử lý: sao chép HTML rồi viết lại đường dẫn cho phù hợp bản tĩnh.

   Chạy: npm run build   (build:data → sync → astro build → sync-static)
   ===================================================================== */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const jobs = [
  { from: "dist/index.html", to: "index.html", label: "Khu công khai" },
  { from: "dist/noi_bo/index.html", to: "noi_bo.html", label: "Khu nội bộ Chi bộ" },
  { from: "dist/noi-bo/van-ban-moi/index.html", to: "van-ban-moi.html", label: "Văn bản mới Phường & Thành phố" },
  { from: "dist/van-ban/index.html", to: "van-ban.html", label: "Văn bản 3 cấp & Kế hoạch 333" },
  { from: "dist/chu-nhat-xanh/index.html", to: "chu-nhat-xanh.html", label: "Ngày Chủ Nhật Xanh" },
];

/** Viết lại đường dẫn tuyệt đối (bản Astro/Vercel) thành tương đối (bản tĩnh) */
function toStatic(html) {
  return html
    .replace(/(["'(])\/assets\//g, "$1assets/")
    .replace(/(["'(])\/data\//g, "$1data/")
    .replace(/(["'(])\/_assets\//g, "$1_assets/")
    // liên kết khu nội bộ
    .replace(/(["'])\/noi_bo(["'#])/g, "$1noi_bo.html$2")
    .replace(/(["'])\/noi-bo\/dashboard(["'])/g, "$1noi_bo.html#/noi-bo/canbo$2")
    .replace(/(["'])\/noi-bo\/van-ban-moi(["'#])/g, "$1van-ban-moi.html$2")
    // liên kết chuyên mục tĩnh
    .replace(/(["'])\/van-ban(["'#])/g, "$1van-ban.html$2")
    .replace(/(["'])\/chu-nhat-xanh(["'#])/g, "$1chu-nhat-xanh.html$2")
    // liên kết về trang chủ (nút ← trong màn hình đối soát hoặc trang con)
    .replace(/href="\/"/g, 'href="index.html"')
    // canonical/og:url tuyệt đối → tương đối
    .replace(/<link rel="canonical" href="[^"]*">/g, "");
}

let ok = 0;
for (const j of jobs) {
  const src = join(ROOT, j.from);
  if (!existsSync(src)) {
    console.error(`  ✗ Thiếu ${j.from} — hãy chạy "npx astro build --config astro/astro.config.mjs" trước.`);
    process.exitCode = 1;
    continue;
  }
  const html = toStatic(readFileSync(src, "utf8"));
  writeFileSync(join(ROOT, j.to), html, "utf8");
  console.log(`  ✔ ${j.from}  →  ${j.to}   (${j.label}, ${(html.length / 1024).toFixed(1)} KB)`);
  ok++;
}

if (ok === jobs.length) {
  console.log(`\n✔ Đã đồng bộ ${ok} file tĩnh ở thư mục gốc từ bản Astro build.`);
  console.log("  Mở trực tiếp: index.html · noi_bo.html   |   Local server: npm run serve");
} else {
  process.exitCode = 1;
}
