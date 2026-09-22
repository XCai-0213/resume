const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = 'E:\\resume\\assets\\images\\icons';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. 生成三大材料仿真计算专属高级彩色徽章
const vaspSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="vaspBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c2340"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
    <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="26" fill="url(#vaspBg)"/>
  <path d="M64 22 L96 39 L96 75 L64 92 L32 75 L32 39 Z" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linejoin="round" opacity="0.9"/>
  <path d="M64 22 L64 58 L96 75 M64 58 L32 75" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linejoin="round" opacity="0.9"/>
  <circle cx="64" cy="22" r="6" fill="url(#goldG)"/>
  <circle cx="96" cy="39" r="5.5" fill="#38bdf8"/>
  <circle cx="32" cy="39" r="5.5" fill="#38bdf8"/>
  <circle cx="64" cy="58" r="8" fill="#f43f5e"/>
  <circle cx="96" cy="75" r="5.5" fill="#38bdf8"/>
  <circle cx="32" cy="75" r="5.5" fill="#38bdf8"/>
  <circle cx="64" cy="92" r="6" fill="url(#goldG)"/>
  <rect x="20" y="99" width="88" height="21" rx="5" fill="#0284c7"/>
  <text x="64" y="114.5" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" font-weight="900" font-size="13.5" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">VASP</text>
</svg>`;

const cp2kSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="cp2kBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#044e3a"/>
      <stop offset="100%" stop-color="#065f46"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="26" fill="url(#cp2kBg)"/>
  <ellipse cx="64" cy="52" rx="38" ry="16" fill="none" stroke="#a7f3d0" stroke-width="3.5" transform="rotate(-30 64 52)" opacity="0.95"/>
  <ellipse cx="64" cy="52" rx="38" ry="16" fill="none" stroke="#34d399" stroke-width="3.5" transform="rotate(30 64 52)" opacity="0.95"/>
  <circle cx="64" cy="52" r="11" fill="#f59e0b"/>
  <circle cx="64" cy="52" r="6.5" fill="#fde047"/>
  <circle cx="36" cy="36" r="4.5" fill="#38bdf8"/>
  <circle cx="92" cy="68" r="4.5" fill="#38bdf8"/>
  <circle cx="92" cy="36" r="4.5" fill="#f43f5e"/>
  <rect x="22" y="99" width="84" height="21" rx="5" fill="#059669"/>
  <text x="64" y="114.5" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" font-weight="900" font-size="13.5" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">CP2K</text>
</svg>`;

const lammpsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="lammpsBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="26" fill="url(#lammpsBg)"/>
  <path d="M28 62 Q 46 30 64 54 T 100 46" fill="none" stroke="#818cf8" stroke-width="3" stroke-dasharray="4,3"/>
  <path d="M32 38 Q 64 78 96 68" fill="none" stroke="#c084fc" stroke-width="2.5" stroke-dasharray="3,3"/>
  <circle cx="64" cy="54" r="10" fill="#f43f5e"/>
  <circle cx="36" cy="40" r="7" fill="#38bdf8"/>
  <circle cx="94" cy="46" r="8" fill="#facc15"/>
  <circle cx="48" cy="74" r="6" fill="#a78bfa"/>
  <circle cx="82" cy="72" r="7.5" fill="#34d399"/>
  <line x1="64" y1="54" x2="79" y2="40" stroke="#f43f5e" stroke-width="2.5"/>
  <polygon points="79,40 76,46 72,42" fill="#f43f5e"/>
  <rect x="16" y="99" width="96" height="21" rx="5" fill="#4338ca"/>
  <text x="64" y="114.5" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle" letter-spacing="1">LAMMPS</text>
</svg>`;

fs.writeFileSync(path.join(outDir, 'vasp.svg'), vaspSvg, 'utf8');
fs.writeFileSync(path.join(outDir, 'cp2k.svg'), cp2kSvg, 'utf8');
fs.writeFileSync(path.join(outDir, 'lammps.svg'), lammpsSvg, 'utf8');

console.log('✓ VASP, CP2K, LAMMPS SVGs generated.');

// 2. 生成主要 AI / 语言高保真彩色图标
// 我们通过标准品牌原色注入生成高质量单体彩色 SVG

const BRAND_COLORS = {
  deepseek: { color: '#4D6BFE', name: 'DeepSeek' },
  claude: { color: '#D97706', name: 'Claude' },
  anthropic: { color: '#CC785C', name: 'Anthropic' },
  openai: { color: '#10A37F', name: 'OpenAI / ChatGPT' },
  codex: { color: '#D97706', name: 'Codex' },
  githubcopilot: { color: '#8957E5', name: 'GitHub Copilot' },
  cursor: { color: '#000000', name: 'Cursor' },
  perplexity: { color: '#20B2AA', name: 'Perplexity' },
  qwen: { color: '#615ced', name: 'Qwen 通义千问' },
  kimi: { color: '#00D182', name: 'Kimi' },
  huggingface: { color: '#FFD21E', name: 'Hugging Face' },
  mistralai: { color: '#FA520F', name: 'Mistral AI' },
  react: { color: '#61DAFB', name: 'React' },
  html5: { color: '#E34F26', name: 'HTML5' },
  css3: { color: '#1572B6', name: 'CSS' },
  sass: { color: '#CC6699', name: 'Sass' },
  tailwindcss: { color: '#06B6D4', name: 'Tailwind CSS' },
  angular: { color: '#DD0031', name: 'Angular' },
  svelte: { color: '#FF3E00', name: 'Svelte' },
  jquery: { color: '#0769AD', name: 'jQuery' },
  bootstrap: { color: '#7952B3', name: 'Bootstrap' },
  vite: { color: '#646CFF', name: 'Vite' },
  webpack: { color: '#8DD6F9', name: 'Webpack' },
  nodedotjs: { color: '#5FA04E', name: 'Node.js' },
  openjdk: { color: '#ED8B00', name: 'Java' },
  c: { color: '#A8B9CC', name: 'C 语言' },
  cplusplus: { color: '#00599C', name: 'C++' },
  go: { color: '#00ADD8', name: 'Go' },
  php: { color: '#777BB4', name: 'PHP' },
  rust: { color: '#DEA584', name: 'Rust' },
  swift: { color: '#F05138', name: 'Swift' },
  mysql: { color: '#4479A1', name: 'MySQL' },
  postgresql: { color: '#4169E1', name: 'PostgreSQL' },
  mongodb: { color: '#47A248', name: 'MongoDB' },
  redis: { color: '#FF4438', name: 'Redis' },
  sqlite: { color: '#003B57', name: 'SQLite' },
  docker: { color: '#2496ED', name: 'Docker' },
  kubernetes: { color: '#326CE5', name: 'Kubernetes' },
  nginx: { color: '#009639', name: 'Nginx' },
  linux: { color: '#FCC624', name: 'Linux' },
  ubuntu: { color: '#E95420', name: 'Ubuntu' },
  git: { color: '#F05032', name: 'Git' },
  github: { color: '#24292e', name: 'GitHub' },
  gitlab: { color: '#FC6D26', name: 'GitLab' },
  pytorch: { color: '#EE4C2C', name: 'PyTorch' },
  tensorflow: { color: '#FF6F00', name: 'TensorFlow' },
  opencv: { color: '#5C3EE8', name: 'OpenCV' },
  jupyter: { color: '#F37626', name: 'Jupyter' },
  numpy: { color: '#013243', name: 'NumPy' },
  pandas: { color: '#150458', name: 'Pandas' },
  anaconda: { color: '#44A833', name: 'Anaconda' },
  autocad: { color: '#E51937', name: 'AutoCAD' },
  ansys: { color: '#FFB71B', name: 'ANSYS' },
  blender: { color: '#E87D0D', name: 'Blender' },
  unity: { color: '#000000', name: 'Unity' },
  figma: { color: '#F24E1E', name: 'Figma' }
};

console.log('Done preparing color meta.');
