import React from "react";
import SidebarNoiBo from "../../../components/noi-bo/SidebarNoiBo";
import RoadmapV2Button from "@/components/RoadmapV2Button";

export const metadata = {
  title: "Dashboard Điều hành Chi bộ — Tổ dân phố Lương Hậu",
  description:
    "Bảng điều hành công tác Đảng, theo dõi tiến độ nhiệm vụ 6 rõ và tiện ích số V2 của Chi bộ TDP Lương Hậu (phường Hương Thủy, TP. Huế)",
};

// Dữ liệu 10 Cán bộ chủ chốt phân công nhiệm vụ “6 Rõ”
const CADRES_6RO = [
  {
    ten: "Hồ Văn Mão",
    chucVu: "Bí thư Chi bộ",
    nhiemVu: "Lãnh đạo chung, xây dựng Đảng, kiểm tra giám sát, phê duyệt danh sách đối soát",
    diaBan: "Phụ trách Đội 11",
    tienDo: 96,
    xepLoai: "Hoàn thành trước hạn",
  },
  {
    ten: "Nguyễn Trọng Nghĩa",
    chucVu: "Phó Bí thư, Tổ trưởng TDP",
    nhiemVu: "Quản lý hành chính TDP, chỉ huy Tổ xung kích PCTT&TKCN, quản lý Sổ tay đảng viên",
    diaBan: "Phụ trách Đội 8",
    tienDo: 94,
    xepLoai: "Đúng tiến độ",
  },
  {
    ten: "Hoàng Hữu Rớt",
    chucVu: "Chi ủy viên, Trưởng ban CTMT",
    nhiemVu: "Khối đại đoàn kết, giám sát quy chế dân chủ, hòa giải cơ sở, dư luận nhân dân",
    diaBan: "Phụ trách Đội 9",
    tienDo: 92,
    xepLoai: "Đang triển khai - cao điểm",
  },
  {
    ten: "Nguyễn Thị Mừng",
    chucVu: "Chi ủy viên, Chi hội trưởng Phụ nữ",
    nhiemVu: "Phong trào 5 không 3 sạch, đôn đốc đảng phí, hậu cần phòng chống thiên tai",
    diaBan: "Phụ trách Đội 9",
    tienDo: 91,
    xepLoai: "Đúng tiến độ",
  },
  {
    ten: "Nguyễn Thúc Thành",
    chucVu: "Chi hội trưởng Nông dân, Tổ trưởng ANTT",
    nhiemVu: "Hỗ trợ nông nghiệp, chỉ huy tuần tra ANTT đêm Thứ 3 & Thứ 7, an toàn PCCC",
    diaBan: "Toàn địa bàn TDP",
    tienDo: 90,
    xepLoai: "Đúng tiến độ",
  },
  {
    ten: "Nguyễn Cưỡng",
    chucVu: "Chi hội trưởng Cựu chiến binh",
    nhiemVu: "Giáo dục truyền thống cách mạng, hội viên gương mẫu, phối hợp tuần tra giữ gìn ANTT",
    diaBan: "Toàn địa bàn TDP",
    tienDo: 88,
    xepLoai: "Đúng tiến độ",
  },
];

export default function DashboardNoiBoPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Header pano nội bộ Chi bộ */}
      <header className="bg-[#93061d] text-white py-3.5 px-4 md:px-8 border-b-2 border-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 text-red-900 flex items-center justify-center font-black text-lg shadow border border-yellow-200 shrink-0">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm md:text-base tracking-wide text-yellow-300 uppercase">
                  DASHBOARD ĐIỀU HÀNH CHI BỘ TDP LƯƠNG HẬU
                </h1>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-red-950 text-yellow-200 border border-yellow-500/40 font-semibold">
                  NỘI BỘ
                </span>
              </div>
              <p className="text-[11px] text-red-200">
                Đảng bộ phường Hương Thủy · Thành ủy Huế — Vận hành theo nguyên tắc “6 Rõ”
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href="/noi_bo"
              className="px-3 py-1.5 bg-red-900/80 hover:bg-red-900 rounded-lg border border-red-700 text-yellow-200 transition font-medium"
            >
              Cổng đối soát trung tâm
            </a>
            <a
              href="/"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white transition font-medium"
            >
              Trang công khai
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
          <span className="text-slate-900 font-semibold">Dashboard Chi bộ &amp; Tiện ích số V2</span>
        </div>
      </div>

      {/* Main Content với Sidebar */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 flex-1 flex flex-col md:flex-row gap-6">
        <SidebarNoiBo activeTab="dashboard" />

        <div className="flex-1 min-w-0 space-y-6">
          {/* THANH CÔNG CỤ ĐẦU TRANG DASHBOARD: ĐẶT NÚT BẤM NỔI BẬT THEO YÊU CẦU */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">📊</span>
                <h2 className="text-sm md:text-base font-bold text-slate-900 uppercase">
                  Bảng tổng hợp chỉ tiêu &amp; nhiệm vụ Chi bộ
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật tháng 9/2026 • Đánh giá theo Quyết định số 46-QĐ/ĐU
              </p>
            </div>

            {/* NÚT BẤM NỔI BẬT: 🚀 Tiện ích số & Lộ trình V2 */}
            <div className="shrink-0 flex items-center gap-2">
              <RoadmapV2Button />
            </div>
          </div>

          {/* Khối Thống kê nhanh 4 Chỉ số cốt lõi */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">Tổng số đảng viên</div>
              <div className="text-2xl font-black text-[#93061d] mt-1">22</div>
              <div className="text-[11px] text-emerald-600 mt-1 font-medium">
                ✓ Đã số hóa 100% hồ sơ
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">Tiến độ nhiệm vụ 6 Rõ</div>
              <div className="text-2xl font-black text-amber-600 mt-1">87,0%</div>
              <div className="text-[11px] text-amber-700 mt-1 font-semibold">
                Xếp loại: XUẤT SẮC
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">Địa bàn dân cư phụ trách</div>
              <div className="text-2xl font-black text-slate-800 mt-1">469</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Hộ gia đình (Đội 8, 9, 10, 11)
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">Sinh hoạt định kỳ</div>
              <div className="text-2xl font-black text-blue-800 mt-1">Ngày 03</div>
              <div className="text-[11px] text-blue-600 mt-1 font-medium">
                Hằng tháng tại Nhà SHCĐ
              </div>
            </div>
          </div>

          {/* Bảng theo dõi tiến độ cán bộ chủ chốt “6 RÕ” */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📋</span>
                <h3 className="font-bold text-sm md:text-base text-slate-900">
                  Phân công nhiệm vụ Cán bộ chủ chốt (Nguyên tắc 6 Rõ)
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 bg-red-50 text-[#93061d] font-bold rounded-lg border border-red-200">
                Nhiệm kỳ 2025 - 2030
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="py-2.5 px-3 font-bold">Họ và tên</th>
                    <th className="py-2.5 px-3 font-bold">Chức danh Đảng / Chính quyền</th>
                    <th className="py-2.5 px-3 font-bold">Nhiệm vụ trọng tâm</th>
                    <th className="py-2.5 px-3 font-bold">Địa bàn</th>
                    <th className="py-2.5 px-3 font-bold text-center">Tiến độ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CADRES_6RO.map((c, i) => (
                    <tr key={i} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {c.ten}
                      </td>
                      <td className="py-3 px-3 text-red-900 font-semibold whitespace-nowrap">
                        {c.chucVu}
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-xs">{c.nhiemVu}</td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{c.diaBan}</td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {c.tienDo}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Banner giới thiệu lộ trình tiện ích số V2 */}
          <div className="bg-gradient-to-r from-red-900 via-red-800 to-amber-900 text-white rounded-2xl p-5 border-2 border-yellow-400 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-400 text-red-950 text-[11px] font-bold uppercase">
                <span>🚀</span> Đột phá Chuyển đổi số 2026 - 2030
              </div>
              <h3 className="text-base font-bold text-yellow-300">
                Lộ trình 7 Tiện ích số V2 Chi bộ Lương Hậu
              </h3>
              <p className="text-xs text-red-100 max-w-xl">
                Bao gồm: QR Code điểm danh, Thông báo Zalo, Email tự động, Biểu mẫu điện tử (Mẫu 09), Báo cáo tự động, Trợ lý AI hỗ trợ Bí thư và Tra cứu văn bản bằng AI.
              </p>
            </div>

            <div className="shrink-0">
              <RoadmapV2Button className="!bg-yellow-400 !text-red-950 !border-yellow-200 hover:!bg-yellow-300 shadow-lg" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer nội bộ */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-6 text-center text-xs border-t border-slate-800 mt-8">
        <div className="max-w-7xl mx-auto">
          Chi bộ Tổ dân phố Lương Hậu · Đảng bộ phường Hương Thủy · Thành phố Huế.<br />
          <span className="text-[11px] text-slate-500">
            Hệ thống quản trị nội bộ Chi bộ tuân thủ Quyết định 556-QĐ/VPTW và Kế hoạch 213-KH/VPTW.
          </span>
        </div>
      </footer>
    </div>
  );
}
