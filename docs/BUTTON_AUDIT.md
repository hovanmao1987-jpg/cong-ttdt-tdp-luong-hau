# KIỂM TOÁN NÚT BẤM (BUTTON AUDIT)
## CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU
*Tiêu chuẩn: Zero Dead Buttons - Mọi nút bấm đều có chức năng*

---

### TỔNG KẾT KIỂM TOÁN NÚT BẤM:
- **Tổng số nút được rà soát:** 51 nút
- **Quy tắc phân loại:**
  - `WORKING`: Nút đang hoạt động chuẩn xác với handler / modal / submit.
  - `FIXED`: Nút đã được bổ sung handler và sự kiện trong đợt Master Rebuild.
  - `DISABLED_WITH_REASON`: Nút tạm ngưng với lý do giải trình rõ ràng (không để nút chết).

### CHI TIẾT DANH SÁCH NÚT BẤM THEO PHÂN HỆ:

| STT | Phân hệ | Tên nút / Nhãn hiển thị | Loại | Handler / Sự kiện | Phân loại |
|---|---|---|---|---|---|
| 1 | `index.html` | Đóng | `button` | `this.parentElement.style.display=` | **WORKING** |
| 2 | `index.html` | [Icon/No text] | `button` | `window.toggleMobileDrawer(true)` | **WORKING** |
| 3 | `index.html` | &times; | `button` | `window.toggleMobileDrawer(false)` | **WORKING** |
| 4 | `index.html` | Tìm Kiếm | `button` | `window.executeGlobalSearch()` | **WORKING** |
| 5 | `index.html` | Xóa | `button` | `window.clearGlobalSearch()` | **WORKING** |
| 6 | `index.html` | Gửi Phản Ánh Đến Ban Điều Hành TDP | `submit` | `type='submit'` | **WORKING** |
| 7 | `index.html` | &times; | `button` | `window.closeHuesModal()` | **WORKING** |
| 8 | `index.html` | Đóng Cửa Sổ | `button` | `window.closeHuesModal()` | **WORKING** |
| 9 | `index.html` | &times; | `button` | `window.closeNewsModal()` | **WORKING** |
| 10 | `index.html` | Đóng | `button` | `window.closeNewsModal()` | **WORKING** |
| 11 | `index.html` | &times; | `button` | `window.closeDocModal()` | **WORKING** |
| 12 | `index.html` | Đóng | `button` | `window.closeDocModal()` | **WORKING** |
| 13 | `index.html` | Tất cả | `button` | `window.filterNews(` | **WORKING** |
| 14 | `index.html` | ${c.name} | `button` | `window.filterNews(` | **WORKING** |
| 15 | `index.html` | Xem & Tải | `button` | `window.openDocModal(` | **WORKING** |
| 16 | `dang-vien.html` | Mở Phiên Làm Việc Chi Bộ | `submit` | `type='submit'` | **WORKING** |
| 17 | `dang-vien.html` | Đăng Nhập Tài Khoản | `submit` | `type='submit'` | **WORKING** |
| 18 | `dang-vien.html` | Khóa Phiên | `button` | `window.logoutParty()` | **WORKING** |
| 19 | `dang-vien.html` | Tổng Quan | `button` | `window.switchTab(` | **WORKING** |
| 20 | `dang-vien.html` | Sinh Hoạt Chi Bộ | `button` | `window.switchTab(` | **WORKING** |
| 21 | `dang-vien.html` | Điểm Danh | `button` | `window.switchTab(` | **WORKING** |
| 22 | `dang-vien.html` | Nghị Quyết | `button` | `window.switchTab(` | **WORKING** |
| 23 | `dang-vien.html` | Phân Công "6 Rõ" | `button` | `window.switchTab(` | **WORKING** |
| 24 | `dang-vien.html` | Văn Kiện & Tài Liệu | `button` | `window.switchTab(` | **WORKING** |
| 25 | `dang-vien.html` | Thông Báo Nội Bộ | `button` | `window.switchTab(` | **WORKING** |
| 26 | `bi-thu.html` | Đăng xuất | `button` | `window.logoutBithu()` | **WORKING** |
| 27 | `bi-thu.html` | Thêm Đảng Viên | `button` | `window.showAddMemberModal()` | **WORKING** |
| 28 | `bi-thu.html` | Ký Ban Hành Nghị Quyết | `submit` | `type='submit'` | **WORKING** |
| 29 | `bi-thu.html` | In / Xuất Báo Cáo Tổng Hợp | `button` | `window.printReport()` | **WORKING** |
| 30 | `bi-thu.html` | Có Mặt | `button` | `window.setMemberAtt(` | **WORKING** |
| 31 | `bi-thu.html` | Có Lý Do | `button` | `window.setMemberAtt(` | **WORKING** |
| 32 | `bi-thu.html` | Không Lý Do | `button` | `window.setMemberAtt(` | **WORKING** |
| 33 | `bi-thu.html` | Phê Duyệt & Xuất Bản | `button` | `window.approveNews(` | **WORKING** |
| 34 | `bi-thu.html` | Từ Chối | `button` | `window.rejectNews(` | **WORKING** |
| 35 | `bi-thu.html` | &times; | `button` | `window.closeAddMemberModal()` | **WORKING** |
| 36 | `bi-thu.html` | Hủy | `button` | `window.closeAddMemberModal()` | **WORKING** |
| 37 | `bi-thu.html` | Lưu Đảng Viên | `submit` | `type='submit'` | **WORKING** |
| 38 | `admin.html` | Đăng xuất | `button` | `window.logoutCms()` | **WORKING** |
| 39 | `admin.html` | Lưu Nháp | `button` | `window.saveNews(` | **WORKING** |
| 40 | `admin.html` | Gửi Bí Thư Duyệt (Pending) | `button` | `window.saveNews(` | **WORKING** |
| 41 | `admin.html` | Xuất Bản Trực Tiếp (Admin/Bí thư) | `button` | `window.saveNews(` | **WORKING** |
| 42 | `admin.html` | Đăng Thông Báo | `submit` | `type='submit'` | **WORKING** |
| 43 | `admin.html` | Thêm Vào Kho Văn Bản | `submit` | `type='submit'` | **WORKING** |
| 44 | `admin.html` | Thêm Lịch Hoạt Động | `submit` | `type='submit'` | **WORKING** |
| 45 | `admin.html` | Tải Về File Sao Lưu (.JSON) | `button` | `window.exportDatabaseJson()` | **WORKING** |
| 46 | `admin.html` | Khôi Phục Từ File JSON | `button` | `document.getElementById(` | **WORKING** |
| 47 | `admin.html` | Khởi Tạo Lại Về Seed Data | `button` | `window.resetDatabase()` | **WORKING** |
| 48 | `admin.html` | Xóa | `button` | `window.deleteItem(` | **WORKING** |
| 49 | `admin.html` | [Icon/No text] | `button` | `window.deleteItem(` | **WORKING** |
| 50 | `admin.html` | [Icon/No text] | `button` | `window.deleteItem(` | **WORKING** |
| 51 | `admin.html` | Trả Lời | `button` | `window.respondFeedback(` | **WORKING** |
