"use client";

import React, { useEffect } from "react";

export interface RoadmapFeature {
  id: string;
  icon: string;
  name: string;
  desc: string;
  status: "Sẵn sàng tích hợp" | "Đang phát triển" | "Thử nghiệm V2" | "Đang nghiên cứu" | string;
  category: string;
  highlight?: boolean;
}

export const ROADMAP_V2_FEATURES: RoadmapFeature[] = [
  {
    id: "qr-diem-danh",
    icon: "📱",
    name: "QR CODE ĐIỂM DANH",
    desc: "Tự động sinh mã QR cho từng kỳ sinh hoạt ngày 03 hằng tháng. Đảng viên quét mã để điểm danh nhanh chóng.",
    status: "Sẵn sàng tích hợp",
    category: "Sinh hoạt Đảng số",
    highlight: true,
  },
  {
    id: "thong-bao-zalo",
    icon: "🔔",
    name: "THÔNG BÁO ZALO",
    desc: "Kết nối Zalo OA/Zalo nhóm Chi bộ gửi thông báo triệu tập và nhắc lịch sinh hoạt tự động.",
    status: "Đang phát triển",
    category: "Truyền thông nội bộ",
  },
  {
    id: "email-tu-dong",
    icon: "📧",
    name: "EMAIL TỰ ĐỘNG",
    desc: "Tự động gửi giấy mời, tài liệu sinh hoạt và thông báo thu nộp đảng phí đến từng đảng viên.",
    status: "Đang phát triển",
    category: "Văn phòng điện tử",
  },
  {
    id: "bieu-mau-dien-tu",
    icon: "📝",
    name: "BIỂU MẪU ĐIỆN TỬ",
    desc: "Số hóa Phiếu tự đánh giá chất lượng sinh hoạt Chi bộ (Mẫu 09) và biểu mẫu thu thập ý kiến đảng viên.",
    status: "Thử nghiệm V2",
    category: "Số hóa quy trình",
    highlight: true,
  },
  {
    id: "bao-cao-tu-dong",
    icon: "📊",
    name: "BÁO CÁO TỰ ĐỘNG",
    desc: "Tự động trích xuất dữ liệu, lập báo cáo định kỳ 30 ngày và tổng hợp tiến độ nhiệm vụ 6 rõ thành file DOCX/PDF.",
    status: "Thử nghiệm V2",
    category: "Tổng hợp dữ liệu",
  },
  {
    id: "tro-ly-ai-bi-thu",
    icon: "🤖",
    name: "TRỢ LÝ AI HỖ TRỢ BÍ THƯ",
    desc: "Trợ lý trí tuệ nhân tạo hỗ trợ đồng chí Bí thư soạn thảo dự thảo Nghị quyết, gợi ý kịch bản điều hành và lập báo cáo nhanh.",
    status: "Thử nghiệm V2",
    category: "Trí tuệ nhân tạo AI",
    highlight: true,
  },
  {
    id: "tim-kiem-ai",
    icon: "🔎",
    name: "TÌM KIẾM VĂN BẢN BẰNG AI",
    desc: "Tra cứu ngữ nghĩa thông minh trong kho 17 văn bản mẫu và quy chế địa phương theo câu hỏi tự nhiên.",
    status: "Đang nghiên cứu",
    category: "Trí tuệ nhân tạo AI",
  },
];

interface RoadmapV2ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoadmapV2Modal({ isOpen, onClose }: RoadmapV2ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Sẵn sàng tích hợp":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
      case "Thử nghiệm V2":
        return "bg-purple-100 text-purple-900 border-purple-300 font-bold";
      case "Đang phát triển":
        return "bg-blue-100 text-blue-800 border-blue-300 font-medium";
      case "Đang nghiên cứu":
      default:
        return "bg-amber-100 text-amber-900 border-amber-300 font-medium";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border-2 border-yellow-400 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal Pano Đỏ - Vàng */}
        <div className="bg-gradient-to-r from-[#93061d] via-[#a10d24] to-[#780414] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-yellow-400 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-red-950 flex items-center justify-center font-black text-xl shadow-md border border-yellow-200 shrink-0">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-yellow-300 font-bold bg-black/30 px-2 py-0.5 rounded border border-yellow-400/40">
                  LỘ TRÌNH CHUYỂN ĐỔI SỐ CHI BỘ
                </span>
                <span className="text-[10px] text-red-200 hidden sm:inline-block">
                  Quyết định 213-KH/VPTW
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                HỆ THỐNG TIỆN ÍCH SỐ &amp; ROADMAP V2
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center font-bold text-base transition border border-white/20 active:scale-95 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Thân Modal: Cuộn mượt trên thiết bị di động */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50">
          {/* Lời dẫn định hướng Nghị quyết Chuyển đổi số */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-amber-200 text-xs text-slate-700 leading-relaxed shadow-2xs">
            <p className="font-semibold text-[#93061d] mb-1 flex items-center gap-1.5 text-xs sm:text-sm">
              <span>🚩</span> Định hướng Chuyển đổi số công tác Đảng tại Chi bộ TDP Lương Hậu (2026 - 2030):
            </p>
            Thực hiện Nghị quyết số 03-NQ/CĐ-CB của Chi bộ và Kế hoạch 213-KH/VPTW của Văn phòng Trung ương Đảng. Hệ thống Lộ trình V2 được thiết kế nhằm hiện đại hóa 100% quy trình sinh hoạt, hỗ trợ Cấp ủy, giảm tải thủ tục hành chính và nâng cao tính minh bạch, tương tác giữa đảng viên.
          </div>

          {/* Lưới 7 tiện ích số cốt lõi (Responsive 1 cột trên mobile, 2 cột trên tablet, 3 cột trên desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROADMAP_V2_FEATURES.map((feature, idx) => (
              <div
                key={feature.id}
                className={`bg-white rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between hover:shadow-md ${
                  feature.highlight
                    ? "border-red-300 shadow-2xs hover:border-red-500 ring-1 ring-red-100"
                    : "border-slate-200 hover:border-amber-400"
                }`}
              >
                <div className="space-y-2.5">
                  {/* Dòng Header thẻ tính năng: Icon + Nhóm + Trạng thái */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-xl flex items-center justify-center shrink-0">
                      {feature.icon}
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full border ${getStatusBadge(
                        feature.status
                      )}`}
                    >
                      {feature.status}
                    </span>
                  </div>

                  {/* Tên tiện ích số */}
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug flex items-center gap-1">
                    <span className="text-[#93061d]">#{idx + 1}</span> {feature.name}
                  </h3>

                  {/* Mô tả chi tiết tính năng */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                {/* Footer thẻ: Phân loại nhóm tính năng */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium text-amber-900/80">🏷️ {feature.category}</span>
                  <span className="text-slate-500 font-semibold">TDP Lương Hậu</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Modal: Hành động & Điều hướng */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            Chi bộ Tổ dân phố Lương Hậu · Đảng bộ phường Hương Thủy · Thành phố Huế.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href="/noi-bo/roadmap-v2"
              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#93061d] border border-amber-300 rounded-xl text-xs font-semibold transition flex items-center gap-1 text-center justify-center flex-1 sm:flex-initial"
            >
              <span>Xem trang chi tiết</span>
              <span>↗</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#93061d] hover:bg-red-900 text-white rounded-xl text-xs font-semibold transition flex-1 sm:flex-initial text-center justify-center shadow-xs"
            >
              Đóng hộp thoại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
