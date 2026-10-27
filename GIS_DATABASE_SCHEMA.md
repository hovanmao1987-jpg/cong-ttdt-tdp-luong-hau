# THIẾT KẾ CƠ SỞ DỮ LIỆU BẢN ĐỒ SỐ LƯƠNG HẬU – DIGITAL GIS 3.0
**Dự án:** Cổng thông tin điện tử Tổ dân phố Lương Hậu  
**Tiêu chuẩn:** OGC GeoJSON RFC 7946 & Clean Schema Design  

---

## 1. THIẾT KẾ BẢNG VÀ TẬP DỮ LIỆU (DATABASE COLLECTIONS & TABLES)

Mô hình dữ liệu được thiết kế tương thích kép:
1. **Môi trường Web Client/Edge Static (Hiện hành):** Sử dụng engine `LuongHauGisDatabase` (lưu trữ JSON có định kiểu, chỉ mục khóa chính, khóa ngoại logic và lưu trữ bền vững tại IndexedDB/localStorage).
2. **Môi trường Máy chủ Relational/PostGIS (Mở rộng trong tương lai):** Có sẵn mã định nghĩa bảng SQL chuẩn PostGIS tương thích 100%.

---

### 1.1. Bảng `gis_layers` (Danh mục Lớp dữ liệu bản đồ)
Quản lý cấu hình các lớp thông tin không gian hiển thị trên bản đồ.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | PRIMARY KEY | Khóa chính (ví dụ: `layer_boundary`, `layer_households`) |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Mã định danh lớp (`BOUNDARY`, `ROADS`, `HOUSEHOLDS`, `INFRA`, `LANDMARKS`, `INCIDENTS`, `TASKS`, `FLOOD`, `SECURITY`) |
| `name` | VARCHAR(100) | NOT NULL | Tên hiển thị tiếng Việt (ví dụ: "Ranh giới Tổ dân phố") |
| `geometry_type`| VARCHAR(30) | NOT NULL | Loại hình học: `Point`, `LineString`, `Polygon`, `MultiPolygon` |
| `visibility` | VARCHAR(20) | DEFAULT 'PUBLIC'| `PUBLIC` (Công khai), `INTERNAL` (Nội bộ), `RESTRICTED` (Hạn chế) |
| `sensitivity_level`| VARCHAR(20)| DEFAULT 'LOW' | `LOW` (Thấp), `MEDIUM` (Trung bình), `HIGH` (Dữ liệu nhạy cảm) |
| `style_config` | JSON | NOT NULL | Cấu hình màu sắc, độ dày nét, màu tô, biểu tượng (icon, color, fillOpacity, dashArray) |
| `is_active` | BOOLEAN | DEFAULT true | Trạng thái kích hoạt lớp |
| `display_order`| INT | DEFAULT 0 | Thứ tự hiển thị trong thanh Layer Manager |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm cập nhật |

---

### 1.2. Bảng `gis_features` (Đối tượng không gian địa lý)
Lưu trữ thông tin hình học và thuộc tính nghiệp vụ của từng đối tượng trên bản đồ.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Khóa chính UUID hoặc mã định danh duy nhất (ví dụ: `feat_hh_LH-001`) |
| `layer_id` | VARCHAR(50) | FOREIGN KEY | Liên kết tới `gis_layers.id` |
| `external_id` | VARCHAR(100) | INDEX | Mã tham chiếu ngoại (ví dụ: Mã hộ `LH-001`, Mã đèn `AS-01`) |
| `geometry` | JSON / GEOMETRY| NOT NULL | Dữ liệu hình học GeoJSON chuẩn RFC 7946 (`{"type": "Point", "coordinates": [107.694743, 16.429312]}`) |
| `properties` | JSON | NOT NULL | Thuộc tính đối tượng (Tên, địa chỉ, loại hình, thông số kỹ thuật, ghi chú) |
| `source_id` | VARCHAR(50) | NULL | Nguồn dữ liệu nhập (ví dụ: `import_job_20261027_01`, `survey_gps`) |
| `verification_status`| VARCHAR(20)| DEFAULT 'UNVERIFIED'| Trạng thái xác minh: `VERIFIED` (Đã xác minh), `UNVERIFIED` (Chưa xác minh), `DISPUTED` (Đang đối soát) |
| `publication_status` | VARCHAR(20)| DEFAULT 'DRAFT' | Trạng thái phát hành: `DRAFT` (Bản nháp), `PENDING_REVIEW` (Chờ duyệt), `PUBLISHED` (Đã xuất bản) |
| `created_by` | VARCHAR(50) | NOT NULL | Tài khoản tạo dữ liệu |
| `updated_by` | VARCHAR(50) | NOT NULL | Tài khoản cập nhật sau cùng |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm cập nhật |
| `deleted_at` | TIMESTAMP | NULL | Thời điểm xóa mềm (Soft Delete, hỗ trợ khôi phục) |

---

### 1.3. Bảng `gis_resident_links` (Khóa liên kết hộ dân cư)
Liên kết an toàn giữa điểm không gian và hồ sơ hộ dân cư, không sao chép dữ liệu nhân thân.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Khóa chính |
| `feature_id` | VARCHAR(64) | FOREIGN KEY | Liên kết tới `gis_features.id` |
| `household_reference_id`| VARCHAR(50)| NOT NULL, INDEX | Mã hộ gia đình tương ứng trong phân hệ Dân cư 2.3.0 (`LH-001` đến `LH-466`) |
| `verification_status`| VARCHAR(20)| DEFAULT 'VERIFIED' | Trạng thái đối soát vị trí thực địa |
| `verified_by` | VARCHAR(50) | NULL | Cán bộ xác nhận tọa độ |
| `verified_at` | TIMESTAMP | NULL | Thời điểm xác minh |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm tạo liên kết |

---

### 1.4. Bảng `gis_assets` (Chi tiết tài sản hạ tầng)
Mở rộng chi tiết cho các đối tượng thuộc lớp hạ tầng kỹ thuật đô thị.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Khóa chính |
| `feature_id` | VARCHAR(64) | UNIQUE, FOREIGN KEY | Liên kết 1-1 tới `gis_features.id` |
| `asset_code` | VARCHAR(50) | UNIQUE, NOT NULL | Mã tài sản (ví dụ: `TS-CHIEU-SANG-01`, `TS-CONG-THOAT-05`) |
| `asset_type` | VARCHAR(50) | NOT NULL | Phân loại tài sản: `STREET_LIGHT`, `ELECTRIC_POLE`, `DRAINAGE`, `MANHOLE`, `FIRE_HYDRANT`, `WASTE_POINT` |
| `condition` | VARCHAR(30) | NOT NULL | Hiện trạng: `GOOD` (Tốt), `NEEDS_CHECK` (Cần kiểm tra), `DAMAGED` (Hư hỏng), `REPAIRING` (Đang sửa) |
| `maintenance_date`| DATE | NULL | Ngày bảo trì gần nhất |
| `next_inspection_date`| DATE | NULL | Lịch kiểm tra định kỳ tiếp theo |
| `responsible_unit`| VARCHAR(100)| NOT NULL | Đơn vị / người phụ trách quản lý |
| `photos` | JSON | DEFAULT '[]' | Danh sách đường dẫn ảnh thực địa đính kèm |

---

### 1.5. Bảng `gis_import_jobs` (Lịch sử các lô nhập dữ liệu GPS/GIS)
Theo dõi và kiểm soát toàn bộ các lượt tải tệp dữ liệu lên hệ thống, hỗ trợ hoàn tác theo lô.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Mã lô nhập (ví dụ: `JOB-20261027-001`) |
| `filename` | VARCHAR(255) | NOT NULL | Tên tệp gốc được tải lên |
| `file_hash` | VARCHAR(64) | NOT NULL | Mã băm SHA-256 chống tải lặp tệp |
| `format` | VARCHAR(20) | NOT NULL | Định dạng tệp: `GEOJSON`, `KML`, `KMZ`, `GPX`, `SHAPEFILE`, `CSV`, `EXCEL` |
| `source_crs` | VARCHAR(50) | NOT NULL | Hệ tọa độ nguồn: `WGS84_EPSG_4326`, `VN2000_HUETRUNG`, `UNKNOWN` |
| `target_crs` | VARCHAR(50) | DEFAULT 'EPSG:4326'| Hệ tọa độ đích chuẩn hóa |
| `status` | VARCHAR(20) | NOT NULL | Trạng thái lô: `STAGING`, `VALIDATED`, `APPROVED`, `REJECTED`, `ROLLED_BACK` |
| `total_rows` | INT | NOT NULL | Tổng số đối tượng đọc được từ tệp |
| `valid_rows` | INT | NOT NULL | Số đối tượng hợp lệ |
| `invalid_rows` | INT | NOT NULL | Số đối tượng bị lỗi hình học hoặc sai phạm vi |
| `imported_by` | VARCHAR(50) | NOT NULL | Người thực hiện tải tệp |
| `approved_by` | VARCHAR(50) | NULL | Người phê duyệt ghi nhận chính thức |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm tải lên |

---

### 1.6. Bảng `gis_audit_logs` (Nhật ký kiểm toán dữ liệu không gian)
Ghi nhận mọi thao tác can thiệp dữ liệu bản đồ nhằm phục vụ thanh tra và truy vết an ninh.

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Mã nhật ký |
| `actor_id` | VARCHAR(50) | NOT NULL | Mã định danh người thực hiện |
| `actor_role` | VARCHAR(30) | NOT NULL | Vai trò khi thực hiện (`GIS_ADMIN`, `BI_THU`...) |
| `action` | VARCHAR(50) | NOT NULL | Hành động: `CREATE_FEATURE`, `UPDATE_COORDS`, `IMPORT_BATCH`, `APPROVE_BATCH`, `DELETE_FEATURE`, `EXPORT_DATA` |
| `resource_type` | VARCHAR(50) | NOT NULL | Loại tài nguyên: `FEATURE`, `LAYER`, `IMPORT_JOB`, `ASSET` |
| `resource_id` | VARCHAR(64) | NOT NULL | Khóa chính của đối tượng bị tác động |
| `timestamp` | TIMESTAMP | DEFAULT NOW() | Thời gian thực hiện |
| `change_summary`| JSON | NOT NULL | Chi tiết thay đổi (Giá trị cũ, giá trị mới, lý do sửa đổi) |
| `ip_address` | VARCHAR(45) | NULL | Địa chỉ IP máy trạm (nếu có) |

---

### 1.7. Bảng `gis_feature_relations` (Quan hệ đối tượng GIS với các phân hệ khác)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Khóa chính |
| `feature_id` | VARCHAR(64) | FOREIGN KEY | Khóa ngoại tới `gis_features.id` |
| `related_module`| VARCHAR(50) | NOT NULL | Phân hệ liên kết: `PHAN_ANH` (Phản ánh), `CONG_VIEC` (Nhiệm vụ), `VAN_BAN` (Văn bản) |
| `related_record_id`| VARCHAR(64)| NOT NULL | Mã bản ghi ở phân hệ tương ứng (ví dụ: `LH-2026-000001`) |
| `relation_type` | VARCHAR(30) | NOT NULL | Kiểu quan hệ: `INCIDENT_LOCATION`, `TASK_LOCATION`, `REGULATION_ZONE` |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm tạo quan hệ |

---

## 2. KẾT NỐI TƯƠNG THÍCH VỚI POSTGIS (MIGRATION DỰ PHÒNG)

Nếu triển khai lên hệ quản trị PostgreSQL có kích hoạt phần mở rộng PostGIS (`CREATE EXTENSION IF NOT EXISTS postgis;`), lược đồ SQL tương ứng như sau:

```sql
-- Kích hoạt phần mở rộng không gian
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Bảng lớp dữ liệu
CREATE TABLE IF NOT EXISTS gis_layers (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    geometry_type VARCHAR(30) NOT NULL,
    visibility VARCHAR(20) DEFAULT 'PUBLIC',
    sensitivity_level VARCHAR(20) DEFAULT 'LOW',
    style_config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng đối tượng không gian với chỉ mục không gian GIST
CREATE TABLE IF NOT EXISTS gis_features (
    id VARCHAR(64) PRIMARY KEY,
    layer_id VARCHAR(50) REFERENCES gis_layers(id) ON DELETE CASCADE,
    external_id VARCHAR(100),
    geom GEOMETRY(Geometry, 4326) NOT NULL,
    properties JSONB NOT NULL DEFAULT '{}',
    source_id VARCHAR(50),
    verification_status VARCHAR(20) DEFAULT 'UNVERIFIED',
    publication_status VARCHAR(20) DEFAULT 'DRAFT',
    created_by VARCHAR(50) NOT NULL,
    updated_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- Tạo Spatial Index
CREATE INDEX IF NOT EXISTS idx_gis_features_geom ON gis_features USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_gis_features_layer_id ON gis_features (layer_id);
CREATE INDEX IF NOT EXISTS idx_gis_features_external_id ON gis_features (external_id);
CREATE INDEX IF NOT EXISTS idx_gis_features_status ON gis_features (publication_status, verification_status);
```
