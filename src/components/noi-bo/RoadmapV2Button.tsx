"use client";

import React, { useState } from "react";
import RoadmapV2Modal from "./RoadmapV2Modal";

interface RoadmapV2ButtonProps {
  className?: string;
}

export default function RoadmapV2Button({ className = "" }: RoadmapV2ButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        id="btn-roadmap-v2-action"
        title="Bấm để mở Lộ trình tiện ích số V2 của Chi bộ TDP Lương Hậu"
        className={`group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#93061d] via-[#b50e29] to-[#800516] hover:from-[#b50e29] hover:to-[#93061d] text-yellow-300 font-bold text-xs sm:text-sm rounded-xl border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:shadow-[0_0_22px_rgba(250,204,21,0.65)] hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer ring-2 ring-yellow-400/30 ${className}`}
      >
        {/* Biểu tượng tên lửa với hiệu ứng chuyển động */}
        <span className="text-base sm:text-lg group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
          🚀
        </span>

        {/* Tên nút bấm theo đúng yêu cầu */}
        <span className="tracking-wide font-extrabold text-yellow-300 drop-shadow-xs">
          Tiện ích số &amp; Lộ trình V2
        </span>

        {/* Huy hiệu màu đỏ - vàng nổi bật */}
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-yellow-400 text-red-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
          V2 MỚI
        </span>
      </button>

      {/* Modal Popup hiển thị 7 tính năng cốt lõi */}
      <RoadmapV2Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
