/* Harness kiểm thử toàn diện Cổng thông tin điện tử Tổ dân phố Lương Hậu */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
const results = [];

function check(name, cond, extra) {
  results.push({ name, ok: !!cond, extra: extra === undefined ? "" : String(extra) });
}

function loadDOM(filePath) {
  let html = fs.readFileSync(path.join(ROOT, filePath), "utf8");
  // Bỏ các script CDN ngoài để tránh lỗi mạng trong jsdom
  html = html.replace(/<script[^>]*src="https?:\/\/[^"]*"[^>]*><\/script>/gi, "");

  const errors = [];
  const vc = new (require("jsdom").VirtualConsole)();
  vc.on("jsdomError", (e) => errors.push("jsdomError: " + (e.stack || e.message)));
  vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));

  const dom = new JSDOM(html, {
    url: "http://localhost:4321/" + filePath.replace(/\\/g, "/"),
    runScripts: "dangerously",
    virtualConsole: vc,
  });

  const { window } = dom;
  window.onerror = (m, src, l, c, e) => errors.push("onerror: " + m);
  window.URL.createObjectURL = () => "blob:mock";
  window.URL.revokeObjectURL = () => {};
  window.print = () => {};
  window.scrollTo = () => {};
  window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  window.fetch = () => Promise.resolve({
    ok: true,
    text: () => Promise.resolve("/* mock */"),
    json: () => Promise.resolve({ table: { rows: [] } }),
  });

  return { dom, window, errors, tick: () => new Promise((r) => setTimeout(r, 80)) };
}

/* ==================== 1. KIỂM THỬ TRANG CÔNG KHAI (index.html) ==================== */
async function testPublicPortal() {
  const { window, errors, tick } = loadDOM("index.html");
  await tick();
  const d = window.document;
  const $ = (s) => d.querySelector(s);
  const $$ = (s) => Array.from(d.querySelectorAll(s));

  check("[PUBLIC] Không có lỗi runtime JS khi load trang", errors.length === 0, errors.join(" | "));
  check("[PUBLIC] Tiêu đề trang chứa TDP Lương Hậu", d.title.includes("Lương Hậu"));
  
  // Masthead & Hotline
  const bodyText = d.body.textContent;
  check("[PUBLIC] Chứa SĐT Bí thư Chi bộ: 0962.481.112", bodyText.includes("0962.481.112") || bodyText.includes("0962 481 112"));
  check("[PUBLIC] Chứa SĐT Tổ trưởng TDP: 0965.712.812", bodyText.includes("0965.712.812") || bodyText.includes("0965 712 812"));
  check("[PUBLIC] Chứa địa chỉ Nhà SHCĐ: 83 Thái Thuận", bodyText.includes("83 Thái Thuận"));

  // Nút liên kết nội bộ
  const linkNoiBo = $('a[href="noi_bo.html"]') || $('a[href="/noi_bo"]') || $('a[href="/noi-bo"]');
  check("[PUBLIC] Có liên kết dẫn tới khu nội bộ Chi bộ", !!linkNoiBo);

  // Danh sách cán bộ TDP (10 đồng chí)
  check("[PUBLIC] Hiển thị danh sách Cán bộ TDP Lương Hậu", bodyText.includes("Hồ Văn Mão") && bodyText.includes("Nguyễn Trọng Nghĩa") && bodyText.includes("Hoàng Hữu Rớt"));

  // Kho biểu mẫu (Google Drive)
  const bieuMauLinks = $$('a[href*="drive.google.com"]');
  check("[PUBLIC] Có các nút tải biểu mẫu qua Google Drive", bieuMauLinks.length >= 1, `Tìm thấy ${bieuMauLinks.length} liên kết Drive`);

  // Modal văn bản chỉ đạo điều hành 3 cấp
  check("[PUBLIC] Hàm openVanBanModal được khai báo", typeof window.openVanBanModal === "function");
  if (typeof window.openVanBanModal === "function") {
    window.openVanBanModal("vb-antt-baolu");
    const modalVB = $("#modal-van-ban-toan-van");
    const bodyVB = $("#vb-modal-body") ? $("#vb-modal-body").textContent : "";
    check("[PUBLIC] openVanBanModal('vb-antt-baolu') mở thành công", modalVB && !modalVB.classList.contains("hidden") && bodyVB.length > 0, bodyVB.slice(0, 50));
    
    if (typeof window.closeVanBanModal === "function") {
      window.closeVanBanModal();
      check("[PUBLIC] closeVanBanModal đóng modal thành công", modalVB && modalVB.classList.contains("hidden"));
    }
  }

  // Modal bài viết chi tiết
  check("[PUBLIC] Hàm openArticleByKey được khai báo", typeof window.openArticleByKey === "function");
  if (typeof window.openArticleByKey === "function") {
    window.openArticleByKey("chu-nhat-xanh");
    const modalArt = $("#modal-bai-viet");
    const titleArt = $("#modal-article-title") ? $("#modal-article-title").textContent : "";
    check("[PUBLIC] openArticleByKey('chu-nhat-xanh') mở bài viết đúng", modalArt && !modalArt.classList.contains("hidden") && titleArt.includes("Chủ nhật xanh"), titleArt);
    
    if (typeof window.closeArticleModal === "function") {
      window.closeArticleModal();
      check("[PUBLIC] closeArticleModal đóng modal thành công", modalArt && modalArt.classList.contains("hidden"));
    }
  }

  // Tiện ích số & Lộ trình V2 Modal
  check("[PUBLIC] Hàm openRoadmapModal được khai báo", typeof window.openRoadmapModal === "function");
  if (typeof window.openRoadmapModal === "function") {
    window.openRoadmapModal();
    const modalRoadmap = $("#modal-roadmap-v2");
    check("[PUBLIC] openRoadmapModal mở modal Lộ trình V2 thành công", modalRoadmap && !modalRoadmap.classList.contains("hidden"));
    if (typeof window.closeRoadmapModal === "function") {
      window.closeRoadmapModal();
      check("[PUBLIC] closeRoadmapModal đóng modal Lộ trình V2 thành công", modalRoadmap && modalRoadmap.classList.contains("hidden"));
    }
  }

  // Form phản ánh công dân & Validation
  const formPA = $("#form-phan-anh");
  check("[PUBLIC] Có Form Tiếp nhận Phản ánh kiến nghị", !!formPA);

  if (typeof window.submitPhanAnhMoi === "function") {
    // 1. Test validation chặn submit rỗng / ngắn
    const inputName = $("#pa-hoten");
    const inputSdt = $("#pa-sdt");
    const inputNoiDung = $("#pa-noidung");
    const paErr = $("#pa-error-msg");

    if (inputName && inputSdt && inputNoiDung) {
      inputName.value = "Nguyễn Văn A";
      inputSdt.value = "123"; // Sai SĐT
      inputNoiDung.value = "Ngắn"; // Dưới 20 ký tự
      
      const mockEvent = { preventDefault: () => {} };
      window.submitPhanAnhMoi(mockEvent);
      check("[PUBLIC] Form chặn submit khi SĐT sai hoặc nội dung < 20 ký tự", paErr && !paErr.classList.contains("hidden"), paErr ? paErr.textContent : "");

      // 2. Test submit hợp lệ
      inputName.value = "Trần Thị Kiểm Tra";
      inputSdt.value = "0965712812";
      inputNoiDung.value = "Đèn đường khu vực Đội 9 đoạn gần Nhà sinh hoạt cộng đồng bị cháy bóng, đề nghị Ban cán sự kiểm tra thay thế.";
      
      window.submitPhanAnhMoi(mockEvent);
      await tick();

      const storedPA = JSON.parse(window.localStorage.getItem("lh.phananh") || "[]");
      check("[PUBLIC] Lưu phản ánh vào localStorage (lh.phananh)", storedPA.length >= 1 && storedPA[0].ma.startsWith("PA-"), storedPA[0] ? storedPA[0].ma : "Không có mã");
      
      const successBox = $("#pa-success-box");
      check("[PUBLIC] Hiển thị Hộp thông báo thành công có mã tra cứu", successBox && !successBox.classList.contains("hidden"));

      // 3. Test bảng lịch sử phản ánh hiển thị có che số điện thoại
      const tableBody = $("#table-phan-anh-body");
      check("[PUBLIC] Bảng phản ánh cập nhật bản ghi mới với SĐT đã che", tableBody && tableBody.textContent.includes("0965***812") && tableBody.textContent.includes("Trần Thị Kiểm Tra"));

      // 4. Test xem chi tiết phản ánh
      if (storedPA.length > 0 && typeof window.openDetailModal === "function") {
        window.openDetailModal(storedPA[0].ma);
        const detailModal = $("#modal-detail-phan-anh");
        check("[PUBLIC] Mở Modal chi tiết phản ánh thành công", detailModal && !detailModal.classList.contains("hidden"));
        if (typeof window.closeDetailModal === "function") {
          window.closeDetailModal();
          check("[PUBLIC] Đóng Modal chi tiết phản ánh thành công", detailModal && detailModal.classList.contains("hidden"));
        }
      }
    }
  }

  window.close();
}

/* ==================== 2. KIỂM THỬ KHU VỰC NỘI BỘ (noi_bo.html) ==================== */
async function testInternalPortal() {
  const { window, errors, tick } = loadDOM("noi_bo.html");
  const d = window.document;
  const $ = (s) => d.querySelector(s);
  const $$ = (s) => Array.from(d.querySelectorAll(s));

  check("[NOIBO] Không có lỗi runtime JS khi load trang", errors.length === 0, errors.join(" | "));

  // 1. Kiểm tra trạng thái bảo mật ban đầu
  const authModal = $("#auth-modal");
  const mainApp = $("#main-app");
  check("[NOIBO] Mặc định hiển thị Lớp bảo mật xác thực phiên nội bộ", authModal && !authModal.classList.contains("hidden"));
  check("[NOIBO] Mặc định ẩn giao diện chính (main-app)", mainApp && mainApp.classList.contains("hidden"));
  check("[NOIBO] Đã loại bỏ hoàn toàn các nút bypass đăng nhập nhanh / demo", !$("#demo-btn") && !bodyHasText(d, "Đăng nhập nhanh"));

  // 2. Kiểm tra hàm xác thực Đảng viên (verifyPartyMember)
  check("[NOIBO] Hàm verifyPartyMember được khai báo", typeof window.verifyPartyMember === "function");
  
  const nameInput = $("#input-fullname");
  const dobInput = $("#input-dob");
  const authErr = $("#auth-err-msg");

  // Case 2a: Họ tên không có trong danh sách 22 Đảng viên
  if (nameInput && dobInput && typeof window.verifyPartyMember === "function") {
    nameInput.value = "Người Lạ Không Có Tên";
    dobInput.value = "01/01/1990";
    window.verifyPartyMember({ preventDefault: () => {} });
    check("[NOIBO] Từ chối người không có trong danh sách 22 Đảng viên (QĐ 46-QĐ/ĐU)", authErr && !authErr.classList.contains("hidden") && authErr.textContent.includes("không khớp"), authErr ? authErr.textContent : "");

    // Case 2b: Đúng họ tên nhưng sai ngày sinh
    nameInput.value = "Hồ Văn Mão";
    dobInput.value = "01/01/1970";
    window.verifyPartyMember({ preventDefault: () => {} });
    check("[NOIBO] Từ chối khi sai Ngày tháng năm sinh", authErr && !authErr.classList.contains("hidden"));

    // Case 2c: Nhập đúng chuẩn (chấp nhận cả không dấu, khoảng trắng thừa, năm sinh)
    nameInput.value = "  hồ   văn MÃO ";
    dobInput.value = "1989";
    window.verifyPartyMember({ preventDefault: () => {} });
    await tick();

    check("[NOIBO] Xác thực thành công Đảng viên Hồ Văn Mão", mainApp && !mainApp.classList.contains("hidden") && authModal && authModal.classList.contains("hidden"));
    check("[NOIBO] Lưu phiên làm việc vào sessionStorage/localStorage (lh.nb.session)", !!window.sessionStorage.getItem("lh.nb.session"));
    
    const userDisplay = $("#user-display-name");
    check("[NOIBO] Hiển thị phiên làm việc của Bí thư Chi bộ Hồ Văn Mão", userDisplay && userDisplay.textContent.includes("Hồ Văn Mão") && userDisplay.textContent.includes("Bí thư Chi bộ"));

    // 3. Kiểm tra các chức năng bên trong sau khi đăng nhập thành công
    // 3a. Xem văn bản nội bộ
    check("[NOIBO] Hàm viewInternalDoc được khai báo", typeof window.viewInternalDoc === "function");
    const docLinks = $$('#van-ban-chi-bo a[onclick*="viewInternalDoc"]');
    check("[NOIBO] Có danh sách văn bản Chi bộ (Nghị quyết 09-NQ/CB, Tờ trình 11, v.v.)", docLinks.length >= 5, `Tìm thấy ${docLinks.length} văn bản`);

    if (docLinks.length > 0 && typeof window.viewInternalDoc === "function") {
      window.viewInternalDoc(docLinks[0]);
      const modalDoc = $("#modal-internal-doc");
      check("[NOIBO] Mở Modal xem chi tiết văn bản Chi bộ", modalDoc && !modalDoc.classList.contains("hidden"));
      if (typeof window.closeDocModal === "function") {
        window.closeDocModal();
        check("[NOIBO] Đóng Modal xem chi tiết văn bản Chi bộ", modalDoc && modalDoc.classList.contains("hidden"));
      }
    }

    // 3b. Dashboard nhiệm vụ 6 Rõ (10 Cán bộ)
    check("[NOIBO] Hàm toggleDashboard được khai báo", typeof window.toggleDashboard === "function");
    if (typeof window.toggleDashboard === "function") {
      window.toggleDashboard();
      const dashContent = $("#content-dashboard");
      check("[NOIBO] toggleDashboard mở được Dashboard nhiệm vụ 6 Rõ", dashContent && !dashContent.classList.contains("hidden"));
      check("[NOIBO] Dashboard chứa KPI 87.0% và XUẤT SẮC", dashContent && dashContent.textContent.includes("87") && /xuất sắc/i.test(dashContent.textContent));
    }

    // 3c. Đăng xuất
    check("[NOIBO] Hàm logoutPartyMember được khai báo", typeof window.logoutPartyMember === "function");
    if (typeof window.logoutPartyMember === "function") {
      window.logoutPartyMember();
      check("[NOIBO] Đăng xuất khóa lại giao diện và hiện Auth Modal", authModal && !authModal.classList.contains("hidden") && mainApp && mainApp.classList.contains("hidden"));
      check("[NOIBO] Đã xóa session khi đăng xuất", !window.sessionStorage.getItem("lh.nb.session"));
    }

    // 4. Kiểm tra Rate Limiting (Khóa sau 5 lần sai)
    window.localStorage.removeItem("lh_auth_fails");
    window.localStorage.removeItem("lh_auth_lock_until");
    for (let i = 0; i < 5; i++) {
      nameInput.value = "Sai Lần " + i;
      dobInput.value = "2000";
      window.verifyPartyMember({ preventDefault: () => {} });
    }
    check("[NOIBO] Cơ chế Rate Limiting: Khóa 5 phút khi sai liên tiếp 5 lần", authErr && authErr.textContent.includes("quá 5 lần") || authErr.textContent.includes("tạm khóa"));
  }

  window.close();
}

function bodyHasText(d, str) {
  return (d.body ? d.body.textContent : "").includes(str);
}

/* ==================== 3. CHẠY TOÀN BỘ KIỂM THỬ ==================== */
(async () => {
  console.log("================================================================");
  console.log(" BẮT ĐẦU BỘ KIỂM THỬ TOÀN DIỆN CỔNG TTĐT TDP LƯƠNG HẬU");
  console.log("================================================================\n");

  try {
    await testPublicPortal();
    await testInternalPortal();
  } catch (e) {
    results.push({ name: "LỖI HỆ THỐNG KIỂM THỬ: " + e.message, ok: false, extra: e.stack ? e.stack.split("\n")[1] : "" });
  }

  const bad = results.filter((r) => !r.ok);
  results.forEach((r) => {
    const mark = r.ok ? "  ✔ [PASS] " : "  ✖ [FAIL] ";
    console.log(mark + r.name + (r.extra ? "  -->  (" + r.extra.slice(0, 140) + ")" : ""));
  });

  console.log("\n" + "=".repeat(64));
  console.log(` TỔNG CỘNG: ${results.length} bài test | ĐẠT: ${results.length - bad.length} | LỖI: ${bad.length}`);
  console.log("=".repeat(64));

  process.exit(bad.length ? 1 : 0);
})();
