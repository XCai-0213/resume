const fs = require('fs');
const css = fs.readFileSync('/opt/resume/current/assets/css/custom-layout.css', 'utf8');

let bal = 0, line = 1, errors = [];
for (const ch of css) {
  if (ch === '\n') line++;
  if (ch === '{') bal++;
  if (ch === '}') {
    bal--;
    if (bal < 0) { errors.push('extra } at line ' + line); bal = 0; }
  }
}
console.log('final balance:', bal);
console.log('errors:', errors.length ? errors.join('; ') : 'none');

// 检查 --page-pad 变量引用（如果 :root 定义被删了，这些会解析为空）
const padRefs = css.match(/var\(--page-pad[^)]*\)/g) || [];
console.log('page-pad var refs:', padRefs.length);
padRefs.forEach(v => console.log(' ', v));

// 检查 :root 里是否定义了这些变量
const hasRootDef = css.includes('--page-pad-x:');
console.log(':root has --page-pad-x definition:', hasRootDef);

// 检查 body.pdf-mode 是否有 background: #ffffff
const pdfModeIdx = css.indexOf('body.pdf-mode {');
if (pdfModeIdx >= 0) {
  const block = css.substring(pdfModeIdx, css.indexOf('}', pdfModeIdx) + 1);
  console.log('body.pdf-mode has background:', block.includes('background'));
  console.log('body.pdf-mode has padding:', block.includes('padding'));
}
