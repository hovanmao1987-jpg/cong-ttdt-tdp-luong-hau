/* =====================================================================
   noi-bo.js — KHU VỰC NỘI BỘ CHI BỘ TDP LƯƠNG HẬU
   Chuẩn giao diện: DangCongSan Mobile V2
   Lớp bảo mật: đối soát HỌ VÀ TÊN + NGÀY/THÁNG/NĂM SINH của đảng viên có trong
   danh sách kèm theo Quyết định số 46-QĐ/ĐU ngày 30/6/2026 của Đảng ủy phường
   Hương Thủy, được Bí thư Chi bộ phê duyệt tại Thông báo 15-TB/CB.
   Toàn bộ xử lý phía client — khi vận hành chính thức phải chuyển về máy chủ (API).
   ===================================================================== */
(function () {
  "use strict";
  var D = window.LH;
  if (!D) return;

  var K = {
    SESSION: "lh.nb.session",
    LOG: "lh.nb.audit",
    FAIL: "lh.nb.fail",
    LOCK: "lh.nb.lock"
  };
  var MAX_FAIL = 5, LOCK_MS = 5 * 60 * 1000, IDLE_MS = 15 * 60 * 1000;
  var user = null, idleTimer = null;
  /* Bản tĩnh nằm ở thư mục gốc (index.html); bản Astro build nằm trong dist/ (trang chủ = "/") */
  var HOME_URL = /^\/(noi_bo|noi-bo)(\/|$)/.test(location.pathname) ? "/" : "index.html";

  /* ---------------- ICONS ---------------- */
  var P = {
    star: "<path d='M12 3.6l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z' fill='currentColor' opacity='.9'/>",
    shield: "<path d='M12 3l7 3v6c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M9 12l2 2 4-4' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round'/>",
    book: "<path d='M4 4.5h6a2.5 2.5 0 0 1 2.5 2.5v13A2 2 0 0 0 10.5 18H4z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M20 4.5h-6A2.5 2.5 0 0 0 11.5 7v13A2 2 0 0 1 13.5 18H20z' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    doc: "<path d='M6 3h8l4 4v14H6z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M14 3v4h4M9 12h6M9 15h6M9 18h4' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>",
    users: "<circle cx='9' cy='8' r='3' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M3.5 19c.6-3 2.9-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a2.8 2.8 0 0 1 0 5.6' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    grid: "<rect x='4' y='4' width='7' height='7' rx='1.4' fill='none' stroke='currentColor' stroke-width='1.6'/><rect x='13' y='4' width='7' height='7' rx='1.4' fill='none' stroke='currentColor' stroke-width='1.6'/><rect x='4' y='13' width='7' height='7' rx='1.4' fill='none' stroke='currentColor' stroke-width='1.6'/><rect x='13' y='13' width='7' height='7' rx='1.4' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    logout: "<path d='M14 6V4.5H5v15h9V18' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M10.5 12h10M17 8.5l3.5 3.5L17 15.5' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>",
    lock: "<rect x='5' y='11' width='14' height='9' rx='2' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M8.5 11V8a3.5 3.5 0 0 1 7 0v3' fill='none' stroke='currentColor' stroke-width='1.6'/><circle cx='12' cy='15.5' r='1.3' fill='currentColor'/>",
    eye: "<path d='M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z' fill='none' stroke='currentColor' stroke-width='1.6'/><circle cx='12' cy='12' r='2.6' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    check: "<path d='M5 12.5l4.5 4.5L19 7.5' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/>",
    close: "<path d='M6 6l12 12M18 6L6 18' stroke='currentColor' stroke-width='1.9' stroke-linecap='round'/>",
    dl: "<path d='M12 4v10M8 11l4 4 4-4M5 19h14' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/>",
    bell: "<path d='M6 17h12l-1.4-2.2V11a4.6 4.6 0 1 0-9.2 0v3.8zM10.4 20h3.2' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/>",
    clock: "<circle cx='12' cy='12' r='8' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M12 7.5V12l3 2' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/>",
    ext: "<path d='M14 5h5v5M19 5l-8 8' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/><path d='M18 14v5H5V6h5' fill='none' stroke='currentColor' stroke-width='1.6'/>",
    warn: "<path d='M12 4l9 15.5H3z' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linejoin='round'/><path d='M12 9.5v4.2M12 16.4v.6' stroke='currentColor' stroke-width='1.9' stroke-linecap='round'/>",
    home: "<path d='M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/>",
    flag: "<path d='M6 3v18M6 4.5h11l-2 3.5 2 3.5H6z' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linejoin='round'/>"
  };
  function ic(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (P[n] || "") + "</svg>"; }
  var CREST =
    "<svg viewBox='0 0 64 64' aria-hidden='true'><circle cx='32' cy='32' r='24' fill='#FFC72C'/>" +
    "<path d='M32 14l2.6 6.4 6.9.5-5.3 4.5 1.7 6.7L32 28.6l-5.9 3.5 1.7-6.7-5.3-4.5 6.9-.5z' fill='#C8102E'/>" +
    "<path d='M20 42c3.5 2.4 7.6 3.6 12 3.6s8.5-1.2 12-3.6M24 47c2.5 1.5 5.2 2.2 8 2.2s5.5-.7 8-2.2' fill='none' stroke='#C8102E' stroke-width='2.4' stroke-linecap='round'/></svg>";

  /* ---------------- UTIL ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function h(x) { var t = document.createElement("template"); t.innerHTML = x.trim(); return t.content.firstElementChild; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function now() { return new Date().toLocaleString("vi-VN", { hour12: false }); }
  /* Chuẩn hoá ngày/tháng/năm sinh về dạng yyyymmdd để đối chiếu (không lưu CCCD) */
  function dateKey(v) {
    var a = String(v || "").trim().split(/[\/\-.]/);
    if (a.length !== 3) return "";
    var d = a[0].replace(/\D/g, ""), mth = a[1].replace(/\D/g, ""), y = a[2].replace(/\D/g, "");
    if (d.length === 4) { y = a[0].replace(/\D/g, ""); mth = a[1].replace(/\D/g, ""); d = a[2].replace(/\D/g, ""); }
    if (!d || !mth || y.length !== 4) return "";
    return y + ("0" + mth).slice(-2) + ("0" + d).slice(-2);
  }
  function initials(name) {
    var a = name.trim().split(/\s+/); var last = a.pop();
    return (a.map(function (w) { return w[0]; }).join(".") + "." + last.slice(0, 1)).toUpperCase();
  }
  var toastEl;
  function toast(m, t) {
    if (!toastEl) { toastEl = h('<div class="toast"></div>'); document.body.appendChild(toastEl); }
    toastEl.textContent = m; toastEl.className = "toast on " + (t || "");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.className = "toast"; }, 2600);
  }
  function sheet(title, body, extraClass) {
    var old = $("#nb-mask"); if (old) old.remove();
    var m = h('<div class="mask" id="nb-mask"><div class="sheet"><div class="sheet-h"><h3>' + esc(title) + "</h3>" +
      '<button class="x" type="button" aria-label="Đóng">' + ic("close") + "</button></div><div class='sheet-b'>" + body + "</div></div></div>");
    document.body.appendChild(m);
    requestAnimationFrame(function () { m.classList.add("on"); });
    document.body.style.overflow = "hidden";
    m.querySelector(".x").addEventListener("click", function () {
      m.classList.remove("on"); document.body.style.overflow = ""; setTimeout(function () { m.remove(); }, 200);
    });
    m.addEventListener("click", function (e) { if (e.target === m) m.querySelector(".x").click(); });
    return m;
  }

  /* ---------------- NHẬT KÝ (AUDIT) ---------------- */
  function logGet() {
    var a = [];
    try { a = JSON.parse(localStorage.getItem(K.LOG) || "[]"); } catch (e) {}
    if (!a.length) a = D.AUDIT_SEED.map(function (x) { return { t: x.t, m: x.m, c: x.c }; });
    return a;
  }
  function logAdd(msg, cls) {
    var a = logGet();
    a.unshift({ t: now(), m: msg, c: cls || "" });
    try { localStorage.setItem(K.LOG, JSON.stringify(a.slice(0, 200))); } catch (e) {}
    renderLog();
  }
  function renderLog() {
    var b = $("#log-box"); if (!b) return;
    var a = logGet();
    b.innerHTML = '<div class="log">' + a.map(function (x) {
      return '<div><span class="t">' + esc(x.t) + "</span> <span class='" + (x.c || "") + "'>" + esc(x.m) + "</span></div>";
    }).join("") + "</div>" +
      '<div class="btn-row" style="margin-top:10px"><button class="btn gray sm" id="log-export">' + ic("dl") + " Xuất nhật ký (.txt)</button>" +
      '<button class="btn gray sm" id="log-clear">Xoá nhật ký cục bộ</button></div>';
    $("#log-export").addEventListener("click", function () {
      var txt = "NHẬT KÝ TRUY CẬP KHU NỘI BỘ — CHI BỘ TDP LƯƠNG HẬU\nXuất lúc: " + now() + "\n" + "=".repeat(60) + "\n" +
        a.map(function (x) { return "[" + x.t + "] " + x.m; }).join("\n");
      var blob = new Blob(["\ufeff" + txt], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob), l = document.createElement("a");
      l.href = url; l.download = "nhat-ky-noi-bo-" + new Date().toISOString().slice(0, 10) + ".txt";
      l.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
      toast("Đã xuất nhật ký", "ok");
    });
    $("#log-clear").addEventListener("click", function () {
      localStorage.removeItem(K.LOG); renderLog(); toast("Đã xoá nhật ký cục bộ");
    });
  }

  /* ---------------- LỚP BẢO MẬT ---------------- */
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/\s+/g, " ").trim();
  }
  function failInfo() {
    var n = 0, lockUntil = 0;
    try { n = parseInt(localStorage.getItem(K.FAIL) || "0", 10) || 0; } catch (e) {}
    try { lockUntil = parseInt(localStorage.getItem(K.LOCK) || "0", 10) || 0; } catch (e) {}
    return { n: n, lockUntil: lockUntil };
  }
  function failAdd() {
    var f = failInfo(); f.n++;
    try {
      localStorage.setItem(K.FAIL, String(f.n));
      if (f.n >= MAX_FAIL) localStorage.setItem(K.LOCK, String(Date.now() + LOCK_MS));
    } catch (e) {}
    if (f.n >= MAX_FAIL) {
      // khoá ngay, không chờ chu kỳ đếm ngược
      var box = $("#lock-msg");
      if (box) {
        box.className = "msg err";
        box.textContent = "ĐÃ TẠM KHOÁ: vượt " + MAX_FAIL + " lần đối soát thất bại. Vui lòng thử lại sau " +
          Math.round(LOCK_MS / 60000) + " phút hoặc liên hệ đồng chí Bí thư Chi bộ để được mở khoá.";
      }
      var btn = $("#lock-submit"); if (btn) btn.disabled = true;
      logAdd("TẠM KHOÁ truy cập Khu nội bộ " + Math.round(LOCK_MS / 60000) + " phút do " + MAX_FAIL + " lần đối soát thất bại liên tiếp", "no");
    }
    return f.n;
  }
  function failReset() { try { localStorage.removeItem(K.FAIL); localStorage.removeItem(K.LOCK); } catch (e) {} }

  function renderLockMsg(force) {
    var box = $("#lock-msg");
    var f = failInfo();
    if (f.lockUntil <= Date.now() && !force) {
      // chỉ mở lại nút, không xoá thông báo lỗi/cảnh báo đang hiển thị
      $("#lock-submit").disabled = false;
      return true;
    }
    box.className = "msg";
    if (f.lockUntil > Date.now()) {
      var s = Math.ceil((f.lockUntil - Date.now()) / 1000);
      box.className = "msg err";
      box.textContent = "Tài khoản khu nội bộ đang tạm khoá do vượt " + MAX_FAIL + " lần đối soát thất bại. Vui lòng thử lại sau " +
        Math.floor(s / 60) + " phút " + (s % 60) + " giây.";
      $("#lock-submit").disabled = true;
      return false;
    }
    $("#lock-submit").disabled = false;
    return true;
  }

  function doLogin(e) {
    e.preventDefault();
    if (!renderLockMsg()) return;
    var ten = $("#in-name").value.trim();
    var nsRaw = $("#in-ns").value.trim();
    var nsKey = dateKey(nsRaw);
    if (norm(ten).length < 3) { showErr("Vui lòng nhập đầy đủ họ và tên đảng viên."); return; }
    if (!nsKey) { showErr("Vui lòng nhập đúng ngày, tháng, năm sinh theo định dạng dd/mm/yyyy."); return; }

    var byName = D.ROSTER.filter(function (r) { return norm(r.hoTen) === norm(ten); });
    if (!byName.length) {
      var n1 = failAdd();
      logAdd("Đối soát THẤT BẠI — họ tên không có trong danh sách đảng viên (" + ten + ")", "no");
      showErr("Họ tên không có trong danh sách đảng viên của Chi bộ (kèm theo Quyết định 46-QĐ/ĐU ngày 30/6/2026). " +
        "Kiểm tra lại dấu tiếng Việt và thứ tự họ - tên đệm - tên. Lần thử " + n1 + "/" + MAX_FAIL + ".");
      renderLockMsg(); shake(); return;
    }
    var found = byName.filter(function (r) { return dateKey(r.ngaysinh) === nsKey; })[0];
    if (!found) {
      var n2 = failAdd();
      logAdd("Đối soát THẤT BẠI — ngày/tháng/năm sinh không khớp hồ sơ (" + byName[0].hoTen + ")", "no");
      showErr("Ngày, tháng, năm sinh không khớp với hồ sơ đảng viên đã đăng ký. Lần thử " + n2 + "/" + MAX_FAIL + ".");
      renderLockMsg(); shake(); return;
    }
    failReset();
    user = found;
    var sess = { id: found.id, ten: found.hoTen, ns: found.ngaysinh, vao: now(), role: found.vaiTro };
    try {
      localStorage.setItem(K.SESSION, JSON.stringify(sess));
      sessionStorage.setItem(K.SESSION, JSON.stringify(sess));
    } catch (e) {}
    logAdd("Đối soát THÀNH CÔNG — " + found.hoTen + " (" + found.chucVu + ") truy cập Khu nội bộ (Duy trì đăng nhập)", "ok");
    $("#lock-msg").className = "msg";
    enter();
  }
  function showErr(m) { var b = $("#lock-msg"); b.className = "msg err"; b.textContent = m; }
  function showWarn(m) { var b = $("#lock-msg"); b.className = "msg warn"; b.textContent = m; }
  function shake() { var c = $(".lock-card"); c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake"); }

  function enter() {
    $("#lock").style.display = "none";
    $("#nbapp").classList.add("on");
    renderUserCard(); renderOverview(); renderHandbook(); renderDocs(); renderNewDocs(); renderCadres(); renderTw(); renderLog();
    switchTab(location.hash.split("/")[2] || "tongquan");
    startIdle();
    window.scrollTo(0, 0);
  }
  function exit(reason) {
    user = null;
    try {
      localStorage.removeItem(K.SESSION);
      sessionStorage.removeItem(K.SESSION);
    } catch (e) {}
    if (reason) logAdd("Đăng xuất: " + reason, "wr");
    else logAdd("Đảng viên chủ động đăng xuất", "");
    $("#nbapp").classList.remove("on");
    $("#lock").style.display = "";
    $("#in-name").value = ""; $("#in-ns").value = "";
    showWarn(reason ? "Phiên làm việc đã kết thúc (" + reason + "). Vui lòng đối soát lại." : "Bạn đã đăng xuất an toàn.");
    clearTimeout(idleTimer);
    window.scrollTo(0, 0);
  }
  function startIdle() {
    clearTimeout(idleTimer);
    // Theo yêu cầu: duy trì đăng nhập trên thiết bị, không tự động đăng xuất 15 phút
  }

  /* ---------------- THẺ NGƯỜI DÙNG + TỔNG QUAN ---------------- */
  function renderUserCard() {
    var b = $("#user-card"); if (!b || !user) return;
    b.innerHTML =
      '<div class="usercard"><div class="av">' + esc(initials(user.hoTen)) + "</div>" +
      "<div style='flex:1;min-width:0'><h3>" + esc(user.hoTen) + '</h3><div class="p">' + esc(user.chucVu) + "</div>" +
      '<div class="m">Ngày sinh: ' + esc(user.ngaysinh) + " · SĐT: " + esc(user.sdt) + "<br>" +
      "Địa bàn phụ trách: <b>" + esc(user.doi || "—") + "</b><br>" +
      "Danh sách theo: " + esc(D.META.quyetDinhDanhSach) + " · Duyệt truy cập: " + esc(user.pheDuyet) + "<br>" +
      "<span style='color:#FFC72C;font-size:11.8px'>✓ Thiết bị đang duy trì đăng nhập an toàn</span></div></div>" +
      "<div class='ok'><div class='badge'>" + ic("check") + "</div>ĐÃ ĐỐI SOÁT</div></div>" +
      '<div class="note red" style="margin-top:10px"><b>CẢNH BÁO BẢO MẬT:</b> Tài liệu trong Khu nội bộ thuộc phạm vi quản lý của Chi bộ. ' +
      "Không chụp màn hình, không sao chép, không chia sẻ ra ngoài; không cho người khác mượn tài khoản. " +
      "Mọi thao tác truy cập đều được ghi nhật ký và chịu trách nhiệm trước Chi bộ. Phiên làm việc được duy trì trên thiết bị này cho đến khi bạn bấm Đăng xuất.</div>";
    b.querySelectorAll(".badge svg").forEach(function (s) { s.style.width = "19px"; s.style.height = "19px"; });
  }

  function renderOverview() {
    var b = $("#ov-box"); if (!b) return;
    var avg = (D.TASKS.reduce(function (a, x) { return a + x.pct; }, 0) / D.TASKS.length).toFixed(1);
    var docsByType = {};
    D.DOCS.forEach(function (d) { docsByType[d.loai] = (docsByType[d.loai] || 0) + 1; });
    b.innerHTML =
      '<div class="stat4">' +
      '<div class="s"><b>' + D.META.soDangVien + "</b><span>Đảng viên</span></div>" +
      '<div class="s"><b>' + D.ROSTER.length + "</b><span>Đã duyệt truy cập</span></div>" +
      '<div class="s"><b>' + D.DOCS.length + "</b><span>Văn bản Chi bộ</span></div>" +
      '<div class="s"><b>' + D.DOCS_TW.length + "</b><span>Văn bản TW mới</span></div>" +
      "</div>" +
      '<div class="gauge" style="margin-top:11px"><div class="ring">' + ring(avg) + '<div class="val">' + avg + "%</div></div>" +
      "<div><h3>Tiến độ bình quân nhiệm vụ “6 Rõ”</h3><p>10 cán bộ chủ chốt · Cập nhật " + esc(D.META.capNhat) + "</p>" +
      "<span class='rank'>XẾP LOẠI: XUẤT SẮC</span></div></div>" +
      '<div class="btn-row" style="margin-top:11px">' +
      '<button class="btn sm" data-go="canbo">' + ic("grid") + ' Mở Dashboard “6 Rõ”</button>' +
      '<button class="btn out sm" data-go="vanban">' + ic("doc") + " Văn bản Chi bộ</button>" +
      '<button class="btn blue sm" data-go="sotay">' + ic("book") + " Sổ tay Đảng viên</button></div>" +
      '<div class="note" style="margin-top:11px"><b>NHIỆM VỤ TRỌNG TÂM TUẦN (08 – 14/9/2026)</b>' +
      "<ul style='margin:6px 0 0;padding-left:18px;list-style:disc;font-size:12.4px'>" +
      "<li>Triển khai Kế hoạch phân công nhiệm vụ Tổ xung kích PCTT&TKCN năm 2026 theo Quyết định số 1229/QĐ-UBND của UBND phường Hương Thủy.</li>" +
      "<li>Quán triệt 4 văn bản mới của Trung ương: 556-QĐ/VPTW, 213-KH/VPTW, 91-KL/TW, 27-NQ/TW.</li>" +
      "<li>Cập nhật hồ sơ " + D.ROSTER.length + " đảng viên trên Sổ tay Đảng viên điện tử Thừa Thiên Huế.</li>" +
      "<li>Báo cáo Đảng uỷ phường tình hình ANTT và PCTT lúc 7h00, 13h00, 19h00 hằng ngày.</li></ul></div>";
    b.querySelectorAll("[data-go]").forEach(function (x) {
      x.addEventListener("click", function () { switchTab(x.dataset.go); });
    });
    b.querySelectorAll(".stat4 .s").forEach(function (s, idx) {
      s.style.cursor = "pointer";
      s.setAttribute("role", "button");
      s.addEventListener("click", function () {
        if (idx === 0) switchTab("canbo");
        else if (idx === 1) openRoster();
        else if (idx === 2) switchTab("vanban");
        else if (idx === 3) switchTab("trunguong");
      });
    });
    var gg = b.querySelector(".gauge");
    if (gg) {
      gg.style.cursor = "pointer";
      gg.setAttribute("role", "button");
      gg.addEventListener("click", openDashboard);
    }
  }
  function ring(pct) {
    var r = 34, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    return "<svg width='82' height='82' viewBox='0 0 82 82'><circle cx='41' cy='41' r='" + r + "' fill='none' stroke='#f2e2bd' stroke-width='9'/>" +
      "<circle cx='41' cy='41' r='" + r + "' fill='none' stroke='#d07d00' stroke-width='9' stroke-linecap='round' stroke-dasharray='" + c.toFixed(1) +
      "' stroke-dashoffset='" + off.toFixed(1) + "'/></svg>";
  }

  /* ---------------- SỔ TAY ĐẢNG VIÊN ---------------- */
  function openHandbookPortal() {
    var m = sheet("Cổng Sổ tay Đảng viên điện tử",
      '<div class="prose">' +
      '<div class="note blue" style="margin-bottom:12px">' +
      '<b>HỆ THỐNG SỔ TAY ĐẢNG VIÊN ĐIỆN TỬ</b><br>' +
      'Đảng viên Chi bộ TDP Lương Hậu đăng nhập vào hệ thống theo đường dẫn chính thức của Đảng:</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">' +
      '<div style="padding:11px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px">' +
      '<div style="font-weight:700;color:#0b4d97;margin-bottom:4px;display:flex;align-items:center;gap:6px">' + ic("ext") + ' 1. Cổng Đăng nhập Sổ tay Đảng viên điện tử</div>' +
      '<div style="font-size:12px;color:#4a5265;margin-bottom:8px">Đường dẫn chính thức: <b>sotaydangvien.dcs.vn/auth/login</b></div>' +
      '<a class="btn sm blue" href="https://sotaydangvien.dcs.vn/auth/login" target="_blank" rel="noopener noreferrer" style="text-decoration:none">Mở sotaydangvien.dcs.vn ↗</a>' +
      '</div>' +
      '<div style="padding:11px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px">' +
      '<div style="font-weight:700;color:#c8102e;margin-bottom:4px;display:flex;align-items:center;gap:6px">' + ic("book") + ' 2. Cổng Tư liệu - Văn kiện Đảng (dangcongsan.vn)</div>' +
      '<div style="font-size:12px;color:#4a5265;margin-bottom:8px">Học tập nghị quyết, nghiên cứu văn kiện trực tuyến từ Báo điện tử Đảng Cộng sản VN.</div>' +
      '<a class="btn sm" style="background:#c8102e;color:#fff;text-decoration:none" href="https://tulieuvankien.dangcongsan.vn" target="_blank" rel="noopener noreferrer">Mở Tư liệu Văn kiện Đảng ↗</a>' +
      '</div>' +
      '<div style="padding:11px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px">' +
      '<div style="font-weight:700;color:#2e7d32;margin-bottom:4px">📱 3. Ứng dụng di động "Sổ tay đảng viên điện tử"</div>' +
      '<div style="font-size:12px;color:#4a5265;line-height:1.5">Mở ứng dụng trên điện thoại thông minh (Android / iOS) để điểm danh sinh hoạt chi bộ ngày 03 hằng tháng bằng quét mã QR và nộp đảng phí. (Chi bộ Lương Hậu đã hoàn thành cài đặt cho 21/22 đảng viên).</div>' +
      '</div>' +
      '</div>' +
      '<div class="note" style="font-size:11.8px">Hỗ trợ kỹ thuật: đ/c <b>Nguyễn Trọng Nghĩa</b> (Phó Bí thư Chi bộ phụ trách Sổ tay): <a href="tel:0965712812" style="font-weight:700;color:#0b4d97">0965 712 812</a> · đ/c <b>Hồ Văn Mão</b> (Bí thư Chi bộ): <a href="tel:0962481112" style="font-weight:700;color:#0b4d97">0962 481 112</a>.</div>' +
      '<div class="btn-row" style="margin-top:14px">' +
      '<a class="btn sm blue" href="https://sotaydangvien.dcs.vn/auth/login" target="_blank" rel="noopener noreferrer" style="text-decoration:none">Mở Cổng Sổ tay</a>' +
      '<button class="btn gray sm" id="hb-portal-close">Đóng</button></div></div>');
    if (m && m.querySelector("#hb-portal-close")) {
      m.querySelector("#hb-portal-close").addEventListener("click", function () { m.querySelector(".x").click(); });
    }
  }

  function renderHandbook() {
    var b = $("#hb-box"); if (!b) return;
    b.innerHTML =
      '<div class="tw-btns" style="grid-template-columns:1fr;display:grid">' +
      '<a class="b1" id="link-sotay-main" href="https://sotaydangvien.dcs.vn/auth/login" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:flex;flex-direction:column;gap:5px;cursor:pointer">' +
      ic("book") + "<b>Sổ tay Đảng viên điện tử</b><span>sotaydangvien.dcs.vn/auth/login ↗</span>" +
      '<span style="margin-top:4px;font-size:10.6px;opacity:.9">Đăng nhập tài khoản đảng viên (bấm để mở hệ thống sotaydangvien.dcs.vn)</span></a></div>' +
      '<div class="sixro" style="grid-template-columns:1fr 1fr;margin-top:11px">' +
      "<div class='r'><span class='n'>01</span><b>Điểm danh sinh hoạt</b><span>Quét mã QR tại hội trường Nhà văn hoá TDP</span></div>" +
      "<div class='r'><span class='n'>02</span><b>Học tập nghị quyết</b><span>Bài giảng, câu hỏi trắc nghiệm, cấp giấy xác nhận</span></div>" +
      "<div class='r'><span class='n'>03</span><b>Hồ sơ đảng viên</b><span>Lý lịch, quá trình công tác, khen thưởng, kỷ luật</span></div>" +
      "<div class='r'><span class='n'>04</span><b>Đảng phí</b><span>Đối chiếu mức đóng, tra cứu biên lai điện tử</span></div>" +
      "</div>" +
      '<div class="tblwrap" style="margin-top:11px"><table><thead><tr><th>Chỉ tiêu quản lý</th><th class="num">Kế hoạch</th><th class="num">Thực hiện</th><th class="num">%</th></tr></thead><tbody>' +
      "<tr><td>Đảng viên cài đặt Sổ tay điện tử</td><td class='num'>" + D.ROSTER.length + "</td><td class='num'>21</td><td class='num'><b>95,5</b></td></tr>" +
      "<tr><td>Đảng viên điểm danh sinh hoạt tháng 8/2026</td><td class='num'>" + D.ROSTER.length + "</td><td class='num'>19</td><td class='num'><b>86,4</b></td></tr>" +
      "<tr><td>Hồ sơ đảng viên đã số hoá</td><td class='num'>" + D.ROSTER.length + "</td><td class='num'>" + D.ROSTER.length + "</td><td class='num'><b>100,0</b></td></tr>" +
      "<tr><td>Hoàn thành bài kiểm tra nghị quyết quý III</td><td class='num'>" + D.ROSTER.length + "</td><td class='num'>18</td><td class='num'><b>81,8</b></td></tr>" +
      "<tr><td>Đảng viên phụ trách hộ gia đình (19 hộ/ĐV)</td><td class='num'>" + D.ROSTER.length + "</td><td class='num'>" + D.ROSTER.length + "</td><td class='num'><b>100,0</b></td></tr>" +
      "</tbody></table></div>" +
      '<div class="note blue">Đồng chí Phó Bí thư Chi bộ chịu trách nhiệm cập nhật số liệu lên Sổ tay Đảng viên điện tử trước ngày 25 hằng tháng ' +
      "(theo phân công tại Nghị quyết 09-NQ/CB và Quyết định 556-QĐ/VPTW về chủ quản dữ liệu).</div>";
    b.querySelectorAll(".b1 svg, .sixro svg").forEach(function (s) { s.style.width = "22px"; s.style.height = "22px"; });
    var rItems = [
      {
        t: "01. Điểm danh sinh hoạt Chi bộ",
        c: "Quét mã QR tại hội trường Nhà văn hoá TDP Lương Hậu hoặc định vị GPS trên ứng dụng Sổ tay Đảng viên vào ngày 03 hằng tháng. Hệ thống tự động ghi nhận tỷ lệ chuyên cần và gửi thông báo nhắc lịch sinh hoạt trước 24 giờ."
      },
      {
        t: "02. Học tập nghị quyết & Văn kiện",
        c: "Nghiên cứu văn kiện, học tập trực tuyến các nghị quyết của Trung ương, Tỉnh ủy, Thị ủy và tham gia làm bài kiểm tra nhận thức 15 câu hỏi trắc nghiệm sau mỗi đợt học tập để cấp giấy chứng nhận số."
      },
      {
        t: "03. Hồ sơ đảng viên điện tử",
        c: "Tra cứu quá trình sinh hoạt Đảng, lịch sử công tác, khen thưởng, kỷ luật và phân công nhiệm vụ phụ trách hộ gia đình. Tự kiểm tra và đề nghị cập nhật thông tin qua tài khoản cá nhân."
      },
      {
        t: "04. Đóng đảng phí & Biên lai điện tử",
        c: "Đối chiếu mức đóng đảng phí định kỳ (1% thu nhập hàng tháng theo quy định số 02-QĐ/TW), tra cứu lịch sử nộp và nhận biên lai điện tử có mã xác thực."
      }
    ];
    b.querySelectorAll(".sixro .r").forEach(function (r, idx) {
      r.style.cursor = "pointer";
      r.setAttribute("role", "button");
      r.addEventListener("click", function () {
        var info = rItems[idx] || { t: "Tính năng Sổ tay", c: "Chi tiết tính năng trên nền tảng Sổ tay Đảng viên." };
        var m = sheet(info.t,
          '<div class="prose"><p>' + info.c + '</p>' +
          '<div class="note">Để thực hiện tính năng này, đồng chí đăng nhập Cổng Sổ tay Đảng viên điện tử hoặc mở ứng dụng trên điện thoại di động.</div>' +
          '<div class="btn-row" style="margin-top:14px">' +
          '<a class="btn sm blue" href="https://sotaydangvien.dcs.vn/auth/login" target="_blank" rel="noopener noreferrer" style="text-decoration:none">' + ic("book") + ' Mở sotaydangvien.dcs.vn ↗</a>' +
          '<button class="btn gray sm" id="hb-sub-close">Đóng</button></div></div>');
        if (m) {
          var closeBt = m.querySelector("#hb-sub-close");
          if (closeBt) closeBt.addEventListener("click", function () { m.querySelector(".x").click(); });
        }
      });
    });
  }

  /* ---------------- VĂN BẢN CỦA CHI BỘ ---------------- */
  var DOC_FILTERS = [
    { k: "ALL", l: "Tất cả" }, { k: "NQ", l: "Nghị quyết" }, { k: "QĐ", l: "Quyết định" }, { k: "QC", l: "Quy chế" },
    { k: "CT", l: "Chương trình" }, { k: "GS", l: "Giám sát" }, { k: "TT", l: "Tờ trình" }, { k: "BC", l: "Báo cáo" }
  ];
  var docFilter = "ALL";
  function renderDocs() {
    var b = $("#doc-box"); if (!b) return;
    var items = docFilter === "ALL" ? D.DOCS : D.DOCS.filter(function (d) { return d.loai === docFilter; });
    b.innerHTML =
      '<div class="filterbar">' + DOC_FILTERS.map(function (f) {
        var n = f.k === "ALL" ? D.DOCS.length : D.DOCS.filter(function (d) { return d.loai === f.k; }).length;
        return '<button data-f="' + f.k + '" class="' + (docFilter === f.k ? "on" : "") + '">' + esc(f.l) + " (" + n + ")</button>";
      }).join("") + "</div>" +
      '<ul class="doclist" style="list-style:none;padding:0;margin:0">' + items.map(function (d, i) {
        return '<li><span class="k ' + d.type + '">' + esc(d.loai) + "</span>" +
          "<div style='flex:1;min-width:0'><b>" + esc(d.so) + " — " + esc(d.ten) + "</b>" +
          (d.fileDocx ? "<div style='font-size:11.4px;color:#d97706;margin:2px 0 3px'>📄 Tệp Word gốc: <b>" + esc(d.fileDocx) + "</b></div>" : "") +
          '<div class="m"><span>' + ic("clock") + " " + esc(d.ngay) + "</span><span>Ký: " + esc(d.ky) + "</span>" +
          "<span>" + d.trang + " trang</span></div></div>" +
          '<span class="acts"><button class="btn gray sm" data-v="' + D.DOCS.indexOf(d) + '">' + ic("eye") + "</button></span></li>";
      }).join("") + "</ul>" +
      '<div class="note red">Văn bản của Chi bộ chỉ được đọc trong Khu nội bộ. Việc in, trích dẫn, phổ biến ra ngoài phải được Bí thư Chi bộ cho phép bằng văn bản.</div>';

    b.querySelectorAll(".filterbar button").forEach(function (bt) {
      bt.addEventListener("click", function () { docFilter = bt.dataset.f; renderDocs(); });
    });
    b.querySelectorAll("[data-v]").forEach(function (bt) {
      bt.addEventListener("click", function () { openDoc(D.DOCS[+bt.dataset.v]); });
    });
    b.querySelectorAll(".doclist li").forEach(function (li) {
      var btn = li.querySelector("[data-v]");
      if (btn) {
        li.style.cursor = "pointer";
        li.addEventListener("click", function (e) {
          if (!e.target.closest("button")) btn.click();
        });
      }
    });
    b.querySelectorAll(".m svg").forEach(function (s) { s.style.width = "11px"; s.style.height = "11px"; s.style.verticalAlign = "-1px"; });
    b.querySelectorAll(".acts svg").forEach(function (s) { s.style.width = "14px"; s.style.height = "14px"; });
  }
  function openDoc(d) {
    logAdd("Mở văn bản: " + d.so + " — " + d.ten.slice(0, 40) + "…");
    var m = sheet(d.so,
      '<div class="prose"><h4 style="margin-top:0">' + esc(d.ten) + "</h4>" +
      '<div class="tblwrap"><table><tbody>' +
      "<tr><th style='width:34%'>Số hiệu</th><td><b>" + esc(d.so) + "</b></td></tr>" +
      "<tr><th>Loại văn bản</th><td>" + esc(d.loai) + "</td></tr>" +
      (d.fileDocx ? "<tr><th>Tệp Word gốc</th><td><b style='color:#d97706'>📄 " + esc(d.fileDocx) + "</b></td></tr>" : "") +
      "<tr><th>Ngày ban hành</th><td>" + esc(d.ngay) + "</td></tr>" +
      "<tr><th>Người ký</th><td><b>" + esc(d.ky) + "</b></td></tr>" +
      "<tr><th>Cơ quan ban hành</th><td>Chi bộ TDP Lương Hậu, Đảng bộ phường Hương Thủy</td></tr>" +
      "<tr><th>Số trang</th><td>" + d.trang + " trang</td></tr>" +
      "<tr><th>Phạm vi phổ biến</th><td>Nội bộ Chi bộ (không công khai)</td></tr>" +
      "</tbody></table></div>" +
      "<h4>Trích yếu nội dung</h4><div style='background:#f8fafc;padding:12px 14px;border-radius:6px;border:1px solid #e2e8f0;font-size:13px;line-height:1.65;white-space:pre-wrap'>" + esc(d.noiDung) + "</div>" +
      '<div class="note" style="margin-top:12px">Văn bản được đối soát và chuẩn hóa trực tiếp từ tệp <b>' + esc(d.fileDocx || "") + '</b> của Chi bộ TDP Lương Hậu.</div></div>' +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button class="btn sm" id="d-print">' + ic("doc") + " In trích yếu</button>" +
      '<button class="btn gray sm" id="d-close">Đóng</button></div>');
    m.querySelector("#d-print").addEventListener("click", function () { window.print(); });
    m.querySelector("#d-close").addEventListener("click", function () { m.querySelector(".x").click(); });
  }

  /* ---------------- VĂN BẢN MỚI CỦA PHƯỜNG & THÀNH PHỐ ---------------- */
  var NEW_DOC_FILTERS = [
    { k: "ALL", l: "Tất cả" },
    { k: "Chỉ thị", l: "📌 Chỉ đạo, chỉ thị" },
    { k: "Hướng dẫn", l: "📖 Hướng dẫn quán triệt" },
    { k: "Kế hoạch", l: "📋 Kế hoạch & Thi đua" }
  ];
  var newDocFilter = "ALL";
  function renderNewDocs() {
    var b = $("#vbm-box"); if (!b) return;
    var list = D.DOCS_NEW || [];
    var items = newDocFilter === "ALL" ? list : list.filter(function (d) { return d.loaiVanBan === newDocFilter; });
    b.innerHTML =
      '<div class="filterbar" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">' +
      NEW_DOC_FILTERS.map(function (f) {
        var n = f.k === "ALL" ? list.length : list.filter(function (d) { return d.loaiVanBan === f.k; }).length;
        return '<button data-nf="' + f.k + '" class="' + (newDocFilter === f.k ? "on" : "") + '">' + esc(f.l) + " (" + n + ")</button>";
      }).join("") + "</div>" +
      '<ul class="doclist" style="list-style:none;padding:0;margin:0">' + items.map(function (d) {
        var badgeStyle = d.trangThai === "KhanCap" ? "background:#fee2e2;color:#991b1b;border:1px solid #fca5a5" :
                         d.trangThai === "SapDenHan" ? "background:#fef3c7;color:#92400e;border:1px solid #fde68a" :
                         "background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd";
        var pAssign = (d.canBoPhuTrach || d.nguoiTheoDoi) ? ('<div style="font-size:11.5px;color:#9a3412;background:#fffbeb;padding:3px 8px;border-radius:4px;border:1px solid #fef3c7;margin:4px 0;line-height:1.4">👤 <b>Phụ trách thực hiện:</b> ' + esc(d.canBoPhuTrach || d.nguoiTheoDoi) + '</div>') : '';
        return '<li style="padding:12px;border-bottom:1px solid #edf2f7;display:flex;gap:12px;align-items:flex-start">' +
          '<span class="k ' + (d.loaiVanBan === "Chỉ thị" ? "nq" : d.loaiVanBan === "Hướng dẫn" ? "tt" : "gs") + '">' + esc(d.loaiVanBan.slice(0, 2).toUpperCase()) + '</span>' +
          '<div style="flex:1;min-width:0"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
          '<b style="font-size:13.5px;color:#93061d">' + esc(d.soHieu) + '</b>' +
          '<span style="font-size:11px;padding:2px 7px;border-radius:4px;font-weight:600;' + badgeStyle + '">' + esc(d.hanXuLy) + '</span></div>' +
          '<div style="font-weight:600;color:#1e293b;margin:3px 0 4px;font-size:13px">' + esc(d.trichYeu) + '</div>' +
          '<div style="font-size:11.5px;color:#64748b;margin-bottom:3px"><b>Căn cứ:</b> ' + esc(d.canCu) + '</div>' +
          pAssign +
          '<div class="m" style="font-size:11.5px;color:#7b8497;margin-top:4px"><span>' + ic("clock") + ' ' + esc(d.ngayBanHanh) + '</span><span>' + esc(d.coQuan) + '</span></div></div>' +
          '<span class="acts"><button class="btn sm" data-nv="' + list.indexOf(d) + '" title="Xem văn bản số hóa" style="background:#93061d;color:#fff;border-color:#93061d;font-size:11.5px;font-weight:600;white-space:nowrap">' + ic("doc") + ' Xem số hóa</button></span></li>';
      }).join("") + "</ul>" +
      '<div class="note red" style="margin-top:12px">Văn bản chỉ đạo mới của Đảng ủy phường Hương Thủy và Thành ủy Huế lưu hành trong Khu vực nội bộ Chi bộ để Cấp ủy và đảng viên theo dõi thực hiện.</div>';

    b.querySelectorAll(".filterbar button").forEach(function (bt) {
      bt.addEventListener("click", function () { newDocFilter = bt.dataset.nf; renderNewDocs(); });
    });
    b.querySelectorAll("[data-nv]").forEach(function (bt) {
      bt.addEventListener("click", function () { openNewDoc(list[+bt.dataset.nv]); });
    });
  }
  function openNewDoc(d) {
    logAdd("Mở văn bản mới: " + d.soHieu + " — " + d.trichYeu.slice(0, 40) + "…");
    var m = sheet(d.soHieu,
      '<div class="prose"><div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #e2e8f0;padding-bottom:10px;margin-bottom:12px">' +
      '<div><b style="color:#93061d;font-size:13px;text-transform:uppercase">' + esc(d.coQuan) + "</b><div style='font-size:12px;color:#64748b'>Số: <b style='color:#93061d'>" + esc(d.soHieu) + "</b></div></div>" +
      '<div style="text-align:right"><b style="font-size:11.5px;text-transform:uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><div style="font-size:11px;color:#475569">Độc lập – Tự do – Hạnh phúc</div><div style="font-size:11px;color:#64748b">Ngày ' + esc(d.ngayBanHanh) + '</div></div></div>' +
      '<h4 style="margin-top:4px;color:#93061d;text-align:center;font-size:15px;text-transform:uppercase">' + esc(d.loaiVanBan) + "</h4>" +
      '<p style="text-align:center;font-size:12.5px;color:#475569;margin-bottom:14px;font-style:italic">' + esc(d.trichYeu) + '</p>' +
      '<div class="tblwrap"><table><tbody>' +
      "<tr><th style='width:34%'>Cơ quan ban hành</th><td><b>" + esc(d.coQuan) + "</b></td></tr>" +
      "<tr><th>Ngày ban hành</th><td>" + esc(d.ngayBanHanh) + "</td></tr>" +
      "<tr><th>Thời hạn xử lý / Báo cáo</th><td><b style='color:#b91c1c'>" + esc(d.hanXuLy) + "</b></td></tr>" +
      "<tr><th>Phụ trách triển khai (Chi bộ)</th><td><b style='color:#9a3412'>" + esc(d.canBoPhuTrach || d.nguoiTheoDoi || "Toàn thể Chi bộ") + "</b></td></tr>" +
      "<tr><th>Tệp đính kèm số hóa</th><td><span style='color:#0369a1;font-weight:600'>📄 " + esc(d.fileDinhKem || d.soHieu + ".pdf") + "</span></td></tr>" +
      "</tbody></table></div>" +
      "<h4>Căn cứ triển khai</h4><div style='background:#f8fafc;padding:10px 14px;border-radius:6px;border:1px solid #e2e8f0;font-size:12.5px;color:#475569'>" + esc(d.canCu) + "</div>" +
      (d.linkNguonChinhThong ? "<h4>Nguồn văn bản chính thống ban hành</h4><div style='margin-bottom:10px'><a href='" + esc(d.linkNguonChinhThong) + "' target='_blank' rel='noopener noreferrer' style='color:#93061d;font-weight:700;text-decoration:underline;font-size:12.5px'>🌐 " + esc(d.linkNguonChinhThong) + " ↗</a></div>" : "") +
      (d.tepDinhKem && d.tepDinhKem.length ? "<h4>Hệ thống Phụ lục &amp; Biểu mẫu đính kèm</h4><div style='display:flex;flex-direction:column;gap:8px;margin-bottom:12px'>" + d.tepDinhKem.map(function(pl){
        return "<div style='display:flex;justify-content:space-between;align-items:center;background:#f8fafc;padding:8px 12px;border-radius:6px;border:1px solid #e2e8f0;font-size:12px;gap:8px;flex-wrap:wrap'><span style='font-weight:600;color:#1e293b'>📎 " + esc(pl.tenTep) + "</span><div style='display:flex;gap:6px'><a href='" + esc(pl.duongDanXem) + "' target='_blank' rel='noopener' class='btn sm' style='background:#fef3c7;color:#92400e;border:1px solid #fde68a;text-decoration:none;padding:3px 8px;font-size:11px;font-weight:600'>Xem trực tuyến ↗</a><a href='" + esc(pl.duongDanTai) + "' download class='btn sm' style='background:#93061d;color:#fff;text-decoration:none;padding:3px 8px;font-size:11px;font-weight:600'>Tải về PDF 📥</a></div></div>";
      }).join("") + "</div>" : "") +
      "<h4>Toàn văn nội dung số hóa &amp; Giao nhiệm vụ thực hiện</h4>" +
      "<div style='background:#fff;padding:14px 16px;border-radius:6px;border:1px dashed #93061d;font-size:13px;line-height:1.8;white-space:pre-line;color:#0f172a;box-shadow:0 1px 4px rgba(0,0,0,0.05)'>" +
      esc(d.noiDungChiTiet || d.trichYeu) + "</div>" +
      '<div class="note" style="margin-top:12px">Tài liệu số hóa lưu hành nội bộ phục vụ công tác lãnh đạo, điều hành của Chi bộ TDP Lương Hậu.</div></div>' +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button class="btn sm" id="nd-print">' + ic("doc") + " In toàn văn số hóa</button>" +
      '<button class="btn gray sm" id="nd-close">Đóng</button></div>');
    m.querySelector("#nd-print").addEventListener("click", function () { window.print(); });
    m.querySelector("#nd-close").addEventListener("click", function () { m.querySelector(".x").click(); });
  }

  /* ---------------- QUẢN LÝ CÁN BỘ, ĐẢNG VIÊN + DASHBOARD “6 RÕ” ---------------- */
  function renderCadres() {
    var b = $("#cb-box"); if (!b) return;
    var avg = (D.TASKS.reduce(function (a, x) { return a + x.pct; }, 0) / D.TASKS.length).toFixed(1);
    b.innerHTML =
      '<div class="stat4" style="grid-template-columns:repeat(4,1fr)">' +
      '<div class="s"><b>10</b><span>Cán bộ chủ chốt</span></div>' +
      '<div class="s"><b>' + D.META.soDangVien + '</b><span>Đảng viên toàn Chi bộ</span></div>' +
      '<div class="s"><b>' + avg + '%</b><span>Tiến độ bình quân</span></div>' +
      '<div class="s"><b>6</b><span>Tiêu chí “Rõ”</span></div>' +
      "</div>" +
      '<button class="btn block" id="open-dash" style="margin-top:11px">' + ic("grid") + ' MỞ DASHBOARD PHÂN CÔNG NHIỆM VỤ “6 RÕ”</button>' +
      '<div class="sixro" style="margin-top:11px">' +
      "<div class='r'><span class='n'>RÕ 1</span><b>Rõ người</b><span>Đích danh cán bộ chịu trách nhiệm, không khoán trắng cho tập thể</span></div>" +
      "<div class='r'><span class='n'>RÕ 2</span><b>Rõ việc</b><span>Nhiệm vụ cụ thể, có thể đo lường kết quả</span></div>" +
      "<div class='r'><span class='n'>RÕ 3</span><b>Rõ thời gian</b><span>Mốc bắt đầu, mốc báo cáo, hạn hoàn thành</span></div>" +
      "<div class='r'><span class='n'>RÕ 4</span><b>Rõ quy trình</b><span>Các bước thực hiện, người phối hợp, thẩm quyền quyết định</span></div>" +
      "<div class='r'><span class='n'>RÕ 5</span><b>Rõ sản phẩm</b><span>Văn bản, số liệu, hiện trường phải bàn giao</span></div>" +
      "<div class='r'><span class='n'>RÕ 6</span><b>Rõ trách nhiệm</b><span>Chế độ báo cáo, xử lý khi chậm tiến độ, khen thưởng - kỷ luật</span></div>" +
      "</div>" +
      '<div class="tblwrap" style="margin-top:11px"><table><thead><tr><th>#</th><th>Họ tên</th><th>Chức vụ</th><th class="num">Tiến độ</th><th>Trạng thái</th></tr></thead><tbody>' +
      D.TASKS.map(function (t, i) {
        return "<tr><td>" + (i + 1) + "</td><td><b>" + esc(t.hoTen) + "</b></td><td>" + esc(t.chucVu) + "</td>" +
          "<td class='num'><b style='color:" + (t.pct >= 90 ? "#0f8a4d" : t.pct >= 80 ? "#d98600" : "#c62828") + "'>" + t.pct + "%</b></td>" +
          "<td style='font-size:11.6px'>" + esc(t.trangThai) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<div class="note blue">Toàn bộ <b>' + D.ROSTER.length + ' đảng viên</b> của Chi bộ (danh sách kèm theo Quyết định 46-QĐ/ĐU ngày 30/6/2026) ' +
      "đã được Bí thư Chi bộ phê duyệt truy cập Khu nội bộ theo Thông báo 15-TB/CB. Bảng dưới đây là phân công nhiệm vụ “6 Rõ” cho 10 cán bộ chủ chốt.</div>" +
      '<div class="btn-row" style="margin-top:11px">' +
      '<button class="btn out sm" id="open-roster">' + ic("users") + " Danh sách " + D.ROSTER.length + " đảng viên</button>" +
      '<button class="btn gray sm" id="export-roster">' + ic("dl") + " Xuất danh sách (.txt)</button></div>" +
      '<div class="tblwrap" style="margin-top:9px"><table><thead><tr><th>#</th><th>Họ và tên</th><th>Ngày sinh</th><th>Chức vụ</th><th>Đội</th></tr></thead><tbody>' +
      D.ROSTER.slice(0, 5).map(function (r) {
        return "<tr><td>" + r.stt + "</td><td><b>" + esc(r.hoTen) + "</b></td><td>" + esc(r.ngaysinh) + "</td><td style='font-size:11.4px'>" + esc(r.chucVu) + "</td><td><b>" + esc(r.doi || "—") + "</b></td></tr>";
      }).join("") +
      "<tr><td colspan='5' style='text-align:center;font-size:11.6px;color:#7b8497'>… và " + (D.ROSTER.length - 5) +
      " đảng viên khác — bấm “Danh sách " + D.ROSTER.length + " đảng viên” để xem đầy đủ</td></tr>" +
      "</tbody></table></div>";
    b.querySelectorAll(".sixro .n").forEach(function (s) { s.style.background = "#C8102E"; });
    b.querySelectorAll(".btn svg").forEach(function (s) { s.style.width = "14px"; s.style.height = "14px"; });
    $("#open-dash").addEventListener("click", openDashboard);
    $("#open-roster").addEventListener("click", openRoster);
    $("#export-roster").addEventListener("click", exportRoster);

    b.querySelectorAll(".stat4 .s").forEach(function (s, idx) {
      s.style.cursor = "pointer";
      s.setAttribute("role", "button");
      s.addEventListener("click", function () {
        if (idx === 1) openRoster();
        else openDashboard();
      });
    });

    var roDesc = [
      { t: "Tiêu chí 1: Rõ người", d: "Mỗi nhiệm vụ phân công cho đích danh 01 cán bộ chủ trì chịu trách nhiệm chính, không giao chung chung cho tập thể. Cán bộ phối hợp được xác định cụ thể theo chức danh và địa bàn phụ trách." },
      { t: "Tiêu chí 2: Rõ việc", d: "Mục tiêu công việc phải được lượng hóa cụ thể (ví dụ: hoàn thành rà soát 469 hộ, thu thập 100% chữ ký, tổ chức 1 buổi diễn tập), tránh mô tả cảm tính, mơ hồ." },
      { t: "Tiêu chí 3: Rõ thời gian", d: "Quy định rõ ngày bắt đầu, mốc kiểm tra tiến độ giữa kỳ (hằng tuần/hằng tháng) và thời hạn hoàn thành dứt điểm, không để việc kéo dài không lý do." },
      { t: "Tiêu chí 4: Rõ quy trình", d: "Các bước thực hiện chuẩn chỉ theo quy chế làm việc của Chi bộ và quy định của cấp trên; nêu rõ đầu mối xin ý kiến Bí thư và báo cáo Đảng ủy phường." },
      { t: "Tiêu chí 5: Rõ sản phẩm", d: "Sản phẩm đầu ra phải kiểm đếm được: văn bản báo cáo, danh sách có chữ ký, biên bản họp, hình ảnh hiện trường, dữ liệu số hóa cập nhật vào hệ thống." },
      { t: "Tiêu chí 6: Rõ trách nhiệm", d: "Gắn kết quả thực hiện với bình xét thi đua, đánh giá xếp loại đảng viên cuối năm và xem xét quy hoạch cán bộ kế cận; chế tài xử lý nếu chậm trễ, tắc trách." }
    ];
    b.querySelectorAll(".sixro .r").forEach(function (r, idx) {
      r.style.cursor = "pointer";
      r.setAttribute("role", "button");
      r.addEventListener("click", function () {
        var info = roDesc[idx];
        sheet(info.t + " (Quy chế “6 Rõ”)",
          '<div class="prose"><p>' + info.d + '</p>' +
          '<div class="note blue">Ban hành kèm theo Nghị quyết số 09-NQ/CB ngày 15/7/2026 của Chi bộ TDP Lương Hậu về đổi mới lề lối làm việc và phân công nhiệm vụ cán bộ.</div>' +
          '<div class="btn-row" style="margin-top:14px">' +
          '<button class="btn sm" id="ro-dash">' + ic("grid") + ' Mở Dashboard “6 Rõ”</button>' +
          '<button class="btn gray sm" id="ro-close">Đóng</button></div></div>');
        var m = $("#nb-mask");
        if (m) {
          if (m.querySelector("#ro-dash")) m.querySelector("#ro-dash").addEventListener("click", function () { m.querySelector(".x").click(); openDashboard(); });
          if (m.querySelector("#ro-close")) m.querySelector("#ro-close").addEventListener("click", function () { m.querySelector(".x").click(); });
        }
      });
    });

    var tbls = b.querySelectorAll(".tblwrap tbody");
    if (tbls.length >= 1) {
      tbls[0].querySelectorAll("tr").forEach(function (tr, idx) {
        if (idx < D.TASKS.length) {
          tr.style.cursor = "pointer";
          tr.setAttribute("title", "Bấm xem chi tiết phân công “6 Rõ”: " + D.TASKS[idx].hoTen);
          tr.addEventListener("click", function () { openTask(D.TASKS[idx]); });
        }
      });
    }
    if (tbls.length >= 2) {
      tbls[1].querySelectorAll("tr").forEach(function (tr) {
        tr.style.cursor = "pointer";
        tr.setAttribute("title", "Bấm để mở danh sách toàn bộ " + D.ROSTER.length + " đảng viên");
        tr.addEventListener("click", openRoster);
      });
    }
  }

  /* -------- Danh sách 22 đảng viên (theo Quyết định 46-QĐ/ĐU ngày 30/6/2026) -------- */
  function openRoster() {
    logAdd("Xem danh sách " + D.ROSTER.length + " đảng viên (kèm theo Quyết định 46-QĐ/ĐU ngày 30/6/2026)");
    sheet("Danh sách đảng viên Chi bộ TDP Lương Hậu",
      '<div class="prose"><div class="note">' + esc(D.META.quyetDinhDanhSach) + " · Tổng số <b>" + D.ROSTER.length +
      " đảng viên</b>. Dữ liệu thuộc phạm vi nội bộ — không sao chép, không chia sẻ ra ngoài.</div>" +
      '<div class="tblwrap" style="margin-top:10px"><table><thead><tr><th>STT</th><th>Họ và tên</th><th>Ngày sinh</th><th>Chức vụ</th><th>Đội phụ trách</th><th>Số điện thoại</th></tr></thead><tbody>' +
      D.ROSTER.map(function (r) {
        return "<tr><td>" + r.stt + "</td><td><b>" + esc(r.hoTen) + "</b></td><td>" + esc(r.ngaysinh) + "</td><td>" + esc(r.chucVu) + "</td><td><b>" + esc(r.doi || "—") + "</b></td><td>" + esc(r.sdt) + "</td></tr>";
      }).join("") +
      "<tr><th colspan='5'>Tổng số</th><th>" + D.ROSTER.length + " đảng viên</th></tr>" +
      "</tbody></table></div>" +
      '<div class="btn-row" style="margin-top:12px"><button class="btn sm" id="r-export">' + ic("dl") + " Xuất danh sách (.txt)</button>" +
      '<button class="btn gray sm" id="r-close">Đóng</button></div></div>');
    var m = $("#nb-mask");
    m.querySelector("#r-export").addEventListener("click", exportRoster);
    m.querySelector("#r-close").addEventListener("click", function () { m.querySelector(".x").click(); });
  }
  function exportRoster() {
    var txt = "ĐẢNG BỘ PHƯỜNG HƯƠNG THỦY — CHI BỘ TDP LƯƠNG HẬU\n" +
      "DANH SÁCH ĐẢNG VIÊN (kèm theo Quyết định số 46-QĐ/ĐU ngày 30/6/2026 của Đảng ủy phường Hương Thủy)\n" +
      "Xuất lúc: " + now() + " · Tổng số: " + D.ROSTER.length + " đảng viên\n" + "=".repeat(96) + "\n" +
      D.ROSTER.map(function (r) {
        return String(r.stt).padStart(2, "0") + ". " + r.hoTen.padEnd(22, " ") + " | " + r.ngaysinh + " | " + r.chucVu.padEnd(34, " ") + " | " + String(r.doi || "—").padEnd(8, " ") + " | " + r.sdt;
      }).join("\n");
    var blob = new Blob(["\ufeff" + txt], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob), l = document.createElement("a");
    l.href = url; l.download = "danh-sach-dang-vien-46-QD-DU.txt";
    l.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
    logAdd("Xuất danh sách " + D.ROSTER.length + " đảng viên ra tệp .txt", "wr");
    toast("Đã xuất danh sách đảng viên", "ok");
  }

  /* ---------------- LỘ TRÌNH TIỆN ÍCH SỐ V2 (7 TÍNH NĂNG CỐT LÕI) ---------------- */
  function openRoadmapV2Modal() {
    logAdd("Mở Lộ trình Tiện ích số V2 Chi bộ TDP Lương Hậu");
    var features = [
      {
        icon: "📱",
        name: "QR CODE ĐIỂM DANH",
        desc: "Tự động sinh mã QR cho từng kỳ sinh hoạt ngày 03 hằng tháng. Đảng viên quét mã để điểm danh nhanh chóng.",
        status: "Sẵn sàng tích hợp",
        statusColor: "#065f46;background:#d1fae5;border:1px solid #6ee7b7"
      },
      {
        icon: "🔔",
        name: "THÔNG BÁO ZALO",
        desc: "Kết nối Zalo OA/Zalo nhóm Chi bộ gửi thông báo triệu tập và nhắc lịch sinh hoạt tự động.",
        status: "Đang phát triển",
        statusColor: "#1e40af;background:#dbeafe;border:1px solid #93c5fd"
      },
      {
        icon: "📧",
        name: "EMAIL TỰ ĐỘNG",
        desc: "Tự động gửi giấy mời, tài liệu sinh hoạt và thông báo thu nộp đảng phí đến từng đảng viên.",
        status: "Đang phát triển",
        statusColor: "#1e40af;background:#dbeafe;border:1px solid #93c5fd"
      },
      {
        icon: "📝",
        name: "BIỂU MẪU ĐIỆN TỬ",
        desc: "Số hóa Phiếu tự đánh giá chất lượng sinh hoạt Chi bộ (Mẫu 09) và biểu mẫu thu thập ý kiến đảng viên.",
        status: "Thử nghiệm V2",
        statusColor: "#581c87;background:#f3e8ff;border:1px solid #d8b4fe"
      },
      {
        icon: "📊",
        name: "BÁO CÁO TỰ ĐỘNG",
        desc: "Tự động trích xuất dữ liệu, lập báo cáo định kỳ 30 ngày và tổng hợp tiến độ nhiệm vụ 6 rõ thành file DOCX/PDF.",
        status: "Thử nghiệm V2",
        statusColor: "#581c87;background:#f3e8ff;border:1px solid #d8b4fe"
      },
      {
        icon: "🤖",
        name: "TRỢ LÝ AI HỖ TRỢ BÍ THƯ",
        desc: "Trợ lý trí tuệ nhân tạo hỗ trợ đồng chí Bí thư soạn thảo dự thảo Nghị quyết, gợi ý kịch bản điều hành và lập báo cáo nhanh.",
        status: "Thử nghiệm V2",
        statusColor: "#581c87;background:#f3e8ff;border:1px solid #d8b4fe"
      },
      {
        icon: "🔎",
        name: "TÌM KIẾM VĂN BẢN BẰNG AI",
        desc: "Tra cứu ngữ nghĩa thông minh trong kho 17 văn bản mẫu và quy chế địa phương theo câu hỏi tự nhiên.",
        status: "Đang nghiên cứu",
        statusColor: "#78350f;background:#fef3c7;border:1px solid #fde68a"
      }
    ];

    var html =
      '<div class="prose" style="max-width:100%">' +
      '<div style="background:linear-gradient(135deg,#fffbeb,#fef2f2);padding:12px 14px;border-radius:10px;border:1px solid #fde68a;font-size:12.5px;line-height:1.6;color:#451a03;margin-bottom:14px">' +
      '<b style="color:#93061d;display:flex;align-items:center;gap:6px;font-size:13px;margin-bottom:3px">🚩 Đột phá Chuyển đổi số công tác Đảng (2026 - 2030)</b>' +
      'Thực hiện Nghị quyết số 03-NQ/CĐ-CB của Chi bộ và Kế hoạch 213-KH/VPTW của Văn phòng Trung ương Đảng. Hệ thống Lộ trình V2 được thiết kế nhằm hiện đại hóa 100% quy trình sinh hoạt, hỗ trợ Cấp ủy và nâng cao tính tương tác giữa đảng viên.</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-bottom:16px">' +
      features.map(function (f, idx) {
        return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;box-shadow:0 1px 3px rgba(0,0,0,0.05);display:flex;flex-direction:column;justify-content:space-between">' +
          '<div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
          '<span style="font-size:22px;background:#fffbeb;padding:4px 8px;border-radius:8px;border:1px solid #fef3c7">' + f.icon + '</span>' +
          '<span style="font-size:10.5px;padding:2px 8px;border-radius:12px;font-weight:700;color:' + f.statusColor + '">' + f.status + '</span></div>' +
          '<h4 style="margin:0 0 6px 0;font-size:13px;font-weight:700;color:#0f172a"><span style="color:#93061d">#' + (idx + 1) + '</span> ' + f.name + '</h4>' +
          '<p style="margin:0;font-size:12px;color:#475569;line-height:1.55">' + f.desc + '</p></div>' +
          '<div style="margin-top:10px;padding-top:8px;border-top:1px dashed #e2e8f0;font-size:11px;color:#94a3b8;display:flex;justify-content:space-between">' +
          '<span>Chi bộ Lương Hậu</span><span>Giai đoạn 2026-2030</span></div></div>';
      }).join("") + '</div>' +
      '<div class="btn-row" style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">' +
      '<a class="btn sm" href="/noi-bo/roadmap-v2" target="_blank" rel="noopener" style="background:#fffbeb;color:#93061d;border:1px solid #fde68a;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:4px">Mở trang chi tiết Roadmap V2 ↗</a>' +
      '<button class="btn gray sm" id="rm-close" style="flex:1;justify-content:center">Đóng hộp thoại</button></div></div>';

    var m = sheet("🚀 TIỆN ÍCH SỐ & LỘ TRÌNH V2 (CHI BỘ LƯƠNG HẬU)", html);
    if (m && m.querySelector("#rm-close")) {
      m.querySelector("#rm-close").addEventListener("click", function () { m.querySelector(".x").click(); });
    }
  }

  function openDashboard() {
    logAdd('Mở Dashboard phân công nhiệm vụ "6 Rõ"');
    var avg = (D.TASKS.reduce(function (a, x) { return a + x.pct; }, 0) / D.TASKS.length).toFixed(1);
    var html =
      '<button class="btn block" id="dash-roadmap-btn" style="margin-bottom:12px;background:linear-gradient(135deg,#93061d,#b50e29);color:#FFC72C;border:2px solid #FFC72C;box-shadow:0 0 14px rgba(255,199,44,0.45);font-weight:bold;font-size:13px;cursor:pointer">🚀 Tiện ích số &amp; Lộ trình V2 (7 tính năng mới) <span style="background:#FFC72C;color:#93061d;font-size:10px;padding:2px 6px;border-radius:8px;margin-left:6px">V2 MỚI</span></button>' +
      '<div class="gauge" style="margin-bottom:12px"><div class="ring">' + ring(avg) + '<div class="val">' + avg + "%</div></div>" +
      "<div><h3>Tiến độ bình quân: " + avg + "%</h3><p>10 cán bộ chủ chốt · Nguồn: Phụ lục Nghị quyết 09-NQ/CB</p>" +
      "<span class='rank'>XẾP LOẠI: XUẤT SẮC</span></div></div>" +
      '<div class="stat4" style="margin-bottom:12px">' +
      '<div class="s"><b>' + D.TASKS.filter(function (t) { return t.pct >= 90; }).length + "</b><span>≥ 90% (Hoàn thành tốt)</span></div>" +
      '<div class="s"><b>' + D.TASKS.filter(function (t) { return t.pct >= 80 && t.pct < 90; }).length + "</b><span>80-89% (Đúng tiến độ)</span></div>" +
      '<div class="s"><b>' + D.TASKS.filter(function (t) { return t.pct < 80; }).length + "</b><span>&lt; 80% (Cần đôn đốc)</span></div>" +
      '<div class="s"><b>17/09</b><span>Hạn PCTT gần nhất</span></div></div>' +
      D.TASKS.map(function (t, i) {
        var cls = t.pct >= 90 ? "g" : t.pct >= 80 ? "a" : "";
        return '<div style="border:1px solid #eceff5;border-radius:11px;padding:11px;margin-bottom:9px;background:#fff">' +
          "<div style='display:flex;gap:9px;align-items:center;margin-bottom:7px'>" +
          "<div class='av' style='width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#e0183a,#93061d);color:#fff;display:grid;place-items:center;font-weight:800;font-size:12px'>" + esc(initials(t.hoTen)) + "</div>" +
          "<div style='flex:1;min-width:0'><b style='font-size:13.2px'>" + esc(t.hoTen) + "</b>" +
          "<div style='font-size:11px;color:#7b8497'>" + esc(t.chucVu) + "</div></div>" +
          "<b style='color:#C8102E;font-size:15px'>" + t.pct + "%</b></div>" +
          "<div style='font-size:12.4px;color:#4a5265;margin-bottom:6px'>" + esc(t.viec) + "</div>" +
          "<div class='track'><i class='" + cls + "' style='width:" + t.pct + "%'></i></div>" +
          "<div style='font-size:11.2px;color:#7b8497;margin-top:6px'>Hạn: <b>" + esc(t.han) + "</b> · " + esc(t.trangThai) + "</div>" +
          "<div style='display:flex;gap:6px;margin-top:9px'>" +
          "<button class='btn gray sm' data-t='" + i + "'>" + ic("eye") + " Chi tiết “6 Rõ”</button>" +
          "<button class='btn gray sm' data-w='" + i + "'>" + ic("warn") + " Đôn đốc</button></div></div>";
      }).join("");
    var m = sheet('Dashboard phân công nhiệm vụ “6 Rõ”', html);
    var dashRm = m.querySelector("#dash-roadmap-btn");
    if (dashRm) {
      dashRm.addEventListener("click", function () {
        m.querySelector(".x").click();
        openRoadmapV2Modal();
      });
    }
    m.querySelectorAll("[data-t]").forEach(function (bt) {
      bt.addEventListener("click", function () { openTask(D.TASKS[+bt.dataset.t]); });
    });
    m.querySelectorAll("[data-w]").forEach(function (bt) {
      bt.addEventListener("click", function () {
        var t = D.TASKS[+bt.dataset.w];
        logAdd('Gửi nhắc việc (đôn đốc) tới ' + t.hoTen + " — hạn " + t.han, "wr");
        toast("Đã ghi nhận đôn đốc: " + t.hoTen, "ok");
      });
    });
  }

  function openTask(t) {
    logAdd("Xem chi tiết phân công “6 Rõ”: " + t.hoTen);
    var keys = [["nguoi", "Rõ người"], ["viec", "Rõ việc"], ["thoiGian", "Rõ thời gian"],
    ["quyTrinh", "Rõ quy trình"], ["sanPham", "Rõ sản phẩm"], ["trachNhiem", "Rõ trách nhiệm"]];
    sheet(t.hoTen + " — Bảng phân công “6 Rõ”",
      '<div class="prose">' +
      '<div class="tblwrap" style="margin-bottom:11px"><table><tbody>' +
      "<tr><th style='width:32%'>Chức vụ</th><td>" + esc(t.chucVu) + "</td></tr>" +
      "<tr><th>Nhiệm vụ (Rõ việc)</th><td>" + esc(t.viec) + "</td></tr>" +
      "<tr><th>Sản phẩm bàn giao (Rõ sản phẩm)</th><td>" + esc(t.sanPham) + "</td></tr>" +
      "<tr><th>Thời hạn (Rõ thời gian)</th><td><b>" + esc(t.han) + "</b></td></tr>" +
      "<tr><th>Quy trình thực hiện (Rõ quy trình)</th><td>" + esc(t.quyTrinh) + "</td></tr>" +
      "<tr><th>Trách nhiệm (Rõ trách nhiệm)</th><td>" + esc(t.trachNhiem) + "</td></tr>" +
      "<tr><th>Trạng thái</th><td>" + esc(t.trangThai) + " — tiến độ <b>" + t.pct + "%</b></td></tr>" +
      "</tbody></table></div>" +
      "<h4 style='margin-top:0'>Đánh giá mức độ đạt theo 6 tiêu chí</h4>" +
      keys.map(function (k) {
        var v = t.ro[k[0]];
        return "<div class='bar-row'><div class='nm'>" + k[1] + "</div><div class='track'><i class='" +
          (v >= 90 ? "g" : v >= 80 ? "a" : "") + "' style='width:" + v + "%'></i></div><div class='pc'>" + v + "%</div></div>";
      }).join("") +
      '<div class="note">Điểm tổng hợp: <b>' + t.pct + "%</b> — làm căn cứ xếp loại chất lượng đảng viên cuối năm 2026 và bình xét thi đua của TDP.</div>" +
      "</div>");
  }

  /* ---------------- 2 NÚT TƯ LIỆU VĂN KIỆN ĐẢNG ---------------- */
  function renderTw() {
    var b = $("#tw-box"); if (!b) return;
    b.innerHTML =
      '<div class="tw-btns">' +
      '<a class="b1" href="https://tulieuvankien.dangcongsan.vn" target="_blank" rel="noopener">' + ic("star") +
      "<b>Văn kiện Đảng</b><span>Tư liệu - Văn kiện Đảng Cộng sản Việt Nam (Đại hội, Cương lĩnh, Điều lệ)</span>" +
      "<span style='margin-top:auto;font-size:10.4px'>tulieuvankien.dangcongsan.vn " + ic("ext") + "</span></a>" +
      '<a class="b2" href="https://tulieuvankien.dangcongsan.vn/he-thong-van-ban/van-ban-cua-dang" target="_blank" rel="noopener">' + ic("doc") +
      "<b>Văn bản của Đảng</b><span>Hệ thống văn bản: Nghị quyết, Kết luận, Quy định, Hướng dẫn của Trung ương</span>" +
      "<span style='margin-top:auto;font-size:10.4px'>Hệ thống văn bản của Đảng " + ic("ext") + "</span></a>" +
      "</div>" +
      '<h3 style="font-size:13.4px;margin:14px 0 8px">HỆ THỐNG VĂN BẢN MỚI CỦA TRUNG ƯƠNG</h3>' +
      '<ul class="doclist" style="list-style:none;padding:0;margin:0">' + D.DOCS_TW.map(function (d, i) {
        return '<li><span class="k tw">' + esc(d.cq.split(" ").pop().slice(0, 4).toUpperCase()) + "</span>" +
          "<div style='flex:1;min-width:0'><b>" + esc(d.so) + " — " + esc(d.ten) + "</b>" +
          '<div class="m"><span>' + ic("clock") + " " + esc(d.ngay) + "</span><span>" + esc(d.cq) + "</span>" +
          (d.ky ? "<span>Người ký: " + esc(d.ky) + "</span>" : "") + "</div></div>" +
          '<span class="acts"><button class="btn sm" data-tw="' + i + '">' + ic("eye") + " Đọc</button></span></li>";
      }).join("") + "</ul>" +
      '<div class="note">Thực hiện Kế hoạch 213-KH/VPTW về chuyển đổi số trong hệ thống Văn phòng cấp uỷ giai đoạn 2026 - 2030, ' +
      "Chi bộ tổ chức quán triệt 4 văn bản trên tại sinh hoạt tháng 9/2026 và cập nhật vào Sổ tay Đảng viên điện tử.</div>";
    b.querySelectorAll("[data-tw]").forEach(function (bt) {
      bt.addEventListener("click", function () { openTw(D.DOCS_TW[+bt.dataset.tw]); });
    });
    b.querySelectorAll(".doclist li").forEach(function (li) {
      var btn = li.querySelector("[data-tw]");
      if (btn) {
        li.style.cursor = "pointer";
        li.addEventListener("click", function (e) {
          if (!e.target.closest("button") && !e.target.closest("a")) btn.click();
        });
      }
    });
    b.querySelectorAll(".tw-btns svg").forEach(function (s) { s.style.width = "20px"; s.style.height = "20px"; });
    b.querySelectorAll(".m svg").forEach(function (s) { s.style.width = "11px"; s.style.height = "11px"; s.style.verticalAlign = "-1px"; });
  }
  function openTw(d) {
    logAdd("Mở văn bản Trung ương: " + d.so);
    var m = sheet(d.so + " (" + d.ngay + ")",
      '<div class="prose"><h4 style="margin-top:0">' + esc(d.ten) + "</h4>" +
      '<div class="tblwrap"><table><tbody>' +
      "<tr><th style='width:32%'>Số hiệu</th><td><b>" + esc(d.so) + "</b></td></tr>" +
      "<tr><th>Cơ quan ban hành</th><td>" + esc(d.cq) + "</td></tr>" +
      "<tr><th>Ngày ban hành</th><td>" + esc(d.ngay) + "</td></tr>" +
      "<tr><th>Người ký</th><td>" + esc(d.ky) + "</td></tr>" +
      "</tbody></table></div>" +
      "<h4>Trích yếu</h4><p>" + esc(d.tomTat) + "</p>" +
      "<h4>Liên hệ với Chi bộ TDP Lương Hậu</h4><p>" + esc(d.lienHe) + "</p>" +
      '<div class="btn-row" style="margin-top:12px">' +
      '<a class="btn sm" href="https://tulieuvankien.dangcongsan.vn/he-thong-van-ban/van-ban-cua-dang" target="_blank" rel="noopener">' + ic("ext") + " Xem toàn văn trên Tư liệu Văn kiện Đảng</a>" +
      '<button class="btn gray sm" id="tw-print">' + ic("doc") + " In trích yếu</button></div></div>");
    m.querySelector("#tw-print").addEventListener("click", function () { window.print(); });
  }

  /* ---------------- TABS ---------------- */
  var TABS = [
    { k: "tongquan", l: "Tổng quan", i: "home" },
    { k: "vanbanmoi", l: "Văn bản mới Phường & TP", i: "star" },
    { k: "canbo", l: "Cán bộ, đảng viên", i: "users" },
    { k: "vanban", l: "Văn bản Chi bộ", i: "doc" },
    { k: "trunguong", l: "Văn kiện Đảng", i: "flag" },
    { k: "sotay", l: "Sổ tay Đảng viên", i: "book" },
    { k: "nhatky", l: "Nhật ký truy cập", i: "shield" }
  ];
  function switchTab(k) {
    if (!TABS.filter(function (t) { return t.k === k; }).length) k = "tongquan";
    $$(".nb-tabs button").forEach(function (b) { b.classList.toggle("on", b.dataset.t === k); });
    $$(".nb-pane").forEach(function (p) { p.classList.toggle("hide", p.dataset.p !== k); });
    var pane = $('.nb-pane[data-p="' + k + '"]');
    if (pane) { pane.classList.remove("fade"); void pane.offsetWidth; pane.classList.add("fade"); }
    if (location.hash !== "#/noi-bo/" + k) {
      try { history.replaceState(null, "", "#/noi-bo/" + k); } catch (e) { location.hash = "#/noi-bo/" + k; }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function renderTabs() {
    var box = $("#nb-tabs");
    if (box) {
      box.innerHTML = TABS.map(function (t) {
        return '<button data-t="' + t.k + '">' + ic(t.i) + esc(t.l) + "</button>";
      }).join("");
      box.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () { switchTab(b.dataset.t); });
        b.querySelectorAll("svg").forEach(function (s) { s.style.width = "14px"; s.style.height = "14px"; });
      });
    }
    $$(".crest").forEach(function (e) { e.innerHTML = CREST; });
    $$("[data-ic]").forEach(function (e) { e.innerHTML = ic(e.dataset.ic); });
  }

  /* ---------------- INIT ---------------- */
  function init() {
    renderTabs();
    var f = $("#lock-form");
    f.addEventListener("submit", doLogin);
    /* tự tách ngày/tháng/năm khi gõ: 01012000 → 01/01/2000 */
    $("#in-ns").addEventListener("input", function (e) {
      var raw = e.target.value.replace(/[^\d]/g, "").slice(0, 8);
      var out = raw;
      if (raw.length > 4) out = raw.slice(0, 2) + "/" + raw.slice(2, 4) + "/" + raw.slice(4);
      else if (raw.length > 2) out = raw.slice(0, 2) + "/" + raw.slice(2);
      if (out !== e.target.value) e.target.value = out;
    });
    $("#btn-logout").addEventListener("click", function () { exit(); });
    $("#btn-home").addEventListener("click", function () { location.href = HOME_URL; });
    var btnRm = $("#btn-roadmap-v2");
    if (btnRm) btnRm.addEventListener("click", openRoadmapV2Modal);
    $("#btn-reload-log").addEventListener("click", function () { renderLog(); toast("Đã làm mới nhật ký"); });

    renderLockMsg();
    setInterval(renderLockMsg, 1000);

    /* khôi phục phiên duy trì trong localStorage hoặc sessionStorage */
    var s = null;
    try { s = JSON.parse(localStorage.getItem(K.SESSION) || sessionStorage.getItem(K.SESSION) || "null"); } catch (e) {}
    if (s) {
      user = D.ROSTER.filter(function (r) { return r.id === s.id; })[0];
      if (user) { logAdd("Duy trì đăng nhập — chào mừng đồng chí " + user.hoTen + " (" + user.chucVu + ")", ""); enter(); return; }
    }
    window.addEventListener("hashchange", function () {
      if ($("#nbapp").classList.contains("on")) switchTab(location.hash.split("/")[2] || "tongquan");
      else if (location.hash.indexOf("#/noi-bo") === 0) $("#in-name").focus();
    });
    showWarn("Khu vực nội bộ dành riêng cho " + D.ROSTER.length + " đảng viên Chi bộ TDP Lương Hậu có tên trong danh sách kèm theo " +
      "Quyết định 46-QĐ/ĐU ngày 30/6/2026 của Đảng ủy phường Hương Thủy. Vui lòng nhập đúng họ tên và ngày, tháng, năm sinh đã đăng ký với Chi bộ.");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
