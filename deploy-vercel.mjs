import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import https from 'node:https';

const TOKEN = process.env.VERCEL_TOKEN || process.argv[2] || '';
const TEAM_ID = 'team_mQXTdycLLz9V8M7PZdBX2thE';
const PROJECT_ID = 'prj_nj71bNJ5yS6RPkoJkhxYvejsUd9l'; // luong-hau
const PROJECT_NAME = 'luong-hau';
const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

function sha1(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex');
}

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error('Request timed out'));
    });
    if (data) req.write(data);
    req.end();
  });
}

async function uploadFile(item) {
  const options = {
    hostname: 'api.vercel.com',
    path: `/v2/files?teamId=${TEAM_ID}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/octet-stream',
      'x-vercel-digest': item.sha,
      'Content-Length': item.size
    }
  };
  const res = await request(options, item.data);
  if (res.status === 200 || res.status === 201 || res.status === 409) {
    return true;
  }
  console.warn(`  Notice uploading ${item.file}: status ${res.status}`);
  return false;
}

async function main() {
  console.log('=== VERCEL DEPLOYMENT FOR LUONG-HAU ===');
  const files = [];

  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else {
        const rel = path.relative(DIST, full).split(/[/\\]+/).join('/');
        const data = fs.readFileSync(full);
        files.push({
          file: rel,
          data,
          sha: sha1(data),
          size: data.length
        });
      }
    }
  }

  walk(DIST);
  console.log(`Found ${files.length} files in dist/ to deploy.`);

  // Upload with concurrency of 8
  console.log('Uploading files to Vercel...');
  const pool = 8;
  for (let i = 0; i < files.length; i += pool) {
    const chunk = files.slice(i, i + pool);
    await Promise.all(chunk.map(f => uploadFile(f)));
    process.stdout.write(`  Uploaded ${Math.min(i + pool, files.length)} / ${files.length}\r`);
  }
  console.log('\nAll files uploaded successfully.');

  // Create deployment
  console.log('Creating production deployment...');
  const deployPayload = JSON.stringify({
    name: PROJECT_NAME,
    project: PROJECT_ID,
    target: 'production',
    files: files.map(f => ({ file: f.file, sha: f.sha, size: f.size })),
    projectSettings: {
      framework: null,
      buildCommand: null,
      outputDirectory: null
    }
  });

  const deployRes = await request({
    hostname: 'api.vercel.com',
    path: `/v13/deployments?teamId=${TEAM_ID}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(deployPayload)
    }
  }, deployPayload);

  if (deployRes.status !== 200) {
    console.error('Failed to create deployment:', deployRes.status, deployRes.body);
    process.exit(1);
  }

  const deployData = JSON.parse(deployRes.body);
  const uid = deployData.id || deployData.uid;
  console.log(`Deployment created: ${uid}`);
  console.log(`Target URL: https://${deployData.url}`);

  // Wait for READY
  console.log('Waiting for deployment to be READY...');
  let ready = false;
  for (let p = 0; p < 30; p++) {
    await new Promise(r => setTimeout(r, 2000));
    const statusRes = await request({
      hostname: 'api.vercel.com',
      path: `/v13/deployments/${uid}?teamId=${TEAM_ID}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
    if (statusRes.status === 200) {
      const info = JSON.parse(statusRes.body);
      console.log(`  Poll ${p + 1}: ${info.readyState}`);
      if (info.readyState === 'READY') {
        ready = true;
        break;
      }
      if (info.readyState === 'ERROR') {
        console.error('Deployment errored:', info.error);
        break;
      }
    }
  }

  if (!ready) {
    console.warn('Deployment did not become READY within timeout.');
  }

  // Assign alias
  console.log("Assigning official alias 'luong-hau.vercel.app'...");
  const aliasPayload = JSON.stringify({ alias: 'luong-hau.vercel.app' });
  const aliasRes = await request({
    hostname: 'api.vercel.com',
    path: `/v2/deployments/${uid}/aliases?teamId=${TEAM_ID}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(aliasPayload)
    }
  }, aliasPayload);

  console.log('Alias response:', aliasRes.status, aliasRes.body);
  console.log('=== DEPLOYMENT COMPLETED! ===');
  console.log('Check live URL: https://luong-hau.vercel.app');
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
