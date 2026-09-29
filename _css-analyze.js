// 精确检查 CSS：模拟 headless Chrome 解析 CSS，找出导致空白页的规则
const fs = require('fs');
const css = fs.readFileSync('/opt/resume/current/assets/css/custom-layout.css', 'utf8');

// 检查：pdf-mode 规则中是否有问题
// 1. body.pdf-mode 页面盒规则
console.log('=== 所有 body.pdf-mode { 规则 ===');
let depth = 0;
const lines = css.split('\n');
let inPdfMode = false;
let currentRule = [];

for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();

  // 检测规则开始
  if (trimmed.startsWith('body.pdf-mode') && trimmed.includes('{')) {
    currentRule = [];
    inPdfMode = true;
    depth = 0;
  }

  if (inPdfMode) {
    currentRule.push(lines[i]);
    depth += (lines[i].match(/\{/g) || []).length;
    depth -= (lines[i].match(/\}/g) || []).length;

    if (depth <= 0) {
      // 规则结束
      const text = currentRule.join('\n');
      const hasDisplayNone = text.includes('display:none') || text.includes('display: none');
      const hasVisibilityHidden = text.includes('visibility:hidden') || text.includes('visibility: hidden');
      const hasHeightZero = /height\s*:\s*0/.test(text);
      const hasOverflowHidden = /overflow\s*:\s*hidden/.test(text);
      const selector = text.split('{')[0].trim();

      // 如果是 body 或 html 的规则且有隐藏属性，报告
      if ((selector === 'body.pdf-mode' || selector.includes('html')) &&
          (hasDisplayNone || hasVisibilityHidden || hasHeightZero)) {
        console.log('\n⚠️ PROBLEM RULE at CSS line ~' + (i - currentRule.length + 2) + ':');
        console.log(text.substring(0, 400));
      }
      // 如果是 .container 的规则且有 display:none
      if (selector.includes('.container') && !selector.includes('.side') && hasDisplayNone) {
        console.log('\n⚠️ CONTAINER HIDDEN at CSS line ~' + (i - currentRule.length + 2) + ':');
        console.log(text.substring(0, 300));
      }

      inPdfMode = false;
    }
  }
}

// 2. 检查 @media print 里 html,body 的规则
console.log('\n=== @media print 里的 html,body ===');
const printIdx = css.indexOf('@media print');
if (printIdx >= 0) {
  const printBlock = css.substring(printIdx);
  const htmlBodyMatch = printBlock.match(/html,\s*body\s*\{[^}]+\}/);
  if (htmlBodyMatch) {
    console.log(htmlBodyMatch[0].substring(0, 400));
  }
}

// 3. 检查 @page margin 变量引用
console.log('\n=== @page 规则 ===');
const pageMatch = css.match(/@page\s*\{[^}]+\}/);
if (pageMatch) console.log(pageMatch[0]);
