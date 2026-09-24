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

  function formatGvizDate(cell) {
    if (!cell) return "";
    if (cell.f) {
      var mf = cell.f.match(/^(\d{1,2}\/\d{1,2}\/\d{4})/);
      if (mf) return mf[1];
      return String(cell.f).trim();
    }
    var v = String(cell.v || "").trim();
    var md = v.match(/Date\((\d+),(\d+),(\d+)/);
    if (md) {
      var y = md[1];
      var mo = String(parseInt(md[2], 10) + 1).padStart(2, "0");
      var d = String(parseInt(md[3], 10)).padStart(2, "0");
      return d + "/" + mo + "/" + y;
    }
    return v;
  }

  function getDriveImageUrl(raw) {
    if (!raw) return null;
    var str = String(raw).trim();
    if (!str) return null;
    var m = str.match(/id=([a-zA-Z0-9_-]+)/) || str.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (m && m[1]) {
      return "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1200";
    }
    return str;
  }

  function parseGviz(text) {
    try {
      var start = text.indexOf("{");
      var end = text.lastIndexOf("}");
      if (start === -1 || end === -1) return [];
      var json = JSON.parse(text.substring(start, end + 1));
      var rows = (json && json.table && json.table.rows) || [];
      var articles = [];

      for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].c || [];
        var getVal = function (idx) {
          if (!cells[idx] || cells[idx].v === null || cells[idx].v === undefined) return "";
          return String(cells[idx].v).trim();
        };

        // Thứ tự cột chuẩn theo Google Sheets TDP Lương Hậu:
        // Col 0: Dấu thời gian
        // Col 1: Thời gian diễn ra
        // Col 2: Chuyên mục
        // Col 3: Tiêu đề thông tin
        // Col 4: Nội dung chi tiết bài viết
        // Col 5: Địa điểm thực hiện
        // Col 6: Bộ phận đăng tin
        // Col 7: Tải hình ảnh (Drive URL)
        // Col 8: Link hình ảnh
        var timeStamp = formatGvizDate(cells[0]);
        var eventDate = formatGvizDate(cells[1]);
        var thoiGian = eventDate || timeStamp;
        var chuyenMuc = getVal(2);
        var tieuDe = getVal(3);
        var noiDung = getVal(4);
        var diaDiem = getVal(5);
        var boPhan = getVal(6);
        var rawImg = getVal(7) || getVal(8);
        var linkHinhAnh = getDriveImageUrl(rawImg);

        // Bỏ qua dòng tiêu đề nếu có
        var lowThoiGian = (thoiGian || "").toLowerCase();
        var lowChuyenMuc = (chuyenMuc || "").toLowerCase();
        var lowTieuDe = (tieuDe || "").toLowerCase();
        if (
          lowThoiGian.indexOf("thoigian") >= 0 ||
          lowThoiGian.indexOf("thời gian") >= 0 ||
          lowChuyenMuc.indexOf("chuyenmuc") >= 0 ||
          lowChuyenMuc.indexOf("chuyên mục") >= 0 ||
          lowTieuDe.indexOf("tiêu đề") >= 0
        ) {
          continue;
        }

        if (!tieuDe && !noiDung) continue;

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
          id: "gsheet_" + i,
          thoiGian: thoiGian || "Hôm nay",
          chuyenMuc: chuyenMuc || (catType === "thongbao" ? "Thông báo" : (catType === "chunhatxanh" ? "Chủ nhật xanh" : "Tin tức")),
          categoryType: catType,
          tieuDe: tieuDe || "Thông tin từ Tổ dân phố Lương Hậu",
          noiDung: noiDung || "",
          diaDiem: diaDiem || "Tổ dân phố Lương Hậu",
          boPhan: boPhan || "Ban điều hành TDP",
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
    var url = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?tqx=out:json";

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

  // Tự động kích hoạt khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fetchAndApply);
  } else {
    fetchAndApply();
  }
})();
