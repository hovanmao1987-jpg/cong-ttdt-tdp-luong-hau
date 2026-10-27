# BÁO CÁO KIỂM TOÁN HỆ THỐNG HIỆN CÓ & ĐÁNH GIÁ TÍCH HỢP
## PHÂN HỆ BẢN ĐỒ SỐ LƯƠNG HẬU – DIGITAL GIS 3.0
**Dự án:** Cổng thông tin điện tử Tổ dân phố Lương Hậu (`cong-ttdt-tdp-luong-hau`)  
**Website Production:** https://luong-hau.vercel.app  
**Đơn vị:** Tổ dân phố Lương Hậu, phường Hương Thủy, thành phố Huế  
**Tiêu chuẩn kiến trúc:** PATCH ONLY – ADDITIVE DEVELOPMENT – ZERO REGRESSION  
**Thời điểm kiểm toán:** Tháng 10/2026  
**Chuyên gia thực hiện:** Principal Software Architect, Senior Full-stack Engineer, GIS Specialist, Cybersecurity Engineer  

---

## 1. TỔNG QUAN REPOSITORY & MÔI TRƯỜNG CÔNG NGHỆ

### 1.1. Cấu trúc thư mục và môi trường build
* **Mô hình kiến trúc tổng thể:** Hybrid SSG (Static Site Generation) kết hợp Client-Side SPA/Module Architecture.
* **Core Framework:** Astro v5.0.0 (`astro/astro.config.mjs`) sinh HTML tĩnh ra thư mục `dist/`.
* **Cơ chế đồng bộ tĩnh (`astro/sync-static.mjs`):** Tự động chuyển đổi các trang từ `dist/` sang các tệp HTML độc lập tại thư mục gốc (`index.html`, `noi_bo.html`, `van-ban.html`, `van-ban-moi.html`, `chu-nhat-xanh.html`) với đường dẫn tương đối (relative paths) nhằm hỗ trợ cả triển khai Vercel lẫn chạy độc lập (`file://`, không cần server Node.js runtime).
* **Nền tảng triển khai:** Vercel Static Hosting (`vercel.json`), tích hợp `cleanUrls: true`, `trailingSlash: false`, kiểm soát header an toàn (Anti-indexing, no-referrer, cache-control cho các khu vực nội bộ `/noi-bo*` và `/noi_bo*`).
* **Quản lý phiên bản:** Git repository trên branch `feature/quan-ly-dan-cu-2.3.0`.

### 1.2. Danh mục các module đã triển khai trong hệ thống
1. **Cổng thông tin điện tử công khai (`index.html` / `src/pages/index.astro`):**
   * Chuẩn giao diện Hue.gov.vn Mobile V3, màu sắc Đỏ cờ (#B91C1C) - Vàng đồng (#D97706) - Xanh chính quyền (#1E40AF).
   * Cung cấp tin tức, thông báo, văn bản chỉ đạo, lịch sinh hoạt, danh bạ lãnh đạo và liên kết bản đồ số.
2. **Khu nội bộ Chi bộ (`noi_bo.html` / `noi-bo.html`):**
   * Chuẩn giao diện DangCongSan Mobile V2, cơ chế điều hướng client-side hash routing (`#/noi-bo/...`).
   * Bảo vệ bằng xác thực phiên làm việc, quản lý đảng viên, nghị quyết, sinh hoạt chi bộ.
3. **CMS Quản trị trung tâm (`admin.html`):**
   * Bố cục Sidebar + Main Tab View (`switchCmsTab`).
   * Đang quản lý: Dashboard điều hành, Tin tức, Thông báo, Zalo Notify, Văn bản & Biểu mẫu, Lịch hoạt động, Phản ánh dân cư, Quản lý Dân cư v2.3.0, Người dùng & RBAC, Nhật ký Audit Log, Cài đặt & Sao lưu.
4. **Dashboard Bí thư Chi bộ (`bi-thu.html` / `noi-bo/dashboard.html`):**
   * Bảng điều hành chỉ huy tổng hợp dành cho Bí thư và Ban điều hành tổ dân phố.
5. **Phân hệ Quản lý Dân cư số 2.3.0 (`assets/js/quan-ly-dan-cu.js`, `assets/css/quan-ly-dan-cu.css`):**
   * Quản lý 466 hộ dân (452 hộ chính thức + 14 hộ bổ sung), 1.943 nhân khẩu.
   * Gồm 16 tiểu phân hệ: Dashboard, Hộ gia đình, Nhân khẩu, BHYT, Smart Excel Import, Google Sheets Sync, Zalo Heuristic Parser, OCR Cục bộ, GPS Coordinates, Tìm kiếm nâng cao, Trường mở rộng, Báo cáo & Xuất, Sao lưu & Phục hồi, RBAC Matrix, Audit Log, Cấu hình.
   * Đã đạt 100% (39/39 bài test) trong bộ kiểm thử hồi quy `tests/test_dan_cu_2_3_0.cjs`.
6. **Bản đồ số Lương Hậu hiện có (`bando.html`):**
   * Nền tảng: Leaflet v1.9.4, Leaflet MarkerCluster v1.5.3, TailwindCSS v3.4.17.
   * Tích hợp: Bản đồ vệ tinh Esri World Imagery, OpenStreetMap, Bản đồ sơ đồ quy hoạch SVG vector, Ranh giới tổ dân phố đa giác màu vàng (Yellow Boundary Polygon), 466 điểm tọa độ GPS hộ dân, Modal danh sách thống kê, Drawer chi tiết hồ sơ, Modal xem Google Earth 3D liên kết trực tiếp dự án Google Earth Lương Hậu.

---

## 2. KIỂM TRA ĐƯỜNG DẪN & ROUTING HIỆN CÓ

Bảng đối chiếu cấu hình rewrite trong `vercel.json` và liên kết vật lý:

| Route công khai / nội bộ | Đích đến thực tế (`destination`) | Mục đích & Trạng thái |
| :--- | :--- | :--- |
| `/` | `index.html` (Astro SSG) | Trang chủ Cổng thông tin TDP Lương Hậu (Bảo toàn nguyên trạng) |
| `/ban-do-so`, `/gis`, `/ban-do`, `/bando` | `bando.html` | Bản đồ số GIS công khai (Điểm tích hợp GIS Viewer) |
| `/noi-bo`, `/noi_bo` | `noi-bo.html` / `noi_bo.html` | Cổng nội bộ Chi bộ (Xác thực phân quyền) |
| `/admin` | `admin.html` | Hệ thống quản trị CMS tập trung |
| `/bi-thu` | `bi-thu.html` | Dashboard điều hành Bí thư |
| `/dang-vien` | `dang-vien.html` | Cổng thông tin Đảng viên |
| `/van-ban`, `/van-ban-moi` | `van-ban.html`, `van-ban-moi.html` | Hệ thống văn bản chỉ đạo |
| `/chu-nhat-xanh` | `chu-nhat-xanh.html` | Trang phong trào môi trường Chủ Nhật Xanh |

> **Quy tắc tuyệt đối:** Không thay đổi bất kỳ rewrite hoặc route nào hiện có. Mọi route GIS mới phải tuân thủ cleanUrls và tương thích hoàn toàn với cấu hình rewrite hiện tại.

---

## 3. ĐÁNH GIÁ CƠ SỞ DỮ LIỆU & HẠ TẦNG LƯU TRỮ

### 3.1. Hiện trạng cơ sở dữ liệu
* **Kiến trúc dữ liệu hiện tại:** Hệ thống vận hành theo mô hình Client-Side Database Engine (`LuongHauDatabase`), kết hợp lưu trữ phân tầng:
  1. **Seed Data:** `data/dan_cu_seed.json` và `assets/js/dan-cu-seed.js` cung cấp dữ liệu khởi tạo chuẩn xác định danh (466 hộ, 1.943 nhân khẩu).
  2. **Browser Persistence:** `localStorage` và `IndexedDB` lưu trữ trạng thái cập nhật, nhật ký kiểm toán, trường mở rộng.
  3. **Cloud Live Sync:** Đồng bộ đọc hai chiều an toàn với Google Sheets chính thức (`1DgXp5p3If8xe8ZNCi1HTyQcgZ4HtfIao7aM0Kf_zvyQ`).
* **Hạ tầng PostGIS / Database Server:**
  * Hiện tại ứng dụng được lưu trữ dạng static trên Vercel, chưa có máy chủ cơ sở dữ liệu PostgreSQL/PostGIS chạy nền.
  * Việc áp dụng PostGIS từ xa (ví dụ Supabase) đòi hỏi API key, chuỗi kết nối và chi phí phát sinh nếu vượt hạn mức.
* **Giải pháp tương thích cao cấp cho GIS 3.0:**
  * Sử dụng chuẩn **GeoJSON RFC 7946** kết hợp thư viện xử lý hình học không gian client-side **Turf.js** (tính khoảng cách geodesic, diện tích polygon, bounding box, điểm nằm trong vùng - point-in-polygon).
  * Lưu trữ dữ liệu lớp và đối tượng không gian có cấu trúc dạng bảng/collection (`gis_layers`, `gis_features`, `gis_assets`, `gis_resident_links`) thông qua engine cơ sở dữ liệu `LuongHauGisDatabase` tương thích kiến trúc `LuongHauDatabase` hiện có.
  * Hỗ trợ xuất/nhập tệp chuẩn GeoJSON, KML, GPX, Shapefile (qua Shapefile parser/jszip), CSV tọa độ, Excel XLSX.

---

## 4. BẢO VỆ DỮ LIỆU CÁ NHÂN & AN TOÀN AN NINH THÔNG TIN
*(Tuân thủ Nghị định 13/2023/NĐ-CP và Luật Bảo vệ dữ liệu cá nhân có hiệu lực từ 01/01/2026)*

### 4.1. Phân loại mức độ nhạy cảm của dữ liệu GIS
1. **Dữ liệu công khai (Public GIS Data):**
   * Ranh giới hành chính tổ dân phố Lương Hậu đã xác minh.
   * Danh mục và tên các tuyến đường, ngõ xóm chính (Trần Hoàn, Thái Thuận, các kiệt...).
   * Các điểm công trình văn hóa - công cộng (Nhà sinh hoạt cộng đồng 83 Thái Thuận, Đình làng Lương Hậu, Điểm sinh hoạt văn hóa).
   * Điểm tập kết rác sinh hoạt và cảnh báo môi trường chung.
2. **Dữ liệu nội bộ có phân quyền (Restricted / Internal GIS Data):**
   * Vị trí địa lý nhà ở của từng hộ dân (tuyệt đối không công khai kèm họ tên, số CCCD, số điện thoại, tình trạng kinh tế, diện chính sách).
   * Hệ thống hạ tầng kỹ thuật nhạy cảm: Chi tiết tài sản đèn chiếu sáng, tủ điện hạ thế, họng cấp nước cứu hỏa, cống ngầm.
   * Phản ánh hiện trường chưa xác minh hoặc chứa thông tin công dân gửi phản ánh.
   * Danh sách công việc phân công cho cán bộ xử lý hiện trường.

### 4.2. Cơ chế cách ly dữ liệu hộ dân
* **Nguyên tắc:** Bảng `gis_features` lưu trữ tọa độ và hình học không gian, chỉ liên kết với bảng `households` của phân hệ Dân cư qua khóa ngoại logic `household_reference_id` (`ma_ho`: ví dụ `LH-001`).
* Không nhân bản (duplicate) các cột nhân thân (CCCD, Họ tên, Ngày sinh, Dân tộc, Tôn giáo, Số điện thoại) vào các lớp bản đồ công khai.
* Trên bản đồ công khai (`bando.html`), các điểm hộ dân chỉ hiển thị mã định danh số nhà/mã hộ hoặc được hiển thị dạng phân cụm mật độ (Cluster / Density Grid), thông tin chi tiết cá nhân bị ẩn hoàn toàn đối với người dùng vãng lai (`CONG_DAN`).

---

## 5. MA TRẬN RỦI RO & PHƯƠNG ÁN PHÒNG NGỪA (RISK ASSESSMENT)

| STT | Rủi ro tiềm ẩn | Mức độ rủi ro | Biện pháp kiểm soát & Phòng ngừa |
| :---: | :--- | :---: | :--- |
| 1 | Xung đột làm gián đoạn Cổng công khai (`index.html`) | Rất cao | **Áp dụng nguyên tắc Patch Only:** Không chỉnh sửa layout gốc, không đổi bảng màu thương hiệu, chỉ thêm liên kết điều hướng được phê duyệt. |
| 2 | Rò rỉ thông tin cá nhân của 1.943 nhân khẩu | Nghiêm trọng | Phân tách triệt để API/Dataset công khai và nội bộ. Tự động che dữ liệu nhạy cảm (`dc-masked`). Không hiển thị CCCD/SĐT trên popup bản đồ công khai. |
| 3 | Tải trọng quá tải trình duyệt khi render 466+ điểm GPS | Trung bình | Sử dụng `Leaflet.markercluster` với ngưỡng zoom hợp lý, áp dụng viewport bounding-box culling và lazy rendering. |
| 4 | Xung đột hệ tọa độ khi nhập file (WGS84 vs VN-2000) | Trung bình | Kiểm tra phạm vi tọa độ vĩ độ (16.40 - 16.46), kinh độ (107.67 - 107.73). Cảnh báo rõ ràng nếu sai lệch hệ tọa độ hoặc nằm ngoài ranh giới Huế. |
| 5 | Tải lên tệp GIS độc hại (XSS, Zip bomb, Path traversal) | Cao | Kiểm tra phần mở rộng tệp, giới hạn dung lượng (< 10MB), giải nén ZIP có kiểm soát độ dài đường dẫn và kích thước giải nén tối đa. Không thực thi mã từ GeoJSON/KML. |

---

## 6. KẾ HOẠCH TÍCH HỢP ĐỀ XUẤT (PATCH PLAN)

1. **Điểm tích hợp 1: GIS Map Viewer (`bando.html` / `/ban-do-so`):**
   * Nâng cấp `bando.html` hiện tại lên chuẩn **GIS 3.0**.
   * Bổ sung thanh công cụ đo khoảng cách (Distance Measurement), đo diện tích (Area Measurement), chọn và bật/tắt linh hoạt các lớp (Ranh giới, Tuyến đường, Hộ dân, Hạ tầng, Địa điểm công cộng, Môi trường).
   * Thiết kế thanh tìm kiếm dạng nút bấm mở rộng (collapsible search popup/drawer) theo đúng yêu cầu người dùng, tiết kiệm tối đa diện tích màn hình trên thiết bị di động.
   * Bảo toàn cửa sổ xem Google Earth 3D liên kết mô hình thực địa Lương Hậu.
2. **Điểm tích hợp 2: CMS Quản trị Bản đồ (`admin.html`):**
   * Bổ sung mục điều hướng `Quản Trị GIS 3.0` trong thanh menu CMS bên trái (`admin.html`).
   * Thêm thẻ phân hệ `#tab-gis-data` với các công cụ: Quản lý đối tượng không gian, Quản lý lớp dữ liệu, Trung tâm nhập dữ liệu GPS/GIS (GeoJSON, KML, GPX, CSV, Excel), Quy trình duyệt dữ liệu 2 bước (Chờ duyệt → Phê duyệt).
3. **Điểm tích hợp 3: Dashboard GIS Tổng hợp:**
   * Tích hợp widget chỉ số GIS (Tổng chiều dài đường ngõ xóm, số điểm hạ tầng, số hộ đã xác minh tọa độ, số phản ánh hiện trường) vào Dashboard quản trị và Dashboard Bí thư.
4. **Điểm tích hợp 4: Kết nối Phân hệ Dân cư 2.3.0:**
   * Trong màn hình quản lý dân cư (Subtab 9 GPS & Subtab 2 Hộ gia đình), cung cấp nút "Xem trên bản đồ số GIS" và "Cập nhật tọa độ từ bản đồ" thông qua khóa tham chiếu `ma_ho`.

---

## 7. KẾT LUẬN GIAI ĐOẠN 1
Repository hoàn toàn trong trạng thái sẵn sàng để tích hợp phân hệ **BẢN ĐỒ SỐ LƯƠNG HẬU – DIGITAL GIS 3.0**. Không phát hiện bất kỳ xung đột kiến trúc nghiêm trọng nào ngăn cản việc triển khai dạng Additive Patch. Mọi công việc tiếp theo sẽ tuân thủ nghiêm ngặt các tài liệu thiết kế tại Giai đoạn 2.
