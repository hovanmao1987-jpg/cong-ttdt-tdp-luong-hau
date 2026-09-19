# HƯỚNG DẪN CHẠY DỰ ÁN TRÊN GOOGLE ANTIGRAVITY
### Cổng TTĐT Tổ dân phố Lương Hậu — phường Hương Thủy, TP. Huế

---

## 1. TẢI GÌ TỪ WORKSPACE NÀY VỀ MÁY

Chỉ cần **MỘT tệp duy nhất**:

| Tệp | Dung lượng | Nội dung |
|---|---|---|
| **`cong-ttdt-tdp-luong-hau.zip`** | 264 KB · 52 tệp | Toàn bộ mã nguồn + dữ liệu + tài liệu |

Tệp này nằm ở thư mục gốc workspace (`/home/user/cong-ttdt-tdp-luong-hau.zip`) — bấm vào tên tệp trong khung
chat để tải về.

**Đã loại trừ khỏi ZIP** (không cần, vì tự sinh lại được):

| Thư mục/tệp | Lý do | Sinh lại bằng |
|---|---|---|
| `node_modules/` | Thư viện phụ thuộc (~40 MB) | `npm install` |
| `dist/` | Kết quả build Astro | `npm run build` |
| `.astro/`, `.npm/`, `.config/` | Bộ nhớ đệm tạm | tự sinh |

> Nếu muốn tải thủ công từng tệp thay vì ZIP, danh sách **bắt buộc** nằm ở mục 4 bên dưới.

---

## 2. CHẠY TRÊN ANTIGRAVITY — 3 BƯỚC

### Bước 1 — Giải nén và mở thư mục
1. Giải nén `cong-ttdt-tdp-luong-hau.zip` → được thư mục chứa `package.json`, `index.html`, `noi_bo.html`, `src/`, `assets/`, `data/`, `astro/`…
2. Mở **Google Antigravity** → **File → Open Folder…** → chọn thư mục vừa giải nén.
3. Antigravity sẽ tự nhận diện `AGENTS.md` và `README.md` làm ngữ cảnh cho Agent.

### Bước 2 — Cài phụ thuộc
Mở Terminal trong Antigravity (menu **Terminal → New Terminal**) và chạy:

```bash
npm install
```

Yêu cầu: **Node.js 18.17 trở lên** (khuyến nghị Node 20 LTS). Kiểm tra bằng `node -v`.
Nếu máy chưa có Node: tải tại <https://nodejs.org/> (chọn bản LTS).

### Bước 3 — Chạy và xem
```bash
npm run serve
```

Mở trình duyệt tại **<http://localhost:4321/>**

| URL | Nội dung |
|---|---|
| `http://localhost:4321/` | Khu công khai (`index.html`) |
| `http://localhost:4321/noi-bo` | Khu nội bộ Chi bộ (`noi_bo.html`) |
| `http://localhost:4321/noi-bo/dashboard` | Khu nội bộ → tab phân công “6 Rõ” |
| `http://localhost:4321/dist/index.html` | Bản Astro build (đối chiếu) |

Server tự chèn **thanh công cụ MOBILE** ở góc phải (360 / 390 / 414 / 520 / 768 / full)
để kiểm chuẩn Mobile V3 mà không cần mở DevTools. Ẩn bằng cách thêm `?ui=0` vào URL.

### Hoặc ra lệnh trực tiếp cho Agent trong Antigravity
Dán câu này vào khung chat của Agent:

> Khởi chạy local server và mở trình duyệt chế độ Mobile để kiểm tra index.html và noi_bo.html

---

## 3. ĐĂNG NHẬP KHU NỘI BỘ

Màn hình đối soát yêu cầu **2 thông tin**: họ và tên + ngày/tháng/năm sinh.

* Thử bằng tài khoản Bí thư Chi bộ: **Hồ Văn Mão** — ngày sinh **02/02/1989**
* Họ tên nhập **không dấu** được (`ho van mao`), không cần đúng khoảng trắng, không phân biệt hoa/thường.
* Ngày sinh chấp nhận `02/02/1989`, `02-02-1989`, `02.02.1989` hoặc gõ liền `02021989`.
* Sai 5 lần liên tiếp → tạm khoá 5 phút. Để 15 phút không thao tác → tự đăng xuất.

Danh sách đầy đủ 22 đảng viên được phép truy cập: xem `VAN-HANH-NOI-BO.md` mục 1.1.

> Nút “Điền dữ liệu đối soát minh hoạ” **đã bị gỡ** vì dữ liệu hiện là thật.

---

## 4. NẾU MUỐN TẢI THỦ CÔNG TỪNG TỆP

Danh sách **bắt buộc phải có**, giữ đúng cấu trúc thư mục:

```
package.json            ← khai báo phụ thuộc + các lệnh npm
package-lock.json       ← khoá phiên bản phụ thuộc (giúp npm install giống hệt)
tsconfig.json           ← cấu hình Astro/TypeScript
vercel.json             ← cấu hình deploy Vercel
.gitignore
.env.example
robots.txt              ← bản ở thư mục gốc (local server phục vụ)

index.html              ← TRANG CÔNG KHAI (mở bằng double-click được)
noi_bo.html             ← TRANG NỘI BỘ (mở bằng double-click được)

src/layouts/BaseLayout.astro
src/pages/index.astro
src/pages/noi_bo.astro
src/pages/noi-bo/index.astro
src/pages/noi-bo/dashboard.astro

assets/css/portal.css
assets/js/app.js
assets/js/lh-markup.js
assets/js/noi-bo.js
assets/js/templates.js

data/portal-data.mjs    ← NGUỒN DỮ LIỆU DUY NHẤT (sửa nội dung ở đây)
data/data.js            ← bản UMD sinh tự động (không sửa tay)

public/robots.txt
public/data/data.js     ← sinh tự động
public/assets/**        ← sinh tự động

astro/astro.config.mjs
astro/build-data.mjs
astro/server.mjs
astro/sync-public.mjs
astro/sync-static.mjs

tests/test.cjs          ← 106 kiểm tra tự động

README.md               ← tài liệu tổng quan
AGENTS.md               ← chỉ dẫn riêng cho Agent (Antigravity tự đọc)
VAN-HANH-NOI-BO.md      ← nghiệp vụ nội bộ + danh sách nhân sự
```

**Không cần tải**: `node_modules/`, `dist/`, `.astro/`, `.npm/`, `.config/`.

---

## 5. CÁC LỆNH NPM

| Lệnh | Tác dụng |
|---|---|
| `npm install` | Cài phụ thuộc (chạy **một lần** sau khi giải nén) |
| `npm run serve` | Chạy local server + thanh công cụ Mobile tại cổng 4321 |
| `npm run build` | Build toàn bộ: sinh `data/data.js` → đồng bộ `public/` → Astro build `dist/` → sinh lại `index.html` & `noi_bo.html` ở thư mục gốc |
| `npm test` | Chạy **106 kiểm tra tự động** (jsdom, không cần trình duyệt) |
| `npm run dev` | Chế độ dev của Astro (hot reload) |

**Sau mỗi lần sửa `data/portal-data.mjs` hoặc `src/**` → bắt buộc chạy `npm run build`** rồi mới `npm test`.

---

## 6. MỞ BẰNG DOUBLE-CLICK (KHÔNG CẦN CÀI GÌ)

Hai tệp `index.html` và `noi_bo.html` ở thư mục gốc là **bản tĩnh tự chứa**, dùng đường dẫn tương đối:

* Click đúp `index.html` → mở khu công khai trong trình duyệt.
* Click đúp `noi_bo.html` → mở khu nội bộ.

Điều kiện: phải giữ nguyên cấu trúc thư mục (`assets/`, `data/` nằm cùng cấp với 2 tệp HTML).
Cách này tiện để trình chiếu nhanh, nhưng **không dùng để vận hành khu nội bộ**
(vì `data/data.js` chứa danh sách 22 đảng viên sẽ tải được về máy người xem — xem mục 7).

---

## 7. LƯU Ý BẢO MẬT TRƯỚC KHI CÔNG BỐ

Dữ liệu nhân sự trong dự án là **THẬT** (10 cán bộ TDP + 22 đảng viên theo Quyết định 46-QĐ/ĐU ngày 30/6/2026).

* Đối soát hiện chạy **hoàn toàn phía trình duyệt** → tệp `data/data.js` phát xuống máy người xem,
  người có kỹ thuật đọc được toàn bộ danh sách. **Chưa đủ an toàn để công bố rộng rãi.**
* Trước khi đưa lên Internet, bắt buộc: chuyển danh sách + logic đối soát về **API máy chủ**,
  thêm **xác thực 2 lớp** (OTP/VNeID), ghi nhật ký về CSDL tập trung, chặn `/noi_bo` ở tầng máy chủ.
* Chỉ đẩy mã nguồn lên **kho Git riêng tư**. `VAN-HANH-NOI-BO.md` và `data/van-ban/` đã nằm trong `.gitignore`.
* Chi tiết đầy đủ: `README.md` mục 9 và `VAN-HANH-NOI-BO.md` mục 5.

---

## 8. DEPLOY LÊN VERCEL

1. Đẩy dự án lên một kho Git **riêng tư** (GitHub/GitLab).
2. Vào <https://vercel.com/new> → Import kho đó.
3. Vercel tự nhận framework **Astro** (đã cấu hình sẵn trong `vercel.json`):
   * Build command: `npm run build`
   * Output directory: `dist`
4. Deploy. `vercel.json` đã đặt sẵn header `X-Robots-Tag: noindex`, `Referrer-Policy: no-referrer`,
   `Cache-Control: no-store` cho `/noi_bo*` và rewrite `/noi-bo` → trang nội bộ.

Kiểm tra sau deploy: `/` hiện trang công khai · `/noi-bo` hiện màn hình đối soát ·
view-source `/noi_bo` **không** thấy họ tên/ngày sinh đảng viên.

---

## 9. XỬ LÝ SỰ CỐ KHI CHẠY TRÊN ANTIGRAVITY

| Hiện tượng | Nguyên nhân | Xử lý |
|---|---|---|
| `npm: command not found` | Máy chưa cài Node.js | Cài Node 20 LTS từ nodejs.org, mở lại Terminal |
| `astro: not found` khi build | Chưa chạy `npm install` | Chạy `npm install` trước |
| Cổng 4321 đã được sử dụng |tiến trình khác đang chiếm cổng | `PORT=4399 npm run serve`, hoặc tắt tiến trình cũ |
| Trang trắng khi mở `index.html` | Thiếu `data/data.js` hoặc `assets/` cùng cấp | Giữ nguyên cấu trúc thư mục, hoặc dùng `npm run serve` |
| Sửa dữ liệu nhưng trang không đổi | Chưa build lại | Chạy `npm run build` rồi tải lại trang (Ctrl+F5) |
| `npm test` báo lỗi | File test là `.cjs` (bắt buộc, vì `package.json` có `"type":"module"`) | Không đổi tên `tests/test.cjs` thành `.js` |
| Khu nội bộ không đăng nhập được | Nhập sai ngày sinh hoặc họ tên | Đối chiếu `VAN-HANH-NOI-BO.md` mục 1.1; thử `Hồ Văn Mão` + `02/02/1989` |
| Bị khoá 5 phút | Sai 5 lần liên tiếp | Chờ hết đếm ngược, hoặc F12 → Application → Local Storage → xoá khoá `lh.nb.lock` |
