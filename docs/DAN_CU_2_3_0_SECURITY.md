# CHÍNH SÁCH BẢO MẬT & AN TOÀN DỮ LIỆU – PHÂN HỆ DÂN CƯ SỐ 2.3.0
**Đơn vị sử dụng:** Tổ dân phố Lương Hậu, phường Hương Thủy, TP. Huế  
**Phiên bản:** 2.3.0  
**Tiêu chuẩn tuân thủ:** Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân  

---

## 1. MA TRẬN PHÂN QUYỀN TRUY CẬP (RBAC MATRIX)

Hệ thống thiết lập 5 vai trò nghiệp vụ với ranh giới quyền hạn được kiểm soát nghiêm ngặt:

| Nghiệp Vụ / Quyền Hạn | Quản Trị Hệ Thống (`ADMIN`) | Bí Thư Chi Bộ (`BI_THU`) | Tổ Trưởng TDP (`TO_TRUONG`) | Cán Bộ Nghiệp Vụ (`CAN_BO`) | Người Xem Báo Cáo (`VIEWER`) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Xem Dashboard tổng quan** | ✅ Đầy đủ | ✅ Đầy đủ | ✅ Đầy đủ | ✅ Đầy đủ | ✅ Chỉ tổng số |
| **Xem chi tiết danh sách hộ** | ✅ Xem tất cả | ✅ Xem tất cả | ✅ Xem tất cả | ✅ Xem phân công | ❌ Không |
| **Xem số CCCD & Số điện thoại** | ✅ Rõ số | ✅ Rõ số | ⚠️ Che số (`046***123`) | ⚠️ Che số | ❌ Không xem |
| **Thêm / Sửa / Lưu trữ hộ & khẩu** | ✅ Toàn quyền | ✅ Toàn quyền | ✅ Cập nhật | ⚠️ Chỉ đề xuất | ❌ Không |
| **Đồng bộ từ Google Sheets** | ✅ Duyệt & Ghi | ✅ Duyệt & Ghi | ⚠️ Chỉ xem thử | ❌ Không | ❌ Không |
| **Nhập tệp Excel / CSV / Zalo / OCR**| ✅ Toàn quyền | ✅ Toàn quyền | ✅ Nhập & Duyệt | ⚠️ Nhập nháp | ❌ Không |
| **Xuất báo cáo Excel / PDF** | ✅ Rõ số | ✅ Rõ số | ⚠️ Tự động che số | ⚠️ Tự động che số | ⚠️ Báo cáo tổng hợp |
| **Cấu hình hệ thống & Phân quyền** | ✅ Toàn quyền | ⚠️ Xem xét | ❌ Không | ❌ Không | ❌ Không |
| **Sao lưu & Phục hồi CSDL** | ✅ Toàn quyền | ✅ Toàn quyền | ❌ Không | ❌ Không | ❌ Không |

---

## 2. CÁC BIỆN PHÁP BẢO MẬT KỸ THUẬT BẮT BUỘC

### 2.1. Che Dấu Dữ Liệu Cá Nhân Tự Động (Data Masking Engine)
- Dữ liệu CCCD (12 chữ số) và Số điện thoại (10 chữ số) là thông tin định danh nhạy cảm theo Nghị định 13/2023/NĐ-CP.
- Thuật toán che được tích hợp sâu vào tầng logic hiển thị (`window.QuanLyDanCu.maskSensitiveData`):
  ```javascript
  maskSensitiveData(val, type) {
    if (!val) return '—';
    if (this.currentRole === 'ADMIN' || this.currentRole === 'BI_THU') return val;
    if (type === 'cccd' && val.length >= 8) {
      return val.slice(0, 3) + '******' + val.slice(-3);
    }
    if (type === 'phone' && val.length >= 8) {
      return val.slice(0, 3) + '***' + val.slice(-3);
    }
    return val;
  }
  ```
- Kết xuất báo cáo Excel/PDF thông thường tự động áp dụng bộ lọc che số để ngăn ngừa việc rò rỉ khi in ấn lưu hành.

### 2.2. Phòng Chống Tấn Công Injection
1. **Chống CSV/Excel Formula Injection:**
   - Dữ liệu nhập từ Excel hoặc đồng bộ từ Google Sheets nếu bắt đầu bằng các ký tự công thức (`=`, `+`, `-`, `@`) sẽ bị kẻ tấn công lợi dụng để thực thi mã độc macro khi mở bằng Microsoft Excel.
   - Hệ thống tự động kiểm tra và thêm dấu nháy đơn `'` ở đầu chuỗi (`sanitizeFormula`):
     ```javascript
     sanitizeFormula(val) {
       if (typeof val === 'string' && /^[=+\-@]/.test(val.trim())) {
         return "'" + val;
       }
       return val;
     }
     ```
2. **Chống XSS (Cross-Site Scripting):**
   - Mọi dữ liệu văn bản từ người dùng nhập hoặc từ Google Sheets đều được escape ký tự HTML trước khi gán vào DOM (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#039;`).

### 2.3. An Toàn Kết Nối Nguồn Dữ Liệu Google Sheets
- **Chế độ READ-ONLY tuyệt đối:** Hệ thống kết nối tới endpoint xuất CSV định dạng chuẩn (`/export?format=csv`). Không lưu trữ API Key bí mật, không lưu Client Secret, không lưu OAuth Refresh Token ở phía trình duyệt người dùng.
- **Không tự động ghi đè CSDL:** Mọi lần cập nhật từ Google Sheets bắt buộc phải chạy qua tiến trình 3 bước (Đọc dữ liệu -> Hiển thị Báo cáo sai khác -> Người quản trị phê duyệt).
- **Không có luồng ghi ngược:** Hệ thống không cung cấp bất kỳ API hoặc quyền ghi nào để sửa đổi bảng tính Google Sheets gốc, bảo đảm nguyên vẹn dữ liệu của đơn vị.

### 2.4. Quyền Riêng Tư Trong Tiếp Nhận OCR và Văn Bản Zalo
- **OCR cục bộ 100%:** Mô-đun OCR sử dụng thẻ HTML5 `<canvas>` để đọc và xử lý hình ảnh trực tiếp tại trình duyệt máy tính của cán bộ.
- **Không gửi ảnh giấy tờ ra dịch vụ AI bên thứ ba:** Tuyệt đối không gửi ảnh chụp CCCD, sổ hộ khẩu hay giấy tờ tùy thân của người dân lên các server AI đám mây chưa được kiểm định.
- **Không lưu trữ file ảnh tạm:** File ảnh được giải phóng khỏi bộ nhớ RAM ngay sau khi quá trình quét kết thúc.

---

## 3. LẬP BẢN SAO LƯU AN TOÀN VÀ NHẬT KÝ KIỂM TOÁN (AUDIT LOGGING)
- Mọi hoạt động thêm, sửa, xóa, nhập file, cập nhật Google Sheets, xuất file đều được ghi nhận vào bảng `AUDIT_LOGS` với nhãn thời gian, người thực hiện và nội dung thay đổi.
- File sao lưu định dạng JSON được tính toán mã băm kiểm tra tính toàn vẹn (Checksum verification). Quá trình phục hồi yêu cầu xác nhận 2 bước để chống ghi đè nhầm lẫn.
