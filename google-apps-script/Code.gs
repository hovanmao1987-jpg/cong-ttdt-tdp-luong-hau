/**
 * =====================================================================
 * CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU
 * BACKEND GOOGLE APPS SCRIPT — QUẢN TRỊ CMS & THƯ VIỆN HÌNH ẢNH
 * =====================================================================
 * 
 * Hướng dẫn cấu hình trong Google Apps Script:
 * 1. Mở script.google.com -> Tạo dự án mới
 * 2. Cài đặt Script Properties (Project Settings -> Script Properties):
 *    - CMS_SECRET_KEY : Khóa bí mật quản trị (ví dụ: MatKhauQuanTriLuongHau2026@!)
 *    - DRIVE_FOLDER_ID: ID thư mục Google Drive lưu trữ hình ảnh
 *    - SHEET_ID       : 1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ (hoặc ID trang tính của bạn)
 * 3. Triển khai (Deploy) dưới dạng "Web app":
 *    - Execute as: "Me" (Tôi)
 *    - Who has access: "Anyone" (Bất kỳ ai)
 * =====================================================================
 */

function getProp(k) {
  return PropertiesService.getScriptProperties().getProperty(k);
}

function verifySecret(key) {
  var serverKey = getProp("CMS_SECRET_KEY") || getProp("PASSCODE");
  if (!serverKey || !key) return false;
  return String(key).trim() === String(serverKey).trim();
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    var p = e.parameter || {};
    var action = p.action;

    // 1. Kiểm tra kết nối (ping) - Cho phép kiểm tra trạng thái
    if (action === "ping") {
      return jsonResponse({
        success: true,
        message: "Google Apps Script CMS Backend is active",
        timestamp: new Date().toISOString()
      });
    }

    // 2. Lấy danh sách ảnh công khai từ thư mục Drive
    if (action === "listImages") {
      var folderId = getProp("DRIVE_FOLDER_ID") || "1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo";
      if (!folderId) {
        return jsonResponse({ success: false, error: "DRIVE_FOLDER_ID chưa được cấu hình trong Script Properties." });
      }

      var folder = DriveApp.getFolderById(folderId);
      var files = folder.getFiles();
      var list = [];

      while (files.hasNext()) {
        var f = files.next();
        var mime = f.getMimeType();
        // Chỉ lấy các định dạng ảnh hợp lệ
        if (mime === "image/jpeg" || mime === "image/png" || mime === "image/webp") {
          var fileId = f.getId();
          list.push({
            id: fileId,
            name: f.getName(),
            mimeType: mime,
            size: f.getSize(),
            dateAdded: Utilities.formatDate(f.getDateCreated(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm"),
            // Đường dẫn CDN trực tiếp cho hình ảnh
            url: "https://lh3.googleusercontent.com/d/" + fileId,
            directUrl: "https://drive.google.com/uc?export=view&id=" + fileId,
            webViewLink: f.getUrl()
          });
        }
      }

      // Sắp xếp ảnh mới nhất lên đầu
      list.reverse();

      return jsonResponse({
        success: true,
        total: list.length,
        images: list
      });
    }

    return jsonResponse({ success: false, error: "Hành động (action) không hợp lệ." });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    var body = {};
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      body = e.parameter;
    }

    // Hỗ trợ cả 2 chuẩn: secretKey (CMS Chi bộ) hoặc passcode (Code.gs Downloads)
    var secretKey = body.secretKey || body.passcode;
    var action = body.action;

    // Hỗ trợ định dạng gửi từ form đăng tin nhanh (chỉ có title, category, date, content, image)
    if (!action && (body.title || body.tieude)) {
      action = "publishPost";
      body.post = {
        tieuDe: body.title || body.tieude,
        loai: body.category || body.loai || "Tin tức",
        ngay: body.date || body.ngay,
        noiDung: body.content || body.noidung,
        image: body.image || body.filelink || "",
        status: "PUBLISHED"
      };
    }

    // BẢO MẬT BẮT BUỘC: Kiểm tra khoá bí mật ở mọi hành động ghi/xoá
    if (!verifySecret(secretKey)) {
      return jsonResponse({
        success: false,
        ok: false,
        error: "QUYỀN TRUY CẬP BỊ TỪ CHỐI (403): Mã khoá quản trị (CMS_SECRET_KEY / PASSCODE) không chính xác hoặc chưa được cấu hình."
      });
    }

    var folderId = getProp("DRIVE_FOLDER_ID") || "1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo";
    var sheetId = getProp("SHEET_ID") || "1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ";

    // -------------------------------------------------------------
    // HÀNH ĐỘNG 1: TẢI ẢNH LÊN GOOGLE DRIVE (uploadImage)
    // -------------------------------------------------------------
    if (action === "uploadImage") {
      if (!folderId) {
        return jsonResponse({ success: false, error: "DRIVE_FOLDER_ID chưa được cấu hình." });
      }

      var folder = DriveApp.getFolderById(folderId);
      var fileName = (body.fileName || "hinh-anh-" + Date.now()).replace(/[^a-zA-Z0-9.-]/g, "_");
      var mimeType = body.mimeType || "image/webp";
      var base64Data = body.base64Data;

      if (!base64Data) {
        return jsonResponse({ success: false, error: "Dữ liệu hình ảnh không hợp lệ (thiếu base64Data)." });
      }

      // LOẠI BỎ DATA URI HEADER nếu có (data:image/webp;base64,...)
      var cleanBase64 = base64Data;
      if (cleanBase64.indexOf(",") >= 0) {
        cleanBase64 = cleanBase64.split(",")[1];
      }

      var decodedBytes = Utilities.base64Decode(cleanBase64);

      // KIỂM TRA PHÍA SERVER: Loại file cho phép (Chỉ JPG, PNG, WEBP)
      var allowedMimes = ["image/jpeg", "image/png", "image/webp"];
      if (allowedMimes.indexOf(mimeType.toLowerCase()) === -1) {
        return jsonResponse({
          success: false,
          error: "Định dạng file không được phép. Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP."
        });
      }

      // KIỂM TRA DUNG LƯỢNG (Tối đa 10MB)
      if (decodedBytes.length > 10 * 1024 * 1024) {
        return jsonResponse({
          success: false,
          error: "Dung lượng hình ảnh vượt quá giới hạn cho phép (tối đa 10MB)."
        });
      }

      var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
      var file = folder.createFile(blob);

      // Đặt quyền xem công khai để mọi người dân có thể xem ảnh
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      var fileId = file.getId();
      var cdnUrl = "https://lh3.googleusercontent.com/d/" + fileId;

      return jsonResponse({
        success: true,
        message: "Tải hình ảnh lên Google Drive thành công!",
        file: {
          id: fileId,
          name: fileName,
          mimeType: mimeType,
          size: decodedBytes.length,
          dateAdded: Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm"),
          url: cdnUrl,
          directUrl: "https://drive.google.com/uc?export=view&id=" + fileId,
          webViewLink: file.getUrl()
        }
      });
    }

    // -------------------------------------------------------------
    // HÀNH ĐỘNG 2: XOÁ ẢNH AN TOÀN (deleteImage - Kiểm tra ràng buộc)
    // -------------------------------------------------------------
    if (action === "deleteImage") {
      var fileId = body.fileId;
      if (!fileId) {
        return jsonResponse({ success: false, error: "Thiếu fileId hình ảnh cần xoá." });
      }

      // KIỂM TRA RÀNG BUỘC (DEPENDENCY CHECK): Ảnh có đang được bài viết nào dùng không?
      var sheetApp = SpreadsheetApp.openById(sheetId);
      var sheet = sheetApp.getSheets()[0];
      var data = sheet.getDataRange().getValues();

      var isUsed = false;
      var usedInTitle = "";

      for (var r = 1; r < data.length; r++) {
        var row = data[r];
        // Cột Link hình ảnh (Cột I index 8) hoặc Cột L (index 11) hoặc trong nội dung
        var rowStr = row.join(" ");
        if (rowStr.indexOf(fileId) >= 0) {
          isUsed = true;
          usedInTitle = row[3] || ("Dòng " + (r + 1));
          break;
        }
      }

      if (isUsed) {
        return jsonResponse({
          success: false,
          error: "Hình ảnh này đang được sử dụng trong bài viết: '" + usedInTitle + "'. Không thể xóa nếu chưa thay thế hoặc gỡ khỏi nội dung."
        });
      }

      // Nếu không bị dùng -> Cho phép xóa vào thùng rác
      var fileToDelete = DriveApp.getFileById(fileId);
      fileToDelete.setTrashed(true);

      return jsonResponse({
        success: true,
        message: "Đã chuyển hình ảnh vào thùng rác an toàn."
      });
    }

    // -------------------------------------------------------------
    // HÀNH ĐỘNG 3: XUẤT BẢN HOẶC CẬP NHẬT BÀI VIẾT LÊN GOOGLE SHEET (publishPost)
    // Cột gốc [A..I]:
    // 0: Dấu thời gian, 1: Thời gian diễn ra, 2: Chuyên mục, 3: Tiêu đề,
    // 4: Nội dung, 5: Địa điểm, 6: Bộ phận đăng, 7: Tải ảnh, 8: Link ảnh
    // Cột mở rộng mới [J..N] chỉ thêm ở cuối:
    // 9: Mã bài (ID), 10: Trạng thái (PUBLISHED/UNPUBLISHED/DELETED), 11: Ảnh đại diện URL, 12: Tác giả, 13: Người duyệt
    // -------------------------------------------------------------
    if (action === "publishPost") {
      var post = body.post;
      if (!post || !post.tieuDe) {
        return jsonResponse({ success: false, error: "Dữ liệu bài viết không hợp lệ." });
      }

      var sheetApp = SpreadsheetApp.openById(sheetId);
      var sheetName = getProp("SHEET_NAME");
      var sheet = (sheetName && sheetApp.getSheetByName(sheetName)) || sheetApp.getSheetByName("Câu trả lời biểu mẫu 1") || sheetApp.getSheets()[0];
      var data = sheet.getDataRange().getValues();

      var foundRow = -1;
      var postId = post.id || ("post_" + Date.now());

      // 1. Tìm theo Mã bài (Cột J index 9) trước
      for (var r = 1; r < data.length; r++) {
        if (data[r][9] && String(data[r][9]).trim() === String(postId).trim()) {
          foundRow = r + 1; // 1-indexed trong Sheet
          break;
        }
      }

      // 2. Nếu J không khớp hoặc trống, chỉ ghi đè dòng cũ khi khớp CẢ tiêu đề (cột D) LẪN thời gian (cột B) và có ĐÚNG MỘT dòng khớp
      if (foundRow === -1 && post.tieuDe) {
        var postTitle = String(post.tieuDe).trim().toLowerCase();
        var postTime = String(post.ngay || "").trim().toLowerCase();
        var matchedRows = [];

        if (postTime) {
          for (var r = 1; r < data.length; r++) {
            var rowTitle = String(data[r][3] || "").trim().toLowerCase();
            var rawTime = data[r][1];
            var rowTimeStr = "";
            if (rawTime instanceof Date) {
              rowTimeStr = Utilities.formatDate(rawTime, "Asia/Ho_Chi_Minh", "dd/MM/yyyy");
            } else {
              rowTimeStr = String(rawTime || "").trim().toLowerCase();
            }

            var titleMatches = (rowTitle === postTitle);
            var timeMatches = (rowTimeStr === postTime) ||
                              (rowTimeStr.indexOf(postTime) >= 0) ||
                              (postTime.indexOf(rowTimeStr) >= 0 && rowTimeStr.length > 5);

            if (titleMatches && timeMatches) {
              matchedRows.push(r + 1);
            }
          }

          // Chỉ ghi đè khi có ĐÚNG MỘT dòng khớp; khi ghi đè rowData đã có sẵn cột J (postId)
          if (matchedRows.length === 1) {
            foundRow = matchedRows[0];
          }
          // Nếu có nhiều dòng khớp hoặc không chắc -> foundRow giữ nguyên -1 (sẽ appendRow)
        }
      }

      var nowFormatted = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
      var imgUrl = post.image || post.imageUrl || post.thumbnail || post.linkHinhAnh || "";

      var rowData = [
        nowFormatted,                     // Col A (0): Dấu thời gian
        post.ngay || nowFormatted,         // Col B (1): Thời gian diễn ra
        post.loai || "Tin tức",            // Col C (2): Chuyên mục
        post.tieuDe,                       // Col D (3): Tiêu đề thông tin
        post.noiDung || post.trichYeu || "", // Col E (4): Nội dung chi tiết
        "TDP Lương Hậu",                  // Col F (5): Địa điểm thực hiện
        post.author_name || "Ban điều hành TDP", // Col G (6): Bộ phận đăng
        "",                                // Col H (7): Tải hình ảnh (file gốc)
        imgUrl,                            // Col I (8): Link hình ảnh
        postId,                            // Col J (9): Mã bài viết
        post.status || "PUBLISHED",        // Col K (10): Trạng thái
        imgUrl,                            // Col L (11): Ảnh đại diện URL
        post.author_name || "",            // Col M (12): Tác giả
        post.approved_by || ""             // Col N (13): Người duyệt
      ];

      // Chặn chèn công thức (=, +, -, @) vào ô Sheets cho an toàn
      for (var colIdx = 0; colIdx < rowData.length; colIdx++) {
        var v = rowData[colIdx];
        if (typeof v === "string" && /^[=+\-@]/.test(v)) {
          rowData[colIdx] = "'" + v;
        }
      }

      var lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        if (foundRow > 0) {
          // Cập nhật dòng hiện có
          sheet.getRange(foundRow, 1, 1, rowData.length).setValues([rowData]);
        } else {
          // Thêm dòng mới
          sheet.appendRow(rowData);
        }
      } finally {
        lock.releaseLock();
      }

      return jsonResponse({
        status: "success",
        success: true,
        ok: true,
        message: "Đã đăng tin thành công vào Google Sheets Tổ dân phố Lương Hậu!",
        postId: postId,
        row: foundRow > 0 ? foundRow : sheet.getLastRow(),
        statusText: post.status || "PUBLISHED",
        missingColumns: []
      });
    }

    // -------------------------------------------------------------
    // HÀNH ĐỘNG 4: GỠ BÀI / XOÁ MỀM (updatePostStatus)
    // -------------------------------------------------------------
    if (action === "updatePostStatus") {
      var postId = body.postId;
      var newStatus = body.status || "UNPUBLISHED"; // UNPUBLISHED hoặc DELETED

      var sheetApp = SpreadsheetApp.openById(sheetId);
      var sheet = sheetApp.getSheets()[0];
      var data = sheet.getDataRange().getValues();
      var foundRow = -1;

      for (var r = 1; r < data.length; r++) {
        if (data[r][9] && String(data[r][9]) === String(postId)) {
          foundRow = r + 1;
          break;
        }
      }

      if (foundRow > 0) {
        // Cập nhật cột K (Trạng thái - cột thứ 11)
        sheet.getRange(foundRow, 11).setValue(newStatus);
        return jsonResponse({
          success: true,
          message: "Đã cập nhật trạng thái bài viết thành: " + newStatus
        });
      } else {
        return jsonResponse({
          success: false,
          error: "Không tìm thấy bài viết với mã ID: " + postId
        });
      }
    }

    return jsonResponse({ success: false, error: "Hành động POST không xác định." });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}
