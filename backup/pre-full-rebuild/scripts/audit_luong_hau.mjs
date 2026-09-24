import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

console.log("==================================================================");
console.log("🔍 KHỞI ĐỘNG BỘ KIỂM TRA TỰ ĐỘNG CỔNG TTĐT TỔ DÂN PHỐ LƯƠNG HẬU");
console.log("==================================================================");

let totalButtons = { pass: 0, fail: 0, warn: 0 };
let totalLinks = { pass: 0, fail: 0, warn: 0 };
let totalModals = { pass: 0, fail: 0 };
let totalPdfs = { pass: 0, fail: 0 };
let totalInternal = { pass: 0, fail: 0 };
let totalVercel = { pass: 0, fail: 0 };
let totalUnsplash = 0;
let totalJsErrors = 0;
let totalDuplicateIds = 0;
let totalMissingIds = 0;

const filesToAudit = [
  { name: "index.html", path: path.join(ROOT, "index.html"), label: "Khu công khai (Static Root)" },
  { name: "noi_bo.html", path: path.join(ROOT, "noi_bo.html"), label: "Khu nội bộ (Static Root)" },
  { name: "van-ban-moi.html", path: path.join(ROOT, "van-ban-moi.html"), label: "Văn bản mới (Static Root)" },
  { name: "van-ban.html", path: path.join(ROOT, "van-ban.html"), label: "Văn bản 3 cấp (Static Root)" },
  { name: "chu-nhat-xanh.html", path: path.join(ROOT, "chu-nhat-xanh.html"), label: "Chủ nhật xanh (Static Root)" },
  { name: "src/pages/index.astro", path: path.join(ROOT, "src", "pages", "index.astro"), label: "Khu công khai (Astro Source)" },
  { name: "src/pages/noi_bo.astro", path: path.join(ROOT, "src", "pages", "noi_bo.astro"), label: "Khu nội bộ (Astro Source)" }
];

function auditFile(fileObj) {
  if (!fs.existsSync(fileObj.path)) {
    console.log(`\n⚠ Bỏ qua ${fileObj.name}: Không tìm thấy file.`);
    return;
  }

  console.log(`\n------------------------------------------------------------------`);
  console.log(`📄 AUDIT TỆP: ${fileObj.name} (${fileObj.label})`);
  console.log(`------------------------------------------------------------------`);

  let content = fs.readFileSync(fileObj.path, "utf8");

  // 1. Check Unsplash & Stock Images
  const unsplashMatches = content.match(/(?:images\.unsplash\.com|source\.unsplash\.com|pexels\.com|picsum\.photos)/gi) || [];
  if (unsplashMatches.length > 0) {
    console.log(`  ❌ [FAIL] Phát hiện ${unsplashMatches.length} link ảnh Unsplash/stock:`);
    unsplashMatches.forEach(u => console.log(`     - ${u}`));
    totalUnsplash += unsplashMatches.length;
  } else {
    console.log(`  ✔ [PASS] 0 ảnh Unsplash/stock giả.`);
  }

  // Parse HTML into JSDOM for deep DOM auditing
  // Strip Astro frontmatter if auditing .astro file
  let htmlToParse = content;
  if (fileObj.name.endsWith(".astro")) {
    htmlToParse = htmlToParse.replace(/^---[\s\S]*?---/, "");
  }

  // Remove external CDN script tags so JSDOM doesn't attempt to load network resources
  const cleanHtml = htmlToParse.replace(/<script[^>]*src="https?:\/\/[^"]*"[^>]*><\/script>/gi, "");

  const jsErrors = [];
  const virtualConsole = new (new JSDOM("").virtualConsole.constructor)();
  virtualConsole.on("jsdomError", (e) => jsErrors.push("jsdomError: " + (e.stack || e.message)));
  virtualConsole.on("error", (...a) => jsErrors.push("console.error: " + a.join(" ")));

  let dom;
  try {
    dom = new JSDOM(cleanHtml, {
      url: "https://luong-hau.vercel.app/" + fileObj.name.replace(/^src\/pages\//, ""),
      runScripts: "dangerously",
      virtualConsole: virtualConsole
    });
  } catch (err) {
    console.log(`  ❌ [FAIL] Lỗi parse JSDOM: ${err.message}`);
    totalJsErrors++;
    return;
  }

  const { window } = dom;
  const document = window.document;

  if (jsErrors.length > 0) {
    console.log(`  ❌ [FAIL] Runtime JS Errors khi load DOM (${jsErrors.length}):`);
    jsErrors.slice(0, 5).forEach(e => console.log(`     - ${e}`));
    totalJsErrors += jsErrors.length;
  } else {
    console.log(`  ✔ [PASS] 0 runtime JS error khi khởi tạo DOM.`);
  }

  // 2. Duplicate IDs
  const allElementsWithId = Array.from(document.querySelectorAll("[id]"));
  const idCounts = {};
  allElementsWithId.forEach(el => {
    const id = el.id.trim();
    if (id) {
      idCounts[id] = (idCounts[id] || 0) + 1;
    }
  });

  const duplicateIds = Object.entries(idCounts).filter(([_, count]) => count > 1);
  if (duplicateIds.length > 0) {
    console.log(`  ❌ [FAIL] Phát hiện ${duplicateIds.length} duplicate ID:`);
    duplicateIds.forEach(([id, count]) => {
      console.log(`     - ID "${id}" xuất hiện ${count} lần`);
    });
    totalDuplicateIds += duplicateIds.length;
  } else {
    console.log(`  ✔ [PASS] 0 duplicate ID trong DOM (${allElementsWithId.length} IDs duy nhất).`);
  }

  // 3. Check all links (<a>)
  const links = Array.from(document.querySelectorAll("a"));
  let linkPass = 0, linkFail = 0, linkWarn = 0;

  links.forEach(a => {
    const href = a.getAttribute("href");
    const text = (a.textContent || "").trim().slice(0, 30);

    if (href === null) {
      // <a> without href can be an anchor or placeholder, warn
      linkWarn++;
    } else if (href === "" || href === "#" || href.startsWith("javascript:")) {
      console.log(`  ❌ [FAIL] Broken link href="${href}" trên thẻ: "${text}"`);
      linkFail++;
    } else if (href.startsWith("#")) {
      const targetId = href.slice(1);
      // Hash can be a route like #/noi-bo/canbo or a DOM element ID
      if (targetId.startsWith("/")) {
        // Hash route (e.g. #/noi-bo)
        linkPass++;
      } else {
        const targetEl = document.getElementById(targetId);
        if (!targetEl) {
          console.log(`  ❌ [FAIL] Missing target ID "#${targetId}" cho link: "${text}"`);
          linkFail++;
          totalMissingIds++;
        } else {
          linkPass++;
        }
      }
    } else {
      // Real URL or relative URL
      linkPass++;
    }
  });

  console.log(`  🔗 Links: PASS = ${linkPass} | FAIL = ${linkFail} | WARN = ${linkWarn}`);
  totalLinks.pass += linkPass;
  totalLinks.fail += linkFail;
  totalLinks.warn += linkWarn;

  // 4. Check all buttons (<button> and [role="button"])
  const buttons = Array.from(document.querySelectorAll("button, [role='button']"));
  let btnPass = 0, btnFail = 0, btnWarn = 0;

  buttons.forEach(btn => {
    const onclick = btn.getAttribute("onclick");
    const id = btn.id;
    const text = (btn.textContent || "").trim().slice(0, 30);

    if (onclick) {
      // Check function name
      const fnMatch = onclick.match(/^([a-zA-Z0-9_$]+)\s*\(/);
      if (fnMatch) {
        const fnName = fnMatch[1];
        if (typeof window[fnName] === "function") {
          btnPass++;
        } else {
          console.log(`  ❌ [FAIL] Nút "${text}" (id="${id}") gọi hàm chưa định nghĩa: ${fnName}()`);
          btnFail++;
        }
      } else {
        btnPass++;
      }
    } else if (id) {
      // Button handled via addEventListener or ID binding
      btnPass++;
    } else {
      // Unnamed button without ID or onclick
      btnWarn++;
    }
  });

  console.log(`  🔘 Buttons: PASS = ${btnPass} | FAIL = ${btnFail} | WARN = ${btnWarn}`);
  totalButtons.pass += btnPass;
  totalButtons.fail += btnFail;
  totalButtons.warn += btnWarn;

  // 5. Check Modals in this document (top-level modal overlay/dialog containers)
  const allElements = Array.from(document.querySelectorAll("*"));
  const modalElements = allElements.filter(el => {
    if (!el.id) return false;
    const isOverlay = el.classList.contains("modal-overlay") || 
      (el.classList.contains("fixed") && el.classList.contains("inset-0") && (el.id.includes("modal") || el.id.includes("Modal") || el.id.includes("drawer") || el.id.includes("auth")));
    const isDialog = el.getAttribute("role") === "dialog";
    return isOverlay || isDialog;
  });
  let mPass = 0, mFail = 0;

  modalElements.forEach(m => {
    const mId = m.id;
    // Check if modal has close button or is a backdrop/drawer with close button
    const hasSelfClose = m.getAttribute("onclick") && m.getAttribute("onclick").toLowerCase().includes("close");
    const closeBtn = hasSelfClose || m.querySelector("[onclick*='close'], [onclick*='Close'], button.close, [aria-label*='Đóng'], [aria-label*='close'], button:not([type='submit'])");
    if (!closeBtn) {
      console.log(`  ⚠ [WARN] Modal #${mId} có thể thiếu nút đóng rõ ràng.`);
      mFail++;
    } else {
      mPass++;
    }
  });

  if (modalElements.length > 0) {
    console.log(`  🪟 Modals: PASS = ${mPass} | FAIL = ${mFail} (Tổng: ${modalElements.length})`);
    totalModals.pass += mPass;
    totalModals.fail += mFail;
  }

  // 6. Check PDFs & Document Links
  const docLinks = Array.from(document.querySelectorAll("a[href*='.pdf'], a[href*='drive.google.com']"));
  let pdfPass = 0, pdfFail = 0;

  docLinks.forEach(dLink => {
    const href = dLink.getAttribute("href");
    const rel = dLink.getAttribute("rel") || "";
    const target = dLink.getAttribute("target");

    if (href.startsWith("http://") || href.startsWith("https://")) {
      if (href.includes("drive.google.com")) {
        if (target === "_blank") {
          pdfPass++;
        } else {
          console.log(`  ⚠ [WARN] Google Drive link thiếu target="_blank": ${href}`);
          pdfFail++;
        }
      } else {
        pdfPass++;
      }
    } else if (href.endsWith(".pdf")) {
      // Local PDF file
      const cleanPath = href.startsWith("/") ? href.slice(1) : href;
      const pdfFullPath = path.join(ROOT, "public", cleanPath);
      const pdfRootPath = path.join(ROOT, cleanPath);
      if (fs.existsSync(pdfFullPath) || fs.existsSync(pdfRootPath)) {
        pdfPass++;
      } else {
        console.log(`  ❌ [FAIL] File PDF không tồn tại cục bộ: ${href}`);
        pdfFail++;
      }
    }
  });

  if (docLinks.length > 0) {
    console.log(`  📄 PDFs & Docs: PASS = ${pdfPass} | FAIL = ${pdfFail} (Tổng: ${docLinks.length})`);
    totalPdfs.pass += pdfPass;
    totalPdfs.fail += pdfFail;
  }

  // 7. Check Internal Portal links
  const internalLinks = Array.from(document.querySelectorAll("a[href*='noi_bo'], a[href*='noi-bo']"));
  let intPass = 0, intFail = 0;

  internalLinks.forEach(iLink => {
    const href = iLink.getAttribute("href");
    if (href.includes("noi_bo.html") || href === "/noi-bo" || href === "/noi_bo" || href.includes("noi_bo") || href.includes("noi-bo")) {
      intPass++;
    } else {
      intFail++;
    }
  });

  if (internalLinks.length > 0) {
    console.log(`  🏛️ Internal Links: PASS = ${intPass} | FAIL = ${intFail}`);
    totalInternal.pass += intPass;
    totalInternal.fail += intFail;
  }
}

// Run audit for each file
filesToAudit.forEach(auditFile);

// Check Vercel Config
console.log(`\n------------------------------------------------------------------`);
console.log(`☁️ AUDIT CẤU HÌNH VERCEL (vercel.json)`);
console.log(`------------------------------------------------------------------`);
const vercelPath = path.join(ROOT, "vercel.json");
if (fs.existsSync(vercelPath)) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, "utf8"));
    const checks = [
      { name: "Framework là astro", ok: vercelConfig.framework === "astro" },
      { name: "Build command là npm run build", ok: vercelConfig.buildCommand === "npm run build" },
      { name: "Output directory là dist", ok: vercelConfig.outputDirectory === "dist" },
      { name: "Có rewrite /noi_bo", ok: (vercelConfig.rewrites || []).some(r => r.source === "/noi_bo" || r.source === "/noi-bo") },
    ];
    checks.forEach(c => {
      if (c.ok) {
        console.log(`  ✔ [PASS] ${c.name}`);
        totalVercel.pass++;
      } else {
        console.log(`  ❌ [FAIL] ${c.name}`);
        totalVercel.fail++;
      }
    });
  } catch (err) {
    console.log(`  ❌ [FAIL] vercel.json không hợp lệ: ${err.message}`);
    totalVercel.fail++;
  }
} else {
  console.log(`  ❌ [FAIL] Không tìm thấy vercel.json!`);
  totalVercel.fail++;
}

console.log("\n==================================================================");
console.log("📊 TỔNG HỢP KIỂM ĐỊNH BAN ĐẦU (INITIAL AUDIT SUMMARY)");
console.log("==================================================================");
console.log(`Buttons: PASS = ${totalButtons.pass} | FAIL = ${totalButtons.fail} | WARN = ${totalButtons.warn}`);
console.log(`Links: PASS = ${totalLinks.pass} | FAIL = ${totalLinks.fail} | WARN = ${totalLinks.warn}`);
console.log(`Modals: PASS = ${totalModals.pass} | FAIL = ${totalModals.fail}`);
console.log(`Images: Unsplash còn lại = ${totalUnsplash}`);
console.log(`JavaScript: Errors = ${totalJsErrors}`);
console.log(`Duplicate IDs = ${totalDuplicateIds}`);
console.log(`Missing IDs = ${totalMissingIds}`);
console.log(`PDF: PASS = ${totalPdfs.pass} | FAIL = ${totalPdfs.fail}`);
console.log(`Internal: PASS = ${totalInternal.pass} | FAIL = ${totalInternal.fail}`);
console.log(`Vercel: PASS = ${totalVercel.pass} | FAIL = ${totalVercel.fail}`);
console.log("==================================================================");
