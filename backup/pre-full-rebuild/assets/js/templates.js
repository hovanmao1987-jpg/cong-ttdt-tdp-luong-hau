/* =====================================================================
   KHO 11 BIỂU MẪU — sinh file .doc (Word) và .txt ngay trên trình duyệt,
   không cần server, không cần thư viện ngoài.
   ===================================================================== */
window.LHTPL = (function () {
  "use strict";

  var QG = "Độc lập - Tự do - Hạnh phúc";
  var CQ1 = "ỦY BAN NHÂN DÂN PHƯỜNG HƯƠNG THỦY";
  var CQ2 = "TỔ DÂN PHỐ LƯƠNG HẬU";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- khung biểu mẫu chuẩn thể thức văn bản ---------- */
  function wrap(o) {
    var head =
      '<table width="100%"><tr>' +
      '<td width="46%" align="center" valign="top"><b>' + esc(o.cq1 || CQ1) + "</b><br><b>" + esc(o.cq2 || CQ2) + "</b><br>" +
      (o.so ? "Số: " + esc(o.so) : "&nbsp;") + "</td>" +
      '<td width="8%">&nbsp;</td>' +
      '<td width="46%" align="center" valign="top"><b>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br>' +
      "<b>" + esc(QG) + "</b><br>" +
      "<i>………, ngày …… tháng …… năm 20……</i></td>" +
      "</tr></table><hr size=1>";

    var body = o.body || "";

    var foot =
      '<table width="100%"><tr>' +
      '<td width="46%" align="center" valign="top"><b>' + esc(o.footLeft || "XÁC NHẬN CỦA TDP/UBND PHƯỜNG") + "</b><br><i>(Ký, ghi rõ họ tên, đóng dấu)</i>" +
      "<br><br><br><br><br></td>" +
      "<td width=\"8%\">&nbsp;</td>" +
      '<td width="46%" align="center" valign="top"><b>' + esc(o.footRight || "NGƯỜI LÀM ĐƠN") + "</b><br><i>(Ký, ghi rõ họ tên)</i>" +
      "<br><br><br><br><br></td></tr></table>";

    return (
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>" + esc(o.title) + "</title>" +
      "<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View>" +
      "<w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->" +
      "<style>@page{size:595.3pt 841.9pt;margin:2cm 1.5cm 2cm 2cm;}" +
      "body{font-family:'Times New Roman',Times,serif;font-size:13pt;line-height:1.45;}" +
      "h1.tt{font-size:15pt;text-align:center;font-weight:bold;text-transform:uppercase;margin:14pt 0 4pt;}" +
      "p.k{font-size:12pt;text-align:center;font-style:italic;margin:0 0 14pt;}" +
      "table{border-collapse:collapse;width:100%;font-size:13pt;}" +
      "table.tb td,table.tb th{border:1px solid #000;padding:4pt 5pt;vertical-align:top;}" +
      "table.tb th{background:#eee;text-align:center;}" +
      "hr{border:0;border-top:1px solid #000;margin:10pt 0;}" +
      "ul{margin:4pt 0 10pt 20pt;}li{margin-bottom:3pt;}" +
      ".nho{font-size:11pt;font-style:italic;color:#333;}" +
      "</style></head><body>" +
      head +
      "<h1 class='tt'>" + esc(o.title) + "</h1>" +
      (o.subtitle ? "<p class='k'>" + esc(o.subtitle) + "</p>" : "") +
      body +
      foot +
      "<hr size=1><p class='nho'>Biểu mẫu " + esc(o.ma) + " — Kho biểu mẫu miễn phí của " + esc(CQ2) +
      ", phường Hương Thủy, thành phố Huế. Tải từ Cổng thông tin điện tử TDP Lương Hậu ngày …/…/20…</p>" +
      "</body></html>"
    );
  }

  function tbl(cols, rows, widths) {
    var h = "<table class='tb'><tr>";
    for (var i = 0; i < cols.length; i++)
      h += "<th" + (widths && widths[i] ? " width='" + widths[i] + "%'" : "") + ">" + esc(cols[i]) + "</th>";
    h += "</tr>";
    for (var r = 0; r < rows.length; r++) {
      h += "<tr>";
      for (var c = 0; c < cols.length; c++) h += "<td>" + esc(rows[r][c] || "") + "</td>";
      h += "</tr>";
    }
    return h + "</table>";
  }

  function idRow(n) {
    return "<p>Họ và tên: …………………………………………………… Nam/Nữ: ………… Sinh ngày: ……/……/…………</p>" +
      "<p>Số định danh cá nhân/CCCD: ……………………………… Ngày cấp: ……/……/……… Nơi cấp: Cục CSQLHC về TTXH</p>" +
      "<p>Nơi thường trú: Tổ dân phố Lương Hậu, phường Hương Thủy, thành phố Huế</p>" +
      "<p>Nơi ở hiện tại: ……………………………………………………………………………………………………………………</p>" +
      "<p>Số điện thoại liên hệ: ……………………………………………………………………………………………………………</p>";
  }

  /* ---------- nội dung 11 biểu mẫu ---------- */
  var TPL = {
    bm01: function () {
      return {
        ma: "BM-01", title: "Đơn đề nghị xác nhận thông tin cư trú",
        subtitle: "Kính gửi: Công an phường Hương Thủy, thành phố Huế",
        body:
          idRow() +
          "<p><b>Nội dung đề nghị xác nhận:</b></p>" +
          tbl(["STT", "Nội dung cần xác nhận", "Thời điểm xác nhận"], [
            ["1", "Đang thường trú tại Tổ dân phố Lương Hậu, phường Hương Thủy, TP. Huế", "Từ ngày ……/……/……… đến nay"],
            ["2", "…………………………………………………………………………", "………………………………"],
            ["3", "…………………………………………………………………………", "………………………………"]
          ], [8, 62, 30]) +
          "<p><b>Lý do đề nghị xác nhận:</b> …………………………………………………………………………………</p>" +
          "<p>……………………………………………………………………………………………………………………………………</p>" +
          "<p>Tôi xin cam đoan những nội dung kê khai trên là đúng sự thật và chịu hoàn toàn trách nhiệm trước pháp luật.</p>",
        footRight: "NGƯỜI LÀM ĐƠN", footLeft: "XÁC NHẬN CỦA CÔNG AN PHƯỜNG"
      };
    },
    bm02: function () {
      return {
        ma: "BM-02", title: "Tờ khai thay đổi thông tin cư trú",
        subtitle: "Mẫu CT01 ban hành kèm theo Thông tư số 66/2023/TT-BCA",
        cq1: "CÔNG AN PHƯỜNG HƯƠNG THỦY", cq2: "TDP LƯƠNG HẬU",
        body:
          "<p><b>1. Họ, chữ đệm và tên:</b> ……………………………………………… <b>1.1. Họ, chữ đệm và tên gọi khác:</b> ………………………………</p>" +
          "<p><b>2. Ngày, tháng, năm sinh:</b> ……/……/………… <b>Giới tính:</b> ……… <b>3. Số ĐDCN/CMND/CCCD:</b> ………………………………</p>" +
          "<p><b>4. Nơi thường trú:</b> Tổ dân phố Lương Hậu, phường Hương Thủy, thành phố Huế</p>" +
          "<p><b>5. Nơi tạm trú:</b> ………………………………… <b>6. Nơi ở hiện tại:</b> …………………………………………………………</p>" +
          "<p><b>7. Nghề nghiệp, nơi làm việc:</b> ………………………………………………………………………………………………</p>" +
          "<p><b>8. Họ, chữ đệm và tên chủ hộ:</b> ……………………………… <b>8.1. Quan hệ với chủ hộ:</b> …………………………</p>" +
          "<p><b>9. Nội dung đề nghị thay đổi:</b></p>" +
          tbl(["STT", "Nội dung thay đổi", "Giấy tờ, tài liệu kèm theo"], [
            ["1", "Đăng ký thường trú / Tách hộ / Điều chỉnh thông tin / Xác nhận thông tin cư trú / …", "………………………………"],
            ["2", "………………………………………………………………", "………………………………"]
          ], [8, 62, 30]) +
          "<p><b>10. Những thành viên trong hộ gia đình cùng thay đổi:</b></p>" +
          tbl(["STT", "Họ, chữ đệm và tên", "Ngày sinh", "Giới tính", "Số ĐDCN/CCCD", "Quan hệ với người kê khai"], [
            ["1", "", "", "", "", ""], ["2", "", "", "", "", ""], ["3", "", "", "", "", ""]
          ], [6, 26, 12, 8, 22, 26]) +
          "<p class='nho'>Ý kiến của chủ hộ: ………………………………………………………………… Ký tên: ……………………</p>",
        footRight: "NGƯỜI KÊ KHAI", footLeft: "XÁC NHẬN CỦA CƠ QUAN ĐĂNG KÝ CƯ TRÚ"
      };
    },
    bm03: function () {
      return {
        ma: "BM-03", title: "Đơn đề nghị cấp Giấy xác nhận tình trạng hôn nhân",
        subtitle: "Kính gửi: Ủy ban nhân dân phường Hương Thủy, thành phố Huế",
        body:
          idRow() +
          "<p><b>Trong thời gian cư trú tại:</b> Tổ dân phố Lương Hậu, phường Hương Thủy, thành phố Huế</p>" +
          "<p><b>Từ ngày</b> ……/……/……… <b>đến ngày</b> ……/……/………</p>" +
          "<p><b>Tình trạng hôn nhân của tôi là:</b></p>" +
          "<p>□ Chưa đăng ký kết hôn với ai<br>□ Đang có vợ/chồng là: …………………………… sinh năm …………<br>" +
          "□ Đã ly hôn theo Bản án/Quyết định số ……… ngày ……/……/…… của Toà án nhân dân …………………<br>" +
          "□ Vợ/chồng đã chết theo Giấy chứng tử số ……… ngày ……/……/…… của …………………………</p>" +
          "<p><b>Mục đích sử dụng Giấy xác nhận tình trạng hôn nhân:</b> ………………………………………………</p>" +
          "<p>Tôi cam đoan các nội dung kê khai là đúng sự thật và chịu trách nhiệm trước pháp luật về lời khai của mình.</p>",
        footRight: "NGƯỜI LÀM ĐƠN", footLeft: "XÁC NHẬN CỦA UBND PHƯỜNG"
      };
    },
    bm04: function () {
      return {
        ma: "BM-04", title: "Giấy uỷ quyền",
        subtitle: "(V/v: nộp hồ sơ, nhận kết quả giải quyết thủ tục hành chính)",
        body:
          "<p><b>BÊN UỶ QUYỀN (BÊN A):</b></p>" + idRow() +
          "<p><b>BÊN ĐƯỢC UỶ QUYỀN (BÊN B):</b></p>" +
          "<p>Họ và tên: …………………………………………………… Nam/Nữ: ………… Sinh ngày: ……/……/…………</p>" +
          "<p>Số ĐDCN/CCCD: ……………………………… Ngày cấp: ……/……/……… Nơi cấp: ……………………………………</p>" +
          "<p>Nơi thường trú: …………………………………………………………………………………………………………………………</p>" +
          "<p>Quan hệ với Bên A: ………………………… Số điện thoại: …………………………………………………………</p>" +
          "<p><b>ĐIỀU 1. NỘI DUNG UỶ QUYỀN</b></p>" +
          "<p>Bên A uỷ quyền cho Bên B thực hiện các công việc sau:</p>" +
          "<ul><li>Nộp hồ sơ, bổ sung hồ sơ và nhận kết quả giải quyết thủ tục: ………………………………………………</li>" +
          "<li>Tại cơ quan: …………………………………………………………………………………………………………………</li>" +
          "<li>Ký các giấy tờ cần thiết trong phạm vi uỷ quyền (trừ việc ký cam đoan, lời khai nhân thân).</li></ul>" +
          "<p><b>ĐIỀU 2. THỜI HẠN UỶ QUYỀN</b></p>" +
          "<p>Từ ngày ……/……/……… đến ngày ……/……/……… (hoặc đến khi hoàn thành công việc được uỷ quyền).</p>" +
          "<p><b>ĐIỀU 3. CAM KẾT</b></p>" +
          "<p>Việc uỷ quyền là hoàn toàn tự nguyện, không bị ép buộc. Bên B chịu trách nhiệm trước pháp luật về việc thực hiện đúng phạm vi uỷ quyền.</p>",
        footLeft: "XÁC NHẬN CỦA UBND PHƯỜNG/CHỨNG THỰC", footRight: "BÊN UỶ QUYỀN"
      };
    },
    bm05: function () {
      return {
        ma: "BM-05", title: "Đơn đề nghị cấp Giấy phép xây dựng",
        subtitle: "(Nhà ở riêng lẻ đô thị — Phụ lục II, Thông tư 15/2016/TT-BXD, cập nhật theo Nghị định 15/2021/NĐ-CP)",
        cq1: "ỦY BAN NHÂN DÂN PHƯỜNG HƯƠNG THỦY", cq2: "Kính gửi: UBND thành phố Huế",
        body:
          "<p><b>1. Thông tin chủ đầu tư (chủ hộ):</b></p>" + idRow() +
          "<p><b>2. Địa điểm xây dựng:</b></p>" +
          "<p>Lô đất số: ………… Thửa đất số: ………… Tờ bản đồ số: ………… Diện tích: …………… m²</p>" +
          "<p>Tại: Tổ dân phố Lương Hậu, phường Hương Thủy, thành phố Huế</p>" +
          "<p>Nguồn gốc sử dụng đất: ………………………………………………………………………………………………</p>" +
          "<p><b>3. Nội dung đề nghị cấp phép:</b></p>" +
          "<p>□ Cấp phép xây dựng mới &nbsp;&nbsp; □ Sửa chữa, cải tạo &nbsp;&nbsp; □ Di dời công trình</p>" +
          tbl(["STT", "Nội dung", "Thông số"], [
            ["1", "Loại công trình / cấp công trình", "Nhà ở riêng lẻ / Cấp ………"],
            ["2", "Diện tích xây dựng tầng 1", "……………… m²"],
            ["3", "Tổng diện tích sàn xây dựng", "……………… m²"],
            ["4", "Số tầng (kể cả tầng lửng, tum)", "………… tầng; chiều cao công trình ……… m"],
            ["5", "Chỉ giới xây dựng / mật độ xây dựng", "………… m / ……… %"],
            ["6", "Màu sắc, chất liệu mặt tiền chính", "………………………………"]
          ], [8, 52, 40]) +
          "<p><b>4. Hồ sơ kèm theo:</b> 02 bộ bản vẽ thiết kế; giấy tờ hợp pháp về đất đai; bản cam kết bảo đảm an toàn cho công trình liền kề.</p>" +
          "<p>Tôi cam đoan kê khai đúng sự thật và thi công đúng giấy phép được cấp.</p>",
        footRight: "CHỦ ĐẦU TƯ", footLeft: "XÁC NHẬN CỦA UBND PHƯỜNG"
      };
    },
    bm06: function () {
      return {
        ma: "BM-06", title: "Biên bản họp Tổ dân phố",
        subtitle: "(Hội nghị nhân dân / họp khu vực TDP Lương Hậu)",
        cq1: "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM", cq2: "TỔ DÂN PHỐ LƯƠNG HẬU",
        body:
          "<p>Hôm nay, vào lúc …… giờ …… phút, ngày …… tháng …… năm 20……</p>" +
          "<p>Tại: Nhà văn hoá Tổ dân phố Lương Hậu, phường Hương Thủy, thành phố Huế</p>" +
          "<p><b>I. THÀNH PHẦN THAM DỰ</b></p>" +
          "<p>1. Chủ trì: Ông/Bà ……………………………………… Chức vụ: …………………………………</p>" +
          "<p>2. Thư ký: Ông/Bà ………………………………………… Chức vụ: …………………………………</p>" +
          "<p>3. Đại biểu cấp trên: ………………………………………………………………………………………………</p>" +
          "<p>4. Số hộ gia đình được triệu tập: ………… hộ; số hộ có mặt: ………… hộ (đạt ………… %)</p>" +
          "<p><b>II. NỘI DUNG CUỘC HỌP</b></p>" +
          "<p>1. …………………………………………………………………………………………………………………………………</p>" +
          "<p>2. …………………………………………………………………………………………………………………………………</p>" +
          "<p><b>III. Ý KIẾN THẢO LUẬN</b></p>" +
          tbl(["STT", "Họ và tên người phát biểu", "Nội dung ý kiến"], [
            ["1", "", ""], ["2", "", ""], ["3", "", ""], ["4", "", ""]
          ], [8, 32, 60]) +
          "<p><b>IV. BIỂU QUYẾT</b></p>" +
          tbl(["STT", "Nội dung biểu quyết", "Tán thành", "Không tán thành", "Không có ý kiến", "Kết luận"], [
            ["1", "", "……/…… (%)", "……", "……", "Thông qua / Không"],
            ["2", "", "……/…… (%)", "……", "……", "Thông qua / Không"]
          ], [6, 34, 14, 14, 16, 16]) +
          "<p><b>V. KẾT LUẬN CỦA CHỦ TRÌ</b></p>" +
          "<p>……………………………………………………………………………………………………………………………………</p>" +
          "<p>Cuộc họp kết thúc vào lúc …… giờ …… phút cùng ngày. Biên bản được lập thành 02 bản, đã đọc lại cho mọi người cùng nghe và nhất trí 100%.</p>",
        footRight: "CHỦ TRÌ CUỘC HỌP", footLeft: "THƯ KÝ CUỘC HỌP"
      };
    },
    bm07: function () {
      return {
        ma: "BM-07", title: "Bản cam kết bảo đảm an toàn về phòng cháy, chữa cháy",
        subtitle: "(Hộ gia đình — Tổ liên gia an toàn PCCC, TDP Lương Hậu)",
        body:
          idRow() +
          "<p>Là chủ hộ gia đình tại địa chỉ: ……………………………, Tổ dân phố Lương Hậu, phường Hương Thủy, thành phố Huế</p>" +
          "<p>Thuộc Tổ liên gia an toàn PCCC số: ………… Số điện thoại: …………………………</p>" +
          "<p><b>Tôi cam kết thực hiện nghiêm các nội dung sau:</b></p>" +
          "<ol style='margin-left:20pt'>" +
          "<li>Quản lý chặt chẽ nguồn lửa, nguồn nhiệt; không thắp hương, đốt vàng mã, đun nấu khi không có người trông coi.</li>" +
          "<li>Hệ thống điện trong nhà được lắp đặt đúng kỹ thuật, có aptomat tổng; không câu mắc thêm thiết bị công suất lớn; ngắt cầu dao khi ra khỏi nhà qua đêm.</li>" +
          "<li>Không tồn chứa xăng, dầu, khí đốt hoá lỏng, hoá chất dễ cháy vượt quá số lượng quy định trong khu dân cư.</li>" +
          "<li>Bảo đảm lối thoát nạn thứ hai (cửa sổ, ban công, mái) không bị khoá chết, không bị che chắn bởi chuồng cọp, biển quảng cáo; trang bị búa, kìm cộng lực.</li>" +
          "<li>Trang bị tối thiểu 01 bình chữa cháy xách tay và 01 đèn pin; các thành viên trong hộ biết cách sử dụng.</li>" +
          "<li>Xe máy, xe điện để trong nhà phải cách xa nguồn nhiệt, không sạc pin qua đêm không có người trông coi.</li>" +
          "<li>Tham gia đầy đủ các buổi tuyên truyền, thực tập phương án chữa cháy do TDP và Công an phường tổ chức.</li>" +
          "<li>Khi phát hiện cháy: hô hoán, báo động cho tổ liên gia, gọi 114 và Công an phường, đồng thời tổ chức chữa cháy ban đầu, cứu người, di chuyển tài sản.</li></ol>" +
          "<p>Nếu vi phạm, tôi xin chịu hoàn toàn trách nhiệm theo quy định của pháp luật.</p>" +
          "<p class='nho'>Căn cứ: Luật Phòng cháy, chữa cháy và cứu nạn, cứu hộ năm 2024; Nghị định số 105/2025/NĐ-CP.</p>",
        footRight: "CHỦ HỘ CAM KẾT", footLeft: "XÁC NHẬN CỦA TDP LƯƠNG HẬU"
      };
    },
    bm08: function () {
      return {
        ma: "BM-08", title: "Đơn đề nghị hỗ trợ thiệt hại do thiên tai",
        subtitle: "(Áp dụng cho hộ gia đình bị thiệt hại trong đợt mưa lớn 10-17/9/2026)",
        body:
          "<p><b>Kính gửi:</b> — Ủy ban nhân dân phường Hương Thủy<br>— Ban Chỉ huy PCTT-TKCN phường Hương Thủy</p>" +
          idRow() +
          "<p><b>I. THỜI GIAN, NGUYÊN NHÂN THIÊN TAI:</b> Đợt mưa lớn diện rộng từ ngày ……/……/2026 đến ngày ……/……/2026 (ảnh hưởng của dải hội tụ nhiệt đới, theo Phương án số 02/PA-BĐH của TDP Lương Hậu).</p>" +
          "<p><b>II. KÊ KHAI THIỆT HẠI:</b></p>" +
          tbl(["STT", "Nội dung thiệt hại", "Đơn vị tính", "Số lượng", "Mức độ thiệt hại", "Ước giá trị (đồng)"], [
            ["1", "Nhà ở (tốc mái / sập tường / ngập)", "m² / căn", "", "", ""],
            ["2", "Lúa, hoa màu", "sào / ha", "", "", ""],
            ["3", "Cây ăn quả, cây lâu năm", "cây", "", "", ""],
            ["4", "Gia súc, gia cầm", "con", "", "", ""],
            ["5", "Thuỷ sản, ao hồ", "m² / lồng", "", "", ""],
            ["6", "Tài sản khác (xe máy, thiết bị điện…)", "cái", "", "", ""],
            ["", "<b>TỔNG CỘNG</b>", "", "", "", ""]
          ], [6, 30, 12, 10, 20, 22]) +
          "<p><b>III. NGƯỜI BỊ THƯƠNG, CHẾT (nếu có):</b> …………………………………………………………………………</p>" +
          "<p><b>IV. ĐỀ NGHỊ:</b> Đề nghị UBND phường xem xét, hỗ trợ theo Nghị định số 20/2021/NĐ-CP và Nghị định số 09/2025/NĐ-CP (sửa đổi, bổ sung) về chính sách trợ giúp xã hội đối với đối tượng bảo trợ xã hội.</p>" +
          "<p><b>V. TÀI LIỆU KÈM THEO:</b> Ảnh chụp hiện trường; biên bản xác nhận của TDP; giấy tờ chứng minh quyền sở hữu tài sản.</p>" +
          "<p>Tôi cam đoan nội dung kê khai là đúng sự thật, nếu sai tôi xin hoàn trả và chịu trách nhiệm trước pháp luật.</p>",
        footRight: "NGƯỜI LÀM ĐƠN", footLeft: "XÁC NHẬN CỦA TDP VÀ UBND PHƯỜNG"
      };
    },
    bm09: function () {
      return {
        ma: "BM-09", title: "Sơ yếu lý lịch",
        subtitle: "(Có xác nhận của chính quyền địa phương nơi cư trú)",
        cq1: "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM", cq2: "TỔ DÂN PHỐ LƯƠNG HẬU",
        body:
          "<p class='nho' align='center'>Ảnh 4x6<br>(đóng dấu giáp lai)</p>" +
          "<p><b>I. THÔNG TIN BẢN THÂN</b></p>" +
          "<p>1. Họ và tên (viết chữ in hoa): …………………………………………………… 2. Tên gọi khác: …………………………</p>" +
          "<p>3. Sinh ngày …… tháng …… năm ………… &nbsp;&nbsp; 4. Giới tính: ………… &nbsp;&nbsp; 5. Dân tộc: ………… &nbsp;&nbsp; 6. Tôn giáo: …………</p>" +
          "<p>7. Số ĐDCN/CCCD: ………………………… Ngày cấp: ……/……/……… Nơi cấp: …………………………………</p>" +
          "<p>8. Nơi đăng ký thường trú: Tổ dân phố Lương Hậu, phường Hương Thủy, thành phố Huế</p>" +
          "<p>9. Nơi ở hiện tại: ………………………………………………………………………………………………………………………</p>" +
          "<p>10. Dân tộc/Khuyết tật: …………………… 11. Trình độ: Văn hoá ………/12; Chuyên môn: …………………………</p>" +
          "<p>12. Lý luận chính trị: …………………… 13. Ngoại ngữ: …………………… 14. Tin học: ……………………</p>" +
          "<p>15. Nghề nghiệp, nơi làm việc hiện nay: …………………………………………………………………………………</p>" +
          "<p>16. Ngày vào Đảng (nếu có): ……/……/……… Ngày chính thức: ……/……/………</p>" +
          "<p>17. Tình trạng sức khoẻ: …………………… Chiều cao ………… Cân nặng ……………</p>" +
          "<p><b>II. QUAN HỆ GIA ĐÌNH</b></p>" +
          tbl(["STT", "Họ và tên", "Năm sinh", "Quan hệ", "Nghề nghiệp", "Nơi ở"], [
            ["1", "", "", "Cha", "", ""], ["2", "", "", "Mẹ", "", ""], ["3", "", "", "Vợ/Chồng", "", ""],
            ["4", "", "", "Con", "", ""], ["5", "", "", "Anh/chị/em ruột", "", ""]
          ], [6, 24, 10, 16, 22, 22]) +
          "<p><b>III. QUÁ TRÌNH ĐÀO TẠO, CÔNG TÁC</b></p>" +
          tbl(["Từ tháng, năm", "Đến tháng, năm", "Đơn vị công tác / trường học", "Chức vụ, nghề nghiệp"], [
            ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]
          ], [16, 16, 44, 24]) +
          "<p><b>IV. CAM KẾT</b></p>" +
          "<p>Tôi xin cam đoan những nội dung kê khai trên là đúng sự thật, nếu sai tôi xin chịu hoàn toàn trách nhiệm trước pháp luật.</p>",
        footRight: "NGƯỜI KHAI", footLeft: "XÁC NHẬN CỦA UBND PHƯỜNG HƯƠNG THỦY"
      };
    },
    bm10: function () {
      return {
        ma: "BM-10", title: "Phiếu yêu cầu chứng thực bản sao từ bản chính",
        subtitle: "Kính gửi: Ủy ban nhân dân phường Hương Thủy, thành phố Huế",
        body:
          idRow() +
          "<p><b>Danh mục giấy tờ đề nghị chứng thực bản sao:</b></p>" +
          tbl(["STT", "Tên giấy tờ (bản chính)", "Số bản sao", "Số trang/bản", "Mục đích sử dụng"], [
            ["1", "Căn cước công dân", "", "", ""],
            ["2", "Giấy khai sinh", "", "", ""],
            ["3", "Giấy chứng nhận quyền sử dụng đất", "", "", ""],
            ["4", "Bằng tốt nghiệp / Bảng điểm", "", "", ""],
            ["5", "", "", "", ""]
          ], [6, 34, 12, 12, 36]) +
          "<p><b>Tổng số bản sao đề nghị chứng thực:</b> …………… bản; <b>Tổng số trang:</b> …………… trang</p>" +
          "<p><b>Hình thức nhận kết quả:</b> □ Nhận trực tiếp tại Bộ phận Một cửa &nbsp; □ Nhận qua bưu chính công ích</p>" +
          "<p class='nho'>Mức thu phí: 2.000 đồng/trang đối với 2 trang đầu; từ trang thứ ba trở lên thu 1.000 đồng/trang, tối đa không quá 200.000 đồng/bản (theo quy định hiện hành).</p>" +
          "<p>Tôi cam đoan bản chính xuất trình là hợp pháp, không bị tẩy xoá, sửa chữa; bản chính do cơ quan có thẩm quyền cấp còn giá trị sử dụng.</p>",
        footRight: "NGƯỜI YÊU CẦU", footLeft: "TIẾP NHẬN HỒ SƠ (CÁN BỘ MỘT CỬA)"
      };
    },
    bm11: function () {
      return {
        ma: "BM-11", title: "Phiếu lấy ý kiến cử tri / nhân dân ở tổ dân phố",
        subtitle: "(Thực hiện Luật Thực hiện dân chủ ở cơ sở năm 2022 và Nghị định 59/2023/NĐ-CP)",
        cq1: "ỦY BAN NHÂN DÂN PHƯỜNG HƯƠNG THỦY", cq2: "TỔ DÂN PHỐ LƯƠNG HẬU",
        body:
          "<p><b>Nội dung lấy ý kiến:</b> ………………………………………………………………………………………………</p>" +
          "<p><b>Căn cứ:</b> …………………………………………………………………………………………………………………………</p>" +
          "<p><b>Thời gian lấy ý kiến:</b> từ ngày ……/……/20…… đến ngày ……/……/20……</p>" +
          "<p><b>Họ và tên người được lấy ý kiến (đại diện hộ gia đình):</b> …………………………………………………</p>" +
          "<p>Số ĐDCN/CCCD: ………………………… Địa chỉ: Khu vực (đội) số ………, TDP Lương Hậu</p>" +
          "<p><b>Ý KIẾN CỦA CỬ TRI / NHÂN DÂN</b> <i>(đánh dấu X vào ô lựa chọn)</i></p>" +
          tbl(["STT", "Nội dung lấy ý kiến", "Tán thành", "Không tán thành", "Ý kiến khác"], [
            ["1", "", "☐", "☐", ""],
            ["2", "", "☐", "☐", ""],
            ["3", "", "☐", "☐", ""]
          ], [6, 48, 12, 14, 20]) +
          "<p><b>Ý kiến đề xuất thêm:</b> ………………………………………………………………………………………………</p>" +
          "<p>……………………………………………………………………………………………………………………………………</p>" +
          "<p class='nho'>Phiếu không hợp lệ khi: không đánh dấu vào ô nào; đánh dấu cả hai ô “Tán thành” và “Không tán thành”; phiếu bị tẩy xoá hoặc viết thêm ngoài quy định.</p>",
        footRight: "NGƯỜI ĐƯỢC LẤY Ý KIẾN", footLeft: "ĐẠI DIỆN TỔ LẤY Ý KIẾN"
      };
    }
  };

  /* ---------- tiện ích tải ---------- */
  function safeName(s) {
    var out = String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    out = out.replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return out.slice(0, 80) || "bieu-mau";
  }

  function buildHTML(id) {
    if (!TPL[id]) return null;
    return wrap(TPL[id]());
  }

  function download(id, kind) {
    var d = TPL[id];
    if (!d) return false;
    var meta = d();
    var base = meta.ma + " - " + safeName(meta.title);
    var blob, name;

    if (kind === "txt") {
      var plain = buildPlain(id);
      blob = new Blob(["\ufeff" + plain], { type: "text/plain;charset=utf-8" });
      name = base + ".txt";
    } else {
      blob = new Blob(["\ufeff" + buildHTML(id)], { type: "application/msword;charset=utf-8" });
      name = base + ".doc";
    }

    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
    return name;
  }

  /* bản thuần text (dễ đọc trên điện thoại, không cần Word) */
  function buildPlain(id) {
    var html = buildHTML(id);
    if (!html) return "";
    var meta = TPL[id]();
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    var L = [];
    L.push((meta.cq1 || CQ1).toUpperCase());
    L.push((meta.cq2 || CQ2).toUpperCase());
    L.push("");
    L.push(meta.title.toUpperCase());
    if (meta.subtitle) L.push(meta.subtitle);
    L.push("");
    var nodes = tmp.querySelectorAll("p, li, th, td");
    var seen = {};
    for (var i = 0; i < nodes.length; i++) {
      var t = (nodes[i].textContent || "").replace(/\s+/g, " ").trim();
      if (!t || seen[t] || t.indexOf("Biểu mẫu BM") === 0) continue;
      seen[t] = 1;
      L.push(t);
    }
    L.push("");
    L.push("Biểu mẫu " + meta.ma + " — Kho biểu mẫu miễn phí, TDP Lương Hậu, phường Hương Thủy, TP. Huế.");
    return L.join("\n");
  }

  return { list: Object.keys(TPL), buildHTML: buildHTML, download: download, safeName: safeName, meta: TPL };
})();
