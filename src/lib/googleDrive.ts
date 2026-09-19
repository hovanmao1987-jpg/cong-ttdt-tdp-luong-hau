/**
 * src/lib/googleDrive.ts
 * Module kết nối và đọc danh sách tệp đính kèm từ Google Drive API v3
 * Đọc cấu hình qua biến môi trường:
 *   - NEXT_PUBLIC_DRIVE_FOLDER_ID
 *   - NEXT_PUBLIC_DRIVE_API_KEY
 */

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink: string;
  webContentLink?: string;
  duongDanXem: string;
  duongDanTai: string;
  createdTime?: string;
}

// Danh sách tệp đính kèm mặc định dự phòng (Kế hoạch 333/KH-UBND thành phố Huế)
export const DEFAULT_DRIVE_FILES: DriveFile[] = [
  {
    id: "ID_FILE_PL3",
    name: "Phụ lục 3: Chỉ tiêu kê khai đất đai",
    mimeType: "application/pdf",
    size: "1.2 MB",
    webViewLink: "https://drive.google.com/file/d/ID_FILE_PL3/view",
    webContentLink: "https://drive.google.com/uc?export=download&id=ID_FILE_PL3",
    duongDanXem: "https://drive.google.com/file/d/ID_FILE_PL3/view",
    duongDanTai: "/documents/ke-hoach-333-phu-luc-3.pdf",
  },
  {
    id: "ID_FILE_PL4",
    name: "Phụ lục 4: Tiến độ và biểu mẫu địa chính",
    mimeType: "application/pdf",
    size: "2.4 MB",
    webViewLink: "https://drive.google.com/file/d/ID_FILE_PL4/view",
    webContentLink: "https://drive.google.com/uc?export=download&id=ID_FILE_PL4",
    duongDanXem: "https://drive.google.com/file/d/ID_FILE_PL4/view",
    duongDanTai: "/documents/ke-hoach-333-phu-luc-4.pdf",
  },
  {
    id: "ID_FILE_PL5",
    name: "Phụ lục 5: Cơ chế phối hợp Công an & Địa chính",
    mimeType: "application/pdf",
    size: "850 KB",
    webViewLink: "https://drive.google.com/file/d/ID_FILE_PL5/view",
    webContentLink: "https://drive.google.com/uc?export=download&id=ID_FILE_PL5",
    duongDanXem: "https://drive.google.com/file/d/ID_FILE_PL5/view",
    duongDanTai: "/documents/ke-hoach-333-phu-luc-5.pdf",
  },
];

/**
 * Định dạng dung lượng tệp tin (KB, MB)
 */
export function formatFileSize(bytes?: number | string): string | undefined {
  if (!bytes) return undefined;
  const num = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (isNaN(num)) return undefined;
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Lấy cấu hình Drive từ môi trường (hỗ trợ cả Next.js và Astro/Vite)
 */
export function getDriveConfig(): { folderId: string; apiKey: string } {
  let folderId = "";
  let apiKey = "";

  if (typeof process !== "undefined" && process.env) {
    folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID || "";
    apiKey = process.env.NEXT_PUBLIC_DRIVE_API_KEY || "";
  }

  // Fallback import.meta.env nếu chạy trong Astro hoặc Vite
  if (!folderId && typeof import.meta !== "undefined" && (import.meta as any).env) {
    folderId =
      (import.meta as any).env.NEXT_PUBLIC_DRIVE_FOLDER_ID ||
      (import.meta as any).env.PUBLIC_DRIVE_FOLDER_ID ||
      "";
  }
  if (!apiKey && typeof import.meta !== "undefined" && (import.meta as any).env) {
    apiKey =
      (import.meta as any).env.NEXT_PUBLIC_DRIVE_API_KEY ||
      (import.meta as any).env.PUBLIC_DRIVE_API_KEY ||
      "";
  }

  return { folderId, apiKey };
}

/**
 * Gọi Google Drive API v3 để đọc danh sách file trong thư mục
 * @param overrideFolderId Tùy chọn truyền Folder ID trực tiếp
 * @param overrideApiKey Tùy chọn truyền API Key trực tiếp
 */
export async function getGoogleDriveFiles(
  overrideFolderId?: string,
  overrideApiKey?: string
): Promise<DriveFile[]> {
  const config = getDriveConfig();
  const folderId = overrideFolderId || config.folderId;
  const apiKey = overrideApiKey || config.apiKey;

  // Nếu không có khóa API hoặc Folder ID, trả về danh sách tệp mặc định để UI luôn hoạt động
  if (!folderId || !apiKey) {
    return DEFAULT_DRIVE_FILES;
  }

  try {
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const fields = encodeURIComponent(
      "files(id, name, mimeType, webViewLink, webContentLink, size, createdTime)"
    );
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[GoogleDrive API] Lỗi (${res.status}):`, await res.text());
      return DEFAULT_DRIVE_FILES;
    }

    const data = await res.json();
    if (!data.files || !Array.isArray(data.files) || data.files.length === 0) {
      return DEFAULT_DRIVE_FILES;
    }

    return data.files.map((file: any) => {
      const webViewLink =
        file.webViewLink || `https://drive.google.com/file/d/${file.id}/view?usp=sharing`;
      const webContentLink =
        file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.id}`;

      return {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType || "application/octet-stream",
        size: formatFileSize(file.size),
        webViewLink,
        webContentLink,
        duongDanXem: webViewLink,
        duongDanTai: webContentLink,
        createdTime: file.createdTime,
      };
    });
  } catch (error) {
    console.error("[GoogleDrive API] Ngoại lệ khi tải tệp:", error);
    return DEFAULT_DRIVE_FILES;
  }
}
