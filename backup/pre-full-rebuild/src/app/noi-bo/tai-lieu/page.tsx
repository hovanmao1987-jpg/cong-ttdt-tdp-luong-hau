import React from "react";
import SidebarNoiBo from "../../../components/noi-bo/SidebarNoiBo";
import TaiLieuNoiBoList from "../../../components/noi-bo/TaiLieuNoiBoList";

export const metadata = {
  title: "Kho Tài liệu & Văn bản nghiệp vụ Chi bộ — TDP Lương Hậu",
  description: "Khu vực lưu trữ hồ sơ, quy chế hoạt động và biểu mẫu nghiệp vụ dành riêng cho 22 đảng viên Chi bộ TDP Lương Hậu (QĐ 46-QĐ/ĐU)",
};

export default function TaiLieuNoiBoPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Header pano nội bộ Chi bộ */}
      <header className="bg-[#93061d] text-white py-3.5 px-4 md:px-8 border-b-2 border-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 text-red-900 flex items-center justify-center font-black text-lg shadow border border-yellow-200">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm md:text-base tracking-wide text-yellow-300 uppercase">
                  KHU VỰC NỘI BỘ — CHI BỘ TỔ DÂN PHỐ LƯƠNG HẬU
                </h1>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-red-950 text-yellow-200 border border-yellow-500/40 font-semibold">
                  MẬT / NỘI BỘ
                </span>
              </div>
              <p className="text-[11px] text-red-200">
                Đảng ủy phường Hương Thủy · Thành ủy Huế
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href="/noi_bo"
              className="hidden sm:inline-block px-3 py-1.5 bg-red-900/80 hover:bg-red-900 rounded-lg border border-red-700 text-yellow-200 transition font-medium"
            >
              Cổng đối soát trung tâm
            </a>
            <a
              href="/van-ban-bieu-mau"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white transition font-medium"
            >
              Khu vực công khai
            </a>
          </div>
        </div>
      </header>

      {/* Thanh Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 md:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <a href="/" className="hover:text-red-800 transition">Trang chủ</a>
          <span>/</span>
          <a href="/noi_bo" className="hover:text-red-800 transition">Khu vực nội bộ</a>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Hồ sơ – Tài liệu nghiệp vụ Chi bộ</span>
        </div>
      </div>

      {/* Thân trang: Sidebar phân cấp + Danh sách tài liệu */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 flex-1 flex flex-col md:flex-row gap-6">
        <SidebarNoiBo activeTab="hoso" />
        <div className="flex-1 min-w-0">
          <TaiLieuNoiBoList />
        </div>
      </main>

      {/* Footer nội bộ */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-6 text-center text-xs border-t border-slate-800 mt-8">
        <div className="max-w-7xl mx-auto">
          Chi bộ Tổ dân phố Lương Hậu · Đảng ủy phường Hương Thủy · Thành phố Huế.<br />
          <span className="text-[11px] text-slate-500">
            Tài liệu lưu hành nội bộ Chi bộ theo Quyết định 46-QĐ/ĐU và Quyết định 556-QĐ/VPTW.
          </span>
        </div>
      </footer>
    </div>
  );
}
