#!/bin/bash
echo "=== @page 规则 ==="
grep -B1 -A4 '@page' /opt/resume/current/assets/css/custom-layout.css | head -8
echo ""
echo "=== body.pdf-mode padding 规则 ==="
grep -A2 'body.pdf-mode {' /opt/resume/current/assets/css/custom-layout.css | head -6
echo ""
echo "=== @media print 内 body.pdf-mode ==="
grep -B1 -A4 '打印时边距' /opt/resume/current/assets/css/custom-layout.css
