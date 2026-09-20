/**
 * CỔNG THÔNG TIN SỐ LƯƠNG HẬU - DATA STORE ENGINE
 * Quản lý trạng thái và cơ sở dữ liệu thực tế: Tin tức, Văn bản 3 cấp, Thông báo, Đảng viên, Cán bộ, RBAC
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.LHStore = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const STORAGE_KEY = "luong_hau_db_v3";

  // Dữ liệu cán bộ thật Tổ dân phố Lương Hậu (10 đồng chí)
  const DEFAULT_CAN_BO = [
    { id: "CB01", name: "Hồ Văn Mão", role: "Tổ trưởng TDP • Bí thư Chi bộ", phone: "0965.712.812", partyJoined: "02/02/2012", address: "83 Thái Thuận, TDP Lương Hậu", note: "Phụ trách chung" },
    { id: "CB02", name: "Nguyễn Trọng Nghĩa", role: "Phó Tổ trưởng TDP • Phó Bí thư Chi bộ", phone: "0962.481.112", partyJoined: "19/05/2014", address: "TDP Lương Hậu", note: "Phụ trách kinh tế - cơ sở hạ tầng" },
    { id: "CB03", name: "Hoàng Hữu Rớt", role: "Chi ủy viên • Trưởng Ban CTMT", phone: "0914.520.311", partyJoined: "03/02/2008", address: "TDP Lương Hậu", note: "Phụ trách Mặt trận & Dân vận" },
    { id: "CB04", name: "Nguyễn Thị Mừng", role: "Chi hội trưởng Phụ nữ", phone: "0935.811.240", partyJoined: "Đang cập nhật", address: "TDP Lương Hậu", note: "Phụ trách phong trào phụ nữ & VSMT" },
    { id: "CB05", name: "Nguyễn Thúc Thành", role: "Tổ trưởng Tổ BV ANTT cơ sở", phone: "0975.175.361", partyJoined: "Đang cập nhật", address: "TDP Lương Hậu", note: "Phụ trách tuần tra an ninh trật tự" },
    { id: "CB06", name: "Trần Văn Cường", role: "Bí thư Chi đoàn Thanh niên", phone: "0984.112.553", partyJoined: "Đang cập nhật", address: "TDP Lương Hậu", note: "Phụ trách thanh thiếu nhi & Chủ nhật xanh" },
    { id: "CB07", name: "Lê Văn Hùng", role: "Chi hội trưởng Cựu chiến binh", phone: "0905.334.872", partyJoined: "19/08/1995", address: "TDP Lương Hậu", note: "Phụ trách Hội CCB" },
    { id: "CB08", name: "Đặng Thị Thu Thanh", role: "Cộng tác viên Y tế - Dân số", phone: "0942.667.119", partyJoined: "Đang cập nhật", address: "TDP Lương Hậu", note: "Phụ trách tiêm chủng & trạm y tế KV3" },
    { id: "CB09", name: "Nguyễn Văn Đức", role: "Tổ phó Tổ BV ANTT cơ sở", phone: "0912.445.881", partyJoined: "Đang cập nhật", address: "TDP Lương Hậu", note: "Phụ trách PCTT & TKCN" },
    { id: "CB10", name: "Phan Thị Sen", role: "Chi hội trưởng Người cao tuổi", phone: "0934.778.223", partyJoined: "Đang cập nhật", address: "TDP Lương Hậu", note: "Phụ trách công tác khuyến học & NCT" }
  ];

  // Danh sách Đảng viên Chi bộ Lương Hậu (22 đồng chí)
  const DEFAULT_DANG_VIEN = [
    { id: "DV01", name: "Hồ Văn Mão", birth: "02/02/1989", year: "1989", role: "Bí thư Chi bộ", position: "Tổ trưởng TDP", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV02", name: "Nguyễn Trọng Nghĩa", birth: "15/08/1980", year: "1980", role: "Phó Bí thư Chi bộ", position: "Phó Tổ trưởng", group: "Tổ Đảng 2", status: "Chính thức" },
    { id: "DV03", name: "Hoàng Hữu Rớt", birth: "10/11/1978", year: "1978", role: "Chi ủy viên", position: "Trưởng Ban CTMT", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV04", name: "Lê Văn Hùng", birth: "22/04/1965", year: "1965", role: "Đảng viên", position: "Chi hội CCB", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV05", name: "Trần Văn Bình", birth: "05/09/1972", year: "1972", role: "Đảng viên", position: "Cán bộ cơ sở", group: "Tổ Đảng 2", status: "Chính thức" },
    { id: "DV06", name: "Nguyễn Văn Sang", birth: "12/03/1984", year: "1984", role: "Đảng viên", position: "Đoàn viên thanh niên", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV07", name: "Võ Thị Lệ", birth: "18/07/1976", year: "1976", role: "Đảng viên", position: "Hội Phụ nữ", group: "Tổ Đảng 2", status: "Chính thức" },
    { id: "DV08", name: "Phạm Văn Tuấn", birth: "30/01/1982", year: "1982", role: "Đảng viên", position: "Tự quản", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV09", name: "Đặng Hữu Phước", birth: "14/06/1968", year: "1968", role: "Đảng viên", position: "Khuyến học", group: "Tổ Đảng 2", status: "Chính thức" },
    { id: "DV10", name: "Nguyễn Thị Hoa", birth: "25/12/1985", year: "1985", role: "Đảng viên", position: "Y tế dân số", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV11", name: "Trần Hữu Nam", birth: "08/08/1990", year: "1990", role: "Đảng viên", position: "Dân quân cơ động", group: "Tổ Đảng 2", status: "Chính thức" },
    { id: "DV12", name: "Hoàng Văn Long", birth: "19/02/1974", year: "1974", role: "Đảng viên", position: "Ban CTMT", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV13", name: "Lê Thị Thu", birth: "03/10/1988", year: "1988", role: "Đảng viên", position: "Cán bộ văn hóa", group: "Tổ Đảng 2", status: "Chính thức" },
    { id: "DV14", name: "Ngô Văn Thành", birth: "17/05/1963", year: "1963", role: "Đảng viên", position: "Hội Người cao tuổi", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV15", name: "Đỗ Hữu Minh", birth: "28/11/1987", year: "1987", role: "Đảng viên", position: "Tổ ANTT", group: "Tổ Đảng 2", status: "Chính thức" },
    { id: "DV16", name: "Bùi Thị Mai", birth: "11/04/1981", year: "1981", role: "Đảng viên", position: "Cán bộ cơ sở", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV17", name: "Vũ Văn Hải", birth: "09/09/1992", year: "1992", role: "Đảng viên", position: "Bí thư Chi đoàn", group: "Tổ Đảng 2", status: "Dự bị" },
    { id: "DV18", name: "Hồ Thị Kim", birth: "23/07/1979", year: "1979", role: "Đảng viên", position: "Cán bộ TDP", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV19", name: "Phan Văn Cảnh", birth: "16/01/1970", year: "1970", role: "Đảng viên", position: "Nông dân", group: "Tổ Đảng 2", status: "Chính thức" },
    { id: "DV20", name: "Lương Hữu Đức", birth: "04/05/1986", year: "1986", role: "Đảng viên", position: "Tổ tự quản", group: "Tổ Đảng 1", status: "Chính thức" },
    { id: "DV21", name: "Trịnh Thị Nga", birth: "29/08/1991", year: "1991", role: "Đảng viên", position: "Hội Phụ nữ", group: "Tổ Đảng 2", status: "Dự bị" },
    { id: "DV22", name: "Nguyễn Hữu Tài", birth: "15/12/1966", year: "1966", role: "Đảng viên", position: "Ban CTMT", group: "Tổ Đảng 1", status: "Chính thức" }
  ];

  // Danh mục 3 Cấp Văn bản chính thức
  const DEFAULT_VAN_BAN = [
    {
      id: "VB-333-UBND",
      code: "333/KH-UBND",
      title: "Kế hoạch số 333/KH-UBND của UBND TP Huế về đo đạc, cấp đổi GCN quyền sử dụng đất trên địa bàn",
      agency: "UBND Thành phố Huế",
      date: "15/08/2026",
      level: "THÀNH PHỐ HUẾ",
      type: "Kế hoạch",
      category: "Đất đai - Địa chính",
      pdfUrl: "/documents/333_KH_UBND_Hue_Dat_Dai_2026.pdf",
      source: "hue.gov.vn (doc/59799)",
      summary: "Kế hoạch tổng thể rà soát hồ sơ địa chính, cấp đổi giấy chứng nhận QSDĐ đồng loạt tại cơ sở dân cư vùng trung tâm và mở rộng."
    },
    {
      id: "VB-45-TTG",
      code: "45/2026/NQ-CP",
      title: "Nghị quyết của Chính phủ về đẩy mạnh chuyển đổi số quốc gia và dịch vụ công trực tuyến toàn trình tại cơ sở",
      agency: "Chính phủ",
      date: "10/01/2026",
      level: "TRUNG ƯƠNG",
      type: "Nghị quyết",
      category: "Chuyển đổi số",
      pdfUrl: "https://vanban.chinhphu.vn",
      source: "Cổng TTĐT Chính phủ",
      summary: "Quy định chỉ tiêu 100% hồ sơ thủ tục hành chính cấp xã/phường được số hóa và liên thông dữ liệu dân cư VNeID."
    },
    {
      id: "VB-14-TB-TDP",
      code: "14/TB-TDP",
      title: "Thông báo số 14/TB-TDP ra quân tổng vệ sinh môi trường 'Ngày Chủ nhật xanh' đợt 4 năm 2026",
      agency: "UBND Phường Hương Thủy • TDP Lương Hậu",
      date: "10/09/2026",
      level: "PHƯỜNG HƯƠNG THỦY",
      type: "Thông báo",
      category: "Môi trường",
      pdfUrl: "/documents/BM-TDP-01-Xac-Nhan-Cu-Tru.pdf",
      source: "Ban Điều hành TDP",
      summary: "Huy động toàn thể nhân dân, đoàn thể, hộ kinh doanh dọc tuyến Thái Thuận ra quân làm sạch cảnh quan, khơi thông cống rãnh chuẩn bị đón mùa mưa lũ."
    },
    {
      id: "VB-82-QD-UBND",
      code: "82/QĐ-UBND",
      title: "Quyết định thành lập Tổ công tác triển khai Đề án 06 và chuyển đổi số cộng đồng tại Tổ dân phố Lương Hậu",
      agency: "UBND Phường Hương Thủy",
      date: "20/03/2026",
      level: "PHƯỜNG HƯƠNG THỦY",
      type: "Quyết định",
      category: "Tổ chức - Cán bộ",
      pdfUrl: "https://huongthuy.hue.gov.vn",
      source: "Cổng TTĐT Phường Hương Thủy",
      summary: "Phân công cụ thể thành viên Ban cán bộ, Đoàn thanh niên phụ trách hướng dẫn từng cụm dân cư kích hoạt định danh mức 2 và nộp hồ sơ DVC trực tuyến."
    }
  ];

  // Tin tức ban đầu
  const DEFAULT_TIN_TUC = [
    {
      slug: "chu-dong-ung-pho-mua-lu-2026",
      title: "Chủ động từ sớm, từ xa: Phương án phòng chống thiên tai và bão lũ tại địa bàn TDP Lương Hậu",
      category: "PCTT & TKCN",
      date: "10/09/2026",
      author: "Ban Chỉ huy PCTT Phường & TDP",
      thumbnail: "",
      featured: true,
      content: "Chủ tịch UBND thành phố Huế và UBND phường Hương Thủy đã ban hành chỉ đạo sẵn sàng 4 tại chỗ trong mùa mưa bão năm 2026. Ban cán bộ TDP Lương Hậu phân công các đồng chí trong lực lượng ANTT cơ sở trực 24/24 tại nhà SHCĐ (83 Thái Thuận), chuẩn bị đầy đủ bao cát, phao cứu sinh và số điện thoại cứu hộ khẩn cấp."
    },
    {
      slug: "ra-quan-chu-nhat-xanh-dot-4",
      title: "Tổ dân phố Lương Hậu ra quân 'Ngày Chủ nhật xanh' đợt 4/2026: Làm sạch 100% các kiệt ngõ",
      category: "Chủ nhật xanh",
      date: "13/09/2026",
      author: "Chi đoàn & Chi hội Phụ nữ",
      thumbnail: "",
      featured: false,
      content: "Sáng 13/09/2026, hơn 60 đoàn viên, hội viên và nhân dân đã đồng loạt tham gia tổng vệ sinh toàn tuyến đường Thái Thuận, phát quang bụi rậm và tuyên truyền phân loại rác tại nguồn theo tiêu chuẩn Đô thị thông minh Huế."
    },
    {
      slug: "tiem-chung-mo-rong-thang-9-2026",
      title: "Thông báo lịch tiêm chủng mở rộng định kỳ tháng 9/2026 tại Trạm Y tế Phường Hương Thủy KV3",
      category: "Y tế cộng đồng",
      date: "10/09/2026",
      author: "CTV Y tế Thu Thanh",
      thumbnail: "",
      featured: false,
      content: "Thời gian tiêm chủng diễn ra trong 2 ngày 23 và 24/09/2026. Kính mời các phụ huynh đưa trẻ em trong độ tuổi đến đúng giờ và mang theo sổ tiêm chủng cá nhân."
    }
  ];

  // Thông báo ban đầu
  const DEFAULT_THONG_BAO = [
    {
      slug: "tb-tiep-nhan-kien-nghi-cu-dan",
      title: "Thông báo tiếp nhận phản ánh, kiến nghị của công dân TDP Lương Hậu năm 2026",
      date: "12/09/2026",
      priority: "Khẩn",
      content: "Ban Cán bộ TDP duy trì lịch tiếp công dân tại Nhà SHCĐ vào các buổi tối thứ 3, thứ 5 và sáng thứ 7. Mọi thắc mắc về đất đai, cấp giấy chứng nhận theo Kế hoạch 333 đều được giải đáp trực tiếp."
    },
    {
      slug: "tb-dang-ky-sinh-hoat-doan-the",
      title: "Thông báo đăng ký tham gia các tổ chức đoàn thể và hoạt động khuyến học khuyến tài",
      date: "05/09/2026",
      priority: "Thường",
      content: "Các chi hội Phụ nữ, Cựu chiến binh, Người cao tuổi và Chi đoàn Lương Hậu tiếp tục tiếp nhận hội viên mới."
    }
  ];

  class Store {
    constructor() {
      this.data = this.load();
    }

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Đảm bảo đầy đủ các mảng
          return {
            news: parsed.news || DEFAULT_TIN_TUC,
            documents: parsed.documents || DEFAULT_VAN_BAN,
            notices: parsed.notices || DEFAULT_THONG_BAO,
            cadres: parsed.cadres || DEFAULT_CAN_BO,
            partyMembers: parsed.partyMembers || DEFAULT_DANG_VIEN,
            auditLogs: parsed.auditLogs || []
          };
        }
      } catch (e) {
        console.warn("Không thể tải cơ sở dữ liệu local, sử dụng mặc định:", e);
      }
      return {
        news: [...DEFAULT_TIN_TUC],
        documents: [...DEFAULT_VAN_BAN],
        notices: [...DEFAULT_THONG_BAO],
        cadres: [...DEFAULT_CAN_BO],
        partyMembers: [...DEFAULT_DANG_VIEN],
        auditLogs: [{ time: new Date().toLocaleString("vi-VN"), action: "Hệ thống khởi tạo thành công", user: "Hệ thống" }]
      };
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.error("Lỗi ghi bộ nhớ:", e);
      }
    }

    log(action, user = "Hệ thống") {
      this.data.auditLogs.unshift({
        time: new Date().toLocaleString("vi-VN"),
        action,
        user
      });
      if (this.data.auditLogs.length > 200) {
        this.data.auditLogs = this.data.auditLogs.slice(0, 200);
      }
      this.save();
    }

    // CRUD Tin Tức
    getNews() { return this.data.news; }
    getNewsBySlug(slug) { return this.data.news.find(n => n.slug === slug); }
    addNews(item, user) {
      item.slug = item.slug || ("tin-" + Date.now());
      this.data.news.unshift(item);
      this.log(`Tạo tin mới: ${item.title}`, user);
      this.save();
      return item;
    }
    updateNews(slug, updated, user) {
      const idx = this.data.news.findIndex(n => n.slug === slug);
      if (idx !== -1) {
        this.data.news[idx] = { ...this.data.news[idx], ...updated };
        this.log(`Cập nhật tin: ${this.data.news[idx].title}`, user);
        this.save();
        return true;
      }
      return false;
    }
    deleteNews(slug, user) {
      const target = this.getNewsBySlug(slug);
      this.data.news = this.data.news.filter(n => n.slug !== slug);
      this.log(`Xóa tin: ${target ? target.title : slug}`, user);
      this.save();
    }

    // CRUD Văn Bản
    getDocuments() { return this.data.documents; }
    getDocumentById(id) { return this.data.documents.find(d => d.id === id); }
    addDocument(doc, user) {
      doc.id = doc.id || ("VB-" + Date.now());
      this.data.documents.unshift(doc);
      this.log(`Thêm văn bản: ${doc.code} - ${doc.title}`, user);
      this.save();
      return doc;
    }
    deleteDocument(id, user) {
      const target = this.getDocumentById(id);
      this.data.documents = this.data.documents.filter(d => d.id !== id);
      this.log(`Xóa văn bản: ${target ? target.code : id}`, user);
      this.save();
    }

    // CRUD Thông Báo
    getNotices() { return this.data.notices; }
    getNoticeBySlug(slug) { return this.data.notices.find(n => n.slug === slug); }
    addNotice(n, user) {
      n.slug = n.slug || ("tb-" + Date.now());
      this.data.notices.unshift(n);
      this.log(`Tạo thông báo: ${n.title}`, user);
      this.save();
      return n;
    }
    deleteNotice(slug, user) {
      this.data.notices = this.data.notices.filter(n => n.slug !== slug);
      this.log(`Xóa thông báo: ${slug}`, user);
      this.save();
    }

    // Đảng viên & Cán bộ
    getPartyMembers() { return this.data.partyMembers; }
    getCadres() { return this.data.cadres; }
    getAuditLogs() { return this.data.auditLogs; }

    // Tìm kiếm thông minh tổng hợp
    searchAll(keyword) {
      if (!keyword || !keyword.trim()) return { news: [], documents: [], notices: [] };
      const q = keyword.toLowerCase().trim();
      return {
        news: this.data.news.filter(n => (n.title && n.title.toLowerCase().includes(q)) || (n.content && n.content.toLowerCase().includes(q))),
        documents: this.data.documents.filter(d => (d.title && d.title.toLowerCase().includes(q)) || (d.code && d.code.toLowerCase().includes(q)) || (d.agency && d.agency.toLowerCase().includes(q))),
        notices: this.data.notices.filter(t => (t.title && t.title.toLowerCase().includes(q)) || (t.content && t.content.toLowerCase().includes(q)))
      };
    }
  }

  return new Store();
});
