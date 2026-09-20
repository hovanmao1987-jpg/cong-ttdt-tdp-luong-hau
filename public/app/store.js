/**
 * CỔNG THÔNG TIN SỐ LƯƠNG HẬU - DATA STORE ENGINE
 * Dữ liệu chuẩn xác 100% từ hồ sơ thực tế Chi bộ & Tổ dân phố Lương Hậu
 * Loại bỏ hoàn toàn các thông tin tự bịa, giả định.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.LHStore = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const STORAGE_KEY = "luong_hau_db_v5_clean";

  // 1. Danh sách 10 Cán bộ chủ chốt TDP Lương Hậu (Chuẩn xác 100% từ Ds_Can_bộ_Luong_Hau_V2.xlsx)
  const DEFAULT_CAN_BO = [
    {
      stt: 1,
      name: "Hồ Văn Mão",
      year: "1989",
      role: "Bí thư Chi bộ",
      phone: "0962.481.112",
      area: "Phụ trách chung & Khu vực Đội 11",
      group: "Cấp ủy Chi bộ",
      duty: "Lãnh đạo toàn diện Chi bộ; Công tác xây dựng Đảng; Kiểm tra, giám sát; Quản lý đảng viên; Phụ trách Đội 11.",
      progress: 0.9,
      status: "Đang thực hiện",
      evaluation: "Xuất sắc",
      deliverable: "Nghị quyết Chi bộ tháng; Biên bản họp Chi bộ; Hồ sơ kiểm tra giám sát Đảng",
      note: "Hoàn thành xuất sắc nhiệm vụ lãnh đạo chung"
    },
    {
      stt: 2,
      name: "Nguyễn Trọng Nghĩa",
      year: "1980",
      role: "Phó Bí thư Chi bộ • Tổ trưởng TDP",
      phone: "0965.712.812",
      area: "Chính quyền TDP & Khu vực Đội 8",
      group: "Cấp ủy Chi bộ",
      duty: "Làm Thư ký các kỳ họp Chi bộ; Thể chế hóa Nghị quyết thành kế hoạch quản lý TDP; Quản lý chính quyền, KT-XH, trật tự đô thị; PCTT-TKCN; Thu các loại quỹ; Phụ trách Đội 8.",
      progress: 0.85,
      status: "Đang thực hiện",
      evaluation: "Tốt",
      deliverable: "Biên bản họp Chi bộ; Số liệu thu nộp các loại quỹ; Báo cáo KT-XH tháng",
      note: "Đang tập trung thu các loại quỹ và PCTT"
    },
    {
      stt: 3,
      name: "Hoàng Hữu Rớt",
      year: "1978",
      role: "Chi ủy viên • Trưởng Ban CTMT",
      phone: "0965.943.303",
      area: "Khối Mặt trận, Dân vận & Khu vực Đội 9",
      group: "Cấp ủy Chi bộ",
      duty: "Mặt trận, Dân vận, Đại đoàn kết; Hòa giải cơ sở; Tuyên truyền nếp sống văn minh; Nắm chắc diễn biến tư tưởng, dư luận nhân dân; Phụ trách Đội 9.",
      progress: 0.9,
      status: "Đang thực hiện",
      evaluation: "Xuất sắc",
      deliverable: "Biên bản hòa giải cơ sở; Báo cáo công tác Mặt trận; Báo cáo dư luận nhân dân",
      note: "Hoàn thành tốt công tác dân vận và hòa giải"
    },
    {
      stt: 4,
      name: "Nguyễn Thị Mừng",
      year: "1979",
      role: "Chi hội trưởng Phụ nữ (Chi ủy viên)",
      phone: "0377.412.815",
      area: "Hội Phụ nữ & Khu vực Đội 9",
      group: "Cán bộ đoàn thể",
      duty: "Trực tiếp đôn đốc, thu nộp đảng phí đầy đủ của 22 đảng viên; Triển khai phong trào Gia đình 5 không 3 sạch; Quản lý tuyến đường tự quản phụ nữ; Phân loại rác thải tại nguồn; Phụ trách Đội 9.",
      progress: 0.9,
      status: "Đang thực hiện",
      evaluation: "Xuất sắc",
      deliverable: "Danh sách & Biên lai thu đảng phí; Kết quả phong trào 5 không 3 sạch; Báo cáo tháng",
      note: "100% đảng phí thu đúng kỳ hạn"
    },
    {
      stt: 5,
      name: "Nguyễn Thúc Thành",
      year: "1970",
      role: "Chi hội trưởng Nông dân • Tổ trưởng LL ANTT cơ sở",
      phone: "0975.175.361",
      area: "Nông dân, ANTT cơ sở toàn TDP",
      group: "Lực lượng ANTT",
      duty: "Kinh tế nông nghiệp; Phối hợp Công an phường tuần tra đêm (4-6 lượt/tháng); Kiểm tra tạm trú, các cơ sở cho thuê trọ; PCCC các tổ liên gia; Kịp thời xử lý các vụ việc mất ANTT.",
      progress: 0.85,
      status: "Đang thực hiện",
      evaluation: "Tốt",
      deliverable: "Sổ nhật ký tuần tra đêm; Báo cáo an ninh trật tự; Báo cáo sản xuất nông nghiệp",
      note: "Duy trì tuần tra đêm nghiêm túc 4 lượt/tháng"
    },
    {
      stt: 6,
      name: "Nguyễn Cưỡng",
      year: "1964",
      role: "Chi hội trưởng Cựu chiến binh",
      phone: "0981.710.242",
      area: "Hội Cựu chiến binh toàn TDP",
      group: "Cán bộ đoàn thể",
      duty: "Giáo dục truyền thống cách mạng; Phát huy phẩm chất Bộ đội Cụ Hồ; Phối hợp lực lượng ANTT cơ sở tham gia tuần tra cao điểm; Động viên thanh niên thực hiện NVQS; Thăm hỏi hội viên.",
      progress: 0.85,
      status: "Đang thực hiện",
      evaluation: "Tốt",
      deliverable: "Báo cáo công tác chi hội CCB; Danh sách thăm hỏi hội viên; Kết quả phối hợp ANTT",
      note: "Hội viên gương mẫu, tham gia tốt tuần tra"
    },
    {
      stt: 7,
      name: "Phan Đăng Chiến",
      year: "1951",
      role: "Chi hội trưởng Người cao tuổi",
      phone: "0913.469.434",
      area: "Hội Người cao tuổi, Khuyến học toàn TDP",
      group: "Cán bộ đoàn thể",
      duty: "Phong trào Tuổi cao - Gương sáng; Vận động con cháu chấp hành pháp luật; Lập danh sách chúc thọ, mừng thọ; Phối hợp Khuyến học TDP; Tham gia tổ hòa giải cơ sở.",
      progress: 0.9,
      status: "Đang thực hiện",
      evaluation: "Xuất sắc",
      deliverable: "Danh sách mừng thọ và thăm hỏi NCT; Báo cáo hoạt động chi hội Người cao tuổi",
      note: "Phát huy uy tín người cao tuổi trong khu dân cư"
    },
    {
      stt: 8,
      name: "Nguyễn Thị Ngọc Tú",
      year: "2003",
      role: "Bí thư Chi đoàn Thanh niên",
      phone: "0386.003.175",
      area: "Đoàn Thanh niên, Tổ CNSCĐ toàn TDP",
      group: "Cán bộ trẻ",
      duty: "Nòng cốt phong trào Ngày Chủ nhật xanh (tuyến Thái Thuận, Thái Vĩnh Chinh); Đội hình Tổ CNSCĐ hướng dẫn VNeID mức 2, DVC trực tuyến, Hue-S; Quản trị thông tin Cổng TT TDP (luong-hau.vercel.app); Hoạt động thanh thiếu nhi.",
      progress: 0.9,
      status: "Đang thực hiện",
      evaluation: "Xuất sắc",
      deliverable: "Số lượt/hình ảnh Ngày Chủ nhật xanh; Số lượt hỗ trợ người dân VNeID; Tin bài Cổng TT",
      note: "Tích cực xung kích Chuyển đổi số và Chủ nhật xanh"
    },
    {
      stt: 9,
      name: "Nguyễn Như Khải",
      year: "1993",
      role: "Tổ đội trưởng Quân sự",
      phone: "0388.886.876",
      area: "Quân sự quốc phòng & Khu vực Đội 10",
      group: "Quân sự địa phương",
      duty: "Quốc phòng - Quân sự địa phương; Nắm chắc thực lực, biến động của 74 thanh niên nguồn NVQS 2027; Rà soát tuổi 17; Trực sẵn sàng chiến đấu, PCTT-TKCN; Phụ trách địa bàn Đội 10.",
      progress: 0.8,
      status: "Đang thực hiện",
      evaluation: "Tốt",
      deliverable: "Sổ theo dõi 74 nguồn NVQS biến động; Quân số dân quân trực SSCĐ; Báo cáo quốc phòng",
      note: "Đang rà soát chặt chẽ danh sách nguồn NVQS 2027"
    },
    {
      stt: 10,
      name: "Phạm Thị Thu Thanh",
      year: "1987",
      role: "Cộng tác viên Dân số - Y tế",
      phone: "0332.886.309",
      area: "Dân số, Y tế 4 Đội (8, 9, 10, 11)",
      group: "Cán bộ chuyên trách",
      duty: "Thu thập, cập nhật đầy đủ biến động dân số vào Sổ A0; Tuyên truyền KHHGĐ, chăm sóc sức khỏe sinh sản; Vận động nhân dân tham gia BHYT đạt >98%; Phối hợp Trạm Y tế giám sát phòng dịch theo mùa; Tiêm chủng mở rộng.",
      progress: 0.85,
      status: "Đang thực hiện",
      evaluation: "Tốt",
      deliverable: "Phiếu thu thập biến động dân số (Sổ A0); Tỷ lệ tham gia BHYT; Báo cáo gửi Trạm Y tế",
      note: "Nắm chắc biến động dân số và phòng dịch mùa hè"
    }
  ];

  // 2. Danh sách chuẩn xác 100% 22 Đảng viên Chi bộ Lương Hậu (từ Sổ tay ĐVĐT)
  const DEFAULT_DANG_VIEN = [
    {
        "stt": 1,
        "name": "NGÔ THỊ HOÀI CẨM",
        "dob": "24/09/1989",
        "gender": "Nữ",
        "join_date": "25/05/2012",
        "official_date": "25/05/2013",
        "party_card": "46189014598",
        "phone": "0374323089",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 10"
    },
    {
        "stt": 2,
        "name": "NGUYỄN VĂN QUÂN",
        "dob": "01/01/1999",
        "gender": "Nam",
        "join_date": "22/12/2021",
        "official_date": "22/12/2022",
        "party_card": "46099000890",
        "phone": "0345458799",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 11"
    },
    {
        "stt": 3,
        "name": "NGUYỄN THỊ THUỶ",
        "dob": "12/09/1987",
        "gender": "Nữ",
        "join_date": "20/07/2009",
        "official_date": "20/07/2010",
        "party_card": "46187001860",
        "phone": "0986658502",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 9"
    },
    {
        "stt": 4,
        "name": "PHẠM QUANG",
        "dob": "19/12/1981",
        "gender": "Nam",
        "join_date": "28/08/2012",
        "official_date": "28/08/2013",
        "party_card": "46081007311",
        "phone": "0914464097",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 9"
    },
    {
        "stt": 5,
        "name": "LÊ THỊ THU THUỶ",
        "dob": "30/04/1988",
        "gender": "Nữ",
        "join_date": "19/11/2010",
        "official_date": "19/11/2011",
        "party_card": "46188014858",
        "phone": "0912721759",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 8"
    },
    {
        "stt": 6,
        "name": "HỒ VĂN MÃO",
        "dob": "02/02/1989",
        "gender": "Nam",
        "join_date": "22/09/2009",
        "official_date": "22/09/2010",
        "party_card": "46089001459",
        "phone": "0962481112",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 11 (Bí thư Chi bộ)"
    },
    {
        "stt": 7,
        "name": "PHẠM SẰNG",
        "dob": "02/02/1956",
        "gender": "Nam",
        "join_date": "25/01/1995",
        "official_date": "25/01/1996",
        "party_card": "46056006617",
        "phone": "0372500460",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 10"
    },
    {
        "stt": 8,
        "name": "NGUYỄN CẦN",
        "dob": "12/08/1972",
        "gender": "Nam",
        "join_date": "05/01/1997",
        "official_date": "05/01/1998",
        "party_card": "46072002290",
        "phone": "0946580955",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 9"
    },
    {
        "stt": 9,
        "name": "LÊ THỊ BÍCH HẠNH",
        "dob": "20/04/1994",
        "gender": "Nữ",
        "join_date": "06/10/2015",
        "official_date": "15/09/2016",
        "party_card": "60194002431",
        "phone": "0358852534",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 9"
    },
    {
        "stt": 10,
        "name": "NGUYỄN TRỌNG NGHĨA",
        "dob": "17/05/1980",
        "gender": "Nam",
        "join_date": "25/09/2012",
        "official_date": "25/09/2013",
        "party_card": "44080001067",
        "phone": "0965712812",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 8 (Phó Bí thư, Tổ trưởng TDP)"
    },
    {
        "stt": 11,
        "name": "PHẠM PHƯỚC THÀNH",
        "dob": "10/01/1975",
        "gender": "Nam",
        "join_date": "19/02/2006",
        "official_date": "19/02/2007",
        "party_card": "46075015141",
        "phone": "0345309179",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 11"
    },
    {
        "stt": 12,
        "name": "HỒ CÔNG LONG",
        "dob": "23/09/1994",
        "gender": "Nam",
        "join_date": "20/12/2019",
        "official_date": "20/12/2020",
        "party_card": "46094006325",
        "phone": "Đang cập nhật",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 10"
    },
    {
        "stt": 13,
        "name": "NGUYỄN THỊ MỪNG",
        "dob": "26/10/1979",
        "gender": "Nữ",
        "join_date": "20/11/2017",
        "official_date": "20/11/2018",
        "party_card": "46179001869",
        "phone": "0377412815",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 9 (Chi ủy viên, Chi hội PN)"
    },
    {
        "stt": 14,
        "name": "HOÀNG ĐÌNH CƯỜNG",
        "dob": "10/04/1991",
        "gender": "Nam",
        "join_date": "22/10/2015",
        "official_date": "22/10/2016",
        "party_card": "46091003967",
        "phone": "0935567976",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 10"
    },
    {
        "stt": 15,
        "name": "PHẠM THỊ LƯỠNG",
        "dob": "23/07/1986",
        "gender": "Nữ",
        "join_date": "02/09/2011",
        "official_date": "02/09/2012",
        "party_card": "46186011205",
        "phone": "0988212249",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 9"
    },
    {
        "stt": 16,
        "name": "HOÀNG HỮU RỚT",
        "dob": "23/08/1978",
        "gender": "Nam",
        "join_date": "26/07/2001",
        "official_date": "26/07/2002",
        "party_card": "46078013592",
        "phone": "0965943303",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 9 (Chi ủy viên, Trưởng ban CTMT)"
    },
    {
        "stt": 17,
        "name": "NGUYỄN THỊ HUÊ",
        "dob": "10/10/1956",
        "gender": "Nữ",
        "join_date": "11/12/1983",
        "official_date": "11/06/1985",
        "party_card": "46156005328",
        "phone": "Đang cập nhật",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 9"
    },
    {
        "stt": 18,
        "name": "NGUYỄN THÚC THÔNG",
        "dob": "28/01/1995",
        "gender": "Nam",
        "join_date": "02/10/2018",
        "official_date": "02/10/2019",
        "party_card": "46095016952",
        "phone": "Đang cập nhật",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 8"
    },
    {
        "stt": 19,
        "name": "LÊ THỊ THÙY DUNG",
        "dob": "20/02/1990",
        "gender": "Nữ",
        "join_date": "02/09/2013",
        "official_date": "02/09/2014",
        "party_card": "46190010102",
        "phone": "0774941236",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 10"
    },
    {
        "stt": 20,
        "name": "NGUYỄN QUANG NGỌC",
        "dob": "28/07/1987",
        "gender": "Nam",
        "join_date": "08/12/2008",
        "official_date": "08/12/2009",
        "party_card": "46087017332",
        "phone": "0972667112",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 9"
    },
    {
        "stt": 21,
        "name": "NGUYỄN NHƯ KHẢ",
        "dob": "20/08/1981",
        "gender": "Nam",
        "join_date": "07/06/2004",
        "official_date": "07/06/2005",
        "party_card": "46081012133",
        "phone": "0935022236",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 10"
    },
    {
        "stt": 22,
        "name": "PHẠM TIẾN",
        "dob": "29/12/1986",
        "gender": "Nam",
        "join_date": "14/10/2014",
        "official_date": "14/10/2015",
        "party_card": "46086014967",
        "phone": "0915302502",
        "status": "Sinh hoạt thường xuyên",
        "area": "Đội 9"
    }
];

  // 3. Bảng phân công Đảng viên phụ trách 4 Đội (Nhiệm kỳ 2025-2030)
  const DEFAULT_PHAN_CONG_DOI = [
    {
      doi: "Đội 8",
      leader: "Nguyễn Trọng Nghĩa (Phó Bí thư Chi bộ, Tổ trưởng TDP)",
      members: [
        { name: "Nguyễn Trọng Nghĩa", role: "Cấp ủy viên phụ trách chung Đội 8", progress: 0.9, evaluation: "Tốt" },
        { name: "Nguyễn Thúc Thông", role: "Đảng viên phụ trách, nắm bắt tâm tư nhân dân", progress: 0.8, evaluation: "Tốt" },
        { name: "Lê Thị Thu Thủy", role: "Đảng viên phụ trách, phong trào phụ nữ Đội 8", progress: 0.7, evaluation: "Đạt yêu cầu" }
      ]
    },
    {
      doi: "Đội 9",
      leader: "Hoàng Hữu Rớt (Chi ủy viên, Trưởng ban CTMT) & Nguyễn Thị Mừng (Chi ủy viên)",
      members: [
        { name: "Hoàng Hữu Rớt", role: "Chi ủy viên phụ trách chung Đội 9, Mặt trận & Dân vận", progress: 0.9, evaluation: "Tốt" },
        { name: "Nguyễn Thị Mừng", role: "Chi ủy viên phụ trách phong trào phụ nữ & môi trường", progress: 0.8, evaluation: "Tốt" },
        { name: "Lê Thị Bích Hạnh", role: "Đảng viên phụ trách phong trào", progress: 0.75, evaluation: "Đạt yêu cầu" },
        { name: "Nguyễn Quang Ngọc", role: "Đảng viên phụ trách an ninh kiệt ngõ", progress: 0.65, evaluation: "Đạt yêu cầu" },
        { name: "Phạm Quang", role: "Đảng viên phụ trách nếp sống văn minh", progress: 0.7, evaluation: "Đạt yêu cầu" },
        { name: "Nguyễn Cần", role: "Đảng viên phụ trách đời sống nhân dân", progress: 0.5, evaluation: "Chưa đạt" },
        { name: "Phạm Thị Lưỡng", role: "Đảng viên phụ trách công tác xã hội", progress: 0.7, evaluation: "Đạt yêu cầu" },
        { name: "Nguyễn Thị Huê", role: "Đảng viên phụ trách công tác khuyến học", progress: 0.8, evaluation: "Tốt" },
        { name: "Phạm Tiến", role: "Đảng viên phụ trách tự quản", progress: 0.6, evaluation: "Đạt yêu cầu" },
        { name: "Nguyễn Thị Thủy", role: "Đảng viên phụ trách hội viên", progress: 0.75, evaluation: "Đạt yêu cầu" }
      ]
    },
    {
      doi: "Đội 10",
      leader: "Nguyễn Như Khải (Tổ đội trưởng Quân sự)",
      members: [
        { name: "Nguyễn Như Khải", role: "Phụ trách quân sự, ANTT và địa bàn Đội 10", progress: 0.8, evaluation: "Tốt" },
        { name: "Nguyễn Như Khả", role: "Đảng viên phụ trách hỗ trợ dân sinh", progress: 0.8, evaluation: "Tốt" },
        { name: "Phạm Sằng", role: "Đảng viên phụ trách công tác hòa giải cơ sở", progress: 0.7, evaluation: "Đạt yêu cầu" },
        { name: "Hồ Công Long", role: "Đảng viên phụ trách phong trào thanh niên", progress: 0.65, evaluation: "Đạt yêu cầu" },
        { name: "Ngô Thị Hoài Cẩm", role: "Đảng viên phụ trách môi trường và gia đình", progress: 0.75, evaluation: "Đạt yêu cầu" },
        { name: "Lê Thị Thùy Dung", role: "Đảng viên phụ trách y tế, dân số", progress: 0.7, evaluation: "Đạt yêu cầu" },
        { name: "Hoàng Đình Cường", role: "Đảng viên phụ trách", progress: 0.55, evaluation: "Chưa đạt" }
      ]
    },
    {
      doi: "Đội 11",
      leader: "Hồ Văn Mão (Bí thư Chi bộ)",
      members: [
        { name: "Hồ Văn Mão", role: "Bí thư Chi bộ, lãnh đạo toàn diện & trực tiếp phụ trách Đội 11", progress: 1.0, evaluation: "Xuất sắc" },
        { name: "Nguyễn Văn Quân", role: "Đảng viên phụ trách công tác thanh niên, ứng dụng số", progress: 0.8, evaluation: "Tốt" },
        { name: "Phạm Phước Thành", role: "Đảng viên phụ trách nếp sống văn minh đô thị", progress: 0.75, evaluation: "Đạt yêu cầu" }
      ]
    }
  ];

  // 4. Chu trình 4 tuần theo dõi tiến độ công việc TDP Lương Hậu
  const DEFAULT_LICH_4_TUAN = [
    {
      phase: "TUẦN 1: Họp Định Kỳ & Triển Khai",
      time: "Ngày 01 – 07 hằng tháng (Trọng tâm ngày 01-03)",
      tasks: [
        "Chi ủy hội ý chuẩn bị nội dung và dự thảo Nghị quyết lãnh đạo tháng.",
        "Sinh hoạt Chi bộ định kỳ ngày 03 theo Chỉ thị 50-CT/TW, điểm danh Sổ tay ĐVĐT.",
        "Giao ban Ban điều hành TDP mở rộng, phân công nhiệm vụ cụ thể cho 10 cán bộ theo '6 rõ'.",
        "Thu nộp đảng phí tháng; Ban CHQS & ANTT cơ sở thống nhất lịch tuần tra đêm."
      ],
      leads: "Hồ Văn Mão (Bí thư Chi bộ), Nguyễn Trọng Nghĩa (Tổ trưởng TDP)",
      deliverable: "Nghị quyết Chi bộ tháng; Biên bản họp Chi bộ; Lịch công tác tháng TDP; Danh sách thu đảng phí"
    },
    {
      phase: "TUẦN 2: Cao Điểm Phong Trào & Trật Tự",
      time: "Ngày 08 – 14 hằng tháng (Trọng tâm ngày Chủ nhật)",
      tasks: [
        "Ra quân đợt 1 phong trào 'Ngày Chủ nhật xanh' (tuyến Thái Thuận, Thái Vĩnh Chinh).",
        "Đội hình Chuyển đổi số cộng đồng trực hướng dẫn kích hoạt VNeID, dịch vụ công trực tuyến, Hue-S.",
        "Đôn đốc vận động nhân dân đóng nộp các loại quỹ theo chỉ tiêu giao.",
        "Tuần tra ban đêm kiểm soát tạm trú tạm vắng, nhà trọ và phòng ngừa trộm cắp."
      ],
      leads: "Nguyễn Thị Ngọc Tú (Đoàn TN), Nguyễn Thúc Thành (ANTT cơ sở)",
      deliverable: "Hình ảnh/Bản tin Ngày Chủ nhật xanh; Nhật ký tuần tra đêm đợt 1; Tiến độ các loại quỹ"
    },
    {
      phase: "TUẦN 3: An Sinh, Môi Trường & Địa Bàn",
      time: "Ngày 15 – 21 hằng tháng",
      tasks: [
        "Kiểm tra công tác phân loại rác thải tại nguồn, xử lý dứt điểm điểm tập kết rác sai giờ.",
        "Rà soát biến động thực lực 74 thanh niên trong nguồn sẵn sàng nhập ngũ năm 2027.",
        "Nắm bắt tư tưởng, nguyện vọng nhân dân; tiến hành hòa giải mâu thuẫn cơ sở (nếu có).",
        "Phối hợp Trạm Y tế giám sát dịch sốt xuất huyết, tay chân miệng, tiêm chủng mở rộng."
      ],
      leads: "Nguyễn Thị Mừng (Chi hội PN), Nguyễn Như Khải (Quân sự), Hoàng Hữu Rớt (Trưởng ban CTMT)",
      deliverable: "Biên bản hòa giải (nếu có); Danh sách biến động nguồn NVQS; Báo cáo phòng chống dịch bệnh"
    },
    {
      phase: "TUẦN 4: Kiểm Tra, Đánh Giá & Báo Cáo",
      time: "Ngày 22 – cuối tháng (Trọng tâm ngày 25-28)",
      tasks: [
        "Hoàn tất số liệu báo cáo biến động dân số gửi Trạm Y tế phường (trước ngày 25).",
        "Hoàn thành nộp đảng phí lên Đảng ủy phường; rà soát thu quỹ TDP.",
        "Các chi hội, bộ phận nộp báo cáo kết quả công tác tháng cho Bí thư và Tổ trưởng TDP.",
        "Chi ủy họp đánh giá tỷ lệ hoàn thành theo '6 rõ', chuẩn bị tài liệu sinh hoạt tháng sau."
      ],
      leads: "Hồ Văn Mão (Bí thư Chi bộ), Nguyễn Trọng Nghĩa (Tổ trưởng TDP)",
      deliverable: "Báo cáo tổng kết công tác tháng; Báo cáo Đảng gửi Đảng ủy; Báo cáo KT-XH gửi UBND phường"
    }
  ];

  // 5. Chức năng điểm danh sinh hoạt Chi bộ định kỳ
  const DEFAULT_DIEM_DANH = {
    sessionTitle: "SINH HOẠT CHI BỘ ĐỊNH KỲ THÁNG 09/2026",
    sessionTime: "19h00, Ngày 03 tháng 09 năm 2026",
    sessionLocation: "Nhà Sinh hoạt Cộng đồng Tổ dân phố Lương Hậu (Số 83 Thái Thuận)",
    totalSummoned: 22,
    records: DEFAULT_DANG_VIEN.map((m, idx) => ({
      stt: m.stt,
      name: m.name,
      partyCard: m.party_card,
      area: m.area,
      status: (idx === 6 || idx === 16) ? "Vắng có phép" : "Có mặt",
      reason: (idx === 6 || idx === 16) ? "Miễn sinh hoạt do tuổi cao sức yếu" : ""
    }))
  };

  // 6. Kho nguồn văn bản chính thống tích hợp
  const DEFAULT_NGUON_CHINH_THONG = [
    {
      id: "src-vbpl",
      name: "Cơ sở dữ liệu Quốc gia về Văn bản Pháp luật",
      org: "Bộ Tư pháp",
      url: "https://vbpl.vn",
      desc: "Tra cứu văn bản quy phạm pháp luật của Quốc hội, Chính phủ, các Bộ ngành và địa phương miễn phí, chính thống."
    },
    {
      id: "src-chinhphu",
      name: "Cổng Thông tin Điện tử Chính phủ - Hệ thống Văn bản",
      org: "Văn phòng Chính phủ",
      url: "https://vanban.chinhphu.vn",
      desc: "Tra cứu Nghị quyết, Nghị định, Quyết định chỉ đạo điều hành của Thủ tướng và Chính phủ kèm tệp đính kèm."
    },
    {
      id: "src-dang",
      name: "Hệ thống Văn kiện - Văn bản của Đảng",
      org: "Báo điện tử Đảng Cộng sản Việt Nam",
      url: "https://tulieuvankien.dangcongsan.vn/he-thong-van-ban/van-ban-cua-dang",
      desc: "Tra cứu Điều lệ Đảng, Nghị quyết BCH Trung ương, Bộ Chính trị, Ban Bí thư và các chỉ thị Đảng."
    },
    {
      id: "src-dvc",
      name: "Cổng Dịch vụ công Quốc gia",
      org: "Văn phòng Chính phủ",
      url: "https://vpcp.dichvucong.gov.vn",
      desc: "Nộp hồ sơ trực tuyến về cư trú, căn cước, đất đai, hộ tịch, bảo hiểm y tế tại cấp phường/xã."
    },
    {
      id: "src-huongthuy",
      name: "Trang Thông tin Điện tử Phường Hương Thủy",
      org: "UBND Phường Hương Thủy, TP Huế",
      url: "https://huongthuy.hue.gov.vn",
      desc: "Cập nhật tin tức chính quyền phường, lịch tiếp dân, chỉ đạo điều hành và thông báo địa phương Lương Hậu."
    }
  ];

  // 7. Kho Văn bản & Biểu mẫu Tổ dân phố
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
      summary: "Kế hoạch rà soát hồ sơ địa chính, đo đạc lập bản đồ và cấp đổi giấy chứng nhận QSDĐ đồng loạt tại các tổ dân phố, trong đó có TDP Lương Hậu."
    },
    {
      id: "VB-333-PL3",
      code: "PL3-KH-333",
      title: "Phụ lục 3: Danh mục các thửa đất đủ điều kiện cấp đổi GCN theo Kế hoạch 333/KH-UBND",
      agency: "Phòng TN&MT TP Huế • UBND Phường Hương Thủy",
      date: "15/08/2026",
      level: "THÀNH PHỐ HUẾ",
      type: "Phụ lục",
      category: "Đất đai - Địa chính",
      pdfUrl: "/documents/ke-hoach-333-phu-luc-3.pdf",
      source: "UBND Phường Hương Thủy",
      summary: "Bảng kê chi tiết số tờ bản đồ, số thửa và danh sách chủ sử dụng đất khu vực Lương Hậu phục vụ đối chiếu thực địa."
    },
    {
      id: "VB-333-PL4",
      code: "PL4-KH-333",
      title: "Phụ lục 4: Quy trình và biểu mẫu kê khai biến động đất đai Kế hoạch 333",
      agency: "UBND Phường Hương Thủy",
      date: "15/08/2026",
      level: "PHƯỜNG HƯƠNG THỦY",
      type: "Biểu mẫu",
      category: "Đất đai - Địa chính",
      pdfUrl: "/documents/ke-hoach-333-phu-luc-4.pdf",
      source: "UBND Phường Hương Thủy",
      summary: "Mẫu biểu kê khai nguồn gốc đất, ranh giới và xác nhận hiện trạng sử dụng đất không có tranh chấp tại tổ dân phố."
    },
    {
      id: "VB-333-PL5",
      code: "PL5-KH-333",
      title: "Phụ lục 5: Lịch tiếp nhận và hướng dẫn kê khai hồ sơ đất đai tại Nhà SHCĐ Lương Hậu",
      agency: "UBND Phường Hương Thủy • Ban Điều hành TDP",
      date: "18/08/2026",
      level: "PHƯỜNG HƯƠNG THỦY",
      type: "Lịch công tác",
      category: "Đất đai - Địa chính",
      pdfUrl: "/documents/ke-hoach-333-phu-luc-5.pdf",
      source: "Ban Điều hành TDP Lương Hậu",
      summary: "Phân công cán bộ địa chính phường phối hợp Ban cán sự TDP hướng dẫn người dân kê khai trực tiếp vào các buổi tối thứ 3 và sáng thứ 7."
    },
    {
      id: "BM-01-CU-TRU",
      code: "BM-TDP-01",
      title: "Giấy đề nghị xác nhận thông tin cư trú và quan hệ thân nhân tại Tổ dân phố Lương Hậu",
      agency: "Ban Điều hành Tổ dân phố Lương Hậu",
      date: "03/09/2026",
      level: "TỔ DÂN PHỐ",
      type: "Biểu mẫu",
      category: "Thủ tục hành chính",
      pdfUrl: "/documents/BM-TDP-01-Xac-Nhan-Cu-Tru.pdf",
      source: "Ban Điều hành TDP",
      summary: "Mẫu biểu chuẩn để người dân tải về, kê khai xin xác nhận thực tế cư trú phục vụ làm thủ tục học tập, bảo hiểm, trợ cấp xã hội."
    },
    {
      id: "VB-45-NQ-CP",
      code: "45/2026/NQ-CP",
      title: "Nghị quyết của Chính phủ về phát triển ứng dụng dữ liệu dân cư, định danh và xác thực điện tử Đề án 06",
      agency: "Chính phủ",
      date: "10/01/2026",
      level: "TRUNG ƯƠNG",
      type: "Nghị quyết",
      category: "Chuyển đổi số",
      pdfUrl: "https://vanban.chinhphu.vn",
      source: "Cổng TTĐT Chính phủ",
      summary: "Đẩy mạnh sử dụng VNeID mức 2 thay thế giấy tờ truyền thống trong giải quyết thủ tục hành chính cơ sở."
    },
    {
      id: "VB-14-TB-TDP",
      code: "14/TB-TDP",
      title: "Thông báo số 14/TB-TDP về ra quân tổng vệ sinh 'Ngày Chủ nhật xanh' và phân loại rác thải tại nguồn",
      agency: "Chi bộ & Ban Điều hành TDP Lương Hậu",
      date: "10/09/2026",
      level: "PHƯỜNG HƯƠNG THỦY",
      type: "Thông báo",
      category: "Môi trường",
      pdfUrl: "/documents/BM-TDP-01-Xac-Nhan-Cu-Tru.pdf",
      source: "Ban Điều hành TDP",
      summary: "Huy động nhân dân tuyến đường Thái Thuận, Thái Vĩnh Chinh và 4 Đội tổng vệ sinh, khơi thông dòng chảy đón mùa mưa lũ."
    }
  ];

  // 8. Tin tức thực tế Lương Hậu
  const DEFAULT_TIN_TUC = [
    {
      slug: "trien-khai-ke-hoach-333-dat-dai",
      title: "Tổ dân phố Lương Hậu triển khai Kế hoạch 333/KH-UBND của UBND TP Huế về đo đạc, cấp đổi GCN đất đai",
      category: "Địa chính - Đất đai",
      date: "15/09/2026",
      author: "Tổ trưởng TDP Nguyễn Trọng Nghĩa",
      thumbnail: "",
      featured: true,
      content: "Thực hiện Kế hoạch 333/KH-UBND của UBND Thành phố Huế, Ban điều hành Tổ dân phố Lương Hậu phối hợp cùng Tổ công tác địa chính phường Hương Thủy tiến hành rà soát hiện trạng sử dụng đất của các hộ gia đình dọc tuyến đường Thái Thuận, Thái Vĩnh Chinh và 4 cụm Đội dân cư. Đề nghị các hộ dân chuẩn bị sẵn bản sao giấy tờ pháp lý để đối chiếu và kê khai tại Nhà SHCĐ theo lịch hẹn."
    },
    {
      slug: "ra-quan-chu-nhat-xanh-thai-thuan",
      title: "Chi đoàn Thanh niên & Chi hội Phụ nữ Lương Hậu ra quân 'Ngày Chủ nhật xanh' tuyến đường Thái Thuận",
      category: "Môi trường",
      date: "13/09/2026",
      author: "Bí thư Chi đoàn Nguyễn Thị Ngọc Tú",
      thumbnail: "",
      featured: false,
      content: "Sáng Chủ nhật 13/09/2026, các lực lượng đoàn viên, hội viên phụ nữ và bà con nhân dân Đội 8, 9, 10, 11 đã đồng loạt tổng vệ sinh phát quang bụi rậm, khơi thông cống rãnh các tuyến kiệt ngõ và tuyên truyền phân loại rác thải tại nguồn, chuẩn bị sẵn sàng trước mùa mưa lũ."
    },
    {
      slug: "to-cnscd-huong-dan-vneid",
      title: "Tổ Chuyển đổi số cộng đồng TDP Lương Hậu hỗ trợ nhân dân kích hoạt tài khoản định danh VNeID mức 2",
      category: "Chuyển đổi số",
      date: "08/09/2026",
      author: "Tổ Chuyển đổi số cộng đồng",
      thumbnail: "",
      featured: false,
      content: "Tổ CNSCĐ do Bí thư Chi đoàn Nguyễn Thị Ngọc Tú làm nòng cốt tiếp tục trực tại Nhà sinh hoạt cộng đồng vào các buổi tối để hướng dẫn người cao tuổi và bà con cài đặt ứng dụng VNeID mức 2, tích hợp thẻ BHYT và sử dụng ứng dụng Hue-S phản ánh hiện trường."
    },
    {
      slug: "ra-soat-74-nguon-nvqs-2027",
      title: "Ban CHQS TDP Lương Hậu hoàn thành rà soát biến động thực lực 74 thanh niên trong nguồn NVQS 2027",
      category: "Quốc phòng - An ninh",
      date: "06/09/2026",
      author: "Tổ đội trưởng Quân sự Nguyễn Như Khải",
      thumbnail: "",
      featured: false,
      content: "Đồng chí Nguyễn Như Khải - Tổ đội trưởng Quân sự TDP Lương Hậu đã hoàn tất rà soát thực lực 74 thanh niên trong độ tuổi sẵn sàng nhập ngũ, phân loại cụ thể các trường hợp đi làm ăn xa, học đại học/cao đẳng và số thanh niên có mặt tại địa phương để chuẩn bị chu đáo cho công tác tuyển quân năm 2027."
    }
  ];

  // 9. Thông báo thực tế TDP Lương Hậu
  const DEFAULT_THONG_BAO = [
    {
      slug: "tb-lich-tiep-dan-ke-hoach-333",
      title: "Thông báo lịch tiếp nhận kê khai đất đai theo Kế hoạch 333 tại Nhà sinh hoạt cộng đồng",
      date: "14/09/2026",
      priority: "Khẩn",
      content: "Ban Cán bộ TDP phối hợp cán bộ Địa chính phường Hương Thủy tiếp nhận hồ sơ kê khai cấp đổi GCN đất đai tại Nhà SHCĐ (83 Thái Thuận) vào các ngày Thứ 3, Thứ 5 và sáng Thứ 7 hằng tuần. Kính báo bà con mang đầy đủ giấy tờ liên quan."
    },
    {
      slug: "tb-tuan-tra-an-ninh-dem",
      title: "Thông báo duy trì tuần tra đêm phòng chống trộm cắp và kiểm tra an toàn PCCC tổ liên gia",
      date: "10/09/2026",
      priority: "Thường",
      content: "Lực lượng ANTT cơ sở do đồng chí Nguyễn Thúc Thành làm Tổ trưởng phối hợp Công an phường duy trì tuần tra đêm vào các tối Thứ 3 và Thứ 7 hằng tuần. Đề nghị các hộ gia đình chủ động khóa cửa, kiểm tra bình chữa cháy mini tại gia đình."
    },
    {
      slug: "tb-sinh-hoat-chi-bo-dinh-ky",
      title: "Thông báo triệu tập hội nghị sinh hoạt Chi bộ định kỳ ngày 03 hằng tháng",
      date: "01/09/2026",
      priority: "Nội bộ",
      content: "Kính gửi toàn thể 22 đồng chí Đảng viên Chi bộ Lương Hậu: Chi bộ sinh hoạt thường kỳ vào đúng 19h00 ngày 03 hằng tháng tại Nhà SHCĐ TDP Lương Hậu. Điểm danh qua Sổ tay Đảng viên điện tử. Đề nghị các đồng chí có mặt đúng giờ."
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
          return {
            news: parsed.news || DEFAULT_TIN_TUC,
            documents: parsed.documents || DEFAULT_VAN_BAN,
            notices: parsed.notices || DEFAULT_THONG_BAO,
            cadres: parsed.cadres || DEFAULT_CAN_BO,
            partyMembers: parsed.partyMembers || DEFAULT_DANG_VIEN,
            teamAssignments: parsed.teamAssignments || DEFAULT_PHAN_CONG_DOI,
            fourWeekSchedule: parsed.fourWeekSchedule || DEFAULT_LICH_4_TUAN,
            attendance: parsed.attendance || DEFAULT_DIEM_DANH,
            officialSources: parsed.officialSources || DEFAULT_NGUON_CHINH_THONG,
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
        teamAssignments: [...DEFAULT_PHAN_CONG_DOI],
        fourWeekSchedule: [...DEFAULT_LICH_4_TUAN],
        attendance: JSON.parse(JSON.stringify(DEFAULT_DIEM_DANH)),
        officialSources: [...DEFAULT_NGUON_CHINH_THONG],
        auditLogs: [{ time: new Date().toLocaleString("vi-VN"), action: "Hệ thống Cổng Thông tin Số Lương Hậu chuẩn hóa dữ liệu thực tế", user: "Hệ thống" }]
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

    // Điểm danh Chi bộ
    getAttendance() { return this.data.attendance; }
    updateAttendance(stt, status, reason = "", user = "Bí thư") {
      const rec = this.data.attendance.records.find(r => r.stt === stt);
      if (rec) {
        rec.status = status;
        rec.reason = reason;
        this.log(`Điểm danh đồng chí ${rec.name}: ${status}`, user);
        this.save();
        return true;
      }
      return false;
    }

    // Đảng viên, Cán bộ & Phân công
    getPartyMembers() { return this.data.partyMembers; }
    getCadres() { return this.data.cadres; }
    getTeamAssignments() { return this.data.teamAssignments; }
    getFourWeekSchedule() { return this.data.fourWeekSchedule; }
    getOfficialSources() { return this.data.officialSources; }
    getAuditLogs() { return this.data.auditLogs; }

    // Tìm kiếm thông minh tổng hợp
    searchAll(keyword) {
      if (!keyword || !keyword.trim()) return { news: [], documents: [], notices: [], cadres: [], partyMembers: [] };
      const q = keyword.toLowerCase().trim();
      return {
        news: this.data.news.filter(n => (n.title && n.title.toLowerCase().includes(q)) || (n.content && n.content.toLowerCase().includes(q))),
        documents: this.data.documents.filter(d => (d.title && d.title.toLowerCase().includes(q)) || (d.code && d.code.toLowerCase().includes(q)) || (d.agency && d.agency.toLowerCase().includes(q))),
        notices: this.data.notices.filter(t => (t.title && t.title.toLowerCase().includes(q)) || (t.content && t.content.toLowerCase().includes(q))),
        cadres: this.data.cadres.filter(c => (c.name && c.name.toLowerCase().includes(q)) || (c.role && c.role.toLowerCase().includes(q))),
        partyMembers: this.data.partyMembers.filter(m => (m.name && m.name.toLowerCase().includes(q)) || (m.party_card && m.party_card.includes(q)))
      };
    }
  }

  return new Store();
});
