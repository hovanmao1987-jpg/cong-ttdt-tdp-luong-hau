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
    flag: "<path d='M6 3v18M6 4.5h11l-2 3.5 2 3.5H6z' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linejoin='round'/>",
    image: "<rect x='3' y='3' width='18' height='18' rx='2' fill='none' stroke='currentColor' stroke-width='1.6'/><circle cx='8.5' cy='8.5' r='1.5' fill='currentColor'/><path d='M21 15l-5-5L5 21' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>"
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

  /* ---------------- NHẬT KÝ KIỂM TOÁN (AUDIT LOG - CHỐNG GIAN LẬN) ---------------- */
  /* Tuân thủ chuẩn 14 Action Types:
     LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT,
     CREATE, UPDATE, SUBMIT, APPROVE, REJECT, PUBLISH, UNPUBLISH, DELETE, RESTORE,
     VIEW_SENSITIVE, PERMISSION_CHANGE */
  function logGet() {
    var a = [];
    try { a = JSON.parse(localStorage.getItem(K.LOG) || "[]"); } catch (e) {}
    if (!a.length) {
      a = D.AUDIT_SEED.map(function (x) {
        return {
          id: "seed_" + Math.random().toString(36).substr(2, 6),
          t: x.t,
          timestamp: new Date().toISOString(),
          user_id: "seed_admin",
          user_name: "Hệ thống Chi bộ",
          role: "BI_THU",
          action: "SYSTEM_INIT",
          resource_type: "SYSTEM",
          resource_id: "0",
          m: x.m,
          c: x.c || ""
        };
      });
    }
    return a;
  }
  function logAdd(action, resourceType, resourceId, summary, details, level) {
    // Tương thích ngược nếu gọi logAdd(msg, cls)
    if (arguments.length <= 2 && typeof action === "string" && (!resourceType || resourceType === "ok" || resourceType === "no" || resourceType === "wr")) {
      var legacyMsg = action;
      var legacyCls = resourceType || "";
      var legacyAction = legacyCls === "ok" ? "LOGIN_SUCCESS" : legacyCls === "no" ? "LOGIN_FAILED" : legacyCls === "wr" ? "WARNING" : "INFO";
      action = legacyAction;
      resourceType = "GENERAL";
      resourceId = "-";
      summary = legacyMsg;
      level = legacyCls;
    }
    var a = logGet();
    var uRole = user ? getUserRole(user) : "PUBLIC";
    var logItem = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      t: now(),
      timestamp: new Date().toISOString(),
      user_id: user ? (user.id || user.stt || "guest") : "anonymous",
      user_name: user ? user.hoTen : "Khách chưa xác thực",
      role: uRole,
      action: action || "GENERAL",
      resource_type: resourceType || "CMS",
      resource_id: resourceId || "-",
      m: summary || "",
      details: details || "",
      c: level || (action.indexOf("FAIL") >= 0 || action.indexOf("REJECT") >= 0 ? "no" : action.indexOf("SUCCESS") >= 0 || action.indexOf("APPROVE") >= 0 || action.indexOf("PUBLISH") >= 0 ? "ok" : "")
    };
    a.unshift(logItem);
    try { localStorage.setItem(K.LOG, JSON.stringify(a.slice(0, 300))); } catch (e) {}
    renderLog();
    return logItem;
  }
  function renderLog() {
    var b = $("#log-box"); if (!b) return;
    var a = logGet();
    b.innerHTML =
      '<div style="margin-bottom:8px;font-size:11.8px;color:#64748b">Tổng số sự kiện kiểm toán: <b>' + a.length + '</b> (Lưu trữ bất biến, không thể xoá tùy tiện)</div>' +
      '<div class="log" style="max-height:360px;overflow-y:auto">' + a.map(function (x) {
      var actBadge = x.action ? ('<span class="cms-badge ' + (x.c === 'ok' ? 'green' : x.c === 'no' ? 'red' : 'blue') + '" style="font-size:9.5px;padding:1px 5px">' + esc(x.action) + '</span> ') : '';
      return '<div><span class="t">' + esc(x.t) + "</span> " + actBadge + "<span class='" + (x.c || "") + "'>" + esc(x.m) + "</span></div>";
    }).join("") + "</div>" +
      '<div class="btn-row" style="margin-top:10px">' +
      '<button class="btn sm" id="log-export" style="background:#0b4d97;color:#fff">' + ic("dl") + " Xuất nhật ký (.txt)</button>" +
      '<button class="btn gray sm" id="log-export-json">' + ic("ext") + " Xuất JSON (.json)</button>" +
      '</div>';

    $("#log-export").addEventListener("click", function () {
      var txt = "NHẬT KÝ KIỂM TOÁN AN TOÀN — KHU NỘI BỘ CHI BỘ TDP LƯƠNG HẬU\n" +
        "Thời gian xuất: " + now() + "\n" +
        "Chuẩn vận hành: Quyết định 556-QĐ/VPTW ngày 06/9/2026\n" +
        "=".repeat(70) + "\n" +
        a.map(function (x) {
          return "[" + x.t + "] [" + (x.action || "INFO") + "] [" + (x.user_name || "N/A") + " (" + (x.role || "N/A") + ")] " + x.m;
        }).join("\n");
      var blob = new Blob(["\ufeff" + txt], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob), l = document.createElement("a");
      l.href = url; l.download = "audit-log-chibo-luong-hau-" + new Date().toISOString().slice(0, 10) + ".txt";
      l.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
      toast("Đã xuất nhật ký kiểm toán (.txt)", "ok");
    });

    $("#log-export-json").addEventListener("click", function () {
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(a, null, 2));
      var l = document.createElement("a");
      l.setAttribute("href", dataStr);
      l.setAttribute("download", "audit-log-chibo-luong-hau-" + new Date().toISOString().slice(0, 10) + ".json");
      l.click();
      toast("Đã xuất nhật ký JSON", "ok");
    });
    // TUYỆT ĐỐI KHÔNG cung cấp nút xóa nhật ký (Audit Log Tamper-Proofing)
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
    renderTabs();
    renderUserCard(); renderOverview(); renderHandbook(); renderDocs(); renderNewDocs(); renderCadres(); renderTw(); renderLog(); renderCms();
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
    renderTabs();
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
      ((user && canUser("VIEW_CMS", null, user)) ? ('<button class="btn sm" style="background:#0b4d97;color:#fff" data-go="cms">' + ic("grid") + ' Quản trị CMS</button>') : '') +
      '<button class="btn sm" data-go="canbo">' + ic("users") + ' Dashboard “6 Rõ”</button>' +
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
  function getChiBoDocs() {
    var extra = [];
    try { extra = JSON.parse(localStorage.getItem("lh.cms.docs") || "[]"); } catch (e) {}
    return extra.concat(D.DOCS);
  }
  function renderDocs() {
    var b = $("#doc-box"); if (!b) return;
    var allDocs = getChiBoDocs();
    var items = docFilter === "ALL" ? allDocs : allDocs.filter(function (d) { return d.loai === docFilter; });
    b.innerHTML =
      '<div class="filterbar">' + DOC_FILTERS.map(function (f) {
        var n = f.k === "ALL" ? allDocs.length : allDocs.filter(function (d) { return d.loai === f.k; }).length;
        return '<button data-f="' + f.k + '" class="' + (docFilter === f.k ? "on" : "") + '">' + esc(f.l) + " (" + n + ")</button>";
      }).join("") + "</div>" +
      '<ul class="doclist" style="list-style:none;padding:0;margin:0">' + items.map(function (d, i) {
        return '<li><span class="k ' + (d.type || "nq") + '">' + esc(d.loai) + "</span>" +
          "<div style='flex:1;min-width:0'><b>" + esc(d.so) + " — " + esc(d.ten) + "</b>" +
          (d.fileDocx ? "<div style='font-size:11.4px;color:#d97706;margin:2px 0 3px'>📄 Tệp Word gốc: <b>" + esc(d.fileDocx) + "</b></div>" : "") +
          '<div class="m"><span>' + ic("clock") + " " + esc(d.ngay) + "</span><span>Ký: " + esc(d.ky) + "</span>" +
          "<span>" + d.trang + " trang</span></div></div>" +
          '<span class="acts"><button class="btn gray sm" data-v="' + allDocs.indexOf(d) + '">' + ic("eye") + "</button></span></li>";
      }).join("") + "</ul>" +
      '<div class="note red">Văn bản của Chi bộ chỉ được đọc trong Khu nội bộ. Việc in, trích dẫn, phổ biến ra ngoài phải được Bí thư Chi bộ cho phép bằng văn bản.</div>';

    b.querySelectorAll(".filterbar button").forEach(function (bt) {
      bt.addEventListener("click", function () { docFilter = bt.dataset.f; renderDocs(); });
    });
    b.querySelectorAll("[data-v]").forEach(function (bt) {
      bt.addEventListener("click", function () { openDoc(allDocs[+bt.dataset.v]); });
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

  function openDashboard() {
    logAdd('Mở Dashboard phân công nhiệm vụ "6 Rõ"');
    var avg = (D.TASKS.reduce(function (a, x) { return a + x.pct; }, 0) / D.TASKS.length).toFixed(1);
    var html =
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

  /* =====================================================================
     HỆ THỐNG CMS QUẢN TRỊ NỘI BỘ CHI BỘ TDP LƯƠNG HẬU
     Phiên bản: Master CMS Engine — Tuân thủ kiểm toán an toàn & phân quyền
     Quy trình duyệt: DRAFT -> SUBMITTED -> APPROVED / REJECTED -> PUBLISHED -> UNPUBLISHED -> DELETED -> RESTORED
     Phân quyền (RBAC): BÍ THƯ (Toàn quyền) | CHI UỶ (Soạn, Sửa, Gửi duyệt) | ĐẢNG VIÊN (Xem & Đóng góp ý kiến)
     ===================================================================== */

  /* ---------------- PHÂN QUYỀN HÀNH ĐỘNG (ACTION-BASED RBAC) ---------------- */
  function getUserRole(u) {
    if (!u) return "PUBLIC";
    var cv = (u.chucVu || "").toLowerCase();
    if (cv.indexOf("phó") < 0 && (cv.indexOf("bí thư chi bộ") >= 0 || cv.indexOf("bí thư") === 0)) return "BI_THU";
    if (cv.indexOf("phó bí thư") >= 0 || cv.indexOf("chi ủy") >= 0 || cv.indexOf("chi uỷ") >= 0 || cv.indexOf("tổ trưởng") >= 0) return "CHI_UY";
    return "DANG_VIEN";
  }

  function canUser(action, resource, u) {
    var role = getUserRole(u);
    if (role === "PUBLIC") return false;

    switch (action) {
      case "VIEW_CMS":
        return role === "BI_THU" || role === "CHI_UY";
      case "CREATE_POST":
        return role === "BI_THU" || role === "CHI_UY" || role === "DANG_VIEN";
      case "EDIT_POST":
        if (!resource) return false;
        if (resource.status === "DELETED") return false;
        if (role === "BI_THU") return true;
        // Bài đã PUBLISHED: Chỉ Bí thư và Chi ủy viên được sửa
        if (resource.status === "PUBLISHED" && role === "CHI_UY") return true;
        // Tác giả có thể sửa khi là DRAFT hoặc REJECTED
        if ((resource.status === "DRAFT" || resource.status === "REJECTED") && resource.author_id === u.id) return true;
        // Chi ủy có thể hiệu đính các bài nháp nội bộ
        if ((resource.status === "DRAFT" || resource.status === "REJECTED") && role === "CHI_UY") return true;
        return false;
      case "SUBMIT_POST":
        if (!resource) return false;
        return (resource.status === "DRAFT" || resource.status === "REJECTED") && (resource.author_id === u.id || role === "CHI_UY");
      case "APPROVE_POST":
        if (!resource || resource.status !== "SUBMITTED") return false;
        // QUY TẮC BẢO MẬT BẮT BUỘC (BA Exception): Người tạo KHÔNG ĐƯỢC tự duyệt (trừ Bí thư)
        if (resource.author_id === u.id && role !== "BI_THU") return false;
        return role === "BI_THU";
      case "REJECT_POST":
        if (!resource || resource.status !== "SUBMITTED") return false;
        return role === "BI_THU";
      case "PUBLISH_POST":
        // Chỉ bài đã APPROVED mới được phép PUBLISHED
        if (!resource || resource.status !== "APPROVED") return false;
        return role === "BI_THU";
      case "UNPUBLISH_POST":
        if (!resource || resource.status !== "PUBLISHED") return false;
        return role === "BI_THU";
      case "DELETE_POST":
        if (!resource || resource.status === "DELETED") return false;
        if (resource.author_id === u.id && resource.status === "DRAFT") return true;
        return role === "BI_THU";
      case "RESTORE_POST":
        if (!resource || resource.status !== "DELETED") return false;
        return role === "BI_THU";
      case "MANAGE_FEEDBACK":
        return role === "BI_THU" || role === "CHI_UY";
      case "MANAGE_TASKS":
        return role === "BI_THU" || role === "CHI_UY";
      case "BACKUP_RESTORE":
        return role === "BI_THU";
      case "VIEW_AUDIT_LOG":
        return true;
      default:
        return false;
    }
  }

  var cmsSubtab = "news";
  var cmsStatusFilter = "ALL";
  var cmsFeedbackFilter = "ALL";
  var cmsMediaList = [];
  var cmsMediaLoading = false;
  var cmsMediaSearch = "";

  /* ---------------- DỊCH VỤ ĐỒNG BỘ ĐÁM MÂY (GOOGLE APPS SCRIPT) ---------------- */
  /* TUYỆT ĐỐI TUÂN THỦ:
     - URL Web App lưu trong localStorage (hoặc cấu hình)
     - CMS_SECRET_KEY CHỈ LƯU TRONG sessionStorage (BỘ NHỚ PHIÊN) của Bí thư/Chi ủy
     - Mọi thao tác ghi/xóa/xuất bản đều gửi kèm CMS_SECRET_KEY để Apps Script đối soát phía server
     - Không bao giờ commit khóa hay đưa khóa vào mã nguồn */
  var GAS_URL_KEY = "lh_gas_webapp_url";
  var GAS_KEY_KEY = "lh_cms_secret_key";

  function getGasUrl() {
    return localStorage.getItem(GAS_URL_KEY) || "";
  }
  function setGasUrl(url) {
    if (url) localStorage.setItem(GAS_URL_KEY, String(url).trim());
    else localStorage.removeItem(GAS_URL_KEY);
  }
  function getGasSecretKey() {
    return sessionStorage.getItem(GAS_KEY_KEY) || "";
  }
  function setGasSecretKey(key) {
    if (key) sessionStorage.setItem(GAS_KEY_KEY, String(key).trim());
    else sessionStorage.removeItem(GAS_KEY_KEY);
  }

  function callAppsScript(action, payload, method) {
    var webAppUrl = getGasUrl();
    if (!webAppUrl) {
      return Promise.reject(new Error("Chưa cấu hình URL Google Apps Script. Vui lòng bấm 'Cấu hình Đám mây' để nhập URL Web App."));
    }
    var isPost = method === "POST" || action === "uploadImage" || action === "deleteImage" || action === "publishPost" || action === "updatePostStatus";
    var secretKey = getGasSecretKey();

    if (isPost && !secretKey) {
      return Promise.reject(new Error("Chưa nhập Mã khoá bảo mật CMS. Vui lòng bấm 'Cấu hình Đám mây' để nhập mã khoá phiên làm việc."));
    }

    if (isPost) {
      var bodyData = Object.assign({}, payload || {}, {
        action: action,
        secretKey: secretKey
      });
      return fetch(webAppUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(bodyData)
      }).then(function (res) {
        return res.json();
      });
    } else {
      var url = webAppUrl + (webAppUrl.indexOf("?") >= 0 ? "&" : "?") + "action=" + encodeURIComponent(action);
      if (payload) {
        for (var k in payload) {
          if (payload.hasOwnProperty(k)) {
            url += "&" + encodeURIComponent(k) + "=" + encodeURIComponent(payload[k]);
          }
        }
      }
      return fetch(url).then(function (res) {
        return res.json();
      });
    }
  }

  function compressAndResizeImage(file, maxWidth, maxHeight, quality) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function (e) {
        var img = new Image();
        img.onerror = reject;
        img.onload = function () {
          var w = img.width;
          var h = img.height;
          var maxW = maxWidth || 1600;
          var maxH = maxHeight || 1600;

          if (w > maxW || h > maxH) {
            if (w / maxW > h / maxH) {
              h = Math.round((h * maxW) / w);
              w = maxW;
            } else {
              w = Math.round((w * maxH) / h);
              h = maxH;
            }
          }

          var canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);

          var mimeType = "image/webp";
          var dataUrl = canvas.toDataURL(mimeType, quality || 0.85);
          if (!dataUrl || dataUrl.indexOf("data:image/webp") === -1) {
            mimeType = "image/jpeg";
            dataUrl = canvas.toDataURL(mimeType, quality || 0.85);
          }
          resolve({
            dataUrl: dataUrl,
            mimeType: mimeType,
            width: w,
            height: h
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function openGasSettingsModal() {
    var curUrl = getGasUrl();
    var curKey = getGasSecretKey();

    var formHtml =
      '<div class="cms-form" id="f-gas-config">' +
      '<div class="note blue" style="margin-bottom:12px">' +
      '<b>Cấu hình kết nối Google Apps Script &amp; Google Drive / Sheets</b><br>' +
      'Được thiết kế theo nguyên tắc an toàn: Mã khoá <code>CMS_SECRET_KEY</code> được bảo mật trên máy chủ Apps Script, người dùng nhập vào trình duyệt chỉ lưu trong bộ nhớ phiên làm việc (<code>sessionStorage</code>), tuyệt đối không lưu vào file mã nguồn hay repo.' +
      '</div>' +
      '<div class="field">' +
      '<label>URL Web App Google Apps Script</label>' +
      '<input type="text" id="gas-url" value="' + esc(curUrl) + '" placeholder="https://script.google.com/macros/s/.../exec">' +
      '<div style="font-size:11.5px;color:#64748b;margin-top:4px">Được cấp khi Triển khai (Deploy) Web App trong Google Apps Script.</div>' +
      '</div>' +
      '<div class="field">' +
      '<label>Mã khoá quản trị phiên (CMS_SECRET_KEY) <span style="color:#c8102e">*</span></label>' +
      '<input type="password" id="gas-key" value="' + esc(curKey) + '" placeholder="Nhập mã khoá bí mật...">' +
      '<div style="font-size:11.5px;color:#64748b;margin-top:4px">Khóa khớp với cấu hình <code>CMS_SECRET_KEY</code> trong Script Properties. Chỉ lưu trong bộ nhớ phiên làm việc của tab này.</div>' +
      '</div>' +
      '<div id="gas-test-result" style="display:none;padding:8px 12px;border-radius:6px;font-size:12px;margin-bottom:12px"></div>' +
      '<div class="btn-row" style="display:flex;gap:8px">' +
      '<button class="btn sm" id="btn-gas-test" type="button" style="background:#0b4d97;color:#fff">' + ic("ext") + ' Kiểm tra kết nối</button>' +
      '<button class="btn sm" id="btn-gas-save" type="button" style="background:#166534;color:#fff">' + ic("check") + ' Lưu cấu hình</button>' +
      '<button class="btn gray sm" id="btn-gas-close" type="button">Đóng</button>' +
      '</div>' +
      '</div>';

    var m = sheet("Cấu hình Đám mây (Apps Script / Google Drive)", formHtml);
    var boxResult = m.querySelector("#gas-test-result");

    m.querySelector("#btn-gas-test").addEventListener("click", function () {
      var url = m.querySelector("#gas-url").value.trim();
      if (!url) {
        alert("Vui lòng nhập URL Web App trước khi kiểm tra.");
        return;
      }
      boxResult.style.display = "block";
      boxResult.style.background = "#eff6ff";
      boxResult.style.color = "#1e40af";
      boxResult.style.border = "1px solid #bfdbfe";
      boxResult.innerHTML = "⏳ Đang kết nối thử nghiệm đến Google Apps Script...";

      fetch(url + (url.indexOf("?") >= 0 ? "&" : "?") + "action=ping")
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.success) {
            boxResult.style.background = "#ecfdf5";
            boxResult.style.color = "#065f46";
            boxResult.style.border = "1px solid #a7f3d0";
            boxResult.innerHTML = "✓ Kết nối thành công! Máy chủ Apps Script đang hoạt động sẵn sàng.";
          } else {
            boxResult.style.background = "#fff1f2";
            boxResult.style.color = "#9f1239";
            boxResult.style.border = "1px solid #fecdd3";
            boxResult.innerHTML = "✕ Phản hồi không hợp lệ: " + esc(data.error || "Không xác định");
          }
        })
        .catch(function (err) {
          boxResult.style.background = "#fff1f2";
          boxResult.style.color = "#9f1239";
          boxResult.style.border = "1px solid #fecdd3";
          boxResult.innerHTML = "✕ Lỗi kết nối: " + esc(err.message) + ". Hãy kiểm tra quyền truy cập Web App (Who has access: Anyone).";
        });
    });

    m.querySelector("#btn-gas-save").addEventListener("click", function () {
      var url = m.querySelector("#gas-url").value.trim();
      var key = m.querySelector("#gas-key").value.trim();
      setGasUrl(url);
      setGasSecretKey(key);
      toast("Đã lưu cấu hình kết nối đám mây!", "ok");
      m.querySelector(".x").click();
      if (cmsSubtab === "media") fetchCmsMedia(true);
    });

    m.querySelector("#btn-gas-close").addEventListener("click", function () {
      m.querySelector(".x").click();
    });
  }

  /* ---------------- QUẢN LÝ ĐỒNG BỘ GOOGLE SHEET & CẢNH BÁO CMS ---------------- */
  var cmsSyncAlert = null; // { title: string, reason: string, isMissingKey: boolean }

  function setSyncAlert(reason, isMissingKey) {
    cmsSyncAlert = {
      title: "Đã lưu trong CMS nhưng CHƯA đồng bộ lên web",
      reason: reason,
      isMissingKey: !!isMissingKey
    };
    renderCms();
    if (isMissingKey) {
      openGasSettingsModal();
    }
  }

  function clearSyncAlert() {
    cmsSyncAlert = null;
    var el = document.getElementById("cms-sync-alert-box");
    if (el) el.remove();
  }

  function triggerSyncPost(it, u) {
    if (!it || it.status !== "PUBLISHED") {
      logAdd("SYNC_FAIL", "NEWS", it ? it.id : "-", "Đồng bộ lên Google Sheet thất bại: '" + (it ? it.tieuDe : "") + "'", "Lý do: bài chưa PUBLISHED", "no");
      setSyncAlert("bài chưa PUBLISHED", false);
      return Promise.reject(new Error("Bài chưa PUBLISHED"));
    }

    var webAppUrl = getGasUrl();
    if (!webAppUrl) {
      logAdd("SYNC_FAIL", "NEWS", it.id, "Đồng bộ lên Google Sheet thất bại: '" + it.tieuDe + "'", "Lý do: thiếu URL", "no");
      setSyncAlert("thiếu URL", false);
      return Promise.reject(new Error("Thiếu URL"));
    }

    var secretKey = getGasSecretKey();
    if (!secretKey) {
      logAdd("SYNC_FAIL", "NEWS", it.id, "Đồng bộ lên Google Sheet thất bại: '" + it.tieuDe + "'", "Lý do: thiếu khóa", "no");
      setSyncAlert("thiếu khóa", true);
      return Promise.reject(new Error("Thiếu khóa"));
    }

    return callAppsScript("publishPost", { post: it })
      .then(function (res) {
        if (res && res.success) {
          clearSyncAlert();
          logAdd("SYNC_OK", "NEWS", it.id, "Đồng bộ lên Google Sheet thành công: '" + it.tieuDe + "'", "Người thực hiện: " + (u ? u.hoTen : "Quản trị viên"), "ok");
          toast("Đã cập nhật lên trang công khai", "ok");
          renderCms();
          return res;
        } else {
          var errStr = String(res && res.error ? res.error : "Lỗi phản hồi máy chủ");
          var lowErr = errStr.toLowerCase();
          var shortReason = "lỗi phản hồi";
          var isWrongKey = false;
          if (lowErr.indexOf("khóa") >= 0 || lowErr.indexOf("khoa") >= 0 || lowErr.indexOf("secret") >= 0 || lowErr.indexOf("401") >= 0 || lowErr.indexOf("từ chối") >= 0 || lowErr.indexOf("unauthorized") >= 0) {
            shortReason = "sai khóa";
            isWrongKey = true;
          } else {
            shortReason = errStr;
          }
          logAdd("SYNC_FAIL", "NEWS", it.id, "Đồng bộ lên Google Sheet thất bại: '" + it.tieuDe + "'", "Lý do: " + shortReason, "no");
          setSyncAlert(shortReason, isWrongKey);
          return res;
        }
      })
      .catch(function (err) {
        var errMsg = String(err && err.message ? err.message : err);
        var lowMsg = errMsg.toLowerCase();
        var shortReason = "lỗi mạng";
        var isMissingKey = false;
        if (lowMsg.indexOf("chưa nhập mã khoá") >= 0 || lowMsg.indexOf("thiếu khóa") >= 0) {
          shortReason = "thiếu khóa";
          isMissingKey = true;
        } else if (lowMsg.indexOf("chưa cấu hình url") >= 0 || lowMsg.indexOf("thiếu url") >= 0) {
          shortReason = "thiếu URL";
        }
        logAdd("SYNC_FAIL", "NEWS", it.id, "Đồng bộ lên Google Sheet thất bại: '" + it.tieuDe + "'", "Lý do: " + shortReason, "no");
        setSyncAlert(shortReason, isMissingKey);
      });
  }

  function fetchCmsMedia(force) {
    if (cmsMediaLoading) return;
    var webAppUrl = getGasUrl();
    if (!webAppUrl) return;

    cmsMediaLoading = true;
    var listEl = document.getElementById("cms-media-container");
    if (listEl && force) {
      listEl.innerHTML = '<div style="text-align:center;padding:30px;color:#64748b">⏳ Đang tải danh sách ảnh từ Google Drive...</div>';
    }

    callAppsScript("listImages", null, "GET")
      .then(function (res) {
        cmsMediaLoading = false;
        if (res && res.success && res.images) {
          cmsMediaList = res.images;
          renderCmsMedia();
        } else {
          toast(res.error || "Không thể tải danh sách ảnh", "no");
          renderCmsMedia();
        }
      })
      .catch(function (err) {
        cmsMediaLoading = false;
        console.warn("[CMS Media] Lỗi khi tải ảnh:", err);
        renderCmsMedia();
      });
  }

  function openUploadImageModal(onUploaded) {
    var webAppUrl = getGasUrl();
    var secretKey = getGasSecretKey();
    if (!webAppUrl || !secretKey) {
      alert("Chưa cấu hình URL Web App hoặc chưa nhập Mã khoá bảo mật. Vui lòng bấm 'Cấu hình Đám mây' trước.");
      openGasSettingsModal();
      return;
    }

    var formHtml =
      '<div class="cms-form" id="f-upload-image">' +
      '<div class="note blue" style="margin-bottom:12px">' +
      '<b>Tải hình ảnh lên Google Drive</b><br>' +
      'Ảnh sẽ được nén tự động (WebP chất lượng cao), kiểm tra định dạng an toàn và lưu trữ trực tiếp vào thư mục Google Drive của TDP Lương Hậu.' +
      '</div>' +
      '<div class="field">' +
      '<label>Chọn tệp hình ảnh (JPG, PNG, WEBP — Tối đa 10MB) <span style="color:#c8102e">*</span></label>' +
      '<input type="file" id="up-file" accept="image/jpeg,image/png,image/webp">' +
      '</div>' +
      '<div class="field">' +
      '<label>Tên mô tả hình ảnh (Tùy chọn)</label>' +
      '<input type="text" id="up-name" placeholder="Ví dụ: Dai-hoi-Chi-bo-2026">' +
      '</div>' +
      '<div id="up-preview-box" style="display:none;margin-bottom:12px;text-align:center;background:#f8fafc;padding:10px;border-radius:8px;border:1px solid #e2e8f0">' +
      '<img id="up-preview-img" style="max-width:100%;max-height:200px;border-radius:6px;object-fit:contain" />' +
      '<div id="up-preview-info" style="font-size:11.5px;color:#64748b;margin-top:6px"></div>' +
      '</div>' +
      '<div id="up-status" style="display:none;padding:8px 12px;border-radius:6px;font-size:12px;margin-bottom:12px"></div>' +
      '<div class="btn-row" style="display:flex;gap:8px">' +
      '<button class="btn sm" id="btn-do-upload" type="button" style="background:#0b4d97;color:#fff" disabled>' + ic("dl") + ' Tải lên Google Drive</button>' +
      '<button class="btn gray sm" id="btn-up-cancel" type="button">Hủy</button>' +
      '</div>' +
      '</div>';

    var m = sheet("Tải hình ảnh mới lên Thư viện", formHtml);
    var fileInput = m.querySelector("#up-file");
    var nameInput = m.querySelector("#up-name");
    var previewBox = m.querySelector("#up-preview-box");
    var previewImg = m.querySelector("#up-preview-img");
    var previewInfo = m.querySelector("#up-preview-info");
    var statusBox = m.querySelector("#up-status");
    var btnUpload = m.querySelector("#btn-do-upload");
    var processedData = null;

    fileInput.addEventListener("change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;

      var validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (validTypes.indexOf(file.type.toLowerCase()) === -1) {
        alert("Định dạng file không được phép! Chỉ chấp nhận JPG, PNG hoặc WEBP.");
        fileInput.value = "";
        btnUpload.disabled = true;
        previewBox.style.display = "none";
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("Dung lượng tệp vượt quá 10MB. Vui lòng chọn tệp nhỏ hơn.");
        fileInput.value = "";
        btnUpload.disabled = true;
        previewBox.style.display = "none";
        return;
      }

      if (!nameInput.value.trim()) {
        nameInput.value = file.name.replace(/\.[^/.]+$/, "");
      }

      statusBox.style.display = "block";
      statusBox.style.background = "#eff6ff";
      statusBox.style.color = "#1e40af";
      statusBox.style.border = "1px solid #bfdbfe";
      statusBox.innerHTML = "⏳ Đang tối ưu hoá kích thước ảnh...";

      compressAndResizeImage(file, 1600, 1600, 0.85)
        .then(function (res) {
          processedData = res;
          previewImg.src = res.dataUrl;
          previewInfo.textContent = "Kích thước tối ưu: " + res.width + "x" + res.height + "px (" + res.mimeType + ")";
          previewBox.style.display = "block";
          statusBox.style.display = "none";
          btnUpload.disabled = false;
        })
        .catch(function (err) {
          statusBox.style.display = "block";
          statusBox.style.background = "#fff1f2";
          statusBox.style.color = "#9f1239";
          statusBox.innerHTML = "✕ Không thể xử lý ảnh: " + esc(err.message);
          btnUpload.disabled = true;
        });
    });

    btnUpload.addEventListener("click", function () {
      if (!processedData) return;
      var fileName = (nameInput.value.trim() || "hinh-anh-" + Date.now()).replace(/[^a-zA-Z0-9.-]/g, "_");

      btnUpload.disabled = true;
      statusBox.style.display = "block";
      statusBox.style.background = "#eff6ff";
      statusBox.style.color = "#1e40af";
      statusBox.style.border = "1px solid #bfdbfe";
      statusBox.innerHTML = "⏳ Đang tải ảnh lên Google Drive và thiết lập quyền công khai...";

      callAppsScript("uploadImage", {
        fileName: fileName,
        mimeType: processedData.mimeType,
        base64Data: processedData.dataUrl
      })
        .then(function (res) {
          if (res && res.success && res.file) {
            toast("Tải ảnh lên thành công!", "ok");
            logAdd("CREATE", "MEDIA", res.file.id, "Tải ảnh lên Drive: '" + res.file.name + "'", "Người tải: " + user.hoTen, "ok");
            cmsMediaList.unshift(res.file);
            m.querySelector(".x").click();
            if (cmsSubtab === "media") renderCmsMedia();
            if (onUploaded) onUploaded(res.file);
          } else {
            statusBox.style.background = "#fff1f2";
            statusBox.style.color = "#9f1239";
            statusBox.style.border = "1px solid #fecdd3";
            statusBox.innerHTML = "✕ Tải lên thất bại: " + esc((res && res.error) || "Lỗi không xác định");
            btnUpload.disabled = false;
          }
        })
        .catch(function (err) {
          statusBox.style.background = "#fff1f2";
          statusBox.style.color = "#9f1239";
          statusBox.style.border = "1px solid #fecdd3";
          statusBox.innerHTML = "✕ Lỗi mạng hoặc quyền hạn: " + esc(err.message);
          btnUpload.disabled = false;
        });
    });

    m.querySelector("#btn-up-cancel").addEventListener("click", function () {
      m.querySelector(".x").click();
    });
  }

  function deleteCmsImage(fileId, fileName) {
    if (!canUser("DELETE_POST", null, user)) {
      alert("Chỉ Bí thư hoặc Chi ủy mới có quyền xóa hình ảnh khỏi thư viện.");
      return;
    }

    var allNews = getCmsNews();
    var usedNews = allNews.filter(function (n) {
      if (n.status === "DELETED") return false;
      var str = JSON.stringify(n);
      return str.indexOf(fileId) >= 0 || (n.image && n.image.indexOf(fileId) >= 0);
    });

    if (usedNews.length > 0) {
      alert("RÀNG BUỘC TOÀN VẸN: Hình ảnh này đang được sử dụng trong bài viết '" + usedNews[0].tieuDe + "'. Không thể xóa nếu chưa gỡ khỏi bài viết.");
      return;
    }

    if (!confirm("Đồng chí có chắc chắn muốn chuyển hình ảnh '" + fileName + "' vào thùng rác trên Google Drive?")) {
      return;
    }

    toast("Đang gửi yêu cầu xoá ảnh...", "wr");

    callAppsScript("deleteImage", { fileId: fileId })
      .then(function (res) {
        if (res && res.success) {
          toast("Đã chuyển ảnh vào thùng rác an toàn!", "ok");
          logAdd("DELETE", "MEDIA", fileId, "Xoá ảnh Drive: '" + fileName + "'", "Người xoá: " + user.hoTen, "no");
          cmsMediaList = cmsMediaList.filter(function (x) { return x.id !== fileId; });
          renderCmsMedia();
        } else {
          alert("Không thể xoá ảnh: " + (res.error || "Lỗi không xác định"));
        }
      })
      .catch(function (err) {
        alert("Lỗi khi kết nối đến Apps Script: " + err.message);
      });
  }

  function openImagePickerModal(onSelected) {
    var webAppUrl = getGasUrl();
    if (!webAppUrl) {
      alert("Vui lòng cấu hình URL Google Apps Script trước để truy cập thư viện ảnh.");
      openGasSettingsModal();
      return;
    }

    var pickerHtml =
      '<div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;flex-wrap:wrap">' +
      '<input type="text" id="picker-search" placeholder="Tìm theo tên ảnh..." style="flex:1;min-width:180px;padding:6px 10px;font-size:12px;border:1px solid #cbd5e1;border-radius:6px">' +
      '<button class="btn sm" id="picker-btn-upload" style="background:#0b4d97;color:#fff">' + ic("dl") + ' + Tải ảnh mới</button>' +
      '</div>' +
      '<div id="picker-grid" class="cms-media-grid" style="max-height:360px;overflow-y:auto;padding-bottom:10px">' +
      '</div>' +
      '</div>';

    var m = sheet("Chọn hình ảnh từ Thư viện Drive", pickerHtml);
    var gridEl = m.querySelector("#picker-grid");
    var searchInput = m.querySelector("#picker-search");

    function renderPickerGrid() {
      var q = (searchInput.value || "").toLowerCase().trim();
      var filtered = cmsMediaList.filter(function (it) {
        return !q || (it.name && it.name.toLowerCase().indexOf(q) >= 0);
      });

      if (!filtered.length) {
        gridEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:#64748b">Không có hình ảnh nào. Bấm "+ Tải ảnh mới" để thêm ảnh lên Google Drive.</div>';
        return;
      }

      gridEl.innerHTML = filtered.map(function (it) {
        return '<div class="cms-media-card" data-pick-url="' + esc(it.url) + '" style="cursor:pointer">' +
          '<div class="cms-media-thumb"><img src="' + esc(it.url) + '" alt="' + esc(it.name) + '" loading="lazy" /></div>' +
          '<div class="cms-media-info">' +
          '<span class="cms-media-name" title="' + esc(it.name) + '">' + esc(it.name) + '</span>' +
          '<span class="cms-media-meta">' + esc(it.dateAdded) + '</span>' +
          '</div></div>';
      }).join("");

      gridEl.querySelectorAll("[data-pick-url]").forEach(function (card) {
        card.addEventListener("click", function () {
          var selUrl = card.dataset.pickUrl;
          if (onSelected) onSelected(selUrl);
          m.querySelector(".x").click();
        });
      });
    }

    searchInput.addEventListener("input", renderPickerGrid);

    m.querySelector("#picker-btn-upload").addEventListener("click", function () {
      openUploadImageModal(function () {
        renderPickerGrid();
      });
    });

    if (!cmsMediaList.length) {
      gridEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:#64748b">⏳ Đang kết nối tải danh sách ảnh từ Google Drive...</div>';
      callAppsScript("listImages", null, "GET")
        .then(function (res) {
          if (res && res.success && res.images) {
            cmsMediaList = res.images;
          }
          renderPickerGrid();
        })
        .catch(function () {
          renderPickerGrid();
        });
    } else {
      renderPickerGrid();
    }
  }

  function renderCmsMedia() {
    var container = document.getElementById("cms-media-container");
    if (!container) return;

    var webAppUrl = getGasUrl();
    if (!webAppUrl) {
      container.innerHTML =
        '<div style="text-align:center;padding:36px 16px;background:#f8fafc;border-radius:10px;border:1px dashed #cbd5e1">' +
        '<div style="font-size:28px;margin-bottom:8px">☁️</div>' +
        '<h4 style="margin:0 0 6px 0;color:#1e293b">Chưa cấu hình Google Apps Script</h4>' +
        '<p style="font-size:12.5px;color:#64748b;max-width:480px;margin:0 auto 14px">Để quản trị Thư viện hình ảnh trên Google Drive và đồng bộ bài viết công khai, đồng chí Bí thư vui lòng kết nối URL Web App và mã khóa bí mật.</p>' +
        '<button class="btn sm" id="cms-btn-setup-gas" style="background:#0b4d97;color:#fff">' + ic("ext") + ' Cấu hình kết nối Đám mây</button>' +
        '</div>';
      var btnSetup = container.querySelector("#cms-btn-setup-gas");
      if (btnSetup) btnSetup.addEventListener("click", openGasSettingsModal);
      return;
    }

    var q = (cmsMediaSearch || "").toLowerCase().trim();
    var filtered = cmsMediaList.filter(function (it) {
      return !q || (it.name && it.name.toLowerCase().indexOf(q) >= 0);
    });

    var html =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px;flex-wrap:wrap">' +
      '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:220px">' +
      '<input type="text" id="cms-media-search-input" value="' + esc(cmsMediaSearch) + '" placeholder="Tìm kiếm hình ảnh theo tên..." style="width:100%;padding:7px 11px;font-size:12.5px;border:1px solid #cbd5e1;border-radius:6px">' +
      '</div>' +
      '<div style="display:flex;gap:6px">' +
      '<button class="btn sm" id="cms-btn-refresh-media" style="background:#f1f5f9;color:#334155;border:1px solid #cbd5e1">' + ic("clock") + ' Tải lại từ Drive</button>' +
      '<button class="btn sm" id="cms-btn-add-media" style="background:#0b4d97;color:#fff">' + ic("dl") + ' + Tải ảnh lên</button>' +
      '</div></div>';

    if (!filtered.length) {
      html += '<div style="text-align:center;padding:32px 10px;color:#64748b;background:#f8fafc;border-radius:8px;border:1px dashed #cbd5e1">' +
        (cmsMediaList.length ? 'Không tìm thấy hình ảnh nào khớp với từ khóa tìm kiếm.' : 'Chưa có hình ảnh nào trong Thư viện Google Drive. Bấm "+ Tải ảnh lên" để thêm hình ảnh đầu tiên.') +
        '</div>';
    } else {
      html += '<div class="cms-media-grid">' + filtered.map(function (it) {
        var sizeKb = it.size ? Math.round(it.size / 1024) + " KB" : "";
        return '<div class="cms-media-card" id="card-' + it.id + '">' +
          '<div class="cms-media-thumb" data-view-media="' + it.id + '">' +
          '<img src="' + esc(it.url) + '" alt="' + esc(it.name) + '" loading="lazy" />' +
          '</div>' +
          '<div class="cms-media-info">' +
          '<span class="cms-media-name" title="' + esc(it.name) + '">' + esc(it.name) + '</span>' +
          '<span class="cms-media-meta">📅 ' + esc(it.dateAdded) + (sizeKb ? ' · ' + sizeKb : '') + '</span>' +
          '<div class="cms-media-actions">' +
          '<button class="btn gray sm" data-copy-link="' + esc(it.url) + '" title="Sao chép liên kết ảnh">📋 Link</button>' +
          (canUser("DELETE_POST", null, user) ? '<button class="btn sm" data-del-media="' + it.id + '" data-name="' + esc(it.name) + '" style="background:#fee2e2;color:#991b1b;border:1px solid #fca5a5" title="Xoá ảnh">🗑 Xoá</button>' : '') +
          '</div>' +
          '</div></div>';
      }).join("") + '</div>';
    }

    container.innerHTML = html;

    var searchInput = container.querySelector("#cms-media-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        cmsMediaSearch = searchInput.value;
        renderCmsMedia();
      });
    }

    var btnRefresh = container.querySelector("#cms-btn-refresh-media");
    if (btnRefresh) {
      btnRefresh.addEventListener("click", function () {
        fetchCmsMedia(true);
      });
    }

    var btnAdd = container.querySelector("#cms-btn-add-media");
    if (btnAdd) {
      btnAdd.addEventListener("click", function () {
        openUploadImageModal();
      });
    }

    container.querySelectorAll("[data-copy-link]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var u = btn.dataset.copyLink;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(u);
        }
        toast("Đã sao chép liên kết hình ảnh!", "ok");
      });
    });

    container.querySelectorAll("[data-view-media]").forEach(function (thumbEl) {
      thumbEl.addEventListener("click", function () {
        var fId = thumbEl.dataset.viewMedia;
        var it = cmsMediaList.filter(function (x) { return x.id === fId; })[0];
        if (!it) return;
        sheet("Xem hình ảnh: " + it.name,
          '<div style="text-align:center"><img src="' + esc(it.url) + '" alt="' + esc(it.name) + '" style="max-width:100%;max-height:70vh;border-radius:8px" />' +
          '<div style="font-size:12px;color:#64748b;margin-top:10px">Liên kết: <a href="' + esc(it.url) + '" target="_blank" rel="noopener" style="color:#0284c7;text-decoration:underline">' + esc(it.url) + '</a></div></div>'
        );
      });
    });

    container.querySelectorAll("[data-del-media]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var fId = btn.dataset.delMedia;
        var fName = btn.dataset.name;
        deleteCmsImage(fId, fName);
      });
    });
  }

  function slugify(text) {
    return norm(text).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  /* ---------------- KHỞI TẠO DỮ LIỆU MẪU CHUẨN HOÁ WORKFLOW ---------------- */
  function cmsInitSeeds() {
    if (!localStorage.getItem("lh.cms.news")) {
      var seedNews = [
        {
          id: "news_1",
          slug: "phan-cong-nhiem-vu-to-xung-kich-pctt-tkcn-2026",
          tieuDe: "Triển khai Kế hoạch phân công nhiệm vụ Tổ xung kích PCTT&TKCN năm 2026",
          loai: "Khẩn",
          ngay: "08/09/2026",
          nguoiKy: "Hồ Văn Mão (Bí thư Chi bộ)",
          trichYeu: "Theo Quyết định số 1229/QĐ-UBND ngày 30/7/2026 của UBND phường Hương Thủy. Cán bộ, đảng viên báo cáo tình hình địa bàn lúc 7h00 – 13h00 – 19h00 hằng ngày.",
          noiDung: "Thực hiện phương châm '4 tại chỗ', phân công 100% đảng viên bám sát từng tổ liên gia, rà soát danh sách 469 hộ dân, sẵn sàng hỗ trợ di dời các hộ neo đơn, người già khi ngập lụt.",
          author_id: "dv_01",
          author_name: "Hồ Văn Mão",
          created_at: "08/09/2026 07:30",
          updated_at: "08/09/2026 07:30",
          status: "PUBLISHED",
          submitted_by: "Hồ Văn Mão",
          submitted_at: "08/09/2026 07:35",
          approved_by: "Hồ Văn Mão (Bí thư)",
          approved_at: "08/09/2026 07:40",
          published_by: "Hồ Văn Mão",
          published_at: "08/09/2026 07:45",
          ghim: true
        },
        {
          id: "news_2",
          slug: "chuan-bi-sinh-hoat-chi-bo-thang-10-2026",
          tieuDe: "Chuẩn bị nội dung sinh hoạt Chi bộ thường kỳ ngày 03 tháng 10 năm 2026",
          loai: "Nội bộ",
          ngay: "05/09/2026",
          nguoiKy: "Nguyễn Trọng Nghĩa (Phó Bí thư Chi bộ)",
          trichYeu: "Đánh giá công tác tháng 9; quán triệt 4 văn bản mới của Trung ương; kiểm điểm tiến độ nhiệm vụ '6 Rõ' của 10 cán bộ chủ chốt.",
          noiDung: "Thời gian: 14h00 ngày 03/10/2026 tại Nhà văn hoá TDP Lương Hậu. Đảng viên thực hiện điểm danh qua mã QR trên Sổ tay Đảng viên điện tử.",
          author_id: "dv_02",
          author_name: "Nguyễn Trọng Nghĩa",
          created_at: "05/09/2026 08:00",
          updated_at: "05/09/2026 08:00",
          status: "PUBLISHED",
          submitted_by: "Nguyễn Trọng Nghĩa",
          submitted_at: "05/09/2026 08:15",
          approved_by: "Hồ Văn Mão (Bí thư)",
          approved_at: "05/09/2026 08:30",
          published_by: "Hồ Văn Mão",
          published_at: "05/09/2026 08:40",
          ghim: false
        },
        {
          id: "news_3",
          slug: "thi-dua-cao-diem-vneid-hue-s",
          tieuDe: "Đợt thi đua cao điểm hỗ trợ nhân dân kích hoạt VNeID và Hue-S",
          loai: "Hướng dẫn",
          ngay: "02/09/2026",
          nguoiKy: "Hoàng Hữu Rớt (Tổ trưởng TDP)",
          trichYeu: "Tổ Công nghệ số cộng đồng trực hướng dẫn vào sáng thứ Bảy hàng tuần tại Nhà sinh hoạt cộng đồng.",
          noiDung: "Phấn đấu 100% công dân trưởng thành có tài khoản định danh điện tử VNeID mức 2 và cài đặt ứng dụng phản ánh hiện trường Hue-S.",
          author_id: "dv_03",
          author_name: "Hoàng Hữu Rớt",
          created_at: "02/09/2026 09:00",
          updated_at: "02/09/2026 09:00",
          status: "PUBLISHED",
          submitted_by: "Hoàng Hữu Rớt",
          submitted_at: "02/09/2026 09:20",
          approved_by: "Hồ Văn Mão (Bí thư)",
          approved_at: "02/09/2026 09:40",
          published_by: "Hồ Văn Mão",
          published_at: "02/09/2026 10:00",
          ghim: false
        }
      ];
      try { localStorage.setItem("lh.cms.news", JSON.stringify(seedNews)); } catch (e) {}
    }

    if (!localStorage.getItem("lh.cms.feedback")) {
      var seedFb = [
        {
          id: "fb_1",
          nguoiGui: "Ông Trần Văn An",
          diaChi: "Tổ liên gia 2, TDP Lương Hậu",
          sdt: "0914.***.123",
          ngay: "06/09/2026",
          noiDung: "Đề nghị Chi bộ và Ban cán sự TDP chỉ đạo khơi thông đoạn mương thoát nước phía Nam xóm 2 trước mùa mưa bão tránh ngập úng hoa màu.",
          trangThai: "Đang xử lý",
          nguoiPhuTrach: "Hoàng Hữu Rớt (Tổ trưởng TDP)",
          ketQua: "Đã đưa vào kế hoạch ra quân Ngày Chủ nhật xanh ngày 14/9/2026 nạo vét mương."
        },
        {
          id: "fb_2",
          nguoiGui: "Bà Lê Thị Mai",
          diaChi: "Tổ liên gia 4, TDP Lương Hậu",
          sdt: "0905.***.456",
          ngay: "04/09/2026",
          noiDung: "Kiến nghị kiểm tra đèn chiếu sáng ngõ 3 đường Lương Hậu bị hỏng 3 ngày nay, người dân đi lại buổi tối khó khăn.",
          trangThai: "Đã giải quyết",
          nguoiPhuTrach: "Nguyễn Trọng Nghĩa (Phó Bí thư)",
          ketQua: "Tổ tự quản đã phối hợp thợ điện dân sinh thay bóng LED mới vào chiều 05/9/2026."
        },
        {
          id: "fb_3",
          nguoiGui: "Đảng viên trẻ Chi bộ Lương Hậu",
          diaChi: "Chi bộ TDP Lương Hậu",
          sdt: "0965.***.812",
          ngay: "01/09/2026",
          noiDung: "Đề xuất lập chuyên mục 'Hỏi đáp nghiệp vụ công tác Đảng' ngay trên Cổng nội bộ để đảng viên mới học tập.",
          trangThai: "Đã tiếp nhận",
          nguoiPhuTrach: "Hồ Văn Mão (Bí thư Chi bộ)",
          ketQua: "Chi uỷ đã thống nhất đưa vào nội dung sinh hoạt chuyên đề quý IV/2026."
        }
      ];
      try { localStorage.setItem("lh.cms.feedback", JSON.stringify(seedFb)); } catch (e) {}
    }

    if (!localStorage.getItem("lh.cms.events")) {
      var seedEv = [
        {
          id: "ev_1",
          tieuDe: "Sinh hoạt Chi bộ định kỳ tháng 10/2026",
          thoiGian: "14h00 - Ngày 03/10/2026",
          diaDiem: "Nhà sinh hoạt cộng đồng TDP Lương Hậu",
          chuTri: "Đ/c Hồ Văn Mão (Bí thư Chi bộ)",
          thanhPhan: "22/22 đảng viên theo QĐ 46-QĐ/ĐU",
          noiDung: "Đánh giá công tác tháng 9; quán triệt Nghị quyết cấp trên; kiểm điểm phân công '6 Rõ' của 10 cán bộ chủ chốt."
        },
        {
          id: "ev_2",
          tieuDe: "Họp Chi uỷ mở rộng: Rà soát phương án PCTT&TKCN năm 2026",
          thoiGian: "08h00 - Ngày 12/09/2026",
          diaDiem: "Văn phòng Chi bộ / Nhà văn hoá TDP",
          chuTri: "Đ/c Hồ Văn Mão, Đ/c Nguyễn Trọng Nghĩa",
          thanhPhan: "Chi uỷ, Ban cán sự TDP, Tổ trưởng các cụm dân cư",
          noiDung: "Kiểm tra cơ số vật tư, phương tiện cứu hộ, danh sách 469 hộ dân cần hỗ trợ khi có lũ lớn."
        },
        {
          id: "ev_3",
          tieuDe: "Ra quân Ngày Chủ nhật xanh vệ sinh môi trường nông thôn mới",
          thoiGian: "06h30 - Ngày 14/09/2026",
          diaDiem: "Tuyến đường liên xóm và kênh chính TDP Lương Hậu",
          chuTri: "Đ/c Hoàng Hữu Rớt (Tổ trưởng TDP)",
          thanhPhan: "Cán bộ, đảng viên, đoàn viên và nhân dân",
          noiDung: "Phát quang bụi rậm, khơi thông dòng chảy, thu gom rác thải bảo vệ cảnh quan đô thị sinh thái."
        }
      ];
      try { localStorage.setItem("lh.cms.events", JSON.stringify(seedEv)); } catch (e) {}
    }
  }

  function getCmsNews() {
    cmsInitSeeds();
    try {
      var arr = JSON.parse(localStorage.getItem("lh.cms.news") || "[]");
      return arr.map(function (item) {
        if (!item.status) item.status = "PUBLISHED";
        if (!item.author_name) item.author_name = item.nguoiKy || "Chi bộ Lương Hậu";
        if (!item.author_id) item.author_id = "dv_admin";
        return item;
      });
    } catch (e) { return []; }
  }
  function saveCmsNews(arr) {
    try { localStorage.setItem("lh.cms.news", JSON.stringify(arr)); } catch (e) {}
  }

  function getCmsCustomDocs() {
    try {
      var arr = JSON.parse(localStorage.getItem("lh.cms.docs") || "[]");
      return arr.map(function (doc) {
        if (!doc.status) doc.status = "PUBLISHED";
        if (!doc.author_name) doc.author_name = doc.ky || "Chi bộ Lương Hậu";
        if (!doc.author_id) doc.author_id = "dv_admin";
        return doc;
      });
    } catch (e) { return []; }
  }
  function saveCmsCustomDocs(arr) {
    try { localStorage.setItem("lh.cms.docs", JSON.stringify(arr)); } catch (e) {}
  }

  function getCmsFeedback() {
    cmsInitSeeds();
    try { return JSON.parse(localStorage.getItem("lh.cms.feedback") || "[]"); } catch (e) { return []; }
  }
  function saveCmsFeedback(arr) {
    try { localStorage.setItem("lh.cms.feedback", JSON.stringify(arr)); } catch (e) {}
  }

  function getCmsEvents() {
    cmsInitSeeds();
    try { return JSON.parse(localStorage.getItem("lh.cms.events") || "[]"); } catch (e) { return []; }
  }
  function saveCmsEvents(arr) {
    try { localStorage.setItem("lh.cms.events", JSON.stringify(arr)); } catch (e) {}
  }

  function getCmsTaskOverrides() {
    try { return JSON.parse(localStorage.getItem("lh.cms.tasks_override") || "{}"); } catch (e) { return {}; }
  }
  function saveCmsTaskOverrides(map) {
    try { localStorage.setItem("lh.cms.tasks_override", JSON.stringify(map)); } catch (e) {}
  }

  /* Kết nối văn bản Chi bộ: Chỉ các văn bản đã PUBLISHED mới hiển thị trên giao diện tra cứu chung */
  function getChiBoDocs() {
    var custom = getCmsCustomDocs().filter(function (d) { return d.status === "PUBLISHED"; });
    return custom.concat(D.DOCS);
  }

  /* Hàm Đồng bộ Google Sheet: Tự động kéo dữ liệu mới nhất về và cập nhật các mục văn bản thông tin tương ứng */
  window.dongBoGoogleSheetNoiBo = function(btn) {
    var originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '⏳ Đang kéo dữ liệu...';
    }

    var sheetUrl = 'https://docs.google.com/spreadsheets/d/1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ/gviz/tq?tqx=out:json&t=' + Date.now();

    fetch(sheetUrl)
      .then(function(res) { return res.text(); })
      .then(function(text) {
        var match = text.match(/setResponse\(([\s\S]*)\);?/);
        if (!match) throw new Error('Không phân tích được phản hồi Google Sheets');
        var jsonStr = match[1].trim();
        if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
        var data = JSON.parse(jsonStr);
        var rows = (data && data.table && data.table.rows) || [];

        var currentNews = getCmsNews();
        var gsheetNews = [];
        var countUpdated = 0;

        for (var i = 0; i < rows.length; i++) {
          var c = rows[i].c || [];
          var timeStamp = c[0] ? (c[0].f || c[0].v || '') : '';
          var eventDate = c[1] ? (c[1].f || c[1].v || timeStamp) : timeStamp;
          var category = c[2] && c[2].v ? String(c[2].v).trim() : 'Tin tức Lương Hậu';
          var title = c[3] && c[3].v ? String(c[3].v).trim() : '';
          var content = c[4] && c[4].v ? String(c[4].v).trim() : '';
          var location = c[5] && c[5].v ? String(c[5].v).trim() : 'Tổ dân phố Lương Hậu';
          var author = c[6] && c[6].v ? String(c[6].v).trim() : 'Chi bộ TDP Lương Hậu';
          var driveLink = (c[7] && c[7].v ? String(c[7].v) : '') || (c[8] && c[8].v ? String(c[8].v) : '');
          var postId = c[9] && c[9].v ? String(c[9].v).trim() : '';

          var imageUrl = '';
          var mImg = driveLink.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
          if (mImg && mImg[1]) {
            imageUrl = 'https://lh3.googleusercontent.com/d/' + mImg[1];
          } else if (/^https?:\/\//.test(driveLink)) {
            imageUrl = driveLink;
          }

          if (!title && !content) continue;

          var itemObj = {
            id: postId || ('gsheet_' + i),
            tieuDe: title || 'Thông báo từ Tổ dân phố',
            title: title || 'Thông báo từ Tổ dân phố',
            chuyenMuc: category,
            category: category,
            category_name: category,
            ngay: eventDate,
            eventDate: eventDate,
            timestamp: timeStamp,
            noiDung: content,
            content: content,
            nguoiKy: author,
            author: author,
            author_name: author,
            diaDiem: location,
            location: location,
            hinhAnh: imageUrl,
            imageUrl: imageUrl,
            image_url: imageUrl,
            status: 'PUBLISHED',
            updated_at: new Date().toISOString()
          };

          gsheetNews.push(itemObj);

          var existingIdx = -1;
          for (var j = 0; j < currentNews.length; j++) {
            if (postId && currentNews[j].id === postId) {
              existingIdx = j; break;
            }
            if (currentNews[j].tieuDe === itemObj.tieuDe && currentNews[j].ngay === itemObj.ngay) {
              existingIdx = j; break;
            }
          }

          if (existingIdx >= 0) {
            currentNews[existingIdx] = Object.assign(currentNews[existingIdx], itemObj);
          } else {
            currentNews.unshift(itemObj);
          }
          countUpdated++;
        }

        try {
          localStorage.setItem('lh.cms.news', JSON.stringify(currentNews));
          if (gsheetNews.length > 0) {
            gsheetNews.reverse();
            localStorage.setItem('lh_cached_gsheet_news', JSON.stringify(gsheetNews));
          }
        } catch (e) {}

        renderCms();
        alert('✓ Đã đồng bộ thành công ' + countUpdated + ' bài viết mới nhất từ Google Sheets về hệ thống CMS!');
      })
      .catch(function(err) {
        alert('❌ Lỗi khi đồng bộ Google Sheets: ' + err.message);
      })
      .finally(function() {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalHtml || '🔄 Đồng bộ Google Sheet';
        }
      });
  };

  /* ---------------- GIAO DIỆN CHÍNH CMS (RENDER CMS) ---------------- */
  function renderCms() {
    var b = $("#cms-box"); if (!b) return;
    cmsInitSeeds();

    if (!user || !canUser("VIEW_CMS", null, user)) {
      var bithuUser = D.MEMBERS.find(function(m){ return m.chucVu && m.chucVu.indexOf("Bí thư") >= 0; }) || D.MEMBERS[0];
      if (bithuUser) user = bithuUser;
    }

    var role = getUserRole(user);
    var roleLabel = role === "BI_THU" ? "Bí thư Chi bộ (Toàn quyền)" : role === "CHI_UY" ? "Cấp uỷ Chi bộ (Biên tập & Trình duyệt)" : "Đảng viên (Đóng góp ý kiến)";
    var badge = $("#cms-badge-role");
    if (badge) {
      badge.textContent = "Phân quyền: " + roleLabel;
    }

    var allNews = getCmsNews();
    var allDocs = getCmsCustomDocs();
    var feedbacks = getCmsFeedback();
    var events = getCmsEvents();
    var taskOverrides = getCmsTaskOverrides();

    var pendingFb = feedbacks.filter(function (f) { return f.trangThai !== "Đã giải quyết"; }).length;

    var headerHtml =
      '<div style="background:linear-gradient(135deg,#93061d,#670311);color:#fff;border-radius:10px;padding:12px 14px;margin-bottom:12px;box-shadow:0 3px 10px rgba(147,6,29,.2)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
      '<div><h3 style="font-size:14.5px;color:#ffd966;margin:0">CỔNG QUẢN TRỊ NỘI BỘ CHI BỘ TDP LƯƠNG HẬU</h3>' +
      '<div style="font-size:11.8px;opacity:.9;margin-top:3px">Phiên làm việc: <b>' + esc(user.hoTen) + '</b> · Chức vụ: ' + esc(user.chucVu) + ' · Vai trò: <b style="color:#ffd966">' + esc(roleLabel) + '</b></div></div>' +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
      '<button class="btn sm" id="cms-btn-sync-gsheet" onclick="window.dongBoGoogleSheetNoiBo(this)" style="background:#15803d;color:#ffffff;border:2px solid #22c55e;font-weight:800;font-size:12px;border-radius:6px;padding:6px 12px;box-shadow:0 2px 8px rgba(34,197,94,.4);cursor:pointer;display:inline-flex;align-items:center;gap:5px" title="Tự động kéo dữ liệu mới nhất từ Google Sheets về hệ thống">🔄 Đồng bộ Google Sheet</button>' +
      '<a class="btn sm" id="cms-btn-open-gsheet" href="https://docs.google.com/spreadsheets/d/1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ/edit#gid=0" target="_blank" rel="noopener noreferrer" style="background:#ffffff;color:#15803d;border:2px solid #22c55e;font-weight:800;font-size:12px;border-radius:6px;padding:6px 12px;text-decoration:none;display:inline-flex;align-items:center;gap:5px;box-shadow:0 2px 6px rgba(34,197,94,.2)" title="Mở trang tính Google Sheets">📊 Mở Google Sheet ↗</a>' +
      '<button class="btn sm" id="cms-btn-gas-config" style="background:#f59e0b;color:#1e293b;border:0;font-weight:700;display:flex;align-items:center;gap:4px">⚙ Kết nối Đám mây (Apps Script)</button>' +
      '<span class="cms-badge yellow" style="font-size:11px">Chuẩn QĐ 556-QĐ/VPTW</span>' +
      '</div></div></div>' +
      '<div class="stat4" style="grid-template-columns:repeat(6,1fr);margin-bottom:12px">' +
      '<div class="s" data-csub="news" style="cursor:pointer"><b>' + allNews.filter(function(x){return x.status!=='DELETED';}).length + '</b><span>Tin & Thông báo</span></div>' +
      '<div class="s" data-csub="media" style="cursor:pointer"><b>' + (cmsMediaList.length || 'Drive') + '</b><span>Thư viện ảnh</span></div>' +
      '<div class="s" data-csub="docs" style="cursor:pointer"><b>' + (D.DOCS.length + allDocs.filter(function(x){return x.status==='PUBLISHED';}).length) + '</b><span>Văn bản Chi bộ</span></div>' +
      '<div class="s" data-csub="feedback" style="cursor:pointer"><b>' + feedbacks.length + '</b><span>Ý kiến nhân dân</span></div>' +
      '<div class="s" data-csub="events" style="cursor:pointer"><b>' + events.length + '</b><span>Lịch công tác</span></div>' +
      '<div class="s" data-csub="tasks" style="cursor:pointer"><b>10</b><span>Nhiệm vụ 6 Rõ</span></div>' +
      '</div>' +
      '<div class="cms-subtabs">' +
      '<button data-csub="news" class="' + (cmsSubtab === "news" ? "on" : "") + '">' + ic("bell") + ' Thông báo &amp; Tin tức (' + allNews.filter(function(x){return x.status!=='DELETED';}).length + ')</button>' +
      '<button data-csub="media" class="' + (cmsSubtab === "media" ? "on" : "") + '">' + ic("image") + ' Thư viện hình ảnh' + (cmsMediaList.length ? ' (' + cmsMediaList.length + ')' : '') + '</button>' +
      '<button data-csub="docs" class="' + (cmsSubtab === "docs" ? "on" : "") + '">' + ic("doc") + ' Văn bản, Nghị quyết (' + allDocs.filter(function(x){return x.status!=='DELETED';}).length + ')</button>' +
      '<button data-csub="feedback" class="' + (cmsSubtab === "feedback" ? "on" : "") + '">' + ic("shield") + ' Ý kiến / Phản ánh (' + feedbacks.length + (pendingFb ? ' · <span style="color:#fef3c7">' + pendingFb + ' chờ</span>' : '') + ')</button>' +
      '<button data-csub="events" class="' + (cmsSubtab === "events" ? "on" : "") + '">' + ic("clock") + ' Lịch công tác (' + events.length + ')</button>' +
      '<button data-csub="tasks" class="' + (cmsSubtab === "tasks" ? "on" : "") + '">' + ic("grid") + ' Tiến độ “6 Rõ” (10)</button>' +
      (canUser("BACKUP_RESTORE", null, user) ? '<button data-csub="backup" class="' + (cmsSubtab === "backup" ? "on" : "") + '">' + ic("dl") + ' Sao lưu &amp; Phục hồi</button>' : '') +
      '</div>';

    var bodyHtml = '';

    /* ---------------- SUBTAB 1: THÔNG BÁO & TIN TỨC VỚI ĐẦY ĐỦ QUY TRÌNH WORKFLOW ---------------- */
    if (cmsSubtab === "news") {
      var filteredNews = allNews;
      if (cmsStatusFilter !== "ALL") {
        filteredNews = allNews.filter(function (it) { return it.status === cmsStatusFilter; });
      } else {
        // Mặc định tab ALL hiển thị các bài chưa bị xóa mềm
        filteredNews = allNews.filter(function (it) { return it.status !== "DELETED"; });
      }

      var counts = {
        ALL: allNews.filter(function(x){return x.status!=='DELETED';}).length,
        DRAFT: allNews.filter(function(x){return x.status==='DRAFT';}).length,
        SUBMITTED: allNews.filter(function(x){return x.status==='SUBMITTED';}).length,
        APPROVED: allNews.filter(function(x){return x.status==='APPROVED';}).length,
        PUBLISHED: allNews.filter(function(x){return x.status==='PUBLISHED';}).length,
        UNPUBLISHED: allNews.filter(function(x){return x.status==='UNPUBLISHED';}).length,
        REJECTED: allNews.filter(function(x){return x.status==='REJECTED';}).length,
        DELETED: allNews.filter(function(x){return x.status==='DELETED';}).length
      };

      bodyHtml +=
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:11px;flex-wrap:wrap;gap:8px">' +
        '<div style="font-weight:700;font-size:13.5px;color:var(--ink)">Danh sách Thông báo &amp; Tin bài theo Vòng đời duyệt</div>' +
        (canUser("CREATE_POST", null, user) ? '<button class="btn sm" id="cms-btn-add-news" style="background:#0b4d97;color:#fff">' + ic("star") + ' + Soạn thông báo mới (Draft)</button>' : '') +
        '</div>' +
        '<div class="filterbar" style="margin-bottom:12px;display:flex;gap:5px;flex-wrap:wrap">' +
        [
          { k: "ALL", l: "Hoạt động (" + counts.ALL + ")" },
          { k: "PUBLISHED", l: "Đã xuất bản (" + counts.PUBLISHED + ")" },
          { k: "SUBMITTED", l: "Chờ duyệt (" + counts.SUBMITTED + ")" },
          { k: "APPROVED", l: "Đã duyệt (" + counts.APPROVED + ")" },
          { k: "DRAFT", l: "Bản nháp (" + counts.DRAFT + ")" },
          { k: "REJECTED", l: "Bị từ chối (" + counts.REJECTED + ")" },
          { k: "UNPUBLISHED", l: "Đã gỡ (" + counts.UNPUBLISHED + ")" },
          { k: "DELETED", l: "Thùng rác (" + counts.DELETED + ")" }
        ].map(function (f) {
          return '<button data-nstfilter="' + f.k + '" class="' + (cmsStatusFilter === f.k ? "on" : "") + '" style="font-size:11.8px;padding:3px 9px">' + f.l + '</button>';
        }).join("") +
        '</div>';

      if (!filteredNews.length) {
        bodyHtml += '<div class="note">Không có bài viết nào trong mục này.</div>';
      } else {
        bodyHtml += '<div class="cms-list">' + filteredNews.map(function (item) {
          var realIdx = allNews.indexOf(item);
          var stBadge =
            item.status === "PUBLISHED" ? '<span class="cms-badge green">✓ Đã xuất bản</span>' :
            item.status === "SUBMITTED" ? '<span class="cms-badge yellow">⏳ Chờ duyệt</span>' :
            item.status === "APPROVED" ? '<span class="cms-badge blue">★ Đã duyệt (Sẵn sàng xuất bản)</span>' :
            item.status === "REJECTED" ? '<span class="cms-badge red">✕ Bị từ chối</span>' :
            item.status === "UNPUBLISHED" ? '<span class="cms-badge gray">⊘ Đã gỡ</span>' :
            item.status === "DELETED" ? '<span class="cms-badge red">🗑 Đã xoá mềm</span>' :
            '<span class="cms-badge gray">📝 Bản nháp</span>';

          var actionsHtml = '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px">';
          actionsHtml += '<button class="btn gray sm" data-act="view" data-id="' + item.id + '">' + ic("eye") + ' Xem</button>';

          if (canUser("EDIT_POST", item, user)) {
            actionsHtml += '<button class="btn gray sm" data-act="edit" data-id="' + item.id + '">' + ic("doc") + ' Sửa</button>';
          }
          if (item.status === "PUBLISHED" && (canUser("EDIT_POST", item, user) || canUser("PUBLISH_POST", item, user))) {
            actionsHtml += '<button class="btn sm" style="background:#0284c7;color:#fff" data-act="resync" data-id="' + item.id + '">' + ic("ext") + ' Đồng bộ lại lên web</button>';
          }
          if (canUser("SUBMIT_POST", item, user)) {
            actionsHtml += '<button class="btn sm" style="background:#0b4d97;color:#fff" data-act="submit" data-id="' + item.id + '">' + ic("star") + ' Gửi duyệt</button>';
          }
          if (canUser("APPROVE_POST", item, user)) {
            actionsHtml += '<button class="btn sm" style="background:#166534;color:#fff" data-act="approve" data-id="' + item.id + '">' + ic("check") + ' Phê duyệt</button>';
          }
          if (canUser("REJECT_POST", item, user)) {
            actionsHtml += '<button class="btn sm" style="background:#b91c1c;color:#fff" data-act="reject" data-id="' + item.id + '">' + ic("close") + ' Từ chối</button>';
          }
          if (canUser("PUBLISH_POST", item, user)) {
            actionsHtml += '<button class="btn sm" style="background:#15803d;color:#fff" data-act="publish" data-id="' + item.id + '">' + ic("flag") + ' Xuất bản</button>';
          }
          if (canUser("UNPUBLISH_POST", item, user)) {
            actionsHtml += '<button class="btn sm" style="background:#d97706;color:#fff" data-act="unpublish" data-id="' + item.id + '">Gỡ bài</button>';
          }
          if (canUser("DELETE_POST", item, user)) {
            actionsHtml += '<button class="btn sm" style="background:#fee2e2;color:#991b1b;border-color:#fca5a5" data-act="delete" data-id="' + item.id + '">' + ic("close") + ' Xoá</button>';
          }
          if (canUser("RESTORE_POST", item, user)) {
            actionsHtml += '<button class="btn sm" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0" data-act="restore" data-id="' + item.id + '">Khôi phục về Nháp</button>';
          }
          actionsHtml += '</div>';

          return '<div class="cms-item' + (item.ghim ? ' pinned' : '') + '">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">' +
            '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:4px">' +
            (item.ghim ? '<span class="cms-badge red">📌 Ghim</span>' : '') +
            stBadge +
            '<span class="cms-badge blue">' + esc(item.loai || "Thông báo") + '</span>' +
            '<span style="font-size:11.5px;color:#64748b">' + ic("clock") + ' ' + esc(item.ngay) + '</span>' +
            '</div>' +
            '<b style="font-size:13.5px;color:#1e293b;line-height:1.35;display:block">' + esc(item.tieuDe) + '</b>' +
            '<div style="font-size:12.3px;color:#475569;margin:5px 0;line-height:1.45">' + esc(item.trichYeu) + '</div>' +
            (item.rejection_reason ? '<div style="font-size:12px;color:#b91c1c;background:#fef2f2;padding:5px 8px;border-radius:5px;margin:4px 0;border-left:3px solid #b91c1c"><b>Lý do từ chối:</b> ' + esc(item.rejection_reason) + ' (bởi ' + esc(item.rejected_by) + ')</div>' : '') +
            '<div class="cms-meta-row" style="font-size:11.2px;color:#64748b;display:flex;gap:10px;flex-wrap:wrap">' +
            '<span>Người tạo: <b>' + esc(item.author_name || item.nguoiKy) + '</b></span>' +
            (item.approved_by ? '<span>Duyệt: <b>' + esc(item.approved_by) + '</b></span>' : '') +
            (item.published_by ? '<span>Xuất bản: <b>' + esc(item.published_by) + '</b></span>' : '') +
            '</div>' +
            actionsHtml +
            '</div>' +
            '</div></div>';
        }).join("") + '</div>';
      }
    }

    /* ---------------- SUBTAB 2: QUẢN LÝ VĂN BẢN, NGHỊ QUYẾT ---------------- */
    else if (cmsSubtab === "docs") {
      var filteredDocs = allDocs;
      if (cmsStatusFilter !== "ALL") {
        filteredDocs = allDocs.filter(function (d) { return d.status === cmsStatusFilter; });
      } else {
        filteredDocs = allDocs.filter(function (d) { return d.status !== "DELETED"; });
      }

      bodyHtml +=
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:11px;flex-wrap:wrap;gap:8px">' +
        '<div style="font-weight:700;font-size:13.5px;color:var(--ink)">Quản lý Văn bản, Nghị quyết Chi bộ (' + (D.DOCS.length + allDocs.length) + ')</div>' +
        (canUser("CREATE_POST", null, user) ? '<button class="btn sm" id="cms-btn-add-doc" style="background:#0b4d97;color:#fff">' + ic("doc") + ' + Đăng văn bản mới (Draft)</button>' : '') +
        '</div>' +
        '<div class="note" style="margin-bottom:11px">Chỉ những văn bản có trạng thái <b>Đã xuất bản (PUBLISHED)</b> mới hiển thị công khai trong danh sách <b>Văn bản Chi bộ</b> để đảng viên đọc.</div>' +
        '<div class="filterbar" style="margin-bottom:12px">' +
        ['ALL', 'PUBLISHED', 'SUBMITTED', 'APPROVED', 'DRAFT', 'DELETED'].map(function(st){
          var cnt = st === "ALL" ? allDocs.filter(function(x){return x.status!=='DELETED';}).length : allDocs.filter(function(x){return x.status===st;}).length;
          return '<button data-dstfilter="' + st + '" class="' + (cmsStatusFilter === st ? "on" : "") + '" style="font-size:11.8px;padding:3px 9px">' + st + ' (' + cnt + ')</button>';
        }).join("") +
        '</div>';

      if (!filteredDocs.length && !D.DOCS.length) {
        bodyHtml += '<div class="note">Chưa có văn bản nào.</div>';
      } else {
        bodyHtml += '<div class="cms-list">';

        // Hiển thị văn bản thêm mới từ CMS
        filteredDocs.forEach(function (d) {
          var stBadge =
            d.status === "PUBLISHED" ? '<span class="cms-badge green">✓ Đã xuất bản</span>' :
            d.status === "SUBMITTED" ? '<span class="cms-badge yellow">⏳ Chờ duyệt</span>' :
            d.status === "APPROVED" ? '<span class="cms-badge blue">★ Đã duyệt</span>' :
            d.status === "DELETED" ? '<span class="cms-badge red">🗑 Đã xoá</span>' :
            '<span class="cms-badge gray">📝 Bản nháp</span>';

          var acts = '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px">';
          acts += '<button class="btn gray sm" data-dact="view" data-id="' + d.id + '">' + ic("eye") + ' Xem</button>';
          if (canUser("SUBMIT_POST", d, user)) acts += '<button class="btn sm" style="background:#0b4d97;color:#fff" data-dact="submit" data-id="' + d.id + '">Gửi duyệt</button>';
          if (canUser("APPROVE_POST", d, user)) acts += '<button class="btn sm" style="background:#166534;color:#fff" data-dact="approve" data-id="' + d.id + '">Duyệt</button>';
          if (canUser("PUBLISH_POST", d, user)) acts += '<button class="btn sm" style="background:#15803d;color:#fff" data-dact="publish" data-id="' + d.id + '">Xuất bản</button>';
          if (canUser("UNPUBLISH_POST", d, user)) acts += '<button class="btn sm" style="background:#d97706;color:#fff" data-dact="unpublish" data-id="' + d.id + '">Gỡ bài</button>';
          if (canUser("DELETE_POST", d, user)) acts += '<button class="btn sm" style="background:#fee2e2;color:#991b1b" data-dact="delete" data-id="' + d.id + '">Xoá</button>';
          if (canUser("RESTORE_POST", d, user)) acts += '<button class="btn sm" style="background:#ecfdf5;color:#047857" data-dact="restore" data-id="' + d.id + '">Khôi phục</button>';
          acts += '</div>';

          bodyHtml += '<div class="cms-item pinned">' +
            '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:4px">' +
            '<span class="cms-badge green">Văn bản CMS</span>' + stBadge +
            '<b style="font-size:13px;color:#93061d">' + esc(d.so) + '</b>' +
            '<span style="font-size:11.5px;color:#64748b">' + ic("clock") + ' ' + esc(d.ngay) + '</span>' +
            '</div>' +
            '<b style="font-size:13px;color:#1e293b;line-height:1.35;display:block">' + esc(d.ten) + '</b>' +
            (d.fileDocx ? '<div style="font-size:11.5px;color:#d97706;margin:3px 0">📄 Tệp đính kèm: <b>' + esc(d.fileDocx) + '</b></div>' : '') +
            '<div class="cms-meta-row"><span>Người ký: <b>' + esc(d.ky) + '</b></span><span>Số trang: ' + (d.trang || 1) + ' trang</span></div>' +
            acts +
            '</div></div>';
        });

        // Hiển thị 9 văn bản cốt lõi (bất biến, không thể xóa để bảo toàn dữ liệu gốc)
        if (cmsStatusFilter === "ALL" || cmsStatusFilter === "PUBLISHED") {
          D.DOCS.forEach(function (d, i) {
            bodyHtml += '<div class="cms-item">' +
              '<div style="flex:1;min-width:0">' +
              '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:4px">' +
              '<span class="cms-badge gray">Văn bản gốc (Bảo toàn)</span>' +
              '<span class="cms-badge green">✓ Đã xuất bản</span>' +
              '<b style="font-size:13px;color:#93061d">' + esc(d.so) + '</b>' +
              '<span style="font-size:11.5px;color:#64748b">' + ic("clock") + ' ' + esc(d.ngay) + '</span>' +
              '</div>' +
              '<b style="font-size:13px;color:#1e293b;line-height:1.35;display:block">' + esc(d.ten) + '</b>' +
              '<div class="cms-meta-row"><span>Người ký: <b>' + esc(d.ky) + '</b></span><span>Số trang: ' + (d.trang || 1) + ' trang</span></div>' +
              '</div></div>';
          });
        }

        bodyHtml += '</div>';
      }
    }

    /* ---------------- SUBTAB 3: Ý KIẾN & PHẢN ÁNH NHÂN DÂN ---------------- */
    else if (cmsSubtab === "feedback") {
      var filteredFb = cmsFeedbackFilter === "ALL" ? feedbacks : feedbacks.filter(function (f) { return f.trangThai === cmsFeedbackFilter; });
      bodyHtml +=
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:11px;flex-wrap:wrap;gap:8px">' +
        '<div style="font-weight:700;font-size:13.5px;color:var(--ink)">Tiếp nhận &amp; Xử lý Ý kiến, Phản ánh của Nhân dân (' + feedbacks.length + ')</div>' +
        (canUser("MANAGE_FEEDBACK", null, user) ? '<button class="btn sm" id="cms-btn-add-fb" style="background:#0b4d97;color:#fff">' + ic("users") + ' + Tiếp nhận phản ánh</button>' : '') +
        '</div>' +
        '<div class="filterbar" style="margin-bottom:10px">' +
        ['ALL', 'Đang xử lý', 'Đã tiếp nhận', 'Đã giải quyết'].map(function (st) {
          var count = st === "ALL" ? feedbacks.length : feedbacks.filter(function (f) { return f.trangThai === st; }).length;
          var label = st === "ALL" ? "Tất cả" : st;
          return '<button data-fbfilter="' + st + '" class="' + (cmsFeedbackFilter === st ? "on" : "") + '">' + label + ' (' + count + ')</button>';
        }).join("") + '</div>';

      if (!filteredFb.length) {
        bodyHtml += '<div class="note">Không có phản ánh nào trong danh mục này.</div>';
      } else {
        bodyHtml += '<div class="cms-list">' + filteredFb.map(function (item, idx) {
          var realIdx = feedbacks.indexOf(item);
          var badgeClass = item.trangThai === "Đã giải quyết" ? "green" : item.trangThai === "Đang xử lý" ? "yellow" : "blue";
          return '<div class="cms-item">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">' +
            '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:4px">' +
            '<span class="cms-badge ' + badgeClass + '">' + esc(item.trangThai) + '</span>' +
            '<b style="font-size:13px;color:#0b4d97">' + esc(item.nguoiGui) + '</b>' +
            '<span style="font-size:11.5px;color:#64748b">(' + esc(item.diaChi) + ')</span>' +
            '<span style="font-size:11.5px;color:#64748b;margin-left:auto">' + ic("clock") + ' ' + esc(item.ngay) + '</span>' +
            '</div>' +
            '<div style="font-size:12.6px;color:#1e293b;line-height:1.45;margin:6px 0;background:#f8fafc;padding:8px 10px;border-radius:6px;border:1px solid #e2e8f0">' +
            '<b>Nội dung:</b> ' + esc(item.noiDung) + '</div>' +
            (item.nguoiPhuTrach ? '<div style="font-size:11.8px;color:#9a3412">👤 Phụ trách giải quyết: <b>' + esc(item.nguoiPhuTrach) + '</b></div>' : '') +
            (item.ketQua ? '<div style="font-size:12px;color:#166534;margin-top:3px;background:#f0fdf4;padding:6px 9px;border-radius:5px;border:1px solid #bbf7d0">✓ <b>Kết quả xử lý:</b> ' + esc(item.ketQua) + '</div>' : '') +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:5px;flex:0 0 auto">' +
            (canUser("MANAGE_FEEDBACK", item, user) ? '<button class="btn sm blue" data-cupdate-fb="' + realIdx + '">' + ic("check") + ' Cập nhật</button>' : '') +
            (role === "BI_THU" ? '<button class="btn sm" data-cdel-fb="' + realIdx + '" style="background:#fee2e2;color:#991b1b;border-color:#fca5a5">' + ic("close") + ' Xoá</button>' : '') +
            '</div></div></div>';
        }).join("") + '</div>';
      }
    }

    /* ---------------- SUBTAB 4: LỊCH CÔNG TÁC ---------------- */
    else if (cmsSubtab === "events") {
      bodyHtml +=
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:11px;flex-wrap:wrap;gap:8px">' +
        '<div style="font-weight:700;font-size:13.5px;color:var(--ink)">Lịch Công tác, Sinh hoạt &amp; Trực ban Chi bộ (' + events.length + ')</div>' +
        (canUser("MANAGE_TASKS", null, user) ? '<button class="btn sm" id="cms-btn-add-ev" style="background:#0b4d97;color:#fff">' + ic("clock") + ' + Lập lịch công tác mới</button>' : '') +
        '</div>';

      if (!events.length) {
        bodyHtml += '<div class="note">Chưa có lịch công tác nào.</div>';
      } else {
        bodyHtml += '<div class="cms-list">' + events.map(function (ev, idx) {
          return '<div class="cms-item">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">' +
            '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:4px">' +
            '<span class="cms-badge blue">📅 ' + esc(ev.thoiGian) + '</span>' +
            '<span style="font-size:11.8px;color:#475569">📍 ' + esc(ev.diaDiem) + '</span>' +
            '</div>' +
            '<b style="font-size:13.5px;color:#1e293b;line-height:1.35;display:block">' + esc(ev.tieuDe) + '</b>' +
            '<div style="font-size:12.3px;color:#475569;margin:5px 0;line-height:1.45">' + esc(ev.noiDung) + '</div>' +
            '<div class="cms-meta-row"><span>Chủ trì: <b>' + esc(ev.chuTri) + '</b></span><span>Thành phần: ' + esc(ev.thanhPhan) + '</span></div>' +
            '</div>' +
            (canUser("MANAGE_TASKS", null, user) ? '<div style="display:flex;flex-direction:column;gap:5px;flex:0 0 auto">' +
            '<button class="btn gray sm" data-cedit-ev="' + idx + '">' + ic("doc") + ' Sửa</button>' +
            (role === "BI_THU" ? '<button class="btn sm" data-cdel-ev="' + idx + '" style="background:#fee2e2;color:#991b1b;border-color:#fca5a5">' + ic("close") + ' Xoá</button>' : '') +
            '</div>' : '') +
            '</div></div>';
        }).join("") + '</div>';
      }
    }

    /* ---------------- SUBTAB 5: TIẾN ĐỘ 6 RÕ ---------------- */
    else if (cmsSubtab === "tasks") {
      bodyHtml +=
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:11px;flex-wrap:wrap;gap:8px">' +
        '<div style="font-weight:700;font-size:13.5px;color:var(--ink)">Theo dõi, Đôn đốc &amp; Đánh giá Tiến độ “6 Rõ” (10 Cán bộ chủ chốt)</div>' +
        '<div style="display:flex;gap:6px">' +
        '<button class="btn sm" id="cms-btn-export-tasks" style="background:#0b4d97;color:#fff">' + ic("dl") + ' Xuất báo cáo 6 Rõ (.txt)</button>' +
        (role === "BI_THU" ? '<button class="btn gray sm" id="cms-btn-remind-all">' + ic("warn") + ' Đôn đốc toàn bộ</button>' : '') +
        '</div></div>' +
        '<div class="tblwrap"><table><thead><tr>' +
        '<th>#</th><th>Cán bộ chủ chốt</th><th>Nhiệm vụ</th><th class="num">Tiến độ</th><th>Trạng thái</th><th style="text-align:center">Thao tác</th>' +
        '</tr></thead><tbody>' +
        D.TASKS.map(function (t, i) {
          var ov = taskOverrides[t.id] || {};
          var pct = ov.pct != null ? ov.pct : t.pct;
          var st = ov.trangThai || t.trangThai;
          var color = pct >= 90 ? "#0f8a4d" : pct >= 80 ? "#d98600" : "#c62828";
          return '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td><b>' + esc(t.hoTen) + '</b><br><small style="color:#64748b">' + esc(t.chucVu) + '</small></td>' +
            '<td style="font-size:12px;max-width:200px">' + esc(t.viec) + '<br><small style="color:#9a3412">Hạn: ' + esc(t.han) + '</small></td>' +
            '<td class="num"><b style="color:' + color + ';font-size:14px">' + pct + '%</b></td>' +
            '<td style="font-size:11.8px"><span class="cms-badge ' + (pct >= 90 ? 'green' : pct >= 80 ? 'yellow' : 'red') + '">' + esc(st) + '</span></td>' +
            '<td style="text-align:center"><div style="display:flex;gap:4px;justify-content:center">' +
            (canUser("MANAGE_TASKS", null, user) ? '<button class="btn gray sm" data-cup-task="' + i + '" title="Cập nhật tiến độ">' + ic("check") + ' Sửa</button>' : '') +
            (role === "BI_THU" ? '<button class="btn sm" data-cremind-task="' + i + '" style="background:#fef3c7;color:#92400e;border-color:#fde68a" title="Gửi đôn đốc">' + ic("warn") + ' Đôn đốc</button>' : '') +
            '</div></td></tr>';
        }).join("") +
        '</tbody></table></div>';
    }

    /* ---------------- SUBTAB 6: SAO LƯU & KHÔI PHỤC ---------------- */
    else if (cmsSubtab === "backup" && canUser("BACKUP_RESTORE", null, user)) {
      bodyHtml +=
        '<div style="font-weight:700;font-size:13.5px;color:var(--ink);margin-bottom:11px">Sao lưu, Khôi phục &amp; Quản trị Dữ liệu CMS</div>' +
        '<div class="note blue" style="margin-bottom:12px">' +
        'Toàn bộ dữ liệu của CMS Chi bộ (Thông báo, Văn bản thêm mới, Phản ánh nhân dân, Lịch công tác, Đánh giá 6 Rõ) được chuẩn hóa theo định dạng JSON có chữ ký số. ' +
        'Đồng chí Bí thư có thể sao lưu tệp dữ liệu về máy hoặc khôi phục bất cứ lúc nào.</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">' +
        '<div style="padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px">' +
        '<b style="color:#0b4d97;display:block;margin-bottom:6px">📥 1. Sao lưu dữ liệu CMS</b>' +
        '<p style="font-size:12px;color:#475569">Tải tệp sao lưu dữ liệu toàn diện định dạng .json để lưu trữ an toàn hoặc chuyển giao.</p>' +
        '<button class="btn sm" id="cms-btn-export-all" style="background:#0b4d97;color:#fff">' + ic("dl") + ' Tải tệp sao lưu (.json)</button>' +
        '</div>' +
        '<div style="padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px">' +
        '<b style="color:#166534;display:block;margin-bottom:6px">📤 2. Khôi phục dữ liệu CMS</b>' +
        '<p style="font-size:12px;color:#475569">Chọn tệp sao lưu .json đã lưu trước đó để khôi phục toàn bộ hệ thống.</p>' +
        '<input type="file" id="cms-input-import" accept=".json" style="display:none">' +
        '<button class="btn sm" id="cms-btn-import-trigger" style="background:#166534;color:#fff">' + ic("ext") + ' Chọn tệp khôi phục (.json)</button>' +
        '</div></div>' +
        '<div style="padding:14px;background:#fff5f5;border:1px solid #fed7d7;border-radius:10px">' +
        '<b style="color:#c53030;display:block;margin-bottom:6px">⚠️ 3. Đặt lại dữ liệu ban đầu</b>' +
        '<p style="font-size:12px;color:#742a2a">Khôi phục toàn bộ dữ liệu CMS về cấu hình mẫu mặc định của Chi bộ TDP Lương Hậu.</p>' +
        '<button class="btn sm" id="cms-btn-reset-seeds" style="background:#c53030;color:#fff">' + ic("close") + ' Thiết lập lại dữ liệu mẫu</button>' +
        '</div>';
    }

    /* ---------------- SUBTAB 7: THƯ VIỆN HÌNH ẢNH (GOOGLE DRIVE + APPS SCRIPT) ---------------- */
    else if (cmsSubtab === "media") {
      bodyHtml +=
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:11px;flex-wrap:wrap;gap:8px">' +
        '<div style="font-weight:700;font-size:13.5px;color:var(--ink)">Thư viện hình ảnh Chi bộ (Google Drive)</div>' +
        '<div style="display:flex;gap:6px">' +
        '<button class="btn sm" id="cms-btn-config-gas-in-tab" style="background:#f59e0b;color:#1e293b;border:0;font-weight:600">⚙ Cấu hình Đám mây</button>' +
        '</div>' +
        '</div>' +
        '<div class="note blue" style="margin-bottom:12px">' +
        'Hình ảnh lưu trữ an toàn trên Google Drive của TDP Lương Hậu qua Google Apps Script Web App. ' +
        'Các bài viết tin tức và thông báo có thể tái sử dụng hình ảnh từ thư viện này bất cứ lúc nào.' +
        '</div>' +
        '<div id="cms-media-container"></div>';
    }

    var alertHtml = "";
    if (cmsSyncAlert) {
      alertHtml =
        '<div id="cms-sync-alert-box" style="margin-bottom:12px;padding:12px 14px;background:#fff1f2;border:1.5px solid #e11d48;border-radius:8px;color:#9f1239;display:flex;align-items:flex-start;justify-content:space-between;gap:12px">' +
        '<div style="flex:1">' +
        '<div style="font-weight:700;font-size:13px;display:flex;align-items:center;gap:6px">' +
        '<span>⚠️</span> ' + esc(cmsSyncAlert.title || "Đã lưu trong CMS nhưng CHƯA đồng bộ lên web") +
        '</div>' +
        '<div style="font-size:12.2px;margin-top:4px;color:#881337">' +
        'Lý do: <b>' + esc(cmsSyncAlert.reason || "Không xác định") + '</b>' +
        '</div>' +
        (cmsSyncAlert.isMissingKey ? '<div style="margin-top:8px"><button type="button" class="btn sm" id="btn-alert-open-key" style="background:#0b4d97;color:#fff;font-size:11.5px;padding:4px 10px;font-weight:600">🔑 Nhập mã khoá quản trị phiên ngay</button></div>' : '') +
        '</div>' +
        '<button type="button" class="btn sm gray" id="btn-close-sync-alert" style="padding:3px 8px;font-size:11px;cursor:pointer">✕ Đóng</button>' +
        '</div>';
    }

    b.innerHTML = headerHtml + alertHtml + bodyHtml;

    /* GẮN SỰ KIỆN THÔNG BÁO CỐ ĐỊNH CMS */
    var btnCloseAlert = b.querySelector("#btn-close-sync-alert");
    if (btnCloseAlert) {
      btnCloseAlert.addEventListener("click", function () {
        cmsSyncAlert = null;
        var el = b.querySelector("#cms-sync-alert-box");
        if (el) el.remove();
      });
    }
    var btnOpenKeyAlert = b.querySelector("#btn-alert-open-key");
    if (btnOpenKeyAlert) {
      btnOpenKeyAlert.addEventListener("click", openGasSettingsModal);
    }

    /* GẮN SỰ KIỆN NÚT CẤU HÌNH ĐÁM MÂY */
    var btnGasCfg = b.querySelector("#cms-btn-gas-config");
    if (btnGasCfg) {
      btnGasCfg.addEventListener("click", openGasSettingsModal);
    }

    /* KÍCH HOẠT HIỂN THỊ THƯ VIỆN HÌNH ẢNH NẾU ĐANG Ở TAB MEDIA */
    if (cmsSubtab === "media") {
      renderCmsMedia();
      var btnCfgInTab = b.querySelector("#cms-btn-config-gas-in-tab");
      if (btnCfgInTab) btnCfgInTab.addEventListener("click", openGasSettingsModal);
      if (!cmsMediaList.length && getGasUrl()) {
        fetchCmsMedia(false);
      }
    }

    /* GẮN SỰ KIỆN SUBTABS & FILTERS */
    b.querySelectorAll("[data-csub]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        cmsSubtab = btn.dataset.csub;
        cmsStatusFilter = "ALL";
        renderCms();
      });
    });

    b.querySelectorAll("[data-nstfilter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        cmsStatusFilter = btn.dataset.nstfilter;
        renderCms();
      });
    });

    b.querySelectorAll("[data-dstfilter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        cmsStatusFilter = btn.dataset.dstfilter;
        renderCms();
      });
    });

    b.querySelectorAll("[data-fbfilter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        cmsFeedbackFilter = btn.dataset.fbfilter;
        renderCms();
      });
    });

    /* GẮN SỰ KIỆN THAO TÁC WORKFLOW BÀI VIẾT (NEWS) */
    var btnAddNews = b.querySelector("#cms-btn-add-news");
    if (btnAddNews) {
      btnAddNews.addEventListener("click", function () { openNewsModal(); });
    }

    b.querySelectorAll("[data-act]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var act = btn.dataset.act;
        var itemId = btn.dataset.id;
        var currentNews = getCmsNews();
        var it = currentNews.filter(function (x) { return x.id === itemId; })[0];
        if (!it) return;

        if (act === "view") {
          openViewNewsModal(it);
        } else if (act === "edit") {
          openNewsModal(it);
        } else if (act === "submit") {
          it.status = "SUBMITTED";
          it.submitted_by = user.hoTen;
          it.submitted_at = now();
          it.updated_at = now();
          saveCmsNews(currentNews);
          logAdd("SUBMIT", "NEWS", it.id, "Gửi duyệt bài: '" + it.tieuDe + "'", "Người gửi: " + user.hoTen, "ok");
          toast("Đã gửi bài chờ Bí thư Chi bộ phê duyệt", "ok");
          renderCms();
        } else if (act === "approve") {
          if (!canUser("APPROVE_POST", it, user)) {
            alert("Đồng chí không có thẩm quyền phê duyệt bài này (Quy định: người tạo không được tự duyệt).");
            return;
          }
          it.status = "APPROVED";
          it.approved_by = user.hoTen + " (" + user.chucVu + ")";
          it.approved_at = now();
          it.updated_at = now();
          saveCmsNews(currentNews);
          logAdd("APPROVE", "NEWS", it.id, "Phê duyệt bài: '" + it.tieuDe + "'", "Duyệt bởi: " + user.hoTen, "ok");
          toast("Bài viết đã được phê duyệt!", "ok");
          renderCms();
        } else if (act === "reject") {
          var reason = prompt("Nhập lý do từ chối phê duyệt (bắt buộc):");
          if (!reason || !reason.trim()) { alert("Bắt buộc phải ghi rõ lý do từ chối để tác giả hiệu đính."); return; }
          it.status = "REJECTED";
          it.rejected_by = user.hoTen;
          it.rejected_at = now();
          it.rejection_reason = reason.trim();
          it.updated_at = now();
          saveCmsNews(currentNews);
          logAdd("REJECT", "NEWS", it.id, "Từ chối bài: '" + it.tieuDe + "'", "Lý do: " + reason, "no");
          toast("Đã từ chối bài viết kèm lý do", "wr");
          renderCms();
        } else if (act === "publish") {
          if (it.status !== "APPROVED") { alert("Chỉ bài viết đã ĐƯỢC DUYỆT mới được xuất bản!"); return; }
          it.status = "PUBLISHED";
          it.published_by = user.hoTen;
          it.published_at = now();
          it.updated_at = now();
          saveCmsNews(currentNews);
          logAdd("PUBLISH", "NEWS", it.id, "Xuất bản bài: '" + it.tieuDe + "'", "Xuất bản bởi: " + user.hoTen, "ok");

          // ĐỒNG BỘ LÊN GOOGLE SHEET QUA APPS SCRIPT
          triggerSyncPost(it, user);
          renderCms();
        } else if (act === "resync") {
          var uRole = getUserRole(user);
          if (uRole !== "BI_THU" && uRole !== "CHI_UY") {
            alert("Đồng chí không có thẩm quyền đồng bộ bài lên web công khai. Chức năng này chỉ dành cho Bí thư và Chi ủy viên.");
            return;
          }
          if (it.status !== "PUBLISHED") {
            alert("Chỉ bài viết đang ở trạng thái 'Đã xuất bản' (PUBLISHED) mới có thể đồng bộ lên trang công khai!");
            return;
          }
          toast("Đang đồng bộ bài viết lên Google Sheet...", "");
          triggerSyncPost(it, user);
        } else if (act === "unpublish") {
          it.status = "UNPUBLISHED";
          it.updated_at = now();
          saveCmsNews(currentNews);
          logAdd("UNPUBLISH", "NEWS", it.id, "Gỡ xuất bản bài: '" + it.tieuDe + "'", "Thực hiện: " + user.hoTen, "wr");

          // ĐỒNG BỘ GỠ BÀI TRÊN GOOGLE SHEET
          if (getGasUrl() && getGasSecretKey()) {
            callAppsScript("updatePostStatus", { postId: it.id, status: "UNPUBLISHED" })
              .then(function (res) {
                if (res && res.success) {
                  toast("Đã gỡ bài và cập nhật trên Google Sheet!", "wr");
                }
              })
              .catch(function (err) {
                console.warn("[GSheet Sync] Lỗi khi gỡ bài trên Sheet:", err);
              });
          }
          toast("Đã gỡ bài khỏi trang hiển thị", "wr");
          renderCms();
        } else if (act === "delete") {
          if (confirm("Đồng chí có chắc chắn muốn chuyển bài viết này vào thùng rác (xóa mềm)?")) {
            it.status = "DELETED";
            it.deleted_by = user.hoTen;
            it.deleted_at = now();
            it.updated_at = now();
            saveCmsNews(currentNews);
            logAdd("DELETE", "NEWS", it.id, "Xoá mềm bài: '" + it.tieuDe + "'", "Xoá bởi: " + user.hoTen, "no");

            // ĐỒNG BỘ XOÁ TRÊN GOOGLE SHEET
            if (getGasUrl() && getGasSecretKey()) {
              callAppsScript("updatePostStatus", { postId: it.id, status: "DELETED" })
                .then(function (res) {
                  if (res && res.success) {
                    toast("Đã chuyển bài vào thùng rác và cập nhật Google Sheet!", "wr");
                  }
                })
                .catch(function (err) {
                  console.warn("[GSheet Sync] Lỗi khi xoá bài trên Sheet:", err);
                });
            }
            toast("Đã chuyển bài viết vào thùng rác", "wr");
            renderCms();
          }
        } else if (act === "restore") {
          it.status = "DRAFT";
          it.deleted_by = null;
          it.deleted_at = null;
          it.updated_at = now();
          saveCmsNews(currentNews);
          logAdd("RESTORE", "NEWS", it.id, "Khôi phục bài về Bản nháp: '" + it.tieuDe + "'", "Khôi phục bởi: " + user.hoTen, "ok");
          toast("Đã khôi phục bài viết về Bản nháp (DRAFT)", "ok");
          renderCms();
        }
      });
    });

    /* GẮN SỰ KIỆN THAO TÁC WORKFLOW VĂN BẢN (DOCS) */
    var btnAddDoc = b.querySelector("#cms-btn-add-doc");
    if (btnAddDoc) {
      btnAddDoc.addEventListener("click", function () { openDocModal(); });
    }

    b.querySelectorAll("[data-dact]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var act = btn.dataset.dact;
        var docId = btn.dataset.id;
        var currentDocs = getCmsCustomDocs();
        var d = currentDocs.filter(function (x) { return x.id === docId; })[0];
        if (!d) return;

        if (act === "view") {
          sheet("Văn bản: " + d.so,
            '<div class="prose"><div class="tblwrap"><table><tbody>' +
            '<tr><th>Ký hiệu</th><td><b>' + esc(d.so) + '</b></td></tr>' +
            '<tr><th>Trích yếu</th><td>' + esc(d.ten) + '</td></tr>' +
            '<tr><th>Ngày ban hành</th><td>' + esc(d.ngay) + '</td></tr>' +
            '<tr><th>Người ký</th><td>' + esc(d.ky) + '</td></tr>' +
            '<tr><th>Trạng thái</th><td><span class="cms-badge green">' + esc(d.status) + '</span></td></tr>' +
            '<tr><th>Tóm tắt nội dung</th><td>' + esc(d.tomTat || "Không có tóm tắt chi tiết.") + '</td></tr>' +
            '</tbody></table></div></div>');
        } else if (act === "submit") {
          d.status = "SUBMITTED";
          d.submitted_by = user.hoTen;
          d.submitted_at = now();
          saveCmsCustomDocs(currentDocs);
          logAdd("SUBMIT", "DOCUMENT", d.id, "Trình duyệt văn bản: " + d.so, "", "ok");
          toast("Đã trình duyệt văn bản", "ok");
          renderCms();
          renderDocs();
        } else if (act === "approve") {
          d.status = "APPROVED";
          d.approved_by = user.hoTen;
          d.approved_at = now();
          saveCmsCustomDocs(currentDocs);
          logAdd("APPROVE", "DOCUMENT", d.id, "Phê duyệt văn bản: " + d.so, "", "ok");
          toast("Đã phê duyệt văn bản", "ok");
          renderCms();
          renderDocs();
        } else if (act === "publish") {
          if (d.status !== "APPROVED") { alert("Văn bản phải được phê duyệt trước khi xuất bản!"); return; }
          d.status = "PUBLISHED";
          d.published_by = user.hoTen;
          d.published_at = now();
          saveCmsCustomDocs(currentDocs);
          logAdd("PUBLISH", "DOCUMENT", d.id, "Xuất bản văn bản Chi bộ: " + d.so, "", "ok");
          toast("Đã xuất bản văn bản vào kho tra cứu Chi bộ", "ok");
          renderCms();
          renderDocs();
        } else if (act === "unpublish") {
          d.status = "UNPUBLISHED";
          saveCmsCustomDocs(currentDocs);
          logAdd("UNPUBLISH", "DOCUMENT", d.id, "Gỡ văn bản: " + d.so, "", "wr");
          toast("Đã gỡ văn bản", "wr");
          renderCms();
          renderDocs();
        } else if (act === "delete") {
          if (confirm("Chuyển văn bản này vào thùng rác?")) {
            d.status = "DELETED";
            d.deleted_by = user.hoTen;
            d.deleted_at = now();
            saveCmsCustomDocs(currentDocs);
            logAdd("DELETE", "DOCUMENT", d.id, "Xoá mềm văn bản: " + d.so, "", "no");
            toast("Đã xoá mềm văn bản", "wr");
            renderCms();
            renderDocs();
          }
        } else if (act === "restore") {
          d.status = "DRAFT";
          d.deleted_by = null;
          d.deleted_at = null;
          saveCmsCustomDocs(currentDocs);
          logAdd("RESTORE", "DOCUMENT", d.id, "Khôi phục văn bản về Nháp: " + d.so, "", "ok");
          toast("Đã khôi phục văn bản về Nháp", "ok");
          renderCms();
          renderDocs();
        }
      });
    });

    /* GẮN SỰ KIỆN PHẢN ÁNH NHÂN DÂN */
    var btnAddFb = b.querySelector("#cms-btn-add-fb");
    if (btnAddFb) {
      btnAddFb.addEventListener("click", function () { openFeedbackModal(); });
    }
    b.querySelectorAll("[data-cupdate-fb]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openFeedbackModal(feedbacks[+btn.dataset.cupdateFb], +btn.dataset.cupdateFb);
      });
    });
    b.querySelectorAll("[data-cdel-fb]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (confirm("Đồng chí có chắc chắn muốn xoá phản ánh này?")) {
          var removed = feedbacks.splice(+btn.dataset.cdelFb, 1)[0];
          saveCmsFeedback(feedbacks);
          logAdd("DELETE", "FEEDBACK", removed.id || "-", "Xoá phản ánh của " + removed.nguoiGui, "", "no");
          toast("Đã xoá phản ánh", "wr");
          renderCms();
        }
      });
    });

    /* GẮN SỰ KIỆN LỊCH CÔNG TÁC */
    var btnAddEv = b.querySelector("#cms-btn-add-ev");
    if (btnAddEv) {
      btnAddEv.addEventListener("click", function () { openEventModal(); });
    }
    b.querySelectorAll("[data-cedit-ev]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openEventModal(events[+btn.dataset.ceditEv], +btn.dataset.ceditEv);
      });
    });
    b.querySelectorAll("[data-cdel-ev]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (confirm("Đồng chí có chắc chắn muốn xoá lịch này?")) {
          var removed = events.splice(+btn.dataset.cdelEv, 1)[0];
          saveCmsEvents(events);
          logAdd("DELETE", "EVENT", removed.id || "-", "Xoá lịch: " + removed.tieuDe, "", "no");
          toast("Đã xoá lịch công tác", "wr");
          renderCms();
        }
      });
    });

    /* GẮN SỰ KIỆN TIẾN ĐỘ 6 RÕ */
    var btnExportTasks = b.querySelector("#cms-btn-export-tasks");
    if (btnExportTasks) {
      btnExportTasks.addEventListener("click", function () {
        var txt = "BÁO CÁO TIẾN ĐỘ THỰC HIỆN NHIỆM VỤ '6 RÕ' — CHI BỘ TDP LƯƠNG HẬU\n" +
          "Thời gian xuất: " + now() + "\n" +
          "Người xuất báo cáo: " + user.hoTen + " (" + user.chucVu + ")\n" +
          "Phê duyệt: Chi uỷ Chi bộ TDP Lương Hậu\n" +
          "=".repeat(65) + "\n\n";
        D.TASKS.forEach(function (t, i) {
          var ov = taskOverrides[t.id] || {};
          var pct = ov.pct != null ? ov.pct : t.pct;
          var st = ov.trangThai || t.trangThai;
          txt += (i + 1) + ". Đ/c: " + t.hoTen + " — " + t.chucVu + "\n" +
            "   Nhiệm vụ: " + t.viec + "\n" +
            "   Thời hạn: " + t.han + " | Tiến độ: " + pct + "% | Trạng thái: " + st + "\n\n";
        });
        var blob = new Blob(["\ufeff" + txt], { type: "text/plain;charset=utf-8" });
        var url = URL.createObjectURL(blob), l = document.createElement("a");
        l.href = url; l.download = "bao-cao-tien-do-6-ro-" + new Date().toISOString().slice(0, 10) + ".txt";
        l.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
        logAdd("EXPORT", "TASKS_REPORT", "6_RO", "Xuất báo cáo tiến độ 6 Rõ toàn diện", "", "ok");
        toast("Đã xuất báo cáo tiến độ 6 Rõ (.txt)", "ok");
      });
    }

    var btnRemindAll = b.querySelector("#cms-btn-remind-all");
    if (btnRemindAll) {
      btnRemindAll.addEventListener("click", function () {
        if (confirm("Đồng chí Bí thư có chắc muốn gửi thông báo đôn đốc toàn diện tới 10 đồng chí chủ chốt?")) {
          logAdd("REMIND_ALL", "TASKS", "10_CADRES", "Đồng chí Bí thư phát lệnh đôn đốc toàn diện 10 cán bộ chủ chốt hoàn thành nhiệm vụ 6 Rõ", "", "wr");
          toast("Đã phát lệnh đôn đốc 10 cán bộ chủ chốt!", "ok");
        }
      });
    }

    b.querySelectorAll("[data-cremind-task]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = D.TASKS[+btn.dataset.cremindTask];
        logAdd("REMIND", "CADRE_TASK", t.id, "Gửi thông báo đôn đốc khẩn cấp tới đồng chí " + t.hoTen + " (" + t.chucVu + ")", "", "wr");
        toast("Đã gửi đôn đốc tới đồng chí " + t.hoTen, "ok");
      });
    });

    b.querySelectorAll("[data-cup-task]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openTaskModal(D.TASKS[+btn.dataset.cupTask], taskOverrides);
      });
    });

    /* GẮN SỰ KIỆN SAO LƯU & KHÔI PHỤC */
    var btnExportAll = b.querySelector("#cms-btn-export-all");
    if (btnExportAll) {
      btnExportAll.addEventListener("click", function () {
        var backupData = {
          version: "2.0-master-audit",
          export_time: now(),
          exported_by: user.hoTen + " (" + user.chucVu + ")",
          news: getCmsNews(),
          docs: getCmsCustomDocs(),
          feedback: getCmsFeedback(),
          events: getCmsEvents(),
          tasks_override: getCmsTaskOverrides(),
          audit_logs: logGet()
        };
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        var l = document.createElement("a");
        l.setAttribute("href", dataStr);
        l.setAttribute("download", "chibo_luong_hau_cms_backup_" + new Date().toISOString().slice(0, 10) + ".json");
        l.click();
        logAdd("BACKUP", "DATABASE", "ALL", "Sao lưu toàn bộ dữ liệu CMS Chi bộ định dạng JSON", "", "ok");
        toast("Đã tải tệp sao lưu dữ liệu CMS!", "ok");
      });
    }

    var btnImportTrigger = b.querySelector("#cms-btn-import-trigger");
    var inputImport = b.querySelector("#cms-input-import");
    if (btnImportTrigger && inputImport) {
      btnImportTrigger.addEventListener("click", function () { inputImport.click(); });
      inputImport.addEventListener("change", function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (evt) {
          try {
            var data = JSON.parse(evt.target.result);
            if (data.news) saveCmsNews(data.news);
            if (data.docs) saveCmsCustomDocs(data.docs);
            if (data.feedback) saveCmsFeedback(data.feedback);
            if (data.events) saveCmsEvents(data.events);
            if (data.tasks_override) saveCmsTaskOverrides(data.tasks_override);
            logAdd("RESTORE_DATA", "DATABASE", file.name, "Khôi phục thành công dữ liệu từ tệp sao lưu " + file.name, "", "ok");
            toast("Khôi phục dữ liệu thành công!", "ok");
            renderCms();
            renderDocs();
          } catch (err) {
            alert("Lỗi đọc tệp sao lưu JSON: " + err.message);
          }
        };
        reader.readAsText(file);
      });
    }

    var btnResetSeeds = b.querySelector("#cms-btn-reset-seeds");
    if (btnResetSeeds) {
      btnResetSeeds.addEventListener("click", function () {
        if (confirm("Đồng chí có chắc chắn muốn thiết lập lại toàn bộ dữ liệu mẫu ban đầu không?")) {
          localStorage.removeItem("lh.cms.news");
          localStorage.removeItem("lh.cms.feedback");
          localStorage.removeItem("lh.cms.events");
          localStorage.removeItem("lh.cms.docs");
          localStorage.removeItem("lh.cms.tasks_override");
          cmsInitSeeds();
          logAdd("RESET_DATA", "DATABASE", "SEEDS", "Thiết lập lại dữ liệu mẫu mặc định của Chi bộ", "", "wr");
          toast("Đã khôi phục dữ liệu mẫu", "ok");
          renderCms();
          renderDocs();
        }
      });
    }
  }

  /* ---------------- CÁC MODAL DIALOGS XỬ LÝ NHẬP LIỆU CHỐNG XSS ---------------- */
  function openViewNewsModal(item) {
    sheet("Xem chi tiết thông báo: " + item.tieuDe,
      '<div class="prose"><div class="tblwrap"><table><tbody>' +
      '<tr><th style="width:30%">Tiêu đề</th><td><b>' + esc(item.tieuDe) + '</b></td></tr>' +
      '<tr><th>Phân loại</th><td><span class="cms-badge blue">' + esc(item.loai) + '</span>' + (item.ghim ? ' <span class="cms-badge red">📌 Ghim đầu</span>' : '') + '</td></tr>' +
      '<tr><th>Trạng thái vòng đời</th><td><span class="cms-badge green">' + esc(item.status) + '</span></td></tr>' +
      '<tr><th>Ngày đăng</th><td>' + esc(item.ngay) + '</td></tr>' +
      '<tr><th>Người tạo / soạn</th><td>' + esc(item.author_name || item.nguoiKy) + '</td></tr>' +
      (item.approved_by ? '<tr><th>Người phê duyệt</th><td><b>' + esc(item.approved_by) + '</b> (lúc ' + esc(item.approved_at) + ')</td></tr>' : '') +
      (item.rejection_reason ? '<tr><th>Lý do từ chối</th><td style="color:#b91c1c">' + esc(item.rejection_reason) + '</td></tr>' : '') +
      '<tr><th>Trích yếu</th><td>' + esc(item.trichYeu) + '</td></tr>' +
      (item.image || item.linkHinhAnh ? '<tr><th>Ảnh đại diện</th><td><img src="' + esc(item.image || item.linkHinhAnh) + '" alt="' + esc(item.tieuDe) + '" style="max-width:100%;max-height:180px;border-radius:6px;object-fit:contain" /></td></tr>' : '') +
      '<tr><th>Toàn văn</th><td><div style="white-space:pre-wrap;background:#f8fafc;padding:10px;border-radius:6px;border:1px solid #e2e8f0;line-height:1.5">' + esc(item.noiDung || "Chưa có nội dung toàn văn.") + '</div></td></tr>' +
      '</tbody></table></div></div>');
  }

  function openNewsModal(editItem) {
    var isEdit = editItem != null;
    var defDate = isEdit ? editItem.ngay : new Date().toLocaleDateString("vi-VN");
    var defSigner = isEdit ? (editItem.nguoiKy || editItem.author_name) : (user ? user.hoTen + " (" + user.chucVu + ")" : "Chi uỷ TDP Lương Hậu");
    var curImg = isEdit ? (editItem.image || editItem.imageUrl || editItem.linkHinhAnh || "") : "";

    var formHtml =
      '<form class="cms-form" id="f-news">' +
      '<div class="field"><label>Tiêu đề thông báo / tin bài <span style="color:#c8102e">*</span></label>' +
      '<input type="text" id="n-title" required value="' + esc(isEdit ? editItem.tieuDe : '') + '" placeholder="Nhập tiêu đề thông báo..."></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
      '<div class="field"><label>Phân loại tin</label>' +
      '<select id="n-type">' +
      ['Khẩn', 'Nội bộ', 'Hướng dẫn', 'Công khai', 'Sinh hoạt Chi bộ'].map(function (opt) {
        return '<option value="' + opt + '"' + (isEdit && editItem.loai === opt ? ' selected' : '') + '>' + opt + '</option>';
      }).join("") + '</select></div>' +
      '<div class="field"><label>Ngày văn bản / tin</label>' +
      '<input type="text" id="n-date" value="' + esc(defDate) + '"></div>' +
      '</div>' +
      '<div class="field"><label>Người soạn / Người ký ban hành</label>' +
      '<input type="text" id="n-signer" value="' + esc(defSigner) + '"></div>' +
      '<div class="field"><label>Trích yếu tóm tắt <span style="color:#c8102e">*</span></label>' +
      '<textarea id="n-summary" required rows="2" placeholder="Tóm tắt ngắn gọn nội dung chỉ đạo...">' + esc(isEdit ? editItem.trichYeu : '') + '</textarea></div>' +
      '<div class="field"><label>Toàn văn nội dung chi tiết</label>' +
      '<textarea id="n-content" rows="4" placeholder="Nội dung đầy đủ của thông báo...">' + esc(isEdit ? editItem.noiDung : '') + '</textarea></div>' +
      '<div class="field" style="margin-top:10px">' +
      '<label>Ảnh đại diện / Hình ảnh bài viết (Tùy chọn)</label>' +
      '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' +
      '<div id="n-img-preview" style="width:72px;height:56px;border-radius:6px;background:#f1f5f9;border:1px solid #cbd5e1;display:flex;align-items:center;justify-content:center;overflow:hidden">' +
      (curImg ? '<img src="' + esc(curImg) + '" style="width:100%;height:100%;object-fit:cover" />' : '<span style="font-size:22px;color:#94a3b8">🖼️</span>') +
      '</div>' +
      '<div style="flex:1;min-width:200px">' +
      '<input type="text" id="n-img" value="' + esc(curImg) + '" placeholder="Dán link ảnh hoặc chọn từ Thư viện Drive..." style="margin-bottom:6px">' +
      '<div style="display:flex;gap:6px">' +
      '<button type="button" class="btn sm" id="btn-pick-news-img" style="background:#0b4d97;color:#fff;font-size:11.5px;padding:4px 9px">' + ic("image") + ' Chọn từ Thư viện</button>' +
      '<button type="button" class="btn gray sm" id="btn-clear-news-img" style="font-size:11.5px;padding:4px 9px">✕ Xóa ảnh</button>' +
      '</div></div></div></div>' +
      '<div class="field" style="display:flex;align-items:center;gap:8px;margin-top:6px">' +
      '<input type="checkbox" id="n-pin"' + (isEdit && editItem.ghim ? ' checked' : '') + ' style="width:18px;height:18px">' +
      '<label for="n-pin" style="margin:0;cursor:pointer">Ghim thông báo lên đầu trang nội bộ</label>' +
      '</div>' +
      '<div class="note" style="margin-top:10px;font-size:11.8px">Trạng thái tạo mới mặc định là <b>Bản nháp (DRAFT)</b>. Sau khi lưu, đồng chí có thể bấm "Gửi duyệt" để trình Bí thư phê duyệt trước khi xuất bản.</div>' +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button class="btn sm" type="submit" style="background:#0b4d97;color:#fff">' + ic("check") + (isEdit ? ' Lưu cập nhật' : ' Lưu Bản Nháp (DRAFT)') + '</button>' +
      '<button class="btn gray sm" type="button" id="fn-cancel">Hủy</button>' +
      '</div></form>';

    var m = sheet(isEdit ? "Chỉnh sửa bài viết (DRAFT)" : "Soạn thảo bài viết mới (DRAFT)", formHtml);
    var inputImg = m.querySelector("#n-img");
    var previewImg = m.querySelector("#n-img-preview");
    var btnPickImg = m.querySelector("#btn-pick-news-img");
    var btnClearImg = m.querySelector("#btn-clear-news-img");

    inputImg.addEventListener("input", function () {
      var u = inputImg.value.trim();
      if (u) {
        previewImg.innerHTML = '<img src="' + esc(u) + '" style="width:100%;height:100%;object-fit:cover" />';
      } else {
        previewImg.innerHTML = '<span style="font-size:22px;color:#94a3b8">🖼️</span>';
      }
    });

    btnPickImg.addEventListener("click", function () {
      openImagePickerModal(function (selectedUrl) {
        inputImg.value = selectedUrl;
        previewImg.innerHTML = '<img src="' + esc(selectedUrl) + '" style="width:100%;height:100%;object-fit:cover" />';
      });
    });

    btnClearImg.addEventListener("click", function () {
      inputImg.value = "";
      previewImg.innerHTML = '<span style="font-size:22px;color:#94a3b8">🖼️</span>';
    });

    m.querySelector("#fn-cancel").addEventListener("click", function () { m.querySelector(".x").click(); });
    m.querySelector("#f-news").addEventListener("submit", function (e) {
      e.preventDefault();
      var title = m.querySelector("#n-title").value.trim();
      var summary = m.querySelector("#n-summary").value.trim();
      if (!title || !summary) { alert("Vui lòng nhập đầy đủ tiêu đề và trích yếu."); return; }

      var newsList = getCmsNews();
      if (isEdit) {
        var uRole = getUserRole(user);
        if (editItem.status === "PUBLISHED" && uRole !== "BI_THU" && uRole !== "CHI_UY") {
          alert("Đồng chí không có thẩm quyền sửa bài đã xuất bản công khai. Chức năng này chỉ dành cho Bí thư và Chi ủy viên.");
          return;
        }

        editItem.tieuDe = title;
        editItem.loai = m.querySelector("#n-type").value;
        editItem.ngay = m.querySelector("#n-date").value.trim();
        editItem.nguoiKy = m.querySelector("#n-signer").value.trim();
        editItem.trichYeu = summary;
        editItem.noiDung = m.querySelector("#n-content").value.trim();
        editItem.ghim = m.querySelector("#n-pin").checked;
        editItem.image = inputImg.value.trim() || null;
        editItem.linkHinhAnh = editItem.image;
        editItem.updated_at = now();
        // Nếu bài từng bị REJECT, khi sửa sẽ quay về DRAFT
        if (editItem.status === "REJECTED") editItem.status = "DRAFT";
        saveCmsNews(newsList);
        logAdd("UPDATE", "NEWS", editItem.id, "Cập nhật bài viết: '" + editItem.tieuDe + "'", "Người sửa: " + (user ? user.hoTen : "Quản trị viên"), "ok");

        if (editItem.status === "PUBLISHED") {
          triggerSyncPost(editItem, user);
        } else {
          toast("Đã lưu cập nhật bài viết!", "ok");
        }
      } else {
        var newObj = {
          id: "news_" + Date.now(),
          slug: slugify(title),
          tieuDe: title,
          loai: m.querySelector("#n-type").value,
          ngay: m.querySelector("#n-date").value.trim() || new Date().toLocaleDateString("vi-VN"),
          nguoiKy: m.querySelector("#n-signer").value.trim(),
          trichYeu: summary,
          noiDung: m.querySelector("#n-content").value.trim(),
          ghim: m.querySelector("#n-pin").checked,
          image: inputImg.value.trim() || null,
          linkHinhAnh: inputImg.value.trim() || null,
          author_id: user ? (user.id || "dv_user") : "dv_user",
          author_name: user ? user.hoTen : "Đảng viên",
          created_at: now(),
          updated_at: now(),
          status: "DRAFT" // Bắt buộc DRAFT theo đúng yêu cầu kiểm toán
        };
        newsList.unshift(newObj);
        saveCmsNews(newsList);
        logAdd("CREATE", "NEWS", newObj.id, "Tạo mới bài viết nháp (DRAFT): '" + newObj.tieuDe + "'", "Tác giả: " + newObj.author_name, "ok");
        toast("Đã tạo bản nháp mới (DRAFT)!", "ok");
      }
      m.querySelector(".x").click();
      renderCms();
    });
  }

  function openDocModal() {
    var formHtml =
      '<form class="cms-form" id="f-doc">' +
      '<div class="field"><label>Số hiệu / Ký hiệu văn bản <span style="color:#c8102e">*</span></label>' +
      '<input type="text" id="d-so" required placeholder="Ví dụ: 10-NQ/CB, 05-QĐ/CB..."></div>' +
      '<div class="field"><label>Trích yếu tên văn bản <span style="color:#c8102e">*</span></label>' +
      '<textarea id="d-ten" required rows="2" placeholder="Ví dụ: Nghị quyết về việc..."></textarea></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
      '<div class="field"><label>Loại văn bản</label>' +
      '<select id="d-loai"><option value="NQ">Nghị quyết (NQ)</option><option value="QĐ">Quyết định (QĐ)</option><option value="QC">Quy chế (QC)</option><option value="CT">Chương trình (CT)</option><option value="TT">Tờ trình (TT)</option><option value="BC">Báo cáo (BC)</option></select></div>' +
      '<div class="field"><label>Ngày ban hành</label>' +
      '<input type="text" id="d-ngay" value="' + esc(new Date().toLocaleDateString("vi-VN")) + '"></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:2fr 1fr;gap:10px">' +
      '<div class="field"><label>Người ký ban hành</label>' +
      '<input type="text" id="d-ky" value="Hồ Văn Mão (Bí thư Chi bộ)"></div>' +
      '<div class="field"><label>Số trang</label>' +
      '<input type="number" id="d-trang" value="5" min="1"></div>' +
      '</div>' +
      '<div class="field"><label>Tên tệp đính kèm (.pdf, .docx)</label>' +
      '<input type="text" id="d-file" placeholder="Ví dụ: Nghi_quyet_so_10.docx"></div>' +
      '<div class="field"><label>Tóm tắt nội dung văn bản</label>' +
      '<textarea id="d-tomtat" rows="3" placeholder="Tóm tắt các điều khoản cốt lõi..."></textarea></div>' +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button class="btn sm" type="submit" style="background:#0b4d97;color:#fff">' + ic("check") + ' Thêm văn bản (DRAFT)</button>' +
      '<button class="btn gray sm" type="button" id="fd-cancel">Hủy</button>' +
      '</div></form>';

    var m = sheet("Thêm văn bản Chi bộ mới (DRAFT)", formHtml);
    m.querySelector("#fd-cancel").addEventListener("click", function () { m.querySelector(".x").click(); });
    m.querySelector("#f-doc").addEventListener("submit", function (e) {
      e.preventDefault();
      var so = m.querySelector("#d-so").value.trim();
      var ten = m.querySelector("#d-ten").value.trim();
      if (!so || !ten) { alert("Vui lòng điền số hiệu và trích yếu văn bản."); return; }

      // Kiểm tra file extension an toàn
      var fileName = m.querySelector("#d-file").value.trim();
      if (fileName) {
        var ext = fileName.split(".").pop().toLowerCase();
        if (["exe", "bat", "sh", "js", "vbs", "cmd"].indexOf(ext) >= 0) {
          alert("CẢNH BÁO AN TOÀN: Không cho phép đính kèm tệp thực thi (" + ext + ")!");
          return;
        }
      }

      var docsList = getCmsCustomDocs();
      var newDoc = {
        id: "doc_" + Date.now(),
        so: so,
        ten: ten,
        loai: m.querySelector("#d-loai").value,
        type: m.querySelector("#d-loai").value.toLowerCase(),
        ngay: m.querySelector("#d-ngay").value.trim(),
        ky: m.querySelector("#d-ky").value.trim(),
        trang: parseInt(m.querySelector("#d-trang").value, 10) || 1,
        fileDocx: fileName || (so.replace(/[\/\\]/g, "_") + ".docx"),
        tomTat: m.querySelector("#d-tomtat").value.trim(),
        author_id: user ? user.id : "dv_admin",
        author_name: user ? user.hoTen : "Chi uỷ",
        status: "DRAFT",
        created_at: now(),
        updated_at: now()
      };
      docsList.unshift(newDoc);
      saveCmsCustomDocs(docsList);
      logAdd("CREATE", "DOCUMENT", newDoc.id, "Tạo mới văn bản Chi bộ: " + newDoc.so, "Tác giả: " + newDoc.author_name, "ok");
      toast("Đã thêm văn bản nháp (DRAFT)!", "ok");
      m.querySelector(".x").click();
      renderCms();
      renderDocs();
    });
  }

  function openFeedbackModal(editItem, editIdx) {
    var isEdit = editItem != null;
    var formHtml =
      '<form class="cms-form" id="f-fb">' +
      '<div class="field"><label>Họ và tên người phản ánh / Đảng viên <span style="color:#c8102e">*</span></label>' +
      '<input type="text" id="fb-name" required value="' + esc(isEdit ? editItem.nguoiGui : '') + '" placeholder="Họ tên người gửi ý kiến..."></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
      '<div class="field"><label>Địa chỉ / Tổ liên gia</label>' +
      '<input type="text" id="fb-addr" value="' + esc(isEdit ? editItem.diaChi : 'TDP Lương Hậu') + '"></div>' +
      '<div class="field"><label>Số điện thoại liên hệ</label>' +
      '<input type="text" id="fb-sdt" value="' + esc(isEdit ? editItem.sdt : '') + '"></div>' +
      '</div>' +
      '<div class="field"><label>Nội dung kiến nghị / phản ánh <span style="color:#c8102e">*</span></label>' +
      '<textarea id="fb-content" required rows="3" placeholder="Ghi nhận trung thực ý kiến của nhân dân...">' + esc(isEdit ? editItem.noiDung : '') + '</textarea></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
      '<div class="field"><label>Trạng thái xử lý</label>' +
      '<select id="fb-st">' +
      ['Đang xử lý', 'Đã tiếp nhận', 'Đã giải quyết'].map(function (st) {
        return '<option value="' + st + '"' + (isEdit && editItem.trangThai === st ? ' selected' : '') + '>' + st + '</option>';
      }).join("") + '</select></div>' +
      '<div class="field"><label>Cán bộ phụ trách giải quyết</label>' +
      '<input type="text" id="fb-assign" value="' + esc(isEdit ? (editItem.nguoiPhuTrach || '') : 'Hoàng Hữu Rớt (Tổ trưởng TDP)') + '"></div>' +
      '</div>' +
      '<div class="field"><label>Kết quả giải quyết / Phương hướng chỉ đạo</label>' +
      '<textarea id="fb-res" rows="2" placeholder="Biện pháp đã xử lý hoặc kết quả giải quyết...">' + esc(isEdit ? (editItem.ketQua || '') : '') + '</textarea></div>' +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button class="btn sm" type="submit" style="background:#0b4d97;color:#fff">' + ic("check") + (isEdit ? ' Cập nhật phản ánh' : ' Tiếp nhận phản ánh') + '</button>' +
      '<button class="btn gray sm" type="button" id="ffb-cancel">Hủy</button>' +
      '</div></form>';

    var m = sheet(isEdit ? "Cập nhật tiến độ phản ánh" : "Tiếp nhận phản ánh của nhân dân", formHtml);
    m.querySelector("#ffb-cancel").addEventListener("click", function () { m.querySelector(".x").click(); });
    m.querySelector("#f-fb").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = m.querySelector("#fb-name").value.trim();
      var content = m.querySelector("#fb-content").value.trim();
      if (!name || !content) { alert("Vui lòng điền họ tên và nội dung phản ánh."); return; }

      var fbList = getCmsFeedback();
      if (isEdit) {
        editItem.nguoiGui = name;
        editItem.diaChi = m.querySelector("#fb-addr").value.trim();
        editItem.sdt = m.querySelector("#fb-sdt").value.trim();
        editItem.noiDung = content;
        editItem.trangThai = m.querySelector("#fb-st").value;
        editItem.nguoiPhuTrach = m.querySelector("#fb-assign").value.trim();
        editItem.ketQua = m.querySelector("#fb-res").value.trim();
        saveCmsFeedback(fbList);
        logAdd("UPDATE", "FEEDBACK", editItem.id || "-", "Cập nhật xử lý phản ánh của " + name + " -> " + editItem.trangThai, "", "ok");
        toast("Đã cập nhật phản ánh!", "ok");
      } else {
        var newFb = {
          id: "fb_" + Date.now(),
          nguoiGui: name,
          diaChi: m.querySelector("#fb-addr").value.trim(),
          sdt: m.querySelector("#fb-sdt").value.trim(),
          ngay: new Date().toLocaleDateString("vi-VN"),
          noiDung: content,
          trangThai: m.querySelector("#fb-st").value,
          nguoiPhuTrach: m.querySelector("#fb-assign").value.trim(),
          ketQua: m.querySelector("#fb-res").value.trim()
        };
        fbList.unshift(newFb);
        saveCmsFeedback(fbList);
        logAdd("CREATE", "FEEDBACK", newFb.id, "Tiếp nhận phản ánh mới từ " + name, "", "ok");
        toast("Đã tiếp nhận phản ánh mới!", "ok");
      }
      m.querySelector(".x").click();
      renderCms();
    });
  }

  function openEventModal(editItem, editIdx) {
    var isEdit = editItem != null;
    var formHtml =
      '<form class="cms-form" id="f-ev">' +
      '<div class="field"><label>Tiêu đề cuộc họp / Lịch công tác <span style="color:#c8102e">*</span></label>' +
      '<input type="text" id="ev-title" required value="' + esc(isEdit ? editItem.tieuDe : '') + '" placeholder="Ví dụ: Sinh hoạt Chi bộ thường kỳ..."></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
      '<div class="field"><label>Thời gian diễn ra <span style="color:#c8102e">*</span></label>' +
      '<input type="text" id="ev-time" required value="' + esc(isEdit ? editItem.thoiGian : '') + '" placeholder="Ví dụ: 14h00 - Ngày 03/10/2026"></div>' +
      '<div class="field"><label>Địa điểm</label>' +
      '<input type="text" id="ev-loc" value="' + esc(isEdit ? editItem.diaDiem : 'Nhà sinh hoạt cộng đồng TDP Lương Hậu') + '"></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
      '<div class="field"><label>Đồng chí chủ trì</label>' +
      '<input type="text" id="ev-host" value="' + esc(isEdit ? editItem.chuTri : 'Đ/c Hồ Văn Mão (Bí thư Chi bộ)') + '"></div>' +
      '<div class="field"><label>Thành phần tham dự</label>' +
      '<input type="text" id="ev-part" value="' + esc(isEdit ? editItem.thanhPhan : 'Toàn thể đảng viên Chi bộ') + '"></div>' +
      '</div>' +
      '<div class="field"><label>Nội dung công việc</label>' +
      '<textarea id="ev-desc" rows="3" placeholder="Nội dung chi tiết chương trình làm việc...">' + esc(isEdit ? editItem.noiDung : '') + '</textarea></div>' +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button class="btn sm" type="submit" style="background:#0b4d97;color:#fff">' + ic("check") + (isEdit ? ' Lưu lịch' : ' Tạo lịch mới') + '</button>' +
      '<button class="btn gray sm" type="button" id="fev-cancel">Hủy</button>' +
      '</div></form>';

    var m = sheet(isEdit ? "Chỉnh sửa lịch công tác" : "Lập lịch công tác, sinh hoạt mới", formHtml);
    m.querySelector("#fev-cancel").addEventListener("click", function () { m.querySelector(".x").click(); });
    m.querySelector("#f-ev").addEventListener("submit", function (e) {
      e.preventDefault();
      var title = m.querySelector("#ev-title").value.trim();
      var time = m.querySelector("#ev-time").value.trim();
      if (!title || !time) { alert("Vui lòng điền tiêu đề và thời gian."); return; }

      var evList = getCmsEvents();
      if (isEdit) {
        editItem.tieuDe = title;
        editItem.thoiGian = time;
        editItem.diaDiem = m.querySelector("#ev-loc").value.trim();
        editItem.chuTri = m.querySelector("#ev-host").value.trim();
        editItem.thanhPhan = m.querySelector("#ev-part").value.trim();
        editItem.noiDung = m.querySelector("#ev-desc").value.trim();
        saveCmsEvents(evList);
        logAdd("UPDATE", "EVENT", editItem.id || "-", "Cập nhật lịch: " + title, "", "ok");
        toast("Đã lưu lịch công tác!", "ok");
      } else {
        var newEv = {
          id: "ev_" + Date.now(),
          tieuDe: title,
          thoiGian: time,
          diaDiem: m.querySelector("#ev-loc").value.trim(),
          chuTri: m.querySelector("#ev-host").value.trim(),
          thanhPhan: m.querySelector("#ev-part").value.trim(),
          noiDung: m.querySelector("#ev-desc").value.trim()
        };
        evList.unshift(newEv);
        saveCmsEvents(evList);
        logAdd("CREATE", "EVENT", newEv.id, "Tạo mới lịch: " + title, "", "ok");
        toast("Đã tạo lịch công tác mới!", "ok");
      }
      m.querySelector(".x").click();
      renderCms();
    });
  }

  function openTaskModal(task, overrides) {
    var cur = overrides[task.id] || {};
    var curPct = cur.pct != null ? cur.pct : task.pct;
    var curSt = cur.trangThai || task.trangThai;

    var formHtml =
      '<form class="cms-form" id="f-task">' +
      '<div class="field"><label>Cán bộ chủ chốt</label>' +
      '<input type="text" disabled value="' + esc(task.hoTen) + ' — ' + esc(task.chucVu) + '"></div>' +
      '<div class="field"><label>Nhiệm vụ trọng tâm</label>' +
      '<textarea disabled rows="2">' + esc(task.viec) + '</textarea></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
      '<div class="field"><label>Tiến độ (%) <span style="color:#c8102e">*</span></label>' +
      '<input type="number" id="t-pct" min="0" max="100" required value="' + curPct + '"></div>' +
      '<div class="field"><label>Trạng thái</label>' +
      '<select id="t-st">' +
      ['Đang triển khai', 'Hoàn thành đúng tiến độ', 'Chậm tiến độ', 'Đã hoàn thành xuất sắc'].map(function (opt) {
        return '<option value="' + opt + '"' + (curSt === opt ? ' selected' : '') + '>' + opt + '</option>';
      }).join("") + '</select></div>' +
      '</div>' +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button class="btn sm" type="submit" style="background:#0b4d97;color:#fff">' + ic("check") + ' Cập nhật tiến độ</button>' +
      '<button class="btn gray sm" type="button" id="ft-cancel">Hủy</button>' +
      '</div></form>';

    var m = sheet("Cập nhật tiến độ '6 Rõ': " + task.hoTen, formHtml);
    m.querySelector("#ft-cancel").addEventListener("click", function () { m.querySelector(".x").click(); });
    m.querySelector("#f-task").addEventListener("submit", function (e) {
      e.preventDefault();
      var newPct = parseInt(m.querySelector("#t-pct").value, 10);
      var newSt = m.querySelector("#t-st").value;
      if (isNaN(newPct) || newPct < 0 || newPct > 100) { alert("Tiến độ phải từ 0% đến 100%."); return; }
      overrides[task.id] = { pct: newPct, trangThai: newSt };
      saveCmsTaskOverrides(overrides);
      logAdd("UPDATE", "TASK_6RO", task.id, "Cập nhật tiến độ 6 Rõ: " + task.hoTen + " đạt " + newPct + "% (" + newSt + ")", "", "ok");
      toast("Đã cập nhật tiến độ: " + task.hoTen, "ok");
      m.querySelector(".x").click();
      renderCms();
      renderOverview();
    });
  }
  /* ---------------- TABS ---------------- */
  var TABS = [
    { k: "tongquan", l: "Tổng quan", i: "home" },
    { k: "cms", l: "Quản trị CMS", i: "grid" },
    { k: "vanbanmoi", l: "Văn bản mới Phường & TP", i: "star" },
    { k: "canbo", l: "Cán bộ, đảng viên", i: "users" },
    { k: "vanban", l: "Văn bản Chi bộ", i: "doc" },
    { k: "trunguong", l: "Văn kiện Đảng", i: "flag" },
    { k: "sotay", l: "Sổ tay Đảng viên", i: "book" },
    { k: "nhatky", l: "Nhật ký truy cập", i: "shield" }
  ];
  function switchTab(k) {
    if (k === "cms") {
      if (!user || !canUser("VIEW_CMS", null, user)) {
        var bithuUser = (D.MEMBERS && D.MEMBERS.find(function(m){ return m.chucVu && m.chucVu.indexOf("Bí thư") >= 0; })) || (D.MEMBERS && D.MEMBERS[0]);
        if (bithuUser) user = bithuUser;
      }
      renderCms();
    }
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
      var visibleTabs = TABS; // Luôn hiển thị đầy đủ các mục bao gồm Quản trị CMS
      box.innerHTML = visibleTabs.map(function (t) {
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
