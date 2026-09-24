# 🏛️ CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU
> **Slogan:** "Đoàn kết - Dân chủ - Kỷ cương - Phát triển"  
> **Cơ quan quản lý:** UBND Phường Hương Thủy • Thành phố Huế  
> **Trụ sở Nhà SHCĐ:** Số 83 Thái Thuận, TDP Lương Hậu, Phường Hương Thủy, TP. Huế  
> **Quy mô:** 469 Hộ gia đình • 1.947 Nhân khẩu • 22 Đảng viên Chi bộ  
> **Kiến trúc:** Antigravity Autonomous Clean Architecture (Master Build 2026)

---

## 📌 1. Giới Thiệu Dự Án

Hệ thống **Cổng Thông Tin Và Điều Hành Số Lương Hậu** là nền tảng quản trị và điều hành số toàn diện cấp cơ sở, phục vụ song song:
1. **🌐 Cổng Thông Tin Công Khai (Public Portal):** Cung cấp tin tức, thông báo, lịch hoạt động, dịch vụ công trực tuyến, tra cứu kho biểu mẫu điện tử miễn phí, tiếp nhận và minh bạch kết quả xử lý phản ánh của nhân dân 24/7.
2. **🔐 Cổng Đảng Viên (Internal Party Portal):** Khu vực bảo mật dành cho 22 Đảng viên Chi bộ Lương Hậu, tích hợp Sổ tay Đảng viên Điện tử Thừa Thiên Huế, điều hành sinh hoạt chi bộ, điểm danh tính tỷ lệ tự động, ban hành nghị quyết và phân công "6 Rõ".
3. **📊 Dashboard Bí Thư (Bí Thư / Chi Ủy):** Bảng chỉ huy điều hành tối cao, theo dõi tiến độ công việc, cảnh báo nhiệm vụ quá hạn, phê duyệt nội dung CMS theo quy trình nghiêm ngặt và xuất báo cáo công tác Đảng.
4. **⚙️ CMS Quản Trị Trung Tâm (Admin CMS):** Quản trị toàn diện tin tức 7 danh mục, thông báo khẩn, kho văn bản 4 cấp, tiếp nhận phản ánh, quản trị tài khoản phân quyền RBAC và hệ thống Audit Logs bất biến.

---

## 🏗️ 2. Ba Lớp Kiến Trúc Hệ Thống (3-Tier Clean Architecture)

```text
┌────────────────────────────────────────────────────────┐
│                   PUBLIC PORTAL (/)                    │
│ Header (Cờ Tổ Quốc/Đảng) • Banner • Tin Tức • Thông Báo│
│ Truy Cập Nhanh • Biểu Mẫu • Lịch • Phản Ánh • Danh Bạ  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              CỔNG ĐẢNG VIÊN (/dang-vien)               │
│ Khóa phiên PIN/Tài khoản • Sổ tay ĐVĐT • Sinh Hoạt     │
│ Điểm Danh (Auto %) • Nghị Quyết • Phân Công 6 Rõ       │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│      DASHBOARD BÍ THƯ & CMS (/bi-thu & /admin)         │
│ Điều hành tối cao • RBAC • Workflow Duyệt Pending      │
│ Quản trị 17 Bảng • Cảnh báo Quá hạn • Audit Logs Bất Biến│
└────────────────────────────────────────────────────────┘
```

---

## 🔑 3. Tài Khoản & Phân Quyền (RBAC)

| Tên Đăng Nhập | Mật Khẩu / PIN | Vai Trò (Role) | Chức Năng Chính |
|---|---|---|---|
| **bithu** | `bithu2026` / `2026` | `BI_THU` | Phê duyệt CMS, Dashboard điều hành, Nghị quyết, Điểm danh |
| **totruong** | `totruong2026` | `CAN_BO_TDP` | Quản lý điều hành TDP, văn bản, thông báo, xử lý phản ánh |
| **chiuy** | `chiuy2026` / `2026` | `CHI_UY` | Quản lý sinh hoạt Chi bộ, kiểm tra giám sát Điều 30 |
| **editor** | `editor2026` | `EDITOR` | Soạn thảo tin tức, lưu nháp, gửi Bí thư phê duyệt |
| **admin** | `admin2026!` | `ADMIN` | Quản trị toàn diện hệ thống, phân quyền, sao lưu, audit logs |

---

## 🚀 4. Hướng Dẫn Vận Hành & Khởi Chạy

```bash
# 1. Build dữ liệu và đóng gói dist/
python build_clean_app.py

# 2. Chạy bộ kiểm thử Master Test Suite
python test_master_suite.py

# 3. Deploy lên môi trường Production Vercel
python deploy_new_version.py
```

---

## 📁 5. Danh Mục Tài Liệu Kèm Theo
- [ARCHITECTURE.md](file:///c:/Users/Admin/.gemini/antigravity-ide/scratch/cong-ttdt-tdp-luong-hau/docs/ARCHITECTURE.md): Kiến trúc hệ thống và quy trình nghiệp vụ
- [DATABASE.md](file:///c:/Users/Admin/.gemini/antigravity-ide/scratch/cong-ttdt-tdp-luong-hau/docs/DATABASE.md): Chi tiết cấu trúc 17 bảng cơ sở dữ liệu
- [SECURITY.md](file:///c:/Users/Admin/.gemini/antigravity-ide/scratch/cong-ttdt-tdp-luong-hau/docs/SECURITY.md): Chính sách an toàn thông tin & bảo mật RBAC
- [DEPLOYMENT.md](file:///c:/Users/Admin/.gemini/antigravity-ide/scratch/cong-ttdt-tdp-luong-hau/docs/DEPLOYMENT.md): Quy trình build và triển khai Production Vercel
- [ADMIN_GUIDE.md](file:///c:/Users/Admin/.gemini/antigravity-ide/scratch/cong-ttdt-tdp-luong-hau/docs/ADMIN_GUIDE.md): Sổ tay hướng dẫn quản trị dành cho Cán bộ & Bí thư
- [LEGACY_INVENTORY.md](file:///c:/Users/Admin/.gemini/antigravity-ide/scratch/cong-ttdt-tdp-luong-hau/docs/LEGACY_INVENTORY.md): Bảng kiểm kê toàn bộ dữ liệu & tài sản cũ
- [LINK_INVENTORY.md](file:///c:/Users/Admin/.gemini/antigravity-ide/scratch/cong-ttdt-tdp-luong-hau/docs/LINK_INVENTORY.md): Bảng kiểm kê đường dẫn & bảo toàn Google Drive
