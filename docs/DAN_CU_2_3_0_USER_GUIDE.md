# CẨM NANG HƯỚNG DẪN SỬ DỤNG – PHÂN HỆ QUẢN LÝ DÂN CƯ SỐ 2.3.0
**Đơn vị:** Tổ dân phố Lương Hậu, phường Hương Thủy, TP. Huế  
**Đối tượng sử dụng:** Bí thư Chi bộ, Tổ trưởng tổ dân phố, Cán bộ phụ trách  
**Phiên bản:** 2.3.0  

---

## 1. TRUY CẬP VÀO PHÂN HỆ

1. **Đăng nhập:** Truy cập địa chỉ điều hành nội bộ `admin.html` (hoặc thông qua liên kết `Quản Lý Dân Cư Số ↗` tại trang `bi-thu.html` và `noi-bo.html`).
2. **Chọn Menu:** Trên thanh điều hướng bên trái hoặc danh mục CMS, nhấn vào mục:
   > **Quản Lý Dân Cư (v2.3.0)** (Biểu tượng nhóm người 👥)
3. **Thanh 16 Tiểu Phân Hệ:** Hệ thống mở ra bảng điều khiển chuyên biệt với thanh chuyển tab gồm 16 chức năng từ **Tổng quan** đến **Cấu hình**.

---

## 2. HƯỚNG DẪN CHI TIẾT 16 CHỨC NĂNG NGHIỆP VỤ

### 2.1. Tổng Quan Dân Cư (Dashboard)
- Hiển thị tức thời 6 chỉ số trọng yếu: Tổng số hộ gia đình, Tổng số nhân khẩu, Số hộ chính sách, Số hộ nằm trong vùng ngập lụt, Tỷ lệ bao phủ BHYT, và Số hộ đã cập nhật tọa độ GPS.
- Biểu đồ phân tích độ tuổi (0-14, 15-59, 60+) và cơ cấu giới tính.

### 2.2. Quản Lý Hộ Gia Đình
- **Xem danh sách:** Xem 466 hộ gia đình với đầy đủ mã hộ, tên chủ hộ, địa chỉ tuyến đường, số lượng thành viên.
- **Thêm hộ mới:** Nhấn nút **"+ Thêm Hộ Mới"** -> Điền thông tin chủ hộ, địa chỉ chi tiết, nhóm đối tượng -> Nhấn **"Lưu hồ sơ"**.
- **Xem chi tiết / Lưu trữ:** Nhấn nút **"Xem"** trên từng dòng để kiểm tra toàn bộ danh sách thành viên trong gia đình. Nhấn **"Lưu trữ"** khi hộ dân chuyển đi nơi khác (không bị mất dữ liệu lịch sử).

### 2.3. Quản Lý Nhân Khẩu
- Tra cứu 1.943 nhân khẩu theo họ tên, mã hộ hoặc số định danh.
- **Tính tuổi tự động:** Hệ thống tự động tính tuổi dựa trên năm sinh so với năm hiện tại (ví dụ: sinh 1985 -> 41 tuổi).
- **Quyền xem CCCD:** Chỉ tài khoản có vai trò Quản trị viên (`ADMIN`) hoặc Bí thư (`BI_THU`) mới nhìn thấy đầy đủ 12 số CCCD; các vai trò khác sẽ thấy dạng `046******123` để bảo vệ quyền riêng tư của công dân.

### 2.4. Quản Lý Bảo Hiểm Y Tế (BHYT)
- Theo dõi danh sách nhân khẩu tham gia BHYT và hạn sử dụng thẻ.
- Huy hiệu màu cảnh báo trực quan:
  - 🟢 **Xanh lá:** Thẻ còn hạn sử dụng trên 30 ngày.
  - 🟡 **Vàng cam:** Thẻ sắp hết hạn trong vòng 30 ngày (cần nhắc nhở công dân gia hạn).
  - 🔴 **Đỏ:** Thẻ đã hết hạn.

### 2.5. Nhập Dữ Liệu Thông Minh (Smart Excel/CSV Import)
1. Kéo thả tệp tin `.xlsx`, `.xls` hoặc `.csv` vào khung tải lên.
2. Hệ thống tự động nhận diện các cột (Họ tên, Ngày sinh, Chủ hộ, v.v.).
3. Kiểm tra bản xem trước và thông báo số dòng hợp lệ/nghi ngờ.
4. Nhấn **"Xác nhận ghi dữ liệu"** để hoàn tất.

### 2.6. Cập Nhật Từ Google Sheets (1 Cú Nhấp Chuột)
- **Quy trình trực tiếp (No-code 1-Click):**
  1. Vào tab **"6. Google Sheets"**.
  2. Kiểm tra đường link Google Sheets của Tổ dân phố.
  3. Nhấn nút **"Đọc Dữ Liệu & Xem Trước Thay Đổi"**.
  4. Hệ thống tải về và đối chiếu tự động, hiển thị số dòng mới, số dòng cập nhật hoặc nghi trùng.
  5. Cán bộ kiểm tra bảng đối chiếu và nhấn **"Phê duyệt & Áp dụng cập nhật"**.
- **Quy trình dự phòng (Khi mất mạng hoặc lỗi quyền truy cập):**
  - Mở Google Sheets -> Vào menu *Tệp (File) -> Tải xuống (Download) -> Giá trị được phân tách bằng dấu phẩy (.csv)*.
  - Sang tab **"5. Nhập Excel"** và kéo tệp vừa tải vào.

### 2.7. Tiếp Nhận Nội Dung Zalo
- Khi nhận được tin nhắn báo cáo nhân khẩu từ nhóm Zalo Tổ dân phố:
  1. Sao chép đoạn văn bản Zalo.
  2. Dán vào ô nhập liệu tab **"7. Tiếp Nhận Zalo"**.
  3. Nhấn nút **"Phân tích & Tách dữ liệu"**.
  4. Trí tuệ nhận dạng tự động bóc tách Họ tên, Năm sinh, Số điện thoại, Địa chỉ và gợi ý vào bảng.
  5. Cán bộ đối chiếu và nhấn **"Thêm vào hệ thống"**.

### 2.8. Nhận Dạng OCR Cục Bộ (Ảnh / PDF)
- Tải lên ảnh chụp danh sách hoặc tệp PDF văn bản.
- Trình xử lý HTML5 Canvas cục bộ đọc cấu trúc văn bản tại máy tính của cán bộ (tuyệt đối không gửi ảnh ra ngoài máy chủ bên thứ ba).
- Cho phép chỉnh sửa trực tiếp các ô trước khi lưu.

### 2.9. Quản Lý Địa Chỉ Số & Tọa Độ GPS
- Xem thống kê các hộ đã có tọa độ WGS84 và các hộ cần khảo sát vị trí.
- Nhấn vào biểu tượng **"Google Maps"** để mở ứng dụng bản đồ chỉ đường đến tận nhà hộ dân.

### 2.10. Bộ Lọc & Tìm Kiếm Nâng Cao
- Lọc kết hợp nhiều tiêu chí: Tuyến đường, Tình trạng ngập lụt, Nhóm đối tượng chính sách, Tình trạng thẻ BHYT, Độ tuổi.

### 2.11. Trường Dữ Liệu Mở Rộng (Custom Fields)
- Cán bộ quản trị có thể tạo thêm các trường khảo sát theo đợt công tác (ví dụ: *Hộ kinh doanh cá thể*, *Gia đình có học sinh chuẩn bị vào lớp 1*, *Chăn nuôi gia súc*, v.v.).

### 2.12. Báo Cáo – Thống Kê (Xuất Excel & PDF)
- **Xuất Excel:** Nhấn nút xuất danh sách hộ hoặc nhân khẩu để nhận tệp `.csv/.xlsx` có khả năng phòng chống mã độc Macro/Formula injection.
- **In ấn PDF:** Nhấn **"In danh sách dân cư"** để mở trang in ấn có sẵn tiêu đề Tổ dân phố Lương Hậu theo chuẩn văn bản hành chính.

### 2.13. Sao Lưu & Phục Hồi Dữ Liệu
- **Sao lưu:** Nhấn nút **"Tạo bản sao lưu JSON"** để tải về máy tính tệp sao lưu có mã kiểm tra toàn vẹn.
- **Phục hồi:** Chọn tệp sao lưu -> Hệ thống kiểm tra cấu trúc -> Cán bộ xác nhận 2 bước trước khi khôi phục.

### 2.14. Phân Quyền Người Dùng (RBAC)
- Xem bảng ma trận phân quyền chi tiết của 5 vai trò để nắm rõ phạm vi trách nhiệm.

### 2.15. Nhật Ký Hoạt Động (Audit Trail)
- Theo dõi toàn bộ lịch sử ai đã thêm hộ nào, cập nhật lúc mấy giờ, xuất báo cáo vào thời điểm nào.

### 2.16. Cấu Hình Phân Hệ
- Cài đặt địa chỉ URL Google Sheets nguồn, cấu hình ngưỡng số ngày cảnh báo thẻ BHYT (mặc định 30 ngày), tọa độ ranh giới kiểm tra GPS của TDP Lương Hậu.
