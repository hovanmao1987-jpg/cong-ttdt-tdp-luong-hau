/**
 * src/lib/googleSheets.ts
 * Module kết nối và đọc dữ liệu bài viết từ Google Sheets quản trị
 * Sheet ID: 1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ
 * Các cột trong Sheet: [ThoiGian, ChuyenMuc, TieuDe, NoiDung, LinkHinhAnh]
 * Tự động phân loại: Tin tức, Thông báo, Chủ nhật xanh
 */

export const DEFAULT_SHEET_ID = "1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ";

export interface SheetArticle {
  id: string;
  thoiGian: string;
  chuyenMuc: string;
  categoryType: "tintuc" | "thongbao" | "chunhatxanh";
  tieuDe: string;
  noiDung: string;
  body: string[];
  linkHinhAnh?: string;
  createdTime?: string;
}

export interface CategorizedSheetData {
  tinTuc: SheetArticle[];
  thongBao: SheetArticle[];
  chuNhatXanh: SheetArticle[];
  all: SheetArticle[];
}

/**
 * Chuẩn hóa loại chuyên mục từ tên chuỗi trong Sheet
 */
export function normalizeCategoryType(categoryRaw: string): "tintuc" | "thongbao" | "chunhatxanh" {
  const norm = (categoryRaw || "").toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // bỏ dấu tiếng Việt để so sánh

  if (norm.includes("thong bao") || norm.includes("khan") || norm.includes("chi dao")) {
    return "thongbao";
  }
  if (norm.includes("chu nhat xanh") || norm.includes("moi truong") || norm.includes("rac") || norm.includes("cay")) {
    return "chunhatxanh";
  }
  return "tintuc";
}

/**
 * Phân tích chuỗi trả về từ Google Visualization API (GViz)
 */
export function parseGvizResponse(rawText: string): SheetArticle[] {
  if (!rawText) return [];

  try {
    const idxStart = rawText.indexOf("{");
    const idxEnd = rawText.lastIndexOf("}");
    if (idxStart === -1 || idxEnd === -1) return [];

    const jsonString = rawText.substring(idxStart, idxEnd + 1);
    const parsed = JSON.parse(jsonString);
    const rows = parsed?.table?.rows || [];

    const articles: SheetArticle[] = [];

    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i]?.c || [];
      const getVal = (index: number): string => {
        if (!cells[index]) return "";
        const v = cells[index].v;
        if (v === null || v === undefined) return "";
        return String(v).trim();
      };

      const thoiGian = getVal(0);
      const chuyenMuc = getVal(1);
      const tieuDe = getVal(2);
      const noiDung = getVal(3);
      const linkHinhAnh = getVal(4);

      // Bỏ qua nếu là dòng tiêu đề mẫu của Sheet
      const lowerThoiGian = thoiGian.toLowerCase();
      const lowerChuyenMuc = chuyenMuc.toLowerCase();
      if (
        lowerThoiGian.includes("thoigian") ||
        lowerThoiGian.includes("thời gian") ||
        lowerChuyenMuc.includes("chuyenmuc") ||
        lowerChuyenMuc.includes("chuyên mục")
      ) {
        continue;
      }

      // Chỉ lấy nếu có ít nhất tiêu đề hoặc nội dung
      if (!tieuDe && !noiDung) continue;

      const categoryType = normalizeCategoryType(chuyenMuc);
      const body = noiDung
        ? noiDung.split(/\n+/).map((s) => s.trim()).filter(Boolean)
        : [];

      articles.push({
        id: `sheet_post_${i}_${Date.now()}`,
        thoiGian: thoiGian || new Date().toLocaleDateString("vi-VN"),
        chuyenMuc: chuyenMuc || "Tin tức TDP",
        categoryType,
        tieuDe: tieuDe || "Thông báo từ Tổ dân phố Lương Hậu",
        noiDung: noiDung || "",
        body: body.length > 0 ? body : [noiDung || ""],
        linkHinhAnh: linkHinhAnh || undefined,
      });
    }

    return articles;
  } catch (err) {
    console.warn("[GoogleSheets] Lỗi parse dữ liệu GViz:", err);
    return [];
  }
}

/**
 * Gọi đọc dữ liệu từ Google Sheets công khai (GViz endpoint, không yêu cầu API Key cá nhân)
 */
export async function fetchGoogleSheetArticles(
  sheetId: string = DEFAULT_SHEET_ID
): Promise<CategorizedSheetData> {
  const result: CategorizedSheetData = {
    tinTuc: [],
    thongBao: [],
    chuNhatXanh: [],
    all: [],
  };

  if (!sheetId) return result;

  try {
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    const res = await fetch(gvizUrl);
    if (!res.ok) {
      console.warn(`[GoogleSheets] Lỗi kết nối (${res.status}):`, await res.text());
      return result;
    }

    const text = await res.text();
    const articles = parseGvizResponse(text);

    result.all = articles;
    for (const item of articles) {
      if (item.categoryType === "thongbao") {
        result.thongBao.push(item);
      } else if (item.categoryType === "chunhatxanh") {
        result.chuNhatXanh.push(item);
      } else {
        result.tinTuc.push(item);
      }
    }

    return result;
  } catch (error) {
    console.error("[GoogleSheets] Lỗi ngoại lệ khi tải bài viết:", error);
    return result;
  }
}

/**
 * Chuyển đổi SheetArticle sang định dạng tin tức `NEWS` của Cổng TTĐT
 */
export function sheetArticleToNewsItem(item: SheetArticle) {
  const isThongBao = item.categoryType === "thongbao";
  return {
    id: item.id,
    tag: isThongBao ? "ward" : "luonghau",
    pill: isThongBao ? "THÔNG BÁO" : (item.chuyenMuc.toUpperCase() || "LƯƠNG HẬU"),
    hot: true,
    title: item.tieuDe,
    date: item.thoiGian,
    src: "Ban điều hành TDP Lương Hậu",
    sum: item.body[0] || item.noiDung.substring(0, 160) + "...",
    body: item.body,
    img: item.linkHinhAnh,
    _lv: "luonghau",
  };
}

/**
 * Chuyển đổi SheetArticle sang định dạng Ngày Chủ Nhật Xanh
 */
export function sheetArticleToChuNhatXanhItem(item: SheetArticle, index: number) {
  return {
    id: item.id || `cnx-sheet-${index}`,
    thoiGian: item.thoiGian,
    tieuDe: item.tieuDe,
    diaDiem: "Tuyến đường Thái Thuận & Thái Vĩnh Chinh",
    noiDung: item.noiDung,
    hinhAnh: item.linkHinhAnh ? [item.linkHinhAnh] : ["Hồ sơ lưu trữ Ban Công tác Mặt trận"],
  };
}
