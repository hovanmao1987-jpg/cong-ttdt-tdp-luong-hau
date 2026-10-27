/* =====================================================================
   NGUỒN DỮ LIỆU DÙNG CHUNG — TDP LƯƠNG HẬU (phường Hương Thủy, TP. Huế)
   Định dạng: ES Module.
     · Bản Astro  : import trực tiếp  ->  import { META, NEWS } from "../../data/portal-data.mjs"
     · Bản tĩnh   : npm run build:data ->  sinh ra data/data.js (UMD, nạp bằng <script src>)
   Chỉ sửa tệp này, KHÔNG sửa data/data.js (tệp sinh tự động).
   ===================================================================== */

const META = {
  toDanPho: "Tổ dân phố Lương Hậu",
  phuong: "Phường Hương Thủy",
  thanhPho: "Thành phố Huế",
  diaChi: "Nhà văn hoá Tổ dân phố Lương Hậu, phường Hương Thủy, thành phố Huế",
  chiBo: "Chi bộ Tổ dân phố Lương Hậu",
  dangBo: "Đảng bộ phường Hương Thủy",
  canCuPhapLy: "Nghị quyết số 1675/NQ-UBTVQH15 ngày 16/6/2025 của UBTV Quốc hội về sắp xếp đơn vị hành chính cấp xã của thành phố Huế năm 2025",
  capNhat: "11/09/2026",
  hotlineTdp: "0965 712 812",
  hotlineTdpGhiChu: "Đường dây nóng TDP — đ/c Nguyễn Trọng Nghĩa, Tổ trưởng TDP (trực 24/24 khi có thiên tai, sự cố ANTT)",
  congAnPhuong: "0234.3852.870",
  hotline: "1900.1075 (Hue-S)",
  soHo: 469,
  soKhau: 1947,
  soDangVien: 22,
  quyetDinhDanhSach: "Quyết định số 46-QĐ/ĐU ngày 30/6/2026 của Đảng ủy phường Hương Thủy"
};

/* ---------------- TIN TỨC 3 CẤP ---------------- */
const NEWS = {
  hue: [
    { id:"h_datdai333", tag:"city", pill:"TP. HUẾ", hot:true,
      title:"UBND thành phố Huế ban hành Kế hoạch số 333/KH-UBND về chỉ tiêu kê khai đăng ký đất đai và hoàn thiện CSDL đất đai năm 2026",
      date:"12/06/2026", src:"UBND thành phố Huế",
      sum:"Kế hoạch số 333/KH-UBND ngày 12/06/2026 của UBND thành phố Huế (Phó Chủ tịch Hà Văn Tuấn ký) về giao chỉ tiêu thực hiện kê khai đăng ký đất đai, hoàn thiện hồ sơ địa chính và cơ sở dữ liệu đất đai kết nối CSDL dân cư năm 2026 kèm 3 Phụ lục biểu mẫu chuyên môn.",
      body:[
        "UBND thành phố Huế ban hành Kế hoạch số 333/KH-UBND ngày 12/06/2026 về giao chỉ tiêu thực hiện kê khai đăng ký đất đai, hoàn thiện hồ sơ địa chính và xây dựng, hoàn thiện cơ sở dữ liệu đất đai trên địa bàn thành phố Huế năm 2026 theo Kế hoạch 2959/KH-BNNMT-BCA.",
        "Văn bản do đồng chí Hà Văn Tuấn - Phó Chủ tịch UBND thành phố Huế ký ban hành thuộc lĩnh vực Đất đai - Nhà ở - Đô thị.",
        "Đường dẫn nguồn chính thống trên Cổng thông tin điện tử thành phố Huế: https://hue.gov.vn/Trang-chu/He-thong-van-ban-phap-luat/doc/all/vb/59799",
        "Kế hoạch ban hành kèm theo 3 Phụ lục chuyên môn phục vụ cán bộ địa chính và nhân dân:",
        "• Phụ lục 3: Chỉ tiêu kê khai đất đai (Xem trực tuyến: https://drive.google.com/file/d/ID_FILE_PL3/view — Tải về: /documents/ke-hoach-333-phu-luc-3.pdf).",
        "• Phụ lục 4: Tiến độ và biểu mẫu địa chính (Xem trực tuyến: https://drive.google.com/file/d/ID_FILE_PL4/view — Tải về: /documents/ke-hoach-333-phu-luc-4.pdf).",
        "• Phụ lục 5: Cơ chế phối hợp Công an & Địa chính (Xem trực tuyến: https://drive.google.com/file/d/ID_FILE_PL5/view — Tải về: /documents/ke-hoach-333-phu-luc-5.pdf).",
        "UBND phường Hương Thủy và Ban điều hành TDP Lương Hậu thông báo rộng rãi để các hộ gia đình chủ động kê khai đăng ký đất đai đúng tiến độ. Chi tiết xem tại trang chuyên mục /van-ban."
      ] },
    { id:"h_tangle2322", tag:"city", pill:"TP. HUẾ", hot:true,
      title:"UBND thành phố Huế ban hành Quy định số 2322/QĐ-UBND về thực hiện nếp sống văn minh trong tang lễ",
      date:"11/09/2026", src:"UBND thành phố Huế",
      sum:"Quy định số 2322/QĐ-UBND của UBND thành phố Huế về nếp sống văn minh trong việc tang: nghiêm cấm rải vàng mã, tiền ra đường giao thông; âm thanh tang lễ từ 05h00 đến 22h00; thời gian tổ chức tang lễ không quá 48 giờ; trường hợp đặc biệt có người thân ở xa về chịu tang không quá 72 giờ; khuyến khích hỏa táng văn minh.",
      body:[
        "Ủy ban nhân dân thành phố Huế ban hành Quyết định số 2322/QĐ-UBND ban hành Quy định về thực hiện nếp sống văn minh trong việc tang trên địa bàn thành phố Huế, nhằm gìn giữ thuần phong mỹ tục, bảo vệ cảnh quan môi trường và trật tự an toàn giao thông đô thị.",
        "Quy định số 2322/QĐ-UBND xác định 5 nội dung trọng tâm bắt buộc thực hiện đối với các cơ quan, đơn vị, tổ chức và mọi tầng lớp nhân dân trên địa bàn:",
        "1. Nghiêm cấm hành vi rải tiền Việt Nam, ngoại tệ, tiền vàng mã, các loại giấy tờ giả tiền trên các tuyến đường giao thông công cộng khi đưa tang. Ban điều hành tang lễ và gia đình chịu trách nhiệm nhắc nhở các phương tiện tham gia đoàn tang không để vàng mã bay ra đường.",
        "2. Thời gian tổ chức tang lễ tại gia đình không quá 48 giờ kể từ khi khâm liệm đến khi an táng; trường hợp đặc biệt có người thân ở xa về chịu tang không quá 72 giờ (trường hợp người mất do dịch bệnh nguy hiểm thực hiện theo hướng dẫn khẩn cấp của cơ quan y tế).",
        "3. Khung giờ sử dụng nhạc tang, dàn loa kèn, nhạc lễ chỉ được phép phát từ 05h00 đến 22h00; phải điều chỉnh âm lượng vừa đủ nghe trong khuôn viên gia đình, không mở âm thanh công suất lớn làm ảnh hưởng đến khu dân cư.",
        "4. Tuyệt đối không lấn chiếm lòng lề đường, vỉa hè để dựng rạp tang làm cản trở giao thông; trường hợp trong kiệt, ngõ hẹp phải báo cáo Tổ dân phố và UBND phường để phối hợp phân luồng và bố trí lối đi an toàn cho người dân.",
        "5. Thành phố khuyến khích các gia đình lựa chọn hình thức hỏa táng văn minh, chôn cất đúng quy hoạch tại nghĩa trang thành phố; xóa bỏ các hủ tục mê tín dị đoan, tổ chức trang trọng, tiết kiệm, tránh lãng phí.",
        "UBND phường Hương Thủy và Ban điều hành TDP Lương Hậu yêu cầu toàn thể cán bộ, đảng viên gương mẫu chấp hành; các tổ chức đoàn thể phối hợp tuyên truyền sâu rộng tới 469 hộ gia đình thuộc 4 khu vực của tổ dân phố."
      ] },
    { id:"h1", tag:"city", pill:"TP. HUẾ", hot:true,
      title:"Thành phố Huế triển khai Nghị quyết số 27-NQ/TW về phát triển các vùng và tổ chức không gian phát triển quốc gia trong giai đoạn mới",
      date:"10/09/2026", src:"Cổng TTĐT TP. Huế",
      sum:"Thành uỷ Huế tổ chức hội nghị quán triệt Nghị quyết số 27-NQ/TW ngày 28/8/2026 của Bộ Chính trị; xác định Huế thuộc vùng Bắc Trung Bộ, tập trung kinh tế di sản, du lịch, công nghiệp công nghệ cao và hạ tầng số.",
      body:["Thành uỷ Huế vừa tổ chức hội nghị trực tuyến quán triệt, triển khai Nghị quyết số 27-NQ/TW ngày 28/8/2026 của Bộ Chính trị về phát triển các vùng và tổ chức không gian phát triển quốc gia trong giai đoạn mới, tầm nhìn đến năm 2045.",
        "Nghị quyết xác định vùng Bắc Trung Bộ phát triển theo hướng kinh tế biển, du lịch di sản, công nghiệp năng lượng và logistics; thành phố Huế được giao vai trò trung tâm văn hoá - du lịch đặc sắc của cả nước.",
        "UBND thành phố yêu cầu các phường, xã rà soát quy hoạch, cập nhật kế hoạch phát triển kinh tế - xã hội 2026-2030 bám sát 3 quan điểm chỉ đạo của Bộ Chính trị; hoàn thành trước 30/11/2026.",
        "Chi bộ và Ban điều hành TDP Lương Hậu tổ chức tuyên truyền tới từng hộ gia đình trong các buổi sinh hoạt tổ dân phố tháng 9 và tháng 10/2026."] },
    { id:"h2", tag:"city", pill:"TP. HUẾ",
      title:"Huế-S nâng cấp tính năng phản ánh hiện trường: rút ngắn thời gian xử lý xuống còn 48 giờ",
      date:"09/09/2026", src:"Trung tâm IOC Huế",
      sum:"Từ 15/9/2026, quy trình tiếp nhận - phân loại - xử lý phản ánh hiện trường trên Hue-S được chuẩn hoá theo 3 cấp, thời gian phản hồi tối đa 48 giờ đối với vụ việc thông thường.",
      body:["Trung tâm Giám sát, điều hành đô thị thông minh (IOC) tỉnh thông báo nâng cấp phân hệ phản ánh hiện trường trên ứng dụng Hue-S.",
        "Quy trình mới gồm 5 bước: tiếp nhận tự động, phân loại cấp độ, chuyển đơn vị chủ trì, xử lý - xác minh thực địa, phản hồi kết quả kèm hình ảnh.",
        "Đối với TDP, phản ánh thuộc thẩm quyền cấp phường sẽ được chuyển về UBND phường Hương Thủy trong 2 giờ làm việc.",
        "Công dân có thể tra cứu mã phản ánh ngay trên Cổng TTĐT TDP Lương Hậu tại mục “Tiếp nhận phản ánh công dân”."] },
    { id:"h3", tag:"city", pill:"TP. HUẾ",
      title:"Thành phố Huế công bố 40 phường, xã vận hành ổn định mô hình chính quyền địa phương hai cấp",
      date:"08/09/2026", src:"Báo Huế ngày nay",
      sum:"Sau hơn một năm thực hiện Nghị quyết 1675/NQ-UBTVQH15, 40 đơn vị hành chính cấp xã của thành phố Huế đã vận hành thông suốt; tỷ lệ hồ sơ giải quyết đúng hạn đạt 97,8%.",
      body:["Theo báo cáo của Sở Nội vụ, mô hình chính quyền địa phương hai cấp (thành phố - phường/xã) tại Huế cơ bản vận hành thông suốt.",
        "Phường Hương Thủy - đơn vị sáp nhập từ phường Thủy Lương, phường Thủy Châu và xã Thủy Tân - có diện tích 33,93 km², dân số 29.192 người, gồm 14 tổ dân phố.",
        "Trung tâm Phục vụ hành chính công phường tiếp nhận trung bình 180 hồ sơ/tuần, tỷ lệ đúng hạn 97,8%.",
        "Người dân TDP Lương Hậu thực hiện thủ tục tại Trung tâm Phục vụ hành chính công phường Hương Thủy, 749 Nguyễn Tất Thành."] },
    { id:"h4", tag:"city", pill:"TP. HUẾ",
      title:"Cảnh báo mưa lớn diện rộng, nguy cơ ngập úng vùng thấp trũng từ ngày 10 đến 17/9/2026",
      date:"08/09/2026", src:"Đài KTTV Trung Bộ",
      sum:"Do ảnh hưởng của dải hội tụ nhiệt đới kết hợp không khí lạnh yếu, khu vực thành phố Huế có mưa to đến rất to; tổng lượng mưa phổ biến 250-450mm, có nơi trên 550mm.",
      body:["Đài Khí tượng Thuỷ văn Trung Bộ phát tin cảnh báo mưa lớn diện rộng trên địa bàn thành phố Huế từ ngày 10/9 đến ngày 17/9/2026.",
        "Các sông Hương, sông Bồ có khả năng lên mức báo động 2 - báo động 3, vùng hạ lưu ngập úng cục bộ.",
        "Ban Chỉ huy PCTT-TKCN thành phố yêu cầu cấp phường kích hoạt phương án trực 24/24, rà soát điểm sơ tán dân.",
        "TDP Lương Hậu triển khai Phương án trực bão lũ số 02/PA-BĐH từ 07h00 ngày 10/9/2026 (xem chi tiết tại chuyên mục PCTT)."] }
  ],
  huongthuy: [
    { id:"d1", tag:"dist", pill:"HƯƠNG THỦY",
      title:"UBND phường Hương Thủy kiện toàn Ban Chỉ huy Phòng chống thiên tai và Tìm kiếm cứu nạn năm 2026",
      date:"09/09/2026", src:"UBND phường Hương Thủy",
      sum:"Quyết định kiện toàn BCH PCTT-TKCN phường gồm 27 thành viên; phân công 4 tổ công tác phụ trách 14 tổ dân phố, chuẩn bị 6 điểm sơ tán tập trung với sức chứa 1.200 người.",
      body:["Chủ tịch UBND phường Hương Thủy ký quyết định kiện toàn Ban Chỉ huy PCTT-TKCN phường năm 2026.",
        "BCH gồm 27 thành viên; đồng chí Chủ tịch UBND phường làm Trưởng ban, đồng chí Chỉ huy trưởng Ban CHQS phường làm Phó ban thường trực.",
        "Thành lập 4 tổ công tác: Tổ thông tin - tuyên truyền, Tổ cứu hộ - cứu nạn, Tổ hậu cần - y tế, Tổ đảm bảo ANTT và bảo vệ tài sản nhân dân.",
        "TDP Lương Hậu thuộc Tổ công tác số 2; điểm sơ tán tập trung: Trường Tiểu học Thủy Lương (cơ sở 1) và Nhà văn hoá phường."] },
    { id:"d2", tag:"dist", pill:"HƯƠNG THỦY",
      title:"Phường Hương Thủy ra quân tổng vệ sinh môi trường, khơi thông cống rãnh trước mùa mưa bão",
      date:"07/09/2026", src:"UBND phường Hương Thủy",
      sum:"Hơn 600 lượt người dân tham gia dọn vệ sinh 12 tuyến đường, vớt bèo khai thông 3,4km kênh mương; riêng TDP Lương Hậu hoàn thành tuyến kênh nội đồng Lương Hậu - Lương Xuân.",
      body:["Sáng 07/9/2026, UBND phường Hương Thủy phối hợp các đoàn thể tổ chức ra quân tổng vệ sinh môi trường trên toàn địa bàn.",
        "Kết quả: thu gom 14,6 tấn rác thải, vớt bèo khai thông 3,4 km kênh mương, phát quang 12 tuyến đường với tổng chiều dài 8,7 km.",
        "TDP Lương Hậu huy động 68 lượt người dân, hoàn thành khơi thông tuyến kênh nội đồng Lương Hậu - Lương Xuân dài 780m.",
        "UBND phường biểu dương 3 tập thể, 7 cá nhân; hỗ trợ mỗi TDP 2.000.000 đồng kinh phí mua dụng cụ."] },
    { id:"d3", tag:"dist", pill:"HƯƠNG THỦY",
      title:"Công an phường Hương Thủy mở đợt cao điểm tấn công, trấn áp tội phạm",
      date:"06/09/2026", src:"Công an phường Hương Thủy",
      sum:"Đợt cao điểm từ 01/9 đến 31/10/2026, tập trung phòng chống trộm cắp, cờ bạc, ma tuý, tội phạm công nghệ cao; tăng cường tuần tra đêm tại các địa bàn giáp ranh.",
      body:["Công an phường Hương Thủy triển khai đợt cao điểm tấn công, trấn áp tội phạm bảo đảm an ninh trật tự trên địa bàn.",
        "Các tổ dân phố được yêu cầu duy trì mô hình “Tổ liên gia an toàn PCCC”, “Tuần tra nhân dân ban đêm”.",
        "TDP Lương Hậu gồm 4 khu vực (đội 8, 9, 10, 11) với 469 hộ.",
        "Người dân nâng cao cảnh giác với thủ đoạn giả danh cơ quan công an, viện kiểm sát yêu cầu chuyển tiền, cài đặt ứng dụng lạ."] },
    { id:"d4", tag:"dist", pill:"HƯƠNG THỦY",
      title:"Trung tâm Phục vụ hành chính công phường Hương Thủy tiếp nhận hồ sơ trực tuyến toàn trình đạt 71%",
      date:"04/09/2026", src:"UBND phường Hương Thủy",
      sum:"8 tháng đầu năm 2026, Trung tâm tiếp nhận 6.214 hồ sơ; trong đó 4.412 hồ sơ nộp trực tuyến. Tỷ lệ đúng và trước hạn đạt 97,8%, mức hài lòng 4,72/5.",
      body:["Báo cáo của Trung tâm Phục vụ hành chính công phường Hương Thủy cho thấy 8 tháng đầu năm 2026 tiếp nhận 6.214 hồ sơ.",
        "Nhóm thủ tục phát sinh nhiều nhất: đăng ký khai sinh, xác nhận tình trạng hôn nhân, chứng thực bản sao, đăng ký cư trú.",
        "Trung tâm bố trí 2 cán bộ hỗ trợ người dân nộp hồ sơ trên Cổng Dịch vụ công quốc gia; hỗ trợ miễn phí tại Nhà văn hoá TDP vào sáng thứ Bảy hằng tuần.",
        "TDP Lương Hậu đăng ký lịch hỗ trợ qua Bí thư Chi bộ hoặc Tổ trưởng TDP."] }
  ],
  luonghau: [
    { id:"lh_chunhatxanh", tag:"lh", pill:"LƯƠNG HẬU", hot:true,
      title:"Tổ dân phố Lương Hậu ra quân Ngày Chủ Nhật Xanh: Vệ sinh môi trường tuyến đường Thái Thuận & Thái Vĩnh Chinh",
      date:"23/08/2026", src:"Ban cán sự TDP Lương Hậu",
      sum:"Tổ dân phố Lương Hậu sôi nổi ra quân Ngày Chủ Nhật Xanh đợt 1 (16/8 tại tuyến đường Thái Thuận), đợt 2 (23/8 tại tuyến đường Thái Vĩnh Chinh) và chỉnh trang 14 cổng chào treo cờ Tổ quốc chào mừng Quốc khánh 2/9.",
      body:[
        "Hưởng ứng phong trào 'Ngày Chủ Nhật Xanh' do UBND thành phố Huế và phường Hương Thủy phát động, cán bộ và nhân dân TDP Lương Hậu đã đồng loạt ra quân bảo vệ môi trường 'Sáng - Xanh - Sạch - Đẹp':",
        "1. Đợt 1 (16/08/2026): Tổng dọn vệ sinh tuyến đường Thái Thuận, các kiệt xóm và khu vực tâm linh cộng đồng. Ban cán sự và nhân dân phát quang cỏ dại, thu gom rác thải, cắt tỉa nhánh cây che khuất đường dây điện và khu vực am thờ cộng đồng (Hồ sơ ảnh: 3884.jpg, 3885.jpg).",
        "2. Đợt 2 (23/08/2026): Tổng vệ sinh toàn tuyến đường Thái Vĩnh Chinh và các ngõ liên gia. Huy động máy cắt cỏ cầm tay, nhân dân tích cực thu gom rác thải, làm sạch mương rãnh thoát nước nhằm chuẩn bị thoát lũ mùa mưa bão (Hồ sơ ảnh: 4579.jpg, 4580.jpg).",
        "3. Đợt chỉnh trang chào mừng Quốc khánh 2/9 (26/08 - 30/08/2026): Chỉnh trang, lắp đặt cờ Tổ quốc đồng bộ tại 14 cổng chào của tổ dân phố, thay mới cờ phao, cờ phướn và vận động 100% hộ dân treo cờ trang trọng trước cổng nhà (Hồ sơ ảnh: 4336.jpg, 4338.jpg, 4585.jpg, 4586.jpg, 4589.jpg, 4591.jpg).",
        "Chi tiết các đợt ra quân và hồ sơ lưu trữ xem tại chuyên mục /chu-nhat-xanh trên Cổng thông tin điện tử TDP."
      ] },
    { id:"o_trungthu", tag:"org", pill:"LƯƠNG HẬU", hot:true,
      title:"THƯ NGỎ: Vận động ủng hộ Chương trình “Đêm Hội Trăng Rằm” – Tết Trung Thu 2026 cho các cháu thiếu nhi",
      date:"09/08/2026", src:"Ban Tổ chức TDP Lương Hậu",
      img:"assets/img/thu-ngo-trung-thu-2026.jpg",
      sum:"Ban Tổ chức TDP Lương Hậu kêu gọi các cơ quan, doanh nghiệp, tổ chức, nhà hảo tâm và nhân dân chung tay ủng hộ kinh phí và hiện vật tổ chức Tết Trung Thu 2026 cho thiếu nhi.",
      body:[
        "Kính gửi: Các cơ quan, doanh nghiệp, tổ chức, nhà hảo tâm cùng toàn thể nhân dân Tổ dân phố Lương Hậu.",
        "Tết Trung Thu lại về trong niềm hoan hỉ, háo hức của tuổi thơ. Mỗi mùa trăng rằm không chỉ là dịp để trẻ em được rước đèn, phá cỗ, thưởng thức hương vị bánh trung thu truyền thống, mà còn là khoảnh khắc đong đầy tình yêu thương của gia đình và cộng đồng dành cho thế hệ tương lai.",
        "Với mong muốn mang đến cho các cháu thiếu nhi trong tổ dân phố một đêm hội tràn ngập niềm vui, ấm áp và ý nghĩa, Ban Tổ chức Tổ dân phố Lương Hậu dự kiến tổ chức chương trình “Đêm Hội Trăng Rằm 2026”:",
        "• Thời gian: Bắt đầu lúc 19h00 ngày 25 tháng 09 năm 2026 (nhằm ngày 15 tháng 08 Âm lịch).",
        "• Địa điểm: Nhà sinh hoạt cộng đồng TDP Lương Hậu.",
        "• Hoạt động chính: Múa lân phá cỗ, văn nghệ thiếu nhi, rước đèn ông sao, trao quà Trung thu cho các cháu thiếu nhi có hoàn cảnh khó khăn và phát quà trung thu cho các cháu thiếu nhi.",
        "Để chương trình đêm hội diễn ra thành công trọn vẹn và chu đáo, kinh phí dự kiến sẽ huy động từ nguồn xã hội hóa. Ban Tổ chức rất mong nhận được sự đồng hành, ủng hộ cả về vật chất lẫn tinh thần của các cơ quan, đoàn thể, quý doanh nghiệp, các nhà hảo tâm và toàn thể bà con nhân dân.",
        "HÌNH THỨC ỦNG HỘ: Đóng góp trực tiếp cho Ban Tổ chức hoặc chuyển khoản qua STK: 107887615896 — Ngân hàng Vietinbank — Chủ tài khoản: Nguyễn Trọng Nghĩa (Nội dung: Ung ho Trung thu Luong Hau). Số điện thoại: 0965712812.",
        "Tất cả đóng góp dù lớn hay nhỏ của Quý vị đều là nguồn động viên vô giá, góp phần tạo nên một mùa Trung thu ấm áp, trọn vẹn niềm vui cho các em nhỏ. Ban Tổ chức cam kết công khai, minh bạch toàn bộ nguồn thu - chi và sử dụng đúng mục đích. Xin trân trọng cảm ơn tấm lòng vàng và sự chung tay của Quý vị!"
      ] },
    { id:"o1", tag:"org", pill:"LƯƠNG HẬU", hot:true,
      title:"Kế hoạch phân công nhiệm vụ Tổ xung kích Phòng, chống thiên tai và Tìm kiếm cứu nạn năm 2026",
      date:"09/09/2026", src:"Tổ xung kích PCTT & TKCN TDP Lương Hậu",
      sum:"Căn cứ Quyết định 1229/QĐ-UBND của UBND phường Hương Thủy, Tổ xung kích PCTT&TKCN TDP Lương Hậu phân công nhiệm vụ cụ thể cho 8 thành viên theo phương châm “4 tại chỗ”.",
      body:[
        "Căn cứ Quyết định số 1229/QĐ-UBND ngày 30 tháng 7 năm 2026 của UBND phường Hương Thủy về việc thành lập Tổ xung kích Phòng chống thiên tai và Tìm kiếm cứu nạn tại Tổ dân phố Lương Hậu; Tổ xung kích phân công nhiệm vụ cụ thể:",
        "1. Ông Nguyễn Trọng Nghĩa (Tổ trưởng TDP) — Tổ trưởng Tổ xung kích: Phụ trách chung, chịu trách nhiệm trước UBND phường và BCH PTDS phường Hương Thủy; trực tiếp chỉ huy ứng phó thiên tai, sơ tán dân, cứu hộ cứu nạn; phân công ca trực và phát lệnh báo động khẩn cấp.",
        "2. Ông Hoàng Hữu Rớt (Trưởng ban Công tác Mặt trận) — Tổ phó: Giúp Tổ trưởng điều hành công việc chung; phụ trách công tác tuyên truyền, vận động nhân dân chằng chống nhà cửa, dự trữ lương thực; điều hành công tác hậu cần, tiếp nhận và phân phối hàng cứu trợ.",
        "3. Ông Nguyễn Như Khải (Tổ đội trưởng) — Thành viên: Phụ trách lực lượng dân quân, thanh niên xung kích tuần tra canh gác các khu vực xung yếu, ngập sâu; nòng cốt trong cứu hộ cứu nạn, di dời dân cư, tài sản; quản lý ghe thuyền, áo phao, dây thừng, đèn pin.",
        "4. Ông Nguyễn Thúc Thành (Tổ trưởng Tổ bảo vệ ANTT ở cơ sở) — Thành viên: Chịu trách nhiệm đảm bảo ANTT, an toàn tài sản tại khu vực sơ tán và vùng ngập lụt; tổ chức chốt chặn tại các tuyến đường ngập sâu, tràn lũ nguy hiểm; phối hợp cứu hộ cứu nạn.",
        "5. Bà Nguyễn Thị Mừng (Chi hội trưởng Chi hội Phụ nữ) — Thành viên: Vận động hội viên chủ động phòng chống thiên tai; rà soát, ưu tiên hỗ trợ sơ tán gia đình chính sách, phụ nữ mang thai, trẻ em, người già yếu, khuyết tật; chuẩn bị nhu yếu phẩm, hậu cần sơ tán tập trung.",
        "6. Ông Nguyễn Văn Quang (Thành viên Tổ bảo vệ ANTT cơ sở) — Thành viên: Phối hợp tuần tra ANTT, tham gia chốt chặn giao thông tại các điểm ngập lũ, cảnh báo nguy hiểm và tham gia cứu hộ, di dời tài sản nhân dân.",
        "7. Ông Phan Đăng Chiến (Chi hội trưởng Chi hội Người cao tuổi) — Thành viên: Tuyên truyền hội viên người cao tuổi; nắm danh sách cụ già neo đơn, ốm đau để hỗ trợ di dời sớm; động viên tinh thần, ổn định tâm lý nhân dân.",
        "8. Ông Nguyễn Cường (Chi hội trưởng Chi hội Cựu chiến binh) — Thành viên: Phụ trách hội viên cựu chiến binh hỗ trợ chằng chống nhà cửa cho hộ yếu thế; tuần tra nhắc nhở không đánh bắt cá, vớt củi trên sông/hồ khi lũ lớn; tham gia dọn dẹp vệ sinh môi trường sau lũ.",
        "QUY TRÌNH THỰC HIỆN 3 GIAI ĐOẠN: (1) Phòng ngừa trước thiên tai; (2) Ứng phó trong thiên tai — sẵn sàng lực lượng, phương tiện, duy trì chế độ trực 24/24h khi có tin bão lũ; (3) Khắc phục hậu quả theo phương châm 4 tại chỗ (Chỉ huy tại chỗ; lực lượng tại chỗ; phương tiện, vật tư tại chỗ; hậu cần tại chỗ)."
      ] },
    { id:"o2", tag:"org", pill:"LƯƠNG HẬU",
      title:"Công khai danh sách 10 cán bộ chủ chốt Tổ dân phố Lương Hậu nhiệm kỳ 2025-2027",
      date:"05/09/2026", src:"Ban điều hành TDP Lương Hậu",
      sum:"Thực hiện Quy chế dân chủ ở cơ sở, TDP công khai chức danh, nhiệm vụ, số điện thoại liên hệ và địa bàn phụ trách của 10 cán bộ chủ chốt để nhân dân giám sát.",
      body:["Thực hiện Luật Thực hiện dân chủ ở cơ sở năm 2022 và hướng dẫn của UBND phường Hương Thủy, TDP Lương Hậu công khai danh sách 10 cán bộ chủ chốt.",
        "Nội dung công khai gồm: họ tên, năm sinh, chức danh, nhiệm vụ được phân công, địa bàn phụ trách, số điện thoại liên hệ.",
        "Nhân dân có ý kiến góp ý trực tiếp tại Nhà văn hoá TDP hoặc qua Form tiếp nhận phản ánh công dân trên Cổng thông tin này.",
        "Thời gian tiếp nhận ý kiến: từ 05/9/2026 đến 05/10/2026."] },
    { id:"o4", tag:"org", pill:"LƯƠNG HẬU",
      title:"TDP Lương Hậu phát hành Bộ 11 biểu mẫu hành chính tải miễn phí phục vụ nhân dân",
      date:"03/09/2026", src:"Ban điều hành TDP Lương Hậu",
      sum:"11 biểu mẫu thông dụng nhất (đơn đề nghị, giấy uỷ quyền, biên bản họp tổ, cam kết PCCC, sơ yếu lý lịch…) được chuẩn hoá theo mẫu hiện hành, tải miễn phí, không cần cài phần mềm.",
      body:["Nhằm giảm thời gian đi lại của nhân dân, TDP Lương Hậu chuẩn hoá và phát hành Bộ 11 biểu mẫu hành chính thông dụng.",
        "Toàn bộ biểu mẫu tải miễn phí, định dạng .doc và .pdf, mở được trên điện thoại bằng ứng dụng có sẵn.",
        "Sau khi điền, người dân gửi bản chụp qua Form tiếp nhận phản ánh hoặc nộp trực tiếp tại Nhà văn hoá TDP vào sáng thứ Bảy (7h30 - 11h00).",
        "Mọi thắc mắc liên hệ Tổ trưởng TDP hoặc bộ phận Văn phòng - Thống kê phường Hương Thủy."] },
    { id:"o5", tag:"org", pill:"LƯƠNG HẬU",
      title:"Chi bộ TDP Lương Hậu sinh hoạt chuyên đề quý III/2026: “Đảng viên tiên phong trong chuyển đổi số ở khu dân cư”",
      date:"02/09/2026", src:"Chi bộ TDP Lương Hậu",
      sum:"Chi bộ tổ chức sinh hoạt chuyên đề với 19/22 đảng viên tham dự; quán triệt Sổ tay Đảng viên điện tử Thừa Thiên Huế và giao chỉ tiêu mỗi đảng viên hỗ trợ 3 hộ dân cài đặt Hue-S, VNeID.",
      body:["Chi bộ TDP Lương Hậu tổ chức sinh hoạt chuyên đề quý III/2026 với chủ đề “Đảng viên tiên phong trong chuyển đổi số ở khu dân cư”.",
        "Tham dự: 19/22 đảng viên (3 đồng chí vắng có lý do); đại diện Đảng uỷ phường Hương Thủy dự và chỉ đạo.",
        "Chi bộ quán triệt việc sử dụng Sổ tay Đảng viên điện tử Thừa Thiên Huế (sotaydangvien.hue.gov.vn) để đăng ký học tập, điểm danh sinh hoạt và cập nhật hồ sơ đảng viên.",
        "Giao chỉ tiêu: mỗi đảng viên hỗ trợ ít nhất 3 hộ dân cài đặt, sử dụng Hue-S và VNeID mức 2; hoàn thành trước 30/10/2026.",
        "Kết quả bỏ phiếu biểu quyết: 100% đảng viên nhất trí thông qua Nghị quyết chuyên đề."] }
  ]
};

/* ---------------- CHUYÊN MỤC ANTT — NHẬT KÝ TUẦN TRA ĐÊM ---------------- */
const ANTT = {
  moHinh: ["Tổ liên gia an toàn PCCC (4 khu vực)", "Tuần tra nhân dân ban đêm", "Zalo kết nối bình yên"],
  khuVuc: ["Khu vực đội 8", "Khu vực đội 9", "Khu vực đội 10", "Khu vực đội 11"],
  canhBao: [
    "Không chuyển tiền, không cài ứng dụng lạ khi có người tự xưng công an, viện kiểm sát, toà án, nhân viên điện lực gọi điện.",
    "Khoá cổng, đưa xe máy vào nhà trước 22h00; không để tài sản có giá trị ngoài sân.",
    "Tắt thiết bị điện không cần thiết, ngắt cầu dao khi ra khỏi nhà qua đêm.",
    "Thấy đối tượng lạ mặt, tiếng động bất thường: gọi ngay Tổ trưởng ANTT hoặc Công an phường, không tự ý truy đuổi."
  ]
};

/* ---------------- CHUYÊN MỤC PCTT — KẾ HOẠCH TỔ XUNG KÍCH 2026 ---------------- */
const PCTT = {
  soHieu:"KH-TXK/2026",
  ten:"Kế hoạch Phân công nhiệm vụ Tổ xung kích Phòng, chống thiên tai và Tìm kiếm cứu nạn năm 2026",
  thoiGian:"Duy trì trực 24/24h khi có tin bão lũ, áp thấp nhiệt đới hoặc thiên tai bất ngờ",
  canCu:"Quyết định số 1229/QĐ-UBND ngày 30/7/2026 của UBND phường Hương Thủy về việc thành lập Tổ xung kích PCTT&TKCN tại TDP Lương Hậu",
  capRuiRo:"Phương châm “4 tại chỗ” (Chỉ huy tại chỗ; lực lượng tại chỗ; phương tiện vật tư tại chỗ; hậu cần tại chỗ)",
  mucTieu:[
    "Chủ động phòng ngừa, ứng phó kịp thời, khắc phục khẩn trương và hiệu quả hậu quả do thiên tai",
    "Phân công rõ trách nhiệm, nhiệm vụ cụ thể cho 8 thành viên Tổ xung kích",
    "Sẵn sàng lực lượng, phương tiện, duy trì chế độ trực 24/24h khi có tin bão lũ, áp thấp nhiệt đới",
    "Phối hợp chặt chẽ với đoàn thể, công an, quân sự và nhân dân địa phương"
  ],
  caTruc:[
    { ca:"Giai đoạn 1", tg:"Phòng ngừa (Trước thiên tai)", truc:"Toàn thể Tổ xung kích", nv:"Tuyên truyền, kiểm đếm hộ yếu thế, kiểm tra ghe thuyền, áo phao, đèn pin, phân công lịch trực" },
    { ca:"Giai đoạn 2", tg:"Ứng phó (Khi xảy ra thiên tai)", truc:"Tổ trưởng + Lực lượng xung kích", nv:"Trực 24/24h, chốt chặn ngập sâu, hỗ trợ chằng chống nhà cửa, sơ tán dân đến nơi an toàn, cứu hộ cứu nạn" },
    { ca:"Giai đoạn 3", tg:"Khắc phục hậu quả (Sau thiên tai)", truc:"Tổ xung kích + Đoàn thể", nv:"Thống kê thiệt hại, đề xuất hỗ trợ hộ nghèo, dọn dẹp vệ sinh môi trường, xử lý nguồn nước, báo cáo BCH PTDS" }
  ],
  lucLuong:[
    { stt:1, hoTen:"Nguyễn Trọng Nghĩa", nhiemVu:"Tổ trưởng Tổ xung kích (Tổ trưởng TDP) — Phụ trách chung, chỉ huy cứu hộ, phát lệnh báo động", sdt:"0965 712 812", khuVuc:"Toàn TDP" },
    { stt:2, hoTen:"Hoàng Hữu Rớt", nhiemVu:"Tổ phó (Trưởng ban CTMT) — Giúp việc Tổ trưởng, tuyên truyền chằng chống, điều hành hậu cần cứu trợ", sdt:"0965 943 303", khuVuc:"Toàn TDP" },
    { stt:3, hoTen:"Nguyễn Như Khải", nhiemVu:"Thành viên (Tổ đội trưởng) — Phụ trách dân quân xung kích, tuần tra, cứu hộ di dời dân, quản lý ghe thuyền, áo phao", sdt:"0388 886 876", khuVuc:"Khu vực xung yếu" },
    { stt:4, hoTen:"Nguyễn Thúc Thành", nhiemVu:"Thành viên (Tổ trưởng ANTT cơ sở) — Đảm bảo ANTT khu sơ tán, chốt chặn ngập sâu nguy hiểm, cứu hộ cứu nạn", sdt:"0975 175 361", khuVuc:"Toàn TDP" },
    { stt:5, hoTen:"Nguyễn Thị Mừng", nhiemVu:"Thành viên (Chi hội trưởng Phụ nữ) — Vận động hội viên, rà soát hỗ trợ phụ nữ, trẻ em, người già neo đơn, hậu cần sơ tán", sdt:"0377 412 815", khuVuc:"Điểm sơ tán tập trung" },
    { stt:6, hoTen:"Nguyễn Văn Quang", nhiemVu:"Thành viên (ANTT cơ sở) — Tuần tra ANTT, chốt chặn điểm ngập, cảnh báo người dân, tham gia cứu hộ", sdt:"0975 175 361", khuVuc:"Tuyến đường ngập lũ" },
    { stt:7, hoTen:"Phan Đăng Chiến", nhiemVu:"Thành viên (Chi hội trưởng NCT) — Tuyên truyền người cao tuổi, nắm danh sách cụ già neo đơn cần di dời sớm, ổn định tâm lý", sdt:"0913 469 434", khuVuc:"Khu dân cư" },
    { stt:8, hoTen:"Nguyễn Cường", nhiemVu:"Thành viên (Chi hội trưởng CCB) — Hỗ trợ chằng chống nhà cửa cho hộ yếu thế, tuần tra an toàn sông hồ, dọn vệ sinh sau lũ", sdt:"0981 710 242", khuVuc:"Toàn TDP" }
  ],
  diemXungYeu:[
    { vt:"Ngã ba Lương Hậu - Lương Xuân", loai:"Ngập sâu khi mưa lớn", xp:"Cắm biển cảnh báo, chốt chặn không cho người và phương tiện qua lại", nguoi:"Nguyễn Như Khải" },
    { vt:"Tuyến kênh nội đồng Lương Hậu - Lương Xuân", loai:"Tràn bờ, sạt lở mái kênh", xp:"Khơi thông, gia cố bao cát tại các vị trí xung yếu", nguoi:"Nguyễn Thúc Thành" },
    { vt:"Các điểm ngập úng dân cư", loai:"Nền thấp, nguy cơ ngập lụt", xp:"Hỗ trợ di dời tài sản, ngắt điện cục bộ khi nước dâng", nguoi:"Nguyễn Trọng Nghĩa" },
    { vt:"Hộ gia đình neo đơn, nhà yếu", loai:"Gió mạnh, sập đổ, cô lập", xp:"Chằng chống sớm, ưu tiên sơ tán đến nơi kiên cố", nguoi:"Phan Đăng Chiến" }
  ],
  vatTu:[
    { ten:"Áo phao cứu sinh", sl:"120 cái", noi:"Nhà văn hoá TDP", tt:"Sẵn sàng" },
    { ten:"Đèn pin sạc", sl:"8 cái", noi:"Nhà văn hoá TDP", tt:"Sẵn sàng" },
    { ten:"Loa tay cầm tay", sl:"4 cái", noi:"Tổ xung kích", tt:"Sẵn sàng" },
    { ten:"Bao tải cát, cuộn dây thừng", sl:"Đủ cơ số", noi:"Kho TDP", tt:"Sẵn sàng" },
    { ten:"Ghe, thuyền, phao tròn", sl:"2 thuyền / 4 phao", noi:"Kho TDP", tt:"Sẵn sàng" },
    { ten:"Máy phát điện dự phòng", sl:"1 cái (5kVA)", noi:"Nhà văn hoá TDP", tt:"Hoạt động tốt" }
  ],
  soDT:[
    { ten:"Tổ trưởng Tổ xung kích — ông Nguyễn Trọng Nghĩa", sdt:"0965 712 812" },
    { ten:"Tổ phó Tổ xung kích — ông Hoàng Hữu Rớt", sdt:"0965 943 303" },
    { ten:"Bí thư Chi bộ TDP — ông Hồ Văn Mão", sdt:"0962 481 112" },
    { ten:"Phụ trách Dân quân xung kích — ông Nguyễn Như Khải", sdt:"0388 886 876" },
    { ten:"Tổ trưởng ANTT cơ sở — ông Nguyễn Thúc Thành", sdt:"0975 175 361" },
    { ten:"Hậu cần & Phụ nữ — bà Nguyễn Thị Mừng", sdt:"0377 412 815" },
    { ten:"Người cao tuổi — ông Phan Đăng Chiến", sdt:"0913 469 434" },
    { ten:"Cựu chiến binh — ông Nguyễn Cường", sdt:"0981 710 242" },
    { ten:"Công an phường Hương Thủy (trực ban)", sdt:"0234 3852 870" }
  ],
  lichNgay:[
    { ngay:"Giai đoạn 1 (Phòng ngừa)", nd:"Kiểm đếm hộ gia đình, rà soát phương tiện cứu hộ, phân công nhiệm vụ cụ thể từng thành viên." },
    { ngay:"Giai đoạn 2 (Ứng phó)", nd:"Duy trì trực 24/24h, chốt chặn điểm ngập lũ, sơ tán người và di dời tài sản đến nơi an toàn." },
    { ngay:"Giai đoạn 3 (Khắc phục)", nd:"Thống kê thiệt hại, hỗ trợ nhân dân dọn dẹp vệ sinh môi trường, khử khuẩn nguồn nước, phòng chống dịch bệnh." }
  ]
};

/* ---------------- 10 CÁN BỘ CHỦ CHỐT (CÔNG KHAI) ----------------
   Nguồn: Danh sách cán bộ TDP Lương Hậu + Bảng phân công lĩnh vực/địa bàn do Chi bộ cung cấp.
   Số điện thoại là số liên hệ công vụ, công khai theo Luật Thực hiện dân chủ ở cơ sở 2022.
   TDP có 4 khu vực: Đội 8, Đội 9, Đội 10, Đội 11. */
const CADRES = [
  { stt:1, hoTen:"Hồ Văn Mão", ns:"1989", chucVu:"Bí thư Chi bộ",
    linhVuc:"Lãnh đạo chung & Xây dựng Đảng", doi:"Đội 11",
    nhiemVu:"Lãnh đạo toàn diện Chi bộ; công tác xây dựng Đảng; kiểm tra, giám sát; quản lý đảng viên; phụ trách Đội 11.",
    diaBan:"Phụ trách Đội 11", sdt:"0962 481 112", tt:"Chính thức", color:"#C8102E" },
  { stt:2, hoTen:"Nguyễn Trọng Nghĩa", ns:"1980", chucVu:"Phó Bí thư Chi bộ - Tổ trưởng TDP",
    linhVuc:"Chính quyền & Kinh tế - Xã hội", doi:"Đội 8",
    nhiemVu:"Tổ trưởng TDP; quản lý chính quyền, hành chính; quốc phòng - an ninh; thu các loại quỹ; treo cờ; phụ trách Đội 8.",
    diaBan:"Phụ trách Đội 8", sdt:"0965 712 812", tt:"Chính thức", color:"#0b4d97" },
  { stt:3, hoTen:"Hoàng Hữu Rớt", ns:"1978", chucVu:"Chi uỷ viên - Trưởng ban Công tác Mặt trận",
    linhVuc:"Mặt trận & Dân vận", doi:"Đội 9",
    nhiemVu:"Trưởng ban Công tác Mặt trận; đại đoàn kết; hoà giải ở cơ sở; tuyên truyền vận động, ngày Chủ nhật xanh; phụ trách Đội 9.",
    diaBan:"Phụ trách Đội 9", sdt:"0965 943 303", tt:"Chính thức", color:"#0b6b3d" },
  { stt:4, hoTen:"Nguyễn Thị Mừng", ns:"1979", chucVu:"Chi hội trưởng Chi hội Phụ nữ",
    linhVuc:"Phong trào Phụ nữ & Môi trường", doi:"Đội 9",
    nhiemVu:"Phát triển phong trào phụ nữ; thu đảng phí; phân loại rác; phụ trách Đội 9.",
    diaBan:"Phụ trách Đội 9", sdt:"0377 412 815", tt:"Chính thức", color:"#5b3bb5" },
  { stt:5, hoTen:"Nguyễn Thúc Thành", ns:"1970", chucVu:"Chi hội trưởng Chi hội Nông dân - Lực lượng ANTT cơ sở",
    linhVuc:"Kinh tế & Nông nghiệp · An ninh trật tự địa bàn", doi:"",
    nhiemVu:"Phong trào nông dân; phát triển kinh tế hộ; xây dựng nông nghiệp đô thị. Phòng chống tội phạm; tuần tra; phối hợp Công an phường.",
    diaBan:"Toàn TDP (4 khu vực: Đội 8 - 11)", sdt:"0975 175 361", tt:"Chính thức", color:"#33691e" },
  { stt:6, hoTen:"Nguyễn Cưỡng", ns:"1964", chucVu:"Chi hội trưởng Chi hội Cựu chiến binh",
    linhVuc:"Giáo dục truyền thống & ANTT", doi:"",
    nhiemVu:"Giáo dục truyền thống; giữ gìn ANTT; gương mẫu tại khu dân cư.",
    diaBan:"Toàn TDP (4 khu vực: Đội 8 - 11)", sdt:"0981 710 242", tt:"Chính thức", color:"#455a64" },
  { stt:7, hoTen:"Phan Đăng Chiến", ns:"1951", chucVu:"Chi hội trưởng Chi hội Người cao tuổi",
    linhVuc:"An sinh xã hội & Khuyến học", doi:"",
    nhiemVu:"Chăm sóc hội viên; khuyến học; xây dựng gia đình văn hoá.",
    diaBan:"Toàn TDP (4 khu vực: Đội 8 - 11)", sdt:"0913 469 434", tt:"Chính thức", color:"#ef6c00" },
  { stt:8, hoTen:"Nguyễn Thị Ngọc Tú", ns:"2003", chucVu:"Bí thư Chi đoàn Thanh niên",
    linhVuc:"Thanh niên & Chuyển đổi số", doi:"",
    nhiemVu:"Phong trào thanh niên; chuyển đổi số; ngày Chủ nhật xanh; văn nghệ.",
    diaBan:"Toàn TDP (4 khu vực: Đội 8 - 11)", sdt:"0386 003 175", tt:"Chính thức", color:"#0b7a86" },
  { stt:9, hoTen:"Nguyễn Như Khải", ns:"1993", chucVu:"Tổ đội trưởng Quân sự",
    linhVuc:"Quân sự & Địa bàn", doi:"Đội 10",
    nhiemVu:"Điều hành tổ đội; phối hợp ANTT; phụ trách địa bàn Đội 10.",
    diaBan:"Phụ trách Đội 10", sdt:"0388 886 876", tt:"Chính thức", color:"#d07d00" },
  { stt:10, hoTen:"Phạm Thị Thu Thanh", ns:"1987", chucVu:"Cộng tác viên Dân số - Y tế TDP",
    linhVuc:"Dân số - Y tế & An sinh", doi:"",
    nhiemVu:"Chăm sóc sức khoẻ ban đầu, sơ cấp cứu; theo dõi người cao tuổi, phụ nữ mang thai, trẻ em; công tác dân số - kế hoạch hoá gia đình.",
    diaBan:"Toàn TDP (4 khu vực: Đội 8 - 11)", sdt:"0332 886 309", tt:"Chính thức", color:"#c2185b" }
];

/* ---------------- KHO 11 BIỂU MẪU ---------------- */
const FORMS = [
  { id:"bm01", ten:"Đơn đề nghị xác nhận cư trú / thông tin cư trú", ma:"BM-01", linhVuc:"Cư trú",
    moTa:"Dùng khi cần xác nhận nơi cư trú, thời gian cư trú để nộp cơ quan, tổ chức.",
    canCu:"Luật Cư trú 2020; Thông tư 55/2021/TT-BCA", hoSo:"CCCD; giấy tờ chứng minh chỗ ở hợp pháp", thoiHan:"3 ngày làm việc", lePhi:"Miễn phí" },
  { id:"bm02", ten:"Tờ khai thay đổi thông tin cư trú (mẫu CT01)", ma:"BM-02", linhVuc:"Cư trú",
    moTa:"Kê khai khi thay đổi chủ hộ, thay đổi thông tin hộ tịch, tách hộ, điều chỉnh thông tin cư trú.",
    canCu:"Thông tư 66/2023/TT-BCA", hoSo:"CCCD; giấy tờ liên quan đến nội dung thay đổi", thoiHan:"5 ngày làm việc", lePhi:"Miễn phí" },
  { id:"bm03", ten:"Đơn đề nghị cấp Giấy xác nhận tình trạng hôn nhân", ma:"BM-03", linhVuc:"Hộ tịch",
    moTa:"Dùng để đăng ký kết hôn, mua bán tài sản, vay vốn, xuất cảnh.",
    canCu:"Nghị định 123/2015/NĐ-CP; Thông tư 04/2020/TT-BTP", hoSo:"CCCD; trích lục bản án ly hôn (nếu có)", thoiHan:"3 ngày làm việc", lePhi:"Miễn phí" },
  { id:"bm04", ten:"Giấy uỷ quyền giải quyết thủ tục hành chính", ma:"BM-04", linhVuc:"Dân sự",
    moTa:"Uỷ quyền cho người thân nộp hồ sơ, nhận kết quả khi bản thân không trực tiếp thực hiện được.",
    canCu:"Bộ luật Dân sự 2015", hoSo:"CCCD của bên uỷ quyền và bên được uỷ quyền", thoiHan:"Ngay khi tiếp nhận", lePhi:"Miễn phí" },
  { id:"bm05", ten:"Đơn đề nghị cấp Giấy phép xây dựng nhà ở riêng lẻ", ma:"BM-05", linhVuc:"Xây dựng",
    moTa:"Dùng khi xây mới, sửa chữa có thay đổi kết cấu chịu lực nhà ở riêng lẻ tại đô thị.",
    canCu:"Luật Xây dựng 2014 (sửa đổi 2020); Nghị định 15/2021/NĐ-CP", hoSo:"Giấy tờ về quyền sử dụng đất; 2 bộ bản vẽ thiết kế", thoiHan:"15 ngày", lePhi:"Theo quy định của HĐND thành phố" },
  { id:"bm06", ten:"Biên bản họp Tổ dân phố (bản chuẩn)", ma:"BM-06", linhVuc:"Nội bộ TDP",
    moTa:"Ghi chép hội nghị nhân dân, họp khu vực (đội), lấy ý kiến về các khoản đóng góp.",
    canCu:"Luật Thực hiện dân chủ ở cơ sở 2022", hoSo:"Danh sách đại biểu tham dự; phiếu biểu quyết", thoiHan:"Không áp dụng", lePhi:"Miễn phí" },
  { id:"bm07", ten:"Bản cam kết bảo đảm an toàn PCCC hộ gia đình", ma:"BM-07", linhVuc:"PCCC",
    moTa:"Chủ hộ cam kết thực hiện điều kiện an toàn PCCC; dùng cho tổ liên gia an toàn PCCC.",
    canCu:"Luật PCCC và CNCH 2024; Nghị định 105/2025/NĐ-CP", hoSo:"CCCD chủ hộ; sơ đồ thoát nạn của hộ", thoiHan:"Ngay khi tiếp nhận", lePhi:"Miễn phí" },
  { id:"bm08", ten:"Đơn đề nghị hỗ trợ thiệt hại do thiên tai", ma:"BM-08", linhVuc:"PCTT",
    moTa:"Kê khai thiệt hại về nhà ở, hoa màu, vật nuôi sau bão lũ để đề nghị hỗ trợ.",
    canCu:"Nghị định 20/2021/NĐ-CP; Nghị định 09/2025/NĐ-CP (sửa đổi)", hoSo:"Ảnh hiện trường; biên bản xác nhận của TDP", thoiHan:"15 ngày làm việc", lePhi:"Miễn phí" },
  { id:"bm09", ten:"Sơ yếu lý lịch (mẫu có xác nhận của địa phương)", ma:"BM-09", linhVuc:"Hành chính",
    moTa:"Dùng cho xin việc, nhập học, kết nạp Đảng, nghĩa vụ quân sự.",
    canCu:"Hướng dẫn của UBND cấp xã/phường", hoSo:"CCCD; ảnh 4x6", thoiHan:"3 ngày làm việc", lePhi:"Miễn phí" },
  { id:"bm10", ten:"Đơn đề nghị chứng thực bản sao từ bản chính", ma:"BM-10", linhVuc:"Chứng thực",
    moTa:"Dùng khi cần chứng thực bản sao giấy tờ để nộp nhiều nơi cùng lúc.",
    canCu:"Nghị định 23/2015/NĐ-CP", hoSo:"Bản chính và bản sao cần chứng thực", thoiHan:"Trong ngày", lePhi:"2.000 đ/trang; từ trang 3 trở lên 1.000 đ/trang" },
  { id:"bm11", ten:"Phiếu lấy ý kiến cử tri / nhân dân ở tổ dân phố", ma:"BM-11", linhVuc:"Dân chủ cơ sở",
    moTa:"Dùng khi tổ chức lấy ý kiến về hương ước, mức đóng góp, công khai ngân sách TDP.",
    canCu:"Luật Thực hiện dân chủ ở cơ sở 2022; Nghị định 59/2023/NĐ-CP", hoSo:"Danh sách cử tri của TDP", thoiHan:"Theo kế hoạch", lePhi:"Miễn phí" }
];

/* ---------------- CHUYÊN MỤC CHÍNH & LIÊN KẾT QUỐC GIA ---------------- */
const SECTIONS = [
  { icon:"news", label:"Tin tức 3 cấp", href:"#tintuc", color:"red" },
  { icon:"shield", label:"An ninh trật tự", href:"#antt", color:"blue" },
  { icon:"users", label:"Cán bộ chủ chốt", href:"#canbo", color:"green" },
  { icon:"doc", label:"11 biểu mẫu", href:"#bieumau", color:"amber" },
  { icon:"chat", label:"Phản ánh công dân", href:"#phananh", color:"purple" },
  { icon:"search", label:"Tra cứu thủ tục", href:"https://dichvucong.gov.vn", color:"gray" },
  { icon:"home", label:"Cổng TTĐT Huế", href:"https://hue.gov.vn", color:"teal" }
];

const LINKS = [
  { abbr:"CP", name:"Cổng TTĐT Chính phủ", url:"https://www.chinhphu.vn", color:"#0b4d97" },
  { abbr:"HC", name:"Hue-S / IOC Huế", url:"https://huecity.gov.vn", color:"#0b7a86" },
  { abbr:"DC", name:"Cổng DVC Quốc gia", url:"https://dichvucong.gov.vn", color:"#0f8a4d" },
  { abbr:"CS", name:"CSDL Quốc gia về dân cư", url:"https://csdl.dancuquocgia.gov.vn", color:"#5b3bb5" },
  { abbr:"ĐCS", name:"Báo Điện tử Đảng CSVN", url:"https://dangcongsan.vn", color:"#c8102e" },
  { abbr:"TV", name:"Tư liệu Văn kiện Đảng", url:"https://tulieuvankien.dangcongsan.vn", color:"#93061d" },
  { abbr:"QH", name:"Cổng TTĐT Quốc hội", url:"https://quochoi.vn", color:"#b21c2b" },
  { abbr:"TP", name:"Cổng TTĐT Bộ Tư pháp", url:"https://moj.gov.vn", color:"#37474f" },
  { abbr:"CA", name:"Cổng TTĐT Bộ Công an", url:"https://bocongan.gov.vn", color:"#1a237e" }
];

/* =====================================================================
   KHU NỘI BỘ
   ===================================================================== */

/* Danh sách đảng viên ĐÃ ĐƯỢC BÍ THƯ CHI BỘ PHÊ DUYỆT truy cập.
   Dữ liệu minh hoạ — thay bằng danh sách thật trước khi vận hành. */
/* ---------------- DANH SÁCH 22 ĐẢNG VIÊN CHI BỘ (NỘI BỘ) ----------------
   Nguồn: Danh sách đảng viên Chi bộ TDP Lương Hậu trực thuộc Đảng bộ phường Hương Thủy,
   kèm theo Quyết định số 46-QĐ/ĐU ngày 30/6/2026 của Đảng ủy phường Hương Thủy.
   Đối soát truy cập Khu nội bộ: HỌ VÀ TÊN + NGÀY/THÁNG/NĂM SINH (không dùng CCCD).
   DỮ LIỆU NHẠY CẢM — chỉ phục vụ nội bộ Chi bộ; khi vận hành chính thức phải chuyển
   danh sách này về máy chủ (API), không đặt trong tệp data.js tải được ở phía trình duyệt. */
const ROSTER = [
  { id:"dv01", stt:1,  hoTen:"Hồ Văn Mão",        ngaysinh:"02/02/1989", chucVu:"Bí thư Chi bộ",                        sdt:"0962 481 112", doi:"Đội 11", pheDuyet:"30/06/2026", vaiTro:"admin" },
  { id:"dv02", stt:2,  hoTen:"Nguyễn Trọng Nghĩa", ngaysinh:"17/05/1980", chucVu:"Phó Bí thư Chi bộ - Tổ trưởng TDP",     sdt:"0965 712 812", doi:"Đội 8", pheDuyet:"30/06/2026", vaiTro:"admin" },
  { id:"dv03", stt:3,  hoTen:"Hoàng Hữu Rớt",     ngaysinh:"23/08/1978", chucVu:"Chi uỷ viên - Trưởng ban CTMT",         sdt:"0965 943 303", doi:"Đội 9", pheDuyet:"30/06/2026", vaiTro:"admin" },
  { id:"dv04", stt:4,  hoTen:"Nguyễn Thị Mừng",   ngaysinh:"26/10/1979", chucVu:"Đảng viên - Chi hội trưởng Phụ nữ",     sdt:"0377 412 815", doi:"Đội 9", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv05", stt:5,  hoTen:"Ngô Thị Hoài Cẩm",  ngaysinh:"24/09/1989", chucVu:"Đảng viên",                            sdt:"0912 994 431", doi:"Đội 10", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv06", stt:6,  hoTen:"Phạm Sằng",         ngaysinh:"02/02/1956", chucVu:"Đảng viên",                            sdt:"0372 500 460", doi:"Đội 10", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv07", stt:7,  hoTen:"Lê Thị Thu Thủy",   ngaysinh:"30/04/1988", chucVu:"Đảng viên",                            sdt:"0912 721 759", doi:"Đội 8", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv08", stt:8,  hoTen:"Phạm Quang",        ngaysinh:"19/12/1981", chucVu:"Đảng viên",                            sdt:"0911 344 787", doi:"Đội 9", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv09", stt:9,  hoTen:"Nguyễn Cần",        ngaysinh:"12/08/1972", chucVu:"Đảng viên",                            sdt:"0946 580 955", doi:"Đội 9", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv10", stt:10, hoTen:"Nguyễn Như Khả",    ngaysinh:"20/08/1981", chucVu:"Đảng viên",                            sdt:"0935 022 236", doi:"Đội 10", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv11", stt:11, hoTen:"Lê Thị Thùy Dung",  ngaysinh:"20/02/1990", chucVu:"Đảng viên",                            sdt:"0973 156 625", doi:"Đội 10", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv12", stt:12, hoTen:"Phạm Phước Thành",  ngaysinh:"10/01/1975", chucVu:"Đảng viên",                            sdt:"0345 309 179", doi:"Đội 11", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv13", stt:13, hoTen:"Nguyễn Thị Huê",    ngaysinh:"10/10/1956", chucVu:"Đảng viên",                            sdt:"0332 062 150", doi:"Đội 9", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv14", stt:14, hoTen:"Lê Thị Bích Hạnh",  ngaysinh:"20/04/1994", chucVu:"Đảng viên",                            sdt:"0358 852 534", doi:"Đội 9", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv15", stt:15, hoTen:"Nguyễn Quang Ngọc", ngaysinh:"28/07/1987", chucVu:"Đảng viên",                            sdt:"0972 667 112", doi:"Đội 9", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv16", stt:16, hoTen:"Phạm Tiến",         ngaysinh:"29/12/1986", chucVu:"Đảng viên",                            sdt:"0984 920 085", doi:"Đội 9", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv17", stt:17, hoTen:"Nguyễn Thị Thủy",   ngaysinh:"12/09/1987", chucVu:"Đảng viên",                            sdt:"0986 658 502", doi:"Đội 9", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv18", stt:18, hoTen:"Hoàng Đình Cường",  ngaysinh:"10/04/1991", chucVu:"Đảng viên",                            sdt:"0935 567 976", doi:"Đội 10", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv19", stt:19, hoTen:"Nguyễn Văn Quân",   ngaysinh:"01/01/1999", chucVu:"Đảng viên",                            sdt:"0345 458 799", doi:"Đội 11", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv20", stt:20, hoTen:"Nguyễn Thúc Thông", ngaysinh:"28/01/1995", chucVu:"Đảng viên",                            sdt:"(chưa cập nhật)", doi:"Đội 8", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv21", stt:21, hoTen:"Phạm Thị Lưỡng",    ngaysinh:"23/07/1986", chucVu:"Đảng viên",                            sdt:"0988 212 249", doi:"Đội 9", pheDuyet:"30/06/2026", vaiTro:"user" },
  { id:"dv22", stt:22, hoTen:"Hồ Công Long",      ngaysinh:"23/09/1994", chucVu:"Đảng viên",                            sdt:"(chưa cập nhật)", doi:"Đội 10", pheDuyet:"30/06/2026", vaiTro:"user" }
];

/* Văn bản của Chi bộ TDP Lương Hậu (9 văn bản cốt lõi) */
const DOCS = [
  {
    loai: "CT",
    type: "tt",
    so: "01-CT/CB",
    ten: "Chương trình công tác toàn khóa của Chi bộ Tổ dân phố Lương Hậu, nhiệm kỳ 2025 - 2030",
    ngay: "04/07/2026",
    ky: "Hồ Văn Mão",
    fileDocx: "CHƯƠNG TRÌNH CÔNG TÁC TOÀN KHÓA.docx",
    trang: 5,
    noiDung: "Căn cứ Nghị quyết Đại hội Chi bộ nhiệm kỳ 2025 - 2030, Chi bộ TDP Lương Hậu ban hành Chương trình công tác toàn khóa nhằm bảo đảm sự lãnh đạo toàn diện trên các lĩnh vực: 1. Ban hành Hệ thống văn bản cốt lõi và phân công nhiệm vụ cụ thể cho 22 đảng viên phụ trách 4 cụm dân cư; 2. Duy trì nề nếp sinh hoạt chi bộ thường kỳ mùng 3 hằng tháng; 3. Tổ chức sinh hoạt chuyên đề theo quý; 4. Lãnh đạo thực hiện thắng lợi các nhiệm vụ KT-XH, ANTT trên địa bàn; 5. Kiểm điểm, đánh giá xếp loại đảng viên hằng năm."
  },
  {
    loai: "GS",
    type: "gs",
    so: "01-CT/KTGS",
    ten: "Chương trình kiểm tra, giám sát toàn khóa nhiệm kỳ 2025 - 2030 của Chi bộ TDP Lương Hậu",
    ngay: "03/07/2026",
    ky: "Hồ Văn Mão",
    fileDocx: "CHƯƠNG TRÌNH KIỂM TRA GIÁM SÁT TOÀN KHÓA.docx",
    trang: 6,
    noiDung: "Căn cứ Điều 30 Điều lệ Đảng và các quy định của Trung ương về công tác kiểm tra, giám sát: Nâng cao ý thức chấp hành kỷ luật Đảng, phòng ngừa vi phạm từ sớm, từ xa; giữ vững kỷ cương và đoàn kết nội bộ sau sáp nhập. Phân kỳ kiểm tra, giám sát hằng năm về việc chấp hành quy chế làm việc, trách nhiệm nêu gương, thực hiện nghĩa vụ công dân nơi cư trú theo Quy định 213-QĐ/TW."
  },
  {
    loai: "NQ",
    type: "nq",
    so: "02-NQ/CB",
    ten: "Nghị quyết số 02-NQ/CB về phương hướng, nhiệm vụ của Chi bộ TDP Lương Hậu nhiệm kỳ 2025 - 2030",
    ngay: "05/07/2026",
    ky: "Hồ Văn Mão",
    fileDocx: "NQ PHƯƠNG HƯỚNG NHIỆM VỤ NK 2025-2030.docx",
    trang: 5,
    noiDung: "Nghị quyết xác định phương hướng, nhiệm vụ nhiệm kỳ 2025 - 2030 của Chi bộ TDP Lương Hậu: 100% đảng viên hoàn thành nhiệm vụ (trên 85% hoàn thành tốt trở lên); Chi bộ đạt 'Hoàn thành tốt nhiệm vụ' trở lên; kết nạp 2 - 4 đảng viên mới; tỷ lệ gia đình văn hóa trên 97%; duy trì Ngày Chủ nhật xanh; nghiêm cấm rải vàng mã ra đường giao thông theo Quyết định 2322/QĐ-UBND của UBND TP. Huế."
  },
  {
    loai: "QĐ",
    type: "qd",
    so: "02-QĐ/CB",
    ten: "Quyết định số 02-QĐ/CB về việc phân công nhiệm vụ cụ thể đối với 22 đảng viên nhiệm kỳ 2025 - 2030",
    ngay: "05/07/2026",
    ky: "Hồ Văn Mão",
    fileDocx: "QĐ PHÂN CÔNG ĐẢNG VIÊN.docx",
    trang: 4,
    noiDung: "Phân công nhiệm vụ cụ thể theo phương châm '6 Rõ' cho toàn bộ 22 đảng viên của Chi bộ: đ/c Hồ Văn Mão (Bí thư Chi bộ, phụ trách chung, Đội 11); đ/c Nguyễn Trọng Nghĩa (Phó Bí thư Chi bộ, Tổ trưởng TDP, Đội 8); đ/c Hoàng Hữu Rớt (Chi ủy viên, Trưởng ban CTMT, Đội 9); đ/c Nguyễn Thị Mừng (Chi hội trưởng Phụ nữ, Đội 9) và 18 đồng chí đảng viên phụ trách theo dõi, hỗ trợ 469 hộ gia đình tại 4 khu vực."
  },
  {
    loai: "QC",
    type: "qd",
    so: "QC-01/CB-LH",
    ten: "Quy chế làm việc của Chi bộ Tổ dân phố Lương Hậu nhiệm kỳ 2025 - 2030",
    ngay: "10/08/2026",
    ky: "Hồ Văn Mão",
    fileDocx: "Quy_che_lam_viec_Chi_bo_TDP_Luong_Hau_nhiem_ky_2025_2030.docx",
    trang: 8,
    noiDung: "Quy chế làm việc gồm 4 Chương, 15 Điều quy định nguyên tắc tập trung dân chủ, tập thể lãnh đạo cá nhân phụ trách; trách nhiệm, quyền hạn của Chi bộ, Chi ủy, Bí thư, Phó Bí thư, Chi ủy viên và đảng viên; chế độ sinh hoạt thường kỳ ngày 03 hằng tháng, chế độ báo cáo và quan hệ công tác giữa Chi ủy với Tổ dân phố và Ban Công tác Mặt trận."
  },
  {
    loai: "TT",
    type: "tt",
    so: "12-TTr/CB",
    ten: "Hồ sơ và Tờ trình đề nghị kiện toàn, bổ sung Chi ủy Chi bộ Tổ dân phố Lương Hậu nhiệm kỳ 2025 - 2030",
    ngay: "15/08/2026",
    ky: "Hồ Văn Mão",
    fileDocx: "ho_so_bo_sung_Chi_uy_TDP_Luong_Hau.docx",
    trang: 6,
    noiDung: "Tờ trình kính gửi Ban Thường vụ Đảng ủy phường Hương Thủy về việc đề nghị chuẩn y kiện toàn bổ sung Chi ủy viên Chi bộ TDP Lương Hậu nhiệm kỳ 2025 - 2030 theo đúng quy trình 5 bước của Đảng; kèm theo biên bản kiểm phiếu tín nhiệm, sơ yếu lý lịch 2C và bản tự kiểm điểm của nhân sự được giới thiệu."
  },
  {
    loai: "NQ",
    type: "nq",
    so: "09-NQ/CB (DT)",
    ten: "Dự thảo Nghị quyết sinh hoạt Chi bộ thường kỳ tháng 9/2026",
    ngay: "03/09/2026",
    ky: "Hồ Văn Mão",
    fileDocx: "DU_THAO_NGHI_QUYET_CHI_BO_T9_2026.docx",
    trang: 4,
    noiDung: "Đánh giá công tác tháng 8/2026 và triển khai nhiệm vụ trọng tâm tháng 9/2026: Chủ động phòng chống bão lụt trước mùa mưa, phát tỉa cây xanh kiệt xóm, khơi thông dòng chảy; chuẩn bị chu đáo Tết Trung thu 2026 cho thiếu nhi; quản lý 74 thanh niên trong độ tuổi nghĩa vụ quân sự và hoàn thiện hồ sơ kết nạp đảng viên mới."
  },
  {
    loai: "BC",
    type: "bb",
    so: "05-BC/DVK",
    ten: "Báo cáo tổng hợp các mô hình “Dân vận khéo” Chi bộ Tổ dân phố Lương Hậu",
    ngay: "22/08/2026",
    ky: "Hoàng Hữu Rớt",
    fileDocx: "TỔNG HỢP MÔ HÌNH DÂN VẬN KHÉO LƯƠNG HẬU.docx",
    trang: 7,
    noiDung: "Báo cáo tổng kết các mô hình 'Dân vận khéo' tiêu biểu: Vận động 100% hộ dân hiến đất, tháo dỡ hàng rào bê tông hóa kiệt 51 Thái Thuận; mô hình xã hội hóa Tuyến đường cờ Tổ quốc tại 14 cổng chào; mô hình Tổ liên gia an toàn PCCC & Zalo kết nối bình yên; duy trì Ngày Chủ nhật xanh sáng - xanh - sạch - đẹp."
  },
  {
    loai: "NQ",
    type: "nq",
    so: "03-NQ/CĐ-CB",
    ten: "Nghị quyết chuyên đề về “Đẩy mạnh chuyển đổi số trên địa bàn TDP Lương Hậu gắn với vai trò tiên phong của đảng viên”",
    ngay: "18/08/2026",
    ky: "Hồ Văn Mão",
    fileDocx: "Nghi_quyet_Chuyen_de_Chuyen_doi_so_TDP_Luong_Hau.docx",
    trang: 5,
    noiDung: "Nghị quyết chuyên đề xác định 5 nhiệm vụ đột phá: 100% đảng viên sử dụng Sổ tay Đảng viên điện tử Thừa Thiên Huế; tuyên truyền hướng dẫn 100% hộ dân cài đặt Hue-S và VNeID mức 2; mỗi đảng viên hướng dẫn ít nhất 1 hộ dân nộp hồ sơ dịch vụ công trực tuyến; thúc đẩy thanh toán không dùng tiền mặt (mã QR); phổ biến quy tắc '6 KHÔNG' phòng chống lừa đảo trên mạng."
  }
];

/* Văn bản mới của Trung ương */
const DOCS_TW = [
  { so:"556-QĐ/VPTW", ngay:"06/09/2026", cq:"Văn phòng Trung ương Đảng", ky:"Võ Thành Hưng",
    ten:"Ban hành Quy định về xây dựng, triển khai, nghiệm thu, quản lý và vận hành hệ thống thông tin trong các cơ quan Đảng",
    tomTat:"Quy định thống nhất quy trình quản lý hệ thống thông tin: xác định chủ quản hệ thống, đơn vị vận hành, chủ quản dữ liệu; dữ liệu tạo lập một lần tại nguồn có thẩm quyền, bảo đảm đúng - đủ - sạch - cập nhật. Trong 6 tháng kể từ ngày hiệu lực, cơ quan chủ quản phải hoàn thành lập danh mục, phân loại hệ thống đang vận hành.",
    lienHe:"Là căn cứ để xây dựng Khu nội bộ Chi bộ; Cổng TTĐT TDP phải có chủ quản dữ liệu, phân quyền và nhật ký truy cập." },
  { so:"213-KH/VPTW", ngay:"05/09/2026", cq:"Văn phòng Trung ương Đảng", ky:"Văn phòng Trung ương Đảng",
    ten:"Kế hoạch chuyển đổi số trong hệ thống Văn phòng cấp uỷ giai đoạn 2026 - 2030",
    tomTat:"Đẩy mạnh chuyển đổi số trong hệ thống Văn phòng cấp uỷ; số hoá văn bản, điều hành tác nghiệp trên môi trường điện tử, kết nối liên thông từ Trung ương đến cấp xã.",
    lienHe:"TDP Lương Hậu triển khai Sổ tay Đảng viên điện tử Thừa Thiên Huế và số hoá 100% văn bản của Chi bộ theo lộ trình này." },
  { so:"91-KL/TW", ngay:"03/09/2026", cq:"Ban Bí thư", ky:"Trần Cẩm Tú",
    ten:"Kết luận về tổ chức kỷ niệm các ngày lễ lớn và sự kiện lịch sử quan trọng của đất nước giai đoạn 2026 - 2030",
    tomTat:"Yêu cầu tổ chức kỷ niệm các ngày lễ lớn phải hướng về Nhân dân, lấy giá trị lịch sử, chính trị, văn hoá, giáo dục làm trọng tâm; thành lập Ban Chỉ đạo Trung ương; chủ động đấu tranh phản bác quan điểm sai trái, xuyên tạc lịch sử.",
    lienHe:"Chi bộ đưa nội dung tuyên truyền các ngày lễ lớn giai đoạn 2026-2030 vào sinh hoạt chuyên đề và kế hoạch công tác năm." },
  { so:"27-NQ/TW", ngay:"28/08/2026", cq:"Bộ Chính trị", ky:"Tô Lâm",
    ten:"Nghị quyết về phát triển các vùng và tổ chức không gian phát triển quốc gia trong giai đoạn mới, tầm nhìn đến năm 2045",
    tomTat:"Phát triển vùng là phương thức tổ chức tăng trưởng quốc gia; tổ chức lại không gian phát triển theo hướng đa tầng, đa cực, liên kết đồng bộ; khoa học công nghệ, đổi mới sáng tạo và chuyển đổi số là động lực chính của tăng trưởng.",
    lienHe:"Thành phố Huế thuộc vùng Bắc Trung Bộ; Chi bộ tổ chức quán triệt tại hội nghị nhân dân tháng 9/2026." }
];

/* Phân công nhiệm vụ “6 RÕ” — tổng 870/10 = 87,0% (Xuất sắc) */
/* Phân công nhiệm vụ “6 RÕ” — tổng 870/10 = 87,0% (Xuất sắc) */
const TASKS = [
  { hoTen:"Hồ Văn Mão", chucVu:"Bí thư Chi bộ",
    viec:"Chủ trì sinh hoạt chi bộ; quán triệt 556-QĐ/VPTW, 213-KH/VPTW, 91-KL/TW, 27-NQ/TW; phê duyệt danh sách 22 đảng viên truy cập Khu nội bộ",
    sanPham:"Nghị quyết 09-NQ/CB; Thông báo 15-TB/CB; 4 buổi quán triệt; danh sách đối soát theo Quyết định 46-QĐ/ĐU",
    han:"30/09/2026", quyTrinh:"Chuẩn bị nội dung → Sinh hoạt → Biểu quyết → Ban hành → Báo cáo Đảng uỷ",
    trachNhiem:"Chịu trách nhiệm trước Đảng uỷ phường Hương Thủy về toàn bộ công tác xây dựng Đảng của Chi bộ",
    pct:96, trangThai:"Hoàn thành trước hạn", ro:{ nguoi:100, viec:96, thoiGian:95, quyTrinh:94, sanPham:97, trachNhiem:95 } },
  { hoTen:"Nguyễn Trọng Nghĩa", chucVu:"Phó Bí thư Chi bộ - Tổ trưởng TDP",
    viec:"Quản lý Sổ tay Đảng viên điện tử; cập nhật hồ sơ 22 đảng viên; soạn Tờ trình kết nạp đảng viên mới; Tổ trưởng Tổ xung kích PCTT&TKCN năm 2026",
    sanPham:"Tờ trình 11-TTr/CB; 22/22 hồ sơ cập nhật trên sotaydangvien.hue.gov.vn; Kế hoạch phân công nhiệm vụ Tổ xung kích PCTT&TKCN năm 2026",
    han:"25/09/2026", quyTrinh:"Rà soát hồ sơ → Đối soát họ tên, ngày sinh → Cập nhật hệ thống → Trình Bí thư ký",
    trachNhiem:"Bảo đảm tính chính xác, bảo mật dữ liệu đảng viên theo 556-QĐ/VPTW; sẵn sàng lực lượng ứng phó thiên tai",
    pct:94, trangThai:"Đúng tiến độ", ro:{ nguoi:95, viec:94, thoiGian:93, quyTrinh:94, sanPham:95, trachNhiem:93 } },
  { hoTen:"Hoàng Hữu Rớt", chucVu:"Chi uỷ viên - Trưởng ban CTMT",
    viec:"Công tác Mặt trận, dân vận; giám sát thực hiện Quy chế dân chủ ở cơ sở; Tổ phó Tổ xung kích PCTT&TKCN; tổng hợp ý kiến nhân dân",
    sanPham:"Kế hoạch giám sát 03-KH/GS; phương án hậu cần PCTT; báo cáo tổng hợp ý kiến nhân dân",
    han:"12/09/2026", quyTrinh:"Rà soát hộ → Vận động → Bố trí điểm sơ tán → Giám sát → Báo cáo Chi bộ",
    trachNhiem:"Không để hộ dân nào thiếu lương thực, nước uống quá 24 giờ; kiến nghị của nhân dân được trả lời đúng hạn",
    pct:92, trangThai:"Đang triển khai - cao điểm", ro:{ nguoi:94, viec:93, thoiGian:90, quyTrinh:92, sanPham:91, trachNhiem:93 } },
  { hoTen:"Nguyễn Thị Mừng", chucVu:"Chi hội trưởng Phụ nữ",
    viec:"Hậu cần 3 điểm sơ tán; bếp ăn phục vụ lực lượng trực; quản lý vốn vay tín chấp NHCSXH; chăm sóc phụ nữ mang thai, trẻ nhỏ",
    sanPham:"Bếp ăn 120 suất/ngày; bảng kê cấp phát nhu yếu phẩm; sổ theo dõi 9 phụ nữ mang thai",
    han:"17/09/2026", quyTrinh:"Lập nhu cầu → Tiếp nhận vật tư → Nấu, cấp phát → Thanh quyết toán → Báo cáo",
    trachNhiem:"Bảo đảm vệ sinh an toàn thực phẩm; không để xảy ra thất thoát nhu yếu phẩm cứu trợ",
    pct:91, trangThai:"Đang triển khai", ro:{ nguoi:92, viec:91, thoiGian:90, quyTrinh:90, sanPham:92, trachNhiem:91 } },
  { hoTen:"Nguyễn Thúc Thành", chucVu:"Chi hội trưởng Nông dân - Tổ trưởng LL ANTT cơ sở",
    viec:"Tiêu úng 780m kênh nội đồng; gia cố 30 bao tải tại 2 vị trí xung yếu; duy trì 3 ca tuần tra đêm/tuần; bảo vệ tài sản nhân dân",
    sanPham:"Biên bản khơi thông kênh; nhật ký 6 ca tuần tra; bảng kê thiệt hại hoa màu, vật nuôi gửi UBND phường",
    han:"16/09/2026", quyTrinh:"Khơi thông → Gia cố → Tuần tra đêm → Theo dõi mực nước → Thống kê thiệt hại → Đề xuất hỗ trợ (BM-08)",
    trachNhiem:"Giảm thiểu thiệt hại sản xuất nông nghiệp; giữ vững ANTT địa bàn, không để xảy ra trộm cắp trong thời gian sơ tán",
    pct:90, trangThai:"Đúng tiến độ", ro:{ nguoi:91, viec:90, thoiGian:89, quyTrinh:90, sanPham:91, trachNhiem:90 } },
  { hoTen:"Nguyễn Cưỡng", chucVu:"Chi hội trưởng Cựu chiến binh",
    viec:"Bảo vệ tài sản nhân dân tại khu sơ tán; tham gia tổ hoà giải ở cơ sở; giáo dục truyền thống cho thanh thiếu niên",
    sanPham:"Kế hoạch bảo vệ 3 điểm sơ tán; 1 báo cáo giám sát chuyên đề; 1 buổi nói chuyện truyền thống",
    han:"30/09/2026", quyTrinh:"Phân công ca gác → Tuần tra khu sơ tán → Lập biên bản sự việc → Báo cáo chi bộ",
    trachNhiem:"Không để mất mát tài sản của nhân dân trong thời gian sơ tán",
    pct:88, trangThai:"Đúng tiến độ", ro:{ nguoi:90, viec:88, thoiGian:86, quyTrinh:88, sanPham:89, trachNhiem:87 } },
  { hoTen:"Phan Đăng Chiến", chucVu:"Chi hội trưởng Người cao tuổi",
    viec:"Tuyên truyền người cao tuổi chủ động an toàn mùa mưa bão; nắm danh sách cụ già neo đơn, ốm đau; động viên tinh thần nhân dân",
    sanPham:"Danh sách người cao tuổi cần hỗ trợ; sổ theo dõi hội viên neo đơn; nhật ký thăm hỏi",
    han:"11/09/2026", quyTrinh:"Rà soát hội viên → Hỗ trợ di dời sớm → Ổn định tâm lý → Phối hợp lực lượng xung kích",
    trachNhiem:"An toàn tính mạng người cao tuổi; không để người già neo đơn gặp nguy hiểm khi có thiên tai",
    pct:86, trangThai:"Đúng tiến độ", ro:{ nguoi:90, viec:86, thoiGian:84, quyTrinh:86, sanPham:86, trachNhiem:88 } },
  { hoTen:"Nguyễn Thị Ngọc Tú", chucVu:"Bí thư Chi đoàn Thanh niên",
    viec:"Chuyển đổi số cộng đồng: hướng dẫn Hue-S, VNeID mức 2, Dịch vụ công; đội xung kích kê kích nhà dân",
    sanPham:"Chỉ tiêu 66 hộ (22 đảng viên × 3 hộ); 2 buổi hướng dẫn tập trung tại Nhà văn hoá TDP",
    han:"30/10/2026", quyTrinh:"Lập danh sách hộ → Phân công đảng viên, đoàn viên → Hướng dẫn tại nhà → Đối chiếu trên hệ thống",
    trachNhiem:"Bảo đảm chỉ tiêu Nghị quyết 09-NQ/CB về chuyển đổi số ở khu dân cư",
    pct:84, trangThai:"Đúng tiến độ", ro:{ nguoi:86, viec:84, thoiGian:83, quyTrinh:84, sanPham:84, trachNhiem:84 } },
  { hoTen:"Nguyễn Như Khải", chucVu:"Tổ đội trưởng Quân sự",
    viec:"Chốt chặn điểm ngập ngã ba Lương Hậu - Lương Xuân; điều hành lực lượng dân quân 3 ca trực; cứu hộ cứu nạn",
    sanPham:"Biên bản chốt chặn; phương án hiệp đồng dân quân; sổ trực 3 ca/ngày",
    han:"17/09/2026", quyTrinh:"Khảo sát điểm xung yếu → Chuẩn bị biển báo, rào chắn → Trực chốt → Ghi biên bản → Bàn giao ca",
    trachNhiem:"An toàn tuyệt đối cho người và phương tiện qua lại khu vực ngập; quân số trực đạt 100%",
    pct:77, trangThai:"Chậm 1 hạng mục - đang khắc phục", ro:{ nguoi:80, viec:78, thoiGian:72, quyTrinh:76, sanPham:78, trachNhiem:78 } },
  { hoTen:"Phạm Thị Thu Thanh", chucVu:"Cộng tác viên Dân số - Y tế TDP",
    viec:"Trực sơ cấp cứu tại điểm sơ tán; theo dõi 46 người cao tuổi, 9 phụ nữ mang thai; khử khuẩn khu sơ tán",
    sanPham:"Sổ theo dõi sức khoẻ; 2 túi thuốc cơ số; nhật ký trực y tế",
    han:"17/09/2026", quyTrinh:"Rà soát đối tượng → Chuẩn bị cơ số thuốc → Trực tại điểm → Chuyển tuyến khi vượt khả năng",
    trachNhiem:"Không để xảy ra dịch bệnh sau mưa lũ; xử trí kịp thời ca cấp cứu",
    pct:72, trangThai:"Cần tăng cường lực lượng hỗ trợ", ro:{ nguoi:78, viec:74, thoiGian:68, quyTrinh:70, sanPham:72, trachNhiem:74 } }
];

/* Nhật ký đối soát / truy cập Khu nội bộ */
const AUDIT_SEED = [
  { t:"09/09/2026 20:14:07", m:"Bí thư Chi bộ Hồ Văn Mão phê duyệt danh sách 22 đảng viên truy cập Khu nội bộ (Thông báo 15-TB/CB, theo Quyết định 46-QĐ/ĐU ngày 30/6/2026)", c:"ok" },
  { t:"09/09/2026 20:16:52", m:"Đồng bộ dữ liệu đảng viên từ sotaydangvien.hue.gov.vn - 22 hồ sơ", c:"" },
  { t:"10/09/2026 06:58:31", m:"Kích hoạt Kế hoạch phân công nhiệm vụ Tổ xung kích PCTT&TKCN năm 2026 (theo QĐ 1229/QĐ-UBND)", c:"wr" },
  { t:"11/09/2026 07:02:19", m:"Đăng tải 4 văn bản mới của Trung ương (556-QĐ/VPTW, 213-KH/VPTW, 91-KL/TW, 27-NQ/TW)", c:"" },
  { t:"11/09/2026 08:40:05", m:"Chuyển phương thức đối soát truy cập từ CCCD sang Họ tên + Ngày tháng năm sinh theo Quyết định 46-QĐ/ĐU", c:"wr" }
];

/* Danh mục 6 văn bản mới của Đảng ủy phường Hương Thủy & Thành ủy Huế (đợt tháng 9/2026) */
const DOCS_NEW = [
  {
    id: "vb-333",
    soHieu: "333/KH-UBND",
    ngayBanHanh: "12/06/2026",
    coQuan: "UBND thành phố Huế",
    trichYeu: "Giao chỉ tiêu thực hiện kê khai đăng ký đất đai, hoàn thiện hồ sơ địa chính và xây dựng, hoàn thiện cơ sở dữ liệu đất đai trên địa bàn thành phố Huế năm 2026",
    canCu: "Kế hoạch số 2959/KH-BNNMT-BCA; Chỉ đạo của UBND tỉnh Thừa Thiên Huế",
    hanXuLy: "Năm 2026 (Báo cáo định kỳ hàng tháng)",
    loaiVanBan: "Kế hoạch",
    trangThai: "DangXuLy",
    linkNguonChinhThong: "https://hue.gov.vn/Trang-chu/He-thong-van-ban-phap-luat/doc/all/vb/59799",
    canBoPhuTrach: "Đ/c Hồ Văn Mão (Bí thư Chi bộ) — Chỉ đạo chung; Đ/c Nguyễn Trọng Nghĩa (Tổ trưởng TDP) — Chủ trì rà soát; Đ/c Hoàng Hữu Rớt (Trưởng ban CTMT) — Phối hợp giám sát",
    fileDinhKem: "333_KH_UBND_Hue_Dat_Dai_2026.pdf",
    tepDinhKem: [
      {
        tenTep: "Phụ lục 3: Chỉ tiêu kê khai đất đai",
        duongDanXem: "https://drive.google.com/file/d/ID_FILE_PL3/view",
        duongDanTai: "/documents/ke-hoach-333-phu-luc-3.pdf"
      },
      {
        tenTep: "Phụ lục 4: Tiến độ và biểu mẫu địa chính",
        duongDanXem: "https://drive.google.com/file/d/ID_FILE_PL4/view",
        duongDanTai: "/documents/ke-hoach-333-phu-luc-4.pdf"
      },
      {
        tenTep: "Phụ lục 5: Cơ chế phối hợp Công an & Địa chính",
        duongDanXem: "https://drive.google.com/file/d/ID_FILE_PL5/view",
        duongDanTai: "/documents/ke-hoach-333-phu-luc-5.pdf"
      }
    ],
    noiDungChiTiet: "I. MỤC TIÊU VÀ CHỈ TIÊU KÊ KHAI ĐẤT ĐAI NĂM 2026:\n- Thực hiện Kế hoạch số 333/KH-UBND ngày 12/06/2026 của UBND thành phố Huế (đồng chí Hà Văn Tuấn - Phó Chủ tịch UBND TP ký) về giao chỉ tiêu thực hiện kê khai đăng ký đất đai, hoàn thiện hồ sơ địa chính và cơ sở dữ liệu đất đai kết nối CSDL quốc gia về dân cư.\n- 100% thửa đất ở, đất nông nghiệp, đất công trình của 469 hộ gia đình tại 4 khu vực (Đội 8, 9, 10, 11) phải được kiểm đếm, kê khai và đồng bộ dữ liệu số.\n\nII. PHÂN CÔNG NHIỆM VỤ CỤ THỂ (NGUYÊN TẮC 6 RÕ):\n1. Đ/c Hồ Văn Mão (Bí thư Chi bộ): Chỉ đạo toàn diện công tác quán triệt, đưa nội dung kê khai đất đai vào Nghị quyết sinh hoạt chi bộ; giám sát trách nhiệm nêu gương của 22 đảng viên.\n2. Đ/c Nguyễn Trọng Nghĩa (Phó Bí thư Chi bộ - Tổ trưởng TDP): Trực tiếp điều hành rà soát hiện trạng sử dụng đất của 469 hộ dân; hướng dẫn người dân điền biểu mẫu địa chính theo Phụ lục 4; tiếp nhận phản ánh, vướng mắc để báo cáo UBND phường.\n3. Đ/c Hoàng Hữu Rớt (Trưởng ban Công tác Mặt trận): Chủ trì tuyên truyền, vận động nhân dân qua hệ thống loa truyền thanh và cuộc họp 4 khu vực; thực hiện giám sát dân chủ ở cơ sở.\n4. Đ/c Nguyễn Thúc Thành (Lực lượng bảo vệ ANTT cơ sở) & Đ/c Nguyễn Cưỡng (Hội Cựu chiến binh): Phối hợp Công an phường Hương Thủy và cán bộ Địa chính triển khai quy chế xác minh nhân khẩu gắn với chủ sử dụng đất theo Phụ lục 5.\n\nIII. DANH MỤC PHỤ LỤC & TỆP ĐÍNH KÈM:\n- Phụ lục 3: Chỉ tiêu kê khai đất đai phân bổ cho phường Hương Thủy và TDP Lương Hậu.\n- Phụ lục 4: Tiến độ thực hiện và hệ thống biểu mẫu kê khai địa chính chuẩn.\n- Phụ lục 5: Cơ chế và quy chế phối hợp giữa lực lượng Công an và cán bộ Địa chính trong đối soát CSDL dân cư.\n- Nguồn văn bản pháp luật chính thống: https://hue.gov.vn/Trang-chu/He-thong-van-ban-phap-luat/doc/all/vb/59799"
  },
  {
    id: "vb-01",
    soHieu: "33-HD/ĐU",
    ngayBanHanh: "14/09/2026",
    coQuan: "Đảng ủy phường Hương Thủy",
    trichYeu: "Hướng dẫn triển khai thực hiện Kết luận số 83-KL/TW của Bộ Chính trị về một số giải pháp đột phá phát triển ngành công nghiệp vật liệu trên địa bàn",
    canCu: "Kết luận số 83-KL/TW ngày 21/6/2024 của Bộ Chính trị; Kế hoạch hành động số 142-KH/TU của Thành ủy Huế",
    hanXuLy: "Tháng 9/2026",
    loaiVanBan: "Hướng dẫn",
    trangThai: "DangXuLy",
    canBoPhuTrach: "Đ/c Hồ Văn Mão (Bí thư Chi bộ) — Chủ trì quán triệt, chỉ đạo triển khai",
    fileDinhKem: "33_HD_DU_Huong_Thuy_KL83.pdf",
    noiDungChiTiet: "I. MỤC ĐÍCH, YÊU CẦU:\n- Quán triệt sâu sắc Kết luận 83-KL/TW về giải pháp đột phá phát triển công nghiệp vật liệu, nâng cao nhận thức của cán bộ, đảng viên và nhân dân.\n- Gắn việc ứng dụng công nghệ vật liệu mới, vật liệu xanh, thân thiện với môi trường vào các công trình hạ tầng dân sinh tại 4 khu vực của TDP.\nII. NHIỆM VỤ TRỌNG TÂM:\n1. Tuyên truyền, vận động 469 hộ gia đình ưu tiên sử dụng vật liệu xây dựng không nung, vật liệu tái chế thân thiện với môi trường.\n2. Lồng ghép nội dung bảo vệ môi trường, phát triển bền vững vào tiêu chí xây dựng gia đình văn hóa và nếp sống văn minh đô thị.\nIII. TỔ CHỨC THỰC HIỆN:\n- Đ/c Hồ Văn Mão (Bí thư Chi bộ) trực tiếp chủ trì quán triệt trong sinh hoạt Chi bộ thường kỳ ngày 03/10/2026.\n- Đ/c Nguyễn Trọng Nghĩa (Phó Bí thư - Tổ trưởng TDP) phối hợp thông tin tuyên truyền trên hệ thống loa truyền thanh và nhóm Zalo TDP."
  },
  {
    id: "vb-02",
    soHieu: "02-CT/ĐU",
    ngayBanHanh: "14/09/2026",
    coQuan: "Đảng ủy phường Hương Thủy",
    trichYeu: "Chỉ thị về việc tăng cường sự lãnh đạo của Đảng đối với công tác phát triển người tham gia bảo hiểm xã hội tự nguyện, bảo hiểm y tế hộ gia đình giai đoạn 2026 - 2030",
    canCu: "Nghị quyết số 28-NQ/TW của Ban Chấp hành Trung ương khóa XII; Chỉ đạo của Ban Thường vụ Thành ủy Huế",
    hanXuLy: "Thường xuyên / Định kỳ",
    loaiVanBan: "Chỉ thị",
    trangThai: "DangXuLy",
    canBoPhuTrach: "Đ/c Nguyễn Trọng Nghĩa (Phó Bí thư Chi bộ - Tổ trưởng TDP), Đ/c Nguyễn Thị Mừng (Chi hội trưởng Phụ nữ), Đ/c Phạm Thị Thu Thanh (Cộng tác viên Y tế)",
    fileDinhKem: "02_CT_DU_Huong_Thuy_BHXH_BHYT.pdf",
    noiDungChiTiet: "I. MỤC TIÊU:\n- Phấn đấu đến hết năm 2026: Tỷ lệ bao phủ BHYT toàn TDP đạt trên 96.5%; phát triển mới ít nhất 25 người tham gia BHXH tự nguyện.\n- 100% cán bộ, đảng viên trong Chi bộ gương mẫu đi đầu tham gia BHYT và BHXH tự nguyện cho người thân trong gia đình.\nII. NHIỆM VỤ CỤ THỂ:\n1. Rà soát, lập danh sách số nhân khẩu chưa tham gia BHYT và lao động tự do có tiềm năng tham gia BHXH tự nguyện tại 4 khu vực (Đội 8, 9, 10, 11).\n2. Tổ chức tư vấn trực tiếp tại nhà văn hóa TDP; phối hợp cơ quan BHXH khu vực giải đáp chính sách hỗ trợ đóng của Nhà nước.\nIII. PHÂN CÔNG THỰC HIỆN:\n- Đ/c Nguyễn Trọng Nghĩa (Phó Bí thư - Tổ trưởng TDP) chỉ đạo lập danh sách rà soát.\n- Đ/c Nguyễn Thị Mừng (Chi hội trưởng Chi hội Phụ nữ) và Đ/c Phạm Thị Thu Thanh (Cộng tác viên Y tế - Dân số) trực tiếp đến từng hộ vận động."
  },
  {
    id: "vb-03",
    soHieu: "32-HD/ĐU",
    ngayBanHanh: "14/09/2026",
    coQuan: "Đảng ủy phường Hương Thủy",
    trichYeu: "Hướng dẫn triển khai Kết luận số 56-KL/TW của Bộ Chính trị về tiếp tục tăng cường sự lãnh đạo của Đảng đối với công tác phòng, chống tội phạm trong tình hình mới",
    canCu: "Kết luận số 56-KL/TW của Bộ Chính trị; Hướng dẫn của Đảng ủy phường và Ban Chỉ đạo 138 thành phố Huế",
    hanXuLy: "Hoàn thành: 21/09/2026; Báo cáo: 23/09/2026",
    loaiVanBan: "Hướng dẫn",
    trangThai: "KhanCap",
    canBoPhuTrach: "Đ/c Nguyễn Trọng Nghĩa (Tổ trưởng TDP) & Đ/c Nguyễn Thúc Thành (Lực lượng bảo vệ ANTT cơ sở)",
    fileDinhKem: "32_HD_DU_Huong_Thuy_KL56_PCTP.pdf",
    noiDungChiTiet: "I. MỤC ĐÍCH, YÊU CẦU:\n- Tăng cường kỷ cương, giữ vững an ninh trật tự địa bàn giáp ranh, không để phát sinh tụ điểm phức tạp về tệ nạn xã hội.\n- Báo cáo kết quả rà soát ANTT gửi về Đảng ủy phường trước ngày 23/09/2026.\nII. NỘI DUNG TRIỂN KHAI KHẨN CẤP:\n1. Mở đợt cao điểm tuần tra nhân dân ban đêm tại các tuyến kiệt, ngõ vắng thuộc Đội 8 và Đội 10.\n2. Củng cố 4 Tổ liên gia an toàn PCCC; kiểm tra chuông báo cháy và lối thoát nạn tại 100% hộ dân.\n3. Vận động nhân dân tích cực tố giác tội phạm qua số điện thoại Công an phường (0234.3852.870) và đường dây nóng TDP.\nIII. PHÂN CÔNG TRÁCH NHIỆM:\n- Đ/c Nguyễn Trọng Nghĩa (Phó Bí thư - Tổ trưởng TDP) chủ trì xây dựng lịch tuần tra đêm.\n- Đ/c Nguyễn Thúc Thành (Tổ bảo vệ ANTT cơ sở) phối hợp Cảnh sát khu vực phụ trách địa bàn tiến hành kiểm tra, tổng hợp số liệu báo cáo Đảng ủy đúng hạn ngày 23/09/2026."
  },
  {
    id: "vb-04",
    soHieu: "72-KH/ĐU",
    ngayBanHanh: "14/09/2026",
    coQuan: "Đảng ủy phường Hương Thủy",
    trichYeu: "Kế hoạch triển khai thực hiện Nghị quyết số 23-NQ/TW và Kết luận số 12-KL/TW của Bộ Chính trị về công tác người Việt Nam ở nước ngoài trong tình hình mới",
    canCu: "Nghị quyết số 23-NQ/TW; Kế hoạch số 158-KH/TU của Ban Thường vụ Thành ủy Huế",
    hanXuLy: "Hoàn thành: 30/09/2026; Báo cáo: 05/10/2026",
    loaiVanBan: "Kế hoạch",
    trangThai: "SapDenHan",
    canBoPhuTrach: "Đ/c Hoàng Hữu Rớt (Chi uỷ viên - Trưởng ban Công tác Mặt trận)",
    fileDinhKem: "72_KH_DU_Huong_Thuy_NQ23_NVNONN.pdf",
    noiDungChiTiet: "I. MỤC ĐÍCH:\n- Phát huy nguồn lực kiều bào đóng góp xây dựng quê hương; gắn kết thân nhân kiều bào đang sinh sống tại TDP Lương Hậu.\nII. NHIỆM VỤ:\n1. Thống kê, cập nhật danh sách các hộ có thân nhân ở nước ngoài trên địa bàn 4 khu vực.\n2. Tuyên truyền chủ trương của Đảng, Nhà nước và chính sách thu hút đầu tư, an sinh của thành phố Huế.\n3. Vận động kiều bào tích cực tham gia các hoạt động thiện nguyện, khuyến học, xây dựng cảnh quan địa phương.\nIII. PHÂN CÔNG THỰC HIỆN:\n- Đ/c Hoàng Hữu Rớt (Chi uỷ viên - Trưởng ban CTMT) chủ trì lập danh mục theo dõi, hoàn thành rà soát trước 30/09/2026 và lập báo cáo gửi Đảng ủy phường trước ngày 05/10/2026."
  },
  {
    id: "vb-05",
    soHieu: "71-KH/ĐU",
    ngayBanHanh: "04/09/2026",
    coQuan: "Đảng ủy phường Hương Thủy",
    trichYeu: "Kế hoạch phát động phong trào thi đua 'Dân vận khéo' giai đoạn 2026 - 2030 gắn với xây dựng mô hình tự quản '6 rõ' tại các tổ dân phố",
    canCu: "Chương trình công tác toàn khóa của Đảng ủy phường Hương Thủy; Hướng dẫn của Ban Dân vận Thành ủy",
    hanXuLy: "Giai đoạn 2026 - 2030",
    loaiVanBan: "Kế hoạch",
    trangThai: "DangXuLy",
    canBoPhuTrach: "Đ/c Hoàng Hữu Rớt (Trưởng ban CTMT), Đ/c Nguyễn Thị Mừng (Phụ nữ), Đ/c Nguyễn Cưỡng (CCB), Đ/c Nguyễn Thị Ngọc Tú (Đoàn TN)",
    fileDinhKem: "71_KH_DU_Huong_Thuy_Dan_Van_Kheo.pdf",
    noiDungChiTiet: "I. MỤC TIÊU PHONG TRÀO:\n- Xây dựng 02 mô hình Dân vận khéo điểm: 'Tuyến đường hoa sáng - xanh - sạch - đẹp không rải vàng mã' và 'Phân loại rác thải tại nguồn'.\n- 100% cán bộ, đảng viên ký cam kết thực hiện đúng phương châm '6 Rõ' trong công tác dân vận.\nII. NHIỆM VỤ CỦA CÁC ĐOÀN THỂ:\n1. Ban CTMT: Chủ trì hiệp thương, giám sát việc thực hiện nếp sống văn minh đô thị.\n2. Chi hội Phụ nữ: Phát động mô hình 'Tổ phụ nữ thu gom phế liệu gây quỹ tình thương' và phân loại rác.\n3. Chi hội Cựu chiến binh: Giữ vai trò nòng cốt trong hòa giải mâu thuẫn, giữ gìn ANTT cơ sở.\n4. Chi đoàn Thanh niên: Tiên phong hướng dẫn người dân kích hoạt Hue-S và thực hiện dịch vụ công trực tuyến.\nIII. PHÂN CÔNG CHỈ ĐẠO:\n- Đ/c Hoàng Hữu Rớt (Trưởng ban CTMT) phụ trách chung việc theo dõi, chấm điểm mô hình '6 rõ' hằng quý."
  },
  {
    id: "vb-06",
    soHieu: "70-KH/ĐU",
    ngayBanHanh: "04/08/2026",
    coQuan: "Đảng ủy phường Hương Thủy",
    trichYeu: "Kế hoạch triển khai thực hiện Chỉ thị số 09-CT/TW của Ban Bí thư về thực hiện dân chủ ở cơ sở theo phương châm '3 công khai - 3 giám sát'",
    canCu: "Chỉ thị số 09-CT/TW của Ban Bí thư; Luật Thực hiện dân chủ ở cơ sở năm 2022",
    hanXuLy: "Thường xuyên / Triển khai ngay",
    loaiVanBan: "Kế hoạch",
    trangThai: "DangXuLy",
    canBoPhuTrach: "Cấp ủy Chi bộ (Đ/c Hồ Văn Mão, Đ/c Nguyễn Trọng Nghĩa, Đ/c Hoàng Hữu Rớt) & Ban CTMT Tổ dân phố",
    fileDinhKem: "70_KH_DU_Huong_Thuy_Dan_Chu_Co_So.pdf",
    noiDungChiTiet: "I. NGUYÊN TẮC '3 CÔNG KHAI - 3 GIÁM SÁT':\n- 3 Công khai: 1. Công khai quy hoạch, kế hoạch sử dụng đất và các dự án trên địa bàn; 2. Công khai các khoản thu chi, đóng góp của nhân dân; 3. Công khai danh sách đối tượng hưởng chính sách an sinh xã hội.\n- 3 Giám sát: 1. Giám sát đạo đức, lối sống, tinh thần nêu gương của cán bộ, đảng viên; 2. Giám sát chất lượng các công trình hạ tầng do nhân dân đóng góp; 3. Giám sát việc giải quyết đơn thư, phản ánh của công dân.\nII. BIỆN PHÁP THỰC HIỆN:\n1. Niêm yết công khai tại bảng tin Nhà văn hóa TDP và trên Cổng TTĐT TDP Lương Hậu.\n2. Định kỳ 6 tháng tổ chức hội nghị đối thoại trực tiếp giữa Bí thư Chi bộ, Tổ trưởng TDP với nhân dân.\nIII. TỔ CHỨC THỰC HIỆN:\n- Toàn thể Cấp ủy Chi bộ chịu trách nhiệm trước Đảng ủy phường về thực hiện dân chủ ở cơ sở."
  }
];

/* Khi được import trong Node/Astro build: tự gắn vào globalThis để
   assets/js/lh-markup.js (viết theo kiểu UMD) đọc được dữ liệu.
   Trên trình duyệt, data/data.js (bản sinh) đã gắn window.LH. */
if (typeof globalThis !== "undefined" && !globalThis.LH) {
  globalThis.LH = {
    META, NEWS, ANTT, PCTT, CADRES, FORMS, SECTIONS, LINKS,
    ROSTER, DOCS, DOCS_TW, TASKS, AUDIT_SEED, DOCS_NEW
  };
}

export {
  META,
  NEWS,
  ANTT,
  PCTT,
  CADRES,
  FORMS,
  SECTIONS,
  LINKS,
  ROSTER,
  DOCS,
  DOCS_TW,
  TASKS,
  AUDIT_SEED,
  DOCS_NEW
};
