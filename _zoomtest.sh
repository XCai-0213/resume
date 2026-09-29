#!/bin/bash
# Test whether CSS 'zoom' on the container works in headless print-to-pdf,
# which would let us scale content continuously to exactly fill the page.
SRC=/opt/resume/current/resume.html
T=/opt/resume/current/_zoomtest.html

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
    void c.offsetHeight;
    const base = c.scrollHeight;
    const out = ['base=' + base];
    // try zoom scaling
    for (const z of [1.0, 1.05, 1.1, 1.15, 1.2]) {
      c.style.zoom = z;
      void c.offsetHeight;
      out.push('zoom' + z + '->' + c.scrollHeight);
    }
    c.style.zoom = '';
    // try transform scale (doesn't affect scrollHeight, but affects visual)
    out.push('offsetH_with_zoom1.1=' + (function(){ c.style.zoom=1.1; const v=c.offsetHeight; c.style.zoom=''; return v; })());
    document.getElementById('probe-out').textContent = out.join(' | ');
  }, 2500);
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
  "http://127.0.0.1:8080/_zoomtest.html" 2>/dev/null \
  | grep -o 'id="probe-out"[^>]*>[^<]*' | sed 's/.*>//'

rm -f "$T"
