const fs = require('fs');

const files = [
  'index.html',
  'public/index.html',
  'dist/index.html',
  'noi_bo.html',
  'noi-bo.html',
  'public/noi_bo.html',
  'public/noi-bo.html',
  'dist/noi_bo.html',
  'dist/noi-bo.html',
  'dist/noi_bo/index.html',
  'dist/noi-bo/index.html',
  'admin.html',
  'cms.html',
  'public/cms.html',
  'src/pages/index.astro',
  'src/pages/noi_bo.astro'
];

let allOk = true;
for (const f of files) {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const hasSync = c.includes('Đồng bộ Google Sheet');
    const hasOpen = c.includes('Mở Google Sheet');
    const hasBorder = c.includes('border: 2px solid #22c55e') || c.includes('border:2px solid #22c55e');
    console.log(`${f.padEnd(26)}: Sync=${hasSync}, Open=${hasOpen}, GreenBorder=${hasBorder}`);
    if (!hasSync || !hasOpen || !hasBorder) allOk = false;
  } else {
    console.log(`${f.padEnd(26)}: NOT FOUND (Skipped)`);
  }
}

console.log('Result:', allOk ? 'ALL PASSED!' : 'SOME FAILED!');
