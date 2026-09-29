#!/bin/bash
# 测试渲染一个简单的 HTML 页面，排除是 headless_shell 本身的问题
BIN=/opt/chromium/cft/chrome-headless-shell-linux64/chrome-headless-shell
cd "$(dirname $BIN)"

echo '<html><body><h1 style="font-size:60px">TEST PAGE</h1><p>Hello World</p></body></html>' > /opt/resume/current/simple.html
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/simple.pdf --no-pdf-header-footer \
  'http://127.0.0.1:8080/simple.html' >/dev/null 2>&1
echo "simple: $(stat -c%s /tmp/simple.pdf 2>/dev/null) bytes"
node -e "const s=require('fs').readFileSync('/tmp/simple.pdf').toString('latin1');console.log('fonts:',(s.match(/FontFile/g)||[]).length)" 2>/dev/null

echo ""
echo "=== 试试旧版 headless_shell（不用 CfT 版） ==="
# 之前成功生成 2.8MB PDF 时用的是哪个版本？
ls -la /opt/chromium/
echo ""
# 检查之前成功的 PDF 时间
echo "=== 最近的 PDF 文件（看哪些是成功的） ==="
find /tmp -name "*.pdf" -mmin -60 2>/dev/null | head -10
