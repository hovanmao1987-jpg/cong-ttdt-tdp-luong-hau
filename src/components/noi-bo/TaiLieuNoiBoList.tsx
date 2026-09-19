"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getInternalDocuments, DocumentItem } from "../../data/master-documents";

// Danh sách 22 đồng chí Đảng viên Chi bộ TDP Lương Hậu theo QĐ số 46-QĐ/ĐU
const PARTY_ROSTER = [
  { id: "dv01", stt: 1,  hoTen: "Hồ Văn Mão",        ngaysinh: "02/02/1989", chucVu: "Bí thư Chi bộ",                        sdt: "0962 481 112", doi: "Đội 11", pheDuyet: "30/06/2026", vaiTro: "admin" },
  { id: "dv02", stt: 2,  hoTen: "Nguyễn Trọng Nghĩa", ngaysinh: "17/05/1980", chucVu: "Phó Bí thư Chi bộ - Tổ trưởng TDP",     sdt: "0965 712 812", doi: "Đội 8", pheDuyet: "30/06/2026", vaiTro: "admin" },
  { id: "dv03", stt: 3,  hoTen: "Hoàng Hữu Rớt",     ngaysinh: "23/08/1978", chucVu: "Chi uỷ viên - Trưởng ban CTMT",         sdt: "0965 943 303", doi: "Đội 9", pheDuyet: "30/06/2026", vaiTro: "admin" },
  { id: "dv04", stt: 4,  hoTen: "Nguyễn Thị Mừng",   ngaysinh: "26/10/1979", chucVu: "Đảng viên - Chi hội trưởng Phụ nữ",     sdt: "0377 412 815", doi: "Đội 9", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv05", stt: 5,  hoTen: "Ngô Thị Hoài Cẩm",  ngaysinh: "24/09/1989", chucVu: "Đảng viên",                            sdt: "0912 994 431", doi: "Đội 10", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv06", stt: 6,  hoTen: "Phạm Sằng",         ngaysinh: "02/02/1956", chucVu: "Đảng viên",                            sdt: "0372 500 460", doi: "Đội 10", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv07", stt: 7,  hoTen: "Lê Thị Thu Thủy",   ngaysinh: "30/04/1988", chucVu: "Đảng viên",                            sdt: "0912 721 759", doi: "Đội 8", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv08", stt: 8,  hoTen: "Phạm Quang",        ngaysinh: "19/12/1981", chucVu: "Đảng viên",                            sdt: "0911 344 787", doi: "Đội 9", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv09", stt: 9,  hoTen: "Nguyễn Cần",        ngaysinh: "12/08/1972", chucVu: "Đảng viên",                            sdt: "0946 580 955", doi: "Đội 9", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv10", stt: 10, hoTen: "Nguyễn Như Khả",    ngaysinh: "20/08/1981", chucVu: "Đảng viên",                            sdt: "0935 022 236", doi: "Đội 10", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv11", stt: 11, hoTen: "Lê Thị Thùy Dung",  ngaysinh: "20/02/1990", chucVu: "Đảng viên",                            sdt: "0973 156 625", doi: "Đội 10", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv12", stt: 12, hoTen: "Phạm Phước Thành",  ngaysinh: "10/01/1975", chucVu: "Đảng viên",                            sdt: "0345 309 179", doi: "Đội 11", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv13", stt: 13, hoTen: "Nguyễn Thị Huê",    ngaysinh: "10/10/1956", chucVu: "Đảng viên",                            sdt: "0332 062 150", doi: "Đội 9", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv14", stt: 14, hoTen: "Lê Thị Bích Hạnh",  ngaysinh: "20/04/1994", chucVu: "Đảng viên",                            sdt: "0358 852 534", doi: "Đội 9", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv15", stt: 15, hoTen: "Nguyễn Quang Ngọc", ngaysinh: "28/07/1987", chucVu: "Đảng viên",                            sdt: "0972 667 112", doi: "Đội 9", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv16", stt: 16, hoTen: "Phạm Tiến",         ngaysinh: "29/12/1986", chucVu: "Đảng viên",                            sdt: "0984 920 085", doi: "Đội 9", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv17", stt: 17, hoTen: "Nguyễn Thị Thủy",   ngaysinh: "12/09/1987", chucVu: "Đảng viên",                            sdt: "0986 658 502", doi: "Đội 9", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv18", stt: 18, hoTen: "Hoàng Đình Cường",  ngaysinh: "10/04/1991", chucVu: "Đảng viên",                            sdt: "0935 567 976", doi: "Đội 10", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv19", stt: 19, hoTen: "Nguyễn Văn Quân",   ngaysinh: "01/01/1999", chucVu: "Đảng viên",                            sdt: "0345 458 799", doi: "Đội 11", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv20", stt: 20, hoTen: "Nguyễn Thúc Thông", ngaysinh: "28/01/1995", chucVu: "Đảng viên",                            sdt: "(chưa cập nhật)", doi: "Đội 8", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv21", stt: 21, hoTen: "Phạm Thị Lưỡng",    ngaysinh: "23/07/1986", chucVu: "Đảng viên",                            sdt: "0988 212 249", doi: "Đội 9", pheDuyet: "30/06/2026", vaiTro: "user" },
  { id: "dv22", stt: 22, hoTen: "Hồ Công Long",      ngaysinh: "23/09/1994", chucVu: "Đảng viên",                            sdt: "(chưa cập nhật)", doi: "Đội 10", pheDuyet: "30/06/2026", vaiTro: "user" }
];

function normalize(str: string) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDate(str: string) {
  const clean = (str || "").trim().replace(/[-.]/g, "/");
  const parts = clean.split("/");
  if (parts.length === 3) {
    const d = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    const y = parts[2].length === 2 ? `19${parts[2]}` : parts[2];
    return `${d}/${m}/${y}`;
  }
  return clean;
}

export default function TaiLieuNoiBoList() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [inputName, setInputName] = useState("");
  const [inputDob, setInputDob] = useState("");
  const [authError, setAuthError] = useState("");
  const [selectedTier, setSelectedTier] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const saved =
        sessionStorage.getItem("lh.nb.session") ||
        localStorage.getItem("lh.nb.session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.ten) {
          setCurrentUser(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  setAuthError("");

  const normName = normalize(inputName);
  const formattedDob = normalizeDate(inputDob);

  if (normName.length < 3) {
    setAuthError("Vui lòng nhập đầy đủ họ và tên đảng viên.");
    return;
  }

  if (!formattedDob || formattedDob.length !== 10) {
    setAuthError("Vui lòng nhập đúng ngày, tháng, năm sinh theo định dạng dd/mm/yyyy.");
    return;
  }

  // Tìm đảng viên theo họ tên trong danh sách 22 đồng chí
  const matchedByName = (PARTY_ROSTER || []).filter((m) => normalize(m.hoTen) === normName);

  if (matchedByName.length === 0) {
    setAuthError("Họ tên không có trong danh sách 22 đảng viên theo Quyết định số 46-QĐ/ĐU.");
    return;
  }

  // Đối chiếu ngày sinh
  const found = matchedByName.find((m) => normalizeDate(m.ngaysinh) === formattedDob);

  if (!found) {
    setAuthError("Ngày/tháng/năm sinh không khớp với hồ sơ đăng ký của đồng chí.");
    return;
  }

  const sessionObj = {
    id: found.id,
    ten: found.hoTen,
    chucVu: found.chucVu,
    ns: found.ngaysinh,
    role: found.vaiTro,
    loginAt: new Date().toLocaleString("vi-VN")
  };

  try {
    localStorage.setItem("lh.nb.session", JSON.stringify(sessionObj));
    sessionStorage.setItem("lh.nb.session", JSON.stringify(sessionObj));
  } catch (err) {
    console.error(err);
  }

  setCurrentUser(sessionObj);
  setAuthError("");
};

// Đăng xuất
const handleLogout = () => {
  try {
    localStorage.removeItem("lh.nb.session");
    sessionStorage.removeItem("lh.nb.session");
  } catch (err) {
    console.error(err);
  }
  setCurrentUser(null);
  setInputName("");
  setInputDob("");
};

// Lấy danh sách văn bản NỘI BỘ
const internalDocs: DocumentItem[] = useMemo(() => getInternalDocuments() || [], []);

// Danh mục cấp & thể loại
const tiers = useMemo(() => ["ALL", ...Array.from(new Set((internalDocs || []).map((d) => d.tier)))], [internalDocs]);
const categories = useMemo(() => ["ALL", ...Array.from(new Set((internalDocs || []).map((d) => d.category)))], [internalDocs]);

// Lọc tài liệu nội bộ
const filteredDocs = useMemo(() => {
  return (internalDocs || []).filter((doc) => {
    if (!doc) return false;
    const matchTier = selectedTier === "ALL" || doc.tier === selectedTier;
    const matchCat = selectedCategory === "ALL" || doc.category === selectedCategory;
    const q = (searchTerm || "").trim().toLowerCase();
    const matchSearch =
      q === "" ||
      (doc.title || "").toLowerCase().includes(q) ||
      (doc.summary || "").toLowerCase().includes(q) ||
      (doc.issuer || "").toLowerCase().includes(q) ||
      (doc.id || "").toLowerCase().includes(q);
    return matchTier && matchCat && matchSearch;
  });
}, [internalDocs, selectedTier, selectedCategory, searchTerm]);

// Huy hiệu tệp
const getFileTypeBadge = (type: string) => {
  switch ((type || "").toUpperCase()) {
    case "DOCX":
    case "DOC":
      return "bg-blue-100 text-blue-900 border-blue-300";
    case "PDF":
      return "bg-red-100 text-red-900 border-red-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
};

if (isCheckingAuth) {
  return (
    <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
      <div className="animate-spin text-xl mb-2">🔄</div>
      Đang kiểm tra quyền truy cập Khu vực nội bộ Chi bộ...
    </div>
  );
}

// 1. TRƯỜNG HỢP CHƯA ĐĂNG NHẬP: LỚP ĐỐI SOÁT AN NINH CHI BỘ
if (!currentUser) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-red-800 shadow-xl overflow-hidden animate-fadeIn">
      <div className="bg-[#93061d] p-5 text-white text-center border-b-2 border-yellow-400">
        <div className="w-12 h-12 rounded-full bg-yellow-400 text-red-900 flex items-center justify-center font-black text-2xl mx-auto mb-2 shadow border border-yellow-200">
          ★
        </div>
        <h2 className="font-bold text-sm uppercase tracking-wide text-yellow-300">
          LỚP ĐỐI SOÁT TRUY CẬP NỘI BỘ
        </h2>
        <p className="text-xs text-red-100 mt-0.5">
          Kho tài liệu nghiệp vụ Chi bộ TDP Lương Hậu
        </p>
      </div>

      <form onSubmit={handleLogin} className="p-6 space-y-4">
        <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
          🔒 <b>Bảo mật cấp ủy:</b> Khu vực tài liệu dành riêng cho <b>22 đảng viên Chi bộ</b> theo Quyết định số 46-QĐ/ĐU. Vui lòng đối soát thông tin để tiếp tục.
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-xs text-red-800 font-medium">
            ⚠️ {authError}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Họ và tên đảng viên:
          </label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Ví dụ: Hồ Văn Mão hoặc Nguyễn Trọng Nghĩa"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Ngày, tháng, năm sinh (dd/mm/yyyy):
          </label>
          <input
            type="text"
            value={inputDob}
            onChange={(e) => setInputDob(e.target.value)}
            placeholder="Ví dụ: 02/02/1989"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[#93061d] hover:bg-red-900 text-yellow-300 font-bold rounded-xl text-xs transition active:scale-98 shadow-md border border-red-950 cursor-pointer"
        >
          Xác thực &amp; Mở khóa kho tài liệu nội bộ
        </button>

        <div className="text-center pt-2">
          <a
            href="/noi_bo"
            className="text-[11px] text-red-800 hover:underline font-semibold"
          >
            ← Trở về Cổng đối soát trung tâm (/noi_bo)
          </a>
        </div>
      </form>
    </div>
  );
}

// 2. TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP: HIỂN THỊ KHO TÀI LIỆU NỘI BỘ
return (
  <div className="space-y-6">
    {/* Banner thông tin Đảng viên đã đối soát & Nút đăng xuất */}
    <div className="bg-[#1b060a] text-white p-4 md:p-5 rounded-2xl border border-red-900 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-700 border-2 border-yellow-400 text-yellow-300 flex items-center justify-center font-bold text-lg shadow shrink-0">
          ★
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-200">Đồng chí:</span>
            <span className="text-sm font-bold text-yellow-300">{currentUser.ten}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-900/80 text-yellow-200 border border-yellow-500/50">
              {currentUser.chucVu || "Đảng viên Chi bộ"}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Quyền hạn: Tra cứu nghị quyết, quy chế và 17 văn bản mẫu nghiệp vụ Chi bộ
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <span className="text-[11px] bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/40">
          ✓ ĐÃ ĐỐI SOÁT HỢP LỆ
        </span>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1 bg-red-900/60 hover:bg-red-800 text-red-100 border border-red-700 rounded-lg transition cursor-pointer"
        >
          Đăng xuất
        </button>
      </div>
    </div>

    {/* Cảnh báo tính bảo mật bắt buộc theo yêu cầu */}
    <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs text-rose-900 flex items-start gap-2.5 shadow-2xs">
      <span className="text-base shrink-0">🔒</span>
      <div>
        <h4 className="font-bold uppercase text-red-900">
          Tài liệu lưu hành nội bộ Chi bộ Tổ dân phố Lương Hậu
        </h4>
        <p className="mt-0.5 leading-relaxed text-slate-700">
          Khu vực lưu trữ hồ sơ, biểu mẫu và nghị quyết dành riêng cho 22 đồng chí đảng viên và Cấp ủy Chi bộ TDP Lương Hậu. Nghiêm cấm sao chép, chia sẻ hoặc phổ biến ra ngoài phạm vi Chi bộ.
        </p>
      </div>
    </div>

    {/* Thanh tìm kiếm & bộ lọc tài liệu nội bộ */}
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-2xs border border-slate-200 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Lọc theo Cấp ban hành */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Cấp tài liệu:</span>
          {(tiers || []).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${selectedTier === t
                ? "bg-[#93061d] text-yellow-300 shadow-xs border border-red-900 font-bold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
            >
              {t === "ALL" ? "⭐ Tất cả cấp nội bộ" : t}
            </button>
          ))}
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm nghị quyết, quy chế, mẫu 15, 16..."
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

      {/* Lọc theo Chuyên mục nghiệp vụ */}
      <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
        <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Chuyên mục:</span>
        {(categories || []).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition cursor-pointer ${selectedCategory === cat
              ? "bg-red-100 text-red-900 font-bold border border-red-300"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
          >
            {cat === "ALL" ? "Tất cả chuyên mục" : cat}
          </button>
        ))}
      </div>
    </div>

    {/* Danh sách 6 tài liệu nội bộ chuẩn yêu cầu */}
    {(filteredDocs || []).length === 0 ? (
      <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300 space-y-3">
        <div className="text-3xl">📁</div>
        <p className="text-sm text-slate-600 font-medium">
          Không tìm thấy tài liệu nội bộ nào phù hợp với bộ lọc hiện tại.
        </p>
        <button
          onClick={() => {
            setSelectedTier("ALL");
            setSelectedCategory("ALL");
            setSearchTerm("");
          }}
          className="text-xs px-3.5 py-1.5 bg-red-800 text-white rounded-lg hover:bg-red-900 font-medium cursor-pointer"
        >
          Hiển thị lại toàn bộ tài liệu
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(filteredDocs || []).map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border-2 border-red-100 p-5 shadow-2xs hover:shadow-md hover:border-red-400 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header thẻ */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold px-2 py-0.5 rounded bg-red-50 text-[#93061d] border border-red-200 text-[11px]">
                    {doc.id}
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${getFileTypeBadge(doc.fileType)}`}>
                    {doc.fileType}
                  </span>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                  {doc.tier}
                </span>
              </div>

              {/* Tiêu đề tài liệu */}
              <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug hover:text-[#93061d] transition-colors">
                {doc.title}
              </h3>

              {/* Cơ quan & phân loại */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>🚩 <b>Cơ quan:</b> {doc.issuer}</span>
                <span>📅 <b>Ban hành:</b> {doc.promulgatedDate}</span>
                <span>📁 <b>Thể loại:</b> {doc.category}</span>
              </div>

              {/* Tóm tắt nội dung */}
              <div className="bg-red-50/40 p-3 rounded-xl border border-red-100 text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-red-950">Trích yếu nội bộ:</span> {doc.summary}
              </div>
            </div>

            {/* Nút thao tác riêng biệt: "Xem tài liệu" (target="_blank") và "Tải tệp" */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-red-800 font-semibold flex items-center gap-1">
                <span>🔒</span> Lưu hành nội bộ
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={doc.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#93061d] border border-red-300 rounded-lg font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Xem trực tuyến</span>
                  <span>↗</span>
                </a>

                <a
                  href={doc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 bg-[#93061d] hover:bg-red-900 text-white rounded-lg font-semibold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                >
                  <span>Tải tệp</span>
                  <span>↓</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
