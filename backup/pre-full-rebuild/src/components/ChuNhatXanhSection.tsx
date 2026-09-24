import React from 'react';
import data from '../data/du-lieu-moi.json';

export default function ChuNhatXanhSection() {
  const { chuNhatXanh } = data;

  return (
    <div className="w-full max-w-5xl mx-auto my-6 p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-emerald-100">
      <div className="flex items-center gap-3 border-b pb-4 mb-6 border-emerald-200">
        <span className="text-3xl">🌱</span>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 uppercase">
            Phong trào Ngày Chủ Nhật Xanh - Tổ Dân Phố Lương Hậu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Hành động vì môi trường "Xanh - Sạch - Sáng" tuyến đường Thái Thuận &amp; Thái Vĩnh Chinh
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {chuNhatXanh.map((item) => (
          <div key={item.id} className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  📅 {item.thoiGian}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
                {item.tieuDe}
              </h3>
              <p className="text-xs text-emerald-900 font-semibold mb-1">
                📍 {item.diaDiem}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.noiDung}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-700 font-bold">
              <span>📸 {item.hinhAnh.length} ảnh hoạt động</span>
              <span className="hover:underline cursor-pointer">Xem chi tiết →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
