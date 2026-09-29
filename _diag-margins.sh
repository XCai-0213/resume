#!/bin/bash
# 精确诊断：PDF 的实际留白有多大
BIN=/opt/chromium/cft/chrome-headless-shell-linux64/chrome-headless-shell
cd "$(dirname $BIN)"

rm -f /tmp/diag.pdf
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/diag.pdf --no-pdf-header-footer \
  'http://127.0.0.1:8080/resume.html?pdf=1' >/dev/null 2>&1

echo "=== PDF 尺寸与页面盒 ==="
node <<'EOF'
const fs = require('fs');
const b = fs.readFileSync('/tmp/diag.pdf');
const s = b.toString('latin1');
const mb = s.match(/\/MediaBox\s*\[([^\]]*)\]/);
console.log('MediaBox(pt):', mb ? mb[1].trim() : '?');
if (mb) {
  const v = mb[1].trim().split(/\s+/).map(Number);
  console.log('页面宽(mm):', (v[2]/72*25.4).toFixed(1));
  console.log('页面高(mm):', (v[3]/72*25.4).toFixed(1));
}
console.log('pages:', (s.match(/\/Type\s*\/Page\b/g)||[]).length);
EOF

echo ""
echo "=== 截屏看实际留白 ==="
rm -rf /tmp/dprof /tmp/diag.png
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage --hide-scrollbars \
  --window-size=794,1123 --virtual-time-budget=15000 --user-data-dir=/tmp/dprof \
  --screenshot=/tmp/diag.png 'http://127.0.0.1:8080/resume.html?pdf=1' >/dev/null 2>&1
ls -la /tmp/diag.png

echo ""
echo "=== 用 JS 量实际内容边界（内容离页面边多远）==="
rm -f /opt/resume/current/_edge.html
python3 <<'PY'
html = open('/opt/resume/current/resume.html', encoding='utf-8').read()
probe = '''
<div id="probe-out" style="display:none"></div>
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const c = document.getElementById('resume-container');
    const rect = c.getBoundingClientRect();
    // 找内容的实际包围盒（遍历所有可见元素的边界）
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
    const lines = [
      '页面宽: ' + Math.round(794/MM) + 'mm',
      '页面高: ' + Math.round(1123/MM) + 'mm',
      '内容左边缘距页左: ' + (minL/MM).toFixed(1) + 'mm',
      '内容上边缘距页顶: ' + (minT/MM).toFixed(1) + 'mm',
      '内容右边缘距页右: ' + ((794-maxR)/MM).toFixed(1) + 'mm',
      '内容下边缘距页底: ' + ((1123-maxB)/MM).toFixed(1) + 'mm',
      '内容包围盒: ' + Math.round((maxR-minL)/MM) + 'mm x ' + Math.round((maxB-minT)/MM) + 'mm'
    ];
    document.getElementById('probe-out').textContent = lines.join(' | ');
  }, 3000);
});
</script>
'''
html = html.replace('</body>', probe + '</body>')
open('/opt/resume/current/_edge.html','w',encoding='utf-8').write(html)
PY
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --window-size=794,1123 --virtual-time-budget=15000 --dump-dom \
  'http://127.0.0.1:8080/_edge.html?pdf=1' 2>/dev/null \
  | grep -o 'id="probe-out"[^>]*>[^<]*' | sed 's/.*//'
rm -f /opt/resume/current/_edge.html
