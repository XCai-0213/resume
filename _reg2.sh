#!/bin/bash
echo "=== service ==="
systemctl is-active resume
echo ""
echo "=== endpoints ==="
for p in /resume.html /admin/ / /api/resume /api/jobs /api/homepage /api/presets; do
  printf "  %-16s " "$p"
  curl -s -o /dev/null -w '%{http_code}\n' "http://127.0.0.1:8080$p"
done
echo ""
echo "=== HTTPS ==="
for p in /resume.html /admin/ /; do
  printf "  %-16s " "$p"
  curl -sk -o /dev/null -w '%{http_code}\n' "https://classroom.jyue.cn$p" --max-time 20
done
echo ""
echo "=== PDF ==="
curl -s -o /tmp/r2.pdf -w '  HTTP %{http_code}  %{size_download}B  %{time_total}s\n' \
  http://127.0.0.1:8080/api/export/pdf --max-time 120
node <<'EOF'
const fs = require('fs');
const s = fs.readFileSync('/tmp/r2.pdf').toString('latin1');
const pages = (s.match(/\/Type\s*\/Page\b/g) || []).length;
const fonts = (s.match(/FontFile2|FontFile3/g) || []).length;
console.log('  pages:', pages, '| fonts:', fonts, '| CJK:', s.includes('CIDFont'));
const mb = s.match(/\/MediaBox\s*\[([^\]]*)\]/);
console.log('  MediaBox:', mb ? mb[1].trim() : 'n/a', '(A4 = 0 0 595 842)');
EOF
rm -f /tmp/r2.pdf
