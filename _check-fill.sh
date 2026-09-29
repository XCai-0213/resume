#!/bin/bash
# Verify the continuous fill: report tier, zoom, content height vs page, fill %
SRC=/opt/resume/current/resume.html
T=/opt/resume/current/_fill.html

python3 - "$SRC" "$T" <<'PY'
import sys
html = open(sys.argv[1], encoding='utf-8').read()
probe = '''
<div id="probe-out" style="display:none"></div>
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const c = document.getElementById('resume-container');
    const b = document.body;
    const cs = getComputedStyle(b);
    const MM = 3.7795;
    const padY = parseFloat(cs.paddingTop);
    const usable = (297 - 2 * (padY / MM)) * MM;
    const h = c.scrollHeight;
    const out = [
      'tier=' + (b.getAttribute('data-fit') || 'none'),
      'zoom=' + (c.style.zoom || '1'),
      'contentH=' + h,
      'usable=' + Math.round(usable),
      'fill=' + Math.round(h / usable * 100) + '%',
      'padX=' + (parseFloat(cs.paddingLeft) / MM).toFixed(1) + 'mm'
    ];
    document.getElementById('probe-out').textContent = out.join('  ');
  }, 3000);
});
</script>
'''
html = html.replace('</body>', probe + '</body>')
open(sys.argv[2],'w',encoding='utf-8').write(html)
print('written')
PY

BIN=/opt/chromium/cft/chrome-headless-shell-linux64/chrome-headless-shell
cd "$(dirname $BIN)"
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --window-size=794,1123 --virtual-time-budget=15000 --dump-dom \
  "http://127.0.0.1:8080/_fill.html?pdf=1" 2>/dev/null \
  | grep -o 'id="probe-out"[^>]*>[^<]*' | sed 's/.*>//'

rm -f "$T"
