// 简历后台管理系统前端逻辑

// 字体图标库定义（FontAwesome 分类，支持直接点击选用及阿里 Iconfont 扩展）
const ICON_LIBRARY = [
  // 1. 通讯与社交
  { category: '通讯社交', icon: 'fa fa-phone', name: '电话', tag: 'phone 手机 通话' },
  { category: '通讯社交', icon: 'fa fa-mobile', name: '手机', tag: 'mobile 电话' },
  { category: '通讯社交', icon: 'fa fa-envelope', name: '邮箱', tag: 'email 邮件 信箱' },
  { category: '通讯社交', icon: 'fa fa-envelope-o', name: '邮件框', tag: 'email mail' },
  { category: '通讯社交', icon: 'fa fa-weixin', name: '微信', tag: 'wechat weixin 聊天' },
  { category: '通讯社交', icon: 'fa fa-qq', name: 'QQ', tag: 'qq 腾讯' },
  { category: '通讯社交', icon: 'fa fa-github', name: 'GitHub', tag: 'github 开源 代码' },
  { category: '通讯社交', icon: 'fa fa-globe', name: '个人主页', tag: 'website 网站 网页' },
  { category: '通讯社交', icon: 'fa fa-weibo', name: '微博', tag: 'weibo 社交' },
  { category: '通讯社交', icon: 'fa fa-linkedin', name: '领英', tag: 'linkedin 职场' },
  { category: '通讯社交', icon: 'fa fa-link', name: '外链/作品', tag: 'link url 链接' },
  { category: '通讯社交', icon: 'fa fa-comment', name: '即时消息', tag: 'comment 聊天' },
  { category: '通讯社交', icon: 'fa fa-comments', name: '交流讨论', tag: 'chat message' },
  { category: '通讯社交', icon: 'fa fa-rss', name: '博客订阅', tag: 'rss 博客 blog' },

  // 2. 个人信息
  { category: '个人信息', icon: 'fa fa-user', name: '用户头像', tag: 'user 个人' },
  { category: '个人信息', icon: 'fa fa-user-circle', name: '用户圆框', tag: 'user 名片' },
  { category: '个人信息', icon: 'fa fa-id-card', name: '身份信息', tag: 'id card 证件' },
  { category: '个人信息', icon: 'fa fa-id-card-o', name: '证件线框', tag: 'id card 档案' },
  { category: '个人信息', icon: 'fa fa-map-marker', name: '现居城市', tag: 'location 地址 城市 坐标' },
  { category: '个人信息', icon: 'fa fa-calendar', name: '出生年月', tag: 'calendar 日期 时间' },
  { category: '个人信息', icon: 'fa fa-birthday-cake', name: '年龄生日', tag: 'birthday 年龄' },
  { category: '个人信息', icon: 'fa fa-mars', name: '性别/男', tag: 'gender 男 male' },
  { category: '个人信息', icon: 'fa fa-venus', name: '性别/女', tag: 'gender 女 female' },
  { category: '个人信息', icon: 'fa fa-tag', name: '属性标签', tag: 'tag 标签 状态' },
  { category: '个人信息', icon: 'fa fa-bookmark', name: '个人书签', tag: 'bookmark 标记' },

  // 3. 教育与职场
  { category: '教育职场', icon: 'fa fa-graduation-cap', name: '学历学位', tag: 'edu 毕业 大学 研究生' },
  { category: '教育职场', icon: 'fa fa-university', name: '毕业院校', tag: 'school 大学 学院' },
  { category: '教育职场', icon: 'fa fa-book', name: '专业学科', tag: 'book 书本 知识' },
  { category: '教育职场', icon: 'fa fa-briefcase', name: '工作经历', tag: 'work 职位 公司 公文包' },
  { category: '教育职场', icon: 'fa fa-building', name: '任职企业', tag: 'company 机构 集团' },
  { category: '教育职场', icon: 'fa fa-certificate', name: '专业认证', tag: 'cert 软考 证书 等级' },
  { category: '教育职场', icon: 'fa fa-clock-o', name: '工作年限', tag: 'time 经验 考勤' },
  { category: '教育职场', icon: 'fa fa-file-text-o', name: '简历报告', tag: 'doc 文档 简历' },

  // 4. 技术与代码
  { category: '技术研发', icon: 'fa fa-code', name: '代码开发', tag: 'code 编程 开发 技术' },
  { category: '技术研发', icon: 'fa fa-terminal', name: '命令行', tag: 'terminal 控制台 shell' },
  { category: '技术研发', icon: 'fa fa-desktop', name: '前端展示', tag: 'desktop 电脑 屏幕 web' },
  { category: '技术研发', icon: 'fa fa-laptop', name: '研发设备', tag: 'laptop 笔记本' },
  { category: '技术研发', icon: 'fa fa-server', name: '后端服务', tag: 'server 服务器 架构' },
  { category: '技术研发', icon: 'fa fa-database', name: '数据库', tag: 'db 存储 sql' },
  { category: '技术研发', icon: 'fa fa-cubes', name: '组件模块', tag: 'cubes 微服务 架构' },
  { category: '技术研发', icon: 'fa fa-cogs', name: '系统工程', tag: 'cogs 齿轮 配置 构建' },
  { category: '技术研发', icon: 'fa fa-cloud', name: '云原生', tag: 'cloud 云计算 oss' },
  { category: '技术研发', icon: 'fa fa-bug', name: '缺陷修复', tag: 'bug 测试 调优' },

  // 5. 荣誉成果
  { category: '荣誉成果', icon: 'fa fa-trophy', name: '竞赛获奖', tag: 'trophy 奖项 荣誉 一等奖' },
  { category: '荣誉成果', icon: 'fa fa-star', name: '核心亮点', tag: 'star 收藏 重点' },
  { category: '荣誉成果', icon: 'fa fa-thumbs-o-up', name: '业务好评', tag: 'like 点赞 认可' },
  { category: '荣誉成果', icon: 'fa fa-paper-plane', name: '项目目标', tag: 'plane 目标 发起' },
  { category: '荣誉成果', icon: 'fa fa-flag', name: '里程碑', tag: 'flag 产出 旗帜' },
  { category: '荣誉成果', icon: 'fa fa-heart', name: '个人热爱', tag: 'heart 兴趣 特长' },
  { category: '荣誉成果', icon: 'fa fa-check-circle', name: '验收交付', tag: 'check 成功 达成' },
  { category: '荣誉成果', icon: 'fa fa-qrcode', name: '二维码', tag: 'qrcode 移动端 扫码' }
];

// 品牌官方 Logo 库（统一单色标志，前台自动染成简历主题色）
// 数据源均经逐一联网验证可用；simple-icons = 单色轮廓（可随主题染色），dashboard-icons = 品牌缺失时的补充
const SI_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@16/icons/';
const ICON_BASE = '/assets/images/icons/';

const BRAND_LOGOS = [
  // 1. 材料仿真与科研计算（重点新增置顶！）
  { name: 'VASP', url: ICON_BASE + 'vasp.svg', tag: 'vasp 第一性原理 dft 材料计算 维也纳 仿真' },
  { name: 'CP2K', url: ICON_BASE + 'cp2k.svg', tag: 'cp2k 分子动力学 量子化学 催化模拟 仿真' },
  { name: 'LAMMPS', url: ICON_BASE + 'lammps.svg', tag: 'lammps 分子动力学 大规模并行 md 模拟' },
  { name: 'OriginLab', url: ICON_BASE + 'origin.svg', tag: 'origin originlab 科学绘图 数据拟合 谱图' },
  { name: 'MATLAB', url: ICON_BASE + 'matlab.svg', tag: 'matlab 数学建模 仿真 矩阵 计算' },
  { name: 'AutoCAD', url: ICON_BASE + 'autocad.svg', tag: 'autocad cad 工程制图 机械设计' },
  { name: 'SolidWorks', url: ICON_BASE + 'solidworks.svg', tag: 'solidworks 三维建模 机械结构 机构' },
  { name: 'ANSYS', url: ICON_BASE + 'ansys.svg', tag: 'ansys 有限元 仿真 结构受力' },

  // 2. AI 大模型与智能体开发（全部官方彩色）
  { name: 'DeepSeek', url: ICON_BASE + 'deepseek.svg', tag: 'deepseek 深度求索 ai 大模型' },
  { name: 'Claude', url: ICON_BASE + 'claude.svg', tag: 'claude anthropic ai 大模型' },
  { name: 'Anthropic', url: ICON_BASE + 'anthropic.svg', tag: 'anthropic ai' },
  { name: 'OpenAI / ChatGPT', url: ICON_BASE + 'openai.svg', tag: 'openai chatgpt gpt-4 ai' },
  { name: 'Codex', url: ICON_BASE + 'codex.svg', tag: 'codex openai ai 编程' },
  { name: 'GitHub Copilot', url: ICON_BASE + 'githubcopilot.svg', tag: 'copilot ai 编程' },
  { name: 'Cursor', url: ICON_BASE + 'cursor.svg', tag: 'cursor ai 编辑器 ide' },
  { name: 'Perplexity', url: ICON_BASE + 'perplexity.svg', tag: 'perplexity ai 搜索' },
  { name: 'Qwen 通义千问', url: ICON_BASE + 'qwen.svg', tag: 'qwen 通义千问 阿里 ai' },
  { name: 'Kimi', url: ICON_BASE + 'kimi.svg', tag: 'kimi 月之暗面 ai' },
  { name: 'Hugging Face', url: ICON_BASE + 'huggingface.svg', tag: 'huggingface 开源模型 ai' },
  { name: 'Mistral AI', url: ICON_BASE + 'mistralai.svg', tag: 'mistral ai' },

  // 3. 编程语言与数据科学
  { name: 'Python', url: ICON_BASE + 'python.svg', tag: 'python 科学计算 爬虫 数据分析 脚本' },
  { name: 'JavaScript', url: ICON_BASE + 'javascript.svg', tag: 'js javascript 脚本 前端' },
  { name: 'TypeScript', url: ICON_BASE + 'typescript.svg', tag: 'ts typescript 前端' },
  { name: 'Vue.js', url: ICON_BASE + 'vuejs.svg', tag: 'vue vuejs 前端框架' },
  { name: 'React', url: ICON_BASE + 'react.svg', tag: 'react 前端框架' },
  { name: 'Node.js', url: ICON_BASE + 'nodejs.svg', tag: 'node nodejs 服务端 后端' },
  { name: 'C 语言', url: ICON_BASE + 'c.svg', tag: 'c 语言 嵌入式' },
  { name: 'C++', url: ICON_BASE + 'cplusplus.svg', tag: 'cpp c++ 算法' },
  { name: 'C#/.NET', url: ICON_BASE + 'csharp.svg', tag: 'csharp dotnet c#' },
  { name: 'Java', url: ICON_BASE + 'java.svg', tag: 'java jdk 后端' },
  { name: 'Go', url: ICON_BASE + 'go.svg', tag: 'go golang 后端' },
  { name: 'Rust', url: ICON_BASE + 'rust.svg', tag: 'rust 系统编程' },
  { name: 'PHP', url: ICON_BASE + 'php.svg', tag: 'php 后端' },
  { name: 'Swift', url: ICON_BASE + 'swift.svg', tag: 'swift ios' },
  { name: 'HTML5', url: ICON_BASE + 'html5.svg', tag: 'html 网页' },
  { name: 'CSS3', url: ICON_BASE + 'css3.svg', tag: 'css 样式' },
  { name: 'Sass', url: ICON_BASE + 'sass.svg', tag: 'sass scss 样式' },
  { name: 'Tailwind CSS', url: ICON_BASE + 'tailwindcss.svg', tag: 'tailwind 样式' },
  { name: 'Vite', url: ICON_BASE + 'vite.svg', tag: 'vite 构建工具' },
  { name: 'Webpack', url: ICON_BASE + 'webpack.svg', tag: 'webpack 构建工具' },
  { name: 'PyTorch', url: ICON_BASE + 'pytorch.svg', tag: 'pytorch 深度学习 ai 神经网络' },
  { name: 'TensorFlow', url: ICON_BASE + 'tensorflow.svg', tag: 'tf 深度学习 ai' },
  { name: 'NumPy', url: ICON_BASE + 'numpy.svg', tag: 'numpy 数值计算 矩阵' },
  { name: 'Pandas', url: ICON_BASE + 'pandas.svg', tag: 'pandas 数据分析 数据清洗' },
  { name: 'Jupyter', url: ICON_BASE + 'jupyter.svg', tag: 'jupyter notebook 数据科学' },
  { name: 'Linux', url: ICON_BASE + 'linux.svg', tag: 'linux 系统 集群 运维' },
  { name: 'Ubuntu', url: ICON_BASE + 'ubuntu.svg', tag: 'ubuntu 系统 linux' },
  { name: 'Docker', url: ICON_BASE + 'docker.svg', tag: 'docker 容器 镜像' },
  { name: 'Kubernetes', url: ICON_BASE + 'kubernetes.svg', tag: 'k8s 容器编排 集群' },
  { name: 'Git', url: ICON_BASE + 'git.svg', tag: 'git 版本控制' },
  { name: 'GitHub', url: ICON_BASE + 'github.svg', tag: 'github 开源托管' },
  { name: 'GitLab', url: ICON_BASE + 'gitlab.svg', tag: 'gitlab 代码托管' },
  { name: 'VS Code', url: ICON_BASE + 'vscode.svg', tag: 'vscode 编辑器 ide' },
  { name: 'MySQL', url: ICON_BASE + 'mysql.svg', tag: 'mysql 关系型数据库' },
  { name: 'PostgreSQL', url: ICON_BASE + 'postgresql.svg', tag: 'postgres pg 数据库' },
  { name: 'MongoDB', url: ICON_BASE + 'mongodb.svg', tag: 'mongo 文档数据库' },
  { name: 'Redis', url: ICON_BASE + 'redis.svg', tag: 'redis 缓存 nosql' },
  { name: 'Excel', url: ICON_BASE + 'excel.svg', tag: 'excel 表格 office 数据透视 台账' },
  { name: 'Word', url: ICON_BASE + 'word.svg', tag: 'word 文档 office 报告' },
  { name: 'PowerPoint', url: ICON_BASE + 'powerpoint.svg', tag: 'ppt 演示 office 汇报' }
];

// 生成品牌 Logo 地址（统一单色 SVG，前台自动染主题色）
function brandLogoUrl(item) {
  return item.url;
}

// 判断一个值是否是 Logo 图片地址（而非字体图标类名）
function looksLikeLogoUrl(val) {
  if (!val) return false;
  const v = String(val).trim();
  return /^(https?:)?\/\//i.test(v) || v.startsWith('/uploads/') || v.startsWith('/assets/') || v.startsWith('assets/') || v.startsWith('data:') || /\.(png|jpe?g|gif|svg|webp|ico)(\?.*)?$/i.test(v);
}

// 工具函数：弹出提示
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';
  if (type === 'info') icon = 'info-circle';
  toast.innerHTML = `<i class="fa fa-${icon}"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 动态载入阿里 Iconfont 样式
function applyIconfontStylesheet(url) {
  if (!url) return;
  let link = document.getElementById('dynamic-iconfont-css');
  if (!link) {
    link = document.createElement('link');
    link.id = 'dynamic-iconfont-css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = url;
}

// 渲染实时无代码高亮预览
function renderVisualPreview(str) {
  if (!str) return '<span style="color:#94a3b8;">（暂无输入内容）</span>';
  return escapeHtml(str)
    .replace(/==(.*?)==/g, '<mark>$1</mark>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/&lt;mark&gt;(.*?)&lt;\/mark&gt;/gi, '<mark>$1</mark>')
    .replace(/&lt;b&gt;(.*?)&lt;\/b&gt;/gi, '<b>$1</b>')
    .replace(/\r?\n/g, '<br/>'); // 保留手动换行，实时预览与前台一致
}

// 附加可视化快捷操作工具条
function attachVisualToolbar(fieldEl) {
  if (!fieldEl || fieldEl._hasVisualToolbar) return;
  fieldEl._hasVisualToolbar = true;

  const toolbar = document.createElement('div');
  toolbar.className = 'visual-toolbar';
  toolbar.innerHTML = `
    <button type="button" class="visual-tool-btn btn-tool-hl" title="用鼠标选中文本后点击高亮"><i class="fa fa-pencil"></i> 💡 高亮选中文本</button>
    <button type="button" class="visual-tool-btn btn-tool-bold" title="用鼠标选中文本后点击加粗"><i class="fa fa-bold"></i> 加粗</button>
    <button type="button" class="visual-tool-btn btn-tool-clear" title="清除选中区域格式"><i class="fa fa-eraser"></i> 清除格式</button>
    <span class="visual-tool-hint"><i class="fa fa-info-circle"></i> 鼠标选中字词点击高亮，无需手写代码</span>
  `;

  const previewBox = document.createElement('div');
  previewBox.className = 'visual-preview-hint';
  previewBox.innerHTML = '<b>实时排版效果：</b>' + renderVisualPreview(fieldEl.value);

  function syncPreview() {
    previewBox.innerHTML = '<b>实时排版效果：</b>' + renderVisualPreview(fieldEl.value);
  }

  fieldEl.addEventListener('input', syncPreview);

  toolbar.querySelector('.btn-tool-hl').addEventListener('click', (e) => {
    e.preventDefault();
    wrapSelection(fieldEl, '==', '==');
    syncPreview();
  });

  toolbar.querySelector('.btn-tool-bold').addEventListener('click', (e) => {
    e.preventDefault();
    wrapSelection(fieldEl, '**', '**');
    syncPreview();
  });

  toolbar.querySelector('.btn-tool-clear').addEventListener('click', (e) => {
    e.preventDefault();
    clearFormat(fieldEl);
    syncPreview();
  });

  fieldEl.parentNode.insertBefore(toolbar, fieldEl);
  fieldEl.parentNode.insertBefore(previewBox, fieldEl.nextSibling);
}

function wrapSelection(input, openTag, closeTag) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const val = input.value;
  if (start === end) {
    showToast('请先用鼠标在输入框中选中需要重点高亮的字词', 'info');
    input.focus();
    return;
  }
  const selected = val.substring(start, end);
  const unwrapped = selected.replace(/^==|==$|^\*\*|\*\*$/g, '');
  const replaced = openTag + unwrapped + closeTag;
  input.value = val.substring(0, start) + replaced + val.substring(end);
  input.selectionStart = start;
  input.selectionEnd = start + replaced.length;
  input.focus();
  input.dispatchEvent(new Event('input'));
}

function clearFormat(input) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const val = input.value;
  if (start === end) {
    input.value = val.replace(/==([^=]+)==/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/<\/?(mark|b|strong)>/gi, '');
  } else {
    const selected = val.substring(start, end);
    const cleaned = selected.replace(/==([^=]+)==/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/<\/?(mark|b|strong)>/gi, '');
    input.value = val.substring(0, start) + cleaned + val.substring(end);
  }
  input.focus();
  input.dispatchEvent(new Event('input'));
}

// 初始化可视化图标选择器模态窗
let currentIconSelectCallback = null;

function initIconPicker() {
  const modal = document.getElementById('icon-picker-modal');
  if (!modal) return;
  const closeBtn = document.getElementById('btn-close-icon-picker');
  const searchInput = document.getElementById('input-search-icon');
  const categoriesBar = document.getElementById('icon-categories-bar');
  const grid = document.getElementById('icon-picker-grid');

  let activeCat = 'all';

  function renderIcons() {
    const keyword = searchInput.value.trim().toLowerCase();
    grid.innerHTML = '';

    // 品牌 Logo 库（彩色官方标志，点击直接选用）
    if (activeCat === '品牌Logo') {
      const filtered = BRAND_LOGOS.filter(item => {
        return !keyword ||
          (item.name && item.name.toLowerCase().includes(keyword)) ||
          (item.tag && item.tag.toLowerCase().includes(keyword));
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 24px 30px;">未找到该品牌，可切换到【上传图片】上传官方 Logo</div>';
        return;
      }

      filtered.forEach(item => {
        const el = document.createElement('div');
        el.className = 'icon-grid-item brand-logo-item';
        el.title = `${item.name}（官方品牌 Logo）`;
        const url = brandLogoUrl(item);
        el.innerHTML = `
          <span class="brand-logo-thumb"><img src="${url}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.parentNode.innerHTML='<i class=\\'fa fa-image\\' style=\\'color:#cbd5e1\\'></i>'"></span>
          <span class="icon-label">${escapeHtml(item.name)}</span>
        `;
        el.addEventListener('click', () => {
          if (currentIconSelectCallback) {
            currentIconSelectCallback(url);
          }
          closeModal();
        });
        grid.appendChild(el);
      });

      // 底部提示：没有的品牌可上传图片
      const tip = document.createElement('div');
      tip.style.cssText = 'grid-column: 1 / -1; padding: 10px 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 12px; color: #92400e; line-height: 1.6;';
      tip.innerHTML = '<i class="fa fa-lightbulb-o"></i> 库中没有的品牌（如 DeepSeek、Claude、Codex、SolidWorks、ANSYS 等），请切换到【上传图片】上传官方 Logo 图片即可，效果完全相同。';
      grid.appendChild(tip);
      return;
    }

    // 上传本地 Logo 图片
    if (activeCat === '上传图片') {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="font-size: 13.5px; margin-bottom: 6px; color: #0f172a;"><i class="fa fa-upload"></i> 上传品牌 Logo 图片</h4>
          <p style="font-size: 12px; color: #64748b; margin-bottom: 12px; line-height: 1.6;">
            适合库中没有的品牌（如 <b>DeepSeek、Claude Code、Codex、SolidWorks、ANSYS、ABAQUS、COMSOL</b> 等）。<br>
            建议使用<strong>正方形、透明底 PNG/SVG</strong> 官方 Logo，上传后自动保存在本服务器并直接选用。
          </p>
          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <label class="btn btn-primary" style="cursor: pointer; margin: 0;">
              <i class="fa fa-folder-open-o"></i> 选择 Logo 图片上传
              <input type="file" id="input-brand-logo-file" accept="image/*" style="display: none;">
            </label>
            <span id="brand-logo-upload-status" style="font-size: 12px; color: #64748b;"></span>
          </div>
        </div>
      `;
      const fileInput = document.getElementById('input-brand-logo-file');
      const statusEl = document.getElementById('brand-logo-upload-status');
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          return showToast('请选择有效的图片文件', 'error');
        }
        statusEl.textContent = '正在处理...';
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const result = await STATIC_API.uploadImage(file.name, reader.result);
            if (result.success) {
              statusEl.innerHTML = '<span style="color:#10b981;">设置成功，已自动选用 ✓</span>';
              showToast('Logo 设置成功');
              if (currentIconSelectCallback) {
                currentIconSelectCallback(result.url);
              }
              setTimeout(closeModal, 400);
            } else {
              statusEl.textContent = '上传失败: ' + (result.error || '');
              showToast('上传失败: ' + result.error, 'error');
            }
          } catch (err) {
            statusEl.textContent = '网络错误: ' + err.message;
            showToast('网络错误: ' + err.message, 'error');
          }
        };
        reader.readAsDataURL(file);
      });
      return;
    }

    if (activeCat === '自定义') {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 14px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="font-size: 13.5px; margin-bottom: 6px; color: #0f172a;"><i class="fa fa-info-circle text-primary"></i> 阿里 Iconfont 自定义类名选用</h4>
          <p style="font-size: 12px; color: #64748b; margin-bottom: 12px; line-height: 1.5;">
            若您在【布局与外观】中配置了阿里 Iconfont 链接，可直接输入阿里图标的类名（例如 <code>iconfont icon-weixin</code> 或 <code>iconfont icon-github</code>，亦支持任何自定义 FontAwesome 类名）：
          </p>
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="text" id="input-custom-icon-class" class="form-control" placeholder="输入图标类名，如：iconfont icon-weixin" style="flex: 1;">
            <button type="button" class="btn btn-primary" id="btn-apply-custom-icon"><i class="fa fa-check"></i> 选用该图标</button>
          </div>
        </div>
      `;
      document.getElementById('btn-apply-custom-icon').addEventListener('click', () => {
        const val = document.getElementById('input-custom-icon-class').value.trim();
        if (!val) return showToast('请输入图标类名', 'error');
        if (currentIconSelectCallback) {
          currentIconSelectCallback(val);
        }
        closeModal();
      });
      return;
    }

    const filtered = ICON_LIBRARY.filter(item => {
      const matchCat = activeCat === 'all' || item.category === activeCat;
      const matchKeyword = !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.tag.toLowerCase().includes(keyword) ||
        item.icon.toLowerCase().includes(keyword);
      return matchCat && matchKeyword;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 30px;">未找到匹配图标，可切换分类或在【阿里Iconfont/自定义】输入类名</div>';
      return;
    }

    filtered.forEach(item => {
      const el = document.createElement('div');
      el.className = 'icon-grid-item';
      el.title = `${item.name} (${item.icon})`;
      el.innerHTML = `
        <i class="${escapeHtml(item.icon)}"></i>
        <span class="icon-label">${escapeHtml(item.name)}</span>
      `;
      el.addEventListener('click', () => {
        if (currentIconSelectCallback) {
          currentIconSelectCallback(item.icon);
        }
        closeModal();
      });
      grid.appendChild(el);
    });

    // 搜索无匹配或想自定义时，始终在底部提供手动添加入口
    const customEntry = document.createElement('div');
    customEntry.className = 'icon-grid-item';
    customEntry.style.cssText = 'border-style: dashed; color: #64748b;';
    customEntry.title = '手动输入图标类名 (支持阿里 Iconfont / FontAwesome)';
    customEntry.innerHTML = `
      <i class="fa fa-hand-pointer-o" style="color:#64748b;"></i>
      <span class="icon-label">手动添加图标</span>
    `;
    customEntry.addEventListener('click', () => {
      // 切换到自定义面板
      categoriesBar.querySelectorAll('.cat-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-cat') === '自定义'));
      activeCat = '自定义';
      if (keyword) searchInput.value = '';
      renderIcons();
    });
    grid.appendChild(customEntry);
  }

  function closeModal() {
    modal.classList.remove('open');
    currentIconSelectCallback = null;
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  searchInput.addEventListener('input', renderIcons);

  categoriesBar.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      categoriesBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCat = pill.getAttribute('data-cat');
      renderIcons();
    });
  });

  window.openIconPickerModal = function (callback, currentIcon) {
    currentIconSelectCallback = callback;
    searchInput.value = '';
    activeCat = '品牌Logo';
    categoriesBar.querySelectorAll('.cat-pill').forEach((p, idx) => p.classList.toggle('active', idx === 0));
    renderIcons();
    modal.classList.add('open');
    searchInput.focus();
  };
}

function openIconPicker(callback, currentIcon) {
  if (window.openIconPickerModal) {
    window.openIconPickerModal(callback, currentIcon);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initColorPresets();
  initLayoutEvents();
  initUploads();
  initActionButtons();
  initKeyboardShortcuts();
  initIconPicker();
  initImportResume();
  initHomepageEvents();
  initPresetResumes();
  fetchResumeData();
  fetchHomepageData();
});

// 初始化标签页切换
function initTabs() {
  const menuItems = document.querySelectorAll('.sidebar-menu li');
  const panels = document.querySelectorAll('.tab-panel');
  const titleEl = document.getElementById('current-tab-title');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const targetId = item.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      const text = item.querySelector('span').textContent;
      titleEl.textContent = text + '设置';
    });
  });
}

// 初始化版式布局单选卡片
function initLayoutEvents() {
  const cardTwo = document.getElementById('card-layout-two');
  const cardOne = document.getElementById('card-layout-one');
  const radioTwo = document.getElementById('radio-two-column');
  const radioOne = document.getElementById('radio-one-column');

  function updateLayoutCardUI(value) {
    if (value === 'two-column') {
      cardTwo.classList.add('selected');
      cardOne.classList.remove('selected');
      radioTwo.checked = true;
      document.getElementById('side-fixed-control').style.opacity = '1';
      document.getElementById('side-fixed-control').style.pointerEvents = 'auto';
    } else {
      cardOne.classList.add('selected');
      cardTwo.classList.remove('selected');
      radioOne.checked = true;
      document.getElementById('side-fixed-control').style.opacity = '0.5';
      document.getElementById('side-fixed-control').style.pointerEvents = 'none';
    }
  }

  cardTwo.addEventListener('click', () => updateLayoutCardUI('two-column'));
  cardOne.addEventListener('click', () => updateLayoutCardUI('one-column'));
  radioTwo.addEventListener('change', () => updateLayoutCardUI('two-column'));
  radioOne.addEventListener('change', () => updateLayoutCardUI('one-column'));

  // 简历模板选择
  const templateCards = document.querySelectorAll('#template-selector .template-card');
  templateCards.forEach(tc => {
    tc.addEventListener('click', () => {
      templateCards.forEach(c => c.classList.remove('selected'));
      tc.classList.add('selected');
    });
  });

  // 模板流派分类过滤
  const filterPills = document.querySelectorAll('#template-filter-pills .cat-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.getAttribute('data-filter');
      templateCards.forEach(tc => {
        const group = tc.getAttribute('data-group') || 'all';
        if (filter === 'all' || group === filter) {
          tc.style.display = '';
        } else {
          tc.style.display = 'none';
        }
      });
    });
  });
}

// 同步模板选择 UI
function syncTemplateSelector(template) {
  document.querySelectorAll('#template-selector .template-card').forEach(c => {
    c.classList.toggle('selected', c.getAttribute('data-template') === template);
  });
}

// 初始化色彩选择
function initColorPresets() {
  const dots = document.querySelectorAll('.color-dot');
  const picker = document.getElementById('field-theme-color-picker');
  const hexDisplay = document.getElementById('custom-color-hex');

  function setColor(color) {
    picker.value = color;
    hexDisplay.textContent = color;
    dots.forEach(d => {
      if (d.getAttribute('data-color').toLowerCase() === color.toLowerCase()) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
    document.documentElement.style.setProperty('--admin-primary', color);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      setColor(dot.getAttribute('data-color'));
    });
  });

  picker.addEventListener('input', (e) => {
    setColor(e.target.value);
  });
}

// 初始化上传功能
function initUploads() {
  // 头像上传
  const avatarFileInput = document.getElementById('input-avatar-file');
  const avatarTextInput = document.getElementById('field-basic-avatar');
  const avatarImg = document.getElementById('avatar-preview-img');

  avatarTextInput.addEventListener('input', () => {
    avatarImg.src = avatarTextInput.value || '../assets/images/avatar.jpg';
  });

  avatarFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return showToast('请选择有效的图片文件', 'error');
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        showToast('正在处理图片...', 'info');
        const result = await STATIC_API.uploadImage(file.name, reader.result);
        if (result.success) {
          avatarTextInput.value = result.url;
          avatarImg.src = result.url;
          showToast('头像设置成功（已保留原图完整形状）');
        } else {
          showToast('上传失败: ' + result.error, 'error');
        }
      } catch (err) {
        showToast('处理失败: ' + err.message, 'error');
      }
    };
    reader.readAsDataURL(file);
  });

  // 二维码上传
  const qrFileInput = document.getElementById('input-qr-file');
  const qrTextInput = document.getElementById('field-qr-image');
  const qrImg = document.getElementById('qr-preview-img');

  qrTextInput.addEventListener('input', () => {
    qrImg.src = qrTextInput.value || '';
  });

  qrFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        showToast('正在处理二维码...', 'info');
        const result = await STATIC_API.uploadImage(file.name, reader.result);
        if (result.success) {
          qrTextInput.value = result.url;
          qrImg.src = result.url;
          showToast('二维码设置成功');
        } else {
          showToast('上传失败: ' + result.error, 'error');
        }
      } catch (err) {
        showToast('处理失败: ' + err.message, 'error');
      }
    };
    reader.readAsDataURL(file);
  });
}

// 初始化全局按钮操作
function initActionButtons() {
  document.getElementById('btn-save-all').addEventListener('click', saveResumeData);

  // 实时预览抽屉
  const previewDrawer = document.getElementById('preview-drawer');
  const previewBackdrop = document.getElementById('preview-backdrop');
  const previewFrame = document.getElementById('preview-frame');
  const openPreviewBtn = document.getElementById('btn-open-preview');
  const closePreviewBtn = document.getElementById('btn-close-preview');
  const refreshPreviewBtn = document.getElementById('btn-refresh-preview');

  function openPreview() {
    previewFrame.src = '/?preview=' + Date.now();
    previewDrawer.classList.add('open');
    previewBackdrop.classList.add('open');
  }

  function closePreview() {
    previewDrawer.classList.remove('open');
    previewBackdrop.classList.remove('open');
  }

  openPreviewBtn.addEventListener('click', openPreview);
  closePreviewBtn.addEventListener('click', closePreview);
  previewBackdrop.addEventListener('click', closePreview);
  refreshPreviewBtn.addEventListener('click', () => {
    previewFrame.src = '/?preview=' + Date.now();
  });

  // 导出 JSON（静态模式下用浏览器下载，命名为 data.json 便于直接替换上传）
  document.getElementById('btn-export-json').addEventListener('click', async () => {
    const useApi = await STATIC_API.probeApi();
    if (useApi) {
      window.location.href = '/api/export';
    } else {
      // 静态模式：导出当前表单数据为 data.json
      const data = currentData || collectCurrentForm();
      STATIC_API.downloadJson(data, 'data.json');
      showToast('已导出 data.json，替换静态站点中的同名文件即可永久生效');
    }
  });

  // 导入 JSON
  const importInput = document.getElementById('input-import-json');
  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (imported && imported.settings && imported.basic) {
          currentData = imported;
          populateForm(currentData);
          showToast('JSON 配置导入成功，请点击“保存所有内容”持久化');
        } else {
          showToast('文件格式不符合简历数据规范', 'error');
        }
      } catch (err) {
        showToast('解析 JSON 文件失败: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    importInput.value = '';
  });

  // 重置默认
  document.getElementById('btn-reset-data').addEventListener('click', async () => {
    if (!confirm('确定要重置为初始默认数据吗？当前未导出的修改将被覆盖！')) return;
    try {
      const result = await STATIC_API.resetResume();
      if (result.success) {
        showToast(result.message || '已重置为默认数据');
        fetchResumeData();
      } else {
        showToast('重置失败: ' + result.error, 'error');
      }
    } catch (err) {
      showToast('重置失败: ' + err.message, 'error');
    }
  });

  // 绑定动态列表添加按钮
  document.getElementById('btn-add-profile').addEventListener('click', () => {
    addProfileItem({ label: '新属性', value: '内容说明' });
  });

  document.getElementById('btn-add-contact').addEventListener('click', () => {
    addContactItem({ label: '微信', value: 'my_wechat', link: '', icon: 'fa fa-weixin' });
  });

  document.getElementById('btn-add-skill').addEventListener('click', () => {
    addSkillItem({ name: '新技术栈', level: 80, icon: '', logo: '' });
  });

  document.getElementById('btn-add-edu').addEventListener('click', () => {
    addEduItem({ school: '某大学', college: '某学院', major: '某专业（本科）', time: '2020.9 - 2024.7', description: '经历描述...' });
  });

  document.getElementById('btn-add-work').addEventListener('click', () => {
    addWorkItem({ company: '某科技公司', role: '岗位名称', time: '2022.X 至今', points: ['工作亮点与产出1', '工作要点2'] });
  });

  document.getElementById('btn-add-project').addEventListener('click', () => {
    addProjectItem({
      name: '某核心项目名称',
      link: 'https://',
      time: '2023.X - 2023.X',
      stack: '技术栈列表',
      target: '项目目标与背景',
      team: '团队规模与角色',
      contribution: '个人主要贡献与技术突破',
      effect: '业务指标提升与成果'
    });
  });

  // 监听阿里 Iconfont 链接变动实时加载
  const iconfontUrlInput = document.getElementById('field-iconfont-url');
  if (iconfontUrlInput) {
    iconfontUrlInput.addEventListener('change', (e) => {
      applyIconfontStylesheet(e.target.value.trim());
    });
  }
}

// 快捷键 Ctrl+S 保存
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveResumeData();
    }
  });
}

// 从后端获取简历数据（自动兼容：有服务器走 API，纯静态走本地文件 + 浏览器存储）
async function fetchResumeData() {
  try {
    const result = await STATIC_API.loadResume();
    if (result.success && result.data) {
      currentData = result.data;
      populateForm(currentData);
    } else {
      showToast('获取数据失败: ' + (result.error || '未知错误'), 'error');
    }
  } catch (err) {
    showToast('无法加载简历数据: ' + err.message, 'error');
  }
}

// 填充表单数据
function populateForm(data) {
  if (!data) return;

  // 1. 设置与外观
  const s = data.settings || {};
  const isTwo = s.layout !== 'one-column';
  document.getElementById('radio-two-column').checked = isTwo;
  document.getElementById('radio-one-column').checked = !isTwo;
  document.getElementById('card-layout-two').classList.toggle('selected', isTwo);
  document.getElementById('card-layout-one').classList.toggle('selected', !isTwo);
  document.getElementById('field-side-fixed').checked = !!s.sideFixed;

  // 基本信息排在头像右侧空白开关
  document.getElementById('field-header-side-by-side').checked = s.headerSideBySide !== false;

  // 简历模板选择
  syncTemplateSelector(s.template || 'classic');

  // 技能展示样式 (标签模式 vs 进度条模式)
  if (s.skillMode === 'bars') {
    document.getElementById('skill-mode-bars').checked = true;
  } else {
    document.getElementById('skill-mode-tags').checked = true;
  }

  // 阿里 Iconfont 链接
  const iconfontUrl = s.iconfontUrl || '';
  const iconfontField = document.getElementById('field-iconfont-url');
  if (iconfontField) {
    iconfontField.value = iconfontUrl;
    applyIconfontStylesheet(iconfontUrl);
  }

  const color = s.themeColor || '#1abc9c';
  document.getElementById('field-theme-color-picker').value = color;
  document.getElementById('custom-color-hex').textContent = color;
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.classList.toggle('active', dot.getAttribute('data-color').toLowerCase() === color.toLowerCase());
  });

  document.getElementById('field-page-title').value = s.title || '';
  document.getElementById('field-page-copyright').value = s.copyright || '';

  document.getElementById('field-show-avatar').checked = s.showAvatar !== false;
  document.getElementById('field-show-qrcode').checked = s.showQrCode !== false;
  document.getElementById('field-show-skills').checked = s.showSkills !== false;
  document.getElementById('field-show-edu').checked = s.showEducation !== false;
  document.getElementById('field-show-work').checked = s.showWork !== false;
  document.getElementById('field-show-projects').checked = s.showProjects !== false;
  document.getElementById('field-show-eval').checked = s.showEvaluation !== false;

  // 2. 基本信息
  const b = data.basic || {};
  document.getElementById('field-basic-name').value = b.name || '';
  document.getElementById('field-basic-job').value = b.jobTitle || '';
  document.getElementById('field-basic-avatar').value = b.avatar || '';
  document.getElementById('field-basic-signature').value = b.signature || '';
  document.getElementById('avatar-preview-img').src = b.avatar || '../assets/images/avatar.jpg';

  // 3. 档案信息
  const profileContainer = document.getElementById('profile-list-container');
  profileContainer.innerHTML = '';
  (data.profile || []).forEach(item => addProfileItem(item));

  // 4. 联系方式
  const contactContainer = document.getElementById('contact-list-container');
  contactContainer.innerHTML = '';
  (data.contact || []).forEach(item => addContactItem(item));

  // 5. 技能特长
  const skillsContainer = document.getElementById('skills-list-container');
  skillsContainer.innerHTML = '';
  (data.skills || []).forEach(item => addSkillItem(item));

  // 6. 教育背景
  const eduContainer = document.getElementById('edu-list-container');
  eduContainer.innerHTML = '';
  (data.education || []).forEach(item => addEduItem(item));

  // 7. 工作经历
  const workContainer = document.getElementById('work-list-container');
  workContainer.innerHTML = '';
  (data.work || []).forEach(item => addWorkItem(item));

  // 8. 项目经验
  const projectsContainer = document.getElementById('projects-list-container');
  projectsContainer.innerHTML = '';
  (data.projects || []).forEach(item => addProjectItem(item));

  // 9. 自我评价
  const selfEvalInput = document.getElementById('field-self-eval');
  selfEvalInput.value = data.selfEvaluation || '';
  attachVisualToolbar(selfEvalInput);

  // 10. 二维码
  const q = data.qrcode || {};
  document.getElementById('field-qr-image').value = q.image || '';
  document.getElementById('field-qr-text').value = q.text || '';
  document.getElementById('qr-preview-img').src = q.image || '';

  // 11. 全部列表加载完毕后统一编号
  ['profile-list-container', 'contact-list-container', 'skills-list-container',
   'edu-list-container', 'work-list-container', 'projects-list-container'].forEach(id => {
    const el = document.getElementById(id);
    if (el) renumberCards(el);
  });
}

// 动态列表生成辅助函数
function addProfileItem(item = { label: '', value: '' }) {
  const container = document.getElementById('profile-list-container');
  const card = document.createElement('div');
  card.className = 'item-card';
  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-card-title"><i class="fa fa-tag"></i> <span>${escapeHtml(item.label || '档案属性')}</span></div>
      <div class="item-card-actions">
        <div class="card-order-box" title="显示顺序号：直接修改数字后回车即可调整位置">
          <button type="button" class="order-step order-step-up"><i class="fa fa-angle-up"></i></button>
          <input type="number" min="1" class="card-order-num" value="1">
          <button type="button" class="order-step order-step-down"><i class="fa fa-angle-down"></i></button>
        </div>
        <button type="button" class="icon-btn danger btn-remove" title="删除"><i class="fa fa-trash"></i></button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group" style="flex: 1;">
        <label>属性名称</label>
        <input type="text" class="form-control prop-label" value="${escapeHtml(item.label)}" placeholder="如：英语水平">
      </div>
      <div class="form-group" style="flex: 2;">
        <label>属性内容</label>
        <input type="text" class="form-control prop-value" value="${escapeHtml(item.value)}" placeholder="如：CET-6 / 580分">
      </div>
    </div>
  `;
  bindCardControls(card, container);
  container.appendChild(card);
}

function addContactItem(item = { label: '', value: '', link: '', icon: '' }) {
  const container = document.getElementById('contact-list-container');
  const card = document.createElement('div');
  card.className = 'item-card';
  const currentIcon = item.icon || 'fa fa-phone';

  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-card-title"><i class="${escapeHtml(currentIcon)}"></i> <span>${escapeHtml(item.label || '联系方式')}</span></div>
      <div class="item-card-actions">
        <div class="card-order-box" title="显示顺序号：直接修改数字后回车即可调整位置">
          <button type="button" class="order-step order-step-up"><i class="fa fa-angle-up"></i></button>
          <input type="number" min="1" class="card-order-num" value="1">
          <button type="button" class="order-step order-step-down"><i class="fa fa-angle-down"></i></button>
        </div>
        <button type="button" class="icon-btn danger btn-remove" title="删除"><i class="fa fa-trash"></i></button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group" style="flex: 1;">
        <label>类别名称</label>
        <input type="text" class="form-control contact-label" value="${escapeHtml(item.label)}" placeholder="如：手机 / 邮箱">
      </div>
      <div class="form-group" style="flex: 1.5;">
        <label>展示内容</label>
        <input type="text" class="form-control contact-value" value="${escapeHtml(item.value)}" placeholder="如：138-0000-0000">
      </div>
      <div class="form-group" style="flex: 1.2;">
        <label>图标样式 (点击在库中选)</label>
        <div class="icon-pick-trigger" title="点击打开可视化图标库直接点选">
          <span class="preview-badge"><i class="${escapeHtml(currentIcon)}"></i></span>
          <span class="icon-name-text">点我选图标</span>
          <input type="hidden" class="contact-icon" value="${escapeHtml(currentIcon)}">
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>点击跳转链接 (可选)</label>
      <input type="text" class="form-control contact-link" value="${escapeHtml(item.link || '')}" placeholder="如：tel:13800000000、mailto:xx@xx.com 或 https://">
    </div>
  `;

  const trigger = card.querySelector('.icon-pick-trigger');
  const previewBadge = card.querySelector('.preview-badge i');
  const titleIcon = card.querySelector('.item-card-title i');
  const hiddenInput = card.querySelector('.contact-icon');

  trigger.addEventListener('click', () => {
    openIconPicker((selectedIcon) => {
      hiddenInput.value = selectedIcon;
      previewBadge.className = selectedIcon;
      titleIcon.className = selectedIcon;
    }, hiddenInput.value);
  });

  bindCardControls(card, container);
  container.appendChild(card);
}

function addSkillItem(item = { name: '', level: 80, icon: '', logo: '' }) {
  const container = document.getElementById('skills-list-container');
  const card = document.createElement('div');
  card.className = 'item-card';
  // 兼容旧数据：icon 存的可能是 logo 地址
  const currentVal = item.logo || item.icon || '';
  const currentIsLogo = looksLikeLogoUrl(currentVal);

  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-card-title skill-title-wrap">
        ${currentIsLogo
          ? `<img class="skill-title-logo" src="${escapeHtml(currentVal)}" alt="" onerror="this.style.display='none'">`
          : (currentVal ? `<i class="${escapeHtml(currentVal)} skill-title-icon"></i>` : '')}
        <span>${escapeHtml(item.name || '技能项')}</span>
      </div>
      <div class="item-card-actions">
        <div class="card-order-box" title="显示顺序号：直接修改数字后回车即可调整位置">
          <button type="button" class="order-step order-step-up"><i class="fa fa-angle-up"></i></button>
          <input type="number" min="1" class="card-order-num" value="1">
          <button type="button" class="order-step order-step-down"><i class="fa fa-angle-down"></i></button>
        </div>
        <button type="button" class="icon-btn danger btn-remove" title="删除"><i class="fa fa-trash"></i></button>
      </div>
    </div>
    <div class="form-row" style="align-items: flex-start;">
      <div class="form-group" style="flex: 1.4; margin-bottom: 0;">
        <label>技能名称</label>
        <input type="text" class="form-control skill-name" value="${escapeHtml(item.name)}" placeholder="如：JavaScript / TypeScript">
      </div>
      <div class="form-group" style="flex: 1.4; margin-bottom: 0;">
        <label>技能图标 / 品牌 Logo</label>
        <div class="skill-icon-controls">
          <div class="icon-pick-trigger" title="点击打开选择库：品牌 Logo / 字体图标 / 上传图片">
            <span class="preview-badge">${renderIconPreview(currentVal, currentIsLogo)}</span>
            <span class="icon-name-text">${currentVal ? '更换' : '点我选'}</span>
            <input type="hidden" class="skill-icon" value="${escapeHtml(currentVal)}">
          </div>
        </div>
      </div>
      <div class="form-group" style="flex: 2; margin-bottom: 0;">
        <label>熟练度（进度条模式下生效）</label>
        <div class="skill-slider-row">
          <input type="range" class="skill-slider" min="10" max="100" value="${item.level || 80}">
          <span class="skill-value-badge">${item.level || 80}%</span>
        </div>
      </div>
    </div>
  `;

  const slider = card.querySelector('.skill-slider');
  const badge = card.querySelector('.skill-value-badge');
  slider.addEventListener('input', () => {
    badge.textContent = slider.value + '%';
  });

  const trigger = card.querySelector('.icon-pick-trigger');
  const previewBadge = card.querySelector('.preview-badge');
  const iconText = card.querySelector('.icon-name-text');
  const titleWrap = card.querySelector('.item-card-title.skill-title-wrap');
  const hiddenInput = card.querySelector('.skill-icon');

  // 更新预览与标题显示
  function applySelection(val) {
    hiddenInput.value = val;
    const isLogo = looksLikeLogoUrl(val);
    previewBadge.innerHTML = renderIconPreview(val, isLogo);
    iconText.textContent = val ? '更换' : '点我选';

    // 重建标题前缀（Logo 图片或字体图标）
    let prefix = titleWrap.querySelector('.skill-title-logo, .skill-title-icon');
    if (prefix) prefix.remove();
    if (!val) return;
    if (isLogo) {
      const img = document.createElement('img');
      img.className = 'skill-title-logo';
      img.src = val;
      img.alt = '';
      img.onerror = function () { this.style.display = 'none'; };
      titleWrap.insertBefore(img, titleWrap.querySelector('span'));
    } else {
      const iconEl = document.createElement('i');
      iconEl.className = 'skill-title-icon ' + val;
      titleWrap.insertBefore(iconEl, titleWrap.querySelector('span'));
    }
  }

  trigger.addEventListener('click', () => {
    openIconPicker((selected) => {
      applySelection(selected);
    }, hiddenInput.value);
  });

  // 移除图标按钮（无图标即不显示图标）
  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'icon-btn danger';
  clearBtn.title = '移除图标';
  clearBtn.style.fontSize = '11px';
  clearBtn.innerHTML = '<i class="fa fa-ban"></i>';
  clearBtn.addEventListener('click', () => {
    applySelection('');
  });
  card.querySelector('.item-card-actions').insertBefore(clearBtn, card.querySelector('.btn-remove'));

  bindCardControls(card, container);
  container.appendChild(card);
}

// 渲染技能图标预览框内容（Logo 图片或字体图标）
function renderIconPreview(val, isLogo) {
  if (!val) return '<i class="fa fa-plus" style="font-size:12px;"></i>';
  if (isLogo) {
    return `<img class="skill-logo-preview-img" src="${escapeHtml(val)}" alt="" onerror="this.style.display='none'">`;
  }
  return `<i class="${escapeHtml(val)}"></i>`;
}

function addEduItem(item = { school: '', college: '', major: '', time: '', description: '' }) {
  const container = document.getElementById('edu-list-container');
  const card = document.createElement('div');
  card.className = 'item-card';
  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-card-title"><i class="fa fa-graduation-cap"></i> <span>${escapeHtml(item.school || '教育经历')}</span></div>
      <div class="item-card-actions">
        <div class="card-order-box" title="显示顺序号：直接修改数字后回车即可调整位置">
          <button type="button" class="order-step order-step-up"><i class="fa fa-angle-up"></i></button>
          <input type="number" min="1" class="card-order-num" value="1">
          <button type="button" class="order-step order-step-down"><i class="fa fa-angle-down"></i></button>
        </div>
        <button type="button" class="icon-btn danger btn-remove" title="删除"><i class="fa fa-trash"></i></button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group" style="flex: 1.1;">
        <label>学校名称</label>
        <input type="text" class="form-control edu-school" value="${escapeHtml(item.school)}" placeholder="如：江西师范大学">
      </div>
      <div class="form-group" style="flex: 1.1;">
        <label>所属学院 / 院系（可选）</label>
        <input type="text" class="form-control edu-college" value="${escapeHtml(item.college || '')}" placeholder="如：化学与材料学院">
      </div>
      <div class="form-group" style="flex: 1.1;">
        <label>专业与学历</label>
        <input type="text" class="form-control edu-major" value="${escapeHtml(item.major)}" placeholder="如：材料科学与工程（硕士）">
      </div>
      <div class="form-group" style="flex: 1;">
        <label>起止时间</label>
        <input type="text" class="form-control edu-time" value="${escapeHtml(item.time)}" placeholder="如：2018.9 - 2021.7">
      </div>
    </div>
    <div class="form-group">
      <label>在校表现与荣誉（支持鼠标选中点击高亮）</label>
      <textarea class="form-control edu-desc" rows="2" placeholder="填写排名、论文、奖项等亮点...">${escapeHtml(item.description)}</textarea>
    </div>
  `;
  bindCardControls(card, container);
  container.appendChild(card);
  attachVisualToolbar(card.querySelector('.edu-desc'));
}

function addWorkItem(item = { company: '', role: '', time: '', points: [] }) {
  const container = document.getElementById('work-list-container');
  const card = document.createElement('div');
  card.className = 'item-card';
  const pointsText = Array.isArray(item.points) ? item.points.join('\n') : (item.points || '');

  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-card-title"><i class="fa fa-briefcase"></i> <span>${escapeHtml(item.company || '工作经历')}</span></div>
      <div class="item-card-actions">
        <div class="card-order-box" title="显示顺序号：直接修改数字后回车即可调整位置">
          <button type="button" class="order-step order-step-up"><i class="fa fa-angle-up"></i></button>
          <input type="number" min="1" class="card-order-num" value="1">
          <button type="button" class="order-step order-step-down"><i class="fa fa-angle-down"></i></button>
        </div>
        <button type="button" class="icon-btn danger btn-remove" title="删除"><i class="fa fa-trash"></i></button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group" style="flex: 1.5;">
        <label>公司 / 组织名称</label>
        <input type="text" class="form-control work-company" value="${escapeHtml(item.company)}" placeholder="如：某知名网络科技有限公司">
      </div>
      <div class="form-group" style="flex: 1.2;">
        <label>职位名称</label>
        <input type="text" class="form-control work-role" value="${escapeHtml(item.role)}" placeholder="如：资深前端开发工程师">
      </div>
      <div class="form-group" style="flex: 1;">
        <label>在职时间</label>
        <input type="text" class="form-control work-time" value="${escapeHtml(item.time)}" placeholder="如：2021.07 至今">
      </div>
    </div>
    <div class="form-group">
      <label>工作要点与核心职责（一行一条要点，支持选中文本一键高亮）</label>
      <textarea class="form-control work-points" rows="4" placeholder="每行输入一条工作职责或成果...">${escapeHtml(pointsText)}</textarea>
    </div>
  `;
  bindCardControls(card, container);
  container.appendChild(card);
  attachVisualToolbar(card.querySelector('.work-points'));
}

function addProjectItem(item = {}) {
  const container = document.getElementById('projects-list-container');
  const card = document.createElement('div');
  card.className = 'item-card';
  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-card-title"><i class="fa fa-cubes"></i> <span>${escapeHtml(item.name || '核心项目经验')}</span></div>
      <div class="item-card-actions">
        <div class="card-order-box" title="显示顺序号：直接修改数字后回车即可调整位置">
          <button type="button" class="order-step order-step-up"><i class="fa fa-angle-up"></i></button>
          <input type="number" min="1" class="card-order-num" value="1">
          <button type="button" class="order-step order-step-down"><i class="fa fa-angle-down"></i></button>
        </div>
        <button type="button" class="icon-btn danger btn-remove" title="删除"><i class="fa fa-trash"></i></button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group" style="flex: 1.5;">
        <label>项目名称</label>
        <input type="text" class="form-control proj-name" value="${escapeHtml(item.name || '')}" placeholder="如：企业级数据可视化大屏系统">
      </div>
      <div class="form-group" style="flex: 1.2;">
        <label>在线演示链接 Demo (可选)</label>
        <input type="text" class="form-control proj-link" value="${escapeHtml(item.link || '')}" placeholder="如：https://demo.example.com">
      </div>
      <div class="form-group" style="flex: 1;">
        <label>起止时间</label>
        <input type="text" class="form-control proj-time" value="${escapeHtml(item.time || '')}" placeholder="如：2022.03 - 2023.01">
      </div>
    </div>
    <div class="form-group">
      <label>技术栈 (Stack)</label>
      <input type="text" class="form-control proj-stack" value="${escapeHtml(item.stack || '')}" placeholder="如：Vue3 + TypeScript + Pinia + ECharts + Node.js">
    </div>
    <div class="form-row">
      <div class="form-group" style="flex: 1;">
        <label>项目目标 [目标]</label>
        <input type="text" class="form-control proj-target" value="${escapeHtml(item.target || '')}" placeholder="实现多类型医学数据的提交与共享">
      </div>
      <div class="form-group" style="flex: 1;">
        <label>团队与角色 [团队]</label>
        <input type="text" class="form-control proj-team" value="${escapeHtml(item.team || '')}" placeholder="担任前端负责人，与 2 位同学协同">
      </div>
    </div>
    <div class="form-group">
      <label>个人贡献与技术实现 [贡献]</label>
      <textarea class="form-control proj-contribution" rows="2" placeholder="负责核心架构、复杂组件封装、性能优化等...">${escapeHtml(item.contribution || '')}</textarea>
    </div>
    <div class="form-group">
      <label>项目成果与荣誉 [效果]</label>
      <input type="text" class="form-control proj-effect" value="${escapeHtml(item.effect || '')}" placeholder="如：荣获国家级竞赛一等奖，系统稳定性达99.9%">
    </div>
  `;
  bindCardControls(card, container);
  container.appendChild(card);
  attachVisualToolbar(card.querySelector('.proj-contribution'));
}

// 重新编号某个列表容器内的所有卡片（按 DOM 顺序 1,2,3...）
function renumberCards(container) {
  container.querySelectorAll('.item-card').forEach((c, idx) => {
    const numEl = c.querySelector('.card-order-num');
    if (numEl) numEl.value = idx + 1;
  });
}

// 将卡片移动到指定序号位置（1-based），随后整表重新编号
function moveCardToOrder(card, container, targetOrder) {
  const cards = Array.from(container.querySelectorAll('.item-card'));
  const total = cards.length;
  let t = Math.max(1, Math.min(total, targetOrder));
  // 当前 index -> 目标 index
  const currentIndex = cards.indexOf(card);
  cards.splice(currentIndex, 1);
  cards.splice(t - 1, 0, card);
  // 重新按新顺序附加到容器
  cards.forEach(c => container.appendChild(c));
  renumberCards(container);
}

// 绑定条目卡片通用操作（数字排序、删除）
function bindCardControls(card, container) {
  const removeBtn = card.querySelector('.btn-remove');

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      if (confirm('确定要删除该项吗？')) {
        card.remove();
        renumberCards(container);
      }
    });
  }

  // 数字排序：修改序号后失焦或回车即自动移动到对应位置
  const numEl = card.querySelector('.card-order-num');
  if (numEl) {
    const applyOrder = () => {
      const v = parseInt(numEl.value, 10);
      if (isNaN(v)) { renumberCards(container); return; }
      moveCardToOrder(card, container, v);
    };
    numEl.addEventListener('change', applyOrder);
    numEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); numEl.blur(); }
    });
    // 上调/下调小按钮
    const upBtn = card.querySelector('.order-step-up');
    const downBtn = card.querySelector('.order-step-down');
    if (upBtn) {
      upBtn.addEventListener('click', () => {
        const v = parseInt(numEl.value, 10) || 1;
        moveCardToOrder(card, container, v - 1);
      });
    }
    if (downBtn) {
      downBtn.addEventListener('click', () => {
        const v = parseInt(numEl.value, 10) || 1;
        moveCardToOrder(card, container, v + 1);
      });
    }
  }
}

// 收集表单数据为简历 JSON 对象（供保存 / 导出复用）
function collectCurrentForm() {
  const isTwoColumn = document.getElementById('radio-two-column').checked;
  const layout = isTwoColumn ? 'two-column' : 'one-column';
  const sideFixed = document.getElementById('field-side-fixed').checked;
  const headerSideBySide = document.getElementById('field-header-side-by-side').checked;
  const skillMode = document.getElementById('skill-mode-bars').checked ? 'bars' : 'tags';
  const iconfontUrl = (document.getElementById('field-iconfont-url') ? document.getElementById('field-iconfont-url').value.trim() : '');
  const themeColor = document.getElementById('field-theme-color-picker').value || '#1abc9c';
  const selectedTemplateEl = document.querySelector('#template-selector .template-card.selected');
  const template = selectedTemplateEl ? selectedTemplateEl.getAttribute('data-template') : 'classic';
  const title = document.getElementById('field-page-title').value.trim();
  const copyright = document.getElementById('field-page-copyright').value.trim();

  // 模块显隐
  const showAvatar = document.getElementById('field-show-avatar').checked;
  const showQrCode = document.getElementById('field-show-qrcode').checked;
  const showSkills = document.getElementById('field-show-skills').checked;
  const showEducation = document.getElementById('field-show-edu').checked;
  const showWork = document.getElementById('field-show-work').checked;
  const showProjects = document.getElementById('field-show-projects').checked;
  const showEvaluation = document.getElementById('field-show-eval').checked;

  // 基本信息
  const basic = {
    name: document.getElementById('field-basic-name').value.trim(),
    jobTitle: document.getElementById('field-basic-job').value.trim(),
    avatar: document.getElementById('field-basic-avatar').value.trim(),
    signature: document.getElementById('field-basic-signature').value.trim()
  };

  // 档案
  const profile = [];
  document.querySelectorAll('#profile-list-container .item-card').forEach(card => {
    const label = card.querySelector('.prop-label').value.trim();
    const value = card.querySelector('.prop-value').value.trim();
    if (label || value) {
      profile.push({ label, value });
    }
  });

  // 联系方式
  const contact = [];
  document.querySelectorAll('#contact-list-container .item-card').forEach(card => {
    const label = card.querySelector('.contact-label').value.trim();
    const value = card.querySelector('.contact-value').value.trim();
    const link = card.querySelector('.contact-link').value.trim();
    const icon = card.querySelector('.contact-icon').value.trim();
    if (label || value) {
      contact.push({ label, value, link, icon });
    }
  });

  // 技能
  const skills = [];
  document.querySelectorAll('#skills-list-container .item-card').forEach(card => {
    const name = card.querySelector('.skill-name').value.trim();
    const level = parseInt(card.querySelector('.skill-slider').value, 10) || 80;
    const iconEl = card.querySelector('.skill-icon');
    const val = iconEl ? iconEl.value.trim() : '';
    // URL 类的存到 logo，类名存到 icon
    const isLogo = looksLikeLogoUrl(val);
    const icon = isLogo ? '' : val;
    const logo = isLogo ? val : '';
    if (name) {
      skills.push({ name, level, icon, logo });
    }
  });

  // 教育
  const education = [];
  document.querySelectorAll('#edu-list-container .item-card').forEach(card => {
    const school = card.querySelector('.edu-school').value.trim();
    const college = card.querySelector('.edu-college') ? card.querySelector('.edu-college').value.trim() : '';
    const major = card.querySelector('.edu-major').value.trim();
    const time = card.querySelector('.edu-time').value.trim();
    const description = card.querySelector('.edu-desc').value.trim();
    if (school || major) {
      education.push({ school, college, major, time, description });
    }
  });

  // 工作
  const work = [];
  document.querySelectorAll('#work-list-container .item-card').forEach(card => {
    const company = card.querySelector('.work-company').value.trim();
    const role = card.querySelector('.work-role').value.trim();
    const time = card.querySelector('.work-time').value.trim();
    const rawPoints = card.querySelector('.work-points').value;
    const points = rawPoints
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    if (company || role) {
      work.push({ company, role, time, points });
    }
  });

  // 项目
  const projects = [];
  document.querySelectorAll('#projects-list-container .item-card').forEach(card => {
    const name = card.querySelector('.proj-name').value.trim();
    const link = card.querySelector('.proj-link').value.trim();
    const time = card.querySelector('.proj-time').value.trim();
    const stack = card.querySelector('.proj-stack').value.trim();
    const target = card.querySelector('.proj-target').value.trim();
    const team = card.querySelector('.proj-team').value.trim();
    const contribution = card.querySelector('.proj-contribution').value.trim();
    const effect = card.querySelector('.proj-effect').value.trim();
    if (name) {
      projects.push({ name, link, time, stack, target, team, contribution, effect });
    }
  });

  // 自我评价
  const selfEvaluation = document.getElementById('field-self-eval').value.trim();

  // 二维码
  const qrcode = {
    image: document.getElementById('field-qr-image').value.trim(),
    text: document.getElementById('field-qr-text').value.trim()
  };

  const payload = {
    settings: {
      title,
      layout,
      sideFixed,
      headerSideBySide,
      skillMode,
      iconfontUrl,
      template,
      themeColor,
      showAvatar,
      showQrCode,
      showSkills,
      showEducation,
      showWork,
      showProjects,
      showEvaluation,
      copyright
    },
    basic,
    profile,
    contact,
    skills,
    qrcode,
    education,
    work,
    projects,
    selfEvaluation
  };

  return payload;
}

// 保存简历与个人主页（自动兼容本地服务器 / 纯静态托管）
async function saveResumeData() {
  const payload = collectCurrentForm();
  const homePayload = collectHomepageForm();
  try {
    const saveBtn = document.getElementById('btn-save-all');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 正在保存...';

    const [result, homeResult] = await Promise.all([
      STATIC_API.saveResume(payload),
      STATIC_API.saveHomepage(homePayload)
    ]);

    if (result.success) {
      showToast('🎉 简历与主页内容已成功保存！前台与主页实时生效。');
      currentData = payload;
      currentHomepageData = homePayload;
      // 若预览打开，则同步刷新预览窗口
      const previewDrawer = document.getElementById('preview-drawer');
      if (previewDrawer.classList.contains('open')) {
        document.getElementById('preview-frame').src = STATIC_API.previewUrl();
      }
    } else {
      showToast('保存失败: ' + result.error, 'error');
    }
  } catch (err) {
    showToast('保存失败: ' + err.message, 'error');
  } finally {
    const saveBtn = document.getElementById('btn-save-all');
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i class="fa fa-save"></i> <b>保存所有内容</b>';
  }
}

/* =======================================================
 * 导入已有简历：文件解析与智能字段映射
 * ======================================================= */
let importedParsed = null;

function initImportResume() {
  const modal = document.getElementById('import-resume-modal');
  if (!modal) return;
  const openBtn = document.getElementById('btn-import-resume');
  const closeBtn = document.getElementById('btn-close-import-resume');
  const fileInput = document.getElementById('input-resume-file');
  const dropZone = document.getElementById('import-drop-zone');
  const parsingEl = document.getElementById('import-parsing');
  const resultEl = document.getElementById('import-result');

  function openModal() {
    modal.classList.add('open');
    // 重置界面
    document.getElementById('import-result').style.display = 'none';
    document.getElementById('import-parsing').style.display = 'none';
    dropZone.style.display = '';
    fileInput.value = '';
    importedParsed = null;
  }
  function closeModal() { modal.classList.remove('open'); }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  fileInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (f) handleImportFile(f);
  });

  // 拖放支持
  ;['dragenter', 'dragover'].forEach(ev => {
    dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.add('drag-active'); });
  });
  ;['dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.remove('drag-active'); });
  });
  dropZone.addEventListener('drop', (e) => {
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleImportFile(f);
  });

  async function handleImportFile(file) {
    const name = file.name.toLowerCase();
    dropZone.style.display = 'none';
    parsingEl.style.display = '';
    resultEl.style.display = 'none';
    try {
      let text = '';
      if (name.endsWith('.pdf')) {
        text = await extractPdfText(file);
      } else if (name.endsWith('.docx')) {
        text = await extractDocxText(file);
      } else if (name.endsWith('.html') || name.endsWith('.htm')) {
        text = await file.text().then(html => {
          const div = document.createElement('div');
          div.innerHTML = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
          return div.textContent || div.innerText || '';
        });
      } else {
        // md / txt / 其他文本
        text = await file.text();
      }
      if (!text || text.trim().length < 10) {
        throw new Error('未能从文件中提取到文本内容，请确认文件未加密且包含文字。');
      }
      importedParsed = parseResumeText(text);
      renderImportResult(importedParsed);
      parsingEl.style.display = 'none';
      resultEl.style.display = '';
    } catch (err) {
      parsingEl.style.display = 'none';
      dropZone.style.display = '';
      showToast('解析失败：' + err.message, 'error');
    }
  }
}

// 提取 PDF 文本（pdf.js，逐页拼接）
function extractPdfText(file) {
  return new Promise((resolve, reject) => {
    if (typeof pdfjsLib === 'undefined') {
      return reject(new Error('PDF 解析库未加载，请检查网络或刷新页面'));
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/admin/libs/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          // 按 y 坐标分行拼接，尽量还原版面行结构
          let lastY = null;
          content.items.forEach(item => {
            const y = Math.round(item.transform[5]);
            if (lastY !== null && Math.abs(y - lastY) > 3) text += '\n';
            else if (lastY !== null) text += ' ';
            text += item.str;
            lastY = y;
          });
          text += '\n';
        }
        resolve(text);
      } catch (e) { reject(e); }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsArrayBuffer(file);
  });
}

// 提取 Word (docx) 文本（mammoth.js）
function extractDocxText(file) {
  return new Promise((resolve, reject) => {
    if (typeof mammoth === 'undefined') {
      return reject(new Error('Word 解析库未加载，请检查网络或刷新页面'));
    }
    const reader = new FileReader();
    reader.onload = () => {
      mammoth.extractRawText({ arrayBuffer: reader.result })
        .then(r => resolve(r.value))
        .catch(e => reject(e));
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsArrayBuffer(file);
  });
}

// ============ 文本智能解析：识别简历各字段 ============
function parseResumeText(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const result = { basic: {}, profile: [], contact: [], skills: [], education: [], work: [], projects: [], selfEvaluation: '' };

  // ---------- 1. 姓名（首行短中文，2-4 个汉字，或"姓名：xxx"） ----------
  let name = '';
  const nameColon = text.match(/姓\s*名[:：\s]*([^\s,，。;；]{2,10})/);
  if (nameColon) name = nameColon[1];
  else {
    for (const l of lines.slice(0, 6)) {
      const clean = l.replace(/[｜|\-,·•].*$/, '').trim();
      if (/^[\u4e00-\u9fa5]{2,4}$/.test(clean)) { name = clean; break; }
    }
  }
  if (name) result.basic.name = name;

  // ---------- 2. 联系方式 ----------
  const phoneMatch = text.match(/(?:1[3-9]\d{9})|(?:1[3-9]\d[\s\-]?\d{4}[\s\-]?\d{4})/);
  if (phoneMatch) {
    const digits = phoneMatch[0].replace(/[\s\-]/g, '');
    result.contact.push({ label: '手机', value: digits, link: 'tel:' + digits, icon: 'fa fa-phone' });
  }
  const emailMatch = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    result.contact.push({ label: '邮箱', value: emailMatch[0], link: 'mailto:' + emailMatch[0], icon: 'fa fa-envelope' });
  }
  const githubMatch = text.match(/(?:github\.com\/|GitHub[:：]\s*)([A-Za-z0-9_\-\.]+)/i);
  if (githubMatch) {
    result.contact.push({ label: 'Github', value: '@' + githubMatch[1].replace(/^@/, ''), link: 'https://github.com/' + githubMatch[1].replace(/^@/, ''), icon: 'fa fa-github' });
  }
  const homepageMatch = text.match(/(?:个人主页|博客|主页|网站)[:：]?\s*(https?:\/\/[^\s,，]+|(?:www\.)?[a-zA-Z0-9\-]+\.(?:com|cn|net|org|io|me|tech)[^\s,，]*)/);
  if (homepageMatch) {
    let hp = homepageMatch[1];
    if (!/^https?:\/\//.test(hp)) hp = 'https://' + hp;
    result.contact.push({ label: '个人主页', value: hp.replace(/^https?:\/\//, ''), link: hp, icon: 'fa fa-globe' });
  }
  const wechatMatch = text.match(/(?:微信|WeChat)[:：]?\s*([A-Za-z0-9_\-]{4,20})/i);
  if (wechatMatch) {
    result.contact.push({ label: '微信', value: wechatMatch[1], link: '', icon: 'fa fa-weixin' });
  }

  // ---------- 3. 求职意向 / 岗位 ----------
  const jobMatch = text.match(/(?:求职意向|应聘岗位|期望职位|求职岗位)[:：]?\s*([^\n,，。;；]{2,30})/);
  if (jobMatch) result.basic.jobTitle = jobMatch[1].trim();

  // ---------- 4. 基本信息标签（性别/年龄/学历/政治面貌等） ----------
  const profilePatterns = [
    { re: /(?:性别)[:：]?\s*(男|女)/, label: '性别' },
    { re: /(?:年龄|出生年月)[:：]?\s*([\d]{1,3}\s*岁?|\d{4}[.\-/年]\d{1,2})/, label: '年龄' },
    { re: /(?:政治面貌|党员情况)[:：]?\s*([\u4e00-\u9fa5]{2,10})/, label: '政治面貌' },
    { re: /(?:籍贯|生源地)[:：]?\s*([\u4e00-\u9fa5]{2,12})/, label: '籍贯' },
    { re: /(?:现居|现居住地|所在地)[:：]?\s*([\u4e00-\u9fa5]{2,12})/, label: '现居城市' },
    { re: /(?:工作年限|工作经验)[:：]?\s*([\d一二三四五六七八九十]+\s*年)/, label: '工作经验' },
    { re: /(?:英语水平|英语等级|外语)[:：]?\s*([A-Z]{2,6}[-\s]?\d?|英语[四六级])/, label: '英语水平' }
  ];
  profilePatterns.forEach(p => {
    const m = text.match(p.re);
    if (m) result.profile.push({ label: p.label, value: m[1].trim() });
  });

  // ---------- 5. 教育经历（学校 + 时间 + 专业/学历） ----------
  const eduSet = new Set();
  const eduRegex = /([\u4e00-\u9fa5（）()]{2,20}(?:大学|学院|学校|研究院))(?:\s*[·\-|｜]\s*([\u4e00-\u9fa5]{2,15}学院))?[^\n]{0,60}?(\d{4}[.\-/年]\s*\d{1,2}[.\-/月]?\s*[-–至~]\s*\d{4}[.\-/年]\s*\d{1,2}[.\-/月]?|\d{4}\s*[-–至~]\s*\d{4}|\d{4}[.\-/年]\s*(?:至今|现在))/g;
  let em;
  while ((em = eduRegex.exec(text)) !== null) {
    const school = em[1].trim();
    const college = (em[2] || '').trim();
    const time = em[3].replace(/\s+/g, ' ').trim();
    const key = school + '|' + time;
    if (eduSet.has(key)) continue;
    eduSet.add(key);
    // 只在"学校[·学院]之后、时间之前"的区段里找专业（避免抓到学校/学院名）
    const lineEnd = text.indexOf('\n', em.index);
    const line = text.substring(em.index, lineEnd === -1 ? em.index + 200 : lineEnd);
    let major = '';
    let seg = line;
    if (college) {
      const ci = seg.indexOf(college);
      if (ci >= 0) seg = seg.substring(ci + college.length);
    } else {
      const si = seg.indexOf(school);
      if (si >= 0) seg = seg.substring(si + school.length);
    }
    const timeIdx = seg.search(/\d{4}/);
    if (timeIdx >= 0) seg = seg.substring(0, timeIdx);
    seg = seg.replace(/^[·\-–—|｜\s]+/, '').trim();
    const majorMatch = seg.match(/^([\u4e00-\u9fa5A-Za-z][\u4e00-\u9fa5A-Za-z0-9]*)(?:（|\()?([^）)]{1,8}(?:本科|硕士|博士|大专|专科))?(?:）|\))?/);
    if (majorMatch) {
      major = majorMatch[1].trim();
      const schoolCore = school.replace(/(大学|学院|学校|研究院)/g, '');
      if (!major || major === school || major === schoolCore || /大学|学院|研究院/.test(major)) major = '';
      const degree = majorMatch[2] ? '（' + majorMatch[2] + '）' : '';
      major = (major + degree).trim();
    }
    result.education.push({
      school,
      college,
      major,
      time,
      description: ''
    });
  }

  // ---------- 6. 工作经历 / 实习经历（结构化分块解析） ----------
  const workSectionMatch = text.match(/(?:^|\n)\s*(?:工作经历|实习经历|职业经历|工作与实习经历|工作历程)\s*\n([\s\S]*?)(?=(?:^|\n)\s*(?:项目经验|项目经历|个人项目|项目实践|专业技能|技能特长|荣誉奖项|自我评价|校园经历|教育经历|技能证书)|(?![\s\S]))/m);
  if (workSectionMatch) {
    const sec = workSectionMatch[1];
    const timeRegex = /(\d{4}(?:[.\-/年]\s*\d{1,2})?(?:\s*月)?\s*(?:[-–—至~]\s*(?:\d{4}(?:[.\-/年]\s*\d{1,2})?(?:\s*月)?|至今|现在|present)|至\s*今|现在|present))/i;
    const roleWords = '工程师|经理|专员|主管|总监|设计师|开发|运营|助理|实习|分析|研究|教师|管理|顾问|专家|架构|领导|负责人|岗|员';

    // 按"包含时间的行"切分成块：每个时间段一个工作条目
    const linesAll = sec.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const blocks = [];
    let cur = null;
    linesAll.forEach(l => {
      const hasTime = timeRegex.test(l);
      const isCompany = /公司|集团|有限|研究院|中心|银行|工作室|事务所|厂|部$/.test(l);
      if (hasTime || (isCompany && !cur)) {
        if (cur) blocks.push(cur);
        cur = { lines: [l] };
      } else if (cur) {
        cur.lines.push(l);
      } else {
        cur = { lines: [l] };
      }
    });
    if (cur) blocks.push(cur);

    blocks.forEach(b => {
      const headerLine = b.lines[0] || '';
      const tm = headerLine.match(timeRegex);
      let company = '', role = '';

      // 公司：优先从标题行解析（去掉时间和分隔符）
      let h = headerLine.replace(timeRegex, '').replace(/^[[({【（]?\d/, '').trim();
      // 公司与职位常见分隔：- | · － / 多空格
      const segRe = /\s*[|｜·・\-–—/]\s*|\s{2,}/;
      if (segRe.test(h)) {
        const parts = h.split(segRe).map(s => s.trim()).filter(Boolean);
        // 含公司词的部分为公司，含职位词的为岗位
        parts.forEach(p => {
          if (!company && /公司|集团|有限|研究院|中心|银行|工作室|事务所|厂/.test(p)) company = p;
          else if (!role && new RegExp('(' + roleWords + ')').test(p) && p.length <= 20) role = p;
        });
        if (!company && parts.length) company = parts[0];
        if (!role && parts.length > 1) role = parts[1];
      } else {
        company = h;
      }
      // 岗位也可能在第二行
      if (!role) {
        for (let i = 1; i < Math.min(3, b.lines.length); i++) {
          const l2 = b.lines[i].replace(timeRegex, '').trim();
          if (l2.length <= 25 && new RegExp('(' + roleWords + ')').test(l2)) { role = l2; break; }
        }
      }
      company = (company || '').replace(/^[•·●○◦▪\-\d.、)\s]+/, '').replace(/[|｜·\-—]+\s*$/, '').trim();
      role = (role || '').replace(/^[|｜·\-—:\s]+/, '').trim();

      // 要点：以 • · ● ○ ◦ ▪ - – — 数字. 开头，或"负责/参与/完成/主导/实现/优化/推动/独立/配合/深度"等动词开头
      const points = [];
      for (let i = 1; i < b.lines.length; i++) {
        let l = b.lines[i];
        if (timeRegex.test(l) && i === 0) continue;
        const pm = l.match(/^(?:[•·●○◦▪✦★]\s*|[-–—]\s*|\d+[..、)]\s*)(.{6,300})$/);
        if (pm) { points.push(pm[1].trim()); continue; }
        // 无符号但以动词开头的行也算要点（PDF 常见）
        if (/^(?:负责|参与|完成|主导|实现|优化|推动|独立|配合|深度|使用|基于|设计|开发|维护|搭建|编写|制定|协助|带领|落地|沉淀|攻坚|保障|解决|引入|输出|撰写|项目|深入|梳理|快速|利用|针对|完成|主导|承担|跟进|支撑|构建|封装|接入|沉淀)/.test(l) && l.length >= 8) {
          points.push(l);
        }
      }
      // 合并被 PDF 打断的行：以句号结尾的合并规则跳过，保留原样即可
      if (company || role || points.length) {
        result.work.push({
          company: company || '（未识别公司名）',
          role,
          time: tm ? tm[1].replace(/\s+/g, ' ').trim() : '',
          points: points.slice(0, 10)
        });
      }
    });
  }

  // ---------- 7. 项目经验（结构化分块解析：项目名/时间/技术栈/目标/团队/贡献/效果） ----------
  const projSectionMatch = text.match(/(?:^|\n)\s*(?:项目经验|项目经历|个人项目|项目实践)\s*\n([\s\S]*?)(?=(?:^|\n)\s*(?:专业技能|技能特长|荣誉奖项|自我评价|教育经历|工作经历|技能证书)|(?![\s\S]))/m);
  if (projSectionMatch) {
    const sec = projSectionMatch[1];
    const timeRegexP = /(\d{4}(?:[.\-/年]\s*\d{1,2})?(?:\s*月)?\s*(?:[-–—至~]\s*(?:\d{4}(?:[.\-/年]\s*\d{1,2})?(?:\s*月)?|至今|现在|present)|至\s*今|现在|present))/i;
    const linesP = sec.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // 找"项目名行"：不含 [目标]/[团队]/[贡献]/[效果]/技术栈 前缀，且较短
    const metaTags = /^\s*(?:[•·●○◦▪]\s*)?(?:\[?技术栈\]?|技术栈[:：]|\[?目标\]?|目标[:：]|\[?团队\]?|团队[:：]|\[?贡献\]?|贡献[:：]|\[?效果\]?|效果[:：]|\[?成果\]?|成果[:：]|\[?职责\]?|职责[:：]|\[?介绍\]?|介绍[:：])/;
    const projNameRe = /^(?:\d+[..、)]\s*)?([^\n]{4,45})$/;
    const blocksP = [];
    linesP.forEach(l => {
      const hasTime = timeRegexP.test(l);
      const isMeta = metaTags.test(l);
      const looksLikeName = !isMeta && projNameRe.test(l) && !/^(?:技术栈|目标|团队|贡献|效果|成果|职责|介绍)/.test(l.replace(/^[•·●○◦▪]\s*/, ''));
      if (looksLikeName || (hasTime && !isMeta && (!blocksP.length || blocksP[blocksP.length-1].done))) {
        blocksP.push({ nameLine: l, lines: [] });
      } else if (blocksP.length) {
        blocksP[blocksP.length - 1].lines.push(l);
      }
    });

    blocksP.forEach(b => {
      let nameP = b.nameLine.replace(timeRegexP, '').replace(/[(（]?(?:Demo|demo|演示|链接|在线演示)[)）]?/g, '').replace(/[|｜·\-—]+\s*$/, '').replace(/^[#*\-\d.、)\s]+/, '').trim();
      if (nameP.length < 4) return;
      const tm = b.nameLine.match(timeRegexP);
      const p = {
        name: nameP.substring(0, 45),
        link: '',
        time: tm ? tm[1].replace(/\s+/g, ' ').trim() : '',
        stack: '', target: '', team: '', contribution: '', effect: ''
      };
      b.lines.forEach(l => {
        const clean = l.replace(/^[•·●○◦▪✦★]\s*/, '').replace(/^[-–—]\s*/, '').replace(/^\d+[..、)]\s*/, '').trim();
        let m;
        if ((m = clean.match(/^\[?技术栈\]?[:：]?\s*(.+)$/)) || (m = clean.match(/^技术(?:栈|选型)[:：]?\s*(.+)$/))) {
          p.stack = (p.stack ? p.stack + '，' : '') + m[1].trim();
        } else if ((m = clean.match(/^\[?目标\]?[:：]?\s*(.+)$/))) {
          p.target = (p.target ? p.target + ' ' : '') + m[1].trim();
        } else if ((m = clean.match(/^\[?团队\]?[:：]?\s*(.+)$/))) {
          p.team = (p.team ? p.team + ' ' : '') + m[1].trim();
        } else if ((m = clean.match(/^\[?贡献\]?[:：]?\s*(.+)$/))) {
          p.contribution = (p.contribution ? p.contribution + ' ' : '') + m[1].trim();
        } else if ((m = clean.match(/^\[?(?:效果|成果)\]?[:：]?\s*(.+)$/))) {
          p.effect = (p.effect ? p.effect + ' ' : '') + m[1].trim();
        } else if ((m = clean.match(/^\[?职责\]?[:：]?\s*(.+)$/))) {
          p.contribution = (p.contribution ? p.contribution + ' ' : '') + m[1].trim();
        } else if ((m = clean.match(/^\[?(?:介绍|背景|描述)\]?[:：]?\s*(.+)$/))) {
          p.target = (p.target ? p.target + ' ' : '') + m[1].trim();
        } else if (clean.length > 6) {
          // 无标签的描述行 → 并入贡献
          p.contribution = (p.contribution ? p.contribution + ' ' : '') + clean;
        }
      });
      result.projects.push(p);
    });
  }
  // ---------- 8. 技能 ----------
  const skillSectionMatch = text.match(/(?:专业技能|技能特长|技能清单|IT技能|核心技能|掌握技能)[:：]?([\s\S]*?)(?=(?:工作经历|项目经验|项目经历|教育经历|荣誉|自我评价|校园经历|$))/);
  if (skillSectionMatch) {
    const sec = skillSectionMatch[1];
    sec.split(/\r?\n|、|；|;/).forEach(l => {
      const s = l.replace(/^[•·●○◦▪\-\d.、)\s]+/, '').replace(/\(\d+\s*分?\)|\d+%|熟练|掌握|了解|精通/g, '').trim();
      if (s.length >= 2 && s.length <= 40 && !/[:：]/.test(s)) result.skills.push({ name: s, level: 80, icon: '', logo: '' });
    });
  }

  // ---------- 9. 自我评价 ----------
  const evalMatch = text.match(/(?:自我评价|个人评价|自我介绍|关于我)[:：]?\s*([\s\S]{20,600}?)(?=\n\s*\n|$)/);
  if (evalMatch) result.selfEvaluation = evalMatch[1].trim();

  // 清理空数组
  Object.keys(result).forEach(k => { if (Array.isArray(result[k]) && result[k].length === 0) delete result[k]; });
  if (!result.selfEvaluation) delete result.selfEvaluation;
  Object.keys(result.basic).forEach(k => { if (!result.basic[k]) delete result.basic[k]; });

  return result;
}

// 渲染识别结果（带勾选框）
function renderImportResult(parsed) {
  const listEl = document.getElementById('import-fields-list');
  listEl.innerHTML = '';
  const sections = [
    { key: 'basic', name: '基本信息（姓名/求职意向）', get: () => parsed.basic, isEmpty: () => Object.keys(parsed.basic || {}).length === 0, preview: () => JSON.stringify(parsed.basic, null, ' '), count: () => Object.keys(parsed.basic || {}).length },
    { key: 'contact', name: '联系方式', get: () => parsed.contact, isEmpty: () => !parsed.contact || parsed.contact.length === 0, preview: () => (parsed.contact || []).map(c => c.label + ': ' + c.value).join('\n'), count: () => (parsed.contact || []).length },
    { key: 'profile', name: '档案标签（性别/年龄/籍贯等）', get: () => parsed.profile, isEmpty: () => !parsed.profile || parsed.profile.length === 0, preview: () => (parsed.profile || []).map(p => p.label + ': ' + p.value).join('\n'), count: () => (parsed.profile || []).length },
    { key: 'education', name: '教育经历', get: () => parsed.education, isEmpty: () => !parsed.education || parsed.education.length === 0, preview: () => (parsed.education || []).map(e => [e.school, e.college, e.major, e.time].filter(Boolean).join(' · ')).join('\n'), count: () => (parsed.education || []).length },
    { key: 'work', name: '工作经历', get: () => parsed.work, isEmpty: () => !parsed.work || parsed.work.length === 0, preview: () => (parsed.work || []).map(w => w.company + ' | ' + w.role + ' | ' + w.time + '\n  ' + (w.points || []).join('\n  ')).join('\n'), count: () => (parsed.work || []).length },
    { key: 'projects', name: '项目经验', get: () => parsed.projects, isEmpty: () => !parsed.projects || parsed.projects.length === 0, preview: () => (parsed.projects || []).map(p => p.name + ' (' + p.time + ')').join('\n'), count: () => (parsed.projects || []).length },
    { key: 'skills', name: '专业技能', get: () => parsed.skills, isEmpty: () => !parsed.skills || parsed.skills.length === 0, preview: () => (parsed.skills || []).map(s => s.name).join('、'), count: () => (parsed.skills || []).length },
    { key: 'selfEvaluation', name: '自我评价', get: () => parsed.selfEvaluation, isEmpty: () => !parsed.selfEvaluation, preview: () => parsed.selfEvaluation || '', count: () => (parsed.selfEvaluation || '').length > 0 ? 1 : 0 }
  ];

  let anyShown = false;
  sections.forEach(sec => {
    if (sec.isEmpty()) return;
    anyShown = true;
    const item = document.createElement('div');
    item.className = 'import-field-item import-checked';
    item.innerHTML = `
      <div class="import-field-header">
        <input type="checkbox" checked data-sec="${sec.key}">
        <span class="import-field-name">${escapeHtml(sec.name)}</span>
        <span class="import-field-count">识别到 ${sec.count()} 项</span>
      </div>
      <div class="import-field-preview">${escapeHtml(sec.preview())}</div>
    `;
    const cb = item.querySelector('input[type="checkbox"]');
    cb.addEventListener('change', () => {
      item.classList.toggle('import-checked', cb.checked);
    });
    listEl.appendChild(item);
  });

  if (!anyShown) {
    listEl.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:24px;">未能识别出结构化内容，请确认文件为标准简历格式。</div>';
  }

  // 应用按钮
  document.getElementById('btn-apply-import').onclick = () => applyImportToForm(parsed);
}

// 将识别结果应用到后台表单
function applyImportToForm(parsed) {
  const replaceMode = document.getElementById('import-replace-mode').checked;
  const checked = {};
  document.querySelectorAll('#import-fields-list input[type="checkbox"]:checked').forEach(cb => { checked[cb.getAttribute('data-sec')] = true; });
  let applied = 0;

  // 基本信息
  if (checked.basic && parsed.basic) {
    if (parsed.basic.name) { document.getElementById('field-basic-name').value = parsed.basic.name; applied++; }
    if (parsed.basic.jobTitle) { document.getElementById('field-basic-job').value = parsed.basic.jobTitle; applied++; }
  }

  // 联系方式
  if (checked.contact && Array.isArray(parsed.contact) && parsed.contact.length) {
    if (replaceMode) document.getElementById('contact-list-container').innerHTML = '';
    parsed.contact.forEach(c => addContactItem(c));
    applied++;
  }

  // 档案标签
  if (checked.profile && Array.isArray(parsed.profile) && parsed.profile.length) {
    if (replaceMode) document.getElementById('profile-list-container').innerHTML = '';
    parsed.profile.forEach(p => addProfileItem(p));
    applied++;
  }

  // 教育经历
  if (checked.education && Array.isArray(parsed.education) && parsed.education.length) {
    if (replaceMode) document.getElementById('edu-list-container').innerHTML = '';
    parsed.education.forEach(e => addEduItem(e));
    applied++;
  }

  // 工作经历
  if (checked.work && Array.isArray(parsed.work) && parsed.work.length) {
    if (replaceMode) document.getElementById('work-list-container').innerHTML = '';
    parsed.work.forEach(w => addWorkItem(w));
    applied++;
  }

  // 项目经验
  if (checked.projects && Array.isArray(parsed.projects) && parsed.projects.length) {
    if (replaceMode) document.getElementById('projects-list-container').innerHTML = '';
    parsed.projects.forEach(p => addProjectItem(p));
    applied++;
  }

  // 技能
  if (checked.skills && Array.isArray(parsed.skills) && parsed.skills.length) {
    if (replaceMode) document.getElementById('skills-list-container').innerHTML = '';
    parsed.skills.forEach(s => addSkillItem(s));
    applied++;
  }

  // 自我评价
  if (checked.selfEvaluation && parsed.selfEvaluation) {
    document.getElementById('field-self-eval').value = parsed.selfEvaluation;
    applied++;
  }

  // 重新编号所有列表
  ['profile-list-container', 'contact-list-container', 'skills-list-container',
   'edu-list-container', 'work-list-container', 'projects-list-container'].forEach(id => {
    const el = document.getElementById(id);
    if (el) renumberCards(el);
  });

  // 关闭弹窗
  document.getElementById('import-resume-modal').classList.remove('open');
  showToast('成功导入 ' + applied + ' 个模块的内容，请检查后点击"保存所有内容"');
}

/* =======================================================
 * 赛博马里奥像素个人主页配置 (Homepage & Portal)
 * ======================================================= */
let currentHomepageData = null;

async function fetchHomepageData() {
  try {
    const res = await STATIC_API.loadHomepage();
    if (res.success && res.data) {
      currentHomepageData = res.data;
      populateHomepageForm(currentHomepageData);
    }
  } catch (err) {
    console.warn('加载个人主页配置失败:', err);
  }
}

function populateHomepageForm(data) {
  if (!data) return;
  const hero = data.hero || {};
  const about = data.about || {};
  const footer = data.footer || {};

  const fTitle = document.getElementById('home-field-title');
  if (fTitle) fTitle.value = hero.title || '';
  const fSub = document.getElementById('home-field-subtitle');
  if (fSub) fSub.value = hero.subtitle || '';
  const fJob = document.getElementById('home-field-job');
  if (fJob) fJob.value = hero.jobTitle || '';
  const fSlogan = document.getElementById('home-field-slogan');
  if (fSlogan) fSlogan.value = hero.slogan || '';
  const fBg = document.getElementById('home-field-bg');
  if (fBg) fBg.value = hero.background || 'assets/images/mario-night.gif';
  const fBgm = document.getElementById('home-field-bgm');
  if (fBgm) fBgm.value = hero.bgm || 'assets/audio/bgm.mp3';
  const fAuto = document.getElementById('home-field-bgm-autoplay');
  if (fAuto) fAuto.checked = !!hero.bgmAutoPlay;

  const fGreet = document.getElementById('home-field-greeting');
  if (fGreet) fGreet.value = about.greeting || '';
  const fBio = document.getElementById('home-field-bio');
  if (fBio) fBio.value = about.bio || '';
  const fFoot = document.getElementById('home-field-footer');
  if (fFoot) fFoot.value = footer.copyright || '';

  // 渲染徽章列表
  const badgesBox = document.getElementById('home-badges-list-container');
  if (badgesBox) {
    badgesBox.innerHTML = '';
    (about.badges || []).forEach(addHomeBadgeItem);
    renumberCards(badgesBox);
  }

  // 渲染项目列表
  const projBox = document.getElementById('home-projects-list-container');
  if (projBox) {
    projBox.innerHTML = '';
    (data.projects || []).forEach(addHomeProjectItem);
    renumberCards(projBox);
  }

  // 渲染社交网络列表
  const socialBox = document.getElementById('home-social-list-container');
  if (socialBox) {
    socialBox.innerHTML = '';
    (data.social || []).forEach(addHomeSocialItem);
    renumberCards(socialBox);
  }
}

function collectHomepageForm() {
  const hero = {
    title: (document.getElementById('home-field-title')?.value || '').trim(),
    subtitle: (document.getElementById('home-field-subtitle')?.value || '').trim(),
    jobTitle: (document.getElementById('home-field-job')?.value || '').trim(),
    slogan: (document.getElementById('home-field-slogan')?.value || '').trim(),
    avatar: (document.getElementById('field-basic-avatar')?.value || 'assets/images/avatar.jpg').trim(),
    background: (document.getElementById('home-field-bg')?.value || 'assets/images/mario-night.gif').trim(),
    bgm: (document.getElementById('home-field-bgm')?.value || '').trim(),
    bgmAutoPlay: !!document.getElementById('home-field-bgm-autoplay')?.checked
  };

  const badges = [];
  document.querySelectorAll('#home-badges-list-container .item-card').forEach(card => {
    const label = (card.querySelector('.badge-label')?.value || '').trim();
    const value = (card.querySelector('.badge-val')?.value || '').trim();
    if (label || value) badges.push({ label, value });
  });

  const about = {
    greeting: (document.getElementById('home-field-greeting')?.value || '').trim(),
    bio: (document.getElementById('home-field-bio')?.value || '').trim(),
    badges: badges
  };

  const projects = [];
  document.querySelectorAll('#home-projects-list-container .item-card').forEach(card => {
    const name = (card.querySelector('.proj-name')?.value || '').trim();
    const tag = (card.querySelector('.proj-tag')?.value || '').trim();
    const desc = (card.querySelector('.proj-desc')?.value || '').trim();
    const link = (card.querySelector('.proj-link')?.value || '').trim();
    if (name) projects.push({ name, tag, desc, link });
  });

  const social = [];
  document.querySelectorAll('#home-social-list-container .item-card').forEach(card => {
    const name = (card.querySelector('.social-name')?.value || '').trim();
    const text = (card.querySelector('.social-text')?.value || '').trim();
    const link = (card.querySelector('.social-link')?.value || '').trim();
    const icon = (card.querySelector('.social-icon')?.value || '').trim();
    if (name) social.push({ name, text, link, icon });
  });

  const footer = {
    copyright: (document.getElementById('home-field-footer')?.value || '').trim()
  };

  const skills = (currentHomepageData && currentHomepageData.skills) ? currentHomepageData.skills : [];

  return { hero, about, skills, projects, social, footer };
}

function addHomeBadgeItem(item = { label: '', value: '' }) {
  const container = document.getElementById('home-badges-list-container');
  if (!container) return;
  const card = document.createElement('div');
  card.className = 'item-card';
  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-card-title"><i class="fa fa-tag"></i> <span>${escapeHtml(item.label || '核心徽章')}</span></div>
      <div class="item-card-actions">
        <div class="card-order-box" title="显示顺序号">
          <button type="button" class="order-step order-step-up"><i class="fa fa-angle-up"></i></button>
          <input type="number" min="1" class="card-order-num" value="1">
          <button type="button" class="order-step order-step-down"><i class="fa fa-angle-down"></i></button>
        </div>
        <button type="button" class="icon-btn danger btn-remove" title="删除"><i class="fa fa-trash"></i></button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group" style="flex: 1;">
        <label>标签名称</label>
        <input type="text" class="form-control badge-label" value="${escapeHtml(item.label)}" placeholder="如：学历层次">
      </div>
      <div class="form-group" style="flex: 1.5;">
        <label>标签内容</label>
        <input type="text" class="form-control badge-val" value="${escapeHtml(item.value)}" placeholder="如：硕士研究生 (2027届)">
      </div>
    </div>
  `;
  bindCardControls(card, container);
  container.appendChild(card);
}

function addHomeProjectItem(item = { name: '', tag: '', desc: '', link: '' }) {
  const container = document.getElementById('home-projects-list-container');
  if (!container) return;
  const card = document.createElement('div');
  card.className = 'item-card';
  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-card-title"><i class="fa fa-cubes"></i> <span>${escapeHtml(item.name || '代表项目')}</span></div>
      <div class="item-card-actions">
        <div class="card-order-box" title="显示顺序号">
          <button type="button" class="order-step order-step-up"><i class="fa fa-angle-up"></i></button>
          <input type="number" min="1" class="card-order-num" value="1">
          <button type="button" class="order-step order-step-down"><i class="fa fa-angle-down"></i></button>
        </div>
        <button type="button" class="icon-btn danger btn-remove" title="删除"><i class="fa fa-trash"></i></button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group" style="flex: 2;">
        <label>项目名称</label>
        <input type="text" class="form-control proj-name" value="${escapeHtml(item.name)}" placeholder="如：CatGO 开源工作台">
      </div>
      <div class="form-group" style="flex: 1;">
        <label>类型标签</label>
        <input type="text" class="form-control proj-tag" value="${escapeHtml(item.tag)}" placeholder="如：开源项目 / 独立研发">
      </div>
    </div>
    <div class="form-group">
      <label>简短介绍与特色亮点</label>
      <textarea class="form-control proj-desc" rows="2" placeholder="填写项目定位与核心产出...">${escapeHtml(item.desc)}</textarea>
    </div>
    <div class="form-group">
      <label>在线演示链接 / GitHub 仓库地址 (可选)</label>
      <input type="text" class="form-control proj-link" value="${escapeHtml(item.link || '')}" placeholder="https://github.com/...">
    </div>
  `;
  bindCardControls(card, container);
  container.appendChild(card);
}

function addHomeSocialItem(item = { name: '', text: '', link: '', icon: '' }) {
  const container = document.getElementById('home-social-list-container');
  if (!container) return;
  const card = document.createElement('div');
  card.className = 'item-card';
  const curIcon = item.icon || 'fa fa-link';
  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-card-title"><i class="${escapeHtml(curIcon)}"></i> <span>${escapeHtml(item.name || '社交网络')}</span></div>
      <div class="item-card-actions">
        <div class="card-order-box" title="显示顺序号">
          <button type="button" class="order-step order-step-up"><i class="fa fa-angle-up"></i></button>
          <input type="number" min="1" class="card-order-num" value="1">
          <button type="button" class="order-step order-step-down"><i class="fa fa-angle-down"></i></button>
        </div>
        <button type="button" class="icon-btn danger btn-remove" title="删除"><i class="fa fa-trash"></i></button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group" style="flex: 1.2;">
        <label>平台名称</label>
        <input type="text" class="form-control social-name" value="${escapeHtml(item.name)}" placeholder="如：GitHub / 邮箱 / 微信">
      </div>
      <div class="form-group" style="flex: 1.8;">
        <label>展示文本</label>
        <input type="text" class="form-control social-text" value="${escapeHtml(item.text)}" placeholder="如：XCai-0213 或 账号">
      </div>
      <div class="form-group" style="flex: 1;">
        <label>图标</label>
        <div class="icon-pick-trigger" title="点击选择图标">
          <span class="preview-badge"><i class="${escapeHtml(curIcon)}"></i></span>
          <span class="icon-name-text">选图标</span>
          <input type="hidden" class="social-icon" value="${escapeHtml(curIcon)}">
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>跳转链接地址</label>
      <input type="text" class="form-control social-link" value="${escapeHtml(item.link || '')}" placeholder="如：https://github.com/... 或 mailto:...">
    </div>
  `;

  const trigger = card.querySelector('.icon-pick-trigger');
  const previewBadge = card.querySelector('.preview-badge');
  const titleIcon = card.querySelector('.item-card-title i');
  const hiddenInput = card.querySelector('.social-icon');

  trigger.addEventListener('click', () => {
    openIconPicker((selectedIcon) => {
      hiddenInput.value = selectedIcon;
      previewBadge.innerHTML = `<i class="${escapeHtml(selectedIcon)}"></i>`;
      titleIcon.className = selectedIcon;
    }, hiddenInput.value);
  });

  bindCardControls(card, container);
  container.appendChild(card);
}

function initHomepageEvents() {
  const addBadgeBtn = document.getElementById('home-btn-add-badge');
  if (addBadgeBtn) {
    addBadgeBtn.addEventListener('click', () => {
      addHomeBadgeItem({ label: '新属性', value: '说明内容' });
      renumberCards(document.getElementById('home-badges-list-container'));
    });
  }

  const addProjBtn = document.getElementById('home-btn-add-project');
  if (addProjBtn) {
    addProjBtn.addEventListener('click', () => {
      addHomeProjectItem({ name: '新项目', tag: '实践开发', desc: '项目描述...', link: '' });
      renumberCards(document.getElementById('home-projects-list-container'));
    });
  }

  const addSocialBtn = document.getElementById('home-btn-add-social');
  if (addSocialBtn) {
    addSocialBtn.addEventListener('click', () => {
      addHomeSocialItem({ name: '社交平台', text: 'my_account', link: '', icon: 'fa fa-link' });
      renumberCards(document.getElementById('home-social-list-container'));
    });
  }

  // 主页背景更换上传
  const bgFileInput = document.getElementById('home-input-bg-file');
  const bgTextInput = document.getElementById('home-field-bg');
  if (bgFileInput && bgTextInput) {
    bgFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          showToast('正在上传背景动图...', 'info');
          const result = await STATIC_API.uploadImage(file.name, reader.result);
          if (result.success) {
            bgTextInput.value = result.url;
            showToast('背景图已成功更新！');
          } else {
            showToast('上传失败: ' + result.error, 'error');
          }
        } catch (err) {
          showToast('处理失败: ' + err.message, 'error');
        }
      };
      reader.readAsDataURL(file);
    });
  }
}
/* =======================================================
 * 六大定制职业简历套件 (Preset Resumes) 控制器
 * ======================================================= */
let availablePresets = [];
let activePresetId = null;
let currentPreviewingPreset = null;

async function initPresetResumes() {
  const grid = document.getElementById('preset-cards-grid');
  if (!grid) return;

  try {
    const res = await STATIC_API.loadPresets();
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      availablePresets = res.data;
    }
  } catch (e) {
    console.warn('获取预设简历数据失败:', e);
  }

  // 兜底：若未能获取，尝试直接读取 presets.json
  if (availablePresets.length === 0) {
    try {
      const res2 = await fetch('../data/presets.json');
      if (res2.ok) availablePresets = await res2.json();
    } catch (e) {}
  }

  renderPresetCards(availablePresets);
  bindPresetModalEvents();

  // 顶部快捷按钮联动
  const quickBtn = document.getElementById('btn-quick-presets');
  if (quickBtn) {
    quickBtn.addEventListener('click', () => {
      // 切换到布局与外观选项卡
      const layoutTabMenu = document.querySelector('.sidebar-menu li[data-tab="layout-tab"]');
      if (layoutTabMenu) layoutTabMenu.click();
      // 平滑滚动至锚点
      const anchor = document.getElementById('preset-resumes-anchor');
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        anchor.style.transition = 'box-shadow 0.4s';
        anchor.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.4)';
        setTimeout(() => { anchor.style.boxShadow = ''; }, 1200);
      }
    });
  }
}

function renderPresetCards(list) {
  const grid = document.getElementById('preset-cards-grid');
  if (!grid) return;

  grid.innerHTML = list.map(p => {
    const isActive = activePresetId === p.id;
    const activeTag = isActive ? '<span class="preset-active-tag">当前使用中 ✓</span>' : '';
    const activeCls = isActive ? 'current-active' : '';

    return `
      <div class="preset-item-card ${activeCls}" data-id="${escapeHtml(p.id)}">
        ${activeTag}
        <div class="preset-card-top">
          <div class="preset-icon-box" style="background: ${p.color || '#2563eb'};">
            <i class="fa ${p.icon || 'fa-briefcase'}"></i>
          </div>
          <div class="preset-meta">
            <div class="preset-title">
              <span>${escapeHtml(p.name)}</span>
            </div>
            <span class="preset-badge">${escapeHtml(p.badge || '')}</span>
          </div>
        </div>
        <p class="preset-desc">${escapeHtml(p.description || '')}</p>
        <div class="preset-card-actions">
          <button type="button" class="btn-view-preset" data-action="view" data-id="${escapeHtml(p.id)}" title="查看这套简历包含的完整经历与技能">
            <i class="fa fa-eye"></i> 查看详情
          </button>
          <button type="button" class="btn-apply-preset" data-action="apply" data-id="${escapeHtml(p.id)}" title="一键填入本岗位定制履历">
            <i class="fa fa-magic"></i> <b>一键载入履历</b>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // 绑定卡片内按钮事件
  grid.querySelectorAll('[data-action="apply"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      applyPresetResume(id);
    });
  });

  grid.querySelectorAll('[data-action="view"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      openPresetPreviewModal(id);
    });
  });
}

// 一键套用某套预设简历（同时保留用户选好的单栏模板和主题颜色）
function applyPresetResume(presetId) {
  const target = availablePresets.find(p => p.id === presetId);
  if (!target || !target.data) {
    showToast('未找到该预设简历方案', 'error');
    return;
  }

  // 收集当前用户挑选的外观设置（模板、颜色、单栏/两栏等），予以保留
  const currentSettings = (typeof collectCurrentForm === 'function')
    ? collectCurrentForm().settings
    : (currentData && currentData.settings ? currentData.settings : {});

  // 深度克隆预设数据并将外观设置合并进去
  const mergedData = JSON.parse(JSON.stringify(target.data));
  mergedData.settings = Object.assign({}, mergedData.settings || {}, currentSettings || {});

  // 填充表单
  populateForm(mergedData);
  activePresetId = presetId;

  // 刷新卡片高亮状态
  renderPresetCards(availablePresets);

  // 提示反馈
  showToast(`🎉 已成功载入【${target.name}】全套定制履历！模板与颜色保持当前选择，您可继续微调后点右上角“保存所有内容”。`);

  // 若实时预览窗口已开启，即刻同步刷新
  const previewDrawer = document.getElementById('preview-drawer');
  if (previewDrawer && previewDrawer.classList.contains('open')) {
    const frame = document.getElementById('preview-frame');
    if (frame) frame.src = (typeof STATIC_API !== 'undefined' && STATIC_API.previewUrl)
      ? STATIC_API.previewUrl()
      : ('/?preview=' + Date.now());
  }
}

// 打开预设详情预览模态框
function openPresetPreviewModal(presetId) {
  const target = availablePresets.find(p => p.id === presetId);
  if (!target || !target.data) return;
  currentPreviewingPreset = target;

  const modal = document.getElementById('preset-modal');
  const title = document.getElementById('preset-modal-title');
  const body = document.getElementById('preset-modal-body');
  if (!modal || !body) return;

  title.innerHTML = `<i class="fa ${target.icon || 'fa-briefcase'}" style="color:${target.color || '#2563eb'};"></i> ${escapeHtml(target.name)} · 履历方案详情`;

  const d = target.data;
  const basic = d.basic || {};
  const skills = d.skills || [];
  const edu = d.education || [];
  const work = d.work || [];
  const projects = d.projects || [];
  const evalText = d.selfEvaluation || '';

  body.innerHTML = `
    <div class="preset-detail-section">
      <h4><i class="fa fa-user"></i> 求职意向与职业定位</h4>
      <div style="font-size: 14px; font-weight: 700; color: #1e40af; margin-bottom: 4px;">
        ${escapeHtml(basic.jobTitle || '')}
      </div>
      <div style="font-size: 12.5px; color: #64748b;">${escapeHtml(basic.signature || '')}</div>
    </div>

    <div class="preset-detail-section">
      <h4><i class="fa fa-code"></i> 专业技能清单 (${skills.length} 项)</h4>
      <div class="preset-detail-tags">
        ${skills.map(s => `<span class="preset-detail-pill">${escapeHtml(s.name)} (熟练度 ${s.level || 85}%)</span>`).join('')}
      </div>
    </div>

    <div class="preset-detail-section">
      <h4><i class="fa fa-graduation-cap"></i> 教育背景</h4>
      ${edu.map(e => `
        <div class="preset-detail-item">
          <b>${escapeHtml(e.school)} · ${escapeHtml(e.college || '')} · ${escapeHtml(e.major)}</b>
          <span style="float: right; color: #64748b; font-size: 12px;">${escapeHtml(e.time)}</span>
          <div style="font-size: 12px; color: #475569; margin-top: 4px; white-space: pre-line;">${escapeHtml(e.description || '')}</div>
        </div>
      `).join('')}
    </div>

    <div class="preset-detail-section">
      <h4><i class="fa fa-briefcase"></i> 工作与产线实习经历 (${work.length} 段)</h4>
      ${work.map(w => `
        <div class="preset-detail-item">
          <b>${escapeHtml(w.company)} — ${escapeHtml(w.role)}</b>
          <span style="float: right; color: #64748b; font-size: 12px;">${escapeHtml(w.time)}</span>
          <ul style="margin: 4px 0 0 18px; padding: 0; font-size: 12.5px; color: #334155;">
            ${(w.points || []).map(pt => `<li>${escapeHtml(pt)}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <div class="preset-detail-section">
      <h4><i class="fa fa-cubes"></i> 重点课题与项目经验 (${projects.length} 项)</h4>
      ${projects.map(pj => `
        <div class="preset-detail-item">
          <b>${escapeHtml(pj.name)}</b>
          <div style="font-size: 12px; color: #0284c7; margin: 2px 0;">技术栈: ${escapeHtml(pj.stack || '')}</div>
          <div style="font-size: 12.5px; color: #334155; white-space: pre-line;">${escapeHtml(pj.contribution || pj.target || '')}</div>
        </div>
      `).join('')}
    </div>

    <div class="preset-detail-section">
      <h4><i class="fa fa-pencil-square-o"></i> 自我评价亮点</h4>
      <div style="background: #f8fafc; padding: 10px 14px; border-radius: 6px; font-size: 13px; color: #334155; white-space: pre-line;">
        ${escapeHtml(evalText)}
      </div>
    </div>
  `;

  modal.classList.add('open');
}

function bindPresetModalEvents() {
  const modal = document.getElementById('preset-modal');
  const closeBtn = document.getElementById('btn-close-preset-modal');
  const cancelBtn = document.getElementById('btn-cancel-preset');
  const confirmBtn = document.getElementById('btn-confirm-apply-preset');

  function closeModal() {
    if (modal) modal.classList.remove('open');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (currentPreviewingPreset) {
        applyPresetResume(currentPreviewingPreset.id);
        closeModal();
      }
    });
  }
}
