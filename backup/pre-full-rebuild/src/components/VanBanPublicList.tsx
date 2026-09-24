"use client";

import React, { useState, useMemo } from "react";
import { getPublicDocuments, DocumentItem } from "../data/master-documents";

export default function VanBanPublicList() {
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Chỉ lấy văn bản CÔNG KHAI (PUBLIC), tuyệt đối không để lộ văn bản nội bộ
  const publicDocs: DocumentItem[] = useMemo(() => getPublicDocuments() || [], []);

  // 3 Tab bộ lọc nhanh theo đúng yêu cầu: [Tất cả] - [Cấp Trung ương / Thành phố] - [Cấp Tổ dân phố]
  const QUICK_TABS = [
    { id: "ALL", label: "Tất cả văn bản" },
    { id: "Cấp Trung ương / Thành phố", label: "Cấp Trung ương / Thành phố" },
    { id: "Cấp TDP Lương Hậu", label: "Cấp Tổ dân phố" },
  ];

  // Lọc dữ liệu phòng thủ
  const filteredDocs = useMemo(() => {
    return (publicDocs || []).filter((doc) => {
      if (!doc) return false;
      let matchTier = true;
      if (selectedTier === "Cấp Trung ương / Thành phố") {
        matchTier = (doc.tier || "").includes("Trung ương") || (doc.tier || "").includes("Thành phố");
      } else if (selectedTier === "Cấp TDP Lương Hậu") {
        matchTier = (doc.tier || "").includes("TDP") || (doc.tier || "").includes("Lương Hậu") || (doc.tier || "").includes("Phường");
      }

      const q = (searchTerm || "").trim().toLowerCase();
      const matchSearch =
        q === "" ||
        (doc.title || "").toLowerCase().includes(q) ||
        (doc.issuer || "").toLowerCase().includes(q) ||
        (doc.summary || "").toLowerCase().includes(q) ||
        (doc.id || "").toLowerCase().includes(q);

      return matchTier && matchSearch;
    });
  }, [publicDocs, selectedTier, searchTerm]);

  // Huy hiệu định dạng file (PDF, DOCX, WEB)
  const getFileTypeBadge = (type: string) => {
    switch ((type || "").toUpperCase()) {
      case "PDF":
        return "bg-red-100 text-red-800 border-red-300";
      case "DOCX":
      case "DOC":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "WEB":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Khối giới thiệu quyền dân chủ ở cơ sở */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 md:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#93061d] text-yellow-300 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            ⚖️
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-amber-950">
              Hệ thống văn bản công khai phục vụ Nhân dân tra cứu
            </h2>
            <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
              Thực hiện Luật Thực hiện dân chủ ở cơ sở (Luật 10/2022/QH15) theo phương châm: Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <span className="text-xs bg-white text-[#93061d] px-3 py-1.5 rounded-full font-bold border border-amber-300 shadow-2xs">
            {(publicDocs || []).length} văn bản công khai
          </span>
        </div>
      </div>

      {/* Thanh tìm kiếm & 3 Tab bộ lọc nhanh */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* 3 Tab bộ lọc nhanh chuẩn yêu cầu: [Tất cả] - [Cấp Trung ương / Thành phố] - [Cấp Tổ dân phố] */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(QUICK_TABS || []).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTier(tab.id)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedTier === tab.id
                    ? "bg-[#93061d] text-yellow-300 shadow-xs border border-red-900 font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {tab.id === "ALL" ? "🏛️ " : tab.id.includes("Trung ương") ? "⭐ " : "🚩 "}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm nhanh theo tiêu đề hoặc cơ quan ban hành */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên văn bản, cơ quan ban hành..."
              className="w-full text-xs px-3 py-2 pl-8 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách các dòng văn bản công khai */}
      {(filteredDocs || []).length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300 space-y-3">
          <div className="text-3xl">📂</div>
          <p className="text-sm text-slate-600 font-medium">
            Không tìm thấy văn bản nào phù hợp với từ khóa tra cứu.
          </p>
          <button
            onClick={() => {
              setSelectedTier("ALL");
              setSearchTerm("");
            }}
            className="text-xs px-3.5 py-1.5 bg-[#93061d] text-white rounded-lg hover:bg-red-900 font-medium cursor-pointer"
          >
            Hiển thị lại tất cả văn bản
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {(filteredDocs || []).map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Thông tin văn bản: Tên, cơ quan ban hành, ngày ban hành, định dạng */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                    {doc.id}
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${getFileTypeBadge(doc.fileType)}`}>
                    {doc.fileType}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {doc.tier}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug hover:text-[#93061d] transition-colors">
                  {doc.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>🏛️ <b>Cơ quan:</b> {doc.issuer}</span>
                  <span>📅 <b>Ban hành:</b> {doc.promulgatedDate}</span>
                  <span>🏷️ <b>Thể loại:</b> {doc.category}</span>
                </div>

                {doc.summary && (
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {doc.summary}
                  </p>
                )}
              </div>

              {/* 2 nút bấm riêng biệt: "Xem trực tuyến" (target="_blank") và "Tải về" */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <a
                  href={doc.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-semibold flex items-center gap-1 transition text-center justify-center flex-1 md:flex-initial cursor-pointer"
                >
                  <span>Xem trực tuyến</span>
                  <span>↗</span>
                </a>

                <a
                  href={doc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3.5 py-2 bg-[#93061d] hover:bg-red-900 text-white rounded-xl font-semibold flex items-center gap-1 transition text-center justify-center flex-1 md:flex-initial shadow-2xs cursor-pointer"
                >
                  <span>Tải về</span>
                  <span>↓</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
