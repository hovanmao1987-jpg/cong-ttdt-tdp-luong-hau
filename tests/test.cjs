/* Harness kiểm thử render bằng jsdom (không cần trình duyệt thật) */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");

function load(file, scripts) { /* trả về Promise */
  const html = fs.readFileSync(path.join(ROOT, file), "utf8")
    // bỏ thẻ script src để tự nạp thủ công
    .replace(/<script src="[^"]+"><\/script>/g, "");
  const errors = [];
  const vc = new (require("jsdom").VirtualConsole)();
  vc.on("jsdomError", (e) => errors.push("jsdomError: " + (e.stack || e.message)));
  vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));
  const dom = new JSDOM(html, {
    url: "http://localhost:4321/" + file,
    runScripts: "outside-only",
    virtualConsole: vc,
  });
  const { window } = dom;
  window.onerror = (m, src, l, c, e) => errors.push("onerror: " + m + (e && e.stack ? "\n" + e.stack.split("\n").slice(0, 4).join("\n") : ""));
  // shim các API jsdom thiếu
  window.URL.createObjectURL = () => "blob:mock";
  window.URL.revokeObjectURL = () => {};
  // KHÔNG ghi đè HTMLElement.click — chỉ theo dõi qua sự kiện để lấy tên file tải về
  window.addEventListener("click", (e) => {
    const a = e.target && e.target.closest && e.target.closest("a[download]");
    if (a) { window.__lastDownload = a.download; e.preventDefault(); }
  }, true);
  window.print = () => { window.__printed = (window.__printed || 0) + 1; };
  window.scrollTo = () => {};
  window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });

  window.addEventListener("error", (e) => errors.push("evt: " + String(e.error || e.message)));

  return new Promise((resolve, reject) => {
    const to = setTimeout(() => reject(new Error("timeout chờ DOMContentLoaded: " + file)), 8000);
    const doc = window.document;
    if (doc.readyState !== "loading") { clearTimeout(to); run(); }
    else doc.addEventListener("DOMContentLoaded", () => { clearTimeout(to); setTimeout(run, 0); });
    function run() {
      for (const s of scripts) {
        try { window.eval(fs.readFileSync(path.join(ROOT, s), "utf8")); }
        catch (e) { errors.push(s + " -> " + e.message); }
      }
      setTimeout(() => resolve({ dom, window, errors, tick: () => new Promise(r => setTimeout(r, 60)) }), 30);
    }
  });
}

/* Nạp một trang HTML bất kỳ + danh sách script (đường dẫn tương đối ROOT) */
function loadFrom(htmlText, url, scripts) {
  const html = htmlText.replace(/<script[^>]*src="[^"]+"[^>]*><\/script>/g, "").replace(/<script>[\s\S]*?<\/script>/g, "");
  const errors = [];
  const vc = new (require("jsdom").VirtualConsole)();
  vc.on("jsdomError", (e) => errors.push("jsdomError: " + (e.stack || e.message)));
  const dom = new JSDOM(html, { url, runScripts: "outside-only", virtualConsole: vc });
  const { window } = dom;
  window.onerror = (m, src, l, c, e) => errors.push("onerror: " + m);
  window.URL.createObjectURL = () => "blob:mock";
  window.URL.revokeObjectURL = () => {};
  window.print = () => {};
  window.scrollTo = () => {};
  window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  window.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[download]");
    if (a) { window.__lastDownload = a.download; e.preventDefault(); }
  }, true);
  return new Promise((resolve) => {
    const doc = window.document;
    const run = () => {
      for (const src of scripts) {
        try { window.eval(fs.readFileSync(path.join(ROOT, src), "utf8")); }
        catch (e) { errors.push(src + " -> " + e.message); }
      }
      setTimeout(() => resolve({ dom, window, errors, tick: () => new Promise(r => setTimeout(r, 60)) }), 30);
    };
    if (doc.readyState !== "loading") run();
    else doc.addEventListener("DOMContentLoaded", () => setTimeout(run, 0));
  });
}

const wait = (ms) => new Promise(r => setTimeout(r, ms));
function txt(el) { return (el && el.textContent || "").replace(/\s+/g, " ").trim(); }

const results = [];
function check(name, cond, extra) {
  results.push({ name, ok: !!cond, extra: extra === undefined ? "" : String(extra) });
}

/* =============== TRANG CÔNG KHAI =============== */
async function testPublic() {
  const { window, errors, tick } = await load("index.html", ["data/data.js", "assets/js/lh-markup.js", "assets/js/templates.js", "assets/js/app.js"]);
  const d = window.document;
  const $ = (s) => d.querySelector(s);
  const $$ = (s) => Array.from(d.querySelectorAll(s));

  check("[PUBLIC] không có lỗi runtime", errors.length === 0, errors.join(" | "));
  check("[PUBLIC] crest quốc huy được vẽ", $$(".crest svg").length >= 1, $$(".crest svg").length);
  check("[PUBLIC] menu chuyên mục chính = 8", $$("#sec-menu a").length === 8, $$("#sec-menu a").length);
  check("[PUBLIC] tab tin tức = 4", $$("#news-tabs button").length === 4, $$("#news-tabs button").length);
  check("[PUBLIC] tin hiển thị mặc định = 14", $$("#news-list li").length === 14, $$("#news-list li").length);
  check("[PUBLIC] tin có thumb SVG", $$("#news-list .th svg").length === 14, $$("#news-list .th svg").length);
  check("[PUBLIC] có Quy định 2322 tang lễ văn minh", txt($("#news-list")).includes("2322"));

  // lọc tab Lương Hậu
  $$("#news-tabs button").find(b => b.dataset.k === "luonghau").click();
  check("[PUBLIC] tab Lương Hậu = 5 tin", $$("#news-list li").length === 5, $$("#news-list li").length);
  $$("#news-tabs button").find(b => b.dataset.k === "all").click();

  // mở chi tiết tin
  $("#news-list [data-news]").click();
  await tick();
  check("[PUBLIC] modal chi tiết tin mở được", !!$("#lh-mask.on") && txt($("#lh-mask h3")).length > 0, txt($("#lh-mask") && $("#lh-mask h3")));
  check("[PUBLIC] modal tin có nội dung 3 cấp", txt($("#lh-mask")).includes("Nguồn:"));
  $("#lh-mask .x").click();
  await wait(240);

  // ANTT
  const antt = txt($("#antt-box"));
  check("[PUBLIC] ANTT: 4 khu vực đội 8-11", $$("#antt-box tbody tr").length === 0 &&
    ["Khu vực đội 8","Khu vực đội 9","Khu vực đội 10","Khu vực đội 11"].every(k => antt.includes(k)), antt.slice(0,120));
  check("[PUBLIC] ANTT: đã xoá bảng nhật ký tuần tra", !/Nhật ký tuần tra đêm/.test(antt) && $$("#antt-box table").length === 0);
  check("[PUBLIC] ANTT: 3 chip mô hình + 4 chip khu vực", $$("#antt-box .chip").length === 7, $$("#antt-box .chip").length);
  check("[PUBLIC] ANTT: đã xoá mục camera an ninh", !/camera/i.test(antt) && !/camera/i.test(txt(d.querySelector("header"))), "vẫn còn camera");
  check("[PUBLIC] ANTT: có SĐT Công an phường thật", antt.includes("0234.3852.870") && antt.includes("0965 712 812"));
  check("[PUBLIC] ANTT: có khuyến cáo", txt($("#antt-box")).includes("KHUYẾN CÁO AN NINH TRẬT TỰ"));

  // PCTT: Đã xoá theo yêu cầu người dùng
  check("[PUBLIC] đã xoá Phương án trực bão lũ 10-17/9", !$("#pctt") && !txt(d.body).includes("PHƯƠNG ÁN TRỰC BÃO LŨ 10 – 17/9/2026"));
  check("[PUBLIC] có nút nổi bật vào khu nội bộ", !!$("[href='/noi_bo']"));

  // Cán bộ
  check("[PUBLIC] công khai 10 cán bộ", $$("#canbo-box li.c").length === 10, $$("#canbo-box li.c").length);
  $$("#canbo-box [data-c]")[0].click();
  await tick();
  check("[PUBLIC] modal nhiệm vụ cán bộ", !!$("#lh-mask.on") && txt($("#lh-mask")).includes("Nhiệm vụ cụ thể") && txt($("#lh-mask")).includes("Lĩnh vực phân công"));
  $("#lh-mask .x").click();
  await wait(240);

  // Biểu mẫu
  check("[PUBLIC] kho 11 biểu mẫu", $$("#bm-box li[data-f]").length === 11, $$("#bm-box li[data-f]").length);
  const before = window.__lastDownload;
  $$("#bm-box [data-d='doc']")[6].click(); // BM-07 PCCC
  check("[PUBLIC] tải .doc BM-07", /BM-07.*\.doc$/.test(window.__lastDownload || ""), window.__lastDownload);
  $$("#bm-box [data-d='txt']")[0].click();
  check("[PUBLIC] tải .txt BM-01", /BM-01.*\.txt$/.test(window.__lastDownload || ""), window.__lastDownload);
  // tìm kiếm biểu mẫu
  const q = $("#bm-q"); q.value = "thiên tai";
  q.dispatchEvent(new window.Event("input", { bubbles: true }));
  const vis = $$("#bm-box li[data-f]").filter(li => li.style.display !== "none");
  check("[PUBLIC] lọc biểu mẫu 'thiên tai'", vis.length === 1, vis.length + " -> " + vis.map(v => v.dataset.f).join(","));

  // Phản ánh
  const f = $("#pa-form");
  const fv = (n) => f.querySelector('[name="' + n + '"]');
  check("[PUBLIC] form phản ánh đủ các trường (đã xoá CCCD)", !!f && ["hoten","sdt","diachi","linhvuc","mucdo","noidung","files","dongy"].every(n => !!fv(n)) && !fv("cccd"), f.children.length);
  check("[PUBLIC] form phản ánh có chạy ngầm Access Key Web3Forms", fv("access_key") && fv("access_key").value === "183b93c6-fffd-4323-a730-103d1e16b3a0");
  check("[PUBLIC] đã xoá ô hero nổi bật theo yêu cầu", !d.querySelector(".hero"));
  check("[PUBLIC] có slogan dưới Phường Hương Thủy ở masthead", txt(d.querySelector(".mh-txt")).includes("Công khai - Minh bạch - Phục vụ nhân dân và gắn kết cán bộ, đảng viên địa bàn"));
  f.querySelector("[type=submit]").click();
  check("[PUBLIC] validate chặn submit rỗng", f.querySelectorAll(".field.bad").length >= 4, f.querySelectorAll(".field.bad").length);
  fv("hoten").value = "Trần Thị Kiểm"; fv("sdt").value = "0912345678";
  fv("diachi").value = "Khu vực đội 9"; fv("dongy").checked = true;
  f.querySelector("[name=noidung]").value = "Đường khu vực đội 9 bị ngập sau mưa, đề nghị khơi thông cống.";
  f.querySelector("[type=submit]").click();
  const stored = JSON.parse(window.localStorage.getItem("lh.phananh") || "[]");
  check("[PUBLIC] gửi phản ánh thành công", stored.length === 1 && /^PA-\d{8}-\d{6}$/.test(stored[0].ma), stored[0] && stored[0].ma);
  await tick();
  check("[PUBLIC] modal xác nhận có mã", txt($("#lh-mask") || d.createElement("i")).includes("Mã phản ánh"));
  if ($("#lh-mask")) $("#lh-mask .x").click();
  await wait(240);
  check("[PUBLIC] lịch sử phản ánh hiển thị", $$("#pa-history tbody tr").length === 1);

  // Liên kết
  check("[PUBLIC] 9 liên kết quốc gia", $$("#links-box a").length === 9, $$("#links-box a").length);
  window.close();
}

/* =============== KHU NỘI BỘ =============== */
async function testNoiBo() {
  const { window, errors, tick } = await load("noi_bo.html", ["data/data.js", "assets/js/noi-bo.js"]);
  const d = window.document;
  const $ = (s) => d.querySelector(s);
  const $$ = (s) => Array.from(d.querySelectorAll(s));

  check("[NOIBO] không có lỗi runtime", errors.length === 0, errors.join(" | "));
  check("[NOIBO] 6 tab nội bộ", $$("#nb-tabs button").length === 6, $$("#nb-tabs button").length);
  check("[NOIBO] lớp bảo mật đang chặn", $("#lock").style.display !== "none" && !$("#nbapp").classList.contains("on"));

  // họ tên không có trong danh sách đảng viên
  $("#in-name").value = "Không Có Trong Danh Sách"; $("#in-ns").value = "01/01/1980";
  $("#lock-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  check("[NOIBO] từ chối họ tên ngoài danh sách", !$("#nbapp").classList.contains("on") && /không có trong danh sách/i.test(txt($("#lock-msg"))), txt($("#lock-msg")));

  // đúng họ tên, sai ngày sinh
  $("#in-name").value = "Hồ Văn Mão"; $("#in-ns").value = "01/01/1980";
  $("#lock-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  check("[NOIBO] từ chối ngày sinh không khớp", !$("#nbapp").classList.contains("on") && /Ngày, tháng, năm sinh không khớp/.test(txt($("#lock-msg"))), txt($("#lock-msg")));

  // thiếu ngày sinh → chặn, không tính là lần đối soát sai
  $("#in-name").value = "Hồ Văn Mão"; $("#in-ns").value = "";
  $("#lock-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  check("[NOIBO] bắt buộc nhập ngày sinh", /dd\/mm\/yyyy/.test(txt($("#lock-msg"))), txt($("#lock-msg")));

  // đúng cả hai (không dấu + khoảng trắng thừa + ngày dạng dd-mm-yyyy)
  $("#in-name").value = "  hồ   văn MÃO "; $("#in-ns").value = "02-02-1989";
  $("#lock-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  check("[NOIBO] đối soát thành công → vào khu nội bộ", $("#nbapp").classList.contains("on") && $("#lock").style.display === "none");
  check("[NOIBO] duy trì đăng nhập trong localStorage", !!window.localStorage.getItem("lh.nb.session"));
  check("[NOIBO] thẻ người dùng hiển thị", txt($("#user-card")).includes("Hồ Văn Mão") && txt($("#user-card")).includes("ĐÃ ĐỐI SOÁT"));
  check("[NOIBO] thẻ người dùng có ngày sinh + căn cứ QĐ 46", txt($("#user-card")).includes("02/02/1989") && txt($("#user-card")).includes("46-QĐ/ĐU"), txt($("#user-card")).slice(0, 200));
  check("[NOIBO] không còn trường CCCD trong lớp bảo mật", !$("#in-cccd") && !!$("#in-ns"));

  // thống kê + danh sách 22 đảng viên
  const ovt = txt($("#ov-box"));
  check("[NOIBO] thống kê 22 đảng viên", /22/.test(ovt), ovt.slice(0, 120));
  $$("#nb-tabs button").find(b => b.dataset.t === "canbo").click();
  check("[NOIBO] bảng 10 cán bộ phân công 6 Rõ", $$("#cb-box table")[0].querySelectorAll("tbody tr").length === 10, $$("#cb-box table")[0].querySelectorAll("tbody tr").length);
  $("#open-roster").click();
  await tick();
  const ros = txt($("#nb-mask"));
  check("[NOIBO] danh sách đủ 22 đảng viên + dòng tổng số", $$("#nb-mask table tbody tr").length === 23, $$("#nb-mask table tbody tr").length);
  check("[NOIBO] đảng viên cuối: Hồ Công Long 23/09/1994", ros.includes("Hồ Công Long") && ros.includes("23/09/1994"));
  check("[NOIBO] có căn cứ Quyết định 46-QĐ/ĐU", ros.includes("46-QĐ/ĐU"));
  $("#nb-mask .x").click();
  await wait(240);

  const ov = txt($("#ov-box"));
  check("[NOIBO] tiến độ bình quân 87,0%", ov.includes("87,0%") || ov.includes("87.0%"), (ov.match(/8[67][.,]0%/) || [""])[0]);
  check("[NOIBO] xếp loại XUẤT SẮC", /XUẤT SẮC/i.test(ov));

  // Dashboard 6 Rõ
  $("#open-dash").click();
  await tick();
  const dash = $("#nb-mask");
  check("[NOIBO] Dashboard 6 Rõ mở được", !!dash && txt(dash).includes("6 Rõ"));
  check("[NOIBO] Dashboard đủ 10 cán bộ", dash.querySelectorAll("[data-t]").length === 10, dash.querySelectorAll("[data-t]").length);
  dash.querySelector("[data-t]").click();
  await tick();
  check("[NOIBO] chi tiết 6 tiêu chí Rõ", txt($("#nb-mask")).includes("Rõ trách nhiệm") && txt($("#nb-mask")).includes("Rõ quy trình"));
  check("[NOIBO] chi tiết có 6 thanh đánh giá", $$("#nb-mask .bar-row").length === 6, $$("#nb-mask .bar-row").length);
  $("#nb-mask .x").click();
  await wait(240);

  // Văn bản Chi bộ
  $$("#nb-tabs button").find(b => b.dataset.t === "vanban").click();
  check("[NOIBO] 9 văn bản cốt lõi Chi bộ", $$("#doc-box .doclist li").length === 9, $$("#doc-box .doclist li").length);
  const dtext = txt($("#doc-box"));
  ["01-CT/CB", "01-CT/KTGS", "02-NQ/CB", "02-QĐ/CB", "QC-01/CB-LH", "12-TTr/CB", "09-NQ/CB (DT)", "05-BC/DVK", "03-NQ/CĐ-CB"].forEach(s =>
    check("[NOIBO] có văn bản " + s, dtext.includes(s)));
  check("[NOIBO] có Chương trình KTGS", /01-CT\/KTGS/.test(dtext));
  $$("#doc-box .filterbar button").find(b => b.dataset.f === "GS").click();
  check("[NOIBO] lọc GS = 1 văn bản", $$("#doc-box .doclist li").length === 1, $$("#doc-box .doclist li").length);
  $$("#doc-box .filterbar button").find(b => b.dataset.f === "ALL").click();
  $("#doc-box [data-v]").click();
  await tick();
  check("[NOIBO] mở trích yếu văn bản", !!$("#nb-mask") && txt($("#nb-mask")).includes("Trích yếu"));
  $("#nb-mask .x").click();
  await wait(240);

  // Sổ tay Đảng viên
  $$("#nb-tabs button").find(b => b.dataset.t === "sotay").click();
  const hb = txt($("#hb-box"));
  check("[NOIBO] Sổ tay Đảng viên điện tử", hb.includes("sotaydangvien.dcs.vn"));
  check("[NOIBO] link sổ tay đúng href", $("#hb-box a").getAttribute("href") === "https://sotaydangvien.dcs.vn/auth/login");

  // Văn kiện Đảng
  $$("#nb-tabs button").find(b => b.dataset.t === "trunguong").click();
  const tw = txt($("#tw-box"));
  ["Văn kiện Đảng", "Văn bản của Đảng", "556-QĐ/VPTW", "213-KH/VPTW", "91-KL/TW", "27-NQ/TW"].forEach(s =>
    check("[NOIBO] khối TW có: " + s, tw.includes(s)));
  check("[NOIBO] 2 nút tư liệu đúng href",
    $$("#tw-box .tw-btns a")[0].href === "https://tulieuvankien.dangcongsan.vn/" &&
    $$("#tw-box .tw-btns a")[1].href.includes("/he-thong-van-ban/van-ban-cua-dang"));
  $("#tw-box [data-tw]").click();
  await tick();
  check("[NOIBO] mở trích yếu văn bản TW", !!$("#nb-mask") && txt($("#nb-mask")).includes("Trích yếu"));
  $("#nb-mask .x").click();
  await wait(240);

  // Nhật ký
  $$("#nb-tabs button").find(b => b.dataset.t === "nhatky").click();
  const lg = txt($("#log-box"));
  check("[NOIBO] nhật ký ghi nhận đối soát thành công", lg.includes("Đối soát THÀNH CÔNG"));
  check("[NOIBO] nhật ký ghi nhận đối soát thất bại", lg.includes("THẤT BẠI"));

  // Khoá sau 5 lần sai
  window.localStorage.removeItem("lh.nb.fail"); window.localStorage.removeItem("lh.nb.lock");
  $("#btn-logout").click();
  check("[NOIBO] đăng xuất quay lại lớp bảo mật", $("#lock").style.display === "" && !$("#nbapp").classList.contains("on"));
  for (let i = 0; i < 5; i++) {
    $("#in-name").value = "Không Tồn Tại"; $("#in-ns").value = "01/01/1990";
    $("#lock-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  }
  check("[NOIBO] khoá 5 phút sau 5 lần sai", $("#lock-submit").disabled === true && /tạm khoá/.test(txt($("#lock-msg"))), txt($("#lock-msg")));
  window.close();
}

/* =============== BẢN ASTRO BUILD (dist/) — CHẾ ĐỘ SSR =============== */
async function testDist() {
  const idxRaw = fs.readFileSync(path.join(ROOT, "dist/index.html"), "utf8");
  const nbRaw = fs.readFileSync(path.join(ROOT, "dist/noi_bo/index.html"), "utf8");

  /* (a) nội dung đã có sẵn TRONG HTML tĩnh, chưa cần chạy JS */
  const noJs = new JSDOM(idxRaw.replace(/<script[\s\S]*?<\/script>/g, ""), { url: "http://localhost:4321/" });
  const dd = noJs.window.document;
  const dq = (x) => Array.from(dd.querySelectorAll(x));
  check("[DIST/SSR] 14 tin có sẵn trong HTML tĩnh (SEO)", dq("#news-list li").length === 14, dq("#news-list li").length);
  check("[DIST/SSR] có quy định 2322 tang lễ văn minh trong HTML tĩnh", /2322\/QĐ-UBND/.test(idxRaw));
  check("[DIST/SSR] có slogan ở masthead và đã xoá hero nổi bật", /class="slogan"/.test(idxRaw) && !/<section class="hero"/.test(idxRaw));
  check("[DIST/SSR] 8 chuyên mục có sẵn", dq("#sec-menu a").length === 8, dq("#sec-menu a").length);
  check("[DIST/SSR] 10 cán bộ có sẵn", dq("#canbo-box li.c").length === 10, dq("#canbo-box li.c").length);
  check("[DIST/SSR] đúng tên cán bộ thật + SĐT công khai",
    /Hồ Văn Mão/.test(idxRaw) && /Phạm Thị Thu Thanh/.test(idxRaw) && /0962 481 112/.test(idxRaw) && /0332 886 309/.test(idxRaw));
  check("[DIST/SSR] 11 biểu mẫu có sẵn", dq("#bm-box li[data-f]").length === 11, dq("#bm-box li[data-f]").length);
  check("[DIST/SSR] form phản ánh có sẵn (đã xoá cccd)", dq("#pa-form .field").length >= 7 && !/name="cccd"/.test(idxRaw));
  check("[DIST/SSR] form phản ánh chứa Access Key Web3Forms", /name="access_key" value="183b93c6-fffd-4323-a730-103d1e16b3a0"/.test(idxRaw));
  check("[DIST/SSR] đã xoá khối bão lũ + ANTT có sẵn", !/PHƯƠNG ÁN TRỰC BÃO LŨ 10/.test(idxRaw) && /Tuần tra nhân dân ban đêm/.test(idxRaw));
  check("[DIST/SSR] cờ LH_SSR = true", /window\.LH_SSR\s*=\s*true/.test(idxRaw));
  check("[DIST/SSR] khu nội bộ đặt noindex", /noindex/.test(nbRaw) && !/noindex/.test(idxRaw));
  check("[DIST/SSR] khu nội bộ KHÔNG lộ CCCD/hồ sơ đảng viên trong HTML tĩnh",
    !/\d{12}/.test(nbRaw) && !/Nguyễn Văn Minh|Lê Thị Thu Hà|Vào Đảng|09xx\.xxx/.test(nbRaw));
  check("[DIST/SSR] khu nội bộ KHÔNG lộ ngày sinh/họ tên đảng viên trong HTML tĩnh",
    !/\d{2}\/\d{2}\/(19|20)\d{2}/.test(nbRaw) && !/Hồ Văn Mão|Nguyễn Trọng Nghĩa|Hoàng Hữu Rớt|Hồ Công Long|Ngô Thị Hoài Cẩm/.test(nbRaw));
  check("[DIST/SSR] lớp bảo mật dùng họ tên + ngày sinh (không còn CCCD)",
    /id="in-ns"/.test(nbRaw) && /id="in-name"/.test(nbRaw) && !/id="in-cccd"/.test(nbRaw) && !/demo-btn/.test(nbRaw));
  /* 15-TB/CB được phép hiện ở màn hình đối soát (căn cứ pháp lý của quyền truy cập),
     nhưng NỘI DUNG/TRÍCH YẾU văn bản thì tuyệt đối không được có trong HTML tĩnh */
  check("[DIST/SSR] khu nội bộ KHÔNG lộ nội dung/trích yếu văn bản Chi bộ",
    !/Nghị quyết chuyên đề|Tờ trình đề nghị Đảng uỷ|Biên bản sinh hoạt chi bộ|Kế hoạch giám sát chuyên đề/.test(nbRaw));
  check("[DIST/SSR] khu nội bộ KHÔNG lộ trích yếu văn bản Trung ương",
    !/chuyển đổi số trong hệ thống Văn phòng cấp uỷ|kỷ niệm các ngày lễ lớn|tổ chức không gian phát triển quốc gia/.test(nbRaw));
  check("[DIST/SSR] khu nội bộ KHÔNG lộ số liệu Dashboard “6 Rõ”",
    !/87,0%|87\.0%|XUẤT SẮC|Hoàn thành trước hạn/.test(nbRaw));
  check("[DIST/SSR] khu nội bộ chỉ render lớp bảo mật + khung rỗng",
    /id="lock"/.test(nbRaw) && /id="nbapp"/.test(nbRaw) && !/class="usercard"/.test(nbRaw) && !/doclist/.test(nbRaw));
  noJs.window.close();

  /* (b) chạy JS trên bản dist → tương tác vẫn hoạt động ở chế độ SSR */
  const { window, errors, tick } = await loadFrom(idxRaw, "http://localhost:4321/", [
    "dist/data/data.js", "dist/assets/js/lh-markup.js", "dist/assets/js/templates.js", "dist/assets/js/app.js",
  ]);
  const d = window.document;
  const $ = (s) => d.querySelector(s);
  const $$ = (s) => Array.from(d.querySelectorAll(s));
  check("[DIST] không có lỗi runtime", errors.length === 0, errors.join(" | "));
  check("[DIST] SSR không bị render đè (vẫn 14 tin)", $$("#news-list li").length === 14, $$("#news-list li").length);
  check("[DIST] tab chuyển được", (() => {
    $$("#news-tabs button").find(b => b.dataset.k === "hue").click();
    return $$("#news-list li").length === 5;
  })(), $$("#news-list li").length);
  $$("#news-tabs button").find(b => b.dataset.k === "all").click();
  $("#news-list [data-news]").click(); await tick();
  check("[DIST] modal tin hoạt động", !!$("#lh-mask.on"));
  $("#lh-mask .x").click(); await wait(240);
  $$("#bm-box [data-d='doc']")[0].click();
  check("[DIST] tải biểu mẫu .doc hoạt động", /BM-01.*\.doc$/.test(window.__lastDownload || ""), window.__lastDownload);
  const f = $("#pa-form"), fv = (n) => f.querySelector('[name="' + n + '"]');
  fv("hoten").value = "Lê Văn Dist"; fv("sdt").value = "0905111222";
  fv("diachi").value = "Khu vực đội 8"; fv("dongy").checked = true;
  fv("noidung").value = "Đèn đường khu vực đội 8 bị hỏng 3 bóng, đề nghị sửa chữa.";
  f.querySelector("[type=submit]").click(); await tick();
  check("[DIST] gửi phản ánh hoạt động", (JSON.parse(window.localStorage.getItem("lh.phananh") || "[]")).length === 1);
  window.close();

  /* (c) khu nội bộ bản dist */
  const nb = await loadFrom(nbRaw, "http://localhost:4321/noi_bo/", [
    "dist/data/data.js", "dist/assets/js/lh-markup.js", "dist/assets/js/noi-bo.js",
  ]);
  const nd = nb.window.document;
  const nq = (s) => nd.querySelector(s);
  const nqa = (s) => Array.from(nd.querySelectorAll(s));
  check("[DIST/NB] không có lỗi runtime", nb.errors.length === 0, nb.errors.join(" | "));
  check("[DIST/NB] lớp bảo mật chặn", !nq("#nbapp").classList.contains("on"));
  check("[DIST/NB] 6 tab đã dựng sẵn", nqa("#nb-tabs button").length === 6, nqa("#nb-tabs button").length);
  check("[DIST/NB] đã bỏ nút dữ liệu minh hoạ", !nq("#demo-btn"));
  nq("#in-name").value = "Hồ Văn Mão"; nq("#in-ns").value = "02/02/1989";
  nq("#lock-form").dispatchEvent(new nb.window.Event("submit", { bubbles: true, cancelable: true }));
  await nb.tick();
  check("[DIST/NB] đối soát thành công → vào dashboard", nq("#nbapp").classList.contains("on"));
  check("[DIST/NB] tiến độ 87,0% hiển thị", /87[.,]0%/.test(nq("#ov-box").textContent));
  nqa("#nb-tabs button").find(b => b.dataset.t === "canbo").click();
  nq("#open-dash").click(); await nb.tick();
  check("[DIST/NB] Dashboard 6 Rõ hoạt động", nqa("#nb-mask [data-t]").length === 10, nqa("#nb-mask [data-t]").length);
  nb.window.close();
}

/* =============== IN KẾT QUẢ =============== */
(async () => {
  try { await testPublic(); await testNoiBo(); await testDist(); }
  catch (e) { results.push({ name: "LỖI HỆ THỐNG: " + e.message, ok: false, extra: e.stack.split("\n")[1] || "" }); }
const bad = results.filter(r => !r.ok);
results.forEach(r => console.log((r.ok ? "  ✓ " : "  ✗ ") + r.name + (r.extra ? "   [" + r.extra.slice(0, 160) + "]" : "")));
console.log("\n" + "=".repeat(64));
console.log("TỔNG: " + results.length + " kiểm tra · ĐẠT: " + (results.length - bad.length) + " · LỖI: " + bad.length);
  process.exit(bad.length ? 1 : 0);
})();
