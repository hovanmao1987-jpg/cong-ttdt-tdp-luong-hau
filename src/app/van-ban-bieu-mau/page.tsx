import React from "react";
import VanBanPublicList from "../../components/VanBanPublicList";

export const metadata = {
  title: "Văn bản & Biểu mẫu công khai — Tổ dân phố Lương Hậu",
  description:
    "Hệ thống văn bản quy phạm pháp luật, quy chế hoạt động và biểu mẫu hành chính công khai phục vụ nhân dân TDP Lương Hậu theo Luật Thực hiện dân chủ ở cơ sở.",
};

export default function VanBanBieuMauPublicPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header pano công khai */}
      <header className="bg-[#93061d] text-white py-4 px-4 md:px-8 border-b-4 border-yellow-400 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-yellow-400 text-red-900 flex items-center justify-center font-black text-xl shadow border-2 border-yellow-200 shrink-0">
              ★
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-red-200 block font-semibold">
                UBND PHƯỜNG HƯƠNG THỦY • THÀNH PHỐ HUẾ
              </span>
              <h1 className="text-base md:text-lg font-bold text-yellow-300 uppercase tracking-wide">
                HỆ THỐNG VĂN BẢN &amp; BIỂU MẪU CÔNG KHAI
              </h1>
              <p className="text-xs text-red-100">
                Tổ dân phố Lương Hậu — Dành cho Nhân dân tra cứu và thực hiện
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
              href="/tin-tuc"
              className="px-3 py-1.5 bg-yellow-400/20 hover:bg-yellow-400/30 rounded-lg border border-yellow-400/40 text-yellow-300 transition font-medium"
            >
              📰 Chuyên mục Tin tức
            </a>
          </div>
        </div>
      </header>

      {/* Thanh điều hướng Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 md:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <a href="/" className="hover:text-red-800 transition">Trang chủ</a>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Văn bản &amp; Biểu mẫu công khai</span>
        </div>
      </div>

      {/* Nội dung chính */}
      <main className="max-w-6xl mx-auto w-full p-4 md:p-6 flex-1 space-y-6">
        <VanBanPublicList />
      </main>

      {/* Footer chuẩn Cổng TTĐT Lương Hậu */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 md:px-8 text-xs border-t border-slate-800 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-slate-200">
              CỔNG THÔNG TIN ĐIỆN TỬ TỔ DÂN PHỐ LƯƠNG HẬU
            </p>
            <p className="text-[11px] mt-0.5">
              Trụ sở: Số 83 Thái Thuận, TDP Lương Hậu, Phường Hương Thủy, TP. Huế
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Đường dây nóng tiếp nhận phản ánh: 0965.712.812 (Tổ trưởng TDP) • Công an phường: 0234.3852.870
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            Tuân thủ Luật Thực hiện dân chủ ở cơ sở số 10/2022/QH15.<br />
            Phát triển phục vụ cộng đồng dân cư Lương Hậu.
          </div>
        </div>
      </footer>
    </div>
  );
}
