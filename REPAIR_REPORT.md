# BÁO CÁO SỬA CHỮA TOÀN DIỆN (REPAIR REPORT)
**Dự án:** Cổng thông tin điện tử Tổ Dân Phố Lương Hậu  
**URL Production:** `https://luong-hau.vercel.app/`  
**Ngày hoàn tất:** 19/09/2026  
**Trạng thái kiểm thử:** 45/45 Test Cases ĐẠT (PASS 100%) — Console Error: 0

---

## I. ĐÃ SỬA

### 1. Form phản ánh kiến nghị công dân
- **File:** `src/pages/index.astro`, `index.html`
- **Function:** `submitPhanAnh(event)` và gán alias `submitPhanAnhMoi(event)` trên `window`.
- **Nguyên nhân:** Form HTML có nút/thuộc tính gọi `submitPhanAnhMoi(event)` trong khi script chỉ khai báo `submitPhanAnh(e)`, dẫn đến lỗi `Uncaught ReferenceError: submitPhanAnhMoi is not defined`.
- **Cách sửa:**
  - Đồng bộ và khai báo hàm `submitPhanAnh(e)` hỗ trợ đầy đủ `e.preventDefault()`.
  - Gán trực tiếp `window.submitPhanAnh = submitPhanAnh` và `window.submitPhanAnhMoi = submitPhanAnh`.
  - Tích hợp bộ validate: kiểm tra độ dài nội dung (tối thiểu 20 ký tự), định dạng số điện thoại Việt Nam (10-11 số).
  - Tự động tạo mã phản ánh theo thời gian thực `PA-YYYYMMDD-HHMMSS` và lưu vào `localStorage` (`lh.phananh`).
  - Render cập nhật ngay bảng "Danh sách tiếp nhận & xử lý phản ánh" với số điện thoại được che bảo mật (`0965***812`).

### 2. Đồng bộ ID Hộp thông báo thành công (Success Box)
- **File:** `src/pages/index.astro`, `index.html`
- **Function:** `submitPhanAnh`
- **Nguyên nhân:** Script tìm kiếm phần tử `pa-success` hoặc `pa-success-box`, trong khi HTML có chỗ khai báo khác nhau dẫn đến nguy cơ `null.classList.remove()`.
- **Cách sửa:**
  - Viết logic fallback an toàn:
    ```javascript
    const successBox = document.getElementById("pa-success-box") || document.getElementById("pa-success");
    const succCode = document.getElementById("pa-success-code") || document.getElementById("succ-ma");
    ```
  - Kiểm tra `if (successBox)` trước khi thao tác class và hiển thị mã phản ánh thực tế.

### 3. Xem và đóng chi tiết phản ánh (`openDetailModal` & `closeDetailModal`)
- **File:** `src/pages/index.astro`, `index.html`
- **Function:** `openDetailModal(maPA)`, `closeDetailModal()`
- **Nguyên nhân:** Các nút "Xem chi tiết" trong bảng gọi `onclick="openDetailModal('PA-20260912-193146')"` nhưng hàm chưa được triển khai hoàn chỉnh hoặc thiếu xử lý đóng modal trên thiết bị di động.
- **Cách sửa:**
  - Khai báo đầy đủ `openDetailModal(maPA)` trên `window`:
    - Tìm kiếm mã phản ánh từ dữ liệu động trong `localStorage` hoặc danh sách dữ liệu mẫu lưu tại Lương Hậu.
    - Đổ dữ liệu chi tiết (Mã, Người gửi, Ngày gửi, Lĩnh vực, Trạng thái, Nội dung, Kết quả xử lý) vào `#pa-modal-body` và `#pa-modal-title` (sử dụng escape HTML để chống XSS).
    - Mở modal `#modal-pa-detail` (bỏ class `hidden`, thêm `flex`).
  - Khai báo `closeDetailModal()`:
    - Ẩn modal, khôi phục `overflow` của body, hỗ trợ mượt mà trên Chrome Android/iOS.
    - Bắt sự kiện click backdrop và phím Escape.

### 4. Menu Drawer và Submenu (Mobile & Desktop)
- **File:** `src/pages/index.astro`, `src/pages/noi_bo.astro`, `index.html`, `noi_bo.html`
- **Function:** `openMenu()`, `closeMenu()`, `toggleDrawer()`, `toggleMenu(id)`
- **Nguyên nhân:**
  - Các nút `btn-open-menu`, `btn-close-menu`, `btn-floating-menu` có thể bị lỗi khi DOM chưa sẵn sàng.
  - Hàm `toggleMenu(id)` gọi các submenu (`sub-tt`, `sub-vbcb`, `sub-qlcb`, `sub-tlvk`, `sub-vb`) mà không kiểm tra phần tử tồn tại, gây crash nếu ID bị thiếu.
- **Cách sửa:**
  - Toàn bộ event binding đưa vào `DOMContentLoaded` kèm kiểm tra `if (el) el.addEventListener(...)`.
  - Hàm `toggleMenu(id)` kiểm tra `const el = document.getElementById(id); if (!el) return;` chống hoàn toàn Null Reference Exception.
  - Đảm bảo backdrop click (`drawer-backdrop`) và phím Escape tự động đóng Drawer.

### 5. Modal Lộ trình V2 (Roadmap V2)
- **File:** `src/pages/index.astro`, `src/pages/noi_bo.astro`, `index.html`, `noi_bo.html`
- **Function:** `openRoadmapModal()`, `closeRoadmapModal()`, `toggleRoadmapModal()`
- **Nguyên nhân:** Nút mở lộ trình V2 gọi nhiều tên hàm khác nhau (`openRoadmapModal` vs `toggleRoadmapModal`).
- **Cách sửa:**
  - Đồng bộ định nghĩa cả `openRoadmapModal`, `closeRoadmapModal` và `toggleRoadmapModal` trên `window`.
  - Hỗ trợ đầy đủ: Nút mở → Nút X → Nút "Đóng cửa sổ" → Click vùng nền tối (backdrop) → Bấm ESC.

### 6. Modal Tin tức & Văn bản Pháp quy
- **File:** `src/pages/index.astro`, `index.html`
- **Function:** `openArticleByKey(key)`, `openArticleModal(key)`, `closeArticleModal()`, `openVanBanModal(id)`, `closeVanBanModal()`, `downloadBieuMau(code)`
- **Nguyên nhân:** Thiếu mapper cho các mã bài viết như `'chu-nhat-xanh'`, `'tuyen-truyen-pccc'`, `'chuyen-doi-so'`, `'an-ninh-trat-tu'`.
- **Cách sửa:**
  - Xây dựng từ điển dữ liệu bài viết và văn bản quy phạm chi tiết về TDP Lương Hậu.
  - Tích hợp liên kết tải văn bản/biểu mẫu thực tế đến Google Drive và cổng dịch vụ công Thừa Thiên Huế.

### 7. Xác thực Khu vực Nội bộ Chi bộ (`noi_bo.html` / `noi-bo.astro`)
- **File:** `src/pages/noi-bo.astro`, `noi_bo.html`
- **Function:** `verifyPartyMember(event)`, `authenticateSession(event)`, `logoutPartyMember()`, `viewInternalDoc(el)`, `closeDocModal()`, `toggleDashboard()`
- **Nguyên nhân:** Trước đây có nút bypass đăng nhập nhanh; cơ chế xác thực thiếu rate-limiting và có thể bị lỗi khi xử lý ngày sinh.
- **Cách sửa:**
  - Loại bỏ hoàn toàn các nút đăng nhập demo/bypass không an toàn.
  - Đồng bộ hàm xác thực chuẩn kiểm tra Họ tên và Ngày sinh theo Danh sách 22 Đảng viên Chi bộ (Quyết định 46-QĐ/ĐU).
  - Tích hợp cơ chế Rate Limiting phía client: Khóa thử nghiệm 5 phút nếu nhập sai 5 lần liên tiếp.
  - Hỗ trợ đầy đủ Dashboard nhiệm vụ 6 Rõ (KPI 87.0% Xuất sắc), Modal xem Văn kiện/Nghị quyết Chi bộ (Nghị quyết 09-NQ/CB, Tờ trình 11, v.v.).

### 8. Tích hợp Google Sheets API / Gviz Parser
- **File:** `assets/js/google-sheets-sync.js`
- **Function:** `syncDynamicContent()`, `parseGvizResponse(text)`
- **Nguyên nhân:** Nếu Google Sheets trả định dạng `google.visualization.Query.setResponse(...)` hoặc mạng chập chờn, parser regex không chuẩn có thể throw exception làm hỏng script trang.
- **Cách sửa:**
  - Bọc toàn bộ quá trình fetch & parse trong `try...catch` an toàn, regex bóc tách JSON chính xác.
  - Tự động fallback về dữ liệu tĩnh chất lượng cao khi không có kết nối internet hoặc API Google bị giới hạn.

---

## II. ĐÃ TEST

Bộ kiểm thử tự động toàn diện 45 bài test (`tests/test.cjs`) đã được chạy thành công 100%:

| Nhóm chức năng | Số bài test | Kết quả | Ghi chú |
| :--- | :---: | :---: | :--- |
| **Cổng công khai (PUBLIC)** | 23 | **PASS 23/23** | Menu, Tin tức, Văn bản, Biểu mẫu, Roadmap, Form phản ánh, Modal chi tiết |
| **Khu vực nội bộ (NOIBO)** | 22 | **PASS 22/22** | Xác thực Đảng viên, Khóa phiên, Rate Limiting 5 lần, Xem văn kiện, Dashboard 6 Rõ, Đăng xuất |
| **TỔNG CỘNG** | **45** | **PASS 45/45** | **Không có bất kỳ lỗi Runtime JS / Console Error** |

### Chi tiết các luồng đã kiểm tra thực tế:
1. **Menu Drawer & Submenus:** Mở drawer (`btn-open-menu`), đóng (`btn-close-menu`, `drawer-backdrop`, phím ESC). Toggle tất cả submenu (`sub-tt`, `sub-vbcb`, `sub-qlcb`, `sub-tlvk`, `sub-vb`) trơn tru.
2. **Form phản ánh kiến nghị:**
   - Validate rỗng & validate SĐT sai / Nội dung dưới 20 ký tự $\rightarrow$ Chặn submit & hiện thông báo lỗi tiếng Việt rõ ràng.
   - Nhập đúng $\rightarrow$ Tạo mã `PA-YYYYMMDD-HHMMSS`, lưu `localStorage`, hiện hộp thành công, thêm dòng vào bảng tiếp nhận.
3. **Modal Chi tiết phản ánh:** Bấm "Xem chi tiết" $\rightarrow$ Modal hiển thị đúng nội dung $\rightarrow$ Bấm nút X, Đóng, Backdrop $\rightarrow$ Modal đóng, khôi phục cuộn trang.
4. **Modal Tin tức, Văn bản, Roadmap V2:** Mở từng bài viết ('chu-nhat-xanh', 'tuyen-truyen-pccc', 'chuyen-doi-so') và văn bản chỉ đạo $\rightarrow$ Đóng mở chuẩn xác.
5. **Mobile Viewports:** Kiểm tra hiển thị responsive không vỡ layout ở các kích thước 360px, 390px, 412px, 768px, 1280px.
6. **Xác thực Nội bộ:**
   - Nhập sai thông tin $\rightarrow$ Báo lỗi và đếm số lần còn lại.
   - Sai quá 5 lần $\rightarrow$ Khóa 5 phút.
   - Nhập đúng (Bí thư Chi bộ Hồ Văn Mão - 15/08/1958) $\rightarrow$ Mở trang nội bộ, hiện thông tin Đảng viên, mở xem Nghị quyết 09-NQ/CB, mở Dashboard 6 Rõ.
   - Bấm Đăng xuất $\rightarrow$ Xóa session, khóa lại màn hình xác thực.

---

## III. TÌNH TRẠNG HIỆN TẠI & LƯU Ý BẢO MẬT

1. **Lỗi Console/JavaScript:** **0 LỖI**. Tất cả nút bấm, liên kết, form, modal hoạt động trơn tru.
2. **Giao diện & Dữ liệu:** Giữ nguyên 100% bản sắc thiết kế Cờ đỏ - Sao vàng đặc trưng của Tổ Dân Phố Lương Hậu và toàn bộ dữ liệu 22 Đảng viên, Ban điều hành TDP.
3. **Lưu ý Bảo mật Kiến trúc (Security Note):**
   - Hiện tại trang `noi_bo.html` chạy hoàn toàn bằng kiến trúc Static HTML/Client-side JS. Cơ chế xác thực sử dụng danh sách chuẩn hóa kết hợp mã hóa phiên `sessionStorage` và Rate Limiting phía trình duyệt.
   - *Khuyến nghị giai đoạn tiếp theo:* Khi triển khai V2 nâng cao với Cloud Server, nên chuyển endpoint xác thực này sang Vercel Serverless Function / Cloudflare Worker (hoặc API Node.js/Python) với JWT/HttpOnly Cookie để đạt chuẩn an toàn bảo mật cấp doanh nghiệp.
