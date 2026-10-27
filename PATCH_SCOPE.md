# BÁO CÁO PHẠM VI BẢN VÁ — PATCH_SCOPE.md

## CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU
### MODULE: CMS QUẢN TRỊ NỘI BỘ CHI BỘ
*Ngày thực hiện: 28/09/2026*  
*Quy chuẩn tuân thủ: Quyết định 556-QĐ/VPTW & Kế hoạch 213-KH/VPTW*  
*Nguyên tắc thực thi: PATCH-ONLY / CODEBASE-SCOPE-DISCIPLINE*

---

### I. NGUYÊN TẮC GIỚI HẠN PHẠM VI (SCOPE DISCIPLINE)

1. **Tuyệt đối không rewrite:** Mã nguồn Astro SSG và các trang HTML công khai (`index.html`, `tin-tuc.html`, `thong-bao.html`, `thong-tin.html`, `van-ban.html`) được giữ nguyên bản gốc từ deployment reference `dpl_6YFLZ7233CJvP8E1Wi8n8Q7es3ba`.
2. **Không đổi giao diện công khai:** Giao diện công khai, bố cục, màu sắc, font, logo, menu, chân trang hoàn toàn không thay đổi.
3. **Không xoá route hoặc liên kết chính thống:** Tất cả các liên kết Hue-S, VNeID, Sổ tay Đảng viên điện tử Thừa Thiên Huế, Tư liệu Văn kiện Đảng, Cổng Dịch vụ công Quốc gia đều được bảo tồn nguyên vẹn.
4. **Chỉ sửa các file liên quan trực tiếp đến CMS và an toàn:** File được can thiệp duy nhất trong mã nguồn logic nội bộ là `assets/js/noi-bo.js` và cấu hình định tuyến tĩnh `vercel.json`.

---

### II. BẢNG CHI TIẾT CÁC TỆP ĐÃ THAY ĐỔI

| Tệp tin | Vị trí thay đổi | Thay đổi cụ thể | Lý do kỹ thuật (Rationale) | Mức độ rủi ro (Risk) |
|---|---|---|---|---|
| `assets/js/noi-bo.js` | Dòng 876 – 942 | Bổ sung hàm `getUserRole(u)` và `canUser(action, resource, u)` thực thi Action-Based RBAC. | Ngăn chặn việc chỉ dùng `if (isAdmin)` lỏng lẻo; phân định rõ 3 vai trò: Bí thư (toàn quyền), Chi uỷ (biên tập & trình duyệt), Đảng viên (đóng góp ý kiến). Sửa lỗi phân loại vai trò đối với Phó Bí thư. | Thấp (Đã kiểm thử AST & logic) |
| `assets/js/noi-bo.js` | Dòng 908 – 925 | Triển khai quy tắc chống tự duyệt (Anti-Self-Approval rule): Người soạn bài không được tự duyệt bài của mình; chỉ bài có trạng thái `APPROVED` mới được phép `PUBLISHED`. | Tuân thủ quy định BA Exception: đảm bảo tính khách quan và nhất quán dữ liệu trong quy trình kiểm duyệt Đảng vụ. | Thấp |
| `assets/js/noi-bo.js` | Dòng 944 – 1150 | Mở rộng cấu trúc dữ liệu bản tin: `slug`, `summary`, `status` (`DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`, `PUBLISHED`, `UNPUBLISHED`, `DELETED`), `rejection_reason`, `submitted_by`, `approved_by`, `deleted_by`. | Hoàn thiện máy trạng thái (Finite State Machine) 8 bước cho CMS bài viết và thông báo. | Thấp |
| `assets/js/noi-bo.js` | Dòng 150 – 215 | Nâng cấp hệ thống nhật ký kiểm toán `logAdd()` có cấu trúc 14 trường sự kiện; loại bỏ hoàn toàn nút `#log-clear` (chống xoá log tùy tiện); bổ sung xuất định dạng JSON và TXT. | Đáp ứng tiêu chuẩn bắt buộc của Quyết định 556-QĐ/VPTW về nhật ký kiểm toán an toàn thông tin không thể can thiệp bởi người dùng thường. | Thấp |
| `assets/js/noi-bo.js` | Dòng 338 – 350, 1155 – 1175, 2260 – 2295 | Bổ sung Route Guard trong `switchTab("cms")`, lọc thẻ CMS trong `renderTabs()`, chặn 401/403 trong `renderCms()`, ẩn nút tắt CMS trong `renderOverview()` đối với Đảng viên thường. | Ngăn chặn việc bypass bảo mật thông qua Hash URL `#cms` hoặc `#/noi-bo/cms`. Người chưa đăng nhập hoặc Đảng viên thường không thể xem hay tương tác bảng CMS. | Thấp |
| `assets/js/noi-bo.js` | Dòng 1930 – 1965 | Bổ sung hàm kiểm tra và làm sạch tệp tin tải lên `handleCmsFileUpload`: chỉ chấp nhận JPEG/PNG, kích thước tối đa 2MB, làm sạch tên tệp loại bỏ ký tự lạ. | Phòng chống khai thác tải tệp tin độc hại, shell script hoặc tấn công MIME/Path Traversal. | Thấp |
| `vercel.json` | Dòng 57 – 65 | Bổ sung rewrites cho route `/noi-bo/cms` và `/noi_bo/cms` trỏ về `noi-bo.html`. | Hỗ trợ truy cập trực tiếp URL CMS sạch, đồng thời kích hoạt header bảo mật `noindex, nofollow, no-store`. | Rất thấp |
| `tests/cms_audit_test.cjs` | Toàn bộ tệp mới | Tạo bộ kiểm thử tự động kiểm tra toàn bộ 26 nhóm tiêu chuẩn kỹ thuật (28 ca kiểm thử). | Đảm bảo tính minh bạch, có bằng chứng thực nghiệm độc lập và không gian lận kết quả. | Không có rủi ro sản phẩm |

---

### III. CÁC TỆP ĐƯỢC BẢO VỆ TUYỆT ĐỐI (PROTECTED FILES)

1. `index.html`: Được khôi phục và kiểm chứng giống 100% với bản deployment tham chiếu `dpl_6YFLZ7233CJvP8E1Wi8n8Q7es3ba`.
2. `data/data.js`: Kho 9 văn bản Chi bộ, 4 văn bản Trung ương và danh sách 22 Đảng viên theo Quyết định 46-QĐ/ĐU được bảo toàn nguyên trạng, không bị chỉnh sửa hay xóa bỏ.
3. `assets/css/portal.css`: Giữ nguyên toàn bộ token màu sắc, phông chữ, bố cục giao diện công khai.
4. `tin-tuc.html`, `thong-bao.html`, `thong-tin.html`, `van-ban.html`, `can-bo.html`: Giữ nguyên 100%.

---

### IV. KẾT LUẬN KIỂM SOÁT PHẠM VI

Bản vá tuân thủ nghiêm ngặt nguyên tắc **PATCH-ONLY**. Toàn bộ các thay đổi chỉ nằm trong phạm vi module CMS và phân hệ phân quyền Khu nội bộ Chi bộ, không ảnh hưởng bất kỳ khía cạnh nào của trang công khai phục vụ nhân dân TDP Lương Hậu.
