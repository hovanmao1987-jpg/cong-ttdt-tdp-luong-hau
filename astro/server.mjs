/* =====================================================================
   server.mjs — LOCAL SERVER cho Google Antigravity / kiểm thử Mobile
   Chạy:  npm run serve            (mặc định cổng 4321)
          PORT=8080 npm run serve

   Đặc điểm:
     · Bind 0.0.0.0 → xem được qua preview của IDE/sandbox.
     · Phục vụ bản TĨNH ở thư mục gốc: /index.html, /noi_bo.html
     · Ánh xạ route đẹp:  /noi-bo  /noi-bo/  /noi-bo/dashboard  → noi_bo.html
     · /dist/*            → bản Astro build (đối chiếu 2 bản)
     · Tự chèn THANH CÔNG CỤ MOBILE (viewport 360/390/414/768/full)
       để kiểm tra chuẩn Mobile V3 mà không cần bật DevTools.
       Tắt bằng cách thêm ?ui=0 vào URL.
     · Chặn truy cập ra ngoài thư mục gốc, ẩn tệp nhạy cảm (.git, node_modules…).
   ===================================================================== */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { extname, join, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { networkInterfaces } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 4321);
const HOST = "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

/* thư mục/tệp KHÔNG phục vụ qua local server (nguồn build, khoá, cấu hình) */
const BLOCKED = [
  ".git", ".arena", ".cache", ".npm", ".astro", ".config", ".local", ".vscode",
  "node_modules", "tests", "astro", "src",
  "package.json", "package-lock.json", "npm-shrinkwrap.json", "yarn.lock", "pnpm-lock.yaml",
  ".env", ".env.local", ".env.example", ".vercel", "tsconfig.json",
];

/* ---------- Thanh công cụ kiểm tra Mobile (chỉ dùng khi dev) ---------- */
const TOOLBAR = `
<div id="__lh_toolbar" style="position:fixed;top:8px;right:8px;z-index:99999;font:12px/1.4 system-ui,Segoe UI,Roboto,sans-serif">
  <div style="display:flex;gap:4px;align-items:center;background:rgba(18,21,28,.94);border:1px solid rgba(255,255,255,.16);
              border-radius:999px;padding:5px 6px 5px 11px;box-shadow:0 8px 26px rgba(0,0,0,.4);color:#fff;backdrop-filter:blur(6px)">
    <b style="font-size:11px;letter-spacing:.4px;color:#FFC72C;margin-right:2px">MOBILE</b>
    <button data-w="0"    style="__S__">Full</button>
    <button data-w="360"  style="__S__">360</button>
    <button data-w="390"  style="__S__">390</button>
    <button data-w="414"  style="__S__">414</button>
    <button data-w="520"  style="__S__">520</button>
    <button data-w="768"  style="__S__">768</button>
    <span id="__lh_w" style="font-size:10.5px;color:#9aa4b8;min-width:66px;text-align:center">—</span>
    <button data-a="reload" style="__S__">↻</button>
    <button data-a="hide"   style="__S__">✕</button>
  </div>
</div>
<style>
  html.__lh_mobile body{transition:max-width .18s ease}
  #__lh_toolbar button{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);color:#e7ebf3;
    border-radius:999px;padding:3px 9px;font-size:11px;font-weight:600;cursor:pointer}
  #__lh_toolbar button:hover{background:rgba(255,199,44,.25);color:#fff}
  #__lh_toolbar button.on{background:#C8102E;border-color:#e0183a;color:#fff}
  @media (max-width:640px){ #__lh_toolbar{display:none!important} }
</style>
<script>
(function(){
  var KEY='__lh_vp', bar=document.getElementById('__lh_toolbar');
  var W=document.getElementById('__lh_w');
  function apply(w){
    var d=document.documentElement;
    if(!w){ d.classList.remove('__lh_mobile'); d.style.maxWidth=''; }
    else { d.classList.add('__lh_mobile'); d.style.maxWidth=w+'px'; d.style.margin='0 auto';
           d.style.boxShadow='0 0 0 1px rgba(0,0,0,.35), 0 0 60px rgba(0,0,0,.25)'; }
    W.textContent = w ? (w+' × '+window.innerHeight) : ('full × '+window.innerHeight);
    bar.querySelectorAll('[data-w]').forEach(function(b){ b.classList.toggle('on', +b.dataset.w===+w); });
    try{ localStorage.setItem(KEY, String(w||0)); }catch(e){}
  }
  bar.addEventListener('click', function(e){
    var b=e.target.closest('button'); if(!b) return;
    if(b.dataset.a==='hide'){ bar.remove(); document.documentElement.classList.remove('__lh_mobile');
      document.documentElement.style.maxWidth=''; try{localStorage.setItem(KEY,'hide');}catch(_){} return; }
    if(b.dataset.a==='reload'){ location.reload(); return; }
    apply(+b.dataset.w||0);
    window.dispatchEvent(new Event('scroll'));
  });
  var saved='0'; try{ saved=localStorage.getItem(KEY)||'0'; }catch(e){}
  if(saved==='hide'){ bar.remove(); } else { apply(+saved||0); }
  window.addEventListener('resize', function(){ W.textContent=(document.documentElement.style.maxWidth||'full')+' × '+window.innerHeight; });
})();
</script>
`.replace(/__S__/g, "");

function injectToolbar(html) {
  return html.replace(/<\/body>/i, TOOLBAR + "</body>");
}

/* ---------- phân giải đường dẫn ---------- */
function isAllowed(abs) {
  const rel = relative(ROOT, abs);
  if (rel.startsWith("..") || rel.startsWith(sep)) return false;
  return !rel.split(sep).some((part) => BLOCKED.includes(part));
}

function resolveTarget(pathname) {
  let p = decodeURIComponent(pathname);
  if (p === "/" || p === "") return { file: join(ROOT, "index.html"), name: "/index.html" };

  // route đẹp cho khu nội bộ: /noi-bo , /noi-bo/ , /noi-bo/dashboard
  if (/^\/noi-bo(\/|\.html)?$/.test(p) || /^\/noi-bo\/dashboard\/?$/.test(p)) {
    return { file: join(ROOT, "noi_bo.html"), name: "/noi_bo.html" };
  }

  p = p.replace(/\/+$/, "");
  const candidates = [
    join(ROOT, p), join(ROOT, p + ".html"), join(ROOT, p, "index.html"),
    // dự phòng: các route chỉ tồn tại trong bản Astro build (dist/)
    join(ROOT, "dist", p, "index.html"), join(ROOT, "dist", p + ".html"),
  ];
  for (const c of candidates) {
    if (!isAllowed(c)) continue;
    try {
      if (existsSync(c) && statSync(c).isFile()) {
        return { file: c, name: "/" + relative(ROOT, c).split(sep).join("/") };
      }
    } catch (e) { /* bỏ qua, thử ứng viên kế tiếp */ }
  }
  return null;
}

/* ---------- server ---------- */
const server = createServer(async (req, res) => {
  const started = Date.now();
  try {
    const url = new URL(req.url, "http://localhost");
    const t = resolveTarget(url.pathname);
    if (!t) { notFound(res, url.pathname); return; }

    const buf = await readFile(t.file);
    const ext = extname(t.file).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    let body = buf;

    if (ext === ".html" && url.searchParams.get("ui") !== "0") {
      body = Buffer.from(injectToolbar(buf.toString("utf8")), "utf8");
    }

    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": body.length,
      "Cache-Control": "no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(req.method === "HEAD" ? undefined : body);
    log(req.method, url.pathname + url.search, 200, body.length, Date.now() - started, t.name);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 — " + e.message);
    log(req.method, req.url, 500, 0, Date.now() - started, e.message);
  }
});

function notFound(res, p) {
  const html = `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>404 — Không tìm thấy trang</title>
<style>body{font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#eef1f6;color:#1f2430;display:grid;place-items:center;min-height:100vh;margin:0}
.c{background:#fff;border-radius:14px;padding:26px;max-width:440px;box-shadow:0 10px 34px rgba(20,28,48,.14);text-align:center}
h1{color:#B21C2B;font-size:34px;margin:0 0 6px}p{font-size:14px;color:#4a5265}
a{display:inline-block;margin:6px 5px 0;padding:9px 14px;border-radius:9px;background:#B21C2B;color:#fff;text-decoration:none;font-size:13px;font-weight:600}
a.b{background:#fff;color:#B21C2B;border:1.5px solid #B21C2B}code{background:#f2f4f8;padding:1px 6px;border-radius:5px;font-size:12.5px}</style></head>
<body><div class="c"><h1>404</h1><p>Không tìm thấy <code>${p.replace(/</g, "&lt;")}</code></p>
<p style="font-size:13px">Các đường dẫn hợp lệ:</p>
<a href="/">Trang công khai</a><a class="b" href="/noi-bo">Khu nội bộ</a><br>
<a class="b" href="/dist/index.html">Bản Astro (dist)</a><a class="b" href="/noi_bo.html">noi_bo.html</a></div></body></html>`;
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Content-Length": Buffer.byteLength(html) });
  res.end(html);
  log("GET", p, 404, Buffer.byteLength(html), 0, "—");
}

function log(m, p, code, size, ms, target) {
  const t = new Date().toLocaleTimeString("vi-VN", { hour12: false });
  const c = code < 400 ? "\x1b[32m" : code < 500 ? "\x1b[33m" : "\x1b[31m";
  console.log(`${t}  ${m.padEnd(4)} ${c}${code}\x1b[0m  ${String(size).padStart(7)}B  ${String(ms).padStart(4)}ms  ${p}  ${target !== "—" ? "→ " + target : ""}`);
}

function ips() {
  const out = [];
  for (const list of Object.values(networkInterfaces()))
    for (const i of list || []) if (i.family === "IPv4" && !i.internal) out.push(i.address);
  return out;
}

server.listen(PORT, HOST, () => {
  console.log("\n\x1b[1m╔══════════════════════════════════════════════════════════════╗");
  console.log("║   CỔNG TTĐT TDP LƯƠNG HẬU — LOCAL SERVER (chế độ Mobile)     ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\x1b[0m");
  console.log(`\n  \x1b[36mLocal   :\x1b[0m http://localhost:${PORT}/`);
  console.log(`  \x1b[36mNetwork :\x1b[0m ${ips().map((i) => `http://${i}:${PORT}/`).join("  ") || "(không có mạng LAN)"}`);
  console.log(`  \x1b[36mThư mục :\x1b[0m ${ROOT}`);
  console.log("\n  \x1b[1mĐường dẫn kiểm tra:\x1b[0m");
  console.log(`    /                      → khu công khai   (index.html)`);
  console.log(`    /noi-bo                → khu nội bộ      (noi_bo.html)`);
  console.log(`    /noi-bo/dashboard      → khu nội bộ      (noi_bo.html)`);
  console.log(`    /index.html            → file tĩnh công khai`);
  console.log(`    /noi_bo.html           → file tĩnh nội bộ`);
  console.log(`    /dist/index.html       → bản Astro build (đối chiếu)`);
  console.log(`    /dist/noi_bo/          → bản Astro build khu nội bộ`);
  console.log("\n  \x1b[33mThanh công cụ MOBILE\x1b[0m tự chèn ở góc phải (360/390/414/520/768/full).");
  console.log("  Ẩn thanh công cụ: thêm \x1b[33m?ui=0\x1b[0m vào URL, hoặc bấm ✕.");
  console.log("\n  Dừng server: Ctrl + C\n");
});
