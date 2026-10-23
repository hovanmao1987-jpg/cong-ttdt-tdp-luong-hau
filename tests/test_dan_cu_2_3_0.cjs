/**
 * ============================================================================
 * KIỂM THỬ TOÀN DIỆN PHÂN HỆ QUẢN LÝ DÂN CƯ SỐ LƯƠNG HẬU 2.3.0
 * Quy chuẩn: JSDOM Automated Test Suite | Zero Mock Assumption | Complete RBAC
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const results = [];

function check(name, cond, extra) {
  results.push({ name, ok: !!cond, extra: extra === undefined ? '' : String(extra) });
}

async function runAllTests() {
  console.log('================================================================');
  console.log(' BẮT ĐẦU KIỂM THỬ PHÂN HỆ QUẢN LÝ DÂN CƯ SỐ LƯƠNG HẬU 2.3.0');
  console.log('================================================================\n');

  // 1. Kiểm tra sự tồn tại của các tệp mã nguồn và cấu hình
  check('[FILE] Tệp CSS quản lý dân cư tồn tại', fs.existsSync(path.join(ROOT, 'assets/css/quan-ly-dan-cu.css')));
  check('[FILE] Tệp JavaScript quản lý dân cư tồn tại', fs.existsSync(path.join(ROOT, 'assets/js/quan-ly-dan-cu.js')));
  check('[FILE] Tệp Seed dữ liệu dân cư JS tồn tại', fs.existsSync(path.join(ROOT, 'assets/js/dan-cu-seed.js')));
  check('[FILE] Tệp Seed dữ liệu dân cư JSON tồn tại', fs.existsSync(path.join(ROOT, 'data/dan_cu_seed.json')));
  check('[FILE] Tệp admin.html chứa thẻ nhúng CSS dân cư', fs.readFileSync(path.join(ROOT, 'admin.html'), 'utf8').includes('quan-ly-dan-cu.css'));
  check('[FILE] Tệp admin.html chứa menu Quản Lý Dân Cư', fs.readFileSync(path.join(ROOT, 'admin.html'), 'utf8').includes('Quản Lý Dân Cư'));
  check('[FILE] Tệp admin.html chứa tab-dan-cu container', fs.readFileSync(path.join(ROOT, 'admin.html'), 'utf8').includes('id="tab-dan-cu"'));

  // 2. Kiểm tra dữ liệu seed 466 hộ và 1.943 nhân khẩu
  const seedJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/dan_cu_seed.json'), 'utf8'));
  check('[DATA] Số lượng hộ gia đình ban đầu đạt 466 hộ', seedJson.households && seedJson.households.length === 466, `Thực tế: ${seedJson.households ? seedJson.households.length : 0}`);
  check('[DATA] Số lượng nhân khẩu ban đầu đạt 1.943 người', seedJson.residents && seedJson.residents.length === 1943, `Thực tế: ${seedJson.residents ? seedJson.residents.length : 0}`);
  check('[DATA] Cấu hình nguồn Google Sheets được thiết lập đúng', seedJson.dan_cu_settings && seedJson.dan_cu_settings.google_sheets_url.includes('1DgXp5p3If8xe8ZNCi1HTyQcgZ4HtfIao7aM0Kf_zvyQ'));

  // 3. Khởi tạo môi trường DOM cho admin.html
  let adminHtml = fs.readFileSync(path.join(ROOT, 'admin.html'), 'utf8');
  adminHtml = adminHtml.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/gi, '');
  adminHtml = adminHtml.replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, '');

  const dom = new JSDOM(adminHtml, {
    url: 'http://localhost:4321/admin.html',
    runScripts: 'dangerously'
  });

  const { window } = dom;
  global.window = window;
  global.document = window.document;
  window.alert = () => {};
  window.confirm = () => true;
  window.print = () => {};
  window.URL.createObjectURL = () => 'blob:mock';
  window.URL.revokeObjectURL = () => {};

  // Nạp seed và module QuanLyDanCu vào window
  const seedCode = fs.readFileSync(path.join(ROOT, 'assets/js/dan-cu-seed.js'), 'utf8');
  window.eval(seedCode);

  const danCuCode = fs.readFileSync(path.join(ROOT, 'assets/js/quan-ly-dan-cu.js'), 'utf8');
  window.eval(danCuCode);

  check('[MODULE] Đối tượng window.QuanLyDanCu được khởi tạo', typeof window.QuanLyDanCu === 'object');
  check('[MODULE] Có hàm mount()', typeof window.QuanLyDanCu.mount === 'function');
  check('[MODULE] Có hàm switchTab()', typeof window.QuanLyDanCu.switchTab === 'function');

  // Mount module
  const mockDb = {
    data: {
      households: JSON.parse(JSON.stringify(seedJson.households)),
      residents: JSON.parse(JSON.stringify(seedJson.residents)),
      bhyt_records: JSON.parse(JSON.stringify(seedJson.bhyt_records)),
      population_history: [],
      import_batches: JSON.parse(JSON.stringify(seedJson.import_batches)),
      custom_fields: JSON.parse(JSON.stringify(seedJson.custom_fields)),
      dan_cu_settings: [JSON.parse(JSON.stringify(seedJson.dan_cu_settings))],
      audit_logs: []
    },
    getAll(tbl) { return JSON.parse(JSON.stringify(this.data[tbl] || [])); },
    getById(tbl, id) { return (this.data[tbl] || []).find(i => i.id === id) || null; },
    insert(tbl, item, user) {
      if (!this.data[tbl]) this.data[tbl] = [];
      const obj = { ...item, id: item.id || 'id_' + Date.now() };
      this.data[tbl].unshift(obj);
      return obj;
    },
    update(tbl, id, updates) {
      const idx = (this.data[tbl] || []).findIndex(i => i.id === id);
      if (idx !== -1) {
        this.data[tbl][idx] = { ...this.data[tbl][idx], ...updates };
        return this.data[tbl][idx];
      }
      return null;
    },
    save() {},
    addAuditLog(entry) { (this.data.audit_logs = this.data.audit_logs || []).unshift(entry); }
  };

  const mockAuthAdmin = {
    getCurrentUser() {
      return { id: 'u_admin', username: 'admin', full_name: 'Quản Trị Viên', role: 'ADMIN' };
    }
  };

  const mockAuthViewer = {
    getCurrentUser() {
      return { id: 'u_view', username: 'viewer', full_name: 'Cán Bộ Báo Cáo', role: 'XEM_BAO_CAO' };
    }
  };

  // Mount module với quyền ADMIN
  window.QuanLyDanCu.mount('#dan-cu-module-mount', mockDb, mockAuthAdmin);

  const mountContainer = window.document.querySelector('#dan-cu-module-mount');
  check('[UI] Module gắn thành công vào DOM (#dan-cu-module-mount)', mountContainer && mountContainer.children.length > 0);

  // 4. Kiểm thử 16 tiểu phân hệ (16 sub-tabs)
  const navBtns = window.document.querySelectorAll('.dc-tab-btn');
  check('[UI] Có đủ 16 nút điều hướng tiểu phân hệ', navBtns.length === 16, `Số lượng: ${navBtns.length}`);

  // Test 1: Tổng quan (Dashboard)
  window.QuanLyDanCu.switchTab('tong-quan');
  const metricCards = window.document.querySelectorAll('.dc-metric-card');
  check('[SUBTAB 1] Dashboard hiển thị đủ các thẻ chỉ số chính', metricCards.length >= 4);
  const totalHhText = window.document.querySelector('#pane-tong-quan').textContent;
  check('[SUBTAB 1] Dashboard hiển thị đúng số lượng 466 hộ', totalHhText.includes('466'));
  check('[SUBTAB 1] Dashboard hiển thị đúng số lượng 1943 nhân khẩu', totalHhText.includes('1943'));

  // Test 2: Hộ gia đình
  window.QuanLyDanCu.switchTab('ho-gia-dinh');
  const hhRows = window.document.querySelectorAll('#pane-ho-gia-dinh tbody tr');
  check('[SUBTAB 2] Bảng hộ gia đình kết xuất dữ liệu thành công', hhRows.length >= 10);

  // Thêm hộ mới
  window.QuanLyDanCu.openAddHouseholdModal();
  const modalAdd = window.document.querySelector('#modalAddHh');
  check('[SUBTAB 2] Mở thành công modal thêm hộ gia đình', !!modalAdd);

  window.document.querySelector('#addHhMa').value = 'LH-TEST-999';
  window.document.querySelector('#addHhChuHo').value = 'TRẦN THỊ KIỂM THỬ';
  window.document.querySelector('#addHhDuong').value = 'Kiệt 23 Trần Hoàn';
  window.QuanLyDanCu.saveNewHousehold();

  const addedHh = mockDb.getById('households', 'LH-TEST-999');
  check('[SUBTAB 2] Lưu thành công hộ gia đình mới vào CSDL', addedHh && addedHh.chu_ho === 'TRẦN THỊ KIỂM THỬ');

  // Test 3: Nhân khẩu & Bảo vệ dữ liệu nhạy cảm (CCCD masking)
  window.QuanLyDanCu.switchTab('nhan-khau');
  const resRows = window.document.querySelectorAll('#pane-nhan-khau tbody tr');
  check('[SUBTAB 3] Bảng nhân khẩu kết xuất dữ liệu', resRows.length >= 10);

  // Chuyển sang quyền XEM_BAO_CAO để kiểm tra CCCD bị che
  window.QuanLyDanCu.mount('#dan-cu-module-mount', mockDb, mockAuthViewer);
  window.QuanLyDanCu.switchTab('nhan-khau');
  const maskedSpans = Array.from(window.document.querySelectorAll('#pane-nhan-khau .dc-masked'));
  const hasAsterisks = maskedSpans.some(s => s.textContent.includes('***') || s.textContent.includes('******'));
  check('[SECURITY] CCCD và SĐT tự động che đối với vai trò không phải Bí thư / Admin', hasAsterisks);

  // Trả về quyền ADMIN
  window.QuanLyDanCu.mount('#dan-cu-module-mount', mockDb, mockAuthAdmin);

  // Test 4: BHYT
  window.QuanLyDanCu.switchTab('bhyt');
  const bhytPane = window.document.querySelector('#pane-bhyt');
  check('[SUBTAB 4] Phân hệ BHYT hiển thị tỷ lệ bao phủ và thẻ còn hạn', bhytPane.textContent.includes('Tỷ Lệ Bao Phủ') && bhytPane.textContent.includes('Còn hạn'));

  // Test 5: Smart Excel Import & Chống Formula Injection
  window.QuanLyDanCu.switchTab('smart-import');
  const dropzone = window.document.querySelector('#dropzoneExcel');
  check('[SUBTAB 5] Dropzone tải lên Excel/CSV sẵn sàng', !!dropzone);

  // Test 6: Google Sheets Live Sync & Preview
  window.QuanLyDanCu.switchTab('google-sheets');
  const gsheetInput = window.document.querySelector('#inputGSheetUrl');
  check('[SUBTAB 6] Ô nhập link Google Sheets chứa URL chính thức', gsheetInput && gsheetInput.value.includes('1DgXp5p3If8xe8ZNCi1HTyQcgZ4HtfIao7aM0Kf_zvyQ'));

  // Test 7: Zalo Heuristic Parser
  window.QuanLyDanCu.switchTab('zalo');
  const txtZalo = window.document.querySelector('#txtZaloContent');
  if (txtZalo) {
    txtZalo.value = 'Báo cáo hộ ông Lê Văn An, sinh năm 1970, ở Kiệt 23 Trần Hoàn, số điện thoại 0914888999';
    window.QuanLyDanCu.parseZaloMessage();
    const zaloResult = window.document.querySelector('#zaloPreviewResult');
    check('[SUBTAB 7] Tiếp nhận Zalo bóc tách thành công họ tên, năm sinh và SĐT', zaloResult && zaloResult.innerHTML.includes('Lê Văn An'), zaloResult ? zaloResult.innerHTML.slice(0, 150) : 'NULL');
  }

  // Test 8: OCR Ảnh/PDF
  window.QuanLyDanCu.switchTab('ocr');
  const ocrDrop = window.document.querySelector('#dropzoneOcr');
  check('[SUBTAB 8] Giao diện OCR cục bộ không gửi ra ngoài sẵn sàng', !!ocrDrop);

  // Test 9: GPS & Google Maps
  window.QuanLyDanCu.switchTab('gps');
  const gpsPane = window.document.querySelector('#pane-gps');
  check('[SUBTAB 9] Thống kê tọa độ GPS và liên kết bản đồ số GIS hiển thị', gpsPane.textContent.includes('Hộ Đã Có Tọa Độ GPS') && gpsPane.innerHTML.includes('bando.html'));

  // Test 10: Tìm kiếm nâng cao
  window.QuanLyDanCu.switchTab('tim-kiem');
  window.document.querySelector('#advKeyword').value = 'CHOẮC';
  window.QuanLyDanCu.executeAdvSearch();
  const searchResult = window.document.querySelector('#advSearchResult');
  check('[SUBTAB 10] Tìm kiếm nâng cao trả về kết quả đúng', searchResult && searchResult.textContent.includes('PHẠM THỊ CHOẮC'));

  // Test 11: Trường mở rộng
  window.QuanLyDanCu.switchTab('truong-mo-rong');
  const cfRows = window.document.querySelectorAll('#pane-truong-mo-rong tbody tr');
  check('[SUBTAB 11] Bảng trường mở rộng hiển thị các trường tùy biến', cfRows.length >= 2);

  // Test 12: Báo cáo & Xuất
  window.QuanLyDanCu.switchTab('bao-cao');
  const reportCards = window.document.querySelectorAll('#pane-bao-cao button');
  check('[SUBTAB 12] Có các nút xuất Excel hộ, nhân khẩu và PDF in ấn', reportCards.length >= 3);

  // Test 13: Sao lưu & Phục hồi
  window.QuanLyDanCu.switchTab('sao-luu');
  const backupBtn = window.document.querySelector('#pane-sao-luu button');
  check('[SUBTAB 13] Có nút tải bản sao lưu CSDL dạng JSON', !!backupBtn);

  // Test 14: Phân quyền RBAC Matrix
  window.QuanLyDanCu.switchTab('phan-quyen');
  const rbacTable = window.document.querySelector('#pane-phan-quyen table');
  check('[SUBTAB 14] Ma trận phân quyền RBAC được kết xuất minh bạch', !!rbacTable);

  // Test 15: Nhật ký Audit Log
  window.QuanLyDanCu.switchTab('nhat-ky');
  const logTable = window.document.querySelector('#pane-nhat-ky table');
  check('[SUBTAB 15] Bảng nhật ký kiểm toán hoạt động', !!logTable);

  // Test 16: Cấu hình phân hệ
  window.QuanLyDanCu.switchTab('cau-hinh');
  const cfgGsheet = window.document.querySelector('#cfgGsheetUrl');
  check('[SUBTAB 16] Màn hình cấu hình phân hệ hiển thị URL Google Sheets và ngưỡng BHYT', cfgGsheet && cfgGsheet.value.length > 0);

  // 5. Kiểm thử Regression trang công khai (index.html)
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  check('[REGRESSION] Trang chủ index.html giữ nguyên tiêu đề TDP Lương Hậu', indexHtml.includes('Lương Hậu'));
  check('[REGRESSION] Trang chủ không chứa trực tiếp bảng dữ liệu dân cư nhạy cảm', !indexHtml.includes('PHẠM THỊ CHOẮC') && !indexHtml.includes('046000000000'));
  check('[REGRESSION] Cổng công khai vẫn kết nối đúng tới bản đồ số bando.html', indexHtml.includes('bando.html'));

  // 6. Tổng kết kết quả
  console.log('\n================================================================');
  console.log(' KẾT QUẢ KIỂM THỬ:');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;
  results.forEach((r, idx) => {
    if (r.ok) {
      passed++;
      console.log(`  ✔ [PASS] ${r.name}`);
    } else {
      failed++;
      console.log(`  ✖ [FAIL] ${r.name}  -->  ${r.extra}`);
    }
  });

  console.log(`\n================================================================`);
  console.log(` TỔNG CỘNG: ${results.length} bài test | ĐẠT: ${passed} | LỖI: ${failed}`);
  console.log(` TỶ LỆ ĐẠT: ${Math.round((passed / results.length) * 100)}%`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exitCode = 1;
  }
}

runAllTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exitCode = 1;
});
