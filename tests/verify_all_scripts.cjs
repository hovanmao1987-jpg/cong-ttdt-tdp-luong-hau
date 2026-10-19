const fs = require('fs');
const vm = require('vm');

const pages = ['admin.html', 'dang-vien.html', 'bi-thu.html', 'index.html', 'noi_bo.html', 'cms.html'];

console.log('=== VERIFYING SCRIPTS EXECUTION IN HTML FILES ===\n');

let allPassed = true;

for (const p of pages) {
  const content = fs.readFileSync(p, 'utf-8');
  
  // Extract all <script> tags
  const scriptRegex = /<script(?:\s+type="module")?>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptIndex = 0;
  
  // Create sandbox
  const sandbox = {
    window: {},
    document: {
      getElementById: (id) => ({
        style: {},
        innerHTML: '',
        innerText: '',
        addEventListener: () => {},
        classList: { add: () => {}, remove: () => {} },
        parentElement: { style: {} }
      }),
      querySelectorAll: () => [],
      querySelector: () => null
    },
    navigator: {
      clipboard: { writeText: () => Promise.resolve() },
      userAgent: 'Mozilla/5.0'
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },

    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },
    console: {
      log: () => {},
      warn: () => {},
      error: (...args) => console.error('  [SANDBOX ERROR]', ...args)
    },
    setTimeout: () => {},
    clearTimeout: () => {},
    setInterval: () => {},
    clearInterval: () => {},
    Date: Date,
    Math: Math,
    JSON: JSON,
    alert: () => {},
    confirm: () => true
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;

  const context = vm.createContext(sandbox);

  let hasError = false;
  while ((match = scriptRegex.exec(content)) !== null) {
    scriptIndex++;
    const code = match[1].trim();
    if (!code) continue;
    try {
      vm.runInContext(code, context);
    } catch (err) {
      console.error(`  [FAIL] ${p} Script #${scriptIndex}: ${err.message}`);
      hasError = true;
      allPassed = false;
    }
  }

  if (!hasError) {
    console.log(`  [PASS] ${p}: All ${scriptIndex} scripts executed without error.`);
  }
}

// Test auth methods in context
console.log('\n--- TESTING AUTH & LOGIN IN CONTEXT ---');
const dvContent = fs.readFileSync('dang-vien.html', 'utf-8');
const sandbox = {
  window: {},
  document: {
    getElementById: (id) => ({ style: {}, innerHTML: '', innerText: '', addEventListener: () => {} }),
    querySelectorAll: () => []
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console: console,
  Date, Math, JSON, alert: () => {}, confirm: () => true
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);
const scripts = [];
let m;
const r = /<script(?:\s+type="module")?>([\s\S]*?)<\/script>/gi;
while ((m = r.exec(dvContent)) !== null) {
  if (m[1].trim()) scripts.push(m[1].trim());
}
for (const s of scripts) {
  vm.runInContext(s, ctx);
}

const db = ctx.window.db || new ctx.window.LuongHauDatabase();
const auth = ctx.window.auth || new ctx.window.AuthEngine(db);

const pinRes = auth.loginWithPin('2026');
console.log('PIN Login (2026):', pinRes.success ? 'SUCCESS' : 'FAILED', pinRes.user?.full_name);

const accRes = auth.login('bithu', 'bithu2026');
console.log('Account Login (bithu/bithu2026):', accRes.success ? 'SUCCESS' : 'FAILED', accRes.user?.full_name);

const adminRes = auth.login('admin', 'admin2026');
console.log('Account Login (admin/admin2026):', adminRes.success ? 'SUCCESS' : 'FAILED', adminRes.user?.full_name);

if (pinRes.success && accRes.success && adminRes.success && allPassed) {
  console.log('\nALL SCRIPTS & AUTH LOGINS VERIFIED 100% OK!');
} else {
  console.error('\nSOME CHECKS FAILED!');
  process.exit(1);
}
