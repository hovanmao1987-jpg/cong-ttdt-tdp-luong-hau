# BÁO CÁO AUDIT CMS TRƯỚC KHI VÁ (AUDIT_BEFORE_PATCH.md)
**CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU**  
**Module:** CMS Quản trị Nội bộ Chi bộ  
**Thời gian thực hiện:** 28/09/2026  
**Chế độ thực thi:** PATCH-ONLY / CODEBASE-SCOPE-DISCIPLINE  

---

## 1. THÔNG TIN KIẾN TRÚC HIỆN TẠI (SYSTEM DISCOVERY)

- **Framework:** Astro SSG 5.0.0 kết hợp Static Web (HTML5/CSS3/Vanilla JS).
- **Hạ tầng triển khai (Hosting/Deployment):** Vercel Static Hosting (Production alias: `luong-hau.vercel.app`).
- **Entry Points:**
  - Cổng công khai: `index.html` (Bảo toàn 100% từ deployment gốc `dpl_6YFLZ7233CJvP8E1Wi8n8Q7es3ba`).
  - Khu vực nội bộ Chi bộ: `noi-bo.html`, `noi_bo.html`, thư mục `noi-bo/index.html`.
- **Định tuyến (Routing):**
  - Route `/noi-bo` và `/noi_bo`: Được phục vụ qua Vercel static rewrites / cleanUrls.
  - Route CMS nội bộ: Hiện được điều hướng qua frontend hash `#/noi-bo/cms`. Chưa có route cấp máy chủ độc lập `/noi-bo/cms`.
- **Cơ chế xác thực (Authentication) hiện tại:**
  - Thực hiện 100% phía Client trong `assets/js/noi-bo.js`.
  - Đối soát Họ tên + Ngày tháng năm sinh (dd/mm/yyyy) dựa trên danh sách đảng viên (`window.LH.ROSTER` trong `data/data.js`).
  - Quản lý phiên: Lưu `lh.nb.session` trong `localStorage` và `sessionStorage`.
  - Giới hạn brute-force: Lưu số lần thất bại vào `localStorage` (khóa 5 phút khi sai 5 lần).
- **Cơ chế phân quyền (Authorization) hiện tại:**
  - Client-side checks dựa trên thuộc tính `user.chucVu` (Bí thư, Phó Bí thư, Chi uỷ viên).
  - Chưa phân tách quyền theo từng hành động cụ thể (Action-based Authorization).
  - Đảng viên thường sau khi đăng nhập vẫn thấy nút "Quản trị CMS" và có thể thao tác.
- **Lưu trữ & Cơ sở dữ liệu (Storage/Database):**
  - Hiện tại: `localStorage` của trình duyệt (`lh.cms.news`, `lh.cms.docs`, `lh.cms.feedback`, `lh.cms.events`, `lh.cms.tasks_override`, `lh.nb.audit`).
  - Dữ liệu ban đầu: Sử dụng hạt giống dữ liệu tĩnh (Seeds) dựa trên tài liệu thật của Chi bộ (Quyết định 1229/QĐ-UBND, Kế hoạch PCTT 2026, Quyết định 46-QĐ/ĐU).

---

## 2. PHÁT HIỆN LỖI & PHÂN LOẠI CHI TIẾT (FINDINGS & CLASSIFICATION)

### [CRITICAL] ARCHITECTURE BLOCKER: CHƯA CÓ BACKEND VÀ DATABASE MÁY CHỦ THỰC TẾ
- **Hiện trạng:** Toàn bộ hệ thống hiện tại là Web tĩnh (Static Web) chạy trên Vercel. Không có API backend (`/api/*`), không có database serverless (PostgreSQL, Supabase, Firebase Firestore hay MongoDB).
- **Rủi ro:** Dữ liệu CMS lưu trong `localStorage` chỉ tồn tại cục bộ trên trình duyệt/thiết bị của người thao tác; không tự động đồng bộ sang thiết bị của đồng chí khác nếu không xuất/nhập tệp JSON; không thể bảo vệ xác thực/phân quyền tuyệt đối ở tầng server.
- **Đề xuất giải pháp kiến trúc tối thiểu tương thích:**
  - **Giai đoạn hiện tại (Patch an toàn):** Triển khai toàn bộ State Machine quy trình duyệt, phân quyền vai trò (RBAC) nghiêm ngặt, chống XSS, ghi nhật ký kiểm toán không thể xóa/sửa trên Client.
  - **Giai đoạn tiếp theo (Serverless Backend):** Tích hợp Vercel Serverless Functions (`/api/cms/*`) kết hợp cơ sở dữ liệu Vercel Postgres / Supabase / Neon DB.

### [HIGH] BẢO MẬT ĐỊNH TUYẾN & PHÂN QUYỀN TRUY CẬP CMS
- **Lỗi:** Route CMS nằm sau hash (`#/noi-bo/cms`). Khi một đảng viên không giữ chức vụ cấp ủy đăng nhập, giao diện vẫn cho phép bấm vào tab CMS và thao tác thêm/xóa.
- **Kỳ vọng:** Phải phân quyền chặt chẽ:
  - Khách chưa đăng nhập: CẤM (DENY) hoàn toàn.
  - Đảng viên thường: Chỉ được xem hoặc tạo bản nháp/ý kiến đề xuất, CẤM duyệt, CẤM xuất bản, CẤM xóa.
  - Chi ủy / Ban cán sự: Được tạo nháp, sửa, gửi duyệt, quản lý ý kiến nhân dân.
  - Bí thư Chi bộ: Toàn quyền duyệt (Approve), từ chối (Reject kèm lý do), xuất bản (Publish), gỡ bài (Unpublish), xóa mềm (Soft Delete) và khôi phục (Restore).

### [HIGH] THIẾU QUY TRÌNH DUYỆT & XUẤT BẢN ĐA CẤP (WORKFLOW)
- **Lỗi:** Bài đăng tin tức và văn bản hiện tại thêm vào là hiển thị ngay, không qua các trạng thái chuẩn:
  `DRAFT → SUBMITTED → APPROVED / REJECTED → PUBLISHED → UNPUBLISHED → DELETED → RESTORED`.
- **Lỗi tự duyệt:** Người tạo có thể tự động biến bài viết thành PUBLISHED mà không cần cấp có thẩm quyền phê duyệt.
- **Lỗi xóa cứng:** Khi bấm Xóa, hệ thống xóa thẳng khỏi mảng (`splice`), không có cơ chế Xóa mềm (`deleted_at`, `deleted_by`) và Khôi phục bài viết.

### [MEDIUM] NHẬT KÝ KIỂM TOÁN (AUDIT LOG) CÒN NÚT "XOÁ NHẬT KÝ CỤC BỘ"
- **Lỗi:** Trong giao diện nhật ký có nút `Xoá nhật ký cục bộ`, cho phép người dùng xóa sạch dấu vết thao tác.
- **Kỳ vọng:** Nhật ký kiểm toán phải là Read-Only đối với người dùng thông thường, ghi nhận đầy đủ: `timestamp`, `user_id`, `user_name`, `role`, `action`, `resource_type`, `resource_id`, `summary`. Không cho phép xóa tùy tiện.

### [MEDIUM] CHƯA CHỐNG XSS TRIỆT ĐỂ TRÊN CÁC TRƯỜNG DỮ LIỆU CMS
- **Lỗi:** Một số trường thông tin nhập vào (Tiêu đề, trích yếu, nội dung) nếu chứa ký tự đặc biệt (`<script>`, `<img onerror>`) có nguy cơ gây HTML/JS injection khi render.
- **Kỳ vọng:** Áp dụng hàm sanitize/escape chuẩn toàn diện trước khi lưu và hiển thị.

---

## 3. DANH SÁCH FILE CẦN VÁ (PATCH TARGETS)

1. `assets/js/noi-bo.js`:
   - Nâng cấp State Machine CMS với đầy đủ 7 trạng thái vòng đời.
   - Bổ sung Action-Based Authorization (VIEW_CMS, CREATE_POST, EDIT_POST, SUBMIT_POST, APPROVE_POST, REJECT_POST, PUBLISH_POST, UNPUBLISH_POST, DELETE_POST, RESTORE_POST).
   - Ngăn chặn người tạo tự duyệt bài (trừ Bí thư).
   - Bổ sung tính năng Xóa mềm và Khôi phục bài viết.
   - Vô hiệu hóa tính năng xóa nhật ký kiểm toán, mở rộng log chuẩn 14 action types.
   - Triển khai XSS sanitizer toàn diện.
2. `noi-bo.html` & `noi_bo.html` & `noi-bo/index.html` & `noi_bo/index.html`:
   - Đảm bảo cấu trúc giao diện tương thích với bộ phân quyền mới và không làm vỡ layout.
3. `dist/`: Đồng bộ sau khi hoàn tất kiểm thử.

---

**Xác nhận:** Đã hoàn thành đánh giá toàn diện trước khi can thiệp mã nguồn.
