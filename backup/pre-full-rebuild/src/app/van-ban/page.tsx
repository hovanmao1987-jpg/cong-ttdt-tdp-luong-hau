import React from 'react';
import data from '../../data/du-lieu-moi.json';
import DriveAttachmentList from '../../components/DriveAttachmentList';

export default function VanBanPage() {
  const { vanBan3Cap } = data;
  const { trungUong, thanhPho, phuongHuongThuy } = vanBan3Cap;

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

        <div className="bg-red-800 text-white rounded-2xl p-6 shadow-md border-b-4 border-amber-400">
          <h1 className="text-xl font-bold uppercase text-amber-300">
            Hệ thống văn bản chỉ đạo 3 cấp
          </h1>
          <p className="text-xs text-red-100 mt-1">
            Trung ương · UBND thành phố Huế · Đảng ủy phường Hương Thủy
          </p>
        </div>

        {/* Thành phố Huế */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200">
          <h2 className="text-base font-bold text-amber-900 border-b pb-2 mb-4 flex items-center gap-2">
            <span>🏛️</span> Kế hoạch 333/KH-UBND thành phố Huế
          </h2>
          {thanhPho.map((doc) => (
            <div key={doc.id} className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                  {doc.soHieu}
                </span>
                <span className="text-slate-500">Ngày {doc.ngay}</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{doc.trichYeu}</p>
              <div className="text-xs text-slate-600">
                <b>Người ký:</b> {doc.nguoiKy} · <b>Lĩnh vực:</b> {doc.linhVuc}
              </div>

              {doc.linkNguonChinhThong && (
                <div className="text-xs">
                  🔗 <b>Nguồn chính thống:</b>{" "}
                  <a
                    href={doc.linkNguonChinhThong}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline font-medium break-all"
                  >
                    {doc.linkNguonChinhThong} ↗
                  </a>
                </div>
              )}

              {/* Tệp đính kèm kết nối Google Drive API v3 */}
              <div className="pt-2 border-t border-amber-200">
                <DriveAttachmentList
                  title="Phụ lục & Tệp đính kèm Kế hoạch 333 (Google Drive)"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Đảng ủy phường Hương Thủy */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-200">
          <h2 className="text-base font-bold text-rose-900 border-b pb-2 mb-4 flex items-center gap-2">
            <span>🚩</span> Văn bản Đảng ủy phường Hương Thủy (Tháng 9/2026)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {phuongHuongThuy.map((doc, idx) => (
              <div key={idx} className="p-3 bg-rose-50/40 rounded-xl border border-rose-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <b className="text-red-900">{doc.soHieu}</b>
                    <span className="text-slate-400">{doc.ngay}</span>
                  </div>
                  <p className="text-xs text-slate-700">{doc.trichYeu}</p>
                </div>
                <div className="text-[11px] text-red-800 mt-2 pt-1 border-t border-rose-100">
                  Ký: {doc.nguoiKy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trung ương */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 border-b pb-2 mb-4 flex items-center gap-2">
            <span>⭐</span> Văn kiện &amp; Kế hoạch Trung ương
          </h2>
          <div className="space-y-2">
            {trungUong.map((doc, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                <div>
                  <b className="text-slate-800">{doc.soHieu}</b>
                  <span className="text-slate-500 ml-2">({doc.coQuan} - {doc.ngay})</span>
                  <p className="text-slate-600 mt-0.5">{doc.trichYeu}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
