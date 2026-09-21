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
    // 1) 优先用浏览器本地已保存的修改
    const local = readLocal(LS_KEY, null);
    if (local) return { success: true, data: local, source: 'local' };

    // 2) 其次读取打包好的静态默认数据
    try {
      const res = await fetch(basePrefix() + 'data.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        return { success: true, data, source: 'file' };
      }
    } catch (e) { /* ignore */ }

    return { success: false, error: '未找到简历数据（本地服务器未运行，且无静态 data.json）' };
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

    // ---- 静态模式：写入 localStorage ----
    // 同时也更新内存中的静态 data.json 缓存，前台同源页面即可读到
    const ok = writeLocal(LS_KEY, data);
    if (!ok) {
      return {
        success: false,
        error: '浏览器本地存储已满（通常因上传图片过大）。请改用「导出」下载 JSON，或减少内嵌图片。'
      };
    }
    return {
      success: true,
      message: '✅ 已保存到浏览器本地！如需永久发布，请点「导出」下载 data.json 后重新上传到静态托管。'
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
    LS_KEY: LS_KEY,
    LS_JOBS_KEY: LS_JOBS_KEY
  };
})(window);
