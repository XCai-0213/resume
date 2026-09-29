// 完整诊断：模拟浏览器加载 resume.html 并输出每一步的状态
const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');

// 1. 检查 HTML 引用的所有资源是否可达
const html = fs.readFileSync('/opt/resume/current/resume.html', 'utf8');
const refs = [];
[...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].forEach(m => refs.push(m[1]));

console.log('=== 检查 HTML 引用的 ' + refs.length + ' 个资源 ===');
let allOk = true;
for (const ref of refs) {
  try {
    const code = execSync(`curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:8080/${ref}" --max-time 8`).toString().trim();
    if (code !== '200') {
      console.log('  FAIL ' + code + ' ' + ref);
      allOk = false;
    }
  } catch (e) {
    console.log('  FAIL ' + ref + ' ' + e.message.substring(0, 50));
    allOk = false;
  }
}
if (allOk) console.log('  all OK');

// 2. 检查 JS 是否有运行时错误 —— 用一个简化的页面加载测试
console.log('\n=== 创建运行时诊断页 ===');
const diagHtml = html.replace(
  '</body>',
  `<div id="diag" style="position:fixed;inset:0;background:#000;color:#0f0;font:12px monospace;padding:20px;z-index:999999;overflow:auto;white-space:pre-wrap"></div>
<script>
window.__log = [];
const __log = (msg) => { window.__log.push(msg); };
window.onerror = function(msg, src, line, col, err) {
  __log('ERROR: ' + msg + ' | ' + (src||'').split('/').pop() + ':' + line);
};
window.addEventListener('unhandledrejection', e => {
  __log('REJECTION: ' + (e.reason && e.reason.message || String(e.reason)));
});
// hook fetch
const _f = window.fetch;
window.fetch = function(url, opts) {
  __log('fetch: ' + String(url).substring(0, 60));
  return _f.apply(this, arguments).then(r => {
    __log('  -> ' + r.status);
    return r;
  }).catch(e => {
    __log('  -> FAIL: ' + e.message);
    throw e;
  });
};
// hook DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => __log('DOMContentLoaded fired'));
window.addEventListener('load', () => {
  __log('window load fired');
  setTimeout(() => {
    const c = document.getElementById('resume-container');
    __log('---');
    __log('resume-container: ' + (c ? 'EXISTS' : 'MISSING'));
    if (c) {
      __log('container.children: ' + c.children.length);
      __log('container.innerHTML length: ' + c.innerHTML.length);
      __log('container scrollH: ' + c.scrollHeight);
      // 检查渲染的关键内容
      __log('has name: ' + (c.querySelector('.header-name') ? c.querySelector('.header-name').textContent : 'MISSING'));
      __log('has info-units: ' + c.querySelectorAll('.info-unit').length);
      __log('has project-detail: ' + c.querySelectorAll('.project-detail-block').length);
    }
    __log('body class: ' + document.body.className);
    // 把日志显示出来
    const el = document.getElementById('diag');
    if (el) el.textContent = window.__log.join('\\n');
    // 保存到 title
    document.title = 'LOGS:' + window.__log.length;
  }, 4000);
});
</script>`
);

fs.writeFileSync('/opt/resume/current/_rundiag.html', diagHtml);

// 3. 用 headless shell 截图诊断页
execSync('cd /opt/chromium/cft/chrome-headless-shell-linux64 && ./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage --window-size=794,1123 --virtual-time-budget=18000 --user-data-dir=/tmp/rd --screenshot=/tmp/rundiag.png "http://127.0.0.1:8080/_rundiag.html" 2>&1 | head -5', {timeout: 120000});

fs.unlinkSync('/opt/resume/current/_rundiag.html');
console.log('done');
