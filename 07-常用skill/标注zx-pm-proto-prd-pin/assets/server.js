/**
 * 极轻量零依赖本地服务 (Zero-Dependency Node.js Server for S2B2C Prototype & Realtime PRD Persistence)
 * 启动方式: node server.js
 * 访问地址: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// 自动定位 platform 目录
let BASE_DIR = __dirname;
if (fs.existsSync(path.join(__dirname, 'platform'))) {
  BASE_DIR = path.join(__dirname, 'platform');
}

// MIME 类型字典
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // 允许跨域 (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. API: 保存 PRD 数据至本地磁盘文件
  if (pathname === '/api/save-prd' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { page, data, allData } = payload;
        
        if (!page) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: '缺少 page 标识' }));
          return;
        }

        const jsDir = path.join(BASE_DIR, 'assets', 'js');
        if (!fs.existsSync(jsDir)) {
          fs.mkdirSync(jsDir, { recursive: true });
        }

        // 1.1 写入页面专属数据文件 prd-data-[page].js
        const cleanPageName = page.replace('.html', '').replace(/^prd-data-/, '');
        const pageFileName = `prd-data-${cleanPageName}.js`;
        const pageFilePath = path.join(jsDir, pageFileName);
        
        const pageJsContent = `/**
 * PRD 需求数据 - ${cleanPageName}
 * 本地实时保存于: ${new Date().toLocaleString()}
 */
window.INITIAL_PRD_DATA = ${JSON.stringify(data || [], null, 2)};
`;
        fs.writeFileSync(pageFilePath, pageJsContent, 'utf-8');

        // 1.2 如果提供了全量合并数据，更新 prd-data-all.js 和 prd-data-all.json
        if (allData && typeof allData === 'object') {
          const allFilePath = path.join(jsDir, 'prd-data-all.js');
          const allJsContent = `/**
 * 全局跨页面 PRD 需求总注册表
 * 本地实时保存于: ${new Date().toLocaleString()}
 */
window.GLOBAL_PRD_DATA = ${JSON.stringify(allData, null, 2)};
`;
          fs.writeFileSync(allFilePath, allJsContent, 'utf-8');

          const jsonFilePath = path.join(jsDir, 'prd-data-all.json');
          fs.writeFileSync(jsonFilePath, JSON.stringify(allData, null, 2), 'utf-8');
        }

        console.log(`[PRD 自动保存] 成功写入磁盘文件: assets/js/${pageFileName} (${(data || []).length} 项点位)`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          message: `已成功保存至本地文件 assets/js/${pageFileName}`, 
          timestamp: Date.now() 
        }));
      } catch (err) {
        console.error('[PRD 保存异常]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 2. API: 获取所有页面的全量 PRD 数据
  if (pathname === '/api/get-all-prd' && req.method === 'GET') {
    try {
      const jsDir = path.join(BASE_DIR, 'assets', 'js');
      const allFilePath = path.join(jsDir, 'prd-data-all.json');
      if (fs.existsSync(allFilePath)) {
        const content = fs.readFileSync(allFilePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(content);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({}));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 3. 静态文件处理
  let relativePath = pathname;
  if (relativePath === '/' || relativePath === '') {
    relativePath = '/admin.html';
  }

  const filePath = path.join(BASE_DIR, relativePath);

  // 防止目录遍历漏洞
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 S2B2C 供应链原型 & PRD 本地持久化服务已就绪！`);
  console.log(`📡 服务运行地址: http://localhost:${PORT}`);
  console.log(`📂 根目录映射: ${BASE_DIR}`);
  console.log(`✨ 页面快捷入口:`);
  console.log(`   - 运营端后台: http://localhost:${PORT}/admin.html`);
  console.log(`   - PC 商城端:  http://localhost:${PORT}/mall.html`);
  console.log(`   - 商家端后台: http://localhost:${PORT}/merchant.html`);
  console.log(`   - 买家移动H5: http://localhost:${PORT}/h5.html`);
  console.log(`   - 商家移动H5: http://localhost:${PORT}/merchant-h5.html`);
  console.log('====================================================');
});
