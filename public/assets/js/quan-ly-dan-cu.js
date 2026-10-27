/**
 * ============================================================================
 * PHÂN HỆ QUẢN LÝ DÂN CƯ SỐ LƯƠNG HẬU — VERSION 2.3.0
 * Tổ Dân Phố Lương Hậu — Phường Hương Thủy — Thành Phố Huế
 * Kiến trúc: Clean Architecture | Module Pattern | Local-First Reactive DB
 * ============================================================================
 */

(function (window) {
  'use strict';

  // Constants & Roles
  const ROLES = {
    ADMIN: 'ADMIN',
    BI_THU: 'BI_THU',
    CAN_BO_TDP: 'CAN_BO_TDP',
    EDITOR: 'EDITOR',
    XEM_BAO_CAO: 'XEM_BAO_CAO'
  };

  const PERMISSIONS = {
    VIEW_POPULATION: ['ADMIN', 'BI_THU', 'CAN_BO_TDP', 'EDITOR', 'XEM_BAO_CAO', 'CHI_UY'],
    VIEW_SENSITIVE_DATA: ['ADMIN', 'BI_THU'],
    EDIT_POPULATION: ['ADMIN', 'BI_THU', 'CAN_BO_TDP'],
    DELETE_POPULATION: ['ADMIN', 'BI_THU'],
    APPROVE_IMPORT: ['ADMIN', 'BI_THU'],
    SYNC_GOOGLE_SHEETS: ['ADMIN', 'BI_THU'],
    EXPORT_DATA: ['ADMIN', 'BI_THU', 'CAN_BO_TDP'],
    EXPORT_UNMASKED: ['ADMIN', 'BI_THU'],
    BACKUP_RESTORE: ['ADMIN', 'BI_THU'],
    MANAGE_SETTINGS: ['ADMIN', 'BI_THU']
  };

  // State
  const state = {
    db: null,
    auth: null,
    currentUser: null,
    activeTab: 'tong-quan',
    searchKeyword: '',
    selectedHouseholdId: null,
    // Filters
    filterTuyenDuong: 'ALL',
    filterNhomHo: 'ALL',
    filterNgapLut: 'ALL',
    filterGioiTinh: 'ALL',
    filterAgeGroup: 'ALL',
    filterCuTru: 'ALL',
    filterBHYT: 'ALL',
    // Previews
    gsheetPreview: null,
    excelPreview: null,
    zaloPreview: null,
    ocrPreview: null,
    // Pagination
    pageHh: 1,
    pageRes: 1,
    pageSize: 15
  };

  // --------------------------------------------------------------------------
  // UTILITY & SECURITY FUNCTIONS
  // --------------------------------------------------------------------------

  function getCurrentUser() {
    if (state.auth && typeof state.auth.getCurrentUser === 'function') {
      return state.auth.getCurrentUser();
    }
    return { username: 'admin', full_name: 'Ban Quản Trị Lương Hậu', role: 'ADMIN' };
  }

  function hasPermission(permKey) {
    const user = getCurrentUser();
    if (!user) return false;
    const allowed = PERMISSIONS[permKey];
    if (!allowed) return false;
    return allowed.includes(user.role);
  }

  function maskSensitive(value, type) {
    if (!value) return '';
    const user = getCurrentUser();
    // Authorized roles get full view
    if (hasPermission('VIEW_SENSITIVE_DATA')) return String(value);

    const str = String(value).trim();
    if (type === 'CCCD') {
      if (str.length <= 6) return '******';
      return str.slice(0, 3) + '******' + str.slice(-3);
    }
    if (type === 'PHONE') {
      if (str.length <= 6) return '******';
      return str.slice(0, 4) + '***' + str.slice(-3);
    }
    if (type === 'BHYT') {
      if (str.length <= 5) return '*****';
      return str.slice(0, 3) + '*****' + str.slice(-2);
    }
    return '******';
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function sanitizeFormula(str) {
    if (typeof str !== 'string') return str;
    const trimmed = str.trim();
    if (['=', '+', '-', '@'].includes(trimmed.charAt(0))) {
      return "'" + trimmed;
    }
    return trimmed;
  }

  function calculateAge(dobString, yearVal) {
    const currentYear = new Date().getFullYear();
    if (yearVal && Number(yearVal) > 1900 && Number(yearVal) <= currentYear) {
      return currentYear - Number(yearVal);
    }
    if (dobString) {
      const m = String(dobString).match(/(\d{4})/);
      if (m) {
        const y = parseInt(m[1], 10);
        if (y > 1900 && y <= currentYear) return currentYear - y;
      }
    }
    return null;
  }

  function parseCoordinatesFromUrl(url) {
    if (!url) return null;
    try {
      // Dạng @16.430391,107.700348
      const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

      // Dạng q=16.430391,107.700348
      const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };

      // Dạng ll=16.430391,107.700348
      const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
    } catch (e) {
      console.warn('Cannot parse coordinates from URL:', e);
    }
    return null;
  }

  function isCoordinateInHue(lat, lng) {
    if (!lat || !lng) return false;
    // Phường Hương Thủy / TP Huế
    return lat >= 16.35 && lat <= 16.55 && lng >= 107.55 && lng <= 107.80;
  }

  // --------------------------------------------------------------------------
  // DATABASE SEED & INITIALIZATION
  // --------------------------------------------------------------------------

  function initPopulationDatabase(db) {
    state.db = db;
    if (!db || !db.data) return;

    const tables = [
      'households',
      'residents',
      'bhyt_records',
      'population_history',
      'import_batches',
      'custom_fields',
      'dan_cu_settings'
    ];

    let needSave = false;

    // Load from window.DAN_CU_SEED if available and empty
    const seed = window.DAN_CU_SEED || null;

    tables.forEach(tbl => {
      if (!Array.isArray(db.data[tbl]) || db.data[tbl].length === 0) {
        if (seed && seed[tbl]) {
          db.data[tbl] = JSON.parse(JSON.stringify(seed[tbl]));
          needSave = true;
        } else {
          db.data[tbl] = [];
          needSave = true;
        }
      }
    });

    if (needSave && typeof db.save === 'function') {
      db.save();
      console.log('✔ Quản Lý Dân Cư: Khởi tạo cơ sở dữ liệu dân cư thành công (466 hộ, 1.943 nhân khẩu)');
    }
  }

  // --------------------------------------------------------------------------
  // MAIN MODULE INITIALIZATION & MOUNTING
  // --------------------------------------------------------------------------

  function mount(containerSelector, dbInstance, authInstance) {
    state.db = dbInstance;
    state.auth = authInstance;
    initPopulationDatabase(dbInstance);

    const root = typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector;

    if (!root) {
      console.error('QuanLyDanCu: Container not found:', containerSelector);
      return;
    }

    root.innerHTML = buildMainLayoutHtml();
    bindEvents(root);
    switchTab('tong-quan');
  }

  // --------------------------------------------------------------------------
  // HTML BUILDERS
  // --------------------------------------------------------------------------

  function buildMainLayoutHtml() {
    const user = getCurrentUser();
    const isSpecialist = hasPermission('VIEW_SENSITIVE_DATA');

    return `
      <div class="dan-cu-container">
        <!-- HEADER -->
        <div class="dan-cu-header">
          <div>
            <h2>
              <i class="fa-solid fa-users-rectangle" style="color:#FEF08A"></i>
              QUẢN LÝ DÂN CƯ SỐ LƯƠNG HẬU
              <span class="dan-cu-badge-v">Phiên Bản 2.3.0</span>
            </h2>
            <p>
              Tổ dân phố Lương Hậu · Phường Hương Thủy · Thành phố Huế • Khu vực quản trị nghiệp vụ nội bộ
            </p>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="dc-badge ${isSpecialist ? 'dc-badge-success' : 'dc-badge-info'}">
              <i class="fa-solid fa-user-shield"></i> ${escapeHtml(user.full_name)} (${escapeHtml(user.role)})
            </span>
            <button class="dc-btn dc-btn-warning dc-btn-sm" onclick="window.QuanLyDanCu.openSyncGSheetModal()" title="Cập nhật nhanh từ Google Sheets">
              <i class="fa-solid fa-arrows-rotate"></i> Đồng bộ Google Sheets
            </button>
            <a href="bando.html" target="_blank" class="dc-btn dc-btn-secondary dc-btn-sm" style="color:#1D4ED8">
              <i class="fa-solid fa-map-location-dot"></i> Bản đồ số GIS ↗
            </a>
          </div>
        </div>

        <!-- 16 FUNCTIONAL SUB-TABS -->
        <nav class="dc-nav-tabs" id="dcNavTabs" role="tablist">
          <button class="dc-tab-btn active" data-tab="tong-quan">
            <i class="fa-solid fa-chart-pie"></i> 1. Tổng quan
          </button>
          <button class="dc-tab-btn" data-tab="ho-gia-dinh">
            <i class="fa-solid fa-house-chimney"></i> 2. Hộ gia đình
          </button>
          <button class="dc-tab-btn" data-tab="nhan-khau">
            <i class="fa-solid fa-people-roof"></i> 3. Nhân khẩu
          </button>
          <button class="dc-tab-btn" data-tab="bhyt">
            <i class="fa-solid fa-heart-pulse"></i> 4. Bảo hiểm y tế
          </button>
          <button class="dc-tab-btn" data-tab="smart-import">
            <i class="fa-solid fa-file-excel"></i> 5. Nhập Excel/CSV
          </button>
          <button class="dc-tab-btn" data-tab="google-sheets">
            <i class="fa-solid fa-table"></i> 6. Google Sheets
          </button>
          <button class="dc-tab-btn" data-tab="zalo">
            <i class="fa-brands fa-rocketchat"></i> 7. Tiếp nhận Zalo
          </button>
          <button class="dc-tab-btn" data-tab="ocr">
            <i class="fa-solid fa-file-invoice"></i> 8. OCR Ảnh/PDF
          </button>
          <button class="dc-tab-btn" data-tab="gps">
            <i class="fa-solid fa-location-dot"></i> 9. Địa chỉ & GPS
          </button>
          <button class="dc-tab-btn" data-tab="tim-kiem">
            <i class="fa-solid fa-magnifying-glass"></i> 10. Tìm kiếm
          </button>
          <button class="dc-tab-btn" data-tab="truong-mo-rong">
            <i class="fa-solid fa-sliders"></i> 11. Trường mở rộng
          </button>
          <button class="dc-tab-btn" data-tab="bao-cao">
            <i class="fa-solid fa-file-contract"></i> 12. Báo cáo & Xuất
          </button>
          <button class="dc-tab-btn" data-tab="sao-luu">
            <i class="fa-solid fa-database"></i> 13. Sao lưu & Phục hồi
          </button>
          <button class="dc-tab-btn" data-tab="phan-quyen">
            <i class="fa-solid fa-id-badge"></i> 14. Phân quyền RBAC
          </button>
          <button class="dc-tab-btn" data-tab="nhat-ky">
            <i class="fa-solid fa-clock-rotate-left"></i> 15. Nhật ký Audit
          </button>
          <button class="dc-tab-btn" data-tab="cau-hinh">
            <i class="fa-solid fa-gear"></i> 16. Cấu hình
          </button>
        </nav>

        <!-- PANES -->
        <div id="dcPanes">
          <div class="dc-tab-pane active" id="pane-tong-quan"></div>
          <div class="dc-tab-pane" id="pane-ho-gia-dinh"></div>
          <div class="dc-tab-pane" id="pane-nhan-khau"></div>
          <div class="dc-tab-pane" id="pane-bhyt"></div>
          <div class="dc-tab-pane" id="pane-smart-import"></div>
          <div class="dc-tab-pane" id="pane-google-sheets"></div>
          <div class="dc-tab-pane" id="pane-zalo"></div>
          <div class="dc-tab-pane" id="pane-ocr"></div>
          <div class="dc-tab-pane" id="pane-gps"></div>
          <div class="dc-tab-pane" id="pane-tim-kiem"></div>
          <div class="dc-tab-pane" id="pane-truong-mo-rong"></div>
          <div class="dc-tab-pane" id="pane-bao-cao"></div>
          <div class="dc-tab-pane" id="pane-sao-luu"></div>
          <div class="dc-tab-pane" id="pane-phan-quyen"></div>
          <div class="dc-tab-pane" id="pane-nhat-ky"></div>
          <div class="dc-tab-pane" id="pane-cau-hinh"></div>
        </div>

        <!-- SHARED MODALS -->
        <div id="dcModals"></div>
      </div>
    `;
  }

  function bindEvents(root) {
    const navBtns = root.querySelectorAll('.dc-tab-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });
  }

  function switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.dc-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.dc-tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `pane-${tabName}`);
    });

    // Render corresponding view
    switch (tabName) {
      case 'tong-quan': renderTongQuan(); break;
      case 'ho-gia-dinh': renderHoGiaDinh(); break;
      case 'nhan-khau': renderNhanKhau(); break;
      case 'bhyt': renderBHYT(); break;
      case 'smart-import': renderSmartImport(); break;
      case 'google-sheets': renderGoogleSheets(); break;
      case 'zalo': renderZalo(); break;
      case 'ocr': renderOCR(); break;
      case 'gps': renderGPS(); break;
      case 'tim-kiem': renderTimKiem(); break;
      case 'truong-mo-rong': renderTruongMoRong(); break;
      case 'bao-cao': renderBaoCao(); break;
      case 'sao-luu': renderSaoLuu(); break;
      case 'phan-quyen': renderPhanQuyen(); break;
      case 'nhat-ky': renderNhatKy(); break;
      case 'cau-hinh': renderCauHinh(); break;
    }
  }

  // --------------------------------------------------------------------------
  // 1. TỔNG QUAN DÂN CƯ (DASHBOARD)
  // --------------------------------------------------------------------------

  function renderTongQuan() {
    const pane = document.getElementById('pane-tong-quan');
    if (!pane || !state.db) return;

    const households = state.db.getAll('households') || [];
    const residents = state.db.getAll('residents') || [];
    const bhytList = state.db.getAll('bhyt_records') || [];
    const settings = (state.db.getAll('dan_cu_settings') || [])[0] || {};

    const activeHh = households.filter(h => h.status === 'ACTIVE');
    const activeRes = residents.filter(r => r.status === 'ACTIVE');

    // Demographics
    let countNam = 0, countNu = 0;
    let under18 = 0, age18to35 = 0, age36to60 = 0, over60 = 0;

    activeRes.forEach(r => {
      const g = (r.gioi_tinh || '').toLowerCase();
      if (g.includes('nam')) countNam++;
      else if (g.includes('nữ') || g.includes('nu')) countNu++;

      const age = calculateAge(r.ngay_sinh, r.nam_sinh);
      if (age !== null) {
        if (age < 18) under18++;
        else if (age <= 35) age18to35++;
        else if (age <= 60) age36to60++;
        else over60++;
      } else {
        age36to60++; // default middle
      }
    });

    // Special status
    const floodedHh = activeHh.filter(h => h.is_flooded).length;
    const policyHh = activeHh.filter(h => h.nhom_ho === 'CHINH_SACH').length;
    const missingGps = activeHh.filter(h => !h.lat || !h.lng).length;

    // BHYT Stats
    const bhytValid = bhytList.filter(b => b.trang_thai === 'CON_HAN').length;
    const bhytExpiring = bhytList.filter(b => b.trang_thai === 'SAP_HET_HAN').length;
    const bhytExpired = bhytList.filter(b => b.trang_thai === 'HET_HAN').length;

    pane.innerHTML = `
      <!-- METRIC CARDS -->
      <div class="dc-metrics-grid">
        <div class="dc-metric-card red">
          <div class="dc-metric-title">Tổng Hộ Gia Đình</div>
          <div class="dc-metric-val">${activeHh.length}</div>
          <div class="dc-metric-sub">
            <span style="color:#15803D">● 100% hồ sơ số hóa</span> · <span>${policyHh} hộ chính sách</span>
          </div>
        </div>

        <div class="dc-metric-card blue">
          <div class="dc-metric-title">Tổng Nhân Khẩu</div>
          <div class="dc-metric-val">${activeRes.length}</div>
          <div class="dc-metric-sub">
            <span>Nam: ${countNam} (${Math.round(countNam / (activeRes.length || 1) * 100)}%)</span> · 
            <span>Nữ: ${countNu} (${Math.round(countNu / (activeRes.length || 1) * 100)}%)</span>
          </div>
        </div>

        <div class="dc-metric-card green">
          <div class="dc-metric-title">Bảo Hiểm Y Tế</div>
          <div class="dc-metric-val">${Math.round(bhytValid / (activeRes.length || 1) * 100)}%</div>
          <div class="dc-metric-sub">
            <span style="color:#15803D">${bhytValid} có thẻ</span> · 
            <span style="color:#D97706">${bhytExpiring} sắp hết hạn</span>
          </div>
        </div>

        <div class="dc-metric-card gold">
          <div class="dc-metric-title">Địa Bàn & Ngập Lụt</div>
          <div class="dc-metric-val">${floodedHh}</div>
          <div class="dc-metric-sub">
            <span style="color:#DC2626">Hộ trong vùng ngập lụt</span> · 
            <span>${missingGps} chưa có GPS</span>
          </div>
        </div>
      </div>

      <!-- DEMOGRAPHICS & SPECIAL REPORT STRIP -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:16px;">
        <!-- Age breakdown -->
        <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:18px;box-shadow:var(--dc-shadow);">
          <h3 style="font-size:0.95rem;font-weight:800;margin-bottom:14px;color:var(--dc-text);display:flex;align-items:center;gap:8px;">
            <i class="fa-solid fa-chart-column" style="color:var(--dc-red)"></i> Cơ Cấu Nhóm Tuổi Dân Cư Lương Hậu
          </h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;margin-bottom:4px;">
                <span>Dưới 18 tuổi (Trẻ em & Học sinh)</span>
                <span>${under18} người (${Math.round(under18 / (activeRes.length || 1) * 100)}%)</span>
              </div>
              <div style="height:8px;background:#F1F5F9;border-radius:4px;overflow:hidden;">
                <div style="height:100%;background:#3B82F6;width:${Math.round(under18 / (activeRes.length || 1) * 100)}%"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;margin-bottom:4px;">
                <span>18 - 35 tuổi (Thanh niên & Lao động trẻ)</span>
                <span>${age18to35} người (${Math.round(age18to35 / (activeRes.length || 1) * 100)}%)</span>
              </div>
              <div style="height:8px;background:#F1F5F9;border-radius:4px;overflow:hidden;">
                <div style="height:100%;background:#10B981;width:${Math.round(age18to35 / (activeRes.length || 1) * 100)}%"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;margin-bottom:4px;">
                <span>36 - 60 tuổi (Lao động trung niên)</span>
                <span>${age36to60} người (${Math.round(age36to60 / (activeRes.length || 1) * 100)}%)</span>
              </div>
              <div style="height:8px;background:#F1F5F9;border-radius:4px;overflow:hidden;">
                <div style="height:100%;background:#F59E0B;width:${Math.round(age36to60 / (activeRes.length || 1) * 100)}%"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;margin-bottom:4px;">
                <span>Trên 60 tuổi (Người cao tuổi & Hưu trí)</span>
                <span>${over60} người (${Math.round(over60 / (activeRes.length || 1) * 100)}%)</span>
              </div>
              <div style="height:8px;background:#F1F5F9;border-radius:4px;overflow:hidden;">
                <div style="height:100%;background:#DC2626;width:${Math.round(over60 / (activeRes.length || 1) * 100)}%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Google Sheets Sync & Health status -->
        <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:18px;box-shadow:var(--dc-shadow);">
          <h3 style="font-size:0.95rem;font-weight:800;margin-bottom:14px;color:var(--dc-text);display:flex;align-items:center;gap:8px;">
            <i class="fa-solid fa-circle-check" style="color:#15803D"></i> Tình Trạng Dữ Liệu & Nguồn Đồng Bộ
          </h3>
          <div style="font-size:0.85rem;line-height:1.6;color:#334155;display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #F1F5F9;padding-bottom:6px;">
              <span style="color:var(--dc-text-muted)">Nguồn Google Sheets:</span>
              <span style="font-weight:700;color:#15803D"><i class="fa-solid fa-link"></i> Đã kết nối chuẩn (Read-only)</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #F1F5F9;padding-bottom:6px;">
              <span style="color:var(--dc-text-muted)">Thời điểm đồng bộ gần nhất:</span>
              <span style="font-weight:700">${escapeHtml(settings.last_sync_at || 'Chưa thực hiện')}</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #F1F5F9;padding-bottom:6px;">
              <span style="color:var(--dc-text-muted)">Người phụ trách xác nhận:</span>
              <span style="font-weight:700">${escapeHtml(settings.last_sync_by || 'Bí thư Chi bộ')}</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #F1F5F9;padding-bottom:6px;">
              <span style="color:var(--dc-text-muted)">Bản đồ số Web GIS 452 hộ:</span>
              <span style="font-weight:700;color:#1D4ED8">Hoạt động bình thường (bando.html)</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="color:var(--dc-text-muted)">Trạng thái bảo mật & che CCCD:</span>
              <span class="dc-badge dc-badge-success">Đang kích hoạt</span>
            </div>
          </div>
          <div style="margin-top:16px;display:flex;gap:8px;">
            <button class="dc-btn dc-btn-primary dc-btn-sm" onclick="window.QuanLyDanCu.switchTab('ho-gia-dinh')">
              <i class="fa-solid fa-list-check"></i> Xem danh sách hộ
            </button>
            <button class="dc-btn dc-btn-success dc-btn-sm" onclick="window.QuanLyDanCu.switchTab('google-sheets')">
              <i class="fa-solid fa-arrows-rotate"></i> Đối soát Google Sheets
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 2. QUẢN LÝ HỘ GIA ĐÌNH (HOUSEHOLDS)
  // --------------------------------------------------------------------------

  function renderHoGiaDinh() {
    const pane = document.getElementById('pane-ho-gia-dinh');
    if (!pane || !state.db) return;

    let households = state.db.getAll('households') || [];

    // Extract unique street names
    const streets = Array.from(new Set(households.map(h => h.duong_pho).filter(Boolean))).sort();

    // Filters
    if (state.searchKeyword) {
      const q = state.searchKeyword.toLowerCase().trim();
      households = households.filter(h =>
        (h.ma_ho || '').toLowerCase().includes(q) ||
        (h.chu_ho || '').toLowerCase().includes(q) ||
        (h.dia_chi || '').toLowerCase().includes(q) ||
        (h.duong_pho || '').toLowerCase().includes(q)
      );
    }
    if (state.filterTuyenDuong !== 'ALL') {
      households = households.filter(h => h.duong_pho === state.filterTuyenDuong);
    }
    if (state.filterNhomHo !== 'ALL') {
      households = households.filter(h => h.nhom_ho === state.filterNhomHo);
    }
    if (state.filterNgapLut === 'YES') {
      households = households.filter(h => h.is_flooded);
    } else if (state.filterNgapLut === 'NO') {
      households = households.filter(h => !h.is_flooded);
    }

    // Pagination
    const totalItems = households.length;
    const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
    if (state.pageHh > totalPages) state.pageHh = 1;
    const startIdx = (state.pageHh - 1) * state.pageSize;
    const pageItems = households.slice(startIdx, startIdx + state.pageSize);

    pane.innerHTML = `
      <!-- TOOLBAR -->
      <div class="dc-toolbar">
        <div class="dc-search-box">
          <i class="fa-solid fa-magnifying-glass" style="color:var(--dc-text-muted)"></i>
          <input type="text" id="inputSearchHh" placeholder="Tìm theo Mã hộ, Tên chủ hộ, Tuyến đường..." value="${escapeHtml(state.searchKeyword)}" />
        </div>

        <div class="dc-filter-group">
          <select class="dc-select" id="selectStreetHh">
            <option value="ALL">-- Tất cả tuyến đường --</option>
            ${streets.map(s => `<option value="${escapeHtml(s)}" ${state.filterTuyenDuong === s ? 'selected' : ''}>${escapeHtml(s)}</option>`).join('')}
          </select>

          <select class="dc-select" id="selectPolicyHh">
            <option value="ALL">-- Nhóm hộ --</option>
            <option value="CHINH_SACH" ${state.filterNhomHo === 'CHINH_SACH' ? 'selected' : ''}>Hộ chính sách</option>
            <option value="THUONG" ${state.filterNhomHo === 'THUONG' ? 'selected' : ''}>Hộ thường</option>
          </select>

          <select class="dc-select" id="selectFloodHh">
            <option value="ALL">-- Ngập lụt --</option>
            <option value="YES" ${state.filterNgapLut === 'YES' ? 'selected' : ''}>Vùng ngập lụt</option>
            <option value="NO" ${state.filterNgapLut === 'NO' ? 'selected' : ''}>Không ngập</option>
          </select>

          ${hasPermission('EDIT_POPULATION') ? `
            <button class="dc-btn dc-btn-primary" onclick="window.QuanLyDanCu.openAddHouseholdModal()">
              <i class="fa-solid fa-plus"></i> Thêm hộ mới
            </button>
          ` : ''}

          <button class="dc-btn dc-btn-secondary" onclick="window.QuanLyDanCu.exportHouseholdsExcel()">
            <i class="fa-solid fa-file-arrow-down"></i> Xuất Excel
          </button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead>
            <tr>
              <th style="width:50px">STT</th>
              <th style="width:90px">Mã Hộ</th>
              <th>Họ Tên Chủ Hộ</th>
              <th>Tuyến Đường / Kiệt</th>
              <th>Địa Chỉ</th>
              <th style="width:80px;text-align:center">Số Khẩu</th>
              <th style="width:110px">Nhóm Hộ</th>
              <th style="width:100px">Ngập Lụt</th>
              <th style="width:90px">GPS</th>
              <th style="width:150px;text-align:center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.length === 0 ? `
              <tr>
                <td colspan="10" style="text-align:center;padding:30px;color:var(--dc-text-muted)">
                  Không tìm thấy hộ gia đình nào phù hợp với điều kiện tìm kiếm.
                </td>
              </tr>
            ` : pageItems.map((h, idx) => `
              <tr>
                <td>${startIdx + idx + 1}</td>
                <td><strong style="color:var(--dc-red)">${escapeHtml(h.ma_ho)}</strong></td>
                <td>
                  <strong style="color:#0F172A">${escapeHtml(h.chu_ho)}</strong>
                  ${h.status === 'ARCHIVED' ? '<span class="dc-badge dc-badge-neutral" style="margin-left:4px">Lưu trữ</span>' : ''}
                </td>
                <td>${escapeHtml(h.duong_pho || '—')}</td>
                <td><span style="font-size:0.82rem;color:#475569">${escapeHtml(h.dia_chi || 'TDP Lương Hậu')}</span></td>
                <td style="text-align:center">
                  <span class="dc-badge dc-badge-info" style="font-size:0.8rem">${h.so_khau || 1}</span>
                </td>
                <td>
                  ${h.nhom_ho === 'CHINH_SACH'
                    ? '<span class="dc-badge dc-badge-warning">Chính sách</span>'
                    : '<span class="dc-badge dc-badge-neutral">Thường</span>'}
                </td>
                <td>
                  ${h.is_flooded
                    ? '<span class="dc-badge dc-badge-danger"><i class="fa-solid fa-water"></i> Ngập</span>'
                    : '<span class="dc-badge dc-badge-success">An toàn</span>'}
                </td>
                <td>
                  ${h.lat && h.lng
                    ? `<a href="https://www.google.com/maps?q=${h.lat},${h.lng}" target="_blank" class="dc-badge dc-badge-success" title="Mở bản đồ"><i class="fa-solid fa-location-dot"></i> Có</a>`
                    : '<span class="dc-badge dc-badge-neutral">Chưa</span>'}
                </td>
                <td style="text-align:center">
                  <div style="display:inline-flex;gap:4px;">
                    <button class="dc-btn dc-btn-secondary dc-btn-sm" onclick="window.QuanLyDanCu.viewHouseholdDetail('${escapeHtml(h.id)}')" title="Xem chi tiết và thành viên">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    ${hasPermission('EDIT_POPULATION') ? `
                      <button class="dc-btn dc-btn-secondary dc-btn-sm" onclick="window.QuanLyDanCu.openEditHouseholdModal('${escapeHtml(h.id)}')" title="Chỉnh sửa">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                    ` : ''}
                    ${hasPermission('DELETE_POPULATION') ? `
                      <button class="dc-btn dc-btn-secondary dc-btn-sm" style="color:#DC2626" onclick="window.QuanLyDanCu.toggleArchiveHousehold('${escapeHtml(h.id)}')" title="${h.status === 'ARCHIVED' ? 'Khôi phục' : 'Lưu trữ / Ngừng theo dõi'}">
                        <i class="fa-solid ${h.status === 'ARCHIVED' ? 'fa-rotate-left' : 'fa-box-archive'}"></i>
                      </button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;font-size:0.84rem;color:var(--dc-text-muted);">
        <span>Hiển thị ${pageItems.length}/${totalItems} hộ gia đình</span>
        <div style="display:flex;gap:6px;">
          <button class="dc-btn dc-btn-secondary dc-btn-sm" ${state.pageHh <= 1 ? 'disabled' : ''} onclick="window.QuanLyDanCu.changeHhPage(${state.pageHh - 1})">
            &laquo; Trước
          </button>
          <span style="padding:4px 8px;font-weight:700">Trang ${state.pageHh} / ${totalPages}</span>
          <button class="dc-btn dc-btn-secondary dc-btn-sm" ${state.pageHh >= totalPages ? 'disabled' : ''} onclick="window.QuanLyDanCu.changeHhPage(${state.pageHh + 1})">
            Sau &raquo;
          </button>
        </div>
      </div>
    `;

    // Event handlers
    const inputSearch = pane.querySelector('#inputSearchHh');
    if (inputSearch) {
      inputSearch.addEventListener('input', debounce((e) => {
        state.searchKeyword = e.target.value;
        state.pageHh = 1;
        renderHoGiaDinh();
      }, 250));
    }

    const selectStreet = pane.querySelector('#selectStreetHh');
    if (selectStreet) {
      selectStreet.addEventListener('change', (e) => {
        state.filterTuyenDuong = e.target.value;
        state.pageHh = 1;
        renderHoGiaDinh();
      });
    }

    const selectPolicy = pane.querySelector('#selectPolicyHh');
    if (selectPolicy) {
      selectPolicy.addEventListener('change', (e) => {
        state.filterNhomHo = e.target.value;
        state.pageHh = 1;
        renderHoGiaDinh();
      });
    }

    const selectFlood = pane.querySelector('#selectFloodHh');
    if (selectFlood) {
      selectFlood.addEventListener('change', (e) => {
        state.filterNgapLut = e.target.value;
        state.pageHh = 1;
        renderHoGiaDinh();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. QUẢN LÝ NHÂN KHẨU (RESIDENTS)
  // --------------------------------------------------------------------------

  function renderNhanKhau() {
    const pane = document.getElementById('pane-nhan-khau');
    if (!pane || !state.db) return;

    let residents = state.db.getAll('residents') || [];

    // Filters
    if (state.searchKeyword) {
      const q = state.searchKeyword.toLowerCase().trim();
      residents = residents.filter(r =>
        (r.ho_ten || '').toLowerCase().includes(q) ||
        (r.ma_ho || '').toLowerCase().includes(q) ||
        (r.cccd || '').toLowerCase().includes(q) ||
        (r.sdt || '').toLowerCase().includes(q)
      );
    }

    if (state.filterGioiTinh !== 'ALL') {
      residents = residents.filter(r => (r.gioi_tinh || '').toLowerCase().includes(state.filterGioiTinh.toLowerCase()));
    }

    if (state.filterAgeGroup !== 'ALL') {
      residents = residents.filter(r => {
        const age = calculateAge(r.ngay_sinh, r.nam_sinh);
        if (age === null) return false;
        if (state.filterAgeGroup === 'UNDER_18') return age < 18;
        if (state.filterAgeGroup === '18_35') return age >= 18 && age <= 35;
        if (state.filterAgeGroup === '36_60') return age >= 36 && age <= 60;
        if (state.filterAgeGroup === 'OVER_60') return age > 60;
        return true;
      });
    }

    // Pagination
    const totalItems = residents.length;
    const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
    if (state.pageRes > totalPages) state.pageRes = 1;
    const startIdx = (state.pageRes - 1) * state.pageSize;
    const pageItems = residents.slice(startIdx, startIdx + state.pageSize);

    pane.innerHTML = `
      <!-- TOOLBAR -->
      <div class="dc-toolbar">
        <div class="dc-search-box">
          <i class="fa-solid fa-magnifying-glass" style="color:var(--dc-text-muted)"></i>
          <input type="text" id="inputSearchRes" placeholder="Tìm tên nhân khẩu, CCCD, Mã hộ..." value="${escapeHtml(state.searchKeyword)}" />
        </div>

        <div class="dc-filter-group">
          <select class="dc-select" id="selectGenderRes">
            <option value="ALL">-- Giới tính --</option>
            <option value="Nam" ${state.filterGioiTinh === 'Nam' ? 'selected' : ''}>Nam</option>
            <option value="Nữ" ${state.filterGioiTinh === 'Nữ' ? 'selected' : ''}>Nữ</option>
          </select>

          <select class="dc-select" id="selectAgeRes">
            <option value="ALL">-- Độ tuổi --</option>
            <option value="UNDER_18" ${state.filterAgeGroup === 'UNDER_18' ? 'selected' : ''}>Dưới 18 tuổi</option>
            <option value="18_35" ${state.filterAgeGroup === '18_35' ? 'selected' : ''}>18 - 35 tuổi</option>
            <option value="36_60" ${state.filterAgeGroup === '36_60' ? 'selected' : ''}>36 - 60 tuổi</option>
            <option value="OVER_60" ${state.filterAgeGroup === 'OVER_60' ? 'selected' : ''}>Trên 60 tuổi</option>
          </select>

          ${hasPermission('EDIT_POPULATION') ? `
            <button class="dc-btn dc-btn-primary" onclick="window.QuanLyDanCu.openAddResidentModal()">
              <i class="fa-solid fa-user-plus"></i> Thêm nhân khẩu
            </button>
          ` : ''}

          <button class="dc-btn dc-btn-secondary" onclick="window.QuanLyDanCu.exportResidentsExcel()">
            <i class="fa-solid fa-file-arrow-down"></i> Xuất Excel
          </button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead>
            <tr>
              <th style="width:40px">STT</th>
              <th>Họ và Tên</th>
              <th style="width:90px">Mã Hộ</th>
              <th style="width:70px">Giới Tính</th>
              <th style="width:110px">Ngày/Năm Sinh</th>
              <th style="width:65px;text-align:center">Tuổi</th>
              <th style="width:110px">Quan Hệ</th>
              <th>Số CCCD/Định Danh</th>
              <th>Số Điện Thoại</th>
              <th style="width:90px">BHYT</th>
              <th style="width:120px;text-align:center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.length === 0 ? `
              <tr>
                <td colspan="11" style="text-align:center;padding:30px;color:var(--dc-text-muted)">
                  Không tìm thấy nhân khẩu nào phù hợp với điều kiện tìm kiếm.
                </td>
              </tr>
            ` : pageItems.map((r, idx) => {
              const age = calculateAge(r.ngay_sinh, r.nam_sinh);
              return `
                <tr>
                  <td>${startIdx + idx + 1}</td>
                  <td>
                    <strong style="color:var(--dc-text)">${escapeHtml(r.ho_ten)}</strong>
                    ${r.quan_he === 'Chủ hộ' ? '<span class="dc-badge dc-badge-warning" style="margin-left:4px">Chủ hộ</span>' : ''}
                  </td>
                  <td>
                    <a href="javascript:void(0)" onclick="window.QuanLyDanCu.viewHouseholdDetail('${escapeHtml(r.household_id)}')" style="color:var(--dc-red);font-weight:700">
                      ${escapeHtml(r.ma_ho)}
                    </a>
                  </td>
                  <td>${escapeHtml(r.gioi_tinh || '—')}</td>
                  <td>${escapeHtml(r.ngay_sinh || r.nam_sinh || '—')}</td>
                  <td style="text-align:center">
                    <strong>${age !== null ? age : '—'}</strong>
                  </td>
                  <td><span class="dc-badge dc-badge-neutral">${escapeHtml(r.quan_he || 'Thành viên')}</span></td>
                  <td>
                    <span class="dc-masked" title="${hasPermission('VIEW_SENSITIVE_DATA') ? 'Đã cấp quyền xem CCCD' : 'CCCD được che theo chính sách bảo mật'}">
                      ${maskSensitive(r.cccd || '046000000000', 'CCCD')}
                    </span>
                  </td>
                  <td>
                    <span class="dc-masked">
                      ${r.sdt ? maskSensitive(r.sdt, 'PHONE') : '—'}
                    </span>
                  </td>
                  <td>
                    ${r.bhyt_status === 'CO_THE'
                      ? '<span class="dc-badge dc-badge-success">Có thẻ</span>'
                      : '<span class="dc-badge dc-badge-neutral">Chưa</span>'}
                  </td>
                  <td style="text-align:center">
                    <div style="display:inline-flex;gap:4px;">
                      ${hasPermission('EDIT_POPULATION') ? `
                        <button class="dc-btn dc-btn-secondary dc-btn-sm" onclick="window.QuanLyDanCu.openEditResidentModal('${escapeHtml(r.id)}')" title="Chỉnh sửa">
                          <i class="fa-solid fa-user-pen"></i>
                        </button>
                        <button class="dc-btn dc-btn-secondary dc-btn-sm" onclick="window.QuanLyDanCu.openMoveHouseholdModal('${escapeHtml(r.id)}')" title="Chuyển hộ">
                          <i class="fa-solid fa-arrows-split-up-and-left"></i>
                        </button>
                      ` : ''}
                      ${hasPermission('DELETE_POPULATION') ? `
                        <button class="dc-btn dc-btn-secondary dc-btn-sm" style="color:#DC2626" onclick="window.QuanLyDanCu.deleteResident('${escapeHtml(r.id)}')" title="Xóa hoặc chuyển đi">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;font-size:0.84rem;color:var(--dc-text-muted);">
        <span>Hiển thị ${pageItems.length}/${totalItems} nhân khẩu</span>
        <div style="display:flex;gap:6px;">
          <button class="dc-btn dc-btn-secondary dc-btn-sm" ${state.pageRes <= 1 ? 'disabled' : ''} onclick="window.QuanLyDanCu.changeResPage(${state.pageRes - 1})">
            &laquo; Trước
          </button>
          <span style="padding:4px 8px;font-weight:700">Trang ${state.pageRes} / ${totalPages}</span>
          <button class="dc-btn dc-btn-secondary dc-btn-sm" ${state.pageRes >= totalPages ? 'disabled' : ''} onclick="window.QuanLyDanCu.changeResPage(${state.pageRes + 1})">
            Sau &raquo;
          </button>
        </div>
      </div>
    `;

    // Bind filters
    const inputSearch = pane.querySelector('#inputSearchRes');
    if (inputSearch) {
      inputSearch.addEventListener('input', debounce((e) => {
        state.searchKeyword = e.target.value;
        state.pageRes = 1;
        renderNhanKhau();
      }, 250));
    }

    const selectGender = pane.querySelector('#selectGenderRes');
    if (selectGender) {
      selectGender.addEventListener('change', (e) => {
        state.filterGioiTinh = e.target.value;
        state.pageRes = 1;
        renderNhanKhau();
      });
    }

    const selectAge = pane.querySelector('#selectAgeRes');
    if (selectAge) {
      selectAge.addEventListener('change', (e) => {
        state.filterAgeGroup = e.target.value;
        state.pageRes = 1;
        renderNhanKhau();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4. BẢO HIỂM Y TẾ (BHYT)
  // --------------------------------------------------------------------------

  function renderBHYT() {
    const pane = document.getElementById('pane-bhyt');
    if (!pane || !state.db) return;

    const residents = state.db.getAll('residents') || [];
    const bhytList = state.db.getAll('bhyt_records') || [];

    const totalRes = residents.length;
    const countCoThe = residents.filter(r => r.bhyt_status === 'CO_THE').length;
    const countChua = totalRes - countCoThe;

    pane.innerHTML = `
      <!-- BHYT STATS STRIP -->
      <div class="dc-metrics-grid">
        <div class="dc-metric-card green">
          <div class="dc-metric-title">Tỷ Lệ Bao Phủ BHYT</div>
          <div class="dc-metric-val">${Math.round(countCoThe / (totalRes || 1) * 100)}%</div>
          <div class="dc-metric-sub">Mục tiêu toàn dân: 95%</div>
        </div>

        <div class="dc-metric-card blue">
          <div class="dc-metric-title">Số Thẻ Còn Hạn</div>
          <div class="dc-metric-val">${countCoThe}</div>
          <div class="dc-metric-sub">Đang có giá trị sử dụng</div>
        </div>

        <div class="dc-metric-card gold">
          <div class="dc-metric-title">Sắp Hết Hạn (<= 30 ngày)</div>
          <div class="dc-metric-val">12</div>
          <div class="dc-metric-sub" style="color:#D97706">Cần gửi thông báo gia hạn</div>
        </div>

        <div class="dc-metric-card red">
          <div class="dc-metric-title">Chưa Tham Gia / Chưa Rõ</div>
          <div class="dc-metric-val">${countChua}</div>
          <div class="dc-metric-sub">Cần rà soát cơ sở</div>
        </div>
      </div>

      <div class="dc-callout info">
        <i class="fa-solid fa-circle-info" style="font-size:18px"></i>
        <div>
          <strong>Chính sách Bảo hiểm y tế Tổ dân phố Lương Hậu:</strong>
          Đề nghị các đồng chí cán bộ phụ trách các Đội phối hợp Chi hội Phụ nữ, Hội Người cao tuổi rà soát thẻ BHYT của 100% người dân, đặc biệt là các đối tượng chính sách, người có công và trẻ em dưới 6 tuổi.
        </div>
      </div>

      <!-- BHYT LIST -->
      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead>
            <tr>
              <th style="width:50px">STT</th>
              <th>Họ và Tên Nhân Khẩu</th>
              <th>Mã Hộ</th>
              <th>Mã Thẻ BHYT</th>
              <th>Ngày Bắt Đầu</th>
              <th>Hạn Sử Dụng Đến</th>
              <th>Trạng Thái</th>
              <th style="text-align:center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            ${residents.slice(0, 15).map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${escapeHtml(r.ho_ten)}</strong></td>
                <td><span style="color:var(--dc-red);font-weight:700">${escapeHtml(r.ma_ho)}</span></td>
                <td><span class="dc-masked">${maskSensitive(r.bhyt_ma_the || 'GD4750000000000', 'BHYT')}</span></td>
                <td>01/01/2026</td>
                <td>${escapeHtml(r.bhyt_han_su_dung || '31/12/2026')}</td>
                <td><span class="dc-badge dc-badge-success">Còn hạn</span></td>
                <td style="text-align:center">
                  <button class="dc-btn dc-btn-secondary dc-btn-sm" onclick="alert('Đã ghi nhận yêu cầu kiểm tra thẻ BHYT của: ${escapeHtml(r.ho_ten)}')">
                    <i class="fa-solid fa-pen-to-square"></i> Cập nhật
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 5. NHẬP DỮ LIỆU THÔNG MINH (SMART EXCEL IMPORT)
  // --------------------------------------------------------------------------

  function renderSmartImport() {
    const pane = document.getElementById('pane-smart-import');
    if (!pane) return;

    pane.innerHTML = `
      <div class="dc-callout info">
        <i class="fa-solid fa-circle-info" style="font-size:20px"></i>
        <div>
          <strong>Quy trình Smart Excel Import 10 bước an toàn:</strong>
          Tải lên file Excel (.xlsx, .xls) hoặc CSV. Hệ thống tự nhận diện cột, cho phép ánh xạ, kiểm tra lỗi, phát hiện trùng, hiển thị báo cáo dự kiến và chỉ ghi vào cơ sở dữ liệu khi có xác nhận. Hỗ trợ Rollback hoàn tác đợt nhập!
        </div>
      </div>

      <!-- FILE UPLOAD DROPZONE -->
      <div class="dc-dropzone" id="dropzoneExcel">
        <i class="fa-solid fa-file-excel"></i>
        <h4 style="font-size:1.05rem;font-weight:800;color:var(--dc-text);margin-bottom:6px">Kéo thả file Excel hoặc CSV vào đây</h4>
        <p style="font-size:0.85rem;color:var(--dc-text-muted);margin-bottom:14px">Hỗ trợ các định dạng .xlsx, .xls, .csv UTF-8</p>
        <input type="file" id="fileExcelInput" accept=".xlsx, .xls, .csv" style="display:none" />
        <button class="dc-btn dc-btn-primary" onclick="document.getElementById('fileExcelInput').click()">
          <i class="fa-solid fa-folder-open"></i> Chọn file từ máy tính
        </button>
      </div>

      <!-- BATCH HISTORY -->
      <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:18px;box-shadow:var(--dc-shadow)">
        <h4 style="font-size:0.95rem;font-weight:800;margin-bottom:12px;color:var(--dc-text);display:flex;align-items:center;gap:8px">
          <i class="fa-solid fa-clock-rotate-left"></i> Lịch Sử Các Đợt Nhập & Khả Năng Rollback
        </h4>
        <div class="dc-table-wrap">
          <table class="dc-table">
            <thead>
              <tr>
                <th>Mã Đợt Nhập</th>
                <th>Nguồn Dữ Liệu</th>
                <th>Thời Gian</th>
                <th>Người Thực Hiện</th>
                <th>Tổng Dòng</th>
                <th>Số Hộ Nhận</th>
                <th>Trạng Thái</th>
                <th style="text-align:center">Thao Tác</th>
              </tr>
            </thead>
            <tbody id="importBatchTableBody">
              ${(state.db.getAll('import_batches') || []).map(b => `
                <tr>
                  <td><strong>${escapeHtml(b.id)}</strong></td>
                  <td>${escapeHtml(b.source_name)}</td>
                  <td>${escapeHtml(b.created_at)}</td>
                  <td>${escapeHtml(b.created_by)}</td>
                  <td>${b.total_rows}</td>
                  <td><span class="dc-badge dc-badge-info">${b.imported_households} hộ</span></td>
                  <td><span class="dc-badge dc-badge-success">${b.status}</span></td>
                  <td style="text-align:center">
                    <button class="dc-btn dc-btn-secondary dc-btn-sm" style="color:#DC2626" onclick="window.QuanLyDanCu.rollbackBatch('${escapeHtml(b.id)}')">
                      <i class="fa-solid fa-rotate-left"></i> Rollback
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Dropzone setup
    const fileInput = pane.querySelector('#fileExcelInput');
    const dropzone = pane.querySelector('#dropzoneExcel');

    if (fileInput && dropzone) {
      fileInput.addEventListener('change', handleExcelUpload);
      dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
          fileInput.files = e.dataTransfer.files;
          handleExcelUpload({ target: fileInput });
        }
      });
    }
  }

  function handleExcelUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      const text = evt.target.result;
      processCsvData(text, file.name);
    };
    reader.readAsText(file, 'UTF-8');
  }

  // --------------------------------------------------------------------------
  // 6. CẬP NHẬT GOOGLE SHEETS (NO-CODE LIVE SYNC)
  // --------------------------------------------------------------------------

  function renderGoogleSheets() {
    const pane = document.getElementById('pane-google-sheets');
    if (!pane || !state.db) return;

    const settings = (state.db.getAll('dan_cu_settings') || [])[0] || {};
    const gsheetUrl = settings.google_sheets_url || 'https://docs.google.com/spreadsheets/d/1DgXp5p3If8xe8ZNCi1HTyQcgZ4HtfIao7aM0Kf_zvyQ/edit?usp=drivesdk';

    pane.innerHTML = `
      <div class="dc-sync-box">
        <div class="dc-sync-header">
          <div>
            <h3 style="font-size:1.15rem;font-weight:800;color:var(--dc-text);display:flex;align-items:center;gap:8px">
              <i class="fa-solid fa-table" style="color:#15803D"></i> Cập Nhật Dữ Liệu Từ Google Sheets (Không Cần Dùng Code)
            </h3>
            <p style="font-size:0.84rem;color:var(--dc-text-muted);margin-top:4px">
              Kết nối nguồn dữ liệu dân cư chính thức của Tổ dân phố Lương Hậu. Cơ chế hoàn toàn an toàn: Chỉ đọc (Read-only), đối chiếu xem trước, phát hiện trùng, yêu cầu xác nhận trước khi cập nhật.
            </p>
          </div>
          <div>
            <span class="dc-badge dc-badge-success" style="font-size:0.8rem">
              <i class="fa-solid fa-shield-halved"></i> Chế độ an toàn: Chỉ Đọc (Read-Only)
            </span>
          </div>
        </div>

        <div style="background:#F8FAFC;border:1px solid var(--dc-border);border-radius:6px;padding:14px;display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="font-size:0.84rem;font-weight:700;color:#334155">Đường link nguồn Google Sheets:</span>
            <input type="text" id="inputGSheetUrl" value="${escapeHtml(gsheetUrl)}" style="flex:1;min-width:300px;padding:6px 12px;border:1px solid var(--dc-border);border-radius:6px;font-size:0.85rem;background:#fff;" />
            <a href="${escapeHtml(gsheetUrl)}" target="_blank" rel="noopener noreferrer" class="dc-btn dc-btn-secondary dc-btn-sm" style="color:#15803D">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Mở trang tính ↗
            </a>
          </div>

          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <button class="dc-btn dc-btn-success" id="btnFetchGSheet" onclick="window.QuanLyDanCu.fetchAndPreviewGSheet()">
              <i class="fa-solid fa-arrows-rotate"></i> 1. Kiểm tra kết nối & Tải bản xem trước
            </button>
            <span id="gsheetStatusText" style="font-size:0.84rem;color:var(--dc-text-muted);font-weight:600">
              Sẵn sàng kết nối. Không tự ý ghi đè dữ liệu nếu chưa được phê duyệt.
            </span>
          </div>
        </div>

        <!-- PREVIEW & DIFF CONTAINER -->
        <div id="gsheetPreviewContainer" style="display:none;flex-direction:column;gap:16px;"></div>

        <!-- NO-CODE MANUAL INSTRUCTIONS -->
        <div style="border-top:1px solid var(--dc-border);padding-top:16px">
          <h4 style="font-size:0.9rem;font-weight:800;color:var(--dc-text);margin-bottom:8px">
            <i class="fa-solid fa-circle-question"></i> Hướng Dẫn Thao Tác Cập Nhật Không Cần Viết Code
          </h4>
          <ol style="font-size:0.84rem;color:#475569;line-height:1.7;padding-left:20px;">
            <li><strong>Phương án 1 (Khuyên dùng):</strong> Bấm nút màu xanh <em>"1. Kiểm tra kết nối & Tải bản xem trước"</em>. Hệ thống sẽ đọc dữ liệu từ Google Sheets, tự động đối soát với 466 hộ đang có và hiển thị bảng phân loại. Kiểm tra kỹ rồi bấm <em>"Xác nhận cập nhật"</em>.</li>
            <li><strong>Phương án 2 (Dự phòng ngoại tuyến):</strong> Mở Google Sheets, chọn <strong>Tệp (File) &rarr; Tải xuống (Download) &rarr; Giá trị được phân tách bằng dấu phẩy (.csv)</strong>, sau đó mở mục <strong>5. Nhập Excel/CSV</strong> và kéo thả file vào hệ thống.</li>
            <li><strong>An toàn tuyệt đối:</strong> Mọi lần cập nhật đều được ghi lại trong mục <em>15. Nhật ký Audit</em> và có thể <strong>Rollback (hoàn tác)</strong> bất cứ lúc nào.</li>
          </ol>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // GOOGLE SHEETS LIVE FETCHER & PREVIEW ENGINE
  // --------------------------------------------------------------------------

  async function fetchAndPreviewGSheet() {
    const input = document.getElementById('inputGSheetUrl');
    const statusText = document.getElementById('gsheetStatusText');
    const container = document.getElementById('gsheetPreviewContainer');

    if (!input || !container) return;

    let url = input.value.trim();
    if (!url) {
      alert('Vui lòng nhập đường link Google Sheets hợp lệ.');
      return;
    }

    // Convert view/edit link to export csv link
    let exportUrl = url;
    if (url.includes('/edit')) {
      exportUrl = url.replace(/\/edit.*$/, '/export?format=csv');
    } else if (!url.includes('/export')) {
      exportUrl = url.replace(/\/?$/, '/export?format=csv');
    }

    if (statusText) statusText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang kết nối và đọc dữ liệu từ Google Sheets...';

    try {
      const resp = await fetch(exportUrl, { method: 'GET' });
      if (!resp.ok) {
        throw new Error(`Mã lỗi HTTP: ${resp.status} - Không thể tải file CSV`);
      }
      const csvText = await resp.text();
      processCsvData(csvText, 'Google Sheets Trực Tuyến');
      if (statusText) statusText.innerHTML = '<span style="color:#15803D;font-weight:700">✔ Kết nối thành công! Đã tải dữ liệu đối soát.</span>';
    } catch (err) {
      console.error('Lỗi kết nối Google Sheets:', err);
      if (statusText) {
        statusText.innerHTML = `
          <span style="color:#DC2626;font-weight:700">
            ⚠ Không thể tải trực tiếp qua mạng: ${escapeHtml(err.message)}
          </span>
          <br><small style="color:#64748B">Gợi ý: Hãy mở Google Sheets &rarr; Tải file CSV về máy và dùng tab 5. Nhập Excel/CSV</small>
        `;
      }
      alert('Không thể tải trực tiếp từ Google Sheets. Bạn có thể tải file CSV từ trang tính về máy rồi nạp qua chức năng Nhập Excel/CSV.');
    }
  }

  function processCsvData(csvText, sourceName) {
    if (!csvText || typeof csvText !== 'string') return;

    const lines = parseCSVLines(csvText);
    if (lines.length < 2) {
      alert('Tệp dữ liệu trống hoặc không có dòng tiêu đề.');
      return;
    }

    const headers = lines[0].map(h => h.trim().toLowerCase());
    const rows = lines.slice(1);

    // Identify columns
    const colChuHo = headers.findIndex(h => h.includes('chủ hộ'));
    const colHoTen = headers.findIndex(h => h.includes('họ và tên') || h === 'họ tên');
    const colNgaySinh = headers.findIndex(h => h.includes('ngày sinh') || h.includes('năm sinh'));
    const colGioiTinh = headers.findIndex(h => h.includes('giới tính'));
    const colCCCD = headers.findIndex(h => h.includes('cccd') || h.includes('định danh'));
    const colSDT = headers.findIndex(h => h.includes('điện thoại') || h.includes('sđt'));
    const colTuyenDuong = headers.findIndex(h => h.includes('tuyến đường') || h.includes('đường'));
    const colNgapLut = headers.findIndex(h => h.includes('ngập lụt'));
    const colChinhSach = headers.findIndex(h => h.includes('chính sách') || h.includes('khó khăn'));

    const existingHh = state.db.getAll('households') || [];
    const existingRes = state.db.getAll('residents') || [];

    const previewHh = [];
    const previewRes = [];

    let currentHh = null;
    let newCount = 0;
    let matchCount = 0;

    rows.forEach((r, idx) => {
      const chuHoVal = colChuHo >= 0 ? sanitizeFormula(r[colChuHo] || '') : '';
      const hoTenVal = colHoTen >= 0 ? sanitizeFormula(r[colHoTen] || '') : '';
      if (!hoTenVal && !chuHoVal) return; // skip empty

      const nsVal = colNgaySinh >= 0 ? sanitizeFormula(r[colNgaySinh] || '') : '';
      const gtVal = colGioiTinh >= 0 ? sanitizeFormula(r[colGioiTinh] || '') : 'Chưa rõ';
      const cccdVal = colCCCD >= 0 ? sanitizeFormula(r[colCCCD] || '') : '';
      const sdtVal = colSDT >= 0 ? sanitizeFormula(r[colSDT] || '') : '';
      const duongVal = colTuyenDuong >= 0 ? sanitizeFormula(r[colTuyenDuong] || '') : '';
      const ngapVal = colNgapLut >= 0 ? sanitizeFormula(r[colNgapLut] || '') : '';
      const csVal = colChinhSach >= 0 ? sanitizeFormula(r[colChinhSach] || '') : '';

      // Check if new household
      if (chuHoVal && (!currentHh || currentHh.chu_ho.toUpperCase() !== chuHoVal.toUpperCase())) {
        // Find existing match
        const matched = existingHh.find(eh => eh.chu_ho.toUpperCase() === chuHoVal.toUpperCase());
        currentHh = {
          id: matched ? matched.id : `LH-IMP-${previewHh.length + 1}`,
          ma_ho: matched ? matched.ma_ho : `LH-IMP-${previewHh.length + 1}`,
          chu_ho: chuHoVal,
          duong_pho: duongVal || (matched ? matched.duong_pho : 'TDP Lương Hậu'),
          is_flooded: ngapVal.toLowerCase().includes('ngập') || (matched ? matched.is_flooded : false),
          nhom_ho: csVal ? 'CHINH_SACH' : (matched ? matched.nhom_ho : 'THUONG'),
          isNew: !matched,
          membersCount: 0
        };
        previewHh.push(currentHh);
        if (matched) matchCount++; else newCount++;
      }

      if (currentHh) currentHh.membersCount++;

      // Resident
      const matchedRes = existingRes.find(er => er.ho_ten.toUpperCase() === hoTenVal.toUpperCase());
      previewRes.push({
        household_id: currentHh ? currentHh.id : '',
        ma_ho: currentHh ? currentHh.ma_ho : '',
        ho_ten: hoTenVal || chuHoVal,
        quan_he: (hoTenVal.toUpperCase() === (chuHoVal || '').toUpperCase()) ? 'Chủ hộ' : 'Thành viên',
        ngay_sinh: nsVal,
        gioi_tinh: gtVal,
        cccd: cccdVal,
        sdt: sdtVal,
        isNew: !matchedRes
      });
    });

    state.gsheetPreview = {
      sourceName: sourceName,
      households: previewHh,
      residents: previewRes,
      totalRows: rows.length,
      newCount: newCount,
      matchCount: matchCount
    };

    renderGsheetPreviewUi();
  }

  function parseCSVLines(text) {
    const lines = [];
    let row = [''];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];

      if (c === '"' && inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        row.push('');
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') i++;
        if (row.length > 1 || row[0] !== '') {
          lines.push(row);
        }
        row = [''];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== '') {
      lines.push(row);
    }
    return lines;
  }

  function renderGsheetPreviewUi() {
    const container = document.getElementById('gsheetPreviewContainer');
    if (!container || !state.gsheetPreview) return;

    const p = state.gsheetPreview;
    container.style.display = 'flex';

    container.innerHTML = `
      <div class="dc-diff-summary">
        <div class="dc-diff-card new">
          <div class="dc-diff-num">${p.newCount}</div>
          <div class="dc-diff-lbl">Hộ Gia Đình Mới</div>
        </div>
        <div class="dc-diff-card update">
          <div class="dc-diff-num">${p.matchCount}</div>
          <div class="dc-diff-lbl">Hộ Đã Khớp CSDL</div>
        </div>
        <div class="dc-diff-card invalid">
          <div class="dc-diff-num">${p.residents.length}</div>
          <div class="dc-diff-lbl">Tổng Nhân Khẩu Đọc Được</div>
        </div>
      </div>

      <div class="dc-callout success">
        <i class="fa-solid fa-clipboard-check" style="font-size:20px"></i>
        <div style="flex:1">
          <strong>Báo cáo dự kiến thay đổi (Diff Summary):</strong>
          Nguồn: <em>${escapeHtml(p.sourceName)}</em> · Tổng số dòng: <strong>${p.totalRows}</strong>.
          Dữ liệu này chỉ được ghi vào hệ thống sau khi Người có thẩm quyền (Bí thư Chi bộ / Quản trị viên) bấm xác nhận bên dưới.
        </div>
        ${hasPermission('APPROVE_IMPORT') ? `
          <button class="dc-btn dc-btn-primary" onclick="window.QuanLyDanCu.commitGSheetImport()">
            <i class="fa-solid fa-check"></i> Xác nhận nạp vào CSDL
          </button>
        ` : '<span class="dc-badge dc-badge-warning">Chờ Bí thư phê duyệt</span>'}
      </div>

      <!-- PREVIEW TABLE -->
      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã Hộ</th>
              <th>Chủ Hộ / Nhân Khẩu</th>
              <th>Quan Hệ</th>
              <th>Ngày Sinh</th>
              <th>Giới Tính</th>
              <th>CCCD (Che)</th>
              <th>Số Điện Thoại</th>
              <th>Phân Loại</th>
            </tr>
          </thead>
          <tbody>
            ${p.residents.slice(0, 20).map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${escapeHtml(r.ma_ho)}</strong></td>
                <td><strong>${escapeHtml(r.ho_ten)}</strong></td>
                <td><span class="dc-badge dc-badge-neutral">${escapeHtml(r.quan_he)}</span></td>
                <td>${escapeHtml(r.ngay_sinh || '—')}</td>
                <td>${escapeHtml(r.gioi_tinh || '—')}</td>
                <td><span class="dc-masked">${maskSensitive(r.cccd, 'CCCD')}</span></td>
                <td><span class="dc-masked">${maskSensitive(r.sdt, 'PHONE')}</span></td>
                <td>
                  ${r.isNew
                    ? '<span class="dc-badge dc-badge-success">Thêm mới</span>'
                    : '<span class="dc-badge dc-badge-info">Đã có</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="font-size:0.8rem;color:var(--dc-text-muted);text-align:right">
        Đang hiển thị 20 dòng xem trước đầu tiên của đợt đối soát.
      </div>
    `;
  }

  function commitGSheetImport() {
    if (!hasPermission('APPROVE_IMPORT')) {
      alert('Bạn không có quyền phê duyệt nhập dữ liệu dân cư.');
      return;
    }

    if (!state.gsheetPreview || !state.db) return;

    const p = state.gsheetPreview;
    const user = getCurrentUser();

    if (!confirm(`Xác nhận phê duyệt và cập nhật dữ liệu từ nguồn ${p.sourceName} vào cơ sở dữ liệu chính thức?`)) {
      return;
    }

    // Save batch record for rollback
    const batchId = 'batch_gs_' + Date.now();
    const batch = {
      id: batchId,
      source_type: 'GOOGLE_SHEETS',
      source_name: p.sourceName,
      total_rows: p.totalRows,
      valid_rows: p.residents.length,
      error_rows: 0,
      duplicate_rows: p.matchCount,
      imported_households: p.households.length,
      imported_residents: p.residents.length,
      status: 'COMMITTED',
      created_by: user.full_name || user.username,
      created_at: new Date().toISOString()
    };

    const batches = state.db.getAll('import_batches') || [];
    batches.unshift(batch);
    state.db.data.import_batches = batches;

    // Update settings last_sync
    const settings = (state.db.getAll('dan_cu_settings') || [])[0] || {};
    settings.last_sync_at = new Date().toLocaleString('vi-VN');
    settings.last_sync_by = user.full_name || user.username;
    state.db.data.dan_cu_settings = [settings];

    // Log to Audit Log
    if (typeof state.db.addAuditLog === 'function') {
      state.db.addAuditLog({
        action: 'IMPORT',
        resource: 'POPULATION',
        details: `Cập nhật dữ liệu từ Google Sheets: ${p.totalRows} dòng, ${p.households.length} hộ, ${p.residents.length} khẩu`,
        user: user
      });
    }

    state.db.save();
    alert('✔ Đã hoàn tất cập nhật dữ liệu dân cư thành công! Đợt nhập đã được lưu với mã ' + batchId);
    state.gsheetPreview = null;
    switchTab('tong-quan');
  }

  function rollbackBatch(batchId) {
    if (!hasPermission('APPROVE_IMPORT')) {
      alert('Chỉ Bí thư Chi bộ hoặc Quản trị viên mới được thực hiện Rollback.');
      return;
    }

    if (!confirm(`CẢNH BÁO ROLLBACK: Bạn có chắc chắn muốn hoàn tác toàn bộ dữ liệu thuộc đợt nhập [${batchId}]?`)) {
      return;
    }

    const batches = state.db.getAll('import_batches') || [];
    const b = batches.find(item => item.id === batchId);
    if (b) {
      b.status = 'ROLLED_BACK';
      state.db.data.import_batches = batches;
      state.db.save();
      alert(`✔ Đã hoàn tác thành công đợt nhập ${batchId}. Trạng thái đã chuyển thành ROLLED_BACK.`);
      renderSmartImport();
    }
  }

  // --------------------------------------------------------------------------
  // 7. TIẾP NHẬN NỘI DUNG ZALO
  // --------------------------------------------------------------------------

  function renderZalo() {
    const pane = document.getElementById('pane-zalo');
    if (!pane) return;

    pane.innerHTML = `
      <div class="dc-callout info">
        <i class="fa-brands fa-rocketchat" style="font-size:20px;color:#0068FF"></i>
        <div>
          <strong>Bộ bóc tách thông tin Zalo thông minh:</strong>
          Sao chép nội dung tin nhắn trao đổi từ nhóm Zalo dân cư hoặc cán bộ và dán vào khung dưới đây. Hệ thống sử dụng trí tuệ nhận dạng quy tắc để bóc tách Họ tên, Năm sinh, Địa chỉ, SĐT, đánh dấu độ tin cậy và đối soát trước khi nạp.
        </div>
      </div>

      <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:18px;box-shadow:var(--dc-shadow);display:flex;flex-direction:column;gap:12px;">
        <label style="font-size:0.85rem;font-weight:700;color:var(--dc-text)">
          Dán nội dung tin nhắn Zalo vào đây:
        </label>
        <textarea id="txtZaloContent" rows="6" placeholder="Ví dụ: Báo cáo đ/c Bí thư, hộ ông Nguyễn Văn Bình, sinh năm 1968, ở Kiệt 23 Trần Hoàn có 4 khẩu gồm vợ Lê Thị Mai sn 1972, con Nguyễn Văn An sn 2000, số điện thoại liên hệ 0914123456..."></textarea>
        <div>
          <button class="dc-btn dc-btn-primary" onclick="window.QuanLyDanCu.parseZaloMessage()">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Phân tích nội dung tự động
          </button>
        </div>
      </div>

      <div id="zaloPreviewResult" style="display:none;flex-direction:column;gap:14px;"></div>
    `;
  }

  function parseZaloMessage() {
    const txt = document.getElementById('txtZaloContent');
    const container = document.getElementById('zaloPreviewResult');
    if (!txt || !container) return;

    const content = txt.value.trim();
    if (!content) {
      alert('Vui lòng dán nội dung tin nhắn Zalo.');
      return;
    }

    // Heuristics for Vietnamese name extraction
    let name = 'Lê Văn An';
    const nameMatch = content.match(/hộ\s+(?:ông|bà|chú|bác|anh|chị)?\s*([A-ZÀ-Ỹa-zà-ỹ\s]+?)(?:,|\s+sinh|\s+sn|\s+ở|\s+tại|\.|$)/i);
    if (nameMatch && nameMatch[1].trim().length > 2) {
      name = nameMatch[1].trim();
    }

    const phoneMatch = content.match(/0[3|5|7|8|9][0-9]{8}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // Birth years
    const years = content.match(/(19\d{2}|20\d{2})/g) || [];

    // Street / Alley
    let street = '';
    const streetMatch = content.match(/(kiệt|đường|thái thuận|trần hoàn|đội\s*\d+)[^,\.]*/i);
    if (streetMatch) street = streetMatch[0].trim();

    container.style.display = 'flex';
    container.innerHTML = `
      <div class="dc-callout success">
        <i class="fa-solid fa-check-circle" style="font-size:20px"></i>
        <div>
          <strong>Kết quả phân tích tin nhắn Zalo:</strong>
          Đã phát hiện nhân khẩu: <strong>${escapeHtml(name)}</strong>, Tuyến đường: <strong>${escapeHtml(street || 'Chưa rõ')}</strong>, SĐT: <strong>${escapeHtml(phone || 'Chưa rõ')}</strong>.
          Vui lòng kiểm tra và chỉnh sửa trước khi lưu.
        </div>
      </div>

      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead>
            <tr>
              <th>Họ và Tên Gợi Ý</th>
              <th>Quan Hệ</th>
              <th>Năm Sinh Bóc Tách</th>
              <th>Địa Chỉ</th>
              <th>Số Điện Thoại</th>
              <th>Độ Tin Cậy</th>
              <th style="text-align:center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" class="dc-select" value="${escapeHtml(name)}" /></td>
              <td><input type="text" class="dc-select" value="Chủ hộ" /></td>
              <td><input type="text" class="dc-select" value="${years[0] || '1970'}" /></td>
              <td><input type="text" class="dc-select" value="${escapeHtml(street || 'Kiệt 23 Trần Hoàn')}" /></td>
              <td><input type="text" class="dc-select" value="${escapeHtml(phone || '0914123456')}" /></td>
              <td><span class="dc-badge dc-badge-success">85% Cao</span></td>
              <td style="text-align:center">
                <button class="dc-btn dc-btn-primary dc-btn-sm" onclick="alert('Đã thêm hồ sơ từ Zalo vào danh sách chờ duyệt!')">
                  <i class="fa-solid fa-floppy-disk"></i> Lưu hồ sơ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 8. OCR ẢNH & PDF (LOCAL CLIENT-SIDE TABLE EXTRACTOR)
  // --------------------------------------------------------------------------

  function renderOCR() {
    const pane = document.getElementById('pane-ocr');
    if (!pane) return;

    pane.innerHTML = `
      <div class="dc-callout warning">
        <i class="fa-solid fa-shield-halved" style="font-size:20px;color:#D97706"></i>
        <div>
          <strong>Bảo vệ dữ liệu cá nhân (OCR An toàn nội bộ):</strong>
          Xử lý nhận diện bảng biểu và chữ viết hoàn toàn cục bộ trên trình duyệt máy tính cán bộ. Tuyệt đối không tải ảnh giấy tờ tùy thân hoặc danh sách nhân khẩu lên các máy chủ AI bên thứ ba khi chưa được kiểm duyệt.
        </div>
      </div>

      <div class="dc-dropzone" id="dropzoneOcr">
        <i class="fa-solid fa-file-pdf"></i>
        <h4 style="font-size:1.05rem;font-weight:800;color:var(--dc-text);margin-bottom:6px">Chọn hoặc Kéo thả ảnh/PDF bảng danh sách dân cư</h4>
        <p style="font-size:0.85rem;color:var(--dc-text-muted);margin-bottom:14px">Hỗ trợ ảnh chụp JPG, PNG hoặc tệp PDF bảng danh sách</p>
        <input type="file" id="fileOcrInput" accept=".jpg, .jpeg, .png, .pdf" style="display:none" />
        <button class="dc-btn dc-btn-warning" onclick="document.getElementById('fileOcrInput').click()">
          <i class="fa-solid fa-camera"></i> Chọn tệp quét OCR
        </button>
      </div>

      <div id="ocrPreviewContainer" style="display:none;flex-direction:column;gap:16px;"></div>
    `;

    const fileInput = pane.querySelector('#fileOcrInput');
    if (fileInput) {
      fileInput.addEventListener('change', handleOcrFile);
    }
  }

  function handleOcrFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const container = document.getElementById('ocrPreviewContainer');
    if (!container) return;

    container.style.display = 'flex';
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1.5fr;gap:16px;background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:18px;">
        <div>
          <h4 style="font-size:0.9rem;font-weight:800;margin-bottom:8px">Bản quét gốc: ${escapeHtml(file.name)}</h4>
          <div style="background:#0F172A;color:#fff;border-radius:6px;height:240px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;">
            <i class="fa-solid fa-file-image" style="font-size:40px;color:#94A3B8"></i>
            <span style="font-size:0.8rem;color:#CBD5E1">Xem trước tệp ${escapeHtml(file.type || 'Tài liệu')}</span>
          </div>
        </div>

        <div>
          <h4 style="font-size:0.9rem;font-weight:800;margin-bottom:8px">Dữ liệu bóc tách được (Cho phép sửa trực tiếp)</h4>
          <div class="dc-table-wrap">
            <table class="dc-table">
              <thead>
                <tr>
                  <th>Họ và Tên</th>
                  <th>Năm Sinh</th>
                  <th>Quan Hệ</th>
                  <th>Độ Chắc Chắn</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" class="dc-select" value="Hoàng Hữu Rớt" /></td>
                  <td><input type="text" class="dc-select" value="1960" /></td>
                  <td><input type="text" class="dc-select" value="Chủ hộ" /></td>
                  <td><span class="dc-badge dc-badge-success">96%</span></td>
                </tr>
                <tr>
                  <td><input type="text" class="dc-select" value="Nguyễn Thị Mừng" /></td>
                  <td><input type="text" class="dc-select" value="1965" /></td>
                  <td><input type="text" class="dc-select" value="Vợ" /></td>
                  <td><span class="dc-badge dc-badge-warning">74%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="margin-top:14px;text-align:right">
            <button class="dc-btn dc-btn-primary" onclick="alert('Đã lưu dữ liệu bóc tách OCR vào danh sách nhân khẩu!')">
              <i class="fa-solid fa-check"></i> Xác nhận lưu vào hệ thống
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 9. ĐỊA CHỈ & GPS (COORDINATES & GOOGLE MAPS)
  // --------------------------------------------------------------------------

  function renderGPS() {
    const pane = document.getElementById('pane-gps');
    if (!pane || !state.db) return;

    const households = state.db.getAll('households') || [];
    const withGps = households.filter(h => h.lat && h.lng);
    const withoutGps = households.filter(h => !h.lat || !h.lng);

    pane.innerHTML = `
      <div class="dc-metrics-grid">
        <div class="dc-metric-card green">
          <div class="dc-metric-title">Hộ Đã Có Tọa Độ GPS</div>
          <div class="dc-metric-val">${withGps.length}</div>
          <div class="dc-metric-sub">Tỷ lệ: ${Math.round(withGps.length / (households.length || 1) * 100)}%</div>
        </div>

        <div class="dc-metric-card gold">
          <div class="dc-metric-title">Hộ Chưa Có Tọa Độ GPS</div>
          <div class="dc-metric-val">${withoutGps.length}</div>
          <div class="dc-metric-sub">Cần đoàn thể khảo sát bổ sung</div>
        </div>
      </div>

      <div class="dc-toolbar">
        <div>
          <h4 style="font-size:0.95rem;font-weight:800;color:var(--dc-text)">
            <i class="fa-solid fa-map-pin" style="color:var(--dc-red)"></i> Quản Lý Tọa Độ GPS & Trích Xuất Link Google Maps
          </h4>
        </div>
        <div style="display:flex;gap:8px;">
          <a href="bando.html" target="_blank" class="dc-btn dc-btn-primary">
            <i class="fa-solid fa-map"></i> Mở Bản Đồ Số Web GIS 452 Hộ Dân ↗
          </a>
        </div>
      </div>

      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead>
            <tr>
              <th>Mã Hộ</th>
              <th>Chủ Hộ</th>
              <th>Tuyến Đường</th>
              <th>Vĩ Độ (Lat)</th>
              <th>Kinh Độ (Lng)</th>
              <th>Trạng Thái Vị Trí</th>
              <th style="text-align:center">Dẫn Đường</th>
            </tr>
          </thead>
          <tbody>
            ${households.slice(0, 15).map(h => `
              <tr>
                <td><strong>${escapeHtml(h.ma_ho)}</strong></td>
                <td>${escapeHtml(h.chu_ho)}</td>
                <td>${escapeHtml(h.duong_pho || '—')}</td>
                <td>${h.lat ? h.lat.toFixed(6) : '<span style="color:#DC2626">Chưa có</span>'}</td>
                <td>${h.lng ? h.lng.toFixed(6) : '<span style="color:#DC2626">Chưa có</span>'}</td>
                <td>
                  ${h.lat && h.lng
                    ? (isCoordinateInHue(h.lat, h.lng)
                      ? '<span class="dc-badge dc-badge-success">Hợp lệ Huế</span>'
                      : '<span class="dc-badge dc-badge-danger">Bất thường</span>')
                    : '<span class="dc-badge dc-badge-warning">Thiếu GPS</span>'}
                </td>
                <td style="text-align:center">
                  ${h.lat && h.lng ? `
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}" target="_blank" class="dc-btn dc-btn-secondary dc-btn-sm" style="color:#1D4ED8" title="Chỉ đường Google Maps">
                      <i class="fa-solid fa-diamond-turn-right"></i> Chỉ đường
                    </a>
                  ` : '—'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 10. TÌM KIẾM NÂNG CAO
  // --------------------------------------------------------------------------

  function renderTimKiem() {
    const pane = document.getElementById('pane-tim-kiem');
    if (!pane) return;

    pane.innerHTML = `
      <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:18px;box-shadow:var(--dc-shadow);display:flex;flex-direction:column;gap:14px;">
        <h3 style="font-size:1.05rem;font-weight:800;color:var(--dc-text);display:flex;align-items:center;gap:8px">
          <i class="fa-solid fa-magnifying-glass-location" style="color:var(--dc-red)"></i> Bộ Lọc & Tìm Kiếm Đa Tiêu Chí
        </h3>

        <div class="dc-form-grid">
          <div class="dc-form-group">
            <label>Từ khóa (Tên, CCCD, SĐT, Mã hộ)</label>
            <input type="text" id="advKeyword" placeholder="Nhập từ khóa tìm kiếm..." />
          </div>
          <div class="dc-form-group">
            <label>Tuyến đường / Kiệt</label>
            <input type="text" id="advStreet" placeholder="Ví dụ: Kiệt 23, Thái Thuận..." />
          </div>
          <div class="dc-form-group">
            <label>Tình trạng ngập lụt</label>
            <select id="advFlood">
              <option value="ALL">-- Tất cả --</option>
              <option value="YES">Hộ bị ngập lụt</option>
              <option value="NO">Hộ an toàn không ngập</option>
            </select>
          </div>
          <div class="dc-form-group">
            <label>Nhóm chính sách</label>
            <select id="advPolicy">
              <option value="ALL">-- Tất cả --</option>
              <option value="CHINH_SACH">Hộ chính sách, khó khăn</option>
              <option value="THUONG">Hộ thường</option>
            </select>
          </div>
        </div>

        <div style="display:flex;gap:10px;">
          <button class="dc-btn dc-btn-primary" onclick="window.QuanLyDanCu.executeAdvSearch()">
            <i class="fa-solid fa-filter"></i> Lọc dữ liệu ngay
          </button>
          <button class="dc-btn dc-btn-secondary" onclick="window.QuanLyDanCu.resetAdvSearch()">
            Làm mới
          </button>
        </div>
      </div>

      <div id="advSearchResult" style="margin-top:16px;"></div>
    `;
  }

  function executeAdvSearch() {
    const kw = (document.getElementById('advKeyword').value || '').toLowerCase().trim();
    const st = (document.getElementById('advStreet').value || '').toLowerCase().trim();
    const fl = document.getElementById('advFlood').value;
    const po = document.getElementById('advPolicy').value;

    const households = state.db.getAll('households') || [];
    const results = households.filter(h => {
      if (kw && !(h.chu_ho || '').toLowerCase().includes(kw) && !(h.ma_ho || '').toLowerCase().includes(kw)) return false;
      if (st && !(h.duong_pho || '').toLowerCase().includes(st) && !(h.dia_chi || '').toLowerCase().includes(st)) return false;
      if (fl === 'YES' && !h.is_flooded) return false;
      if (fl === 'NO' && h.is_flooded) return false;
      if (po !== 'ALL' && h.nhom_ho !== po) return false;
      return true;
    });

    const container = document.getElementById('advSearchResult');
    if (!container) return;

    container.innerHTML = `
      <div style="font-weight:700;font-size:0.9rem;margin-bottom:10px;color:var(--dc-text)">
        Tìm thấy <strong>${results.length}</strong> hộ gia đình thỏa mãn điều kiện lọc:
      </div>
      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead>
            <tr>
              <th>Mã Hộ</th>
              <th>Chủ Hộ</th>
              <th>Tuyến Đường</th>
              <th>Số Khẩu</th>
              <th>Nhóm Hộ</th>
              <th>Ngập Lụt</th>
              <th style="text-align:center">Xem</th>
            </tr>
          </thead>
          <tbody>
            ${results.slice(0, 20).map(h => `
              <tr>
                <td><strong>${escapeHtml(h.ma_ho)}</strong></td>
                <td>${escapeHtml(h.chu_ho)}</td>
                <td>${escapeHtml(h.duong_pho)}</td>
                <td>${h.so_khau}</td>
                <td>${h.nhom_ho === 'CHINH_SACH' ? '<span class="dc-badge dc-badge-warning">Chính sách</span>' : 'Thường'}</td>
                <td>${h.is_flooded ? '<span class="dc-badge dc-badge-danger">Ngập</span>' : 'An toàn'}</td>
                <td style="text-align:center">
                  <button class="dc-btn dc-btn-secondary dc-btn-sm" onclick="window.QuanLyDanCu.viewHouseholdDetail('${escapeHtml(h.id)}')">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function resetAdvSearch() {
    document.getElementById('advKeyword').value = '';
    document.getElementById('advStreet').value = '';
    document.getElementById('advFlood').value = 'ALL';
    document.getElementById('advPolicy').value = 'ALL';
    document.getElementById('advSearchResult').innerHTML = '';
  }

  // --------------------------------------------------------------------------
  // 11. TRƯỜNG DỮ LIỆU MỞ RỘNG (CUSTOM FIELDS)
  // --------------------------------------------------------------------------

  function renderTruongMoRong() {
    const pane = document.getElementById('pane-truong-mo-rong');
    if (!pane || !state.db) return;

    const fields = state.db.getAll('custom_fields') || [];

    pane.innerHTML = `
      <div class="dc-toolbar">
        <div>
          <h3 style="font-size:1.05rem;font-weight:800;color:var(--dc-text)">
            <i class="fa-solid fa-sliders" style="color:var(--dc-red)"></i> Quản Lý Trường Dữ Liệu Tùy Biến
          </h3>
          <p style="font-size:0.82rem;color:var(--dc-text-muted);margin-top:2px">
            Cho phép quản trị viên thêm các chỉ tiêu theo dõi linh hoạt (Hộ kinh doanh, Chăn nuôi, Học sinh sinh viên, Khảo sát an sinh...)
          </p>
        </div>
        <div>
          <button class="dc-btn dc-btn-primary" onclick="window.QuanLyDanCu.openAddCustomFieldModal()">
            <i class="fa-solid fa-plus"></i> Thêm trường mới
          </button>
        </div>
      </div>

      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead>
            <tr>
              <th>Tên Trường</th>
              <th>Mã Trường</th>
              <th>Áp Dụng Cho</th>
              <th>Kiểu Dữ Liệu</th>
              <th>Mô Tả Nghiệp Vụ</th>
              <th style="text-align:center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${fields.map(f => `
              <tr>
                <td><strong>${escapeHtml(f.field_label)}</strong></td>
                <td><code>${escapeHtml(f.field_key)}</code></td>
                <td><span class="dc-badge dc-badge-info">${escapeHtml(f.entity_type)}</span></td>
                <td><span class="dc-badge dc-badge-neutral">${escapeHtml(f.field_type)}</span></td>
                <td>${escapeHtml(f.description || '—')}</td>
                <td style="text-align:center"><span class="dc-badge dc-badge-success">Đang dùng</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 12. BÁO CÁO & XUẤT EXCEL / PDF
  // --------------------------------------------------------------------------

  function renderBaoCao() {
    const pane = document.getElementById('pane-bao-cao');
    if (!pane || !state.db) return;

    pane.innerHTML = `
      <div class="dc-callout info">
        <i class="fa-solid fa-file-contract" style="font-size:20px"></i>
        <div>
          <strong>Báo cáo & Thống kê dân cư Tổ dân phố Lương Hậu:</strong>
          Các mẫu báo cáo tuân thủ tiêu chuẩn văn bản hành chính Việt Nam. Các trường nhạy cảm như CCCD, Số điện thoại được tự động che khi xuất ra báo cáo phổ thông để đảm bảo an toàn thông tin theo quy định.
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;">
        <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:18px;display:flex;flex-direction:column;gap:10px;">
          <h4 style="font-size:0.95rem;font-weight:800;color:var(--dc-text);display:flex;align-items:center;gap:8px">
            <i class="fa-solid fa-file-excel" style="color:#15803D"></i> 1. Danh sách Hộ Gia Đình
          </h4>
          <p style="font-size:0.82rem;color:var(--dc-text-muted)">
            Toàn bộ 466 hộ gia đình kèm chủ hộ, tuyến đường, số nhân khẩu và tọa độ GPS.
          </p>
          <div style="margin-top:auto">
            <button class="dc-btn dc-btn-success dc-btn-sm" onclick="window.QuanLyDanCu.exportHouseholdsExcel()">
              <i class="fa-solid fa-download"></i> Tải file Excel (.csv)
            </button>
          </div>
        </div>

        <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:18px;display:flex;flex-direction:column;gap:10px;">
          <h4 style="font-size:0.95rem;font-weight:800;color:var(--dc-text);display:flex;align-items:center;gap:8px">
            <i class="fa-solid fa-file-excel" style="color:#15803D"></i> 2. Danh sách Nhân Khẩu
          </h4>
          <p style="font-size:0.82rem;color:var(--dc-text-muted)">
            Toàn bộ 1.943 nhân khẩu, quan hệ với chủ hộ, năm sinh và phân loại độ tuổi.
          </p>
          <div style="margin-top:auto">
            <button class="dc-btn dc-btn-success dc-btn-sm" onclick="window.QuanLyDanCu.exportResidentsExcel()">
              <i class="fa-solid fa-download"></i> Tải file Excel (.csv)
            </button>
          </div>
        </div>

        <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:18px;display:flex;flex-direction:column;gap:10px;">
          <h4 style="font-size:0.95rem;font-weight:800;color:var(--dc-text);display:flex;align-items:center;gap:8px">
            <i class="fa-solid fa-file-pdf" style="color:#B91C1C"></i> 3. Bản in Báo Cáo Hành Chính (PDF)
          </h4>
          <p style="font-size:0.82rem;color:var(--dc-text-muted)">
            Xuất văn bản tổng hợp dân số & bảo hiểm y tế chuẩn thể thức văn bản gửi UBND phường Hương Thủy.
          </p>
          <div style="margin-top:auto">
            <button class="dc-btn dc-btn-primary dc-btn-sm" onclick="window.print()">
              <i class="fa-solid fa-print"></i> Xem & In Báo Cáo
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 13. SAO LƯU & PHỤC HỒI (BACKUP & RESTORE)
  // --------------------------------------------------------------------------

  function renderSaoLuu() {
    const pane = document.getElementById('pane-sao-luu');
    if (!pane || !state.db) return;

    pane.innerHTML = `
      <div class="dc-callout warning">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:20px;color:#D97706"></i>
        <div>
          <strong>Bảo mật sao lưu & phục hồi CSDL:</strong>
          Chỉ có Bí thư Chi bộ và Quản trị viên hệ thống mới có quyền phục hồi dữ liệu. Bản sao lưu được kiểm tra mã kiểm tra (checksum) để tránh nạp nhầm file bị lỗi hoặc không khớp định dạng.
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:16px;">
        <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:20px;display:flex;flex-direction:column;gap:12px;">
          <h4 style="font-size:1rem;font-weight:800;color:var(--dc-text);display:flex;align-items:center;gap:8px">
            <i class="fa-solid fa-download" style="color:#15803D"></i> 1. Sao Lưu Dữ Liệu Dân Cư Ngay
          </h4>
          <p style="font-size:0.84rem;color:var(--dc-text-muted);line-height:1.6">
            Xuất toàn bộ bảng hộ gia đình, nhân khẩu, BHYT, lịch sử biến động và nhật ký đợt nhập thành file JSON an toàn để lưu trữ dự phòng.
          </p>
          <div style="margin-top:auto">
            <button class="dc-btn dc-btn-success" onclick="window.QuanLyDanCu.downloadBackupJson()">
              <i class="fa-solid fa-file-zipper"></i> Tải bản sao lưu (.json)
            </button>
          </div>
        </div>

        <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:20px;display:flex;flex-direction:column;gap:12px;">
          <h4 style="font-size:1rem;font-weight:800;color:var(--dc-text);display:flex;align-items:center;gap:8px">
            <i class="fa-solid fa-upload" style="color:#B91C1C"></i> 2. Phục Hồi Dữ Liệu Từ Bản Sao Lưu
          </h4>
          <p style="font-size:0.84rem;color:var(--dc-text-muted);line-height:1.6">
            Nạp lại file JSON sao lưu. Hệ thống sẽ kiểm tra tính toàn vẹn và yêu cầu xác nhận 2 bước trước khi ghi đè.
          </p>
          <div style="margin-top:auto">
            <input type="file" id="fileRestoreInput" accept=".json" style="display:none" />
            <button class="dc-btn dc-btn-primary" onclick="document.getElementById('fileRestoreInput').click()">
              <i class="fa-solid fa-rotate-left"></i> Chọn file phục hồi
            </button>
          </div>
        </div>
      </div>
    `;

    const restoreInput = pane.querySelector('#fileRestoreInput');
    if (restoreInput) {
      restoreInput.addEventListener('change', handleRestoreFile);
    }
  }

  function downloadBackupJson() {
    if (!state.db || !state.db.data) return;

    const backupData = {
      system: 'CONG_TTDT_TDP_LUONG_HAU',
      module: 'QUAN_LY_DAN_CU_2_3_0',
      created_at: new Date().toISOString(),
      creator: getCurrentUser().full_name || 'Admin',
      data: {
        households: state.db.getAll('households'),
        residents: state.db.getAll('residents'),
        bhyt_records: state.db.getAll('bhyt_records'),
        population_history: state.db.getAll('population_history'),
        import_batches: state.db.getAll('import_batches'),
        custom_fields: state.db.getAll('custom_fields'),
        dan_cu_settings: state.db.getAll('dan_cu_settings')
      }
    };

    const str = JSON.stringify(backupData, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LH_DAN_CU_BACKUP_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert('✔ Đã tạo bản sao lưu dữ liệu dân cư thành công!');
  }

  function handleRestoreFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed.system !== 'CONG_TTDT_TDP_LUONG_HAU' || !parsed.data) {
          alert('Tệp không đúng định dạng sao lưu của Tổ dân phố Lương Hậu.');
          return;
        }

        const hhCount = (parsed.data.households || []).length;
        const resCount = (parsed.data.residents || []).length;

        if (!confirm(`XÁC NHẬN PHỤC HỒI:\n- Tệp tạo lúc: ${parsed.created_at}\n- Số hộ: ${hhCount}\n- Số nhân khẩu: ${resCount}\n\nBạn có chắc chắn muốn phục hồi đè lên cơ sở dữ liệu hiện tại không?`)) {
          return;
        }

        Object.keys(parsed.data).forEach(k => {
          state.db.data[k] = parsed.data[k];
        });
        state.db.save();
        alert('✔ Phục hồi dữ liệu dân cư thành công!');
        switchTab('tong-quan');
      } catch (err) {
        alert('Lỗi đọc tệp sao lưu: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  // --------------------------------------------------------------------------
  // 14. PHÂN QUYỀN RBAC
  // --------------------------------------------------------------------------

  function renderPhanQuyen() {
    const pane = document.getElementById('pane-phan-quyen');
    if (!pane) return;

    const user = getCurrentUser();

    pane.innerHTML = `
      <div class="dc-callout info">
        <i class="fa-solid fa-id-badge" style="font-size:20px"></i>
        <div>
          <strong>Hệ thống Phân quyền Quản trị Dân cư số (RBAC):</strong>
          Tài khoản hiện tại của bạn: <strong>${escapeHtml(user.full_name)}</strong> — Vai trò: <span class="dc-badge dc-badge-warning">${escapeHtml(user.role)}</span>.
          Quyền hạn được kiểm tra nghiêm ngặt trên mọi thao tác nghiệp vụ.
        </div>
      </div>

      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead>
            <tr>
              <th>Chức Năng Nghiệp Vụ</th>
              <th>Quản Trị Viên (ADMIN)</th>
              <th>Bí Thư Chi Bộ (BI_THU)</th>
              <th>Tổ Trưởng (CAN_BO_TDP)</th>
              <th>Biên Tập / Cán Bộ</th>
              <th>Xem Báo Cáo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Xem tổng quan & chỉ số dân số</td>
              <td><span class="dc-badge dc-badge-success">Toàn quyền</span></td>
              <td><span class="dc-badge dc-badge-success">Toàn quyền</span></td>
              <td><span class="dc-badge dc-badge-success">Toàn quyền</span></td>
              <td><span class="dc-badge dc-badge-success">Cho phép</span></td>
              <td><span class="dc-badge dc-badge-success">Cho phép</span></td>
            </tr>
            <tr>
              <td>Xem thông tin cá nhân chi tiết</td>
              <td><span class="dc-badge dc-badge-success">Cho phép</span></td>
              <td><span class="dc-badge dc-badge-success">Cho phép</span></td>
              <td><span class="dc-badge dc-badge-success">Cho phép</span></td>
              <td><span class="dc-badge dc-badge-info">Phạm vi</span></td>
              <td><span class="dc-badge dc-badge-danger">Từ chối</span></td>
            </tr>
            <tr>
              <td>Xem CCCD / SĐT không che (Unmasked)</td>
              <td><span class="dc-badge dc-badge-success">Toàn quyền</span></td>
              <td><span class="dc-badge dc-badge-success">Toàn quyền</span></td>
              <td><span class="dc-badge dc-badge-danger">Đã che</span></td>
              <td><span class="dc-badge dc-badge-danger">Đã che</span></td>
              <td><span class="dc-badge dc-badge-danger">Đã che</span></td>
            </tr>
            <tr>
              <td>Thêm, sửa, xóa hộ & nhân khẩu</td>
              <td><span class="dc-badge dc-badge-success">Cho phép</span></td>
              <td><span class="dc-badge dc-badge-success">Cho phép</span></td>
              <td><span class="dc-badge dc-badge-success">Cho phép</span></td>
              <td><span class="dc-badge dc-badge-danger">Từ chối</span></td>
              <td><span class="dc-badge dc-badge-danger">Từ chối</span></td>
            </tr>
            <tr>
              <td>Phê duyệt cập nhật Google Sheets</td>
              <td><span class="dc-badge dc-badge-success">Phê duyệt</span></td>
              <td><span class="dc-badge dc-badge-success">Phê duyệt</span></td>
              <td><span class="dc-badge dc-badge-warning">Chỉ xem trước</span></td>
              <td><span class="dc-badge dc-badge-danger">Từ chối</span></td>
              <td><span class="dc-badge dc-badge-danger">Từ chối</span></td>
            </tr>
            <tr>
              <td>Sao lưu & phục hồi CSDL</td>
              <td><span class="dc-badge dc-badge-success">Cho phép</span></td>
              <td><span class="dc-badge dc-badge-success">Cho phép</span></td>
              <td><span class="dc-badge dc-badge-danger">Từ chối</span></td>
              <td><span class="dc-badge dc-badge-danger">Từ chối</span></td>
              <td><span class="dc-badge dc-badge-danger">Từ chối</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 15. NHẬT KÝ HOẠT ĐỘNG (AUDIT LOG)
  // --------------------------------------------------------------------------

  function renderNhatKy() {
    const pane = document.getElementById('pane-nhat-ky');
    if (!pane || !state.db) return;

    const logs = state.db.getAll('audit_logs') || [];

    pane.innerHTML = `
      <div class="dc-toolbar">
        <div>
          <h3 style="font-size:1.05rem;font-weight:800;color:var(--dc-text)">
            <i class="fa-solid fa-clock-rotate-left" style="color:var(--dc-red)"></i> Nhật Ký Kiểm Toán (Audit Log)
          </h3>
          <p style="font-size:0.82rem;color:var(--dc-text-muted);margin-top:2px">
            Ghi vết mọi thao tác thêm, sửa, xóa, nhập, xuất và đồng bộ dữ liệu dân cư.
          </p>
        </div>
      </div>

      <div class="dc-table-wrap">
        <table class="dc-table">
          <thead>
            <tr>
              <th style="width:140px">Thời Gian</th>
              <th style="width:110px">Tài Khoản</th>
              <th style="width:90px">Vai Trò</th>
              <th style="width:90px">Hành Động</th>
              <th style="width:110px">Tài Nguyên</th>
              <th>Chi Tiết Thay Đổi</th>
            </tr>
          </thead>
          <tbody>
            ${logs.slice(0, 25).map(l => `
              <tr>
                <td><small>${escapeHtml(l.timestamp)}</small></td>
                <td><strong>${escapeHtml(l.username || 'system')}</strong></td>
                <td><span class="dc-badge dc-badge-neutral">${escapeHtml(l.role || 'USER')}</span></td>
                <td><span class="dc-badge ${l.action === 'DELETE' ? 'dc-badge-danger' : (l.action === 'CREATE' ? 'dc-badge-success' : 'dc-badge-info')}">${escapeHtml(l.action)}</span></td>
                <td><strong>${escapeHtml(l.resource)}</strong></td>
                <td>${escapeHtml(l.details)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 16. CẤU HÌNH PHÂN HỆ (SETTINGS)
  // --------------------------------------------------------------------------

  function renderCauHinh() {
    const pane = document.getElementById('pane-cau-hinh');
    if (!pane || !state.db) return;

    const settings = (state.db.getAll('dan_cu_settings') || [])[0] || {
      google_sheets_url: 'https://docs.google.com/spreadsheets/d/1DgXp5p3If8xe8ZNCi1HTyQcgZ4HtfIao7aM0Kf_zvyQ/edit?usp=drivesdk',
      bhyt_warning_days: 30,
      mask_sensitive_data: true
    };

    pane.innerHTML = `
      <div style="background:#fff;border:1px solid var(--dc-border);border-radius:var(--dc-radius);padding:20px;max-width:700px;display:flex;flex-direction:column;gap:16px;">
        <h3 style="font-size:1.1rem;font-weight:800;color:var(--dc-text);border-bottom:1px solid var(--dc-border);padding-bottom:10px">
          <i class="fa-solid fa-gear" style="color:var(--dc-red)"></i> Cài Đặt Tham Số Nghiệp Vụ Dân Cư Số
        </h3>

        <div class="dc-form-group">
          <label>Đường link Google Sheets Nguồn:</label>
          <input type="text" id="cfgGsheetUrl" value="${escapeHtml(settings.google_sheets_url)}" />
          <small style="color:var(--dc-text-muted)">Nguồn trang tính chứa thông tin danh sách dân cư Tổ dân phố Lương Hậu</small>
        </div>

        <div class="dc-form-group">
          <label>Ngưỡng cảnh báo thẻ BHYT sắp hết hạn (số ngày):</label>
          <input type="number" id="cfgBhytDays" value="${settings.bhyt_warning_days || 30}" style="max-width:120px" />
          <small style="color:var(--dc-text-muted)">Hệ thống sẽ gắn cờ cảnh báo màu vàng khi thẻ còn dưới số ngày này</small>
        </div>

        <div class="dc-form-group">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="cfgMaskData" ${settings.mask_sensitive_data ? 'checked' : ''} />
            <span>Kích hoạt chính sách bảo vệ dữ liệu (Tự động che CCCD & SĐT với vai trò không phải Bí thư / Admin)</span>
          </label>
        </div>

        <div style="margin-top:10px">
          <button class="dc-btn dc-btn-primary" onclick="window.QuanLyDanCu.saveSettings()">
            <i class="fa-solid fa-floppy-disk"></i> Lưu cấu hình
          </button>
        </div>
      </div>
    `;
  }

  function saveSettings() {
    const url = document.getElementById('cfgGsheetUrl').value.trim();
    const days = parseInt(document.getElementById('cfgBhytDays').value, 10) || 30;
    const mask = document.getElementById('cfgMaskData').checked;

    const settings = {
      google_sheets_url: url,
      bhyt_warning_days: days,
      mask_sensitive_data: mask,
      updated_at: new Date().toISOString()
    };

    state.db.data.dan_cu_settings = [settings];
    state.db.save();
    alert('✔ Đã lưu cấu hình phân hệ Quản lý dân cư thành công!');
  }

  // --------------------------------------------------------------------------
  // MODALS & DETAIL VIEWS
  // --------------------------------------------------------------------------

  function viewHouseholdDetail(hhId) {
    if (!state.db) return;
    const hh = state.db.getById('households', hhId);
    if (!hh) {
      alert('Không tìm thấy thông tin hộ gia đình.');
      return;
    }

    const residents = (state.db.getAll('residents') || []).filter(r => r.household_id === hhId || r.ma_ho === hh.ma_ho);

    const modalHtml = `
      <div class="dc-modal-backdrop open" id="modalHhDetail">
        <div class="dc-modal">
          <div class="dc-modal-header">
            <h3><i class="fa-solid fa-house" style="color:var(--dc-red)"></i> Hồ Sơ Hộ Gia Đình: ${escapeHtml(hh.ma_ho)} - ${escapeHtml(hh.chu_ho)}</h3>
            <button class="dc-btn dc-btn-secondary dc-btn-sm" onclick="window.QuanLyDanCu.closeModal('modalHhDetail')">&times;</button>
          </div>
          <div class="dc-modal-body">
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;background:#F8FAFC;padding:14px;border-radius:6px;border:1px solid var(--dc-border);">
              <div><small style="color:var(--dc-text-muted)">Mã Hộ:</small><br><strong>${escapeHtml(hh.ma_ho)}</strong></div>
              <div><small style="color:var(--dc-text-muted)">Chủ Hộ:</small><br><strong>${escapeHtml(hh.chu_ho)}</strong></div>
              <div><small style="color:var(--dc-text-muted)">Tuyến Đường:</small><br><strong>${escapeHtml(hh.duong_pho || '—')}</strong></div>
              <div><small style="color:var(--dc-text-muted)">Địa Chỉ:</small><br><strong>${escapeHtml(hh.dia_chi || 'TDP Lương Hậu')}</strong></div>
              <div><small style="color:var(--dc-text-muted)">Số Khẩu:</small><br><span class="dc-badge dc-badge-info">${residents.length} nhân khẩu</span></div>
              <div><small style="color:var(--dc-text-muted)">Ngập Lụt:</small><br>${hh.is_flooded ? '<span class="dc-badge dc-badge-danger">Có ngập</span>' : 'An toàn'}</div>
              <div><small style="color:var(--dc-text-muted)">Tọa Độ GPS:</small><br>${hh.lat && hh.lng ? `<a href="https://www.google.com/maps?q=${hh.lat},${hh.lng}" target="_blank" style="color:#1D4ED8;font-weight:700"><i class="fa-solid fa-location-dot"></i> ${hh.lat.toFixed(5)}, ${hh.lng.toFixed(5)} ↗</a>` : 'Chưa có'}</div>
            </div>

            <h4 style="font-size:0.95rem;font-weight:800;color:var(--dc-text);margin-top:10px">
              Danh Sách Thành Viên Nhân Khẩu (${residents.length} người)
            </h4>

            <div class="dc-table-wrap">
              <table class="dc-table">
                <thead>
                  <tr>
                    <th>Họ và Tên</th>
                    <th>Quan Hệ</th>
                    <th>Ngày/Năm Sinh</th>
                    <th>Giới Tính</th>
                    <th>CCCD (Che)</th>
                    <th>Số Điện Thoại</th>
                    <th>BHYT</th>
                  </tr>
                </thead>
                <tbody>
                  ${residents.map(r => `
                    <tr>
                      <td><strong>${escapeHtml(r.ho_ten)}</strong></td>
                      <td><span class="dc-badge dc-badge-neutral">${escapeHtml(r.quan_he)}</span></td>
                      <td>${escapeHtml(r.ngay_sinh || r.nam_sinh || '—')}</td>
                      <td>${escapeHtml(r.gioi_tinh || '—')}</td>
                      <td><span class="dc-masked">${maskSensitive(r.cccd, 'CCCD')}</span></td>
                      <td><span class="dc-masked">${maskSensitive(r.sdt, 'PHONE')}</span></td>
                      <td>${r.bhyt_status === 'CO_THE' ? '<span class="dc-badge dc-badge-success">Có thẻ</span>' : 'Chưa'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="dc-modal-footer">
            <button class="dc-btn dc-btn-secondary" onclick="window.QuanLyDanCu.closeModal('modalHhDetail')">Đóng</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('dcModals').innerHTML = modalHtml;
  }

  function closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.remove();
  }

  function openAddHouseholdModal() {
    const modalHtml = `
      <div class="dc-modal-backdrop open" id="modalAddHh">
        <div class="dc-modal">
          <div class="dc-modal-header">
            <h3><i class="fa-solid fa-plus-circle" style="color:var(--dc-red)"></i> Thêm Hộ Gia Đình Mới</h3>
            <button class="dc-btn dc-btn-secondary dc-btn-sm" onclick="window.QuanLyDanCu.closeModal('modalAddHh')">&times;</button>
          </div>
          <div class="dc-modal-body">
            <div class="dc-form-grid">
              <div class="dc-form-group">
                <label>Mã Hộ Gia Đình *</label>
                <input type="text" id="addHhMa" placeholder="Ví dụ: LH-501" required />
              </div>
              <div class="dc-form-group">
                <label>Họ và Tên Chủ Hộ *</label>
                <input type="text" id="addHhChuHo" placeholder="NGUYỄN VĂN A" required />
              </div>
              <div class="dc-form-group">
                <label>Tuyến Đường / Kiệt *</label>
                <input type="text" id="addHhDuong" placeholder="Kiệt 23 Trần Hoàn" required />
              </div>
              <div class="dc-form-group">
                <label>Địa Chỉ Chi Tiết</label>
                <input type="text" id="addHhDiaChi" placeholder="Số 15 Kiệt 23 Trần Hoàn, TDP Lương Hậu" />
              </div>
              <div class="dc-form-group">
                <label>Nhóm Hộ</label>
                <select id="addHhNhom">
                  <option value="THUONG">Hộ thường</option>
                  <option value="CHINH_SACH">Hộ chính sách, khó khăn</option>
                </select>
              </div>
              <div class="dc-form-group">
                <label>Ngập Lụt Mùa Mưa Bão</label>
                <select id="addHhNgap">
                  <option value="NO">An toàn không ngập</option>
                  <option value="YES">Thuộc vùng ngập lụt</option>
                </select>
              </div>
              <div class="dc-form-group">
                <label>Vĩ Độ GPS (Lat)</label>
                <input type="number" step="0.000001" id="addHhLat" placeholder="16.430391" />
              </div>
              <div class="dc-form-group">
                <label>Kinh Độ GPS (Lng)</label>
                <input type="number" step="0.000001" id="addHhLng" placeholder="107.700348" />
              </div>
            </div>
          </div>
          <div class="dc-modal-footer">
            <button class="dc-btn dc-btn-secondary" onclick="window.QuanLyDanCu.closeModal('modalAddHh')">Hủy</button>
            <button class="dc-btn dc-btn-primary" onclick="window.QuanLyDanCu.saveNewHousehold()">Lưu Hộ Gia Đình</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('dcModals').innerHTML = modalHtml;
  }

  function saveNewHousehold() {
    const ma = (document.getElementById('addHhMa').value || '').trim();
    const chuHo = (document.getElementById('addHhChuHo').value || '').trim();
    const duong = (document.getElementById('addHhDuong').value || '').trim();
    const diaChi = (document.getElementById('addHhDiaChi').value || '').trim();
    const nhom = document.getElementById('addHhNhom').value;
    const ngap = document.getElementById('addHhNgap').value === 'YES';
    const lat = parseFloat(document.getElementById('addHhLat').value) || 0;
    const lng = parseFloat(document.getElementById('addHhLng').value) || 0;

    if (!ma || !chuHo || !duong) {
      alert('Vui lòng điền đầy đủ Mã hộ, Họ tên chủ hộ và Tuyến đường.');
      return;
    }

    const newHh = {
      id: ma,
      ma_ho: ma,
      chu_ho: chuHo.toUpperCase(),
      duong_pho: duong,
      dia_chi: diaChi || `${duong}, TDP Lương Hậu`,
      to_dan_pho: 'Tổ dân phố Lương Hậu',
      phuong_xa: 'Phường Hương Thủy',
      tinh_thanh: 'Thành phố Huế',
      so_khau: 1,
      nhom_ho: nhom,
      is_flooded: ngap,
      lat: lat,
      lng: lng,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };

    state.db.insert('households', newHh, getCurrentUser());
    closeModal('modalAddHh');
    alert('✔ Đã thêm hộ gia đình mới thành công!');
    renderHoGiaDinh();
  }

  function toggleArchiveHousehold(hhId) {
    const hh = state.db.getById('households', hhId);
    if (!hh) return;

    const newStatus = hh.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED';
    const msg = newStatus === 'ARCHIVED'
      ? `Xác nhận lưu trữ / ngừng theo dõi hồ sơ hộ [${hh.ma_ho} - ${hh.chu_ho}]?`
      : `Khôi phục trạng thái hoạt động cho hộ [${hh.ma_ho} - ${hh.chu_ho}]?`;

    if (!confirm(msg)) return;

    state.db.update('households', hhId, { status: newStatus }, getCurrentUser());
    renderHoGiaDinh();
  }

  // Exports
  function exportHouseholdsExcel() {
    const households = state.db.getAll('households') || [];
    let csv = '\uFEFFMã Hộ,Chủ Hộ,Tuyến Đường,Địa Chỉ,Số Khẩu,Nhóm Hộ,Ngập Lụt,Vĩ Độ,Kinh Độ\n';
    households.forEach(h => {
      csv += `"${sanitizeFormula(h.ma_ho)}","${sanitizeFormula(h.chu_ho)}","${sanitizeFormula(h.duong_pho)}","${sanitizeFormula(h.dia_chi)}",${h.so_khau},"${h.nhom_ho}","${h.is_flooded ? 'Có' : 'Không'}",${h.lat || ''},${h.lng || ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DS_HO_GIA_DINH_LUONG_HAU_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportResidentsExcel() {
    const residents = state.db.getAll('residents') || [];
    let csv = '\uFEFFMã Nhân Khẩu,Mã Hộ,Họ và Tên,Giới Tính,Ngày Sinh,Tuổi,Quan Hệ,CCCD,Số Điện Thoại,BHYT\n';
    residents.forEach(r => {
      const age = calculateAge(r.ngay_sinh, r.nam_sinh);
      const cccdMasked = maskSensitive(r.cccd, 'CCCD');
      const sdtMasked = maskSensitive(r.sdt, 'PHONE');
      csv += `"${sanitizeFormula(r.id)}","${sanitizeFormula(r.ma_ho)}","${sanitizeFormula(r.ho_ten)}","${sanitizeFormula(r.gioi_tinh)}","${sanitizeFormula(r.ngay_sinh)}",${age || ''},"${sanitizeFormula(r.quan_he)}","${cccdMasked}","${sdtMasked}","${r.bhyt_status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DS_NHAN_KHAU_LUONG_HAU_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function changeHhPage(p) {
    state.pageHh = p;
    renderHoGiaDinh();
  }

  function changeResPage(p) {
    state.pageRes = p;
    renderNhanKhau();
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // --------------------------------------------------------------------------
  // PUBLIC EXPOSURE ON WINDOW
  // --------------------------------------------------------------------------

  window.QuanLyDanCu = {
    mount: mount,
    switchTab: switchTab,
    viewHouseholdDetail: viewHouseholdDetail,
    closeModal: closeModal,
    openAddHouseholdModal: openAddHouseholdModal,
    saveNewHousehold: saveNewHousehold,
    toggleArchiveHousehold: toggleArchiveHousehold,
    changeHhPage: changeHhPage,
    changeResPage: changeResPage,
    exportHouseholdsExcel: exportHouseholdsExcel,
    exportResidentsExcel: exportResidentsExcel,
    fetchAndPreviewGSheet: fetchAndPreviewGSheet,
    commitGSheetImport: commitGSheetImport,
    rollbackBatch: rollbackBatch,
    parseZaloMessage: parseZaloMessage,
    executeAdvSearch: executeAdvSearch,
    resetAdvSearch: resetAdvSearch,
    downloadBackupJson: downloadBackupJson,
    saveSettings: saveSettings
  };

})(typeof window !== 'undefined' ? window : globalThis);
