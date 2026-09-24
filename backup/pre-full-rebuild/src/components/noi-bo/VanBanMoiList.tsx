import React, { useState, useMemo } from "react";
import rawData from "../../data/van-ban-phuong-thanh-pho.json";

export interface VanBanItem {
  id: string;
  soHieu: string;
  ngayBanHanh: string;
  coQuan: string;
  trichYeu: string;
  canCu: string;
  hanXuLy: string;
  loaiVanBan: "Hướng dẫn" | "Chỉ thị" | "Kế hoạch" | string;
  trangThai?: "KhanCap" | "SapDenHan" | "DangXuLy" | string;
  canBoPhuTrach?: string;
  nguoiTheoDoi?: string;
  fileDinhKem?: string;
  noiDungChiTiet?: string;
  linkNguonChinhThong?: string;
  tepDinhKem?: Array<{
    tenTep: string;
    duongDanXem: string;
    duongDanTai: string;
  }>;
}

export default function VanBanMoiList() {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<VanBanItem | null>(null);

  const vanBans: VanBanItem[] = rawData as VanBanItem[];

  const filteredData = useMemo(() => {
    return vanBans.filter((doc) => {
      const matchType = filterType === "ALL" || doc.loaiVanBan === filterType;
      const matchSearch =
        doc.soHieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.trichYeu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.coQuan.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });
  }, [vanBans, filterType, searchTerm]);

  const getBadgeClass = (trangThai?: string, hanXuLy?: string) => {
    if (trangThai === "KhanCap" || hanXuLy?.includes("21/09/2026")) {
      return "bg-red-100 text-red-800 border-red-300 animate-pulse";
    }
    if (trangThai === "SapDenHan" || hanXuLy?.includes("30/09/2026")) {
      return "bg-amber-100 text-amber-800 border-amber-300";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getLoaiTag = (loai: string) => {
    switch (loai) {
      case "Hướng dẫn":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Chỉ thị":
        return "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
      case "Kế hoạch":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Thanh thống kê & Bộ lọc */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-red-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
              Văn bản chỉ đạo mới của Phường &amp; Thành phố (Tháng 9/2026)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Theo dõi và kiểm soát tiến độ thực hiện các văn bản chỉ đạo của Đảng ủy phường Hương Thủy &amp; Thành ủy Huế
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
              Tổng số: {vanBans.length} văn bản
            </span>
          </div>
        </div>

        {/* Thanh tìm kiếm và bộ nút lọc */}
        <div className="mt-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "ALL", label: "Tất cả" },
              { id: "Hướng dẫn", label: "Hướng dẫn (2)" },
              { id: "Chỉ thị", label: "Chỉ thị (1)" },
              { id: "Kế hoạch", label: "Kế hoạch (4)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === tab.id
                    ? "bg-red-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo số hiệu, trích yếu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-72 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-2.5 top-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu danh sách văn bản */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="py-3.5 px-4 font-semibold w-12 text-center">STT</th>
                <th className="py-3.5 px-4 font-semibold w-36">Số hiệu / Ngày</th>
                <th className="py-3.5 px-4 font-semibold w-28">Loại</th>
                <th className="py-3.5 px-4 font-semibold">Trích yếu nội dung &amp; Căn cứ</th>
                <th className="py-3.5 px-4 font-semibold w-48">Hạn xử lý / Báo cáo</th>
                <th className="py-3.5 px-4 font-semibold w-32 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Không tìm thấy văn bản phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredData.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-red-900">{doc.soHieu}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{doc.ngayBanHanh}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{doc.coQuan}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] border ${getLoaiTag(
                          doc.loaiVanBan
                        )}`}
                      >
                        {doc.loaiVanBan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 leading-snug">
                        {doc.trichYeu}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 inline-block">
                        <span className="font-semibold text-slate-600">Căn cứ:</span> {doc.canCu}
                      </div>
                      {(doc.canBoPhuTrach || doc.nguoiTheoDoi) && (
                        <div className="mt-1 text-[11.5px] text-amber-900 bg-amber-50/90 p-1.5 rounded border border-amber-200/80 leading-snug">
                          👤 <b>Phụ trách thực hiện:</b> {doc.canBoPhuTrach || doc.nguoiTheoDoi}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border font-medium ${getBadgeClass(
                          doc.trangThai,
                          doc.hanXuLy
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {doc.hanXuLy}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="px-2.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold shadow-sm transition flex items-center gap-1"
                          title="Xem văn bản số hóa"
                        >
                          <span>📄</span> Xem văn bản
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer bảng */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            Hiển thị <b>{filteredData.length}</b> trên tổng số <b>{vanBans.length}</b> văn bản chỉ đạo mới
          </div>
          <div className="text-[11px] italic text-slate-400">
            Dữ liệu nội bộ Chi bộ TDP Lương Hậu — Bảo mật theo Quyết định 556-QĐ/VPTW
          </div>
        </div>
      </div>

      {/* Modal chi tiết văn bản */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                  Bản số hóa văn bản chỉ đạo
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedDoc.soHieu} — {selectedDoc.loaiVanBan}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-lg font-bold"
                title="Đóng (Esc)"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <b className="text-slate-600 text-xs">Cơ quan ban hành:</b>
                  <p className="font-semibold text-slate-800">{selectedDoc.coQuan}</p>
                </div>
                <div>
                  <b className="text-slate-600 text-xs">Ngày ban hành:</b>
                  <p className="text-slate-800">{selectedDoc.ngayBanHanh}</p>
                </div>
                <div>
                  <b className="text-slate-600 text-xs">Thời hạn xử lý / Báo cáo:</b>
                  <p className="font-bold text-red-700">{selectedDoc.hanXuLy}</p>
                </div>
                <div>
                  <b className="text-slate-600 text-xs">Tệp số hóa lưu trữ:</b>
                  <p className="text-sky-700 font-medium text-xs">
                    📄 {selectedDoc.fileDinhKem || `${selectedDoc.soHieu}.pdf`}
                  </p>
                </div>
              </div>

              <div>
                <b className="text-slate-600 text-xs">Phụ trách triển khai (Chi bộ):</b>
                <div className="mt-1 p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-900 font-medium text-xs leading-relaxed">
                  👤 {selectedDoc.canBoPhuTrach || selectedDoc.nguoiTheoDoi || "Toàn thể Chi bộ"}
                </div>
              </div>

              <div>
                <b className="text-slate-600 text-xs">Trích yếu nội dung:</b>
                <p className="text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                  {selectedDoc.trichYeu}
                </p>
              </div>

              <div>
                <b className="text-slate-600 text-xs">Căn cứ ban hành:</b>
                <p className="text-slate-600 text-xs italic">{selectedDoc.canCu}</p>
              </div>

              {selectedDoc.linkNguonChinhThong && (
                <div>
                  <b className="text-slate-600 text-xs">Nguồn chính thống ban hành:</b>
                  <div className="mt-1">
                    <a
                      href={selectedDoc.linkNguonChinhThong}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-900 font-semibold underline"
                    >
                      <span>🌐</span> {selectedDoc.linkNguonChinhThong} ↗
                    </a>
                  </div>
                </div>
              )}

              {selectedDoc.tepDinhKem && selectedDoc.tepDinhKem.length > 0 && (
                <div>
                  <b className="text-slate-600 text-xs">Hệ thống Phụ lục &amp; Biểu mẫu đính kèm:</b>
                  <div className="mt-1.5 space-y-2">
                    {selectedDoc.tepDinhKem.map((pl, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg gap-2 text-xs"
                      >
                        <span className="font-medium text-slate-800 flex items-center gap-1.5">
                          <span className="text-red-600 font-bold">📎</span> {pl.tenTep}
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={pl.duongDanXem}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded transition"
                          >
                            Xem trực tuyến ↗
                          </a>
                          <a
                            href={pl.duongDanTai}
                            download
                            className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white font-semibold rounded transition"
                          >
                            Tải về PDF 📥
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <b className="text-red-800 text-xs font-bold uppercase tracking-wider">
                  Toàn văn nội dung số hóa &amp; Giao nhiệm vụ cụ thể:
                </b>
                <div className="mt-1.5 text-xs text-slate-900 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-300 shadow-inner whitespace-pre-line">
                  {selectedDoc.noiDungChiTiet || selectedDoc.trichYeu}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5"
              >
                <span>🖨️</span> In văn bản
              </button>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
