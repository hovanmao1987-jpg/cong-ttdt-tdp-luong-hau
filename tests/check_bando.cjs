const fs = require('fs');

const html = fs.readFileSync('bando.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];
const scriptContent = scriptMatches.map(m => m[1]).join('\n');

const getElementByIdRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
const idsInScript = new Set();
let match;
while ((match = getElementByIdRegex.exec(scriptContent)) !== null) {
  idsInScript.add(match[1]);
}

console.log('Total unique IDs queried via getElementById:', idsInScript.size);
const missingIds = [];
for (const id of idsInScript) {
  const idRegex = new RegExp(`id=["']${id}["']`);
  if (!idRegex.test(html)) {
    missingIds.push(id);
  }
}

if (missingIds.length > 0) {
  console.error('❌ Missing IDs found in bando.html:', missingIds);
} else {
  console.log('✅ All queried IDs exist in the HTML!');
}
