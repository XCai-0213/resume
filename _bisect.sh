#!/bin/bash
# 对比 CSS 与 HTML 渲染 —— 二分法找问题
BIN=/opt/chromium/cft/chrome-headless-shell-linux64/chrome-headless-shell
cd "$(dirname $BIN)"

echo "=== Test 1: 无 CSS 加载的 resume.html ==="
rm -rf /tmp/t1 /tmp/t1.pdf
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/t1.pdf --no-pdf-header-footer \
  'http://127.0.0.1:8080/resume.html' >/dev/null 2>&1
echo "  size: $(stat -c%s /tmp/t1.pdf 2>/dev/null || echo FAIL)"

echo "=== Test 2: 只加载 index.css（无 custom-layout.css） ==="
rm -f /opt/resume/current/_test.html
# 创建一个不加载 custom-layout.css 的版本
node <<'EOF'
const fs = require('fs');
let html = fs.readFileSync('/opt/resume/current/resume.html', 'utf8');
html = html.replace('<link rel="stylesheet" href="assets/css/custom-layout.css', '<!-- REMOVED custom-layout');
html = html.replace('assets/css/templates.css?v=202609300022">', 'assets/css/templates.css">');
fs.writeFileSync('/opt/resume/current/_test.html', html);
EOF
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/t2.pdf --no-pdf-header-footer \
  'http://127.0.0.1:8080/_test.html' >/dev/null 2>&1
echo "  size: $(stat -c%s /tmp/t2.pdf 2>/dev/null || echo FAIL)"

echo "=== Test 3: 完整 CSS 但无 JS ==="
rm -f /opt/resume/current/_test2.html
node <<'EOF'
const fs = require('fs');
let html = fs.readFileSync('/opt/resume/current/resume.html', 'utf8');
// 去掉 JS 脚本引用
html = html.replace(/<script src="assets\/js\/[^"]*"><\/script>/g, '');
fs.writeFileSync('/opt/resume/current/_test2.html', html);
EOF
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/t3.pdf --no-pdf-header-footer \
  'http://127.0.0.1:8080/_test2.html' >/dev/null 2>&1
echo "  size: $(stat -c%s /tmp/t3.pdf 2>/dev/null || echo FAIL)"

# 清理
rm -f /opt/resume/current/_test.html /opt/resume/current/_test2.html
