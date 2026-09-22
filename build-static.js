#!/usr/bin/env node
/**
 * 静态站点构建脚本
 * 
 * 用法：node build-static.js
 * 
 * 作用：把整个简历项目打包成【纯静态站点】到 dist/ 目录，
 *       无需 Node.js 服务器即可运行，可直接上传到：
 *       · 腾讯云 EdgeOne Pages / 静态网站托管
 *       · 阿里云 OSS / 腾讯云 COS / 七牛云
 *       · GitHub Pages / Vercel / Netlify / Cloudflare Pages
 * 
 * 静态站点特性：
 *   · 前台简历：读取 data.json 渲染
 *   · 后台管理：所有编辑保存到浏览器 localStorage，可导出 data.json 回写
 *   · 投递记录：同样本地存储，支持粘贴导入与 CSV 导入导出
 *   · 完全零后端依赖
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// 需要复制到 dist 的资源
const COPY_TARGETS = [
  { from: 'index.html', to: 'index.html' },
  { from: 'home.html', to: 'home.html' },
  { from: 'resume.html', to: 'resume.html' },
  { from: 'assets', to: 'assets' },
  { from: 'mdui', to: 'mdui' },
  { from: 'uploads', to: 'uploads' },
  { from: 'admin', to: 'admin' }
];

// 需要清理的临时/无关文件（不进入 dist）
const EXCLUDE_PATTERNS = [
  /\.map$/,
  /\.sass-cache/,
  /\.scss$/,
  /node_modules/,
  /_backup/,
  /_diag/,
  /^\./
];

function log(msg, type) {
  const icons = { ok: '✓', info: 'ℹ', warn: '!', err: '✗' };
  console.log('  ' + (icons[type] || '·') + ' ' + msg);
}

function rmrf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function shouldExclude(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return EXCLUDE_PATTERNS.some(function (re) { return re.test(normalized); });
}

function copyRecursive(src, dest, stats) {
  const stat = fs.statSync(src);
  const rel = path.relative(ROOT, src);

  if (shouldExclude(rel)) {
    stats.skipped++;
    return;
  }

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function (entry) {
      copyRecursive(path.join(src, entry), path.join(dest, entry), stats);
    });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    stats.copied++;
    stats.bytes += stat.size;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function main() {
  console.log('\n📦 开始构建静态站点...\n');

  // 1. 清理并创建 dist
  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });
  log('已清空并创建 dist/ 目录', 'ok');

  // 2. 复制资源
  const stats = { copied: 0, skipped: 0, bytes: 0 };
  COPY_TARGETS.forEach(function (target) {
    const src = path.join(ROOT, target.from);
    const dest = path.join(DIST, target.to);
    if (!fs.existsSync(src)) {
      log('跳过不存在的路径: ' + target.from, 'warn');
      return;
    }
    copyRecursive(src, dest, stats);
  });
  log('已复制 ' + stats.copied + ' 个文件（' + formatBytes(stats.bytes) + '），跳过 ' + stats.skipped + ' 个', 'ok');

  // 3. 生成静态数据文件 data.json（简历）
  const resumeSrc = path.join(ROOT, 'data', 'resume.json');
  const resumeDefault = path.join(ROOT, 'data', 'default-resume.json');
  let resumeData;
  if (fs.existsSync(resumeSrc)) {
    resumeData = JSON.parse(fs.readFileSync(resumeSrc, 'utf-8'));
    log('已读取当前简历数据 data/resume.json', 'ok');
  } else if (fs.existsSync(resumeDefault)) {
    resumeData = JSON.parse(fs.readFileSync(resumeDefault, 'utf-8'));
    log('使用默认简历数据 data/default-resume.json', 'info');
  } else {
    resumeData = {};
    log('未找到简历数据，将生成空对象', 'warn');
  }
  fs.writeFileSync(path.join(DIST, 'data.json'), JSON.stringify(resumeData, null, 2), 'utf-8');
  log('已生成 dist/data.json（前台静态数据源）', 'ok');

  // 4. 生成静态数据文件 jobs.json（投递记录）
  const jobsSrc = path.join(ROOT, 'data', 'applications.json');
  let jobsData = { columns: [], rows: [] };
  if (fs.existsSync(jobsSrc)) {
    jobsData = JSON.parse(fs.readFileSync(jobsSrc, 'utf-8'));
    log('已读取投递记录 data/applications.json（' + (jobsData.rows || []).length + ' 条）', 'ok');
  } else {
    log('未找到投递记录，将生成空表', 'info');
  }
  fs.writeFileSync(path.join(DIST, 'jobs.json'), JSON.stringify(jobsData, null, 2), 'utf-8');
  log('已生成 dist/jobs.json（投递记录静态数据源）', 'ok');

  // 5. 生成静态数据文件 homepage.json（个人主页）
  const homeSrc = path.join(ROOT, 'data', 'homepage.json');
  const homeDefault = path.join(ROOT, 'data', 'default-homepage.json');
  let homeData;
  if (fs.existsSync(homeSrc)) {
    homeData = JSON.parse(fs.readFileSync(homeSrc, 'utf-8'));
    log('已读取个人主页数据 data/homepage.json', 'ok');
  } else if (fs.existsSync(homeDefault)) {
    homeData = JSON.parse(fs.readFileSync(homeDefault, 'utf-8'));
    log('使用默认个人主页数据 data/default-homepage.json', 'info');
  } else {
    homeData = {};
  }
  fs.writeFileSync(path.join(DIST, 'homepage.json'), JSON.stringify(homeData, null, 2), 'utf-8');
  fs.mkdirSync(path.join(DIST, 'data'), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'data', 'homepage.json'), JSON.stringify(homeData, null, 2), 'utf-8');
  log('已生成 dist/homepage.json（个人主页静态数据源）', 'ok');

  // 6. 生成静态数据文件 presets.json（6套预设职业简历）
  const presetsSrc = path.join(ROOT, 'data', 'presets.json');
  let presetsData = [];
  if (fs.existsSync(presetsSrc)) {
    presetsData = JSON.parse(fs.readFileSync(presetsSrc, 'utf-8'));
    log('已读取预设职业简历数据 data/presets.json（' + presetsData.length + ' 套）', 'ok');
  }
  fs.writeFileSync(path.join(DIST, 'presets.json'), JSON.stringify(presetsData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DIST, 'data', 'presets.json'), JSON.stringify(presetsData, null, 2), 'utf-8');
  log('已生成 dist/presets.json（6套预设职业简历静态数据源）', 'ok');

  // 7. 为 admin 目录也放一份数据副本（相对路径访问）
  fs.writeFileSync(path.join(DIST, 'admin', 'data.json'), JSON.stringify(resumeData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DIST, 'admin', 'jobs.json'), JSON.stringify(jobsData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DIST, 'admin', 'homepage.json'), JSON.stringify(homeData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DIST, 'admin', 'presets.json'), JSON.stringify(presetsData, null, 2), 'utf-8');
  log('已为 admin/ 生成数据副本', 'ok');

  // 8. 生成部署说明文件
  const readme = generateDeployReadme();
  fs.writeFileSync(path.join(DIST, '_部署说明.md'), readme, 'utf-8');
  log('已生成 _部署说明.md', 'ok');

  // 7. 统计
  let totalFiles = 0;
  let totalBytes = 0;
  (function walk(dir) {
    fs.readdirSync(dir).forEach(function (e) {
      const p = path.join(dir, e);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else { totalFiles++; totalBytes += st.size; }
    });
  })(DIST);

  console.log('\n' + '='.repeat(56));
  console.log('✅ 静态站点构建完成！');
  console.log('='.repeat(56));
  console.log('   输出目录: ' + DIST);
  console.log('   文件总数: ' + totalFiles + ' 个');
  console.log('   总大小:   ' + formatBytes(totalBytes));
  console.log('');
  console.log('   本地预览（任选其一）：');
  console.log('     npx serve dist');
  console.log('     python -m http.server 8000 --directory dist');
  console.log('');
  console.log('   部署方式：把 dist 目录内的【所有文件】上传到静态托管即可');
  console.log('='.repeat(56) + '\n');
}

function generateDeployReadme() {
  return `# 简历静态站点 - 部署说明

本目录是**纯静态站点**，无需 Node.js 服务器、无需数据库，上传即可访问。

## 📁 目录结构

\`\`\`
dist/
├── index.html          # 前台简历展示页（访问根路径）
├── data.json           # 简历数据源（前台读取此文件）
├── jobs.json           # 投递记录数据源
├── assets/             # 样式、脚本、图片、字体
└── admin/
    ├── index.html      # 后台管理面板
    ├── jobs.html       # 投递记录管理
    ├── data.json       # 数据副本
    └── jobs.json       # 数据副本
\`\`\`

## 🚀 部署到腾讯云 EdgeOne Pages

1. 登录腾讯云 → 边缘安全加速平台 EdgeOne → **Makers / Pages**
2. 选择「**直接上传**」方式
3. 项目名称填任意名称（如 \`my-resume\`）
4. 把本目录（\`dist\`）里的**所有文件和文件夹**拖拽到上传区域
   - 注意：要上传 \`dist\` **里面的内容**，不要上传 \`dist\` 文件夹本身
5. 加速区域按需选择（国内访问建议选「中国大陆」并完成备案）
6. 点击部署 → 约 30 秒后获得访问链接

## 🌐 其他静态托管

| 平台 | 操作方式 |
|------|----------|
| 阿里云 OSS | 创建 Bucket → 开启静态网站托管 → 上传全部文件 → 设置默认首页 \`index.html\` |
| 腾讯云 COS | 同上，开启静态网站功能 |
| GitHub Pages | 把文件推到仓库 → Settings → Pages → 选择分支 |
| Vercel / Netlify | 直接拖拽整个目录到部署面板 |
| Cloudflare Pages | 创建项目 → 直接上传 |

## ⚙️ 静态环境下的使用说明（重要）

### 后台如何保存修改？

静态托管**没有服务器**，无法写回文件，因此采用以下机制：

1. 您在后台编辑后点「**保存所有内容**」
   → 数据保存在**您本机浏览器的 localStorage**
   → 立即可以在「实时预览」中看到效果
   → 刷新页面修改依然存在（同一浏览器）

2. 要让**其他人**也看到您的修改，需要：
   - 在后台点击「**导出**」→ 下载 \`data.json\`
   - 用它**替换**静态站点里的 \`data.json\`
   - 重新上传部署（EdgeOne 支持直接覆盖更新）

3. 投递记录同理：点「**导出 Excel**」可以随时下载 CSV 备份。

### 注意事项

- 图片上传会转成 Base64 内嵌（不依赖服务器），但**尽量用图片 URL** 可以显著减小数据体积
- localStorage 容量约 5MB，请勿上传过大的图片
- 换电脑或换浏览器看不到之前的本地修改，请务必先「导出」备份
- 如果之后想在本地用完整版（自动写回文件），运行项目根目录的 \`start.bat\` 即可

## 📄 页面地址

- 前台简历：\`https://你的域名/\`
- 后台管理：\`https://你的域名/admin/\`
- 投递记录：\`https://你的域名/admin/jobs.html\`

> 💡 提示：静态站点的后台是**公开可访问**的。如果不想让别人看到，建议：
> ① 不要公开后台地址；② 或者只在本地 \`start.bat\` 模式下使用后台，静态站点只放前台。
`;
}

main();
