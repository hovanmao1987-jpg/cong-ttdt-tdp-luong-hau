/* =====================================================================
   lh-markup.js — LÕI SINH HTML THUẦN (không dùng DOM, không side-effect)
   Dùng chung cho:
     · Bản tĩnh  index.html   → nạp bằng <script src="assets/js/lh-markup.js">
     · Bản Astro index.astro  → import { markupNews } from "../../assets/js/lh-markup.js"
   Nhờ dùng chung một lõi nên HTML do Astro SSR sinh ra và HTML do client
   render ra là GIỐNG HỆT NHAU (không lệch layout khi hydrate).
   ===================================================================== */
(function (root, factory) {
  var api = factory();
  root.LHM = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /* D được phân giải ĐỘNG (không phụ thuộc thời điểm nạp tệp):
     · trình duyệt : window.LH  (do data/data.js nạp trước)
     · Node / Astro: globalThis.LH (do trang .astro gán trước khi gọi markup) */
  function src() {
    if (typeof window !== "undefined" && window.LH) return window.LH;
    if (typeof globalThis !== "undefined" && globalThis.LH) return globalThis.LH;
    return {};
  }
  var D = (typeof Proxy === "function")
    ? new Proxy({}, { get: function (_, k) { return src()[k]; }, has: function (_, k) { return k in src(); } })
    : src();

  /* ---------------- ICONS ---------------- */
  var P = {
    news: "<path d='M4 5h13v14H4z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M17 8h3v9a2 2 0 0 1-2 2h-1' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M7 9h7M7 12h7M7 15h4' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/>",
    shield: "<path d='M12 3l7 3v6c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M9 12l2 2 4-4' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/>",
    storm: "<path d='M7 17a4 4 0 0 1 .6-8 5.2 5.2 0 0 1 9.9 1.3A3.6 3.6 0 0 1 17 17z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M12 13l-1.6 3h2.4L11 20' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>",
    users: "<circle cx='9' cy='8' r='3' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M3.5 19c.6-3 2.9-4.6 5.5-4.6s4.9 1.6 5.5 4.6' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M16 6.2a2.8 2.8 0 0 1 0 5.6M17.5 14.6c1.9.5 3.2 2 3.6 4.4' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    doc: "<path d='M6 3h8l4 4v14H6z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M14 3v4h4' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M9 12h6M9 15h6M9 18h4' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>",
    chat: "<path d='M4 5h16v11H9l-5 4z' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/><path d='M8.5 10h7M8.5 13h4' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>",
    star: "<path d='M12 3.6l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linejoin='round'/>",
    search: "<circle cx='11' cy='11' r='6' fill='none' stroke='currentColor' stroke-width='1.8'/><path d='M15.5 15.5L20 20' stroke='currentColor' stroke-width='1.8' stroke-linecap='round'/>",
    dl: "<path d='M12 4v10' stroke='currentColor' stroke-width='1.8' stroke-linecap='round'/><path d='M8 11l4 4 4-4' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/><path d='M5 19h14' stroke='currentColor' stroke-width='1.8' stroke-linecap='round'/>",
    lock: "<rect x='5' y='11' width='14' height='9' rx='2' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M8.5 11V8a3.5 3.5 0 0 1 7 0v3' fill='none' stroke='currentColor' stroke-width='1.6'/><circle cx='12' cy='15.5' r='1.3' fill='currentColor'/>",
    home: "<path d='M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/>",
    eye: "<path d='M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z' fill='none' stroke='currentColor' stroke-width='1.6'/><circle cx='12' cy='12' r='2.6' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    clock: "<circle cx='12' cy='12' r='8' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M12 7.5V12l3 2' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/>",
    pin: "<path d='M12 21s6.5-5.6 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.4 12 21 12 21z' fill='none' stroke='currentColor' stroke-width='1.6'/><circle cx='12' cy='10.5' r='2.3' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    phone: "<path d='M6 3.5h3l1.5 4-2 1.5a10 10 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.7 2 2 0 0 1 6 3.5z' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/>",
    check: "<path d='M5 12.5l4.5 4.5L19 7.5' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/>",
    close: "<path d='M6 6l12 12M18 6L6 18' stroke='currentColor' stroke-width='1.9' stroke-linecap='round'/>",
    send: "<path d='M4 12l16-7-7 16-2.2-6.8z' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/>",
    warn: "<path d='M12 4l9 15.5H3z' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linejoin='round'/><path d='M12 9.5v4.2M12 16.4v.6' stroke='currentColor' stroke-width='1.9' stroke-linecap='round'/>",
    book: "<path d='M4 4.5h6a2.5 2.5 0 0 1 2.5 2.5v13A2 2 0 0 0 10.5 18H4z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M20 4.5h-6A2.5 2.5 0 0 0 11.5 7v13A2 2 0 0 1 13.5 18H20z' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    grid: "<rect x='4' y='4' width='7' height='7' rx='1.4' fill='none' stroke='currentColor' stroke-width='1.6'/><rect x='13' y='4' width='7' height='7' rx='1.4' fill='none' stroke='currentColor' stroke-width='1.6'/><rect x='4' y='13' width='7' height='7' rx='1.4' fill='none' stroke='currentColor' stroke-width='1.6'/><rect x='13' y='13' width='7' height='7' rx='1.4' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    flag: "<path d='M6 3v18M6 4.5h11l-2 3.5 2 3.5H6z' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linejoin='round'/>",
    ext: "<path d='M14 5h5v5M19 5l-8 8' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/><path d='M18 14v5H5V6h5' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    logout: "<path d='M14 6V4.5H5v15h9V18' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M10.5 12h10M17 8.5l3.5 3.5L17 15.5' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>",
    bell: "<path d='M6 17h12l-1.4-2.2V11a4.6 4.6 0 1 0-9.2 0v3.8z' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/><path d='M10.4 20h3.2' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/>"
  };
  function ic(n) { return "<svg viewBox='0 0 24 24' aria-hidden='true'>" + (P[n] || "") + "</svg>"; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var CREST =
    "<svg viewBox='0 0 64 64' aria-hidden='true'>" +
    "<circle cx='32' cy='32' r='24' fill='#F0B429'/>" +
    "<circle cx='32' cy='32' r='24' fill='none' stroke='#8E1420' stroke-width='2'/>" +
    "<path d='M32 14l2.6 6.4 6.9.5-5.3 4.5 1.7 6.7L32 28.6l-5.9 3.5 1.7-6.7-5.3-4.5 6.9-.5z' fill='#C8102E'/>" +
    "<path d='M20 42c3.5 2.4 7.6 3.6 12 3.6s8.5-1.2 12-3.6' fill='none' stroke='#8E1420' stroke-width='2.4' stroke-linecap='round'/>" +
    "<path d='M24 47c2.5 1.5 5.2 2.2 8 2.2s5.5-.7 8-2.2' fill='none' stroke='#8E1420' stroke-width='2.4' stroke-linecap='round'/>" +
    "</svg>";

  var CREST_NB =
    "<svg viewBox='0 0 64 64' aria-hidden='true'><circle cx='32' cy='32' r='24' fill='#FFC72C'/>" +
    "<path d='M32 14l2.6 6.4 6.9.5-5.3 4.5 1.7 6.7L32 28.6l-5.9 3.5 1.7-6.7-5.3-4.5 6.9-.5z' fill='#C8102E'/>" +
    "<path d='M20 42c3.5 2.4 7.6 3.6 12 3.6s8.5-1.2 12-3.6M24 47c2.5 1.5 5.2 2.2 8 2.2s5.5-.7 8-2.2' " +
    "fill='none' stroke='#C8102E' stroke-width='2.4' stroke-linecap='round'/></svg>";

  var PALETTES = [["#0b3d63", "#1d7fb8", "🏛"], ["#6d0f18", "#c8102e", "🚨"],
  ["#0b4d2a", "#1f9d5b", "🌾"], ["#4a2c6d", "#8b5cf6", "📢"], ["#7a4a00", "#e8a33d", "⚠"]];
  function hash(s) { var n = 0; for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) | 0; return Math.abs(n); }
  function thumb(id, label) {
    var p = PALETTES[hash(id) % PALETTES.length], g = "g" + hash(id);
    return "<svg viewBox='0 0 120 94' preserveAspectRatio='xMidYMid slice' role='img' aria-label='" + esc(label) + "'>" +
      "<defs><linearGradient id='" + g + "' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='" + p[0] + "'/><stop offset='1' stop-color='" + p[1] + "'/></linearGradient></defs>" +
      "<rect width='120' height='94' fill='url(#" + g + ")'/>" +
      "<g opacity='.18' fill='#fff'><circle cx='98' cy='18' r='26'/><circle cx='14' cy='82' r='20'/></g>" +
      "<text x='60' y='58' text-anchor='middle' font-size='30'>" + p[2] + "</text></svg>";
  }
  function initials(name) {
    var a = String(name).trim().split(/\s+/), last = a.pop();
    return (a.map(function (w) { return w[0]; }).join(".") + "." + last.slice(0, 1)).toUpperCase();
  }

  /* ---------------- 1. CHUYÊN MỤC CHÍNH ---------------- */
  function markupSections() {
    return D.SECTIONS.map(function (s) {
      return '<a href="' + esc(s.href) + '"><span class="ic ' + s.color + '">' + ic(s.icon) + "</span><span>" + esc(s.label) + "</span></a>";
    }).join("");
  }

  /* ---------------- 2. TIN TỨC 3 CẤP ---------------- */
  var NEWS_TABS = [{ k: "all", label: "Tất cả" }, { k: "hue", label: "TP. Huế" },
  { k: "huongthuy", label: "Hương Thủy" }, { k: "luonghau", label: "Lương Hậu" }];

  function newsAll() {
    return [].concat(
      D.NEWS.luonghau.map(function (n) { n._lv = "luonghau"; return n; }),
      D.NEWS.huongthuy.map(function (n) { n._lv = "huongthuy"; return n; }),
      D.NEWS.hue.map(function (n) { n._lv = "hue"; return n; })
    );
  }
  function markupTabs(active) {
    active = active || "all";
    return NEWS_TABS.map(function (t) {
      var n = t.k === "all" ? newsAll().length : D.NEWS[t.k].length;
      return '<button type="button" data-k="' + t.k + '" class="' + (active === t.k ? "on" : "") + '">' +
        esc(t.label) + '<span class="n">' + n + "</span></button>";
    }).join("");
  }
  function markupNews(items) {
    if (!items || !items.length) {
      return '<li style="display:block;text-align:center;padding:26px 10px;color:#7b8497">' + ic("search") +
        "<br>Không tìm thấy tin phù hợp.</li>";
    }
    return items.map(function (n) {
      return '<li><div class="th">' + thumb(n.id, n.pill) + '</div><div class="txt">' +
        '<h3><a href="#tin-' + n.id + '" data-news="' + n.id + '">' + esc(n.title) + "</a></h3>" +
        '<div class="mt"><span class="pill ' + n.tag + '">' + esc(n.pill) + "</span>" +
        (n.hot ? '<span class="pill hot">NỔI BẬT</span>' : "") +
        "<span>" + ic("clock") + " " + esc(n.date) + "</span><span>" + esc(n.src) + "</span></div></div></li>";
    }).join("");
  }

  /* ---------------- 3. ANTT ---------------- */
  function markupANTT() {
    return '<div class="btn-row" style="margin-bottom:10px">' + D.ANTT.moHinh.map(function (m, idx) {
      return '<span class="chip" data-antt-m="' + idx + '" role="button" tabindex="0" style="background:#fdecec;border-color:#f3c9cd;color:#a5141f;cursor:pointer">' + ic("shield") + esc(m) + "</span>";
    }).join("") + "</div>" +
      "<h4 style='font-size:13px;color:#1f2430;margin:4px 0 8px'>Địa bàn TDP — " +
      "<span style='font-weight:500;color:#7b8497'>" + D.ANTT.khuVuc.length + " khu vực</span></h4>" +
      '<div class="btn-row" style="margin-bottom:10px">' + D.ANTT.khuVuc.map(function (kv, idx) {
        return '<span class="chip" data-antt-kv="' + idx + '" role="button" tabindex="0" style="background:#eef3fb;border-color:#cdddf5;color:#0b4d97;cursor:pointer">' + ic("pin") + esc(kv) + "</span>";
      }).join("") + "</div>" +
      '<div class="note">Tổ bảo vệ ANTT ở cơ sở TDP Lương Hậu do đồng chí <b>' +
      esc((D.CADRES.filter(function (x) { return x.stt === 5; })[0] || {}).hoTen) + "</b> làm Tổ trưởng, " +
      "thực hiện tuần tra nhân dân ban đêm trên cả " + D.ANTT.khuVuc.length + " khu vực. " +
      "Khi phát hiện vụ việc, người dân báo tin qua nút <b>“Báo tin ANTT khẩn”</b> bên dưới, hoặc gọi <b>113</b> / " +
      "Công an phường Hương Thủy <b>" + esc(D.META.congAnPhuong) + "</b> / đường dây nóng TDP <b>" +
      esc(D.META.hotlineTdp) + "</b>.</div>" +
      '<div class="note red" style="margin-top:12px"><b>KHUYẾN CÁO AN NINH TRẬT TỰ</b>' +
      "<ul style='margin:6px 0 0;padding-left:18px;list-style:disc'>" +
      D.ANTT.canhBao.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="btn-row" style="margin-top:12px">' +
      '<button class="btn sm" id="antt-baotin">' + ic("warn") + " Báo tin ANTT khẩn</button>" +
      '<a class="btn out sm" href="#phananh" style="text-decoration:none">' + ic("chat") + " Gửi phản ánh</a></div>";
  }

  /* ---------------- 4. PCTT ---------------- */
  function markupPCTT() {
    var p = D.PCTT;
    return '<dl class="kv">' +
      "<dt>Số phương án</dt><dd><b>" + esc(p.soHieu) + "</b></dd>" +
      "<dt>Tên phương án</dt><dd>" + esc(p.ten) + "</dd>" +
      "<dt>Thời gian trực</dt><dd><b style='color:#c62828'>" + esc(p.thoiGian) + "</b></dd>" +
      "<dt>Cấp rủi ro</dt><dd>" + esc(p.capRuiRo) + "</dd>" +
      "<dt>Căn cứ</dt><dd>" + esc(p.canCu) + "</dd></dl>" +
      "<h4 style='font-size:12.8px;margin:14px 0 6px'>MỤC TIÊU</h4>" +
      "<ul style='padding-left:18px;list-style:disc;font-size:12.6px;color:#4a5265'>" +
      p.mucTieu.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul>" +
      "<h4 style='font-size:12.8px;margin:14px 0 6px'>CA TRỰC 24/24</h4>" +
      '<div class="tblwrap"><table><thead><tr><th>Ca</th><th>Thời gian</th><th>Lực lượng trực</th><th>Nhiệm vụ</th></tr></thead><tbody>' +
      p.caTruc.map(function (c) { return "<tr><td><b>" + esc(c.ca) + "</b></td><td>" + esc(c.tg) + "</td><td>" + esc(c.truc) + "</td><td>" + esc(c.nv) + "</td></tr>"; }).join("") +
      "</tbody></table></div>" +
      "<h4 style='font-size:12.8px;margin:14px 0 6px'>PHÂN CÔNG LỰC LƯỢNG (46 người / 5 tiểu ban)</h4>" +
      '<div class="tblwrap"><table><thead><tr><th>#</th><th>Họ tên</th><th>Nhiệm vụ</th><th>Khu vực</th><th>Liên hệ</th></tr></thead><tbody>' +
      p.lucLuong.map(function (c) { return "<tr><td>" + c.stt + "</td><td><b>" + esc(c.hoTen) + "</b></td><td>" + esc(c.nhiemVu) + "</td><td>" + esc(c.khuVuc) + "</td><td>" + esc(c.sdt) + "</td></tr>"; }).join("") +
      "</tbody></table></div>" +
      "<h4 style='font-size:12.8px;margin:14px 0 6px'>ĐIỂM XUNG YẾU &amp; BIỆN PHÁP XỬ LÝ</h4>" +
      '<div class="tblwrap"><table><thead><tr><th>Vị trí</th><th>Nguy cơ</th><th>Biện pháp</th><th>Phụ trách</th></tr></thead><tbody>' +
      p.diemXungYeu.map(function (c) { return "<tr><td><b>" + esc(c.vt) + "</b></td><td>" + esc(c.loai) + "</td><td>" + esc(c.xp) + "</td><td>" + esc(c.nguoi) + "</td></tr>"; }).join("") +
      "</tbody></table></div>" +
      "<h4 style='font-size:12.8px;margin:14px 0 6px'>VẬT TƯ, PHƯƠNG TIỆN TẠI CHỖ</h4>" +
      '<div class="tblwrap"><table><thead><tr><th>Tên vật tư</th><th>Số lượng</th><th>Nơi để</th><th>Tình trạng</th></tr></thead><tbody>' +
      p.vatTu.map(function (c) { return "<tr><td>" + esc(c.ten) + "</td><td><b>" + esc(c.sl) + "</b></td><td>" + esc(c.noi) + "</td><td>" + esc(c.tt) + "</td></tr>"; }).join("") +
      "</tbody></table></div>" +
      "<h4 style='font-size:12.8px;margin:14px 0 6px'>LỊCH TRÌNH 8 NGÀY TRỰC (10 – 17/9/2026)</h4>" +
      '<div class="tl">' + p.lichNgay.map(function (c) {
        return '<div class="it"><b>' + esc(c.ngay) + "</b><p>" + esc(c.nd) + "</p></div>";
      }).join("") + "</div>" +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button class="btn sm" id="pctt-sdt">' + ic("phone") + " Sổ tay số điện thoại trực</button>" +
      '<button class="btn out sm" id="pctt-diem">' + ic("pin") + " 3 điểm sơ tán</button>" +
      '<button class="btn gray sm" id="pctt-print">' + ic("doc") + " In phương án</button></div>";
  }

  /* ---------------- 5. CÁN BỘ CHỦ CHỐT ---------------- */
  function markupCadres() {
    return '<div class="note blue" style="margin:0 0 11px">Thực hiện Luật Thực hiện dân chủ ở cơ sở năm 2022, TDP Lương Hậu công khai ' +
      "<b>" + D.CADRES.length + " cán bộ chủ chốt</b> nhiệm kỳ 2025 – 2027 (chức danh, nhiệm vụ, địa bàn phụ trách, số liên hệ). " +
      'Nhân dân có quyền góp ý, giám sát qua <a href="#phananh">Form phản ánh công dân</a>.</div>' +
      '<ul class="cadre" style="padding:0;list-style:none;display:grid">' +
      D.CADRES.map(function (c) {
        return '<li class="c"><div class="av" style="background:linear-gradient(135deg,' + c.color + ',#2a2f3c)">' + esc(initials(c.hoTen)) + "</div>" +
          "<h3>" + esc(c.hoTen) + '</h3><div class="pos">' + esc(c.chucVu) + "</div>" +
          '<div class="pos" style="color:#0b4d97">' + esc(c.linhVuc) + "</div>" +
          '<div class="info"><div>' + ic("clock") + " <span>Sinh năm " + esc(c.ns) + "</span></div>" +
          "<div>" + ic("pin") + " <span>" + esc(c.diaBan) + "</span></div>" +
          '<div>' + ic("phone") + ' <span><a href="tel:' + esc(c.sdt.replace(/\s/g, "")) + '" style="color:#0b4d97;font-weight:600;text-decoration:underline">' + esc(c.sdt) + "</a></span></div></div>" +
          '<button class="btn gray sm" type="button" data-c="' + c.stt + '" style="margin-top:8px;width:100%;justify-content:center">' +
          ic("eye") + " Xem nhiệm vụ</button></li>";
      }).join("") + "</ul>" +
      "<h4 style='font-size:13px;color:#1f2430;margin:14px 0 8px'>Bảng công khai danh sách cán bộ TDP Lương Hậu</h4>" +
      '<div class="tblwrap"><table><thead><tr><th class="num">STT</th><th>Họ và tên</th><th class="num">Năm sinh</th><th>Chức danh</th><th>Số điện thoại</th></tr></thead><tbody>' +
      D.CADRES.map(function (c) {
        return "<tr><td class='num'>" + c.stt + "</td><td><b>" + esc(c.hoTen) + "</b></td><td class='num'>" + esc(c.ns) +
          "</td><td>" + esc(c.chucVu) + "<br><small style='color:#0b4d97'>" + esc(c.linhVuc) + "</small></td><td><a href='tel:" + esc(c.sdt.replace(/\s/g, "")) + "' style='color:#0b4d97;font-weight:600'>" + esc(c.sdt) + "</a></td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<div class="btn-row" style="margin-top:10px">' +
      '<button class="btn gray sm" type="button" id="cb-print">' + ic("doc") + " In / lưu PDF danh sách</button>" +
      '<button class="btn gray sm" type="button" id="cb-txt">' + ic("dl") + " Tải danh sách (.txt)</button></div>" +
      '<div class="note" style="margin-top:9px">Niêm yết công khai tại Nhà văn hoá TDP Lương Hậu. ' +
      "Nhân dân có ý kiến góp ý về danh sách này xin gửi qua " +
      '<a href="#phananh">Form phản ánh công dân</a> hoặc liên hệ trực tiếp đồng chí Tổ trưởng TDP.</div>';
  }

  /* ---------------- 6. KHO BIỂU MẪU ---------------- */
  function markupForms() {
    return '<div class="note blue" style="margin:0 0 10px">Kho <b>' + D.FORMS.length + " biểu mẫu</b> hành chính thông dụng, tải <b>miễn phí</b>. " +
      "Tệp được sinh trực tiếp trên trình duyệt — không cần cài phần mềm, không thu thập dữ liệu. Mỗi biểu mẫu có 2 định dạng: " +
      "<b>.doc</b> (mở bằng Word/WPS/Google Docs) và <b>.txt</b> (đọc ngay trên điện thoại).</div>" +
      '<div class="field" style="margin-bottom:8px"><input id="bm-q" type="search" placeholder="Tìm biểu mẫu: cư trú, hôn nhân, PCCC, thiên tai…"></div>' +
      '<ul class="bm" style="padding:0;list-style:none">' +
      D.FORMS.map(function (f, i) {
        return '<li data-f="' + f.id + '"><span class="no">' + (i + 1) + '</span><span class="t"><b>' + esc(f.ten) + "</b>" +
          "<span>" + esc(f.ma) + " · " + esc(f.linhVuc) + " · " + esc(f.thoiHan) + "</span></span>" +
          '<span class="btn-row" style="flex-direction:column;gap:5px">' +
          '<button class="btn sm" type="button" data-d="doc">' + ic("dl") + " .doc</button>" +
          '<button class="btn gray sm" type="button" data-d="txt">.txt</button></span></li>';
      }).join("") + "</ul>";
  }

  /* ---------------- 7. FORM PHẢN ÁNH ---------------- */
  var LOAI_PA = ["An ninh trật tự", "Môi trường - rác thải", "Hạ tầng - điện - nước - đường", "Thiên tai - ngập úng",
    "Thủ tục hành chính", "Chế độ chính sách", "Xây dựng - trật tự đô thị", "Ý kiến khác"];
  function markupReflect() {
    return '<input type="hidden" name="access_key" value="183b93c6-fffd-4323-a730-103d1e16b3a0">' +
      '<input type="hidden" name="subject" value="Phản ánh công dân - Cổng TTĐT TDP Lương Hậu">' +
      '<input type="hidden" name="from_name" value="Cổng TTĐT TDP Lương Hậu">' +
      '<div class="field"><label for="pa-hoten">Họ và tên người phản ánh <span class="req">*</span></label>' +
      '<input id="pa-hoten" name="hoten" required placeholder="Nguyễn Văn A" autocomplete="name"><div class="err">Vui lòng nhập họ tên (tối thiểu 3 ký tự).</div></div>' +
      '<div class="field"><label for="pa-sdt">Số điện thoại liên hệ <span class="req">*</span></label>' +
      '<input id="pa-sdt" name="sdt" required inputmode="tel" placeholder="09xx xxx xxx" autocomplete="tel"><div class="err">Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0).</div></div>' +
      '<div class="field"><label for="pa-diachi">Địa chỉ (khu vực / đội) <span class="req">*</span></label>' +
      '<select id="pa-diachi" name="diachi" required><option value="">— Chọn khu vực —</option>' +
      D.ANTT.khuVuc.map(function (k) { return "<option>" + esc(k) + "</option>"; }).join("") +
      '<option>Khác / ngoài địa bàn</option></select><div class="err">Vui lòng chọn địa chỉ.</div></div>' +
      '<div class="field"><label>Lĩnh vực phản ánh <span class="req">*</span></label><div class="radios">' +
      LOAI_PA.map(function (l, i) {
        return '<label><input type="radio" name="linhvuc" value="' + esc(l) + '" ' + (i === 0 ? "checked" : "") + ">" + esc(l) + "</label>";
      }).join("") + "</div></div>" +
      '<div class="field"><label>Mức độ ưu tiên <span class="req">*</span></label><div class="radios">' +
      '<label><input type="radio" name="mucdo" value="Bình thường" checked>Bình thường</label>' +
      '<label><input type="radio" name="mucdo" value="Cần xử lý sớm">Cần xử lý sớm</label>' +
      '<label><input type="radio" name="mucdo" value="Khẩn cấp">Khẩn cấp</label></div></div>' +
      '<div class="field"><label for="pa-noidung">Nội dung phản ánh <span class="req">*</span></label>' +
      '<textarea id="pa-noidung" name="noidung" required minlength="20" placeholder="Mô tả sự việc: thời gian, địa điểm cụ thể, diễn biến, mong muốn giải quyết… (tối thiểu 20 ký tự)"></textarea>' +
      '<div class="hint"><span id="pa-count">0</span>/1000 ký tự · Tối thiểu 20 ký tự</div>' +
      '<div class="err">Nội dung phải từ 20 ký tự trở lên.</div></div>' +
      '<div class="field"><label for="pa-files">Ảnh / video minh chứng <span style="color:#7b8497;font-weight:500">(không bắt buộc)</span></label>' +
      '<div class="file-drop">' + ic("dl") + '<input id="pa-files" type="file" name="files" accept="image/*,video/*" multiple></div>' +
      '<div class="hint" id="pa-fileinfo">Chưa chọn tệp nào</div></div>' +
      '<div class="field"><label style="display:flex;gap:8px;align-items:flex-start;font-weight:500">' +
      '<input type="checkbox" name="dongy" style="width:17px;height:17px;margin-top:2px;flex:0 0 17px;accent-color:#B21C2B" required>' +
      "<span>Tôi cam đoan nội dung phản ánh là đúng sự thật; đồng ý cho TDP sử dụng thông tin liên hệ để xác minh và phản hồi kết quả. " +
      "Phản ánh sai sự thật, xúc phạm danh dự tổ chức, cá nhân sẽ bị xử lý theo quy định.</span></label>" +
      '<div class="err">Bạn phải đồng ý với cam kết trên.</div></div>' +
      '<div class="btn-row"><button type="submit" class="btn block">' + ic("send") + " Gửi phản ánh</button></div>" +
      '<div class="note" style="margin-top:12px">Thời hạn tiếp nhận và phản hồi: <b>trong vòng 24 giờ</b> kể từ khi gửi. ' +
      "Mã phản ánh được gửi qua SMS/Zalo và tra cứu được tại bảng “Phản ánh đã gửi” bên dưới. " +
      "Nhân dân cũng có thể gửi ý kiến, phản ánh trực tiếp qua Gmail: " +
      '<b><a href="mailto:hovanmao1987@gmail.com" style="color:#0b4d97;text-decoration:underline">hovanmao1987@gmail.com</a></b> ' +
      "(đồng chí Hồ Văn Mão — Bí thư Chi bộ tiếp nhận).</div>";
  }

  /* ---------------- 8. LIÊN KẾT ---------------- */
  function markupLinks() {
    return D.LINKS.map(function (l) {
      return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="lg" style="background:' + l.color + '">' + esc(l.abbr) + "</span>" +
        "<span><b>" + esc(l.name) + "</b><span>" + esc(l.url.replace(/^https?:\/\//, "")) + "</span></span></a>";
    }).join("");
  }

  return {
    ICONS: P, ic: ic, esc: esc, thumb: thumb, initials: initials, hash: hash,
    CREST: CREST, CREST_NB: CREST_NB, NEWS_TABS: NEWS_TABS, LOAI_PA: LOAI_PA,
    newsAll: newsAll,
    markupSections: markupSections, markupTabs: markupTabs, markupNews: markupNews,
    markupANTT: markupANTT, markupPCTT: markupPCTT, markupCadres: markupCadres,
    markupForms: markupForms, markupReflect: markupReflect, markupLinks: markupLinks
  };
});
