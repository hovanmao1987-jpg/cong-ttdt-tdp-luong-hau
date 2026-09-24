"use client";

import React, { useState } from "react";

export interface PostItem {
  id: number | string;
  eventDate: string;
  category: string;
  title: string;
  content: string;
  location: string;
  author: string;
  imageUrl?: string;
}

export type NewsArticle = PostItem;

interface TinTucListProps {
  initialArticles?: PostItem[];
  sourceEndpoint?: string;
}

export default function TinTucList({ initialArticles = [], sourceEndpoint }: TinTucListProps) {
  const [articles, setArticles] = useState<PostItem[]>(initialArticles || []);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<PostItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshMessage, setRefreshMessage] = useState<string>("");

  // Trích xuất danh sách chuyên mục an toàn
  const safeArticles = articles || [];
  const categories = [
    "all",
    ...Array.from(new Set(safeArticles.map((a) => (a && a.category ? a.category.trim() : "")).filter(Boolean)))
  ];

  // Lọc bài viết phòng thủ
  const filteredArticles = safeArticles.filter((item) => {
    if (!item) return false;
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      (item.title || "").toLowerCase().includes(q) ||
      (item.content || "").toLowerCase().includes(q) ||
      (item.author || "").toLowerCase().includes(q) ||
      (item.location || "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Làm mới dữ liệu từ Google Apps Script
  const handleRefresh = async () => {
    if (!sourceEndpoint) return;
    setIsRefreshing(true);
    setRefreshMessage("Đang kết nối Google Sheets...");
    try {
      const res = await fetch(sourceEndpoint, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json && json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
        setArticles(json.data);
        setRefreshMessage(`Đã cập nhật ${json.data.length} tin mới nhất!`);
      } else {
        throw new Error("Dữ liệu không đúng định dạng");
      }
    } catch (err) {
      console.warn("Không thể fetch trực tiếp từ trình duyệt:", err);
      setRefreshMessage("Đang hiển thị bản tin chuẩn hóa lưu trữ của TDP Lương Hậu.");
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setRefreshMessage(""), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Thanh công cụ: Bộ lọc chuyên mục, Tìm kiếm & Nút làm mới */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xs border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Bộ lọc chuyên mục */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(categories || []).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#93061d] text-yellow-300 shadow-xs border border-red-900"
                  : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              {cat === "all" ? "★ Tất cả tin tức" : cat}
            </button>
          ))}
        </div>

        {/* Ô tìm kiếm & Nút làm mới */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tin tức, sự kiện..."
              className="w-full text-xs px-3 py-2 pl-8 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {sourceEndpoint && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Làm mới từ Google Sheets"
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-[#93061d] border border-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            >
              <span className={isRefreshing ? "animate-spin" : ""}>🔄</span>
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Thông báo trạng thái */}
      {refreshMessage && (
        <div className="text-xs px-4 py-2 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl flex items-center justify-between animate-fadeIn">
          <span>{refreshMessage}</span>
          <button onClick={() => setRefreshMessage("")} className="text-amber-700 hover:text-amber-900 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Lưới danh sách bài viết (Grid Card) */}
      {(filteredArticles || []).length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300 space-y-3">
          <div className="text-3xl">📰</div>
          <p className="text-sm text-slate-600 font-medium">
            Không tìm thấy bản tin nào phù hợp với từ khóa đã chọn.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-xs px-3.5 py-1.5 bg-[#93061d] text-white rounded-lg hover:bg-red-900 font-medium"
          >
            Xem lại toàn bộ tin tức
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(filteredArticles || []).map((article) => {
            const hasImage = Boolean(article.imageUrl && article.imageUrl.trim().length > 0);

            return (
              <article
                key={article.id}
                className="group bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-red-400 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Khối Ảnh bài viết hoặc Banner đồ họa thay thế */}
                  <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-[#93061d] to-[#680414] overflow-hidden">
                    {hasImage ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title || "Tin tức Lương Hậu"}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}

                    {/* Lớp nền đồ họa SVG thay thế khi không có ảnh hoặc ảnh bị lỗi */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 select-none pointer-events-none -z-0">
                      <div className="w-12 h-12 rounded-full bg-yellow-400 text-red-950 flex items-center justify-center font-bold text-xl shadow mb-2 border border-yellow-200">
                        ★
                      </div>
                      <span className="text-yellow-300 text-xs font-bold tracking-wide uppercase">
                        TDP LƯƠNG HẬU
                      </span>
                      <span className="text-[10px] text-red-200">Phường Hương Thủy • TP. Huế</span>
                    </div>

                    {/* Nhãn chuyên mục */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#93061d]/95 text-yellow-300 border border-yellow-400/60 shadow-xs backdrop-blur-xs">
                        🏷️ {article.category || "Tin tức Lương Hậu"}
                      </span>
                    </div>

                    {/* Ngày tháng */}
                    <div className="absolute bottom-2 right-2 z-10">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/70 text-white backdrop-blur-xs">
                        📅 {article.eventDate || "Mới cập nhật"}
                      </span>
                    </div>
                  </div>

                  {/* Nội dung bài viết */}
                  <div className="p-4 space-y-2">
                    {/* Địa điểm */}
                    {article.location && (
                      <div className="flex items-center gap-1 text-[11px] text-amber-900 font-medium">
                        <span>📍</span>
                        <span className="truncate">{article.location}</span>
                      </div>
                    )}

                    {/* Tiêu đề bài viết */}
                    <h3
                      onClick={() => setSelectedArticle(article)}
                      className="font-bold text-slate-900 text-sm md:text-base leading-snug line-clamp-2 group-hover:text-[#93061d] cursor-pointer transition-colors"
                      title={article.title}
                    >
                      {article.title}
                    </h3>

                    {/* Nội dung tóm tắt line-clamp-3 chuẩn yêu cầu */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </div>

                {/* Footer thẻ: Người đăng & Nút xem chi tiết */}
                <div className="px-4 py-3 bg-amber-50/40 border-t border-amber-100 flex items-center justify-between gap-2 mt-2">
                  <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                    <span>✍️</span>
                    <span className="font-medium text-slate-700 truncate">{article.author || "Ban Điều hành TDP"}</span>
                  </div>

                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="text-xs font-semibold text-[#93061d] hover:text-red-700 hover:underline flex items-center gap-0.5 whitespace-nowrap cursor-pointer"
                  >
                    Xem chi tiết →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal Popup xem toàn bộ nội dung bài viết */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-yellow-400"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="sticky top-0 bg-[#93061d] text-white p-4 px-5 flex items-center justify-between border-b-2 border-yellow-400">
              <span className="text-yellow-300 font-bold text-xs sm:text-sm uppercase tracking-wide">
                ★ BẢN TIN TỔ DÂN PHỐ LƯƠNG HẬU
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Chi tiết nội dung */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 bg-red-100 text-[#93061d] font-bold rounded-full border border-red-200">
                  🏷️ {selectedArticle.category}
                </span>
                <span className="text-slate-500">📅 Ngày: <b>{selectedArticle.eventDate}</b></span>
                {selectedArticle.location && (
                  <span className="text-slate-500">📍 <b>{selectedArticle.location}</b></span>
                )}
                <span className="text-slate-500">✍️ <b>{selectedArticle.author}</b></span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>

              {selectedArticle.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-80 bg-slate-100 flex items-center justify-center">
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    loading="lazy"
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedArticle.content}
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>Nguồn tin: Chi bộ &amp; Ban Điều hành TDP Lương Hậu</span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-1.5 bg-[#93061d] text-white rounded-lg hover:bg-red-900 font-semibold transition"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
