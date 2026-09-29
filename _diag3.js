const fs = require('fs');
const { execSync } = require('child_process');

// 1. 创建一个最小诊断页 —— 不依赖任何 CSS，纯黑色背景绿色文字
const diagHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
#d { position:fixed; top:0; left:0; right:0; background:#000; color:#0f0;
     font:14px/1.8 monospace; padding:20px; z-index:999999;
     white-space:pre-wrap; }
</style></head><body>
<div id="d">loading...</div>
<iframe id="f" src="/resume.html" style="width:794px;height:1123px;border:2px solid red;display:none"></iframe>
<script>
const log = (m) => { document.getElementById('d').textContent += '\\n' + m; };
window.onerror = (msg, src, line) => { log('ERR: ' + msg + ' @' + (src||'').split('/').pop() + ':' + line); };

// 先显示诊断框
document.getElementById('d').textContent = 'DIAGNOSTIC PAGE LOADED';

// 加载 resume.html 到 iframe
const f = document.getElementById('f');
f.style.display = 'block';
f.onload = () => {
  setTimeout(() => {
    try {
      const doc = f.contentDocument || f.contentWindow.document;
      log('--- iframe loaded ---');
      log('readyState: ' + doc.readyState);
      log('title: ' + doc.title);
      const c = doc.getElementById('resume-container');
      log('container: ' + (c ? 'EXISTS' : 'MISSING'));
      if (c) {
        log('children: ' + c.children.length);
        log('scrollH: ' + c.scrollHeight);
        const name = doc.querySelector('.header-name');
        log('name: ' + (name ? name.textContent : 'N/A'));
      }
      log('body class: ' + doc.body.className);
      // 检查 CSS 加载
      const sheets = doc.styleSheets;
      log('stylesheets: ' + sheets.length);
      for (let i = 0; i < sheets.length; i++) {
        try {
          log('  sheet[' + i + ']: ' + (sheets[i].href || 'inline').split('/').pop() + ' rules=' + sheets[i].cssRules.length);
        } catch(e) {
          log('  sheet[' + i + ']: CORS-blocked');
        }
      }
    } catch(e) {
      log('iframe access error: ' + e.message);
    }
    // 把 iframe 隐藏，只显示诊断
    f.style.display = 'none';
  }, 4000);
};
</script>
</body></html>
`;

fs.writeFileSync('/opt/resume/current/_diag2.html', diagHtml);

// 截图
try {
  execSync('cd /opt/chromium/cft/chrome-headless-shell-linux64 && rm -rf /tmp/dg && ./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage --window-size=794,1123 --virtual-time-budget=20000 --user-data-dir=/tmp/dg --screenshot=/tmp/diag2.png "http://127.0.0.1:8080/_diag2.html" 2>&1 | head -5', {timeout: 120000});
} catch(e) {
  console.log('screenshot error (may still have saved):', e.message.substring(0, 100));
}

fs.unlinkSync('/opt/resume/current/_diag2.html');
console.log('done');
