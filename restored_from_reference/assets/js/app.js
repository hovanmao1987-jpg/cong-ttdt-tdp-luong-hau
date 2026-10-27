/* =====================================================================
   app.js — Cổng TTĐT TDP Lương Hậu (KHU CÔNG KHAI, chuẩn Hue.gov.vn Mobile V3)
   Chỉ chứa logic TRÌNH DUYỆT (DOM, sự kiện, modal, validate, localStorage).
   Toàn bộ phần sinh HTML nằm ở assets/js/lh-markup.js (dùng chung với Astro).
     · Bản tĩnh  index.html  : window.LH_SSR = false → render HTML + gắn sự kiện
     · Bản Astro index.astro : window.LH_SSR = true  → chỉ gắn sự kiện (HTML đã SSR)
   ===================================================================== */
(function () {
  "use strict";
  var D = window.LH, M = window.LHM;
  if (!D || !M) {
    if (window.console) console.error("[LH] Thiếu data/data.js hoặc assets/js/lh-markup.js");
    return;
  }
  var ic = M.ic, esc = M.esc, thumb = M.thumb, initials = M.initials;

  /* ================= UTIL ================= */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function h(x) { var t = document.createElement("template"); t.innerHTML = x.trim(); return t.content.firstElementChild; }

  var toastEl;
  function toast(msg, type) {
    if (!toastEl) { toastEl = h('<div class="toast" role="status" aria-live="polite"></div>'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.className = "toast on " + (type || "");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.className = "toast"; }, 2600);
  }

  /* ================= MODAL (bottom sheet) ================= */
  function sheet(title, bodyHTML) {
    var old = $("#lh-mask"); if (old) old.remove();
    var m = h('<div class="mask" id="lh-mask" role="dialog" aria-modal="true">' +
      '<div class="sheet"><div class="sheet-h"><h3>' + esc(title) + '</h3>' +
      '<button class="x" type="button" aria-label="Đóng"></button></div>' +
      '<div class="sheet-b">' + bodyHTML + "</div></div></div>");
    m.querySelector(".x").innerHTML = ic("close");
    m.addEventListener("click", function (e) { if (e.target === m) sheetClose(); });
    document.body.appendChild(m);
    requestAnimationFrame(function () { m.classList.add("on"); });
    document.body.style.overflow = "hidden";
    return m;
  }
  function sheetClose() {
    var m = $("#lh-mask"); if (!m) return;
    m.classList.remove("on"); document.body.style.overflow = "";
    setTimeout(function () { if (m.parentNode) m.remove(); }, 200);
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") sheetClose(); });

  /* kích thước icon SVG cho nhất quán */
  function sizeSvg(scope, sel, px) {
    $$(sel, scope || document).forEach(function (s) {
      s.style.width = px + "px"; s.style.height = px + "px";
    });
  }

  /* ================= 1. TIN TỨC 3 CẤP ================= */
  var curTab = "all", curQuery = "";
  function newsFiltered() {
    var q = curQuery.trim().toLowerCase();
    return M.newsAll().filter(function (n) {
      if (curTab !== "all" && n._lv !== curTab) return false;
      if (!q) return true;
      return (n.title + " " + n.sum + " " + n.src + " " + n.pill).toLowerCase().indexOf(q) >= 0;
    });
  }
  function renderNews() {
    var tabs = $("#news-tabs"), list = $("#news-list"), cnt = $("#news-cnt");
    if (tabs) tabs.innerHTML = M.markupTabs(curTab);
    if (list) list.innerHTML = M.markupNews(newsFiltered());
    if (cnt) cnt.textContent = newsFiltered().length + " tin";
    bindNews();
  }
  function bindNews() {
    $$("#news-tabs button").forEach(function (b) {
      if (b._bound) return; b._bound = 1;
      b.addEventListener("click", function () { curTab = b.dataset.k; renderNews(); });
    });
    $$("#news-list li").forEach(function (li) {
      if (li._bound) return; li._bound = 1;
      li.style.cursor = "pointer";
      li.addEventListener("click", function (e) {
        var a = li.querySelector("[data-news]");
        if (a) { e.preventDefault(); openNews(a.dataset.news); }
      });
    });
    sizeSvg($("#news-list"), ".mt svg", 12);
  }
  function openNews(id) {
    var n = M.newsAll().filter(function (x) { return x.id === id; })[0];
    if (!n) return;
    var mediaTop = n.img
      ? '<div style="width:100%;border-radius:11px;overflow:hidden;margin-bottom:12px;border:1px solid #e2e8f0;background:#fff;text-align:center">' +
        '<img src="' + esc(n.img) + '" alt="' + esc(n.title) + '" style="max-width:100%;height:auto;display:block;margin:0 auto;border-radius:10px" loading="lazy" /></div>'
      : '<div class="th" style="width:100%;height:150px;border-radius:11px;overflow:hidden;margin-bottom:11px">' + thumb(n.id, n.pill) + "</div>";
    var body =
      mediaTop +
      '<div style="display:flex;gap:7px;align-items:center;margin-bottom:9px;flex-wrap:wrap">' +
      '<span class="pill ' + n.tag + '">' + esc(n.pill) + "</span>" +
      "<span style='font-size:11.5px;color:#7b8497'>" + esc(n.date) + " · Nguồn: " + esc(n.src) + "</span></div>" +
      '<h3 style="font-size:16.5px;line-height:1.4">' + esc(n.title) + "</h3>" +
      '<div class="prose" style="margin-top:10px"><p style="font-weight:600;color:#1f2430">' + esc(n.sum) + "</p>" +
      (n.body || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>" +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button class="btn out sm" data-act="print">' + ic("doc") + " In / lưu PDF</button>" +
      '<button class="btn gray sm" data-act="share">' + ic("send") + " Chia sẻ</button>" +
      '<a class="btn gray sm" href="#phananh" data-act="gop" style="text-decoration:none">Góp ý về tin này</a></div>';
    var m = sheet("Chi tiết tin", body);
    sizeSvg(m, ".btn svg", 15);
    m.querySelector('[data-act="print"]').addEventListener("click", function () { window.print(); });
    m.querySelector('[data-act="share"]').addEventListener("click", function () {
      if (navigator.share) { navigator.share({ title: n.title, text: n.sum, url: location.href }).catch(function () {}); return; }
      if (navigator.clipboard) { navigator.clipboard.writeText(n.title + " — " + location.href); toast("Đã sao chép liên kết tin", "ok"); return; }
      toast("Trình duyệt không hỗ trợ chia sẻ", "bad");
    });
    m.querySelector('[data-act="gop"]').addEventListener("click", sheetClose);
  }

  /* ================= 2. ANTT ================= */
  function renderANTT() { var b = $("#antt-box"); if (b) b.innerHTML = M.markupANTT(); bindANTT(); }
  function bindANTT() {
    var box = $("#antt-box"); if (!box) return;
    sizeSvg(box, ".chip svg", 12); sizeSvg(box, ".btn svg", 15);

    /* Kích hoạt tương tác các chip mô hình ANTT */
    $$("[data-antt-m]", box).forEach(function (chip) {
      if (chip._bound) return; chip._bound = 1;
      chip.addEventListener("click", function () {
        var idx = +chip.dataset.anttM;
        var name = D.ANTT.moHinh[idx];
        var info = [
          "Mô hình Tổ liên gia an toàn PCCC triển khai đồng loạt trên 4 khu vực (Đội 8, 9, 10, 11). Mỗi tổ liên gia được trang bị chuông báo cháy liên động, bình chữa cháy xách tay, kìm cộng lực. Phụ trách: Công an phường Hương Thủy & Tổ ANTT cơ sở TDP Lương Hậu.",
          "Lực lượng bảo vệ ANTT cơ sở TDP Lương Hậu duy trì lịch tuần tra nhân dân ban đêm 3 ca/tuần (22h00 - 02h00) trên các tuyến đường trục chính và ngõ xóm thuộc cả 4 khu vực. Tổ trưởng: ông Nguyễn Thúc Thành (0975 175 361).",
          "Mô hình Zalo “Kết nối bình yên” tiếp nhận phản ánh, phổ biến thủ đoạn tội phạm mới, tương tác 24/24 với nhân dân địa bàn. Đầu mối quản lý: Cán bộ Công an khu vực và Tổ trưởng ANTT TDP."
        ];
        sheet(name, '<div class="prose"><p>' + esc(info[idx] || name) + '</p>' +
          '<div class="btn-row" style="margin-top:12px"><button class="btn sm" id="m-baotin">' + ic("warn") + ' Báo tin khẩn</button>' +
          '<button class="btn gray sm" id="m-close">Đóng</button></div></div>');
        var m = $("#lh-mask");
        if (m) {
          m.querySelector("#m-baotin").addEventListener("click", function () {
            sheetClose();
            var b = $("#antt-baotin"); if (b) b.click();
          });
          m.querySelector("#m-close").addEventListener("click", sheetClose);
        }
      });
    });

    /* Kích hoạt tương tác các chip 4 khu vực đội 8 - 11 */
    $$("[data-antt-kv]", box).forEach(function (chip) {
      if (chip._bound) return; chip._bound = 1;
      chip.addEventListener("click", function () {
        var idx = +chip.dataset.anttKv;
        var kv = D.ANTT.khuVuc[idx];
        var details = [
          { doi: "Đội 8", ho: 118, phutrach: "Nguyễn Trọng Nghĩa (Phó Bí thư Chi bộ, Tổ trưởng TDP)", sdt: "0965 712 812", dacdiem: "Trục đường chính liên thôn, ngã ba Lương Hậu - Lương Xuân" },
          { doi: "Đội 9", ho: 124, phutrach: "Hoàng Hữu Rớt (Trưởng ban CTMT) & Nguyễn Thị Mừng (Chi hội Phụ nữ)", sdt: "0965 943 303 / 0377 412 815", dacdiem: "Tuyến kênh nội đồng Lương Hậu - Lương Xuân, khu dân cư tập trung" },
          { doi: "Đội 10", ho: 112, phutrach: "Nguyễn Như Khải (Tổ đội trưởng Quân sự)", sdt: "0388 886 876", dacdiem: "Khu vực giáp ranh, địa bàn sản xuất nông nghiệp và nhà vườn" },
          { doi: "Đội 11", ho: 115, phutrach: "Hồ Văn Mão (Bí thư Chi bộ)", sdt: "0962 481 112", dacdiem: "Khu vực Nhà văn hoá TDP, trạm biến áp, mật độ dân cư cao" }
        ];
        var item = details[idx] || { doi: kv, ho: "Khoảng 115", phutrach: "Ban điều hành TDP", sdt: D.META.hotlineTdp, dacdiem: "Địa bàn dân cư thuộc TDP Lương Hậu" };
        sheet("Thông tin " + item.doi, '<div class="prose">' +
          '<div class="tblwrap"><table><tbody>' +
          '<tr><th style="width:36%">Địa bàn</th><td><b>' + esc(item.doi) + ' — TDP Lương Hậu</b></td></tr>' +
          '<tr><th>Số hộ gia đình</th><td>' + esc(item.ho) + ' hộ</td></tr>' +
          '<tr><th>Cán bộ phụ trách</th><td>' + esc(item.phutrach) + '</td></tr>' +
          '<tr><th>Số điện thoại</th><td><a href="tel:' + esc(item.sdt.split("/")[0].trim().replace(/\s/g, "")) + '" style="color:#0b4d97;font-weight:700">' + esc(item.sdt) + '</a></td></tr>' +
          '<tr><th>Đặc điểm địa bàn</th><td>' + esc(item.dacdiem) + '</td></tr>' +
          '</tbody></table></div>' +
          '<div class="btn-row" style="margin-top:12px">' +
          '<a class="btn sm" href="tel:' + esc(item.sdt.split("/")[0].trim().replace(/\s/g, "")) + '" style="text-decoration:none">' + ic("phone") + ' Gọi cán bộ phụ trách</a>' +
          '<button class="btn gray sm" id="kv-close">Đóng</button></div></div>');
        var m = $("#lh-mask");
        if (m) m.querySelector("#kv-close").addEventListener("click", sheetClose);
      });
    });

    var btn = $("#antt-baotin");
    if (!btn || btn._bound) return; btn._bound = 1;
    btn.addEventListener("click", function () {
      sheet("Báo tin an ninh trật tự khẩn cấp",
        '<div class="prose"><p><b>Khi phát hiện vụ việc về ANTT, người dân liên hệ theo thứ tự ưu tiên:</b></p><ul>' +
        '<li><b>113</b> — <a href="tel:113" style="color:#c62828;font-weight:700">Trực ban Công an (khẩn cấp 24/24)</a></li>' +
        '<li><b>Công an phường Hương Thủy</b> — <a href="tel:02343852870" style="color:#0b4d97;font-weight:700">0234.3852.870</a></li>' +
        '<li><b>Tổ trưởng Tổ bảo vệ ANTT ở cơ sở</b> — <a href="tel:0975175361" style="color:#0b4d97;font-weight:700">ông Nguyễn Thúc Thành (0975 175 361)</a></li>' +
        '<li><b>Tổ trưởng TDP</b> — <a href="tel:0965712812" style="color:#0b4d97;font-weight:700">ông Nguyễn Trọng Nghĩa (0965 712 812)</a></li>' +
        '<li><b>Bí thư Chi bộ</b> — <a href="tel:0962481112" style="color:#0b4d97;font-weight:700">ông Hồ Văn Mão (0962 481 112)</a></li>' +
        '<li><b>Tổ đội trưởng Quân sự</b> — <a href="tel:0388886876" style="color:#0b4d97;font-weight:700">ông Nguyễn Như Khải (0388 886 876)</a></li></ul>' +
        '<div class="note red">Không tự ý truy đuổi, khống chế đối tượng. Ưu tiên bảo đảm an toàn tính mạng; ' +
        "ghi nhớ đặc điểm nhận dạng, biển số phương tiện, thời gian và địa điểm xảy ra vụ việc.</div></div>");
    });
  }

  /* ================= 3. PCTT ================= */
  function renderPCTT() { var b = $("#pctt-box"); if (b) b.innerHTML = M.markupPCTT(); bindPCTT(); }
  function bindPCTT() {
    var p = D.PCTT, box = $("#pctt-box"); if (!box) return;
    sizeSvg(box, ".btn svg", 15);
    var a = $("#pctt-sdt"), b = $("#pctt-diem"), c = $("#pctt-print");
    if (a && !a._bound) {
      a._bound = 1;
      a.addEventListener("click", function () {
        sheet("Số điện thoại liên hệ",
          '<div class="tblwrap"><table><thead><tr><th>Bộ phận</th><th>Số điện thoại</th></tr></thead><tbody>' +
          p.soDT.map(function (s) { return "<tr><td>" + esc(s.ten) + "</td><td><b style='color:#c62828'><a href='tel:" + esc(s.sdt.replace(/\s/g, "")) + "'>" + esc(s.sdt) + "</a></b></td></tr>"; }).join("") +
          "</tbody></table></div>");
      });
    }
    if (b && !b._bound) {
      b._bound = 1;
      b.addEventListener("click", function () {
        sheet("3 điểm sơ tán tại chỗ của TDP Lương Hậu",
          '<div class="prose"><ul>' +
          "<li><b>Điểm số 1 — Nhà văn hoá TDP Lương Hậu</b><br>Sức chứa 120 người; có máy phát điện 5kVA, nước uống, bếp ăn tập trung.<br>Phụ trách: bà Nguyễn Thị Mừng (Chi hội Phụ nữ) — 0377 412 815</li>" +
          "<li><b>Điểm số 2 — Trường Tiểu học Thủy Lương (cơ sở 1)</b><br>Sức chứa 200 người; nhà 2 tầng kiên cố, có khu y tế.<br>Phụ trách: ông Nguyễn Trọng Nghĩa (Tổ trưởng TDP) — 0965 712 812</li>" +
          "<li><b>Điểm số 3 — Nhà ông Hoàng Hữu Rớt (khu vực đội 9)</b><br>Sức chứa 40 người; dành cho các hộ cuối tuyến kênh nội đồng.<br>Phụ trách: ông Phan Đăng Chiến (Người cao tuổi) — 0913 469 434</li></ul></div>");
      });
    }
    if (c && !c._bound) { c._bound = 1; c.addEventListener("click", function () { window.print(); }); }
  }

  /* ================= 4. CÁN BỘ CHỦ CHỐT ================= */
  function renderCadres() { var b = $("#canbo-box"); if (b) b.innerHTML = M.markupCadres(); bindCadres(); }
  function bindCadres() {
    var box = $("#canbo-box"); if (!box) return;
    $$(".info svg", box).forEach(function (s) {
      s.style.cssText = "width:12px;height:12px;flex:0 0 12px;color:#7b8497";
    });
    sizeSvg(box, "[data-c] svg", 14);
    sizeSvg(box, ".btn-row svg", 14);
    /* In / tải bảng công khai danh sách cán bộ */
    var bp = $("#cb-print", box);
    if (bp && !bp._bound) {
      bp._bound = 1;
      bp.addEventListener("click", function () { window.print(); });
    }
    var bt = $("#cb-txt", box);
    if (bt && !bt._bound) {
      bt._bound = 1;
      bt.addEventListener("click", function () {
        var txt = "ỦY BAN NHÂN DÂN PHƯỜNG HƯƠNG THỦY\nTỔ DÂN PHỐ LƯƠNG HẬU\n" +
          "DANH SÁCH CÁN BỘ TỔ DÂN PHỐ LƯƠNG HẬU (CÔNG KHAI)\n" +
          "Địa chỉ: " + D.META.diaChi + "\nHotline TDP: " + D.META.hotlineTdp + "\n" +
          "=".repeat(78) + "\n" +
          D.CADRES.map(function (c) {
            return String(c.stt).padStart(2, "0") + ". " + c.hoTen.padEnd(22, " ") + " | " + c.ns +
              " | " + c.chucVu + " | " + c.sdt;
          }).join("\n") + "\n" + "=".repeat(78) + "\n" +
          "Công khai theo Luật Thực hiện dân chủ ở cơ sở năm 2022.\n";
        var blob = new Blob(["\ufeff" + txt], { type: "text/plain;charset=utf-8" });
        var url = URL.createObjectURL(blob), a = document.createElement("a");
        a.href = url; a.download = "danh-sach-can-bo-tdp-luong-hau.txt";
        a.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
        toast("Đã tải danh sách cán bộ");
      });
    }

    /* Kích hoạt toàn bộ card cán bộ */
    $$(".cadre li.c", box).forEach(function (card) {
      if (card._boundCard) return; card._boundCard = 1;
      card.style.cursor = "pointer";
      card.addEventListener("click", function (e) {
        if (e.target.closest("a[href^='tel:']")) return;
        var btn = card.querySelector("[data-c]");
        if (btn) btn.click();
      });
    });

    $$("[data-c]", box).forEach(function (btn) {
      if (btn._bound) return; btn._bound = 1;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var c = D.CADRES.filter(function (x) { return String(x.stt) === btn.dataset.c; })[0];
        if (!c) return;
        sheet(c.hoTen, '<div class="prose">' +
          '<div class="usercard" style="margin-bottom:12px"><div class="av" style="background:linear-gradient(135deg,' + c.color + ',#2a2f3c)">' +
          esc(initials(c.hoTen)) + '</div><div><h3>' + esc(c.hoTen) + '</h3><div class="p" style="color:#B21C2B">' + esc(c.chucVu) +
          '</div><div class="m">Sinh năm ' + esc(c.ns) + " · " + esc(c.diaBan) + "</div></div></div>" +
          "<h4>Lĩnh vực phân công</h4><p><b>" + esc(c.linhVuc) + "</b></p>" +
          "<h4>Nhiệm vụ cụ thể</h4><p>" + esc(c.nhiemVu) + "</p>" +
          "<h4>Thông tin liên hệ</h4><p>Điện thoại: <b><a href='tel:" + esc(c.sdt.replace(/\s/g, "")) + "' style='color:#0b4d97;font-weight:700'>" + esc(c.sdt) + "</a></b><br>Trạng thái: " + esc(c.tt) + "</p>" +
          '<div class="btn-row" style="margin-top:12px"><a class="btn sm" href="tel:' + esc(c.sdt.replace(/\s/g, "")) + '" style="text-decoration:none">' + ic("phone") + ' Gọi ngay</a>' +
          '<button class="btn gray sm" id="c-close">Đóng</button></div>' +
          '<div class="note" style="margin-top:10px">Nội dung công khai theo Quy chế hoạt động của TDP và Luật Thực hiện dân chủ ở cơ sở năm 2022.</div></div>');
        var m = $("#lh-mask");
        if (m) m.querySelector("#c-close").addEventListener("click", sheetClose);
      });
    });
  }

  /* ================= 5. KHO BIỂU MẪU ================= */
  function renderForms() { var b = $("#bm-box"); if (b) b.innerHTML = M.markupForms(); bindForms(); }
  function bindForms() {
    var T = window.LHTPL, box = $("#bm-box"); if (!box) return;
    sizeSvg(box, ".btn svg", 15);
    $$("[data-d]", box).forEach(function (btn) {
      if (btn._bound) return; btn._bound = 1;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var li = btn.closest("[data-f]");
        if (!T) { toast("Chưa nạp được module biểu mẫu", "bad"); return; }
        var name = T.download(li.dataset.f, btn.dataset.d);
        toast(name ? "Đang tải: " + name : "Không tạo được tệp", name ? "ok" : "bad");
      });
    });

    /* Kích hoạt click vào toàn bộ dòng biểu mẫu để xem chi tiết */
    $$("#bm-box li[data-f]").forEach(function (li) {
      if (li._boundRow) return; li._boundRow = 1;
      li.style.cursor = "pointer";
      li.addEventListener("click", function (e) {
        if (e.target.closest("[data-d]")) return;
        var t = li.querySelector(".t b");
        if (t) t.click();
      });
    });

    $$("li[data-f] .t b", box).forEach(function (t) {
      if (t._bound) return; t._bound = 1;
      t.style.cursor = "pointer";
      t.addEventListener("click", function () {
        var id = t.closest("[data-f]").dataset.f;
        var f = D.FORMS.filter(function (x) { return x.id === id; })[0];
        var m = sheet(f.ma + " — " + f.ten, '<div class="prose"><p>' + esc(f.moTa) + "</p>" +
          "<h4>Căn cứ pháp lý</h4><p>" + esc(f.canCu) + "</p>" +
          "<h4>Hồ sơ kèm theo</h4><p>" + esc(f.hoSo) + "</p>" +
          "<h4>Thời hạn giải quyết</h4><p>" + esc(f.thoiHan) + "</p>" +
          "<h4>Lệ phí</h4><p>" + esc(f.lePhi) + "</p>" +
          "<h4>Nơi nộp</h4><p>Trung tâm Phục vụ hành chính công phường Hương Thủy — 749 Nguyễn Tất Thành; " +
          "hoặc nộp trực tuyến tại <b>dichvucong.gov.vn</b>. Hỗ trợ miễn phí tại Nhà văn hoá TDP sáng thứ Bảy (7h30 – 11h00).</p></div>" +
          '<div class="btn-row" style="margin-top:14px">' +
          '<button class="btn sm" data-g="doc">' + ic("dl") + " Tải .doc</button>" +
          '<button class="btn gray sm" data-g="txt">Tải .txt</button></div>');
        sizeSvg(m, ".btn svg", 15);
        m.querySelectorAll("[data-g]").forEach(function (bt) {
          bt.addEventListener("click", function () {
            var n = T.download(id, bt.dataset.g);
            toast(n ? "Đang tải: " + n : "Lỗi", n ? "ok" : "bad");
          });
        });
      });
    });
    var q = $("#bm-q");
    if (q && !q._bound) {
      q._bound = 1;
      q.addEventListener("input", function () {
        var s = q.value.trim().toLowerCase();
        $$("li[data-f]", box).forEach(function (li) {
          var f = D.FORMS.filter(function (x) { return x.id === li.dataset.f; })[0];
          var hay = (f.ten + " " + f.ma + " " + f.linhVuc + " " + f.moTa + " " + f.canCu).toLowerCase();
          li.style.display = !s || hay.indexOf(s) >= 0 ? "" : "none";
        });
      });
    }
  }

  /* ================= 6. FORM PHẢN ÁNH CÔNG DÂN ================= */
  function renderReflect() { var f = $("#pa-form"); if (f) f.innerHTML = M.markupReflect(); bindReflect(); }
  function val(f, n) {
    var e = f.querySelector('[name="' + n + '"]:checked') || f.querySelector('[name="' + n + '"]');
    return e ? e.value : "";
  }
  function validate(f) {
    var ok = true;
    function bad(name, cond) {
      var el = f.querySelector('[name="' + name + '"]');
      if (!el) return;
      var box = el.closest(".field");
      if (box) box.classList.toggle("bad", !cond);
      if (!cond) ok = false;
    }
    bad("hoten", val(f, "hoten").trim().length >= 3);
    bad("sdt", /^0\d{9}$/.test(val(f, "sdt").replace(/\s/g, "")));
    bad("diachi", !!val(f, "diachi"));
    bad("noidung", val(f, "noidung").trim().length >= 20);
    var dg = f.querySelector('[name="dongy"]');
    if (dg) { dg.closest(".field").classList.toggle("bad", !dg.checked); if (!dg.checked) ok = false; }
    return ok;
  }
  function bindReflect() {
    var f = $("#pa-form");
    if (!f || f._bound) return; f._bound = 1;
    var ta = f.querySelector('[name="noidung"]'), cnt = $("#pa-count"),
      fi = f.querySelector('[name="files"]'), info = $("#pa-fileinfo");
    if (ta && cnt) ta.addEventListener("input", function () { cnt.textContent = ta.value.length; });
    if (fi && info) fi.addEventListener("change", function () {
      var n = fi.files.length;
      info.textContent = n ? "Đã chọn " + n + " tệp: " + Array.prototype.map.call(fi.files, function (x) { return x.name; }).join(", ")
        : "Chưa chọn tệp nào";
    });
    sizeSvg(f, ".btn svg", 15);
    var fd = $(".file-drop svg", f); if (fd) fd.style.cssText = "width:18px;height:18px;vertical-align:-4px;margin-right:4px";
    f.addEventListener("submit", function (e) { e.preventDefault(); submitReflect(f); });
  }
  function submitReflect(f) {
    if (!validate(f)) {
      toast("Vui lòng kiểm tra lại các ô bị đánh dấu đỏ", "bad");
      var first = f.querySelector(".field.bad");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    var now = new Date(), p2 = function (n) { return String(n).padStart(2, "0"); };
    var code = "PA-" + now.getFullYear() + p2(now.getMonth() + 1) + p2(now.getDate()) + "-" +
      p2(now.getHours()) + p2(now.getMinutes()) + p2(now.getSeconds());
    var rec = {
      ma: code, thoiGian: now.toLocaleString("vi-VN"),
      hoten: val(f, "hoten").trim(), sdt: val(f, "sdt").trim(),
      diachi: val(f, "diachi"), linhvuc: val(f, "linhvuc"), mucdo: val(f, "mucdo"),
      noidung: val(f, "noidung").trim(),
      soFile: (f.querySelector('[name="files"]').files || []).length,
      trangThai: "Đã tiếp nhận - chờ phân loại"
    };
    var store = [];
    try { store = JSON.parse(localStorage.getItem("lh.phananh") || "[]"); } catch (e) { }
    store.unshift(rec);
    try { localStorage.setItem("lh.phananh", JSON.stringify(store.slice(0, 50))); } catch (e) { }
    renderHistory();

    /* Chạy ngầm mã Access Key Web3Forms gửi tức thì 1 bức thư về Gmail hovanmao1987@gmail.com */
    try {
      var emailPayload = {
        access_key: "183b93c6-fffd-4323-a730-103d1e16b3a0",
        subject: "Phản ánh công dân mới [" + code + "] - " + rec.hoten,
        from_name: "Cổng TTĐT TDP Lương Hậu",
        name: rec.hoten,
        email: "hovanmao1987@gmail.com",
        reply_to: rec.sdt ? (rec.sdt + "@sms.hue.gov.vn") : "hovanmao1987@gmail.com",
        message: "Mã phản ánh: " + code + "\n" +
                 "Thời gian tiếp nhận: " + rec.thoiGian + "\n" +
                 "Họ và tên người gửi: " + rec.hoten + "\n" +
                 "Số điện thoại liên hệ: " + rec.sdt + "\n" +
                 "Địa chỉ cư trú: " + rec.diachi + "\n" +
                 "Lĩnh vực: " + rec.linhvuc + "\n" +
                 "Mức độ: " + rec.mucdo + "\n\n" +
                 "Nội dung phản ánh:\n" + rec.noidung,
        "Mã phản ánh": code,
        "Thời gian tiếp nhận": rec.thoiGian,
        "Họ và tên": rec.hoten,
        "Số điện thoại": rec.sdt,
        "Địa chỉ": rec.diachi,
        "Lĩnh vực": rec.linhvuc,
        "Mức độ": rec.mucdo,
        "Nội dung": rec.noidung
      };
      if (typeof fetch === "function") {
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(emailPayload)
        }).catch(function (err) {
          console.warn("Lỗi gửi ngầm Web3Forms:", err);
        });
      }
    } catch (e) {
      console.warn("Lỗi chuẩn bị Web3Forms:", e);
    }

    f.reset();
    var c = $("#pa-count"); if (c) c.textContent = "0";
    var i = $("#pa-fileinfo"); if (i) i.textContent = "Chưa chọn tệp nào";
    $$(".field.bad", f).forEach(function (x) { x.classList.remove("bad"); });
    toast("Đã tiếp nhận phản ánh " + code, "ok");

    var m = sheet("Tiếp nhận phản ánh thành công",
      "<div style='text-align:center'><div style='width:64px;height:64px;border-radius:50%;background:#e7f6ee;color:#0f8a4d;display:grid;place-items:center;margin:4px auto 12px'>" +
      "<svg viewBox='0 0 24 24' style='width:34px;height:34px'>" + M.ICONS.check + "</svg></div>" +
      "<h3 style='font-size:16px'>Mã phản ánh của bạn</h3>" +
      "<div style='font-size:23px;font-weight:800;color:#B21C2B;letter-spacing:1px;margin:8px 0'>" + esc(code) + "</div>" +
      "<p style='font-size:12.6px;color:#4a5265'>Vui lòng lưu lại mã để tra cứu tiến độ xử lý.</p></div>" +
      '<div class="tblwrap"><table><tbody>' +
      "<tr><th style='width:38%'>Thời gian tiếp nhận</th><td>" + esc(rec.thoiGian) + "</td></tr>" +
      "<tr><th>Lĩnh vực</th><td>" + esc(rec.linhvuc) + "</td></tr>" +
      "<tr><th>Mức độ</th><td>" + esc(rec.mucdo) + "</td></tr>" +
      "<tr><th>Địa chỉ</th><td>" + esc(rec.diachi) + "</td></tr>" +
      "<tr><th>Người tiếp nhận</th><td>Tổ trưởng TDP Lương Hậu</td></tr>" +
      "<tr><th>Thời hạn phản hồi</th><td>Trong vòng 24 giờ</td></tr>" +
      "</tbody></table></div>" +
      '<div class="note blue">Bản demo tĩnh: phản ánh được lưu trong trình duyệt của bạn (localStorage) để minh hoạ đầy đủ luồng tiếp nhận. ' +
      "Khi triển khai thực tế, dữ liệu gửi tới API của UBND phường / Hue-S và trả về mã tiếp nhận chính thức.</div>" +
      '<div class="btn-row" style="margin-top:14px"><button class="btn block" data-act="ok">Đã hiểu</button></div>');
    m.querySelector('[data-act="ok"]').addEventListener("click", sheetClose);
  }
  function renderHistory() {
    var b = $("#pa-history"); if (!b) return;
    var store = [];
    try { store = JSON.parse(localStorage.getItem("lh.phananh") || "[]"); } catch (e) { }
    if (!store.length) {
      b.innerHTML = '<p style="font-size:12.4px;color:#7b8497;padding:4px 0 8px">Chưa có phản ánh nào được gửi từ thiết bị này.</p>';
      return;
    }
    b.innerHTML = '<div class="tblwrap"><table><thead><tr><th>Mã</th><th>Thời gian</th><th>Lĩnh vực</th><th>Mức độ</th><th>Trạng thái</th></tr></thead><tbody>' +
      store.slice(0, 10).map(function (r) {
        return "<tr><td><b>" + esc(r.ma) + "</b></td><td>" + esc(r.thoiGian) + "</td><td>" + esc(r.linhvuc) +
          "</td><td>" + esc(r.mucdo) + "</td><td>" + esc(r.trangThai) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }

  /* ================= NAV / SEARCH / SOS ================= */
  function setupNav() {
    var ids = ["tintuc", "antt", "pctt", "canbo", "bieumau", "phananh", "lienket"];
    function onScroll() {
      var y = window.scrollY + 140, cur = ids[0];
      ids.forEach(function (id) { var e = document.getElementById(id); if (e && e.offsetTop <= y) cur = id; });
      $$("[data-spy]").forEach(function (a) { a.classList.toggle("on", a.dataset.spy === cur); });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  function setupSearch() {
    var inp = $("#global-search");
    if (!inp) return;
    inp.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      e.preventDefault();
      curQuery = inp.value; curTab = "all";
      renderNews();
      var t = document.getElementById("tintuc");
      if (t) t.scrollIntoView({ behavior: "smooth" });
      toast(curQuery ? 'Đang lọc tin theo từ khoá "' + curQuery + '"' : "Đã xoá bộ lọc", "ok");
    });
    var clr = $("#search-clear");
    if (clr) clr.addEventListener("click", function () {
      inp.value = ""; curQuery = ""; renderNews(); toast("Đã xoá từ khoá tìm kiếm");
    });
  }
  function setupSos() {
    var sos = $("#sos");
    if (!sos) return;
    sos.addEventListener("click", function () {
      sheet("Số điện thoại khẩn cấp", '<div class="prose"><ul>' +
        "<li><b>113</b> — An ninh trật tự</li><li><b>114</b> — Cháy, nổ, cứu nạn cứu hộ</li>" +
        "<li><b>115</b> — Cấp cứu y tế</li><li><b>1900.1909</b> — Sự cố điện lực</li>" +
        "<li><b>1900.1075</b> — Phản ánh hiện trường Hue-S</li></ul>" +
        '<div class="btn-row" style="margin-top:12px">' +
        '<a class="btn sm" href="tel:113" style="text-decoration:none">Gọi 113</a>' +
        '<a class="btn sm blue" href="tel:114" style="text-decoration:none">Gọi 114</a>' +
        '<a class="btn sm" href="tel:115" style="background:#0f8a4d;text-decoration:none">Gọi 115</a></div></div>');
    });
  }

  function setupMasthead() {
    var chips = $$(".mh-strip .chip");
    chips.forEach(function (c, idx) {
      c.style.cursor = "pointer";
      c.setAttribute("role", "button");
      c.setAttribute("tabindex", "0");
      c.addEventListener("click", function () {
        if (idx === 0) {
          sheet("Tổng quan Tổ dân phố Lương Hậu",
            '<div class="prose"><p><b>Tổ dân phố Lương Hậu, phường Thủy Lương, thị xã Hương Thủy</b></p>' +
            '<ul><li><b>Quy mô dân cư:</b> 469 hộ gia đình, 1.756 nhân khẩu</li>' +
            '<li><b>Phân bổ địa bàn:</b> 4 cụm dân cư truyền thống (Đội 8, Đội 9, Đội 10, Đội 11)</li>' +
            '<li><b>Tổ trưởng TDP:</b> ông Nguyễn Trọng Nghĩa (0965 712 812)</li>' +
            '<li><b>Bí thư Chi bộ:</b> ông Hồ Văn Mão (0962 481 112)</li>' +
            '<li><b>Trụ sở Nhà văn hóa TDP:</b> Đội 9, TDP Lương Hậu</li></ul>' +
            '<div class="btn-row" style="margin-top:12px">' +
            '<a class="btn sm" href="tel:0965712812" style="text-decoration:none">' + ic("phone") + ' Gọi Tổ trưởng TDP</a>' +
            '<button class="btn gray sm" id="mh-close">Đóng</button></div></div>');
          var m = $("#lh-mask"); if (m && m.querySelector("#mh-close")) m.querySelector("#mh-close").addEventListener("click", sheetClose);
        } else if (idx === 1) {
          var el = $("#antt");
          if (el) el.scrollIntoView({ behavior: "smooth" });
          else location.hash = "#antt";
        } else if (idx === 2) {
          location.href = "noi_bo.html";
        }
      });
      c.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c.click(); }
      });
    });
  }

  /* ================= VĂN BẢN CHI BỘ (TRANG CHỦ) ================= */
  function bindHomeDocs() {
    var b = $("#vanban-box");
    if (!b) return;
    var tabs = $$("#doc-tabs button", b);
    var items = $$("#home-doc-list li", b);
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("on"); });
        tab.classList.add("on");
        var filter = tab.getAttribute("data-df");
        items.forEach(function (li) {
          var dtype = li.getAttribute("data-dtype");
          if (filter === "ALL" || dtype === filter || (filter === "NQ" && li.querySelector(".k.nq")) || (filter === "QC_QD" && (li.querySelector(".k.qd") || li.textContent.indexOf("QC") !== -1)) || (filter === "CT_GS" && (li.querySelector(".k.tt") || li.querySelector(".k.gs"))) || (filter === "TT_BC" && (li.querySelector(".k.bb") || li.querySelector(".k.tt")))) {
            li.style.display = "";
          } else {
            li.style.display = "none";
          }
        });
      });
    });
    b.querySelectorAll("[data-vd]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var idx = parseInt(btn.getAttribute("data-vd"), 10);
        var d = D.DOCS ? D.DOCS[idx] : null;
        if (!d) return;
        sheet(d.so + " — " + d.loai,
          '<div class="prose"><h4 style="margin-top:0;color:#93061d">' + esc(d.ten) + '</h4>' +
          '<div class="tblwrap"><table><tbody>' +
          '<tr><th style="width:34%">Số hiệu</th><td><b>' + esc(d.so) + '</b></td></tr>' +
          '<tr><th>Loại văn bản</th><td>' + esc(d.loai) + '</td></tr>' +
          (d.fileDocx ? '<tr><th>Tệp Word gốc</th><td><b style="color:#d97706">📄 ' + esc(d.fileDocx) + '</b></td></tr>' : '') +
          '<tr><th>Ngày ban hành</th><td>' + esc(d.ngay) + '</td></tr>' +
          '<tr><th>Người ký</th><td><b>' + esc(d.ky) + '</b></td></tr>' +
          '<tr><th>Cơ quan ban hành</th><td>Chi bộ TDP Lương Hậu, Đảng bộ phường Hương Thủy</td></tr>' +
          '<tr><th>Số trang</th><td>' + d.trang + ' trang</td></tr>' +
          '<tr><th>Phạm vi</th><td>Lưu hành nội bộ Chi bộ (công khai trích yếu)</td></tr>' +
          '</tbody></table></div>' +
          '<h4>Trích yếu nội dung văn bản</h4>' +
          '<div style="background:#f8fafc;padding:12px 14px;border-radius:6px;border:1px solid #e2e8f0;font-size:13px;line-height:1.65;white-space:pre-wrap">' + esc(d.noiDung) + '</div>' +
          '<div class="note" style="margin-top:12px">Văn bản được đối soát và chuẩn hóa trực tiếp từ tệp <b>' + esc(d.fileDocx || "") + '</b> của Chi bộ TDP Lương Hậu.</div>' +
          '<div class="btn-row" style="margin-top:14px">' +
          '<button class="btn sm" id="d-print">' + ic("doc") + ' In trích yếu</button>' +
          '<button class="btn gray sm" id="d-close">Đóng</button></div></div>');
        var m = $("#lh-mask");
        if (m) {
          var closeBt = m.querySelector("#d-close");
          if (closeBt) closeBt.addEventListener("click", sheetClose);
          var printBt = m.querySelector("#d-print");
          if (printBt) printBt.addEventListener("click", function () { window.print(); });
        }
      });
    });
    items.forEach(function (li) {
      var btn = li.querySelector("[data-vd]");
      if (btn) {
        li.style.cursor = "pointer";
        li.addEventListener("click", function (e) {
          if (!e.target.closest("button")) btn.click();
        });
      }
    });
  }

  /* ================= KHỞI ĐỘNG ================= */
  function renderSections() { var b = $("#sec-menu"); if (b) b.innerHTML = M.markupSections(); }
  function renderLinks() { var b = $("#links-box"); if (b) b.innerHTML = M.markupLinks(); }

  function init() {
    $$("[data-meta]").forEach(function (e) { e.textContent = D.META[e.dataset.meta] || e.textContent; });
    $$(".crest").forEach(function (e) { if (!e.querySelector("svg")) e.innerHTML = M.CREST; });
    $$("[data-icon]").forEach(function (e) { e.innerHTML = ic(e.dataset.icon); });

    if (!window.LH_SSR) {
      renderSections(); renderNews(); renderANTT(); renderPCTT();
      renderCadres(); renderForms(); renderReflect(); renderLinks();
    } else {
      /* HTML đã được Astro render sẵn → chỉ gắn sự kiện, giữ nguyên markup cho SEO */
      bindNews(); bindANTT(); bindPCTT(); bindCadres(); bindForms(); bindReflect();
    }
    bindHomeDocs();
    renderHistory();
    setupNav(); setupSearch(); setupSos(); setupMasthead();

    if (location.hash.indexOf("#/noi-bo") === 0) location.replace("noi_bo.html" + location.hash);
  }

  window.LHAPP = {
    ic: ic, esc: esc, thumb: thumb, initials: initials, sheet: sheet, sheetClose: sheetClose, toast: toast,
    renderNews: renderNews, renderHistory: renderHistory, newsFiltered: newsFiltered,
    setTab: function (k) { curTab = k; renderNews(); },
    setQuery: function (q) { curQuery = q; renderNews(); }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
