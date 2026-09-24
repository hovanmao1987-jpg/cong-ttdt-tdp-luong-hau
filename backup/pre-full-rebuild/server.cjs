const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3008;
const server = http.createServer((req, res) => {
  let file = req.url.split('?')[0];
  if (file === '/' || file === '') file = '/index.html';
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    let ct = 'text/html; charset=utf-8';
    if (ext === '.js') ct = 'application/javascript';
    else if (ext === '.css') ct = 'text/css';
    else if (ext === '.json') ct = 'application/json';
    else if (ext === '.png') ct = 'image/png';
    else if (ext === '.jpg') ct = 'image/jpeg';
    res.writeHead(200, { 'Content-Type': ct });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
