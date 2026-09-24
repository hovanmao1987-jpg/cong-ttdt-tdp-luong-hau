import React from "react";
import SidebarNoiBo from "../../../components/noi-bo/SidebarNoiBo";
import VanBanMoiList from "../../../components/noi-bo/VanBanMoiList";

export const metadata = {
  title: "Văn bản mới của Phường & Thành phố — Chi bộ TDP Lương Hậu",
  description: "Trang theo dõi và lưu trữ văn bản chỉ đạo mới từ Đảng ủy phường Hương Thủy và Thành ủy Huế (đợt tháng 9/2026)",
};

export default function VanBanMoiPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Header nội bộ */}
      <header className="bg-[#93061d] text-white py-3 px-4 md:px-8 border-b-2 border-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-400 text-red-900 flex items-center justify-center font-black text-base shadow">
              ★
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-base tracking-wide text-yellow-300">
                KHU VỰC NỘI BỘ — CHI BỘ TỔ DÂN PHỐ LƯƠNG HẬU
              </h1>
              <p className="text-[11px] text-red-200">
                Đảng ủy phường Hương Thủy · Thành ủy Huế
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="/noi_bo"
              className="hidden sm:inline-block px-3 py-1.5 bg-red-800/80 hover:bg-red-800 rounded border border-red-700 text-yellow-200 transition"
            >
              Vào cổng đối soát
            </a>
            <a
              href="/"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-white transition"
            >
              Trang công khai
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 md:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <a href="/" className="hover:text-red-700">Trang chủ</a>
          <span>/</span>
          <a href="/noi_bo" className="hover:text-red-700">Khu vực nội bộ</a>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Văn bản mới của Phường &amp; Thành phố</span>
        </div>
      </div>

      {/* Main Content với Sidebar */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 flex-1 flex flex-col md:flex-row gap-6">
        <SidebarNoiBo activeTab="van-ban-moi" />
        <div className="flex-1 min-w-0">
          <VanBanMoiList />
        </div>
      </main>

      {/* Footer nội bộ */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-6 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          Chi bộ Tổ dân phố Lương Hậu · Đảng bộ phường Hương Thủy · Thành phố Huế.<br />
          Tài liệu phục vụ nghiệp vụ nội bộ Chi bộ — Tuân thủ Quyết định 556-QĐ/VPTW.
        </div>
      </footer>
    </div>
  );
}
