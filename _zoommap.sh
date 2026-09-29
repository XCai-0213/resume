#!/bin/bash
# Understand how zoom affects scrollHeight precisely, so the solver can be exact.
SRC=/opt/resume/current/resume.html
T=/opt/resume/current/_zoommap.html

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
    b.classList.add('pdf-mode');
    b.setAttribute('data-fit','auto');
    const out = [];
    for (const z of [1.0,1.1,1.2,1.3,1.4]) {
      c.style.zoom = z;
      void c.offsetHeight;
      // measure both scrollHeight and the bounding box (visual) height
      const rect = c.getBoundingClientRect();
      out.push('z=' + z + ' scroll=' + c.scrollHeight + ' rect=' + Math.round(rect.height));
    }
    c.style.zoom = '';
    document.getElementById('probe-out').textContent = out.join(' | ');
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
  "http://127.0.0.1:8080/_zoommap.html" 2>/dev/null \
  | grep -o 'id="probe-out"[^>]*>[^<]*' | sed 's/.*>//'

rm -f "$T"
