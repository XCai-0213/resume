// 个人主页与门户 (Homepage) 交互与动态渲染引擎
(function () {
  'use strict';

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 默认数据保底
  let homeData = null;

  async function loadHomepageData() {
    // 1) 优先尝试后端接口
    try {
      const res = await fetch('/api/homepage?t=' + Date.now());
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          homeData = json.data;
          renderHomepage(homeData);
          return;
        }
      }
    } catch (e) { /* 静态降级 */ }

    // 2) 静态模式：优先读取 localStorage
    try {
      const local = localStorage.getItem('homepage_data_v1');
      if (local) {
        homeData = JSON.parse(local);
        renderHomepage(homeData);
        return;
      }
    } catch (e) { /* ignore */ }

    // 3) 静态模式：读取同级 data/homepage.json 或 homepage.json
    try {
      const res2 = await fetch('data/homepage.json?t=' + Date.now());
      if (res2.ok) {
        homeData = await res2.json();
        renderHomepage(homeData);
        return;
      }
    } catch (e) { /* ignore */ }

    try {
      const res3 = await fetch('homepage.json?t=' + Date.now());
      if (res3.ok) {
        homeData = await res3.json();
        renderHomepage(homeData);
        return;
      }
    } catch (e) { /* ignore */ }
  }

  function renderHomepage(data) {
    if (!data) return;
    const hero = data.hero || {};
    const about = data.about || {};
    const footer = data.footer || {};

    // 1. 设置网页标题
    if (hero.title) {
      document.title = hero.title + ' · 个人主页 & 作品门户';
    }

    // 2. 背景图渲染（马里奥像素夜景 GIF / WebP）
    const bgEl = document.getElementById('home-bg');
    if (bgEl && hero.background) {
      bgEl.style.backgroundImage = "url('" + hero.background + "')";
    }

    // 3. 左侧名片区
    const avatarImg = document.getElementById('home-avatar-img');
    if (avatarImg && hero.avatar) {
      avatarImg.src = hero.avatar;
    }
    const nameEl = document.getElementById('home-name-text');
    if (nameEl && hero.title) {
      nameEl.textContent = hero.title;
    }
    const subEl = document.getElementById('home-subtitle-text');
    if (subEl) {
      subEl.textContent = hero.subtitle || '';
      subEl.style.display = hero.subtitle ? '' : 'none';
    }
    const tagEl = document.getElementById('home-tagline-text');
    if (tagEl) {
      tagEl.textContent = hero.jobTitle || '';
      tagEl.style.display = hero.jobTitle ? '' : 'none';
    }
    const sloganEl = document.getElementById('home-slogan-text');
    if (sloganEl) {
      sloganEl.textContent = hero.slogan || '';
      sloganEl.style.display = hero.slogan ? '' : 'none';
    }

    // 4. 关于我模块
    const greetingEl = document.getElementById('about-greeting');
    if (greetingEl && about.greeting) {
      greetingEl.textContent = about.greeting;
    }
    const bioEl = document.getElementById('about-bio');
    if (bioEl && about.bio) {
      bioEl.textContent = about.bio;
    }
    const badgesBox = document.getElementById('about-badges-grid');
    if (badgesBox && Array.isArray(about.badges)) {
      badgesBox.innerHTML = about.badges.map(function (b) {
        return '<div class="about-badge-item">' +
          '<span class="about-badge-label">' + escapeHtml(b.label) + '：</span>' +
          '<span class="about-badge-val">' + escapeHtml(b.value) + '</span>' +
          '</div>';
      }).join('');
    }

    // 5. 核心战斗力模块（技能分组矩阵）
    const skillsMatrix = document.getElementById('skills-matrix');
    if (skillsMatrix && Array.isArray(data.skills)) {
      skillsMatrix.innerHTML = data.skills.map(function (cat) {
        const items = Array.isArray(cat.items) ? cat.items : [];
        const pillsHtml = items.map(function (it) {
          return '<span class="home-skill-pill">' + escapeHtml(it) + '</span>';
        }).join('');
        return '<div class="skill-category-row">' +
          '<div class="skill-category-name"><i class="fa fa-chevron-right"></i> ' + escapeHtml(cat.category) + '</div>' +
          '<div class="skill-items-wrap">' + pillsHtml + '</div>' +
          '</div>';
      }).join('');
    }

    // 6. 代表项目模块
    const projBox = document.getElementById('projects-grid');
    if (projBox && Array.isArray(data.projects)) {
      projBox.innerHTML = data.projects.map(function (p) {
        const tagHtml = p.tag ? '<span class="project-card-tag">' + escapeHtml(p.tag) + '</span>' : '';
        const linkHtml = p.link ? '<a class="project-card-link" href="' + escapeHtml(p.link) + '" target="_blank" rel="noopener"><i class="fa fa-external-link"></i> 查看详情 / 在线演示</a>' : '';
        return '<div class="project-card">' +
          '<div>' +
            '<div class="project-card-header">' +
              '<h4 class="project-card-title">' + escapeHtml(p.name) + '</h4>' +
              tagHtml +
            '</div>' +
            '<p class="project-card-desc">' + escapeHtml(p.desc) + '</p>' +
          '</div>' +
          linkHtml +
          '</div>';
      }).join('');
    }

    // 7. 社交与联系模块
    const socialBox = document.getElementById('social-links-grid');
    if (socialBox && Array.isArray(data.social)) {
      socialBox.innerHTML = data.social.map(function (s) {
        const iconCls = s.icon || 'fa fa-link';
        const isUrl = /^https?:\/\//i.test(s.link || '');
        const href = s.link || 'javascript:void(0)';
        const target = isUrl ? ' target="_blank" rel="noopener"' : '';
        return '<a class="social-card-item" href="' + escapeHtml(href) + '"' + target + '>' +
          '<i class="' + escapeHtml(iconCls) + '"></i>' +
          '<div class="social-card-meta">' +
            '<span class="social-card-name">' + escapeHtml(s.name) + '</span>' +
            '<span class="social-card-val">' + escapeHtml(s.text || s.name) + '</span>' +
          '</div>' +
          '</a>';
      }).join('');
    }

    // 8. 页脚版权
    const footerEl = document.getElementById('home-footer-text');
    if (footerEl && footer.copyright) {
      footerEl.textContent = footer.copyright;
    }

    // 9. 背景音乐初始化
    initBgmPlayer(hero.bgm, hero.bgmAutoPlay);
  }

  // 背景音乐控制器（集成 15387 音乐播放能力）
  function initBgmPlayer(audioSrc, autoPlay) {
    if (!audioSrc) return;
    const audio = document.getElementById('home-bgm-audio');
    const toggleBtn = document.getElementById('btn-toggle-music');
    const textEl = document.getElementById('music-text');
    if (!audio || !toggleBtn) return;

    audio.src = audioSrc;

    function updateState(isPlaying) {
      if (isPlaying) {
        toggleBtn.classList.add('playing');
        if (textEl) textEl.textContent = '暂停音乐';
      } else {
        toggleBtn.classList.remove('playing');
        if (textEl) textEl.textContent = '背景音乐';
      }
    }

    toggleBtn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().then(function () {
          updateState(true);
        }).catch(function (err) {
          console.warn('播放失败（需用户交互触发）:', err);
        });
      } else {
        audio.pause();
        updateState(false);
      }
    });

    audio.addEventListener('play', function () { updateState(true); });
    audio.addEventListener('pause', function () { updateState(false); });

    // 若配置了自动播放，尝试播放（部分浏览器限制静音自动播放）
    if (autoPlay) {
      audio.play().catch(function () {
        // 浏览器策略拦截则静默等待用户点击
      });
    }
  }

  document.addEventListener('DOMContentLoaded', loadHomepageData);
})();
