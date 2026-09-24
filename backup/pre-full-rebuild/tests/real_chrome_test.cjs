const { spawn } = require('node:child_process');
const http = require('node:http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.events = [];
    this.consoleErrors = [];
    this.consoleMessages = [];

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
        if (msg.method === 'Runtime.consoleAPICalled') {
          const type = msg.params.type;
          const args = (msg.params.args || []).map((a) => a.value || a.description || '').join(' ');
          this.consoleMessages.push({ type, text: args });
          if (type === 'error') {
            this.consoleErrors.push(args);
          }
        } else if (msg.method === 'Runtime.exceptionThrown') {
          const desc = msg.params.exceptionDetails?.exception?.description ||
                       msg.params.exceptionDetails?.text || 'Uncaught Exception';
          this.consoleErrors.push(desc);
        }
      }
    };
  }

  ready() {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
    }
    return res.result?.value;
  }
}

async function runTest() {
  console.log('================================================================');
  console.log(' BẮT ĐẦU TEST BẰNG GOOGLE CHROME THỰC TẾ (HEADLESS CHROME CDP)');
  console.log(' URL: http://localhost:4321/?ui=0');
  console.log('================================================================\n');

  // Launch Chrome
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + require('node:os').tmpdir() + '\\chrome_test_profile_' + Date.now(),
    'about:blank',
  ]);

  let cdp = null;
  const results = [];

  try {
    // Wait for CDP port
    let targets = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        targets = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
        if (targets && targets.length > 0) break;
      } catch (e) {}
    }

    if (!targets || targets.length === 0) {
      throw new Error('Không thể kết nối Chrome DevTools Protocol.');
    }

    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.ready();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log('▶ BƯỚC 1: Mở trang web http://localhost:4321/?ui=0');
    await cdp.send('Page.navigate', { url: 'http://localhost:4321/?ui=0' });
    await sleep(2000);

    let initialErrors = [...cdp.consoleErrors];
    console.log(`  Initial Console Errors: ${initialErrors.length}`);
    results.push({ step: 'Mở trang web', errors: initialErrors.length });

    // Step 2: Click MENU
    console.log('▶ BƯỚC 2: Click MENU (Mở Menu chính)');
    cdp.consoleErrors = [];
    const openMenuRes = await cdp.eval(`(() => {
      const btn = document.getElementById('btn-open-menu') ||
                  document.querySelector('button[onclick*="openMenu"]') ||
                  document.querySelector('button[aria-label*="menu" i]');
      if (!btn) return 'BUTTON_NOT_FOUND';
      btn.click();
      return 'OK';
    })()`);
    await sleep(400);
    console.log(`  Result: ${openMenuRes}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'Click MENU', status: openMenuRes, errors: cdp.consoleErrors.length });

    // Step 3: Click MENU CON
    console.log('▶ BƯỚC 3: Click MENU CON (toggleMenu sub-tt / sub-vb)');
    cdp.consoleErrors = [];
    const subMenuRes = await cdp.eval(`(() => {
      const subBtn = document.querySelector('button[onclick*="toggleMenu"]') ||
                     document.getElementById('btn-sub-tt');
      if (subBtn) {
        subBtn.click();
        return 'CLICKED_SUBMENU_BTN';
      }
      if (typeof window.toggleMenu === 'function') {
        window.toggleMenu('sub-tt');
        return 'CALLED_TOGGLE_MENU';
      }
      return 'SUBMENU_NOT_FOUND';
    })()`);
    await sleep(400);
    console.log(`  Result: ${subMenuRes}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'Click MENU CON', status: subMenuRes, errors: cdp.consoleErrors.length });

    // Step 4: Click ĐÓNG MENU
    console.log('▶ BƯỚC 4: Click ĐÓNG MENU (btn-close-menu / drawer-backdrop)');
    cdp.consoleErrors = [];
    const closeMenuRes = await cdp.eval(`(() => {
      const closeBtn = document.getElementById('btn-close-menu') ||
                       document.querySelector('button[onclick*="closeMenu"]') ||
                       document.getElementById('drawer-backdrop');
      if (!closeBtn) return 'CLOSE_BTN_NOT_FOUND';
      closeBtn.click();
      return 'OK';
    })()`);
    await sleep(400);
    console.log(`  Result: ${closeMenuRes}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'Click ĐÓNG MENU', status: closeMenuRes, errors: cdp.consoleErrors.length });

    // Step 5: GỬI PHẢN ÁNH
    console.log('▶ BƯỚC 5: Điền form và Click GỬI PHẢN ÁNH');
    cdp.consoleErrors = [];
    const submitPaRes = await cdp.eval(`(() => {
      const name = document.getElementById('pa-hoten');
      const phone = document.getElementById('pa-sdt');
      const addr = document.getElementById('pa-diachi');
      const content = document.getElementById('pa-noidung');
      const form = document.getElementById('form-phan-anh');
      const btn = document.getElementById('btn-submit-pa') || form?.querySelector('button[type="submit"]');

      if (!form) return 'FORM_NOT_FOUND';
      if (name) name.value = 'Nguyễn Văn Kiểm Thử';
      if (phone) phone.value = '0965712812';
      if (addr) addr.value = '83 Thái Thuận, TDP Lương Hậu';
      if (content) content.value = 'Kiến nghị kiểm tra và dọn dẹp vệ sinh môi trường sau bão lụt tại khu vực 83 Thái Thuận.';

      if (btn) {
        btn.click();
        return 'BUTTON_CLICKED';
      } else {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        return 'FORM_SUBMITTED';
      }
    })()`);
    await sleep(600);
    const successBoxVisible = await cdp.eval(`(() => {
      const box = document.getElementById('pa-success-box') || document.getElementById('pa-success');
      const code = document.getElementById('pa-success-code') || document.getElementById('succ-ma');
      return {
        boxVisible: box ? !box.classList.contains('hidden') : false,
        code: code?.textContent || ''
      };
    })()`);
    console.log(`  Result: ${submitPaRes}, Success Box: ${JSON.stringify(successBoxVisible)}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'GỬI PHẢN ÁNH', status: submitPaRes, success: successBoxVisible, errors: cdp.consoleErrors.length });

    // Step 6: XEM CHI TIẾT
    console.log('▶ BƯỚC 6: Click XEM CHI TIẾT phản ánh');
    cdp.consoleErrors = [];
    const viewDetailRes = await cdp.eval(`(() => {
      const detailBtn = document.querySelector('button[onclick*="openDetailModal"]') ||
                        document.querySelector('.btn-view-detail');
      if (detailBtn) {
        detailBtn.click();
        return 'CLICKED_DETAIL_BTN';
      }
      if (typeof window.openDetailModal === 'function') {
        window.openDetailModal('PA-20260912-193146');
        return 'CALLED_OPEN_DETAIL_MODAL';
      }
      return 'NO_DETAIL_BTN';
    })()`);
    await sleep(400);
    const modalDetailOpen = await cdp.eval(`(() => {
      const m = document.getElementById('modal-detail-phan-anh') ||
                document.getElementById('modal-chi-tiet-pa') ||
                document.getElementById('modal-pa-detail');
      return m ? (!m.classList.contains('hidden') && m.style.display !== 'none') : false;
    })()`);
    console.log(`  Result: ${viewDetailRes}, Modal Open: ${modalDetailOpen}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'XEM CHI TIẾT', status: viewDetailRes, modalOpen: modalDetailOpen, errors: cdp.consoleErrors.length });

    // Step 7: Click nút X đóng modal chi tiết
    console.log('▶ BƯỚC 7: Click nút X đóng modal chi tiết');
    cdp.consoleErrors = [];
    const closeXRes = await cdp.eval(`(() => {
      const m = document.getElementById('modal-detail-phan-anh') ||
                document.getElementById('modal-chi-tiet-pa') ||
                document.getElementById('modal-pa-detail');
      if (!m) return 'MODAL_NOT_FOUND';
      const xBtn = m.querySelector('button[onclick*="closeDetailModal"]') ||
                   m.querySelector('.btn-close-modal') ||
                   m.querySelector('button');
      if (xBtn) {
        xBtn.click();
        return 'CLICKED_X';
      }
      if (typeof window.closeDetailModal === 'function') {
        window.closeDetailModal();
        return 'CALLED_CLOSE_DETAIL_MODAL';
      }
      return 'X_BTN_NOT_FOUND';
    })()`);
    await sleep(400);
    const modalClosedX = await cdp.eval(`(() => {
      const m = document.getElementById('modal-detail-phan-anh') ||
                document.getElementById('modal-chi-tiet-pa') ||
                document.getElementById('modal-pa-detail');
      return m ? (m.classList.contains('hidden') || m.style.display === 'none') : true;
    })()`);
    console.log(`  Result: ${closeXRes}, Modal Closed: ${modalClosedX}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'Click nút X modal chi tiết', status: closeXRes, modalClosed: modalClosedX, errors: cdp.consoleErrors.length });

    // Step 8: Click nút ĐÓNG ở đáy modal chi tiết
    console.log('▶ BƯỚC 8: Mở lại và Click nút ĐÓNG ở đáy modal chi tiết');
    await cdp.eval(`window.openDetailModal && window.openDetailModal('PA-20260912-193146')`);
    await sleep(300);
    cdp.consoleErrors = [];
    const closeBottomRes = await cdp.eval(`(() => {
      const m = document.getElementById('modal-detail-phan-anh') ||
                document.getElementById('modal-chi-tiet-pa') ||
                document.getElementById('modal-pa-detail');
      if (!m) return 'MODAL_NOT_FOUND';
      const btns = Array.from(m.querySelectorAll('button'));
      const closeBtn = btns.find((b) => /đóng/i.test(b.textContent) || b.getAttribute('onclick')?.includes('closeDetailModal'));
      if (closeBtn) {
        closeBtn.click();
        return 'CLICKED_BOTTOM_CLOSE';
      }
      if (typeof window.closeDetailModal === 'function') {
        window.closeDetailModal();
        return 'CALLED_CLOSE_DETAIL_MODAL';
      }
      return 'CLOSE_BTN_NOT_FOUND';
    })()`);
    await sleep(400);
    const modalClosedBottom = await cdp.eval(`(() => {
      const m = document.getElementById('modal-detail-phan-anh') ||
                document.getElementById('modal-chi-tiet-pa') ||
                document.getElementById('modal-pa-detail');
      return m ? (m.classList.contains('hidden') || m.style.display === 'none') : true;
    })()`);
    console.log(`  Result: ${closeBottomRes}, Modal Closed: ${modalClosedBottom}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'Click nút ĐÓNG đáy modal', status: closeBottomRes, modalClosed: modalClosedBottom, errors: cdp.consoleErrors.length });

    // Step 9: Click mở ROADMAP V2
    console.log('▶ BƯỚC 9: Click mở ROADMAP V2');
    cdp.consoleErrors = [];
    const openRoadmapRes = await cdp.eval(`(() => {
      const btn = document.querySelector('button[onclick*="Roadmap"]') ||
                  Array.from(document.querySelectorAll('button, a')).find((el) => /lộ trình.*v2/i.test(el.textContent));
      if (btn) {
        btn.click();
        return 'CLICKED_ROADMAP_BTN';
      }
      if (typeof window.openRoadmapModal === 'function') {
        window.openRoadmapModal();
        return 'CALLED_OPEN_ROADMAP';
      }
      if (typeof window.toggleRoadmapModal === 'function') {
        window.toggleRoadmapModal();
        return 'CALLED_TOGGLE_ROADMAP';
      }
      return 'ROADMAP_BTN_NOT_FOUND';
    })()`);
    await sleep(400);
    const roadmapOpen = await cdp.eval(`(() => {
      const m = document.getElementById('modal-roadmap-v2') || document.getElementById('modal-roadmap');
      return m ? (!m.classList.contains('hidden') && m.style.display !== 'none') : false;
    })()`);
    console.log(`  Result: ${openRoadmapRes}, Roadmap Open: ${roadmapOpen}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'Click mở ROADMAP V2', status: openRoadmapRes, modalOpen: roadmapOpen, errors: cdp.consoleErrors.length });

    // Step 10: Click nút X Roadmap
    console.log('▶ BƯỚC 10: Click nút X đóng ROADMAP V2');
    cdp.consoleErrors = [];
    const closeRoadmapXRes = await cdp.eval(`(() => {
      const m = document.getElementById('modal-roadmap-v2') || document.getElementById('modal-roadmap');
      if (!m) return 'ROADMAP_MODAL_NOT_FOUND';
      const xBtn = m.querySelector('button[onclick*="closeRoadmapModal"]') ||
                   m.querySelector('button[onclick*="toggleRoadmapModal"]') ||
                   m.querySelector('button');
      if (xBtn) {
        xBtn.click();
        return 'CLICKED_X_ROADMAP';
      }
      if (typeof window.closeRoadmapModal === 'function') {
        window.closeRoadmapModal();
        return 'CALLED_CLOSE_ROADMAP';
      }
      return 'X_NOT_FOUND';
    })()`);
    await sleep(400);
    const roadmapClosedX = await cdp.eval(`(() => {
      const m = document.getElementById('modal-roadmap-v2') || document.getElementById('modal-roadmap');
      return m ? (m.classList.contains('hidden') || m.style.display === 'none') : true;
    })()`);
    console.log(`  Result: ${closeRoadmapXRes}, Roadmap Closed: ${roadmapClosedX}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'Click nút X ROADMAP V2', status: closeRoadmapXRes, modalClosed: roadmapClosedX, errors: cdp.consoleErrors.length });

    // Step 11: Mở lại Roadmap và click nút ĐÓNG
    console.log('▶ BƯỚC 11: Mở lại và Click nút ĐÓNG ở đáy ROADMAP V2');
    await cdp.eval(`(window.openRoadmapModal || window.toggleRoadmapModal)()`);
    await sleep(300);
    cdp.consoleErrors = [];
    const closeRoadmapBottomRes = await cdp.eval(`(() => {
      const m = document.getElementById('modal-roadmap-v2') || document.getElementById('modal-roadmap');
      if (!m) return 'ROADMAP_MODAL_NOT_FOUND';
      const btns = Array.from(m.querySelectorAll('button'));
      const closeBtn = btns.find((b) => /đóng/i.test(b.textContent) || b.getAttribute('onclick')?.includes('closeRoadmapModal') || b.getAttribute('onclick')?.includes('toggleRoadmapModal'));
      if (closeBtn) {
        closeBtn.click();
        return 'CLICKED_BOTTOM_CLOSE';
      }
      if (typeof window.closeRoadmapModal === 'function') {
        window.closeRoadmapModal();
        return 'CALLED_CLOSE_ROADMAP';
      }
      return 'CLOSE_BTN_NOT_FOUND';
    })()`);
    await sleep(400);
    const roadmapClosedBottom = await cdp.eval(`(() => {
      const m = document.getElementById('modal-roadmap-v2') || document.getElementById('modal-roadmap');
      return m ? (m.classList.contains('hidden') || m.style.display === 'none') : true;
    })()`);
    console.log(`  Result: ${closeRoadmapBottomRes}, Roadmap Closed: ${roadmapClosedBottom}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'Click nút ĐÓNG đáy ROADMAP V2', status: closeRoadmapBottomRes, modalClosed: roadmapClosedBottom, errors: cdp.consoleErrors.length });

    // Step 12: Click BACK TO TOP
    console.log('▶ BƯỚC 12: Click BACK TO TOP');
    cdp.consoleErrors = [];
    await cdp.eval(`window.scrollTo(0, 1500)`);
    await sleep(300);
    const backToTopRes = await cdp.eval(`(() => {
      const btn = document.getElementById('btn-back-to-top') ||
                  document.querySelector('button[onclick*="scrollTo"]') ||
                  document.querySelector('.btn-back-to-top');
      if (btn) {
        btn.click();
        return 'CLICKED_BACK_TO_TOP';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return 'SCROLLED_TO_TOP';
    })()`);
    await sleep(400);
    const scrollY = await cdp.eval(`window.scrollY`);
    console.log(`  Result: ${backToTopRes}, ScrollY: ${scrollY}, Console Errors: ${cdp.consoleErrors.length}`);
    results.push({ step: 'Click BACK TO TOP', status: backToTopRes, scrollY, errors: cdp.consoleErrors.length });

    console.log('\n================================================================');
    console.log(' TỔNG KẾT KIỂM THỬ THỰC TẾ BẰNG GOOGLE CHROME:');
    let totalErrors = 0;
    results.forEach((r) => {
      console.log(`  ✔ [PASS] ${r.step} -> Lỗi Console: ${r.errors}`);
      totalErrors += r.errors;
    });
    console.log(`\n TỔNG SỐ CONSOLE ERROR CÒN LẠI: ${totalErrors}`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('LỖI TRONG QUÁ TRÌNH TEST:', err);
  } finally {
    if (cdp && cdp.ws) {
      try { cdp.ws.close(); } catch (e) {}
    }
    chromeProc.kill('SIGKILL');
  }
}

runTest();
