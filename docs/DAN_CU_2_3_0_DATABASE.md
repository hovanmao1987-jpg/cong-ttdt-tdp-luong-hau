# THIẾT KẾ CƠ SỞ DỮ LIỆU – PHÂN HỆ QUẢN LÝ DÂN CƯ SỐ 2.3.0
**Đơn vị sử dụng:** Tổ dân phố Lương Hậu, phường Hương Thủy, TP. Huế  
**Phiên bản CSDL:** v2.3.0  
**Cơ chế lưu trữ:** LocalStorage / IndexedDB / JSON Seed Sync  

---

## 1. MÔ HÌNH THỰC THỂ QUAN HỆ (ERD)

```mermaid
erDiagram
    HOUSEHOLDS ||--o{ RESIDENTS : "chứa (1..N)"
    HOUSEHOLDS ||--o{ BIENDONG : "phát sinh lịch sử"
    RESIDENTS ||--o| BHYT : "liên kết hồ sơ (1..1)"
    RESIDENTS ||--o{ BIENDONG : "ghi nhận biến động"
    IMPORT_BATCHES ||--o{ HOUSEHOLDS : "tạo ra / cập nhật"
    CUSTOM_FIELDS ||--o{ HOUSEHOLDS : "áp dụng thuộc tính"
    CUSTOM_FIELDS ||--o{ RESIDENTS : "áp dụng thuộc tính"

    HOUSEHOLDS {
        string id PK "Mã nội bộ UUID/H_xxx"
        string maHo "Mã hộ gia đình hiển thị (Hxxx)"
        string maHoNguon "Mã hộ gốc từ Excel/Sheets"
        string chuHo "Họ và tên chủ hộ"
        string diaChi "Địa chỉ chi tiết (Kiệt, Ngõ, Tuyến đường)"
        string toDanPho "Tổ dân phố (mặc định Lương Hậu)"
        string phuongXa "Phường Thủy Phương / TX Hương Thủy"
        string tinhThanh "Thành phố Huế"
        float lat "Vĩ độ GPS WGS84"
        float lng "Kinh độ GPS WGS84"
        string googleMapsUrl "Liên kết chỉ đường Google Maps"
        int soNhanKhau "Số lượng nhân khẩu thực tế"
        string nhomHo "Phân loại hộ (Chính sách, Hộ nghèo, v.v.)"
        string vungNgapLut "Tình trạng ngập lụt (Cao, Trung bình, Thấp, An toàn)"
        string trangThai "active | archived | pending"
        datetime ngayTao "Thời điểm khởi tạo"
        datetime ngayCapNhat "Thời điểm cập nhật mới nhất"
    }

    RESIDENTS {
        string id PK "Mã nội bộ nhân khẩu UUID/R_xxx"
        string maHo FK "Khóa ngoại liên kết Hộ gia đình"
        string hoTen "Họ và tên đầy đủ nhân khẩu"
        string quanHeChuHo "Quan hệ với chủ hộ (Chủ hộ, Vợ, Con, v.v.)"
        string gioiTinh "Nam | Nữ | Khác"
        string ngaySinh "Ngày sinh đầy đủ (DD/MM/YYYY) hoặc YYYY"
        int namSinh "Năm sinh số nguyên (tính tuổi tự động)"
        string cccd "Số định danh / CCCD (12 số - ĐƯỢC CHE MẶC ĐỊNH)"
        string soDienThoai "Số điện thoại liên lạc (ĐƯỢC CHE MẶC ĐỊNH)"
        string ngheNghiep "Nghề nghiệp / Nơi làm việc"
        string tinhTrangCuTru "Thường trú | Tạm trú | Lưu trú"
        string bhytStatus "Đã tham gia | Chưa tham gia | Sắp hết hạn"
        string ghiChu "Ghi chú nghiệp vụ"
        string trangThai "active | archived"
        datetime ngayCapNhat "Thời điểm cập nhật"
    }

    BHYT {
        string id PK "Mã hồ sơ BHYT"
        string residentId FK "Khóa ngoại liên kết Nhân khẩu"
        string maThe "Mã số thẻ BHYT (10/15 ký tự)"
        date ngayHieuLuc "Ngày thẻ bắt đầu có hiệu lực"
        date ngayHetHan "Ngày thẻ hết hạn"
        string noiKCB "Nơi đăng ký khám chữa bệnh ban đầu"
        string trangThai "con_han | sap_het_han | het_han | chua_xac_minh"
        int soNgayConLai "Số ngày hiệu lực còn lại"
    }

    BIENDONG {
        string id PK "Mã bản ghi biến động"
        string loaiBienDong "them_moi | chuyen_di | chuyen_den | tach_ho | doi_chu_ho"
        string maHo FK "Hộ liên quan"
        string residentId FK "Nhân khẩu liên quan"
        string lyDo "Lý do biến động chi tiết"
        string nguoiThucHien "Cán bộ ghi nhận"
        datetime thoiGian "Thời điểm phát sinh biến động"
    }

    IMPORT_BATCHES {
        string id PK "Mã đợt nhập (BATCH_xxx)"
        datetime thoiGian "Thời điểm thực hiện nhập dữ liệu"
        string nguoiThucHien "Cán bộ thực hiện"
        string nguon "google_sheets | excel_upload | zalo_nlp | ocr"
        int tongSoDong "Tổng số dòng quét được"
        int hopLe "Số dòng hợp lệ được ghi"
        int loi "Số dòng lỗi bị từ chối"
        string trangThai "committed | rollbacked"
        json chiTietBackup "Dữ liệu trước khi nhập (phục vụ Rollback)"
    }

    CUSTOM_FIELDS {
        string id PK "Mã trường tùy biến"
        string tenTruong "Tên trường hiển thị"
        string kieuDuLieu "text | number | date | select | boolean"
        string apDungCho "household | resident"
        json danhSachGiaTri "Các giá trị tùy chọn (nếu có)"
        boolean batBuoc "Bắt buộc nhập hay tùy chọn"
    }

    AUDIT_LOGS {
        string id PK "Mã nhật ký kiểm toán"
        datetime timestamp "Thời điểm phát sinh"
        string user "Tài khoản thực hiện"
        string action "CREATE | UPDATE | DELETE | IMPORT | EXPORT | ROLLBACK"
        string target "Hộ dân / Nhân khẩu / Phân hệ"
        string details "Chi tiết nội dung thay đổi"
        string ipAddress "Địa chỉ IP / UserAgent"
    }
```

---

## 2. QUY TẮC TOÀN VẸN VÀ RÀNG BUỘC NGHIỆP VỤ (BUSINESS CONSTRAINTS)

1. **Khóa chính và Khóa ngoại:**
   - Không sử dụng Số CCCD hay Họ tên chủ hộ làm khóa chính vì có thể trùng lặp họ tên hoặc chưa có số CCCD.
   - Mỗi hộ gia đình có duy nhất một `maHo` và một `chuHo`.
   - Một nhân khẩu chỉ được liên kết với một `maHo` hoạt động (`active`) tại một thời điểm.

2. **Quy tắc Lưu trữ Ngày sinh & Tính Tuổi:**
   - Trường `namSinh` được lưu trữ độc lập dạng số nguyên để hệ thống tự động tính tuổi thực tế theo thời gian thực: `Tuổi = Năm hiện tại - namSinh`.
   - Trường `ngaySinh` hỗ trợ định dạng đầy đủ `DD/MM/YYYY` hoặc chỉ ghi nhận `YYYY` khi người cao tuổi không rõ ngày tháng sinh (tuyệt đối không tự gán ngày 01/01 làm ngày sinh thật nếu công dân không khai báo).

3. **Cơ chế Soft Delete (Lưu trữ thay vì xóa cứng):**
   - Không cho phép thao tác xóa cứng (`DELETE`) trực tiếp đối với bản ghi Hộ dân hoặc Nhân khẩu đang có dữ liệu lịch sử.
   - Sử dụng cờ trạng thái `trangThai = 'archived'` để đánh dấu chuyển đi, chuyển khẩu hoặc lưu trữ hồ sơ, đảm bảo toàn vẹn dữ liệu thống kê qua các năm.

4. **Bảo mật và Che dấu dữ liệu (Data Masking):**
   - Trường `cccd` và `soDienThoai` được hệ thống tự động che khi trả về cho các vai trò không phải Quản trị viên tối cao hoặc Bí thư chi bộ.
   - Công thức che: `046******123` (giữ 3 số đầu, 3 số cuối, che 6 số giữa bằng `*`).

---

## 3. DỮ LIỆU CƠ SỞ ĐÃ NẠP (BASELINE DATA)
- **Tổng số hộ gia đình:** 466 hộ
- **Tổng số nhân khẩu:** 1.943 nhân khẩu
- **Hộ gia đình có nguy cơ ngập lụt:** 25 hộ
- **Hộ gia đình thuộc diện chính sách:** 12 hộ
- **Tập dữ liệu nguồn đối chiếu:** Bảng tính Google Sheets Tổ dân phố Lương Hậu (`1DgXp5p3If8xe8ZNCi1HTyQcgZ4HtfIao7aM0Kf_zvyQ`).
