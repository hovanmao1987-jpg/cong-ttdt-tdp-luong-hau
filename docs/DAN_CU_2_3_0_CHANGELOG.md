# NHẬT KÝ THAY ĐỔI CHI TIẾT – PHÂN HỆ QUẢN LÝ DÂN CƯ SỐ 2.3.0
**Dự án:** `cong-ttdt-tdp-luong-hau`  
**Phiên bản:** 2.3.0  
**Ngày phát hành:** 24/10/2026  
**Chế độ phát triển:** SAFE PATCH ONLY | ZERO REGRESSION  

---

## 1. TỔNG QUAN THAY ĐỔI
Bản vá bổ sung trọn vẹn phân hệ **Quản Lý Dân Cư Số Lương Hậu Version 2.3.0** phục vụ Chi bộ và Ban cán sự Tổ dân phố Lương Hậu, bao gồm 16 tiểu phân hệ nghiệp vụ, dữ liệu hạt nhân thực tế (466 hộ, 1.943 nhân khẩu), kết nối Google Sheets an toàn, và khả năng phòng chống rò rỉ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.

---

## 2. DANH SÁCH TỆP TIN TẠO MỚI (NEW FILES)

1. `assets/css/quan-ly-dan-cu.css`
   - *Mô tả:* Hệ thống kiểu dáng CSS độc lập, sử dụng biến CSS đồng bộ với Cổng thông tin (Đỏ cờ, Vàng kim, Xanh navy). Tối ưu responsive cho máy tính bảng, điện thoại di động Android và máy tính bàn.
2. `assets/js/quan-ly-dan-cu.js`
   - *Mô tả:* Lõi điều khiển toàn bộ logic phân hệ `window.QuanLyDanCu` với 16 tiểu phân hệ, bộ máy che dữ liệu CCCD/SĐT tự động, bộ phân tích Zalo Heuristics, trình quét OCR cục bộ, bộ lọc nâng cao, và xử lý kết nối Google Sheets 1 chiều.
3. `assets/js/dan-cu-seed.js`
   - *Mô tả:* Tệp dữ liệu cơ sở chứa 466 hộ gia đình và 1.943 nhân khẩu được trích xuất và chuẩn hóa từ bảng tính dân cư TDP Lương Hậu, nạp vào biến `window.DAN_CU_SEED_DATA`.
4. `data/dan_cu_seed.json`
   - *Mô tả:* Tập dữ liệu JSON hạt nhân chuẩn dùng cho kiểm thử tự động, sao lưu và nạp tự động khi khởi chạy.
5. `tests/test_dan_cu_2_3_0.cjs`
   - *Mô tả:* Kịch bản kiểm thử toàn diện với 39 bài test tự động bao phủ toàn bộ 16 tiểu phân hệ, bảo mật RBAC, cơ chế che số CCCD, phòng chống injection và kiểm thử hồi quy.
6. `scripts/prepare_dan_cu_seed.py`
   - *Mô tả:* Script chuẩn hóa dữ liệu từ file trích xuất thô `parsed_households.json` sang mô hình thực thể chuẩn của v2.3.0.
7. `docs/DAN_CU_2_3_0_ARCHITECTURE.md`
   - *Mô tả:* Tài liệu kiến trúc hệ thống, sơ đồ khối Mermaid và luồng xử lý dữ liệu.
8. `docs/DAN_CU_2_3_0_DATABASE.md`
   - *Mô tả:* Tài liệu thiết kế CSDL, sơ đồ ERD, các ràng buộc toàn vẹn và từ điển dữ liệu.
9. `docs/DAN_CU_2_3_0_SECURITY.md`
   - *Mô tả:* Chính sách bảo mật, ma trận phân quyền RBAC và giải pháp tuân thủ Nghị định 13/2023/NĐ-CP.
10. `docs/DAN_CU_2_3_0_TEST_REPORT.md`
    - *Mô tả:* Báo cáo kết quả kiểm thử tự động đạt tỷ lệ 39/39 (100%).
11. `docs/DAN_CU_2_3_0_USER_GUIDE.md`
    - *Mô tả:* Cẩm nang hướng dẫn sử dụng chi tiết 16 chức năng cho cán bộ cơ sở.
12. `docs/DAN_CU_2_3_0_CHANGELOG.md`
    - *Mô tả:* Nhật ký thay đổi chi tiết này.
13. `docs/DAN_CU_2_3_0_ROLLBACK.md`
    - *Mô tả:* Quy trình khôi phục và rollback an toàn.
14. `docs/DAN_CU_2_3_0_GOOGLE_SHEETS_GUIDE.md`
    - *Mô tả:* Hướng dẫn đồng bộ Google Sheets 1 chạm không dùng mã code và quy trình dự phòng.

---

## 3. DANH SÁCH TỆP TIN ĐÃ CHỈNH SỬA (MODIFIED FILES)

1. `admin.html`
   - *Thay đổi:* Nhúng tệp CSS `assets/css/quan-ly-dan-cu.css`, thêm mục menu `Quản Lý Dân Cư (v2.3.0)` trong thanh điều hướng bên trái, thêm container `<div class="cms-tab" id="tab-dan-cu">`, bổ sung nhánh routing `case 'dan-cu'` trong hàm `switchCmsTab()`, và nhúng các script `dan-cu-seed.js`, `quan-ly-dan-cu.js`.
2. `bi-thu.html`
   - *Thay đổi:* Bổ sung nút liên kết nhanh `Quản Lý Dân Cư Số ↗` tại khối công cụ điều hành của Bí thư Chi bộ.
3. `noi-bo.html`
   - *Thay đổi:* Bổ sung liên kết điều hướng đến phân hệ Dân cư số trên thanh điều hướng nội bộ.
4. `src/pages/noi_bo.astro`
   - *Thay đổi:* Đồng bộ liên kết Dân cư số và thêm thuộc tính `is:inline` cho thẻ nhúng script `zalo-notify.js` để bảo đảm trình biên dịch Astro không báo lỗi build.
5. `astro/sync-public.mjs`
   - *Thay đổi:* Thêm tệp CSS và JSON hạt nhân của phân hệ Dân cư vào danh mục đồng bộ tự động sang `public/`.
6. `package.json`
   - *Thay đổi:* Cập nhật lệnh `npm test` liên kết đến kịch bản kiểm thử `node tests/test_dan_cu_2_3_0.cjs`.

---

## 4. DANH SÁCH TỆP TIN BẢO TOÀN NGUYÊN VẸN (PRESERVED - ZERO REGRESSION)
- `index.html`: Giữ nguyên 100% mã nguồn, bố cục, cờ Đảng, cờ Tổ quốc, màu sắc và giao diện trang chủ công khai của TDP Lương Hậu.
- `bando.html`: Giữ nguyên 100% bản đồ GIS và dữ liệu không gian công cộng.
- `cms.html` và các trang chuyên mục: Giữ nguyên toàn bộ logic hiện hành.
