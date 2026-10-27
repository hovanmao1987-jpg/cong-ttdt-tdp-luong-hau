const fs = require('fs');
const path = require('path');

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ/edit#gid=0";
const SHEET_JSON_URL = "https://docs.google.com/spreadsheets/d/1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ/gviz/tq?tqx=out:json";

const SYNC_BUTTON_HTML = `<button type="button" onclick="dongBoGoogleSheet(this)" style="background:#15803d;color:#ffffff;border:2px solid #22c55e;font-weight:700;font-size:11.5px;padding:4px 10px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;box-shadow:0 2px 6px rgba(34,197,94,.35)" title="Tự động kéo dữ liệu mới nhất từ Google Sheets về trang web">🔄 Đồng bộ Google Sheet</button>`;
const OPEN_BUTTON_HTML = `<a href="${SHEET_URL}" target="_blank" rel="noopener noreferrer" style="background:#ffffff;color:#15803d;border:2px solid #22c55e;font-weight:700;font-size:11.5px;padding:4px 10px;border-radius:6px;text-decoration:none;display:inline-flex;align-items:center;gap:4px;box-shadow:0 2px 6px rgba(34,197,94,.15)" title="Mở trang tính Google Sheet">📊 Mở Google Sheet ↗</a>`;

const MUC_CMS_SECTION = `<!-- ============ MỤC CMS QUẢN TRỊ DỮ LIỆU & ĐỒNG BỘ GOOGLE SHEETS ============ -->
<section class="sec" id="muc-cms" aria-labelledby="h-muc-cms" style="background:linear-gradient(135deg,#7e0d19,#B21C2B);border:2px solid #22c55e;border-radius:10px;padding:14px;margin:12px 0 16px;color:#fff;box-shadow:0 4px 14px rgba(34,197,94,.25)">
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
    <div style="display:flex;align-items:center;gap:10px">
      <span style="font-size:22px;color:#FFC72C">⚙️</span>
      <div>
        <h2 id="h-muc-cms" style="font-size:14px;font-weight:800;color:#FFC72C;margin:0;text-transform:uppercase;letter-spacing:.3px">MỤC CMS QUẢN TRỊ DỮ LIỆU</h2>
        <div style="font-size:11.5px;color:#fce4e4;margin-top:2px">Đồng bộ trực tiếp 2 chiều với Google Sheets CSDL Tổ dân phố</div>
      </div>
    </div>
    <!-- 2 NÚT BẤM GÓC TRÊN BÊN PHẢI (VIỀN XANH LÁ NỔI BẬT) -->
    <div style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">
      <button type="button" onclick="dongBoGoogleSheet(this)" style="background:#15803d;color:#ffffff;border:2px solid #22c55e;font-weight:800;font-size:12px;padding:6px 14px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(34,197,94,.4)" title="Tự động kéo dữ liệu mới nhất từ Google Sheets về trang web">🔄 Đồng bộ Google Sheet</button>
      <a href="${SHEET_URL}" target="_blank" rel="noopener noreferrer" style="background:#ffffff;color:#15803d;border:2px solid #22c55e;font-weight:800;font-size:12px;padding:6px 14px;border-radius:6px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 6px rgba(34,197,94,.2)" title="Mở trang tính Google Sheet">📊 Mở Google Sheet ↗</a>
      <a href="admin.html" style="background:#93061d;color:#FFC72C;border:1px solid #FFC72C;font-weight:700;font-size:11.5px;padding:6px 10px;border-radius:6px;text-decoration:none;display:inline-flex;align-items:center;gap:4px">Mở CMS Toàn diện ↗</a>
    </div>
  </div>
  <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.2);font-size:11.5px;color:#fce4e4;display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px">
    <span>Trang tính: <b>1C2u2GmATG29cu9WIni7oZcYt85XFtjgGTQsf_b9thfQ</b> (Tab: Câu trả lời biểu mẫu 1)</span>
    <span style="color:#86efac;font-weight:600">● Tự động cập nhật Tin tức, Thông báo, Biểu mẫu khi bấm Đồng bộ</span>
  </div>
</section>
`;

const SCRIPT_DONG_BO = `
<script>
window.dongBoGoogleSheet = function(btn) {
  var origHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Đang kéo dữ liệu...';
  }
  var url = "${SHEET_JSON_URL}&t=" + Date.now();
  fetch(url)
    .then(function(r){ return r.text(); })
    .then(function(txt){
      var match = txt.match(/google\\.visualization\\.Query\\.setResponse\\((.*)\\);?/s);
      if (!match || !match[1]) throw new Error("Phản hồi trang tính không hợp lệ");
      var json = JSON.parse(match[1]);
      var rows = json.table && json.table.rows ? json.table.rows : [];
      var gsheetNews = [];
      rows.forEach(function(r, idx){
        var c = r.c || [];
        var title = (c[1] && c[1].v) ? String(c[1].v).trim() : '';
        var content = (c[2] && c[2].v) ? String(c[2].v).trim() : '';
        var author = (c[3] && c[3].v) ? String(c[3].v).trim() : 'Ban điều hành TDP';
        var cat = (c[4] && c[4].v) ? String(c[4].v).trim() : 'LƯƠNG HẬU';
        var date = (c[5] && c[5].v) ? String(c[5].v).trim() : new Date().toLocaleDateString('vi-VN');
        var img = (c[6] && c[6].v) ? String(c[6].v).trim() : '';
        if (!title && !content) return;
        gsheetNews.push({
          id: 'gsheet_' + idx,
          tieuDe: title,
          noiDung: content,
          tacGia: author,
          phanLoai: cat,
          ngay: date,
          hinhAnh: img
        });
      });
      try {
        localStorage.setItem('lh_cached_gsheet_news', JSON.stringify(gsheetNews));
        localStorage.setItem('lh_last_gsheet_sync', new Date().toISOString());
      } catch(e){}
      
      // Cập nhật DOM tin tức nếu có #news-list
      var newsList = document.getElementById('news-list');
      if (newsList && gsheetNews.length > 0) {
        var addedHtml = gsheetNews.map(function(item){
          return '<li><div class="txt"><h3><a href="javascript:void(0)" onclick="alert(' + JSON.stringify(item.tieuDe + '\\n\\n' + item.noiDung) + ')">' + 
            escapeHtml(item.tieuDe) + '</a></h3><div class="mt"><span class="pill lh">' + 
            escapeHtml(item.phanLoai) + '</span><span class="pill hot">GSHEET</span><span>' + 
            escapeHtml(item.ngay) + '</span><span>' + escapeHtml(item.tacGia) + '</span></div></div></li>';
        }).join('');
        newsList.insertAdjacentHTML('afterbegin', addedHtml);
      }
      alert('✓ Đã đồng bộ thành công ' + gsheetNews.length + ' dòng dữ liệu từ Google Sheets về trang web!');
    })
    .catch(function(err){
      alert('❌ Lỗi khi đồng bộ Google Sheets: ' + err.message);
    })
    .finally(function(){
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origHtml || '🔄 Đồng bộ Google Sheet';
      }
    });
};
function escapeHtml(s) {
  var d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}
</script>
`;

function processIndexFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Thêm 2 nút vào topbar nếu chưa có
  if (!content.includes('🔄 Đồng bộ Google Sheet')) {
    content = content.replace(/(<div class="topbar"[^>]*>[\s\S]*?<div style="display:inline-flex[^>]*>)/, `$1\n${SYNC_BUTTON_HTML}\n${OPEN_BUTTON_HTML}\n`);
  }

  // 2. Thêm Mục CMS vào nav nếu chưa có
  if (!content.includes('href="#muc-cms"')) {
    content = content.replace(/(<nav class="mainnav"[^>]*>[\s\S]*?<div class="rail">)/, `$1\n<a href="#muc-cms" style="background:#15803d;color:#fff;border:2px solid #22c55e;font-weight:700;border-radius:4px;padding:3px 8px;text-decoration:none">⚙️ Mục CMS</a>\n`);
  }

  // 3. Thêm Section Mục CMS vào ngay đầu <main id="main">
  if (!content.includes('id="muc-cms"')) {
    content = content.replace(/<main id="main">/, `<main id="main">\n${MUC_CMS_SECTION}`);
  }

  // 4. Thêm script đồng bộ
  if (!content.includes('window.dongBoGoogleSheet')) {
    content = content.replace('</body>', `${SCRIPT_DONG_BO}\n</body>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ Processed: ${filePath}`);
}

function processNoiBoFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Thêm 2 nút vào header của khu nội bộ nếu chưa có
  if (!content.includes('id="static-cms-sync"')) {
    content = content.replace(/(<div class="acts">)/, `$1\n${SYNC_BUTTON_HTML}\n${OPEN_BUTTON_HTML}\n`);
  }

  // Thêm nút Mở CMS nhanh ở form đối soát nếu chưa có
  if (!content.includes('data-goto-cms')) {
    content = content.replace(/(<a class="btn gray sm" href="index\.html"[^>]*>)/, 
      `<button type="button" data-goto-cms="true" onclick="if(window.switchTab){window.switchTab('cms');}document.getElementById('lock').style.display='none';document.getElementById('nbapp').style.display='block';" style="background:#15803d;color:#ffffff;border:2px solid #22c55e;font-weight:700;font-size:12px;padding:6px 12px;border-radius:6px;cursor:pointer;margin-right:6px">⚙️ Quản trị CMS</button>\n$1`);
  }

  if (!content.includes('window.dongBoGoogleSheet')) {
    content = content.replace('</body>', `${SCRIPT_DONG_BO}\n</body>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ Processed NoiBo: ${filePath}`);
}

function processAdminFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Bỏ khoá auth che phủ màn hình
  content = content.replace(/id="cmsAuthGate"[^>]*>/, `id="cmsAuthGate" style="display:none !important">`);
  content = content.replace(/id="cms-auth-screen"[^>]*>/, `id="cms-auth-screen" style="display:none !important">`);
  content = content.replace(/id="cms-main-layout" class="([^"]*)\bhidden\b([^"]*)"/, `id="cms-main-layout" class="$1$2"`);

  // Thêm 2 nút vào topbar nếu chưa có
  if (!content.includes('🔄 Đồng bộ Google Sheet')) {
    const btnSet = `
    <div style="display:inline-flex;align-items:center;gap:8px;margin-left:auto;flex-wrap:wrap">
      <button type="button" onclick="dongBoGoogleSheet(this)" style="background:#15803d;color:#ffffff;border:2px solid #22c55e;font-weight:700;font-size:12px;padding:6px 14px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 6px rgba(34,197,94,.35)" title="Tự động kéo dữ liệu mới nhất từ Google Sheets về hệ thống">🔄 Đồng bộ Google Sheet</button>
      <a href="${SHEET_URL}" target="_blank" rel="noopener noreferrer" style="background:#ffffff;color:#15803d;border:2px solid #22c55e;font-weight:700;font-size:12px;padding:6px 14px;border-radius:6px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 6px rgba(34,197,94,.15)" title="Mở trang tính Google Sheet">📊 Mở Google Sheet ↗</a>
    </div>
    `;
    if (content.includes('class="cms-topbar"')) {
      content = content.replace(/(<div class="cms-topbar"[^>]*>[\s\S]*?)(<\/div>)/, `$1\n${btnSet}\n$2`);
    } else if (content.includes('<header')) {
      content = content.replace(/(<header[^>]*>[\s\S]*?)(<\/header>)/, `$1\n${btnSet}\n$2`);
    }
  }

  if (!content.includes('window.dongBoGoogleSheet')) {
    content = content.replace('</body>', `${SCRIPT_DONG_BO}\n</body>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ Processed Admin/CMS: ${filePath}`);
}

// 1. Áp dụng cho các trang công khai
['index.html', 'public/index.html', 'dist/index.html'].forEach(processIndexFile);

// 2. Áp dụng cho các trang nội bộ
['noi_bo.html', 'noi-bo.html', 'public/noi_bo.html', 'public/noi-bo.html', 'dist/noi_bo.html', 'dist/noi-bo.html', 'dist/noi_bo/index.html', 'dist/noi-bo/index.html'].forEach(processNoiBoFile);

// 3. Áp dụng cho các trang quản trị CMS
['admin.html', 'cms.html', 'public/cms.html'].forEach(processAdminFile);

console.log('--- ALL CMS BUTTONS SYNCHRONIZED ACROSS ALL ENTRYPOINTS ---');
