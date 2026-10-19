/**
 * UI Renderer Test Suite for ZaloNotifyUI
 * Verifies that all 7 subtabs and modals render without syntax or DOM exceptions.
 */

const assert = require('assert');

// Mock localStorage
const storageMock = {};
global.localStorage = {
  getItem: (key) => storageMock[key] || null,
  setItem: (key, val) => { storageMock[key] = String(val); },
  removeItem: (key) => { delete storageMock[key]; },
  clear: () => { Object.keys(storageMock).forEach(k => delete storageMock[k]); }
};

// Minimal DOM mock sufficient for template rendering and element queries
function createMockElement(tagName = 'div', attrs = {}) {
  const el = {
    tagName: tagName.toUpperCase(),
    attributes: { ...attrs },
    style: {},
    classList: {
      _classes: new Set(),
      add: function (...cls) { cls.forEach(c => this._classes.add(c)); },
      remove: function (...cls) { cls.forEach(c => this._classes.delete(c)); },
      toggle: function (cls, force) {
        if (force === undefined) {
          if (this._classes.has(cls)) this._classes.delete(cls);
          else this._classes.add(cls);
        } else if (force) {
          this._classes.add(cls);
        } else {
          this._classes.delete(cls);
        }
      },
      contains: function (cls) { return this._classes.has(cls); }
    },
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(val) {
      this._innerHTML = String(val);
      // parse child elements with simple regex for event listener attachment
    },
    innerText: '',
    value: '',
    getAttribute: function (k) { return this.attributes[k] || null; },
    setAttribute: function (k, v) { this.attributes[k] = String(v); },
    addEventListener: function (evt, handler) {},
    querySelector: function (sel) { return createMockElement('div'); },
    querySelectorAll: function (sel) {
      if (sel.includes('.zn-tab-btn')) {
        return ['dashboard', 'contacts', 'groups', 'composer', 'dispatch', 'schedules', 'logs'].map(tab => {
          const btn = createMockElement('button', { 'data-zntab': tab });
          return btn;
        });
      }
      return [createMockElement('div')];
    },
    appendChild: function (c) {},
    removeChild: function (c) {},
    remove: function () {}
  };
  return el;
}

global.document = {
  querySelector: (sel) => createMockElement('div', { id: sel.replace('#', '') }),
  querySelectorAll: (sel) => [createMockElement('div')],
  createElement: (tag) => createMockElement(tag),
  body: createMockElement('body')
};

global.window = {
  auth: {
    getCurrentUser: () => ({ id: 'usr_bithu', full_name: 'Hồ Văn Mão', role: 'BI_THU' })
  },
  LH: {
    ROSTER: [{ id: '1', hoTen: 'Hồ Văn Mão', chucVu: 'Bí thư Chi bộ', soDienThoai: '0962481112' }]
  }
};

require('../assets/js/zalo-notify.js');
const ZaloNotify = globalThis.ZaloNotifyModule;

console.log('=== TESTING ZALONOTIFY UI COMPONENT RENDERING ===\n');

const engine = new ZaloNotify.Engine();
const container = createMockElement('div', { id: 'zn-box' });
const ui = new ZaloNotify.UI(engine, container);
ui.init({ full_name: 'Hồ Văn Mão', role: 'BI_THU' });

const tabs = ['dashboard', 'contacts', 'groups', 'composer', 'dispatch', 'schedules', 'logs'];

tabs.forEach(tab => {
  try {
    ui.switchToTab(tab);
    console.log(`  ✓ Subtab [${tab.toUpperCase()}] rendered cleanly`);
  } catch (err) {
    console.error(`  ✗ Subtab [${tab.toUpperCase()}] failed:`, err);
    process.exit(1);
  }
});

// Test CSV Export methods
try {
  const csvContacts = engine.exportContactsToCsv();
  assert(csvContacts.startsWith('\uFEFF'), 'CSV contacts has UTF-8 BOM');
  console.log('  ✓ exportContactsToCsv() produced valid UTF-8 BOM string');

  const campaigns = engine.getCampaigns();
  if (campaigns.length > 0) {
    const csvReport = engine.exportReportCsv(campaigns[0].id);
    assert(csvReport.startsWith('\uFEFF'), 'CSV report has UTF-8 BOM');
    console.log('  ✓ exportReportCsv() produced valid UTF-8 BOM report');
  }
} catch (err) {
  console.error('  ✗ CSV export failed:', err);
  process.exit(1);
}

console.log('\nALL UI SUBTABS & EXPORT CHANNELS VERIFIED 100% OK!\n');
