---
name: html-prd-marker
description: Parses a Markdown PRD and annotates requirements onto an HTML prototype with interactive tooltip/popover markers. Use when the user wants to map PRD requirements to an HTML prototype, annotate an HTML mockup with product specs, or visualize which parts of a UI correspond to which requirements.
---

# HTML PRD Marker

将 Markdown 格式的 PRD 需求文档中的需求条目，以交互式弹出标注（tooltip/popover）的形式标注到 HTML 原型页面上，生成一份新的带标注 HTML 文件。

## 工作流程

### Step 1: 收集输入

向用户确认两个文件：

1. **PRD 文件**：Markdown 格式的需求文档路径
2. **HTML 原型文件**：需要标注的 HTML 原型文件路径

如果用户未提供文件路径，用 AskUserQuestion 工具询问。

### Step 2: 解析 PRD 需求

读取 Markdown PRD 文件，提取结构化需求条目。解析规则：

- 每个二级标题（`##`）或三级标题（`###`）视为一个需求模块
- 标题下方的正文段落、列表条目为该需求的具体描述
- 为每条需求生成唯一编号，格式：`REQ-001`, `REQ-002`, ...
- 提取每条需求的：标题、描述摘要、优先级（如有标注）

输出一个需求列表供后续映射使用。

### Step 3: 分析 HTML 原型

读取 HTML 原型文件，分析页面结构：

- 识别主要 UI 区域（header, nav, sidebar, main content, footer 等）
- 识别交互元素（button, input, form, link, table 等）
- 识别带有 `id` 或有意义 `class` 的元素作为标注锚点

### Step 4: 需求-元素映射

根据需求描述与 HTML 元素的语义对应关系，建立映射：

- 按需求描述中的关键词匹配页面元素（如"登录按钮" → `<button>登录</button>`）
- 按页面区域匹配功能模块（如"导航栏需求" → `<nav>` 区域）
- 无法自动匹配的需求，标注在最相关的父级容器上

**重要**：将映射结果展示给用户确认后再继续。用简洁的表格格式呈现：

```
需求编号 | 需求标题     | 标注目标元素
REQ-001 | 用户登录     | button#login-btn
REQ-002 | 搜索功能     | div.search-bar
```

### Step 5: 生成带标注的 HTML

基于映射关系，生成新的 HTML 文件。注入标注系统的方式：

1. 在 `</head>` 前注入标注所需的 CSS 样式（参考下方样式模板）
2. 在目标元素上添加标注属性和标记徽章
3. 在 `</body>` 前注入标注交互的 JS 脚本（参考下方脚本模板）

#### 标注徽章

在每个被标注元素上添加一个编号徽章：

```html
<span class="prd-marker" data-req-id="REQ-001" data-req-title="用户登录" data-req-desc="用户可通过邮箱和密码登录系统，支持记住密码功能">1</span>
```

#### 标注交互行为

- **悬停**徽章：显示需求标题的 tooltip
- **点击**徽章：显示完整需求详情的 popover 弹窗，包含编号、标题、详细描述
- **点击弹窗外部**或按 **Esc**：关闭弹窗
- 页面右上角添加一个**切换按钮**，可以显示/隐藏所有标注徽章

### Step 6: 输出文件

- 文件名格式：`原始文件名_annotated.html`
- 保存到用户工作目录或指定位置
- 使用 `present` 工具交付文件

## CSS 样式模板

将以下样式注入到生成文件的 `<head>` 中：

```css
<style>
  /* PRD 标注系统样式 */
  .prd-marker-target { position: relative; outline: 2px dashed #4F46E5 !important; outline-offset: 2px; }
  .prd-marker {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 50%;
    background: #4F46E5; color: #fff; font-size: 11px; font-weight: 700;
    cursor: pointer; position: absolute; z-index: 9999;
    box-shadow: 0 2px 6px rgba(79,70,229,.4);
    transition: transform .15s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  /* 预设静态标注定位在右上角 */
  .prd-marker:not([style*="left"]) { top: -10px; right: -10px; }
  .prd-marker:not([style*="left"]):hover { transform: scale(1.2) !important; }
  
  /* 自由打钉标注定位在中心点 */
  .prd-marker[style*="left"] { transform: translate(-50%, -50%) !important; }
  .prd-marker[style*="left"]:hover { transform: translate(-50%, -50%) scale(1.2) !important; }

  .prd-tooltip {
    display: none; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
    background: #1E1B4B; color: #fff; padding: 6px 12px; border-radius: 6px;
    font-size: 12px; white-space: nowrap; z-index: 10000; pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .prd-tooltip::after {
    content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
    border: 5px solid transparent; border-top-color: #1E1B4B;
  }
  .prd-marker:hover .prd-tooltip { display: block; }

  .prd-popover {
    display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: #fff; border-radius: 12px; padding: 24px; z-index: 10001;
    box-shadow: 0 20px 60px rgba(0,0,0,.15); max-width: 480px; width: 90%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .prd-popover.active { display: block; }
  .prd-popover-overlay {
    display: none; position: fixed; inset: 0; background: rgba(0,0,0,.3); z-index: 10000;
  }
  .prd-popover-overlay.active { display: block; }
  .prd-popover-id { font-size: 12px; color: #6366F1; font-weight: 600; margin-bottom: 4px; }
  .prd-popover-title { font-size: 18px; font-weight: 700; color: #1E1B4B; margin-bottom: 12px; }
  .prd-popover-desc { font-size: 14px; line-height: 1.6; color: #475569; }
  .prd-popover-close {
    position: absolute; top: 12px; right: 16px; background: none; border: none;
    font-size: 20px; cursor: pointer; color: #94A3B8; line-height: 1;
  }
  .prd-popover-close:hover { color: #1E1B4B; }

  /* 可视化标注编辑器及工具栏样式 */
  .prd-toolbar {
    position: fixed; top: 16px; right: 16px; z-index: 10002;
    display: flex; gap: 8px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .prd-toggle-btn {
    background: #4F46E5; color: #fff; border: none; border-radius: 8px;
    padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
    box-shadow: 0 2px 8px rgba(79,70,229,.3); transition: all 0.2s ease;
  }
  .prd-toggle-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .prd-toggle-btn:active { transform: translateY(0); }
  
  .prd-edit-active .page-content { cursor: crosshair !important; position: relative !important; }
  
  .prd-editor-dialog-overlay {
    display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); z-index: 20000;
    align-items: center; justify-content: center; backdrop-filter: blur(4px);
  }
  .prd-editor-dialog {
    background: #fff; border-radius: 12px; width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    display: flex; flex-direction: column; overflow: hidden; animation: prdScaleIn 0.2s ease-out;
  }
  @keyframes prdScaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  
  .prd-editor-dialog-header {
    padding: 16px 20px; border-bottom: 1px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center;
    font-weight: 700; font-size: 16px; color: #1E293B;
  }
  .prd-editor-dialog-close { background: none; border: none; font-size: 22px; cursor: pointer; color: #94A3B8; line-height: 1; }
  .prd-editor-dialog-close:hover { color: #1E293B; }
  .prd-editor-dialog-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
  .prd-editor-field { display: flex; flex-direction: column; gap: 6px; }
  .prd-editor-field label { font-size: 13px; font-weight: 600; color: #475569; }
  .prd-editor-field input, .prd-editor-field textarea {
    padding: 8px 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; outline: none;
    font-family: inherit; color: #1E293B;
  }
  .prd-editor-field input:focus, .prd-editor-field textarea:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
  .prd-editor-field textarea { min-height: 80px; resize: vertical; }
  .prd-editor-dialog-footer {
    padding: 16px 20px; border-top: 1px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center;
    background: #F8FAFC;
  }
  .prd-editor-btn {
    padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;
    border: 1px solid #CBD5E1; background: #fff; color: #475569; transition: all 0.15s ease;
  }
  .prd-editor-btn:hover { background: #F1F5F9; color: #1E293B; }
  .prd-editor-btn-primary { background: #3B82F6; border-color: #3B82F6; color: #fff; }
  .prd-editor-btn-primary:hover { background: #2563EB; color: #fff; }
  .prd-editor-btn-delete { background: #EF4444; border-color: #EF4444; color: #fff; }
  .prd-editor-btn-delete:hover { background: #DC2626; color: #fff; }

  .prd-unmapped-section {
    margin-top: 40px; padding: 24px; border: 1px dashed #E2E8F0; border-radius: 8px;
    background: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .prd-unmapped-section h3 { font-size: 16px; font-weight: 700; color: #475569; margin-bottom: 12px; }
  .prd-unmapped-section ul { padding-left: 20px; }
  .prd-unmapped-section li { font-size: 14px; line-height: 1.8; color: #64748B; }
  .prd-markers-hidden .prd-marker { display: none !important; }
  .prd-markers-hidden .prd-marker-target { outline: none !important; }
</style>
```

## JS 脚本模板

将以下脚本注入到 `</body>` 前：

```html
<script>
(function() {
  // 1. 注入弹窗与遮罩层
  const overlay = document.createElement('div');
  overlay.className = 'prd-popover-overlay';
  const popover = document.createElement('div');
  popover.className = 'prd-popover';
  document.body.appendChild(overlay);
  document.body.appendChild(popover);

  // 2. 注入标注编辑器骨架
  const editorOverlay = document.createElement('div');
  editorOverlay.className = 'prd-editor-dialog-overlay';
  editorOverlay.innerHTML = `
    <div class="prd-editor-dialog">
        <div class="prd-editor-dialog-header">
            <span id="prdEditorTitle">编辑备注</span>
            <button class="prd-editor-dialog-close">&times;</button>
        </div>
        <div class="prd-editor-dialog-body">
            <div class="prd-editor-field">
                <label>备注编号</label>
                <input type="text" id="prdEditId" placeholder="例如: REQ-001">
            </div>
            <div class="prd-editor-field">
                <label>备注名称 (Tooltip 显示)</label>
                <input type="text" id="prdEditTitle" placeholder="请输入简短名称">
            </div>
            <div class="prd-editor-field">
                <label>详细描述 (Popover 显示)</label>
                <textarea id="prdEditDesc" placeholder="请输入详细业务规则描述..."></textarea>
            </div>
        </div>
        <div class="prd-editor-dialog-footer">
            <button class="prd-editor-btn prd-editor-btn-delete" id="prdEditDeleteBtn">删除标注</button>
            <div style="display:flex; gap: 8px;">
                <button class="prd-editor-btn" id="prdEditCancelBtn">取消</button>
                <button class="prd-editor-btn prd-editor-btn-primary" id="prdEditSaveBtn">保存</button>
            </div>
        </div>
    </div>
  `;
  document.body.appendChild(editorOverlay);

  // 核心变量
  let isEditMode = false;
  let isVisible = true;
  let currentTargetElement = null;
  let currentEditingMarker = null;
  let clickX = 0;
  let clickY = 0;

  // 编辑器 DOM 引用
  const editorTitle = editorOverlay.querySelector('#prdEditorTitle');
  const editId = editorOverlay.querySelector('#prdEditId');
  const editTitle = editorOverlay.querySelector('#prdEditTitle');
  const editDesc = editorOverlay.querySelector('#prdEditDesc');
  const deleteBtn = editorOverlay.querySelector('#prdEditDeleteBtn');
  const cancelBtn = editorOverlay.querySelector('#prdEditCancelBtn');
  const saveBtn = editorOverlay.querySelector('#prdEditSaveBtn');
  const closeBtn = editorOverlay.querySelector('.prd-editor-dialog-close');

  // 3. 注入工具栏
  const toolbar = document.createElement('div');
  toolbar.className = 'prd-toolbar';
  
  const editModeBtn = document.createElement('button');
  editModeBtn.className = 'prd-toggle-btn';
  editModeBtn.style.backgroundColor = '#10B981';
  editModeBtn.textContent = '进入编辑模式';
  
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'prd-toggle-btn';
  toggleBtn.textContent = '隐藏标注';

  const exportBtn = document.createElement('button');
  exportBtn.className = 'prd-toggle-btn';
  exportBtn.style.backgroundColor = '#F59E0B';
  exportBtn.textContent = '导出 HTML';

  toolbar.appendChild(editModeBtn);
  toolbar.appendChild(toggleBtn);
  toolbar.appendChild(exportBtn);
  document.body.appendChild(toolbar);

  // 确保滚动容器为 relative 定位以作为绝对坐标的参照物
  const pageContent = document.querySelector('.page-content');
  if (pageContent) {
    pageContent.style.position = 'relative';
  }

  // 绑定已有标注点击事件
  function setupMarkerListeners(marker) {
    // 避免事件重复绑定，克隆替换元素
    const clone = marker.cloneNode(true);
    marker.parentNode.replaceChild(clone, marker);
    
    clone.addEventListener('click', function(e) {
      e.stopPropagation();
      if (isEditMode) {
        openEditor(this.parentNode, this);
      } else {
        showPopover(this);
      }
    });
  }

  function initMarkers() {
    document.querySelectorAll('.prd-marker').forEach(setupMarkerListeners);
  }
  initMarkers();

  // 查看弹窗逻辑
  function showPopover(marker) {
    const id = marker.getAttribute('data-req-id');
    const title = marker.getAttribute('data-req-title');
    const desc = marker.getAttribute('data-req-desc');
    popover.innerHTML = '';
    
    const popoverClose = document.createElement('button');
    popoverClose.className = 'prd-popover-close';
    popoverClose.innerHTML = '&times;';
    popoverClose.addEventListener('click', closePopover);
    
    const idDiv = document.createElement('div');
    idDiv.className = 'prd-popover-id';
    idDiv.textContent = id;
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'prd-popover-title';
    titleDiv.textContent = title;
    
    const descDiv = document.createElement('div');
    descDiv.className = 'prd-popover-desc';
    descDiv.textContent = desc;
    
    popover.appendChild(popoverClose);
    popover.appendChild(idDiv);
    popover.appendChild(titleDiv);
    popover.appendChild(descDiv);
    popover.classList.add('active');
    overlay.classList.add('active');
  }

  function closePopover() {
    popover.classList.remove('active');
    overlay.classList.remove('active');
  }

  overlay.addEventListener('click', closePopover);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closePopover();
      closeEditor();
    }
  });

  // 工具栏事件：显示/隐藏
  toggleBtn.addEventListener('click', function() {
    isVisible = !isVisible;
    document.body.classList.toggle('prd-markers-hidden', !isVisible);
    toggleBtn.textContent = isVisible ? '隐藏标注' : '显示标注';
  });

  // 工具栏事件：进入/退出编辑模式
  editModeBtn.addEventListener('click', function() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('prd-edit-active', isEditMode);
    editModeBtn.textContent = isEditMode ? '退出编辑模式' : '进入编辑模式';
    editModeBtn.style.backgroundColor = isEditMode ? '#EF4444' : '#10B981';
    
    if (isEditMode) {
      if (!isVisible) {
        isVisible = true;
        document.body.classList.remove('prd-markers-hidden');
        toggleBtn.textContent = '隐藏标注';
      }
      showToast('已进入打钉编辑模式。单击页面任意位置打钉添加产品标注，点击已有标注可修改/删除。');
    } else {
      closeEditor();
    }
  });

  // 提示信息
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#1E293B;color:#fff;padding:8px 16px;border-radius:6px;font-size:13px;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,0.15);pointer-events:none;font-family:sans-serif;';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // 编辑模式捕获页面容器点击
  document.addEventListener('click', function(e) {
    if (!isEditMode) return;
    
    // 忽略工具栏、编辑器弹窗、Popover、标注徽章自身的点击
    if (e.target.closest('.prd-toolbar') || 
        e.target.closest('.prd-editor-dialog') || 
        e.target.closest('.prd-popover') || 
        e.target.classList.contains('prd-marker') || 
        e.target.classList.contains('prd-tooltip')) {
      return;
    }
    
    const pContent = document.querySelector('.page-content');
    if (!pContent || !pContent.contains(e.target)) return;

    e.preventDefault();
    e.stopPropagation();

    // 动态计算相对滚动容器的绝对定位坐标
    const rect = pContent.getBoundingClientRect();
    const x = e.clientX - rect.left + pContent.scrollLeft;
    const y = e.clientY - rect.top + pContent.scrollTop;

    openEditor(pContent, null, x, y);
  }, true);

  // 编辑器操作
  function openEditor(element, marker = null, x = 0, y = 0) {
    currentTargetElement = element;
    currentEditingMarker = marker;
    clickX = x;
    clickY = y;
    
    if (marker) {
      editorTitle.textContent = '修改备注信息';
      editId.value = marker.getAttribute('data-req-id') || '';
      editTitle.value = marker.getAttribute('data-req-title') || '';
      editDesc.value = marker.getAttribute('data-req-desc') || '';
      deleteBtn.style.display = 'block';
    } else {
      editorTitle.textContent = '新建产品备注';
      const count = document.querySelectorAll('.prd-marker').length + 1;
      editId.value = 'REQ-' + String(count).padStart(3, '0');
      editTitle.value = '';
      editDesc.value = '';
      deleteBtn.style.display = 'none';
    }
    editorOverlay.style.display = 'flex';
  }

  function closeEditor() {
    editorOverlay.style.display = 'none';
    currentTargetElement = null;
    currentEditingMarker = null;
  }

  cancelBtn.addEventListener('click', closeEditor);
  closeBtn.addEventListener('click', closeEditor);

  // 保存标注逻辑
  saveBtn.addEventListener('click', function() {
    const idVal = editId.value.trim();
    const titleVal = editTitle.value.trim();
    const descVal = editDesc.value.trim();
    
    if (!idVal || !titleVal || !descVal) {
      alert('所有字段均为必填项！');
      return;
    }

    if (currentEditingMarker) {
      currentEditingMarker.setAttribute('data-req-id', idVal);
      currentEditingMarker.setAttribute('data-req-title', titleVal);
      currentEditingMarker.setAttribute('data-req-desc', descVal);
      
      const numMatch = idVal.match(/\d+/);
      const displayNum = numMatch ? parseInt(numMatch[0]) : idVal;
      currentEditingMarker.innerHTML = displayNum + `<span class="prd-tooltip">${titleVal}</span>`;
      setupMarkerListeners(currentEditingMarker);
    } else {
      const newMarker = document.createElement('span');
      newMarker.className = 'prd-marker';
      newMarker.setAttribute('data-req-id', idVal);
      newMarker.setAttribute('data-req-title', titleVal);
      newMarker.setAttribute('data-req-desc', descVal);
      
      // 设置绝对定位坐标
      newMarker.style.left = `${clickX}px`;
      newMarker.style.top = `${clickY}px`;
      
      const numMatch = idVal.match(/\d+/);
      const displayNum = numMatch ? parseInt(numMatch[0]) : idVal;
      newMarker.innerHTML = displayNum + `<span class="prd-tooltip">${titleVal}</span>`;
      
      currentTargetElement.appendChild(newMarker);
      setupMarkerListeners(newMarker);
    }
    
    closeEditor();
    showToast('备注标注保存成功！');
  });

  // 删除标注逻辑
  deleteBtn.addEventListener('click', function() {
    if (!currentEditingMarker) return;
    if (confirm('确定要移除此项标注吗？')) {
      const parent = currentEditingMarker.parentNode;
      currentEditingMarker.remove();
      
      if (parent && parent.classList.contains('prd-marker-target') && !parent.querySelector('.prd-marker')) {
        parent.classList.remove('prd-marker-target');
      }
      
      closeEditor();
      showToast('标注已成功移除。');
    }
  });

  // 导出 HTML
  exportBtn.addEventListener('click', function() {
    // 退出编辑模式
    isEditMode = false;
    document.body.classList.remove('prd-edit-active');
    editModeBtn.textContent = '进入编辑模式';
    editModeBtn.style.backgroundColor = '#10B981';
    closeEditor();
    closePopover();

    const clone = document.documentElement.cloneNode(true);
    
    // 移除编辑相关的动态 DOM
    const clToolbar = clone.querySelector('.prd-toolbar');
    if (clToolbar) clToolbar.remove();
    const clOverlay = clone.querySelector('.prd-popover-overlay');
    if (clOverlay) clOverlay.remove();
    const clPopover = clone.querySelector('.prd-popover');
    if (clPopover) clPopover.remove();
    const clEditor = clone.querySelector('.prd-editor-dialog-overlay');
    if (clEditor) clEditor.remove();
    
    clone.classList.remove('prd-markers-hidden', 'prd-edit-active');
    const clBody = clone.querySelector('body');
    if (clBody) {
      clBody.classList.remove('prd-markers-hidden', 'prd-edit-active');
    }

    const htmlContent = '<!DOCTYPE html>\n' + clone.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    
    let filename = window.location.pathname.split('/').pop() || 'index_annotated.html';
    if (!filename.includes('_annotated')) {
      filename = filename.replace('.html', '_annotated.html');
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('带标注的原型文件已下载导出！');
  });
})();
</script>
```

## 注意事项

- 不修改原始 HTML 文件，始终生成新文件
- 保持原型页面的原有样式和功能不受影响，标注样式使用 `prd-` 前缀避免冲突
- 被标注元素需添加 `position: relative`（通过 `.prd-marker-target` 类实现）
- 如果 PRD 中存在无法映射的需求，在文件底部生成一个"未映射需求"汇总区域
- data 属性中的特殊字符需做 HTML 实体转义
- 如果检测到项目使用 React/Vue，优先使用 Data Attributes 或代码注释进行标注，严禁直接操作静态 HTML 标签。

## 参考示例

具体的输入输出示例请参考 [examples.md](examples.md)。
