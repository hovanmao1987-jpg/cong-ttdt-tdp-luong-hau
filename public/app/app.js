/**
 * CỔNG THÔNG TIN SỐ LƯƠNG HẬU - CORE WEB APP & ROUTER HOÀN CHỈNH
 * Kiến trúc giao diện mới: Công khai (Hành chính hiện đại), Nội bộ (Chi bộ Đảng), CMS Quản trị toàn diện
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

  // ==================== 2. HEADER CÔNG KHAI MỚI ====================
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
            <a href="/van-ban" onclick="event.preventDefault(); window.navigateTo('/van-ban')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute.startsWith('/van-ban') ? 'bg-blue-900 text-yellow-300' : ''}">VĂN BẢN</a>
            <a href="/thong-bao" onclick="event.preventDefault(); window.navigateTo('/thong-bao')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute.startsWith('/thong-bao') ? 'bg-blue-900 text-yellow-300' : ''}">THÔNG BÁO</a>
            <a href="/to-dan-pho" onclick="event.preventDefault(); window.navigateTo('/to-dan-pho')" class="px-3 py-2.5 rounded hover:bg-blue-800 transition ${activeRoute.startsWith('/to-dan-pho') ? 'bg-blue-900 text-yellow-300' : ''}">TỔ DÂN PHỐ</a>
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
              <a href="/van-ban" onclick="event.preventDefault(); window.navigateTo('/van-ban'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">VĂN BẢN 3 CẤP</a>
              <a href="/thong-bao" onclick="event.preventDefault(); window.navigateTo('/thong-bao'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">THÔNG BÁO</a>
              <a href="/to-dan-pho" onclick="event.preventDefault(); window.navigateTo('/to-dan-pho'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">BAN CÁN BỘ TDP (10 Đ/C)</a>
              <a href="/lich-hoat-dong" onclick="event.preventDefault(); window.navigateTo('/lich-hoat-dong'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">LỊCH HOẠT ĐỘNG</a>
              <a href="/lien-he" onclick="event.preventDefault(); window.navigateTo('/lien-he'); closeDrawer();" class="block p-2.5 rounded hover:bg-gray-100">LIÊN HỆ & PHẢN ÁNH</a>
              <hr class="my-2 border-gray-200">
              <a href="/noi-bo/dang-nhap" onclick="event.preventDefault(); window.navigateTo('/noi-bo/dang-nhap'); closeDrawer();" class="block p-2.5 bg-red-50 text-red-800 font-bold rounded">
                <i class="fa-solid fa-shield-halved mr-1 text-red-600"></i> ĐĂNG NHẬP NỘI BỘ
              </a>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  // ==================== 3. FOOTER CÔNG KHAI MỚI ====================
  function renderPublicFooter() {
    return `
      <footer class="bg-gray-900 text-gray-300 text-xs border-t-4 border-[#b91c1c] mt-12 pt-8 pb-12">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="text-white font-black text-sm uppercase mb-2">CỔNG THÔNG TIN SỐ TỔ DÂN PHỐ LƯƠNG HẬU</div>
            <p class="text-gray-400 text-xs leading-relaxed">Ủy ban nhân dân Phường Hương Thủy • Chi bộ & Ban cán bộ Tổ dân phố Lương Hậu, Thành phố Huế.</p>
            <div class="mt-3 text-[11px] text-gray-400">Trụ sở: Số 83 Thái Thuận, TDP Lương Hậu, Phường Hương Thủy, TP Huế</div>
          </div>
          <div>
            <div class="text-white font-bold text-sm mb-2">ĐƯỜNG DÂY NÓNG TIẾP DÂN 24/7</div>
            <ul class="space-y-1.5 text-xs">
              <li><i class="fa-solid fa-phone text-red-400 mr-1.5"></i> Tổ trưởng TDP: <strong>0965.712.812</strong> (Đ/c Hồ Văn Mão)</li>
              <li><i class="fa-solid fa-phone text-blue-400 mr-1.5"></i> Phó Bí thư Chi bộ: <strong>0962.481.112</strong> (Đ/c Nguyễn Trọng Nghĩa)</li>
              <li><i class="fa-solid fa-shield-halved text-green-400 mr-1.5"></i> Tổ ANTT cơ sở: <strong>0975.175.361</strong> (Đ/c Nguyễn Thúc Thành)</li>
            </ul>
          </div>
          <div>
            <div class="text-white font-bold text-sm mb-2">LIÊN KẾT NHANH CỔNG CHÍNH THỐNG</div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <a href="https://hue.gov.vn" target="_blank" class="hover:text-white flex items-center gap-1">› Cổng TTĐT TP Huế</a>
              <a href="https://huongthuy.hue.gov.vn" target="_blank" class="hover:text-white flex items-center gap-1">› UBND P. Hương Thủy</a>
              <a href="https://dichvucong.gov.vn" target="_blank" class="hover:text-white flex items-center gap-1">› Dịch vụ công QG</a>
              <a href="https://vanban.chinhphu.vn" target="_blank" class="hover:text-white flex items-center gap-1">› Văn bản Chính phủ</a>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-800 text-[10px] text-gray-500">
              Hệ thống Hành chính số Chuẩn mực • Bản quyền © 2026 TDP Lương Hậu
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // ==================== 4. TRANG CHỦ MỚI (/ ) ====================
  function renderHomePage() {
    const news = window.LHStore.getNews();
    const docs = window.LHStore.getDocuments();
    const notices = window.LHStore.getNotices();
    const cadres = window.LHStore.getCadres().slice(0, 5);

    const featuredNews = news.find(n => n.featured) || news[0];
    const subNews = news.filter(n => n !== featuredNews).slice(0, 4);

    return `
      ${renderPublicHeader("/")}
      <main class="max-w-6xl mx-auto px-4 py-6 space-y-8 fade-in">
        
        <!-- KHỐI 1: HERO & TIN NỔI BẬT + THÔNG BÁO KHẨN -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            <div class="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white p-6 flex flex-col justify-end min-h-[220px]">
              <span class="px-2.5 py-1 bg-red-600 text-white rounded text-[10.5px] font-black w-max uppercase tracking-wider mb-2">TIÊU ĐIỂM TDP LƯƠNG HẬU</span>
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
                  <i class="fa-solid fa-bullhorn text-red-600"></i> BẢNG THÔNG BÁO MỚI
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
                <i class="fa-solid fa-headset text-blue-700"></i> Hỗ trợ công dân số Hue-S
              </div>
              <div class="text-[11px] text-gray-600">Phản ánh hiện trường, cấp cứu y tế, hồ sơ cư trú liên hệ trực tiếp Ban cán bộ.</div>
            </div>
          </div>
        </section>

        <!-- KHỐI 2: VĂN BẢN 3 CẤP MỚI NHẤT -->
        <section class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <div>
              <h2 class="text-base sm:text-lg font-black text-gray-900 uppercase flex items-center gap-2">
                <i class="fa-solid fa-file-shield text-red-700"></i> VĂN BẢN 3 CẤP & KẾ HOẠCH ĐIỀU HÀNH
              </h2>
              <div class="text-xs text-gray-500">Chính phủ • Thành phố Huế • Phường Hương Thủy</div>
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
                  ` : `<span class="text-gray-400 text-[10px]">Chưa có PDF</span>`}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- KHỐI 3: TIN TỨC HOẠT ĐỘNG CƠ SỞ -->
        <section class="space-y-4">
          <div class="flex items-center justify-between border-b pb-2">
            <h2 class="text-base sm:text-lg font-black text-gray-900 uppercase flex items-center gap-2">
              <i class="fa-solid fa-newspaper text-blue-700"></i> TIN TỨC HOẠT ĐỘNG CƠ SỞ
            </h2>
            <button onclick="window.navigateTo('/tin-tuc')" class="text-xs text-blue-600 font-bold hover:underline">Xem thêm tin →</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${subNews.map(n => `
              <div class="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm flex flex-col justify-between hover:shadow-md transition cursor-pointer" onclick="window.navigateTo('/tin-tuc/${n.slug}')">
                <div>
                  <div class="w-full h-24 bg-gradient-to-br from-blue-900 to-indigo-800 rounded-lg flex flex-col items-center justify-center text-white mb-2 text-center p-2">
                    <i class="fa-solid fa-landmark text-yellow-300 text-lg mb-0.5"></i>
                    <span class="text-[9.5px] font-black uppercase tracking-wider text-yellow-200">${n.category}</span>
                  </div>
                  <div class="text-[10px] text-blue-600 font-bold">📅 ${n.date}</div>
                  <h4 class="font-bold text-xs text-gray-900 hover:text-red-700 line-clamp-2 mt-1 leading-snug">${n.title}</h4>
                </div>
                <div class="text-[10.5px] text-gray-400 mt-2 pt-2 border-t font-medium">✍ ${n.author}</div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- KHỐI 4: DANH SÁCH 5 CÁN BỘ CHỦ CHỐT TDP LƯƠNG HẬU -->
        <section class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b pb-2">
            <div>
              <h2 class="text-base sm:text-lg font-black text-red-800 uppercase flex items-center gap-2">
                <i class="fa-solid fa-users text-red-700"></i> BAN CÁN BỘ TỔ DÂN PHỐ LƯƠNG HẬU
              </h2>
              <div class="text-xs text-gray-500">Cơ cấu điều hành và phụ trách các đoàn thể nhân dân</div>
            </div>
            <button onclick="window.navigateTo('/to-dan-pho')" class="text-xs text-blue-600 font-bold hover:underline">Xem cả 10 Đ/c →</button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
            ${cadres.map(c => `
              <div class="p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-between">
                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-[#991b1b] to-[#b91c1c] text-white border-2 border-yellow-400 flex flex-col items-center justify-center shadow mb-2">
                  <i class="fa-solid fa-user-tie text-yellow-300 text-base"></i>
                  <span class="text-[8px] font-black text-yellow-200 uppercase">TDP</span>
                </div>
                <div class="font-bold text-xs text-gray-900">${c.name}</div>
                <div class="text-[10.5px] text-red-700 font-semibold mt-0.5 line-clamp-2">${c.role}</div>
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

  // ==================== 5. CHUYÊN TRANG TIN TỨC (/tin-tuc & /tin-tuc/[slug]) ====================
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

  // ==================== 6. CHUYÊN TRANG THÔNG BÁO (/thong-bao) ====================
  function renderNoticesPage() {
    const notices = window.LHStore.getNotices();
    return `
      ${renderPublicHeader("/thong-bao")}
      <main class="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-bullhorn text-red-700"></i> BẢNG THÔNG BÁO CỦA TỔ DÂN PHỐ
          </h1>
          <p class="text-xs text-gray-500 mt-1">Thông báo lịch họp, tiếp dân, vệ sinh môi trường, y tế cơ sở</p>
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

  // ==================== 7. CHUYÊN TRANG VĂN BẢN 3 CẤP (/van-ban) ====================
  function renderDocumentsPage(targetId = null) {
    const docs = window.LHStore.getDocuments();

    if (targetId) {
      const doc = window.LHStore.getDocumentById(targetId) || docs[0];
      return `
        ${renderPublicHeader("/van-ban")}
        <main class="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <button onclick="window.navigateTo('/van-ban')" class="text-xs text-blue-700 font-bold hover:underline mb-2 flex items-center gap-1">
              ← Quay lại danh mục văn bản
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
              <i class="fa-solid fa-file-lines text-red-700"></i> HỆ THỐNG VĂN BẢN PHÁP LUẬT 3 CẤP
            </h1>
            <p class="text-xs text-gray-500 mt-1">Cơ sở dữ liệu văn bản điều hành, kế hoạch đất đai, chuyển đổi số TDP Lương Hậu</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <input type="text" id="doc-search-kw" placeholder="Tìm số hiệu, tên văn bản..." class="sm:col-span-2 gov-input">
            <select id="doc-filter-level" class="gov-input">
              <option value="">-- Tất cả 3 Cấp --</option>
              <option value="TRUNG ƯƠNG">Trung ương</option>
              <option value="THÀNH PHỐ HUẾ">Thành phố Huế</option>
              <option value="PHƯỜNG HƯƠNG THỦY">Phường Hương Thủy</option>
            </select>
            <select id="doc-filter-type" class="gov-input">
              <option value="">-- Loại văn bản --</option>
              <option value="Kế hoạch">Kế hoạch</option>
              <option value="Nghị quyết">Nghị quyết</option>
              <option value="Thông báo">Thông báo</option>
              <option value="Quyết định">Quyết định</option>
            </select>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-gray-100 text-gray-700 font-bold border-b border-gray-300">
                  <th class="p-3 w-36">Số / Ký hiệu</th>
                  <th class="p-3">Tên trích yếu văn bản</th>
                  <th class="p-3 w-32">Cơ quan</th>
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
                        <button onclick="window.openPdfModal('${d.code}', '${d.pdfUrl}')" class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-[10.5px]">
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

  // ==================== 8. CHUYÊN TRANG TỔ DÂN PHỐ (/to-dan-pho) ====================
  function renderCadresPage() {
    const cadres = window.LHStore.getCadres();
    return `
      ${renderPublicHeader("/to-dan-pho")}
      <main class="max-w-6xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-users text-red-700"></i> BAN CÁN BỘ TỔ DÂN PHỐ LƯƠNG HẬU (10 ĐỒNG CHÍ)
          </h1>
          <p class="text-xs text-gray-500 mt-1">Cơ cấu tổ chức, ban ngành, đoàn thể nhân dân và đường dây nóng hỗ trợ công dân</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${cadres.map((c, i) => `
            <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-3.5 hover:shadow-md transition">
              <div class="w-12 h-12 rounded-full bg-red-700 text-yellow-300 border-2 border-yellow-400 flex items-center justify-center font-black flex-shrink-0 text-sm shadow">
                ${i + 1}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-black text-sm text-gray-900">${c.name}</div>
                <div class="text-xs font-bold text-red-700 mt-0.5">${c.role}</div>
                <div class="text-[11.5px] text-gray-500 mt-1">Nhiệm vụ: ${c.note}</div>
                <div class="mt-2.5">
                  <a href="tel:${c.phone.replace(/[^0-9]/g, '')}" class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-100 transition">
                    <i class="fa-solid fa-phone text-xs"></i> ${c.phone}
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 9. CHUYÊN TRANG LỊCH HOẠT ĐỘNG (/lich-hoat-dong) ====================
  function renderSchedulePage() {
    return `
      ${renderPublicHeader("/lich-hoat-dong")}
      <main class="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-calendar-days text-red-700"></i> LỊCH HOẠT ĐỘNG & SỰ KIỆN CƠ SỞ
          </h1>
          <p class="text-xs text-gray-500 mt-1">Kế hoạch công tác tháng 9 và quý IV năm 2026 tại TDP Lương Hậu</p>
        </div>

        <div class="space-y-4">
          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
            <div class="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3 text-center min-w-[70px]">
              <div class="text-xs font-bold uppercase">Tháng 9</div>
              <div class="text-2xl font-black">03</div>
            </div>
            <div>
              <span class="px-2 py-0.5 bg-red-100 text-red-800 text-[10.5px] font-bold rounded">CHI BỘ ĐẢNG</span>
              <h3 class="font-bold text-sm text-gray-900 mt-1">Họp Chi bộ định kỳ hằng tháng</h3>
              <p class="text-xs text-gray-600 mt-1">Thời gian: 19h00 ngày 03 hằng tháng tại Nhà Sinh hoạt cộng đồng (83 Thái Thuận). Đánh giá công tác lãnh đạo và phương hướng tháng mới.</p>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
            <div class="bg-green-50 text-green-800 border border-green-200 rounded-xl p-3 text-center min-w-[70px]">
              <div class="text-xs font-bold uppercase">Tháng 9</div>
              <div class="text-2xl font-black">13</div>
            </div>
            <div>
              <span class="px-2 py-0.5 bg-green-100 text-green-800 text-[10.5px] font-bold rounded">MÔI TRƯỜNG</span>
              <h3 class="font-bold text-sm text-gray-900 mt-1">Ra quân "Ngày Chủ nhật xanh" đợt 4/2026</h3>
              <p class="text-xs text-gray-600 mt-1">Thời gian: 06h30 Chủ nhật ngày 13/09/2026. Địa điểm: Toàn tuyến đường Thái Thuận và các kiệt ngõ TDP Lương Hậu.</p>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
            <div class="bg-blue-50 text-blue-800 border border-blue-200 rounded-xl p-3 text-center min-w-[70px]">
              <div class="text-xs font-bold uppercase">Tháng 9</div>
              <div class="text-2xl font-black">23-24</div>
            </div>
            <div>
              <span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10.5px] font-bold rounded">Y TẾ CỘNG ĐỒNG</span>
              <h3 class="font-bold text-sm text-gray-900 mt-1">Lịch tiêm chủng mở rộng Trạm Y tế Phường Hương Thủy KV3</h3>
              <p class="text-xs text-gray-600 mt-1">Tiêm vắc xin cho trẻ em trong độ tuổi theo chương trình tiêm chủng mở rộng quốc gia.</p>
            </div>
          </div>
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 10. CHUYÊN TRANG TÌM KIẾM (/tim-kiem) ====================
  function renderSearchPage() {
    return `
      ${renderPublicHeader("/tim-kiem")}
      <main class="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-magnifying-glass text-red-700"></i> TRA CỨU THÔNG MINH TOÀN DIỆN
          </h1>
          <p class="text-xs text-gray-500 mt-1">Tìm kiếm tức thì tin tức, văn bản 3 cấp, biểu mẫu và thông báo TDP Lương Hậu</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div class="flex gap-2">
            <input type="text" id="global-search-input" placeholder="Nhập từ khóa tìm kiếm (Ví dụ: đất đai, 333, chủ nhật xanh, tiêm chủng)..." class="gov-input font-semibold text-sm">
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

  // ==================== 11. CHUYÊN TRANG LIÊN HỆ & PHẢN ÁNH (/lien-he) ====================
  function renderContactPage() {
    return `
      ${renderPublicHeader("/lien-he")}
      <main class="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-red-800 uppercase flex items-center gap-2">
            <i class="fa-solid fa-comments text-red-700"></i> LIÊN HỆ & GỬI PHẢN ÁNH HIỆN TRƯỜNG
          </h1>
          <p class="text-xs text-gray-500 mt-1">Tiếp nhận ý kiến đóng góp, phản ánh trật tự đô thị, kiến nghị của công dân</p>
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
            <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900">
              <strong>Hotline Tổ trưởng:</strong> 0965.712.812 (Đ/c Hồ Văn Mão)
            </div>
          </div>
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== 12. TRANG NỘI BỘ CHI BỘ (/noi-bo) ====================
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
              <i class="fa-solid fa-calendar-check w-4 text-center"></i> SINH HOẠT CHI BỘ
            </a>
            <a href="/noi-bo/nghi-quyet" onclick="event.preventDefault(); window.navigateTo('/noi-bo/nghi-quyet')" class="flex items-center gap-2.5 p-2.5 rounded-lg transition ${activeNav === 'nghi-quyet' ? 'bg-red-800 text-yellow-300 shadow' : 'text-gray-300 hover:bg-slate-900'}">
              <i class="fa-solid fa-scroll w-4 text-center"></i> NGHỊ QUYẾT & KẾ HOẠCH
            </a>
            <a href="/noi-bo/phan-cong" onclick="event.preventDefault(); window.navigateTo('/noi-bo/phan-cong')" class="flex items-center gap-2.5 p-2.5 rounded-lg transition ${activeNav === 'phan-cong' ? 'bg-red-800 text-yellow-300 shadow' : 'text-gray-300 hover:bg-slate-900'}">
              <i class="fa-solid fa-sitemap w-4 text-center"></i> PHÂN CÔNG NHIỆM VỤ
            </a>
            <a href="/noi-bo/tai-lieu" onclick="event.preventDefault(); window.navigateTo('/noi-bo/tai-lieu')" class="flex items-center gap-2.5 p-2.5 rounded-lg transition ${activeNav === 'tai-lieu' ? 'bg-red-800 text-yellow-300 shadow' : 'text-gray-300 hover:bg-slate-900'}">
              <i class="fa-solid fa-folder-open w-4 text-center"></i> KHO TÀI LIỆU CHI BỘ
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

  function renderSecretaryDashboard() {
    const party = window.LHStore.getPartyMembers();
    const total = party.length;
    const official = party.filter(p => p.status === "Chính thức").length;
    const reserve = party.filter(p => p.status === "Dự bị").length;

    return `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
          <div>
            <h2 class="text-lg sm:text-xl font-black text-yellow-300 uppercase">DASHBOARD BÍ THƯ CHI BỘ LƯƠNG HẬU</h2>
            <div class="text-xs text-gray-400">Báo cáo tình hình tổ chức, sinh hoạt định kỳ và công tác Đảng quý IV/2026</div>
          </div>
          <span class="px-3 py-1 bg-red-900/60 border border-red-500/40 text-yellow-300 text-xs font-bold rounded-lg self-start sm:self-auto">
            Kỳ sinh hoạt: Ngày 03 hằng tháng
          </span>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div class="text-xs text-gray-400 font-bold uppercase">Tổng số Đảng viên</div>
            <div class="text-2xl sm:text-3xl font-black text-yellow-400 mt-1">${total} <span class="text-xs font-normal text-gray-400">đồng chí</span></div>
            <div class="text-[11px] text-green-400 mt-1">Chính thức: ${official} • Dự bị: ${reserve}</div>
          </div>
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div class="text-xs text-gray-400 font-bold uppercase">Tổ chức Đảng</div>
            <div class="text-2xl sm:text-3xl font-black text-blue-400 mt-1">02 <span class="text-xs font-normal text-gray-400">Tổ Đảng</span></div>
            <div class="text-[11px] text-gray-400 mt-1">Tổ 1: 11 đ/c • Tổ 2: 11 đ/c</div>
          </div>
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div class="text-xs text-gray-400 font-bold uppercase">Nghị quyết Chi bộ</div>
            <div class="text-2xl sm:text-3xl font-black text-red-400 mt-1">04 <span class="text-xs font-normal text-gray-400">chuyên đề</span></div>
            <div class="text-[11px] text-gray-400 mt-1">Đã ban hành và triển khai 100%</div>
          </div>
          <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div class="text-xs text-gray-400 font-bold uppercase">Việc cần xử lý gấp</div>
            <div class="text-2xl sm:text-3xl font-black text-amber-400 mt-1">02 <span class="text-xs font-normal text-gray-400">nhiệm vụ</span></div>
            <div class="text-[11px] text-amber-300 mt-1">Trực PCTT bão lũ & Kế hoạch 333</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
            <h3 class="font-bold text-sm text-yellow-300 uppercase flex items-center gap-2">
              <i class="fa-solid fa-list-check"></i> NHIỆM VỤ TRỌNG TÂM CHI ỦY QUÝ IV/2026
            </h3>
            <div class="space-y-2.5 text-xs text-gray-300">
              <div class="p-2.5 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded bg-red-900 text-yellow-300 flex items-center justify-center font-black flex-shrink-0 text-[10px]">1</span>
                <div>
                  <div class="font-bold text-white">Chỉ đạo rà soát hiện trạng đất đai theo KH 333 của TP Huế</div>
                  <div class="text-[11px] text-gray-400 mt-0.5">Phân công Đ/c Nguyễn Trọng Nghĩa phối hợp cán bộ địa chính phường Hương Thủy rà soát danh sách cấp đổi GCN.</div>
                </div>
              </div>
              <div class="p-2.5 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded bg-red-900 text-yellow-300 flex items-center justify-center font-black flex-shrink-0 text-[10px]">2</span>
                <div>
                  <div class="font-bold text-white">Đảm bảo trực ban phòng chống thiên tai tại cơ sở</div>
                  <div class="text-[11px] text-gray-400 mt-0.5">Chi ủy chỉ đạo Tổ ANTT cơ sở do Đ/c Nguyễn Thúc Thành chỉ huy duy trì tuần tra, ứng cứu kịp thời khi nước dâng.</div>
                </div>
              </div>
              <div class="p-2.5 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-start gap-2.5">
                <span class="w-5 h-5 rounded bg-red-900 text-yellow-300 flex items-center justify-center font-black flex-shrink-0 text-[10px]">3</span>
                <div>
                  <div class="font-bold text-white">Công tác phát triển Đảng viên mới năm 2026</div>
                  <div class="text-[11px] text-gray-400 mt-0.5">Tiếp tục bồi dưỡng 02 đồng chí dự bị (Vũ Văn Hải, Trịnh Thị Nga) chuẩn bị chuyển Đảng chính thức đúng thời hạn.</div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
            <h3 class="font-bold text-sm text-yellow-300 uppercase flex items-center gap-2">
              <i class="fa-solid fa-users-viewfinder"></i> CƠ CẤU CẤP ỦY CHI BỘ LƯƠNG HẬU
            </h3>
            <div class="divide-y divide-slate-700 text-xs">
              <div class="py-2.5 flex justify-between items-center">
                <div>
                  <div class="font-bold text-white">Đ/c Hồ Văn Mão</div>
                  <div class="text-[11px] text-gray-400">Sinh: 02/02/1989 • Vào Đảng: 02/02/2012</div>
                </div>
                <span class="px-2.5 py-1 bg-red-900 text-yellow-300 rounded font-black text-[11px]">Bí thư Chi bộ</span>
              </div>
              <div class="py-2.5 flex justify-between items-center">
                <div>
                  <div class="font-bold text-white">Đ/c Nguyễn Trọng Nghĩa</div>
                  <div class="text-[11px] text-gray-400">Sinh: 15/08/1980 • Vào Đảng: 19/05/2014</div>
                </div>
                <span class="px-2.5 py-1 bg-blue-900 text-blue-200 rounded font-black text-[11px]">Phó Bí thư Chi bộ</span>
              </div>
              <div class="py-2.5 flex justify-between items-center">
                <div>
                  <div class="font-bold text-white">Đ/c Hoàng Hữu Rớt</div>
                  <div class="text-[11px] text-gray-400">Sinh: 10/11/1978 • Vào Đảng: 03/02/2008</div>
                </div>
                <span class="px-2.5 py-1 bg-slate-700 text-gray-200 rounded font-black text-[11px]">Chi ủy viên</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPartyMembersPage() {
    const party = window.LHStore.getPartyMembers();
    return `
      <div class="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
          <div>
            <h2 class="text-base sm:text-lg font-black text-yellow-300 uppercase">DANH SÁCH 22 ĐẢNG VIÊN CHI BỘ LƯƠNG HẬU</h2>
            <div class="text-xs text-gray-400">Hồ sơ trích ngang quản lý nội bộ Chi bộ nhiệm kỳ 2025 - 2027</div>
          </div>
          <span class="text-xs text-gray-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">Tổng số: 22 đồng chí</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-900 text-yellow-300 font-bold border-b border-slate-700">
                <th class="p-3 w-14">STT</th>
                <th class="p-3">Họ và Tên</th>
                <th class="p-3 w-28">Ngày sinh</th>
                <th class="p-3 w-36">Chức danh Chi bộ</th>
                <th class="p-3 w-32">Nhiệm vụ phân công</th>
                <th class="p-3 w-28">Tổ Đảng</th>
                <th class="p-3 w-28">Tình trạng</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700 text-gray-200">
              ${party.map((p, idx) => `
                <tr class="hover:bg-slate-700/50 transition">
                  <td class="p-3 font-bold text-gray-400 text-center">${idx + 1}</td>
                  <td class="p-3 font-bold text-white">${p.name}</td>
                  <td class="p-3 text-gray-300">${p.birth}</td>
                  <td class="p-3 text-yellow-300 font-semibold">${p.role}</td>
                  <td class="p-3 text-gray-300">${p.position}</td>
                  <td class="p-3 text-blue-300">${p.group}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded text-[10.5px] font-bold ${p.status === 'Chính thức' ? 'bg-green-900 text-green-300' : 'bg-amber-900 text-amber-300'}">
                      ${p.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderGenericInternalPage(title, desc, bodyHtml, activeNav) {
    return renderInternalLayout(`
      <div class="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-4">
        <div class="border-b border-slate-700 pb-3">
          <h2 class="text-base sm:text-lg font-black text-yellow-300 uppercase">${title}</h2>
          <div class="text-xs text-gray-400">${desc}</div>
        </div>
        <div class="text-xs text-gray-300 space-y-3 leading-relaxed">
          ${bodyHtml}
        </div>
      </div>
    `, activeNav);
  }

  // ==================== 13. CMS QUẢN TRỊ TOÀN DIỆN (/quan-tri) ====================
  function renderAdminCms(sub = "dashboard") {
    const user = window.LHAuth.getUser();
    const news = window.LHStore.getNews();
    const docs = window.LHStore.getDocuments();
    const notices = window.LHStore.getNotices();
    const logs = window.LHStore.getAuditLogs();

    return `
      <div class="min-h-screen bg-gray-100 text-gray-800 flex flex-col font-sans fade-in">
        <header class="bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow sticky top-0 z-40">
          <div class="flex items-center gap-3">
            <span class="px-2.5 py-1 bg-red-600 font-black rounded text-xs">CMS V3</span>
            <div>
              <h1 class="font-black text-sm uppercase">HỆ THỐNG QUẢN TRỊ CỔNG THÔNG TIN SỐ LƯƠNG HẬU</h1>
              <div class="text-[10.5px] text-gray-400">Trực ban biên tập & Quản lý cơ sở dữ liệu số</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-300 mr-2">${user ? user.name : 'Admin'}</span>
            <button onclick="window.navigateTo('/noi-bo/dashboard')" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded">
              Vào Chi bộ
            </button>
            <button onclick="window.navigateTo('/')" class="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded">
              Xem trang chủ
            </button>
          </div>
        </header>

        <div class="flex-1 flex flex-col md:flex-row">
          <aside class="w-full md:w-60 bg-white border-r border-gray-200 p-3 space-y-1 text-xs font-bold flex-shrink-0">
            <button onclick="window.navigateTo('/quan-tri')" class="w-full text-left p-2.5 rounded-lg ${sub === 'dashboard' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}">
              <i class="fa-solid fa-gauge mr-2"></i> Tổng quan CMS
            </button>
            <button onclick="window.navigateTo('/quan-tri/tin-tuc')" class="w-full text-left p-2.5 rounded-lg ${sub === 'tin-tuc' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}">
              <i class="fa-solid fa-newspaper mr-2"></i> Quản lý Tin tức (${news.length})
            </button>
            <button onclick="window.navigateTo('/quan-tri/van-ban')" class="w-full text-left p-2.5 rounded-lg ${sub === 'van-ban' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}">
              <i class="fa-solid fa-file-lines mr-2"></i> Quản lý Văn bản (${docs.length})
            </button>
            <button onclick="window.navigateTo('/quan-tri/thong-bao')" class="w-full text-left p-2.5 rounded-lg ${sub === 'thong-bao' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}">
              <i class="fa-solid fa-bullhorn mr-2"></i> Quản lý Thông báo (${notices.length})
            </button>
            <button onclick="window.navigateTo('/quan-tri/audit-log')" class="w-full text-left p-2.5 rounded-lg ${sub === 'audit-log' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}">
              <i class="fa-solid fa-clock-rotate-left mr-2"></i> Nhật ký hệ thống
            </button>
          </aside>

          <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
            ${sub === 'tin-tuc' ? renderCmsNewsManage() :
              sub === 'van-ban' ? renderCmsDocsManage() :
              sub === 'thong-bao' ? renderCmsNoticesManage() :
              sub === 'audit-log' ? renderCmsAuditLogs() :
              renderCmsOverview()}
          </main>
        </div>
      </div>
    `;
  }

  function renderCmsOverview() {
    const news = window.LHStore.getNews();
    const docs = window.LHStore.getDocuments();
    const members = window.LHStore.getPartyMembers();
    const logs = window.LHStore.getAuditLogs();

    return `
      <div class="space-y-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-xs text-gray-500 font-bold uppercase">Tin tức công khai</div>
            <div class="text-3xl font-black text-blue-700 mt-1">${news.length}</div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-xs text-gray-500 font-bold uppercase">Văn bản 3 cấp</div>
            <div class="text-3xl font-black text-red-700 mt-1">${docs.length}</div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-xs text-gray-500 font-bold uppercase">Đảng viên quản lý</div>
            <div class="text-3xl font-black text-green-700 mt-1">${members.length}</div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div class="text-xs text-gray-500 font-bold uppercase">Lượt Audit Log</div>
            <div class="text-3xl font-black text-purple-700 mt-1">${logs.length}</div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h3 class="font-bold text-sm text-gray-900 uppercase">HÀNH ĐỘNG NHANH CỦA BAN BIÊN TẬP</h3>
          <div class="flex flex-wrap gap-3">
            <button onclick="window.navigateTo('/quan-tri/tin-tuc')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow">
              <i class="fa-solid fa-plus"></i> Đăng bài tin tức mới
            </button>
            <button onclick="window.navigateTo('/quan-tri/van-ban')" class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow">
              <i class="fa-solid fa-file-arrow-up"></i> Thêm văn bản điều hành
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderCmsNewsManage() {
    const news = window.LHStore.getNews();
    return `
      <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <div>
            <h2 class="font-black text-base uppercase text-gray-900">QUẢN LÝ TIN TỨC & BÀI VIẾT CƠ SỞ</h2>
            <div class="text-xs text-gray-500">Soạn thảo, phê duyệt, xuất bản không cần can thiệp code</div>
          </div>
          <button onclick="showCreateNewsModal()" class="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow">
            <i class="fa-solid fa-plus"></i> Thêm tin tức mới
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-gray-100 font-bold border-b border-gray-300">
                <th class="p-2.5">Tiêu đề bài viết</th>
                <th class="p-2.5 w-32">Chuyên mục</th>
                <th class="p-2.5 w-28">Ngày đăng</th>
                <th class="p-2.5 w-32">Tác giả</th>
                <th class="p-2.5 w-24 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${news.map(n => `
                <tr class="hover:bg-gray-50">
                  <td class="p-2.5 font-bold text-gray-900">${n.title}</td>
                  <td class="p-2.5 text-red-700 font-semibold">${n.category}</td>
                  <td class="p-2.5 text-gray-500">${n.date}</td>
                  <td class="p-2.5 text-gray-600">${n.author}</td>
                  <td class="p-2.5 text-center">
                    <button onclick="deleteNewsItem('${n.slug}')" class="text-red-600 hover:text-red-800 font-bold p-1" title="Xóa">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderCmsDocsManage() {
    const docs = window.LHStore.getDocuments();
    return `
      <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <div>
            <h2 class="font-black text-base uppercase text-gray-900">QUẢN LÝ VĂN BẢN 3 CẤP</h2>
            <div class="text-xs text-gray-500">Cập nhật kế hoạch, quyết định, biểu mẫu công dân</div>
          </div>
          <button onclick="showCreateDocModal()" class="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow">
            <i class="fa-solid fa-plus"></i> Thêm văn bản mới
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-gray-100 font-bold border-b border-gray-300">
                <th class="p-2.5 w-32">Số / Ký hiệu</th>
                <th class="p-2.5">Trích yếu</th>
                <th class="p-2.5 w-32">Cơ quan</th>
                <th class="p-2.5 w-24">Cấp</th>
                <th class="p-2.5 w-20 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${docs.map(d => `
                <tr class="hover:bg-gray-50">
                  <td class="p-2.5 font-bold text-red-800">${d.code}</td>
                  <td class="p-2.5 font-semibold text-gray-900">${d.title}</td>
                  <td class="p-2.5 text-gray-600">${d.agency}</td>
                  <td class="p-2.5 font-bold text-[11px]">${d.level}</td>
                  <td class="p-2.5 text-center">
                    <button onclick="deleteDocItem('${d.id}')" class="text-red-600 hover:text-red-800 font-bold p-1" title="Xóa">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderCmsNoticesManage() {
    const notices = window.LHStore.getNotices();
    return `
      <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <div>
            <h2 class="font-black text-base uppercase text-gray-900">QUẢN LÝ THÔNG BÁO CƠ SỞ</h2>
            <div class="text-xs text-gray-500">Phát hành và quản lý thông báo của Chi bộ & Ban cán bộ</div>
          </div>
          <button onclick="showCreateNoticeModal()" class="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow">
            <i class="fa-solid fa-plus"></i> Soạn thông báo mới
          </button>
        </div>

        <div class="divide-y divide-gray-200">
          ${notices.map(n => `
            <div class="py-3 flex items-center justify-between gap-3 text-xs">
              <div>
                <div class="font-bold text-gray-900">${n.title}</div>
                <div class="text-gray-500 mt-0.5">Ngày: ${n.date} • Mức độ: <span class="font-bold ${n.priority === 'Khẩn' ? 'text-red-700' : 'text-blue-700'}">${n.priority || 'Thường'}</span></div>
              </div>
              <button onclick="deleteNoticeItem('${n.slug}')" class="text-red-600 hover:text-red-800 font-bold p-1" title="Xóa">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderCmsAuditLogs() {
    const logs = window.LHStore.getAuditLogs();
    return `
      <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h2 class="font-black text-base uppercase text-gray-900 border-b pb-2">NHẬT KÝ HỆ THỐNG (AUDIT LOG)</h2>
        <div class="space-y-2">
          ${logs.map(l => `
            <div class="p-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-gray-800 mr-2">${l.action}</span>
                <span class="text-gray-500">Bởi: <strong>${l.user}</strong></span>
              </div>
              <span class="text-gray-400 font-mono text-[11px]">${l.time}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==================== 14. TRANG ĐĂNG NHẬP NỘI BỘ (/noi-bo/dang-nhap) ====================
  function renderLoginPage() {
    return `
      ${renderPublicHeader("/noi-bo/dang-nhap")}
      <main class="max-w-md mx-auto px-4 py-12 fade-in">
        <div class="bg-white rounded-2xl border-2 border-red-200 p-6 shadow-xl space-y-5 text-center">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-[#991b1b] to-[#b91c1c] text-yellow-300 border-2 border-yellow-400 flex items-center justify-center mx-auto text-2xl shadow">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <h1 class="text-lg font-black text-red-800 uppercase">XÁC THỰC ĐẢNG VIÊN NỘI BỘ</h1>
            <p class="text-xs text-gray-500 mt-1">Đối soát danh sách 22 đồng chí Chi bộ TDP Lương Hậu</p>
          </div>

          <form id="party-login-form" class="space-y-3 text-left">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Họ và tên Đảng viên</label>
              <input type="text" id="login-name" required placeholder="Ví dụ: Hồ Văn Mão" class="gov-input font-bold">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Ngày tháng năm sinh / Năm sinh</label>
              <input type="text" id="login-birth" required placeholder="Ví dụ: 02/02/1989 hoặc 1989" class="gov-input">
            </div>
            <div id="login-error-msg" class="text-xs text-red-600 font-bold hidden p-2 bg-red-50 rounded border border-red-200"></div>
            <button type="submit" class="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase rounded-lg shadow transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-right-to-bracket"></i> ĐĂNG NHẬP BÀN LÀM VIỆC NỘI BỘ
            </button>
          </form>

          <div class="pt-3 border-t border-gray-100 text-[11px] text-gray-400">
            Bảo mật nội bộ cấp ủy • Nếu gặp vướng mắc liên hệ Tổ trưởng (0965.712.812)
          </div>
        </div>
      </main>
      ${renderPublicFooter()}
    `;
  }

  // ==================== ROUTE DISPATCHER ====================
  function renderRoute(rawPath) {
    const cleanPath = rawPath.split("?")[0].split("#")[0] || "/";
    
    // Kiểm tra Auth Guard
    const guard = window.LHAuth.checkRouteGuard(cleanPath);
    if (!guard.allowed) {
      navigateTo(guard.redirect);
      return;
    }

    window.scrollTo(0, 0);

    // 1. PUBLIC ROUTES
    if (cleanPath === "/" || cleanPath === "/index.html") {
      appRoot.innerHTML = renderHomePage();
    } else if (cleanPath === "/tin-tuc") {
      appRoot.innerHTML = renderNewsListPage();
    } else if (cleanPath.startsWith("/tin-tuc/")) {
      const slug = cleanPath.replace("/tin-tuc/", "");
      appRoot.innerHTML = renderNewsDetailPage(slug);
    } else if (cleanPath === "/thong-bao") {
      appRoot.innerHTML = renderNoticesPage();
    } else if (cleanPath.startsWith("/thong-bao/")) {
      const slug = cleanPath.replace("/thong-bao/", "");
      appRoot.innerHTML = renderNoticesPage();
    } else if (cleanPath === "/van-ban") {
      appRoot.innerHTML = renderDocumentsPage();
    } else if (cleanPath.startsWith("/van-ban/")) {
      const id = cleanPath.replace("/van-ban/", "");
      appRoot.innerHTML = renderDocumentsPage(id);
    } else if (cleanPath === "/to-dan-pho") {
      appRoot.innerHTML = renderCadresPage();
    } else if (cleanPath === "/lich-hoat-dong") {
      appRoot.innerHTML = renderSchedulePage();
    } else if (cleanPath === "/tim-kiem") {
      appRoot.innerHTML = renderSearchPage();
      setupSearchEvents();
    } else if (cleanPath === "/lien-he") {
      appRoot.innerHTML = renderContactPage();
    }

    // 2. INTERNAL ROUTES (/noi-bo)
    else if (cleanPath === "/noi-bo/dang-nhap") {
      appRoot.innerHTML = renderLoginPage();
      setupLoginForm();
    } else if (cleanPath === "/noi-bo" || cleanPath === "/noi-bo/dashboard") {
      appRoot.innerHTML = renderInternalLayout(renderSecretaryDashboard(), "dashboard");
    } else if (cleanPath === "/noi-bo/chi-bo") {
      appRoot.innerHTML = renderGenericInternalPage("HỒ SƠ CHI BỘ TỔ DÂN PHỐ LƯƠNG HẬU", "Thông tin tổ chức Chi bộ trực thuộc Đảng bộ Phường Hương Thủy", `
        <div class="space-y-3">
          <p><strong>Cấp trên trực tiếp:</strong> Đảng ủy Phường Hương Thủy, Thành phố Huế.</p>
          <p><strong>Cơ cấu:</strong> 01 Bí thư, 01 Phó Bí thư, 01 Chi ủy viên và 19 Đảng viên sinh hoạt tại 02 Tổ Đảng.</p>
          <p><strong>Nhiệm vụ:</strong> Lãnh đạo toàn diện hệ thống chính trị cơ sở, tổ dân phố, các chi hội đoàn thể và phong trào thi đua yêu nước trên địa bàn.</p>
        </div>
      `, "chi-bo");
    } else if (cleanPath === "/noi-bo/dang-vien") {
      appRoot.innerHTML = renderInternalLayout(renderPartyMembersPage(), "dang-vien");
    } else if (cleanPath === "/noi-bo/sinh-hoat") {
      appRoot.innerHTML = renderGenericInternalPage("KẾ HOẠCH & BIÊN BẢN SINH HOẠT ĐỊNH KỲ", "Nội dung chuẩn bị cho kỳ sinh hoạt Chi bộ ngày 03 hằng tháng", `
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
          <div class="font-bold text-yellow-300">Kỳ sinh hoạt thường kỳ tháng 10/2026:</div>
          <p>1. Thông tin thời sự trong nước, tỉnh và thành phố Huế.</p>
          <p>2. Đánh giá việc thực hiện Nghị quyết Chi bộ tháng 9: Công tác PCTT bão lũ và triển khai Kế hoạch 333 về đất đai.</p>
          <p>3. Phổ biến hướng dẫn của Đảng ủy cấp trên và phân công đảng viên phụ trách hộ gia đình.</p>
        </div>
      `, "sinh-hoat");
    } else if (cleanPath === "/noi-bo/nghi-quyet") {
      appRoot.innerHTML = renderGenericInternalPage("NGHỊ QUYẾT & CHUYÊN ĐỀ LÃNH ĐẠO CỦA CHI BỘ", "Các nghị quyết chuyên đề ban hành trong nhiệm kỳ", `
        <div class="space-y-2.5">
          <div class="p-3 bg-slate-900 rounded-xl border border-slate-700">
            <div class="font-bold text-white">Nghị quyết 01-NQ/CB: Lãnh đạo thực hiện phong trào "Ngày Chủ nhật xanh" và phân loại rác tại nguồn.</div>
            <div class="text-[11px] text-gray-400 mt-1">Ban hành: 10/01/2026 • Đang thực hiện hiệu quả.</div>
          </div>
          <div class="p-3 bg-slate-900 rounded-xl border border-slate-700">
            <div class="font-bold text-white">Nghị quyết 02-NQ/CB: Nâng cao năng lực tuần tra giữ vững an ninh trật tự cơ sở.</div>
            <div class="text-[11px] text-gray-400 mt-1">Ban hành: 15/03/2026 • Lực lượng ANTT duy trì nghiêm tuần tra đêm.</div>
          </div>
          <div class="p-3 bg-slate-900 rounded-xl border border-slate-700">
            <div class="font-bold text-white">Nghị quyết 03-NQ/CB: Lãnh đạo chuyển đổi số cộng đồng và triển khai Đề án 06.</div>
            <div class="text-[11px] text-gray-400 mt-1">Ban hành: 02/06/2026 • Phấn đấu 100% người dân cài đặt Hue-S & VNeID.</div>
          </div>
        </div>
      `, "nghi-quyet");
    } else if (cleanPath === "/noi-bo/phan-cong") {
      appRoot.innerHTML = renderGenericInternalPage("PHÂN CÔNG NHIỆM VỤ ĐẢNG VIÊN", "Phân công đảng viên phụ trách hộ gia đình, đoàn thể và tổ tự quản", `
        <div class="space-y-2">
          <p>Đ/c <strong>Hồ Văn Mão</strong>: Phụ trách chung Chi bộ và Ban cán bộ TDP.</p>
          <p>Đ/c <strong>Nguyễn Trọng Nghĩa</strong>: Phụ trách kinh tế, hạ tầng, nông nghiệp và địa chính.</p>
          <p>Đ/c <strong>Hoàng Hữu Rớt</strong>: Phụ trách công tác Mặt trận, dân vận và các đoàn thể.</p>
          <p>Đ/c <strong>Lê Văn Hùng</strong>: Phụ trách Chi hội Cựu chiến binh và phong trào đền ơn đáp nghĩa.</p>
          <p>Đ/c <strong>Võ Thị Lệ</strong>: Phụ trách Chi hội Phụ nữ và vận động nếp sống văn minh đô thị.</p>
        </div>
      `, "phan-cong");
    } else if (cleanPath === "/noi-bo/tai-lieu" || cleanPath === "/noi-bo/van-ban") {
      appRoot.innerHTML = renderGenericInternalPage("KHO TÀI LIỆU & VĂN BẢN ĐẢNG NỘI BỘ", "Tài liệu học tập nghị quyết, mẫu bản kiểm điểm và sổ tay đảng viên", `
        <div class="space-y-2">
          <div class="p-3 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <div class="font-bold text-white">Mẫu phiếu đánh giá chất lượng Đảng viên cuối năm</div>
              <div class="text-[11px] text-gray-400">Định dạng chuẩn Ban Tổ chức Trung ương</div>
            </div>
            <button onclick="alert('Tài liệu đã sẵn sàng trong hồ sơ nội bộ Chi bộ.')" class="px-3 py-1 bg-red-800 text-yellow-300 rounded font-bold text-xs">Tải mẫu</button>
          </div>
          <div class="p-3 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <div class="font-bold text-white">Quy chế hoạt động của Chi bộ TDP Lương Hậu nhiệm kỳ 2025 - 2027</div>
              <div class="text-[11px] text-gray-400">Lưu hành nội bộ Chi bộ</div>
            </div>
            <button onclick="alert('Đang hiển thị bản lưu hành nội bộ.')" class="px-3 py-1 bg-red-800 text-yellow-300 rounded font-bold text-xs">Xem</button>
          </div>
        </div>
      `, "tai-lieu");
    }

    // 3. ADMIN / CMS ROUTES (/quan-tri)
    else if (cleanPath === "/quan-tri") {
      appRoot.innerHTML = renderAdminCms("dashboard");
    } else if (cleanPath === "/quan-tri/tin-tuc") {
      appRoot.innerHTML = renderAdminCms("tin-tuc");
    } else if (cleanPath === "/quan-tri/van-ban") {
      appRoot.innerHTML = renderAdminCms("van-ban");
    } else if (cleanPath === "/quan-tri/thong-bao") {
      appRoot.innerHTML = renderAdminCms("thong-bao");
    } else if (cleanPath === "/quan-tri/audit-log") {
      appRoot.innerHTML = renderAdminCms("audit-log");
    } else {
      appRoot.innerHTML = renderHomePage();
    }

    setupGlobalEvents();
  }

  function setupSearchEvents() {
    const btn = document.getElementById("btn-do-search");
    const inp = document.getElementById("global-search-input");
    const resArea = document.getElementById("search-results-area");
    if (!btn || !inp || !resArea) return;

    const doSearch = () => {
      const kw = inp.value.trim();
      if (!kw) {
        resArea.innerHTML = '<div class="text-xs text-gray-400 italic">Vui lòng nhập từ khóa để tra cứu.</div>';
        return;
      }
      const results = window.LHStore.searchAll(kw);
      let html = '';
      if (results.news.length === 0 && results.documents.length === 0 && results.notices.length === 0) {
        html = '<div class="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">Không tìm thấy kết quả phù hợp với từ khóa "' + kw + '".</div>';
      } else {
        if (results.news.length > 0) {
          html += '<h4 class="font-bold text-xs uppercase text-red-800 border-b pb-1">Tin tức (' + results.news.length + ')</h4><div class="space-y-2">';
          results.news.forEach(n => {
            html += `<div class="p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50" onclick="window.navigateTo('/tin-tuc/${n.slug}')"><div class="font-bold text-xs text-gray-900">${n.title}</div><div class="text-[11px] text-gray-500">${n.date} • ${n.category}</div></div>`;
          });
          html += '</div>';
        }
        if (results.documents.length > 0) {
          html += '<h4 class="font-bold text-xs uppercase text-red-800 border-b pb-1 mt-4">Văn bản 3 cấp (' + results.documents.length + ')</h4><div class="space-y-2">';
          results.documents.forEach(d => {
            html += `<div class="p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50" onclick="window.navigateTo('/van-ban/${d.id}')"><div class="font-bold text-xs text-red-800">${d.code}: ${d.title}</div><div class="text-[11px] text-gray-500">${d.agency} • ${d.level}</div></div>`;
          });
          html += '</div>';
        }
      }
      resArea.innerHTML = html;
    };

    btn.onclick = doSearch;
    inp.onkeypress = (e) => { if (e.key === "Enter") doSearch(); };
  }

  function setupLoginForm() {
    const form = document.getElementById("party-login-form");
    if (!form) return;
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("login-name").value;
      const birth = document.getElementById("login-birth").value;
      const res = window.LHAuth.login(name, birth);
      if (res.success) {
        navigateTo("/noi-bo/dashboard");
      } else {
        const err = document.getElementById("login-error-msg");
        err.innerText = res.message;
        err.classList.remove("hidden");
      }
    };
  }

  function setupGlobalEvents() {
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const drawer = document.getElementById("mobile-drawer");
    const closeBtn = document.getElementById("close-drawer-btn");
    if (mobileBtn && drawer) {
      mobileBtn.onclick = () => drawer.classList.remove("hidden");
    }
    if (closeBtn && drawer) {
      closeBtn.onclick = () => drawer.classList.add("hidden");
    }
  }

  window.closeDrawer = function () {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.add("hidden");
  };

  window.navigateTo = navigateTo;
  window.openPdfModal = openPdfModal;

  window.deleteNewsItem = function(slug) {
    if (confirm("Đồng chí có chắc chắn muốn xóa bản tin này không?")) {
      const user = window.LHAuth.getUser() ? window.LHAuth.getUser().name : "Admin";
      window.LHStore.deleteNews(slug, user);
      renderRoute(window.location.pathname);
    }
  };

  window.deleteDocItem = function(id) {
    if (confirm("Đồng chí có chắc chắn muốn xóa văn bản này không?")) {
      const user = window.LHAuth.getUser() ? window.LHAuth.getUser().name : "Admin";
      window.LHStore.deleteDocument(id, user);
      renderRoute(window.location.pathname);
    }
  };

  window.deleteNoticeItem = function(slug) {
    if (confirm("Đồng chí có chắc chắn muốn xóa thông báo này không?")) {
      const user = window.LHAuth.getUser() ? window.LHAuth.getUser().name : "Admin";
      window.LHStore.deleteNotice(slug, user);
      renderRoute(window.location.pathname);
    }
  };

  window.showCreateNewsModal = function() {
    const title = prompt("Nhập tiêu đề bài viết mới:");
    if (!title) return;
    const cat = prompt("Chuyên mục (VD: Chủ nhật xanh, An ninh trật tự, Y tế):", "Đời sống TDP");
    const content = prompt("Nhập tóm tắt nội dung:");
    const user = window.LHAuth.getUser() ? window.LHAuth.getUser().name : "Ban Biên Tập";
    window.LHStore.addNews({
      title,
      category: cat || "Tin Lương Hậu",
      content: content || "Nội dung chi tiết đang được cập nhật...",
      author: user,
      date: new Date().toLocaleDateString("vi-VN"),
      featured: false
    }, user);
    renderRoute(window.location.pathname);
  };

  window.showCreateDocModal = function() {
    const code = prompt("Số hiệu văn bản (Ví dụ: 88/KH-UBND):");
    if (!code) return;
    const title = prompt("Trích yếu văn bản:");
    const level = prompt("Cấp văn bản (TRUNG ƯƠNG / THÀNH PHỐ HUẾ / PHƯỜNG HƯƠNG THỦY):", "PHƯỜNG HƯƠNG THỦY");
    const user = window.LHAuth.getUser() ? window.LHAuth.getUser().name : "Ban Biên Tập";
    window.LHStore.addDocument({
      code,
      title: title || "Văn bản điều hành",
      agency: "UBND Phường Hương Thủy • TDP Lương Hậu",
      date: new Date().toLocaleDateString("vi-VN"),
      level: level || "PHƯỜNG HƯƠNG THỦY",
      summary: "Nội dung văn bản được lưu hành và áp dụng tại địa bàn Tổ dân phố Lương Hậu."
    }, user);
    renderRoute(window.location.pathname);
  };

  window.showCreateNoticeModal = function() {
    const title = prompt("Nhập tiêu đề thông báo mới:");
    if (!title) return;
    const priority = prompt("Mức độ ưu tiên (Khẩn / Thường):", "Thường");
    const content = prompt("Nội dung thông báo:");
    const user = window.LHAuth.getUser() ? window.LHAuth.getUser().name : "Ban Biên Tập";
    window.LHStore.addNotice({
      title,
      priority: priority || "Thường",
      content: content || "Nội dung thông báo đang được cập nhật...",
      date: new Date().toLocaleDateString("vi-VN")
    }, user);
    renderRoute(window.location.pathname);
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderRoute(window.location.pathname + window.location.hash);
  });
})();
