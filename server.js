const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const ROOT_DIR = __dirname;
const DATA_FILE = path.join(ROOT_DIR, 'data', 'resume.json');
const DEFAULT_DATA_FILE = path.join(ROOT_DIR, 'data', 'default-resume.json');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const JOBS_FILE = path.join(ROOT_DIR, 'data', 'applications.json');

// 默认投递记录表头字段（对标 givemeoc 校招投递管理表）
const DEFAULT_JOB_COLUMNS = [
  { key: 'company',    label: '公司名称',   visible: true, width: 160, type: 'text' },
  { key: 'companyType',label: '公司类型',   visible: true, width: 100, type: 'tag'  },
  { key: 'industry',   label: '所属行业',   visible: true, width: 110, type: 'text' },
  { key: 'batch',      label: '招聘类型',   visible: true, width: 90,  type: 'tag'  },
  { key: 'target',     label: '招聘对象',   visible: true, width: 110, type: 'tag'  },
  { key: 'location',   label: '工作地点',   visible: true, width: 180, type: 'text' },
  { key: 'position',   label: '岗位',       visible: true, width: 240, type: 'text' },
  { key: 'status',     label: '投递进度',   visible: true, width: 110, type: 'status' },
  { key: 'updatedAt',  label: '更新时间',   visible: true, width: 110, type: 'date' },
  { key: 'deadline',   label: '投递截止',   visible: true, width: 110, type: 'date' },
  { key: 'link',       label: '相关链接',   visible: true, width: 100, type: 'link' },
  { key: 'announcement',label:'招聘公告',   visible: true, width: 100, type: 'link' },
  { key: 'writtenTest',label: '笔试情况',   visible: true, width: 100, type: 'text' },
  { key: 'scale',      label: '公司规模',   visible: true, width: 100, type: 'text' },
  { key: 'note',       label: '备注',       visible: true, width: 160, type: 'text' }
];

// 确保目录存在
if (!fs.existsSync(path.join(ROOT_DIR, 'data'))) {
  fs.mkdirSync(path.join(ROOT_DIR, 'data'), { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.map': 'application/json'
};

// 获取简历数据
function getResumeData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('读取 resume.json 失败:', err.message);
  }
  if (fs.existsSync(DEFAULT_DATA_FILE)) {
    const raw = fs.readFileSync(DEFAULT_DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  }
  return {};
}

// 保存简历数据
function saveResumeData(data) {
  const tempPath = DATA_FILE + '.tmp';
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DATA_FILE);
}

// ============ 投递记录数据存取 ============
function getJobsData() {
  try {
    if (fs.existsSync(JOBS_FILE)) {
      const raw = fs.readFileSync(JOBS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.columns) || parsed.columns.length === 0) {
        parsed.columns = DEFAULT_JOB_COLUMNS.slice();
      }
      if (!Array.isArray(parsed.rows)) parsed.rows = [];
      return parsed;
    }
  } catch (err) {
    console.error('读取 applications.json 失败:', err.message);
  }
  return { columns: DEFAULT_JOB_COLUMNS.slice(), rows: [] };
}

function saveJobsData(data) {
  const tempPath = JOBS_FILE + '.tmp';
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, JOBS_FILE);
}

// 注意：此处刻意不实现“爬取 givemeoc 等第三方站点”的功能。
// 原因：目标站点需登录鉴权、且抓取他人站点数据可能违反其服务条款与 robots 协议。
// 正确做法：由用户在浏览器中打开岗位列表页，用页面上的「复制」功能把表格文本粘贴进来，
// 系统用下面的解析器把纯文本/TSV/CSV 智能转为结构化记录（等价效果，且完全合规）。
function parseJobsText(rawText) {
  const rows = [];
  if (!rawText || !rawText.trim()) return rows;

  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // 统一分隔符：优先 Tab（Excel/网页表格复制），其次连续两空格以上，再次 | 或 ,
  lines.forEach(line => {
    let cells = [];
    if (line.includes('\t')) {
      cells = line.split('\t');
    } else if (/\s{2,}/.test(line)) {
      cells = line.split(/\s{2,}/);
    } else if (line.includes('|')) {
      cells = line.split('|');
    } else if (line.split(',').length >= 4) {
      cells = line.split(',');
    } else {
      return; // 无法可靠切分的行跳过
    }
    cells = cells.map(c => c.trim()).filter(c => c.length > 0);
    if (cells.length < 2) return;

    // 跳过表头行
    if (/公司名称|公司类型|所属行业|招聘类型|投递进度|岗位/.test(cells[0]) &&
        /公司|岗位|进度|行业/.test(cells.join(''))) {
      return;
    }

    const row = {};
    DEFAULT_JOB_COLUMNS.forEach((col, idx) => {
      row[col.key] = cells[idx] !== undefined ? cells[idx] : '';
    });
    // 若列数与默认表头差异大，剩余单元格并入备注
    if (cells.length > DEFAULT_JOB_COLUMNS.length) {
      const extra = cells.slice(DEFAULT_JOB_COLUMNS.length).join(' ');
      row.note = (row.note ? row.note + ' ' : '') + extra;
    }
    row.id = 'job_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
    row.createdAt = new Date().toISOString().slice(0, 10);
    if (!row.updatedAt) row.updatedAt = row.createdAt;
    if (!row.status) row.status = '未投递';
    rows.push(row);
  });

  return rows;
}

// 请求体解析器 (支持 JSON)
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 20 * 1024 * 1024) { // 20MB 限额
        req.destroy();
        reject(new Error('Payload Too Large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// 静态文件服务
function serveStatic(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Content-Length': stats.size
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // 跨域头与公共头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API 路由: 获取简历数据
  if (pathname === '/api/resume' && req.method === 'GET') {
    try {
      const data = getResumeData();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // API 路由: 保存简历数据
  if (pathname === '/api/resume' && req.method === 'POST') {
    try {
      const body = await parseRequestBody(req);
      if (!body || typeof body !== 'object') {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: '无效的数据格式' }));
        return;
      }
      saveResumeData(body);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, message: '保存成功！', updatedAt: new Date().toISOString() }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // API 路由: 重置默认数据
  if (pathname === '/api/reset' && req.method === 'POST') {
    try {
      if (fs.existsSync(DEFAULT_DATA_FILE)) {
        const defaultRaw = fs.readFileSync(DEFAULT_DATA_FILE, 'utf-8');
        fs.writeFileSync(DATA_FILE, defaultRaw, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: '已恢复初始默认数据' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: '未找到默认数据模板' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // API 路由: 上传图片 (Base64 dataURL)
  if (pathname === '/api/upload' && req.method === 'POST') {
    try {
      const body = await parseRequestBody(req);
      const { dataUrl, fileName } = body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: '缺少图片数据' }));
        return;
      }

      const match = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!match) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: '非法的 Base64 图片格式' }));
        return;
      }

      const mime = match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');

      let ext = '.png';
      if (mime === 'image/jpeg') ext = '.jpg';
      else if (mime === 'image/gif') ext = '.gif';
      else if (mime === 'image/svg+xml') ext = '.svg';
      else if (mime === 'image/webp') ext = '.webp';

      const safeName = (fileName ? path.basename(fileName, path.extname(fileName)) : 'upload')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFileName = `${safeName}_${Date.now()}${ext}`;
      const savePath = path.join(UPLOADS_DIR, uniqueFileName);

      fs.writeFileSync(savePath, buffer);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        url: `/uploads/${uniqueFileName}`,
        message: '上传成功'
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // API 路由: 导出 JSON
  if (pathname === '/api/export' && req.method === 'GET') {
    try {
      const data = getResumeData();
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="resume.json"'
      });
      res.end(JSON.stringify(data, null, 2));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // ============ 投递记录 API ============
  // 获取投递记录（表头 + 全部行）
  if (pathname === '/api/jobs' && req.method === 'GET') {
    try {
      const data = getJobsData();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 保存投递记录（整表覆盖）
  if (pathname === '/api/jobs' && req.method === 'POST') {
    try {
      const body = await parseRequestBody(req);
      if (!body || !Array.isArray(body.rows)) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: '无效的数据格式：需要 rows 数组' }));
        return;
      }
      const payload = {
        columns: Array.isArray(body.columns) && body.columns.length ? body.columns : DEFAULT_JOB_COLUMNS,
        rows: body.rows,
        updatedAt: new Date().toISOString()
      };
      saveJobsData(payload);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, message: '保存成功', count: payload.rows.length }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 导入文本（粘贴的表格 / TSV / CSV）→ 解析为结构化记录
  if (pathname === '/api/jobs/parse' && req.method === 'POST') {
    try {
      const body = await parseRequestBody(req);
      const rows = parseJobsText(body.text || '');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, rows, count: rows.length }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 导出投递记录为 CSV（Excel 可直接打开）
  if (pathname === '/api/jobs/export' && req.method === 'GET') {
    try {
      const data = getJobsData();
      const cols = data.columns.filter(c => c.visible !== false);
      const esc = (v) => {
        const s = String(v === undefined || v === null ? '' : v);
        return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      };
      const lines = [cols.map(c => esc(c.label)).join(',')];
      data.rows.forEach(r => {
        lines.push(cols.map(c => esc(r[c.key])).join(','));
      });
      const csv = '\uFEFF' + lines.join('\r\n'); // BOM 保证 Excel 正确识别 UTF-8
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="applications.csv"'
      });
      res.end(csv);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 静态页面路由映射
  if (pathname === '/' || pathname === '/index.html') {
    return serveStatic(req, res, path.join(ROOT_DIR, 'index.html'));
  }

  if (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/index.html') {
    return serveStatic(req, res, path.join(ROOT_DIR, 'admin', 'index.html'));
  }

  // 投递记录管理页
  if (pathname === '/admin/jobs' || pathname === '/admin/jobs/' || pathname === '/admin/jobs.html') {
    return serveStatic(req, res, path.join(ROOT_DIR, 'admin', 'jobs.html'));
  }

  // admin/libs 目录显式支持（pdf.js / mammoth.js 本地库）
  if (pathname.startsWith('/admin/libs/')) {
    return serveStatic(req, res, path.join(ROOT_DIR, 'admin', 'libs', path.basename(pathname)));
  }

  // 规范化文件路径，防止路径穿越攻击
  const safePath = path.normalize(path.join(ROOT_DIR, pathname));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // 处理静态文件
  serveStatic(req, res, safePath);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 简历展示系统与后台管理服务已成功启动！`);
  console.log(`📄 前台简历展示页面: http://localhost:${PORT}`);
  console.log(`⚙️ 后台内容管理面板: http://localhost:${PORT}/admin/`);
  console.log(`====================================================`);
});
