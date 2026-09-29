#!/bin/bash
# 无 CSS 无 JS 的还是空白 —— HTML 本身的问题。
# 试试用纯 HTML（完全重建一个简单的简历页面）

echo '<html><body>
<h1>张栋梁</h1>
<h2>AI4S / 计算化学 / AI算法</h2>
<h3>教育经历</h3>
<p>江西师范大学 - 材料科学与工程 - 硕士研究生</p>
<p>黄山学院 - 材料成型及控制工程 - 学士</p>
<h3>个人项目</h3>
<p>材料在线实验室 / CatGO / 智慧课堂 AI 教学平台</p>
</body></html>' > /opt/resume/current/simple2.html

BIN=/opt/chromium/cft/chrome-headless-shell-linux64/chrome-headless-shell
cd "$(dirname $BIN)"

echo "=== simple2 (中文内容) ==="
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/s2.pdf --no-pdf-header-footer \
  'http://127.0.0.1:8080/simple2.html' 2>&1 | tail -1
ls -la /tmp/s2.pdf 2>/dev/null
node -e "const s=require('fs').readFileSync('/tmp/s2.pdf').toString('latin1');console.log('fonts:',(s.match(/FontFile2|FontFile3/g)||[]).length)" 2>/dev/null

echo ""
echo "=== 用 t.html（之前能渲染中文的）重测 ==="
echo '<html><body><h1 style="font-size:48px">测试中文</h1><p style="font-size:24px">Hello</p></body></html>' > /opt/resume/current/t.html
./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/t5.pdf --no-pdf-header-footer \
  'http://127.0.0.1:8080/t.html' 2>&1 | tail -1
ls -la /tmp/t5.pdf 2>/dev/null
node -e "const s=require('fs').readFileSync('/tmp/t5.pdf').toString('latin1');console.log('fonts:',(s.match(/FontFile2|FontFile3/g)||[]).length)" 2>/dev/null

rm -f /opt/resume/current/simple2.html /opt/resume/current/t.html /tmp/s2.pdf /tmp/t5.pdf /tmp/nocss.pdf /tmp/test-nocss.html
