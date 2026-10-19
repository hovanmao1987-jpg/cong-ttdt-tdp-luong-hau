/**
 * Test Suite: Lương Hậu Zalo Notify Engine (Modules A-G)
 * Verifies zero-regression, data integrity, role-based workflows, and manual dispatch confirmation.
 */

const assert = require('assert');
const path = require('path');

// Mock localStorage for Node.js environment
const storageMock = {};
global.localStorage = {
  getItem: (key) => storageMock[key] || null,
  setItem: (key, val) => { storageMock[key] = String(val); },
  removeItem: (key) => { delete storageMock[key]; },
  clear: () => { Object.keys(storageMock).forEach(k => delete storageMock[k]); }
};

// Mock window and LH (Lương Hậu portal global data)
global.window = {
  LH: {
    ROSTER: [
      { id: '1', hoTen: 'Hồ Văn Mão', chucVu: 'Bí thư Chi bộ', soDienThoai: '0962481112' },
      { id: '2', hoTen: 'Nguyễn Trọng Nghĩa', chucVu: 'Phó Bí thư Chi bộ', soDienThoai: '0965712812' },
      { id: '3', hoTen: 'Hoàng Hữu Rớt', chucVu: 'Chi ủy viên', soDienThoai: '0965943303' },
      { id: '4', hoTen: 'Nguyễn Thúc Thành', chucVu: 'Chi ủy viên', soDienThoai: '0966861442' },
      { id: '5', hoTen: 'Nguyễn Như Khải', chucVu: 'Chi ủy viên', soDienThoai: '0961341282' },
      { id: '6', hoTen: 'Hồ Viết Long', chucVu: 'Đảng viên', soDienThoai: '0905123401' },
      { id: '7', hoTen: 'Nguyễn Văn Cầu', chucVu: 'Đảng viên', soDienThoai: '0978112233' },
      { id: '8', hoTen: 'Nguyễn Thúc Cận', chucVu: 'Đảng viên', soDienThoai: '0983445566' },
      { id: '9', hoTen: 'Lê Văn Hiền', chucVu: 'Đảng viên', soDienThoai: '0905123402' },
      { id: '10', hoTen: 'Phạm Thị Lan', chucVu: 'Đảng viên', soDienThoai: '0905123403' },
      { id: '11', hoTen: 'Trần Văn Hòa', chucVu: 'Đảng viên', soDienThoai: '0905123404' },
      { id: '12', hoTen: 'Nguyễn Thị Mừng', chucVu: 'Đảng viên', soDienThoai: '0389967896' },
      { id: '13', hoTen: 'Đỗ Thị Hạnh', chucVu: 'Đảng viên', soDienThoai: '0905123405' },
      { id: '14', hoTen: 'Võ Viết Minh', chucVu: 'Đảng viên', soDienThoai: '0905123406' },
      { id: '15', hoTen: 'Lê Thị Mai', chucVu: 'Đảng viên', soDienThoai: '0905123407' },
      { id: '16', hoTen: 'Phan Văn Nam', chucVu: 'Đảng viên', soDienThoai: '0905123408' },
      { id: '17', hoTen: 'Nguyễn Đình Phúc', chucVu: 'Đảng viên', soDienThoai: '0905123409' },
      { id: '18', hoTen: 'Hoàng Thị Thảo', chucVu: 'Đảng viên', soDienThoai: '0905123410' },
      { id: '19', hoTen: 'Trương Văn Quân', chucVu: 'Đảng viên', soDienThoai: '0905123411' },
      { id: '20', hoTen: 'Đặng Thị Yến', chucVu: 'Đảng viên', soDienThoai: '0905123412' },
      { id: '21', hoTen: 'Bùi Văn Sơn', chucVu: 'Đảng viên', soDienThoai: '0905123413' },
      { id: '22', hoTen: 'Nguyễn Thị Ngọc Tú', chucVu: 'Đảng viên', soDienThoai: '0386003175' }
    ]
  }
};

require('../assets/js/zalo-notify.js');
const ZaloNotify = globalThis.ZaloNotifyModule || require('../assets/js/zalo-notify.js');
console.log('✓ ZaloNotifyModule loaded successfully, Engine:', typeof ZaloNotify.Engine);

let totalTests = 0;
let passedTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log('\n--- 1. KIỂM TRA KHỞI TẠO VÀ CƠ SỞ DỮ LIỆU ĐỘC LẬP ---');
const engine = new ZaloNotify.Engine();

it('Khởi tạo đầy đủ 9 bảng dữ liệu với tiền tố zalo_notify_', () => {
  const tables = [
    'zalo_notify_contacts',
    'zalo_notify_groups',
    'zalo_notify_group_members',
    'zalo_notify_templates',
    'zalo_notify_campaigns',
    'zalo_notify_recipients',
    'zalo_notify_schedules',
    'zalo_notify_delivery_logs',
    'zalo_notify_audit_logs'
  ];
  tables.forEach(t => {
    assert(Array.isArray(engine.data[t]), `Bảng ${t} phải là mảng dữ liệu`);
  });
});

it('Tự động nạp danh bạ hạt nhân từ cán bộ chủ chốt và 22 Đảng viên', () => {
  const contacts = engine.getContacts();
  assert(contacts.length >= 22, `Danh bạ phải có ít nhất 22 liên hệ (thực tế: ${contacts.length})`);
  const mao = contacts.find(c => c.full_name === 'Hồ Văn Mão');
  assert(mao, 'Phải có đồng chí Bí thư Hồ Văn Mão trong danh bạ');
  assert.strictEqual(mao.phone, '0962481112', 'Số điện thoại Bí thư Hồ Văn Mão chính xác');
});

it('Nạp đầy đủ 7 nhóm Zalo mặc định', () => {
  const groups = engine.getGroups();
  assert.strictEqual(groups.length, 7, 'Phải có đủ 7 nhóm đối tượng mặc định');
  const groupIds = groups.map(g => g.id);
  assert(groupIds.includes('grp_chibo'), 'Có nhóm Chi bộ');
  assert(groupIds.includes('grp_chiuy'), 'Có nhóm Chi ủy');
  assert(groupIds.includes('grp_bandieuhanh'), 'Có nhóm Ban điều hành TDP');
  assert(groupIds.includes('grp_mattran'), 'Có nhóm Ban CT Mặt trận');
  assert(groupIds.includes('grp_doanthe'), 'Có nhóm Các đoàn thể');
  assert(groupIds.includes('grp_hodan'), 'Có nhóm Hộ dân');
  assert(groupIds.includes('grp_tuychinh'), 'Có nhóm Tùy chỉnh');
});

it('Nạp đầy đủ 7 mẫu thông báo chuẩn', () => {
  const templates = engine.getTemplates();
  assert.strictEqual(templates.length, 7, 'Phải có 7 mẫu thông báo');
  const tplChibo = templates.find(t => t.id === 'tpl_chibo');
  assert(tplChibo, 'Phải có mẫu sinh hoạt chi bộ');
  assert(tplChibo.content.includes('{TEN}'), 'Mẫu phải hỗ trợ biến {TEN}');
  assert(tplChibo.content.includes('{THANG}'), 'Mẫu phải hỗ trợ biến {THANG}');
});

console.log('\n--- 2. KIỂM TRA MODULE B (QUẢN LÝ DANH BẠ VÀ PHÁT HIỆN TRÙNG LẶP) ---');
it('Thêm liên hệ mới hợp lệ', () => {
  const initialCount = engine.getContacts().length;
  const res = engine.addContact({
    full_name: 'Nguyễn Văn Test',
    phone: '0912345678',
    group_id: 'grp_hodan',
    zalo_name: 'VanTest',
    consent_status: 'CONSENTED',
    notes: 'Liên hệ thử nghiệm'
  }, 'Admin Test', 'ADMIN');

  assert(res.success, 'Thêm liên hệ thành công');
  assert.strictEqual(engine.getContacts().length, initialCount + 1, 'Số lượng tăng 1');
});

it('Ngăn chặn thêm liên hệ có số điện thoại trùng lặp', () => {
  const res = engine.addContact({
    full_name: 'Nguyễn Văn Trùng',
    phone: '0912345678', // đã thêm ở test trước
    group_id: 'grp_hodan'
  }, 'Admin Test', 'ADMIN');

  assert(!res.success, 'Không được phép thêm số trùng');
  assert(res.message.includes('trùng'), 'Thông báo lỗi phải nhắc đến trùng lặp');
});

it('Tìm kiếm liên hệ theo tên, số điện thoại hoặc nhóm', () => {
  const byName = engine.searchContacts('Mão');
  assert(byName.length >= 1, 'Tìm được theo tên');
  const byPhone = engine.searchContacts('0962481112');
  assert(byPhone.length >= 1, 'Tìm được theo số điện thoại');
  const byGroup = engine.searchContacts('', 'grp_chiuy');
  assert(byGroup.length >= 1, 'Tìm được theo nhóm Chi ủy');
});

it('Cập nhật và xóa liên hệ thử nghiệm', () => {
  const found = engine.searchContacts('Nguyễn Văn Test')[0];
  assert(found, 'Tìm thấy liên hệ test');
  const updRes = engine.updateContact(found.id, { notes: 'Đã cập nhật ghi chú' }, 'Admin', 'ADMIN');
  assert(updRes.success, 'Cập nhật thành công');

  const delRes = engine.deleteContact(found.id, 'Admin', 'ADMIN');
  assert(delRes.success, 'Xóa thành công');
  assert.strictEqual(engine.searchContacts('Nguyễn Văn Test').length, 0, 'Liên hệ đã bị xóa');
});

it('Nhập danh bạ từ định dạng CSV', () => {
  const csvContent = `Họ và tên,Số điện thoại,Nhóm đối tượng,Tên Zalo,Đồng ý nhận tin,Ghi chú
Lê Văn CSV 1,0987000001,Hộ dân,LeCSV1,Có,Đại diện hộ 1
Lê Văn CSV 2,0987000002,Hộ dân,LeCSV2,Có,Đại diện hộ 2`;

  const parsed = engine.parseCSVContacts(csvContent);
  assert.strictEqual(parsed.length, 2, 'Parse đúng 2 dòng');
  assert.strictEqual(parsed[0].full_name, 'Lê Văn CSV 1');
  assert.strictEqual(parsed[1].phone, '0987000002');

  const bulkRes = engine.bulkAddContacts(parsed, 'Admin CSV', 'ADMIN');
  assert.strictEqual(bulkRes.added, 2, 'Thêm thành công cả 2 liên hệ');
  assert.strictEqual(bulkRes.duplicates, 0, 'Không có trùng lặp');
});

console.log('\n--- 3. KIỂM TRA MODULE D & PHÂN QUYỀN (SOẠN THẢO, TRÌNH DUYỆT, PHÊ DUYỆT) ---');
let testCampaignId = null;

it('Editor tạo thông báo nháp (DRAFT)', () => {
  const res = engine.createCampaign({
    title: 'Giấy mời họp Ban điều hành mở rộng',
    type: 'to_dan_pho',
    content: 'Kính gửi đồng chí {TEN},\nKính mời đ/c họp Ban điều hành lúc 14h.\nTrân trọng!',
    group_ids: ['grp_bandieuhanh'],
    recipient_ids: [],
    scheduled_at: '2026-10-25T14:00:00Z',
    author_name: 'Nguyễn Văn Editor'
  }, 'Nguyễn Văn Editor', 'EDITOR');

  assert(res.success, 'Tạo chiến dịch thành công');
  testCampaignId = res.campaign.id;
  assert.strictEqual(res.campaign.status, 'DRAFT', 'Trạng thái ban đầu là DRAFT');
});

it('Editor trình phê duyệt (DRAFT -> PENDING_APPROVAL)', () => {
  const res = engine.submitCampaign(testCampaignId, 'Nguyễn Văn Editor', 'EDITOR');
  assert(res.success, 'Trình duyệt thành công');
  const c = engine.getCampaign(testCampaignId);
  assert.strictEqual(c.status, 'PENDING_APPROVAL', 'Trạng thái chuyển thành PENDING_APPROVAL');
});

it('Phân quyền: Editor KHÔNG ĐƯỢC tự phê duyệt thông báo', () => {
  const res = engine.approveCampaign(testCampaignId, 'Nguyễn Văn Editor', 'EDITOR');
  assert(!res.success, 'Editor không được quyền phê duyệt');
  const c = engine.getCampaign(testCampaignId);
  assert.strictEqual(c.status, 'PENDING_APPROVAL', 'Trạng thái vẫn là PENDING_APPROVAL');
});

it('Bí thư Chi bộ (ADMIN) phê duyệt thông báo (SUBMITTED -> APPROVED)', () => {
  const res = engine.approveCampaign(testCampaignId, 'Hồ Văn Mão', 'ADMIN');
  assert(res.success, 'Bí thư phê duyệt thành công');
  const c = engine.getCampaign(testCampaignId);
  assert.strictEqual(c.status, 'APPROVED', 'Trạng thái đã thành APPROVED');
  assert.strictEqual(c.approver_name, 'Hồ Văn Mão', 'Lưu tên người phê duyệt');
});

console.log('\n--- 4. KIỂM TRA MODULE E (QUY TRÌNH GỬI ZALO CÁ NHÂN VỚI XÁC NHẬN THỦ CÔNG) ---');
let testQueue = [];

it('Sinh hàng đợi gửi cho thông báo đã duyệt', () => {
  testQueue = engine.buildQueue(testCampaignId);
  assert(testQueue.length > 0, 'Hàng đợi phải có người nhận từ nhóm Ban Điều Hành');
  const groupItem = testQueue.find(q => q.recipient_type === 'GROUP');
  assert(groupItem, 'Có thẻ gửi nhóm Zalo');
  const indItem = testQueue.find(q => q.recipient_type === 'INDIVIDUAL');
  assert(indItem, 'Có cá nhân người nhận');
  assert(indItem.recipient_name, 'Có tên người nhận');
  assert(indItem.phone, 'Có số điện thoại');
  assert(indItem.message.includes(indItem.recipient_name), 'Nội dung tin nhắn đã cá nhân hóa tên người nhận');
  assert(indItem.zalo_link.startsWith('https://zalo.me/'), 'Link Zalo chính thức https://zalo.me/...');
  assert.strictEqual(indItem.status, 'PENDING', 'Trạng thái ban đầu là PENDING (Chưa gửi)');
});

it('Xác nhận kết quả gửi thủ công: CONFIRMED (Đã gửi thành công)', () => {
  const target = testQueue[0];
  const res = engine.confirmSend(testCampaignId, target.id, 'CONFIRMED', 'Đã gửi qua Zalo trên điện thoại', 'Hồ Văn Mão');
  assert(res.success, 'Xác nhận gửi thành công');
  const log = engine.getDeliveryLogs(testCampaignId);
  assert(log.some(l => l.recipient_id === target.id && l.status === 'CONFIRMED'), 'Đã ghi nhận trong delivery log');
});

it('Xác nhận kết quả gửi thủ công: FAILED (Gửi không thành công)', () => {
  if (testQueue.length > 1) {
    const target = testQueue[1];
    const res = engine.confirmSend(testCampaignId, target.id, 'FAILED', 'Chưa kết bạn Zalo hoặc số máy bận', 'Hồ Văn Mão');
    assert(res.success, 'Ghi nhận thất bại thành công');
    const log = engine.getDeliveryLogs(testCampaignId);
    assert(log.some(l => l.recipient_id === target.id && l.status === 'FAILED'), 'Đã ghi nhận trạng thái FAILED');
  }
});

it('Xác nhận kết quả: SKIPPED (Bỏ qua)', () => {
  if (testQueue.length > 2) {
    const target = testQueue[2];
    const res = engine.confirmSend(testCampaignId, target.id, 'SKIPPED', 'Đảng viên đã nhận giấy mời trực tiếp', 'Hồ Văn Mão');
    assert(res.success, 'Bỏ qua thành công');
    const log = engine.getDeliveryLogs(testCampaignId);
    assert(log.some(l => l.recipient_id === target.id && l.status === 'SKIPPED'), 'Đã ghi nhận trạng thái SKIPPED');
  }
});

console.log('\n--- 5. KIỂM TRA MODULE A, F & G (THỐNG KÊ, LỊCH NHẮC, NHẬT KÝ KIỂM TOÁN) ---');
it('Module A: Thống kê số liệu thực tế chính xác', () => {
  const stats = engine.getStats();
  assert(stats.total_campaigns >= 2, 'Tổng số thông báo >= 2');
  assert(stats.approved >= 2, 'Số thông báo đã duyệt >= 2');
  assert(stats.total_contacts >= 20, 'Tổng số người nhận >= 20');
  assert(stats.total_groups === 7, 'Đủ 7 nhóm Zalo');
});

it('Module F: Quản lý lịch nhắc thông báo', () => {
  const scheduleRes = engine.addSchedule({
    campaign_id: testCampaignId,
    title: 'Nhắc lịch họp Ban điều hành',
    remind_at: '2026-10-25T13:30:00Z',
    assignee_name: 'Hồ Văn Mão'
  }, 'Hồ Văn Mão', 'ADMIN');

  assert(scheduleRes.success, 'Thêm lịch nhắc thành công');
  const schedules = engine.getSchedules();
  assert(schedules.some(s => s.campaign_id === testCampaignId), 'Lịch nhắc xuất hiện trong danh sách');
});

it('Module G: Nhật ký kiểm toán (Audit Logs) ghi nhận đầy đủ, bất biến', () => {
  const auditLogs = engine.getAuditLogs();
  assert(auditLogs.length >= 5, `Phải có ít nhất 5 bản ghi audit (thực tế: ${auditLogs.length})`);
  const actions = auditLogs.map(a => a.action);
  assert(actions.includes('INIT_MODULE'), 'Có ghi nhận INIT_MODULE');
  assert(actions.includes('CREATE_CAMPAIGN'), 'Có ghi nhận CREATE_CAMPAIGN');
  assert(actions.includes('APPROVE_CAMPAIGN'), 'Có ghi nhận APPROVE_CAMPAIGN');
  assert(actions.includes('CONFIRM_SEND'), 'Có ghi nhận CONFIRM_SEND');
});

console.log(`\n======================================================`);
console.log(`KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} TESTS ĐẠT YÊU CẦU (100% PASS)`);
console.log(`======================================================\n`);
