export interface DocumentItem {
  id: string;
  visibility: "PUBLIC" | "INTERNAL";
  tier: string;
  title: string;
  category: string;
  fileType: "PDF" | "DOCX" | "DOC" | "WEB" | string;
  promulgatedDate: string;
  issuer: string;
  summary: string;
  viewUrl: string;
  downloadUrl: string;
}

export type MasterDocument = DocumentItem;

export const masterDocuments: DocumentItem[] = [
  // =========================================================================
  // 🌐 KHU VỰC CÔNG KHAI (PUBLIC) - Hiển thị tại `app/van-ban-bieu-mau/page.tsx`
  // =========================================================================
  {
    id: "PUB-01",
    visibility: "PUBLIC",
    tier: "Cấp Trung ương / Thành phố",
    title: "Luật Thực hiện dân chủ ở cơ sở (Luật số 10/2022/QH15)",
    category: "Luật - Pháp luật",
    fileType: "PDF",
    promulgatedDate: "10/11/2022",
    issuer: "Quốc hội",
    summary: "Cơ sở pháp lý về quyền dân biết, dân bàn, dân làm, dân kiểm tra tại tổ dân phố.",
    viewUrl: "https://vanban.chinhphu.vn/?pageid=27160&docid=206770",
    downloadUrl: "https://vanban.chinhphu.vn/?pageid=27160&docid=206770"
  },
  {
    id: "PUB-02",
    visibility: "PUBLIC",
    tier: "Cấp Trung ương / Thành phố",
    title: "Nghị định số 33/2023/NĐ-CP về tổ chức và hoạt động của thôn, tổ dân phố",
    category: "Nghị định Chính phủ",
    fileType: "PDF",
    promulgatedDate: "10/06/2023",
    issuer: "Chính phủ",
    summary: "Quy định tiêu chuẩn, nhiệm vụ và chế độ của cán bộ Tổ dân phố.",
    viewUrl: "https://vanban.chinhphu.vn/?pageid=27160&docid=208035",
    downloadUrl: "https://vanban.chinhphu.vn/?pageid=27160&docid=208035"
  },
  {
    id: "PUB-03",
    visibility: "PUBLIC",
    tier: "Cấp Trung ương / Thành phố",
    title: "Luật Lực lượng tham gia bảo vệ an ninh, trật tự ở cơ sở năm 2023",
    category: "Luật - Pháp luật",
    fileType: "PDF",
    promulgatedDate: "28/11/2023",
    issuer: "Quốc hội",
    summary: "Cơ sở hoạt động của Tổ bảo vệ ANTT cơ sở tại địa bàn Lương Hậu.",
    viewUrl: "https://vanban.chinhphu.vn/?pageid=27160&docid=209194",
    downloadUrl: "https://vanban.chinhphu.vn/?pageid=27160&docid=209194"
  },
  {
    id: "PUB-04",
    visibility: "PUBLIC",
    tier: "Cấp Trung ương / Thành phố",
    title: "Cổng Dịch vụ công Quốc gia (Nộp hồ sơ trực tuyến)",
    category: "Thủ tục hành chính",
    fileType: "WEB",
    promulgatedDate: "Thường xuyên",
    issuer: "Cổng DVC Quốc gia",
    summary: "Tra cứu và nộp thủ tục cư trú, căn cước, hộ tịch, an sinh xã hội.",
    viewUrl: "https://dichvucong.gov.vn",
    downloadUrl: "https://dichvucong.gov.vn"
  },
  {
    id: "PUB-05",
    visibility: "PUBLIC",
    tier: "Cấp Phường Hương Thủy",
    title: "Kế hoạch thực hiện nhiệm vụ chính trị trọng tâm và cải cách thủ tục hành chính công cấp phường",
    category: "Kế hoạch hành chính",
    fileType: "PDF",
    promulgatedDate: "15/08/2026",
    issuer: "UBND Phường Hương Thủy",
    summary: "Nhiệm vụ phát triển kinh tế - xã hội, trật tự đô thị, an ninh quốc phòng và biểu mẫu thủ tục hành chính công cấp phường.",
    viewUrl: "https://huongthuy.hue.gov.vn",
    downloadUrl: "https://huongthuy.hue.gov.vn"
  },
  {
    id: "PUB-06",
    visibility: "PUBLIC",
    tier: "Cấp TDP Lương Hậu",
    title: "Quy chế hoạt động và quản lý tự quản Tổ dân phố Lương Hậu",
    category: "Quy chế địa phương",
    fileType: "DOCX",
    promulgatedDate: "10/08/2026",
    issuer: "UBND Phường Hương Thủy - TDP Lương Hậu",
    summary: "Quy ước nếp sống văn minh, bộ máy điều hành và quy chế tự quản toàn dân.",
    viewUrl: "https://docs.google.com/document/d/1CX1yV1IvTW0jwzdyS8KZucZOHPZQdnLn5XN03CudeG8/edit",
    downloadUrl: "https://docs.google.com/document/d/1CX1yV1IvTW0jwzdyS8KZucZOHPZQdnLn5XN03CudeG8/export?format=docx"
  },

  // =========================================================================
  // 🔐 KHU VỰC NỘI BỘ (INTERNAL) - Chỉ hiển thị tại `app/noi-bo/tai-lieu/page.tsx`
  // =========================================================================
  {
    id: "INT-01",
    visibility: "INTERNAL",
    tier: "Cấp Phường Hương Thủy",
    title: "Bộ 17 văn bản mẫu nghiệp vụ vận hành Chi bộ trực thuộc Đảng ủy phường",
    category: "Văn bản mẫu nghiệp vụ",
    fileType: "DOCX",
    promulgatedDate: "Năm 2026",
    issuer: "Ban Xây dựng Đảng phường Hương Thủy",
    summary: "Tài liệu nghiệp vụ tối thiểu để tổ chức và sinh hoạt Chi bộ theo hướng dẫn Đảng ủy.",
    viewUrl: "https://drive.google.com/file/d/1NJnABPjhKT-whLR7vmO1OH8pww7dejuK/view",
    downloadUrl: "https://drive.google.com/file/d/1NJnABPjhKT-whLR7vmO1OH8pww7dejuK/view"
  },
  {
    id: "INT-02",
    visibility: "INTERNAL",
    tier: "Cấp Chi bộ Lương Hậu",
    title: "Quy chế làm việc Chi bộ Tổ dân phố Lương Hậu nhiệm kỳ 2025 - 2030",
    category: "Quy chế Chi bộ",
    fileType: "DOCX",
    promulgatedDate: "05/07/2026",
    issuer: "Chi bộ Tổ dân phố Lương Hậu",
    summary: "Quyết định 02-QĐ/CB về thẩm quyền Cấp ủy, Bí thư, Phó Bí thư và sinh hoạt ngày 03 hằng tháng.",
    viewUrl: "https://drive.google.com/file/d/1iBHaM3naC8CZ36JmH-bvjOTQI64nr5-p/view",
    downloadUrl: "https://drive.google.com/file/d/1iBHaM3naC8CZ36JmH-bvjOTQI64nr5-p/view"
  },
  {
    id: "INT-03",
    visibility: "INTERNAL",
    tier: "Cấp Chi bộ Lương Hậu",
    title: "Quy chế phối hợp Chi ủy với Tổ trưởng, Ban Công tác Mặt trận và Đoàn thể (Mẫu 15)",
    category: "Quy chế Chi bộ",
    fileType: "DOC",
    promulgatedDate: "03/01/2026",
    issuer: "Chi ủy Chi bộ TDP Lương Hậu",
    summary: "Quy chế lãnh đạo phối hợp công tác Mặt trận, Chủ nhật xanh và hòa giải cơ sở.",
    viewUrl: "https://drive.google.com/file/d/1BVdolfhKA-5XaZeCy31D__xcWcefqvhA/view",
    downloadUrl: "https://drive.google.com/file/d/1BVdolfhKA-5XaZeCy31D__xcWcefqvhA/view"
  },
  {
    id: "INT-04",
    visibility: "INTERNAL",
    tier: "Cấp Chi bộ Lương Hậu",
    title: "Bảng theo dõi và phân công nhiệm vụ đảng viên theo nguyên tắc 6 rõ (Mẫu 16)",
    category: "Quản lý đảng viên",
    fileType: "DOC",
    promulgatedDate: "03/01/2026",
    issuer: "Chi ủy Chi bộ TDP Lương Hậu",
    summary: "Phân công đảng viên phụ trách tổ liên gia tự quản theo Quy định 213-QĐ/TW.",
    viewUrl: "https://drive.google.com/file/d/1dDi5VttRmsZ9OdpoPBON_eD5TcGtQQzc/view",
    downloadUrl: "https://drive.google.com/file/d/1dDi5VttRmsZ9OdpoPBON_eD5TcGtQQzc/view"
  },
  {
    id: "INT-05",
    visibility: "INTERNAL",
    tier: "Cấp Chi bộ Lương Hậu",
    title: "Mẫu 08: Khung Nghị quyết lãnh đạo nhiệm vụ hằng tháng của Chi bộ",
    category: "Nghị quyết Chi bộ",
    fileType: "DOC",
    promulgatedDate: "Năm 2026",
    issuer: "Chi bộ TDP Lương Hậu",
    summary: "Khung nghị quyết lãnh đạo các chỉ tiêu hằng tháng của Chi bộ theo đúng hướng dẫn của Đảng ủy.",
    viewUrl: "https://drive.google.com/file/d/1NJnABPjhKT-whLR7vmO1OH8pww7dejuK/view",
    downloadUrl: "https://drive.google.com/file/d/1NJnABPjhKT-whLR7vmO1OH8pww7dejuK/view"
  },
  {
    id: "INT-06",
    visibility: "INTERNAL",
    tier: "Cấp Chi bộ Lương Hậu",
    title: "Báo cáo công tác Tuyên giáo tháng 9/2026 và phương hướng nhiệm vụ tháng 10/2026",
    category: "Báo cáo Chi bộ",
    fileType: "DOCX",
    promulgatedDate: "16/09/2026",
    issuer: "Chi bộ TDP Lương Hậu",
    summary: "Báo cáo tình hình tư tưởng đảng viên, nhân dân và kết quả các phong trào cơ sở.",
    viewUrl: "https://docs.google.com/document/d/1y8lNybYFenqz2z6FOJW7PNPJ5WQbykAIlwJPIUi-a4M/edit",
    downloadUrl: "https://docs.google.com/document/d/1y8lNybYFenqz2z6FOJW7PNPJ5WQbykAIlwJPIUi-a4M/export?format=docx"
  }
];

export function getPublicDocuments(): DocumentItem[] {
  return (masterDocuments || []).filter((doc) => doc && doc.visibility === "PUBLIC");
}

export function getInternalDocuments(): DocumentItem[] {
  return (masterDocuments || []).filter((doc) => doc && doc.visibility === "INTERNAL");
}
