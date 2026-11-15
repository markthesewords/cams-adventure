// local stand-in for Netlify: serves the game and runs the real leaderboard rules against an in-memory store
import http from 'node:http'; import fs from 'node:fs';
import { handle } from '../site/netlify/functions/lb-core.mjs';
const mem = new Map(); const store = { get: async (k) => (mem.has(k) ? JSON.parse(mem.get(k)) : null), set: async (k, v) => { mem.set(k, JSON.stringify(v)); } };
http.createServer(async (rq, rs) => {
  if (rq.url.startsWith('/.netlify/functions/leaderboard')) {
    const chunks = []; for await (const c of rq) chunks.push(c);
    const req = new Request('http://localhost' + rq.url, { method: rq.method, headers: rq.headers, body: ['GET', 'HEAD'].includes(rq.method) ? undefined : Buffer.concat(chunks) });
    const r = await handle(req, store); rs.writeHead(r.status, { 'content-type': 'application/json' }); rs.end(await r.text()); return;
  }
  rs.writeHead(200, { 'content-type': 'text/html' }); rs.end(fs.readFileSync(new URL('../site/public/index.html', import.meta.url)));
}).listen(8765, () => console.log('up'));
