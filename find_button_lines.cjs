const fs = require('fs');

const files = [
  'admin.html',
  'cms.html',
  'index.html',
  'noi_bo.html',
  'src/pages/index.astro',
  'src/pages/noi_bo.astro'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const lines = c.split('\n');
    console.log(`=== ${f} ===`);
    lines.forEach((l, idx) => {
      if (l.includes('Đồng bộ Google Sheet') || l.includes('Mở Google Sheet')) {
        console.log(`Line ${idx+1}: ${l.trim().slice(0, 150)}`);
      }
    });
  }
}
