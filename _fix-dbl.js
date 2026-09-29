const fs = require('fs');
const p = 'E:/resume/assets/css/custom-layout.css';
let lines = fs.readFileSync(p, 'utf8').split('\n');

// 在 @media print 里加入 body.pdf-mode padding: 0 覆盖
// 这样打印时只有 @page 的 margin，没有 body padding 叠加
let added = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '@media print {') {
    // 找到这个块的结束前插入
    let depth = 0;
    for (let j = i; j < lines.length; j++) {
      depth += (lines[j].match(/\{/g) || []).length;
      depth -= (lines[j].match(/\}/g) || []).length;
      if (depth === 0 && j > i) {
        // 在结束 } 之前插入
        lines.splice(j, 0,
          '',
          '  /* 打印时边距由 @page margin 处理（JS 动态设置 --page-pad-* 变量） */',
          '  body.pdf-mode {',
          '    padding: 0 !important;',
          '    margin: 0 !important;',
          '  }',
          ''
        );
        added = true;
        console.log('inserted @media print body.pdf-mode override before line', j + 1);
        break;
      }
    }
    break;
  }
}

// 确认之前加的 padding override 是否已存在（避免重复）
let count = 0;
lines.forEach(l => { if (l.includes('打印时边距由 @page')) count++; });
if (count > 1) {
  // 去重：保留最后一个
  let seen = 0;
  const result = [];
  let skipNext = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('打印时边距由 @page')) {
      seen++;
      if (seen < count) {
        // 跳过这个块（4 行）
        i += 4;
        continue;
      }
    }
    result.push(lines[i]);
  }
  lines = result;
  console.log('deduplicated, kept', count, '-> 1');
}

fs.writeFileSync(p, lines.join('\n'), 'utf8');
let bal = 0;
for (const ch of lines.join('\n')) { if (ch==='{') bal++; else if (ch==='}') bal--; }
console.log('brace balance:', bal, bal === 0 ? 'OK' : 'MISMATCH');
console.log('added:', added);
