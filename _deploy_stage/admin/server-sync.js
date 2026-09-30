/* ==========================================================================
 * 服务器同步增强补丁 (Server-first Sync Enhancement)
 * 
 * 目标：classroom.jyue.cn 部署了 Node 后端后，实现真正的跨设备同步：
 *   · 所有浏览器访问同一台服务器 → 数据天然一致
 *   · 保存 = 写入服务器 /opt/resume/shared/data/*.json
 *   · 无需任何 Token、无需 GitHub 配置
 * 
 * 本补丁额外提供「本地数据上传到服务器」迁移工具，
 * 让用户在旧浏览器里攒下的 localStorage 数据能一键搬到服务器。
 * ========================================================================== */
(function (global) {
  'use strict';

  const MIGRATE_FLAG = 'server_migrated_v1';

  // 检测后端是否为"真服务器"（能读能写），而非静态托管的假 API
  async function probeWritableApi() {
    try {
      const res = await fetch('/api/resume?probe=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) return false;
      const ct = res.headers.get('content-type') || '';
      if (ct.indexOf('application/json') === -1) return false;
      const json = await res.json();
      // 真服务器会返回 success + data 结构
      return !!(json && json.success);
    } catch (e) {
      return false;
    }
  }

  // 把浏览器里攒的本地数据推送到服务器
  async function migrateLocalToServer() {
    const results = { resume: false, jobs: false, homepage: false, skipped: [] };

    const push = async function (label, lsKey, apiPath) {
      let local = null;
      try {
        const raw = localStorage.getItem(lsKey);
        if (raw) local = JSON.parse(raw);
      } catch (e) { /* ignore */ }
      if (!local) { results.skipped.push(label); return; }

      try {
        const res = await fetch('/api/' + apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(local)
        });
        const json = await res.json();
        if (json && json.success) {
          results[apiPath] = true;
        }
      } catch (e) { /* ignore */ }
    };

    await push('简历', 'resume_data_v1', 'resume');
    await push('投递记录', 'resume_jobs_v1', 'jobs');
    await push('个人主页', 'homepage_data_v1', 'homepage');

    try { localStorage.setItem(MIGRATE_FLAG, '1'); } catch (e) {}
    return results;
  }

  global.SERVER_SYNC = {
    probeWritableApi: probeWritableApi,
    migrateLocalToServer: migrateLocalToServer,
    MIGRATE_FLAG: MIGRATE_FLAG
  };
})(window);
