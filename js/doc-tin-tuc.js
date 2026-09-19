/**
 * doc-tin-tuc.js - Đọc và hiển thị dữ liệu tin tức tự động từ Google Sheets
 * Cổng thông tin điện tử Tổ dân phố Lương Hậu
 * Sheet ID: 1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ
 */
(function () {
  "use strict";

  var SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ/gviz/tq?tqx=out:json";

  // Hàm chuyển đổi chuỗi kỹ thuật Date(...) sang định dạng ngày tháng chuẩn Việt Nam (dd/mm/yyyy)
  function formatSheetDate(cell) {
    if (!cell) return "";
    if (cell.f) return String(cell.f).trim();
    var val = String(cell.v || "").trim();
    if (!val) return "";

    // Phân tích định dạng Date(yyyy,m,d[,h,i,s])
    var m = val.match(/Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)/);
    if (m) {
      var y = m[1];
      // Tháng trong JS bắt đầu từ 0 (0 = Tháng 1)
      var mon = String(parseInt(m[2], 10) + 1).padStart(2, "0");
      var d = String(parseInt(m[3], 10)).padStart(2, "0");
      var dateStr = d + "/" + mon + "/" + y;
      if (m[4] !== undefined && m[5] !== undefined) {
        var h = String(parseInt(m[4], 10)).padStart(2, "0");
        var mi = String(parseInt(m[5], 10)).padStart(2, "0");
        dateStr = dateStr + " " + h + ":" + mi;
      }
      return dateStr;
    }
    return val;
  }

  // Quét lấy ID Google Drive và chuyển sang link trực tiếp không bị vỡ ảnh
  function getDriveDirectUrl(rawUrl) {
    if (!rawUrl) return "";
    var str = String(rawUrl).trim();
    var match = str.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return "https://lh3.googleusercontent.com/d/" + match[1];
    }
    if (/^https?:\/\//.test(str)) {
      return str;
    }
    return "";
  }

  // Thoát ký tự HTML an toàn
  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Modal hiển thị chi tiết bài viết (giữ nguyên ngắt dòng \n)
  function openNewsModal(item) {
    var oldMask = document.getElementById("lh-news-sheet-mask");
    if (oldMask) oldMask.remove();

    var mask = document.createElement("div");
    mask.id = "lh-news-sheet-mask";
    mask.style.position = "fixed";
    mask.style.top = "0";
    mask.style.left = "0";
    mask.style.right = "0";
    mask.style.bottom = "0";
    mask.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    mask.style.zIndex = "99999";
    mask.style.display = "flex";
    mask.style.alignItems = "flex-end";
    mask.style.justifyContent = "center";
    mask.style.backdropFilter = "blur(2px)";

    var sheet = document.createElement("div");
    sheet.style.backgroundColor = "#ffffff";
    sheet.style.width = "100%";
    sheet.style.maxWidth = "600px";
    sheet.style.maxHeight = "90vh";
    sheet.style.borderRadius = "20px 20px 0 0";
    sheet.style.overflowY = "auto";
    sheet.style.padding = "20px";
    sheet.style.boxShadow = "0 -4px 25px rgba(0,0,0,0.25)";
    sheet.style.animation = "slideUp 0.25s ease-out";

    var imgHtml = item.imageUrl
      ? '<div style="margin-bottom:14px;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;background:#f8fafc;text-align:center;">' +
        '<img src="' + escapeHtml(item.imageUrl) + '" alt="' + escapeHtml(item.title) + '" style="width:100%;max-height:360px;object-fit:cover;display:block;" onerror="this.style.display=\'none\';" />' +
        '</div>'
      : '';

    var metaHtml =
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:11.5px;color:#64748b;margin-bottom:12px;">' +
      '<span style="background:#fef2f2;color:#991b1b;border:1px solid #fecaca;padding:2px 8px;border-radius:999px;font-weight:700;">' + escapeHtml(item.category || "Tin Lương Hậu") + '</span>' +
      '<span>📅 ' + escapeHtml(item.eventDate || item.timestamp) + '</span>' +
      (item.location ? '<span>📍 ' + escapeHtml(item.location) + '</span>' : '') +
      (item.author ? '<span>✍ ' + escapeHtml(item.author) + '</span>' : '') +
      '</div>';

    sheet.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;border-b:1px solid #f1f5f9;padding-bottom:10px;">' +
      '<h3 style="font-size:16px;font-weight:800;color:#0f172a;line-height:1.4;margin:0;padding-right:12px;">' + escapeHtml(item.title) + '</h3>' +
      '<button id="btn-close-sheet" type="button" style="background:#f1f5f9;border:none;border-radius:50%;width:32px;height:32px;font-size:18px;font-weight:bold;color:#475569;cursor:pointer;flex-shrink:0;">✕</button>' +
      '</div>' +
      imgHtml +
      metaHtml +
      '<div style="font-size:13.5px;color:#334155;line-height:1.75;white-space:pre-line;text-align:justify;margin-bottom:20px;padding:12px;background:#fafafa;border-radius:12px;border:1px solid #f1f5f9;">' +
      escapeHtml(item.content) +
      '</div>' +
      '<div style="text-align:center;">' +
      '<button id="btn-close-sheet-2" style="background:#991b1b;color:#ffffff;border:none;padding:10px 24px;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;">Đóng bài viết</button>' +
      '</div>';

    mask.appendChild(sheet);
    document.body.appendChild(mask);
    document.body.style.overflow = "hidden";

    var closeFn = function () {
      mask.remove();
      document.body.style.overflow = "";
    };

    mask.addEventListener("click", function (e) {
      if (e.target === mask) closeFn();
    });
    var btnClose = document.getElementById("btn-close-sheet");
    if (btnClose) btnClose.addEventListener("click", closeFn);
    var btnClose2 = document.getElementById("btn-close-sheet-2");
    if (btnClose2) btnClose2.addEventListener("click", closeFn);
  }

  // Tải dữ liệu từ Google Sheets
  function fetchAndRenderNews() {
    fetch(SHEET_URL)
      .then(function (res) {
        return res.text();
      })
      .then(function (text) {
        var match = text.match(/setResponse\(([\s\S]*)\);?/);
        if (!match) return;
        var jsonStr = match[1].trim();
        if (jsonStr.endsWith(";")) jsonStr = jsonStr.slice(0, -1);

        var data = JSON.parse(jsonStr);
        var rows = (data && data.table && data.table.rows) || [];
        if (!rows || rows.length === 0) return;

        var newsItems = [];

        // Duyệt từng dòng từ Google Sheets
        for (var i = 0; i < rows.length; i++) {
          var cells = rows[i].c || [];

          // c[0]: Dấu thời gian
          var timestamp = formatSheetDate(cells[0]);
          // c[1]: Thời gian diễn ra
          var eventDate = formatSheetDate(cells[1]) || timestamp;
          // c[2]: Chuyên mục
          var category = (cells[2] && cells[2].v ? String(cells[2].v) : "").trim();
          // c[3]: Tiêu đề thông tin
          var title = (cells[3] && cells[3].v ? String(cells[3].v) : "").trim();
          // c[4]: Nội dung chi tiết bài viết (giữ nguyên xuống dòng)
          var content = (cells[4] && cells[4].v ? String(cells[4].v) : "").trim();
          // c[5]: Địa điểm thực hiện
          var location = (cells[5] && cells[5].v ? String(cells[5].v) : "").trim();
          // c[6]: Bộ phận đăng tin
          var author = (cells[6] && cells[6].v ? String(cells[6].v) : "").trim();
          // c[7] hoặc c[8]: Link hình ảnh Google Drive
          var driveLink = (cells[7] && cells[7].v ? String(cells[7].v) : "") || (cells[8] && cells[8].v ? String(cells[8].v) : "");
          var imageUrl = getDriveDirectUrl(driveLink);

          // Bỏ qua dòng trống
          if (!title && !content) continue;

          newsItems.push({
            id: "gsheet_" + i,
            timestamp: timestamp,
            eventDate: eventDate,
            category: category || "Tin Lương Hậu",
            title: title || "Thông báo từ Tổ dân phố",
            content: content,
            location: location,
            author: author || "Ban Điều hành TDP Lương Hậu",
            imageUrl: imageUrl
          });
        }

        if (newsItems.length === 0) return;

        // Đảo ngược để bài mới nhất lên trước
        newsItems.reverse();

        // Chèn vào danh sách #news-list trong index.html
        var newsList = document.getElementById("news-list");
        if (newsList) {
          newsItems.forEach(function (item) {
            var li = document.createElement("li");
            li.style.cursor = "pointer";
            li.className = "gsheet-news-item";

            var thumbHtml = item.imageUrl
              ? '<div class="th" style="position:relative;overflow:hidden;border-radius:8px;background:#f1f5f9;">' +
                '<img src="' + escapeHtml(item.imageUrl) + '" alt="' + escapeHtml(item.title) + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\';" />' +
                '</div>'
              : '<div class="th"><svg viewBox="0 0 120 94" preserveAspectRatio="xMidYMid slice" role="img"><rect width="120" height="94" fill="#991b1b"/><text x="60" y="54" text-anchor="middle" font-size="28" fill="#fde047">📰</text></svg></div>';

            var summaryText = item.content.length > 135
              ? item.content.substring(0, 135) + "..."
              : item.content;

            li.innerHTML =
              thumbHtml +
              '<div class="txt">' +
              '<h3><a href="javascript:void(0)" style="color:#991b1b;font-weight:bold;">' + escapeHtml(item.title) + '</a></h3>' +
              '<div class="mt">' +
              '<span class="pill lh" style="background:#dc2626;color:#ffffff;">' + escapeHtml(item.category) + '</span>' +
              '<span class="d" style="font-weight:600;color:#2563eb;">📅 ' + escapeHtml(item.eventDate) + '</span>' +
              '<span class="src">' + escapeHtml(item.author) + '</span>' +
              '</div>' +
              '<p class="sum" style="white-space:pre-line;line-height:1.45;color:#475569;font-size:11.5px;margin-top:4px;">' +
              escapeHtml(summaryText) +
              '</p>' +
              '</div>';

            li.addEventListener("click", function () {
              openNewsModal(item);
            });

            // Chèn bài mới lên đầu danh sách
            newsList.insertBefore(li, newsList.firstChild);
          });
        }
      })
      .catch(function (err) {
        console.warn("[doc-tin-tuc] Không thể kết nối Google Sheets:", err);
      });
  }

  // Tự động khởi chạy khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fetchAndRenderNews);
  } else {
    fetchAndRenderNews();
  }
})();
