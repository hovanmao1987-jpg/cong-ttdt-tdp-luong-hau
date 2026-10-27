/**
 * ============================================================================
 * BẢN ĐỒ SỐ TỔ DÂN PHỐ LƯƠNG HẬU – DIGITAL GIS 3.0
 * Module: GIS Data Engine & Spatial Intelligence System
 * Quy chuẩn: OGC GeoJSON RFC 7946 | Clean Architecture | Privacy-First Design
 * ============================================================================
 */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'luonghau_gis_db_v3';
  const BATCH_STORAGE_KEY = 'luonghau_gis_batches_v3';
  const AUDIT_STORAGE_KEY = 'luonghau_gis_audit_v3';

  // Giới hạn bounding box kiểm tra hợp lệ của Lương Hậu - Hương Thủy - Huế
  const LUONG_HAU_BOUNDS = {
    minLat: 16.4000,
    maxLat: 16.4600,
    minLng: 107.6700,
    maxLng: 107.7300
  };

  class LuongHauGisEngine {
    constructor() {
      this.initialized = false;
      this.data = {
        settings: {
          crs: 'EPSG:4326',
          center: [16.429312, 107.694743],
          default_zoom: 16
        },
        layers: [],
        features: [],
        assets: [],
        import_jobs: [],
        audit_logs: []
      };
      this.init();
    }

    init() {
      try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && Array.isArray(parsed.layers) && parsed.layers.length > 0) {
            this.data = parsed;
            this.initialized = true;
            return;
          }
        }
      } catch (e) {
        // Fallback for SSR or non-browser environments
      }

      // Khởi tạo từ tệp seed nếu có sẵn
      if (typeof window !== 'undefined' && window.GIS_SEED_DATA) {
        this.data = JSON.parse(JSON.stringify(window.GIS_SEED_DATA));
        this.save();
        this.initialized = true;
      }
    }

    loadSeedData(seedJson) {
      if (!seedJson) return;
      this.data = JSON.parse(JSON.stringify(seedJson));
      this.save();
      this.initialized = true;
    }

    save() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        }
      } catch (e) {
        console.warn('GisEngine: Không thể lưu vào localStorage', e);
      }
    }

    /* ========================================================================
     * 1. QUẢN LÝ LỚP DỮ LIỆU (LAYER MANAGEMENT)
     * ======================================================================== */
    getLayers() {
      return (this.data.layers || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }

    getLayerById(id) {
      return (this.data.layers || []).find(l => l.id === id || l.code === id) || null;
    }

    toggleLayer(id) {
      const layer = this.getLayerById(id);
      if (layer) {
        layer.is_active = !layer.is_active;
        this.save();
        return layer.is_active;
      }
      return false;
    }

    /* ========================================================================
     * 2. QUẢN LÝ ĐỐI TƯỢNG KHÔNG GIAN (FEATURE CRUD & PRIVACY GUARD)
     * ======================================================================== */
    getFeatures(filter = {}, user = null) {
      let list = (this.data.features || []).filter(f => !f.deleted_at);

      if (filter.layer_id) {
        list = list.filter(f => f.layer_id === filter.layer_id);
      }
      if (filter.publication_status) {
        list = list.filter(f => f.publication_status === filter.publication_status);
      }
      if (filter.query) {
        const q = filter.query.toLowerCase().trim();
        list = list.filter(f => {
          const name = (f.properties && f.properties.name) ? f.properties.name.toLowerCase() : '';
          const code = (f.external_id || '').toLowerCase();
          const addr = (f.properties && f.properties.address) ? f.properties.address.toLowerCase() : '';
          return name.includes(q) || code.includes(q) || addr.includes(q);
        });
      }

      // Lọc theo quyền truy cập và che dữ liệu cá nhân nếu chưa xác thực
      return list.map(f => this.sanitizeFeature(f, user));
    }

    getFeatureById(id, user = null) {
      const f = (this.data.features || []).find(x => x.id === id && !x.deleted_at);
      if (!f) return null;
      return this.sanitizeFeature(f, user);
    }

    addFeature(featureData, user = { id: 'admin', role: 'ADMIN' }) {
      if (!featureData || !featureData.geometry) {
        throw new Error('Dữ liệu đối tượng không hợp lệ: Thiếu cấu trúc hình học (geometry)');
      }

      // Kiểm tra hợp lệ tọa độ
      const validation = this.validateGeometry(featureData.geometry);
      if (!validation.isValid) {
        throw new Error(`Hình học lỗi: ${validation.message}`);
      }

      const id = featureData.id || `feat_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const now = new Date().toISOString();

      const newFeature = {
        id: id,
        layer_id: featureData.layer_id || 'layer_infra',
        external_id: featureData.external_id || `OBJ-${Date.now().toString().slice(-4)}`,
        geometry: featureData.geometry,
        properties: featureData.properties || {},
        source_id: featureData.source_id || 'manual_entry',
        verification_status: featureData.verification_status || 'VERIFIED',
        publication_status: featureData.publication_status || 'PUBLISHED',
        created_by: user.id || 'admin',
        updated_by: user.id || 'admin',
        created_at: now,
        updated_at: now,
        deleted_at: null
      };

      this.data.features.push(newFeature);
      this.logAction('CREATE_FEATURE', 'FEATURE', id, `Thêm mới đối tượng: ${newFeature.properties.name || newFeature.external_id}`, user);
      this.save();
      return newFeature;
    }

    updateFeature(id, updates, user = { id: 'admin', role: 'ADMIN' }) {
      const idx = (this.data.features || []).findIndex(f => f.id === id && !f.deleted_at);
      if (idx === -1) throw new Error('Không tìm thấy đối tượng cần cập nhật');

      if (updates.geometry) {
        const val = this.validateGeometry(updates.geometry);
        if (!val.isValid) throw new Error(`Tọa độ cập nhật không hợp lệ: ${val.message}`);
      }

      const old = this.data.features[idx];
      this.data.features[idx] = {
        ...old,
        ...updates,
        properties: { ...old.properties, ...(updates.properties || {}) },
        updated_by: user.id || 'admin',
        updated_at: new Date().toISOString()
      };

      this.logAction('UPDATE_FEATURE', 'FEATURE', id, `Cập nhật đối tượng: ${id}`, user);
      this.save();
      return this.data.features[idx];
    }

    deleteFeature(id, user = { id: 'admin', role: 'ADMIN' }) {
      const f = (this.data.features || []).find(x => x.id === id && !x.deleted_at);
      if (!f) throw new Error('Không tìm thấy đối tượng để xóa');

      f.deleted_at = new Date().toISOString();
      f.updated_by = user.id || 'admin';
      this.logAction('DELETE_FEATURE', 'FEATURE', id, `Xóa mềm đối tượng: ${id}`, user);
      this.save();
      return true;
    }

    restoreFeature(id, user = { id: 'admin', role: 'ADMIN' }) {
      const f = (this.data.features || []).find(x => x.id === id && x.deleted_at);
      if (!f) throw new Error('Không tìm thấy đối tượng để khôi phục');

      f.deleted_at = null;
      f.updated_by = user.id || 'admin';
      this.logAction('RESTORE_FEATURE', 'FEATURE', id, `Khôi phục đối tượng: ${id}`, user);
      this.save();
      return f;
    }

    /* ========================================================================
     * 3. BẢO VỆ DỮ LIỆU CÁ NHÂN (PERSONAL DATA PROTECTION - PRIVACY-FIRST)
     * ======================================================================== */
    sanitizeFeature(feature, user) {
      if (!feature) return null;
      const copy = JSON.parse(JSON.stringify(feature));
      const isAuthorized = user && (user.role === 'ADMIN' || user.role === 'BI_THU' || user.role === 'TO_TRUONG');

      if (!isAuthorized && copy.layer_id === 'layer_households') {
        if (copy.properties) {
          // Xóa toàn bộ số CCCD và Số điện thoại đối với người dùng công khai
          if (copy.properties.cccd) copy.properties.cccd = '***';
          if (copy.properties.phone) copy.properties.phone = '***';
          if (copy.properties.members && Array.isArray(copy.properties.members)) {
            copy.properties.members = copy.properties.members.map(m => ({
              ...m,
              cccd: '***',
              phone: '***'
            }));
          }
        }
      }
      return copy;
    }

    /* ========================================================================
     * 4. THUẬT TOÁN ĐO ĐẠC KHÔNG GIAN (SPATIAL MEASUREMENT TOOLS)
     * ======================================================================== */
    /**
     * Tính khoảng cách trắc địa giữa 2 tọa độ (Haversine formula - WGS84)
     * @returns {number} Khoảng cách tính bằng mét (m)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371000; // Bán kính Trái Đất (mét)
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(R * c);
    }

    /**
     * Tính tổng chiều dài đường đi (LineString coordinates)
     */
    calculatePathLength(coordinates) {
      if (!coordinates || coordinates.length < 2) return 0;
      let total = 0;
      for (let i = 0; i < coordinates.length - 1; i++) {
        const [lon1, lat1] = coordinates[i];
        const [lon2, lat2] = coordinates[i + 1];
        total += this.calculateDistance(lat1, lon1, lat2, lon2);
      }
      return total;
    }

    /**
     * Tính diện tích đa giác khép kín (Shoelace spherical formula)
     * @returns {number} Diện tích tính bằng mét vuông (m²)
     */
    calculatePolygonArea(coords) {
      if (!coords || coords.length < 3) return 0;
      const R = 6378137;
      let area = 0;
      const len = coords.length;

      for (let i = 0; i < len; i++) {
        const p1 = coords[i];
        const p2 = coords[(i + 1) % len];
        const lon1 = p1[0] * Math.PI / 180;
        const lat1 = p1[1] * Math.PI / 180;
        const lon2 = p2[0] * Math.PI / 180;
        const lat2 = p2[1] * Math.PI / 180;
        area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
      }
      area = Math.abs(area * R * R / 2);
      return Math.round(area);
    }

    /**
     * Kiểm tra điểm nằm trong đa giác (Ray-casting point in polygon)
     */
    isPointInPolygon(point, polygon) {
      const [x, y] = point; // [lng, lat]
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }

    /* ========================================================================
     * 5. TIỀN KIỂM HỢP LỆ HÌNH HỌC & TỌA ĐỘ (SPATIAL VALIDATION)
     * ======================================================================== */
    validateGeometry(geom) {
      if (!geom || typeof geom !== 'object') {
        return { isValid: false, message: 'Hình học rỗng hoặc sai kiểu đối tượng' };
      }
      if (!['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(geom.type)) {
        return { isValid: false, message: `Loại hình học ${geom.type} không được hỗ trợ` };
      }
      if (!Array.isArray(geom.coordinates)) {
        return { isValid: false, message: 'Tọa độ hình học phải là một mảng' };
      }

      // Kiểm tra phạm vi tọa độ đối với Point
      if (geom.type === 'Point') {
        const [lng, lat] = geom.coordinates;
        if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
          return { isValid: false, message: 'Tọa độ kinh độ hoặc vĩ độ không phải là số hợp lệ' };
        }
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          return { isValid: false, message: 'Tọa độ nằm ngoài phạm vi WGS84 (-90..90, -180..180)' };
        }
        // Cảnh báo nếu nằm ngoài vùng Lương Hậu - Huế
        if (lat < LUONG_HAU_BOUNDS.minLat || lat > LUONG_HAU_BOUNDS.maxLat ||
            lng < LUONG_HAU_BOUNDS.minLng || lng > LUONG_HAU_BOUNDS.maxLng) {
          return { isValid: true, isOutOfTown: true, message: 'Cảnh báo: Tọa độ nằm ngoài phạm vi Tổ dân phố Lương Hậu' };
        }
      }

      return { isValid: true };
    }

    /* ========================================================================
     * 6. TRUNG TÂM NHẬP DỮ LIỆU GPS/GIS (IMPORT CENTER & PARSERS)
     * ======================================================================== */
    parseGeoJSON(content) {
      try {
        const geojson = typeof content === 'string' ? JSON.parse(content) : content;
        const features = [];

        if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
          geojson.features.forEach((f, idx) => {
            features.push({
              external_id: f.id || (f.properties && f.properties.id) || `IMPORT_GEOJSON_${idx + 1}`,
              geometry: f.geometry,
              properties: f.properties || {}
            });
          });
        } else if (geojson.type === 'Feature') {
          features.push({
            external_id: geojson.id || `IMPORT_GEOJSON_1`,
            geometry: geojson.geometry,
            properties: geojson.properties || {}
          });
        }
        return { ok: true, features };
      } catch (err) {
        return { ok: false, error: 'Không thể phân tích cú pháp GeoJSON: ' + err.message };
      }
    }

    parseKML(kmlText) {
      try {
        const features = [];
        // Regex bóc tách Placemark đơn giản, an toàn
        const placemarkRegex = /<Placemark[\s\S]*?<\/Placemark>/gi;
        const placemarks = kmlText.match(placemarkRegex) || [];

        placemarks.forEach((pm, idx) => {
          const nameMatch = pm.match(/<name>([\s\S]*?)<\/name>/i);
          const name = nameMatch ? nameMatch[1].trim() : `Điểm KML ${idx + 1}`;

          const descMatch = pm.match(/<description>([\s\S]*?)<\/description>/i);
          const desc = descMatch ? descMatch[1].trim() : '';

          const coordMatch = pm.match(/<coordinates>([\s\S]*?)<\/coordinates>/i);
          if (coordMatch) {
            const rawCoords = coordMatch[1].trim().split(/\s+/);
            if (rawCoords.length === 1) {
              const parts = rawCoords[0].split(',');
              const lng = parseFloat(parts[0]);
              const lat = parseFloat(parts[1]);
              if (!isNaN(lat) && !isNaN(lng)) {
                features.push({
                  external_id: `KML_${idx + 1}`,
                  geometry: { type: 'Point', coordinates: [lng, lat] },
                  properties: { name, description: desc }
                });
              }
            } else if (rawCoords.length > 1) {
              const ring = rawCoords.map(c => {
                const parts = c.split(',');
                return [parseFloat(parts[0]), parseFloat(parts[1])];
              }).filter(p => !isNaN(p[0]) && !isNaN(p[1]));

              features.push({
                external_id: `KML_${idx + 1}`,
                geometry: { type: 'LineString', coordinates: ring },
                properties: { name, description: desc }
              });
            }
          }
        });

        return { ok: true, features };
      } catch (err) {
        return { ok: false, error: 'Lỗi khi phân tích tệp KML: ' + err.message };
      }
    }

    parseGPX(gpxText) {
      try {
        const features = [];
        const wptRegex = /<wpt\s+lat="([^"]+)"\s+lon="([^"]+)"[\s\S]*?<\/wpt>/gi;
        let match;
        let idx = 1;

        while ((match = wptRegex.exec(gpxText)) !== null) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          const nameMatch = match[0].match(/<name>([\s\S]*?)<\/name>/i);
          const name = nameMatch ? nameMatch[1].trim() : `Waypoint ${idx}`;

          if (!isNaN(lat) && !isNaN(lng)) {
            features.push({
              external_id: `GPX_${idx}`,
              geometry: { type: 'Point', coordinates: [lng, lat] },
              properties: { name }
            });
            idx++;
          }
        }
        return { ok: true, features };
      } catch (err) {
        return { ok: false, error: 'Lỗi phân tích tệp GPX: ' + err.message };
      }
    }

    parseCSV(csvText) {
      try {
        const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) throw new Error('File CSV không có dữ liệu');

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
        const latIdx = headers.findIndex(h => h.includes('lat') || h.includes('vĩ độ') || h.includes('vi_do'));
        const lngIdx = headers.findIndex(h => h.includes('lng') || h.includes('lon') || h.includes('kinh độ') || h.includes('kinh_do'));
        const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('tên') || h.includes('chủ hộ'));
        const idIdx = headers.findIndex(h => h.includes('id') || h.includes('mã'));

        if (latIdx === -1 || lngIdx === -1) {
          throw new Error('Không tìm thấy cột Tọa độ (latitude / longitude) trong tệp CSV');
        }

        const features = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
          const lat = parseFloat(cols[latIdx]);
          const lng = parseFloat(cols[lngIdx]);
          if (!isNaN(lat) && !isNaN(lng)) {
            const extId = idIdx !== -1 && cols[idIdx] ? cols[idIdx] : `CSV_${i}`;
            const name = nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx] : `Đối tượng ${i}`;
            features.push({
              external_id: extId,
              geometry: { type: 'Point', coordinates: [lng, lat] },
              properties: { name, row_number: i }
            });
          }
        }

        return { ok: true, features };
      } catch (err) {
        return { ok: false, error: 'Lỗi phân tích tệp CSV: ' + err.message };
      }
    }

    /* ========================================================================
     * 7. QUY TRÌNH DUYỆT LÔ NHẬP & HOÀN TÁC (BATCH APPROVAL & ROLLBACK)
     * ======================================================================== */
    createImportJob(meta, parsedFeatures, user = { id: 'admin', role: 'ADMIN' }) {
      const jobId = `JOB-${Date.now().toString().slice(-6)}`;
      let valid = 0;
      let invalid = 0;

      const stagedFeatures = parsedFeatures.map((f, i) => {
        const val = this.validateGeometry(f.geometry);
        if (val.isValid) valid++; else invalid++;

        return {
          ...f,
          id: `feat_staging_${jobId}_${i + 1}`,
          source_id: jobId,
          verification_status: val.isValid ? 'VERIFIED' : 'UNVERIFIED',
          publication_status: 'DRAFT',
          created_by: user.id || 'admin',
          created_at: new Date().toISOString()
        };
      });

      const job = {
        id: jobId,
        filename: meta.filename || 'import_file',
        format: meta.format || 'GEOJSON',
        status: 'STAGING',
        total_rows: parsedFeatures.length,
        valid_rows: valid,
        invalid_rows: invalid,
        features: stagedFeatures,
        imported_by: user.id || 'admin',
        approved_by: null,
        created_at: new Date().toISOString()
      };

      this.data.import_jobs = this.data.import_jobs || [];
      this.data.import_jobs.unshift(job);
      this.logAction('CREATE_IMPORT_JOB', 'IMPORT_JOB', jobId, `Tạo lô nhập: ${job.filename} (${valid}/${parsedFeatures.length} hợp lệ)`, user);
      this.save();
      return job;
    }

    approveImportJob(jobId, layerId = 'layer_infra', user = { id: 'admin', role: 'ADMIN' }) {
      const job = (this.data.import_jobs || []).find(j => j.id === jobId);
      if (!job) throw new Error('Không tìm thấy lô nhập');
      if (job.status === 'APPROVED') throw new Error('Lô dữ liệu này đã được phê duyệt trước đó');

      let count = 0;
      (job.features || []).forEach(f => {
        if (f.verification_status === 'VERIFIED') {
          f.publication_status = 'PUBLISHED';
          f.layer_id = layerId;
          this.data.features.push(f);
          count++;
        }
      });

      job.status = 'APPROVED';
      job.approved_by = user.id || 'admin';
      this.logAction('APPROVE_IMPORT_JOB', 'IMPORT_JOB', jobId, `Phê duyệt ${count} đối tượng từ lô ${jobId} vào lớp ${layerId}`, user);
      this.save();
      return { ok: true, approvedCount: count };
    }

    rollbackImportJob(jobId, user = { id: 'admin', role: 'ADMIN' }) {
      const job = (this.data.import_jobs || []).find(j => j.id === jobId);
      if (!job) throw new Error('Không tìm thấy lô nhập');

      // Xóa tất cả các feature có source_id = jobId
      const beforeCount = this.data.features.length;
      this.data.features = this.data.features.filter(f => f.source_id !== jobId);
      const removedCount = beforeCount - this.data.features.length;

      job.status = 'ROLLED_BACK';
      this.logAction('ROLLBACK_IMPORT_JOB', 'IMPORT_JOB', jobId, `Hoàn tác lô nhập ${jobId}, đã thu hồi ${removedCount} đối tượng`, user);
      this.save();
      return { ok: true, removedCount };
    }

    /* ========================================================================
     * 8. NHẬT KÝ KIỂM TOÁN (GIS AUDIT LOGGING)
     * ======================================================================== */
    logAction(action, resourceType, resourceId, summary, user = { id: 'admin', role: 'ADMIN' }) {
      this.data.audit_logs = this.data.audit_logs || [];
      const entry = {
        id: `gis_log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        actor_id: user ? (user.id || user.username || 'admin') : 'anonymous',
        actor_role: user ? (user.role || 'ADMIN') : 'CONG_DAN',
        action: action,
        resource_type: resourceType,
        resource_id: resourceId,
        timestamp: new Date().toISOString(),
        change_summary: typeof summary === 'string' ? { message: summary } : summary
      };
      this.data.audit_logs.unshift(entry);
      // Giữ tối đa 500 bản ghi audit log
      if (this.data.audit_logs.length > 500) {
        this.data.audit_logs = this.data.audit_logs.slice(0, 500);
      }
    }

    getAuditLogs() {
      return this.data.audit_logs || [];
    }
  }

  // Khởi tạo Singleton
  const engine = new LuongHauGisEngine();
  global.LuongHauGisEngine = engine;

})(typeof window !== 'undefined' ? window : global);
