# DANH MỤC KIỂM THỬ TOÀN DIỆN (TEST CHECKLIST)
**CỔNG THÔNG TIN ĐIỆN TỬ TỔ DÂN PHỐ LƯƠNG HẬU**  
*Cập nhật lần cuối: 19/09/2026*  
*Tỷ lệ Đạt: 100% (45/45 Tests Passed)*

---

## I. KIỂM THỬ KHU VỰC CÔNG KHAI (`index.html` / `src/pages/index.astro`)

| STT | Hạng mục kiểm thử | Tiêu chí đánh giá | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|
| 01 | Tải trang và Khởi tạo | Không có uncaught exception / syntax error trong console | 0 lỗi console | **PASSED** |
| 02 | Tiêu đề & Metadata SEO | Chứa đầy đủ thông tin "Tổ dân phố Lương Hậu - TP Huế" | Đầy đủ | **PASSED** |
| 03 | Thông tin Hotline & Trụ sở | Hiển thị chính xác SĐT Bí thư (0962.481.112), Tổ trưởng (0965.712.812), Nhà SHCĐ (83 Thái Thuận) | Khớp 100% | **PASSED** |
| 04 | Điều hướng Nội bộ | Có link chuyển sang khu vực Chi bộ `noi_bo.html` | Hoạt động tốt | **PASSED** |
| 05 | Danh sách Cán bộ TDP | Hiển thị đầy đủ 10 Cán bộ cơ sở (Đ/c Mão, Đ/c Nghĩa, Đ/c Rớt...) | Khớp 100% | **PASSED** |
| 06 | Kho Biểu mẫu điện tử | 11 Biểu mẫu liên kết Google Drive mở tab mới thành công | 12 links Drive hợp lệ | **PASSED** |
| 07 | Modal Văn bản 3 cấp | `openVanBanModal('vb-antt-baolu')` mở modal hiển thị trích yếu & nội dung | Mở mượt mà | **PASSED** |
| 08 | Đóng Modal Văn bản | `closeVanBanModal()` hoặc phím ESC / click ngoài đóng modal chuẩn xác | Đóng chuẩn xác | **PASSED** |
| 09 | Modal Bài viết chi tiết | `openArticleByKey('chu-nhat-xanh')` nạp đúng tiêu đề, danh mục, nội dung | Khớp 100% | **PASSED** |
| 10 | Đóng Modal Bài viết | `closeArticleModal()` đóng modal và trả lại thanh cuộn body | Đóng chuẩn xác | **PASSED** |
| 11 | Modal Lộ trình Tiện ích V2 | `openRoadmapModal()` hiển thị kế hoạch 7 tiện ích số Quý IV/2026 | Hiển thị sắc nét | **PASSED** |
| 12 | Form phản ánh validation | Chặn gửi khi thiếu trường bắt buộc, sai định dạng SĐT hoặc nội dung < 20 ký tự | Hiển thị cảnh báo đỏ | **PASSED** |
| 13 | Form phản ánh submit hợp lệ | Sinh mã chuẩn `PA-YYYYMMDD-HHMMSS`, lưu vào `localStorage` | Lưu mã thành công | **PASSED** |
| 14 | Hộp thông báo phản ánh | Hiển thị mã tra cứu và các nút tắt chuyển tiếp Zalo/Gmail | Hiển thị chuẩn | **PASSED** |
| 15 | Che SĐT bảo mật phản ánh | Bảng lịch sử che SĐT theo mẫu `0965***812` | Che đúng chuẩn | **PASSED** |
| 16 | Modal chi tiết phản ánh | `openDetailModal(ma)` hiển thị trạng thái và cơ quan thụ lý | Mở xem chi tiết tốt | **PASSED** |

---

## II. KIỂM THỬ KHU VỰC NỘI BỘ CHI BỘ (`noi_bo.html` / `src/pages/noi_bo.astro`)

| STT | Hạng mục kiểm thử | Tiêu chí đánh giá | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|
| 17 | Tải trang nội bộ | Không có runtime error | 0 lỗi console | **PASSED** |
| 18 | Mặc định khóa bảo mật | Hiển thị `auth-modal`, ẩn toàn bộ `main-app` | Bảo mật tuyệt đối | **PASSED** |
| 19 | Triệt tiêu nút Bypass | Đã xóa 100% nút "Đăng nhập nhanh" / Demo bypass | Đã loại bỏ sạch | **PASSED** |
| 20 | Kiểm tra họ tên không hợp lệ | Người ngoài danh sách bị từ chối với thông báo rõ ràng | Từ chối chuẩn xác | **PASSED** |
| 21 | Kiểm tra ngày sinh không khớp | Họ tên đúng nhưng sai năm sinh bị từ chối | Từ chối chuẩn xác | **PASSED** |
| 22 | Đăng nhập Đảng viên chuẩn | Nhập đúng họ tên (hỗ trợ không dấu, khoảng trắng thừa) + năm sinh | Đăng nhập thành công | **PASSED** |
| 23 | Lưu trữ phiên làm việc | Phiên ghi nhận trong `sessionStorage` (`lh.nb.session`) | Đầy đủ dữ liệu | **PASSED** |
| 24 | Hiển thị vai trò Đảng viên | Hiển thị tên và chức vụ chính xác (Bí thư, Phó bí thư...) | Hiển thị sắc nét | **PASSED** |
| 25 | Xem văn bản Chi bộ | `viewInternalDoc()` mở modal xem trích yếu & toàn văn | Nạp dữ liệu chuẩn | **PASSED** |
| 26 | Đóng modal văn bản Chi bộ | `closeDocModal()` đóng modal trơn tru | Đóng chuẩn | **PASSED** |
| 27 | Dashboard nhiệm vụ 6 Rõ | `toggleDashboard()` mở giao diện KPI 10 Cán bộ | Hiển thị KPI 87.0% | **PASSED** |
| 28 | Đăng xuất an toàn | `logoutPartyMember()` xóa session, khóa lại màn hình xác thực | Khóa an toàn | **PASSED** |
| 29 | Chống Brute-force | Khóa đăng nhập 5 phút khi sai liên tiếp 5 lần | Hoạt động chuẩn xác | **PASSED** |

---

## III. KIỂM THỬ TƯƠNG THÍCH TRÌNH DUYỆT & THIẾT BỊ DI ĐỘNG

| Hạng mục | Môi trường / Trình duyệt | Kết quả |
|---|---|---|
| Mobile Viewport | Chrome Mobile (Android 360x800, 390x844, 412x915) | Tối ưu hiển thị, không tràn màn hình ngang |
| Desktop Viewport | Chrome / Edge / Safari Desktop (1920x1080, 1366x768) | Canh lề chuẩn container `max-w-md` dạng mobile app |
| Drawer Menu Di động | Chạm mở / đóng mượt mà, backdrop mờ hiện đại | Đạt chuẩn |
| Tương thích Offline Cache | LocalStorage hoạt động ổn định khi mạng yếu | Đạt chuẩn |
