#!/bin/bash
# Resume System Deployment Script v1.2
set -e

DEPLOY_ROOT=/opt/resume
RELEASE_DIR=$DEPLOY_ROOT/releases/$(date +%Y%m%d_%H%M%S)
SERVICE=resume

step() { echo ""; echo "===== $1 ====="; }

step "1/7 Create release dir"
mkdir -p "$RELEASE_DIR"
mkdir -p "$DEPLOY_ROOT/releases"
echo "Release: $RELEASE_DIR"

step "2/7 Extract package"
cd "$RELEASE_DIR"
if [ -f /tmp/resume-deploy.tar.gz ]; then
  tar -xzf /tmp/resume-deploy.tar.gz -C "$RELEASE_DIR"
  echo "Files: $(find . -type f | wc -l)"
else
  echo "[ERROR] /tmp/resume-deploy.tar.gz not found"
  exit 1
fi

step "3/7 Prepare persistent data dir"
mkdir -p "$DEPLOY_ROOT/shared/data" "$DEPLOY_ROOT/shared/uploads"
if [ ! -f "$DEPLOY_ROOT/shared/data/resume.json" ] && [ -f "$RELEASE_DIR/data/resume.json" ]; then
  cp "$RELEASE_DIR/data/resume.json" "$DEPLOY_ROOT/shared/data/"
  echo "Seeded resume.json"
fi
for f in default-resume.json applications.json homepage.json default-homepage.json presets.json; do
  if [ ! -f "$DEPLOY_ROOT/shared/data/$f" ] && [ -f "$RELEASE_DIR/data/$f" ]; then
    cp "$RELEASE_DIR/data/$f" "$DEPLOY_ROOT/shared/data/"
    echo "Seeded $f"
  fi
done
if [ -d "$RELEASE_DIR/uploads" ]; then
  cp -rn "$RELEASE_DIR/uploads/." "$DEPLOY_ROOT/shared/uploads/" 2>/dev/null || true
fi
rm -rf "$RELEASE_DIR/data" "$RELEASE_DIR/uploads"
ln -sfn "$DEPLOY_ROOT/shared/data" "$RELEASE_DIR/data"
ln -sfn "$DEPLOY_ROOT/shared/uploads" "$RELEASE_DIR/uploads"
echo "Data linked to shared/"

step "4/7 Switch current symlink"
ln -sfn "$RELEASE_DIR" "$DEPLOY_ROOT/current"
readlink -f "$DEPLOY_ROOT/current"

step "5/7 Write systemd unit"
cat > /etc/systemd/system/$SERVICE.service <<'UNIT'
[Unit]
Description=Personal Resume System (Node backend)
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/resume/current
Environment=PORT=8080
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /opt/resume/current/server.js
Restart=always
RestartSec=3
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable $SERVICE >/dev/null 2>&1
systemctl restart $SERVICE
sleep 3

step "6/7 Health check"
OK=0
for i in 1 2 3 4 5 6; do
  if curl -sf http://127.0.0.1:8080/api/resume >/dev/null 2>&1; then
    echo "Backend OK"
    OK=1
    break
  fi
  echo "Waiting... $i/6"
  sleep 2
done
if [ "$OK" != "1" ]; then
  echo "Start failed. Logs:"
  journalctl -u $SERVICE -n 30 --no-pager
  exit 1
fi
echo "Service: $(systemctl is-active $SERVICE)"

step "7/7 Cleanup old releases (keep 5)"
cd "$DEPLOY_ROOT/releases"
ls -1t | tail -n +6 | xargs -r rm -rf
echo "Releases left: $(ls -1 | wc -l)"

rm -f /tmp/resume-deploy.tar.gz
echo ""
echo "========== DEPLOY DONE =========="
echo "Release: $RELEASE_DIR"
echo "Data:    $DEPLOY_ROOT/shared/data"
echo "Service: $SERVICE"
curl -s http://127.0.0.1:8080/api/resume | head -c 150
echo ""
