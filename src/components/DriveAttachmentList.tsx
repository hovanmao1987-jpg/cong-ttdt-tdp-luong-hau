'use client';

import React, { useEffect, useState } from 'react';
import { getGoogleDriveFiles, DriveFile, DEFAULT_DRIVE_FILES } from '../lib/googleDrive';

interface DriveAttachmentListProps {
  folderId?: string;
  apiKey?: string;
  title?: string;
  initialFiles?: DriveFile[];
}

export default function DriveAttachmentList({
  folderId,
  apiKey,
  title = "Danh mục tệp đính kèm & Biểu mẫu (Google Drive)",
  initialFiles
}: DriveAttachmentListProps) {
  const [files, setFiles] = useState<DriveFile[]>(initialFiles || DEFAULT_DRIVE_FILES);
  const [loading, setLoading] = useState<boolean>(!initialFiles);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFiles() {
      try {
        setLoading(true);
        setError(null);
        const data = await getGoogleDriveFiles(folderId, apiKey);
        if (isMounted) {
          setFiles(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError("Không thể tải danh sách từ Google Drive. Đang hiển thị danh mục dự phòng.");
          setFiles(DEFAULT_DRIVE_FILES);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFiles();

    return () => {
      isMounted = false;
    };
  }, [folderId, apiKey]);

  // Chọn icon phù hợp theo định dạng mime
  const getFileIcon = (mimeType: string, name: string) => {
    const lower = (name + " " + mimeType).toLowerCase();
    if (lower.includes("pdf")) return "📕";
    if (lower.includes("sheet") || lower.includes("excel") || lower.includes("xls")) return "📊";
    if (lower.includes("doc") || lower.includes("word")) return "📝";
    if (lower.includes("image") || lower.includes("png") || lower.includes("jpg")) return "🖼️";
    if (lower.includes("zip") || lower.includes("rar")) return "📦";
    return "📄";
  };

  return (
    <div className="w-full bg-white rounded-xl border border-amber-200 shadow-sm p-4 my-4">
      <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📁</span>
          <h3 className="font-bold text-sm sm:text-base text-amber-950">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-xs text-amber-600 flex items-center gap-1 animate-pulse">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Đang đồng bộ...
            </span>
          )}
          <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            {files.length} tệp
          </span>
        </div>
      </div>

      {error && (
        <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded mb-3 border border-amber-200">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-2.5">
        {files.map((file) => (
          <div
            key={file.id}
            className="p-3 bg-slate-50 hover:bg-amber-50/50 rounded-lg border border-slate-200 hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
              <span className="text-2xl select-none flex-shrink-0">
                {getFileIcon(file.mimeType, file.name)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-semibold text-slate-800 break-words line-clamp-2">
                  {file.name}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  {file.size && <span>Dung lượng: {file.size}</span>}
                  <span className="hidden sm:inline">·</span>
                  <span className="text-emerald-700 font-medium">Google Drive API v3</span>
                </div>
              </div>
            </div>

            {/* 2 nút hành động: Xem trực tuyến & Tải về */}
            <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
              <a
                href={file.duongDanXem || file.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                title="Mở xem trực tiếp trên Google Drive"
              >
                <span>👁️</span>
                <span>Xem trực tuyến</span>
              </a>

              <a
                href={file.duongDanTai || file.webContentLink || file.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                title="Tải tệp tin về máy"
              >
                <span>📥</span>
                <span>Tải về</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
