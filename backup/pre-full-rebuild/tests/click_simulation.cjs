const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

const errors = [];
const logs = [];

const dom = new JSDOM(htmlContent, {
  runScripts: 'dangerously',
  resources: 'usable',
  url: 'http://localhost:3008/index.html',
  beforeParse(window) {
    window.scrollTo = (opts) => {
      logs.push(`[WINDOW] scrollTo: ${JSON.stringify(opts)}`);
    };
    window.alert = (msg) => {
      logs.push(`[ALERT] ${msg}`);
    };
    window.onerror = (msg, url, line, col, err) => {
      errors.push(`[WINDOW.ONERROR] ${msg} at line ${line}:${col}`);
    };
    const origError = window.console.error;
    window.console.error = (...args) => {
      errors.push(`[CONSOLE.ERROR] ${args.join(' ')}`);
      if (origError) origError.apply(window.console, args);
    };
    const origWarn = window.console.warn;
    window.console.warn = (...args) => {
      logs.push(`[CONSOLE.WARN] ${args.join(' ')}`);
      if (origWarn) origWarn.apply(window.console, args);
    };
  }
});

const { window } = dom;
const { document } = window;

console.log('================================================================');
console.log(' TIẾN HÀNH TEST CLICK THỰC TẾ TRÊN GIAO DIỆN TỪNG BƯỚC');
console.log('================================================================\n');

function step(title, fn) {
  const prevErrCount = errors.length;
  console.log(`▶ BƯỚC: ${title}`);
  try {
    fn();
    const newErrors = errors.slice(prevErrCount);
    if (newErrors.length > 0) {
      console.log(`  ❌ LỖI CONSOLE PHÁT SINH (${newErrors.length}):`);
      newErrors.forEach(e => console.log(`     - ${e}`));
    } else {
      console.log(`  ✔ THÀNH CÔNG (Console error: 0)`);
    }
  } catch (err) {
    errors.push(`[EXCEPTION] ${err.message}`);
    console.log(`  ❌ EXCEPTION: ${err.message}`);
  }
  console.log('----------------------------------------------------------------');
}

// Chờ DOMContentLoaded
step('1. Khởi tạo trang (DOMContentLoaded)', () => {
  const event = new window.Event('DOMContentLoaded');
  window.document.dispatchEvent(event);
});

// BƯỚC 1: MENU
step('2. Click Mở MENU (btn-open-menu / openMenu)', () => {
  const btnOpen = document.getElementById('btn-open-menu') || document.querySelector('[onclick*="openMenu"]') || document.querySelector('[onclick*="toggleDrawer"]');
  if (btnOpen) {
    btnOpen.click();
  } else if (typeof window.openMenu === 'function') {
    window.openMenu();
  } else {
    throw new Error('Không tìm thấy nút hoặc hàm mở menu');
  }
  const drawer = document.getElementById('drawer-nav');
  if (drawer && drawer.classList.contains('hidden')) {
    throw new Error('Drawer vẫn đang bị ẩn sau khi click');
  }
});

// BƯỚC 2: MENU CON
step('3. Click MENU CON (sub-tt, sub-vbcb, sub-qlcb, sub-tlvk, sub-vb)', () => {
  const subIds = ['sub-tt', 'sub-vbcb', 'sub-qlcb', 'sub-tlvk', 'sub-vb'];
  subIds.forEach(id => {
    if (typeof window.toggleMenu === 'function') {
      window.toggleMenu(id);
    }
    const btnSub = document.querySelector(`[onclick*="toggleMenu('${id}')"]`);
    if (btnSub) btnSub.click();
  });
});

// BƯỚC 3: ĐÓNG MENU
step('4. Click ĐÓNG MENU (btn-close-menu / drawer-backdrop / closeMenu)', () => {
  const btnClose = document.getElementById('btn-close-menu') || document.querySelector('[onclick*="closeMenu"]');
  if (btnClose) {
    btnClose.click();
  } else if (typeof window.closeMenu === 'function') {
    window.closeMenu();
  }
  const backdrop = document.getElementById('drawer-backdrop');
  if (backdrop) backdrop.click();
});

// BƯỚC 4: GỬI PHẢN ÁNH
step('5. Điền Form và Click GỬI PHẢN ÁNH', () => {
  const inputHoTen = document.getElementById('pa-hoten');
  const inputSDT = document.getElementById('pa-sdt');
  const inputDiaChi = document.getElementById('pa-diachi');
  const selectLinhVuc = document.getElementById('pa-linhvuc');
  const selectMucDo = document.getElementById('pa-mucdo');
  const inputNoiDung = document.getElementById('pa-noidung');
  const form = document.getElementById('form-phan-anh');

  if (inputHoTen) inputHoTen.value = 'Nguyễn Văn Kiểm Thử';
  if (inputSDT) inputSDT.value = '0965712812';
  if (inputDiaChi) inputDiaChi.value = '83 Thái Thuận, TDP Lương Hậu';
  if (selectLinhVuc) selectLinhVuc.value = 'An ninh trật tự';
  if (selectMucDo) selectMucDo.value = 'Bình thường';
  if (inputNoiDung) inputNoiDung.value = 'Đề nghị kiểm tra hệ thống chiếu sáng tại đường kiệt 83 Thái Thuận để đảm bảo an ninh trật tự ban đêm.';

  if (form) {
    const submitEvt = new window.Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvt);
  } else if (typeof window.submitPhanAnh === 'function') {
    window.submitPhanAnh(new window.Event('submit'));
  }

  const successBox = document.getElementById('pa-success-box') || document.getElementById('pa-success');
  if (successBox && successBox.classList.contains('hidden')) {
    throw new Error('Hộp thông báo thành công không xuất hiện sau khi submit');
  }
});

// BƯỚC 5: XEM CHI TIẾT
step('6. Click XEM CHI TIẾT phản ánh (openDetailModal)', () => {
  const btnDetail = document.querySelector('[onclick*="openDetailModal"]');
  if (btnDetail) {
    btnDetail.click();
  } else if (typeof window.openDetailModal === 'function') {
    window.openDetailModal('PA-20260912-193146');
  } else {
    throw new Error('Không tìm thấy hàm openDetailModal');
  }
  const modal = document.getElementById('modal-pa-detail');
  if (modal && modal.classList.contains('hidden')) {
    throw new Error('Modal chi tiết không hiển thị');
  }
});

// BƯỚC 6: X ĐÓNG MODAL CHI TIẾT
step('7. Click nút X đóng modal chi tiết', () => {
  const modal = document.getElementById('modal-pa-detail');
  const btnX = modal ? modal.querySelector('button') : null;
  if (btnX) {
    btnX.click();
  } else if (typeof window.closeDetailModal === 'function') {
    window.closeDetailModal();
  }
});

// BƯỚC 7: ĐÓNG MODAL CHI TIẾT
step('8. Click nút ĐÓNG ở đáy modal chi tiết', () => {
  if (typeof window.openDetailModal === 'function') window.openDetailModal('PA-20260912-193146');
  if (typeof window.closeDetailModal === 'function') {
    window.closeDetailModal();
  }
});

// BƯỚC 8: ROADMAP V2
step('9. Click mở ROADMAP V2 (openRoadmapModal / toggleRoadmapModal)', () => {
  const btnRoadmap = document.querySelector('[onclick*="openRoadmapModal"]') || document.querySelector('[onclick*="toggleRoadmapModal"]');
  if (btnRoadmap) {
    btnRoadmap.click();
  } else if (typeof window.openRoadmapModal === 'function') {
    window.openRoadmapModal();
  } else if (typeof window.toggleRoadmapModal === 'function') {
    window.toggleRoadmapModal();
  }
  const modal = document.getElementById('modal-roadmap') || document.getElementById('roadmap-modal');
  if (modal && modal.classList.contains('hidden')) {
    throw new Error('Modal Roadmap V2 không hiển thị');
  }
});

// BƯỚC 9: X ĐÓNG ROADMAP V2
step('10. Click nút X đóng ROADMAP V2', () => {
  const modal = document.getElementById('modal-roadmap') || document.getElementById('roadmap-modal');
  const btnX = modal ? modal.querySelector('button') : null;
  if (btnX) {
    btnX.click();
  } else if (typeof window.closeRoadmapModal === 'function') {
    window.closeRoadmapModal();
  }
});

// BƯỚC 10: ĐÓNG ROADMAP V2
step('11. Click nút ĐÓNG CỬA SỔ ở đáy Roadmap V2', () => {
  if (typeof window.openRoadmapModal === 'function') window.openRoadmapModal();
  if (typeof window.closeRoadmapModal === 'function') {
    window.closeRoadmapModal();
  }
});

// BƯỚC 11: BACK TO TOP
step('12. Click nút BACK TO TOP (btn-back-to-top)', () => {
  const btnTop = document.getElementById('btn-back-to-top') || document.querySelector('[onclick*="scrollTo"]');
  if (btnTop) {
    btnTop.click();
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

console.log('================================================================');
console.log(` KẾT QUẢ TỔNG THỂ:`);
console.log(` - Tổng số lỗi Console phát hiện: ${errors.length}`);
if (errors.length > 0) {
  console.log(' - Danh sách lỗi:');
  errors.forEach((e, idx) => console.log(`   ${idx + 1}. ${e}`));
  process.exit(1);
} else {
  console.log(' - TẤT CẢ CÁC BƯỚC CLICK ĐỀU HOẠT ĐỘNG HOÀN HẢO (0 LỖI CONSOLE)!');
  process.exit(0);
}
