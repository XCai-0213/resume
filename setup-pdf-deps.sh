#!/bin/bash
# ============================================================
# 简历系统 - 服务端 PDF 依赖安装（一次性）
#
# 服务端直接生成 PDF 需要两样东西：
#   1. 无头浏览器（用 Chrome for Testing 的 chrome-headless-shell，
#      自带 icudtl.dat 等数据文件，约 114MB，比完整版 Chrome 的 236MB 小）
#   2. 中日韩字体（否则中文全部渲染成方框 □□□）
#
# 执行：bash setup-pdf-deps.sh
# 幂等：重复执行会跳过已完成的部分
# ============================================================
set -e

echo "###################### 1/2 中文字体 ######################"
if [ "$(fc-list :lang=zh 2>/dev/null | wc -l)" -gt 0 ]; then
  echo "已安装 CJK 字体（$(fc-list :lang=zh 2>/dev/null | wc -l) 条），跳过"
else
  echo "安装 Noto CJK + 文泉驿字体..."
  apt-get update -qq
  apt-get install -y -qq fonts-noto-cjk fonts-noto-cjk-extra \
                       fonts-wqy-zenhei fonts-wqy-microhei fontconfig
  fc-cache -f >/dev/null 2>&1
  echo "完成：$(fc-list :lang=zh 2>/dev/null | wc -l) 条 CJK 字体"
fi

echo ""
echo "###################### 2/2 无头浏览器 ######################"
CHROME=/opt/chromium/cft/chrome-headless-shell-linux64/chrome-headless-shell
if [ -x "$CHROME" ]; then
  echo "已安装：$($CHROME --version 2>/dev/null)"
else
  echo "查找最新稳定版版本号..."
  VER=$(curl -s --max-time 30 https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json \
        | grep -o '"Stable"[^}]*' | grep -o '"version":"[^"]*"' | head -1 | cut -d'"' -f4)
  [ -z "$VER" ] && { echo "无法获取版本号（检查网络）"; exit 1; }
  echo "版本：$VER"

  URL="https://storage.googleapis.com/chrome-for-testing-public/$VER/linux64/chrome-headless-shell-linux64.zip"
  SIZE=$(curl -sI --max-time 25 "$URL" | grep -i '^content-length' | tr -d '\r' | awk '{print $2}')
  echo "下载 $((SIZE/1024/1024)) MB（支持断点续传）..."

  rm -f /tmp/chs.zip
  for i in $(seq 1 8); do
    GOT=$(stat -c%s /tmp/chs.zip 2>/dev/null || echo 0)
    [ "$GOT" = "$SIZE" ] && break
    curl -L -C - --max-time 420 --retry 3 --retry-delay 3 --connect-timeout 20 \
         -o /tmp/chs.zip "$URL" 2>&1 | tail -c 80
  done

  GOT=$(stat -c%s /tmp/chs.zip 2>/dev/null || echo 0)
  [ "$GOT" != "$SIZE" ] && { echo "下载不完整 ($GOT/$SIZE)"; exit 1; }
  unzip -q -t /tmp/chs.zip >/dev/null || { echo "压缩包损坏"; exit 1; }

  rm -rf /opt/chromium/cft
  mkdir -p /opt/chromium/cft
  unzip -q -o /tmp/chs.zip -d /opt/chromium/cft
  chmod +x "$CHROME"
  rm -f /tmp/chs.zip
  echo "完成：$($CHROME --version 2>/dev/null)"
fi

# 记录路径，server.js 启动时优先读取
echo "$CHROME" > /opt/chromium/.headless_shell_path

echo ""
echo "###################### 验证 ######################"
echo "字体：$(fc-list :lang=zh 2>/dev/null | wc -l) 条 CJK"
echo "浏览器：$CHROME"
echo ""
echo "测试 PDF 生成..."
rm -f /tmp/dep-test.pdf
cd "$(dirname $CHROME)"
timeout 90 ./chrome-headless-shell --disable-gpu --no-sandbox --disable-dev-shm-usage \
  --print-to-pdf=/tmp/dep-test.pdf --no-pdf-header-footer \
  http://127.0.0.1:8080/resume.html >/dev/null 2>&1 || true

if [ -f /tmp/dep-test.pdf ] && [ "$(stat -c%s /tmp/dep-test.pdf)" -gt 10000 ]; then
  echo "✅ 成功：$(stat -c%s /tmp/dep-test.pdf) bytes"
  rm -f /tmp/dep-test.pdf
else
  echo "❌ 失败 —— 请检查服务是否运行（systemctl status resume）"
  exit 1
fi

echo ""
echo "全部就绪！服务端 PDF 导出可用。"
