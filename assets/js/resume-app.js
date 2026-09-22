// 简历动态渲染前端引擎
(function () {
  'use strict';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // 十六进制颜色 -> RGBA，用于生成与主题色一致的柔和背景
  function hexToRgba(hex, alpha) {
    if (!hex) return 'rgba(26, 188, 156, ' + alpha + ')';
    let h = String(hex).replace('#', '').trim();
    if (h.length === 3) {
      h = h.split('').map(c => c + c).join('');
    }
    if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) {
      return 'rgba(26, 188, 156, ' + alpha + ')';
    }
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  // 主题色加深/变浅，用于 hover 等状态
  function shadeColor(hex, percent) {
    if (!hex) return '#16a085';
    let h = String(hex).replace('#', '').trim();
    if (h.length === 3) {
      h = h.split('').map(c => c + c).join('');
    }
    if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return hex;
    const adjust = (v) => Math.max(0, Math.min(255, Math.round(v + (255 * percent / 100))));
    const r = adjust(parseInt(h.substring(0, 2), 16));
    const g = adjust(parseInt(h.substring(2, 4), 16));
    const b = adjust(parseInt(h.substring(4, 6), 16));
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  // 格式化富文本：支持无需写 HTML 的可视化标记 ==重点== 以及 **加粗**，同时兼容安全 HTML
  function formatRichText(str) {
    if (!str) return '';
    let res = String(str)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // 支持简易双等号高亮标记：==重点文字== -> <mark>重点文字</mark>
    res = res.replace(/==(.*?)==/g, '<mark>$1</mark>');
    // 支持简易双星号加粗标记：**加粗文字** -> <b>加粗文字</b>
    res = res.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    return res;
  }

  // 渲染技能图标：优先品牌 Logo 图片（官方彩色原色展示），其次字体图标类名
  function renderSkillIcon(sk) {
    if (!sk) return '';
    const logo = sk.logo || '';
    if (logo && looksLikeUrl(logo)) {
      // 官方彩色 Logo：直接以原色 <img> 展示，不随主题色变化
      return `<img class="skill-logo-img" src="${escapeHtml(logo)}" alt="" loading="lazy" onerror="this.style.display='none'">`;
    }
    const legacyIcon = sk.logo || sk.icon || '';
    if (legacyIcon) {
      return `<i class="${escapeHtml(legacyIcon)}" aria-hidden="true"></i>`;
    }
    return '';
  }

  function looksLikeUrl(val) {
    if (!val) return false;
    const v = String(val).trim();
    // 支持外链 / 本地上传 / 站内静态图标 / dataURI / 带图片扩展名的相对路径
    return /^(https?:)?\/\//i.test(v)
      || v.startsWith('/uploads/')
      || v.startsWith('/assets/')
      || v.startsWith('assets/')
      || v.startsWith('data:')
      || /\.(png|jpe?g|gif|svg|webp|ico)(\?.*)?$/i.test(v);
  }

  async function loadResume() {
    // 1) 优先尝试后端 API（本地 node server.js 运行时走这条，功能最全）
    try {
      const res = await fetch('/api/resume?t=' + Date.now());
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          renderResume(json.data);
          return;
        }
      }
    } catch (e) {
      // 纯静态环境（无 Node 服务器），继续走下面的降级逻辑
    }

    // 2) 静态模式：优先读取浏览器本地已保存的修改（后台在静态环境下保存到 localStorage）
    try {
      const raw = localStorage.getItem('resume_data_v1');
      if (raw) {
        renderResume(JSON.parse(raw));
        return;
      }
    } catch (e) { /* ignore */ }

    // 3) 静态模式：读取静态打包的 data.json
    try {
      const res2 = await fetch('data.json?t=' + Date.now());
      if (res2.ok) {
        const data = await res2.json();
        renderResume(data);
        return;
      }
    } catch (e) { /* ignore */ }

    console.warn('未找到简历数据源，保留页面默认内容');
  }

  function renderResume(data) {
    const s = data.settings || {};
    const b = data.basic || {};
    const container = document.getElementById('resume-container');

    // 1. 设置网页标题
    if (s.title) {
      document.title = s.title;
    }

    // 2. 设置主题色（同时推导柔和背景色，保证高亮等元素与主题色完全一致）
    if (s.themeColor) {
      document.documentElement.style.setProperty('--primary-color', s.themeColor);
      document.documentElement.style.setProperty('--primary-light', hexToRgba(s.themeColor, 0.13));
      document.documentElement.style.setProperty('--primary-hover', shadeColor(s.themeColor, -12));
    }

    // 应用简历模板风格（classic/modern/ink/serif/vitality/timeline/banner/sidebar）
    document.body.setAttribute('data-template', s.template || 'classic');

    // 为每个章节 h2 写入 data-title（timeline 等模板用圆形节点替代标题时读取）
    document.querySelectorAll('#resume-container .info-unit > h2').forEach(h2 => {
      const clone = h2.cloneNode(true);
      clone.querySelectorAll('i').forEach(i => i.remove());
      const t = (clone.textContent || '').trim();
      if (t) {
        h2.setAttribute('data-title', t);
        h2.closest('.info-unit').setAttribute('data-section-title', t);
      }
    });

    // 动态载入配置的阿里 Iconfont 字体库
    if (s.iconfontUrl) {
      let iconfontLink = document.getElementById('dynamic-iconfont-css');
      if (!iconfontLink) {
        iconfontLink = document.createElement('link');
        iconfontLink.id = 'dynamic-iconfont-css';
        iconfontLink.rel = 'stylesheet';
        document.head.appendChild(iconfontLink);
      }
      iconfontLink.href = s.iconfontUrl;
    }

    // 3. 设置布局样式 (一栏 / 两栏)
    container.classList.remove('layout-one-column', 'layout-two-column', 'side-fixed');
    if (s.layout === 'one-column') {
      container.classList.add('layout-one-column');
    } else {
      container.classList.add('layout-two-column');
      if (s.sideFixed) {
        container.classList.add('side-fixed');
      }
    }

    // 4. 判断是否开启“基本信息与联系方式排在头像右侧空白”
    const useHeaderSideBySide = s.headerSideBySide !== false;

    // 清理或创建横向头部卡片 (直接置入 container 顶部，保持整页为一份完整文档)
    let headerCard = document.getElementById('header-side-by-side-card');
    if (useHeaderSideBySide) {
      if (!headerCard) {
        headerCard = document.createElement('section');
        headerCard.id = 'header-side-by-side-card';
        headerCard.className = 'header-side-by-side-card';
        container.insertBefore(headerCard, container.firstChild);
      } else if (headerCard.parentNode !== container) {
        container.insertBefore(headerCard, container.firstChild);
      }
      headerCard.style.display = 'flex';

      // 头像 HTML (保持原图比例与形状，不做圆形截断)
      let avatarHtml = '';
      if (s.showAvatar !== false && b.avatar) {
        avatarHtml = `
          <div class="header-avatar-box">
            <img src="${escapeHtml(b.avatar)}" alt="个人照片">
          </div>
        `;
      }

      // 档案标签 HTML
      let profileTagsHtml = '';
      if (Array.isArray(data.profile) && data.profile.length > 0) {
        profileTagsHtml = `
          <div class="header-profile-tags">
            ${data.profile.map(p => `
              <span class="header-profile-tag">
                <span class="tag-label">${escapeHtml(p.label)}:</span>
                <span class="tag-val">${escapeHtml(p.value)}</span>
              </span>
            `).join('')}
          </div>
        `;
      }

      // 联系方式 HTML
      let contactItemsHtml = '';
      if (Array.isArray(data.contact) && data.contact.length > 0) {
        contactItemsHtml = `
          <div class="header-contact-list">
            ${data.contact.map(c => {
              const icon = c.icon ? `<i class="fa ${escapeHtml(c.icon)}" aria-hidden="true"></i>` : '<i class="fa fa-dot-circle-o"></i>';
              const inner = c.link
                ? `<a href="${escapeHtml(c.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.value)}</a>`
                : `<span>${escapeHtml(c.value)}</span>`;
              return `
                <div class="header-contact-item">
                  ${icon}
                  <span style="color:#64748b;">${escapeHtml(c.label)}:</span>
                  ${inner}
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      // 签名
      const sigHtml = b.signature ? `<div class="header-signature">${escapeHtml(b.signature)}</div>` : '';

      // 专业技能 HTML (一并提升到头部卡片右侧区域，紧凑徽章展示；支持品牌 Logo 图片)
      let headerSkillsHtml = '';
      if (s.showSkills !== false && Array.isArray(data.skills) && data.skills.length > 0) {
        headerSkillsHtml = `
          <div class="header-skills-row">
            <span class="header-skills-label"><i class="fa fa-code" aria-hidden="true"></i>专业技能</span>
            <span class="header-skills-tags">
              ${data.skills.map(sk => `<span class="skill-badge-tag">${renderSkillIcon(sk)}${escapeHtml(sk.name)}</span>`).join('')}
            </span>
          </div>
        `;
      }

      // 右侧二维码 HTML (直接放置在头部卡片最右侧)
      let qrCodeHtml = '';
      if (s.showQrCode !== false && data.qrcode && data.qrcode.image) {
        qrCodeHtml = `
          <div class="header-qrcode-box">
            <img src="${escapeHtml(data.qrcode.image)}" alt="二维码">
            <span class="header-qrcode-text">${escapeHtml(data.qrcode.text || '扫码在手机上查看在线简历')}</span>
          </div>
        `;
      }

      headerCard.innerHTML = `
        ${avatarHtml}
        <div class="header-content-box">
          <div class="header-title-row">
            <span class="header-name">${escapeHtml(b.name || '')}</span>
            <span class="header-job">${escapeHtml(b.jobTitle || '')}</span>
          </div>
          ${sigHtml}
          ${profileTagsHtml}
          ${contactItemsHtml}
          ${headerSkillsHtml}
        </div>
        ${qrCodeHtml}
      `;

      // 当基本信息、联系方式、专业技能与二维码并入头部卡片时，隐藏侧栏或正文中重复的区域
      const meEl = document.getElementById('section-me');
      if (meEl) meEl.style.display = 'none';
      const profileSection = document.getElementById('section-profile');
      if (profileSection) profileSection.style.display = 'none';
      const contactSection = document.getElementById('section-contact');
      if (contactSection) contactSection.style.display = 'none';
      const skillSectionHidden = document.getElementById('section-skills');
      if (skillSectionHidden) skillSectionHidden.style.display = 'none';
      const qrSection = document.getElementById('section-qrcode');
      if (qrSection) qrSection.style.display = 'none';

    } else {
      if (headerCard) headerCard.style.display = 'none';

      // 恢复侧边栏显示基本信息
      const meEl = document.getElementById('section-me');
      if (meEl) {
        meEl.style.display = '';
        const portrait = meEl.querySelector('.portrait');
        if (portrait) {
          if (s.showAvatar === false) {
            portrait.style.display = 'none';
          } else {
            portrait.style.display = 'flex';
            const img = portrait.querySelector('img');
            if (img && b.avatar) {
              img.src = b.avatar;
              img.style.display = 'block';
              const loading = portrait.querySelector('.loading');
              if (loading) loading.style.display = 'none';
            }
          }
        }
        const nameEl = meEl.querySelector('.name');
        if (nameEl && b.name) nameEl.textContent = b.name;
        const jobEl = meEl.querySelector('.info-job');
        if (jobEl && b.jobTitle) jobEl.textContent = b.jobTitle;

        let sigEl = meEl.querySelector('.me-signature');
        if (b.signature) {
          if (!sigEl) {
            sigEl = document.createElement('p');
            sigEl.className = 'me-signature';
            meEl.appendChild(sigEl);
          }
          sigEl.textContent = b.signature;
        } else if (sigEl) {
          sigEl.remove();
        }
      }

      // 渲染档案资料 (Profile)
      const profileSection = document.getElementById('section-profile');
      if (profileSection) {
        const ul = profileSection.querySelector('ul');
        if (ul && Array.isArray(data.profile)) {
          ul.innerHTML = data.profile.map(p => `
            <li>
              <label>${escapeHtml(p.label)}</label>
              <span>${escapeHtml(p.value)}</span>
            </li>
          `).join('');
        }
        profileSection.style.display = (data.profile && data.profile.length > 0) ? '' : 'none';
      }

      // 渲染联系方式 (Contact)
      const contactSection = document.getElementById('section-contact');
      if (contactSection) {
        const ul = contactSection.querySelector('ul');
        if (ul && Array.isArray(data.contact)) {
          ul.innerHTML = data.contact.map(c => {
            const icon = c.icon ? `<i class="fa ${escapeHtml(c.icon)}" aria-hidden="true"></i>` : '';
            const inner = c.link
              ? `<a href="${escapeHtml(c.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.value)}</a>`
              : `<span>${escapeHtml(c.value)}</span>`;
            return `
              <li>
                <label>${icon}${escapeHtml(c.label)}</label>
                ${inner}
              </li>
            `;
          }).join('');
        }
        contactSection.style.display = (data.contact && data.contact.length > 0) ? '' : 'none';
      }
    }

    // 5. 渲染技能特长 (Skills) - 支持移除进度条（现代标签徽章模式 vs 进度条模式）
    const skillSection = document.getElementById('section-skills');
    // 若已并入顶部头部卡片，正文不再重复渲染技能模块
    if (useHeaderSideBySide) {
      if (skillSection) skillSection.style.display = 'none';
    } else if (skillSection) {
      if (s.showSkills === false || !data.skills || data.skills.length === 0) {
        skillSection.style.display = 'none';
      } else {
        skillSection.style.display = '';
        const isBarMode = s.skillMode === 'bars';

        if (isBarMode) {
          // 经典百分比进度条模式
          skillSection.innerHTML = `
            <h2><i class="fa fa-code" aria-hidden="true"></i>技能特长</h2>
            <hr/>
            <ul>
              ${data.skills.map(sk => `
                <li>
                  <label>${renderSkillIcon(sk)}${escapeHtml(sk.name)}</label>
                  <progress value="${parseInt(sk.level, 10) || 80}" max="100"></progress>
                </li>
              `).join('')}
            </ul>
          `;
        } else {
          // 现代标签徽章模式（无进度条，清爽专业；支持品牌 Logo / 字体图标）
          skillSection.innerHTML = `
            <h2><i class="fa fa-code" aria-hidden="true"></i>专业技能</h2>
            <hr/>
            <div class="skills-tags-container">
              ${data.skills.map(sk => `
                <span class="skill-badge-tag">${renderSkillIcon(sk)}${escapeHtml(sk.name)}</span>
              `).join('')}
            </div>
          `;
        }
      }
    }

    // 6. 渲染二维码 (QR Code) - 若头部已显示二维码，则正文中无需重复出现
    const qrSection = document.getElementById('section-qrcode');
    if (useHeaderSideBySide) {
      if (qrSection) qrSection.style.display = 'none';
    } else {
      const mainEl = document.querySelector('.container .main');
      const sideEl = document.getElementById('side');

      if (s.layout === 'one-column' && qrSection && mainEl) {
        mainEl.appendChild(qrSection);
      } else if (qrSection && sideEl && qrSection.parentNode !== sideEl) {
        sideEl.appendChild(qrSection);
      }

      if (qrSection) {
        const q = data.qrcode || {};
        if (s.showQrCode === false || !q.image) {
          qrSection.style.display = 'none';
        } else {
          qrSection.style.display = '';
          const img = qrSection.querySelector('img');
          if (img) img.src = q.image;
          let pText = qrSection.querySelector('.qr-text');
          if (q.text) {
            if (!pText) {
              pText = document.createElement('p');
              pText.className = 'qr-text';
              pText.style.cssText = 'text-align: center; font-size: 12px; color: #888; margin-top: 4px;';
              qrSection.appendChild(pText);
            }
            pText.textContent = q.text;
          } else if (pText) {
            pText.remove();
          }
        }
      }
    }

    // 7. 渲染教育经历 (Education)
    const eduSection = document.getElementById('section-edu');
    if (eduSection) {
      if (s.showEducation === false || !data.education || data.education.length === 0) {
        eduSection.style.display = 'none';
      } else {
        eduSection.style.display = '';
        const ul = eduSection.querySelector('ul');
        if (ul && Array.isArray(data.education)) {
          ul.innerHTML = data.education.map(ed => {
            const titleText = ed.college
              ? `${escapeHtml(ed.school)} · ${escapeHtml(ed.college)} - ${escapeHtml(ed.major)}`
              : `${escapeHtml(ed.school)} - ${escapeHtml(ed.major)}`;
            // 保留手动换行：每行独立渲染为一段，避免被合并成一行
            const descLines = String(ed.description || '')
              .split(/\r?\n/)
              .map(line => line.trim())
              .filter(line => line.length > 0);
            const descHtml = descLines.map(line => `<p class="edu-line">${formatRichText(line)}</p>`).join('');
            return `
              <li>
                <h3>
                  <span>${titleText}</span>
                  <time>${escapeHtml(ed.time)}</time>
                </h3>
                ${descHtml}
              </li>
            `;
          }).join('');
        }
      }
    }

    // 8. 渲染工作经历 (Work Experience)
    const workSection = document.getElementById('section-work');
    if (workSection) {
      if (s.showWork === false || !data.work || data.work.length === 0) {
        workSection.style.display = 'none';
      } else {
        workSection.style.display = '';
        const ul = workSection.querySelector('ul');
        if (ul && Array.isArray(data.work)) {
          ul.innerHTML = data.work.map(w => {
            const pointsList = (Array.isArray(w.points) ? w.points : [w.points || ''])
              .filter(Boolean)
              .map(pt => `<li>${formatRichText(pt)}</li>`)
              .join('');
            return `
              <li>
                <h3>
                  <span>${escapeHtml(w.company)} － ${escapeHtml(w.role)}</span>
                  <time>${escapeHtml(w.time)}</time>
                </h3>
                <ul class="info-content">
                  ${pointsList}
                </ul>
              </li>
            `;
          }).join('');
        }
      }
    }

    // 9. 渲染项目经验 (Projects)
    const projSection = document.getElementById('section-projects');
    if (projSection) {
      if (s.showProjects === false || !data.projects || data.projects.length === 0) {
        projSection.style.display = 'none';
      } else {
        projSection.style.display = '';
        const ul = projSection.querySelector('ul');
        if (ul && Array.isArray(data.projects)) {
          ul.innerHTML = data.projects.map(pj => {
            const linkTag = pj.link ? `
              <span class="link">
                <a href="${escapeHtml(pj.link)}" target="_blank" rel="noopener noreferrer">Demo</a>
              </span>
            ` : '';

            function renderProjectField(iconCls, label, text) {
              if (!text) return '';
              const lines = String(text).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
              if (lines.length === 0) return '';
              if (lines.length === 1) {
                return `<li><i class="fa ${iconCls}" aria-hidden="true"></i> [${label}] ${formatRichText(lines[0])}</li>`;
              }
              return `
                <li class="project-detail-block">
                  <span class="detail-label"><i class="fa ${iconCls}" aria-hidden="true"></i> [${label}]</span>
                  <div class="detail-lines">
                    ${lines.map(l => `<div class="detail-line">${formatRichText(l)}</div>`).join('')}
                  </div>
                </li>
              `;
            }

            let contentHtml = '';
            if (pj.stack) {
              contentHtml += `<li>技术栈：${escapeHtml(pj.stack)}</li>`;
            }
            contentHtml += renderProjectField('fa-paper-plane-o', '目标', pj.target);
            contentHtml += renderProjectField('fa-users', '团队', pj.team);
            contentHtml += renderProjectField('fa-bars', '贡献', pj.contribution);
            contentHtml += renderProjectField('fa-thumbs-o-up', '效果', pj.effect);

            return `
              <li>
                <h3>
                  <span>${escapeHtml(pj.name)}</span>
                  ${linkTag}
                  <time>${escapeHtml(pj.time)}</time>
                </h3>
                <ul class="info-content">
                  ${contentHtml}
                </ul>
              </li>
            `;
          }).join('');
        }
      }
    }

    // 10. 渲染自我评价 (Self Evaluation)
    const evalSection = document.getElementById('section-evaluation');
    if (evalSection) {
      if (s.showEvaluation === false || !data.selfEvaluation) {
        evalSection.style.display = 'none';
      } else {
        evalSection.style.display = '';
        const p = evalSection.querySelector('p');
        if (p) {
          p.innerHTML = formatRichText(data.selfEvaluation).replace(/\n/g, '<br/>');
        }
      }
    }

    // 11. 页脚版权信息
    const footerEl = document.querySelector('footer.footer p');
    if (footerEl && s.copyright) {
      footerEl.textContent = s.copyright;
    }
  }

  // 顶部快捷控制栏（含跨页面导航）
  function setupQuickBar() {
    if (document.querySelector('.resume-quick-bar')) return;
    const bar = document.createElement('div');
    bar.className = 'resume-quick-bar';

    // 当前页面标记，用于导航高亮（前台恒为 resume）
    bar.innerHTML = `
      <span class="bar-nav-label">导航</span>
      <a class="bar-btn" href="/" title="返回赛博马里奥像素个人主页">
        <i class="fa fa-home"></i> 个人主页
      </a>
      <a class="bar-btn active" href="/resume.html" title="简历展示页（当前页）">
        <i class="fa fa-id-card-o"></i> 个人简历
      </a>
      <a class="bar-btn" href="/admin/" title="进入后台管理系统编辑简历">
        <i class="fa fa-cog"></i> 后台管理
      </a>
      <a class="bar-btn" href="/admin/jobs.html" title="查看与管理简历投递记录">
        <i class="fa fa-table"></i> 投递记录
      </a>
      <span class="bar-divider"></span>
      <button class="bar-btn" id="btn-print-resume" title="导出为单页高清 A4 PDF 简历">
        <i class="fa fa-print"></i> 导出PDF
      </button>
      <button class="bar-btn" id="btn-toggle-layout" title="切换一栏 / 两栏布局">
        <i class="fa fa-columns"></i> 切换版式
      </button>
    `;
    document.body.appendChild(bar);

    // 行距自适应：打印前测量内容高度，选择合适档位（auto/compact/tiny）
    function autoFitForPrint() {
      const container = document.getElementById('resume-container');
      if (!container) return;
      // A4 可用内容高度（297mm - 上下 6mm 边距 = 285mm），按 96dpi 折算 px（1mm ≈ 3.7795px）
      const a4ContentHeight = 285 * 3.7795;

      // 先移除旧档位再测量
      document.body.removeAttribute('data-fit');

      const measure = () => container.scrollHeight;

      // 依次尝试三档：默认 → compact → tiny
      if (measure() <= a4ContentHeight) {
        document.body.setAttribute('data-fit', 'auto');
      } else {
        document.body.setAttribute('data-fit', 'compact');
        if (measure() > a4ContentHeight) {
          document.body.setAttribute('data-fit', 'tiny');
          if (measure() > a4ContentHeight) {
            // 极端情况：tiny 也装不下，保持 tiny（CSS 已最小化）
          }
        }
      }
    }

    // 轻量 toast（仅导出反馈用）
    function quickToast(msg, type) {
      let box = document.querySelector('.resume-toast-box');
      if (!box) {
        box = document.createElement('div');
        box.className = 'resume-toast-box';
        document.body.appendChild(box);
      }
      const el = document.createElement('div');
      el.className = 'resume-toast-item ' + (type || 'info');
      el.textContent = msg;
      box.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 400);
      }, 3200);
    }

    document.getElementById('btn-print-resume').addEventListener('click', async () => {
      // 优先走服务端 PDF（Edge/Chrome headless 生成，无浏览器打印按钮残留）
      try {
        quickToast('正在生成单页 A4 PDF，请稍候...', 'info');
        const res = await fetch('/api/export/pdf?ts=' + Date.now());
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/pdf')) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = '简历-A4单页.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          quickToast('✅ PDF 已生成并开始下载（服务端渲染）', 'success');
          return;
        }
        // 服务器返回 JSON（无浏览器环境）→ 回退浏览器打印
        quickToast('服务器未配置浏览器，改用浏览器打印模式', 'info');
      } catch (e) {
        // 网络失败（静态部署环境）→ 回退浏览器打印
        quickToast('服务端不可用，改用浏览器打印模式', 'info');
      }

      // 回退：浏览器打印（先自适应行距，再加类名隐藏快捷栏）
      autoFitForPrint();
      document.body.classList.add('printing-single-page');
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove('printing-single-page');
          document.body.removeAttribute('data-fit');
        }, 1000);
      }, 150);
    });

    document.getElementById('btn-toggle-layout').addEventListener('click', () => {
      const container = document.getElementById('resume-container');
      const isOne = container.classList.contains('layout-one-column');
      if (isOne) {
        container.classList.remove('layout-one-column');
        container.classList.add('layout-two-column');
      } else {
        container.classList.remove('layout-two-column', 'side-fixed');
        container.classList.add('layout-one-column');
      }
    });
  }

  // 页面加载就绪
  document.addEventListener('DOMContentLoaded', () => {
    setupQuickBar();
    loadResume();
  });
})();
