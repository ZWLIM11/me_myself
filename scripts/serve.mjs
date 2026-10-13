import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp' };
const port = Number(process.env.PORT || 4173);
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + pathname);
    if (file !== path.resolve(root) && !file.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache' }); res.end(body);
  } catch { res.writeHead(404, {'Content-Type':'text/plain'}).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
