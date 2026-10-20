/* =====================================================================
   zalo-notify.js — MODULE QUẢN LÝ THÔNG BÁO ZALO CÁ NHÂN
   Khu vực: Nội bộ Chi bộ TDP Lương Hậu — Phường Hương Thủy, TP. Huế
   Chuẩn vận hành: Độc lập - Bảo toàn hệ thống cũ - Zero Regression
   Bảo mật: Tuân thủ quy định Zalo, gửi có xác nhận thủ công, không dùng API lậu.
   ===================================================================== */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module && module.exports) {
    module.exports = factory();
  } else {
    var g = (typeof globalThis !== 'undefined') ? globalThis :
            (typeof window !== 'undefined') ? window :
            (typeof self !== 'undefined') ? self :
            (typeof global !== 'undefined') ? global : root;
    if (g) {
      g.ZaloNotifyModule = factory();
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this)), function () {
  'use strict';

  var STORAGE_KEY = 'LUONG_HAU_ZALO_NOTIFY_V1';

  /* ---------------- MẪU THÔNG BÁO CHUẨN ---------------- */
  var DEFAULT_TEMPLATES = [
    {
      id: 'tpl_chibo',
      title: 'Giấy mời sinh hoạt Chi bộ thường kỳ',
      type: 'chi_bo',
      content: 'Kính gửi đồng chí {TEN},\n\nChi ủy Chi bộ Tổ dân phố Lương Hậu trân trọng kính mời đồng chí tham dự buổi sinh hoạt Chi bộ thường kỳ tháng {THANG}.\n- Thời gian: 19h30, Thứ Ba, ngày 03/{THANG}/2026.\n- Địa điểm: Nhà sinh hoạt cộng đồng TDP Lương Hậu (Số 83 Thái Thuận).\n- Nội dung: Đánh giá công tác lãnh đạo tháng qua và triển khai phương hướng, nghị quyết tháng tới; điểm danh trên Sổ tay ĐVĐT.\n\nRất mong đồng chí có mặt đúng giờ để buổi sinh hoạt đạt kết quả tốt nhất.\nTrân trọng!',
      is_default: true
    },
    {
      id: 'tpl_hoptop',
      title: 'Thông báo họp Tổ dân phố',
      type: 'hop_tdp',
      content: 'Kính gửi: Ông/Bà {TEN},\n\nBan Điều hành Tổ dân phố Lương Hậu trân trọng kính mời đại diện gia đình đến tham dự cuộc họp định kỳ của Tổ dân phố:\n- Thời gian: 19h30 ngày 15/{THANG}/2026.\n- Địa điểm: Nhà văn hóa TDP Lương Hậu (83 Thái Thuận).\n- Nội dung: Bàn kế hoạch đảm bảo ANTT, phòng chống thiên tai mùa mưa lũ và công tác vệ sinh môi trường.\n\nSự có mặt của đại diện gia đình là đóng góp quan trọng cho phong trào chung của Tổ dân phố.\nBan Điều hành TDP Lương Hậu xin trân trọng cảm ơn!',
      is_default: true
    },
    {
      id: 'tpl_bandieuhanh',
      title: 'Thông báo của Ban Điều hành TDP',
      type: 'ban_dieu_hanh',
      content: 'Kính gửi: Ông/Bà {TEN},\n\nBan Điều hành Tổ dân phố Lương Hậu xin thông báo về việc rà soát hồ sơ, hướng dẫn đăng ký định danh điện tử VNeID mức 2 và kích hoạt tài khoản công dân số trên ứng dụng Hue-S.\n- Thời gian hỗ trợ: Từ 08h00 - 11h30 và 14h00 - 17h00 các ngày trong tuần.\n- Địa điểm: Nhà SHCĐ số 83 Thái Thuận.\n- Cán bộ phụ trách: Đ/c Nguyễn Trọng Nghĩa (Tổ trưởng - 0965.712.812).\n\nTrân trọng thông báo!',
      is_default: true
    },
    {
      id: 'tpl_doanthe',
      title: 'Thông báo hoạt động của Đoàn thể / Chi hội',
      type: 'doan_the',
      content: 'Kính gửi: Thành viên {TEN},\n\nThực hiện chỉ đạo của Chi bộ và UBND phường Hương Thủy, Ban Chấp hành phát động đợt ra quân Ngày Chủ nhật xanh gắn với nạo vét mương thoát nước, xử lý lăng quăng phòng chống sốt xuất huyết.\n- Thời gian tập trung: 06h30 sáng Chủ nhật tuần này.\n- Địa điểm: Nhà sinh hoạt cộng đồng TDP Lương Hậu.\n- Đề nghị mang theo dụng cụ vệ sinh phù hợp.\n\nRất mong các đồng chí và bà con tham gia tích cực!',
      is_default: true
    },
    {
      id: 'tpl_nhaclich',
      title: 'Nhắc lịch công tác và báo cáo',
      type: 'nhac_lich',
      content: 'Kính gửi đồng chí {TEN},\n\nChi ủy Chi bộ xin nhắc lịch báo cáo tình hình địa bàn và tiến độ thực hiện nhiệm vụ 6 Rõ:\n- Thời gian gửi báo cáo: Trước 17h00 ngày hôm nay.\n- Nội dung: Tình hình ANTT, phản ánh của nhân dân thuộc khu vực phân công.\n- Địa chỉ tiếp nhận: Gửi trực tiếp cho đồng chí Bí thư Chi bộ.\n\nĐề nghị đồng chí lưu ý thực hiện đúng tiến độ. Trân trọng!',
      is_default: true
    },
    {
      id: 'tpl_khan',
      title: 'Thông báo khẩn cấp (PCTT & TKCN, ANTT)',
      type: 'khan',
      content: 'THÔNG BÁO KHẨN CẤP\nKính gửi: Ông/Bà {TEN},\n\nTheo tin từ Đài Khí tượng Thủy văn tỉnh Thừa Thiên Huế, dự báo trên địa bàn có mưa rất to và nguy cơ ngập lụt tại các vùng trũng thấp ven sông.\nBan Chỉ huy PCTT&TKCN TDP Lương Hậu yêu cầu:\n1. Kê cao đồ đạc, gia cố chuồng trại, đảm bảo nguồn điện an toàn.\n2. Các hộ neo đơn, người cao tuổi tại Đội 8, 9, 10, 11 chuẩn bị sẵn sàng phương án di dời khi có lệnh.\n3. Số điện thoại khẩn cấp: Bí thư Hồ Văn Mão (0962.481.112) - Tổ trưởng Nguyễn Trọng Nghĩa (0965.712.812).\n\nĐề nghị bà con hết sức cảnh giác và chủ động phòng ngừa!',
      is_default: true
    },
    {
      id: 'tpl_tuychinh',
      title: 'Mẫu thông báo tùy chỉnh',
      type: 'tuy_chinh',
      content: 'Kính gửi: {TEN},\n\nChi bộ và Ban Điều hành TDP Lương Hậu xin thông báo:\n{NOI_DUNG}\n\nTrân trọng!',
      is_default: true
    }
  ];

  /* ---------------- NHÓM MẶC ĐỊNH ---------------- */
  var DEFAULT_GROUPS = [
    { id: 'grp_chibo', name: 'Nhóm Chi bộ Lương Hậu', category: 'Chi bộ', link: 'https://zalo.me/g/chibo-luonghau', manager: 'Hồ Văn Mão', notes: 'Gồm 22 đảng viên Chi bộ', status: 'ACTIVE', created_at: '2026-09-01T08:00:00Z' },
    { id: 'grp_chiuy', name: 'Nhóm Chi ủy Chi bộ', category: 'Chi ủy', link: 'https://zalo.me/g/chiuy-luonghau', manager: 'Hồ Văn Mão', notes: 'Bí thư, Phó bí thư, Chi ủy viên', status: 'ACTIVE', created_at: '2026-09-01T08:00:00Z' },
    { id: 'grp_bandieuhanh', name: 'Nhóm Ban Điều hành TDP', category: 'Chính quyền', link: 'https://zalo.me/g/bdh-luonghau', manager: 'Nguyễn Trọng Nghĩa', notes: 'Tổ trưởng, tổ phó, tổ viên các đội', status: 'ACTIVE', created_at: '2026-09-01T08:00:00Z' },
    { id: 'grp_mattran', name: 'Nhóm Ban Công tác Mặt trận', category: 'Mặt trận', link: '', manager: 'Hoàng Hữu Rớt', notes: 'Mặt trận và các thành viên', status: 'ACTIVE', created_at: '2026-09-01T08:00:00Z' },
    { id: 'grp_doanthe', name: 'Nhóm các Chi hội, Đoàn thể', category: 'Đoàn thể', link: '', manager: 'Nguyễn Thị Ngọc Tú', notes: 'Phụ nữ, Nông dân, Cựu chiến binh, Thanh niên, Khuyến học', status: 'ACTIVE', created_at: '2026-09-01T08:00:00Z' },
    { id: 'grp_hodan', name: 'Nhóm Hộ gia đình nòng cốt', category: 'Cộng đồng', link: '', manager: 'Nguyễn Trọng Nghĩa', notes: 'Đại diện hộ gia đình 4 đội 8, 9, 10, 11', status: 'ACTIVE', created_at: '2026-09-01T08:00:00Z' },
    { id: 'grp_tuychinh', name: 'Nhóm Công việc chuyên đề', category: 'Tùy chỉnh', link: '', manager: 'Hồ Văn Mão', notes: 'Tổ xung kích PCTT&TKCN, Chuyển đổi số', status: 'ACTIVE', created_at: '2026-09-01T08:00:00Z' }
  ];

  /* ---------------- KHỞI TẠO LIÊN HỆ TỪ HỆ THỐNG THẬT ---------------- */
  function buildSeedContacts() {
    var list = [];
    var LH = (typeof window !== 'undefined' && window.LH) || {};
    var roster = (LH && LH.ROSTER) || [];
    var cadres = (LH && LH.CADRES) || [];

    // 1. Thêm cán bộ chủ chốt (thông tin số điện thoại chính thức đã công khai)
    var keyCadres = [
      { id: 'cnt_mao', full_name: 'Hồ Văn Mão', group_id: 'grp_chiuy', group_name: 'Chi ủy Chi bộ', phone: '0962481112', zalo_name: 'Hồ Văn Mão', consent_status: 'CONSENTED', notes: 'Bí thư Chi bộ', status: 'ACTIVE' },
      { id: 'cnt_nghia', full_name: 'Nguyễn Trọng Nghĩa', group_id: 'grp_bandieuhanh', group_name: 'Ban Điều hành TDP', phone: '0965712812', zalo_name: 'Nguyễn Trọng Nghĩa', consent_status: 'CONSENTED', notes: 'Phó Bí thư / Tổ trưởng TDP', status: 'ACTIVE' },
      { id: 'cnt_rot', full_name: 'Hoàng Hữu Rớt', group_id: 'grp_mattran', group_name: 'Ban Công tác Mặt trận', phone: '0965943303', zalo_name: 'Hoàng Hữu Rớt', consent_status: 'CONSENTED', notes: 'Trưởng Ban CTMT', status: 'ACTIVE' },
      { id: 'cnt_mung', full_name: 'Nguyễn Thị Mừng', group_id: 'grp_doanthe', group_name: 'Các chi hội, đoàn thể', phone: '0389967896', zalo_name: 'Nguyễn Thị Mừng', consent_status: 'CONSENTED', notes: 'Chi hội trưởng Phụ nữ', status: 'ACTIVE' },
      { id: 'cnt_thanh', full_name: 'Nguyễn Thúc Thành', group_id: 'grp_bandieuhanh', group_name: 'Ban Điều hành TDP', phone: '0966861442', zalo_name: 'Nguyễn Thúc Thành', consent_status: 'CONSENTED', notes: 'Tổ trưởng Tổ ANTT cơ sở', status: 'ACTIVE' },
      { id: 'cnt_khai', full_name: 'Nguyễn Như Khải', group_id: 'grp_bandieuhanh', group_name: 'Ban Điều hành TDP', phone: '0961341282', zalo_name: 'Nguyễn Như Khải', consent_status: 'CONSENTED', notes: 'Thôn đội trưởng', status: 'ACTIVE' },
      { id: 'cnt_tu', full_name: 'Nguyễn Thị Ngọc Tú', group_id: 'grp_doanthe', group_name: 'Các chi hội, đoàn thể', phone: '0386003175', zalo_name: 'Ngọc Tú', consent_status: 'CONSENTED', notes: 'Bí thư Chi đoàn', status: 'ACTIVE' },
      { id: 'cnt_cau', full_name: 'Nguyễn Văn Cầu', group_id: 'grp_doanthe', group_name: 'Các chi hội, đoàn thể', phone: '0978112233', zalo_name: 'Nguyễn Văn Cầu', consent_status: 'CONSENTED', notes: 'Chi hội trưởng Cựu chiến binh', status: 'ACTIVE' },
      { id: 'cnt_can', full_name: 'Nguyễn Thúc Cận', group_id: 'grp_doanthe', group_name: 'Các chi hội, đoàn thể', phone: '0983445566', zalo_name: 'Nguyễn Thúc Cận', consent_status: 'CONSENTED', notes: 'Chi hội trưởng Nông dân', status: 'ACTIVE' },
      { id: 'cnt_oanh', full_name: 'Nguyễn Thị Kim Oanh', group_id: 'grp_doanthe', group_name: 'Các chi hội, đoàn thể', phone: '0914556677', zalo_name: 'Kim Oanh', consent_status: 'CONSENTED', notes: 'Trưởng Ban Khuyến học', status: 'ACTIVE' }
    ];

    keyCadres.forEach(function (c) {
      c.updated_at = new Date().toISOString();
      list.push(c);
    });

    // 2. Thêm Đảng viên từ danh sách 22 Đảng viên (nếu chưa có trong danh sách cán bộ)
    var existingNames = list.map(function (x) { return x.full_name.toLowerCase(); });
    roster.forEach(function (r, idx) {
      if (existingNames.indexOf(r.hoTen.toLowerCase()) < 0) {
        list.push({
          id: 'cnt_pm_' + (r.id || (idx + 1)),
          full_name: r.hoTen,
          group_id: 'grp_chibo',
          group_name: 'Đảng viên Chi bộ',
          phone: r.soDienThoai || ('09' + String(idx + 10).padStart(8, '0')),
          zalo_name: r.hoTen,
          consent_status: 'CONSENTED',
          notes: r.chucVu || 'Đảng viên Chi bộ Lương Hậu',
          status: 'ACTIVE',
          updated_at: new Date().toISOString()
        });
      }
    });

    return list;
  }

  /* ---------------- THÔNG BÁO MẪU ĐÃ CÓ ---------------- */
  function buildSeedCampaigns() {
    var nowStr = new Date().toISOString();
    return [
      {
        id: 'cmp_01',
        title: 'Triển khai Kế hoạch Tổ xung kích PCTT&TKCN năm 2026',
        type: 'khan',
        content: 'Kính gửi đồng chí {TEN},\n\nChi ủy Chi bộ và Ban Điều hành TDP Lương Hậu triển khai phân công nhiệm vụ Tổ xung kích PCTT&TKCN năm 2026 theo Quyết định số 1229/QĐ-UBND của UBND phường Hương Thủy.\nĐề nghị các đồng chí kiểm tra trang thiết bị, phương án 4 tại chỗ và báo cáo tình hình địa bàn 3 khung giờ: 7h00 - 13h00 - 19h00 hàng ngày cho đ/c Bí thư Chi bộ.\nTrân trọng!',
        template_id: 'tpl_khan',
        recipient_group_ids: ['grp_chiuy', 'grp_bandieuhanh'],
        recipient_contact_ids: ['cnt_mao', 'cnt_nghia', 'cnt_thanh', 'cnt_khai'],
        scheduled_at: nowStr,
        author_id: 'usr_totruong',
        author_name: 'Nguyễn Trọng Nghĩa',
        approver_id: 'usr_bithu',
        approver_name: 'Hồ Văn Mão',
        status: 'APPROVED',
        notes: 'Thông báo triển khai khẩn cấp',
        created_at: nowStr,
        updated_at: nowStr
      },
      {
        id: 'cmp_02',
        title: 'Giấy mời sinh hoạt Chi bộ thường kỳ tháng 10/2026',
        type: 'chi_bo',
        content: 'Kính gửi đồng chí {TEN},\n\nChi ủy Chi bộ Tổ dân phố Lương Hậu trân trọng kính mời đồng chí tham dự buổi sinh hoạt Chi bộ thường kỳ:\n- Thời gian: 19h30, ngày 03/10/2026.\n- Địa điểm: Nhà sinh hoạt cộng đồng TDP Lương Hậu (83 Thái Thuận).\n- Nội dung: Đánh giá thực hiện Nghị quyết tháng 9 và biểu quyết phương hướng quý IV/2026; thực hiện điểm danh quét QR trên Sổ tay ĐVĐT.\n\nRất mong đồng chí có mặt đầy đủ, đúng giờ!',
        template_id: 'tpl_chibo',
        recipient_group_ids: ['grp_chibo'],
        recipient_contact_ids: [],
        scheduled_at: '2026-10-02T19:00:00Z',
        author_id: 'usr_bithu',
        author_name: 'Hồ Văn Mão',
        approver_id: 'usr_bithu',
        approver_name: 'Hồ Văn Mão',
        status: 'APPROVED',
        notes: 'Sinh hoạt định kỳ',
        created_at: nowStr,
        updated_at: nowStr
      }
    ];
  }

  /* ---------------- CORE ENGINE ---------------- */
  function ZaloNotifyEngine() {
    this.data = this.load();
  }

  ZaloNotifyEngine.prototype.load = function () {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.zalo_notify_contacts && parsed.zalo_notify_campaigns) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc kho Zalo Notify:', e);
    }

    var initial = {
      zalo_notify_contacts: buildSeedContacts(),
      zalo_notify_groups: DEFAULT_GROUPS,
      zalo_notify_group_members: [],
      zalo_notify_templates: DEFAULT_TEMPLATES,
      zalo_notify_campaigns: buildSeedCampaigns(),
      zalo_notify_recipients: [],
      zalo_notify_schedules: [],
      zalo_notify_delivery_logs: [],
      zalo_notify_audit_logs: [
        {
          id: 'log_zn_init',
          action: 'INIT_MODULE',
          user_name: 'Hệ thống Chi bộ',
          role: 'SYSTEM',
          details: 'Khởi tạo module Quản lý thông báo Zalo cá nhân thành công',
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.saveData(initial);
    return initial;
  };

  ZaloNotifyEngine.prototype.save = function () {
    this.saveData(this.data);
  };

  ZaloNotifyEngine.prototype.saveData = function (data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Không thể lưu localStorage cho Zalo Notify:', e);
    }
  };

  ZaloNotifyEngine.prototype.addAudit = function (action, userName, role, details) {
    var entry = {
      id: 'log_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      action: action,
      user_name: userName || 'Cán bộ',
      role: role || 'CAN_BO',
      details: details || '',
      timestamp: new Date().toISOString()
    };
    this.data.zalo_notify_audit_logs.unshift(entry);
    if (this.data.zalo_notify_audit_logs.length > 500) {
      this.data.zalo_notify_audit_logs = this.data.zalo_notify_audit_logs.slice(0, 500);
    }
    this.save();
    return entry;
  };

  /* ---------------- MODULE A: DASHBOARD METRICS ---------------- */
  ZaloNotifyEngine.prototype.getMetrics = function () {
    var campaigns = this.data.zalo_notify_campaigns || [];
    var recipients = this.data.zalo_notify_recipients || [];
    var contacts = this.data.zalo_notify_contacts || [];
    var groups = this.data.zalo_notify_groups || [];
    var logs = this.data.zalo_notify_audit_logs || [];

    var now = new Date();
    var draftCount = 0;
    var pendingCount = 0;
    var approvedCount = 0;
    var scheduledCount = 0;

    campaigns.forEach(function (c) {
      if (c.status === 'DRAFT') draftCount++;
      else if (c.status === 'PENDING_APPROVAL') pendingCount++;
      else if (c.status === 'APPROVED') {
        approvedCount++;
        if (c.scheduled_at && new Date(c.scheduled_at) <= now) {
          scheduledCount++;
        }
      }
    });

    var confirmedSent = 0;
    var incomplete = 0;
    recipients.forEach(function (r) {
      if (r.status === 'CONFIRMED') confirmedSent++;
      else if (r.status === 'PENDING' || r.status === 'PROCESSING' || r.status === 'FAILED') incomplete++;
    });

    return {
      totalCampaigns: campaigns.length,
      draftCount: draftCount,
      pendingCount: pendingCount,
      approvedCount: approvedCount,
      scheduledCount: scheduledCount,
      confirmedSent: confirmedSent,
      incomplete: incomplete,
      totalContacts: contacts.length,
      totalGroups: groups.length,
      recentLogs: logs.slice(0, 8)
    };
  };

  /* ---------------- MODULE B: DANH BẠ LIÊN HỆ ---------------- */
  ZaloNotifyEngine.prototype.getContacts = function (filterQuery, groupId) {
    var list = this.data.zalo_notify_contacts || [];
    if (groupId && groupId !== 'ALL') {
      list = list.filter(function (c) { return c.group_id === groupId; });
    }
    if (filterQuery) {
      var q = filterQuery.toLowerCase().trim();
      list = list.filter(function (c) {
        return (c.full_name && c.full_name.toLowerCase().indexOf(q) >= 0) ||
               (c.phone && c.phone.indexOf(q) >= 0) ||
               (c.zalo_name && c.zalo_name.toLowerCase().indexOf(q) >= 0) ||
               (c.notes && c.notes.toLowerCase().indexOf(q) >= 0);
      });
    }
    return list;
  };

  ZaloNotifyEngine.prototype.saveContact = function (contact, user) {
    if (contact.id) {
      var idx = this.data.zalo_notify_contacts.findIndex(function (c) { return c.id === contact.id; });
      if (idx === -1) return { success: false, error: 'Không tìm thấy người nhận để cập nhật.' };
      contact.updated_at = new Date().toISOString();
      if (contact.phone) contact.phone = contact.phone.replace(/\D/g, '');
      this.data.zalo_notify_contacts[idx] = Object.assign({}, this.data.zalo_notify_contacts[idx], contact);
      this.save();
      this.addAudit('UPDATE_CONTACT', user && user.full_name, user && user.role, 'Cập nhật người nhận: ' + this.data.zalo_notify_contacts[idx].full_name);
      return { success: true, contact: this.data.zalo_notify_contacts[idx] };
    }

    if (!contact.full_name || !contact.full_name.trim()) {
      return { success: false, error: 'Họ và tên không được để trống.' };
    }

    var cleanPhone = (contact.phone || '').replace(/\D/g, '');
    contact.phone = cleanPhone;

    // Phát hiện trùng lặp nếu thêm mới
    var dup = this.data.zalo_notify_contacts.find(function (c) {
      return (cleanPhone && c.phone === cleanPhone) ||
             (c.full_name.trim().toLowerCase() === contact.full_name.trim().toLowerCase());
    });
    if (dup) {
      return {
        success: false,
        error: 'Bản ghi đã tồn tại trùng khớp: ' + dup.full_name + (dup.phone ? ' (' + dup.phone + ')' : ''),
        duplicate: dup
      };
    }

    contact.id = 'cnt_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    contact.created_at = new Date().toISOString();
    contact.updated_at = new Date().toISOString();
    contact.status = contact.status || 'ACTIVE';
    contact.consent_status = contact.consent_status || 'CONSENTED';
    this.data.zalo_notify_contacts.unshift(contact);
    this.save();
    this.addAudit('CREATE_CONTACT', user && user.full_name, user && user.role, 'Thêm mới người nhận: ' + contact.full_name);
    return { success: true, contact: contact };
  };

  ZaloNotifyEngine.prototype.deleteContact = function (id, user) {
    var uObj = (typeof user === 'string') ? { full_name: user } : user;
    var idx = this.data.zalo_notify_contacts.findIndex(function (c) { return c.id === id; });
    if (idx === -1) return { success: false, error: 'Không tìm thấy liên hệ.' };
    var removed = this.data.zalo_notify_contacts.splice(idx, 1)[0];
    this.save();
    this.addAudit('DELETE_CONTACT', uObj && uObj.full_name, uObj && uObj.role, 'Xóa người nhận: ' + removed.full_name);
    return { success: true, removed: removed };
  };

  /* Nhập CSV / TSV / Excel */
  ZaloNotifyEngine.prototype.importContactsFromText = function (text, user) {
    if (!text || !text.trim()) return { success: false, error: 'Dữ liệu nhập rỗng.' };
    var lines = text.split(/\r?\n/).filter(function (l) { return l.trim().length > 0; });
    if (lines.length === 0) return { success: false, error: 'Không có dòng dữ liệu hợp lệ.' };

    // Tự động phân tách dấu phẩy hoặc tab hoặc chấm phẩy
    var sep = ',';
    if (lines[0].indexOf('\t') >= 0) sep = '\t';
    else if (lines[0].indexOf(';') >= 0) sep = ';';

    var imported = 0;
    var duplicates = 0;
    var skipped = 0;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      // Bỏ qua dòng tiêu đề nếu chứa chữ "họ và tên" hoặc "họ tên"
      if (i === 0 && (line.toLowerCase().indexOf('họ tên') >= 0 || line.toLowerCase().indexOf('ho ten') >= 0 || line.toLowerCase().indexOf('name') >= 0)) {
        continue;
      }

      var parts = line.split(sep).map(function (p) {
        return p.trim().replace(/^["']|["']$/g, '');
      });

      var fullName = parts[0] || '';
      var phone = (parts[1] || '').replace(/\D/g, '');
      var groupName = parts[2] || 'Hộ dân';
      var notes = parts[3] || 'Nhập từ tệp';

      if (!fullName) {
        skipped++;
        continue;
      }

      var dup = this.data.zalo_notify_contacts.find(function (c) {
        return (phone && c.phone === phone) || (c.full_name.toLowerCase() === fullName.toLowerCase());
      });

      if (dup) {
        duplicates++;
        continue;
      }

      var newC = {
        id: 'cnt_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        full_name: fullName,
        phone: phone,
        group_id: 'grp_hodan',
        group_name: groupName,
        zalo_name: fullName,
        consent_status: 'CONSENTED',
        notes: notes,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.data.zalo_notify_contacts.push(newC);
      imported++;
    }

    this.save();
    this.addAudit('IMPORT_CONTACTS', user && user.full_name, user && user.role, 'Nhập danh bạ: ' + imported + ' bản ghi thành công (' + duplicates + ' trùng lặp)');
    return { success: true, imported: imported, duplicates: duplicates, skipped: skipped };
  };

  /* Xuất CSV với UTF-8 BOM cho Excel tiếng Việt */
  ZaloNotifyEngine.prototype.exportContactsToCsv = function () {
    var list = this.data.zalo_notify_contacts || [];
    var header = ['ID', 'Họ và tên', 'Số điện thoại', 'Nhóm đối tượng', 'Tên Zalo', 'Đồng ý nhận tin', 'Ghi chú', 'Trạng thái'];
    var rows = [header];

    list.forEach(function (c) {
      rows.push([
        c.id,
        '"' + (c.full_name || '').replace(/"/g, '""') + '"',
        '\t' + (c.phone || ''), // Thêm tab để Excel không biến số 0 thành số nguyên
        '"' + (c.group_name || '').replace(/"/g, '""') + '"',
        '"' + (c.zalo_name || '').replace(/"/g, '""') + '"',
        c.consent_status === 'CONSENTED' ? 'Đã đồng ý' : 'Chưa đồng ý',
        '"' + (c.notes || '').replace(/"/g, '""') + '"',
        c.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'
      ]);
    });

    var csvContent = '\uFEFF' + rows.map(function (r) { return r.join(','); }).join('\r\n');
    return csvContent;
  };

  /* ---------------- MODULE C: QUẢN LÝ NHÓM ZALO ---------------- */
  ZaloNotifyEngine.prototype.getGroups = function () {
    return this.data.zalo_notify_groups || [];
  };

  ZaloNotifyEngine.prototype.saveGroup = function (group, user) {
    if (!group.name || !group.name.trim()) return { success: false, error: 'Tên nhóm không được để trống.' };

    if (!group.id) {
      group.id = 'grp_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
      group.created_at = new Date().toISOString();
      group.status = group.status || 'ACTIVE';
      this.data.zalo_notify_groups.push(group);
      this.save();
      this.addAudit('CREATE_GROUP', user && user.full_name, user && user.role, 'Tạo nhóm Zalo: ' + group.name);
      return { success: true, group: group };
    } else {
      var idx = this.data.zalo_notify_groups.findIndex(function (g) { return g.id === group.id; });
      if (idx === -1) return { success: false, error: 'Không tìm thấy nhóm.' };
      this.data.zalo_notify_groups[idx] = Object.assign({}, this.data.zalo_notify_groups[idx], group);
      this.save();
      this.addAudit('UPDATE_GROUP', user && user.full_name, user && user.role, 'Cập nhật nhóm Zalo: ' + group.name);
      return { success: true, group: this.data.zalo_notify_groups[idx] };
    }
  };

  /* ---------------- MODULE D: SOẠN & PHÊ DUYỆT THÔNG BÁO ---------------- */
  ZaloNotifyEngine.prototype.getTemplates = function () {
    return this.data.zalo_notify_templates || [];
  };

  ZaloNotifyEngine.prototype.getCampaigns = function (statusFilter) {
    var list = this.data.zalo_notify_campaigns || [];
    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter(function (c) { return c.status === statusFilter; });
    }
    return list;
  };

  ZaloNotifyEngine.prototype.getCampaignById = function (id) {
    return this.data.zalo_notify_campaigns.find(function (c) { return c.id === id; });
  };

  ZaloNotifyEngine.prototype.saveCampaign = function (campaign, user) {
    if (!campaign.title || !campaign.title.trim()) {
      return { success: false, error: 'Tiêu đề thông báo không được để trống.' };
    }
    if (!campaign.content || !campaign.content.trim()) {
      return { success: false, error: 'Nội dung thông báo không được để trống.' };
    }

    var nowStr = new Date().toISOString();
    var isNew = !campaign.id;

    if (isNew) {
      campaign.id = 'cmp_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
      campaign.created_at = nowStr;
      campaign.updated_at = nowStr;
      campaign.author_id = (user && (user.id || user.username)) || 'usr_canbo';
      campaign.author_name = (user && user.full_name) || 'Cán bộ';
      campaign.status = campaign.status || 'DRAFT';
      this.data.zalo_notify_campaigns.unshift(campaign);
      this.save();
      this.addAudit('CREATE_CAMPAIGN', user && user.full_name, user && user.role, 'Tạo bản nháp thông báo: ' + campaign.title);
      return { success: true, campaign: campaign };
    } else {
      var idx = this.data.zalo_notify_campaigns.findIndex(function (c) { return c.id === campaign.id; });
      if (idx === -1) return { success: false, error: 'Không tìm thấy thông báo để cập nhật.' };
      campaign.updated_at = nowStr;
      this.data.zalo_notify_campaigns[idx] = Object.assign({}, this.data.zalo_notify_campaigns[idx], campaign);
      this.save();
      this.addAudit('UPDATE_CAMPAIGN', user && user.full_name, user && user.role, 'Cập nhật thông báo: ' + campaign.title);
      return { success: true, campaign: this.data.zalo_notify_campaigns[idx] };
    }
  };

  ZaloNotifyEngine.prototype.submitCampaign = function (campaignId, user) {
    var c = this.getCampaignById(campaignId);
    if (!c) return { success: false, error: 'Không tìm thấy thông báo.' };
    c.status = 'PENDING_APPROVAL';
    c.updated_at = new Date().toISOString();
    this.save();
    this.addAudit('SUBMIT_CAMPAIGN', user && user.full_name, user && user.role, 'Trình phê duyệt thông báo: ' + c.title);
    return { success: true, campaign: c };
  };

  ZaloNotifyEngine.prototype.approveCampaign = function (campaignId, user, roleParam) {
    var role = roleParam || (user && user.role) || (user === 'ADMIN' || user === 'BI_THU' ? user : '');
    var userName = (typeof user === 'string' && user !== 'ADMIN' && user !== 'BI_THU') ? user : ((user && user.full_name) || 'Hồ Văn Mão (Bí thư)');
    if (role && role !== 'ADMIN' && role !== 'BI_THU') {
      return { success: false, error: 'Chỉ Bí thư Chi bộ hoặc Quản trị viên (ADMIN) mới có quyền phê duyệt thông báo.' };
    }
    var c = this.getCampaignById(campaignId);
    if (!c) return { success: false, error: 'Không tìm thấy thông báo.' };
    c.status = 'APPROVED';
    c.approver_id = (user && (user.id || user.username)) || 'usr_bithu';
    c.approver_name = userName;
    c.updated_at = new Date().toISOString();

    // Tự động khởi tạo hàng đợi gửi nếu chưa có
    this.prepareDispatchQueue(c.id, user);

    this.save();
    this.addAudit('APPROVE_CAMPAIGN', userName, role || 'ADMIN', 'Phê duyệt thông báo: ' + c.title);
    return { success: true, campaign: c };
  };

  ZaloNotifyEngine.prototype.rejectCampaign = function (campaignId, reason, user, roleParam) {
    var role = roleParam || (user && user.role) || (user === 'ADMIN' || user === 'BI_THU' ? user : '');
    var userName = (typeof user === 'string' && user !== 'ADMIN' && user !== 'BI_THU') ? user : ((user && user.full_name) || 'Hồ Văn Mão (Bí thư)');
    if (role && role !== 'ADMIN' && role !== 'BI_THU') {
      return { success: false, error: 'Chỉ Bí thư Chi bộ hoặc Quản trị viên mới có quyền từ chối thông báo.' };
    }
    var c = this.getCampaignById(campaignId);
    if (!c) return { success: false, error: 'Không tìm thấy thông báo.' };
    c.status = 'REJECTED';
    c.notes = (c.notes ? c.notes + '\n' : '') + 'Từ chối duyệt: ' + (reason || 'Cần chỉnh sửa lại');
    c.updated_at = new Date().toISOString();
    this.save();
    this.addAudit('REJECT_CAMPAIGN', userName, role || 'ADMIN', 'Từ chối thông báo: ' + c.title + ' (Lý do: ' + reason + ')');
    return { success: true, campaign: c };
  };

  /* ---------------- MODULE E: HỖ TRỢ GỬI ZALO CÁ NHÂN (CORE WORKFLOW) ---------------- */
  ZaloNotifyEngine.prototype.prepareDispatchQueue = function (campaignId, user) {
    var c = this.getCampaignById(campaignId);
    if (!c) return [];

    var existing = this.data.zalo_notify_recipients.filter(function (r) {
      return r.campaign_id === campaignId;
    });
    if (existing.length > 0) return existing;

    var queue = [];
    var addedIds = {};

    // 1. Lấy người nhận từ các nhóm được chọn
    var grpIds = c.recipient_group_ids || c.group_ids || [];
    var contacts = this.data.zalo_notify_contacts || [];
    var groups = this.data.zalo_notify_groups || [];

    // Thêm các thẻ đại diện cho nhóm Zalo chung nếu có link
    grpIds.forEach(function (gid) {
      var g = groups.find(function (x) { return x.id === gid; });
      if (g) {
        queue.push({
          id: 'rec_grp_' + g.id + '_' + Date.now().toString(36),
          campaign_id: campaignId,
          target_id: g.id,
          recipient_name: g.name + ' [NHÓM CHUNG]',
          phone: '',
          zalo_link: g.link || '',
          recipient_type: 'GROUP',
          status: 'PENDING',
          confirmed_by: '',
          confirmed_at: '',
          notes: 'Gửi vào cuộc trò chuyện nhóm Zalo'
        });
      }
    });

    // 2. Thêm từng cá nhân thuộc các nhóm được chọn
    contacts.forEach(function (cnt) {
      if (grpIds.indexOf(cnt.group_id) >= 0 && !addedIds[cnt.id]) {
        addedIds[cnt.id] = true;
        queue.push({
          id: 'rec_' + cnt.id + '_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 3),
          campaign_id: campaignId,
          target_id: cnt.id,
          recipient_name: cnt.full_name,
          phone: cnt.phone || '',
          zalo_link: cnt.phone ? 'https://zalo.me/' + cnt.phone : 'https://chat.zalo.me',
          recipient_type: 'INDIVIDUAL',
          status: 'PENDING',
          confirmed_by: '',
          confirmed_at: '',
          notes: cnt.group_name || ''
        });
      }
    });

    // 3. Thêm cá nhân được chọn trực tiếp
    var directIds = c.recipient_contact_ids || c.recipient_ids || [];
    directIds.forEach(function (cid) {
      if (!addedIds[cid]) {
        var cnt = contacts.find(function (x) { return x.id === cid; });
        if (cnt) {
          addedIds[cid] = true;
          queue.push({
            id: 'rec_' + cnt.id + '_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 3),
            campaign_id: campaignId,
            target_id: cnt.id,
            recipient_name: cnt.full_name,
            phone: cnt.phone || '',
            zalo_link: cnt.phone ? 'https://zalo.me/' + cnt.phone : 'https://chat.zalo.me',
            recipient_type: 'INDIVIDUAL',
            status: 'PENDING',
            confirmed_by: '',
            confirmed_at: '',
            notes: cnt.group_name || 'Chọn trực tiếp'
          });
        }
      }
    });

    this.data.zalo_notify_recipients = this.data.zalo_notify_recipients.concat(queue);
    this.save();
    return queue;
  };

  ZaloNotifyEngine.prototype.getDispatchQueue = function (campaignId) {
    if (!campaignId) return [];
    return this.data.zalo_notify_recipients.filter(function (r) {
      return r.campaign_id === campaignId;
    });
  };

  /* Cá nhân hoá nội dung tin nhắn trước khi sao chép */
  ZaloNotifyEngine.prototype.getPersonalizedContent = function (campaignId, recipientItem) {
    var c = this.getCampaignById(campaignId);
    if (!c) return '';
    var text = c.content;
    var name = recipientItem.recipient_name.replace(' [NHÓM CHUNG]', '');
    var currentMonth = (new Date().getMonth() + 1).toString();

    text = text.replace(/\{TEN\}/g, name);
    text = text.replace(/\{THANG\}/g, currentMonth);
    text = text.replace(/\{DON_VI\}/g, 'Tổ dân phố Lương Hậu');
    text = text.replace(/\{CHUC_VU\}/g, recipientItem.notes || 'Thành viên');
    return text;
  };

  /* Ghi nhận sao chép nội dung */
  ZaloNotifyEngine.prototype.recordCopyAction = function (campaignId, recipientId, user) {
    var rec = this.data.zalo_notify_recipients.find(function (r) { return r.id === recipientId; });
    if (rec && rec.status === 'PENDING') {
      rec.status = 'PROCESSING';
      this.save();
    }
    this.logDelivery(campaignId, recipientId, 'COPY_CONTENT', user, 'PROCESSING', 'Đã sao chép nội dung thông báo vào clipboard');
  };

  /* Ghi nhận mở Zalo */
  ZaloNotifyEngine.prototype.recordOpenZalo = function (campaignId, recipientId, user) {
    this.logDelivery(campaignId, recipientId, 'OPEN_ZALO', user, 'PROCESSING', 'Đã mở Zalo để chọn cuộc trò chuyện');
  };

  /* Cập nhật xác nhận kết quả gửi từ người dùng */
  ZaloNotifyEngine.prototype.updateDeliveryStatus = function (recipientId, status, user, note) {
    var rec = this.data.zalo_notify_recipients.find(function (r) { return r.id === recipientId; });
    if (!rec) return { success: false, error: 'Không tìm thấy người nhận trong danh sách gửi.' };

    rec.status = status; // 'CONFIRMED' | 'FAILED' | 'SKIPPED'
    rec.confirmed_by = (user && user.full_name) || 'Người quản trị';
    rec.confirmed_at = new Date().toISOString();
    if (note) rec.notes = note;

    this.save();
    this.logDelivery(rec.campaign_id, rec.id, 'CONFIRM_STATUS_' + status, user, status, note || ('Xác nhận trạng thái: ' + status));
    this.addAudit('CONFIRM_SEND', user && user.full_name, user && user.role, 'Xác nhận gửi cho: ' + rec.recipient_name + ' -> ' + status);

    return { success: true, recipient: rec };
  };

  ZaloNotifyEngine.prototype.logDelivery = function (campaignId, recipientId, action, user, status, notes) {
    var entry = {
      id: 'dlog_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      campaign_id: campaignId,
      recipient_id: recipientId,
      action: action,
      status: status,
      status_result: status,
      performer_name: (user && user.full_name) || 'Cán bộ',
      timestamp: new Date().toISOString(),
      notes: notes || ''
    };
    this.data.zalo_notify_delivery_logs.unshift(entry);
    if (this.data.zalo_notify_delivery_logs.length > 1000) {
      this.data.zalo_notify_delivery_logs = this.data.zalo_notify_delivery_logs.slice(0, 1000);
    }
    this.save();
  };

  /* ---------------- MODULE F: LỊCH THÔNG BÁO ---------------- */
  ZaloNotifyEngine.prototype.getSchedules = function () {
    var campaigns = this.data.zalo_notify_campaigns || [];
    var explicitScheds = this.data.zalo_notify_schedules || [];
    var now = new Date();
    var list = campaigns.map(function (c) {
      var isOverdue = false;
      if (c.scheduled_at && new Date(c.scheduled_at) < now && c.status !== 'APPROVED') {
        isOverdue = true;
      }
      return {
        id: c.id,
        campaign_id: c.id,
        title: c.title,
        scheduled_at: c.scheduled_at,
        remind_at: c.scheduled_at,
        status: c.status,
        author: c.author_name,
        is_overdue: isOverdue
      };
    });

    explicitScheds.forEach(function (s) {
      list.push({
        id: s.id,
        campaign_id: s.campaign_id,
        title: s.title,
        scheduled_at: s.remind_at,
        remind_at: s.remind_at,
        status: s.status,
        author: s.assignee_name,
        is_overdue: s.remind_at ? new Date(s.remind_at) < now : false
      });
    });

    return list.sort(function (a, b) {
      return new Date(b.scheduled_at || 0) - new Date(a.scheduled_at || 0);
    });
  };

  /* ---------------- MODULE G: BÁO CÁO & XUẤT DỮ LIỆU ---------------- */
  ZaloNotifyEngine.prototype.exportReportCsv = function (campaignId) {
    var c = this.getCampaignById(campaignId);
    var queue = this.getDispatchQueue(campaignId);
    var header = ['Mã đợt gửi', 'Tiêu đề thông báo', 'Tên người nhận', 'Số điện thoại', 'Loại', 'Trạng thái xác nhận', 'Người xác nhận', 'Thời gian xác nhận', 'Ghi chú'];
    var rows = [header];

    queue.forEach(function (q) {
      rows.push([
        c ? c.id : '',
        '"' + ((c && c.title) || '').replace(/"/g, '""') + '"',
        '"' + (q.recipient_name || '').replace(/"/g, '""') + '"',
        '\t' + (q.phone || ''),
        q.recipient_type === 'GROUP' ? 'Nhóm Zalo' : 'Cá nhân',
        q.status,
        '"' + (q.confirmed_by || '').replace(/"/g, '""') + '"',
        q.confirmed_at || '',
        '"' + (q.notes || '').replace(/"/g, '""') + '"'
      ]);
    });

    return '\uFEFF' + rows.map(function (r) { return r.join(','); }).join('\r\n');
  };

  /* ---------------- CONVENIENCE ALIASES & PROGRAMMATIC API ---------------- */
  ZaloNotifyEngine.prototype.getStats = function () {
    var m = this.getMetrics();
    return {
      total_campaigns: m.totalCampaigns,
      drafts: m.draftCount,
      pending: m.pendingCount,
      approved: m.approvedCount,
      scheduled: m.scheduledCount,
      confirmed_sent: m.confirmedSent,
      incomplete: m.incomplete,
      total_contacts: m.totalContacts,
      total_groups: m.totalGroups,
      recent_logs: m.recentLogs
    };
  };

  ZaloNotifyEngine.prototype.getAuditLogs = function () {
    return this.data.zalo_notify_audit_logs || [];
  };

  ZaloNotifyEngine.prototype.getDeliveryLogs = function (campaignId) {
    var logs = this.data.zalo_notify_delivery_logs || [];
    if (campaignId) {
      return logs.filter(function (l) { return l.campaign_id === campaignId; });
    }
    return logs;
  };

  ZaloNotifyEngine.prototype.buildQueue = function (campaignId) {
    var queue = this.prepareDispatchQueue(campaignId);
    var self = this;
    return queue.map(function (item) {
      return Object.assign({}, item, {
        message: self.getPersonalizedContent(campaignId, item)
      });
    });
  };

  ZaloNotifyEngine.prototype.confirmSend = function (campaignId, recipientId, status, note, user) {
    var uObj = (typeof user === 'string') ? { full_name: user, role: 'SENDER' } : user;
    return this.updateDeliveryStatus(recipientId, status, uObj, note);
  };

  ZaloNotifyEngine.prototype.getCampaign = function (id) {
    return this.getCampaignById(id);
  };

  ZaloNotifyEngine.prototype.createCampaign = function (campaign, user, role) {
    var uObj = (typeof user === 'string') ? { full_name: user, role: role || 'EDITOR' } : user;
    return this.saveCampaign(campaign, uObj);
  };

  ZaloNotifyEngine.prototype.addContact = function (contact, user, role) {
    var uObj = (typeof user === 'string') ? { full_name: user, role: role || 'ADMIN' } : user;
    var res = this.saveContact(contact, uObj);
    return {
      success: res.success,
      contact: res.contact,
      message: res.error || (res.success ? 'Thêm liên hệ thành công' : 'Thất bại')
    };
  };

  ZaloNotifyEngine.prototype.updateContact = function (id, data, user, role) {
    var uObj = (typeof user === 'string') ? { full_name: user, role: role || 'ADMIN' } : user;
    var payload = Object.assign({}, data, { id: id });
    var res = this.saveContact(payload, uObj);
    return {
      success: res.success,
      contact: res.contact,
      message: res.error || 'Cập nhật thành công'
    };
  };

  ZaloNotifyEngine.prototype.searchContacts = function (query, groupId) {
    return this.getContacts(query, groupId);
  };

  ZaloNotifyEngine.prototype.parseCSVContacts = function (csvText) {
    if (!csvText || !csvText.trim()) return [];
    var lines = csvText.split(/\r?\n/).filter(function (l) { return l.trim().length > 0; });
    var results = [];
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];
      if (i === 0 && (l.toLowerCase().indexOf('họ') >= 0 || l.toLowerCase().indexOf('name') >= 0)) continue;
      var parts = l.split(',').map(function (p) { return p.trim().replace(/^["']|["']$/g, ''); });
      if (parts[0]) {
        results.push({
          full_name: parts[0],
          phone: (parts[1] || '').replace(/\D/g, ''),
          group_name: parts[2] || 'Hộ dân',
          zalo_name: parts[3] || parts[0],
          consent_status: parts[4] && parts[4].toLowerCase().indexOf('không') >= 0 ? 'REJECTED' : 'CONSENTED',
          notes: parts[5] || 'Nhập từ CSV'
        });
      }
    }
    return results;
  };

  ZaloNotifyEngine.prototype.bulkAddContacts = function (contacts, user, role) {
    var uObj = (typeof user === 'string') ? { full_name: user, role: role || 'ADMIN' } : user;
    var added = 0;
    var duplicates = 0;
    var self = this;
    contacts.forEach(function (c) {
      var res = self.saveContact(c, uObj);
      if (res.success) added++;
      else duplicates++;
    });
    return { added: added, duplicates: duplicates, total: contacts.length };
  };

  ZaloNotifyEngine.prototype.addSchedule = function (sched, user, role) {
    var uObj = (typeof user === 'string') ? { full_name: user, role: role || 'ADMIN' } : user;
    var entry = {
      id: 'sch_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      campaign_id: sched.campaign_id,
      title: sched.title,
      remind_at: sched.remind_at,
      assignee_name: sched.assignee_name || (uObj && uObj.full_name) || 'Cán bộ',
      status: 'SCHEDULED',
      created_at: new Date().toISOString()
    };
    this.data.zalo_notify_schedules.push(entry);
    this.save();
    this.addAudit('CREATE_SCHEDULE', uObj && uObj.full_name, uObj && uObj.role, 'Tạo lịch nhắc: ' + sched.title);
    return { success: true, schedule: entry };
  };

  /* ---------------- GIAO DIỆN UI RENDERER ---------------- */
  function ZaloNotifyUI(engine, containerSelector) {
    this.engine = engine;
    this.container = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
    this.currentTab = 'dashboard';
    this.activeCampaignId = null;
    this.contactSearchQuery = '';
    this.contactGroupFilter = 'ALL';
    this.campaignStatusFilter = 'ALL';
  }

  ZaloNotifyUI.prototype.init = function (currentUser) {
    this.currentUser = currentUser || this.resolveCurrentUser();
    this.render();
  };

  ZaloNotifyUI.prototype.resolveCurrentUser = function () {
    if (typeof window !== 'undefined') {
      if (window.auth && typeof window.auth.getCurrentUser === 'function') {
        var u = window.auth.getCurrentUser();
        if (u) return u;
      }
      var s = localStorage.getItem('lh.nb.session') || sessionStorage.getItem('lh.nb.session');
      if (s) {
        try {
          var parsed = JSON.parse(s);
          if (parsed && parsed.hoTen) {
            return {
              id: parsed.id,
              full_name: parsed.hoTen,
              role: (parsed.chucVu && parsed.chucVu.indexOf('Bí thư') >= 0) ? 'BI_THU' : 'CHI_UY'
            };
          }
        } catch (e) {}
      }
    }
    // Mặc định vai trò quản trị nội bộ
    return { id: 'usr_bithu', full_name: 'Hồ Văn Mão', role: 'BI_THU' };
  };

  ZaloNotifyUI.prototype.render = function () {
    if (!this.container) return;
    var user = this.currentUser;
    var isApprover = user && (user.role === 'BI_THU' || user.role === 'ADMIN');

    this.container.innerHTML =
      '<div class="zn-module">' +
        '<!-- BANNER CHÍNH -->' +
        '<div class="zn-banner">' +
          '<div class="zn-banner-title">' +
            '<div class="zn-banner-icon">🔔</div>' +
            '<div>' +
              '<h3>QUẢN LÝ THÔNG BÁO ZALO CÁ NHÂN — CHI BỘ LƯƠNG HẬU</h3>' +
              '<p>Hệ thống hỗ trợ soạn, chuẩn hoá mẫu, gửi đích danh qua Zalo cá nhân có đối soát & xác nhận</p>' +
            '</div>' +
          '</div>' +
          '<div class="zn-banner-badge">' +
            '<span>🛡️ Phân quyền: <b>' + (user.role || 'CÁN BỘ') + '</b></span>' +
            '<span>(' + (user.full_name || 'Đồng chí') + ')</span>' +
          '</div>' +
        '</div>' +

        '<!-- ĐIỀU HƯỚNG CÁC PHÂN HỆ -->' +
        '<div class="zn-tabs">' +
          '<button class="zn-tab-btn ' + (this.currentTab === 'dashboard' ? 'active' : '') + '" data-zntab="dashboard">📊 Tổng Quan</button>' +
          '<button class="zn-tab-btn ' + (this.currentTab === 'contacts' ? 'active' : '') + '" data-zntab="contacts">👥 Danh Bạ Người Nhận</button>' +
          '<button class="zn-tab-btn ' + (this.currentTab === 'groups' ? 'active' : '') + '" data-zntab="groups">💬 Danh Mục Nhóm Zalo</button>' +
          '<button class="zn-tab-btn ' + (this.currentTab === 'composer' ? 'active' : '') + '" data-zntab="composer">📝 Soạn &amp; Duyệt Thông Báo</button>' +
          '<button class="zn-tab-btn ' + (this.currentTab === 'dispatch' ? 'active' : '') + '" data-zntab="dispatch">🚀 Hỗ Trợ Gửi Zalo</button>' +
          '<button class="zn-tab-btn ' + (this.currentTab === 'schedules' ? 'active' : '') + '" data-zntab="schedules">📅 Lịch Nhắc Việc</button>' +
          '<button class="zn-tab-btn ' + (this.currentTab === 'reports' ? 'active' : '') + '" data-zntab="reports">📜 Nhật Ký &amp; Báo Cáo</button>' +
        '</div>' +

        '<!-- VÙNG NỘI DUNG CÁC TAB -->' +
        '<div id="zn-tab-content"></div>' +
        '<div id="zn-modal-container"></div>' +
      '</div>';

    this.bindGlobalEvents();
    this.renderCurrentSubtab();
  };

  ZaloNotifyUI.prototype.bindGlobalEvents = function () {
    var self = this;
    var tabBtns = this.container.querySelectorAll('.zn-tab-btn');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.currentTab = btn.getAttribute('data-zntab');
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        self.renderCurrentSubtab();
      });
    });
  };

  ZaloNotifyUI.prototype.renderCurrentSubtab = function () {
    var contentBox = this.container.querySelector('#zn-tab-content');
    if (!contentBox) return;

    if (this.currentTab === 'dashboard') this.renderDashboard(contentBox);
    else if (this.currentTab === 'contacts') this.renderContacts(contentBox);
    else if (this.currentTab === 'groups') this.renderGroups(contentBox);
    else if (this.currentTab === 'composer') this.renderComposer(contentBox);
    else if (this.currentTab === 'dispatch') this.renderDispatch(contentBox);
    else if (this.currentTab === 'schedules') this.renderSchedules(contentBox);
    else if (this.currentTab === 'reports') this.renderReports(contentBox);
  };

  /* ---------------- RENDER TAB: DASHBOARD ---------------- */
  ZaloNotifyUI.prototype.renderDashboard = function (box) {
    var m = this.engine.getMetrics();
    var self = this;

    box.innerHTML =
      '<div class="zn-pane active">' +
        '<!-- Chỉ số tổng quan -->' +
        '<div class="zn-stat-grid">' +
          '<div class="zn-stat-card"><b>' + m.totalCampaigns + '</b><span>Tổng thông báo</span></div>' +
          '<div class="zn-stat-card amber"><b>' + m.draftCount + '</b><span>Bản nháp</span></div>' +
          '<div class="zn-stat-card purple"><b>' + m.pendingCount + '</b><span>Chờ phê duyệt</span></div>' +
          '<div class="zn-stat-card green"><b>' + m.approvedCount + '</b><span>Đã phê duyệt</span></div>' +
          '<div class="zn-stat-card blue"><b>' + m.confirmedSent + '</b><span>Đã xác nhận gửi</span></div>' +
          '<div class="zn-stat-card"><b>' + m.incomplete + '</b><span>Chưa hoàn thành</span></div>' +
          '<div class="zn-stat-card green"><b>' + m.totalContacts + '</b><span>Người nhận</span></div>' +
          '<div class="zn-stat-card blue"><b>' + m.totalGroups + '</b><span>Nhóm Zalo</span></div>' +
        '</div>' +

        '<!-- Callout an toàn -->' +
        '<div class="zn-security-callout">' +
          '<b>🛡️ QUY ĐỊNH BẢO ĐẢM AN TOÀN TRUYỀN THÔNG ZALO NỘI BỘ:</b>' +
          '<ul>' +
            '<li>Không sử dụng công cụ tự động spam hàng loạt; mọi tin gửi đều được thực hiện từ ứng dụng Zalo chính thức.</li>' +
            '<li>Nội dung mang tính chất nội bộ Chi bộ, sinh hoạt Đảng và điều hành cơ sở TDP Lương Hậu.</li>' +
            '<li>Sau khi dán và gửi trên Zalo cá nhân, cán bộ chủ động bấm "Xác nhận gửi" để ghi nhật ký công tác.</li>' +
          '</ul>' +
        '</div>' +

        '<!-- Thao tác nhanh -->' +
        '<div class="zn-bar" style="margin-top:14px;">' +
          '<div style="font-weight:700;font-size:13px;color:#1e293b;">Hoạt động gần đây</div>' +
          '<div style="display:flex;gap:6px;">' +
            '<button class="zn-btn zn-btn-primary" id="btn-quick-compose">📝 Soạn thông báo mới</button>' +
            '<button class="zn-btn zn-btn-zalo" id="btn-quick-dispatch">🚀 Mở gửi Zalo</button>' +
          '</div>' +
        '</div>' +

        '<div class="zn-table-wrap">' +
          '<table class="zn-table">' +
            '<thead>' +
              '<tr><th>Thời gian</th><th>Cán bộ</th><th>Thao tác</th><th>Chi tiết</th></tr>' +
            '</thead>' +
            '<tbody>' +
              (m.recentLogs.map(function (l) {
                var d = new Date(l.timestamp).toLocaleString('vi-VN');
                return '<tr>' +
                  '<td style="white-space:nowrap;color:#64748b;">' + d + '</td>' +
                  '<td><b>' + (l.user_name || 'Hệ thống') + '</b></td>' +
                  '<td><span class="zn-badge zn-badge-draft">' + l.action + '</span></td>' +
                  '<td>' + (l.details || '') + '</td>' +
                '</tr>';
              }).join('') || '<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:16px;">Chưa có hoạt động nào.</td></tr>') +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    var btnCompose = box.querySelector('#btn-quick-compose');
    if (btnCompose) {
      btnCompose.addEventListener('click', function () {
        self.switchToTab('composer');
      });
    }

    var btnDispatch = box.querySelector('#btn-quick-dispatch');
    if (btnDispatch) {
      btnDispatch.addEventListener('click', function () {
        self.switchToTab('dispatch');
      });
    }
  };

  ZaloNotifyUI.prototype.switchToTab = function (tabName) {
    this.currentTab = tabName;
    var tabBtns = this.container.querySelectorAll('.zn-tab-btn');
    tabBtns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-zntab') === tabName);
    });
    this.renderCurrentSubtab();
  };

  /* ---------------- RENDER TAB: CONTACTS ---------------- */
  ZaloNotifyUI.prototype.renderContacts = function (box) {
    var self = this;
    var contacts = this.engine.getContacts(this.contactSearchQuery, this.contactGroupFilter);
    var groups = this.engine.getGroups();

    box.innerHTML =
      '<div class="zn-pane active">' +
        '<div class="zn-bar">' +
          '<input type="text" class="zn-search-input" id="zn-contact-search" placeholder="🔍 Tìm kiếm theo tên, số điện thoại, chức vụ..." value="' + (this.contactSearchQuery || '') + '">' +
          '<select class="zn-select" id="zn-contact-group-filter" style="width:auto;min-width:180px;">' +
            '<option value="ALL">Tất cả nhóm đối tượng (' + this.engine.data.zalo_notify_contacts.length + ')</option>' +
            groups.map(function (g) {
              return '<option value="' + g.id + '" ' + (self.contactGroupFilter === g.id ? 'selected' : '') + '>' + g.name + '</option>';
            }).join('') +
          '</select>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
            '<button class="zn-btn zn-btn-primary" id="btn-add-contact">+ Thêm Người Nhận</button>' +
            '<button class="zn-btn zn-btn-secondary" id="btn-import-excel">📥 Nhập Excel/CSV</button>' +
            '<button class="zn-btn zn-btn-outline" id="btn-export-excel">📤 Xuất Excel</button>' +
          '</div>' +
        '</div>' +

        '<div class="zn-table-wrap">' +
          '<table class="zn-table">' +
            '<thead>' +
              '<tr>' +
                '<th>Họ và tên</th>' +
                '<th>Nhóm đối tượng</th>' +
                '<th>Số điện thoại / Zalo</th>' +
                '<th>Đồng ý nhận</th>' +
                '<th>Ghi chú</th>' +
                '<th style="text-align:right;">Thao tác</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              (contacts.map(function (c) {
                return '<tr>' +
                  '<td><b>' + c.full_name + '</b></td>' +
                  '<td><span class="zn-badge zn-badge-draft">' + (c.group_name || 'Khác') + '</span></td>' +
                  '<td>' + (c.phone ? '<a href="tel:' + c.phone + '" style="color:#0068ff;font-weight:700;">' + c.phone + '</a>' : '<span style="color:#94a3b8;">Chưa có SĐT</span>') + '</td>' +
                  '<td>' + (c.consent_status === 'CONSENTED' ? '<span class="zn-badge zn-badge-confirmed">✔ Đã đồng ý</span>' : '<span class="zn-badge zn-badge-pending">Chờ xác nhận</span>') + '</td>' +
                  '<td style="color:#64748b;font-size:11.5px;">' + (c.notes || '') + '</td>' +
                  '<td style="text-align:right;white-space:nowrap;">' +
                    '<button class="zn-btn zn-btn-secondary zn-btn-sm" data-edit-contact="' + c.id + '" style="margin-right:4px;">Sửa</button>' +
                    '<button class="zn-btn zn-btn-danger zn-btn-sm" data-del-contact="' + c.id + '">Xóa</button>' +
                  '</td>' +
                '</tr>';
              }).join('') || '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:20px;">Không tìm thấy người nhận nào phù hợp.</td></tr>') +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    // Search events
    var searchInput = box.querySelector('#zn-contact-search');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        self.contactSearchQuery = e.target.value;
        self.renderContacts(box);
      });
    }

    var groupFilter = box.querySelector('#zn-contact-group-filter');
    if (groupFilter) {
      groupFilter.addEventListener('change', function (e) {
        self.contactGroupFilter = e.target.value;
        self.renderContacts(box);
      });
    }

    // Add contact button
    box.querySelector('#btn-add-contact').addEventListener('click', function () {
      self.showContactModal();
    });

    // Import Excel
    box.querySelector('#btn-import-excel').addEventListener('click', function () {
      self.showImportModal();
    });

    // Export Excel
    box.querySelector('#btn-export-excel').addEventListener('click', function () {
      var csv = self.engine.exportContactsToCsv();
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'Danh_Ba_Nhan_Tin_Zalo_Luong_Hau_' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Edit contact events
    box.querySelectorAll('[data-edit-contact]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cid = btn.getAttribute('data-edit-contact');
        var c = self.engine.data.zalo_notify_contacts.find(function (x) { return x.id === cid; });
        if (c) self.showContactModal(c);
      });
    });

    // Delete contact events
    box.querySelectorAll('[data-del-contact]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cid = btn.getAttribute('data-del-contact');
        if (confirm('Đồng chí có chắc chắn muốn xóa người nhận này khỏi danh bạ?')) {
          self.engine.deleteContact(cid, self.currentUser);
          self.renderContacts(box);
        }
      });
    });
  };

  /* Modal Thêm / Sửa Người Nhận */
  ZaloNotifyUI.prototype.showContactModal = function (contact) {
    var self = this;
    var modalContainer = this.container.querySelector('#zn-modal-container');
    var isEdit = !!contact;
    var c = contact || { full_name: '', phone: '', group_id: 'grp_chibo', zalo_name: '', notes: '', consent_status: 'CONSENTED' };
    var groups = this.engine.getGroups();

    modalContainer.innerHTML =
      '<div class="zn-modal-mask active">' +
        '<div class="zn-modal-card">' +
          '<div class="zn-modal-head">' +
            '<h4>' + (isEdit ? 'SỬA THÔNG TIN NGƯỜI NHẬN' : 'THÊM NGƯỜI NHẬN VÀO DANH BẠ') + '</h4>' +
            '<button class="zn-btn zn-btn-secondary zn-btn-sm" id="zn-modal-close">✕</button>' +
          '</div>' +
          '<div class="zn-modal-body">' +
            '<form id="zn-contact-form">' +
              '<div class="zn-form-group">' +
                '<label>Họ và tên <span class="zn-req">*</span></label>' +
                '<input type="text" class="zn-input" id="cf-name" value="' + (c.full_name || '') + '" required placeholder="Ví dụ: Nguyễn Văn A">' +
              '</div>' +
              '<div class="zn-form-group">' +
                '<label>Số điện thoại (dùng tìm Zalo)</label>' +
                '<input type="text" class="zn-input" id="cf-phone" value="' + (c.phone || '') + '" placeholder="Ví dụ: 0912345678">' +
                '<div class="zn-hint">Số điện thoại chỉ được lưu trữ khi được cá nhân cung cấp hợp pháp.</div>' +
              '</div>' +
              '<div class="zn-form-group">' +
                '<label>Nhóm đối tượng</label>' +
                '<select class="zn-select" id="cf-group">' +
                  groups.map(function (g) {
                    return '<option value="' + g.id + '" ' + (c.group_id === g.id ? 'selected' : '') + '>' + g.name + '</option>';
                  }).join('') +
                '</select>' +
              '</div>' +
              '<div class="zn-form-group">' +
                '<label>Tên hiển thị Zalo (nếu có)</label>' +
                '<input type="text" class="zn-input" id="cf-zalo" value="' + (c.zalo_name || '') + '" placeholder="Tên nick Zalo của người nhận">' +
              '</div>' +
              '<div class="zn-form-group">' +
                '<label>Ghi chú chức vụ / nhiệm vụ</label>' +
                '<input type="text" class="zn-input" id="cf-notes" value="' + (c.notes || '') + '" placeholder="Ví dụ: Đảng viên Đội 10">' +
              '</div>' +
              '<div class="zn-form-group">' +
                '<label><input type="checkbox" id="cf-consent" ' + (c.consent_status === 'CONSENTED' ? 'checked' : '') + '> Đã ghi nhận sự đồng ý nhận thông báo</label>' +
              '</div>' +
            '</form>' +
          '</div>' +
          '<div class="zn-modal-foot">' +
            '<button class="zn-btn zn-btn-secondary" id="zn-btn-cancel">Hủy</button>' +
            '<button class="zn-btn zn-btn-primary" id="zn-btn-save-contact">Lưu Bản Ghi</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var closeBtn = modalContainer.querySelector('#zn-modal-close');
    var cancelBtn = modalContainer.querySelector('#zn-btn-cancel');
    function closeModal() { modalContainer.innerHTML = ''; }
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    modalContainer.querySelector('#zn-btn-save-contact').addEventListener('click', function () {
      var name = modalContainer.querySelector('#cf-name').value.trim();
      var phone = modalContainer.querySelector('#cf-phone').value.trim();
      var grpSelect = modalContainer.querySelector('#cf-group');
      var groupId = grpSelect.value;
      var groupName = grpSelect.options[grpSelect.selectedIndex].text;
      var zaloName = modalContainer.querySelector('#cf-zalo').value.trim();
      var notes = modalContainer.querySelector('#cf-notes').value.trim();
      var consent = modalContainer.querySelector('#cf-consent').checked ? 'CONSENTED' : 'PENDING';

      if (!name) {
        alert('Vui lòng nhập Họ và tên.');
        return;
      }

      var contactData = {
        id: c.id,
        full_name: name,
        phone: phone,
        group_id: groupId,
        group_name: groupName,
        zalo_name: zaloName || name,
        notes: notes,
        consent_status: consent,
        status: 'ACTIVE'
      };

      var res = self.engine.saveContact(contactData, self.currentUser);
      if (!res.success) {
        alert('Lỗi: ' + res.error);
        return;
      }

      closeModal();
      self.renderCurrentSubtab();
    });
  };

  /* Modal Nhập Excel / CSV */
  ZaloNotifyUI.prototype.showImportModal = function () {
    var self = this;
    var modalContainer = this.container.querySelector('#zn-modal-container');

    modalContainer.innerHTML =
      '<div class="zn-modal-mask active">' +
        '<div class="zn-modal-card">' +
          '<div class="zn-modal-head">' +
            '<h4>NHẬP DANH SÁCH NGƯỜI NHẬN TỪ EXCEL / CSV</h4>' +
            '<button class="zn-btn zn-btn-secondary zn-btn-sm" id="zn-modal-close">✕</button>' +
          '</div>' +
          '<div class="zn-modal-body">' +
            '<div class="zn-security-callout">' +
              'Định dạng mỗi dòng một người nhận theo mẫu:<br>' +
              '<code>Họ và tên, Số điện thoại, Nhóm đối tượng, Ghi chú</code><br>' +
              '<i>Ví dụ: Nguyễn Văn An, 0912345678, Hộ dân Đội 8, Hộ trưởng</i>' +
            '</div>' +
            '<div class="zn-form-group">' +
              '<label>Chọn tệp CSV / TXT từ máy tính:</label>' +
              '<input type="file" id="zn-import-file" accept=".csv,.txt,.tsv" class="zn-input">' +
            '</div>' +
            '<div class="zn-form-group">' +
              '<label>Hoặc dán trực tiếp dữ liệu vào đây:</label>' +
              '<textarea id="zn-import-paste" class="zn-textarea" placeholder="Nguyễn Văn A, 0912345678, Hộ dân, Đội 8&#10;Trần Thị B, 0987654321, Đảng viên, Đội 9"></textarea>' +
            '</div>' +
          '</div>' +
          '<div class="zn-modal-foot">' +
            '<button class="zn-btn zn-btn-secondary" id="zn-btn-cancel">Đóng</button>' +
            '<button class="zn-btn zn-btn-primary" id="zn-btn-run-import">Tiến Hành Nhập</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    function closeModal() { modalContainer.innerHTML = ''; }
    modalContainer.querySelector('#zn-modal-close').addEventListener('click', closeModal);
    modalContainer.querySelector('#zn-btn-cancel').addEventListener('click', closeModal);

    var fileInput = modalContainer.querySelector('#zn-import-file');
    var pasteArea = modalContainer.querySelector('#zn-import-paste');

    fileInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        pasteArea.value = ev.target.result;
      };
      reader.readAsText(file, 'utf-8');
    });

    modalContainer.querySelector('#zn-btn-run-import').addEventListener('click', function () {
      var text = pasteArea.value;
      if (!text || !text.trim()) {
        alert('Vui lòng chọn tệp hoặc dán nội dung danh sách cần nhập.');
        return;
      }

      var res = self.engine.importContactsFromText(text, self.currentUser);
      if (!res.success) {
        alert('Lỗi: ' + res.error);
        return;
      }

      alert('Đã nhập thành công ' + res.imported + ' bản ghi!\n- Bản ghi trùng lặp đã bỏ qua: ' + res.duplicates + '\n- Bản ghi không hợp lệ: ' + res.skipped);
      closeModal();
      self.renderCurrentSubtab();
    });
  };

  /* ---------------- RENDER TAB: GROUPS ---------------- */
  ZaloNotifyUI.prototype.renderGroups = function (box) {
    var self = this;
    var groups = this.engine.getGroups();

    box.innerHTML =
      '<div class="zn-pane active">' +
        '<div class="zn-bar">' +
          '<div style="font-weight:700;font-size:13px;color:#1e293b;">Danh mục Nhóm Zalo đang sử dụng</div>' +
          '<button class="zn-btn zn-btn-primary" id="btn-add-group">+ Thêm Nhóm Mới</button>' +
        '</div>' +

        '<div class="zn-table-wrap">' +
          '<table class="zn-table">' +
            '<thead>' +
              '<tr>' +
                '<th>Tên nhóm Zalo</th>' +
                '<th>Phân loại</th>' +
                '<th>Người phụ trách</th>' +
                '<th>Liên kết nhóm</th>' +
                '<th>Ghi chú</th>' +
                '<th>Trạng thái</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              (groups.map(function (g) {
                return '<tr>' +
                  '<td><b>' + g.name + '</b></td>' +
                  '<td><span class="zn-badge zn-badge-draft">' + (g.category || 'Chung') + '</span></td>' +
                  '<td>' + (g.manager || 'Chi bộ') + '</td>' +
                  '<td>' + (g.link ? '<a href="' + g.link + '" target="_blank" rel="noopener noreferrer" style="color:#0068ff;font-weight:700;">' + g.link + ' ↗</a>' : '<span style="color:#94a3b8;">Chưa có link</span>') + '</td>' +
                  '<td style="color:#64748b;font-size:11.5px;">' + (g.notes || '') + '</td>' +
                  '<td>' + (g.status === 'ACTIVE' ? '<span class="zn-badge zn-badge-confirmed">Đang dùng</span>' : '<span class="zn-badge zn-badge-draft">Tạm ngưng</span>') + '</td>' +
                '</tr>';
              }).join('')) +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    box.querySelector('#btn-add-group').addEventListener('click', function () {
      self.showGroupModal();
    });
  };

  ZaloNotifyUI.prototype.showGroupModal = function (group) {
    var self = this;
    var modalContainer = this.container.querySelector('#zn-modal-container');
    var g = group || { name: '', category: 'Chi bộ', link: '', manager: '', notes: '', status: 'ACTIVE' };

    modalContainer.innerHTML =
      '<div class="zn-modal-mask active">' +
        '<div class="zn-modal-card">' +
          '<div class="zn-modal-head">' +
            '<h4>THÊM NHÓM ZALO ĐIỀU HÀNH</h4>' +
            '<button class="zn-btn zn-btn-secondary zn-btn-sm" id="zn-modal-close">✕</button>' +
          '</div>' +
          '<div class="zn-modal-body">' +
            '<form id="zn-group-form">' +
              '<div class="zn-form-group">' +
                '<label>Tên nhóm Zalo <span class="zn-req">*</span></label>' +
                '<input type="text" class="zn-input" id="gf-name" value="' + (g.name || '') + '" required placeholder="Ví dụ: Nhóm Chi bộ TDP Lương Hậu">' +
              '</div>' +
              '<div class="zn-form-group">' +
                '<label>Phân loại nhóm</label>' +
                '<select class="zn-select" id="gf-cat">' +
                  '<option value="Chi bộ">Chi bộ</option>' +
                  '<option value="Chi ủy">Chi ủy</option>' +
                  '<option value="Chính quyền">Chính quyền / Ban điều hành</option>' +
                  '<option value="Mặt trận">Ban Công tác Mặt trận</option>' +
                  '<option value="Đoàn thể">Đoàn thể</option>' +
                  '<option value="Cộng đồng">Cộng đồng / Hộ dân</option>' +
                  '<option value="Tùy chỉnh">Tùy chỉnh</option>' +
                '</select>' +
              '</div>' +
              '<div class="zn-form-group">' +
                '<label>Đường dẫn tham gia nhóm (Link Zalo)</label>' +
                '<input type="url" class="zn-input" id="gf-link" value="' + (g.link || '') + '" placeholder="Ví dụ: https://zalo.me/g/...">' +
              '</div>' +
              '<div class="zn-form-group">' +
                '<label>Người phụ trách nhóm</label>' +
                '<input type="text" class="zn-input" id="gf-manager" value="' + (g.manager || '') + '" placeholder="Ví dụ: Đ/c Hồ Văn Mão">' +
              '</div>' +
              '<div class="zn-form-group">' +
                '<label>Ghi chú</label>' +
                '<input type="text" class="zn-input" id="gf-notes" value="' + (g.notes || '') + '" placeholder="Mô tả phạm vi hoạt động của nhóm">' +
              '</div>' +
            '</form>' +
          '</div>' +
          '<div class="zn-modal-foot">' +
            '<button class="zn-btn zn-btn-secondary" id="zn-btn-cancel">Đóng</button>' +
            '<button class="zn-btn zn-btn-primary" id="zn-btn-save-group">Lưu Nhóm</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    function closeModal() { modalContainer.innerHTML = ''; }
    modalContainer.querySelector('#zn-modal-close').addEventListener('click', closeModal);
    modalContainer.querySelector('#zn-btn-cancel').addEventListener('click', closeModal);

    modalContainer.querySelector('#zn-btn-save-group').addEventListener('click', function () {
      var name = modalContainer.querySelector('#gf-name').value.trim();
      var category = modalContainer.querySelector('#gf-cat').value;
      var link = modalContainer.querySelector('#gf-link').value.trim();
      var manager = modalContainer.querySelector('#gf-manager').value.trim();
      var notes = modalContainer.querySelector('#gf-notes').value.trim();

      if (!name) {
        alert('Tên nhóm không được để trống.');
        return;
      }

      self.engine.saveGroup({
        name: name,
        category: category,
        link: link,
        manager: manager,
        notes: notes,
        status: 'ACTIVE'
      }, self.currentUser);

      closeModal();
      self.renderCurrentSubtab();
    });
  };

  /* ---------------- RENDER TAB: COMPOSER ---------------- */
  ZaloNotifyUI.prototype.renderComposer = function (box) {
    var self = this;
    var campaigns = this.engine.getCampaigns(this.campaignStatusFilter);
    var templates = this.engine.getTemplates();
    var groups = this.engine.getGroups();
    var isApprover = this.currentUser && (this.currentUser.role === 'BI_THU' || this.currentUser.role === 'ADMIN');

    box.innerHTML =
      '<div class="zn-pane active">' +
        '<div style="display:grid;grid-template-columns:minmax(320px, 1fr) minmax(320px, 1.2fr);gap:16px;">' +
          '<!-- Cột 1: Danh sách thông báo -->' +
          '<div>' +
            '<div class="zn-bar">' +
              '<div style="font-weight:700;font-size:13px;color:#1e293b;">Danh sách đợt thông báo</div>' +
              '<select class="zn-select" id="zn-camp-status-filter" style="width:auto;">' +
                '<option value="ALL">Tất cả trạng thái</option>' +
                '<option value="DRAFT" ' + (this.campaignStatusFilter === 'DRAFT' ? 'selected' : '') + '>Bản nháp</option>' +
                '<option value="PENDING_APPROVAL" ' + (this.campaignStatusFilter === 'PENDING_APPROVAL' ? 'selected' : '') + '>Chờ duyệt</option>' +
                '<option value="APPROVED" ' + (this.campaignStatusFilter === 'APPROVED' ? 'selected' : '') + '>Đã duyệt</option>' +
                '<option value="REJECTED" ' + (this.campaignStatusFilter === 'REJECTED' ? 'selected' : '') + '>Từ chối</option>' +
              '</select>' +
            '</div>' +

            '<div style="max-height:600px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;">' +
              (campaigns.map(function (c) {
                var badgeClass = 'zn-badge-draft';
                var statusText = 'Bản nháp';
                if (c.status === 'PENDING_APPROVAL') { badgeClass = 'zn-badge-pending'; statusText = 'Chờ duyệt'; }
                else if (c.status === 'APPROVED') { badgeClass = 'zn-badge-approved'; statusText = 'Đã duyệt'; }
                else if (c.status === 'REJECTED') { badgeClass = 'zn-badge-rejected'; statusText = 'Từ chối'; }

                return '<div class="zn-dispatch-item ' + (self.activeCampaignId === c.id ? 'status-processing' : '') + '" style="cursor:pointer;" data-select-camp="' + c.id + '">' +
                  '<div class="zn-dispatch-header">' +
                    '<div class="zn-dispatch-name">' + c.title + '</div>' +
                    '<span class="zn-badge ' + badgeClass + '">' + statusText + '</span>' +
                  '</div>' +
                  '<div class="zn-dispatch-meta">' +
                    '<span>👤 Soạn: ' + (c.author_name || 'Cán bộ') + '</span>' +
                    '<span>🕒 ' + new Date(c.updated_at).toLocaleDateString('vi-VN') + '</span>' +
                  '</div>' +
                  '<div style="font-size:12px;color:#475569;margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' +
                    c.content +
                  '</div>' +
                '</div>';
              }).join('') || '<div style="text-align:center;color:#94a3b8;padding:20px;">Chưa có thông báo nào.</div>') +
            '</div>' +
          '</div>' +

          '<!-- Cột 2: Soạn thảo hoặc chi tiết phê duyệt -->' +
          '<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;">' +
            '<div style="font-weight:800;font-size:14px;color:#991b1b;margin-bottom:12px;" id="zn-composer-heading">SOẠN THẢO THÔNG BÁO MỚI</div>' +

            '<div class="zn-form-group">' +
              '<label>Áp dụng mẫu có sẵn</label>' +
              '<select class="zn-select" id="cmp-tpl-select">' +
                '<option value="">-- Chọn mẫu thông báo chuẩn --</option>' +
                templates.map(function (t) {
                  return '<option value="' + t.id + '">' + t.title + '</option>';
                }).join('') +
              '</select>' +
            '</div>' +

            '<div class="zn-form-group">' +
              '<label>Tiêu đề thông báo <span class="zn-req">*</span></label>' +
              '<input type="text" class="zn-input" id="cmp-title" placeholder="Ví dụ: Giấy mời sinh hoạt Chi bộ thường kỳ tháng 10/2026">' +
            '</div>' +

            '<div class="zn-form-group">' +
              '<label>Nhóm nhận thông báo (chọn nhiều nhóm)</label>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">' +
                groups.map(function (g) {
                  return '<label style="font-size:12px;background:#f8fafc;padding:5px 10px;border-radius:6px;border:1px solid #cbd5e1;cursor:pointer;display:inline-flex;align-items:center;gap:4px;">' +
                    '<input type="checkbox" name="cmp-group-item" value="' + g.id + '"> ' + g.name +
                  '</label>';
                }).join('') +
              '</div>' +
            '</div>' +

            '<div class="zn-form-group">' +
              '<label>Thời gian dự kiến gửi</label>' +
              '<input type="datetime-local" class="zn-input" id="cmp-schedule">' +
            '</div>' +

            '<div class="zn-form-group">' +
              '<label>Nội dung thông báo Zalo <span class="zn-req">*</span></label>' +
              '<textarea class="zn-textarea" id="cmp-content" style="min-height:160px;" placeholder="Nội dung thông báo có thể sử dụng biến {TEN}, {THANG}, {DON_VI} để cá nhân hoá khi gửi..."></textarea>' +
              '<div class="zn-hint">Có thể dùng các từ khóa tự động thay thế: <code>{TEN}</code> (Tên người nhận), <code>{THANG}</code> (Tháng hiện tại), <code>{DON_VI}</code> (TDP Lương Hậu).</div>' +
            '</div>' +

            '<div class="zn-form-group">' +
              '<label>Ghi chú nội bộ</label>' +
              '<input type="text" class="zn-input" id="cmp-notes" placeholder="Ghi chú theo dõi công việc...">' +
            '</div>' +

            '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:16px;">' +
              '<button class="zn-btn zn-btn-secondary" id="cmp-btn-reset">Làm mới</button>' +
              '<button class="zn-btn zn-btn-outline" id="cmp-btn-draft">Lưu Bản Nháp</button>' +
              '<button class="zn-btn zn-btn-primary" id="cmp-btn-submit">Trình Phê Duyệt</button>' +
              (isApprover ? '<button class="zn-btn zn-btn-success" id="cmp-btn-approve" style="display:none;">✔ Phê Duyệt Ngay</button>' : '') +
              (isApprover ? '<button class="zn-btn zn-btn-danger" id="cmp-btn-reject" style="display:none;">✕ Từ Chối</button>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Status filter event
    var statusSelect = box.querySelector('#zn-camp-status-filter');
    if (statusSelect) {
      statusSelect.addEventListener('change', function (e) {
        self.campaignStatusFilter = e.target.value;
        self.renderComposer(box);
      });
    }

    // Select template event
    var tplSelect = box.querySelector('#cmp-tpl-select');
    if (tplSelect) {
      tplSelect.addEventListener('change', function (e) {
        var tpl = templates.find(function (t) { return t.id === e.target.value; });
        if (tpl) {
          box.querySelector('#cmp-title').value = tpl.title;
          box.querySelector('#cmp-content').value = tpl.content;
        }
      });
    }

    // Save Draft
    box.querySelector('#cmp-btn-draft').addEventListener('click', function () {
      self.saveCampaignFromForm('DRAFT');
    });

    // Submit for approval
    box.querySelector('#cmp-btn-submit').addEventListener('click', function () {
      self.saveCampaignFromForm('PENDING_APPROVAL');
    });

    // Approver actions
    var btnApprove = box.querySelector('#cmp-btn-approve');
    if (btnApprove) {
      btnApprove.addEventListener('click', function () {
        if (!self.activeCampaignId) return;
        self.engine.approveCampaign(self.activeCampaignId, self.currentUser);
        alert('Đã phê duyệt thông báo thành công! Hàng đợi gửi Zalo đã được tạo.');
        self.renderComposer(box);
      });
    }

    var btnReject = box.querySelector('#cmp-btn-reject');
    if (btnReject) {
      btnReject.addEventListener('click', function () {
        if (!self.activeCampaignId) return;
        var reason = prompt('Nhập lý do từ chối để cán bộ soạn thảo điều chỉnh:');
        if (reason) {
          self.engine.rejectCampaign(self.activeCampaignId, reason, self.currentUser);
          self.renderComposer(box);
        }
      });
    }

    // Click on campaign item to edit/inspect
    box.querySelectorAll('[data-select-camp]').forEach(function (card) {
      card.addEventListener('click', function () {
        var cid = card.getAttribute('data-select-camp');
        self.loadCampaignToForm(cid, box);
      });
    });

    // Reset button
    box.querySelector('#cmp-btn-reset').addEventListener('click', function () {
      self.activeCampaignId = null;
      box.querySelector('#cmp-title').value = '';
      box.querySelector('#cmp-content').value = '';
      box.querySelector('#cmp-notes').value = '';
      box.querySelectorAll('input[name="cmp-group-item"]').forEach(function (cb) { cb.checked = false; });
      box.querySelector('#zn-composer-heading').innerText = 'SOẠN THẢO THÔNG BÁO MỚI';
      if (btnApprove) btnApprove.style.display = 'none';
      if (btnReject) btnReject.style.display = 'none';
    });
  };

  ZaloNotifyUI.prototype.loadCampaignToForm = function (campaignId, box) {
    this.activeCampaignId = campaignId;
    var c = this.engine.getCampaignById(campaignId);
    if (!c) return;

    box.querySelector('#zn-composer-heading').innerText = 'CHI TIẾT: ' + c.title;
    box.querySelector('#cmp-title').value = c.title;
    box.querySelector('#cmp-content').value = c.content;
    box.querySelector('#cmp-notes').value = c.notes || '';
    if (c.scheduled_at) {
      try {
        box.querySelector('#cmp-schedule').value = new Date(c.scheduled_at).toISOString().slice(0, 16);
      } catch (e) {}
    }

    var grpIds = c.recipient_group_ids || [];
    box.querySelectorAll('input[name="cmp-group-item"]').forEach(function (cb) {
      cb.checked = grpIds.indexOf(cb.value) >= 0;
    });

    var isApprover = this.currentUser && (this.currentUser.role === 'BI_THU' || this.currentUser.role === 'ADMIN');
    var btnApprove = box.querySelector('#cmp-btn-approve');
    var btnReject = box.querySelector('#cmp-btn-reject');

    if (btnApprove && btnReject && isApprover) {
      if (c.status === 'PENDING_APPROVAL') {
        btnApprove.style.display = 'inline-flex';
        btnReject.style.display = 'inline-flex';
      } else {
        btnApprove.style.display = 'none';
        btnReject.style.display = 'none';
      }
    }
  };

  ZaloNotifyUI.prototype.saveCampaignFromForm = function (targetStatus) {
    var title = this.container.querySelector('#cmp-title').value.trim();
    var content = this.container.querySelector('#cmp-content').value.trim();
    var scheduleVal = this.container.querySelector('#cmp-schedule').value;
    var notes = this.container.querySelector('#cmp-notes').value.trim();

    var selectedGroups = [];
    this.container.querySelectorAll('input[name="cmp-group-item"]:checked').forEach(function (cb) {
      selectedGroups.push(cb.value);
    });

    if (!title) { alert('Vui lòng nhập tiêu đề thông báo.'); return; }
    if (!content) { alert('Vui lòng nhập nội dung thông báo.'); return; }

    var campaignData = {
      id: this.activeCampaignId,
      title: title,
      content: content,
      recipient_group_ids: selectedGroups,
      scheduled_at: scheduleVal ? new Date(scheduleVal).toISOString() : new Date().toISOString(),
      notes: notes,
      status: targetStatus
    };

    var res = this.engine.saveCampaign(campaignData, this.currentUser);
    if (!res.success) {
      alert('Lỗi: ' + res.error);
      return;
    }

    alert('Đã lưu thông báo thành công (' + targetStatus + ')');
    this.renderCurrentSubtab();
  };

  /* ---------------- MODULE E: HỖ TRỢ GỬI ZALO (DISPATCH QUEUE) ---------------- */
  ZaloNotifyUI.prototype.renderDispatch = function (box) {
    var self = this;
    var approvedCampaigns = this.engine.getCampaigns('APPROVED');
    var activeCamp = this.activeCampaignId ? this.engine.getCampaignById(this.activeCampaignId) : (approvedCampaigns[0] || null);

    if (activeCamp) {
      this.activeCampaignId = activeCamp.id;
      this.engine.prepareDispatchQueue(activeCamp.id, this.currentUser);
    }

    var queue = activeCamp ? this.engine.getDispatchQueue(activeCamp.id) : [];

    var confirmedCount = queue.filter(function (q) { return q.status === 'CONFIRMED'; }).length;
    var pendingCount = queue.filter(function (q) { return q.status === 'PENDING' || q.status === 'PROCESSING'; }).length;

    box.innerHTML =
      '<div class="zn-pane active">' +
        '<!-- Hướng dẫn quy trình 8 bước chuẩn -->' +
        '<div class="zn-security-callout">' +
          '<b>QUY TRÌNH HỖ TRỢ GỬI TIN ZALO CÁ NHÂN CHUẨN AN TOÀN:</b><br>' +
          '<b>Bước 1:</b> Chọn đợt thông báo đã được Bí thư phê duyệt.<br>' +
          '<b>Bước 2:</b> Duyệt danh sách người nhận bên dưới.<br>' +
          '<b>Bước 3:</b> Nhấn <b>[📋 Sao chép nội dung]</b> (tin nhắn sẽ tự động cá nhân hóa họ tên).<br>' +
          '<b>Bước 4:</b> Nhấn <b>[🚀 Mở Zalo]</b> (ứng dụng sẽ mở cuộc trò chuyện Zalo tương ứng).<br>' +
          '<b>Bước 5:</b> Dán nội dung và tự gửi bằng tài khoản Zalo cá nhân của bạn.<br>' +
          '<b>Bước 6:</b> Quay lại đây nhấn <b>[✔ Đã gửi]</b> để hệ thống lưu nhật ký đối soát công tác.' +
        '</div>' +

        '<div class="zn-bar">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<label style="font-weight:700;font-size:12.5px;">Chọn thông báo cần gửi:</label>' +
            '<select class="zn-select" id="zn-dispatch-camp-select" style="min-width:280px;">' +
              (approvedCampaigns.map(function (c) {
                return '<option value="' + c.id + '" ' + (self.activeCampaignId === c.id ? 'selected' : '') + '>' + c.title + '</option>';
              }).join('') || '<option value="">-- Chưa có thông báo đã duyệt --</option>') +
            '</select>' +
          '</div>' +
          '<div style="display:flex;gap:8px;align-items:center;">' +
            '<span class="zn-badge zn-badge-confirmed">Đã gửi: ' + confirmedCount + '</span>' +
            '<span class="zn-badge zn-badge-pending">Chưa gửi: ' + pendingCount + '</span>' +
            '<button class="zn-btn zn-btn-outline zn-btn-sm" id="btn-export-dispatch-report">📊 Xuất báo cáo đợt</button>' +
          '</div>' +
        '</div>' +

        '<!-- Danh sách hàng đợi cần xử lý -->' +
        '<div style="margin-top:14px;">' +
          (queue.map(function (item) {
            var badgeStatus = 'zn-badge-draft';
            var statusLabel = 'Chưa xử lý';
            var itemClass = '';

            if (item.status === 'PROCESSING') {
              badgeStatus = 'zn-badge-pending'; statusLabel = 'Đang xử lý'; itemClass = 'status-processing';
            } else if (item.status === 'CONFIRMED') {
              badgeStatus = 'zn-badge-confirmed'; statusLabel = '✔ Đã xác nhận gửi'; itemClass = 'status-confirmed';
            } else if (item.status === 'FAILED') {
              badgeStatus = 'zn-badge-failed'; statusLabel = 'Gửi không thành công'; itemClass = 'status-failed';
            } else if (item.status === 'SKIPPED') {
              badgeStatus = 'zn-badge-skipped'; statusLabel = 'Đã bỏ qua'; itemClass = 'status-skipped';
            }

            return '<div class="zn-dispatch-item ' + itemClass + '" id="rec-item-' + item.id + '">' +
              '<div class="zn-dispatch-header">' +
                '<div class="zn-dispatch-name">' +
                  (item.recipient_type === 'GROUP' ? '👥 ' : '👤 ') + item.recipient_name +
                '</div>' +
                '<span class="zn-badge ' + badgeStatus + '">' + statusLabel + '</span>' +
              '</div>' +
              '<div class="zn-dispatch-meta">' +
                '<span>📞 ' + (item.phone || 'Chưa có SĐT riêng') + '</span>' +
                '<span>📌 ' + (item.notes || 'Thành viên') + '</span>' +
                (item.confirmed_by ? '<span>✍ Người xác nhận: ' + item.confirmed_by + ' lúc ' + new Date(item.confirmed_at).toLocaleTimeString('vi-VN') + '</span>' : '') +
              '</div>' +
              '<div class="zn-dispatch-actions">' +
                '<button class="zn-btn zn-btn-secondary zn-btn-sm" data-copy-msg="' + item.id + '">📋 Sao chép nội dung</button>' +
                '<button class="zn-btn zn-btn-zalo zn-btn-sm" data-open-zalo="' + item.id + '" data-link="' + (item.zalo_link || '') + '">🚀 Mở Zalo</button>' +
                '<button class="zn-btn zn-btn-success zn-btn-sm" data-confirm-sent="' + item.id + '">✔ Đã gửi</button>' +
                '<button class="zn-btn zn-btn-danger zn-btn-sm" data-mark-failed="' + item.id + '">❌ Thất bại</button>' +
                '<button class="zn-btn zn-btn-secondary zn-btn-sm" data-mark-skip="' + item.id + '">⏭ Bỏ qua</button>' +
              '</div>' +
            '</div>';
          }).join('') || '<div style="text-align:center;padding:30px;color:#94a3b8;">Không có danh sách người nhận cho thông báo này.</div>') +
        '</div>' +
      '</div>';

    // Campaign switch event
    var campSelect = box.querySelector('#zn-dispatch-camp-select');
    if (campSelect) {
      campSelect.addEventListener('change', function (e) {
        self.activeCampaignId = e.target.value;
        self.renderDispatch(box);
      });
    }

    // Export dispatch report
    var btnExportRep = box.querySelector('#btn-export-dispatch-report');
    if (btnExportRep) {
      btnExportRep.addEventListener('click', function () {
        if (!self.activeCampaignId) return;
        var csv = self.engine.exportReportCsv(self.activeCampaignId);
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Bao_Cao_Gui_Zalo_' + self.activeCampaignId + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    // Action: Copy
    box.querySelectorAll('[data-copy-msg]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var rid = btn.getAttribute('data-copy-msg');
        var rec = queue.find(function (x) { return x.id === rid; });
        if (!rec) return;

        var text = self.engine.getPersonalizedContent(self.activeCampaignId, rec);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            self.engine.recordCopyAction(self.activeCampaignId, rid, self.currentUser);
            btn.innerText = '✔ Đã sao chép!';
            setTimeout(function () { btn.innerText = '📋 Sao chép nội dung'; }, 2000);
          }).catch(function () {
            prompt('Sao chép nội dung bên dưới:', text);
          });
        } else {
          prompt('Sao chép nội dung bên dưới:', text);
        }
      });
    });

    // Action: Open Zalo
    box.querySelectorAll('[data-open-zalo]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var rid = btn.getAttribute('data-open-zalo');
        var link = btn.getAttribute('data-link') || 'https://chat.zalo.me';
        self.engine.recordOpenZalo(self.activeCampaignId, rid, self.currentUser);
        window.open(link, '_blank');
      });
    });

    // Action: Confirm
    box.querySelectorAll('[data-confirm-sent]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var rid = btn.getAttribute('data-confirm-sent');
        self.engine.updateDeliveryStatus(rid, 'CONFIRMED', self.currentUser, 'Người quản trị đã xác nhận gửi thành công qua Zalo');
        self.renderDispatch(box);
      });
    });

    // Action: Failed
    box.querySelectorAll('[data-mark-failed]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var rid = btn.getAttribute('data-mark-failed');
        var reason = prompt('Nhập lý do gửi không thành công (ví dụ: Số điện thoại chưa kích hoạt Zalo, chặn tin nhắn từ người lạ):');
        self.engine.updateDeliveryStatus(rid, 'FAILED', self.currentUser, reason || 'Gửi thất bại');
        self.renderDispatch(box);
      });
    });

    // Action: Skip
    box.querySelectorAll('[data-mark-skip]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var rid = btn.getAttribute('data-mark-skip');
        self.engine.updateDeliveryStatus(rid, 'SKIPPED', self.currentUser, 'Đã bỏ qua');
        self.renderDispatch(box);
      });
    });
  };

  /* ---------------- RENDER TAB: SCHEDULES ---------------- */
  ZaloNotifyUI.prototype.renderSchedules = function (box) {
    var self = this;
    var schedules = this.engine.getSchedules();

    box.innerHTML =
      '<div class="zn-pane active">' +
        '<div class="zn-bar">' +
          '<div style="font-weight:700;font-size:13px;color:#1e293b;">Lịch công tác &amp; Nhắc việc gửi thông báo</div>' +
          '<button class="zn-btn zn-btn-secondary" id="btn-request-notification">🔔 Bật nhắc việc trên trình duyệt</button>' +
        '</div>' +

        '<div class="zn-table-wrap">' +
          '<table class="zn-table">' +
            '<thead>' +
              '<tr>' +
                '<th>Tiêu đề thông báo</th>' +
                '<th>Thời gian dự kiến</th>' +
                '<th>Người phụ trách</th>' +
                '<th>Trạng thái</th>' +
                '<th>Cảnh báo quá hạn</th>' +
                '<th>Thao tác</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              (schedules.map(function (s) {
                var d = s.scheduled_at ? new Date(s.scheduled_at).toLocaleString('vi-VN') : 'Chưa đặt';
                return '<tr>' +
                  '<td><b>' + s.title + '</b></td>' +
                  '<td>' + d + '</td>' +
                  '<td>' + (s.author || 'Chi bộ') + '</td>' +
                  '<td><span class="zn-badge zn-badge-draft">' + s.status + '</span></td>' +
                  '<td>' + (s.is_overdue ? '<span class="zn-badge zn-badge-failed">⚠️ Quá hạn gửi</span>' : '<span class="zn-badge zn-badge-confirmed">Đúng tiến độ</span>') + '</td>' +
                  '<td><button class="zn-btn zn-btn-primary zn-btn-sm" data-go-send="' + s.id + '">🚀 Đi tới gửi</button></td>' +
                '</tr>';
              }).join('') || '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:20px;">Chưa có lịch thông báo nào.</td></tr>') +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    // Notification API request
    var btnNotif = box.querySelector('#btn-request-notification');
    if (btnNotif) {
      btnNotif.addEventListener('click', function () {
        if (!('Notification' in window)) {
          alert('Trình duyệt của đồng chí không hỗ trợ tính năng Notification API.');
          return;
        }
        Notification.requestPermission().then(function (perm) {
          if (perm === 'granted') {
            alert('Đã cấp quyền thông báo thành công!\nLưu ý: Nhắc việc hoạt động khi tab trình duyệt đang mở.');
            new Notification('Chi bộ TDP Lương Hậu', {
              body: 'Hệ thống nhắc việc Zalo Notify đã sẵn sàng hoạt động.',
              icon: '/favicon.ico'
            });
          } else {
            alert('Quyền thông báo bị từ chối hoặc bị chặn.');
          }
        });
      });
    }

    box.querySelectorAll('[data-go-send]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cid = btn.getAttribute('data-go-send');
        self.activeCampaignId = cid;
        self.switchToTab('dispatch');
      });
    });
  };

  /* ---------------- RENDER TAB: REPORTS ---------------- */
  ZaloNotifyUI.prototype.renderReports = function (box) {
    var self = this;
    var logs = this.engine.data.zalo_notify_audit_logs || [];
    var deliveryLogs = this.engine.data.zalo_notify_delivery_logs || [];

    box.innerHTML =
      '<div class="zn-pane active">' +
        '<div class="zn-bar">' +
          '<div style="font-weight:700;font-size:13px;color:#1e293b;">Nhật ký kiểm toán &amp; Lịch sử xác nhận gửi</div>' +
          '<button class="zn-btn zn-btn-outline" id="btn-export-audit">📤 Xuất Nhật Ký Kiểm Toán</button>' +
        '</div>' +

        '<div class="zn-table-wrap">' +
          '<table class="zn-table">' +
            '<thead>' +
              '<tr>' +
                '<th>Thời gian</th>' +
                '<th>Cán bộ thực hiện</th>' +
                '<th>Hành động</th>' +
                '<th>Chi tiết</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              (logs.map(function (l) {
                return '<tr>' +
                  '<td style="white-space:nowrap;color:#64748b;">' + new Date(l.timestamp).toLocaleString('vi-VN') + '</td>' +
                  '<td><b>' + (l.user_name || 'Hệ thống') + '</b> (' + (l.role || '') + ')</td>' +
                  '<td><span class="zn-badge zn-badge-draft">' + l.action + '</span></td>' +
                  '<td>' + (l.details || '') + '</td>' +
                '</tr>';
              }).join('') || '<tr><td colspan="4" style="text-align:center;padding:20px;color:#94a3b8;">Chưa có nhật ký kiểm toán.</td></tr>') +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    var btnExport = box.querySelector('#btn-export-audit');
    if (btnExport) {
      btnExport.addEventListener('click', function () {
        var rows = [['Thời gian', 'Cán bộ', 'Vai trò', 'Hành động', 'Chi tiết']];
        logs.forEach(function (l) {
          rows.push([
            new Date(l.timestamp).toLocaleString('vi-VN'),
            '"' + (l.user_name || '').replace(/"/g, '""') + '"',
            l.role || '',
            l.action,
            '"' + (l.details || '').replace(/"/g, '""') + '"'
          ]);
        });
        var csv = '\uFEFF' + rows.map(function (r) { return r.join(','); }).join('\r\n');
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Nhat_Ky_Zalo_Notify_' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  };

  /* ---------------- GLOBAL FACTORY & SINGLETON ---------------- */
  var engineInstance = new ZaloNotifyEngine();

  return {
    engine: engineInstance,
    Engine: ZaloNotifyEngine,
    UI: ZaloNotifyUI,
    mount: function (containerSelector, currentUser) {
      var ui = new ZaloNotifyUI(engineInstance, containerSelector);
      ui.init(currentUser);
      return ui;
    }
  };
});
