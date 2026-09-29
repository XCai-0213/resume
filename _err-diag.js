const { execSync } = require('child_process');
const fs = require('fs');

// 生成一个捕获 console 错误的诊断页
const html = fs.readFileSync('/opt/resume/current/resume.html', 'utf8');

const errCapture = `
<script>
window.__errors = [];
window.onerror = function(msg, src, line, col) {
  window.__errors.push(msg + ' @' + src.split('/').pop() + ':' + line);
};
window.addEventListener('unhandledrejection', function(e) {
  window.__errors.push('Promise: ' + (e.reason && e.reason.message || e.reason));
});
// 捕获 fetch 失败
const origFetch = window.fetch;
window.fetch = function() {
  return origFetch.apply(this, arguments).catch(function(e) {
    window.__errors.push('fetch ' + arguments[0] + ': ' + e.message);
    throw e;
  });
};
</script>
`;

const report = `
<div id="err-report" style="position:fixed;top:2px;left:2px;right:2px;background:#000;color:#f66;font:11px monospace;padding:8px;z-index:99999;white-space:pre-wrap;max-height:40vh;overflow:auto"></div>
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const el = document.getElementById('err-report');
    const container = document.getElementById('resume-container');
    let info = 'ERRORS: ' + (window.__errors.length || 'none') + '\\n';
    window.__errors.forEach(e => info += e + '\\n');
    info += '---\\n';
    info += 'container: ' + (container ? 'EXISTS' : 'MISSING') + '\\n';
    if (container) {
      info += 'container children: ' + container.children.length + '\\n';
      info += 'container h: ' + container.scrollHeight + '\\n';
      const body = document.body;
      info += 'body class: ' + body.className + '\\n';
      info += 'body zoom: ' + (container.style.zoom || 'none') + '\\n';
      // 看看有没有可见内容
      let hasText = false;
      container.querySelectorAll('*').forEach(el => {
        if (el.textContent && el.textContent.trim().length > 10) hasText = true;
      });
      info += 'has text content: ' + hasText;
    }
    if (el) {
      el.textContent = info;
      el.style.display = 'block';
    }
    document.title = 'DIAG:' + (window.__errors.length) + ':' + (container ? container.children.length : -1);
  }, 4000);
});
</script>
`;

// 在 </body> 前插入错误捕获 + 报告
let modified = html.replace('<script src="assets/js/index.js">', errCapture + '<script>window.__errHooked=1;</script><script src="assets/js/index.js">');
if (!modified.includes('__errHooked')) {
  // 如果没找到，在 </body> 前插入
  modified = html.replace('</body>', errCapture + report + '</body>');
} else {
  modified = modified.replace('</body>', report + '</body>');
}

fs.writeFileSync('/opt/resume/current/_errdiag.html', modified);

// 截屏
execSync('cd /opt/chromium/cft/chrome-headless-shell-linux64 && ./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage --window-size=794,1123 --virtual-time-budget=15000 --user-data-dir=/tmp/errdiag --screenshot=/tmp/errdiag.png "http://127.0.0.1:8080/_errdiag.html" 2>&1 | head -10', {timeout: 90000});

fs.unlinkSync('/opt/resume/current/_errdiag.html');
console.log('done');
