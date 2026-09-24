'use client';

import React, { useState, useEffect } from 'react';

// Danh sách 7 tính năng cốt lõi của Lộ trình Tiện ích số V2
const ROADMAP_V2_ITEMS = [
  {
    id: 'qr-diem-danh',
    icon: '📱',
    name: 'QR CODE ĐIỂM DANH',
    desc: 'Tự động sinh mã QR cho từng kỳ sinh hoạt ngày 03 hằng tháng. Đảng viên quét mã để điểm danh nhanh chóng.',
    status: 'Sẵn sàng tích hợp',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'thong-bao-zalo',
    icon: '🔔',
    name: 'THÔNG BÁO ZALO',
    desc: 'Kết nối Zalo OA/Zalo nhóm Chi bộ gửi thông báo triệu tập và nhắc lịch sinh hoạt tự động.',
    status: 'Đang phát triển',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'email-tu-dong',
    icon: '📧',
    name: 'EMAIL TỰ ĐỘNG',
    desc: 'Tự động gửi giấy mời, tài liệu sinh hoạt và thông báo thu nộp đảng phí đến từng đảng viên.',
    status: 'Đang phát triển',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'bieu-mau-dien-tu',
    icon: '📝',
    name: 'BIỂU MẪU ĐIỆN TỬ',
    desc: 'Số hóa Phiếu tự đánh giá chất lượng sinh hoạt Chi bộ (Mẫu 09) và biểu mẫu thu thập ý kiến đảng viên.',
    status: 'Thử nghiệm V2',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  {
    id: 'bao-cao-tu-dong',
    icon: '📊',
    name: 'BÁO CÁO TỰ ĐỘNG',
    desc: 'Tự động trích xuất dữ liệu, lập báo cáo định kỳ 30 ngày và tổng hợp tiến độ nhiệm vụ 6 rõ thành file DOCX/PDF.',
    status: 'Thử nghiệm V2',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  {
    id: 'tro-ly-ai',
    icon: '🤖',
    name: 'TRỢ LÝ AI HỖ TRỢ BÍ THƯ',
    desc: 'Trợ lý trí tuệ nhân tạo hỗ trợ đồng chí Bí thư soạn thảo dự thảo Nghị quyết, gợi ý kịch bản điều hành và lập báo cáo nhanh.',
    status: 'Thử nghiệm V2',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  {
    id: 'tim-kiem-ai',
    icon: '🔎',
    name: 'TÌM KIẾM VĂN BẢN BẰNG AI',
    desc: 'Tra cứu ngữ nghĩa thông minh trong kho 17 văn bản mẫu và quy chế địa phương theo câu hỏi tự nhiên.',
    status: 'Đang nghiên cứu',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
  },
];

interface RoadmapV2ButtonProps {
  className?: string;
}

export default function RoadmapV2Button({ className = '' }: RoadmapV2ButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Đóng khi nhấn phím Escape và khóa cuộn trang khi mở modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <>
      {/* 1. NÚT BẤM NỔI BẬT: Viền đỏ - vàng trang trọng, hiệu ứng hover mượt mà */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        id="btn-roadmap-v2-main"
        title="Bấm để xem Lộ trình Tiện ích số V2 của Chi bộ TDP Lương Hậu"
        className={`group relative inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#93061d] via-[#a80f27] to-[#7f0618] hover:from-[#a80f27] hover:to-[#93061d] text-yellow-300 font-bold text-xs sm:text-sm rounded-xl border-2 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.35)] hover:shadow-[0_0_18px_rgba(250,204,21,0.55)] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer ${className}`}
      >
        <span className="text-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
          🚀
        </span>
        <span className="tracking-wide">Tiện ích số &amp; Lộ trình V2</span>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-yellow-400 text-red-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
          V2
        </span>
      </button>

      {/* 2. MODAL POPUP HIỂN THỊ DANH SÁCH 7 TIỆN ÍCH */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border-2 border-yellow-400 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Pano đỏ - vàng trang trọng */}
            <div className="bg-gradient-to-r from-[#93061d] via-[#a10d24] to-[#780414] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-yellow-400 shrink-0">
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
                      2026 - 2030
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-white uppercase tracking-wide">
                    HỆ THỐNG TIỆN ÍCH SỐ &amp; ROADMAP V2
                  </h3>
                </div>
              </div>

              {/* Nút đóng (X) rõ ràng */}
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                aria-label="Đóng cửa sổ"
                className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center font-bold text-base transition border border-white/20 active:scale-95 shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Lưới thẻ 7 tiện ích số */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50">
              {/* Đoạn giới thiệu định hướng */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-amber-200 text-xs text-slate-700 leading-relaxed shadow-2xs">
                <span className="font-bold text-[#93061d]">🚩 Định hướng:</span> Thực hiện Nghị quyết Chuyển đổi số của Chi bộ TDP Lương Hậu và Kế hoạch 213-KH/VPTW. Hệ thống V2 hiện đại hóa toàn diện quy trình sinh hoạt, hỗ trợ Cấp ủy và nâng cao hiệu quả lãnh đạo của Chi bộ.
              </div>

              {/* Lưới 7 tiện ích */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {ROADMAP_V2_ITEMS.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-2xl p-1.5 bg-amber-50 rounded-lg border border-amber-200 shrink-0">
                          {item.icon}
                        </span>
                        <span
                          className={`text-[10.5px] px-2 py-0.5 rounded-full border font-bold ${item.badgeClass}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                        <span className="text-[#93061d]">#{idx + 1}</span> {item.name}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2.5 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-medium text-amber-900/80">Chi bộ Lương Hậu</span>
                      <span>V2 (2026 - 2030)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500">
                Chi bộ Tổ dân phố Lương Hậu · Đảng bộ phường Hương Thủy
              </span>
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="px-4 py-1.5 bg-[#93061d] hover:bg-red-900 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Đóng hộp thoại
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
