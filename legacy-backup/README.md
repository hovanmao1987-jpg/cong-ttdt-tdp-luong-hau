# CỔNG THÔNG TIN SỐ LƯƠNG HẬU

Cổng Thông tin Số Tổ dân phố Lương Hậu (Phường Hương Thủy, TP. Huế) là nền tảng số phục vụ hai phân hệ: **Khu vực Công khai cho Nhân dân** và **Khu vực Nội bộ Chi bộ / Quản trị**.

## 1. Kiến trúc hệ thống

- **Frontend & App Engine**: Tĩnh + Single Page Application Router, tương thích hoàn toàn máy chủ tĩnh và Vercel Edge.
- **Khu vực Công khai (`index.html`)**:
  - Bản tin thời sự 3 cấp (TP. Huế, Phường Hương Thủy, TDP Lương Hậu).
  - Hệ thống chỉ đạo ANTT và Phương án Phòng chống thiên tai "4 tại chỗ".
  - Danh bạ công khai 10 Cán bộ chủ chốt (theo file `Ds_Can_bộ_Luong_Hau_V2.xlsx`).
  - Kho 11 biểu mẫu hành chính trực tuyến tải miễn phí qua Google Drive.
  - Form tiếp nhận phản ánh kiến nghị công dân 24/7 có mã tra cứu và che số điện thoại bảo mật.
  - Lộ trình 6 Tiện ích số V2 Quý IV/2026.
- **Khu vực Nội bộ Chi bộ (`noi_bo.html`)**:
  - Lớp bảo mật xác thực Đảng viên chuẩn chỉ danh sách 22 đồng chí Chi bộ Lương Hậu (QĐ 46-QĐ/ĐU).
  - Rate Limiting khóa 5 phút khi sai liên tiếp 5 lần.
  - Văn bản chỉ đạo Chi bộ (Nghị quyết 09-NQ/CB, Tờ trình 11, v.v.).
  - Dashboard phân công nhiệm vụ "6 Rõ" (10 cán bộ, KPI đạt 87.0% Xuất sắc).
  - Liên kết Sổ tay Đảng viên điện tử Thừa Thiên Huế và Tư liệu Văn kiện Đảng.
- **Dữ liệu Store & Auth Engine (`app/store.js`, `app/auth.js`, `app/app.js`)**:
  - Quản lý toàn diện dữ liệu thật 100%, bảo lưu lịch sử phản ánh, điểm danh và văn bản.

## 2. Kiểm thử tự động (Quality Assurance)

Chạy kiểm thử toàn diện:
```bash
npm test
```
Bộ kiểm thử `tests/test.cjs` bao gồm 45 bài test kiểm tra runtime JS, thông tin cán bộ, liên kết Drive, các modals điều hành, form validation và cơ chế bảo mật nội bộ.

## 3. Triển khai Vercel Production

- **Domain chính thức**: [https://luong-hau.vercel.app](https://luong-hau.vercel.app)
- Triển khai trực tiếp qua script:
```bash
python deploy_current_to_vercel.py
```
