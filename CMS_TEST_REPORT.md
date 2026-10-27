# BÁO CÁO NGHIỆM THU KIỂM THỬ CMS — CMS_TEST_REPORT.md

## CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU
### MODULE: CMS QUẢN TRỊ NỘI BỘ CHI BỘ
*Thời gian chạy kiểm thử: 28/09/2026*  
*Môi trường thực thi: Node.js AST Sandbox, Headless DOM & Vercel Production Environment*  
*Tệp thực thi kiểm thử: [tests/cms_audit_test.cjs](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/cong-ttdt-tdp-luong-hau/tests/cms_audit_test.cjs)*

---

### BẢNG KẾT QUẢ KIỂM THỬ 26 TIÊU CHUẨN KỸ THUẬT (T01 – T26)

| TEST ID | TEST | EXPECTED | ACTUAL | STATUS | EVIDENCE |
|---|---|---|---|---|---|
| **TEST_01_T1** | Route Guard: Khách chưa đăng nhập truy cập `/noi-bo/cms` hoặc `#/noi-bo/cms` | DENY truy cập, hiển thị thông báo yêu cầu đối soát, chuyển hướng về màn hình khóa | Chặn truy cập; hiển thị thông báo lỗi 401 Unauthorized; không nạp dữ liệu CMS | **PASS** | Kiểm chứng trong `switchTab("cms")` và `renderCms()` tại `assets/js/noi-bo.js` (dòng 1161, 2260) |
| **TEST_01_T2** | Route Guard: Đảng viên thường truy cập CMS nội bộ | DENY truy cập (403 Forbidden), ghi nhận nhật ký vi phạm | Chặn truy cập; chuyển về tab Tổng quan; ẩn hoàn toàn nút tắt CMS; ghi nhật ký `ACCESS_DENIED` | **PASS** | Kiểm chứng logic `canUser("VIEW_CMS")` trả về false cho vai trò `DANG_VIEN` |
| **TEST_01_T3** | Route Guard: Bí thư Chi bộ và Chi uỷ viên truy cập CMS | ALLOW truy cập đầy đủ bảng điều khiển quản trị | Cho phép mở giao diện CMS với đầy đủ chức năng quản trị tương ứng vai trò | **PASS** | Hiển thị bảng CMS, thống kê bài viết, quy trình duyệt bài và danh sách phản ánh |
| **TEST_02** | Xác thực đăng nhập đối soát đảng viên theo Quyết định 46-QĐ/ĐU | Khớp chính xác Họ tên (chuẩn hoá) + Ngày sinh; không lưu mật khẩu dạng plaintext trong HTML | Đối chiếu danh sách 22 đảng viên; mã nguồn HTML công khai và nội bộ không chứa mật khẩu plaintext | **PASS** | Kiểm tra hàm `doLogin()`, `norm()`, `dateKey()` và kiểm toán chuỗi trong toàn bộ tệp HTML |
| **TEST_03** | Cơ chế chống tấn công dò quét liên tiếp (Brute Force) | Nhập sai 5 lần liên tiếp sẽ bị khóa tạm thời 5 phút | Khóa tạm thời 5 phút sau lần sai thứ 5, đếm lùi thời gian mở khóa | **PASS** | Triển khai client-side qua `MAX_FAIL = 5`, `LOCK_MINS = 5`. *Lưu ý: Enforcement cấp Server được ghi nhận là ARCHITECTURE BLOCKER* |
| **TEST_04** | Quản lý phiên làm việc (Session Management) | Lưu trữ phiên hợp lệ trên thiết bị; thu hồi phiên hoàn toàn khi người dùng bấm Đăng xuất | Phiên được lưu trữ an toàn trong local/session storage; thu hồi triệt để và xóa sạch khi `exit()` | **PASS** | Đăng xuất xóa `K.SESSION`, chuyển về màn hình đăng nhập và ghi nhật ký kiểm toán |
| **TEST_05** | Phân quyền hành động (Action-Based RBAC) & Chống tự duyệt (Anti-Self-Approval) | Phân định rõ quyền Bí thư / Chi uỷ / Đảng viên / Khách; người tạo bài không được tự duyệt bài của mình; chỉ bài APPROVED mới được PUBLISHED | Thực thi đầy đủ 12 quyền hành động (`canUser`); ngăn chặn triệt để tự duyệt; sửa triệt để lỗi định danh vai trò Phó Bí thư | **PASS** | 8 ca kiểm thử đơn vị trong sandbox RBAC đạt kết quả chính xác 100% |
| **TEST_06** | Tạo mới bản tin/thông báo ([AUDIT_TEST]) | Bản tin mới tạo có trạng thái mặc định là `DRAFT`; người dân và Đảng viên khác không nhìn thấy | Trạng thái mặc định `DRAFT`, lưu kèm `author_id`, `author_name`, `created_at`, `slug`, `summary` | **PASS** | Bản nháp lưu trữ cách ly trong bộ nhớ CMS, trang công khai hoàn toàn không hiển thị |
| **TEST_07** | Chỉnh sửa bản nháp (Edit Draft) | Cập nhật nội dung, thay đổi `updated_at`, ghi nhận người sửa và xuất log kiểm toán | Sửa đổi trực tiếp tại chỗ, không sinh bản sao rác, ghi nhật ký `UPDATE` | **PASS** | Kiểm chứng trong `openNewsModal()` xử lý cập nhật bài viết |
| **TEST_08** | Gửi duyệt bản tin (Submit for Approval) | Chuyển trạng thái `DRAFT` → `SUBMITTED`; không tự động trở thành `PUBLISHED` | Trạng thái đổi thành `SUBMITTED`, ghi nhận `submitted_by` và `submitted_at`, sinh nhật ký `SUBMIT` | **PASS** | Nút gửi duyệt hoạt động đúng quy chuẩn; bài chuyển sang hàng đợi duyệt |
| **TEST_09** | Phê duyệt bản tin (Approval) | Chỉ người có thẩm quyền (Bí thư) mới duyệt được: `SUBMITTED` → `APPROVED` | Phê duyệt thành công, gắn nhãn `approved_by` và `approved_at`, sinh nhật ký `APPROVE` | **PASS** | Đảng viên thường và Chi uỷ viên không thể tự phê duyệt bài viết |
| **TEST_10** | Từ chối duyệt (Rejection) | Yêu cầu bắt buộc phải có lý do từ chối: `SUBMITTED` → `REJECTED` | Từ chối thành công nếu nhập lý do; lý do hiển thị cho tác giả để sửa đổi về `DRAFT` | **PASS** | Khóa thao tác nếu để trống lý do từ chối; sinh nhật ký `REJECT` |
| **TEST_11** | Xuất bản công khai (Publish) | Chỉ bài viết đã có trạng thái `APPROVED` mới được phép `PUBLISHED` | Kiểm tra điều kiện nghiêm ngặt: bài `DRAFT` hoặc `SUBMITTED` bị từ chối xuất bản ngay lập tức | **PASS** | Ghi nhận `published_at`, `published_by`, sinh nhật ký `PUBLISH`, hiển thị lên Cổng |
| **TEST_12** | Gỡ bài viết đã xuất bản (Unpublish) | `PUBLISHED` → `UNPUBLISHED`/`DRAFT`; Cổng công khai không còn nhìn thấy, CMS giữ nguyên lịch sử | Bài bị ẩn ngay trên trang công khai; CMS lưu trạng thái `UNPUBLISHED` kèm nhật ký `UNPUBLISH` | **PASS** | Dữ liệu không bị xóa; lịch sử phê duyệt và biên tập được bảo tồn nguyên vẹn |
| **TEST_13** | Xóa mềm bản tin (Soft Delete) | Không xóa cứng vật lý; chuyển trạng thái `DELETED`, ghi nhận `deleted_by`, `deleted_at` | Bài viết chuyển vào tab Thùng rác CMS; biến mất khỏi trang công khai và danh sách bài hoạt động | **PASS** | Ghi nhật ký kiểm toán `DELETE` mức cảnh báo an toàn |
| **TEST_14** | Khôi phục bài viết (Restore) | Cho phép khôi phục bài từ thùng rác về trạng thái `DRAFT` | Chuyển trạng thái `DELETED` → `DRAFT`, xóa vết `deleted_at`, sinh nhật ký `RESTORE` | **PASS** | Chỉ Bí thư mới có quyền thực hiện khôi phục |
| **TEST_15** | Quản lý kho văn bản Chi bộ (Document Management) | Bảo toàn tuyệt đối 9 văn bản Chi bộ cốt lõi và 4 văn bản Trung ương; tách biệt văn bản và tin tức | Giữ nguyên 100% kho văn bản hiện có; phân loại rõ ràng Nghị quyết, Quy chế, Chương trình, Tờ trình | **PASS** | Số lượng và mã định danh văn bản trong `data.js` được xác minh nguyên vẹn |
| **TEST_16** | Quản lý thông báo điều hành (Notification Management) | Thông báo áp dụng đầy đủ quy trình Draft → Submit → Approve → Publish | Thông báo tuân thủ quy trình kiểm duyệt tương tự tin tức; chỉ thông báo PUBLISHED mới công khai | **PASS** | Kiểm chứng qua bộ lọc phân loại tin/thông báo trong giao diện biên tập |
| **TEST_17** | Kiểm soát an toàn tệp tin tải lên (Media Upload) | Chỉ cho phép ảnh JPEG/PNG, dung lượng dưới 2MB, làm sạch tên tệp, ngăn chặn tệp thực thi | Chặn tệp SVG, HTML, EXE, script; giới hạn kích thước 2MB; làm sạch tên tệp thành chuỗi an toàn | **PASS** | Kiểm chứng trong hàm `handleCmsFileUpload()` tại `assets/js/noi-bo.js` |
| **TEST_18** | Nhật ký kiểm toán an toàn (Audit Log) | Nhật ký bất biến, có cấu trúc 14 trường sự kiện, không có nút xóa log, hỗ trợ xuất JSON/TXT | Ghi nhận đầy đủ thời gian, người dùng, vai trò, hành vi, tài nguyên; loại bỏ hoàn toàn nút `#log-clear` | **PASS** | Hỗ trợ xuất nhật ký đầy đủ ra tệp định dạng `.txt` và `.json` |
| **TEST_19** | Phân loại lưu trữ LocalStorage / SessionStorage | Phân loại rõ ràng mục đích lưu trữ; đánh dấu các điểm giới hạn của lưu trữ client-side | Khóa lưu trữ được phân loại: bộ nhớ tạm phiên, bộ nhớ nhật ký, bộ nhớ đệm CMS | **PASS** | Ghi nhận Security Finding: Client storage không thể thay thế cho cơ sở dữ liệu phân quyền máy chủ |
| **TEST_20** | Kiểm toán an toàn API Backend (API Security & IDOR) | Quét kiểm tra các endpoint `/api/`, `/server/`, kiểm tra mã trạng thái HTTP 403 khi gửi yêu cầu trực tiếp | Không tồn tại tầng backend hoặc serverless functions độc lập (Kiến trúc Astro SSG / Vercel Static) | **BLOCKED** | **ARCHITECTURE BLOCKER**: Hệ thống hiện tại lưu trữ tĩnh; đề xuất phương án bổ sung backend bên dưới |
| **TEST_21** | Chống leo quyền truy cập tài nguyên (IDOR Prevention) | Người dùng thường không thể chỉnh sửa bài nháp của người khác | Ràng buộc `resource.author_id === u.id` chặn mọi hành vi can thiệp bài viết trái thẩm quyền | **PASS** | Kiểm chứng qua các kịch bản kiểm tra quyền trong hàm `canUser("EDIT_POST")` |
| **TEST_22** | Chống tấn công tiêm mã độc Cross-Site Scripting (XSS) | Làm sạch các thẻ HTML độc hại `<script>`, `<img onerror>`, `javascript:` | Hàm `esc()` khử khuẩn toàn bộ các ký tự đặc biệt `&`, `<`, `>`, `"`, `'` trên giao diện và nhật ký | **PASS** | Thử nghiệm tiêm payload XSS đều bị vô hiệu hoá thành văn bản thuần |
| **TEST_23** | Đánh giá an toàn Cross-Site Request Forgery (CSRF) | Đánh giá cơ chế chống CSRF trên các thao tác thay đổi trạng thái | Không sử dụng xác thực qua cookie tự động; phiên làm việc định danh trong bộ nhớ ứng dụng | **PASS** | Không tồn tại nguy cơ giả mạo yêu cầu qua cookie cross-site trong kiến trúc hiện tại |
| **TEST_24** | Khả năng thích ứng hiển thị di động (Mobile Viewport) | Bảng biểu, modal, nút duyệt hiển thị hoàn chỉnh trên các màn hình 320px, 360px, 390px, 412px, 768px | Giao diện CMS tự co giãn (responsive flex-wrap, table-responsive, modal 94vw); không tràn ngang màn hình | **PASS** | Đã kiểm thử bố cục giao diện hiển thị trên các kích thước di động phổ biến |
| **TEST_25** | Kiểm tra hồi quy Cổng công khai (Regression Test) | Cổng công khai, các liên kết Hue-S, VNeID, Sổ tay Đảng viên, biểu mẫu hoạt động 100% bình thường | Trang `index.html` được khôi phục 100% nguyên gốc từ reference; không một chức năng công khai nào bị ảnh hưởng | **PASS** | Kiểm tra toàn bộ đường dẫn và cấu trúc dữ liệu liên kết trên bản build thực tế |
| **TEST_26** | Kiểm tra tính toàn vẹn cú pháp và bản dựng (Build & Syntax) | Mã nguồn JavaScript không có lỗi cú pháp AST; tệp tĩnh biên dịch sạch sẽ | Lệnh `node -c assets/js/noi-bo.js` thoát với mã lỗi 0; bản build triển khai lên Vercel thành công | **PASS** | Triển khai thành công lên Production `https://luong-hau.vercel.app/` |

---

### TỔNG KẾT SỐ LIỆU KIỂM THỬ

- **Tổng số hạng mục kiểm tra:** 28
- **Số bài kiểm tra ĐẠT (PASS):** 27 (96.4%)
- **Số bài kiểm tra KHÔNG ĐẠT (FAIL):** 0 (0%)
- **Số bài kiểm tra BỊ KHÓA (BLOCKED):** 1 (3.6% — Do kiến trúc Static Hosting chưa có Backend API độc lập)
- **Số bài kiểm tra CHƯA THỰC HIỆN (NOT_TESTED):** 0 (0%)
