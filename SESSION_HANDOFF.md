# BIÊN BẢN BÀN GIAO PHIÊN LÀM VIỆC — SESSION_HANDOFF.md

## CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU
### MODULE: CMS QUẢN TRỊ NỘI BỘ CHI BỘ
*Thời gian lập biên bản: 28/09/2026*  
*Người thực hiện: Antigravity Agentic Pair Programmer*  
*Dự án Vercel hoạt động: `luong-hau` (Scope: `hovanmao1987-7509s-projects`)*  
*Tên miền chính thức: [https://luong-hau.vercel.app/](https://luong-hau.vercel.app/)*

---

### I. TRẠNG THÁI HỆ THỐNG TRƯỚC KHI AUDIT

1. **Kiến trúc:** Website là bản Astro SSG xuất ra tệp HTML tĩnh (Static Export) chạy trên hạ tầng Vercel Static. Không có tầng cơ sở dữ liệu quan hệ (PostgreSQL/MySQL) và không có server-side API (`/api/` rỗng).
2. **Khu nội bộ:** Quản lý truy cập bằng cơ chế đối soát Họ tên + Ngày tháng năm sinh theo danh sách 22 Đảng viên kèm Quyết định 46-QĐ/ĐU. Dữ liệu đối soát nạp từ `data/data.js`.
3. **Phân hệ CMS cũ:**
   - Hoạt động chủ yếu thông qua giao diện với các thao tác lưu dữ liệu demo trong `localStorage`.
   - Phân quyền chỉ dựa trên kiểm tra chức danh chung, chưa có hệ thống phân quyền theo từng hành động cụ thể (Action-Based RBAC).
   - Quy trình xuất bản chưa đầy đủ: bài viết có thể đi thẳng từ soạn thảo sang xuất bản mà không qua bước phê duyệt chính thức.
   - Chưa có quy định chống tự duyệt (Anti-Self-Approval): người tạo bài có thể tự phê duyệt bài của chính mình.
   - Nhật ký kiểm toán có nút "Xoá nhật ký", cho phép người dùng tùy ý xóa vết truy cập trên trình duyệt.
   - URL `/noi-bo/cms` chưa có rewrite định tuyến tĩnh sạch trên Vercel.

---

### II. CÁC LỖI VÀ LỖ HỔNG ĐÃ PHÁT HIỆN QUA AUDIT

1. **Lỗ hổng phân quyền (RBAC Inconsistency):**
   - Chức vụ "Phó Bí thư Chi bộ" bị thuật toán cũ nhận diện nhầm thành "Bí thư" do chuỗi tìm kiếm `"bí thư chi bộ"` trùng một phần với `"phó bí thư chi bộ"`.
   - Phân quyền cho phép Bí thư bỏ qua kiểm tra trạng thái bài viết (cho phép xuất bản bài đang ở trạng thái `DRAFT` mà chưa qua `APPROVED`).
2. **Lỗ hổng Route Guard:**
   - Việc chuyển tab `#cms` hoặc truy cập trực tiếp hash URL chưa có lớp phòng vệ kiểm tra quyền nghiêm ngặt; người chưa đăng nhập hoặc Đảng viên thường có thể mở được vùng hiển thị của CMS nếu can thiệp vào lớp CSS.
3. **Lỗ hổng tính toàn vẹn nhật ký (Audit Tampering):**
   - Nhật ký có nút `#log-clear` cho phép xoá toàn bộ lịch sử đối soát và thao tác quản trị.
4. **Thiếu sót máy trạng thái xuất bản (Workflow State Machine):**
   - Thiếu trạng thái `SUBMITTED`, `REJECTED`, `UNPUBLISHED`.
   - Khi từ chối duyệt không bắt buộc nhập lý do từ chối.
5. **An toàn tệp tải lên (Media Upload Security):**
   - Trình xử lý tệp chưa kiểm tra định dạng MIME nghiêm ngặt, chưa giới hạn dung lượng và chưa làm sạch tên tệp để chống tấn công Path Traversal.

---

### III. CÁC LỖI ĐÃ ĐƯỢC VÁ THÀNH CÔNG (PATCHED)

1. **Chuẩn hóa Action-Based RBAC (`canUser`):**
   - Tách biệt rõ 3 nhóm vai trò: Bí thư (Toàn quyền), Chi uỷ (Biên tập, Hiệu đính, Gửi duyệt), Đảng viên (Xem & Đóng góp ý kiến).
   - Đã sửa lỗi nhận diện vai trò: Phó Bí thư được phân đúng vào nhóm `CHI_UY`.
   - Áp dụng nguyên tắc **Anti-Self-Approval**: Tác giả bài viết không được tự phê duyệt bài của chính mình (chỉ Bí thư mới có quyền phê duyệt bài gửi từ Chi uỷ hoặc Đảng viên).
   - Khóa chặt điều kiện xuất bản: Duy nhất bài viết có trạng thái `APPROVED` mới được phép chuyển sang `PUBLISHED`.
2. **Bảo vệ tuyến đường CMS (Route Guards):**
   - Thêm lớp phòng vệ tại `switchTab("cms")`, `renderCms()`, `renderOverview()`, và `renderTabs()`.
   - Người chưa đăng nhập: Bị từ chối (401), yêu cầu đối soát.
   - Đảng viên thường: Bị từ chối (403), ẩn nút quản trị CMS, ghi nhật ký kiểm toán `ACCESS_DENIED`.
3. **Bất biến hoá Nhật ký kiểm toán (Tamper-Proof Audit Log):**
   - Loại bỏ hoàn toàn nút `#log-clear`.
   - Chuẩn hóa định dạng nhật ký 14 trường sự kiện theo tiêu chuẩn Quyết định 556-QĐ/VPTW.
   - Bổ sung chức năng xuất nhật ký kiểm toán định dạng `.txt` và `.json` phục vụ lưu trữ nghiệp vụ.
4. **Quy trình biên tập 8 trạng thái hoàn chỉnh:**
   - `DRAFT` → `SUBMITTED` → `APPROVED` / `REJECTED` (bắt buộc lý do) → `PUBLISHED` → `UNPUBLISHED` → `DELETED` (xóa mềm) → `RESTORED` (khôi phục về Nháp).
5. **Vệ sinh dữ liệu và tải tệp:**
   - Giới hạn tải ảnh: Chỉ JPEG/PNG, tối đa 2MB, làm sạch tên tệp loại trừ ký tự đặc biệt.
   - Khử khuẩn XSS toàn bộ văn bản đầu vào thông qua hàm `esc()`.
6. **Định tuyến Vercel:**
   - Bổ sung rewrite trong `vercel.json` cho `/noi-bo/cms` và `/noi_bo/cms`.

---

### IV. GIỚI HẠN KIẾN TRÚC & BLOCKER CẦN BÁO CÁO

> [!WARNING]
> **ARCHITECTURE BLOCKER: HẠ TẦNG STATIC CHƯA CÓ DATABASE MÁY CHỦ**
> - **Hiện trạng:** Hệ thống hiện tại vận hành theo mô hình Astro Static Site Generation trên hạ tầng Vercel Static Hosting.
> - **Hạn chế:** Các trạng thái CMS, phiên làm việc và nhật ký kiểm toán đang được duy trì trong bộ nhớ cục bộ (`localStorage`/`sessionStorage`) của trình duyệt trên từng thiết bị.
> - **Hậu quả:** 
>   1. Hai đồng chí Chi uỷ viên ở hai máy tính khác nhau chưa thể tự động đồng bộ bài viết tức thời qua đám mây nếu không xuất/nhập tệp backup.
>   2. Cơ chế khóa Brute-force 5 lần sai hiện chỉ bảo vệ trên trình duyệt cục bộ, chưa thể ngăn chặn kẻ tấn công xóa bộ nhớ trình duyệt để thử lại từ đầu.
>   3. Đánh giá kiểm toán mục **TEST 20 (API Security)** bắt buộc phải ghi nhận trạng thái **BLOCKED**.

#### Đề xuất kiến trúc tối thiểu tương thích cho giai đoạn tiếp theo:
Để đạt chuẩn **PRODUCTION READY** cấp độ doanh nghiệp/chính quyền số, kiến trúc cần bổ sung tầng lưu trữ phân quyền máy chủ tối thiểu:
- Tận dụng **Vercel Serverless Functions** (`/api/cms/posts`, `/api/cms/audit`, `/api/auth/verify`).
- Kết nối cơ sở dữ liệu nhẹ: **Vercel Postgres**, **Supabase**, hoặc **Cloudflare D1**.
- Cơ chế JWT Cookie HttpOnly có chữ ký số để bảo vệ phiên làm việc và thực thi Brute-force chống quét tự động cấp địa chỉ IP.

---

### V. DANH SÁCH TỆP TIN ĐÃ THAY ĐỔI

1. `assets/js/noi-bo.js` (Lõi xử lý CMS, RBAC, State Machine, Audit Log, Route Guards, File Sanitizer).
2. `vercel.json` (Cấu hình rewrites cho route CMS).
3. `tests/cms_audit_test.cjs` (Bộ kiểm thử tự động 28 ca nghiệm thu).
4. `AUDIT_BEFORE_PATCH.md` (Báo cáo thẩm định trước khi vá).
5. `PATCH_SCOPE.md` (Báo cáo phạm vi thay đổi).
6. `CMS_TEST_REPORT.md` (Báo cáo nghiệm thu kiểm thử chi tiết).
7. `SESSION_HANDOFF.md` (Biên bản bàn giao phiên này).

---

### VI. BƯỚC TIẾP THEO CHO PHIÊN LÀM VIỆC KẾ TIẾP

1. **Giữ nguyên trạng thái:** Không thay đổi các hàm RBAC và máy trạng thái đã đạt chuẩn trong `assets/js/noi-bo.js`.
2. **Nâng cấp Backend (nếu người dùng yêu cầu):**
   - Khởi tạo thư mục `api/` trên Vercel.
   - Chuyển các hàm `saveCmsNews()`, `saveCmsCustomDocs()`, `logAdd()` từ lưu `localStorage` sang gọi `fetch('/api/...')`.
3. **Kiểm thử hồi quy liên tục:**
   - Mỗi lần chỉnh sửa, chạy ngay lệnh `node tests/cms_audit_test.cjs` để đảm bảo 27 ca kiểm thử cốt lõi luôn đạt trạng thái PASS.
   - Đảm bảo tệp `index.html` công khai luôn khớp hoàn toàn với bản chuẩn reference.
