// 检查 CSS 中是否有规则会导致页面不可见
const fs = require('fs');
const css = fs.readFileSync('/opt/resume/current/assets/css/custom-layout.css', 'utf8');

// 检查可疑的规则
const checks = [
  { name: 'html,body display:none', re: /html[^{]*body[^{]*\{[^}]*display\s*:\s*none/ },
  { name: 'body overflow:hidden + height:0', re: /body[^{]*\{[^}]*overflow\s*:\s*hidden[^}]*height\s*:\s*0/ },
  { name: 'container display:none', re: /\.container[^{]*\{[^}]*display\s*:\s*none/ },
  { name: 'container visibility:hidden', re: /\.container[^{]*\{[^}]*visibility\s*:\s*hidden/ },
  { name: 'container opacity:0', re: /\.container[^{]*\{[^}]*opacity\s*:\s*0/ },
  { name: 'body visibility:hidden', re: /^\s*body[^{]*\{[^}]*visibility\s*:\s*hidden/m },
  { name: 'body opacity:0', re: /^\s*body[^{]*\{[^}]*opacity\s*:\s*0/m },
  { name: 'body display:none', re: /^\s*body[^{]*\{[^}]*display\s*:\s*none/m },
  { name: 'body height:0', re: /^\s*body[^{]*\{[^}]*height\s*:\s*0/m },
];

console.log('=== 检查可疑 CSS 规则 ===');
for (const c of checks) {
  if (c.re.test(css)) {
    console.log('⚠️ FOUND:', c.name);
    // 打印匹配上下文
    const m = css.match(c.re);
    if (m) console.log('   context:', m[0].substring(0, 200));
  } else {
    console.log('  OK:', c.name);
  }
}

// 检查 body.pdf-mode 的规则集（不加 .pdf-mode class 时会不会影响？）
console.log('\n=== body.pdf-mode 页面盒规则 ===');
const m = css.match(/body\.pdf-mode\s*\{[^}]+\}/);
if (m) console.log(m[0].substring(0, 500));

// 检查 body { } 全局规则（index.css 的 padding:1rem 10% 会不会在 pdf-mode 里生效？）
console.log('\n=== 检查 index.css 的 body 规则是否被覆盖 ===');
const idxCss = fs.readFileSync('/opt/resume/current/assets/css/index.css', 'utf8');
const bodyMatch = idxCss.match(/body\s*\{[^}]+\}/);
if (bodyMatch) console.log('index.css body:', bodyMatch[0].substring(0, 300));
