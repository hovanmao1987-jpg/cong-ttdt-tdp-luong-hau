# MA TRẬN PHÂN QUYỀN TRUY CẬP BẢN ĐỒ SỐ LƯƠNG HẬU – GIS 3.0
**Dự án:** Cổng thông tin điện tử Tổ dân phố Lương Hậu  
**Tiêu chuẩn:** Role-Based Access Control (RBAC) & Principle of Least Privilege  

---

## 1. ĐỊNH NGHĨA CÁC VAI TRÒ LOGIC & ÁNH XẠ HỆ THỐNG HIỆN HÀNH

Hệ thống phân quyền được thiết kế tương thích hoàn toàn với bảng mã vai trò hiện có trong module xác thực (`assets/js/noi-bo.js` và `assets/js/quan-ly-dan-cu.js`):

| Vai trò Logic GIS 3.0 | Mã vai trò hệ thống (`Role Code`) | Đối tượng người dùng thực tế | Quyền hạn tổng quát |
| :--- | :--- | :--- | :--- |
| **GIS Super Admin** | `ADMIN` / `GIS_ADMIN` | Quản trị viên kỹ thuật công nghệ thông tin | Toàn quyền cấu hình lớp, quản trị hệ thống, duyệt lô nhập, xem nhật ký kiểm toán, quản lý quyền. |
| **Bí thư Chi bộ** | `BI_THU` | Bí thư Chi bộ TDP Lương Hậu | Xem Dashboard chỉ huy toàn diện, phê duyệt dữ liệu GIS công bố, giao việc, giám sát phản ánh và hạ tầng. |
| **Ban điều hành TDP** | `TO_TRUONG` | Tổ trưởng, Tổ phó, Trưởng Ban CTMT | Quản lý hạ tầng dân sinh, khảo sát cập nhật tọa độ hộ dân, tiếp nhận phản ánh, quản lý công việc hiện trường. |
| **Cán bộ phân công**| `CAN_BO` / `BIEN_TAP` | Cán bộ phụ trách mảng (môi trường, an ninh) | Xem và cập nhật các đối tượng, tài sản hạ tầng trong phạm vi được giao việc, cập nhật tiến độ xử lý. |
| **Đảng viên** | `DANG_VIEN` | Đảng viên thuộc Chi bộ Lương Hậu | Xem các lớp bản đồ nội bộ (sinh hoạt, phong trào, lịch sử văn hóa). Không có quyền xem thông tin cá nhân hộ dân. |
| **Công dân / Người dân**| `CONG_DAN` / `GUEST` | Người dân, khách vãng lai | Xem bản đồ công khai (Ranh giới, tuyến đường, địa điểm công cộng, danh bạ hỗ trợ), gửi phản ánh hiện trường. |

---

## 2. MA TRẬN PHÂN QUYỀN THEO TỪNG CHỨC NĂNG (RBAC MATRIX)

Ký hiệu:
* **F (Full):** Toàn quyền (Tạo, Sửa, Xóa, Duyệt, Cấu hình).
* **C (Create/Edit):** Có quyền tạo mới, chỉnh sửa bản ghi thuộc thẩm quyền.
* **A (Approve):** Có quyền phê duyệt xuất bản dữ liệu.
* **V (View):** Chỉ có quyền xem thông tin.
* **M (Masked):** Xem nhưng thông tin cá nhân nhạy cảm (CCCD, SĐT) bị ẩn/che.
* **X (No Access):** Tuyệt đối không được phép truy cập.

| Chức năng / Thao tác nghiệp vụ | GIS Super Admin (`ADMIN`) | Bí thư Chi bộ (`BI_THU`) | Ban điều hành (`TO_TRUONG`) | Cán bộ phân công (`CAN_BO`) | Đảng viên (`DANG_VIEN`) | Công dân (`CONG_DAN`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **1. Xem Bản đồ số công khai (`bando.html`)** | V | V | V | V | V | V |
| **2. Bật/tắt lớp ranh giới, đường, công cộng** | V | V | V | V | V | V |
| **3. Sử dụng công cụ đo khoảng cách, diện tích**| V | V | V | V | V | V |
| **4. Xem tọa độ & chi tiết nhà ở của hộ dân** | V | V | V | M | M | X (Chỉ thấy mã hộ/cluster) |
| **5. Xem dữ liệu cá nhân chủ hộ (CCCD, SĐT)** | V | V | V | X | X | X |
| **6. Xem lớp An ninh trật tự & Camera giám sát** | V | V | V | V (nếu giao việc)| V | X |
| **7. Thêm mới đối tượng không gian thủ công** | C | C | C | C (được giao) | X | X |
| **8. Chỉnh sửa hình học & tọa độ đối tượng** | C | C | C | C (được giao) | X | X |
| **9. Xóa đối tượng không gian (Xóa mềm)** | F | F | X | X | X | X |
| **10. Nhập tệp GIS (GeoJSON, KML, GPX, CSV, Excel)**| C | C | C | X | X | X |
| **11. Phê duyệt lô dữ liệu nhập vào CSDL chính** | A | A | X | X | X | X |
| **12. Hoàn tác lô nhập (Batch Rollback)** | F | F | X | X | X | X |
| **13. Quản lý tài sản hạ tầng & Bảo trì** | F | V | C | C | V | X |
| **14. Gửi phản ánh hiện trường kèm vị trí** | C | C | C | C | C | C |
| **15. Tiếp nhận & Phân công xử lý phản ánh** | F | F | C | X | X | X |
| **16. Cập nhật kết quả & ảnh xử lý phản ánh** | C | C | C | C | X | X |
| **17. Xem Dashboard chỉ huy GIS tổng hợp** | V | V | V | V (hạn chế) | X | X |
| **18. Xuất báo cáo GIS ra Excel / CSV** | F | F | F | V | X | X (Chỉ xuất danh mục công khai) |
| **19. Xuất tệp hình học GeoJSON chính thức** | F | F | V | X | X | X |
| **20. Xem nhật ký kiểm toán (GIS Audit Log)** | V | V | X | X | X | X |
| **21. Quản lý danh mục lớp và kiểu hiển thị**| F | X | X | X | X | X |

---

## 3. CƠ CHẾ KIỂM SOÁT BẢO MẬT PHÍA MÁY KHÁCH & GIAO DIỆN

1. **Phân tách bộ nhớ dữ liệu (Data Isolation):**
   * Đối với người dùng chưa đăng nhập (`CONG_DAN`), hệ thống không nạp các thuộc tính chứa định danh cá nhân vào bộ nhớ DOM của Leaflet marker.
   * Danh sách hộ dân trong modal bảng thống kê chỉ hiển thị các trường: `Mã Hộ`, `Tuyến Đường`, `Tọa Độ GPS`, `Mức Độ Ngập Lụt`. Các cột `CCCD`, `Số Điện Thoại`, `Tên Chi Tiết Nhân Khẩu` bị ẩn triệt để.
2. **Kiểm tra quyền đa tầng (Multi-layer Guard):**
   * Mọi hành động ghi dữ liệu (`insert`, `update`, `delete`, `import`, `approve`) trong `LuongHauGisDatabase` đều gọi hàm kiểm tra:
     ```javascript
     function checkGisPermission(requiredRole, currentUser) {
       if (!currentUser) return false;
       const hierarchy = { 'ADMIN': 5, 'BI_THU': 4, 'TO_TRUONG': 3, 'CAN_BO': 2, 'DANG_VIEN': 1, 'CONG_DAN': 0 };
       return (hierarchy[currentUser.role] || 0) >= (hierarchy[requiredRole] || 0);
     }
     ```
3. **Chống giả mạo vai trò:**
   * Không lưu quyền hạn ở biến toàn cục mở có thể ghi đè bằng console mà không thông qua cơ chế ký duyệt phiên (Session Token Signature) hoặc kiểm soát đối chiếu với kho tài khoản hệ thống.
