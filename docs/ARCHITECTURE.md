# 🏛️ TÀI LIỆU KIẾN TRÚC HỆ THỐNG (ARCHITECTURE.MD)
## CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU

---

## 1. Nguyên Tắc Thiết Kế (Architectural Principles)

Hệ thống được xây dựng hoàn toàn mới theo các tiêu chuẩn:
- **Clean Architecture & Separation of Concerns:** Tách biệt rõ ràng 3 lớp Public Portal, Internal Party Portal, Admin/Bí Thư Dashboard.
- **Không trộn dữ liệu:** Dữ liệu nội bộ chi bộ (thông tin đảng viên, điểm danh, hồ sơ kiểm tra Điều 30) được bảo vệ bằng lớp kiểm soát quyền RBAC nghiêm ngặt và không lộ ra ngoài Cổng công khai.
- **Mobile-First & PWA:** Tối ưu hóa trải nghiệm trên các kích thước màn hình phổ biến từ 320px, 375px, 390px, 414px, 768px, 1024px đến 1440px. Hỗ trợ Service Worker cache offline.
- **Quy trình duyệt nội dung CMS (Approval Workflow):** FORM &rarr; CMS &rarr; PENDING &rarr; BÍ THƯ DUYỆT &rarr; APPROVED &rarr; PUBLISHED. Không tự động công khai nội dung chưa được duyệt.

---

## 2. Bản Đồ Điều Hướng & Định Tuyến (Routing Map)

| Route (URL) | Tệp Nguồn | Mục Đích & Quyền Hạn |
|---|---|---|
| `/` | `index.html` | Cổng thông tin công khai (Public Portal) cho nhân dân |
| `/dang-vien` | `dang-vien.html` | Cổng Đảng viên & Sinh hoạt Chi bộ (Yêu cầu đăng nhập) |
| `/noi-bo` | `dang-vien.html` | Đường dẫn tương thích ngược từ hệ thống cũ (Redirect) |
| `/bi-thu` | `bi-thu.html` | Dashboard Bí thư & Chi ủy (Quyền `BI_THU`, `ADMIN`) |
| `/admin` | `admin.html` | CMS Quản trị trung tâm 17 bảng dữ liệu |
| `/cms` | `admin.html` | Đường dẫn tương thích ngược (Redirect) |
| `/quan-tri` | `admin.html` | Đường dẫn tương thích ngược (Redirect) |

---

## 3. Cấu Trúc Thư Mục Chuẩn Hóa

```text
cong-ttdt-tdp-luong-hau/
├── dist/                          # Thư mục đóng gói Production Deploy
├── docs/                          # Tài liệu kỹ thuật & kiểm kê
│   ├── ARCHITECTURE.md            # Tài liệu kiến trúc
│   ├── DATABASE.md                # Lược đồ 17 bảng
│   ├── SECURITY.md                # Chính sách an toàn & RBAC
│   ├── DEPLOYMENT.md              # Quy trình triển khai Vercel
│   ├── ADMIN_GUIDE.md             # Hướng dẫn quản trị viên
│   ├── LEGACY_INVENTORY.md        # Bảng kiểm kê dữ liệu cũ
│   └── LINK_INVENTORY.md          # Bảng kiểm kê liên kết bảo toàn
├── legacy-backup/                 # Thư mục sao lưu vĩnh viễn hệ thống cũ
├── public/                        # Tài nguyên tĩnh, PWA manifest & sw.js
├── src/
│   ├── css/
│   │   └── style.css              # Design system đỏ cờ, vàng đồng
│   └── lib/
│       ├── db.js                  # Cơ sở dữ liệu 17 bảng & CRUD
│       └── auth.js                # Động cơ xác thực & RBAC
├── index.html                     # Public Portal
├── dang-vien.html                 # Cổng Đảng viên
├── bi-thu.html                    # Dashboard Bí thư
├── admin.html                     # CMS Quản trị
├── noi_bo.html                    # Redirect bảo toàn
├── cms.html                       # Redirect bảo toàn
├── vercel.json                    # Cấu hình Clean URLs & Rewrites
├── build_clean_app.py             # Script đóng gói dist
├── test_master_suite.py           # Bộ kiểm thử 37 tiêu chí
└── deploy_new_version.py          # Script deploy Production Vercel
```
