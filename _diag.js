const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');

// 1. 生成诊断页面
const html = fs.readFileSync('/opt/resume/current/resume.html', 'utf8');
const probe = `
<div id="probe-out" style="position:fixed;top:5px;left:5px;background:#000;color:#0f0;font:13px monospace;padding:10px;z-index:99999;line-height:1.7"></div>
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const c = document.getElementById('resume-container');
    let minL = Infinity, minT = Infinity, maxR = 0, maxB = 0;
    c.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 2 && r.height > 2) {
        minL = Math.min(minL, r.left);
        minT = Math.min(minT, r.top);
        maxR = Math.max(maxR, r.right);
        maxB = Math.max(maxB, r.bottom);
      }
    });
    const MM = 3.7795;
    const zoom = c.style.zoom || '1';
    document.getElementById('probe-out').innerHTML =
      'LEFT: ' + (minL/MM).toFixed(1) + ' mm<br>' +
      'TOP: ' + (minT/MM).toFixed(1) + ' mm<br>' +
      'RIGHT: ' + ((794-maxR)/MM).toFixed(1) + ' mm<br>' +
      'BOTTOM: ' + ((1123-maxB)/MM).toFixed(1) + ' mm<br>' +
      '----<br>' +
      'body.padX=' + getComputedStyle(document.body).paddingLeft + '<br>' +
      'body.padY=' + getComputedStyle(document.body).paddingTop + '<br>' +
      'zoom=' + zoom + '<br>' +
      'box=' + Math.round((maxR-minL)/MM) + 'x' + Math.round((maxB-minT)/MM) + 'mm';
  }, 3000);
});
</script>
`;
fs.writeFileSync('/opt/resume/current/_diag.html', html.replace('</body>', probe + '</body>'));

// 2. 截屏
execSync('cd /opt/chromium/cft/chrome-headless-shell-linux64 && ./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage --window-size=794,1123 --virtual-time-budget=15000 --user-data-dir=/tmp/dp3 --screenshot=/tmp/diag-edge.png "http://127.0.0.1:8080/_diag.html?pdf=1" 2>/dev/null', {timeout: 90000});

// 3. 清理诊断页
fs.unlinkSync('/opt/resume/current/_diag.html');
console.log('screenshot saved: /tmp/diag-edge.png');
