const fs = require('fs');
const { execSync } = require('child_process');

// 生成一个测量页面：量每个项目（h3 元素）的 top 位置和页面总高度
const html = fs.readFileSync('/opt/resume/current/resume.html', 'utf8');
const probe = `
<div id="probe-out" style="position:fixed;top:2px;right:2px;background:#000;color:#0f0;font:11px monospace;padding:8px;z-index:99999;line-height:1.6"></div>
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const c = document.getElementById('resume-container');
    const b = document.body;
    const MM = 3.7795;
    const out = [];
    // 找个人项目区
    const projSection = document.getElementById('section-projects');
    if (projSection) {
      const items = projSection.querySelectorAll(':scope > ul > li');
      out.push('=== 项目位置（mm）===');
      items.forEach((li, i) => {
        const r = li.getBoundingClientRect();
        out.push('P' + (i+1) + ' top=' + (r.top/MM).toFixed(0) + ' h=' + (r.height/MM).toFixed(0) + ' bottom=' + (r.bottom/MM).toFixed(0));
      });
    }
    // 自我评价位置
    const evalSec = document.getElementById('section-evaluation');
    if (evalSec) {
      const r = evalSec.getBoundingClientRect();
      out.push('自我评价 top=' + (r.top/MM).toFixed(0) + ' bottom=' + (r.bottom/MM).toFixed(0));
    }
    // 页面总高度和内容底
    let maxB = 0;
    c.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 2) maxB = Math.max(maxB, r.bottom);
    });
    out.push('---');
    out.push('内容底=' + (maxB/MM).toFixed(0) + 'mm / 页高=' + Math.round(1123/MM) + 'mm');
    out.push('底部留白=' + ((1123-maxB)/MM).toFixed(0) + 'mm');
    // zoom
    out.push('zoom=' + (c.style.zoom || '1'));
    document.getElementById('probe-out').innerHTML = out.join('<br>');
  }, 3000);
});
</script>
`;
fs.writeFileSync('/opt/resume/current/_mp.html', html.replace('</body>', probe + '</body>'));

execSync('cd /opt/chromium/cft/chrome-headless-shell-linux64 && ./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage --window-size=794,1123 --virtual-time-budget=15000 --user-data-dir=/tmp/mp5 --screenshot=/tmp/mpositions.png "http://127.0.0.1:8080/_mp.html?pdf=1" 2>/dev/null', {timeout: 90000});
fs.unlinkSync('/opt/resume/current/_mp.html');
console.log('done');
