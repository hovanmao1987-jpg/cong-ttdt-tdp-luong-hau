# AGENTS.md — Chỉ dẫn cho AI Agent (Google Antigravity)

> Tệp này dành cho **Agent**, không phải cho người dùng cuối.
> Dự án: **Cổng TTĐT Tổ dân phố Lương Hậu — phường Hương Thủy, thành phố Huế.**

---

## 1. Yêu cầu người dùng thường gặp → làm gì

| Người dùng nói | Việc cần làm |
|---|---|
| “Khởi chạy local server và mở trình duyệt chế độ Mobile để kiểm tra index.html và noi_bo.html” | Chạy nền `npm run serve` (cổng **4321**, bind `0.0.0.0`). Server **tự chèn thanh công cụ Mobile** (360/390/414/520/768/full). Mở `/` và `/noi-bo`. Xem `astro/server.mjs` để biết bảng route. |
| “Sửa tin tức / thêm tin / đổi số liệu” | **Chỉ sửa `data/portal-data.mjs`**, rồi chạy `npm run build`. Không sửa tay `data/data.js`, `index.html`, `noi_bo.html` (đều là tệp sinh tự động). |
| “Đổi bố cục / giao diện khu công khai” | Sửa `src/pages/index.astro` (bố cục) hoặc `assets/css/portal.css` (kiểu). Nếu đổi **cấu trúc HTML lặp lại** của một chuyên mục, sửa hàm `markup*()` trong `assets/js/lh-markup.js` — lõi này dùng chung cho cả bản tĩnh lẫn bản Astro. |
| “Đổi khu nội bộ / thêm tab / đổi danh sách đảng viên” | `data/portal-data.mjs` (`ROSTER`, `DOCS`, `DOCS_TW`, `TASKS`) + `assets/js/noi-bo.js` + `src/pages/noi_bo.astro`. |
| “Thêm/sửa biểu mẫu” | Danh mục: `FORMS` trong `data/portal-data.mjs`. **Nội dung file biểu mẫu**: hàm tương ứng trong `assets/js/templates.js` (`TPL.bm01` … `TPL.bm11`). |
| “Deploy Vercel” | `npm run build` → thư mục `dist/`. `vercel.json` đã cấu hình sẵn. Xem README mục 7. |
| “Kiểm tra / test” | `npm test` → phải đạt **102/102**. Nếu sửa dữ liệu làm đổi số lượng, cập nhật kỳ vọng trong `tests/test.cjs`. |

---

## 2. Quy trình build (bắt buộc theo đúng thứ tự)

```bash
npm run build
#   1. build:data    data/portal-data.mjs  →  data/data.js  (+ public/data/data.js)
#   2. sync          assets/ + data/       →  public/
#   3. astro:build   src/pages/*.astro     →  dist/
#   4. sync:static   dist/index.html       →  index.html      (viết lại path tuyệt đối → tương đối)
#                    dist/noi_bo/index.html→  noi_bo.html
```

**Hệ quả quan trọng:** `index.html` và `noi_bo.html` ở thư mục gốc **luôn bị ghi đè** bởi bước 4.
Mọi thay đổi nội dung/bố cục phải đi qua `data/portal-data.mjs` và `src/pages/*.astro`.

Nếu chỉ sửa `assets/js/*.js` hoặc `assets/css/portal.css` (không đổi markup):
```bash
npm run sync      # để bản Astro dist nhận tài nguyên mới
npm test
```

---

## 3. Kiến trúc cần nắm

```
                      ┌──────────────────────────────┐
data/portal-data.mjs  │  NGUỒN DỮ LIỆU DUY NHẤT (ESM) │
                      └──────────────┬───────────────┘
             ┌───────────────────────┴───────────────────────┐
   build-data.mjs                                     import trực tiếp
             │                                               │
   data/data.js (UMD, window.LH)                    src/pages/*.astro
   public/data/data.js                                       │
             │                                        astro build
   <script src> trên trình duyệt                             │
             │                                            dist/
             └──────────────► sync-static.mjs ◄──────────────┘
                                     │
                          index.html + noi_bo.html
```

* **`assets/js/lh-markup.js`** — lõi sinh HTML **thuần**, không đụng DOM. Viết kiểu UMD nên:
  * trình duyệt: `<script src>` → `window.LHM`
  * Node/Astro: `.astro` đọc file bằng `readFileSync` + `new Function("globalThis", src)(globalThis)` → `globalThis.LHM`
  * Dữ liệu được đọc **động** qua `Proxy` (`window.LH` hoặc `globalThis.LH`) → không phụ thuộc thứ tự nạp.
* **`assets/js/app.js`** — chỉ chứa logic trình duyệt. Kiểm tra cờ `window.LH_SSR`:
  * `false` (bản tĩnh): render HTML rồi gắn sự kiện.
  * `true` (bản Astro): **chỉ gắn sự kiện**, không render lại → giữ nguyên HTML SSR cho SEO.
  * Tất cả hàm gắn sự kiện đều có cờ `_bound` chống gắn trùng.
* **`assets/js/noi-bo.js`** — khu nội bộ. HTML tài liệu **không** được SSR; chỉ sinh ở client sau khi đối soát đạt.
* Đường dẫn trong `.astro` là **tuyệt đối** (`/assets/…`, `/data/…`); `sync-static.mjs` đổi thành **tương đối**
  để `index.html`/`noi_bo.html` mở được bằng `file://`.

---

## 4. Quy ước bắt buộc

1. **Tiếng Việt có dấu đầy đủ** trong toàn bộ nội dung hiển thị. Không để lọt ký tự Hán/full-width.
2. **Không thêm CDN, font ngoài, thư viện JS bên thứ ba.** Dự án phải chạy offline và mở được bằng `file://`.
3. **Không dùng `fetch()` để nạp dữ liệu nội bộ** — dữ liệu nạp qua `<script src="data/data.js">` (UMD).
4. Icon/ảnh minh hoạ: dùng **SVG nội tuyến** (xem `M.ic()` và `M.thumb()` trong `lh-markup.js`).
5. Không truy cập form theo tên (`form.hoten`) — **luôn dùng** `querySelector('[name="…"]')`
   (truy cập theo tên không ổn định giữa các môi trường; đây là lỗi đã gặp).
6. Ghi đè `HTMLAnchorElement.prototype.click` trong test sẽ làm **mất listener** — dùng
   `window.addEventListener("click", …, true)` để bắt link tải file (xem `tests/test.cjs`).
7. Số liệu công khai phải khớp nhau giữa các nơi: **469 hộ · 1.947 nhân khẩu · 22 đảng viên · 4 khu vực (Đội 8, 9, 10, 11) · 10 cán bộ**.
8. TDP Lương Hậu chia **4 khu vực = Đội 8, Đội 9, Đội 10, Đội 11**. Không dùng khái niệm “11 tổ liên gia” nữa.
   Mỗi đảng viên có trường `doi` (địa bàn phụ trách); mỗi cán bộ có `linhVuc` + `doi`.
9. **Không** đưa nội dung “camera an ninh” và “bảng nhật ký tuần tra đêm” trở lại — Chi bộ đã yêu cầu gỡ.
9. Danh sách nhân sự là **DỮ LIỆU THẬT** (10 cán bộ TDP trong `CADRES`, 22 đảng viên trong `ROSTER` theo
   Quyết định 46-QĐ/ĐU ngày 30/6/2026). Đổi tên ở một chỗ thì phải đổi ở **tất cả** chỗ liên quan:
   `CADRES`, `ROSTER`, `TASKS`, `PCTT.lucLuong`, `PCTT.diemXungYeu`, `ANTT.nhatKy`, `NEWS`, `DOCS.ky`,
   `AUDIT_SEED` và chuỗi hard-code trong `assets/js/app.js` (nút “Báo tin ANTT”, 3 điểm sơ tán).
10. Đối soát khu nội bộ = **họ tên + ngày/tháng/năm sinh** (`norm()` + `dateKey()`), **không dùng CCCD**.
    Trường nhập liệu là `#in-name` và `#in-ns`.
10. Tiến độ “6 Rõ”: tổng `pct` của 10 nhiệm vụ = **870** → bình quân **87,0 %** → xếp loại **XUẤT SẮC**.

---

## 5. Red lines — KHÔNG được làm

* ❌ Không đưa **CCCD/số định danh, nội dung văn bản mật** của Chi bộ vào mã nguồn.
* ❌ Không đưa **họ tên + ngày sinh đảng viên** (`ROSTER`) ra **trang công khai** hoặc SSR vào HTML tĩnh —
  chỉ được hiển thị trong khu nội bộ sau khi đối soát. Chỉ 10 cán bộ `CADRES` mới được công khai.
* ❌ Không thêm lại nút “Điền dữ liệu đối soát minh hoạ” (`#demo-btn`) — đã gỡ vì dữ liệu là thật.
* ❌ Không commit `VAN-HANH-NOI-BO.md` và dữ liệu cá nhân lên kho **công khai** (chỉ để kho riêng tư).
* ❌ Không SSR nội dung khu nội bộ (văn bản Chi bộ, danh sách đảng viên, số liệu “6 Rõ”) ra HTML tĩnh.
  Trang `noi_bo.astro` phải giữ `noindex` và chỉ render lớp bảo mật.
* ❌ Không nới lỏng lớp bảo mật (số lần sai tối đa, thời gian khoá, thời gian hết phiên).
* ❌ Không sửa tay `data/data.js`, `index.html`, `noi_bo.html`, `public/**`, `dist/**`.
* ❌ Không để lộ `ROSTER` qua API công khai khi chuyển đối soát về server.

---

## 6. Kiểm tra sau khi sửa (checklist)

```bash
npm run build      # không lỗi
npm test           # 102/102 ĐẠT
npm run serve      # mở / và /noi-bo, thử ở viewport 390px
```

Kiểm tra thủ công tối thiểu:
- [ ] Trang công khai: 4 tab tin tức lọc đúng; mở 1 tin thấy modal; tải 1 biểu mẫu `.doc` mở được bằng Word/WPS.
- [ ] Mục “Cán bộ chủ chốt” hiện đúng 10 người thật: Hồ Văn Mão → Phạm Thị Thu Thanh, kèm SĐT công khai.
- [ ] Form phản ánh: submit rỗng → báo lỗi đúng ô; nhập hợp lệ → hiện mã `PA-…`.
- [ ] `/noi-bo`: nhập họ tên ngoài danh sách → từ chối; nhập đúng họ tên sai ngày sinh → từ chối;
      nhập `Hồ Văn Mão` + `02/02/1989` → vào được (thử cả dạng không dấu `ho van mao` và `02-02-1989`).
- [ ] Khu nội bộ: đủ 6 tab; Dashboard “6 Rõ” hiện 10 cán bộ và **87,0 % XUẤT SẮC**; nút “Danh sách 22 đảng viên” hiện đủ 22 dòng.
- [ ] 2 nút “Văn kiện Đảng” / “Văn bản của Đảng” mở đúng `tulieuvankien.dangcongsan.vn`.
- [ ] 4 văn bản TW: 556-QĐ/VPTW, 213-KH/VPTW, 91-KL/TW, 27-NQ/TW.
- [ ] View-source `/noi_bo`: **không** thấy CCCD, họ tên đảng viên, ngày sinh, trích yếu văn bản, số liệu “6 Rõ”.

---

## 7. Lệnh tắt cho Agent

```bash
npm run serve                                   # local server + mobile toolbar (port 4321)
PORT=8080 npm run serve                         # đổi cổng
npx astro dev --config astro/astro.config.mjs   # Astro dev (HMR)
npx astro build --config astro/astro.config.mjs # chỉ build Astro
npm test                                        # 106 kiểm tra
node astro/build-data.mjs                       # chỉ sinh data/data.js
node astro/sync-public.mjs                      # chỉ đồng bộ public/
node astro/sync-static.mjs                      # chỉ sinh 2 file tĩnh từ dist/
```

> Lưu ý: `astro.config.mjs` nằm trong thư mục `astro/` nên **mọi lệnh astro phải kèm**
> `--config astro/astro.config.mjs` (đã được bọc sẵn trong các script npm).
