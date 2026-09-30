/* =====================================================================
   google-sheets-sync.js — ĐỒNG BỘ BÀI VIẾT TỰ ĐỘNG TỪ GOOGLE SHEETS
   Sheet ID: 1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ
   Tự động nạp các bài viết mới từ Google Sheets vào:
     1. Tin tức (Tất cả & Lương Hậu)
     2. Thông báo (Thông báo mới từ Ban điều hành TDP)
     3. Chủ nhật xanh (Trang chuyên đề /chu-nhat-xanh & Component)
   Giữ nguyên toàn bộ giao diện và bảo mật hiện có.
   ===================================================================== */
(function () {
  "use strict";

  var SHEET_ID = "1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ";
  var CACHE_KEY = "LH_GSHEET_POSTS_CACHE_V1";
  var CACHE_TIME_KEY = "LH_GSHEET_POSTS_TIME_V1";
  var TTL = 60 * 1000; // 1 phút tự động cập nhật lại

  function esc(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function convertDriveUrl(url) {
    if (!url) return null;
    var s = String(url).trim();
    if (!s) return null;
    var m = s.match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/);
    if (m && m[1]) {
      return "https://lh3.googleusercontent.com/d/" + m[1];
    }
    return s;
  }

  function parseGviz(text) {
    try {
      var start = text.indexOf("{");
      var end = text.lastIndexOf("}");
      if (start === -1 || end === -1) return [];
      var json = JSON.parse(text.substring(start, end + 1));
      var rows = (json && json.table && json.table.rows) || [];
      var cols = (json && json.table && json.table.cols) || [];
      var articles = [];

      var colMap = {};
      cols.forEach(function (c, idx) {
        var lbl = (c.label || "").toLowerCase().trim();
        if (lbl.indexOf("dấu thời gian") >= 0 || lbl.indexOf("timestamp") >= 0) colMap.timestamp = idx;
        else if (lbl.indexOf("thời gian") >= 0) colMap.thoiGian = idx;
        else if (lbl.indexOf("chuyên mục") >= 0) colMap.chuyenMuc = idx;
        else if (lbl.indexOf("tiêu đề") >= 0) colMap.tieuDe = idx;
        else if (lbl.indexOf("nội dung") >= 0) colMap.noiDung = idx;
        else if (lbl.indexOf("địa điểm") >= 0) colMap.diaDiem = idx;
        else if (lbl.indexOf("bộ phận") >= 0) colMap.boPhan = idx;
        else if (lbl.indexOf("tải hình ảnh") >= 0) colMap.taiAnh = idx;
        else if (lbl.indexOf("link hình ảnh") >= 0) colMap.linkAnh = idx;
        else if (lbl.indexOf("mã bài") >= 0) colMap.maBai = idx;
        else if (lbl.indexOf("trạng thái") >= 0) colMap.trangThai = idx;
        else if (lbl.indexOf("ảnh đại diện") >= 0) colMap.anhDaiDien = idx;
      });

      for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].c || [];
        var getVal = function (idx) {
          if (idx === undefined || idx === null || !cells[idx]) return "";
          if (cells[idx].f !== null && cells[idx].f !== undefined) return String(cells[idx].f).trim();
          if (cells[idx].v !== null && cells[idx].v !== undefined) {
            var val = String(cells[idx].v).trim();
            var m = val.match(/Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)/);
            if (m) {
              var y = m[1], mo = parseInt(m[2], 10) + 1, d = m[3];
              return (d < 10 ? "0" + d : d) + "/" + (mo < 10 ? "0" + mo : mo) + "/" + y;
            }
            return val;
          }
          return "";
        };

        // Xác định vị trí các cột
        var isFullSheet = cells.length >= 8 || colMap.tieuDe !== undefined;
        var idxThoiGian = colMap.thoiGian !== undefined ? colMap.thoiGian : (isFullSheet ? 1 : 0);
        var idxChuyenMuc = colMap.chuyenMuc !== undefined ? colMap.chuyenMuc : (isFullSheet ? 2 : 1);
        var idxTieuDe = colMap.tieuDe !== undefined ? colMap.tieuDe : (isFullSheet ? 3 : 2);
        var idxNoiDung = colMap.noiDung !== undefined ? colMap.noiDung : (isFullSheet ? 4 : 3);
        var idxTaiAnh = colMap.taiAnh !== undefined ? colMap.taiAnh : 7;
        var idxLinkAnh = colMap.linkAnh !== undefined ? colMap.linkAnh : (isFullSheet ? 8 : 4);
        var idxMaBai = colMap.maBai !== undefined ? colMap.maBai : 9;
        var idxTrangThai = colMap.trangThai !== undefined ? colMap.trangThai : 10;
        var idxAnhDaiDien = colMap.anhDaiDien !== undefined ? colMap.anhDaiDien : 11;

        var thoiGian = getVal(idxThoiGian) || getVal(0);
        var chuyenMuc = getVal(idxChuyenMuc);
        var tieuDe = getVal(idxTieuDe);
        var noiDung = getVal(idxNoiDung);
        var maBai = getVal(idxMaBai);
        var trangThai = getVal(idxTrangThai);
        var rawImg = getVal(idxAnhDaiDien) || getVal(idxLinkAnh) || getVal(idxTaiAnh);
        var linkHinhAnh = convertDriveUrl(rawImg);

        // Bỏ qua dòng tiêu đề
        var lowThoiGian = thoiGian.toLowerCase();
        var lowChuyenMuc = chuyenMuc.toLowerCase();
        if (
          lowThoiGian.indexOf("thoigian") >= 0 ||
          lowThoiGian.indexOf("thời gian") >= 0 ||
          lowChuyenMuc.indexOf("chuyenmuc") >= 0 ||
          lowChuyenMuc.indexOf("chuyên mục") >= 0
        ) {
          continue;
        }

        if (!tieuDe && !noiDung) continue;

        // RÀNG BUỘC BẮT BUỘC: Nếu cột trạng thái tồn tại và KHÁC PUBLISHED thì BỎ QUA NGAY
        if (trangThai && String(trangThai).trim().toUpperCase() !== "PUBLISHED") {
          continue;
        }

        // Chuẩn hóa loại chuyên mục
        var norm = (chuyenMuc || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        var catType = "tintuc";
        if (norm.indexOf("thong bao") >= 0 || norm.indexOf("khan") >= 0) {
          catType = "thongbao";
        } else if (norm.indexOf("chu nhat xanh") >= 0 || norm.indexOf("moi truong") >= 0) {
          catType = "chunhatxanh";
        }

        var body = noiDung ? noiDung.split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean) : [];

        articles.push({
          id: maBai || ("gsheet_" + i),
          thoiGian: thoiGian || "Hôm nay",
          chuyenMuc: chuyenMuc || (catType === "thongbao" ? "Thông báo" : (catType === "chunhatxanh" ? "Chủ nhật xanh" : "Tin tức")),
          categoryType: catType,
          tieuDe: tieuDe || "Thông tin từ Tổ dân phố Lương Hậu",
          noiDung: noiDung || "",
          body: body.length ? body : [noiDung || ""],
          linkHinhAnh: linkHinhAnh || null,
        });
      }
      return articles;
    } catch (e) {
      console.warn("[GSheet Sync] Không thể phân tích dữ liệu:", e);
      return [];
    }
  }

  function renderThongBaoBoard(thongBaoList) {
    if (!thongBaoList || !thongBaoList.length) return;
    var main = document.querySelector("#main") || document.querySelector(".wrap");
    if (!main) return;

    var old = document.getElementById("gsheet-thongbao-board");
    if (old) old.remove();

    var board = document.createElement("div");
    board.id = "gsheet-thongbao-board";
    board.style.cssText = "margin:12px 0 16px;padding:14px 16px;background:#fff1f2;border:1.5px solid #f43f5e;border-radius:12px;box-shadow:0 3px 10px rgba(244,63,94,.12);";

    var html = '<div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px dashed #fecdd3;padding-bottom:8px;margin-bottom:10px">' +
      '<div style="display:flex;align-items:center;gap:8px">' +
      '<span style="font-size:20px;line-height:1">📢</span>' +
      '<b style="color:#9f1239;font-size:14px;text-transform:uppercase">Thông báo mới từ Ban điều hành TDP Lương Hậu</b>' +
      '</div>' +
      '<span style="background:#e11d48;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:9999px">' +
      thongBaoList.length + ' thông báo mới</span>' +
      '</div><div style="display:flex;flex-direction:column;gap:10px">';

    thongBaoList.forEach(function (tb) {
      html += '<div style="background:#fff;padding:10px 12px;border-radius:8px;border:1px solid #ffe4e6">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px">' +
        '<h4 style="margin:0;font-size:13.5px;color:#881337;font-weight:700">' + esc(tb.tieuDe) + '</h4>' +
        '<span style="font-size:11px;color:#9f1239;font-weight:600">📅 ' + esc(tb.thoiGian) + '</span>' +
        '</div>' +
        '<p style="margin:4px 0 0;font-size:12.5px;color:#334155;line-height:1.5">' + esc(tb.body[0] || tb.noiDung) + '</p>' +
        (tb.linkHinhAnh ? '<div style="margin-top:6px"><a href="' + esc(tb.linkHinhAnh) + '" target="_blank" rel="noopener" style="font-size:11.5px;color:#0284c7;text-decoration:underline">🖼️ Xem hình ảnh đính kèm ↗</a></div>' : '') +
        '</div>';
    });

    html += '</div>';
    board.innerHTML = html;

    // Chèn lên đầu main hoặc dưới masthead
    var topSec = main.querySelector(".sec") || main.firstChild;
    main.insertBefore(board, topSec);
  }

  function injectChuNhatXanh(cnxList) {
    if (!cnxList || !cnxList.length) return;
    var container = document.querySelector("#cnx-plan-list") || document.querySelector("section > div[style*='flex-direction: column']");
    if (!container) return;

    cnxList.forEach(function (item) {
      var exist = document.getElementById(item.id);
      if (exist) return;

      var card = document.createElement("div");
      card.id = item.id;
      card.style.cssText = "background:#f0fdf4;border-radius:12px;padding:16px;border:1px solid #86efac;margin-bottom:12px;";
      card.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">' +
        '<h4 style="color:#14532d;font-size:15px;font-weight:700;margin:0">' + esc(item.tieuDe) + '</h4>' +
        '<span style="background:#16a34a;color:#fff;font-size:11px;font-weight:bold;padding:3px 8px;border-radius:6px">📅 ' + esc(item.thoiGian) + '</span>' +
        '</div>' +
        '<p style="color:#047857;font-size:12.5px;font-weight:600;margin:6px 0">📍 Tuyến đường Thái Thuận &amp; Thái Vĩnh Chinh</p>' +
        '<p style="color:#334155;font-size:13px;line-height:1.6;margin:0">' + esc(item.noiDung) + '</p>' +
        (item.linkHinhAnh ? '<div style="margin-top:8px"><img src="' + esc(item.linkHinhAnh) + '" alt="' + esc(item.tieuDe) + '" style="max-width:100%;max-height:220px;border-radius:8px;border:1px solid #bbf7d0" loading="lazy" /></div>' : '');

      container.insertBefore(card, container.firstChild);
    });
  }

  function injectNews(articles) {
    if (!articles || !articles.length) return;
    if (!window.LH || !window.LH.NEWS) return;

    // Chuyển sang format NEWS của trang chủ
    var added = 0;
    articles.forEach(function (art) {
      var isThongBao = art.categoryType === "thongbao";
      var newsObj = {
        id: art.id,
        tag: isThongBao ? "ward" : "luonghau",
        pill: isThongBao ? "THÔNG BÁO" : "LƯƠNG HẬU",
        hot: true,
        title: art.tieuDe,
        date: art.thoiGian,
        src: "Ban điều hành TDP (Google Sheets)",
        sum: art.body[0] || (art.noiDung.substring(0, 140) + "..."),
        body: art.body,
        img: art.linkHinhAnh,
        _lv: "luonghau",
      };

      // Kiểm tra trùng ID
      var exists = window.LH.NEWS.luonghau.some(function (x) { return x.id === newsObj.id; });
      if (!exists) {
        window.LH.NEWS.luonghau.unshift(newsObj);
        added++;
      }
    });

    if (added > 0) {
      var list = document.getElementById("news-list");
      var cnt = document.getElementById("news-cnt");
      var tabs = document.getElementById("news-tabs");

      if (window.LHM && list) {
        var all = window.LHM.newsAll();
        list.innerHTML = window.LHM.markupNews(all);
        if (cnt) cnt.textContent = all.length + " tin";
        if (tabs) tabs.innerHTML = window.LHM.markupTabs("all");

        // Gắn lại sự kiện click mở tin
        var items = list.querySelectorAll("li");
        Array.prototype.forEach.call(items, function (li) {
          li.style.cursor = "pointer";
          li.addEventListener("click", function (e) {
            var a = li.querySelector("[data-news]");
            if (a) {
              e.preventDefault();
              var art = articles.filter(function (x) { return x.id === a.dataset.news; })[0];
              if (art) {
                showArticleModal(art);
              }
            }
          });
        });
      }
    }
  }

  function showArticleModal(art) {
    var old = document.getElementById("lh-mask");
    if (old) old.remove();

    var mask = document.createElement("div");
    mask.className = "mask on";
    mask.id = "lh-mask";
    mask.setAttribute("role", "dialog");
    mask.setAttribute("aria-modal", "true");

    var isThongBao = art.categoryType === "thongbao";
    var tagClass = isThongBao ? "ward" : "luonghau";
    var pillText = isThongBao ? "THÔNG BÁO" : (art.chuyenMuc || "LƯƠNG HẬU");

    var mediaHtml = art.linkHinhAnh
      ? '<div style="width:100%;border-radius:11px;overflow:hidden;margin-bottom:12px;border:1px solid #e2e8f0;text-align:center"><img src="' + esc(art.linkHinhAnh) + '" alt="' + esc(art.tieuDe) + '" style="max-width:100%;height:auto;display:block;margin:0 auto;border-radius:10px" loading="lazy" /></div>'
      : '';

    var bodyHtml = mediaHtml +
      '<div style="display:flex;gap:7px;align-items:center;margin-bottom:9px;flex-wrap:wrap">' +
      '<span class="pill ' + tagClass + '">' + esc(pillText) + '</span>' +
      '<span class="pill hot">CẬP NHẬT MỚI</span>' +
      '<span style="font-size:11.5px;color:#7b8497">' + esc(art.thoiGian) + ' · Nguồn: Quản trị TDP (Google Sheets)</span>' +
      '</div>' +
      '<h3 style="font-size:16.5px;line-height:1.4;margin:0 0 10px 0;color:#0f172a">' + esc(art.tieuDe) + '</h3>' +
      '<div class="prose" style="margin-top:10px;font-size:13.5px;line-height:1.6;color:#334155">' +
      art.body.map(function (p) { return '<p style="margin-bottom:8px">' + esc(p) + '</p>'; }).join("") +
      '</div>' +
      '<div class="btn-row" style="margin-top:16px;display:flex;gap:8px">' +
      '<button class="btn sm" id="m-gsheet-close" style="background:#93061d;color:#fff;border:0;padding:6px 14px;border-radius:6px;font-weight:600;cursor:pointer">Đóng</button>' +
      '</div>';

    mask.innerHTML =
      '<div class="sheet">' +
      '<div class="sheet-h"><h3>Chi tiết nội dung</h3><button class="x" id="m-gsheet-x" type="button" aria-label="Đóng">✕</button></div>' +
      '<div class="sheet-b">' + bodyHtml + '</div>' +
      '</div>';

    document.body.appendChild(mask);
    document.body.style.overflow = "hidden";

    var close = function () {
      mask.classList.remove("on");
      document.body.style.overflow = "";
      setTimeout(function () { if (mask.parentNode) mask.remove(); }, 200);
    };

    mask.addEventListener("click", function (e) { if (e.target === mask) close(); });
    var btnClose = mask.querySelector("#m-gsheet-close");
    var btnX = mask.querySelector("#m-gsheet-x");
    if (btnClose) btnClose.addEventListener("click", close);
    if (btnX) btnX.addEventListener("click", close);
  }

  function fetchAndApply() {
    var url = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?tqx=out:json&_t=" + Date.now();

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Status " + res.status);
        return res.text();
      })
      .then(function (text) {
        var articles = parseGviz(text);
        if (!articles.length) return;

        // Phân loại
        var tinTucList = [];
        var thongBaoList = [];
        var cnxList = [];

        articles.forEach(function (art) {
          if (art.categoryType === "thongbao") thongBaoList.push(art);
          else if (art.categoryType === "chunhatxanh") cnxList.push(art);
          else tinTucList.push(art);
        });

        // 1. Gắn vào mục Tin tức
        injectNews(tinTucList.concat(thongBaoList));

        // 2. Gắn Thông báo nổi bật
        if (thongBaoList.length > 0) {
          renderThongBaoBoard(thongBaoList);
        }

        // 3. Gắn vào Ngày Chủ Nhật Xanh
        if (cnxList.length > 0) {
          injectChuNhatXanh(cnxList);
        }
      })
      .catch(function (err) {
        // Không ảnh hưởng trải nghiệm người dùng nếu mạng lỗi
        console.log("[GoogleSheets Sync] Chế độ dự phòng tĩnh đang hoạt động.");
      });
  }

  // Hàm đồng bộ thủ công gọi từ nút bấm CMS
  window.dongBoGoogleSheet = function (btn) {
    var origHtml = btn ? btn.innerHTML : "";
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = "⏳ Đang kéo dữ liệu...";
    }
    fetchAndApply(true);
    setTimeout(function () {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origHtml || "🔄 Đồng bộ Google Sheet";
      }
      alert("✓ Đã đồng bộ thành công dữ liệu mới nhất từ Google Sheets về trang web!");
    }, 1200);
  };

  // Tự động kích hoạt khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { fetchAndApply(); });
  } else {
    fetchAndApply();
  }
})();
