import React from 'react';
import ChuNhatXanhSection from '../../components/ChuNhatXanhSection';
import data from '../../data/du-lieu-moi.json';

export default function ChuNhatXanhPage() {
  const { chuNhatXanh } = data;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="text-xs font-semibold text-red-800 hover:text-red-900 flex items-center gap-1"
          >
            ← Về trang chủ
          </a>
          <span className="text-xs text-slate-500">
            Cổng TTĐT Tổ dân phố Lương Hậu
          </span>
        </div>

        <ChuNhatXanhSection />

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b">
            Hồ sơ lưu trữ các đợt ra quân Ngày Chủ Nhật Xanh 2026
          </h3>
          <div className="space-y-4">
            {chuNhatXanh.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">
                    {item.tieuDe}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    {item.thoiGian}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{item.noiDung}</p>
                <p className="text-[11px] text-slate-400">
                  Địa điểm: {item.diaDiem} · Tệp ảnh: {item.hinhAnh.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
