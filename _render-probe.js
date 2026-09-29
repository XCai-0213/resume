const fs = require('fs');
const { execSync } = require('child_process');

const html = fs.readFileSync('/opt/resume/current/resume.html', 'utf8');
const probe = `
<div id="probe-out" style="position:fixed;top:2px;right:2px;background:#000;color:#0f0;font:11px monospace;padding:8px;z-index:99999;line-height:1.6"></div>
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const c = document.getElementById('resume-container');
    const out = [];
    // 检查个人项目区渲染了什么
    const proj = document.getElementById('section-projects');
    if (proj) {
      const lis = proj.querySelectorAll(':scope > ul > li');
      out.push('项目数: ' + lis.length);
      lis.forEach((li, i) => {
        // 每个项目 li 里渲染了什么字段
        const subs = li.querySelectorAll('.info-content > li');
        const texts = [];
        subs.forEach(s => {
          const t = (s.textContent || '').trim().substring(0, 20);
          texts.push(t);
        });
        out.push('P' + (i+1) + ': ' + texts.length + ' 行 → [' + texts.join(' | ') + ']');
      });
    } else {
      out.push('section-projects NOT FOUND');
    }
    document.getElementById('probe-out').innerHTML = out.join('<br>');
  }, 3000);
});
</script>
`;
fs.writeFileSync('/opt/resume/current/_rprobe.html', html.replace('</body>', probe + '</body>'));

execSync('cd /opt/chromium/cft/chrome-headless-shell-linux64 && ./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage --window-size=794,1123 --virtual-time-budget=15000 --user-data-dir=/tmp/rp --screenshot=/tmp/rprobe.png "http://127.0.0.1:8080/_rprobe.html" 2>/dev/null', {timeout: 90000});
fs.unlinkSync('/opt/resume/current/_rprobe.html');
console.log('done');
