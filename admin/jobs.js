/* 简历投递记录管理 - 交互逻辑 */
(function () {
  'use strict';

  let state = {
    columns: [],
    rows: [],
    search: '',
    dirty: false
  };

  const STATUS_OPTIONS = ['未投递', '已投递', '笔试中', '面试中', '已offer', '已拒绝', '已放弃'];

  // ============ 工具函数 ============
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showToast(msg, type) {
    const box = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast ' + (type || 'success');
    const icon = type === 'error' ? 'exclamation-circle' : (type === 'info' ? 'info-circle' : 'check-circle');
    el.innerHTML = '<i class="fa fa-' + icon + '"></i><span>' + escapeHtml(msg) + '</span>';
    box.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'all .3s';
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      setTimeout(function () { el.remove(); }, 300);
    }, 2600);
  }

  function todayISO() {
    const d = new Date();
    const p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function newId() {
    return 'job_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  // ============ 数据加载与保存（自动兼容静态部署）============
  async function loadData() {
    try {
      const json = await STATIC_API.loadJobs();
      if (json.success && json.data) {
        state.columns = json.data.columns || [];
        state.rows = json.data.rows || [];
        renderColumnsPanel();
        renderTable();
        if (json.data.rows && json.data.rows.length && !json.static) {
          // 服务端模式正常
        }
      } else {
        showToast('加载失败：' + (json.error || '未知错误'), 'error');
      }
    } catch (e) {
      showToast('加载失败：' + e.message, 'error');
    }
  }

  async function saveData(silent) {
    try {
      const json = await STATIC_API.saveJobs({ columns: state.columns, rows: state.rows });
      if (json.success) {
        state.dirty = false;
        if (!silent) {
          showToast(json.static
            ? ('已保存 ' + json.count + ' 条到浏览器本地（点「导出 Excel」可下载备份）')
            : ('已保存 ' + json.count + ' 条投递记录'));
        }
      } else {
        showToast('保存失败：' + (json.error || ''), 'error');
      }
    } catch (e) {
      showToast('保存失败：' + e.message, 'error');
    }
  }

  // ============ 列显示面板 ============
  function renderColumnsPanel() {
    const box = document.getElementById('columns-checkboxes');
    box.innerHTML = state.columns.map(function (col) {
      return '<label>' +
        '<input type="checkbox" data-col="' + escapeHtml(col.key) + '"' + (col.visible !== false ? ' checked' : '') + '>' +
        escapeHtml(col.label) +
        '</label>';
    }).join('');

    box.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        const key = cb.getAttribute('data-col');
        const col = state.columns.find(function (c) { return c.key === key; });
        if (col) {
          col.visible = cb.checked;
          renderTable();
        }
      });
    });
  }

  // ============ 表格渲染 ============
  function getVisibleColumns() {
    return state.columns.filter(function (c) { return c.visible !== false; });
  }

  function getFilteredRows() {
    const kw = state.search.trim().toLowerCase();
    if (!kw) return state.rows;
    return state.rows.filter(function (row) {
      return state.columns.some(function (col) {
        return String(row[col.key] || '').toLowerCase().indexOf(kw) !== -1;
      });
    });
  }

  function updateStats() {
    const total = state.rows.length;
    const pending = state.rows.filter(function (r) { return (r.status || '未投递') === '未投递'; }).length;
    const sent = total - pending;
    document.getElementById('stat-total').textContent = '共 ' + total + ' 条';
    document.getElementById('stat-pending').textContent = '未投递 ' + pending;
    document.getElementById('stat-sent').textContent = '已推进 ' + sent;
  }

  // 列头图标（Hexo 风格的小图标点缀）
  const COL_ICONS = {
    company: 'fa-building-o',
    companyType: 'fa-tag',
    industry: 'fa-sitemap',
    batch: 'fa-calendar',
    target: 'fa-users',
    location: 'fa-map-marker',
    position: 'fa-briefcase',
    status: 'fa-flag-o',
    updatedAt: 'fa-clock-o',
    deadline: 'fa-hourglass-end',
    link: 'fa-link',
    announcement: 'fa-bullhorn',
    writtenTest: 'fa-pencil-square-o',
    scale: 'fa-bar-chart',
    note: 'fa-comment-o'
  };

  function renderTable() {
    const cols = getVisibleColumns();
    const rows = getFilteredRows();

    // 表头（带图标）
    const thead = document.getElementById('jobs-thead');
    thead.innerHTML = '<tr>' +
      cols.map(function (col) {
        const icon = COL_ICONS[col.key] ? '<i class="fa ' + COL_ICONS[col.key] + '" style="opacity:.55;font-size:12px;"></i>' : '';
        return '<th style="min-width:' + (col.width || 120) + 'px;">' +
          '<div class="th-inner">' + icon + escapeHtml(col.label) + '</div></th>';
      }).join('') +
      '<th style="min-width:84px;text-align:center;">操作</th></tr>';

    // 表体
    const tbody = document.getElementById('jobs-tbody');
    const emptyEl = document.getElementById('empty-state');

    if (rows.length === 0) {
      tbody.innerHTML = '';
      emptyEl.style.display = 'block';
      updateStats();
      return;
    }
    emptyEl.style.display = 'none';

    tbody.innerHTML = rows.map(function (row) {
      const realIndex = state.rows.indexOf(row);
      const cells = cols.map(function (col) {
        return '<td>' + renderCell(row, col, realIndex) + '</td>';
      }).join('');
      return '<tr data-row-id="' + escapeHtml(row.id) + '">' + cells +
        '<td class="row-actions" style="text-align:center;">' +
        '<button class="icon-btn" data-act="dup" title="复制此行"><i class="fa fa-copy"></i></button> ' +
        '<button class="icon-btn del" data-act="del" title="删除此行"><i class="fa fa-trash-o"></i></button>' +
        '</td></tr>';
    }).join('');

    bindTableEvents();
    updateStats();
  }

  function renderCell(row, col, rowIndex) {
    const val = row[col.key] === undefined || row[col.key] === null ? '' : String(row[col.key]);

    // 状态列 → 下拉选择
    if (col.type === 'status') {
      const cur = val || '未投递';
      return '<select class="status-select status-' + escapeHtml(cur) + '" data-key="' + escapeHtml(col.key) + '">' +
        STATUS_OPTIONS.map(function (s) {
          return '<option value="' + s + '"' + (s === cur ? ' selected' : '') + '>' + s + '</option>';
        }).join('') + '</select>';
    }

    // 链接列 → 可点击打开
    if (col.type === 'link') {
      const hasLink = /^https?:\/\//i.test(val);
      return '<input class="cell-input" data-key="' + escapeHtml(col.key) + '" value="' + escapeHtml(val) + '" placeholder="链接">' +
        (hasLink ? '<a href="' + escapeHtml(val) + '" target="_blank" rel="noopener" style="font-size:11px;color:#2563eb;display:block;margin-top:2px;"><i class="fa fa-external-link"></i> 打开</a>' : '');
    }

    // 标签列 → 着色显示 + 仍可编辑
    if (col.type === 'tag') {
      const cls = tagClass(val);
      return '<input class="cell-input type-tag ' + cls + '" data-key="' + escapeHtml(col.key) + '" value="' + escapeHtml(val) + '" style="min-width:70px;">';
    }

    // 长文本列（岗位、地点、备注）→ textarea
    if (col.key === 'position' || col.key === 'location' || col.key === 'note') {
      return '<textarea class="cell-input" data-key="' + escapeHtml(col.key) + '" rows="2" placeholder="' + escapeHtml(col.label) + '">' + escapeHtml(val) + '</textarea>';
    }

    // 默认 → 输入框
    return '<input class="cell-input" data-key="' + escapeHtml(col.key) + '" value="' + escapeHtml(val) + '" placeholder="' + escapeHtml(col.label) + '">';
  }

  function tagClass(val) {
    if (!val) return 'tag-default';
    if (/央国企|国企|央企/.test(val)) return 'tag-央国企';
    if (/银行|金融/.test(val)) return 'tag-银行';
    if (/秋招/.test(val)) return 'tag-秋招';
    if (/春招/.test(val)) return 'tag-春招';
    if (/实习/.test(val)) return 'tag-实习';
    if (/届/.test(val)) return 'tag-target';
    return 'tag-default';
  }

  // ============ 表格事件绑定 ============
  function bindTableEvents() {
    const tbody = document.getElementById('jobs-tbody');

    // 单元格编辑
    tbody.querySelectorAll('.cell-input').forEach(function (el) {
      el.addEventListener('input', function () {
        const tr = el.closest('tr');
        const rowId = tr.getAttribute('data-row-id');
        const row = state.rows.find(function (r) { return r.id === rowId; });
        if (!row) return;
        row[el.getAttribute('data-key')] = el.value;
        row.updatedAt = todayISO();
        state.dirty = true;
        updateStats();
      });
      // 标签列实时更新颜色
      if (el.classList.contains('type-tag')) {
        el.addEventListener('blur', function () {
          const cls = tagClass(el.value);
          el.className = 'cell-input type-tag ' + cls;
        });
      }
    });

    // 状态下拉
    tbody.querySelectorAll('.status-select').forEach(function (sel) {
      sel.addEventListener('change', function () {
        const tr = sel.closest('tr');
        const rowId = tr.getAttribute('data-row-id');
        const row = state.rows.find(function (r) { return r.id === rowId; });
        if (!row) return;
        row.status = sel.value;
        row.updatedAt = todayISO();
        sel.className = 'status-select status-' + sel.value;
        state.dirty = true;
        updateStats();
      });
    });

    // 行操作按钮
    tbody.querySelectorAll('[data-act]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const tr = btn.closest('tr');
        const rowId = tr.getAttribute('data-row-id');
        const idx = state.rows.findIndex(function (r) { return r.id === rowId; });
        if (idx === -1) return;
        const act = btn.getAttribute('data-act');

        if (act === 'del') {
          if (!confirm('确定删除这条投递记录吗？')) return;
          state.rows.splice(idx, 1);
          state.dirty = true;
          renderTable();
          showToast('已删除该记录', 'info');
        } else if (act === 'dup') {
          const copy = Object.assign({}, state.rows[idx]);
          copy.id = newId();
          copy.createdAt = todayISO();
          copy.updatedAt = todayISO();
          state.rows.splice(idx + 1, 0, copy);
          state.dirty = true;
          renderTable();
          showToast('已复制该记录', 'info');
        }
      });
    });
  }

  // ============ 新增记录 ============
  function addRow() {
    const row = { id: newId(), createdAt: todayISO(), updatedAt: todayISO(), status: '未投递' };
    state.columns.forEach(function (c) { row[c.key] = ''; });
    row.status = '未投递';
    state.rows.unshift(row);
    state.dirty = true;
    renderTable();

    // 滚动到顶部并聚焦第一行首个输入框
    const scroll = document.getElementById('table-scroll');
    scroll.scrollTop = 0;
    const firstInput = document.querySelector('#jobs-tbody tr:first-child .cell-input');
    if (firstInput) firstInput.focus();
    showToast('已新增一行，请填写后点击保存', 'info');
  }

  // ============ 粘贴导入 ============
  function openImportModal() {
    document.getElementById('import-modal').classList.add('open');
    document.getElementById('import-textarea').value = '';
    setTimeout(function () {
      document.getElementById('import-textarea').focus();
    }, 100);
  }

  function closeImportModal() {
    document.getElementById('import-modal').classList.remove('open');
  }

  async function doImport() {
    const text = document.getElementById('import-textarea').value;
    if (!text.trim()) {
      showToast('请先粘贴表格内容', 'error');
      return;
    }
    try {
      const json = await STATIC_API.parseJobsText(text);
      if (!json.success) {
        showToast('解析失败：' + (json.error || ''), 'error');
        return;
      }
      if (json.count === 0) {
        showToast('未能识别出有效数据行，请确认复制的是表格内容', 'error');
        return;
      }
      const append = document.getElementById('import-append').checked;
      if (append) {
        state.rows = state.rows.concat(json.rows);
      } else {
        state.rows = json.rows;
      }
      state.dirty = true;
      renderTable();
      closeImportModal();
      showToast('成功导入 ' + json.count + ' 条记录，请点击保存');
    } catch (e) {
      showToast('导入失败：' + e.message, 'error');
    }
  }

  // ============ CSV 文件导入（本地解析，不上传） ============
  function importCsvFile(file) {
    const reader = new FileReader();
    reader.onload = function () {
      const text = String(reader.result || '');
      STATIC_API.parseJobsText(text).then(function (json) {
        if (json.success && json.count > 0) {
          state.rows = state.rows.concat(json.rows);
          state.dirty = true;
          renderTable();
          showToast('从文件导入 ' + json.count + ' 条记录，请点击保存');
        } else {
          showToast('文件中未识别到有效数据', 'error');
        }
      }).catch(function (e) {
        showToast('导入失败：' + e.message, 'error');
      });
    };
    reader.readAsText(file, 'UTF-8');
  }

  // ============ 初始化 ============
  function init() {
    loadData();

    // 搜索
    document.getElementById('input-search').addEventListener('input', function (e) {
      state.search = e.target.value;
      renderTable();
    });

    // 列显示面板
    document.getElementById('btn-toggle-columns').addEventListener('click', function () {
      const panel = document.getElementById('columns-panel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('btn-close-columns').addEventListener('click', function () {
      document.getElementById('columns-panel').style.display = 'none';
    });
    document.getElementById('btn-reset-columns').addEventListener('click', function () {
      state.columns.forEach(function (c) { c.visible = true; });
      renderColumnsPanel();
      renderTable();
      showToast('已恢复全部列显示', 'info');
    });

    // 新增 / 保存
    document.getElementById('btn-add-row').addEventListener('click', addRow);
    document.getElementById('btn-save-all').addEventListener('click', function () { saveData(false); });

    // 粘贴导入
    document.getElementById('btn-import-text').addEventListener('click', openImportModal);
    document.getElementById('btn-close-import').addEventListener('click', closeImportModal);
    document.getElementById('btn-cancel-import').addEventListener('click', closeImportModal);
    document.getElementById('btn-do-import').addEventListener('click', doImport);
    document.getElementById('import-modal').addEventListener('click', function (e) {
      if (e.target.id === 'import-modal') closeImportModal();
    });

    // CSV 文件导入
    document.getElementById('input-csv-file').addEventListener('change', function (e) {
      const f = e.target.files[0];
      if (f) importCsvFile(f);
      e.target.value = '';
    });

    // 导出 Excel（静态模式走本地生成，服务器模式走后端）
    document.getElementById('btn-export-csv').addEventListener('click', async function () {
      const useApi = await STATIC_API.probeApi();
      if (useApi) {
        window.location.href = '/api/jobs/export';
      } else {
        STATIC_API.exportJobsCsv(state.columns, state.rows);
        showToast('已导出 applications.csv');
      }
    });

    // 快捷键 Ctrl+S 保存
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveData(false);
      }
    });

    // 离开前提示未保存
    window.addEventListener('beforeunload', function (e) {
      if (state.dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // 自动保存（每 60 秒，若有改动）
    setInterval(function () {
      if (state.dirty) saveData(true);
    }, 60000);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
