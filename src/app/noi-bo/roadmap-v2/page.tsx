import React from "react";
import SidebarNoiBo from "../../../components/noi-bo/SidebarNoiBo";
import { ROADMAP_V2_FEATURES } from "../../../components/noi-bo/RoadmapV2Modal";

export const metadata = {
  title: "Lộ trình Tiện ích số V2 — Chi bộ TDP Lương Hậu",
  description: "Chi tiết lộ trình 7 tiện ích số cốt lõi phục vụ chuyển đổi số công tác Đảng tại Chi bộ Tổ dân phố Lương Hậu giai đoạn 2026 - 2030",
};

export default function RoadmapV2Page() {
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Header pano nội bộ Chi bộ */}
      <header className="bg-[#93061d] text-white py-3.5 px-4 md:px-8 border-b-2 border-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 text-red-900 flex items-center justify-center font-black text-lg shadow border border-yellow-200 shrink-0">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm md:text-base tracking-wide text-yellow-300 uppercase">
                  LỘ TRÌNH TIỆN ÍCH SỐ V2 CHI BỘ LƯƠNG HẬU
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-yellow-200 border border-yellow-500/40 font-semibold">
                  GIAI ĐOẠN 2026 - 2030
                </span>
              </div>
              <p className="text-[11px] text-red-200">
                Thực hiện Nghị quyết số 03-NQ/CĐ-CB và Kế hoạch 213-KH/VPTW của Văn phòng Trung ương Đảng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href="/noi-bo/dashboard"
              className="px-3 py-1.5 bg-yellow-400/20 hover:bg-yellow-400/30 rounded-lg border border-yellow-400/40 text-yellow-300 transition font-medium"
            >
              ← Về Dashboard Chi bộ
            </a>
            <a
              href="/noi_bo"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white transition font-medium"
            >
              Cổng đối soát
            </a>
          </div>
        </div>
      </header>

      {/* Thanh Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 md:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <a href="/" className="hover:text-red-800 transition">Trang chủ</a>
          <span>/</span>
          <a href="/noi-bo/dashboard" className="hover:text-red-800 transition">Khu vực nội bộ</a>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Lộ trình Tiện ích số V2</span>
        </div>
      </div>

      {/* Main Content với Sidebar */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 flex-1 flex flex-col md:flex-row gap-6">
        <SidebarNoiBo activeTab="dashboard" />

        <div className="flex-1 min-w-0 space-y-6">
          {/* Giới thiệu mục tiêu chiến lược */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-[#93061d]">
              <span className="text-xl">🌟</span>
              <h2 className="text-base font-bold uppercase tracking-wide">
                Chiến lược Chuyển đổi số công tác Đảng tại Chi bộ cơ sở
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chi bộ TDP Lương Hậu tiên phong ứng dụng công nghệ số vào mọi khâu vận hành: từ triệu tập sinh hoạt, điểm danh, biểu quyết, tự đánh giá chất lượng sinh hoạt đến lưu trữ văn kiện và hỗ trợ Cấp ủy ra quyết định.
            </p>
          </div>

          {/* Lưới 7 tiện ích số V2 chi tiết */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ROADMAP_V2_FEATURES.map((feat, idx) => (
              <div
                key={feat.id}
                className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-red-500 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 bg-amber-50 rounded-xl border border-amber-200">
                        {feat.icon}
                      </span>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 block">
                          TÍNH NĂNG #{idx + 1}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm md:text-base">
                          {feat.name}
                        </h3>
                      </div>
                    </div>

                    <span className={`text-[11px] px-2.5 py-1 rounded-full border ${getStatusBadge(feat.status)}`}>
                      {feat.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Phân loại: <b>{feat.category}</b></span>
                  <span className="text-[#93061d] font-semibold">TDP Lương Hậu V2</span>
                </div>
              </div>
            ))}
          </div>

          {/* Nút quay lại Dashboard */}
          <div className="text-center pt-2">
            <a
              href="/noi-bo/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#93061d] hover:bg-red-900 text-yellow-300 font-bold rounded-xl text-xs shadow-md transition"
            >
              ← Quay lại Dashboard Chi bộ
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-6 text-center text-xs border-t border-slate-800 mt-8">
        <div className="max-w-7xl mx-auto">
          Chi bộ Tổ dân phố Lương Hậu · Đảng bộ phường Hương Thủy · Thành phố Huế.
        </div>
      </footer>
    </div>
  );
}
