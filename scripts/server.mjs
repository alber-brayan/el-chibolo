import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const file = path.resolve(root, '.' + pathname);
    const assetRoot = path.join(root, 'assets') + path.sep;
    // Serve the website only; repository metadata and local scripts stay private.
    if (file !== path.join(root, 'index.html') && !file.startsWith(assetRoot)) {
      res.writeHead(404);
      res.end('No encontrado');
      return;
    }
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': 'no-cache',
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404);
    res.end('No encontrado');
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `El puerto ${port} está ocupado. Detén el otro servidor o establece PORT.`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`El Chibolo: http://127.0.0.1:${port}`));
