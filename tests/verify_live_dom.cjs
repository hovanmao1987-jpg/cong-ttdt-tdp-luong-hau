const fs = require('fs');

function testPage(filePath, name) {
  console.log(`=== Testing ${name} (${filePath}) ===`);
  const html = fs.readFileSync(filePath, 'utf8');

  const hasCss = html.includes('assets/css/zalo-notify.css');
  const hasJs = html.includes('assets/js/zalo-notify.js');
  const hasTrigger = html.includes('zalo-notify') || html.includes('ZaloNotify') || html.includes('zalonotify');
  const hasBox = html.includes('id="module-zalo-notify"') || 
                 html.includes('id="tab-zalo-notify"') ||
                 html.includes('id="zn-box"');

  console.log('  CSS Link:      ', hasCss);
  console.log('  JS Script:     ', hasJs);
  console.log('  Trigger:       ', hasTrigger);
  console.log('  Module Box:    ', hasBox);
}

testPage('dist/dang-vien/index.html', 'Khu vực Đảng Viên');
testPage('dist/bi-thu/index.html', 'Dashboard Bí Thư');
testPage('dist/noi-bo/index.html', 'Nội Bộ Chi Bộ');
testPage('dist/admin/index.html', 'CMS Quản Trị');
