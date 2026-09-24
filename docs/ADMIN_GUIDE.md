# 📘 SỔ TAY HƯỚNG DẪN QUẢN TRỊ (ADMIN_GUIDE.MD)
## CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU

---

## 1. Đăng Nhập & Truy Cập Hệ Thống

1. **Cổng Đảng viên (`/dang-vien`):**
   - Nhập mã PIN bí mật: `2026` hoặc `1989`.
   - Hoặc đăng nhập bằng tài khoản: `bithu`, `totruong`, `chiuy`, `editor`, `admin`.
2. **Dashboard Bí thư (`/bi-thu`):**
   - Chỉ cho phép tài khoản có vai trò `BI_THU` (Đ/c Hồ Văn Mão) hoặc `ADMIN`.
3. **CMS Quản trị trung tâm (`/admin`):**
   - Dành cho các bộ phận nghiệp vụ cập nhật tin bài, biểu mẫu và xử lý phản ánh.

---

## 2. Quy Trình Soạn Thảo & Duyệt Bài Viết CMS

1. **Biên tập viên (EDITOR):**
   - Truy cập `/admin` &rarr; Mục **Tin Tức**.
   - Nhập tiêu đề, chọn 1 trong 7 danh mục, nhập tóm tắt và nội dung.
   - Bấm **"Gửi Bí Thư Duyệt (Pending)"**.
2. **Bí thư Chi bộ (BI_THU):**
   - Truy cập `/bi-thu` &rarr; Mục **Duyệt Bài Viết CMS**.
   - Xem nội dung bài viết chờ duyệt.
   - Bấm **"Phê Duyệt & Xuất Bản"** để công khai lên Cổng thông tin cho nhân dân, hoặc **"Từ Chối"** kèm lý do yêu cầu chỉnh sửa.

---

## 3. Điều Hành Sinh Hoạt Chi Bộ & Điểm Danh

1. Bí thư hoặc Chi ủy viên truy cập `/dang-vien` &rarr; Mục **Điểm Danh**.
2. Với mỗi đồng chí trong danh sách 22 Đảng viên, chọn trạng thái:
   - `CÓ MẶT`
   - `VẮNG CÓ LÝ DO`
   - `VẮNG KHÔNG LÝ DO`
3. Hệ thống sẽ tự động tính toán tỷ lệ % tham gia theo thời gian thực và hiển thị lên bảng điều khiển.

---

## 4. Xử Lý Phản Ánh Của Nhân Dân

1. Vào `/admin` &rarr; Mục **Phản Ánh Dân Cư**.
2. Xem các kiến nghị mới gửi từ công dân.
3. Chuyển trạng thái sang `ĐANG XỬ LÝ` khi đã cử cán bộ phụ trách kiểm tra hiện trường.
4. Bấm nút **"Trả Lời"**, nhập nội dung giải quyết để hiển thị minh bạch cho người dân tra cứu. Chuyển trạng thái sang `ĐÃ XỬ LÝ`.

---

## 5. Sao Lưu Dữ Liệu An Toàn

1. Vào `/admin` &rarr; Mục **Cài Đặt & Sao Lưu**.
2. Bấm nút **"Tải Về File Sao Lưu (.JSON)"** để lưu trữ cơ sở dữ liệu về máy tính định kỳ.
3. Khi cần khôi phục, bấm **"Khôi Phục Từ File JSON"** và chọn tệp đã lưu.
