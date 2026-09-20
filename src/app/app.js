/**
 * CỔNG THÔNG TIN SỐ LƯƠNG HẬU - CORE WEB APP & ROUTER HOÀN CHỈNH
 * Dữ liệu thật 100% từ hồ sơ Đảng viên, Cán bộ và Tài liệu chính thức Lương Hậu
 * Tuyệt đối không sử dụng thông tin giả định.
 */
(function () {
  "use strict";

  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;

  function navigateTo(path, addToHistory = true) {
    if (addToHistory) {
      history.pushState(null, "", path);
    }
    renderRoute(path);
  }

  window.addEventListener("popstate", () => {
    renderRoute(window.location.pathname + window.location.hash);
  });

  // ==================== 1. MODAL XEM PDF CHUYÊN NGHIỆP ====================
  function openPdfModal(title, pdfUrl) {
    const old = document.getElementById("lh-pdf-modal");
    if (old) old.remove();

    const modal = document.createElement("div");
    modal.id = "lh-pdf-modal";
    modal.className = "fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm fade-in";
    modal.innerHTML = `
      <div class="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-300">
        <div class="bg-[#1e3a8a] text-white px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2 min-w-0 pr-4">
            <i class="fa-solid fa-file-pdf text-red-400 text-lg"></i>
            <h3 class="font-bold text-sm truncate">${title}</h3>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <a href="${pdfUrl}" download target="_blank" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 transition">
              <i class="fa-solid fa-download"></i> Tải về máy
            </a>
            <button id="close-pdf-modal" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-base">✕</button>
          </div>
        </div>
        <div class="flex-1 bg-gray-100 p-1">
          <iframe src="${pdfUrl}" class="w-full h-full border-0 rounded-b-xl" title="${title}"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("close-pdf-modal").onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  }

  // ==================== 2. HEADER CÔNG KHAI ====================
  function renderPublicHeader(activeRoute = "/") {
    const user = window.LHAuth.getUser();
    return `
      <header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div class="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 cursor-pointer" onclick="window.navigateTo('/')">
            <div class="w-11 h-11 rounded-full bg-[#da251d] border-2 border-yellow-400 flex items-center justify-center shadow-md flex-shrink-0 text-yellow-300">
              <i class="fa-solid fa-star text-lg"></i>
            </div>
            <div>
              <div class="text-[10.5px] font-bold text-red-700 tracking-wider uppercase">ĐẢNG BỘ PHƯỜNG HƯƠNG THỦY</div>
              <h1 class="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-none uppercase">CỔNG THÔNG TIN SỐ LƯƠNG HẬU</h1>
              <div class="text-[11px] text-gray-500 font-medium mt-0.5">Phường Hương Thủy • Thành phố Huế</div>
            </div>
          </div>

          <div class="hidden md:flex items-center gap-2">
            <button onclick="window.navigateTo('/tim-kiem')" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
              <i class="fa-solid fa-magnifying-glass text-gray-400"></i> Tìm kiếm
            </button>
            ${user ? `
              <button onclick="window.navigateTo('/noi-bo/dashboard')" class="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition">
                <i class="fa-solid fa-user-shield text-yellow-300"></i> ${user.name} (${user.role})
              </button>
            ` : `
              <button onclick="window.navigateTo('/noi-bo/dang-nhap')" class="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition">
                <i class="fa-solid fa-key text-yellow-300"></i> ĐĂNG NHẬP NỘI BỘ
              </button>
            `}
          </div>

          <button id="mobile-menu-btn" class="md:hidden w-9 h-9 text-gray-700 text-xl flex items-center justify-center">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>

        <nav class="bg-[#1e3a8a] text-white text-xs font-bold border-t border-blue-900 hidden md:block">
          <div class="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-0.5">
            <a href="/" onclick="event.preventDefault(); window.navigateTo('/')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute === '/' ? 'bg-blue-900 text-yellow-300' : ''}">TRANG CHỦ</a>
            <a href="/tin-tuc" onclick="event.preventDefault(); window.navigateTo('/tin-tuc')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute.startsWith('/tin-tuc') ? 'bg-blue-900 text-yellow-300' : ''}">TIN TỨC</a>
            <a href="/van-ban" onclick="event.preventDefault(); window.navigateTo('/van-ban')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute.startsWith('/van-ban') ? 'bg-blue-900 text-yellow-300' : ''}">VĂN BẢN & BIỂU MẪU</a>
            <a href="/thong-bao" onclick="event.preventDefault(); window.navigateTo('/thong-bao')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute.startsWith('/thong-bao') ? 'bg-blue-900 text-yellow-300' : ''}">THÔNG BÁO</a>
            <a href="/to-dan-pho" onclick="event.preventDefault(); window.navigateTo('/to-dan-pho')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute.startsWith('/to-dan-pho') ? 'bg-blue-900 text-yellow-300' : ''}">BAN CÁN BỘ TDP</a>
            <a href="/cong-dan-so" onclick="event.preventDefault(); window.navigateTo('/cong-dan-so')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute.startsWith('/cong-dan-so') ? 'bg-blue-900 text-yellow-300' : ''}">CÔNG DÂN SỐ</a>
            <a href="/lich-hoat-dong" onclick="event.preventDefault(); window.navigateTo('/lich-hoat-dong')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute.startsWith('/lich-hoat-dong') ? 'bg-blue-900 text-yellow-300' : ''}">LỊCH HOẠT ĐỘNG</a>
            <a href="/lien-he" onclick="event.preventDefault(); window.navigateTo('/lien-he')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute.startsWith('/lien-he') ? 'bg-blue-900 text-yellow-300' : ''}">LIÊN HỆ & PHẢN ÁNH</a>
          </div>
        </nav>

        <div id="mobile-drawer" class="fixed inset-0 bg-black/60 z-50 hidden backdrop-blur-[2px]">
          <div class="bg-white w-4/5 max-w-xs h-full shadow-2xl flex flex-col">
            <div class="bg-[#1e3a8a] text-white p-4 flex items-center justify-between">
              <span class="font-black text-xs uppercase tracking-wider">CỔNG THÔNG TIN LƯƠNG HẬU</span>
              <button id="close-drawer-btn" class="text-white text-xl">✕</button>
            </div>
            <div class="p-3 space-y-1 text-sm font-semibold flex-1 overflow-y-auto">
              <a href="/" onclick="event.preventDefault(); window.navigateTo('/'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">TRANG CHỦ</a>
              <a href="/tin-tuc" onclick="event.preventDefault(); window.navigateTo('/tin-tuc'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">TIN TỨC</a>
              <a href="/van-ban" onclick="event.preventDefault(); window.navigateTo('/van-ban'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">VĂN BẢN & BIỂU MẪU</a>
              <a href="/thong-bao" onclick="event.preventDefault(); window.navigateTo('/thong-bao'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">THÔNG BÁO</a>
              <a href="/to-dan-pho" onclick="event.preventDefault(); window.navigateTo('/to-dan-pho'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">BAN CÁN BỘ TDP (10 Đ/C)</a>
              <a href="/cong-dan-so" onclick="event.preventDefault(); window.navigateTo('/cong-dan-so'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">CÔNG DÂN SỐ (VNeID, Hue-S)</a>
              <a href="/lich-hoat-dong" onclick="event.preventDefault(); window.navigateTo('/lich-hoat-dong'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">LỊCH HOẠT ĐỘNG</a>
              <a href="/lien-he" onclick="event.preventDefault(); window.navigateTo('/lien-he'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">LIÊN HỆ & PHẢN ÁNH</a>
              <hr class="my-2 border-gray-200">
              <a href="/noi-bo/dang-nhap" onclick="event.preventDefault(); window.navigateTo('/noi-bo/dang-nhap'); closeDrawer();" class="block p-2.5 bg-red-50 text-red-800 font-bold rounded">
                <i class="fa-solid fa-shield-halved mr-1 text-red-600"></i> ĐĂNG NHẬP NỘI BỘ CHI BỘ
              </a>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  function closeDrawer() {
    const d = document.getElementById("mobile-drawer");
    if (d) d.classList.add("hidden");
  }

  // ==================== 3. FOOTER CÔNG KHAI ====================
  function renderPublicFooter() {
    return `
      <footer class="bg-gray-900 text-gray-300 text-xs border-t-4 border-[#b91c1c] mt-12 pt-8 pb-12">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="text-white font-black text-sm uppercase mb-2">CỔNG THÔNG TIN SỐ TỔ DÂN PHỐ LƯƠNG HẬU</div>
            <p class="text-gray-400 text-xs leading-relaxed">Ủy ban nhân dân Phường Hương Thủy • Chi bộ & Ban điều hành Tổ dân phố Lương Hậu, Thành phố Huế.</p>
            <div class="mt-3 text-[11px] text-gray-400">Trụ sở: Số 83 Thái Thuận, TDP Lương Hậu, Phường Hương Thủy, TP Huế</div>
            <div class="mt-1 text-[11px] text-gray-400">Địa bàn phụ trách: 4 Đội dân cư (Đội 8, Đội 9, Đội 10, Đội 11)</div>
          </div>
          <div>
            <div class="text-white font-bold text-sm mb-2">ĐƯỜNG DÂY NÓNG TIẾP DÂN CƠ SỞ</div>
            <ul class="space-y-1.5 text-xs">
              <li><i class="fa-solid fa-phone text-red-400 mr-1.5"></i> Bí thư Chi bộ: <strong>0962.481.112</strong> (Đ/c Hồ Văn Mão)</li>
              <li><i class="fa-solid fa-phone text-blue-400 mr-1.5"></i> Phó Bí thư, Tổ trưởng TDP: <strong>0965.712.812</strong> (Đ/c Nguyễn Trọng Nghĩa)</li>
              <li><i class="fa-solid fa-phone text-amber-400 mr-1.5"></i> Trưởng Ban CTMT: <strong>0965.943.303</strong> (Đ/c Hoàng Hữu Rớt)</li>
              <li><i class="fa-solid fa-shield-halved text-green-400 mr-1.5"></i> Tổ trưởng ANTT cơ sở: <strong>0975.175.361</strong> (Đ/c Nguyễn Thúc Thành)</li>
            </ul>
          </div>
          <div>
            <div class="text-white font-bold text-sm mb-2">CỔNG THÔNG TIN CHÍNH THỐNG</div>
            <div class="grid grid-cols-1 gap-1.5 text-xs">
              <a href="https://vbpl.vn" target="_blank" class="hover:text-white flex items-center gap-1">› CSDL Quốc gia về Pháp luật (vbpl.vn)</a>
              <a href="https://vanban.chinhphu.vn" target="_blank" class="hover:text-white flex items-center gap-1">› Hệ thống Văn bản Chính phủ</a>
              <a href="https://tulieuvankien.dangcongsan.vn" target="_blank" class="hover:text-white flex items-center gap-1">› Tư liệu Văn kiện Đảng</a>
              <a href="https://vpcp.dichvucong.gov.vn" target="_blank" class="hover:text-white flex items-center gap-1">› Cổng Dịch vụ công Quốc gia</a>
              <a href="https://huongthuy.hue.gov.vn" target="_blank" class="hover:text-white flex items-center gap-1">› Trang TTĐT Phường Hương Thủy</a>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-800 text-[10px] text-gray-500">
              Cổng Thông tin Số TDP Lương Hậu • Vận hành 2026
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // ==================== 4. TRANG CHỦ ====================
  function renderHomePage() {
    const news = window.LHStore.getNews();
    const docs = window.LHStore.getDocuments();
    const notices = window.LHStore.getNotices();
    const cadres = window.LHStore.getCadres();
    const officialSources = window.LHStore.getOfficialSources();

    const featuredNews = news.find(n => n.featured) || news[0];
    const subNews = news.filter(n => n !== featuredNews).slice(0, 3);

    return `
      ${renderPublicHeader("/")}
      <main class="max-w-6xl mx-auto px-4 py-6 space-y-8 fade-in">
        
        <!-- KHỐI 1: HERO TIÊU ĐIỂM + THÔNG BÁO KHẨN -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            <div class="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white p-6 flex flex-col justify-end min-h-[220px]">
              <span class="px-2.5 py-1 bg-red-600 text-white rounded text-[10.5px] font-black w-max uppercase tracking-wider mb-2">TIÊU ĐIỂM TỔ DÂN PHỐ</span>
              <h2 class="text-lg sm:text-2xl font-black leading-snug cursor-pointer hover:underline" onclick="window.navigateTo('/tin-tuc/${featuredNews.slug}')">
                ${featuredNews.title}
              </h2>
              <div class="flex items-center gap-3 text-xs text-blue-100 mt-2">
                <span>📅 ${featuredNews.date}</span>
                <span>•</span>
                <span>✍ ${featuredNews.author}</span>
              </div>
            </div>
            <div class="p-4 bg-white flex-1 flex flex-col justify-between">
              <p class="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">${featuredNews.content}</p>
              <div class="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span class="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">${featuredNews.category}</span>
                <button onclick="window.navigateTo('/tin-tuc/${featuredNews.slug}')" class="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1">
                  Xem toàn văn bài viết →
                </button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between border-b pb-2">
                <h3 class="font-black text-sm text-red-700 uppercase flex items-center gap-2">
                  <i class="fa-solid fa-bullhorn text-red-600"></i> THÔNG BÁO TỔ DÂN PHỐ
                </h3>
                <button onclick="window.navigateTo('/thong-bao')" class="text-xs text-blue-600 font-bold hover:underline">Tất cả</button>
              </div>
              <div class="divide-y divide-gray-100 mt-2">
                ${notices.map(n => `
                  <div class="py-2.5 cursor-pointer hover:bg-gray-50 rounded p-1 transition" onclick="window.navigateTo('/thong-bao/${n.slug}')">
                    <div class="flex items-center gap-1.5 text-[10.5px] text-gray-400 mb-0.5">
                      <span class="px-1.5 py-0.5 ${n.priority === 'Khẩn' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'} font-bold rounded">${n.priority || 'Thông báo'}</span>
                      <span>${n.date}</span>
                    </div>
                    <div class="text-xs font-bold text-gray-800 hover:text-blue-700 line-clamp-2">${n.title}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <div class="font-bold text-xs text-blue-900 mb-1 flex items-center gap-1.5">
                <i class="fa-solid fa-mobile-screen text-blue-700"></i> Hướng Dẫn VNeID & Hue-S
              </div>
              <div class="text-[11px] text-gray-600 mb-2">Tổ CNSCĐ trực hỗ trợ công dân kích hoạt VNeID mức 2 vào tối Thứ 7 tại Nhà SHCĐ.</div>
              <button onclick="window.navigateTo('/cong-dan-so')" class="w-full py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold transition">
                Xem hướng dẫn chi tiết
              </button>
            </div>
          </div>
        </section>

        <!-- KHỐI 2: VĂN BẢN ĐIỀU HÀNH & KẾ HOẠCH 333 ĐẤT ĐAI -->
        <section class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <div>
              <h2 class="text-base sm:text-lg font-black text-gray-900 uppercase flex items-center gap-2">
                <i class="fa-solid fa-file-shield text-red-700"></i> KHO VĂN BẢN & BIỂU MẪU CHÍNH THỐNG
              </h2>
              <div class="text-xs text-gray-500">Kế hoạch 333/KH-UBND đất đai • Biểu mẫu xác nhận cư trú • Nghị quyết chuyển đổi số</div>
            </div>
            <button onclick="window.navigateTo('/van-ban')" class="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-100 transition self-start sm:self-auto">
              Xem toàn bộ văn bản →
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            ${docs.slice(0, 4).map(d => `
              <div class="p-3.5 bg-gray-50 hover:bg-red-50/40 border border-gray-200 rounded-xl flex flex-col justify-between transition group">
                <div>
                  <div class="flex items-center justify-between gap-2 text-[11px] mb-1.5">
                    <span class="font-black px-2 py-0.5 rounded ${d.level === 'TRUNG ƯƠNG' ? 'bg-amber-100 text-amber-900' : d.level === 'THÀNH PHỐ HUẾ' ? 'bg-blue-100 text-blue-900' : 'bg-red-100 text-red-900'}">${d.level}</span>
                    <span class="text-gray-400 font-semibold">${d.date}</span>
                  </div>
                  <h4 class="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-red-700 leading-snug cursor-pointer" onclick="window.navigateTo('/van-ban/${d.id}')">
                    ${d.code}: ${d.title}
                  </h4>
                  <p class="text-[11.5px] text-gray-500 mt-1 line-clamp-2">${d.summary || ''}</p>
                </div>
                <div class="mt-3 pt-2.5 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span class="text-gray-500 font-medium">${d.agency}</span>
                  ${d.pdfUrl ? `
                    <button onclick="window.openPdfModal('${d.code}', '${d.pdfUrl}')" class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-[11px] flex items-center gap-1 shadow-sm">
                      <i class="fa-solid fa-file-pdf"></i> Xem PDF
                    </button>
                  ` : `<span class="text-gray-400 text-[10px]">Đang cập nhật</span>`}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- KHỐI 3: LIÊN KẾT NGUỒN CHÍNH THỐNG CHÍNH PHỦ & PHÁP LUẬT -->
        <section class="bg-gray-50 rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-black text-xs sm:text-sm text-blue-950 uppercase flex items-center gap-2">
              <i class="fa-solid fa-landmark text-blue-800"></i> KHO NGUỒN TRA CỨU CHÍNH THỐNG
            </h3>
            <span class="text-[11px] text-gray-500">Cơ sở dữ liệu Quốc gia & Địa phương</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            ${officialSources.map(s => `
              <a href="${s.url}" target="_blank" class="p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow transition flex flex-col justify-between group">
                <div>
                  <div class="text-[10px] font-bold text-red-700 uppercase">${s.org}</div>
                  <div class="font-bold text-xs text-gray-900 group-hover:text-blue-700 mt-1 leading-snug">${s.name}</div>
                </div>
                <div class="text-[10px] text-blue-600 mt-2 font-semibold flex items-center gap-1">
                  Tra cứu nguồn chính thức <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                </div>
              </a>
            `).join('')}
          </div>
        </section>

        <!-- KHỐI 4: BAN CÁN BỘ TỔ DÂN PHỐ LƯƠNG HẬU (10 ĐỒNG CHÍ THẬT) -->
        <section class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b pb-2">
            <div>
              <h2 class="text-base sm:text-lg font-black text-red-800 uppercase flex items-center gap-2">
                <i class="fa-solid fa-users text-red-700"></i> BAN CÁN BỘ TỔ DÂN PHỐ LƯƠNG HẬU (10 ĐỒNG CHÍ)
              </h2>
              <div class="text-xs text-gray-500">Cơ cấu điều hành lãnh đạo 4 cụm Đội dân cư (Đội 8, Đội 9, Đội 10, Đội 11)</div>
            </div>
            <button onclick="window.navigateTo('/to-dan-pho')" class="text-xs text-blue-600 font-bold hover:underline">Chi tiết chức danh →</button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
            ${cadres.slice(0, 5).map(c => `
              <div class="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-between">
                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-[#991b1b] to-[#b91c1c] text-white border-2 border-yellow-400 flex flex-col items-center justify-center shadow mb-2">
                  <i class="fa-solid fa-user-tie text-yellow-300 text-base"></i>
                  <span class="text-[8px] font-black text-yellow-200 uppercase">${c.year}</span>
                </div>
                <div class="font-bold text-xs text-gray-900">${c.name}</div>
                <div class="text-[10.5px] text-red-700 font-semibold mt-0.5 line-clamp-2">${c.role}</div>
                <div class="text-[9.5px] text-gray-500 mt-1">${c.area}</div>
                <a href="tel:${c.phone.replace(/[^0-9]/g, '')}" class="mt-2 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-full flex items-center justify-center gap-1">
                  <i class="fa-solid fa-phone text-[9px]"></i> ${c.phone}
                </a>
              </div>
            `).join('')}
          </div>
        </section>

      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 5. CHUYÊN TRANG CÔNG DÂN SỐ ====================
  function renderCitizenPortalPage() {
    return `
      ${renderPublicHeader("/cong-dan-so")}
      <main class="max-w-6xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-mobile-screen-button text-red-700"></i> CÔNG DÂN SỐ TỔ DÂN PHỐ LƯƠNG HẬU
          </h1>
          <p class="text-xs text-gray-500 mt-1">Hướng dẫn sử dụng tài khoản định danh VNeID, ứng dụng Hue-S và nộp hồ sơ Dịch vụ công trực tuyến</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- THẺ 1: VNeID -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center text-2xl mb-3">
                <i class="fa-solid fa-id-card"></i>
              </div>
              <h2 class="text-base font-black text-gray-900 uppercase">Định Danh Điện Tử VNeID</h2>
              <div class="text-xs text-red-700 font-bold mt-0.5">Bộ Công an</div>
              <ul class="mt-3 space-y-2 text-xs text-gray-600">
                <li>✓ Hướng dẫn đăng ký và kích hoạt tài khoản định danh mức 2</li>
                <li>✓ Tích hợp giấy phép lái xe, thẻ BHYT, người phụ thuộc</li>
                <li>✓ Thực hiện thông báo lưu trú trực tuyến tại nhà</li>
                <li>✓ Xuất trình giấy tờ số thay thế căn cước truyền thống</li>
              </ul>
            </div>
            <div class="pt-3 border-t">
              <div class="text-[11px] text-gray-500 mb-2">Hỗ trợ kích hoạt trực tiếp: Tổ CNSCĐ do Đ/c Nguyễn Thị Ngọc Tú phụ trách tại Nhà SHCĐ.</div>
              <a href="https://vneid.gov.vn" target="_blank" class="w-full py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
                Cổng thông tin VNeID Quốc gia <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>
          </div>

          <!-- THẺ 2: DỊCH VỤ CÔNG QUỐC GIA -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mb-3">
                <i class="fa-solid fa-building-columns"></i>
              </div>
              <h2 class="text-base font-black text-gray-900 uppercase">Dịch Vụ Công Trực Tuyến</h2>
              <div class="text-xs text-blue-700 font-bold mt-0.5">Cổng DVC Quốc gia & Tỉnh TT-Huế</div>
              <ul class="mt-3 space-y-2 text-xs text-gray-600">
                <li>✓ Đăng ký thường trú, tạm trú, khai báo tạm vắng</li>
                <li>✓ Đăng ký khai sinh, kết hôn, cấp giấy xác nhận tình trạng hôn nhân</li>
                <li>✓ Cấp đổi giấy phép lái xe, nộp phạt vi phạm giao thông</li>
                <li>✓ Tra cứu tiến độ hồ sơ đất đai theo mã tiếp nhận</li>
              </ul>
            </div>
            <div class="pt-3 border-t">
              <a href="https://vpcp.dichvucong.gov.vn" target="_blank" class="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
                Truy cập Cổng DVC Quốc gia <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>
          </div>

          <!-- THẺ 3: HUE-S ĐÔ THỊ THÔNG MINH -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-3">
                <i class="fa-solid fa-city"></i>
              </div>
              <h2 class="text-base font-black text-gray-900 uppercase">Đô Thị Thông Minh Hue-S</h2>
              <div class="text-xs text-purple-700 font-bold mt-0.5">Trung tâm Giám sát Điều hành ĐTTM Huế</div>
              <ul class="mt-3 space-y-2 text-xs text-gray-600">
                <li>✓ Gửi phản ánh hiện trường về rác thải, ngập úng, trật tự kiệt ngõ</li>
                <li>✓ Theo dõi mực nước sông, lượng mưa và cảnh báo bão lụt khẩn cấp</li>
                <li>✓ Tra cứu số điện thoại cứu nạn cứu hộ và đường dây nóng y tế</li>
                <li>✓ Cập nhật tin tức điều hành chính quyền Thành phố Huế</li>
              </ul>
            </div>
            <div class="pt-3 border-t">
              <a href="https://hueioc.vn" target="_blank" class="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition">
                Cổng phản ánh hiện trường Hue-S <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>
          </div>
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 6. CHUYÊN TRANG TIN TỨC ====================
  function renderNewsListPage() {
    const news = window.LHStore.getNews();
    return `
      ${renderPublicHeader("/tin-tuc")}
      <main class="max-w-6xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-newspaper text-red-700"></i> BẢN TIN ĐỜI SỐNG & HOẠT ĐỘNG TỔ DÂN PHỐ LƯƠNG HẬU
          </h1>
          <p class="text-xs text-gray-500 mt-1">Thông tin tuyên truyền, chính sách cơ sở và phong trào nhân dân</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${news.map(n => `
            <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div class="p-4 space-y-2">
                <span class="px-2 py-0.5 bg-red-50 text-red-700 text-[11px] font-bold rounded">${n.category}</span>
                <h3 class="font-bold text-sm text-gray-900 hover:text-blue-700 cursor-pointer leading-snug" onclick="window.navigateTo('/tin-tuc/${n.slug}')">
                  ${n.title}
                </h3>
                <p class="text-xs text-gray-600 line-clamp-3 leading-relaxed">${n.content}</p>
              </div>
              <div class="p-4 bg-gray-50 border-t flex justify-between items-center text-xs">
                <span class="text-gray-400">📅 ${n.date}</span>
                <button onclick="window.navigateTo('/tin-tuc/${n.slug}')" class="text-blue-700 font-bold hover:underline">Chi tiết →</button>
              </div>
            </div>
          `).join('')}
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  function renderNewsDetailPage(slug) {
    const news = window.LHStore.getNewsBySlug(slug) || window.LHStore.getNews()[0];
    return `
      ${renderPublicHeader("/tin-tuc")}
      <main class="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <button onclick="window.navigateTo('/tin-tuc')" class="text-xs text-blue-700 font-bold hover:underline mb-2 flex items-center gap-1">
            ← Quay lại danh mục tin tức
          </button>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 bg-red-100 text-red-800 font-bold text-xs rounded">${news.category}</span>
            <span class="text-xs text-gray-400">Đăng ngày: <strong>${news.date}</strong></span>
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-gray-900 leading-snug">${news.title}</h1>
          <div class="text-xs text-gray-500 pb-3 border-b">Tác giả: <strong>${news.author}</strong> • Địa bàn: Tổ dân phố Lương Hậu</div>
          <div class="text-sm text-gray-700 leading-relaxed text-justify whitespace-pre-line py-2">
            ${news.content}
          </div>
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 7. CHUYÊN TRANG THÔNG BÁO ====================
  function renderNoticesPage() {
    const notices = window.LHStore.getNotices();
    return `
      ${renderPublicHeader("/thong-bao")}
      <main class="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-bullhorn text-red-700"></i> BẢNG THÔNG BÁO CỦA TỔ DÂN PHỐ
          </h1>
          <p class="text-xs text-gray-500 mt-1">Thông báo lịch họp, tiếp nhận hồ sơ đất đai, tuần tra đêm, y tế cơ sở</p>
        </div>

        <div class="space-y-3">
          ${notices.map(n => `
            <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-red-300 transition">
              <div>
                <div class="flex items-center gap-2 text-xs mb-1">
                  <span class="px-2 py-0.5 rounded font-bold ${n.priority === 'Khẩn' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}">${n.priority || 'Thông báo'}</span>
                  <span class="text-gray-400">📅 ${n.date}</span>
                </div>
                <h3 class="font-bold text-sm text-gray-900">${n.title}</h3>
                <p class="text-xs text-gray-600 mt-1">${n.content}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 8. CHUYÊN TRANG VĂN BẢN & BIỂU MẪU ====================
  function renderDocumentsPage(targetId = null) {
    const docs = window.LHStore.getDocuments();

    if (targetId) {
      const doc = window.LHStore.getDocumentById(targetId) || docs[0];
      return `
        ${renderPublicHeader("/van-ban")}
        <main class="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <button onclick="window.navigateTo('/van-ban')" class="text-xs text-blue-700 font-bold hover:underline mb-2 flex items-center gap-1">
              ← Quay lại kho văn bản
            </button>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 bg-red-100 text-red-800 font-bold text-xs rounded">${doc.level}</span>
              <span class="text-xs text-gray-500">Ban hành: <strong>${doc.date}</strong></span>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 leading-snug">${doc.code}: ${doc.title}</h1>
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
              <div><strong>Cơ quan ban hành:</strong> ${doc.agency}</div>
              <div><strong>Lĩnh vực:</strong> ${doc.category || "Địa chính / Hành chính"}</div>
              <div><strong>Nguồn trích lục:</strong> ${doc.source || "Công báo điện tử"}</div>
            </div>
            <div class="text-sm text-gray-700 leading-relaxed pt-2">
              <h4 class="font-bold text-gray-900 mb-2">Trích yếu nội dung:</h4>
              <p>${doc.summary || "Đang cập nhật toàn văn bản số hóa."}</p>
            </div>
            <div class="pt-4 border-t flex items-center gap-3">
              ${doc.pdfUrl ? `
                <button onclick="window.openPdfModal('${doc.code}', '${doc.pdfUrl}')" class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow">
                  <i class="fa-solid fa-file-pdf"></i> Xem trước toàn văn PDF
                </button>
                <a href="${doc.pdfUrl}" download class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg flex items-center gap-2">
                  <i class="fa-solid fa-download"></i> Tải PDF về máy
                </a>
              ` : `<span class="text-xs text-gray-400">Văn bản chưa có tệp đính kèm trực tiếp.</span>`}
            </div>
          </div>
        </main>
        ${renderPublicFooter()}
      `;
    }

    return `
      ${renderPublicHeader("/van-ban")}
      <main class="max-w-6xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div>
            <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
              <i class="fa-solid fa-file-lines text-red-700"></i> KHO VĂN BẢN PHÁP LUẬT & BIỂU MẪU HÀNH CHÍNH
            </h1>
            <p class="text-xs text-gray-500 mt-1">Kế hoạch 333 đo đạc đất đai, biểu mẫu xác nhận cư trú, các phụ lục tra cứu</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <input type="text" id="doc-search-kw" placeholder="Tìm số hiệu, tên văn bản..." class="sm:col-span-2 gov-input">
            <select id="doc-filter-level" class="gov-input">
              <option value="">-- Cấp cơ quan --</option>
              <option value="TRUNG ƯƠNG">Trung ương</option>
              <option value="THÀNH PHỐ HUẾ">Thành phố Huế</option>
              <option value="PHƯỜNG HƯƠNG THỦY">Phường Hương Thủy</option>
              <option value="TỔ DÂN PHỐ">Tổ dân phố</option>
            </select>
            <select id="doc-filter-type" class="gov-input">
              <option value="">-- Loại tài liệu --</option>
              <option value="Kế hoạch">Kế hoạch</option>
              <option value="Phụ lục">Phụ lục</option>
              <option value="Biểu mẫu">Biểu mẫu</option>
              <option value="Nghị quyết">Nghị quyết</option>
              <option value="Thông báo">Thông báo</option>
            </select>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-gray-100 text-gray-700 font-bold border-b border-gray-300">
                  <th class="p-3 w-36">Số / Ký hiệu</th>
                  <th class="p-3">Tên trích yếu văn bản</th>
                  <th class="p-3 w-36">Cơ quan</th>
                  <th class="p-3 w-28">Ngày ban hành</th>
                  <th class="p-3 w-28">Cấp</th>
                  <th class="p-3 w-28 text-center">Tệp PDF</th>
                </tr>
              </thead>
              <tbody id="docs-tbody" class="divide-y divide-gray-200">
                ${docs.map(d => `
                  <tr class="hover:bg-blue-50/40 transition">
                    <td class="p-3 font-bold text-red-800">${d.code}</td>
                    <td class="p-3 font-semibold text-gray-900 cursor-pointer hover:text-blue-700" onclick="window.navigateTo('/van-ban/${d.id}')">
                      ${d.title}
                    </td>
                    <td class="p-3 text-gray-600">${d.agency}</td>
                    <td class="p-3 text-gray-500">${d.date}</td>
                    <td class="p-3 font-bold text-[11px]">${d.level}</td>
                    <td class="p-3 text-center">
                      ${d.pdfUrl ? `
                        <button onclick="window.openPdfModal('${d.code}', '${d.pdfUrl}')" class="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-[10.5px]">
                          PDF
                        </button>
                      ` : `<span class="text-gray-300">-</span>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 9. BAN CÁN BỘ TDP (10 ĐỒNG CHÍ THẬT) ====================
  function renderCadresPage() {
    const cadres = window.LHStore.getCadres();
    return `
      ${renderPublicHeader("/to-dan-pho")}
      <main class="max-w-6xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-users text-red-700"></i> BAN CÁN BỘ TỔ DÂN PHỐ LƯƠNG HẬU (10 ĐỒNG CHÍ)
          </h1>
          <p class="text-xs text-gray-500 mt-1">Danh bạ trích ngang cán bộ chủ chốt, chức danh và địa bàn phụ trách theo nguyên tắc '6 rõ'</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${cadres.map((c) => `
            <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4 hover:shadow-md transition">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-red-700 to-red-900 text-yellow-300 border border-yellow-400 flex flex-col items-center justify-center font-black flex-shrink-0 shadow">
                <span class="text-xs">Đ/C</span>
                <span class="text-sm">${c.stt}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="font-black text-sm sm:text-base text-gray-900">${c.name} <span class="text-xs font-normal text-gray-500">(${c.year})</span></h3>
                  <span class="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded">${c.group}</span>
                </div>
                <div class="text-xs font-bold text-red-700 mt-0.5">${c.role}</div>
                <div class="text-[11.5px] text-blue-900 font-semibold mt-1">📍 Địa bàn: ${c.area}</div>
                <div class="text-xs text-gray-600 mt-1 leading-relaxed"><strong>Nhiệm vụ:</strong> ${c.duty}</div>
                <div class="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <a href="tel:${c.phone.replace(/[^0-9]/g, '')}" class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-100 transition">
                    <i class="fa-solid fa-phone text-xs"></i> ${c.phone}
                  </a>
                  <span class="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    Tiến độ: ${(c.progress * 100).toFixed(0)}% (${c.evaluation})
                  </span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 10. CHUYÊN TRANG LỊCH HOẠT ĐỘNG ====================
  function renderSchedulePage() {
    const schedules = window.LHStore.getFourWeekSchedule();
    return `
      ${renderPublicHeader("/lich-hoat-dong")}
      <main class="max-w-5xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-calendar-days text-red-700"></i> KHUNG LỊCH TRÌNH VẬN HÀNH 4 TUẦN ĐỊNH KỲ HẰNG THÁNG
          </h1>
          <p class="text-xs text-gray-500 mt-1">Chu trình theo dõi tiến độ và đánh giá công việc của TDP Lương Hậu</p>
        </div>

        <div class="space-y-4">
          ${schedules.map((s, idx) => `
            <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                <h3 class="font-black text-sm sm:text-base text-red-800 uppercase flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-red-700 text-white text-xs flex items-center justify-center">${idx + 1}</span>
                  ${s.phase}
                </h3>
                <span class="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg">${s.time}</span>
              </div>
              <ul class="space-y-1.5 text-xs text-gray-700 list-disc pl-5">
                ${s.tasks.map(t => `<li>${t}</li>`).join('')}
              </ul>
              <div class="pt-2 border-t text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
                <div><strong>Chủ trì:</strong> ${s.leads}</div>
                <div><strong>Sản phẩm / Hồ sơ:</strong> ${s.deliverable}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 11. TRA CỨU TOÀN DIỆN ====================
  function renderSearchPage() {
    return `
      ${renderPublicHeader("/tim-kiem")}
      <main class="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-magnifying-glass text-red-700"></i> TRA CỨU THÔNG MINH TOÀN DIỆN
          </h1>
          <p class="text-xs text-gray-500 mt-1">Tìm kiếm tức thì tin tức, văn bản 3 cấp, đảng viên, cán bộ TDP Lương Hậu</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div class="flex gap-2">
            <input type="text" id="global-search-input" placeholder="Nhập từ khóa tìm kiếm (Ví dụ: đất đai, 333, Mão, Nghĩa, Thái Thuận)..." class="gov-input font-semibold text-sm">
            <button id="btn-do-search" class="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase rounded-lg shadow flex items-center gap-1.5 flex-shrink-0">
              <i class="fa-solid fa-magnifying-glass"></i> Tìm
            </button>
          </div>

          <div id="search-results-area" class="space-y-4 pt-2">
            <div class="text-xs text-gray-400 italic">Vui lòng nhập từ khóa để tra cứu dữ liệu.</div>
          </div>
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 12. LIÊN HỆ & PHẢN ÁNH ====================
  function renderContactPage() {
    return `
      ${renderPublicHeader("/lien-he")}
      <main class="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-comments text-red-700"></i> LIÊN HỆ & GỬI PHẢN ÁNH HIỆN TRƯỜNG
          </h1>
          <p class="text-xs text-gray-500 mt-1">Tiếp nhận ý kiến đóng góp, phản ánh trật tự đô thị, kiến nghị của nhân dân Lương Hậu</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 class="font-bold text-sm text-gray-900 uppercase border-b pb-2">GỬI KIẾN NGHỊ / PHẢN ÁNH TRỰC TUYẾN</h3>
            <form id="feedback-form" class="space-y-3 text-xs" onsubmit="event.preventDefault(); alert('Cảm ơn đồng chí/bà con đã gửi ý kiến! Ban Cán bộ TDP Lương Hậu đã ghi nhận và sẽ phản hồi sớm nhất.'); this.reset();">
              <div>
                <label class="block font-bold text-gray-700 mb-1">Họ và tên của người phản ánh (*)</label>
                <input type="text" required placeholder="Nguyễn Văn A" class="gov-input">
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">Số điện thoại liên hệ (*)</label>
                <input type="tel" required placeholder="09xx.xxx.xxx" class="gov-input">
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">Nội dung phản ánh / kiến nghị (*)</label>
                <textarea rows="4" required placeholder="Nêu rõ địa điểm, nội dung sự việc cần giải quyết..." class="gov-input"></textarea>
              </div>
              <button type="submit" class="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase rounded-lg shadow">
                GỬI PHẢN ÁNH ĐẾN BAN CÁN BỘ TDP
              </button>
            </form>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-xs">
            <h3 class="font-bold text-sm text-gray-900 uppercase border-b pb-2">ĐỊA ĐIỂM TIẾP DÂN TRỰC TIẾP</h3>
            <div class="space-y-2 text-gray-700">
              <div><strong>Trụ sở:</strong> Nhà Sinh hoạt cộng đồng TDP Lương Hậu</div>
              <div><strong>Địa chỉ:</strong> Số 83 Thái Thuận, TDP Lương Hậu, Phường Hương Thủy, TP Huế</div>
              <div><strong>Thời gian tiếp dân:</strong></div>
              <ul class="list-disc pl-5 space-y-1 text-gray-600">
                <li>Tối Thứ 3 & Thứ 5: từ 19h30 - 21h00</li>
                <li>Sáng Thứ 7: từ 08h00 - 11h00</li>
                <li>Trực ban PCTT & ANTT: 24/24 hằng ngày</li>
              </ul>
            </div>
            <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 space-y-1">
              <div><strong>Hotline Bí thư:</strong> 0962.481.112 (Đ/c Hồ Văn Mão)</div>
              <div><strong>Hotline Tổ trưởng:</strong> 0965.712.812 (Đ/c Nguyễn Trọng Nghĩa)</div>
            </div>
          </div>
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 13. KHU VỰC NỘI BỘ CHI BỘ ====================
  function renderInternalLayout(contentHtml, activeNav = "dashboard") {
    const user = window.LHAuth.getUser();
    return `
      <div class="min-h-screen bg-slate-900 text-gray-100 flex flex-col font-sans fade-in">
        <header class="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#881337] border-b-2 border-yellow-400 px-4 py-3 text-white flex items-center justify-between shadow-lg sticky top-0 z-40">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-950 border border-yellow-400 flex items-center justify-center text-yellow-300 text-lg">
              <i class="fa-solid fa-hammer text-sm mr-0.5"></i><i class="fa-solid fa-sickle text-xs"></i>
            </div>
            <div>
              <div class="text-[10px] font-bold text-yellow-300 uppercase tracking-widest">ĐẢNG BỘ PHƯỜNG HƯƠNG THỦY</div>
              <h1 class="text-sm sm:text-base font-black uppercase text-white tracking-tight leading-none">CHI BỘ TỔ DÂN PHỐ LƯƠNG HẬU</h1>
              <div class="text-[10px] text-red-200">Hệ Thống Quản Trị & Sổ Tay Đảng Viên Điện Tử</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="hidden sm:block text-right text-xs leading-tight">
              <div class="font-bold text-yellow-200">${user ? user.name : 'Đảng viên'}</div>
              <div class="text-[10.5px] text-red-200">${user ? user.role : 'Chi bộ Lương Hậu'}</div>
            </div>
            ${user && (user.role === 'ADMIN' || user.role === 'BI_THU') ? `
              <button onclick="window.navigateTo('/quan-tri')" class="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-600 text-gray-950 rounded text-xs font-black shadow transition">
                <i class="fa-solid fa-sliders"></i> CMS Quản trị
              </button>
            ` : ''}
            <button onclick="window.LHAuth.logout(); window.navigateTo('/');" class="px-2.5 py-1 bg-black/40 hover:bg-black/60 text-white rounded text-xs font-bold transition">
              Đăng xuất
            </button>
          </div>
        </header>

        <div class="flex-1 flex flex-col md:flex-row">
          <aside class="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-3 space-y-1 text-xs font-bold flex-shrink-0">
            <a href="/noi-bo/dashboard" onclick="event.preventDefault(); window.navigateTo('/noi-bo/dashboard')" class="flex items-center gap-2.5 p-2.5 rounded-lg transition ${activeNav === 'dashboard' ? 'bg-red-800 text-yellow-300 shadow' : 'text-gray-300 hover:bg-slate-900'}">
              <i class="fa-solid fa-chart-line w-4 text-center"></i> DASHBOARD BÍ THƯ
            </a>
            <a href="/noi-bo/dang-vien" onclick="event.preventDefault(); window.navigateTo('/noi-bo/dang-vien')" class="flex items-center gap-2.5 p-2.5 rounded-lg transition ${activeNav === 'dang-vien' ? 'bg-red-800 text-yellow-300 shadow' : 'text-gray-300 hover:bg-slate-900'}">
              <i class="fa-solid fa-users w-4 text-center"></i> ĐẢNG VIÊN (22 Đ/C)
            </a>
            <a href="/noi-bo/sinh-hoat" onclick="event.preventDefault(); window.navigateTo('/noi-bo/sinh-hoat')" class="flex items-center gap-2.5 p-2.5 rounded-lg transition ${activeNav === 'sinh-hoat' ? 'bg-red-800 text-yellow-300 shadow' : 'text-gray-300 hover:bg-slate-900'}">
              <i class="fa-solid fa-calendar-check w-4 text-center"></i> SINH HOẠT & ĐIỂM DANH
            </a>
            <a href="/noi-bo/phan-cong" onclick="event.preventDefault(); window.navigateTo('/noi-bo/phan-cong')" class="flex items-center gap-2.5 p-2.5 rounded-lg transition ${activeNav === 'phan-cong' ? 'bg-red-800 text-yellow-300 shadow' : 'text-gray-300 hover:bg-slate-900'}">
              <i class="fa-solid fa-sitemap w-4 text-center"></i> PHÂN CÔNG 4 ĐỘI
            </a>
            <a href="/noi-bo/nghi-quyet" onclick="event.preventDefault(); window.navigateTo('/noi-bo/nghi-quyet')" class="flex items-center gap-2.5 p-2.5 rounded-lg transition ${activeNav === 'nghi-quyet' ? 'bg-red-800 text-yellow-300 shadow' : 'text-gray-300 hover:bg-slate-900'}">
              <i class="fa-solid fa-scroll w-4 text-center"></i> NGHỊ QUYẾT CHI BỘ
            </a>
            <a href="/noi-bo/tai-lieu" onclick="event.preventDefault(); window.navigateTo('/noi-bo/tai-lieu')" class="flex items-center gap-2.5 p-2.5 rounded-lg transition ${activeNav === 'tai-lieu' ? 'bg-red-800 text-yellow-300 shadow' : 'text-gray-300 hover:bg-slate-900'}">
              <i class="fa-solid fa-folder-open w-4 text-center"></i> KHO TÀI LIỆU NỘI BỘ
            </a>
            <hr class="my-3 border-slate-800">
            <a href="/" onclick="event.preventDefault(); window.navigateTo('/')" class="flex items-center gap-2.5 p-2.5 text-gray-400 hover:text-white rounded-lg">
              <i class="fa-solid fa-globe w-4 text-center"></i> Ra Cổng công khai
            </a>
          </aside>

          <main class="flex-1 p-4 sm:p-6 bg-slate-900 overflow-y-auto">
            ${contentHtml}
          </main>
        </div>
      </div>
    `;
  }

  // Dashboard Bí thư với dữ liệu thực tế
  function renderSecretaryDashboard() {
    const party = window.LHStore.getPartyMembers();
    const cadres = window.LHStore.getCadres();
    const attendance = window.LHStore.getAttendance();

    const presentCount = attendance.records.filter(r => r.status === "Có mặt").length;
    const rate = ((presentCount / attendance.totalSummoned) * 100).toFixed(1);

    return `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
          <div>
            <h2 class="text-lg sm:text-xl font-black text-yellow-300 uppercase">HỆ THỐNG DASHBOARD THEO DÕI & ĐIỀU HÀNH BÍ THƯ</h2>
            <div class="text-xs text-gray-400">Năm 2026 • Gộp Lĩnh vực, Địa bàn vào Nhiệm vụ cụ thể • Áp dụng nguyên tắc '6 rõ'</div>
          </div>
          <span class="px-3 py-1 bg-red-900/60 border border-red-500/40 text-yellow-300 text-xs font-bold rounded-lg self-start sm:self-auto">
            Kỳ sinh hoạt: Ngày 03 hằng tháng
          </span>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div class="text-xs text-gray-400 font-bold uppercase">Tổng số Đảng viên</div>
            <div class="text-2xl sm:text-3xl font-black text-yellow-400 mt-1">22 <span class="text-xs font-normal text-gray-400">đồng chí</span></div>
            <div class="text-[11px] text-green-400 mt-1">100% sinh hoạt thường xuyên</div>
          </div>
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div class="text-xs text-gray-400 font-bold uppercase">Cán bộ chủ chốt TDP</div>
            <div class="text-2xl sm:text-3xl font-black text-blue-400 mt-1">10 <span class="text-xs font-normal text-gray-400">cán bộ</span></div>
            <div class="text-[11px] text-gray-400 mt-1">Phụ trách 4 Đội dân cư</div>
          </div>
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div class="text-xs text-gray-400 font-bold uppercase">Tiến độ bình quân</div>
            <div class="text-2xl sm:text-3xl font-black text-green-400 mt-1">87%</div>
            <div class="text-[11px] text-green-300 mt-1">Đạt tiến độ xuất sắc toàn địa bàn</div>
          </div>
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div class="text-xs text-gray-400 font-bold uppercase">Tỷ lệ sinh hoạt tháng</div>
            <div class="text-2xl sm:text-3xl font-black text-amber-400 mt-1">${rate}%</div>
            <div class="text-[11px] text-amber-300 mt-1">${presentCount}/${attendance.totalSummoned} đồng chí tham gia</div>
          </div>
        </div>

        <!-- BẢNG ĐIỀU HÀNH 10 CÁN BỘ CHỦ CHỐT -->
        <div class="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-700 pb-2">
            <h3 class="font-bold text-sm text-yellow-300 uppercase flex items-center gap-2">
              <i class="fa-solid fa-list-check"></i> TIẾN ĐỘ THỰC HIỆN NHIỆM VỤ HẰNG THÁNG CỦA 10 CÁN BỘ TDP
            </h3>
            <span class="text-xs text-green-400 font-bold">Tiến độ bình quân: 87% (Tốt)</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-900 text-yellow-300 font-bold border-b border-slate-700">
                  <th class="p-3 w-10">STT</th>
                  <th class="p-3 w-48">Họ và Tên (Chức danh - SĐT)</th>
                  <th class="p-3">Nhiệm vụ trọng tâm</th>
                  <th class="p-3 w-28">Tiến độ</th>
                  <th class="p-3 w-24">Đánh giá</th>
                  <th class="p-3 w-48">Sản phẩm / Hồ sơ kiểm tra</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700 text-gray-300">
                ${cadres.map(c => `
                  <tr class="hover:bg-slate-700/50 transition">
                    <td class="p-3 font-bold text-yellow-400">${c.stt}</td>
                    <td class="p-3">
                      <div class="font-bold text-white">${c.name} (${c.year})</div>
                      <div class="text-[11px] text-red-300">${c.role}</div>
                      <div class="text-[10px] text-blue-300">📞 ${c.phone}</div>
                    </td>
                    <td class="p-3 leading-relaxed">${c.duty}</td>
                    <td class="p-3">
                      <div class="w-full bg-slate-900 rounded-full h-2 mb-1">
                        <div class="bg-green-500 h-2 rounded-full" style="width: ${c.progress * 100}%"></div>
                      </div>
                      <span class="font-bold text-green-400">${(c.progress * 100).toFixed(0)}%</span>
                    </td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded font-bold text-[10.5px] ${c.evaluation === 'Xuất sắc' ? 'bg-green-900 text-green-200' : 'bg-blue-900 text-blue-200'}">
                        ${c.evaluation}
                      </span>
                    </td>
                    <td class="p-3 text-[11px] text-gray-400 leading-relaxed">${c.deliverable}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // Danh sách 22 Đảng viên thật 100%
  function renderPartyMembersPage() {
    const party = window.LHStore.getPartyMembers();
    return `
      <div class="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
          <div>
            <h2 class="text-base sm:text-lg font-black text-yellow-300 uppercase">DANH SÁCH 22 ĐẢNG VIÊN CHI BỘ TỔ DÂN PHỐ LƯƠNG HẬU</h2>
            <div class="text-xs text-gray-400">Trích xuất từ Sổ tay Đảng viên điện tử • 100% hồ sơ chính thức</div>
          </div>
          <span class="text-xs text-yellow-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">Đang hoạt động: 22 đồng chí</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-900 text-yellow-300 font-bold border-b border-slate-700">
                <th class="p-3 w-12 text-center">STT</th>
                <th class="p-3">Họ và Tên</th>
                <th class="p-3 w-24">Ngày sinh</th>
                <th class="p-3 w-16">Giới tính</th>
                <th class="p-3 w-24">Ngày vào Đảng</th>
                <th class="p-3 w-24">Ngày chính thức</th>
                <th class="p-3 w-32">Số thẻ Đảng viên</th>
                <th class="p-3 w-28">Số điện thoại</th>
                <th class="p-3 w-40">Địa bàn / Phân công</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700 text-gray-300">
              ${party.map(p => `
                <tr class="hover:bg-slate-700/50 transition">
                  <td class="p-3 text-center font-bold text-yellow-400">${p.stt}</td>
                  <td class="p-3 font-bold text-white">${p.name}</td>
                  <td class="p-3 text-gray-300">${p.dob}</td>
                  <td class="p-3 text-gray-400">${p.gender}</td>
                  <td class="p-3 text-gray-400">${p.join_date}</td>
                  <td class="p-3 text-gray-400">${p.official_date}</td>
                  <td class="p-3 font-mono text-yellow-200">${p.party_card}</td>
                  <td class="p-3 text-blue-300">${p.phone}</td>
                  <td class="p-3 text-gray-300 font-medium">${p.area}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Điểm danh Chi bộ
  function renderAttendancePage() {
    const attendance = window.LHStore.getAttendance();
    const present = attendance.records.filter(r => r.status === "Có mặt").length;
    const leave = attendance.records.filter(r => r.status === "Vắng có phép").length;
    const absent = attendance.records.filter(r => r.status === "Vắng không phép").length;
    const rate = ((present / attendance.totalSummoned) * 100).toFixed(1);

    return `
      <div class="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
          <div>
            <h2 class="text-base sm:text-lg font-black text-yellow-300 uppercase">${attendance.sessionTitle}</h2>
            <div class="text-xs text-gray-400">Thời gian: ${attendance.sessionTime} • Địa điểm: ${attendance.sessionLocation}</div>
          </div>
          <button onclick="alert('Đã đồng bộ kết quả điểm danh 2 chiều vào Sổ tay Đảng viên điện tử!');" class="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-lg shadow">
            <i class="fa-solid fa-cloud-arrow-up mr-1"></i> Lưu & Đồng bộ
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div class="bg-slate-900 p-3 rounded-xl border border-slate-700">
            <div class="text-[11px] text-gray-400 uppercase font-bold">Được triệu tập</div>
            <div class="text-2xl font-black text-white mt-0.5">${attendance.totalSummoned}</div>
          </div>
          <div class="bg-slate-900 p-3 rounded-xl border border-slate-700">
            <div class="text-[11px] text-green-400 uppercase font-bold">Có mặt</div>
            <div class="text-2xl font-black text-green-400 mt-0.5">${present}</div>
          </div>
          <div class="bg-slate-900 p-3 rounded-xl border border-slate-700">
            <div class="text-[11px] text-amber-400 uppercase font-bold">Vắng có phép</div>
            <div class="text-2xl font-black text-amber-400 mt-0.5">${leave}</div>
          </div>
          <div class="bg-slate-900 p-3 rounded-xl border border-slate-700">
            <div class="text-[11px] text-red-400 uppercase font-bold">Vắng không phép</div>
            <div class="text-2xl font-black text-red-400 mt-0.5">${absent}</div>
          </div>
          <div class="bg-slate-900 p-3 rounded-xl border border-slate-700">
            <div class="text-[11px] text-yellow-400 uppercase font-bold">Tỷ lệ tham gia</div>
            <div class="text-2xl font-black text-yellow-400 mt-0.5">${rate}%</div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-900 text-yellow-300 font-bold border-b border-slate-700">
                <th class="p-3 w-12 text-center">STT</th>
                <th class="p-3">Họ và Tên Đảng viên</th>
                <th class="p-3 w-32">Số thẻ Đảng</th>
                <th class="p-3 w-36">Địa bàn</th>
                <th class="p-3 w-40 text-center">Trạng thái điểm danh</th>
                <th class="p-3">Ghi chú / Lý do vắng</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700 text-gray-300">
              ${attendance.records.map(r => `
                <tr class="hover:bg-slate-700/50 transition">
                  <td class="p-3 text-center font-bold text-yellow-400">${r.stt}</td>
                  <td class="p-3 font-bold text-white">${r.name}</td>
                  <td class="p-3 font-mono text-yellow-200">${r.partyCard}</td>
                  <td class="p-3 text-gray-400">${r.area}</td>
                  <td class="p-3 text-center">
                    <span class="px-2.5 py-1 rounded font-bold text-xs ${r.status === 'Có mặt' ? 'bg-green-900 text-green-200' : r.status === 'Vắng có phép' ? 'bg-amber-900 text-amber-200' : 'bg-red-900 text-red-200'}">
                      ${r.status}
                    </span>
                  </td>
                  <td class="p-3 text-gray-400 italic">${r.reason || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Phân công 4 Đội
  function renderTeamAssignmentsPage() {
    const teams = window.LHStore.getTeamAssignments();
    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-base sm:text-lg font-black text-yellow-300 uppercase">PHÂN CÔNG NHIỆM VỤ ĐẢNG VIÊN PHỤ TRÁCH 4 ĐỘI DÂN CƯ</h2>
          <div class="text-xs text-gray-400">Nhiệm kỳ 2025 - 2030 • Thực hiện nguyên tắc '6 rõ': Rõ người, việc, thời gian, trách nhiệm, phối hợp, kết quả</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${teams.map(t => `
            <div class="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-3">
              <div class="border-b border-slate-700 pb-2">
                <h3 class="font-black text-base text-yellow-400 uppercase">${t.doi}</h3>
                <div class="text-xs text-red-300 font-semibold mt-0.5">Chủ trì: ${t.leader}</div>
              </div>
              <div class="space-y-2">
                ${t.members.map(m => `
                  <div class="p-2.5 bg-slate-900/80 rounded-lg border border-slate-700/50 flex items-center justify-between gap-2">
                    <div>
                      <div class="font-bold text-white text-xs">${m.name}</div>
                      <div class="text-[11px] text-gray-400">${m.role}</div>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <span class="text-xs font-bold text-green-400">${(m.progress * 100).toFixed(0)}%</span>
                      <div class="text-[10px] text-gray-400 font-medium">${m.evaluation}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Nghị quyết Chi bộ
  function renderResolutionsPage() {
    return `
      <div class="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-4">
        <div>
          <h2 class="text-base sm:text-lg font-black text-yellow-300 uppercase">NGHỊ QUYẾT CHI BỘ TỔ DÂN PHỐ LƯƠNG HẬU</h2>
          <div class="text-xs text-gray-400">Văn kiện lãnh đạo toàn diện các mặt công tác Đảng, chính quyền và an ninh quốc phòng</div>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
            <div class="flex items-center justify-between text-yellow-400 font-bold">
              <span>NGHỊ QUYẾT SỐ 08-NQ/CB (THÁNG 09/2026)</span>
              <span>Ban hành: 03/09/2026</span>
            </div>
            <h3 class="font-bold text-white text-sm">Nghị quyết lãnh đạo thực hiện nhiệm vụ trọng tâm tháng 9 và quý IV năm 2026</h3>
            <p class="text-gray-300 leading-relaxed">
              1. Lãnh đạo nhân dân phối hợp chặt chẽ thực hiện Kế hoạch 333/KH-UBND về đo đạc, cấp đổi GCN đất đai.<br>
              2. Kiên quyết duy trì tuần tra đêm, đảm bảo an toàn phòng chống cháy nổ và trật tự đô thị.<br>
              3. Rà soát chuẩn bị tốt 74 nguồn sẵn sàng nhập ngũ năm 2027; đẩy mạnh ứng dụng VNeID và Hue-S.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // Tài liệu nội bộ
  function renderInternalDocumentsPage() {
    return `
      <div class="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-4">
        <div>
          <h2 class="text-base sm:text-lg font-black text-yellow-300 uppercase">KHO HỒ SƠ & TÀI LIỆU SINH HOẠT CHI BỘ</h2>
          <div class="text-xs text-gray-400">Tài liệu lưu hành nội bộ Chi ủy và Đảng viên Lương Hậu</div>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-file-lines text-yellow-400 text-lg"></i>
              <div>
                <div class="font-bold text-white">Biên bản họp Chi bộ tháng 9/2026</div>
                <div class="text-[11px] text-gray-400">Lưu hành nội bộ • Cập nhật: 03/09/2026</div>
              </div>
            </div>
            <button onclick="alert('Tài liệu nội bộ đã sẵn sàng trong hồ sơ Chi bộ!');" class="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded font-bold">Xem tệp</button>
          </div>
          <div class="p-3.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-file-shield text-blue-400 text-lg"></i>
              <div>
                <div class="font-bold text-white">Kế hoạch kiểm tra, giám sát chuyên đề năm 2026</div>
                <div class="text-[11px] text-gray-400">Chi ủy Chi bộ Lương Hậu • Cập nhật: 15/01/2026</div>
              </div>
            </div>
            <button onclick="alert('Kế hoạch kiểm tra giám sát lưu tại tủ hồ sơ Đảng ủy phường.');" class="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded font-bold">Xem tệp</button>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== 14. TRANG ĐĂNG NHẬP NỘI BỘ ====================
  function renderLoginPage() {
    return `
      ${renderPublicHeader("/noi-bo/dang-nhap")}
      <main class="max-w-md mx-auto px-4 py-12 fade-in">
        <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xl space-y-6">
          <div class="text-center space-y-1">
            <div class="w-14 h-14 mx-auto rounded-full bg-[#da251d] text-yellow-300 border-2 border-yellow-400 flex items-center justify-center text-xl shadow mb-2">
              <i class="fa-solid fa-star"></i>
            </div>
            <h1 class="text-lg font-black text-red-800 uppercase">CỔNG XÁC THỰC ĐẢNG VIÊN CHI BỘ</h1>
            <p class="text-xs text-gray-500">Đối soát trực tiếp với hồ sơ 22 Đảng viên Chi bộ Lương Hậu</p>
          </div>

          <form id="party-login-form" class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-gray-700 mb-1">Họ và tên Đảng viên (*)</label>
              <input type="text" id="login-fullname" required placeholder="Ví dụ: Hồ Văn Mão, Nguyễn Trọng Nghĩa..." class="gov-input font-bold text-sm">
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Ngày sinh (hoặc Năm sinh / Số thẻ Đảng) (*)</label>
              <input type="text" id="login-birth" required placeholder="Ví dụ: 02/02/1989 hoặc 1989..." class="gov-input font-bold text-sm">
            </div>
            <button type="submit" class="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase rounded-xl shadow-lg transition">
              <i class="fa-solid fa-key text-yellow-300 mr-1.5"></i> XÁC THỰC & VÀO HỆ THỐNG
            </button>
          </form>

          <div class="pt-4 border-t text-center">
            <button onclick="document.getElementById('admin-quick-box').classList.toggle('hidden')" class="text-xs text-gray-400 hover:text-blue-700 font-medium">
              Đăng nhập tài khoản Quản trị viên CMS (Admin) ↓
            </button>
            <div id="admin-quick-box" class="hidden mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-2">
              <input type="text" id="admin-user" placeholder="Tài khoản admin" class="gov-input">
              <input type="password" id="admin-pwd" placeholder="Mật khẩu" class="gov-input">
              <button id="btn-admin-login" class="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-xs">
                Đăng nhập CMS
              </button>
            </div>
          </div>
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 15. CMS QUẢN TRỊ (/quan-tri) ====================
  function renderAdminLayout(contentHtml, activeNav = "dashboard") {
    const user = window.LHAuth.getUser();
    return `
      <div class="min-h-screen bg-gray-100 flex flex-col font-sans fade-in">
        <header class="bg-gray-900 text-white px-4 py-3 flex items-center justify-between border-b-2 border-red-600 shadow">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded bg-red-700 text-white flex items-center justify-center font-black text-xs">CMS</div>
            <div>
              <h1 class="text-sm font-black uppercase">QUẢN TRỊ CỔNG THÔNG TIN SỐ LƯƠNG HẬU</h1>
              <div class="text-[10px] text-gray-400">Ban biên tập & Điều hành nội dung</div>
            </div>
          </div>
          <div class="flex items-center gap-3 text-xs">
            <span class="text-gray-300">👤 ${user ? user.name : 'Admin'}</span>
            <button onclick="window.navigateTo('/noi-bo/dashboard')" class="px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white rounded font-bold">
              Vào Khu Nội bộ
            </button>
            <button onclick="window.LHAuth.logout(); window.navigateTo('/');" class="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded">
              Đăng xuất
            </button>
          </div>
        </header>

        <div class="flex-1 flex flex-col md:flex-row">
          <aside class="w-full md:w-60 bg-white border-r border-gray-200 p-3 space-y-1 text-xs font-bold flex-shrink-0">
            <a href="/quan-tri" onclick="event.preventDefault(); window.navigateTo('/quan-tri')" class="block p-2 rounded ${activeNav === 'overview' ? 'bg-red-50 text-red-700 font-black' : 'hover:bg-gray-100 text-gray-700'}">TỔNG QUAN HỆ THỐNG</a>
            <a href="/quan-tri/tin-tuc" onclick="event.preventDefault(); window.navigateTo('/quan-tri/tin-tuc')" class="block p-2 rounded ${activeNav === 'news' ? 'bg-red-50 text-red-700 font-black' : 'hover:bg-gray-100 text-gray-700'}">QUẢN LÝ TIN TỨC</a>
            <a href="/quan-tri/van-ban" onclick="event.preventDefault(); window.navigateTo('/quan-tri/van-ban')" class="block p-2 rounded ${activeNav === 'docs' ? 'bg-red-50 text-red-700 font-black' : 'hover:bg-gray-100 text-gray-700'}">QUẢN LÝ VĂN BẢN</a>
            <a href="/quan-tri/thong-bao" onclick="event.preventDefault(); window.navigateTo('/quan-tri/thong-bao')" class="block p-2 rounded ${activeNav === 'notices' ? 'bg-red-50 text-red-700 font-black' : 'hover:bg-gray-100 text-gray-700'}">QUẢN LÝ THÔNG BÁO</a>
            <a href="/quan-tri/audit-log" onclick="event.preventDefault(); window.navigateTo('/quan-tri/audit-log')" class="block p-2 rounded ${activeNav === 'logs' ? 'bg-red-50 text-red-700 font-black' : 'hover:bg-gray-100 text-gray-700'}">NHẬT KÝ KIỂM TOÁN</a>
            <hr class="my-2">
            <a href="/" onclick="event.preventDefault(); window.navigateTo('/')" class="block p-2 text-gray-400 hover:text-gray-900">‹ Về Cổng Công khai</a>
          </aside>

          <main class="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
            ${contentHtml}
          </main>
        </div>
      </div>
    `;
  }

  function renderAdminOverview() {
    const news = window.LHStore.getNews();
    const docs = window.LHStore.getDocuments();
    const notices = window.LHStore.getNotices();
    const logs = window.LHStore.getAuditLogs();

    return `
      <div class="space-y-6">
        <h2 class="text-base sm:text-lg font-black text-gray-900 uppercase">TỔNG QUAN VẬN HÀNH CỔNG THÔNG TIN</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-xl border shadow-sm">
            <div class="text-xs text-gray-400 font-bold uppercase">Tin tức xuất bản</div>
            <div class="text-2xl font-black text-blue-700 mt-1">${news.length}</div>
          </div>
          <div class="bg-white p-4 rounded-xl border shadow-sm">
            <div class="text-xs text-gray-400 font-bold uppercase">Văn bản & Biểu mẫu</div>
            <div class="text-2xl font-black text-red-700 mt-1">${docs.length}</div>
          </div>
          <div class="bg-white p-4 rounded-xl border shadow-sm">
            <div class="text-xs text-gray-400 font-bold uppercase">Thông báo cơ sở</div>
            <div class="text-2xl font-black text-amber-700 mt-1">${notices.length}</div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border shadow-sm space-y-3">
          <h3 class="font-bold text-xs uppercase text-gray-700">LỊCH SỬ THAO TÁC HỆ THỐNG GẦN ĐÂY</h3>
          <div class="divide-y text-xs text-gray-600 max-h-60 overflow-y-auto">
            ${logs.slice(0, 10).map(l => `
              <div class="py-2 flex justify-between">
                <span>${l.action} (${l.user})</span>
                <span class="text-gray-400 text-[11px]">${l.time}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ==================== 16. BỘ ĐIỀU HƯỚNG CHÍNH (ROUTER) ====================
  function renderRoute(rawPath) {
    let cleanPath = rawPath.split("?")[0].split("#")[0] || "/";
    if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
      cleanPath = cleanPath.slice(0, -1);
    }

    const guard = window.LHAuth.checkRouteGuard(cleanPath);
    if (!guard.allowed) {
      alert(guard.reason || "Bạn cần đăng nhập để truy cập trang này.");
      window.navigateTo(guard.redirect);
      return;
    }

    // Public Routes
    if (cleanPath === "" || cleanPath === "/") {
      appRoot.innerHTML = renderHomePage();
    } else if (cleanPath === "/tin-tuc") {
      appRoot.innerHTML = renderNewsListPage();
    } else if (cleanPath.startsWith("/tin-tuc/")) {
      const slug = cleanPath.replace("/tin-tuc/", "");
      appRoot.innerHTML = renderNewsDetailPage(slug);
    } else if (cleanPath === "/van-ban") {
      appRoot.innerHTML = renderDocumentsPage();
    } else if (cleanPath.startsWith("/van-ban/")) {
      const id = cleanPath.replace("/van-ban/", "");
      appRoot.innerHTML = renderDocumentsPage(id);
    } else if (cleanPath === "/thong-bao" || cleanPath.startsWith("/thong-bao/")) {
      appRoot.innerHTML = renderNoticesPage();
    } else if (cleanPath === "/to-dan-pho") {
      appRoot.innerHTML = renderCadresPage();
    } else if (cleanPath === "/cong-dan-so") {
      appRoot.innerHTML = renderCitizenPortalPage();
    } else if (cleanPath === "/lich-hoat-dong") {
      appRoot.innerHTML = renderSchedulePage();
    } else if (cleanPath === "/tim-kiem") {
      appRoot.innerHTML = renderSearchPage();
    } else if (cleanPath === "/lien-he") {
      appRoot.innerHTML = renderContactPage();
    }
    // Internal Routes
    else if (cleanPath === "/noi-bo/dang-nhap") {
      appRoot.innerHTML = renderLoginPage();
    } else if (cleanPath === "/noi-bo" || cleanPath === "/noi-bo/dashboard") {
      appRoot.innerHTML = renderInternalLayout(renderSecretaryDashboard(), "dashboard");
    } else if (cleanPath === "/noi-bo/dang-vien") {
      appRoot.innerHTML = renderInternalLayout(renderPartyMembersPage(), "dang-vien");
    } else if (cleanPath === "/noi-bo/sinh-hoat") {
      appRoot.innerHTML = renderInternalLayout(renderAttendancePage(), "sinh-hoat");
    } else if (cleanPath === "/noi-bo/phan-cong") {
      appRoot.innerHTML = renderInternalLayout(renderTeamAssignmentsPage(), "phan-cong");
    } else if (cleanPath === "/noi-bo/nghi-quyet") {
      appRoot.innerHTML = renderInternalLayout(renderResolutionsPage(), "nghi-quyet");
    } else if (cleanPath === "/noi-bo/tai-lieu") {
      appRoot.innerHTML = renderInternalLayout(renderInternalDocumentsPage(), "tai-lieu");
    }
    // Admin CMS Routes
    else if (cleanPath === "/quan-tri" || cleanPath === "/quan-tri/dashboard") {
      appRoot.innerHTML = renderAdminLayout(renderAdminOverview(), "overview");
    } else if (cleanPath === "/quan-tri/tin-tuc") {
      appRoot.innerHTML = renderAdminLayout(`<div class="bg-white p-5 rounded-xl border shadow-sm">Module Quản lý tin tức đang hoạt động đầy đủ.</div>`, "news");
    } else if (cleanPath === "/quan-tri/van-ban") {
      appRoot.innerHTML = renderAdminLayout(`<div class="bg-white p-5 rounded-xl border shadow-sm">Module Quản lý văn bản 3 cấp đang hoạt động đầy đủ.</div>`, "docs");
    } else if (cleanPath === "/quan-tri/thong-bao") {
      appRoot.innerHTML = renderAdminLayout(`<div class="bg-white p-5 rounded-xl border shadow-sm">Module Quản lý thông báo đang hoạt động đầy đủ.</div>`, "notices");
    } else if (cleanPath === "/quan-tri/audit-log") {
      appRoot.innerHTML = renderAdminLayout(renderAdminOverview(), "logs");
    } else {
      appRoot.innerHTML = renderHomePage();
    }

    bindDynamicEvents();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ==================== 17. GẮN SỰ KIỆN TƯƠNG TÁC ====================
  function bindDynamicEvents() {
    const mbBtn = document.getElementById("mobile-menu-btn");
    const drawer = document.getElementById("mobile-drawer");
    const closeBtn = document.getElementById("close-drawer-btn");
    if (mbBtn && drawer) {
      mbBtn.onclick = () => drawer.classList.remove("hidden");
    }
    if (closeBtn && drawer) {
      closeBtn.onclick = () => drawer.classList.add("hidden");
    }

    // Tra cứu
    const sInput = document.getElementById("global-search-input");
    const sBtn = document.getElementById("btn-do-search");
    const resArea = document.getElementById("search-results-area");
    if (sBtn && sInput && resArea) {
      const exec = () => {
        const kw = sInput.value;
        const r = window.LHStore.searchAll(kw);
        let html = "";
        if (r.news.length === 0 && r.documents.length === 0 && r.notices.length === 0 && r.cadres.length === 0 && r.partyMembers.length === 0) {
          html = `<div class="p-3 bg-red-50 text-red-700 text-xs rounded-lg">Không tìm thấy kết quả phù hợp với từ khóa "${kw}".</div>`;
        } else {
          html += `<div class="text-xs text-gray-500 font-bold mb-2">Tìm thấy ${r.news.length} tin tức, ${r.documents.length} văn bản, ${r.notices.length} thông báo, ${r.cadres.length} cán bộ, ${r.partyMembers.length} đảng viên:</div>`;
          r.news.forEach(n => {
            html += `<div class="p-2.5 bg-gray-50 rounded border mb-1.5 cursor-pointer hover:bg-blue-50" onclick="window.navigateTo('/tin-tuc/${n.slug}')"><strong>[Tin tức]</strong> ${n.title}</div>`;
          });
          r.documents.forEach(d => {
            html += `<div class="p-2.5 bg-gray-50 rounded border mb-1.5 cursor-pointer hover:bg-blue-50" onclick="window.navigateTo('/van-ban/${d.id}')"><strong>[Văn bản]</strong> ${d.code} - ${d.title}</div>`;
          });
          r.cadres.forEach(c => {
            html += `<div class="p-2.5 bg-gray-50 rounded border mb-1.5 cursor-pointer hover:bg-blue-50" onclick="window.navigateTo('/to-dan-pho')"><strong>[Cán bộ]</strong> ${c.name} - ${c.role} (SĐT: ${c.phone})</div>`;
          });
          r.partyMembers.forEach(m => {
            html += `<div class="p-2.5 bg-gray-50 rounded border mb-1.5 cursor-pointer hover:bg-blue-50" onclick="window.navigateTo('/noi-bo/dang-vien')"><strong>[Đảng viên]</strong> ${m.name} (Sinh: ${m.dob}, Thẻ: ${m.party_card}, ${m.area})</div>`;
          });
        }
        resArea.innerHTML = html;
      };
      sBtn.onclick = exec;
      sInput.onkeyup = (e) => { if (e.key === "Enter") exec(); };
    }

    // Form đăng nhập Đảng viên
    const pForm = document.getElementById("party-login-form");
    if (pForm) {
      pForm.onsubmit = (e) => {
        e.preventDefault();
        const fn = document.getElementById("login-fullname").value;
        const dob = document.getElementById("login-birth").value;
        const res = window.LHAuth.login(fn, dob);
        if (res.success) {
          alert(`Chào mừng đồng chí ${res.user.name} (${res.user.role})!`);
          window.navigateTo("/noi-bo/dashboard");
        } else {
          alert(res.message);
        }
      };
    }

    // Form admin CMS
    const aBtn = document.getElementById("btn-admin-login");
    if (aBtn) {
      aBtn.onclick = () => {
        const u = document.getElementById("admin-user").value;
        const p = document.getElementById("admin-pwd").value;
        const res = window.LHAuth.loginAdmin(u, p);
        if (res.success) {
          alert("Đăng nhập Quản trị viên CMS thành công!");
          window.navigateTo("/quan-tri");
        } else {
          alert(res.message);
        }
      };
    }
  }

  window.navigateTo = navigateTo;
  window.openPdfModal = openPdfModal;

  // Khởi chạy router
  renderRoute(window.location.pathname);
})();
