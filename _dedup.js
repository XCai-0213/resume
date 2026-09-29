const fs = require('fs');
const p = 'E:/resume/assets/css/custom-layout.css';
const lines = fs.readFileSync(p, 'utf8').split('\n');

// 收集所有 body.pdf-mode 规则块（从选择器行到配对 }）
const blocks = [];   // { start, end, lines, key }
let i = 0;
while (i < lines.length) {
  const trimmed = lines[i].trim();
  if (trimmed.startsWith('body.pdf-mode') && trimmed.includes('{')) {
    // 收集完整规则
    let depth = 0, j = i, ruleLines = [];
    let selDone = false;
    while (j < lines.length) {
      ruleLines.push(lines[j]);
      depth += (lines[j].match(/\{/g) || []).length;
      depth -= (lines[j].match(/\}/g) || []).length;
      if (depth <= 0 && lines[j].includes('}')) { break; }
      j++;
    }
    // 生成唯一 key（选择器 + 排序后的属性签名）
    const sel = (trimmed.split('{')[0] || '').trim();
    const body = ruleLines.join('\n').replace(/^[^{]*\{/, '').replace(/\}\s*$/, '');
    const props = body.split(';').map(s => s.trim()).filter(Boolean).sort().join(';');
    const key = sel + '::' + props;
    blocks.push({ start: i, end: j, sel, key, lines: ruleLines });
    i = j + 1;
  } else {
    i++;
  }
}

console.log('pdf-mode 规则块总数:', blocks.length);

// 去重：按 key 分组，保留最后一个（后面声明的覆盖前面的）
const seen = new Map();
blocks.forEach(b => seen.set(b.key, b));

// 找到所有块的范围，把重复的标为删除
const toRemove = new Set();
const kept = [];
const keyCount = {};
blocks.forEach(b => {
  keyCount[b.key] = (keyCount[b.key] || 0) + 1;
});
blocks.forEach(b => {
  keyCount[b.key]--;
  if (keyCount[b.key] > 0) {
    toRemove.add(b.start);  // 不是最后一次出现 → 删
  } else {
    kept.push(b);
  }
});

console.log('去重后保留:', kept.length, '删除重复:', toRemove.size);

// 删除重复块的行
const removeLines = new Set();
toRemove.forEach(start => {
  const b = blocks.find(x => x.start === start);
  if (b) { for (let k = b.start; k <= b.end; k++) removeLines.add(k); }
});

const result = lines.filter((_, idx) => !removeLines.has(idx));
fs.writeFileSync(p, result.join('\n'), 'utf8');

let bal = 0;
for (const ch of result.join('\n')) { if (ch === '{') bal++; else if (ch === '}') bal--; }
console.log('brace balance:', bal, bal === 0 ? 'OK' : 'MISMATCH');
console.log('新总行数:', result.length);

// 最终检查：列出保留的唯一规则
console.log('\n=== 保留的唯一 pdf-mode 规则 ===');
kept.forEach(b => console.log(' ·', b.sel.substring(0, 70)));
