const fs = require('fs');
const { execSync } = require('child_process');

// 诊断页面：显示 zoom 和底边位置
const html = fs.readFileSync('/opt/resume/current/resume.html', 'utf8');
const probe = `
<div id="probe-out" style="position:fixed;top:5px;left:5px;background:#000;color:#0f0;font:13px monospace;padding:10px;z-index:99999;line-height:1.7"></div>
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const c = document.getElementById('resume-container');
    let maxB = 0;
    c.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 2 && r.height > 2) maxB = Math.max(maxB, r.bottom);
    });
    const MM = 3.7795;
    document.getElementById('probe-out').innerHTML =
      'zoom=' + (c.style.zoom || '1') + '<br>' +
      'content bottom: ' + (maxB/MM).toFixed(1) + 'mm<br>' +
      'page height: 297mm<br>' +
      'bottom gap: ' + ((1123-maxB)/MM).toFixed(1) + 'mm<br>' +
      'fill: ' + Math.round(maxB/1123*100) + '%';
  }, 3000);
});
</script>
`;
fs.writeFileSync('/opt/resume/current/_diag.html', html.replace('</body>', probe + '</body>'));

// 截屏
execSync('cd /opt/chromium/cft/chrome-headless-shell-linux64 && ./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage --window-size=794,1123 --virtual-time-budget=15000 --user-data-dir=/tmp/dp4 --screenshot=/tmp/fill-check.png "http://127.0.0.1:8080/_diag.html?pdf=1" 2>/dev/null', {timeout: 90000});

fs.unlinkSync('/opt/resume/current/_diag.html');
console.log('done');
