# 🚀 QUY TRÌNH TRIỂN KHAI VÀ PHÁT HÀNH (DEPLOYMENT.MD)
## CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU

---

## 1. Môi Trường Triển Khai

- **Nền tảng Cloud:** Vercel Global Edge Network
- **Tên dự án Vercel:** `luong-hau`
- **Project ID:** `prj_nj71bNJ5yS6RPkoJkhxYvejsUd9l`
- **Team ID:** `hovanmao1987-7509s-projects`
- **Tên miền sản xuất (Production Domains):**
  - `https://luong-hau.vercel.app`

---

## 2. Các Bước Build & Deploy Chuẩn

### Bước 1: Đóng Gói Toàn Diện (Build)
```bash
python build_clean_app.py
```
*Lệnh này sẽ làm sạch thư mục `dist/`, đồng bộ tất cả mã nguồn HTML, CSS, JS, PWA và cấu hình routing `vercel.json`.*

### Bước 2: Chạy Bộ Kiểm Thử (Master Test Suite)
```bash
python test_master_suite.py
```
*Đảm bảo 100% tiêu chí kiểm tra pass trước khi deploy.*

### Bước 3: Đẩy Lên Môi Trường Sản Xuất (Production Deployment)
```bash
python deploy_new_version.py
```
*Script tự động tải tệp tin lên Vercel API v2, kích hoạt deployment v13, kiểm tra trạng thái READY và liên kết alias chính thức `luong-hau.vercel.app`.*
