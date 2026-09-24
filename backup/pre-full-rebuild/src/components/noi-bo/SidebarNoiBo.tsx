import React from "react";

interface SidebarNoiBoProps {
  activeTab?: string;
  activeSubTab?: string;
}

export default function SidebarNoiBo({
  activeTab = "van-ban-moi",
  activeSubTab = "ALL",
}: SidebarNoiBoProps) {
  const menuTree = [
    {
      id: "dashboard",
      label: "Dashboard Chi bộ",
      icon: "📊",
      href: "/noi-bo/dashboard",
    },
    {
      id: "roadmap-v2",
      label: "Tiện ích số & Lộ trình V2",
      icon: "🚀",
      href: "/noi-bo/roadmap-v2",
      isNew: true,
      badge: "V2 MỚI",
    },
    {
      id: "dangvien",
      label: "Danh sách đảng viên",
      icon: "👤",
      href: "/noi_bo#/noi-bo/canbo",
    },
    {
      id: "sinhhoat",
      label: "Sinh hoạt Chi bộ",
      icon: "📅",
      href: "/noi_bo#/noi-bo/tongquan",
      children: [
        { id: "diemdanh", label: "Điểm danh", icon: "✅" },
        { id: "noidung", label: "Nội dung sinh hoạt", icon: "📝" },
      ],
    },
    {
      id: "nghiquyet",
      label: "Nghị quyết Chi bộ",
      icon: "📜",
      href: "/noi_bo#/noi-bo/vanban",
    },
    {
      id: "van-ban-moi",
      label: "Văn bản mới Phường & TP",
      icon: "📂",
      href: "/noi-bo/van-ban-moi",
      isNew: true,
      badge: "MỤC MỚI (6)",
      children: [
        { id: "chi-dao", label: "Văn bản chỉ đạo, chỉ thị", icon: "📌", count: 1 },
        { id: "huong-dan", label: "Hướng dẫn quán triệt, học tập", icon: "📖", count: 2 },
        { id: "ke-hoach", label: "Kế hoạch & Mô hình thi đua", icon: "📋", count: 3 },
      ],
    },
    {
      id: "hoso",
      label: "Hồ sơ – Tài liệu",
      icon: "📁",
      href: "/noi-bo/tai-lieu",
    },
    {
      id: "phancong",
      label: "Phân công nhiệm vụ (6 Rõ)",
      icon: "📊",
      href: "/noi_bo#/noi-bo/canbo",
    },
    {
      id: "tiendo",
      label: "Theo dõi tiến độ nhiệm vụ",
      icon: "📈",
      href: "/noi_bo#/noi-bo/canbo",
    },
  ];

  return (
    <aside className="w-full md:w-72 bg-[#1b060a] text-white p-4 rounded-xl border border-red-950/50 shadow-xl flex flex-col justify-between">
      <div>
        {/* Tiêu đề sidebar */}
        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-red-900/40">
          <div className="w-9 h-9 rounded-full bg-red-700 border border-yellow-400 flex items-center justify-center font-bold text-yellow-300 text-base shadow">
            ★
          </div>
          <div>
            <h1 className="font-bold text-xs tracking-wider text-yellow-300 uppercase">
              KHU VỰC NỘI BỘ CHI BỘ
            </h1>
            <p className="text-[11px] text-red-200">Chi bộ TDP Lương Hậu</p>
          </div>
        </div>

        {/* Danh sách menu phân cấp */}
        <nav className="space-y-1 text-xs">
          {menuTree.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="space-y-0.5">
                <a
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-red-800 text-white font-semibold shadow border border-yellow-400/40"
                      : "text-red-100/90 hover:bg-red-900/40 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-yellow-400 text-red-950 font-bold text-[9px] shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </a>

                {/* Tiểu mục con */}
                {item.children && (
                  <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-red-900/30 ml-4 my-1">
                    {item.children.map((sub) => {
                      const isSubActive = activeSubTab === sub.id;
                      return (
                        <a
                          key={sub.id}
                          href={`/noi-bo/van-ban-moi#${sub.id}`}
                          className={`flex items-center justify-between py-1.5 px-2.5 rounded text-[11px] transition ${
                            isSubActive
                              ? "bg-red-700/80 text-yellow-200 font-semibold"
                              : "text-red-200/80 hover:bg-red-900/30 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span>{sub.icon}</span>
                            <span className="truncate">{sub.label}</span>
                          </div>
                          {"count" in sub && (
                            <span className="text-[10px] text-yellow-400 font-bold bg-black/30 px-1.5 rounded">
                              {sub.count}
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Chân sidebar */}
      <div className="mt-6 pt-3 border-t border-red-900/40">
        <a
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-300 hover:text-white hover:bg-red-900/30 rounded-lg transition"
        >
          <span>←</span>
          <span>Về trang chủ công khai</span>
        </a>
      </div>
    </aside>
  );
}
