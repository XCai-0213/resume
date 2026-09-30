/* ==========================================================================
 * 静态环境适配层 (Static Deployment Adapter)
 * 
 * 作用：让整个简历后台在【纯静态托管】下也能完整工作，
 *       无需 Node.js 服务器，可直接上传到：
 *       · 腾讯云 EdgeOne Pages / 静态网站托管
 *       · 阿里云 OSS / 腾讯云 COS
 *       · GitHub Pages / Vercel / Netlify / Cloudflare Pages
 * 
 * 工作原理：
 *   1. 优先尝试请求 /api/resume（本地 node server.js 运行时走这条路，功能最全）
 *   2. 若 API 不可用（纯静态环境），自动降级为：
 *      · 读取同目录下的 data.json 静态文件作为初始数据
 *      · 所有修改保存在浏览器 localStorage（离线可编辑、可预览）
 *      · 通过「导出 JSON」把结果写回文件，重新上传即可生效
 * 
 * 这样同一套代码在「本地服务器」和「静态托管」下都能跑，无需维护两份。
 * ========================================================================== */
(function (global) {
  'use strict';

  const LS_KEY = 'resume_data_v1';
  const LS_JOBS_KEY = 'resume_jobs_v1';
  const LS_HOMEPAGE_KEY = 'homepage_data_v1';

  // 是否检测到后端 API（首次探测后缓存结果）
  let apiAvailable = null;

  // ---------- 基础工具 ----------
  // API 根路径：始终指向站点根目录的 /api/*，避免从 /admin/ 子目录访问时解析成 /admin/api/*
  function apiUrl(p) {
    return '/api/' + p;
  }

  async function probeApi() {
    if (apiAvailable !== null) return apiAvailable;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 2500);
      const res = await fetch(apiUrl('resume') + '?probe=1', { signal: ctrl.signal, cache: 'no-store' });
      clearTimeout(timer);
      // 只有返回 JSON 且 success 字段存在，才认定后端可用
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        apiAvailable = ct.indexOf('application/json') !== -1;
      } else {
        apiAvailable = false;
      }
    } catch (e) {
      apiAvailable = false;
    }
    return apiAvailable;
  }

  function readLocal(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeLocal(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      // localStorage 满了（比如 Base64 大图）——提示用户改用导出
      console.warn('localStorage 写入失败（可能是容量超限）:', e);
      return false;
    }
  }

  // 探测相对路径：静态站点可能是 / 根目录，也可能是 /sub/ 子目录
  function basePrefix() {
    // admin/index.html 在 /admin/ 下，数据文件放在同级或上层
    const path = location.pathname;
    if (/\/admin\/?/.test(path)) return '../';
    return './';
  }

  // ============================================================
  // GitHub 云同步（跨设备/跨浏览器数据源）
  // 配置保存在 localStorage：GH_SYNC_CONFIG = { owner, repo, branch, token, path }
  // 数据流：保存 → 写 GitHub（Contents API）→ 全局生效
  //         读取 → 优先云端 → 本地缓存兜底
  // ============================================================
  const GH_CFG_KEY = 'gh_sync_config_v1';
  const GH_CACHE_KEY = 'gh_sync_cache_v1';

  function getGhConfig() {
    return readLocal(GH_CFG_KEY, null);
  }

  function setGhConfig(cfg) {
    return writeLocal(GH_CFG_KEY, cfg);
  }

  function ghApiBase(cfg) {
    return 'https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo + '/contents/';
  }

  function ghHeaders(cfg) {
    return {
      'Authorization': 'Bearer ' + cfg.token,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    };
  }

  // 读取 GitHub 上的 JSON 文件（带 sha，供更新用）
  async function ghReadJson(cfg, filePath) {
    const url = ghApiBase(cfg) + filePath + '?ref=' + (cfg.branch || 'main') + '&t=' + Date.now();
    const res = await fetch(url, { headers: ghHeaders(cfg), cache: 'no-store' });
    if (res.status === 404) return { sha: null, data: null };
    if (!res.ok) throw new Error('GitHub 读取失败 HTTP ' + res.status);
    const json = await res.json();
    const content = JSON.parse(decodeURIComponent(escape(atob(json.content.replace(/\n/g, '')))));
    return { sha: json.sha, data: content };
  }

  // 写 JSON 到 GitHub
  async function ghWriteJson(cfg, filePath, data, sha) {
    const url = ghApiBase(cfg) + filePath;
    const body = {
      message: 'update ' + filePath + ' (via resume admin)',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
      branch: cfg.branch || 'main'
    };
    if (sha) body.sha = sha;
    const res = await fetch(url, {
      method: 'PUT',
      headers: ghHeaders(cfg),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      if (res.status === 403) {
      throw new Error('Token 权限不足（403）。Fine-grained Token 需要：① Repository access 选中 XCai-0213/resume；② Permissions → Contents → 设为 Read and write。请到 github.com/settings/personal-access-tokens 重新配置。');
    }
    if (res.status === 404) {
      throw new Error('仓库或文件不存在（404）。请确认仓库名与分支正确，且 Token 的 Repository access 包含该仓库。');
    }
throw new Error('GitHub 写入失败 HTTP ' + res.status + ' ' + errText.substring(0, 120));
    }
    return true;
  }

  // 判断当前是否处于静态模式（即需要走 GitHub 同步）
  let staticModeCache = null;
  async function isStaticMode() {
    if (staticModeCache !== null) return staticModeCache;
    staticModeCache = !(await probeApi());
    return staticModeCache;
  }

  // ---------- 简历数据 ----------
  async function loadResume() {
    const useApi = await probeApi();
    if (useApi) {
      try {
        const res = await fetch(apiUrl('resume') + '?t=' + Date.now());
        const json = await res.json();
        if (json.success && json.data) return { success: true, data: json.data, source: 'server' };
      } catch (e) { /* 继续降级 */ }
    }

    // ---- 静态模式 ----
    // 1) GitHub 云端数据（跨设备同步的主数据源）
    const cfg = getGhConfig();
    if (cfg && cfg.token) {
      try {
        const remote = await ghReadJson(cfg, cfg.path || 'data/resume.json');
        if (remote.data) {
          // 云端命中：写入本地缓存（供离线/下次快速加载），返回云端数据
          writeLocal(GH_CACHE_KEY, remote.data);
          return { success: true, data: remote.data, source: 'github' };
        }
      } catch (e) {
        console.warn('GitHub 读取失败，降级到本地缓存:', e);
        // 云端失败时兜底本地缓存
        const cached = readLocal(GH_CACHE_KEY, null);
        if (cached) return { success: true, data: cached, source: 'github-cache' };
      }
    }

    // 2) 本地缓存（上次 GitHub 同步的副本或旧版手动保存）
    const local = readLocal(LS_KEY, null) || readLocal(GH_CACHE_KEY, null);
    if (local) return { success: true, data: local, source: 'local' };

    // 3) 打包好的静态默认数据
    try {
      const res = await fetch(basePrefix() + 'data.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        return { success: true, data, source: 'file' };
      }
    } catch (e) { /* ignore */ }

    return { success: false, error: '未找到简历数据（本地服务器未运行，且无云端/静态数据）' };
  }

  async function saveResume(data) {
    const useApi = await probeApi();
    if (useApi) {
      try {
        const res = await fetch(apiUrl('resume'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.success) return { success: true, message: '🎉 简历内容已成功保存！前台已实时生效。' };
        return { success: false, error: json.error || '服务端保存失败' };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    // ---- 静态模式：优先 GitHub 云同步 ----
    const cfg = getGhConfig();
    if (cfg && cfg.token) {
      try {
        // 读取当前 sha（GitHub 要求更新必须带 sha）
        const remote = await ghReadJson(cfg, cfg.path || 'data/resume.json');
        await ghWriteJson(cfg, cfg.path || 'data/resume.json', data, remote.sha);
        // 同步更新本地缓存
        writeLocal(GH_CACHE_KEY, data);
        writeLocal(LS_KEY, data);
        return {
          success: true,
          message: '🎉 已同步到 GitHub 云端！所有设备打开都会拉取这份最新数据（EdgeOne 约 30 秒后自动重新部署）。'
        };
      } catch (e) {
        // GitHub 失败：降级本地并报错
        writeLocal(LS_KEY, data);
        writeLocal(GH_CACHE_KEY, data);
        return { success: false, error: '云端同步失败：' + e.message + '（数据已暂存本地，可稍后重试保存）' };
      }
    }

    // ---- 无 GitHub 配置：纯本地 ----
    const ok = writeLocal(LS_KEY, data);
    if (!ok) {
      return {
        success: false,
        error: '浏览器本地存储已满（通常因上传图片过大）。请改用「导出」下载 JSON，或减少内嵌图片。'
      };
    }
    return {
      success: true,
      message: '✅ 已保存到本浏览器！注意：其他设备/浏览器看不到此修改。配置 GitHub 云同步后可全端同步（后台 → 云同步设置）。'
    };
  }

  async function resetResume() {
    const useApi = await probeApi();
    if (useApi) {
      try {
        const res = await fetch(apiUrl('reset'), { method: 'POST' });
        const json = await res.json();
        return json;
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
    try {
      localStorage.removeItem(LS_KEY);
      return { success: true, message: '已清除浏览器本地修改，将回到静态默认数据' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // 图片上传：有服务器就走服务器；静态模式下转为 Base64 内联（不依赖任何后端）
  async function uploadImage(fileName, dataUrl) {
    const useApi = await probeApi();
    if (useApi) {
      try {
        const res = await fetch(apiUrl('upload'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: fileName, dataUrl: dataUrl })
        });
        const json = await res.json();
        if (json.success) return json;
      } catch (e) { /* 降级到 Base64 */ }
    }
    // 静态模式：直接把 Base64 当作图片地址使用
    return { success: true, url: dataUrl, message: '已内联图片（静态模式）' };
  }

  function previewUrl() {
    // 本地服务器下带时间戳刷新；静态下同样刷新
    return 'index.html?preview=' + Date.now();
  }

  // ---------- 投递记录 ----------
  async function loadJobs() {
    const useApi = await probeApi();
    if (useApi) {
      try {
        const res = await fetch(apiUrl('jobs') + '?t=' + Date.now());
        const json = await res.json();
        if (json.success && json.data) return { success: true, data: json.data };
      } catch (e) { /* 降级 */ }
    }
    // GitHub 云端优先
    const cfg = getGhConfig();
    if (cfg && cfg.token) {
      try {
        const remote = await ghReadJson(cfg, cfg.jobsPath || 'data/applications.json');
        if (remote.data) return { success: true, data: remote.data };
      } catch (e) { /* 降级 */ }
    }
    const local = readLocal(LS_JOBS_KEY, null);
    if (local) return { success: true, data: local };
    try {
      const res = await fetch(basePrefix() + 'jobs.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        return { success: true, data };
      }
    } catch (e) { /* ignore */ }
    return { success: true, data: { columns: [], rows: [] } };
  }

  async function saveJobs(data) {
    const useApi = await probeApi();
    if (useApi) {
      try {
        const res = await fetch(apiUrl('jobs'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.success) return { success: true, count: json.count };
      } catch (e) { /* 降级 */ }
    }
    // GitHub 云同步
    const cfg = getGhConfig();
    if (cfg && cfg.token) {
      try {
        const filePath = cfg.jobsPath || 'data/applications.json';
        const remote = await ghReadJson(cfg, filePath);
        await ghWriteJson(cfg, filePath, data, remote.sha);
        writeLocal(LS_JOBS_KEY, data);
        return { success: true, count: (data.rows || []).length, static: true };
      } catch (e) {
        writeLocal(LS_JOBS_KEY, data);
        return { success: false, error: '云端同步失败：' + e.message };
      }
    }
    const ok = writeLocal(LS_JOBS_KEY, data);
    return ok
      ? { success: true, count: (data.rows || []).length, static: true }
      : { success: false, error: '浏览器本地存储写入失败' };
  }

  async function parseJobsText(text) {
    const useApi = await probeApi();
    if (useApi) {
      try {
        const res = await fetch(apiUrl('jobs/parse'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: text })
        });
        const json = await res.json();
        if (json.success) return json;
      } catch (e) { /* 降级到本地解析 */ }
    }
    // 静态模式：前端本地解析（逻辑与后端保持一致）
    return { success: true, rows: parseJobsLocal(text), count: parseJobsLocal(text).length };
  }

  // 前端本地解析器（与 server.js 中的 parseJobsText 保持同样规则）
  function parseJobsLocal(text) {
    const DEFAULT_KEYS = ['company', 'companyType', 'industry', 'batch', 'target', 'location',
      'position', 'status', 'updatedAt', 'deadline', 'link', 'announcement', 'writtenTest', 'scale', 'note'];
    const rows = [];
    if (!text || !text.trim()) return rows;
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      .split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 0; });

    lines.forEach(function (line) {
      let cells = [];
      if (line.indexOf('\t') !== -1) cells = line.split('\t');
      else if (/\s{2,}/.test(line)) cells = line.split(/\s{2,}/);
      else if (line.indexOf('|') !== -1) cells = line.split('|');
      else if (line.split(',').length >= 4) cells = line.split(',');
      else return;

      cells = cells.map(function (c) { return c.trim(); }).filter(function (c) { return c.length > 0; });
      if (cells.length < 2) return;
      if (/公司名称|公司类型|所属行业|招聘类型|投递进度|岗位/.test(cells[0]) &&
          /公司|岗位|进度|行业/.test(cells.join(''))) return;

      const row = {};
      DEFAULT_KEYS.forEach(function (k, i) { row[k] = cells[i] !== undefined ? cells[i] : ''; });
      if (cells.length > DEFAULT_KEYS.length) {
        row.note = ((row.note || '') + ' ' + cells.slice(DEFAULT_KEYS.length).join(' ')).trim();
      }
      row.id = 'job_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
      row.createdAt = new Date().toISOString().slice(0, 10);
      if (!row.updatedAt) row.updatedAt = row.createdAt;
      if (!row.status) row.status = '未投递';
      rows.push(row);
    });
    return rows;
  }

  // 导出 CSV（静态模式下纯前端生成，不经过服务器）
  function exportJobsCsv(columns, rows) {
    const cols = (columns || []).filter(function (c) { return c.visible !== false; });
    function esc(v) {
      const s = String(v === undefined || v === null ? '' : v);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }
    const lines = [cols.map(function (c) { return esc(c.label); }).join(',')];
    (rows || []).forEach(function (r) {
      lines.push(cols.map(function (c) { return esc(r[c.key]); }).join(','));
    });
    const csv = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'applications.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  // 导出简历 JSON（静态模式下用浏览器下载）
  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename || 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  // ---------- 个人主页门户数据 ----------
  async function loadHomepage() {
    const useApi = await probeApi();
    if (useApi) {
      try {
        const res = await fetch(apiUrl('homepage') + '?t=' + Date.now());
        const json = await res.json();
        if (json.success && json.data) return { success: true, data: json.data };
      } catch (e) { /* 降级 */ }
    }
    // GitHub 云端优先
    const cfg = getGhConfig();
    if (cfg && cfg.token) {
      try {
        const remote = await ghReadJson(cfg, cfg.homepagePath || 'data/homepage.json');
        if (remote.data) return { success: true, data: remote.data };
      } catch (e) { /* 降级 */ }
    }
    const local = readLocal(LS_HOMEPAGE_KEY, null);
    if (local) return { success: true, data: local };
    try {
      const res = await fetch(basePrefix() + 'data/homepage.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        return { success: true, data };
      }
    } catch (e) {}
    try {
      const res2 = await fetch(basePrefix() + 'homepage.json?t=' + Date.now());
      if (res2.ok) {
        const data = await res2.json();
        return { success: true, data };
      }
    } catch (e) {}
    return { success: false, error: '未找到主页数据' };
  }

  async function saveHomepage(data) {
    const useApi = await probeApi();
    if (useApi) {
      try {
        const res = await fetch(apiUrl('homepage'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.success) return { success: true, message: '个人主页配置保存成功！' };
        return { success: false, error: json.error || '保存失败' };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
    // GitHub 云同步
    const cfg = getGhConfig();
    if (cfg && cfg.token) {
      try {
        const filePath = cfg.homepagePath || 'data/homepage.json';
        const remote = await ghReadJson(cfg, filePath);
        await ghWriteJson(cfg, filePath, data, remote.sha);
        return { success: true, message: '🎉 个人主页配置已同步到 GitHub 云端！' };
      } catch (e) {
        writeLocal(LS_HOMEPAGE_KEY, data);
        return { success: false, error: '云端同步失败：' + e.message };
      }
    }
    const ok = writeLocal(LS_HOMEPAGE_KEY, data);
    return ok
      ? { success: true, message: '已保存到本地存储，主页刷新即生效' }
      : { success: false, error: '本地存储已满' };
  }

  // ---------- 预设职业简历套件 ----------
  async function loadPresets() {
    const useApi = await probeApi();
    if (useApi) {
      try {
        const res = await fetch(apiUrl('presets') + '?t=' + Date.now());
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) return { success: true, data: json.data };
      } catch (e) { /* 降级 */ }
    }
    // 静态降级：读取静态 presets.json
    try {
      const res = await fetch(basePrefix() + 'data/presets.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        return { success: true, data };
      }
    } catch (e) {}
    try {
      const res2 = await fetch(basePrefix() + 'presets.json?t=' + Date.now());
      if (res2.ok) {
        const data = await res2.json();
        return { success: true, data };
      }
    } catch (e) {}
    return { success: false, error: '未找到预设简历数据' };
  }

  // 给前台页面读取用（静态部署时前台也走这里）
  function getLocalResume() {
    return readLocal(LS_KEY, null);
  }

  global.STATIC_API = {
    probeApi: probeApi,
    loadResume: loadResume,
    saveResume: saveResume,
    resetResume: resetResume,
    uploadImage: uploadImage,
    previewUrl: previewUrl,
    loadJobs: loadJobs,
    saveJobs: saveJobs,
    parseJobsText: parseJobsText,
    exportJobsCsv: exportJobsCsv,
    downloadJson: downloadJson,
    getLocalResume: getLocalResume,
    loadHomepage: loadHomepage,
    saveHomepage: saveHomepage,
    loadPresets: loadPresets,
    // GitHub 云同步配置
    getGhConfig: getGhConfig,
    setGhConfig: setGhConfig,
    ghTestConnection: async function () {
      const cfg = getGhConfig();
      if (!cfg || !cfg.token) return { success: false, error: '未配置' };
      try {
        const res = await fetch('https://api.github.com/repos/' + cfg.owner + '/' + cfg.repo, {
          headers: ghHeaders(cfg), cache: 'no-store'
        });
        if (res.ok) return { success: true, message: '连接成功：' + cfg.owner + '/' + cfg.repo };
        if (res.status === 401) return { success: false, error: 'Token 无效或已过期（401）' };
        if (res.status === 404) return { success: false, error: '仓库不存在或 Token 无权限（404）' };
        return { success: false, error: 'HTTP ' + res.status };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },
    LS_KEY: LS_KEY,
    LS_JOBS_KEY: LS_JOBS_KEY,
    LS_HOMEPAGE_KEY: LS_HOMEPAGE_KEY,
    GH_CFG_KEY: GH_CFG_KEY
  };
})(window);
