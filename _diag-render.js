#!/bin/bash
# headless-shell --print-to-pdf 可能对某些 HTML 渲染有问题
# 试试直接加载一个 data URI 的简单 HTML

BIN=/opt/chromium/cft/chrome-headless-shell-linux64/chrome-headless-shell
cd "$(dirname $BIN)"

echo "=== Test 1: data URI simple text ==="
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/t1.pdf --no-pdf-header-footer \
  'data:text/html,<html><body><h1 style="font-size:48px">Hello Test</h1></body></html>' 2>&1 | tail -1
echo "  size: $(stat -c%s /tmp/t1.pdf 2>/dev/null)"

echo ""
echo "=== Test 2: local file:// path ==="
echo '<html><body><h1 style="font-size:48px">File Test 中文</h1></body></html>' > /tmp/test.html
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/t2.pdf --no-pdf-header-footer \
  'file:///tmp/test.html' 2>&1 | tail -1
echo "  size: $(stat -c%s /tmp/t2.pdf 2>/dev/null)"
node -e 'const s=require("fs").readFileSync("/tmp/t2.pdf").toString("latin1");console.log("  fonts:",(s.match(/FontFile2|FontFile3/g)||[]).length)' 2>/dev/null

echo ""
echo "=== Test 3: 加 --run-all-compositor-stages-before-draw ==="
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --run-all-compositor-stages-before-draw \
  --print-to-pdf=/tmp/t3.pdf --no-pdf-header-footer \
  'file:///tmp/test.html' 2>&1 | tail -1
echo "  size: $(stat -c%s /tmp/t3.pdf 2>/dev/null)"
node -e 'const s=require("fs").readFileSync("/tmp/t3.pdf").toString("latin1");console.log("  fonts:",(s.match(/FontFile2|FontFile3/g)||[]).length)' 2>/dev/null

echo ""
echo "=== Test 4: 不加 --disable-gpu ==="
./chrome-headless-shell --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/t4.pdf --no-pdf-header-footer \
  'file:///tmp/test.html' 2>&1 | tail -1
echo "  size: $(stat -c%s /tmp/t4.pdf 2>/dev/null)"
node -e 'const s=require("fs").readFileSync("/tmp/t4.pdf").toString("latin1");console.log("  fonts:",(s.match(/FontFile2|FontFile3/g)||[]).length)' 2>/dev/null
