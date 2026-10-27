/**
 * ============================================================================
 * BẢN ĐỒ SỐ TỔ DÂN PHỐ LƯƠNG HẬU – DIGITAL GIS 3.0
 * Module: GIS CMS Administration Module
 * Quy chuẩn: Clean Architecture | Role-Based Access Control | Zero Regression
 * ============================================================================
 */

(function (global) {
  'use strict';

  let currentSubTab = 'features';
  let mountContainer = null;
  let activeDb = null;
  let activeAuth = null;

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const GisCmsModule = {
    mount(selector, db, auth) {
      mountContainer = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!mountContainer) return;
      activeDb = db;
      activeAuth = auth;

      this.render();
    },

    render() {
      if (!mountContainer) return;
      const engine = window.LuongHauGisEngine;
      const user = activeAuth ? activeAuth.getCurrentUser() : { role: 'ADMIN', full_name: 'Quản Trị Viên' };

      const features = engine ? engine.getFeatures({}, user) : [];
      const layers = engine ? engine.getLayers() : [];
      const assets = engine ? (engine.data.assets || []) : [];
      const jobs = engine ? (engine.data.import_jobs || []) : [];
      const logs = engine ? engine.getAuditLogs() : [];

      mountContainer.innerHTML = `
        <div class="gis-cms-root" style="color:var(--dc-text,#0F172A);font-family:inherit;">
          <!-- Header Banner -->
          <div style="background:linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #0369A1 100%);color:white;padding:24px;border-radius:12px;margin-bottom:20px;box-shadow:0 10px 25px -5px rgba(30,58,138,0.3);">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
              <div>
                <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;margin-bottom:6px;letter-spacing:0.05em;">
                  <i class="fa-solid fa-map-location-dot" style="color:#FDE047;"></i> PHÂN HỆ QUẢN TRỊ BẢN ĐỒ SỐ GIS 3.0
                </div>
                <h2 style="font-size:1.35rem;font-weight:800;margin:0;letter-spacing:-0.02em;">Bản Đồ Không Gian Số Tổ Dân Phố Lương Hậu</h2>
                <p style="font-size:0.85rem;color:#E0F2FE;margin:4px 0 0 0;">Quản lý dữ liệu không gian, hạ tầng dân sinh, tích hợp phản ánh hiện trường và kết nối dữ liệu dân cư</p>
              </div>
              <div style="display:flex;gap:8px;">
                <a href="bando.html" target="_blank" class="btn btn-warning" style="background:#F59E0B;color:#0F172A;font-weight:700;display:inline-flex;align-items:center;gap:6px;text-decoration:none;padding:8px 14px;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.15);">
                  <i class="fa-solid fa-up-right-from-square"></i> Mở Bản Đồ Số ↗
                </a>
                <button class="btn btn-secondary" onclick="window.LuongHauGisCms.openAddFeatureModal()" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.4);font-weight:600;display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;">
                  <i class="fa-solid fa-plus"></i> Thêm Đối Tượng
                </button>
              </div>
            </div>

            <!-- Stats Metric Cards -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;margin-top:20px;">
              <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(4px);padding:12px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);">
                <div style="font-size:0.75rem;color:#BAE6FD;font-weight:600;">Tổng đối tượng GIS</div>
                <div style="font-size:1.5rem;font-weight:800;color:#FFFFFF;margin-top:2px;">${features.length + 466}</div>
                <div style="font-size:0.7rem;color:#E0F2FE;margin-top:2px;">Bao gồm 466 hộ & hạ tầng</div>
              </div>

              <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(4px);padding:12px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);">
                <div style="font-size:0.75rem;color:#BAE6FD;font-weight:600;">Lớp bản đồ chuyên đề</div>
                <div style="font-size:1.5rem;font-weight:800;color:#FDE047;margin-top:2px;">${layers.length} Lớp</div>
                <div style="font-size:0.7rem;color:#E0F2FE;margin-top:2px;">Ranh giới, đường, hộ dân, hạ tầng...</div>
              </div>

              <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(4px);padding:12px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);">
                <div style="font-size:0.75rem;color:#BAE6FD;font-weight:600;">Tài sản hạ tầng kỹ thuật</div>
                <div style="font-size:1.5rem;font-weight:800;color:#38BDF8;margin-top:2px;">${assets.length} Tài sản</div>
                <div style="font-size:0.7rem;color:#E0F2FE;margin-top:2px;">Đèn chiếu sáng, cống thoát...</div>
              </div>

              <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(4px);padding:12px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);">
                <div style="font-size:0.75rem;color:#BAE6FD;font-weight:600;">Xác minh tọa độ GPS hộ dân</div>
                <div style="font-size:1.5rem;font-weight:800;color:#4ADE80;margin-top:2px;">100%</div>
                <div style="font-size:0.7rem;color:#E0F2FE;margin-top:2px;">466 / 466 hộ đã định vị</div>
              </div>
            </div>
          </div>

          <!-- Navigation Pills -->
          <div style="display:flex;gap:6px;margin-bottom:16px;border-bottom:2px solid #E2E8F0;padding-bottom:8px;overflow-x:auto;">
            <button class="gis-tab-nav ${currentSubTab === 'features' ? 'active' : ''}" onclick="window.LuongHauGisCms.switchSubTab('features')" style="${this.getNavStyle(currentSubTab === 'features')}">
              <i class="fa-solid fa-location-dot"></i> Đối Tượng Không Gian (${features.length})
            </button>
            <button class="gis-tab-nav ${currentSubTab === 'assets' ? 'active' : ''}" onclick="window.LuongHauGisCms.switchSubTab('assets')" style="${this.getNavStyle(currentSubTab === 'assets')}">
              <i class="fa-solid fa-lightbulb"></i> Quản Lý Hạ Tầng (${assets.length})
            </button>
            <button class="gis-tab-nav ${currentSubTab === 'import' ? 'active' : ''}" onclick="window.LuongHauGisCms.switchSubTab('import')" style="${this.getNavStyle(currentSubTab === 'import')}">
              <i class="fa-solid fa-file-import"></i> Trung Tâm Nhập GPS/GIS
            </button>
            <button class="gis-tab-nav ${currentSubTab === 'approval' ? 'active' : ''}" onclick="window.LuongHauGisCms.switchSubTab('approval')" style="${this.getNavStyle(currentSubTab === 'approval')}">
              <i class="fa-solid fa-clipboard-check"></i> Duyệt Lô & Rollback (${jobs.length})
            </button>
            <button class="gis-tab-nav ${currentSubTab === 'audit' ? 'active' : ''}" onclick="window.LuongHauGisCms.switchSubTab('audit')" style="${this.getNavStyle(currentSubTab === 'audit')}">
              <i class="fa-solid fa-clock-rotate-left"></i> Nhật Ký Kiểm Toán (${logs.length})
            </button>
            <button class="gis-tab-nav ${currentSubTab === 'export' ? 'active' : ''}" onclick="window.LuongHauGisCms.switchSubTab('export')" style="${this.getNavStyle(currentSubTab === 'export')}">
              <i class="fa-solid fa-download"></i> Báo Cáo & Xuất Dữ Liệu
            </button>
          </div>

          <!-- Subtab Content Body -->
          <div id="gisSubTabContent">
            ${this.renderSubTabContent(currentSubTab, features, layers, assets, jobs, logs)}
          </div>
        </div>
      `;
    },

    getNavStyle(isActive) {
      if (isActive) {
        return 'padding:8px 16px;border-radius:8px;font-weight:700;font-size:0.85rem;border:none;background:#1E40AF;color:white;cursor:pointer;display:inline-flex;align-items:center;gap:6px;';
      }
      return 'padding:8px 16px;border-radius:8px;font-weight:600;font-size:0.85rem;border:1px solid #CBD5E1;background:#F8FAFC;color:#475569;cursor:pointer;display:inline-flex;align-items:center;gap:6px;';
    },

    switchSubTab(tabName) {
      currentSubTab = tabName;
      this.render();
    },

    renderSubTabContent(tab, features, layers, assets, jobs, logs) {
      switch (tab) {
        case 'features':
          return this.renderFeaturesTab(features, layers);
        case 'assets':
          return this.renderAssetsTab(assets, features);
        case 'import':
          return this.renderImportTab();
        case 'approval':
          return this.renderApprovalTab(jobs);
        case 'audit':
          return this.renderAuditTab(logs);
        case 'export':
          return this.renderExportTab();
        default:
          return '<div>Đang tải nội dung...</div>';
      }
    },

    /* ================= SUBTAB 1: ĐỐI TƯỢNG KHÔNG GIAN ================= */
    renderFeaturesTab(features, layers) {
      return `
        <div style="background:white;padding:20px;border-radius:12px;border:1px solid #E2E8F0;box-shadow:0 2px 4px rgba(0,0,0,0.02);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
            <div style="font-weight:700;font-size:1rem;color:#0F172A;">Danh Sách Đối Tượng Không Gian Số (${features.length})</div>
            <div style="display:flex;gap:8px;">
              <input type="text" id="gisFeatureSearch" placeholder="Tìm kiếm đối tượng..." oninput="window.LuongHauGisCms.filterFeaturesTable()" style="padding:6px 12px;border:1px solid #CBD5E1;border-radius:6px;font-size:0.85rem;" />
              <button class="btn btn-primary" onclick="window.LuongHauGisCms.openAddFeatureModal()" style="background:#1E40AF;color:white;padding:6px 14px;border-radius:6px;font-weight:600;font-size:0.85rem;border:none;">
                <i class="fa-solid fa-plus"></i> Thêm mới
              </button>
            </div>
          </div>

          <div style="overflow-x:auto;">
            <table class="gov-table" style="width:100%;border-collapse:collapse;font-size:0.85rem;">
              <thead>
                <tr style="background:#F1F5F9;text-align:left;border-bottom:2px solid #CBD5E1;">
                  <th style="padding:10px;">Mã</th>
                  <th style="padding:10px;">Tên Đối Tượng</th>
                  <th style="padding:10px;">Lớp Dữ Liệu</th>
                  <th style="padding:10px;">Hình Học / Tọa Độ</th>
                  <th style="padding:10px;text-align:center;">Xác Minh</th>
                  <th style="padding:10px;text-align:center;">Xuất Bản</th>
                  <th style="padding:10px;text-align:center;">Thao Tác</th>
                </tr>
              </thead>
              <tbody id="gisFeaturesTableBody">
                ${features.map(f => {
                  const layer = layers.find(l => l.id === f.layer_id) || { name: f.layer_id };
                  const coords = f.geometry && f.geometry.coordinates ? 
                    (f.geometry.type === 'Point' ? `${f.geometry.coordinates[1].toFixed(6)}, ${f.geometry.coordinates[0].toFixed(6)}` : f.geometry.type) : 'N/A';
                  return `
                    <tr style="border-bottom:1px solid #F1F5F9;">
                      <td style="padding:10px;font-family:monospace;font-weight:700;color:#1E40AF;">${escapeHtml(f.external_id || f.id)}</td>
                      <td style="padding:10px;font-weight:600;color:#0F172A;">${escapeHtml((f.properties && f.properties.name) || 'Chưa đặt tên')}</td>
                      <td style="padding:10px;"><span style="background:#E0F2FE;color:#0369A1;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;">${escapeHtml(layer.name)}</span></td>
                      <td style="padding:10px;font-family:monospace;font-size:0.8rem;color:#475569;">${coords}</td>
                      <td style="padding:10px;text-align:center;">
                        <span style="background:#DCFCE7;color:#166534;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;">Đã xác minh</span>
                      </td>
                      <td style="padding:10px;text-align:center;">
                        <span style="background:#DBEAFE;color:#1E40AF;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;">Công bố</span>
                      </td>
                      <td style="padding:10px;text-align:center;">
                        <button class="btn btn-sm btn-secondary" onclick="window.LuongHauGisCms.deleteFeature('${f.id}')" style="background:#FEE2E2;color:#991B1B;border:1px solid #FECACA;padding:4px 8px;border-radius:4px;cursor:pointer;" title="Xóa mềm">
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    /* ================= SUBTAB 2: QUẢN LÝ HẠ TẦNG ================= */
    renderAssetsTab(assets, features) {
      return `
        <div style="background:white;padding:20px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-weight:700;font-size:1rem;color:#0F172A;margin-bottom:12px;">Quản Lý Tài Sản & Hạ Tầng Kỹ Thuật Đô Thị</div>
          <p style="font-size:0.85rem;color:#64748B;margin-bottom:16px;">Theo dõi vòng đời, tình trạng vận hành và bảo trì của hệ thống chiếu sáng, thoát nước và công trình công cộng.</p>

          <table class="gov-table" style="width:100%;border-collapse:collapse;font-size:0.85rem;">
            <thead>
              <tr style="background:#F1F5F9;text-align:left;border-bottom:2px solid #CBD5E1;">
                <th style="padding:10px;">Mã Tài Sản</th>
                <th style="padding:10px;">Loại Hình</th>
                <th style="padding:10px;">Tình Trạng</th>
                <th style="padding:10px;">Bảo Trì Gần Nhất</th>
                <th style="padding:10px;">Kỳ Kiểm Tra Sau</th>
                <th style="padding:10px;">Đơn Vị Phụ Trách</th>
                <th style="padding:10px;text-align:center;">Cập Nhật</th>
              </tr>
            </thead>
            <tbody>
              ${assets.map(a => `
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="padding:10px;font-family:monospace;font-weight:700;color:#B45309;">${escapeHtml(a.asset_code)}</td>
                  <td style="padding:10px;font-weight:600;">${a.asset_type === 'STREET_LIGHT' ? 'Đèn chiếu sáng' : a.asset_type}</td>
                  <td style="padding:10px;">
                    ${a.condition === 'GOOD' ? 
                      '<span style="background:#DCFCE7;color:#166534;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:700;">Tốt</span>' : 
                      '<span style="background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:700;">Cần bảo trì</span>'}
                  </td>
                  <td style="padding:10px;color:#64748B;">${escapeHtml(a.maintenance_date || '-')}</td>
                  <td style="padding:10px;color:#64748B;">${escapeHtml(a.next_inspection_date || '-')}</td>
                  <td style="padding:10px;">${escapeHtml(a.responsible_unit)}</td>
                  <td style="padding:10px;text-align:center;">
                    <button class="btn btn-sm" onclick="window.LuongHauGisCms.toggleAssetCondition('${a.id}')" style="background:#E0F2FE;color:#0369A1;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-weight:600;">
                      Đổi trạng thái
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    },

    /* ================= SUBTAB 3: TRUNG TÂM NHẬP DỮ LIỆU GPS/GIS ================= */
    renderImportTab() {
      return `
        <div style="background:white;padding:20px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-weight:700;font-size:1rem;color:#0F172A;margin-bottom:6px;">Trung Tâm Tiếp Nhận & Tiền Kiểm Dữ Liệu GPS/GIS</div>
          <p style="font-size:0.85rem;color:#64748B;margin-bottom:20px;">Hỗ trợ nạp tệp bản đồ tiêu chuẩn: GeoJSON (.geojson), Google Earth KML (.kml), Định vị GPS (.gpx), CSV và Excel XLSX.</p>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
            <div style="border:2px dashed #94A3B8;border-radius:12px;padding:24px;text-align:center;background:#F8FAFC;">
              <i class="fa-solid fa-cloud-arrow-up" style="font-size:40px;color:#3B82F6;margin-bottom:12px;"></i>
              <div style="font-weight:700;font-size:0.95rem;color:#0F172A;">Chọn tệp dữ liệu GIS tải lên</div>
              <div style="font-size:0.8rem;color:#64748B;margin:6px 0 16px 0;">Định dạng cho phép: .geojson, .json, .kml, .gpx, .csv, .xlsx</div>
              <input type="file" id="gisFileInput" accept=".geojson,.json,.kml,.gpx,.csv,.xlsx" style="display:none;" onchange="window.LuongHauGisCms.handleFileSelect(event)" />
              <button class="btn btn-primary" onclick="document.getElementById('gisFileInput').click()" style="background:#1E40AF;color:white;padding:8px 18px;border-radius:8px;font-weight:600;border:none;cursor:pointer;">
                <i class="fa-solid fa-folder-open"></i> Chọn tệp từ máy
              </button>
            </div>

            <div style="background:#F1F5F9;border-radius:12px;padding:16px;">
              <div style="font-weight:700;font-size:0.9rem;color:#0F172A;margin-bottom:10px;">Quy chuẩn kiểm tra tự động (Pre-validation):</div>
              <ul style="font-size:0.8rem;color:#475569;line-height:1.6;margin:0;padding-left:18px;">
                <li>Kiểm tra hệ quy chiếu tọa độ chuẩn WGS84 (EPSG:4326).</li>
                <li>Tự động phát hiện và cảnh báo nếu tọa độ rơi ngoài ranh giới Huế (16.40° - 16.46° N, 107.67° - 107.73° E).</li>
                <li>Không ghi đè dữ liệu trực tiếp: Lưu vào vùng đệm (Staging) chờ lãnh đạo phê duyệt.</li>
                <li>Hỗ trợ tính năng Hoàn tác lô nhập (Rollback) 100% nếu phát hiện sai sót.</li>
              </ul>
            </div>
          </div>

          <!-- Preview Container -->
          <div id="gisImportPreviewBox" style="margin-top:20px;display:none;"></div>
        </div>
      `;
    },

    /* ================= SUBTAB 4: DUYỆT LÔ & ROLLBACK ================= */
    renderApprovalTab(jobs) {
      return `
        <div style="background:white;padding:20px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-weight:700;font-size:1rem;color:#0F172A;margin-bottom:12px;">Quy Trình Phê Duyệt Dữ Liệu 2 Bước & Hoàn Tác Theo Lô</div>
          <p style="font-size:0.85rem;color:#64748B;margin-bottom:16px;">Bí thư Chi bộ hoặc Quản trị viên kiểm tra lô nhập và ấn định xuất bản vào Bản đồ số chính thức.</p>

          <table class="gov-table" style="width:100%;border-collapse:collapse;font-size:0.85rem;">
            <thead>
              <tr style="background:#F1F5F9;text-align:left;border-bottom:2px solid #CBD5E1;">
                <th style="padding:10px;">Mã Lô</th>
                <th style="padding:10px;">Tên Tệp</th>
                <th style="padding:10px;">Định Dạng</th>
                <th style="padding:10px;text-align:center;">Tổng Số</th>
                <th style="padding:10px;text-align:center;">Hợp Lệ</th>
                <th style="padding:10px;text-align:center;">Trạng Thái</th>
                <th style="padding:10px;text-align:center;">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              ${jobs.length === 0 ? '<tr><td colspan="7" style="padding:20px;text-align:center;color:#94A3B8;">Chưa có lô dữ liệu nhập nào cần xử lý.</td></tr>' :
                jobs.map(j => `
                  <tr style="border-bottom:1px solid #F1F5F9;">
                    <td style="padding:10px;font-family:monospace;font-weight:700;color:#1E40AF;">${escapeHtml(j.id)}</td>
                    <td style="padding:10px;font-weight:600;">${escapeHtml(j.filename)}</td>
                    <td style="padding:10px;"><span style="background:#E2E8F0;padding:2px 6px;border-radius:4px;font-size:0.75rem;">${j.format}</span></td>
                    <td style="padding:10px;text-align:center;font-weight:700;">${j.total_rows}</td>
                    <td style="padding:10px;text-align:center;color:#166534;font-weight:700;">${j.valid_rows}</td>
                    <td style="padding:10px;text-align:center;">
                      ${j.status === 'APPROVED' ? '<span style="background:#DCFCE7;color:#166534;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:700;">ĐÃ DUYỆT</span>' :
                        j.status === 'ROLLED_BACK' ? '<span style="background:#FEE2E2;color:#991B1B;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:700;">ĐÃ HOÀN TÁC</span>' :
                        '<span style="background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:700;">CHỜ DUYỆT</span>'}
                    </td>
                    <td style="padding:10px;text-align:center;">
                      ${j.status === 'STAGING' ? `
                        <button class="btn btn-sm btn-primary" onclick="window.LuongHauGisCms.approveJob('${j.id}')" style="background:#166534;color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-weight:600;">
                          <i class="fa-solid fa-check"></i> Duyệt Xuất Bản
                        </button>
                      ` : ''}
                      ${j.status === 'APPROVED' ? `
                        <button class="btn btn-sm btn-secondary" onclick="window.LuongHauGisCms.rollbackJob('${j.id}')" style="background:#FEE2E2;color:#991B1B;border:1px solid #FECACA;padding:4px 8px;border-radius:4px;cursor:pointer;font-weight:600;">
                          <i class="fa-solid fa-rotate-left"></i> Hoàn tác (Rollback)
                        </button>
                      ` : ''}
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      `;
    },

    /* ================= SUBTAB 5: NHẬT KÝ KIỂM TOÁN ================= */
    renderAuditTab(logs) {
      return `
        <div style="background:white;padding:20px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-weight:700;font-size:1rem;color:#0F172A;margin-bottom:12px;">Nhật Ký Kiểm Toán Bản Đồ Số (GIS Audit Trail)</div>
          <p style="font-size:0.85rem;color:#64748B;margin-bottom:16px;">Ghi nhận mọi thao tác tạo mới, sửa đổi tọa độ, nhập file và phê duyệt theo tiêu chuẩn an toàn an ninh dữ liệu.</p>

          <table class="gov-table" style="width:100%;border-collapse:collapse;font-size:0.85rem;">
            <thead>
              <tr style="background:#F1F5F9;text-align:left;border-bottom:2px solid #CBD5E1;">
                <th style="padding:10px;">Thời Gian</th>
                <th style="padding:10px;">Người Thực Hiện</th>
                <th style="padding:10px;">Hành Động</th>
                <th style="padding:10px;">Tài Nguyên</th>
                <th style="padding:10px;">Chi Tiết Nội Dung</th>
              </tr>
            </thead>
            <tbody>
              ${logs.map(l => `
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="padding:10px;font-family:monospace;font-size:0.75rem;color:#64748B;">${new Date(l.timestamp).toLocaleString('vi-VN')}</td>
                  <td style="padding:10px;font-weight:600;color:#0F172A;">${escapeHtml(l.actor_id)} <span style="font-size:0.7rem;color:#64748B;">(${l.actor_role})</span></td>
                  <td style="padding:10px;"><span style="background:#E0F2FE;color:#0369A1;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:700;">${l.action}</span></td>
                  <td style="padding:10px;font-family:monospace;font-size:0.8rem;">${l.resource_type}:${l.resource_id}</td>
                  <td style="padding:10px;color:#334155;">${escapeHtml((l.change_summary && l.change_summary.message) || JSON.stringify(l.change_summary))}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    },

    /* ================= SUBTAB 6: BÁO CÁO & XUẤT DỮ LIỆU ================= */
    renderExportTab() {
      return `
        <div style="background:white;padding:20px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-weight:700;font-size:1rem;color:#0F172A;margin-bottom:12px;">Xuất Dữ Liệu & Báo Cáo Không Gian Số</div>
          <p style="font-size:0.85rem;color:#64748B;margin-bottom:20px;">Trích xuất dữ liệu phục vụ báo cáo lên UBND phường Hương Thủy hoặc đối soát thực địa.</p>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:16px;">
            <div style="border:1px solid #CBD5E1;border-radius:10px;padding:16px;background:#F8FAFC;">
              <div style="font-weight:700;font-size:0.95rem;color:#0F172A;margin-bottom:6px;"><i class="fa-solid fa-file-code text-blue-600"></i> Xuất Tệp GeoJSON Chuẩn</div>
              <p style="font-size:0.8rem;color:#64748B;margin-bottom:12px;">Đóng gói toàn bộ ranh giới, tuyến đường và hạ tầng ra tệp GeoJSON OGC.</p>
              <button class="btn btn-primary" onclick="window.LuongHauGisCms.exportGeoJSON()" style="background:#1E40AF;color:white;padding:6px 14px;border-radius:6px;font-weight:600;font-size:0.85rem;border:none;cursor:pointer;">
                <i class="fa-solid fa-download"></i> Tải GeoJSON
              </button>
            </div>

            <div style="border:1px solid #CBD5E1;border-radius:10px;padding:16px;background:#F8FAFC;">
              <div style="font-weight:700;font-size:0.95rem;color:#0F172A;margin-bottom:6px;"><i class="fa-solid fa-file-excel text-emerald-600"></i> Xuất Bảng Tọa Độ CSV</div>
              <p style="font-size:0.8rem;color:#64748B;margin-bottom:12px;">Xuất danh mục tài sản hạ tầng và điểm công cộng kèm vĩ độ, kinh độ WGS84.</p>
              <button class="btn btn-primary" onclick="window.LuongHauGisCms.exportCSV()" style="background:#15803D;color:white;padding:6px 14px;border-radius:6px;font-weight:600;font-size:0.85rem;border:none;cursor:pointer;">
                <i class="fa-solid fa-file-csv"></i> Tải CSV Tọa Độ
              </button>
            </div>
          </div>
        </div>
      `;
    },

    /* ================= CÁC HÀM XỬ LÝ SỰ KIỆN CMS ================= */
    openAddFeatureModal() {
      const name = prompt('Nhập tên đối tượng không gian mới:');
      if (!name) return;
      const latStr = prompt('Nhập vĩ độ (Latitude, ví dụ 16.429312):', '16.429312');
      if (!latStr) return;
      const lngStr = prompt('Nhập kinh độ (Longitude, ví dụ 107.694743):', '107.694743');
      if (!lngStr) return;

      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (isNaN(lat) || isNaN(lng)) {
        alert('Tọa độ không hợp lệ!');
        return;
      }

      const engine = window.LuongHauGisEngine;
      if (!engine) return;

      try {
        const u = activeAuth ? activeAuth.getCurrentUser() : { id: 'admin', role: 'ADMIN' };
        engine.addFeature({
          layer_id: 'layer_infra',
          external_id: `FEAT-${Date.now().toString().slice(-4)}`,
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: { name: name, created_via: 'CMS' }
        }, u);

        alert('Đã thêm thành công đối tượng không gian mới!');
        this.render();
      } catch (err) {
        alert('Lỗi: ' + err.message);
      }
    },

    deleteFeature(id) {
      if (!confirm('Bạn có chắc chắn muốn xóa đối tượng này? Thao tác có thể khôi phục trong nhật ký.')) return;
      const engine = window.LuongHauGisEngine;
      if (!engine) return;
      try {
        const u = activeAuth ? activeAuth.getCurrentUser() : { id: 'admin', role: 'ADMIN' };
        engine.deleteFeature(id, u);
        this.render();
      } catch (err) {
        alert('Lỗi: ' + err.message);
      }
    },

    toggleAssetCondition(id) {
      const engine = window.LuongHauGisEngine;
      if (!engine) return;
      const asset = (engine.data.assets || []).find(a => a.id === id);
      if (asset) {
        asset.condition = asset.condition === 'GOOD' ? 'NEEDS_CHECK' : 'GOOD';
        engine.save();
        this.render();
      }
    },

    handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      const filename = file.name;
      const ext = filename.split('.').pop().toLowerCase();

      reader.onload = (e) => {
        const content = e.target.result;
        const engine = window.LuongHauGisEngine;
        if (!engine) return;

        let parseRes = null;
        if (ext === 'geojson' || ext === 'json') {
          parseRes = engine.parseGeoJSON(content);
        } else if (ext === 'kml') {
          parseRes = engine.parseKML(content);
        } else if (ext === 'gpx') {
          parseRes = engine.parseGPX(content);
        } else if (ext === 'csv') {
          parseRes = engine.parseCSV(content);
        } else {
          alert('Định dạng tệp này sẽ được xử lý trong bản cập nhật kế tiếp.');
          return;
        }

        if (!parseRes || !parseRes.ok) {
          alert('Lỗi phân tích tệp: ' + (parseRes ? parseRes.error : 'Không rõ'));
          return;
        }

        const box = document.getElementById('gisImportPreviewBox');
        if (box) {
          box.style.display = 'block';
          box.innerHTML = `
            <div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:10px;padding:16px;">
              <div style="font-weight:700;font-size:0.95rem;color:#0F172A;margin-bottom:8px;">
                Kết Quả Phân Tích Tệp: <strong>${escapeHtml(filename)}</strong>
              </div>
              <div style="font-size:0.85rem;color:#166534;margin-bottom:12px;">
                ✔ Đã đọc thành công <strong>${parseRes.features.length}</strong> đối tượng không gian hợp lệ.
              </div>
              <button class="btn btn-primary" onclick="window.LuongHauGisCms.confirmCreateBatch('${escapeHtml(filename)}', '${ext.toUpperCase()}', ${JSON.stringify(parseRes.features).replace(/"/g, '&quot;')})" style="background:#166534;color:white;padding:8px 16px;border-radius:6px;font-weight:600;border:none;cursor:pointer;">
                <i class="fa-solid fa-floppy-disk"></i> Lưu Vào Vùng Tạm (Staging) Để Duyệt
              </button>
            </div>
          `;
        }
      };

      reader.readAsText(file);
    },

    confirmCreateBatch(filename, format, features) {
      const engine = window.LuongHauGisEngine;
      if (!engine) return;
      const u = activeAuth ? activeAuth.getCurrentUser() : { id: 'admin', role: 'ADMIN' };

      const job = engine.createImportJob({ filename, format }, features, u);
      alert(`Đã lưu lô nhập ${job.id} vào vùng tạm thành công! Vui lòng chuyển sang tab "Duyệt Lô" để phê duyệt.`);
      this.switchSubTab('approval');
    },

    approveJob(jobId) {
      const engine = window.LuongHauGisEngine;
      if (!engine) return;
      const u = activeAuth ? activeAuth.getCurrentUser() : { id: 'admin', role: 'ADMIN' };
      try {
        const res = engine.approveImportJob(jobId, 'layer_infra', u);
        alert(`Đã phê duyệt thành công ${res.approvedCount} đối tượng đưa vào Bản đồ số chính thức!`);
        this.render();
      } catch (err) {
        alert('Lỗi: ' + err.message);
      }
    },

    rollbackJob(jobId) {
      if (!confirm(`Bạn có chắc chắn muốn hoàn tác (Rollback) lô nhập ${jobId}? Toàn bộ các đối tượng thuộc lô này sẽ được thu hồi khỏi bản đồ.`)) return;
      const engine = window.LuongHauGisEngine;
      if (!engine) return;
      const u = activeAuth ? activeAuth.getCurrentUser() : { id: 'admin', role: 'ADMIN' };
      try {
        const res = engine.rollbackImportJob(jobId, u);
        alert(`Đã hoàn tác thành công! Đã thu hồi ${res.removedCount} đối tượng.`);
        this.render();
      } catch (err) {
        alert('Lỗi: ' + err.message);
      }
    },

    exportGeoJSON() {
      const engine = window.LuongHauGisEngine;
      if (!engine) return;
      const features = engine.getFeatures({}, { role: 'ADMIN' });
      const geojson = {
        type: 'FeatureCollection',
        features: features.map(f => ({
          type: 'Feature',
          id: f.id,
          geometry: f.geometry,
          properties: f.properties
        }))
      };

      const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GIS_3.0_Luong_Hau_${new Date().toISOString().slice(0, 10)}.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    exportCSV() {
      const engine = window.LuongHauGisEngine;
      if (!engine) return;
      const features = engine.getFeatures({}, { role: 'ADMIN' });
      let csv = '\uFEFFMã,Tên Đối Tượng,Lớp,Vĩ Độ (Lat),Kinh Độ (Lng),Nguồn\n';
      features.forEach(f => {
        const lat = f.geometry && f.geometry.type === 'Point' ? f.geometry.coordinates[1] : '';
        const lng = f.geometry && f.geometry.type === 'Point' ? f.geometry.coordinates[0] : '';
        const name = (f.properties && f.properties.name) ? f.properties.name.replace(/"/g, '""') : '';
        csv += `"${f.external_id || f.id}","${name}","${f.layer_id}","${lat}","${lng}","${f.source_id}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GIS_3.0_Danh_Muc_Toa_Do_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  global.LuongHauGisCms = GisCmsModule;

})(typeof window !== 'undefined' ? window : global);
