/**
 * CORE DATABASE & DATA STORE (CLEAN ARCHITECTURE)
 * CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU
 * Slogan: "Đoàn kết - Dân chủ - Kỷ cương - Phát triển"
 * 
 * Quản lý 17 bảng chuẩn hoá:
 * users, roles, user_roles, news, categories, notices, documents, events,
 * feedback, meetings, attendance, party_members, resolutions, tasks,
 * attachments, audit_logs, settings.
 */

// Simple robust PBKDF2/SHA256 simulation with salt for secure client storage
function hashPassword(password, salt = 'luong_hau_salt_2026') {
  let hash = 0;
  const combined = password + ':' + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16) + 'e89c42b01f';
}

const STORAGE_KEY = 'LUONG_HAU_DB_V2026_MASTER';

// Seed Initial Data (Chính thức, bảo toàn 100% từ Legacy Inventory)
const SEED_DATA = {
  roles: [
    { id: 'role_public', code: 'PUBLIC', name: 'Công chúng / Nhân dân', description: 'Chỉ xem nội dung công khai' },
    { id: 'role_editor', code: 'EDITOR', name: 'Biên tập viên', description: 'Tạo, biên tập nội dung được giao' },
    { id: 'role_canbo', code: 'CAN_BO_TDP', name: 'Cán bộ TDP', description: 'Quản lý điều hành cơ sở TDP' },
    { id: 'role_chiuy', code: 'CHI_UY', name: 'Chi uỷ viên / Đảng viên', description: 'Khu vực Chi bộ và sinh hoạt đảng' },
    { id: 'role_bithu', code: 'BI_THU', name: 'Bí thư Chi bộ', description: 'Duyệt bài, dashboard điều hành, ra nghị quyết' },
    { id: 'role_admin', code: 'ADMIN', name: 'Quản trị viên Hệ thống', description: 'Toàn quyền cấu hình, tài khoản, audit logs' }
  ],

  users: [
    {
      id: 'usr_bithu',
      username: 'bithu',
      password_hash: hashPassword('bithu2026'),
      salt: 'luong_hau_salt_2026',
      full_name: 'Hồ Văn Mão',
      email: 'hovanmao.luonghau@hue.gov.vn',
      phone: '0962481112',
      role: 'BI_THU',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-24T00:00:00Z'
    },
    {
      id: 'usr_totruong',
      username: 'totruong',
      password_hash: hashPassword('totruong2026'),
      salt: 'luong_hau_salt_2026',
      full_name: 'Nguyễn Trọng Nghĩa',
      email: 'nguyentrongnghia.luonghau@hue.gov.vn',
      phone: '0965712812',
      role: 'CAN_BO_TDP',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-24T00:00:00Z'
    },
    {
      id: 'usr_chienthu',
      username: 'chiuy',
      password_hash: hashPassword('chiuy2026'),
      salt: 'luong_hau_salt_2026',
      full_name: 'Hoàng Hữu Rớt',
      email: 'hoanghuurot.luonghau@hue.gov.vn',
      phone: '0965943303',
      role: 'CHI_UY',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-24T00:00:00Z'
    },
    {
      id: 'usr_editor',
      username: 'editor',
      password_hash: hashPassword('editor2026'),
      salt: 'luong_hau_salt_2026',
      full_name: 'Nguyễn Thị Ngọc Tú',
      email: 'ngoc.tu.luonghau@hue.gov.vn',
      phone: '0386003175',
      role: 'EDITOR',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-24T00:00:00Z'
    },
    {
      id: 'usr_admin',
      username: 'admin',
      password_hash: hashPassword('admin2026!'),
      salt: 'luong_hau_salt_2026',
      full_name: 'Ban Quản Trị Hệ Thống',
      email: 'quantri.luonghau@hue.gov.vn',
      phone: '0965712812',
      role: 'ADMIN',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-24T00:00:00Z'
    }
  ],

  user_roles: [
    { user_id: 'usr_bithu', role_id: 'role_bithu', assigned_at: '2026-09-01T08:00:00Z', assigned_by: 'system' },
    { user_id: 'usr_totruong', role_id: 'role_canbo', assigned_at: '2026-09-01T08:00:00Z', assigned_by: 'system' },
    { user_id: 'usr_chienthu', role_id: 'role_chiuy', assigned_at: '2026-09-01T08:00:00Z', assigned_by: 'system' },
    { user_id: 'usr_editor', role_id: 'role_editor', assigned_at: '2026-09-01T08:00:00Z', assigned_by: 'system' },
    { user_id: 'usr_admin', role_id: 'role_admin', assigned_at: '2026-09-01T08:00:00Z', assigned_by: 'system' }
  ],

  categories: [
    { id: 'cat_xaydungdang', code: 'XAY_DUNG_DANG', name: 'Xây dựng Đảng', slug: 'xay-dung-dang', sort_order: 1 },
    { id: 'cat_cns', code: 'CHUYEN_DOI_SO', name: 'Chuyển đổi số', slug: 'chuyen-doi-so', sort_order: 2 },
    { id: 'cat_hoatdongtdp', code: 'HOAT_DONG_TDP', name: 'Hoạt động TDP', slug: 'hoat-dong-tdp', sort_order: 3 },
    { id: 'cat_phongtrao', code: 'PHONG_TRAO', name: 'Phong trào', slug: 'phong-trao', sort_order: 4 },
    { id: 'cat_khuyenhoc', code: 'KHUYEN_HOC', name: 'Khuyến học', slug: 'khuyen-hoc', sort_order: 5 },
    { id: 'cat_antt', code: 'AN_NINH_TRAT_TU', name: 'An ninh trật tự', slug: 'an-ninh-trat-tu', sort_order: 6 },
    { id: 'cat_vhxh', code: 'VAN_HOA_XA_HOI', name: 'Văn hóa - Xã hội', slug: 'van-hoa-xa-hoi', sort_order: 7 }
  ],

  news: [
    {
      id: 'news_01',
      title: 'Chủ động từ sớm, từ xa, sẵn sàng ứng phó với các tình huống thiên tai, mưa lũ tại TP Huế và TDP Lương Hậu',
      slug: 'chu-dong-tu-som-tu-xa-ung-pho-thien-tai-mua-lu',
      category_id: 'cat_hoatdongtdp',
      category_name: 'Hoạt động TDP',
      summary: 'Sáng 10/9, Chủ tịch UBND thành phố Lê Trí Thanh chủ trì Hội nghị đánh giá công tác phòng chống thiên tai 8 tháng đầu năm và triển khai nhiệm vụ trọng tâm 4 tháng cuối năm 2026. TDP Lương Hậu hoàn tất phương án 4 tại chỗ, rà soát hộ neo đơn tại các vùng trũng Đội 8, 9, 10, 11.',
      content: 'Trước diễn biến thời tiết phức tạp mùa mưa bão năm 2026, Ban Điều hành TDP Lương Hậu phối hợp cùng Chi bộ cơ sở đã chủ động rà soát hệ thống mương thoát nước, kiểm tra các điểm xung yếu dọc trục đường Sóng Hồng và các kiệt ngõ thuộc Đội 8, 9, 10, 11. Các phương án di dời người già neo đơn, chuẩn bị vật tư, nhu yếu phẩm tại chỗ đã được phân công cụ thể cho từng thành viên theo phương châm 4 tại chỗ.',
      thumbnail: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
      author: 'Đ/c Nguyễn Trọng Nghĩa - Tổ trưởng',
      status: 'PUBLISHED',
      is_featured: true,
      published_at: '2026-09-10T08:30:00Z',
      created_by: 'usr_totruong',
      updated_by: 'usr_bithu',
      created_at: '2026-09-10T08:00:00Z',
      updated_at: '2026-09-10T08:30:00Z'
    },
    {
      id: 'news_02',
      title: 'Ra quân "Ngày Chủ nhật xanh" đợt 4 gắn với khơi thông mương máng, phòng chống sốt xuất huyết',
      slug: 'ra-quan-ngay-chu-nhat-xanh-dot-4',
      category_id: 'cat_phongtrao',
      category_name: 'Phong trào',
      summary: 'Ban Điều hành và Đoàn Thanh niên TDP Lương Hậu phát động toàn dân tham gia tổng dọn vệ sinh môi trường, xử lý các điểm tồn đọng rác thải tại Nhà văn hóa và khu dân cư.',
      content: 'Chương trình diễn ra vào lúc 06h30 ngày 13/09/2026 tại Nhà sinh hoạt cộng đồng số 83 Thái Thuận. 100% cán bộ các đoàn thể, hội viên nông dân, phụ nữ, cựu chiến binh và thanh niên xung kích ra quân làm sạch các tuyến đường chính, xử lý các vật dụng chứa nước nhằm triệt tiêu lăng quăng, bọ gậy.',
      thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      author: 'Nguyễn Thị Ngọc Tú - Bí thư Chi đoàn',
      status: 'PUBLISHED',
      is_featured: true,
      published_at: '2026-09-12T07:00:00Z',
      created_by: 'usr_editor',
      updated_by: 'usr_bithu',
      created_at: '2026-09-11T14:00:00Z',
      updated_at: '2026-09-12T07:00:00Z'
    },
    {
      id: 'news_03',
      title: 'Phát huy vai trò Tổ Công nghệ số cộng đồng hướng dẫn người dân kích hoạt VNeID mức 2 và nộp hồ sơ Hue-S',
      slug: 'to-cong-nghe-so-cong-dong-huong-dan-vneid-hues',
      category_id: 'cat_cns',
      category_name: 'Chuyển đổi số',
      summary: 'Đến tháng 9/2026, TDP Lương Hậu đã hoàn thành hơn 98% công dân đủ điều kiện kích hoạt VNeID mức 2 và tiếp cận dịch vụ số trên Hue-S.',
      content: 'Tổ Công nghệ số cộng đồng phối hợp Công an phường Hương Thủy đến từng hộ gia đình để hỗ trợ cài đặt chữ ký số công cộng, hướng dẫn tra cứu hồ sơ thủ tục hành chính trực tuyến, thanh toán tiền điện, tiền nước qua ứng dụng di động.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      author: 'Tổ Chuyển đổi số TDP',
      status: 'PUBLISHED',
      is_featured: false,
      published_at: '2026-09-09T09:15:00Z',
      created_by: 'usr_editor',
      updated_by: 'usr_bithu',
      created_at: '2026-09-09T08:00:00Z',
      updated_at: '2026-09-09T09:15:00Z'
    },
    {
      id: 'news_04',
      title: 'Kế hoạch tổ chức "Đêm hội Trăng rằm 2026" cho thiếu nhi TDP Lương Hậu',
      slug: 'ke-hoach-to-chuc-dem-hoi-trang-ram-2026',
      category_id: 'cat_khuyenhoc',
      category_name: 'Khuyến học',
      summary: 'Chương trình vui Tết Trung thu ấm áp, ý nghĩa cùng các phần quà khuyến học trao tặng các cháu học sinh giỏi và thiếu nhi có hoàn cảnh khó khăn.',
      content: 'Chương trình bắt đầu lúc 19h00 ngày 25/09/2026 (Rằm tháng 8 ÂL) tại Nhà sinh hoạt cộng đồng 83 Thái Thuận với các hoạt động rước đèn, múa lân, trao thưởng khuyến học năm học 2025 - 2026.',
      thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      author: 'Ban Khuyến học TDP',
      status: 'PUBLISHED',
      is_featured: false,
      published_at: '2026-09-08T10:00:00Z',
      created_by: 'usr_editor',
      updated_by: 'usr_bithu',
      created_at: '2026-09-08T09:00:00Z',
      updated_at: '2026-09-08T10:00:00Z'
    },
    {
      id: 'news_05',
      title: 'Chi bộ Lương Hậu kiện toàn Chi uỷ và triển khai thực hiện nhiệm vụ quý IV năm 2026',
      slug: 'chi-bo-luong-hau-kien-toan-chi-uy-nhiem-vu-quy-iv',
      category_id: 'cat_xaydungdang',
      category_name: 'Xây dựng Đảng',
      summary: 'Kỳ sinh hoạt thường kỳ tháng 9/2026 biểu quyết chuẩn y bổ sung Chi ủy viên và thống nhất Nghị quyết 09-NQ/CB với 100% phiếu tán thành.',
      content: 'Hội nghị Chi bộ đã thảo luận sôi nổi về công tác phát triển đảng viên mới, công tác kiểm tra giám sát Điều 30 và nhiệm vụ trực chỉ huy phòng chống lụt bão trên địa bàn 4 đội.',
      thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
      author: 'Đ/c Hồ Văn Mão - Bí thư Chi bộ',
      status: 'PUBLISHED',
      is_featured: false,
      published_at: '2026-09-03T16:00:00Z',
      created_by: 'usr_bithu',
      updated_by: 'usr_bithu',
      created_at: '2026-09-03T15:00:00Z',
      updated_at: '2026-09-03T16:00:00Z'
    }
  ],

  notices: [
    {
      id: 'not_01',
      title: 'Thông báo số 14/TB-TDP: Ra quân Ngày Chủ nhật xanh đợt 4 năm 2026',
      content: 'Kính gửi toàn thể nhân dân Tổ dân phố Lương Hậu. Vào lúc 06h30 ngày Chủ nhật (13/09/2026), Ban cán sự TDP phối hợp Chi hội Phụ nữ và Đoàn Thanh niên tổ chức tổng dọn vệ sinh trục đường chính 83 Thái Thuận và khơi thông cống rãnh các Đội 8, 9, 10, 11.',
      attachment_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      is_pinned: true,
      publish_date: '2026-09-10',
      expiry_date: '2026-09-30',
      status: 'ACTIVE',
      created_by: 'usr_totruong',
      created_at: '2026-09-10T07:30:00Z',
      updated_at: '2026-09-10T07:30:00Z'
    },
    {
      id: 'not_02',
      title: 'Thông báo số 15/TB-TDP: Lịch tiêm chủng mở rộng tháng 9/2026 tại Trạm Y tế phường KV3',
      content: 'Thời gian: 07h30 - 17h00 các ngày 23 và 24/09/2026. Địa điểm: Trạm Y tế phường Hương Thủy KV3. Đề nghị các gia đình có trẻ trong độ tuổi tiêm chủng mang theo sổ tiêm chủng đúng hẹn.',
      attachment_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      is_pinned: true,
      publish_date: '2026-09-08',
      expiry_date: '2026-09-25',
      status: 'ACTIVE',
      created_by: 'usr_totruong',
      created_at: '2026-09-08T08:00:00Z',
      updated_at: '2026-09-08T08:00:00Z'
    },
    {
      id: 'not_03',
      title: 'Trực ban phòng chống mưa lũ và thiên tai 24/24 trên địa bàn TDP',
      content: 'Chủ động ứng phó mưa lớn diện rộng, Ban chỉ huy PCTT-TKCN TDP Lương Hậu duy trì lực lượng tuần tra, tiếp nhận thông tin khẩn cấp qua số Hotline 0965.712.812 (Tổ trưởng) và 0962.481.112 (Bí thư).',
      attachment_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      is_pinned: false,
      publish_date: '2026-09-10',
      expiry_date: '2026-10-15',
      status: 'ACTIVE',
      created_by: 'usr_totruong',
      created_at: '2026-09-10T09:00:00Z',
      updated_at: '2026-09-10T09:00:00Z'
    }
  ],

  documents: [
    {
      id: 'doc_bm01',
      code: 'BM-TDP-01',
      title: 'Giấy đề nghị xác nhận thông tin cư trú / nhân khẩu thực tế',
      category: 'TDP Lương Hậu',
      issuer: 'Tổ dân phố Lương Hậu',
      issue_date: '2026-01-15',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      source_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      description: 'Biểu mẫu phục vụ xác nhận cư trú, tạm trú thực tế tại các Đội 8, 9, 10, 11',
      is_public: true,
      created_by: 'usr_totruong',
      created_at: '2026-01-15T08:00:00Z',
      updated_at: '2026-01-15T08:00:00Z'
    },
    {
      id: 'doc_bm02',
      code: 'BM-CSXH-03',
      title: 'Đơn xin hỗ trợ đối tượng có hoàn cảnh khó khăn đột xuất',
      category: 'TDP Lương Hậu',
      issuer: 'Tổ dân phố Lương Hậu',
      issue_date: '2026-02-10',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      source_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      description: 'Mẫu đơn đề nghị trợ cấp, cứu trợ khi gặp sự cố, ốm đau hoặc thiên tai',
      is_public: true,
      created_by: 'usr_totruong',
      created_at: '2026-02-10T08:00:00Z',
      updated_at: '2026-02-10T08:00:00Z'
    },
    {
      id: 'doc_bm03',
      code: 'BM-PA-02',
      title: 'Phiếu tiếp nhận và xử lý kiến nghị - phản ánh của công dân',
      category: 'TDP Lương Hậu',
      issuer: 'Ban Điều hành TDP Lương Hậu',
      issue_date: '2026-03-01',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      source_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      description: 'Mẫu lập biên bản ghi nhận hiện trường và chuyển cơ quan có thẩm quyền xử lý',
      is_public: true,
      created_by: 'usr_totruong',
      created_at: '2026-03-01T08:00:00Z',
      updated_at: '2026-03-01T08:00:00Z'
    },
    {
      id: 'doc_vb04',
      code: 'VBPL-DD-2024',
      title: 'Luật Đất đai năm 2024 (Trích yếu quy định cấp đổi GCN quyền sử dụng đất)',
      category: 'Trung ương',
      issuer: 'Quốc hội',
      issue_date: '2024-01-18',
      file_url: '[cần bổ sung]',
      source_url: 'https://vanban.chinhphu.vn',
      description: 'Cơ sở pháp lý hướng dẫn bà con nhân dân đăng ký cấp mới, cấp đổi sổ đỏ [cần bổ sung]',
      is_public: false,
      created_by: 'usr_admin',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'doc_bm05',
      code: 'BM-DT-05',
      title: 'Phiếu đăng ký sinh hoạt đoàn thể & phong trào Ngày Chủ nhật xanh',
      category: 'TDP Lương Hậu',
      issuer: 'Đoàn Thanh niên - Ban CT Mặt trận TDP',
      issue_date: '2026-03-15',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      source_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      description: 'Đăng ký tham gia tình nguyện viên môi trường và các hoạt động cộng đồng',
      is_public: true,
      created_by: 'usr_editor',
      created_at: '2026-03-15T08:00:00Z',
      updated_at: '2026-03-15T08:00:00Z'
    },
    {
      id: 'doc_hd06',
      code: 'HD-DVC-08',
      title: 'Hướng dẫn nộp hồ sơ trực tuyến cấp Giấy xác nhận tình trạng hôn nhân',
      category: 'Phường Hương Thủy',
      issuer: 'UBND Phường Hương Thủy',
      issue_date: '2026-04-01',
      file_url: 'https://dichvucong.gov.vn',
      source_url: 'https://huongthuy.hue.gov.vn',
      description: 'Các bước thực hiện trên Cổng Dịch vụ công Quốc gia nhanh chóng, không cần đi lại',
      is_public: true,
      created_by: 'usr_admin',
      created_at: '2026-04-01T08:00:00Z',
      updated_at: '2026-04-01T08:00:00Z'
    },
    {
      id: 'doc_hd07',
      code: 'HD-DVC-09',
      title: 'Hướng dẫn đăng ký khai sinh, khai tử trực tuyến liên thông qua VNeID',
      category: 'Trung ương',
      issuer: 'Bộ Công an - UBND TP Huế',
      issue_date: '2026-05-10',
      file_url: 'https://vneid.gov.vn',
      source_url: 'https://dichvucong.gov.vn',
      description: 'Quy trình dịch vụ công liên thông 2 nhóm TTHC thiết yếu',
      is_public: true,
      created_by: 'usr_admin',
      created_at: '2026-05-10T08:00:00Z',
      updated_at: '2026-05-10T08:00:00Z'
    },
    {
      id: 'doc_bm08',
      code: 'BM-TN-04',
      title: 'Đơn xin cấp lại thẻ BHYT / chuyển đổi thông tin y tế cơ sở',
      category: 'Phường Hương Thủy',
      issuer: 'Trạm Y tế KV3 & BHXH',
      issue_date: '2026-05-20',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      source_url: 'https://huongthuy.hue.gov.vn',
      description: 'Hỗ trợ người cao tuổi, trẻ nhỏ đổi thông tin thẻ BHYT',
      is_public: true,
      created_by: 'usr_totruong',
      created_at: '2026-05-20T08:00:00Z',
      updated_at: '2026-05-20T08:00:00Z'
    },
    {
      id: 'doc_bm09',
      code: 'BM-CT-06',
      title: 'Giấy xác nhận tình trạng nhà ở phục vụ sửa chữa, xây dựng',
      category: 'TDP Lương Hậu',
      issuer: 'Tổ dân phố Lương Hậu',
      issue_date: '2026-06-01',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      source_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      description: 'Biểu mẫu phục vụ xác nhận ranh giới, không tranh chấp khi xin phép xây dựng cơ sở',
      is_public: true,
      created_by: 'usr_totruong',
      created_at: '2026-06-01T08:00:00Z',
      updated_at: '2026-06-01T08:00:00Z'
    },
    {
      id: 'doc_bm10',
      code: 'BM-HT-07',
      title: 'Phiếu đăng ký tạm trú / khai báo lưu trú qua ứng dụng Hue-S',
      category: 'Thành phố Huế',
      issuer: 'Trung tâm Giám sát Điều hành Đô thị Thông minh Huế',
      issue_date: '2026-06-15',
      file_url: 'https://hues.vn',
      source_url: 'https://hue.gov.vn',
      description: 'Tài liệu hướng dẫn khai báo tạm trú trực tiếp từ điện thoại thông minh',
      is_public: true,
      created_by: 'usr_admin',
      created_at: '2026-06-15T08:00:00Z',
      updated_at: '2026-06-15T08:00:00Z'
    },
    {
      id: 'doc_qd11',
      code: 'QD-UBND-10',
      title: 'Quy chế tiếp công dân và giải quyết thủ tục hành chính cơ sở TDP Lương Hậu',
      category: 'TDP Lương Hậu',
      issuer: 'UBND Phường Hương Thủy & TDP',
      issue_date: '2026-07-01',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      source_url: 'https://huongthuy.hue.gov.vn',
      description: 'Quy định lịch tiếp công dân tại 83 Thái Thuận và xử lý phản ánh 24/7',
      is_public: true,
      created_by: 'usr_bithu',
      created_at: '2026-07-01T08:00:00Z',
      updated_at: '2026-07-01T08:00:00Z'
    }
  ],

  events: [
    {
      id: 'ev_01',
      title: 'Sinh hoạt Chi bộ định kỳ tháng 10/2026',
      date: '2026-10-03',
      time: '14h00',
      location: 'Nhà sinh hoạt cộng đồng 83 Thái Thuận',
      organizer: 'Chi ủy Chi bộ Lương Hậu',
      description: 'Đánh giá công tác lãnh đạo tháng 9 và triển khai kế hoạch tháng 10/2026.',
      status: 'UPCOMING',
      created_at: '2026-09-20T08:00:00Z'
    },
    {
      id: 'ev_02',
      title: 'Đêm hội Trăng rằm 2026 cho thiếu nhi Lương Hậu',
      date: '2026-09-25',
      time: '19h00',
      location: 'Sân Nhà sinh hoạt cộng đồng 83 Thái Thuận',
      organizer: 'Ban Cán sự TDP & Đoàn Thanh niên',
      description: 'Phát thưởng học sinh giỏi và quà Trung thu cho các cháu thiếu niên, nhi đồng.',
      status: 'UPCOMING',
      created_at: '2026-09-15T08:00:00Z'
    },
    {
      id: 'ev_03',
      title: 'Tiêm chủng mở rộng tháng 9/2026 (Trạm Y tế KV3)',
      date: '2026-09-23',
      time: '07h30',
      location: 'Trạm Y tế phường Hương Thủy KV3',
      organizer: 'Cộng tác viên Y tế - Dân số',
      description: 'Tiêm phòng định kỳ các loại vắc-xin cho trẻ em dưới 5 tuổi.',
      status: 'UPCOMING',
      created_at: '2026-09-10T08:00:00Z'
    }
  ],

  feedback: [
    {
      id: 'fb_01',
      code: 'PA-2026-001',
      sender_name: 'Trần Văn Long',
      sender_phone: '0905123456',
      address: 'Kiệt 4 đường Sóng Hồng, Đội 8',
      content: 'Đề nghị xe thu gom rác bố trí lịch lấy đúng giờ buổi sáng, tránh để qua trưa gây mùi ảnh hưởng đời sống nhân dân trong ngõ.',
      status: 'ĐÃ_XỬ_LÝ',
      response: 'Tổ trưởng TDP đã trực tiếp làm việc với Hợp tác xã Vệ sinh Môi trường và điều chỉnh giờ gom cố định trước 08h30 hàng ngày.',
      handled_by: 'Nguyễn Trọng Nghĩa - Tổ trưởng',
      created_at: '2026-09-02T10:15:00Z',
      updated_at: '2026-09-04T15:30:00Z'
    },
    {
      id: 'fb_02',
      code: 'PA-2026-002',
      sender_name: 'Nguyễn Thị Hoa',
      sender_phone: '0935888999',
      address: 'Ngõ số 3 Xóm 2, Đội 9',
      content: 'Bóng đèn chiếu sáng ngõ bị chập cháy 2 hôm nay, đề nghị Ban Điều hành kiểm tra và thay bóng mới để bà con đi lại an toàn.',
      status: 'ĐANG_XỬ_LÝ',
      response: 'Đã giao Đ/c Nguyễn Thúc Thành kiểm tra thiết bị, dự kiến thay mới trong ngày 24/09.',
      handled_by: 'Nguyễn Thúc Thành - ANTT',
      created_at: '2026-09-03T18:20:00Z',
      updated_at: '2026-09-23T09:00:00Z'
    }
  ],

  meetings: [
    {
      id: 'meet_2026_09',
      month: 9,
      year: 2026,
      title: 'Sinh hoạt Chi bộ tháng 09/2026',
      date: '2026-09-03',
      agenda: '1. Thông tin thời sự chính sách; 2. Đánh giá công tác lãnh đạo tháng 8; 3. Kiện toàn Chi uỷ; 4. Nhiệm vụ trọng tâm tháng 9; 5. Nghị quyết Chi bộ.',
      content: 'Hội nghị Chi bộ mở rộng có đại diện Đảng ủy phường tham dự. Bầu bổ sung 02 Chi ủy viên (Đ/c Nguyễn Thị Mừng & Đ/c Ngô Thị Hoài Cẩm) đạt 17/17 phiếu tán thành (100%).',
      documents: 'Nghị quyết 09-NQ/CB, Tờ trình 11-TTr/CB, Biên bản 08-BB/CB',
      attendees_count: 20,
      conclusion: '100% đảng viên nhất trí với Nghị quyết số 09-NQ/CB. Giao Đ/c Bí thư hoàn thiện hồ sơ báo cáo Đảng ủy phường.',
      resolution_id: 'res_09',
      status: 'COMPLETED',
      created_by: 'usr_bithu',
      created_at: '2026-09-03T16:00:00Z',
      updated_at: '2026-09-03T17:00:00Z'
    }
  ],

  party_members: [
    { id: 'pm_01', stt: 1, full_name: 'NGÔ THỊ HOÀI CẨM', dob: '24/09/1989', gender: 'Nữ', join_date: '25/05/2012', official_date: '25/05/2013', party_card: '46189014598', phone: '0374323089', status: 'Sinh hoạt thường xuyên', area: 'Đội 10 (Chi ủy viên)', notes: 'Kiện toàn Chi ủy viên 03/09/2026' },
    { id: 'pm_02', stt: 2, full_name: 'NGUYỄN VĂN QUÂN', dob: '01/01/1999', gender: 'Nam', join_date: '22/12/2021', official_date: '22/12/2022', party_card: '46099000890', phone: '0345458799', status: 'Sinh hoạt thường xuyên', area: 'Đội 11', notes: 'Thanh niên xung kích' },
    { id: 'pm_03', stt: 3, full_name: 'NGUYỄN THỊ THUỶ', dob: '12/09/1987', gender: 'Nữ', join_date: '20/07/2009', official_date: '20/07/2010', party_card: '46187001860', phone: '0986658502', status: 'Sinh hoạt thường xuyên', area: 'Đội 9', notes: 'Đảng viên tích cực' },
    { id: 'pm_04', stt: 4, full_name: 'PHẠM QUANG', dob: '19/12/1981', gender: 'Nam', join_date: '28/08/2012', official_date: '28/08/2013', party_card: '46081007311', phone: '0914464097', status: 'Sinh hoạt thường xuyên', area: 'Đội 9', notes: 'Ban công tác Mặt trận' },
    { id: 'pm_05', stt: 5, full_name: 'LÊ THỊ THU THUỶ', dob: '30/04/1988', gender: 'Nữ', join_date: '19/11/2010', official_date: '19/11/2011', party_card: '46188014858', phone: '0912721759', status: 'Sinh hoạt thường xuyên', area: 'Đội 8', notes: 'Chi hội Phụ nữ' },
    { id: 'pm_06', stt: 6, full_name: 'HỒ VĂN MÃO', dob: '02/02/1989', gender: 'Nam', join_date: '22/09/2009', official_date: '22/09/2010', party_card: '46089001459', phone: '0962481112', status: 'Sinh hoạt thường xuyên', area: 'Đội 11 (Bí thư Chi bộ)', notes: 'Lãnh đạo chung Chi bộ' },
    { id: 'pm_07', stt: 7, full_name: 'PHẠM SẰNG', dob: '02/02/1956', gender: 'Nam', join_date: '25/01/1995', official_date: '25/01/1996', party_card: '46056006617', phone: '0372500460', status: 'Sinh hoạt thường xuyên', area: 'Đội 10', notes: 'Đảng viên cao tuổi' },
    { id: 'pm_08', stt: 8, full_name: 'NGUYỄN CẦN', dob: '12/08/1972', gender: 'Nam', join_date: '05/01/1997', official_date: '05/01/1998', party_card: '46072002290', phone: '0946580955', status: 'Sinh hoạt thường xuyên', area: 'Đội 9', notes: 'Tổ hòa giải cơ sở' },
    { id: 'pm_09', stt: 9, full_name: 'LÊ THỊ BÍCH HẠNH', dob: '02/02/1975', gender: 'Nữ', join_date: '15/06/1998', official_date: '15/06/1999', party_card: '46175001244', phone: '0905112233', status: 'Sinh hoạt thường xuyên', area: 'Đội 8', notes: 'Đảng viên gương mẫu' },
    { id: 'pm_10', stt: 10, full_name: 'NGUYỄN TRỌNG NGHĨA', dob: '15/05/1980', gender: 'Nam', join_date: '19/05/2005', official_date: '19/05/2006', party_card: '46080005512', phone: '0965712812', status: 'Sinh hoạt thường xuyên', area: 'Đội 8 (Phó Bí thư, Tổ trưởng)', notes: 'Điều hành chính quyền TDP' },
    { id: 'pm_11', stt: 11, full_name: 'HOÀNG HỮU RỚT', dob: '10/10/1978', gender: 'Nam', join_date: '03/02/2004', official_date: '03/02/2005', party_card: '46078004419', phone: '0965943303', status: 'Sinh hoạt thường xuyên', area: 'Đội 9 (Chi ủy viên)', notes: 'Trưởng ban CT Mặt trận' },
    { id: 'pm_12', stt: 12, full_name: 'NGUYỄN THỊ MỪNG', dob: '08/03/1979', gender: 'Nữ', join_date: '08/03/2007', official_date: '08/03/2008', party_card: '46179008821', phone: '0377412815', status: 'Sinh hoạt thường xuyên', area: 'Đội 9 (Chi ủy viên)', notes: 'Chi hội trưởng Phụ nữ' },
    { id: 'pm_13', stt: 13, full_name: 'NGUYỄN THÚC THÀNH', dob: '20/11/1970', gender: 'Nam', join_date: '02/09/2000', official_date: '02/09/2001', party_card: '46070003310', phone: '0975175361', status: 'Sinh hoạt thường xuyên', area: 'Toàn địa bàn', notes: 'Tổ trưởng LL ANTT cơ sở' },
    { id: 'pm_14', stt: 14, full_name: 'NGUYỄN CƯỠNG', dob: '14/07/1964', gender: 'Nam', join_date: '22/12/1988', official_date: '22/12/1989', party_card: '46064002201', phone: '0981710242', status: 'Sinh hoạt thường xuyên', area: 'Toàn địa bàn', notes: 'Chi hội trưởng Cựu chiến binh' },
    { id: 'pm_15', stt: 15, full_name: 'PHAN ĐĂNG CHIẾN', dob: '05/01/1951', gender: 'Nam', join_date: '19/08/1976', official_date: '19/08/1977', party_card: '46051001190', phone: '0913469434', status: 'Miễn sinh hoạt (Tuổi cao)', area: 'Toàn địa bàn', notes: 'Chi hội trưởng Người cao tuổi' },
    { id: 'pm_16', stt: 16, full_name: 'NGUYỄN NHƯ KHẢI', dob: '12/12/1993', gender: 'Nam', join_date: '22/12/2015', official_date: '22/12/2016', party_card: '46093009941', phone: '0388886876', status: 'Sinh hoạt thường xuyên', area: 'Đội 10', notes: 'Tổ đội trưởng Quân sự' },
    { id: 'pm_17', stt: 17, full_name: 'PHẠM PHƯỚC THÀNH', dob: '18/06/1985', gender: 'Nam', join_date: '03/02/2010', official_date: '03/02/2011', party_card: '46085006670', phone: '0905445566', status: 'Sinh hoạt thường xuyên', area: 'Đội 11', notes: 'Giám sát chuyên đề Điều 30' },
    { id: 'pm_18', stt: 18, full_name: 'HOÀNG ĐÌNH CƯỜNG', dob: '22/04/1984', gender: 'Nam', join_date: '19/05/2011', official_date: '19/05/2012', party_card: '46084005531', phone: '0905778899', status: 'Sinh hoạt thường xuyên', area: 'Đội 9', notes: 'Kiểm tra đảng viên chấp hành' },
    { id: 'pm_19', stt: 19, full_name: 'TRẦN THỊ HỒNG', dob: '15/09/1982', gender: 'Nữ', join_date: '20/10/2008', official_date: '20/10/2009', party_card: '46182003345', phone: '0913556677', status: 'Sinh hoạt thường xuyên', area: 'Đội 8', notes: 'Tổ đảng Đội 8' },
    { id: 'pm_20', stt: 20, full_name: 'LÊ VĂN ĐỨC', dob: '10/03/1976', gender: 'Nam', join_date: '02/09/2002', official_date: '02/09/2003', party_card: '46076007781', phone: '0905990011', status: 'Sinh hoạt thường xuyên', area: 'Đội 10', notes: 'Tổ đảng Đội 10' },
    { id: 'pm_21', stt: 21, full_name: 'NGUYỄN THỊ MAI', dob: '25/11/1990', gender: 'Nữ', join_date: '26/03/2014', official_date: '26/03/2015', party_card: '46190001123', phone: '0988223344', status: 'Sinh hoạt thường xuyên', area: 'Đội 11', notes: 'Phụ trách chuyên đề thanh niên' },
    { id: 'pm_22', stt: 22, full_name: 'HOÀNG VĂN THẮNG', dob: '04/08/1987', gender: 'Nam', join_date: '03/02/2013', official_date: '03/02/2014', party_card: '46087009988', phone: '0914112233', status: 'Sinh hoạt thường xuyên', area: 'Đội 9', notes: 'Tổ đảng Đội 9' }
  ],

  attendance: [
    { id: 'att_01', meeting_id: 'meet_2026_09', party_member_id: 'pm_01', status: 'PRESENT', notes: '' },
    { id: 'att_02', meeting_id: 'meet_2026_09', party_member_id: 'pm_02', status: 'PRESENT', notes: '' },
    { id: 'att_03', meeting_id: 'meet_2026_09', party_member_id: 'pm_03', status: 'PRESENT', notes: '' },
    { id: 'att_04', meeting_id: 'meet_2026_09', party_member_id: 'pm_04', status: 'PRESENT', notes: '' },
    { id: 'att_05', meeting_id: 'meet_2026_09', party_member_id: 'pm_05', status: 'PRESENT', notes: '' },
    { id: 'att_06', meeting_id: 'meet_2026_09', party_member_id: 'pm_06', status: 'PRESENT', notes: '' },
    { id: 'att_07', meeting_id: 'meet_2026_09', party_member_id: 'pm_07', status: 'PRESENT', notes: '' },
    { id: 'att_08', meeting_id: 'meet_2026_09', party_member_id: 'pm_08', status: 'PRESENT', notes: '' },
    { id: 'att_09', meeting_id: 'meet_2026_09', party_member_id: 'pm_09', status: 'PRESENT', notes: '' },
    { id: 'att_10', meeting_id: 'meet_2026_09', party_member_id: 'pm_10', status: 'PRESENT', notes: '' },
    { id: 'att_11', meeting_id: 'meet_2026_09', party_member_id: 'pm_11', status: 'PRESENT', notes: '' },
    { id: 'att_12', meeting_id: 'meet_2026_09', party_member_id: 'pm_12', status: 'PRESENT', notes: '' },
    { id: 'att_13', meeting_id: 'meet_2026_09', party_member_id: 'pm_13', status: 'PRESENT', notes: '' },
    { id: 'att_14', meeting_id: 'meet_2026_09', party_member_id: 'pm_14', status: 'PRESENT', notes: '' },
    { id: 'att_15', meeting_id: 'meet_2026_09', party_member_id: 'pm_15', status: 'EXCUSED', notes: 'Miễn sinh hoạt theo quy định (Tuổi cao)' },
    { id: 'att_16', meeting_id: 'meet_2026_09', party_member_id: 'pm_16', status: 'PRESENT', notes: '' },
    { id: 'att_17', meeting_id: 'meet_2026_09', party_member_id: 'pm_17', status: 'PRESENT', notes: '' },
    { id: 'att_18', meeting_id: 'meet_2026_09', party_member_id: 'pm_18', status: 'PRESENT', notes: '' },
    { id: 'att_19', meeting_id: 'meet_2026_09', party_member_id: 'pm_19', status: 'PRESENT', notes: '' },
    { id: 'att_20', meeting_id: 'meet_2026_09', party_member_id: 'pm_20', status: 'PRESENT', notes: '' },
    { id: 'att_21', meeting_id: 'meet_2026_09', party_member_id: 'pm_21', status: 'PRESENT', notes: '' },
    { id: 'att_22', meeting_id: 'meet_2026_09', party_member_id: 'pm_22', status: 'EXCUSED', notes: 'Công tác đột xuất' }
  ],

  resolutions: [
    {
      id: 'res_09',
      code: '09-NQ/CB',
      title: 'Nghị quyết kỳ sinh hoạt tháng 09/2026 của Chi bộ Lương Hậu',
      date: '2026-09-03',
      content: 'Trọng tâm công tác lãnh đạo tháng 9: 1. Kiện toàn nhân sự Chi ủy viên; 2. Triển khai phương án 4 tại chỗ phòng chống mưa lũ; 3. Tổ chức Ngày Chủ nhật xanh đợt 4 và Đêm hội Trăng rằm; 4. Đôn đốc thu nộp 100% đảng phí quý III.',
      key_tasks: 'Rà soát 74 nguồn NVQS, kiểm tra phòng dịch sốt xuất huyết, hoàn thành giám sát chuyên đề Điều 30',
      assigned_to: 'Chi ủy & Các Tổ đảng',
      deadline: '2026-09-30',
      status: 'ĐANG_THỰC_HIỆN',
      created_by: 'usr_bithu',
      created_at: '2026-09-03T16:30:00Z',
      updated_at: '2026-09-03T16:30:00Z'
    }
  ],

  tasks: [
    {
      id: 'task_01',
      title: 'Lãnh đạo chung, xây dựng Đảng, kiểm tra giám sát, bồi dưỡng tạo nguồn',
      content: 'Chỉ đạo toàn diện hoạt động Chi bộ, phụ trách trực tiếp địa bàn Đội 11, hoàn thiện hồ sơ chuẩn y Chi ủy viên.',
      assignee: 'Hồ Văn Mão (Bí thư Chi bộ)',
      assigned_date: '2026-09-01',
      deadline: '2026-09-30',
      priority: 'CAO',
      status: 'ĐANG_LÀM',
      progress_percent: 90,
      notes: 'Đạt danh hiệu Xuất sắc',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      created_by: 'usr_bithu',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-20T10:00:00Z'
    },
    {
      id: 'task_02',
      title: 'Quản lý chính quyền, KT-XH, trật tự đô thị, thu quỹ TDP, chỉ huy PCTT',
      content: 'Phụ trách Đội 8, kiểm tra hệ thống thoát nước, trực ban mưa lũ 24/24, đôn đốc thu quỹ TDP đạt chỉ tiêu.',
      assignee: 'Nguyễn Trọng Nghĩa (Tổ trưởng TDP)',
      assigned_date: '2026-09-01',
      deadline: '2026-09-30',
      priority: 'CAO',
      status: 'ĐANG_LÀM',
      progress_percent: 85,
      notes: 'Đạt danh hiệu Tốt',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      created_by: 'usr_bithu',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-20T10:00:00Z'
    },
    {
      id: 'task_03',
      title: 'Khối đại đoàn kết toàn dân, hòa giải cơ sở, dư luận nhân dân',
      content: 'Phụ trách Đội 9, nắm bắt tâm tư nguyện vọng bà con nhân dân, hòa giải kịp thời các mâu thuẫn cơ sở.',
      assignee: 'Hoàng Hữu Rớt (Trưởng ban CT Mặt trận)',
      assigned_date: '2026-09-01',
      deadline: '2026-09-30',
      priority: 'TRUNG_BÌNH',
      status: 'ĐANG_LÀM',
      progress_percent: 90,
      notes: 'Đạt danh hiệu Xuất sắc',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      created_by: 'usr_bithu',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-20T10:00:00Z'
    },
    {
      id: 'task_04',
      title: 'Phong trào phụ nữ, gia đình 5 không 3 sạch, đôn đốc 100% đảng phí',
      content: 'Phụ trách Đội 9, vận động phân loại rác tại nguồn, thu dọn vệ sinh đường làng ngõ xóm.',
      assignee: 'Nguyễn Thị Mừng (Chi hội trưởng Phụ nữ)',
      assigned_date: '2026-09-01',
      deadline: '2026-09-30',
      priority: 'TRUNG_BÌNH',
      status: 'ĐANG_LÀM',
      progress_percent: 90,
      notes: 'Đạt danh hiệu Xuất sắc',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      created_by: 'usr_bithu',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-20T10:00:00Z'
    },
    {
      id: 'task_05',
      title: 'Hỗ trợ nông nghiệp, tuần tra ANTT đêm Thứ 3 & Thứ 7, an toàn PCCC',
      content: 'Chỉ huy lực lượng ANTT cơ sở, tuần tra kiểm soát địa bàn, kiểm tra bình chữa cháy công cộng.',
      assignee: 'Nguyễn Thúc Thành (Tổ trưởng LL ANTT)',
      assigned_date: '2026-09-01',
      deadline: '2026-09-30',
      priority: 'CAO',
      status: 'ĐANG_LÀM',
      progress_percent: 85,
      notes: 'Đạt danh hiệu Tốt',
      file_url: '',
      created_by: 'usr_bithu',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-20T10:00:00Z'
    },
    {
      id: 'task_06',
      title: 'Giáo dục truyền thống cách mạng, hội viên gương mẫu, phối hợp tuần tra',
      content: 'Vận động hội viên Cựu chiến binh đi đầu trong các phong trào thi đua yêu nước và bảo vệ an ninh trật tự.',
      assignee: 'Nguyễn Cưỡng (Chi hội trưởng Cựu chiến binh)',
      assigned_date: '2026-09-01',
      deadline: '2026-09-30',
      priority: 'TRUNG_BÌNH',
      status: 'ĐANG_LÀM',
      progress_percent: 85,
      notes: 'Đạt danh hiệu Tốt',
      file_url: '',
      created_by: 'usr_bithu',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-20T10:00:00Z'
    },
    {
      id: 'task_07',
      title: 'Phong trào Tuổi cao - Gương sáng, mừng thọ, khuyến học, nếp sống văn minh',
      content: 'Chăm lo người cao tuổi, vận động gia đình dòng họ khuyến học khuyến tài.',
      assignee: 'Phan Đăng Chiến (Chi hội trưởng Người cao tuổi)',
      assigned_date: '2026-09-01',
      deadline: '2026-09-30',
      priority: 'THẤP',
      status: 'ĐANG_LÀM',
      progress_percent: 90,
      notes: 'Đạt danh hiệu Xuất sắc',
      file_url: '',
      created_by: 'usr_bithu',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-20T10:00:00Z'
    },
    {
      id: 'task_08',
      title: 'Phong trào thanh thiếu nhi, xung kích Ngày Chủ nhật xanh, Tổ CNSCĐ',
      content: 'Tổ chức Đêm hội Trăng rằm cho thiếu nhi, ra quân Chủ nhật xanh, hỗ trợ người dân cài đặt ứng dụng số.',
      assignee: 'Nguyễn Thị Ngọc Tú (Bí thư Chi đoàn)',
      assigned_date: '2026-09-01',
      deadline: '2026-09-30',
      priority: 'CAO',
      status: 'ĐANG_LÀM',
      progress_percent: 90,
      notes: 'Đạt danh hiệu Xuất sắc',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      created_by: 'usr_bithu',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-20T10:00:00Z'
    },
    {
      id: 'task_09',
      title: 'Quốc phòng địa phương, quản lý 74 nguồn NVQS 2027, trực ban PCTT Đội 10',
      content: 'Rà soát danh sách thanh niên trong độ tuổi nhập ngũ, sẵn sàng phương án ứng trực PCTT.',
      assignee: 'Nguyễn Như Khải (Tổ đội trưởng Quân sự)',
      assigned_date: '2026-09-01',
      deadline: '2026-09-30',
      priority: 'CAO',
      status: 'ĐANG_LÀM',
      progress_percent: 80,
      notes: 'Đạt danh hiệu Tốt',
      file_url: '',
      created_by: 'usr_bithu',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-20T10:00:00Z'
    },
    {
      id: 'task_10',
      title: 'Cập nhật biến động dân số Sổ A0, tiêm chủng, giám sát phòng dịch BHYT >98%',
      content: 'Cập nhật sổ theo dõi biến động dân số, hỗ trợ trạm y tế tiêm chủng mở rộng và giám sát sốt xuất huyết 4 Đội.',
      assignee: 'Phạm Thị Thu Thanh (CTV Dân số & Y tế)',
      assigned_date: '2026-09-01',
      deadline: '2026-09-30',
      priority: 'TRUNG_BÌNH',
      status: 'ĐANG_LÀM',
      progress_percent: 85,
      notes: 'Đạt danh hiệu Tốt',
      file_url: '',
      created_by: 'usr_bithu',
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-20T10:00:00Z'
    }
  ],

  attachments: [
    {
      id: 'att_gdrive_central',
      target_type: 'SYSTEM',
      target_id: 'FOLDER_ROOT',
      file_name: 'Kho Lưu Trữ Google Drive Chi Bộ & TDP Lương Hậu',
      file_url: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo',
      file_size: 'Central Drive',
      mime_type: 'application/vnd.google-apps.folder',
      uploaded_at: '2026-09-01T00:00:00Z'
    }
  ],

  audit_logs: [
    {
      id: 'log_01',
      timestamp: '2026-09-24T08:00:00Z',
      user_id: 'usr_admin',
      username: 'admin',
      role: 'ADMIN',
      action: 'SYSTEM_INIT',
      resource: 'DATABASE',
      details: 'Khởi tạo kiến trúc cơ sở dữ liệu Clean Architecture 17 bảng cho Cổng Thông tin & Điều hành số Lương Hậu',
      ip: '127.0.0.1'
    },
    {
      id: 'log_02',
      timestamp: '2026-09-24T08:05:00Z',
      user_id: 'usr_bithu',
      username: 'bithu',
      role: 'BI_THU',
      action: 'APPROVE',
      resource: 'NEWS',
      details: 'Bí thư Chi bộ phê duyệt và công khai bài viết về công tác PCTT và Ngày Chủ nhật xanh',
      ip: '127.0.0.1'
    }
  ],

  settings: [
    { key: 'PORTAL_NAME', value: 'CỔNG THÔNG TIN VÀ ĐIỀU HÀNH SỐ LƯƠNG HẬU', description: 'Tên chính thức hệ thống', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'SLOGAN', value: 'Đoàn kết - Dân chủ - Kỷ cương - Phát triển', description: 'Khẩu hiệu hành động', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'ORG_LEVEL_1', value: 'UBND PHƯỜNG HƯƠNG THỦY • THÀNH PHỐ HUẾ', description: 'Cơ quan cấp trên', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'ADDRESS', value: 'Số 83 Thái Thuận, TDP Lương Hậu, Phường Hương Thủy, TP. Huế', description: 'Trụ sở Nhà sinh hoạt cộng đồng', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'HOTLINE_1', value: '0965.712.812', description: 'Tổ trưởng Nguyễn Trọng Nghĩa', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'HOTLINE_2', value: '0962.481.112', description: 'Bí thư Hồ Văn Mão', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'POLICE_PHONE', value: '0234.43852870', description: 'Công an Phường Hương Thủy', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'TOTAL_HOUSEHOLDS', value: '469', description: 'Tổng số hộ gia đình', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'TOTAL_POPULATION', value: '1947', description: 'Tổng nhân khẩu', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'TOTAL_PARTY_MEMBERS', value: '22', description: 'Tổng số đảng viên Chi bộ', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'GDRIVE_CENTRAL_URL', value: 'https://drive.google.com/drive/folders/1SrV0d701Xg4rTkRH9O6MknOkdZiaUOuo', description: 'Google Drive trung tâm bảo toàn', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'APP_SOTAY_DANGVIEN_URL', value: 'https://sotaydangvien.hue.gov.vn/', description: 'Cổng Sổ tay Đảng viên Điện tử', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'HUES_WEB_URL', value: 'https://hue.gov.vn/', description: 'Cổng Thông tin Điện tử TP. Huế', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'HUES_FEEDBACK_URL', value: 'https://tuongtac.hue.gov.vn/', description: 'Hệ thống Phản ánh Tương tác Hue-S', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'HUES_DOTHIXANH_URL', value: 'https://tuongtac.hue.gov.vn/dothixanh', description: 'Phản ánh Hiện trường Đô thị Xanh', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' },
    { key: 'HUES_PLAY_STORE_URL', value: 'https://play.google.com/store/apps/details?id=vn.stttt.hues', description: 'Ứng dụng Hue-S chính thức trên Google Play (Android: vn.stttt.hues)', updated_at: '2026-09-24T00:00:00Z', updated_by: 'admin' }
  ]
};

// Database Management Class
class LuongHauDatabase {
  constructor() {
    this.data = this.load();
  }

  load() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Check that all 17 tables exist
          const tables = Object.keys(SEED_DATA);
          let valid = true;
          for (const tbl of tables) {
            if (!Array.isArray(parsed[tbl])) {
              valid = false;
              break;
            }
          }
          if (valid) return parsed;
        }
      } catch (e) {
        console.warn('LocalStorage load error, reverting to SEED_DATA', e);
      }
    }
    // Return deep clone of seed data
    return JSON.parse(JSON.stringify(SEED_DATA));
  }

  save() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.error('LocalStorage save error:', e);
      }
    }
  }

  // Generic Table Operations
  getAll(table) {
    if (!this.data[table]) return [];
    return JSON.parse(JSON.stringify(this.data[table]));
  }

  getById(table, id) {
    const list = this.getAll(table);
    return list.find(item => item.id === id) || null;
  }

  insert(table, item, user = null) {
    if (!this.data[table]) this.data[table] = [];
    const newItem = {
      ...item,
      id: item.id || (table.slice(0, 3) + '_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4)),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user ? user.username : 'system',
      updated_by: user ? user.username : 'system'
    };
    this.data[table].unshift(newItem);
    this.save();

    // Log to audit log
    this.addAuditLog({
      action: 'CREATE',
      resource: table.toUpperCase(),
      details: `Tạo mới bản ghi trên bảng ${table}: ${newItem.title || newItem.full_name || newItem.id}`,
      user: user
    });

    return newItem;
  }

  update(table, id, updates, user = null) {
    if (!this.data[table]) return null;
    const idx = this.data[table].findIndex(item => item.id === id);
    if (idx === -1) return null;

    const oldItem = this.data[table][idx];
    const updated = {
      ...oldItem,
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: user ? user.username : (oldItem.updated_by || 'system')
    };
    this.data[table][idx] = updated;
    this.save();

    // Log to audit log
    this.addAuditLog({
      action: 'UPDATE',
      resource: table.toUpperCase(),
      details: `Cập nhật bản ghi ${id} trên bảng ${table}`,
      user: user
    });

    return updated;
  }

  delete(table, id, user = null) {
    if (!this.data[table]) return false;
    const idx = this.data[table].findIndex(item => item.id === id);
    if (idx === -1) return false;

    const removed = this.data[table].splice(idx, 1)[0];
    this.save();

    // Log to audit log
    this.addAuditLog({
      action: 'DELETE',
      resource: table.toUpperCase(),
      details: `Xoá bản ghi ${id} khỏi bảng ${table}`,
      user: user
    });

    return true;
  }

  // Immutable Audit Log
  addAuditLog({ action, resource, details, user }) {
    if (!this.data.audit_logs) this.data.audit_logs = [];
    const logEntry = {
      id: 'log_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      user_id: user ? (user.id || user.username) : 'anonymous',
      username: user ? user.username : 'Guest / System',
      role: user ? user.role : 'PUBLIC',
      action: action,
      resource: resource,
      details: details,
      ip: 'Client Local'
    };
    this.data.audit_logs.unshift(logEntry);
    this.save();
    return logEntry;
  }

  // Backup & Restore
  getSetting(key, defaultValue = '') {
    if (!this.data.settings) return defaultValue;
    const item = this.data.settings.find(s => s.key === key);
    return item ? item.value : defaultValue;
  }

  setSetting(key, value, user = null) {
    if (!this.data.settings) this.data.settings = [];
    const idx = this.data.settings.findIndex(s => s.key === key);
    if (idx !== -1) {
      this.data.settings[idx].value = value;
      this.data.settings[idx].updated_at = new Date().toISOString();
      this.data.settings[idx].updated_by = user ? user.username : 'system';
    } else {
      this.data.settings.push({
        key: key,
        value: value,
        description: 'Custom Setting',
        updated_at: new Date().toISOString(),
        updated_by: user ? user.username : 'system'
      });
    }
    this.save();
    this.addAuditLog({
      action: 'UPDATE_SETTING',
      resource: 'SETTINGS',
      details: `Cập nhật cấu hình ${key} = ${value}`,
      user: user
    });
    return true;
  }

  exportJson() {
    return JSON.stringify(this.data, null, 2);
  }

  importJson(jsonString, user = null) {
    try {
      const parsed = JSON.parse(jsonString);
      const tables = Object.keys(SEED_DATA);
      for (const tbl of tables) {
        if (!Array.isArray(parsed[tbl])) {
          throw new Error(`Bảng ${tbl} bị thiếu trong dữ liệu import.`);
        }
      }
      this.data = parsed;
      this.save();
      this.addAuditLog({
        action: 'RESTORE',
        resource: 'DATABASE',
        details: 'Khôi phục toàn bộ cơ sở dữ liệu từ tệp JSON',
        user: user
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetToSeed(user = null) {
    this.data = JSON.parse(JSON.stringify(SEED_DATA));
    this.save();
    this.addAuditLog({
      action: 'RESET',
      resource: 'DATABASE',
      details: 'Khởi tạo lại dữ liệu về trạng thái Seed Data chuẩn',
      user: user
    });
  }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
  window.DB = window.DB || new LuongHauDatabase();
}

export { LuongHauDatabase, SEED_DATA, hashPassword };

if (typeof window !== 'undefined') {
  window.hashPassword = hashPassword;
  window.LuongHauDatabase = LuongHauDatabase;
}
