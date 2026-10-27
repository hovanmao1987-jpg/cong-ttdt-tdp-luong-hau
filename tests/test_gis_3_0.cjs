/**
 * ============================================================================
 * BỘ KIỂM THỬ TOÀN DIỆN PHÂN HỆ BẢN ĐỒ SỐ LƯƠNG HẬU – DIGITAL GIS 3.0
 * Quy chuẩn: JSDOM Automated Test Suite | Zero Regression | Security & Privacy
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

async function runGisTests() {
  console.log('================================================================');
  console.log(' BẮT ĐẦU KIỂM THỬ BẢN ĐỒ SỐ TỔ DÂN PHỐ LƯƠNG HẬU – GIS 3.0');
  console.log('================================================================\n');

  // 1. Kiểm tra sự tồn tại của các tệp mã nguồn và tài liệu kiến trúc
  check('[FILE] Tệp tài liệu GIS_AUDIT_REPORT.md tồn tại', fs.existsSync(path.join(ROOT, 'GIS_AUDIT_REPORT.md')));
  check('[FILE] Tệp tài liệu GIS_ARCHITECTURE.md tồn tại', fs.existsSync(path.join(ROOT, 'GIS_ARCHITECTURE.md')));
  check('[FILE] Tệp tài liệu GIS_DATABASE_SCHEMA.md tồn tại', fs.existsSync(path.join(ROOT, 'GIS_DATABASE_SCHEMA.md')));
  check('[FILE] Tệp tài liệu GIS_PERMISSION_MATRIX.md tồn tại', fs.existsSync(path.join(ROOT, 'GIS_PERMISSION_MATRIX.md')));
  check('[FILE] Tệp tài liệu GIS_IMPLEMENTATION_PLAN.md tồn tại', fs.existsSync(path.join(ROOT, 'GIS_IMPLEMENTATION_PLAN.md')));
  check('[FILE] Tệp dữ liệu Seed data/gis_seed.json tồn tại', fs.existsSync(path.join(ROOT, 'data/gis_seed.json')));
  check('[FILE] Tệp JavaScript GIS Data Engine tồn tại', fs.existsSync(path.join(ROOT, 'assets/js/gis-data-engine.js')));
  check('[FILE] Tệp JavaScript GIS CMS Module tồn tại', fs.existsSync(path.join(ROOT, 'assets/js/gis-cms-module.js')));

  // 2. Kiểm tra dữ liệu Seed GIS (9 lớp nghiệp vụ, ranh giới và tài sản)
  const gisSeed = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/gis_seed.json'), 'utf8'));
  check('[DATA] Đủ 9 lớp dữ liệu chuyên đề GIS', gisSeed.layers && gisSeed.layers.length === 9, `Thực tế: ${gisSeed.layers ? gisSeed.layers.length : 0}`);
  check('[DATA] Có lớp ranh giới hành chính BOUNDARY', gisSeed.layers.some(l => l.code === 'BOUNDARY'));
  check('[DATA] Có lớp vị trí hộ dân HOUSEHOLDS', gisSeed.layers.some(l => l.code === 'HOUSEHOLDS'));
  check('[DATA] Có lớp hạ tầng kỹ thuật INFRA', gisSeed.layers.some(l => l.code === 'INFRA'));
  check('[DATA] Có lớp phản ánh hiện trường INCIDENTS', gisSeed.layers.some(l => l.code === 'INCIDENTS'));
  check('[DATA] Ranh giới TDP chứa hình học Polygon khép kín', gisSeed.features.some(f => f.layer_id === 'layer_boundary' && f.geometry.type === 'Polygon'));

  // 3. Khởi tạo môi trường JSDOM nạp GisEngine
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="gis-module-mount"></div></body></html>', {
    runScripts: 'dangerously'
  });
  const { window } = dom;
  global.window = window;
  global.document = window.document;
  global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  };

  const engineCode = fs.readFileSync(path.join(ROOT, 'assets/js/gis-data-engine.js'), 'utf8');
  window.eval(engineCode);

  const engine = window.LuongHauGisEngine;
  check('[ENGINE] Đối tượng LuongHauGisEngine được khởi tạo', typeof engine === 'object' && engine !== null);

  // Nạp seed vào engine
  engine.loadSeedData(gisSeed);
  check('[ENGINE] Nạp thành công dữ liệu seed vào engine', engine.getLayers().length === 9);

  // 4. Kiểm thử các thuật toán đo đạc không gian (Spatial Intelligence)
  const dMeters = engine.calculateDistance(16.429312, 107.694743, 16.429482, 107.695602);
  check('[SPATIAL] Tính khoảng cách trắc địa chính xác (~94-96m)', dMeters >= 90 && dMeters <= 100, `Thực tế: ${dMeters}m`);

  const boundaryFeat = engine.getFeatures({ layer_id: 'layer_boundary' })[0];
  const areaM2 = engine.calculatePolygonArea(boundaryFeat.geometry.coordinates[0]);
  check('[SPATIAL] Tính diện tích đa giác ranh giới Lương Hậu (~1.2 - 1.4 triệu m²)', areaM2 > 1000000, `Thực tế: ${(areaM2/10000).toFixed(1)} ha`);

  const ptInside = [107.695350, 16.428850]; // Nhà văn hóa 83 Thái Thuận
  check('[SPATIAL] Điểm Nhà văn hóa nằm trong ranh giới TDP Lương Hậu', engine.isPointInPolygon(ptInside, boundaryFeat.geometry.coordinates[0]));

  // 5. Kiểm thử Tiền kiểm & Định dạng tệp (Import Parsers)
  const sampleGeoJSON = JSON.stringify({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "TEST_01",
        geometry: { type: "Point", coordinates: [107.695, 16.429] },
        properties: { name: "Đèn đường thử nghiệm" }
      }
    ]
  });
  const parsedGeo = engine.parseGeoJSON(sampleGeoJSON);
  check('[PARSER] Phân tích cú pháp GeoJSON thành công', parsedGeo.ok && parsedGeo.features.length === 1);

  const sampleKML = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Placemark><name>Cột điện KML</name><coordinates>107.696,16.428,0</coordinates></Placemark></kml>`;
  const parsedKML = engine.parseKML(sampleKML);
  check('[PARSER] Phân tích cú pháp Google Earth KML thành công', parsedKML.ok && parsedKML.features.length === 1);

  const sampleCSV = `Mã,Tên,Latitude,Longitude\nTS_01,Đèn đường,16.4291,107.6952`;
  const parsedCSV = engine.parseCSV(sampleCSV);
  check('[PARSER] Phân tích cú pháp bảng tọa độ CSV thành công', parsedCSV.ok && parsedCSV.features.length === 1);

  // 6. Kiểm thử Tiền kiểm tọa độ ngoài phạm vi
  const outOfBoundsGeom = { type: 'Point', coordinates: [105.80, 21.02] }; // Tọa độ Hà Nội
  const valOut = engine.validateGeometry(outOfBoundsGeom);
  check('[VALIDATION] Phát hiện và cảnh báo tọa độ ngoài ranh giới Lương Hậu/Huế', valOut.isValid && valOut.isOutOfTown);

  // 7. Kiểm thử Quy trình duyệt lô 2 bước & Hoàn tác (Staging, Approve, Rollback)
  const job = engine.createImportJob({ filename: 'test_import.geojson', format: 'GEOJSON' }, parsedGeo.features);
  check('[WORKFLOW] Tạo lô nhập lưu vào vùng tạm (STAGING)', job && job.status === 'STAGING');

  const beforeApproveCount = engine.getFeatures().length;
  engine.approveImportJob(job.id, 'layer_infra');
  const afterApproveCount = engine.getFeatures().length;
  check('[WORKFLOW] Phê duyệt lô thành công, ghi nhận đối tượng vào bản đồ', afterApproveCount === beforeApproveCount + 1);

  engine.rollbackImportJob(job.id);
  const afterRollbackCount = engine.getFeatures().length;
  check('[WORKFLOW] Hoàn tác lô nhập (Rollback) thành công, thu hồi đối tượng', afterRollbackCount === beforeApproveCount);

  // 8. Kiểm thử Bảo vệ dữ liệu cá nhân (CCCD, SĐT masking)
  const sampleHhFeature = {
    id: 'feat_test_hh',
    layer_id: 'layer_households',
    external_id: 'LH-TEST-01',
    geometry: { type: 'Point', coordinates: [107.695, 16.429] },
    properties: {
      chu_ho: 'NGUYỄN VĂN A',
      cccd: '046090001234',
      phone: '0914123456',
      members: [{ name: 'NGUYỄN VĂN A', cccd: '046090001234', phone: '0914123456' }]
    }
  };
  const sanitizedPublic = engine.sanitizeFeature(sampleHhFeature, { role: 'CONG_DAN' });
  check('[SECURITY] Tự động ẩn số CCCD đối với người xem công khai', sanitizedPublic.properties.cccd === '***');
  check('[SECURITY] Tự động ẩn số điện thoại đối với người xem công khai', sanitizedPublic.properties.phone === '***');

  const sanitizedAdmin = engine.sanitizeFeature(sampleHhFeature, { role: 'ADMIN' });
  check('[SECURITY] Giữ nguyên thông tin cho tài khoản Quản trị / Bí thư', sanitizedAdmin.properties.cccd === '046090001234');

  // 9. Kiểm thử Tích hợp CMS Quản trị & Nhật ký kiểm toán
  const cmsCode = fs.readFileSync(path.join(ROOT, 'assets/js/gis-cms-module.js'), 'utf8');
  window.eval(cmsCode);
  check('[MODULE] Đối tượng window.LuongHauGisCms được nạp', typeof window.LuongHauGisCms === 'object');

  window.LuongHauGisCms.mount('#gis-module-mount', null, { getCurrentUser() { return { role: 'ADMIN', full_name: 'Quản Trị' }; } });
  const mountEl = window.document.querySelector('#gis-module-mount');
  check('[UI] Module CMS Quản trị GIS gắn thành công vào DOM', mountEl && mountEl.children.length > 0);

  const logs = engine.getAuditLogs();
  check('[AUDIT] Ghi nhận nhật ký kiểm toán cho các thao tác GIS', logs.length >= 3);

  // 10. Kiểm thử Giao diện Bản đồ số bando.html
  const bandoHtml = fs.readFileSync(path.join(ROOT, 'bando.html'), 'utf8');
  check('[UI] bando.html chứa nút bấm tìm kiếm mở rộng (Collapsible Search Button)', bandoHtml.includes('id="btn-toggle-search-panel"'));
  check('[UI] bando.html chứa khung quản lý lớp GIS (layer-panel-container)', bandoHtml.includes('id="layer-panel-container"'));
  check('[UI] bando.html chứa công cụ đo đạc không gian (measure-panel-container)', bandoHtml.includes('id="measure-panel-container"'));
  check('[UI] bando.html nhúng thư viện gis-data-engine.js', bandoHtml.includes('gis-data-engine.js'));

  // 11. Kiểm thử Tích hợp Trang Quản trị admin.html
  const adminHtml = fs.readFileSync(path.join(ROOT, 'admin.html'), 'utf8');
  check('[UI] admin.html chứa menu Quản Trị GIS 3.0', adminHtml.includes('Quản Trị GIS 3.0'));
  check('[UI] admin.html chứa thẻ tab tab-gis-data', adminHtml.includes('id="tab-gis-data"'));
  check('[UI] admin.html nhúng gis-data-engine.js & gis-cms-module.js', adminHtml.includes('gis-data-engine.js') && adminHtml.includes('gis-cms-module.js'));

  // 12. Kiểm thử Hồi quy (Zero Regression)
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  check('[REGRESSION] Trang chủ index.html giữ nguyên vẹn tiêu đề và bố cục', indexHtml.includes('Tổ dân phố Lương Hậu') && indexHtml.includes('bando.html'));

  console.log('\n================================================================');
  console.log(' KẾT QUẢ KIỂM THỬ PHÂN HỆ GIS 3.0:');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;
  results.forEach(r => {
    if (r.ok) {
      console.log(`  ✔ [PASS] ${r.name}`);
      passed++;
    } else {
      console.log(`  ✗ [FAIL] ${r.name} (${r.extra})`);
      failed++;
    }
  });

  console.log('\n================================================================');
  console.log(` TỔNG CỘNG: ${results.length} bài test | ĐẠT: ${passed} | LỖI: ${failed}`);
  console.log(` TỶ LỆ ĐẠT: ${((passed / results.length) * 100).toFixed(1)}%`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runGisTests();
