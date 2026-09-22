const fs = require('fs');
const path = require('path');

const dir = 'E:\\简历\\定制模板';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

console.log('Found customized resumes:', files);

// 基础个人通用联系方式和基本信息
const commonInfo = {
  name: '张栋梁',
  phone: '17855900213',
  email: '690857@163.com',
  avatar: '/uploads/____1789937723958.jpg',
  hometown: '安徽宿州',
  location: '江西南昌',
  political: '中共党员'
};

const presets = {};

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  console.log(`\n=== Parsing ${f} ===`);
  const lines = content.split('\n');
  let currentSection = '';
  // 简要打印行数和标题
  const h2s = lines.filter(l => l.startsWith('## '));
  console.log('Sections:', h2s);
});
