# 🗄️ TÀI LIỆU CƠ SỞ DỮ LIỆU (DATABASE.MD)
## CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU

Hệ thống triển khai chuẩn hoá **17 bảng (Tables)** với đầy đủ các trường truy vết (Audit Fields): `created_at`, `updated_at`, `created_by`, `updated_by`.

---

## Danh Sách 17 Bảng Dữ Liệu

### 1. `users`
- Lưu thông tin tài khoản người dùng và cán bộ.
- Trường: `id`, `username`, `password_hash`, `salt`, `full_name`, `email`, `phone`, `role`, `status`, `created_at`, `updated_at`.

### 2. `roles`
- Định nghĩa các vai trò hệ thống: `PUBLIC`, `EDITOR`, `CAN_BO_TDP`, `CHI_UY`, `BI_THU`, `ADMIN`.
- Trường: `id`, `code`, `name`, `description`.

### 3. `user_roles`
- Bảng liên kết người dùng và quyền hạn.
- Trường: `user_id`, `role_id`, `assigned_at`, `assigned_by`.

### 4. `categories`
- 7 Danh mục tin tức chuẩn: Xây dựng Đảng, Chuyển đổi số, Hoạt động TDP, Phong trào, Khuyến học, An ninh trật tự, Văn hóa - Xã hội.
- Trường: `id`, `code`, `name`, `slug`, `sort_order`.

### 5. `news`
- Quản lý tin tức cơ sở với vòng đời duyệt bài nghiêm ngặt.
- Trường: `id`, `title`, `slug`, `category_id`, `category_name`, `summary`, `content`, `thumbnail`, `author`, `status` (`DRAFT`, `PENDING`, `APPROVED`, `PUBLISHED`, `ARCHIVED`), `is_featured`, `published_at`, `created_by`, `updated_by`, `created_at`, `updated_at`.

### 6. `notices`
- Thông báo điều hành, cảnh báo thiên tai, lịch tiêm chủng.
- Trường: `id`, `title`, `content`, `attachment_url`, `is_pinned`, `publish_date`, `expiry_date`, `status`, `created_by`, `created_at`, `updated_at`.

### 7. `documents`
- Kho 11 biểu mẫu điện tử và văn bản pháp luật 4 cấp.
- Trường: `id`, `code`, `title`, `category`, `issuer`, `issue_date`, `file_url`, `source_url`, `description`, `is_public`, `created_by`, `created_at`, `updated_at`.

### 8. `events`
- Lịch hoạt động cộng đồng, sinh hoạt Chi bộ, Ngày Chủ nhật xanh.
- Trường: `id`, `title`, `date`, `time`, `location`, `organizer`, `description`, `status`, `created_at`.

### 9. `feedback`
- Tiếp nhận và xử lý ý kiến, kiến nghị của công dân 24/7.
- Trường: `id`, `code`, `sender_name`, `sender_phone`, `address`, `content`, `status` (`CHỜ_XỬ_LÝ`, `ĐANG_XỬ_LÝ`, `ĐÃ_XỬ_LÝ`), `response`, `handled_by`, `created_at`, `updated_at`.

### 10. `meetings`
- Quản lý kỳ sinh hoạt Chi bộ theo tháng/năm.
- Trường: `id`, `month`, `year`, `title`, `date`, `agenda`, `content`, `documents`, `attendees_count`, `conclusion`, `resolution_id`, `status`, `created_by`, `created_at`, `updated_at`.

### 11. `attendance`
- Điểm danh đảng viên: `PRESENT` (Có mặt), `EXCUSED` (Vắng có lý do), `UNEXCUSED` (Vắng không lý do).
- Trường: `id`, `meeting_id`, `party_member_id`, `status`, `notes`, `updated_at`.

### 12. `party_members`
- Danh sách 22 Đảng viên Chi bộ Lương Hậu chuẩn hóa từ file Excel.
- Trường: `id`, `stt`, `full_name`, `dob`, `gender`, `join_date`, `official_date`, `party_card`, `phone`, `status`, `area`, `notes`, `created_at`, `updated_at`.

### 13. `resolutions`
- Nghị quyết Chi bộ ban hành theo tháng/kỳ.
- Trường: `id`, `code`, `title`, `date`, `content`, `key_tasks`, `assigned_to`, `deadline`, `status`, `created_by`, `created_at`, `updated_at`.

### 14. `tasks`
- Phân công nhiệm vụ mô hình "6 Rõ" cho 10 cán bộ chủ chốt.
- Trường: `id`, `title`, `content`, `assignee`, `assigned_date`, `deadline`, `priority` (`CAO`, `TRUNG_BÌNH`, `THẤP`), `status` (`CHƯA_LÀM`, `ĐANG_LÀM`, `HOÀN_THÀNH`, `QUÁ_HẠN`), `progress_percent`, `notes`, `file_url`, `created_by`, `created_at`, `updated_at`.

### 15. `attachments`
- Quản lý tệp đính kèm và tài nguyên Google Drive.
- Trường: `id`, `target_type`, `target_id`, `file_name`, `file_url`, `file_size`, `mime_type`, `uploaded_at`.

### 16. `audit_logs`
- Nhật ký hệ thống bất biến (Immutable), ngăn chặn xóa sửa trái phép.
- Trường: `id`, `timestamp`, `user_id`, `username`, `role`, `action`, `resource`, `details`, `ip`.

### 17. `settings`
- Cấu hình thông tin cơ sở, slogan, hotline, số liệu dân cư.
- Trường: `key`, `value`, `description`, `updated_at`, `updated_by`.
