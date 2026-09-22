const fs = require('fs');
const dom = fs.readFileSync('E:/resume/_dom.html', 'utf8');

const match = dom.match(/class=['"][^'"]*header-avatar-box[^'"]*['"][\s\S]*?<\/div>/i);
if (match) {
  console.log('header-avatar-box HTML:');
  console.log(match[0]);
}

const parent = dom.match(/<section[^>]*id=['"]header-side-by-side-card['"][^>]*>[\s\S]*?<\/section>/i);
if (parent) {
  console.log('\nParent HTML (first 800 chars):');
  console.log(parent[0].substring(0, 800));
}

// 检查页面上所有的 fixed / absolute 元素
const fixedMatches = dom.match(/<[^>]+class=['"][^'"]*(quick|button|btn|fixed|circle|dot|badge)[^'"]*['"][^>]*>/gi);
console.log('\nPotential floating elements:');
console.log(fixedMatches?.slice(0, 15));
