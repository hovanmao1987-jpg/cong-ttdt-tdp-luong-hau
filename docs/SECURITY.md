# 🛡️ BÁO CÁO AN TOÀN & BẢO MẬT (SECURITY.MD)
## CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU

---

## 1. Cơ Chế Xác Thực & Mã Hóa

- **Mật khẩu không lưu plain text:** Mật khẩu người dùng được băm kèm chuỗi muối (Salt) độc nhất (`hashPassword(password, salt)`), ngăn ngừa tấn công Rainbow Table.
- **Không để lộ secret ở frontend:** Mọi token xác thực và khóa bảo mật máy chủ không bị commit vào kho mã nguồn công khai.
- **Kiểm soát phiên làm việc an toàn (Session Guard):** Sử dụng `sessionStorage` mã hóa có thời hạn hết hạn (Timeout 4 giờ). Cán bộ có thể chủ động bấm nút "Khóa Phiên" ngay tại Header khi rời bàn làm việc.

---

## 2. Kiểm Soát Quyền Truy Cập (Role-Based Access Control - RBAC)

Hệ thống phân tách nghiêm ngặt 6 vai trò:
1. `PUBLIC`: Chỉ được xem nội dung công khai, gửi phản ánh và tải biểu mẫu.
2. `EDITOR`: Chỉ được soạn thảo tin tức ở trạng thái DRAFT hoặc PENDING gửi Bí thư duyệt.
3. `CAN_BO_TDP`: Quản lý thông báo, biểu mẫu và xử lý phản ánh dân cư.
4. `CHI_UY`: Tham gia sinh hoạt Chi bộ, xem văn kiện và hồ sơ giám sát.
5. `BI_THU`: Toàn quyền điều hành Chi bộ, phê duyệt xuất bản bài viết CMS, ban hành nghị quyết và phân công 6 rõ.
6. `ADMIN`: Quản trị kỹ thuật, phân quyền người dùng và kiểm tra nhật ký Audit Logs.

> [!IMPORTANT]
> **Kiểm tra quyền ở cấp logic xử lý:** Việc phân quyền không chỉ ẩn nút bằng CSS mà được chặn trực tiếp tại các hàm thực thi (`auth.can()`, `auth.requireRole()`).

---

## 3. Tính Bất Biến Của Nhật Ký (Audit Log Immutability)

- Mọi hành động nhạy cảm (`LOGIN`, `LOGOUT`, `CREATE`, `UPDATE`, `DELETE`, `APPROVE`, `PUBLISH`, `ROLE_CHANGE`) đều tự động sinh bản ghi trong bảng `audit_logs`.
- Giao diện người dùng và API không cung cấp chức năng xoá hay sửa đổi bản ghi Audit Logs.
