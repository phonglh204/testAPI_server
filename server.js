const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const port = 4000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {

 /* res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader("Access-Control-Allow-Credentials", "true"); // 🔥 bắt buộc khi dùng cookie
  */
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`Server Ready on http://localhost:${port}`);
  });
});