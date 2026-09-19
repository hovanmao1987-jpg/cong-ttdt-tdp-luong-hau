import React from "react";
import TinTucList, { PostItem } from "../../components/TinTucList";

// Thời gian làm mới Incremental Static Regeneration (ISR) 60 giây
export const revalidate = 60;

const API_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbykHUCjMtmrFINLqva-8u20XDeJTHrtwYY7sqMICywWf8DlodL5NLF9OWJ760qjXcvq/exec";

// Danh sách tin tức mặc định chuẩn hóa theo yêu cầu:
// (Kế hoạch chủ nhật xanh, Sinh hoạt chi bộ tháng 10, Tuyên truyền phòng chống ma túy)
const FALLBACK_NEWS: PostItem[] = [
  {
    id: 1,
    eventDate: "18/09/2026",
    category: "An ninh trật tự",
    title: "Tuyên truyền địa bàn không ma túy và giữ vững an ninh trật tự cơ sở",
    content:
      "Chi bộ và Ban Điều hành TDP Lương Hậu tổ chức đợt cao điểm tuyên truyền phong trào toàn dân bảo vệ an ninh Tổ quốc, xây dựng cụm dân cư không tệ nạn xã hội. Lực lượng bảo vệ ANTT cơ sở tăng cường tuần tra đêm tại các khu vực trọng điểm Đội 8, 9, 10, 11.",
    location: "Nhà sinh hoạt cộng đồng TDP Lương Hậu",
    author: "Chi bộ TDP Lương Hậu",
    imageUrl: ""
  },
  {
    id: 2,
    eventDate: "13/09/2026",
    category: "Ngày Chủ nhật xanh",
    title: "Ra quân 'Ngày Chủ nhật xanh' đợt 4 gắn với khơi thông mương máng, phòng chống sốt xuất huyết",
    content:
      "Hơn 120 đoàn viên thanh niên, hội viên phụ nữ và nhân dân đã đồng loạt ra quân dọn dẹp vệ sinh môi trường, phát quang bụi rậm, khơi thông 780m cống rãnh nội đồng và xử lý triệt để các điểm tập kết rác thải tự phát trên tuyến đường Sóng Hồng và Thái Thuận.",
    location: "83 Thái Thuận & Tuyến đường Sóng Hồng",
    author: "Ban Điều hành TDP Lương Hậu",
    imageUrl: ""
  },
  {
    id: 3,
    eventDate: "28/09/2026",
    category: "Công tác Chi bộ",
    title: "Thông báo chuẩn bị nội dung và triệu tập Sinh hoạt Chi bộ định kỳ ngày 03/10/2026",
    content:
      "Chi ủy Chi bộ TDP Lương Hậu triệu tập toàn thể 22 đồng chí đảng viên tham dự kỳ sinh hoạt thường kỳ tháng 10/2026 lúc 19h30 ngày 03/10 tại Nhà văn hóa. Nội dung trọng tâm: đánh giá tiến độ 6 rõ tháng 9 và triển khai phương án ứng phó mùa mưa lũ.",
    location: "Nhà văn hóa TDP Lương Hậu",
    author: "Chi ủy Chi bộ Lương Hậu",
    imageUrl: ""
  },
  {
    id: 4,
    eventDate: "10/09/2026",
    category: "Tin tiêu điểm TP Huế",
    title: "Chủ động từ sớm, từ xa, sẵn sàng ứng phó với các tình huống thiên tai, mưa lũ tại TP Huế và TDP Lương Hậu",
    content:
      "UBND thành phố Huế và Ban Chỉ huy PCTT-TKCN TDP Lương Hậu hoàn tất rà soát phương án 4 tại chỗ, kiểm tra các điểm xung yếu, chuẩn bị sẵn sàng vật tư, xuồng cứu hộ và danh sách hộ neo đơn cần hỗ trợ di dời khẩn cấp khi có triều cường.",
    location: "Tổ dân phố Lương Hậu",
    author: "Ban Chỉ huy PCTT-TKCN TDP",
    imageUrl: ""
  },
  {
    id: 5,
    eventDate: "25/09/2026",
    category: "Hoạt động Đoàn thể",
    title: "Kế hoạch tổ chức 'Đêm hội Trăng rằm 2026' cho thiếu nhi Lương Hậu",
    content:
      "Chi đoàn Thanh niên phối hợp với Ban Công tác Mặt trận tổ chức Tết Trung thu 2026 cho hơn 300 cháu thiếu niên, nhi đồng; trao tặng 25 suất quà khuyến học cho các em học sinh có hoàn cảnh khó khăn vươn lên đạt thành tích học tập tốt.",
    location: "Sân Nhà văn hóa TDP Lương Hậu",
    author: "Chi đoàn Thanh niên TDP",
    imageUrl: ""
  }
];

// Hàm fetch dữ liệu phòng thủ (defensive code), đảm bảo TUYỆT ĐỐI không bị lỗi 500
async function fetchNewsSafely(): Promise<{ articles: PostItem[]; isLive: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout phòng treo fetch

    const res = await fetch(API_ENDPOINT, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Phản hồi không phải định dạng JSON");
    }

    const json = await res.json();
    if (json && json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
      return { articles: json.data, isLive: true };
    }

    return { articles: FALLBACK_NEWS, isLive: false };
  } catch (error) {
    // Luôn fallback an toàn về danh sách tin tức mặc định, không bao giờ để lỗi trang
    return { articles: FALLBACK_NEWS, isLive: false };
  }
}

export const metadata = {
  title: "Chuyên mục Tin tức & Sự kiện — Cổng TTĐT Tổ dân phố Lương Hậu",
  description:
    "Cập nhật liên tục tin tức hoạt động chính quyền, Chi bộ, đoàn thể và các phong trào nhân dân TDP Lương Hậu (phường Hương Thủy, TP. Huế)",
};

export default async function TinTucPage() {
  const { articles, isLive } = await fetchNewsSafely();
  const safeArticles = articles || FALLBACK_NEWS;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header pano chuyên mục */}
      <header className="bg-[#93061d] text-white py-4 px-4 md:px-8 border-b-4 border-yellow-400 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-yellow-400 text-red-900 flex items-center justify-center font-black text-xl shadow border-2 border-yellow-200 shrink-0">
              ★
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-red-200 block font-semibold">
                CỔNG THÔNG TIN ĐIỆN TỬ TỔ DÂN PHỐ LƯƠNG HẬU
              </span>
              <h1 className="text-base md:text-lg font-bold text-yellow-300 uppercase tracking-wide">
                TIN TỨC &amp; SỰ KIỆN ĐỊA PHƯƠNG
              </h1>
              <p className="text-xs text-red-100">
                Phường Hương Thủy • Thành phố Huế — Tự động cập nhật 24/7
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href="/"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white transition flex items-center gap-1 font-medium"
            >
              ← Về trang chủ
            </a>
            <a
              href="/van-ban-bieu-mau"
              className="px-3 py-1.5 bg-yellow-400/20 hover:bg-yellow-400/30 rounded-lg border border-yellow-400/40 text-yellow-300 transition font-medium"
            >
              📜 Văn bản công khai
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumb & Trạng thái đồng bộ ISR */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 md:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <a href="/" className="hover:text-red-800 transition">Trang chủ</a>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Tin tức Lương Hậu</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {isLive ? "Kết nối Google Sheets trực tuyến" : "Cơ chế ISR (Làm mới mỗi 60s)"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full p-4 md:p-6 flex-1 space-y-6">
        <TinTucList initialArticles={safeArticles} sourceEndpoint={API_ENDPOINT} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 md:px-8 text-xs border-t border-slate-800 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-slate-200">
              CỔNG THÔNG TIN ĐIỆN TỬ TỔ DÂN PHỐ LƯƠNG HẬU
            </p>
            <p className="text-[11px] mt-0.5">
              Địa chỉ: Số 83 Thái Thuận, TDP Lương Hậu, Phường Hương Thủy, TP. Huế
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Hotline điều hành: 0965.712.812 (Đ/c Nguyễn Trọng Nghĩa) • 0962.481.112 (Đ/c Hồ Văn Mão)
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            Dữ liệu đồng bộ từ Google Sheets • Next.js App Router • Tailwind CSS • ISR 60s.
          </div>
        </div>
      </footer>
    </div>
  );
}
