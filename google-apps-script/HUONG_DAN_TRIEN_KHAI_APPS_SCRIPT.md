# HƯỚNG DẪN TRIỂN KHAI BACKEND GOOGLE APPS SCRIPT
## QUẢN TRỊ CMS & THƯ VIỆN HÌNH ẢNH — TDP LƯƠNG HẬU

Tài liệu này hướng dẫn chi tiết từng bước (bằng tiếng Việt, đơn giản) để kết nối CMS Khu nội bộ với **Google Drive** (lưu trữ ảnh) và **Google Sheets** (lưu trữ bài viết công khai) mà **không cần can thiệp mã nguồn server hay tốn chi phí**.

---

### BƯỚC 1: TẠO THƯ MỤC TRÊN GOOGLE DRIVE
1. Truy cập [Google Drive](https://drive.google.com/).
2. Bấm nút **Mới (+)** -> **Thư mục mới** -> Đặt tên: `HinhAnh_Portal_LuongHau`.
3. Bấm chuột phải vào thư mục vừa tạo -> Chọn **Chia sẻ** -> Tại mục *Quyền truy cập chung*, chọn **Bất kỳ ai có đường liên kết** (Vai trò: **Người xem**).
4. Nhìn lên thanh địa chỉ trình duyệt, sao chép chuỗi mã ID ở cuối URL:
   - *Ví dụ:* `https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ`
   - *ID thư mục là:* `1aBcDeFgHiJkLmNoPqRsTuVwXyZ` (Lưu lại chuỗi này để dùng ở Bước 3).

---

### BƯỚC 2: TẠO DỰ ÁN GOOGLE APPS SCRIPT
1. Truy cập [Google Apps Script](https://script.google.com/).
2. Bấm nút **Dự án mới (New project)**.
3. Đặt tên dự án ở góc trên bên trái: `CMS_Backend_LuongHau`.
4. Xóa hết nội dung mặc định trong tệp `Code.gs`, sau đó mở tệp [Code.gs](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/cong-ttdt-tdp-luong-hau/google-apps-script/Code.gs) vừa tạo trong thư mục dự án và sao chép toàn bộ mã dán vào.
5. Bấm biểu tượng **Lưu (Save - hình đĩa mềm)** hoặc nhấn `Ctrl + S`.

---

### BƯỚC 3: CÀI ĐẶT THUỘC TÍNH BẢO MẬT (SCRIPT PROPERTIES)
> [!IMPORTANT]
> Toàn bộ khóa bảo mật và ID hệ thống được cất giữ an toàn tại máy chủ Google, tuyệt đối không bị lộ ra ngoài frontend.

1. Tại thanh menu bên trái của Apps Script, bấm vào biểu tượng bánh răng **Cài đặt dự án (Project Settings)**.
2. Cuộn xuống mục **Thuộc tính tập lệnh (Script Properties)** -> Bấm **Thêm thuộc tính tập lệnh (Add script property)**.
3. Thêm 3 dòng cấu hình sau:
   - **Dòng 1:**
     - Thuộc tính (Property): `CMS_SECRET_KEY`
     - Giá trị (Value): Nhập mật khẩu quản trị tự đặt của đồng chí (Ví dụ: `LuongHau@2026SecureKey`).
   - **Dòng 2:**
     - Thuộc tính (Property): `DRIVE_FOLDER_ID`
     - Giá trị (Value): Dán mã ID thư mục Google Drive đã lấy ở Bước 1.
   - **Dòng 3:**
     - Thuộc tính (Property): `SHEET_ID`
     - Giá trị (Value): `1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ` (ID trang tính đang dùng hiện tại).
4. Bấm **Lưu thuộc tính tập lệnh (Save script properties)**.

---

### BƯỚC 4: TRIỂN KHAI THÀNH DỊCH VỤ WEB (WEB APP)
1. Ở góc trên bên phải màn hình Apps Script, bấm nút **Triển khai (Deploy)** màu xanh -> Chọn **Tùy chọn triển khai mới (New deployment)**.
2. Bấm biểu tượng bánh răng bên cạnh mục *Chọn loại (Select type)* -> Chọn **Ứng dụng web (Web app)**.
3. Điền các thông tin triển khai:
   - **Mô tả (Description):** `Bản phát hành CMS v1.0`
   - **Thực thi dưới dạng (Execute as):** Chọn **Tôi (Me)**.
   - **Ai có quyền truy cập (Who has access):** Chọn **Bất kỳ ai (Anyone)**.
4. Bấm **Triển khai (Deploy)**.
5. *Ủy quyền ứng dụng:* Google sẽ yêu cầu cấp quyền đọc/ghi Drive và Sheet -> Bấm **Xem lại quyền (Review permissions)** -> Chọn tài khoản Google của bạn -> Bấm **Nâng cao (Advanced)** -> Bấm **Đi tới CMS_Backend_LuongHau (không an toàn)** -> Bấm **Cho phép (Allow)**.
6. Sau khi triển khai xong, Google sẽ cung cấp **URL ứng dụng web (Web app URL)** dạng:
   `https://script.google.com/macros/s/AKfycbx.../exec`
7. Sao chép đường dẫn Web App URL này.

---

### BƯỚC 5: KẾT NỐI VÀO PHÂN HỆ CMS NỘI BỘ
1. Truy cập vào Cổng nội bộ: `https://luong-hau.vercel.app/noi-bo` (hoặc bản thử nghiệm cục bộ).
2. Đăng nhập bằng tài khoản Bí thư hoặc Chi ủy viên.
3. Chuyển sang thẻ **Quản trị CMS** -> Chọn mục **Cài đặt kết nối Đám mây (Cloud Sync)** hoặc biểu tượng bánh răng.
4. Dán **Web App URL** (lấy ở Bước 4) và nhập **CMS_SECRET_KEY** (đã đặt ở Bước 3).
5. Bấm **Kiểm tra kết nối & Lưu phiên**.
   - Khóa quản trị chỉ được lưu trong bộ nhớ phiên làm việc (`sessionStorage`) của trình duyệt cán bộ.
   - Mỗi khi đóng trình duyệt hoặc đăng xuất, khóa sẽ tự động được xóa sạch.
6. Từ thời điểm này:
   - Thư viện hình ảnh sẽ tự động nạp danh sách ảnh trực tiếp từ Google Drive.
   - Mọi ảnh tải lên được nén WebP và đẩy thẳng lên Google Drive.
   - Mọi bài viết xuất bản được đẩy thẳng vào Google Sheet và hiển thị cho người dân trên trang công khai tức thì.
