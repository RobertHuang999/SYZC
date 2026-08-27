/**
 * 产品经理专属交互式 PRD 打点与可视化规格工作台 (In-situ PRD Writer & Visual Table Editor V6)
 * 特性：
 * 1. 纯净无边框逐行即时可视化 (无多余外框、无末尾新增按钮，真实文档质感)
 * 2. 交互式可视化表格直编 (支持直接点击单元格打字编辑，支持一键增删行列，彻底告别 Markdown 竖线管道符)
 * 3. 纯白底色 Mermaid 矢量图表引擎与动态防截断渲染 (Safe Bottom Padding + ViewBox 补偿)
 * 4. 完整多版本打点管理体系 (版本切换、新建/复制版本、上传JS并支持覆盖/追加/另存冲突处理、版本落盘)
 * 5. 右侧抽屉安全管理锁模式 (日常浏览防误触，开启管理模式后方可拖拽排序/修改序号/删除)
 * 6. 彻底移除右上角多余常驻胶囊，保留抽屉底部「查看完整PRD」与独立新网页大屏
 * 7. 大头针气泡右上角一键收起侧边栏，收起抽屉时打点气泡绝对独立保活
 * 8. 编辑器草稿暂存最小化胶囊 (折叠至右下角，随意查阅原型并一键无损恢复)
 */

(function() {
  // 当前页面标识
  // 1. 获取当前页面路径与项目隔离标识 (Project & Page Isolation)
  const fullPath = window.location.pathname || '';
  const pageKey = fullPath.split('/').pop().split('?')[0].split('#')[0] || 'admin.html';
  const projectScope = (fullPath.replace(/\/[^\/]*$/, '') || 'default_proj').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cacheKey = `prd_registry_${projectScope}_${pageKey}`;
  const cacheVersionKey = `${cacheKey}_version`;

  // 获取 prd-pin-tool.js 所在目录基准路径 (自动计算相对路径，无论项目放置在何种子目录下)
  let scriptBasePath = 'assets/';
  try {
    const scripts = document.querySelectorAll('script');
    for (let s of scripts) {
      if (s.src && s.src.includes('prd-pin-tool.js')) {
        const srcUrl = s.src.split('?')[0].split('#')[0];
        scriptBasePath = srcUrl.substring(0, srcUrl.lastIndexOf('/') + 1);
        break;
      }
    }
  } catch (e) {}
  
  // 0. 全局多语言国际化字典 (Multi-Language I18N Dictionary: 中 / 英 / 日 / 韩)
  const I18N = {
    "zh-CN": {
        "apiCheckFailedTitle": "⚠️ 未检测到本地持久化服务接口",
        "apiCheckFailedDesc": "当前原型处于【静态只读预览模式】，未检测到本地后端持久化服务（<code>POST /api/save-prd</code>）。<br><br>在此模式下无法执行<strong>【新增打点 / 排序管理 / 规约编辑】</strong>并写入本地磁盘 JS 数据文件。<br><br>如需编辑或新增，请先在终端启动本地持久化服务：",
        "apiCheckCmdGuide": "node server.js",
        "apiCheckCopyCmd": "📋 复制启动命令",
        "apiCheckCopySuccess": "✅ 已复制启动命令: node server.js",
        "apiCheckGotIt": "知道了",
        "langName": "🇨🇳 简体中文",
        "edgeText": "📌 需求打点",
        "drawerTitle": "需求规约",
        "manageOrder": "⚙️ 排序管理",
        "doneManage": "✓ 完成退出",
        "manageModeBanner": "🔧 排序与删除管理模式中...",
        "versionPill": "🏷️ 当前版本",
        "newVersion": "➕ 新建空白版本...",
        "copyVersion": "📋 复制当前版本副本...",
        "uploadVersion": "📂 上传版本数据...",
        "deleteVersion": "🗑️ 删除当前版本...",
        "searchPlaceholder": "🔍 模糊搜索需求标题 (如: 订单 / 弹窗 / 竞价)...",
        "addPinBtn": "📍 新增打点",
        "viewFullPrdBtn": "📑 查看完整PRD",
        "openNewTabBtn": "↗️ 在新网页打开",
        "exportMdBtn": "📥 导出 Markdown",
        "exportJsBtn": "💾 导出 JS 数据",
        "importVersionBtn": "📂 上传/导入版本",
        "printBtn": "🖨️ 打印 / 导出 PDF",
        "closePageBtn": "✕ 关闭网页",
        "locateBtn": "🎯 定位",
        "editBtn": "✏️ 编辑",
        "deleteBtn": "🗑️ 删除",
        "moveToBtn": "🔢 移至",
        "moveToTopBtn": "🔝 置顶",
        "moveUpBtn": "▲ 上移",
        "moveDownBtn": "▼ 下移",
        "boundComp": "已绑定组件",
        "unbound": "未绑定",
        "noPinsEmptyTip": "当前版本暂无需求点",
        "noSearchMatchTip": "未搜索到匹配的需求标题",
        "searchKeywordTip": "关键词",
        "clearSearchBtn": "清空搜索条件",
        "tocTitle": "📑 目录大纲",
        "docHeroTitleSuffix": "· 产品需求规格说明书 (PRD)",
        "docMetaPage": "页面文件",
        "docMetaVersion": "规格版本",
        "docMetaCount": "规格条目",
        "docMetaTime": "生成时间",
        "noDocContentTip": "当前版本尚未录入任何 PRD 规格",
        "editModalTitle": "编辑需求规格",
        "createModalTitle": "新建需求规格",
        "tabLive": "✨ 可视化即时直编",
        "tabRaw": "📄 纯文本源码",
        "minimizeBtn": "➖ 最小化/看页面",
        "reqTitleLabel": "需求名称",
        "reqTitlePlaceholder": "输入需求标题 (必填)",
        "reqTypeLabel": "需求类型",
        "reqTypes": {
            "业务规则": "业务规则",
            "交互逻辑": "交互逻辑",
            "数据口径": "数据口径",
            "权限规则": "权限规则",
            "异常流": "异常流",
            "UI规范": "UI规范"
        },
        "tableDropdown": "📊 插入可视化表格...",
        "mermaidDropdown": "🔄 插入流程图 (Mermaid)...",
        "templateDropdown": "📑 插入业务规约模板...",
        "tableToolbarTip": "📊 可视化表格（可直接多行打字，Shift+Enter单元格换行，Enter/Tab换行换格）",
        "addRow": "➕ 加一行",
        "addCol": "➕ 加一列",
        "delRow": "➖ 删末行",
        "delCol": "➖ 删末列",
        "delTable": "🗑️ 删表格",
        "editFlowchart": "✏️ 编辑流程图",
        "editingFlowchartCode": "🔄 正在编辑 Mermaid 流程图代码：",
        "finishRender": "✓ 完成渲染",
        "rePickBtn": "🎯 重新拾取元素",
        "tempSaveBtn": "👀 暂存并看页面",
        "cancelBtn": "取消",
        "saveBtn": "💾 保存需求",
        "editingDraftPrefix": "编辑中",
        "draftStashedTip": "草稿已暂存 · 点击继续编辑",
        "restoreEditBtn": "恢复编辑",
        "discardDraftPrompt": "确认放弃当前正在编辑的草稿吗？",
        "saveSuccessToast": "✅ 需求规约已成功保存并写入本地 JS 文件！",
        "saveFailToast": "❌ 保存失败：未检测到本地服务接口，无法写入本地磁盘 JS 文件！",
        "pinDeletedToast": "✅ 需求点已删除并同步至本地文件！",
        "reorderSuccessToast": "✅ 需求序号已成功调整并同步！",
        "rePickTip": "请在页面上点击要重新绑定的新组件！",
        "rePickSuccessToast": "组件重新绑定成功！",
        "deleteVersionConfirm": "⚠️ 危险操作：确认永久删除当前版本及其所有打点数据吗？",
        "cannotDeleteOnlyVersion": "无法删除：必须保留至少一个 PRD 规格版本！",
        "importModalTitle": "📂 导入 PRD 规格版本数据",
        "importFileLabel": "导入文件",
        "importVersionNameLabel": "指定导入版本号：",
        "conflictOverwrite": "🔴 覆盖现有版本（清空旧打点，完全替换为上传文件内容）",
        "conflictAppend": "🟢 追加合并（保留旧打点，将上传打点追加至末尾）",
        "conflictNewVer": "🔵 另存为新版本（输入新版本名称，不影响当前版本）",
        "confirmImportBtn": "确认导入并应用",
        "pickingTip": "📍 点击页面组件打标 (ESC退出)",
        "fullCollapseTip": "完全收起抽屉",
        "semiCollapseTip": "半收起为标号竖条",
        "expandDrawerTip": "展开完整抽屉",
        "noDescTip": "暂无详细描述",
        "clickToEditBlock": "点击编辑此段落",
        "clickToInputContent": "点击输入内容...",
        "dragToReorderTip": "按住拖拽排序",
        "clickToReorderTip": "点击直接修改序号",
        "moveToTopTip": "直接瞬移置顶到第 1 项",
        "moveUpTip": "上移一位",
        "moveDownTip": "下移一位",
        "collapseSidebarBtn": "📁 收起侧边栏",
        "expandSidebarBtn": "📂 展开侧边栏",
        "closeInspectBubble": "关闭当前需求框",
        "reqDoc": "需求",
        "unboundElementTip": "未绑定页面元素",
        "bold": "加粗",
        "italic": "斜体",
        "strikethrough": "删除线",
        "heading3": "三级标题",
        "heading4": "四级标题",
        "bulletList": "无序列表",
        "numberList": "有序列表",
        "taskList": "待办清单",
        "quote": "引用说明",
        "inlineCode": "行内代码",
        "codeBlock": "代码块",
        "divider": "分割线",
        "unnamedPin": "（未命名需求）",
        "itemCountUnit": "项"
    },
    "en": {
        "apiCheckFailedTitle": "⚠️ Local Persistence API Not Detected",
        "apiCheckFailedDesc": "The prototype is currently in [Static Read-Only Preview Mode]. Local persistence API (<code>POST /api/save-prd</code>) is not accessible.<br><br>Adding pins, managing order, or editing specifications cannot be saved to local disk JS files in this mode.<br><br>To enable editing, please start the local server in your terminal:",
        "apiCheckCmdGuide": "node server.js",
        "apiCheckCopyCmd": "📋 Copy Start Command",
        "apiCheckCopySuccess": "✅ Copied command: node server.js",
        "apiCheckGotIt": "Got it",
        "langName": "🇺🇸 English",
        "edgeText": "📌 PRD Pins",
        "drawerTitle": "PRD Specs",
        "manageOrder": "⚙️ Reorder Mode",
        "doneManage": "✓ Done & Exit",
        "manageModeBanner": "🔧 Reorder & Delete Management Mode Active...",
        "versionPill": "🏷️ Version",
        "newVersion": "➕ New Blank Version...",
        "copyVersion": "📋 Duplicate Version...",
        "uploadVersion": "📂 Upload Version Data...",
        "deleteVersion": "🗑️ Delete Version...",
        "searchPlaceholder": "🔍 Search PRD titles (e.g. Order / Modal / Bid)...",
        "addPinBtn": "📍 Add Pin",
        "viewFullPrdBtn": "📑 View Full PRD",
        "openNewTabBtn": "↗️ Open in New Tab",
        "exportMdBtn": "📥 Export Markdown",
        "exportJsBtn": "💾 Export JS Data",
        "importVersionBtn": "📂 Upload / Import Version",
        "printBtn": "🖨️ Print / PDF",
        "closePageBtn": "✕ Close Page",
        "locateBtn": "🎯 Locate",
        "editBtn": "✏️ Edit",
        "deleteBtn": "🗑️ Delete",
        "moveToBtn": "🔢 Move To",
        "moveToTopBtn": "🔝 Top",
        "moveUpBtn": "▲ Up",
        "moveDownBtn": "▼ Down",
        "boundComp": "Element Bound",
        "unbound": "Unbound",
        "noPinsEmptyTip": "No PRD pins found in this version",
        "noSearchMatchTip": "No matching PRD spec titles found",
        "searchKeywordTip": "Keyword",
        "clearSearchBtn": "Clear Search Filter",
        "tocTitle": "📑 Table of Contents",
        "docHeroTitleSuffix": "· Product Requirement Document (PRD)",
        "docMetaPage": "Page File",
        "docMetaVersion": "Spec Version",
        "docMetaCount": "Total Items",
        "docMetaTime": "Generated At",
        "noDocContentTip": "No PRD specifications recorded in this version yet",
        "editModalTitle": "Edit PRD Spec",
        "createModalTitle": "New PRD Spec",
        "tabLive": "✨ Visual Live Editor",
        "tabRaw": "📄 Raw Markdown",
        "minimizeBtn": "➖ Minimize / View UI",
        "reqTitleLabel": "Requirement Title",
        "reqTitlePlaceholder": "Enter requirement title (Required)",
        "reqTypeLabel": "Requirement Type",
        "reqTypes": {
            "业务规则": "Business Rule",
            "交互逻辑": "Interaction Logic",
            "数据口径": "Data Metric",
            "权限规则": "Permission Rule",
            "异常流": "Exception Flow",
            "UI规范": "UI Specification"
        },
        "tableDropdown": "📊 Insert Visual Table...",
        "mermaidDropdown": "🔄 Insert Flowchart (Mermaid)...",
        "templateDropdown": "📑 Insert Spec Template...",
        "tableToolbarTip": "📊 Visual Table (Direct cell typing, Shift+Enter for new line, Enter/Tab to navigate)",
        "addRow": "➕ Add Row",
        "addCol": "➕ Add Col",
        "delRow": "➖ Del Row",
        "delCol": "➖ Del Col",
        "delTable": "🗑️ Del Table",
        "editFlowchart": "✏️ Edit Flowchart",
        "editingFlowchartCode": "🔄 Editing Mermaid Flowchart Code:",
        "finishRender": "✓ Render Chart",
        "rePickBtn": "🎯 Re-pick Element",
        "tempSaveBtn": "👀 Stash & View Page",
        "cancelBtn": "Cancel",
        "saveBtn": "💾 Save Spec",
        "editingDraftPrefix": "Editing",
        "draftStashedTip": "Draft Stashed · Click to Resume",
        "restoreEditBtn": "Resume Edit",
        "discardDraftPrompt": "Are you sure you want to discard the active draft?",
        "saveSuccessToast": "✅ PRD specification saved and written to disk JS file!",
        "saveFailToast": "❌ Save failed: Local server not reachable!",
        "pinDeletedToast": "✅ PRD pin deleted and synced to local file!",
        "reorderSuccessToast": "✅ PRD pin reordered and synced!",
        "rePickTip": "Click on the page element you want to bind!",
        "rePickSuccessToast": "Element re-bound successfully!",
        "deleteVersionConfirm": "⚠️ Dangerous: Permanently delete this version and all its pins?",
        "cannotDeleteOnlyVersion": "Cannot delete: At least one PRD version must be kept!",
        "importModalTitle": "📂 Import PRD Version Data",
        "importFileLabel": "Import File",
        "importVersionNameLabel": "Target Version Name:",
        "conflictOverwrite": "🔴 Overwrite (Wipe existing pins and replace completely)",
        "conflictAppend": "🟢 Append & Merge (Keep old pins and append new ones)",
        "conflictNewVer": "🔵 Save as New Version (Create new version without affecting current)",
        "confirmImportBtn": "Confirm & Apply Import",
        "pickingTip": "📍 Click page element to pin (ESC to cancel)",
        "fullCollapseTip": "Fully collapse drawer",
        "semiCollapseTip": "Semi-collapse to mini badge rail",
        "expandDrawerTip": "Expand full drawer",
        "noDescTip": "No detailed description",
        "clickToEditBlock": "Click to edit paragraph",
        "clickToInputContent": "Click to type content...",
        "dragToReorderTip": "Drag to reorder",
        "clickToReorderTip": "Click to change order index",
        "moveToTopTip": "Jump directly to #1",
        "moveUpTip": "Move up 1 rank",
        "moveDownTip": "Move down 1 rank",
        "collapseSidebarBtn": "📁 Collapse Sidebar",
        "expandSidebarBtn": "📂 Expand Sidebar",
        "closeInspectBubble": "Close inspect bubble",
        "reqDoc": "Spec",
        "unboundElementTip": "No element bound",
        "bold": "Bold",
        "italic": "Italic",
        "strikethrough": "Strikethrough",
        "heading3": "Heading 3",
        "heading4": "Heading 4",
        "bulletList": "Bullet List",
        "numberList": "Numbered List",
        "taskList": "Task Checklist",
        "quote": "Quote",
        "inlineCode": "Inline Code",
        "codeBlock": "Code Block",
        "divider": "Divider",
        "unnamedPin": "(Unnamed Spec)",
        "itemCountUnit": "items"
    },
    "ja": {
        "apiCheckFailedTitle": "⚠️ ローカル永続化サービスが未検出です",
        "apiCheckFailedDesc": "現在は【静的読み取り専用プレビューモード】です。ローカル永続化API（<code>POST /api/save-prd</code>）が検出されませんでした。<br><br>このモードでは、ピンの新規追加、並び替え、仕様の編集をローカルディスクのJSファイルに保存できません。<br><br>編集を行うには、ターミナルでローカルサーバーを起動してください：",
        "apiCheckCmdGuide": "node server.js",
        "apiCheckCopyCmd": "📋 起動コマンドをコピー",
        "apiCheckCopySuccess": "✅ コマンドをコピーしました: node server.js",
        "apiCheckGotIt": "了解",
        "langName": "🇯🇵 日本語",
        "edgeText": "📌 要件ピン",
        "drawerTitle": "要件仕様 (PRD)",
        "manageOrder": "⚙️ 順序管理",
        "doneManage": "✓ 完了・終了",
        "manageModeBanner": "🔧 並べ替え・削除管理モード実行中...",
        "versionPill": "🏷️ バージョン",
        "newVersion": "➕ 新規空白バージョン...",
        "copyVersion": "📋 バージョンを複製...",
        "uploadVersion": "📂 バージョンデータをアップロード...",
        "deleteVersion": "🗑️ バージョンを削除...",
        "searchPlaceholder": "🔍 要件タイトルを曖昧検索 (注文 / モーダル / 入札)...",
        "addPinBtn": "📍 ピンを追加",
        "viewFullPrdBtn": "📑 完全PRDを表示",
        "openNewTabBtn": "↗️ 新規タブで開く",
        "exportMdBtn": "📥 Markdown出力",
        "exportJsBtn": "💾 JSデータ出力",
        "importVersionBtn": "📂 バージョンをインポート",
        "printBtn": "🖨️ 印刷 / PDF出力",
        "closePageBtn": "✕ 閉じる",
        "locateBtn": "🎯 移動",
        "editBtn": "✏️ 編集",
        "deleteBtn": "🗑️ 削除",
        "moveToBtn": "🔢 移動先",
        "moveToTopBtn": "🔝 先頭へ",
        "moveUpBtn": "▲ 上へ",
        "moveDownBtn": "▼ 下へ",
        "boundComp": "要素バインド済",
        "unbound": "未バインド",
        "noPinsEmptyTip": "このバージョンには要件ピンがありません",
        "noSearchMatchTip": "一致する要件タイトルが見つかりません",
        "searchKeywordTip": "キーワード",
        "clearSearchBtn": "検索をクリア",
        "tocTitle": "📑 目次アウトライン",
        "docHeroTitleSuffix": "· 製品要件仕様書 (PRD)",
        "docMetaPage": "ページファイル",
        "docMetaVersion": "仕様バージョン",
        "docMetaCount": "要件項目数",
        "docMetaTime": "生成日時",
        "noDocContentTip": "このバージョンにはまだPRD仕様が記録されていません",
        "editModalTitle": "要件仕様を編集",
        "createModalTitle": "新規要件仕様を作成",
        "tabLive": "✨ リアルタイム視覚編集",
        "tabRaw": "📄 Markdownソース",
        "minimizeBtn": "➖ 最小化 / 画面確認",
        "reqTitleLabel": "要件タイトル",
        "reqTitlePlaceholder": "要件タイトルを入力 (必須)",
        "reqTypeLabel": "要件タイプ",
        "reqTypes": {
            "业务规则": "ビジネスルール",
            "交互逻辑": "インタラクション",
            "数据口径": "データ仕様",
            "权限规则": "権限ルール",
            "异常流": "例外フロー",
            "UI规范": "UI仕様"
        },
        "tableDropdown": "📊 表を挿入...",
        "mermaidDropdown": "🔄 フローチャート挿入 (Mermaid)...",
        "templateDropdown": "📑 テンプレート挿入...",
        "tableToolbarTip": "📊 ビジュアルテーブル（セル内直接入力、Shift+Enterで改行、Enter/Tabで移動）",
        "addRow": "➕ 行追加",
        "addCol": "➕ 列追加",
        "delRow": "➖ 行削除",
        "delCol": "➖ 列削除",
        "delTable": "🗑️ 表削除",
        "editFlowchart": "✏️ 図を編集",
        "editingFlowchartCode": "🔄 Mermaidコードを編集中：",
        "finishRender": "✓ レンダリング完了",
        "rePickBtn": "🎯 要素を再選択",
        "tempSaveBtn": "👀 一時保存して確認",
        "cancelBtn": "キャンセル",
        "saveBtn": "💾 保存",
        "editingDraftPrefix": "編集中",
        "draftStashedTip": "下書き保存済 · クリックして再開",
        "restoreEditBtn": "編集を再開",
        "discardDraftPrompt": "現在の下書きを破棄してもよろしいですか？",
        "saveSuccessToast": "✅ 要件仕様が保存され、ローカルJSファイルに書き込まれました！",
        "saveFailToast": "❌ 保存失敗：ローカルサーバーに接続できません！",
        "pinDeletedToast": "✅ 要件ピンが削除され、同期されました！",
        "reorderSuccessToast": "✅ 要件の順序が更新されました！",
        "rePickTip": "バインドする画面要素をクリックしてください！",
        "rePickSuccessToast": "要素の再バインドが完了しました！",
        "deleteVersionConfirm": "⚠️ 警告：このバージョンとすべてのピンを完全に削除しますか？",
        "cannotDeleteOnlyVersion": "削除不可：少なくとも1つのバージョンを保持する必要があります！",
        "importModalTitle": "📂 PRDバージョンデータをインポート",
        "importFileLabel": "インポートファイル",
        "importVersionNameLabel": "対象バージョン名：",
        "conflictOverwrite": "🔴 上書き（既存ピンを消去して完全置換）",
        "conflictAppend": "🟢 追加マージ（既存ピンを保持し末尾に追加）",
        "conflictNewVer": "🔵 新規バージョンとして保存（既存に影響なし）",
        "confirmImportBtn": "インポートを適用",
        "pickingTip": "📍 画面要素をクリックしてピン留め (ESCで終了)",
        "fullCollapseTip": "ドロワーを完全に折りたたむ",
        "semiCollapseTip": "番号バーに折りたたむ",
        "expandDrawerTip": "完全なドロワーを展開",
        "noDescTip": "詳細説明はありません",
        "clickToEditBlock": "クリックして段落を編集",
        "clickToInputContent": "クリックして入力...",
        "dragToReorderTip": "ドラッグして並べ替え",
        "clickToReorderTip": "クリックして順序番号を変更",
        "moveToTopTip": "先頭（第1位）へ移動",
        "moveUpTip": "1つ上へ移動",
        "moveDownTip": "1つ下へ移動",
        "collapseSidebarBtn": "📁 サイドバーを閉じる",
        "expandSidebarBtn": "📂 サイドバーを開く",
        "closeInspectBubble": "要件ポップアップを閉じる",
        "reqDoc": "要件",
        "unboundElementTip": "要素未バインド",
        "bold": "太字",
        "italic": "斜体",
        "strikethrough": "取り消し線",
        "heading3": "見出し 3",
        "heading4": "見出し 4",
        "bulletList": "箇条書きリスト",
        "numberList": "番号付きリスト",
        "taskList": "タスクリスト",
        "quote": "引用",
        "inlineCode": "インラインコード",
        "codeBlock": "コードブロック",
        "divider": "区切り線",
        "unnamedPin": "（名称未設定要件）",
        "itemCountUnit": "件"
    },
    "ko": {
        "apiCheckFailedTitle": "⚠️ 로컬 지속성 서비스를 찾을 수 없습니다",
        "apiCheckFailedDesc": "현재 [정적 읽기 전용 미리보기 모드]입니다. 로컬 지속성 API(<code>POST /api/save-prd</code>)를 감지할 수 없습니다.<br><br>이 모드에서는 핀 추가, 순서 변경, 사양 편집 내용을 로컬 디스크 JS 파일에 저장할 수 없습니다.<br><br>편집하려면 터미널에서 로컬 서버를 먼저 시작하세요:",
        "apiCheckCmdGuide": "node server.js",
        "apiCheckCopyCmd": "📋 시작 명령 복사",
        "apiCheckCopySuccess": "✅ 명령이 복사되었습니다: node server.js",
        "apiCheckGotIt": "확인",
        "langName": "🇰🇷 한국어",
        "edgeText": "📌 요구사항 핀",
        "drawerTitle": "요구사항 규격 (PRD)",
        "manageOrder": "⚙️ 순서 관리",
        "doneManage": "✓ 완료 및 종료",
        "manageModeBanner": "🔧 정렬 및 삭제 관리 모드 실행 중...",
        "versionPill": "🏷️ 버전",
        "newVersion": "➕ 새 빈 버전...",
        "copyVersion": "📋 현재 버전 복제...",
        "uploadVersion": "📂 버전 데이터 업로드...",
        "deleteVersion": "🗑️ 버전 삭제...",
        "searchPlaceholder": "🔍 요구사항 제목 검색 (예: 주문 / 팝업 / 입찰)...",
        "addPinBtn": "📍 핀 추가",
        "viewFullPrdBtn": "📑 전체 PRD 보기",
        "openNewTabBtn": "↗️ 새 탭에서 열기",
        "exportMdBtn": "📥 Markdown 내보내기",
        "exportJsBtn": "💾 JS 데이터 내보내기",
        "importVersionBtn": "📂 버전 가져오기",
        "printBtn": "🖨️ 인쇄 / PDF",
        "closePageBtn": "✕ 닫기",
        "locateBtn": "🎯 위치 이동",
        "editBtn": "✏️ 편집",
        "deleteBtn": "🗑️ 삭제",
        "moveToBtn": "🔢 순서 이동",
        "moveToTopBtn": "🔝 맨 위로",
        "moveUpBtn": "▲ 위로",
        "moveDownBtn": "▼ 아래로",
        "boundComp": "요소 연결됨",
        "unbound": "미연결",
        "noPinsEmptyTip": "이 버전에 등록된 요구사항 핀이 없습니다",
        "noSearchMatchTip": "일치하는 요구사항 제목이 없습니다",
        "searchKeywordTip": "키워드",
        "clearSearchBtn": "검색 조건 지우기",
        "tocTitle": "📑 목차 개요",
        "docHeroTitleSuffix": "· 제품 요구사항 정의서 (PRD)",
        "docMetaPage": "페이지 파일",
        "docMetaVersion": "규격 버전",
        "docMetaCount": "항목 수",
        "docMetaTime": "생성 일시",
        "noDocContentTip": "이 버전에 아직 작성된 PRD 규격이 없습니다",
        "editModalTitle": "요구사항 규격 편집",
        "createModalTitle": "새 요구사항 규격 작성",
        "tabLive": "✨ 실시간 시각 편집",
        "tabRaw": "📄 Markdown 원본",
        "minimizeBtn": "➖ 최소화 / 화면 보기",
        "reqTitleLabel": "요구사항 명칭",
        "reqTitlePlaceholder": "요구사항 제목 입력 (필수)",
        "reqTypeLabel": "요구사항 유형",
        "reqTypes": {
            "业务规则": "비즈니스 규칙",
            "交互逻辑": "인터랙션 로직",
            "数据口径": "데이터 기준",
            "权限规则": "권한 규칙",
            "异常流": "예외 흐름",
            "UI规范": "UI 규격"
        },
        "tableDropdown": "📊 테이블 삽입...",
        "mermaidDropdown": "🔄 다이어그램 삽입 (Mermaid)...",
        "templateDropdown": "📑 템플릿 삽입...",
        "tableToolbarTip": "📊 시각적 표 (셀 직접 입력, Shift+Enter 줄바꿈, Enter/Tab 셀 이동)",
        "addRow": "➕ 행 추가",
        "addCol": "➕ 열 추가",
        "delRow": "➖ 행 삭제",
        "delCol": "➖ 열 삭제",
        "delTable": "🗑️ 표 삭제",
        "editFlowchart": "✏️ 다이어그램 편집",
        "editingFlowchartCode": "🔄 Mermaid 코드 편집 중:",
        "finishRender": "✓ 렌더링 완료",
        "rePickBtn": "🎯 요소 다시 선택",
        "tempSaveBtn": "👀 임시저장 및 화면확인",
        "cancelBtn": "취소",
        "saveBtn": "💾 저장",
        "editingDraftPrefix": "편집 중",
        "draftStashedTip": "임시저장됨 · 클릭하여 편집 계속",
        "restoreEditBtn": "편집 재개",
        "discardDraftPrompt": "현재 작성 중인 초안을 취소하시겠습니까?",
        "saveSuccessToast": "✅ 요구사항 규격이 로컬 JS 파일에 성공적으로 저장되었습니다!",
        "saveFailToast": "❌ 저장 실패: 로컬 서버에 연결할 수 없습니다!",
        "pinDeletedToast": "✅ 요구사항 핀이 삭제되고 동기화되었습니다!",
        "reorderSuccessToast": "✅ 요구사항 순서가 성공적으로 변경되었습니다!",
        "rePickTip": "연결할 화면 요소를 클릭하세요!",
        "rePickSuccessToast": "요소 재연결이 완료되었습니다!",
        "deleteVersionConfirm": "⚠️ 경고: 이 버전과 모든 핀을 영구 삭제하시겠습니까?",
        "cannotDeleteOnlyVersion": "삭제 불가: 최소 하나의 버전은 유지되어야 합니다!",
        "importModalTitle": "📂 PRD 버전 데이터 가져오기",
        "importFileLabel": "가져올 파일",
        "importVersionNameLabel": "대상 버전명:",
        "conflictOverwrite": "🔴 덮어쓰기 (기존 핀을 삭제하고 업로드 데이터로 교체)",
        "conflictAppend": "🟢 병합 추가 (기존 핀 유지 및 끝에 추가)",
        "conflictNewVer": "🔵 새 버전으로 저장 (기존 버전에 영향 없음)",
        "confirmImportBtn": "가져오기 적용",
        "pickingTip": "📍 화면 요소를 클릭하여 핀 추가 (ESC 취소)",
        "fullCollapseTip": "패널 완전히 접기",
        "semiCollapseTip": "번호 바 모드로 접기",
        "expandDrawerTip": "전체 패널 펼치기",
        "noDescTip": "상세 설명 없음",
        "clickToEditBlock": "클릭하여 단락 편집",
        "clickToInputContent": "클릭하여 내용 입력...",
        "dragToReorderTip": "드래그하여 순서 변경",
        "clickToReorderTip": "클릭하여 순서 번호 변경",
        "moveToTopTip": "맨 위(1번)로 이동",
        "moveUpTip": "1칸 위로 이동",
        "moveDownTip": "1칸 아래로 이동",
        "collapseSidebarBtn": "📁 사이드바 접기",
        "expandSidebarBtn": "📂 사이드바 펼치기",
        "closeInspectBubble": "요구사항 팝업 닫기",
        "reqDoc": "요구사항",
        "unboundElementTip": "요소 미연결",
        "bold": "굵게",
        "italic": "기울임",
        "strikethrough": "취소선",
        "heading3": "제목 3",
        "heading4": "제목 4",
        "bulletList": "글머리 기호 목록",
        "numberList": "번호 매기기 목록",
        "taskList": "체크리스트",
        "quote": "인용구",
        "inlineCode": "인라인 코드",
        "codeBlock": "코드 블록",
        "divider": "구분선",
        "unnamedPin": "(이름 없는 요구사항)",
        "itemCountUnit": "개"
    }
};

  let currentLang = 'zh-CN';
  try {
    const savedLang = localStorage.getItem('prd_ui_lang');
    if (savedLang && I18N[savedLang]) currentLang = savedLang;
  } catch (e) {}

  function t(key, fallback = '') {
    if (I18N[currentLang] && I18N[currentLang][key] !== undefined) {
      return I18N[currentLang][key];
    }
    if (I18N['en'] && I18N['en'][key] !== undefined) {
      return I18N['en'][key];
    }
    if (I18N['zh-CN'] && I18N['zh-CN'][key] !== undefined) {
      return I18N['zh-CN'][key];
    }
    return fallback || key;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ==========================================
  // 前置服务健康检查与只读阻断弹窗 (Pre-Action API Health Check)
  // ==========================================
  let isBackendApiCached = null;

  async function checkBackendApiAvailable(force = false) {
    if (!force && isBackendApiCached !== null) {
      return isBackendApiCached;
    }
    if (window.location.protocol === 'file:') {
      isBackendApiCached = false;
      return false;
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch('/api/get-all-prd', {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        isBackendApiCached = true;
        return true;
      }
    } catch (e) {}
    isBackendApiCached = false;
    return false;
  }

  window.showNoBackendAlertModal = function(actionType = 'edit') {
    const existing = document.getElementById('prd-no-backend-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'prd-no-backend-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      z-index: 10000050;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: prd-fade-in 0.2s ease-out;
      font-family: var(--prd-font);
    `;

    modal.innerHTML = `
      <div style="background:#ffffff; width:520px; max-width:92vw; border-radius:12px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(226,232,240,0.8); overflow:hidden; display:flex; flex-direction:column;">
        <div style="background:#fff1f2; border-bottom:1px solid #fecdd3; padding:16px 20px; display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:8px; font-weight:800; font-size:15px; color:#be123c;">
            <span>⚠️</span>
            <span>${escapeHtml(t('apiCheckFailedTitle'))}</span>
          </div>
          <button style="background:none; border:none; font-size:18px; color:#9f1239; cursor:pointer;" onclick="window.closeNoBackendModal()">&times;</button>
        </div>
        <div style="padding:20px; font-size:13px; line-height:1.65; color:#334155;">
          <div>${t('apiCheckFailedDesc')}</div>
          <div style="margin:14px 0 6px 0; background:#0f172a; color:#38bdf8; padding:10px 14px; border-radius:8px; font-family:monospace; font-size:13px; display:flex; align-items:center; justify-content:space-between; border:1px solid #1e293b;">
            <span>$ ${escapeHtml(t('apiCheckCmdGuide'))}</span>
            <button style="background:#1e293b; color:#f8fafc; border:1px solid #334155; padding:4px 10px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:600;" onclick="window.copyStartCommand(this)">${escapeHtml(t('apiCheckCopyCmd'))}</button>
          </div>
          <div style="font-size:11.5px; color:#64748b; margin-top:8px;">
            💡 提示：在终端启动后刷新页面，即可解锁打点与排序编辑功能并自动落盘磁盘文件。
          </div>
        </div>
        <div style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:12px 20px; display:flex; justify-content:flex-end; gap:10px;">
          <button class="prd-btn-primary" style="background:#0f172a; border-color:#0f172a; padding:6px 20px;" onclick="window.closeNoBackendModal()">${escapeHtml(t('apiCheckGotIt'))}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  };

  window.closeNoBackendModal = function() {
    const modal = document.getElementById('prd-no-backend-modal');
    if (modal) modal.remove();
  };

  window.copyStartCommand = function(btn) {
    const cmd = t('apiCheckCmdGuide') || 'node server.js';
    navigator.clipboard.writeText(cmd).then(() => {
      showToast(t('apiCheckCopySuccess'), 'success');
      if (btn) btn.innerText = '✅ Copied';
      setTimeout(() => { if (btn) btn.innerText = t('apiCheckCopyCmd'); }, 2000);
    }).catch(() => {
      showToast('Command: ' + cmd, 'info');
    });
  };

  const PAGE_TITLES = {
    'zh-CN': {
      'admin.html': '平台运营端后台',
      'mall.html': 'PC 商城端',
      'merchant.html': '商家端后台',
      'h5.html': '买家移动端 H5',
      'merchant-h5.html': '商家移动端 H5'
    },
    'en': {
      'admin.html': 'Admin Console',
      'mall.html': 'PC Marketplace',
      'merchant.html': 'Merchant Console',
      'h5.html': 'Buyer Mobile H5',
      'merchant-h5.html': 'Merchant Mobile H5'
    },
    'ja': {
      'admin.html': '運営管理コンソール',
      'mall.html': 'PC モール',
      'merchant.html': '加盟店管理画面',
      'h5.html': '購入者モバイル H5',
      'merchant-h5.html': '加盟店モバイル H5'
    },
    'ko': {
      'admin.html': '운영 관리자 콘솔',
      'mall.html': 'PC 쇼핑몰',
      'merchant.html': '판매자 관리자 콘솔',
      'h5.html': '구매자 모바일 H5',
      'merchant-h5.html': '판매자 모바일 H5'
    }
  };

  function getCurrentPageTitle() {
    const dict = PAGE_TITLES[currentLang] || PAGE_TITLES['en'] || PAGE_TITLES['zh-CN'];
    return (dict && dict[pageKey]) || pageKey;
  }

  window.setPRDLanguage = function(lang) {
    if (!I18N[lang]) return;
    currentLang = lang;
    try {
      localStorage.setItem('prd_ui_lang', lang);
    } catch (e) {}

    updateVersionBarUI();
    renderRightDrawerList();
    renderPinMarkers();

    const edgeText = document.querySelector('.prd-edge-text');
    if (edgeText) edgeText.innerHTML = `${t('edgeText')} (<span id="prd-edge-count">${savedPins.length}</span>)`;

    const drawerTitleEl = document.querySelector('.prd-drawer-header span:first-child');
    if (drawerTitleEl) drawerTitleEl.innerHTML = `${t('drawerTitle')} · ${getCurrentPageTitle()}`;

    const orderBtn = document.getElementById('prd-manage-order-btn');
    if (orderBtn) orderBtn.innerText = isDrawerManageMode ? t('doneManage') : t('manageOrder');

    const searchInput = document.getElementById('prd-drawer-search-input');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');

    const addBtn = document.querySelector('#prd-right-drawer .prd-btn-primary');
    if (addBtn) addBtn.innerText = t('addPinBtn');

    const fullPrdBtn = document.querySelector('#prd-right-drawer .prd-btn-outline');
    if (fullPrdBtn) fullPrdBtn.innerText = t('viewFullPrdBtn');

    if (activeDocModal) window.openCurrentPagePRDDoc();
    if (activeEditorEl && activeDraft) renderEditorModal(activeDraft);
    showToast(`🌐 ${I18N[lang].langName}`, 'info');
  };

  const PRD_CACHE_VERSION = 'full-spec-v12';

  // 1. 多版本数据注册表初始化与向后兼容 (支持项目与页面强隔离、优先使用本地数据文件)
  const presets = Array.isArray(window.INITIAL_PRD_DATA) ? window.INITIAL_PRD_DATA : [];
  let currentVersion = 'v1.0.0';
  let versionRegistry = {
    activeVersion: 'v1.0.0',
    versions: {
      'v1.0.0': JSON.parse(JSON.stringify(presets))
    }
  };

  if (window.PRD_VERSION_REGISTRY && window.PRD_VERSION_REGISTRY.versions) {
    versionRegistry = window.PRD_VERSION_REGISTRY;
    currentVersion = versionRegistry.activeVersion || Object.keys(versionRegistry.versions)[0] || 'v1.0.0';
  }

  // 本地缓存加载与版本校验 (使用带有项目前缀的 cacheKey，避免多项目冲突)
  try {
    if (localStorage.getItem(cacheVersionKey) !== PRD_CACHE_VERSION) {
      localStorage.removeItem(cacheKey);
      localStorage.setItem(cacheVersionKey, PRD_CACHE_VERSION);
    } else {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.versions && Object.keys(parsed.versions).length > 0) {
          versionRegistry = parsed;
          currentVersion = versionRegistry.activeVersion || Object.keys(versionRegistry.versions)[0] || 'v1.0.0';
        }
      }
    }
  } catch (e) {}

  // 若当前版本在缓存中为空，但 JS 数据文件中有预置打点，则以 JS 数据文件为准
  if (!versionRegistry.versions[currentVersion] || versionRegistry.versions[currentVersion].length === 0) {
    if (presets.length > 0) {
      versionRegistry.versions[currentVersion] = JSON.parse(JSON.stringify(presets));
    } else if (!versionRegistry.versions[currentVersion]) {
      versionRegistry.versions[currentVersion] = [];
    }
  }
  let savedPins = versionRegistry.versions[currentVersion];
  window.PRD_VERSION_REGISTRY = versionRegistry;
  window.INITIAL_PRD_DATA = savedPins;

  function reIndexPins(pins) {
    pins.forEach((pin, index) => {
      pin.id = index + 1;
      pin.pageKey = pageKey;
      pin.pageTitle = getCurrentPageTitle();
      pin.version = currentVersion;
      pin.type = pin.type || '业务规则';
    });
  }
  reIndexPins(savedPins);

  // 全局状态
  let currentMode = 'hide'; // 'hide' | 'show' | 'edit'
  let isDrawerManageMode = false; // 抽屉管理模式 (安全锁)
  let activeDraft = null; // 暂存草稿对象
  let highlightedElement = null;
  let rePickModeActive = false;
  let searchKeyword = '';
  let serverConnected = false;

  // 静默检测本地 Node/Python 服务
  (async function checkServerConnection() {
    try {
      const resp = await fetch('/api/get-all-prd');
      if (resp.ok) serverConnected = true;
    } catch (e) {
      serverConnected = false;
    }
  })();

  // 2. 注入全局高品质样式
  const style = document.createElement('style');
  style.id = 'prd-tool-styles-v6';
  style.textContent = `
    :root {
      --prd-primary: #2563eb;
      --prd-primary-hover: #1d4ed8;
      --prd-bg-panel: rgba(255, 255, 255, 0.98);
      --prd-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    }

    /* 屏幕右边缘快捷展开 Tab */
    .prd-drawer-edge-tab {
      position: fixed;
      top: 140px;
      right: 0;
      z-index: 1000009;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: #ffffff;
      padding: 12px 6px;
      border-radius: 8px 0 0 8px;
      cursor: pointer;
      box-shadow: -4px 4px 14px rgba(0,0,0,0.25);
      border: 1px solid rgba(59, 130, 246, 0.4);
      border-right: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      user-select: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .prd-drawer-edge-tab:hover {
      background: #0284c7;
      border-color: #38bdf8;
      transform: translateX(-4px);
    }
    .prd-edge-arrow { font-size: 14px; font-weight: 800; }
    .prd-edge-text {
      writing-mode: vertical-rl;
      letter-spacing: 2px;
      font-size: 11px;
      font-weight: 700;
    }

    /* 右侧抽屉核心容器 */
    .prd-right-drawer {
      position: fixed;
      top: 0;
      right: -420px;
      width: 400px;
      height: 100vh;
      background: #ffffff;
      box-shadow: -10px 0 35px rgba(15, 23, 42, 0.18);
      z-index: 1000016;
      display: flex;
      flex-direction: column;
      transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border-left: 1px solid #e2e8f0;
      font-family: var(--prd-font);
    }
    .prd-right-drawer.open { right: 0; }

    /* 抽屉左边缘收起小箭头按钮 */
    /* 抽屉左边缘控制把手组 (上方全收起 + 下方半收起，按钮朝内指向右侧) */
    .prd-drawer-left-handles {
      position: absolute;
      left: -32px;
      top: 50%;
      transform: translateY(-50%);
      display: none;
      flex-direction: column;
      gap: 6px;
      z-index: 1000017;
      user-select: none;
    }
    #prd-drawer.open .prd-drawer-left-handles, .prd-right-drawer.open .prd-drawer-left-handles {
      display: flex !important;
    }
    .prd-drawer-handle-btn {
      width: 32px;
      height: 44px;
      border-radius: 8px 0 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: -4px 4px 12px rgba(0,0,0,0.18);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .prd-drawer-handle-btn span {
      font-size: 17px;
      font-weight: 800;
      line-height: 1;
    }
    /* 上方按钮：全收起 (深色科技质感，右向箭头 › 朝内收起) */
    .prd-handle-full-collapse {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: #ffffff;
      border: 1px solid #334155;
      border-right: none;
    }
    .prd-handle-full-collapse:hover {
      background: #ef4444;
      border-color: #f87171;
      transform: scale(1.08) translateX(-2px);
    }
    /* 下方按钮：半收起 (专业亮蓝，右向紧凑收折标号条图标 ⇥) */
    .prd-handle-semi-collapse {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      border: 1px solid #60a5fa;
      border-right: none;
    }
    .prd-handle-semi-collapse:hover {
      background: #1e40af;
      border-color: #93c5fd;
      transform: scale(1.08) translateX(-2px);
    }

    .prd-drawer-header {
      padding: 12px 14px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      flex-shrink: 0;
    }

    .prd-version-bar {
      padding: 8px 12px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .prd-version-select {
      flex: 1;
      padding: 4px 8px;
      font-size: 11.5px;
      font-weight: 700;
      color: #0f172a;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      outline: none;
      cursor: pointer;
    }

    .prd-drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* 需求卡片样式 (100% 绝对统一卡片高度 136px) */
    .prd-card-item {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 136px !important;
      min-height: 136px !important;
      max-height: 136px !important;
      box-sizing: border-box;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }
    .prd-card-item:hover {
      border-color: #93c5fd;
      background: #f8fafc;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.08);
    }
    .prd-card-item.dragging {
      opacity: 0.45;
      background: #eff6ff;
      border: 1.5px dashed #3b82f6;
    }
    .prd-card-item.drag-over {
      border-top: 3px solid #2563eb;
      background: #f0fdf4;
    }

    .prd-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      height: 22px;
      flex-shrink: 0;
    }
    .prd-num-title {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
    }
    .prd-num-title span:last-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
    .prd-pin-num-pill {
      background: #ef4444;
      color: #fff;
      font-size: 10.5px;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 10px;
      min-width: 14px;
      text-align: center;
      flex-shrink: 0;
      user-select: none;
    }
    .prd-pin-num-pill.clickable {
      cursor: pointer;
      transition: transform 0.15s;
    }
    .prd-pin-num-pill.clickable:hover {
      transform: scale(1.15);
      background: #dc2626;
    }

    .prd-card-desc {
      font-size: 12px;
      color: #64748b;
      line-height: 18px;
      height: 36px !important;
      min-height: 36px !important;
      max-height: 36px !important;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      margin: 4px 0;
      flex-shrink: 0;
    }
    .prd-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #f1f5f9;
      padding-top: 4px;
      margin-top: 0;
      height: 24px;
      flex-shrink: 0;
    }

    .prd-tag {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .prd-tag-type { background: #e0f2fe; color: #0369a1; }
    .prd-tag-version { background: #fef3c7; color: #92400e; font-family: monospace; }

    /* 通用按钮 */
    .prd-btn-action {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 11px;
      color: #334155;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
      transition: all 0.15s;
    }
    .prd-btn-action:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    .prd-btn-primary {
      background: var(--prd-primary);
      border: 1px solid var(--prd-primary);
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      color: #ffffff;
      cursor: pointer;
      font-weight: 700;
      transition: all 0.15s;
    }
    .prd-btn-primary:hover {
      background: var(--prd-primary-hover);
    }
    .prd-panel .btn-danger, .prd-btn-danger { color: #ef4444 !important; border-color: #fecaca !important; }
    .prd-panel .btn-danger:hover, .prd-btn-danger:hover { background: #fef2f2 !important; border-color: #ef4444 !important; }

    /* 页面大头针 */
    .prd-pin-marker {
      position: absolute;
      width: 22px;
      height: 22px;
      background: #ef4444;
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 4px 10px rgba(239, 68, 68, 0.45), 0 0 0 2px #ffffff;
      cursor: pointer;
      z-index: 1000015;
      transition: transform 0.15s, box-shadow 0.15s;
      pointer-events: auto;
      user-select: none;
    }
    .prd-pin-marker:hover {
      transform: scale(1.25);
      background: #dc2626;
      box-shadow: 0 6px 14px rgba(220, 38, 38, 0.6), 0 0 0 3px #ffffff;
    }
    .prd-pin-marker.highlighted {
      animation: prd-pulse-anim 1.2s infinite;
    }
    @keyframes prd-pulse-anim {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1.3); box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    .prd-pick-hover-outline {
      outline: 2px dashed #ef4444 !important;
      outline-offset: 2px !important;
      background: rgba(239, 68, 68, 0.05) !important;
    }

    .prd-target-glow-box {
      position: fixed !important;
      border: 2.5px solid #ef4444 !important;
      box-shadow: 0 0 25px rgba(239, 68, 68, 0.55), inset 0 0 12px rgba(239, 68, 68, 0.2) !important;
      border-radius: 6px !important;
      pointer-events: none !important;
      z-index: 1000014 !important;
      box-sizing: border-box !important;
      animation: prd-glow-fade 3s forwards;
    }
    @keyframes prd-glow-fade {
      0% { opacity: 1; transform: scale(0.99); }
      15% { opacity: 1; transform: scale(1); }
      80% { opacity: 0.95; }
      100% { opacity: 0; }
    }

    /* 悬浮 Popover 气泡 */

    /* 严格保障所有环境下的 Markdown 列表小圆点与序号排版 */
    ul.prd-md-list, .prd-live-blocks-container ul, .prd-doc-content ul, .prd-drawer-content ul, .prd-inspect-bubble ul, .prd-live-block ul {
      list-style-type: disc !important;
      padding-left: 24px !important;
      margin: 6px 0 !important;
      display: block !important;
    }
    ol.prd-md-list, .prd-live-blocks-container ol, .prd-doc-content ol, .prd-drawer-content ol, .prd-inspect-bubble ol, .prd-live-block ol {
      list-style-type: decimal !important;
      padding-left: 24px !important;
      margin: 6px 0 !important;
      display: block !important;
    }
    ul.prd-md-list li, ol.prd-md-list li, .prd-live-blocks-container li, .prd-doc-content li, .prd-drawer-content li, .prd-inspect-bubble li, .prd-live-block li {
      display: list-item !important;
      list-style-type: inherit !important;
      margin-bottom: 4px !important;
      line-height: 1.65 !important;
    }
    .prd-live-block ul li::marker, .prd-doc-content ul li::marker {
      color: #2563eb !important;
    }

    /* 抽屉全展开 (400px) / 半收起 (56px 标号竖条) / 全收起 状态体系 */
    #prd-drawer, .prd-right-drawer {
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100vh;
      background: #ffffff;
      box-shadow: -4px 0 25px rgba(0, 0, 0, 0.12);
      z-index: 1000008;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), width 0.2s ease;
      box-sizing: border-box;
      border-left: 1px solid #e2e8f0;
    }
    #prd-drawer.open, .prd-right-drawer.open {
      transform: translateX(0) !important;
      width: 400px !important;
    }
    #prd-drawer.semi-open, .prd-right-drawer.semi-open {
      transform: translateX(0) !important;
      width: 56px !important;
      overflow: visible !important;
    }
    #prd-drawer.semi-open .prd-drawer-full-content, .prd-right-drawer.semi-open .prd-drawer-full-content {
      display: none !important;
    }
    #prd-drawer.semi-open .prd-drawer-mini-rail, .prd-right-drawer.semi-open .prd-drawer-mini-rail {
      display: flex !important;
    }
    .prd-drawer-full-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .prd-drawer-mini-rail {
      display: none;
      flex-direction: column;
      height: 100%;
      width: 100%;
      background: #f8fafc;
      align-items: center;
      padding: 10px 0;
      box-sizing: border-box;
      user-select: none;
      overflow-y: auto;
      overflow-x: visible;
    }
    .prd-mini-badge-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #ef4444;
      color: #fff;
      font-size: 13px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #fff;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
      cursor: pointer;
      margin-bottom: 8px;
      transition: transform 0.15s, background 0.15s;
      flex-shrink: 0;
      position: relative;
    }
    .prd-mini-badge-btn:hover {
      transform: scale(1.18);
      background: #dc2626;
      z-index: 1000020;
    }
    .prd-mini-badge-btn::after {
      content: attr(data-title);
      position: absolute;
      right: 44px;
      top: 50%;
      transform: translateY(-50%);
      background: #1e293b;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      z-index: 1000030;
    }
    .prd-mini-badge-btn:hover::after {
      opacity: 1;
    }
    
    /* 抽屉左侧折叠把手 */
    .prd-drawer-edge-handle {
      position: absolute;
      left: -24px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 48px;
      background: #1e293b;
      color: #ffffff;
      border-radius: 6px 0 0 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
      box-shadow: -2px 0 8px rgba(0,0,0,0.15);
      z-index: 1000009;
      transition: background 0.15s;
      user-select: none;
    }
    .prd-drawer-edge-handle:hover {
      background: #2563eb;
    }

    .prd-inspect-bubble {
      position: fixed;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(226, 232, 240, 0.95);
      padding: 14px 16px;
      width: 520px;
      min-width: 340px;
      min-height: 280px;
      max-width: 92vw;
      max-height: 90vh;
      z-index: 1000018;
      font-family: var(--prd-font);
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: #1e293b;
      resize: both;
      overflow: hidden;
      box-sizing: border-box;
    }
    .prd-inspect-bubble-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 6px;
      cursor: grab;
      user-select: none;
      flex-shrink: 0;
    }
    .prd-inspect-bubble-header:active { cursor: grabbing; }

    /* 纯白底色 Mermaid 矢量流程图与表格容器 */
    .prd-mermaid-block {
      margin: 10px 0;
      padding: 18px 14px 28px 14px !important;
      background: #ffffff !important;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow-x: auto;
      text-align: center;
      box-shadow: 0 1px 4px rgba(0,0,0,0.03);
    }
    .prd-mermaid-block svg {
      max-width: 100% !important;
      height: auto !important;
      display: inline-block;
      background: #ffffff !important;
    }
    .mermaid {
      background: #ffffff !important;
      color: #1e293b;
    }

    .prd-table-responsive {
      width: 100%;
      overflow-x: auto;
      margin: 8px 0;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .prd-md-rendered table, .prd-md-doc table, .prd-table-responsive table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      margin: 0;
      text-align: left;
    }
    .prd-md-rendered th, .prd-md-doc th, .prd-table-responsive th {
      background: #f8fafc;
      color: #0f172a;
      font-weight: 700;
      padding: 9px 12px;
      border-bottom: 2px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
    }
    .prd-md-rendered td, .prd-md-doc td, .prd-table-responsive td {
      padding: 8px 12px;
      border-bottom: 1px solid #f1f5f9;
      border-right: 1px solid #f8fafc;
      color: #334155;
    }
    .prd-md-rendered tr:hover td, .prd-md-doc tr:hover td, .prd-table-responsive tr:hover td {
      background: #f8fafc;
    }

    /* 📊 交互式可视化直编表格容器 (零管道符，如同 Word/Excel) */
    .prd-live-table-wrapper {
      margin: 10px 0;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
      flex-shrink: 0;
      width: 100%;
      min-height: fit-content;
      box-sizing: border-box;
    }
    .prd-live-table-toolbar {
      padding: 6px 12px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .prd-visual-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      table-layout: auto;
    }
    .prd-visual-table th, .prd-visual-table td {
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      outline: none;
      vertical-align: top;
      min-width: 110px;
      min-height: 38px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
      background: #ffffff;
      box-sizing: border-box;
    }
    .prd-visual-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }
    .prd-visual-table th:focus, .prd-visual-table td:focus {
      background: #eff6ff !important;
      box-shadow: inset 0 0 0 2px #2563eb;
    }
    .prd-visual-table td:empty:before, .prd-visual-table th:empty:before {
      content: attr(placeholder);
      color: #94a3b8;
      font-style: italic;
    }

    /* 纯净无边框逐行即时可视化编辑器 */
    .prd-editor-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 920px;
      min-width: 600px;
      min-height: 520px;
      max-width: 96vw;
      max-height: 96vh;
      height: 720px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(226, 232, 240, 0.95);
      z-index: 1000019;
      display: flex;
      flex-direction: column;
      font-family: var(--prd-font);
      resize: both;
      overflow: hidden;
    }
    .prd-editor-header {
      padding: 12px 18px;
      background: #0f172a;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: grab;
      user-select: none;
      flex-shrink: 0;
    }
    .prd-editor-header:active { cursor: grabbing; }

    .prd-editor-body {
      flex: 1;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: hidden;
      background: #ffffff;
    }

    .prd-md-toolbar {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      flex-shrink: 0;
    }
    .prd-md-tool-btn {
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 3px 7px;
      font-size: 11.5px;
      color: #334155;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.15s;
    }
    .prd-md-tool-btn:hover, .prd-md-tool-btn.active {
      background: #eff6ff;
      border-color: #3b82f6;
      color: var(--prd-primary);
    }
    .prd-tool-select {
      padding: 3px 6px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      font-size: 11px;
      color: #334155;
      background: #fff;
      outline: none;
      cursor: pointer;
    }

    /* 逐行所见即所得核心文档画布 (去多余外框，保留流畅真实文档感) */
    .prd-live-blocks-container {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 20px 24px;
      overflow-y: auto;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 6px;
      cursor: text;
    }
    .prd-live-block {
      border: none !important;
      outline: none !important;
      position: relative;
      margin: 0;
      padding: 2px 0;
      flex-shrink: 0;
      width: 100%;
      box-sizing: border-box;
    }
    .prd-live-block.rendered {
      cursor: text;
      min-height: 24px;
    }
    .prd-live-block.editing {
      background: transparent;
      padding: 2px 0;
      border-left: 2.5px solid #2563eb !important;
      padding-left: 8px !important;
    }
    .prd-live-line-input {
      width: 100%;
      border: none;
      outline: none;
      background: transparent;
      font-family: inherit;
      font-size: 13.5px;
      line-height: 1.65;
      resize: none;
      overflow: hidden;
      color: #0f172a;
      box-sizing: border-box;
      display: block;
      padding: 0;
      margin: 0;
    }

    /* 纯文本源码模式备用 */
    .prd-raw-source-textarea {
      flex: 1;
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 14px 16px;
      font-size: 13px;
      line-height: 1.65;
      outline: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      resize: none;
      box-sizing: border-box;
      background: #ffffff;
      color: #0f172a;
    }

    /* 右下角最小化悬浮胶囊 */
    .prd-editor-mini-dock {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000025;
      background: #0f172a;
      color: #ffffff;
      border-radius: 30px;
      padding: 8px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15);
      cursor: pointer;
      font-family: var(--prd-font);
      animation: prd-dock-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
    }
    @keyframes prd-dock-pop {
      from { transform: translateY(20px) scale(0.9); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    .prd-editor-mini-dock:hover {
      background: #1e293b;
      box-shadow: 0 12px 35px rgba(2, 132, 199, 0.45);
    }

    /* 全屏文档大屏 Modal */
    .prd-doc-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      z-index: 1000020;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--prd-font);
    }
    .prd-doc-container {
      width: 1280px;
      max-width: 96vw;
      height: 90vh;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .prd-doc-header {
      padding: 14px 20px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    .prd-doc-content-layout {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    .prd-doc-toc {
      width: 260px;
      border-right: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 14px 10px;
      overflow-y: auto;
      flex-shrink: 0;
    }
    .prd-toc-title {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 8px;
      padding: 0 6px;
    }
    .prd-toc-item {
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12.5px;
      color: #475569;
      cursor: pointer;
      display: flex;
      gap: 6px;
      align-items: center;
      transition: all 0.15s;
    }
    .prd-toc-item:hover, .prd-toc-item.active {
      background: #eff6ff;
      color: var(--prd-primary);
      font-weight: 600;
    }
    .prd-toc-num { color: #ef4444; font-weight: 700; font-size: 11px; }
    .prd-toc-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .prd-doc-main-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 30px 40px;
      background: #ffffff;
    }
    .prd-doc-paper { max-width: 900px; margin: 0 auto; }
    .prd-doc-hero {
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .prd-doc-hero-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 8px 0;
    }
    .prd-doc-hero-meta {
      font-size: 12px;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .prd-doc-article-section {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #f1f5f9;
      scroll-margin-top: 80px;
    }
    .prd-doc-article-section:first-of-type {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
    }
    .prd-doc-sec-heading {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 10px 0;
    }
    .prd-doc-sec-content {
      font-size: 13.5px;
      line-height: 1.7;
      color: #334155;
    }

    /* 版本上传模态框 */
    .prd-version-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(2px);
      z-index: 1000030;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--prd-font);
    }
    .prd-version-modal-card {
      width: 480px;
      max-width: 92vw;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
  `;
  document.head.appendChild(style);

  // 3. 增强型 Markdown 转换器与 Mermaid 纯白底色防截断渲染引擎
  function loadMermaidEngine() {
    if (!window.mermaid) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      s.onload = () => {
        try {
          window.mermaid.initialize({
            startOnLoad: false,
            theme: 'neutral',
            themeVariables: {
              background: '#ffffff',
              mainBkg: '#ffffff',
              nodeBorder: '#2563eb',
              clusterBkg: '#ffffff',
              titleColor: '#0f172a',
              edgeLabelBackground: '#ffffff'
            },
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' }
          });
          window.renderMermaidInDom && window.renderMermaidInDom(document);
        } catch (e) {}
      };
      document.head.appendChild(s);
    }
  }
  loadMermaidEngine();

  window.renderMermaidInDom = async function(container) {
    if (!container) return;
    const nodes = container.querySelectorAll('.mermaid:not([data-processed="true"])');
    if (nodes.length === 0) return;
    if (window.mermaid && typeof window.mermaid.run === 'function') {
      try {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          themeVariables: {
            background: '#ffffff',
            mainBkg: '#ffffff',
            nodeBorder: '#2563eb',
            clusterBkg: '#ffffff',
            titleColor: '#0f172a',
            edgeLabelBackground: '#ffffff'
          },
          securityLevel: 'loose',
          flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' }
        });
        await window.mermaid.run({ nodes: Array.from(nodes) });
        // 动态检查并补充 viewBox 底部安全高度，彻底杜绝文字与节点截断
        container.querySelectorAll('.prd-mermaid-block svg').forEach(svg => {
          svg.style.background = '#ffffff';
          const vb = svg.getAttribute('viewBox');
          if (vb) {
            const parts = vb.split(' ').map(Number);
            if (parts.length === 4 && parts[3] > 0) {
              svg.setAttribute('viewBox', `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3] + 28}`);
            }
          }
        });
      } catch (err) {
        console.warn('[PRD Mermaid Render]:', err);
      }
    }
  };

  window.parseMarkdown = parseMarkdown;
  function parseMarkdown(md) {
    if (!md) return '';
    let text = md.trim();

    // 1. 提取并保护代码块与 Mermaid 流程图
    const codeBlocks = [];
    text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (m, lang, code) => {
      const idx = codeBlocks.length;
      if (lang === 'mermaid') {
        codeBlocks.push(`<div class="prd-mermaid-block"><div class="mermaid">${code.trim()}</div></div>`);
      } else {
        const safe = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        codeBlocks.push(`<pre class="prd-code-block" data-lang="${lang || ''}"><code>${safe}</code></pre>`);
      }
      return `\n__PRD_CODE_BLOCK_${idx}__\n`;
    });

    // 2. 提取并保护行内代码
    const inlineCodes = [];
    text = text.replace(/`([^`\n]+)`/g, (m, code) => {
      const idx = inlineCodes.length;
      const safe = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      inlineCodes.push(`<code>${safe}</code>`);
      return `__PRD_INLINE_CODE_${idx}__`;
    });

    // 3. 按行解析 Markdown
    const rawLines = text.split('\n');
    const outLines = [];
    let inList = false;
    let listType = 'ul';
    let inTable = false;
    let tableRows = [];
    let inQuote = false;
    let quoteLines = [];

    function flushTable() {
      if (!inTable || tableRows.length === 0) return;
      let tblHtml = '<div class="prd-table-responsive"><table>';
      if (tableRows.length >= 2 && tableRows[1].every(c => /^[-:\s]+$/.test(c))) {
        tblHtml += '<thead><tr>';
        tableRows[0].forEach(c => { tblHtml += `<th>${formatInline(c.trim())}</th>`; });
        tblHtml += '</tr></thead><tbody>';
        for (let r = 2; r < tableRows.length; r++) {
          tblHtml += '<tr>';
          tableRows[r].forEach(c => { tblHtml += `<td>${formatInline(c.trim())}</td>`; });
          tblHtml += '</tr>';
        }
        tblHtml += '</tbody>';
      } else {
        tblHtml += '<tbody>';
        for (let r = 0; r < tableRows.length; r++) {
          tblHtml += '<tr>';
          tableRows[r].forEach(c => { tblHtml += `<td>${formatInline(c.trim())}</td>`; });
          tblHtml += '</tr>';
        }
        tblHtml += '</tbody>';
      }
      tblHtml += '</table></div>';
      outLines.push(tblHtml);
      tableRows = [];
      inTable = false;
    }

    function flushQuote() {
      if (!inQuote || quoteLines.length === 0) return;
      outLines.push(`<blockquote>${quoteLines.map(l => formatInline(l)).join('<br>')}</blockquote>`);
      quoteLines = [];
      inQuote = false;
    }

    function flushList() {
      if (!inList) return;
      outLines.push(`</${listType}>`);
      inList = false;
    }

    function formatInline(str) {
      if (!str) return '';
      let s = str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      
      s = s.replace(/__PRD_INLINE_CODE_(\d+)__/g, (m, id) => inlineCodes[id] || '');
      s = s.replace(/__PRD_CODE_BLOCK_(\d+)__/g, (m, id) => codeBlocks[id] || '');

      s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
      return s;
    }

    for (let i = 0; i < rawLines.length; i++) {
      let line = rawLines[i];
      let trimmed = line.trim();

      if (trimmed.startsWith('__PRD_CODE_BLOCK_')) {
        flushTable(); flushQuote(); flushList();
        outLines.push(trimmed);
        continue;
      }

      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushQuote(); flushList();
        inTable = true;
        const cells = trimmed.slice(1, -1).split('|');
        tableRows.push(cells);
        continue;
      } else {
        flushTable();
      }

      if (trimmed.startsWith('>')) {
        flushList();
        inQuote = true;
        quoteLines.push(trimmed.replace(/^>\s*/, ''));
        continue;
      } else {
        flushQuote();
      }

      if (trimmed.startsWith('### ')) {
        flushList();
        outLines.push(`<h3>${formatInline(trimmed.replace(/^###\s+/, ''))}</h3>`);
        continue;
      }
      if (trimmed.startsWith('#### ')) {
        flushList();
        outLines.push(`<h4>${formatInline(trimmed.replace(/^####\s+/, ''))}</h4>`);
        continue;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        outLines.push(`<h2>${formatInline(trimmed.replace(/^##\s+/, ''))}</h2>`);
        continue;
      }
      if (trimmed.startsWith('# ')) {
        flushList();
        outLines.push(`<h1>${formatInline(trimmed.replace(/^#\s+/, ''))}</h1>`);
        continue;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.replace(/^[-*]\s+/, '');
        if (!inList || listType !== 'ul') {
          flushList();
          inList = true;
          listType = 'ul';
          outLines.push('<ul class="prd-md-list">');
        }
        outLines.push(`<li>${formatInline(content)}</li>`);
        continue;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        const content = trimmed.replace(/^\d+\.\s+/, '');
        if (!inList || listType !== 'ol') {
          flushList();
          inList = true;
          listType = 'ol';
          outLines.push('<ol class="prd-md-list">');
        }
        outLines.push(`<li>${formatInline(content)}</li>`);
        continue;
      }

      flushList();
      if (trimmed === '') {
        continue;
      } else {
        outLines.push(`<p>${formatInline(trimmed)}</p>`);
      }
    }

    flushTable(); flushQuote(); flushList();

    let finalHtml = outLines.join('\n');
    finalHtml = finalHtml.replace(/__PRD_CODE_BLOCK_(\d+)__/g, (m, id) => codeBlocks[id] || '');
    finalHtml = finalHtml.replace(/__PRD_INLINE_CODE_(\d+)__/g, (m, id) => inlineCodes[id] || '');

    return finalHtml;
  }

  function initDraggable(el, handle) {
    if (!el || !handle) return;
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      el.style.transform = 'none';
      el.style.left = `${initialLeft}px`;
      el.style.top = `${initialTop}px`;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${initialLeft + dx}px`;
      el.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }

  function showToast(msg, type = 'info') {
    if (window.UI && typeof window.UI.toast === 'function') {
      window.UI.toast(msg, type);
    } else {
      console.log(`[PRD Tool]: ${msg}`);
    }
  }

  // 4. 多版本数据持久化落盘
  async function persistData() {
    reIndexPins(savedPins);
    versionRegistry.activeVersion = currentVersion;
    versionRegistry.versions[currentVersion] = savedPins;

    try {
      localStorage.setItem(cacheKey, JSON.stringify(versionRegistry));
      localStorage.setItem(cacheVersionKey, PRD_CACHE_VERSION);
      window.INITIAL_PRD_DATA = savedPins;
      window.PRD_VERSION_REGISTRY = versionRegistry;
    } catch (e) {}

    try {
      const resp = await fetch('/api/save-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pageKey, data: savedPins, versionRegistry: versionRegistry })
      });
      if (resp.ok) {
        const resJson = await resp.json();
        if (resJson && resJson.success) return true;
      }
    } catch (e) {}

    return false;
  }

  // 5. 多版本切换与管理方法
  window.switchPRDVersion = async function(ver) {
    if (!versionRegistry.versions[ver]) {
      showToast(`版本 [${ver}] 不存在`, 'error');
      return;
    }

    // 切换版本时清理当前视图残留的高亮框与打点详情气泡
    window.closeInspectBubble();
    document.querySelectorAll('.prd-target-glow-box').forEach(b => b.remove());

    currentVersion = ver;
    versionRegistry.activeVersion = ver;
    savedPins = versionRegistry.versions[ver];
    reIndexPins(savedPins);

    renderPinMarkers();
    renderRightDrawerList();
    renderMiniRailList();
    updateVersionBarUI();

    if (activeDocModal) {
      window.openCurrentPagePRDDoc();
    }
    await persistData();
    showToast(`✅ 已切换至版本 [${ver}]（当前版本共 ${savedPins.length} 项规格）`, 'info');
  };

  window.createPRDVersion = async function(ver) {
    if (!ver || !ver.trim()) return false;
    ver = ver.trim();
    if (versionRegistry.versions[ver]) {
      return false;
    }
    versionRegistry.versions[ver] = [];
    await window.switchPRDVersion(ver);
    return true;
  };

  window.promptCreateVersion = async function() {
    const isApiOk = await checkBackendApiAvailable();
    if (!isApiOk) { window.showNoBackendAlertModal('version'); return; }
    const input = prompt('【新建空白 PRD 规格版本】\n请输入新版本号（例如 v2.0.0 或 v1.1.0）：');
    if (!input || !input.trim()) return;
    const ver = input.trim();
    if (versionRegistry.versions[ver]) {
      alert(`版本 [${ver}] 已存在，请使用其他版本号！`);
      return;
    }

    // 严格创建全新空白版本（各版本打点完全物理隔离，互不可见）
    const ok = await window.createPRDVersion(ver);
    if (ok) {
      showToast(`✅ 已创建并切换至全新空白版本 [${ver}]（初始打点数：0）`, 'success');
    }
  };

  window.promptCopyVersion = async function() {
    const isApiOk = await checkBackendApiAvailable();
    if (!isApiOk) { window.showNoBackendAlertModal('version'); return; }
    const defaultName = `${currentVersion}_copy`;
    const input = prompt(`【复制当前版本 [${currentVersion}]】\n请输入副本版本名称：`, defaultName);
    if (!input || !input.trim()) return;
    const ver = input.trim();
    if (versionRegistry.versions[ver]) {
      alert(`版本 ${ver} 已存在！`);
      return;
    }
    versionRegistry.versions[ver] = JSON.parse(JSON.stringify(savedPins));
    await window.switchPRDVersion(ver);
    showToast(`✅ 已复制并切换至新版本 [${ver}]！`, 'success');
  };

  window.deleteCurrentVersion = async function() {
    const verKeys = Object.keys(versionRegistry.versions);
    if (verKeys.length <= 1) {
      alert('无法删除：必须保留至少一个 PRD 规格版本！');
      return;
    }
    if (confirm(`⚠️ 危险操作：确认永久删除版本 [${currentVersion}] 及其所有打点数据吗？`)) {
      delete versionRegistry.versions[currentVersion];
      const remainingVer = Object.keys(versionRegistry.versions)[0];
      await window.switchPRDVersion(remainingVer);
      showToast(`已删除原版本，已自动切回 [${remainingVer}]`, 'info');
    }
  };

  function updateVersionBarUI() {
    const select = document.getElementById('prd-version-select');
    if (!select) return;
    const verKeys = Object.keys(versionRegistry.versions);
    let html = '';
    verKeys.forEach(ver => {
      html += `<option value="${ver}" ${ver === currentVersion ? 'selected' : ''}>🏷️ ${ver} (${versionRegistry.versions[ver].length}项)</option>`;
    });
    html += `
      <option disabled>──────────</option>
      <option value="__NEW__">➕ 新建空白版本...</option>
      <option value="__COPY__">📋 复制当前版本副本...</option>
      <option value="__UPLOAD__">📂 上传版本数据...</option>
      <option value="__DELETE__">🗑️ 删除当前版本...</option>
    `;
    select.innerHTML = html;
  }

  window.handleVersionSelectChange = function(val) {
    if (val === '__NEW__') {
      window.promptCreateVersion();
    } else if (val === '__COPY__') {
      window.promptCopyVersion();
    } else if (val === '__UPLOAD__') {
      window.triggerImportJS();
    } else if (val === '__DELETE__') {
      window.deleteCurrentVersion();
    } else if (val) {
      window.switchPRDVersion(val);
    }
  };

  // 6. 元素可见性与弹窗感知检测
  function isElementVisibleOnScreen(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;

    let cur = el;
    while (cur && cur !== document.body && cur !== document.documentElement) {
      const style = window.getComputedStyle(cur);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      if (cur.classList.contains('modal-overlay') || cur.classList.contains('modal-backdrop') || cur.id.startsWith('modal-') || cur.id.startsWith('sheet-h5-')) {
        if (!cur.classList.contains('active') && style.display === 'none') return false;
      }
      cur = cur.parentElement;
    }
    return true;
  }

  function getElementSelector(el) {
    if (!(el instanceof Element)) return '';
    if (el.id) return `#${el.id}`;
    if (el.getAttribute('data-target')) return `[data-target='${el.getAttribute('data-target')}']`;
    if (el.getAttribute('data-page')) return `[data-page='${el.getAttribute('data-page')}']`;

    const path = [];
    let cur = el;
    while (cur && cur.nodeType === Node.ELEMENT_NODE && cur !== document.body && cur !== document.documentElement) {
      if (cur.id) {
        path.unshift(`#${cur.id}`);
        break;
      }
      let sib = cur;
      let nth = 1;
      while (sib = sib.previousElementSibling) {
        if (sib.nodeName === cur.nodeName) nth++;
      }
      const nodeName = cur.nodeName.toLowerCase();
      path.unshift(`${nodeName}:nth-of-type(${nth})`);
      cur = cur.parentNode;
    }
    return path.join(' > ');
  }

  // 需求标题完全模糊搜索匹配算法
  function matchFuzzyTitle(title, query) {
    if (!query) return true;
    if (!title) return false;
    const cleanTitle = String(title).toLowerCase();
    const cleanQuery = String(query).toLowerCase().trim();

    // 1. 直接包含子串
    if (cleanTitle.includes(cleanQuery)) return true;

    // 2. 空格分词全匹配 (如 "订单 履约")
    const words = cleanQuery.split(/\s+/).filter(w => w.length > 0);
    if (words.length > 1 && words.every(w => cleanTitle.includes(w))) return true;

    // 3. 字符流顺序模糊匹配
    let tIdx = 0;
    for (let i = 0; i < cleanQuery.length; i++) {
      const char = cleanQuery[i];
      const foundIdx = cleanTitle.indexOf(char, tIdx);
      if (foundIdx === -1) return false;
      tIdx = foundIdx + 1;
    }
    return true;
  }

  window.handlePRDSearchInput = function(query) {
    searchKeyword = (query || '').trim().toLowerCase();
    const clearBtn = document.getElementById('prd-search-clear-btn');
    if (clearBtn) {
      clearBtn.style.display = searchKeyword ? 'inline-flex' : 'none';
    }
    renderPinMarkers();
    renderRightDrawerList();
  };

  window.clearPRDSearch = function() {
    searchKeyword = '';
    const input = document.getElementById('prd-drawer-search-input');
    if (input) input.value = '';
    const clearBtn = document.getElementById('prd-search-clear-btn');
    if (clearBtn) clearBtn.style.display = 'none';
    renderPinMarkers();
    renderRightDrawerList();
  };

  // 7. 大头针徽标渲染
  const pinsOverlay = document.createElement('div');
  pinsOverlay.id = 'prd-pins-overlay';
  pinsOverlay.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 1000015;';
  document.body.appendChild(pinsOverlay);

  function renderPinMarkers() {
    pinsOverlay.innerHTML = '';
    if (currentMode === 'hide') return;

    savedPins.forEach((pin) => {
      if (searchKeyword && !matchFuzzyTitle(pin.title, searchKeyword)) return;
      if (!pin.selector || typeof pin.selector !== 'string' || !pin.selector.trim()) return;

      let el = null;
      try {
        el = document.querySelector(pin.selector);
      } catch (e) {
        return;
      }
      if (!el) return;

      let targetEl = el;
      if (targetEl.classList.contains('modal-overlay') || (targetEl.id && (targetEl.id.startsWith('modal-') || targetEl.id.startsWith('sheet-')))) {
        const innerCard = targetEl.querySelector('.modal, .modal-dialog, .bottom-sheet, .modal-body, .sheet-body, .h5-card') || targetEl.firstElementChild;
        if (innerCard) targetEl = innerCard;
      }

      if (!isElementVisibleOnScreen(targetEl)) return;

      const rect = targetEl.getBoundingClientRect();
      const marker = document.createElement('div');
      marker.className = `prd-pin-marker pin-id-${pin.id}`;
      marker.innerText = pin.id;
      marker.title = pin.title || '需求点';

      marker.style.top = `${rect.top + 8}px`;
      marker.style.left = `${rect.left + 8}px`;

      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        showInspectBubble(pin, marker);
      });

      pinsOverlay.appendChild(marker);
    });

    const badge = document.getElementById('prd-drawer-count');
    if (badge) badge.innerText = savedPins.length;
    const edgeCount = document.getElementById('prd-edge-count');
    if (edgeCount) edgeCount.innerText = savedPins.length;
  }

  // 8. 悬浮详情气泡
  let activeBubble = null;
  function showInspectBubble(pin, anchor) {
    if (activeBubble) activeBubble.remove();

    const drawer = document.getElementById('prd-drawer');
    const isDrawerOpen = drawer && drawer.classList.contains('open');

    const bubble = document.createElement('div');
    bubble.className = 'prd-inspect-bubble';
    bubble.id = 'prd-inspect-popover';

    bubble.innerHTML = `
      <div class="prd-inspect-bubble-header">
        <div style="display:flex; align-items:center; gap:6px; flex:1; overflow:hidden;">
          <span class="prd-pin-num-pill">${pin.id}</span>
          <strong style="font-size:13px; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(pin.title || '（未命名需求）')}</strong>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
          <button class="prd-btn-action" style="padding:2px 8px; font-size:11px; background:#f1f5f9; color:#475569; border-radius:4px; border:1px solid #e2e8f0;" onclick="window.toggleDrawerFromBubble()" title="收起/展开右侧侧边栏 (不影响当前需求框)">
            <span id="prd-bubble-drawer-btn-icon">${isDrawerOpen ? '📁 收起侧边栏' : '📂 展开侧边栏'}</span>
          </button>
          <button style="background:none; border:none; font-size:18px; color:#94a3b8; cursor:pointer; padding:0 4px; line-height:1;" onclick="window.closeInspectBubble()" title="关闭当前需求框">&times;</button>
        </div>
      </div>
      <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
        <span class="prd-tag prd-tag-type">${escapeHtml(pin.type || '业务规则')}</span>
        <span class="prd-tag prd-tag-version">${escapeHtml(currentVersion)}</span>
        ${pin.selector ? `<code style="font-size:11px; background:#f1f5f9; color:#64748b; padding:1px 6px; border-radius:3px;">${escapeHtml(pin.selector)}</code>` : ''}
      </div>
      <div class="prd-md-rendered" style="flex:1; overflow-y:auto; min-height:140px; font-size:13px; line-height:1.6; padding-right:4px;">
        ${parseMarkdown(pin.desc) || '<p style="color:#94a3b8; font-style:italic;">暂无详细描述</p>'}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:6px; margin-top:2px; flex-shrink:0;">
        <span style="font-size:10px; color:#94a3b8;">${escapeHtml(pin.pageTitle || pageKey)}</span>
        <button class="prd-btn-action" style="color:var(--prd-primary);" onclick="window.openEditorForPin(${pin.id})">✏️ 编辑需求</button>
      </div>
    `;

    document.body.appendChild(bubble);
    activeBubble = bubble;

    const headerHandle = bubble.querySelector('.prd-inspect-bubble-header');
    if (headerHandle) initDraggable(bubble, headerHandle);

    const rect = anchor.getBoundingClientRect();
    let popLeft = rect.left - 140;
    let popTop = rect.bottom + 12;

    if (popLeft < 10) popLeft = 10;
    if (popLeft + 530 > window.innerWidth) popLeft = window.innerWidth - 530;
    if (popTop + 320 > window.innerHeight) popTop = Math.max(10, rect.top - 320);
    if (popTop < 10) popTop = 10;

    bubble.style.left = `${popLeft}px`;
    bubble.style.top = `${popTop}px`;

    window.renderMermaidInDom(bubble);
  }

  window.toggleDrawerFromBubble = function() {
    const drawer = document.getElementById('prd-drawer');
    const isCurrentlyOpen = drawer && drawer.classList.contains('open');
    if (isCurrentlyOpen) {
      window.setPRDMode('hide');
    } else {
      window.setPRDMode('show');
    }
    const btnText = document.getElementById('prd-bubble-drawer-btn-icon');
    if (btnText) btnText.innerText = isCurrentlyOpen ? '📂 展开侧边栏' : '📁 收起侧边栏';
  };

  window.closeInspectBubble = function() {
    if (activeBubble) {
      activeBubble.remove();
      activeBubble = null;
    }
  };

  // 9. 智能弹窗数据初始化与多端页面联动分发器
  function triggerModalWithData(modalId, pin) {
    if (!modalId) return;

    const pageTabMap = {
      'modal-audit-shop': 'tab-merchant-shop',
      'modal-suspend-shop': 'tab-merchant-shop',
      'modal-add-category': 'tab-prod-base',
      'modal-audit-product': 'tab-prod-merchant',
      'modal-edit-product': 'tab-prod-merchant',
      'modal-audit-demand': 'page-demands',
      'modal-demand-quotes': 'page-demands',
      'modal-audit-bidres': 'tab-bidding-res',
      'modal-audit-bidding-ann': 'tab-bidding-ann',
      'modal-admin-bid-detail': 'tab-bidding-ann',
      'modal-admin-contract-audit': 'tab-trades-order',
      'modal-admin-payment-audit': 'tab-trades-order',
      'modal-add-commission': 'tab-config-commission',
      'modal-customer-detail': 'page-customers',
      'modal-audit-merchant': 'page-customers',
      'modal-add-product': 'page-prod-all',
      'modal-add-listed-product': 'page-prod-listed',
      'modal-order-detail': 'page-orders',
      'modal-ship': 'page-orders',
      'modal-invoice-process': 'page-orders',
      'merchant-invoice-modal-overlay': 'page-orders',
      'modal-add-res': 'page-bidding-res',
      'modal-add-ann': 'page-bidding-ann',
      'modal-bid-award': 'page-bidding-ann',
      'modal-product-detail': 'mall-spot',
      'modal-bidding-detail': 'mall-bid',
      'modal-publish-demand': 'mall-demand',
      'modal-quote': 'mall-demand',
      'modal-demand-quotes': 'mall-demand',
      'modal-demand-quotes-runtime': 'mall-demand',
      'modal-buyer-payment': 'uc-orders',
      'modal-payment': 'uc-orders',
      'modal-contract-signing': 'uc-orders',
      'modal-contract-sign': 'uc-orders',
      'modal-apply-invoice': 'uc-invoices',
      'modal-invoice': 'uc-invoices',
      'modal-invoice-preview': 'uc-invoices',
      'modal-view-invoice': 'uc-invoices',
      'sheet-h5-product-detail': 'view-home',
      'sheet-h5-bid-detail': 'view-bid',
      'sheet-h5-publish-demand': 'view-demand',
      'sheet-h5-quote': 'view-demand',
      'sheet-h5-contract': 'view-uc-orders',
      'sheet-h5-apply-invoice': 'view-uc-invoices',
      'modal-mh5-edit-shop': 'view-shop',
      'modal-mh5-add-shelf-ann': 'view-products',
      'modal-mh5-ship': 'view-orders',
      'modal-mh5-add-res': 'view-bidding',
      'modal-mh5-add-ann': 'view-bidding'
    };

    const targetPage = pageTabMap[modalId];
    if (targetPage) {
      const pageNav = document.querySelector(`[data-page="${targetPage}"], .sidebar-menu-item[data-target="${targetPage}"], .nav-item[data-target="${targetPage}"]`);
      if (pageNav) pageNav.click();

      const mallNav = document.querySelector(`.mall-nav-item[data-target="${targetPage}"]`);
      if (mallNav) mallNav.click();

      const ucTab = document.querySelector(`#uc-menu .uc-menu-item[data-target="${targetPage}"]`);
      if (ucTab) ucTab.click();

      if (window.H5App && typeof window.H5App.switchH5View === 'function') {
        window.H5App.switchH5View(targetPage);
      }
    }

    const MD = window.MockData || {};
    const sampleShopId = (MD.shops && MD.shops.find(s => s.status === '待审核')?.id) || (MD.shops && MD.shops[0]?.id) || '10001';
    const sampleSuspendShopId = (MD.shops && MD.shops.find(s => s.status === '正常营业')?.id) || '10001';
    const sampleProdId = (MD.products && MD.products[0]?.id) || 'P001';
    const sampleDemandId = (MD.demands && MD.demands[0]?.id) || 'DEM001';
    const sampleOrderId = (MD.orders && MD.orders[0]?.id) || 'ORD202607010001';
    const sampleBidId = (MD.biddingAnnouncements && (MD.biddingAnnouncements.find(b => b.status === 1 || b.status === 2)?.id || MD.biddingAnnouncements[0]?.id)) || 'BID20260710';
    const sampleResId = (MD.biddingResources && MD.biddingResources[0]?.id) || 'RES2607010001';
    const sampleUserId = (MD.users && MD.users[0]?.id) || 1;

    try {
      if (modalId === 'modal-audit-shop') {
        if (typeof window.openAuditShopModal === 'function') window.openAuditShopModal(sampleShopId);
      } else if (modalId === 'modal-suspend-shop') {
        if (typeof window.openSuspendShopModal === 'function') window.openSuspendShopModal(sampleSuspendShopId);
      } else if (modalId === 'modal-add-category') {
        if (typeof window.openAddCategoryModal === 'function') window.openAddCategoryModal('0', 'C001', '粮食油料', true);
      } else if (modalId === 'modal-audit-product') {
        if (typeof window.openAuditProductModal === 'function') window.openAuditProductModal(sampleProdId);
      } else if (modalId === 'modal-edit-product') {
        if (typeof window.openEditProductModal === 'function') window.openEditProductModal(sampleProdId);
        else if (window.AdminApp && typeof window.AdminApp.editProduct === 'function') window.AdminApp.editProduct(sampleProdId);
      } else if (modalId === 'modal-audit-demand') {
        if (typeof window.openAuditDemandModal === 'function') window.openAuditDemandModal(sampleDemandId);
      } else if (modalId === 'modal-demand-quotes') {
        if (typeof window.openDemandQuotesModal === 'function') window.openDemandQuotesModal(sampleDemandId);
      } else if (modalId === 'modal-audit-bidres') {
        if (typeof window.openAuditBiddingResModal === 'function') window.openAuditBiddingResModal(sampleResId);
      } else if (modalId === 'modal-audit-bidding-ann') {
        if (typeof window.openAuditBiddingAnnModal === 'function') window.openAuditBiddingAnnModal(sampleBidId);
      } else if (modalId === 'modal-admin-bid-detail') {
        if (window.AdminApp && typeof window.AdminApp.openBidDetail === 'function') window.AdminApp.openBidDetail(sampleBidId);
      } else if (modalId === 'modal-add-commission') {
        if (window.AdminApp && typeof window.AdminApp.editCommission === 'function') window.AdminApp.editCommission(1);
        else if (window.AdminApp && typeof window.AdminApp.openAddCommissionModal === 'function') window.AdminApp.openAddCommissionModal();
      } else if (modalId === 'modal-customer-detail') {
        if (window.AdminApp && typeof window.AdminApp.showCustomerDetail === 'function') window.AdminApp.showCustomerDetail(sampleUserId);
      } else if (modalId === 'modal-audit-merchant') {
        if (typeof window.openAuditMerchantModal === 'function') window.openAuditMerchantModal(sampleUserId);
        else if (window.AdminApp && typeof window.AdminApp.showAuditMerchantModal === 'function') window.AdminApp.showAuditMerchantModal(sampleUserId);
      } else if (modalId === 'modal-admin-contract-audit' || modalId === 'modal-audit-contracts') {
        if (window.AdminApp && typeof window.AdminApp.showContractAuditModal === 'function') window.AdminApp.showContractAuditModal(sampleOrderId);
      } else if (modalId === 'modal-admin-payment-audit' || modalId === 'modal-audit-payment') {
        if (window.AdminApp && typeof window.AdminApp.showPaymentAuditModal === 'function') window.AdminApp.showPaymentAuditModal(sampleOrderId);
      } else if (modalId === 'modal-add-product') {
        if (window.MerchantApp && typeof window.MerchantApp.openEditProductModal === 'function') window.MerchantApp.openEditProductModal(sampleProdId);
        else if (window.MerchantApp && typeof window.MerchantApp.openAddProductModal === 'function') window.MerchantApp.openAddProductModal();
      } else if (modalId === 'modal-add-listed-product') {
        if (window.MerchantApp && typeof window.MerchantApp.openEditListedProductModal === 'function') window.MerchantApp.openEditListedProductModal(sampleProdId);
        else if (window.MerchantApp && typeof window.MerchantApp.openAddListedProductModal === 'function') window.MerchantApp.openAddListedProductModal();
      } else if (modalId === 'modal-order-detail') {
        if (window.UI && typeof window.UI.showOrderDetail === 'function') window.UI.showOrderDetail(sampleOrderId);
      } else if (modalId === 'modal-contract-sign') {
        if (window.MerchantApp && typeof window.MerchantApp.openContractSignModal === 'function') window.MerchantApp.openContractSignModal(sampleOrderId);
        else if (window.MallApp && typeof window.MallApp.openContractSignModal === 'function') window.MallApp.openContractSignModal(sampleOrderId);
      } else if (modalId === 'modal-ship') {
        if (window.MerchantApp && typeof window.MerchantApp.openShipModal === 'function') window.MerchantApp.openShipModal(sampleOrderId);
      } else if (modalId === 'modal-invoice-process' || modalId === 'merchant-invoice-modal-overlay') {
        if (window.MerchantApp && typeof window.MerchantApp.openInvoiceUploadModal === 'function') window.MerchantApp.openInvoiceUploadModal(sampleOrderId);
      } else if (modalId === 'modal-add-res') {
        if (window.MerchantApp && typeof window.MerchantApp.openEditResModal === 'function') window.MerchantApp.openEditResModal(sampleResId);
      } else if (modalId === 'modal-add-ann') {
        if (window.MerchantApp && typeof window.MerchantApp.openEditAnnModal === 'function') window.MerchantApp.openEditAnnModal(sampleBidId);
      } else if (modalId === 'modal-bid-award') {
        if (window.MerchantApp && typeof window.MerchantApp.openAwardModal === 'function') window.MerchantApp.openAwardModal(sampleBidId, false);
      } else if (modalId === 'modal-product-detail') {
        if (window.MallApp && typeof window.MallApp.showProductDetail === 'function') window.MallApp.showProductDetail(sampleProdId);
      } else if (modalId === 'modal-bidding-detail') {
        if (window.MallApp && typeof window.MallApp.showBiddingDetail === 'function') window.MallApp.showBiddingDetail(sampleBidId);
      } else if (modalId === 'modal-publish-demand') {
        if (window.MallApp && typeof window.MallApp.openPublishDemandModal === 'function') window.MallApp.openPublishDemandModal();
      } else if (modalId === 'modal-quote') {
        if (window.MallApp && typeof window.MallApp.openQuoteModal === 'function') window.MallApp.openQuoteModal(sampleDemandId);
      } else if (modalId === 'modal-demand-quotes' || modalId === 'modal-view-quotes' || modalId === 'modal-demand-quotes-runtime') {
        if (window.UI && typeof window.UI.showDemandQuotesModal === 'function') window.UI.showDemandQuotesModal(sampleDemandId, false);
      } else if (modalId === 'modal-contract-signing' || modalId === 'modal-contract-sign') {
        if (window.UI && typeof window.UI.showContractSigningModal === 'function') window.UI.showContractSigningModal(sampleOrderId, false);
      } else if (modalId === 'modal-payment' || modalId === 'modal-buyer-payment') {
        if (window.UI && typeof window.UI.showPaymentModal === 'function') window.UI.showPaymentModal(sampleOrderId);
      } else if (modalId === 'modal-invoice' || modalId === 'modal-apply-invoice') {
        if (window.UI && typeof window.UI.showInvoiceModal === 'function') window.UI.showInvoiceModal(sampleOrderId);
      } else if (modalId === 'modal-invoice-preview' || modalId === 'modal-view-invoice') {
        if (window.UI && typeof window.UI.showInvoicePreviewModal === 'function') window.UI.showInvoicePreviewModal('INV202607010001');
      } else if (modalId === 'sheet-h5-product-detail') {
        if (window.H5App && typeof window.H5App.openProductDetail === 'function') window.H5App.openProductDetail(sampleProdId);
      } else if (modalId === 'sheet-h5-bid-detail') {
        if (window.H5App && typeof window.H5App.openBidDetail === 'function') window.H5App.openBidDetail(sampleBidId);
      } else if (modalId === 'sheet-h5-publish-demand') {
        if (window.H5App && typeof window.H5App.openPublishDemandSheet === 'function') window.H5App.openPublishDemandSheet();
      } else if (modalId === 'sheet-h5-quote') {
        if (window.H5App && typeof window.H5App.openQuoteSheet === 'function') window.H5App.openQuoteSheet(sampleDemandId);
      } else if (modalId === 'sheet-h5-contract') {
        if (window.H5App && typeof window.H5App.openContractSheet === 'function') window.H5App.openContractSheet(sampleOrderId);
      } else if (modalId === 'sheet-h5-apply-invoice') {
        if (window.H5App && typeof window.H5App.openApplyInvoiceSheet === 'function') window.H5App.openApplyInvoiceSheet(sampleOrderId);
      } else if (modalId === 'modal-mh5-edit-shop') {
        if (window.MerchantH5App && typeof window.MerchantH5App.openShopAppealModal === 'function') window.MerchantH5App.openShopAppealModal();
      } else if (modalId === 'modal-mh5-add-shelf-ann') {
        if (window.MerchantH5App && typeof window.MerchantH5App.openAddShelfAnnModal === 'function') window.MerchantH5App.openAddShelfAnnModal();
      } else if (modalId === 'modal-mh5-ship') {
        if (window.MerchantH5App && typeof window.MerchantH5App.openShipModal === 'function') window.MerchantH5App.openShipModal(sampleOrderId);
      } else if (modalId === 'modal-mh5-add-res') {
        if (window.MerchantH5App && typeof window.MerchantH5App.openAddResModal === 'function') window.MerchantH5App.openAddResModal();
      } else if (modalId === 'modal-mh5-add-ann') {
        if (window.MerchantH5App && typeof window.MerchantH5App.openAddAnnModal === 'function') window.MerchantH5App.openAddAnnModal(sampleBidId);
      }
    } catch (err) {
      console.warn('triggerModalWithData error:', err);
    }

    const m = document.getElementById(modalId);
    if (m && (getComputedStyle(m).display === 'none' || !m.classList.contains('active'))) {
      if (window.UI && typeof window.UI.showModal === 'function') window.UI.showModal(modalId);
      else if (window.UI && typeof window.UI.openModal === 'function') window.UI.openModal(modalId);
      else {
        m.style.display = 'flex';
        m.classList.add('active');
      }
    }
  }

  // 10. 毫秒级精准定位与动态帧率追踪发光框引擎 (Continuous Tracking Glow Box)
  let trackingGlowFrame = null;

  window.locateAndHighlight = function(id, showBubble = true) {
    const pin = savedPins.find(p => p.id === id);
    if (!pin) return;

    if (!pin.selector || typeof pin.selector !== 'string' || !pin.selector.trim()) {
      showToast('该需求暂未绑定具体的页面元素', 'info');
      return;
    }

    let modalId = null;
    if (pin.selector.startsWith('#')) {
      const possibleId = pin.selector.replace(/^#/, '').split(/[\s\.\[:]/)[0];
      if (possibleId.includes('modal') || possibleId.includes('sheet') || possibleId.includes('overlay')) {
        modalId = possibleId;
      }
    }

    let el = null;
    try {
      el = document.querySelector(pin.selector);
    } catch (e) {}

    if (!modalId && el) {
      const modalParent = el.closest('.modal-overlay, [id^="modal-"], [id^="sheet-"]');
      if (modalParent) modalId = modalParent.id;
    }

    if (modalId) {
      triggerModalWithData(modalId, pin);
    } else {
      const ucTabMatch = pin.selector.match(/#?(uc-[a-zA-Z0-9_-]+)/);
      if (ucTabMatch) {
        const ucTabId = ucTabMatch[1];
        const ucenterNav = document.querySelector(`.mall-nav-item[data-target="mall-ucenter"]`) || document.querySelector(`[onclick*="mall-ucenter"]`);
        if (ucenterNav) ucenterNav.click();
        if (window.MallApp && typeof window.MallApp.showUCTab === 'function') {
          window.MallApp.showUCTab(ucTabId);
          if (ucTabId === 'uc-cart') window.MallApp.renderCart && window.MallApp.renderCart();
          if (ucTabId === 'uc-bids') window.MallApp.renderUCBids && window.MallApp.renderUCBids();
          if (ucTabId === 'uc-orders') window.MallApp.renderUCOrders && window.MallApp.renderUCOrders();
        } else {
          const ucLink = document.querySelector(`#uc-menu .uc-menu-item[data-target="${ucTabId}"]`);
          if (ucLink) ucLink.click();
        }
      }

      const views = document.querySelectorAll('.h5-view, .uc-view, .mall-view, .page-view, .tab-pane, .tab-content');
      for (let view of views) {
        if (pin.selector.includes(view.id) || (el && view.contains(el))) {
          const viewId = view.id;
          if (window.H5App && typeof window.H5App.switchH5View === 'function') window.H5App.switchH5View(viewId);
          const h5Tab = document.querySelector(`.h5-tab-item[data-target="${viewId}"], .h5-tab[data-target="${viewId}"], .tab-item[data-target="${viewId}"], [data-target="${viewId}"]`);
          if (h5Tab) h5Tab.click();
          
          if (view.classList.contains('uc-view')) {
            const ucenterNav = document.querySelector(`.mall-nav-item[data-target="mall-ucenter"]`);
            if (ucenterNav) ucenterNav.click();
            if (window.MallApp && typeof window.MallApp.showUCTab === 'function') {
              window.MallApp.showUCTab(viewId);
              if (viewId === 'uc-cart') window.MallApp.renderCart && window.MallApp.renderCart();
              if (viewId === 'uc-bids') window.MallApp.renderUCBids && window.MallApp.renderUCBids();
              if (viewId === 'uc-orders') window.MallApp.renderUCOrders && window.MallApp.renderUCOrders();
            }
          } else if (view.classList.contains('mall-view')) {
            const mainNav = document.querySelector(`.mall-nav-item[data-target="${viewId}"]`);
            if (mainNav) mainNav.click();
          } else {
            const ucLink = document.querySelector(`#uc-menu .uc-menu-item[data-target="${viewId}"]`);
            if (ucLink) ucLink.click();
            const mainNav = document.querySelector(`.mall-nav-item[data-target="${viewId}"]`);
            if (mainNav) mainNav.click();
          }

          const menuLink = document.querySelector(`[data-page="${viewId}"]`) || document.querySelector(`.menu-item[data-page="${viewId}"]`);
          if (menuLink) menuLink.click();
        }
      }
    }

    // 平滑滚动并启动动态帧率追踪发光框
    setTimeout(() => {
      let target = null;
      try {
        target = document.querySelector(pin.selector);
      } catch (e) {}

      if (target) {
        let scrollTarget = target;
        if (target.classList.contains('modal-overlay')) {
          scrollTarget = target.querySelector('.modal, .modal-dialog, .bottom-sheet, .modal-body, .sheet-body') || target;
        }
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // 创建固定视口发光框
      document.querySelectorAll('.prd-target-glow-box').forEach(b => b.remove());
      if (trackingGlowFrame) cancelAnimationFrame(trackingGlowFrame);

      const glowBox = document.createElement('div');
      glowBox.className = 'prd-target-glow-box';
      document.body.appendChild(glowBox);

      let frameCount = 0;
      const maxFrames = 50; // 追踪约 800ms 覆盖平滑滚动全周期

      function updateGlowPosition() {
        let curTarget = null;
        try {
          curTarget = document.querySelector(pin.selector);
        } catch (e) {}

        if (curTarget) {
          let highlightEl = curTarget;
          if (curTarget.classList.contains('modal-overlay') || (curTarget.id && (curTarget.id.startsWith('modal-') || curTarget.id.startsWith('sheet-')))) {
            highlightEl = curTarget.querySelector('.modal, .modal-dialog, .bottom-sheet, .modal-body, .sheet-body') || curTarget;
          }

          const rect = highlightEl.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            glowBox.style.top = `${rect.top - 4}px`;
            glowBox.style.left = `${rect.left - 4}px`;
            glowBox.style.width = `${rect.width + 8}px`;
            glowBox.style.height = `${rect.height + 8}px`;
            glowBox.style.display = 'block';
          } else {
            glowBox.style.display = 'none';
          }
        }

        renderPinMarkers();

        frameCount++;
        if (frameCount < maxFrames) {
          trackingGlowFrame = requestAnimationFrame(updateGlowPosition);
        } else {
          // 滚动结束后在最终位置高亮并呼出气泡
          let finalTarget = document.querySelector(pin.selector);
          if (finalTarget) {
            const marker = document.querySelector(`.prd-pin-marker.pin-id-${pin.id}`);
            if (marker) {
              marker.classList.add('highlighted');
              setTimeout(() => marker.classList.remove('highlighted'), 2500);
            }
            if (showBubble) {
              showInspectBubble(pin, marker || finalTarget);
            }
          }
          setTimeout(() => glowBox.remove(), 2500);
        }
      }

      trackingGlowFrame = requestAnimationFrame(updateGlowPosition);
    }, 120);
  };

  // 11. 真正的可视化直编表格与无框逐行沉浸式工作台 (Visual Table & Borderless In-Line Editor)
  let activeEditorEl = null;
  let editorWorkbenchMode = 'live'; // 'live' (可视化即时直编) | 'raw' (纯文本源码)
  let editorBlocks = [];
  let activeEditingBlockIndex = null;
  let lastFocusedBlockIndex = 0;
  let lastSelectionRange = { start: 0, end: 0 };

  function splitMarkdownIntoBlocks(text) {
    if (!text || !text.trim()) {
      return [{ id: 'b_1', type: 'paragraph', text: '' }];
    }
    const lines = text.split('\n');
    const blocks = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // 1. Mermaid or Code block
      if (trimmed.startsWith('```')) {
        const codeLines = [line];
        const isMermaid = trimmed.includes('mermaid');
        i++;
        while (i < lines.length) {
          codeLines.push(lines[i]);
          if (lines[i].trim().startsWith('```')) {
            i++;
            break;
          }
          i++;
        }
        blocks.push({
          id: 'b_' + (blocks.length + 1) + '_' + Date.now(),
          type: isMermaid ? 'mermaid' : 'code',
          text: codeLines.join('\n')
        });
        continue;
      }

      // 2. Table block (精确识别包含分隔线的标准多行表格，避免误判单行或 Mermaid 标签)
      if (trimmed.includes('|') && (trimmed.startsWith('|') || trimmed.endsWith('|') || (i + 1 < lines.length && /^(\s*:?-+:?\s*\|?)+$/.test(lines[i+1].trim().replace(/\|/g, ' '))))) {
        const tableLines = [line];
        i++;
        while (i < lines.length) {
          const nextTrim = lines[i].trim();
          if (nextTrim === '' || nextTrim.startsWith('```') || /^#{1,6}\s+/.test(nextTrim) || /^(-{3,}|\*{3,}|_{3,})$/.test(nextTrim)) {
            break;
          }
          if (nextTrim.includes('|')) {
            tableLines.push(lines[i]);
            i++;
          } else {
            break;
          }
        }
        blocks.push({
          id: 'b_' + (blocks.length + 1) + '_' + Date.now(),
          type: 'table',
          text: tableLines.join('\n')
        });
        continue;
      }

      // 3. Heading
      if (/^#{1,6}\s+/.test(trimmed)) {
        blocks.push({
          id: 'b_' + (blocks.length + 1) + '_' + Date.now(),
          type: 'heading',
          text: line
        });
        i++;
        continue;
      }

      // 4. Divider
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        blocks.push({
          id: 'b_' + (blocks.length + 1) + '_' + Date.now(),
          type: 'divider',
          text: line
        });
        i++;
        continue;
      }

      // 5. Empty line
      if (trimmed === '') {
        i++;
        continue;
      }

      // 6. Paragraph or list
      const paraLines = [line];
      i++;
      while (i < lines.length) {
        const nextLine = lines[i];
        const nextTrim = nextLine.trim();
        if (nextTrim === '' || nextTrim.startsWith('```') || (nextTrim.startsWith('|') && nextTrim.endsWith('|')) || /^#{1,6}\s+/.test(nextTrim) || /^(-{3,}|\*{3,}|_{3,})$/.test(nextTrim)) {
          break;
        }
        paraLines.push(nextLine);
        i++;
      }
      blocks.push({
        id: 'b_' + (blocks.length + 1) + '_' + Date.now(),
        type: 'paragraph',
        text: paraLines.join('\n')
      });
    }

    if (blocks.length === 0) {
      blocks.push({ id: 'b_1', type: 'paragraph', text: '' });
    }
    return blocks;
  }

  function getFullMarkdownFromBlocks() {
    return editorBlocks.map(b => b.text).join('\n\n');
  }

  window.openEditorForPin = async function(id) {
    const isApiOk = await checkBackendApiAvailable();
    if (!isApiOk) {
      window.showNoBackendAlertModal('edit');
      return;
    }
    window.closeInspectBubble();
    const pin = savedPins.find(p => p.id === id) || {
      id: null,
      title: '',
      type: '业务规则',
      desc: '',
      selector: ''
    };

    activeDraft = JSON.parse(JSON.stringify(pin));
    editorBlocks = splitMarkdownIntoBlocks(activeDraft.desc || '');
    activeEditingBlockIndex = null;
    renderEditorModal(activeDraft);
  };

    // 动态加载 Vditor 样式与脚本 (优先使用相对路径 vendor，降级使用 CDN)
  let isVditorLoading = false;
  let isVditorLoaded = false;

  function ensureVditorLoaded(callback) {
    if (window.Vditor) {
      isVditorLoaded = true;
      if (callback) callback();
      return;
    }
    if (isVditorLoading) {
      const timer = setInterval(() => {
        if (window.Vditor) {
          clearInterval(timer);
          isVditorLoaded = true;
          if (callback) callback();
        }
      }, 50);
      return;
    }
    isVditorLoading = true;

    // 相对基准路径
    const localVendorDir = scriptBasePath.includes('/js/') ? scriptBasePath.replace('/js/', '/vendor/vditor/') : (scriptBasePath + 'vendor/vditor/');

    if (!document.getElementById('vditor-css')) {
      const link = document.createElement('link');
      link.id = 'vditor-css';
      link.rel = 'stylesheet';
      link.href = localVendorDir + 'index.css';
      link.onerror = () => {
        link.href = 'https://cdn.jsdelivr.net/npm/vditor@3.10.8/dist/index.css';
      };
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.src = localVendorDir + 'index.min.js';
    script.onerror = () => {
      const fallbackScript = document.createElement('script');
      fallbackScript.src = 'https://cdn.jsdelivr.net/npm/vditor@3.10.8/dist/index.min.js';
      fallbackScript.onload = () => {
        isVditorLoaded = true;
        isVditorLoading = false;
        if (callback) callback();
      };
      fallbackScript.onerror = () => {
        isVditorLoading = false;
        if (callback) callback(); // 即使 CDN 也失败，也触发回调进入 fallback textarea
      };
      document.head.appendChild(fallbackScript);
    };
    script.onload = () => {
      isVditorLoaded = true;
      isVditorLoading = false;
      if (callback) callback();
    };
    document.head.appendChild(script);
  }

  function getVditorLang() {
    if (currentLang === 'zh-CN') return 'zh_CN';
    if (currentLang === 'ja') return 'ja_JP';
    if (currentLang === 'ko') return 'ko_KR';
    return 'en_US';
  }

  function renderEditorModal(draft) {
    if (activeEditorEl) activeEditorEl.remove();

    const editor = document.createElement('div');
    editor.className = 'prd-editor-modal';
    editor.id = 'prd-floating-editor';

    editor.innerHTML = `
      <div class="prd-editor-header" id="prd-editor-drag-handle">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:15px;">✏️</span>
          <strong>${draft.id ? `${t('editModalTitle')} #${draft.id}` : t('createModalTitle')}</strong>
          <span class="prd-tag prd-tag-version">${escapeHtml(currentVersion)}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="prd-btn-action" style="color:#ffffff; font-size:16px; background:none; border:none; cursor:pointer;" onclick="window.closeEditorModal()" title="${escapeHtml(t('cancelBtn'))}">&times;</button>
        </div>
      </div>

      <div class="prd-editor-body" style="padding:16px; display:flex; flex-direction:column; gap:12px; height:calc(100% - 50px); box-sizing:border-box;">
        <!-- 头部元信息表单 -->
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 12px; flex-shrink:0;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:12px; font-weight:700; color:#334155;">${t('reqTitleLabel')} <span style="color:#ef4444;">*</span></label>
            <input type="text" id="prd-modal-title" style="padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; outline:none;" placeholder="${escapeHtml(t('reqTitlePlaceholder'))}" value="${escapeHtml(draft.title || '')}">
          </div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:12px; font-weight:700; color:#334155;">${t('reqTypeLabel')}</label>
            <select id="prd-modal-type" style="padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; outline:none; background:#fff;">
              <option value="业务规则" ${draft.type === '业务规则' ? 'selected' : ''}>${t('reqTypes')['业务规则'] || '业务规则'}</option>
              <option value="交互逻辑" ${draft.type === '交互逻辑' ? 'selected' : ''}>${t('reqTypes')['交互逻辑'] || '交互逻辑'}</option>
              <option value="数据口径" ${draft.type === '数据口径' ? 'selected' : ''}>${t('reqTypes')['数据口径'] || '数据口径'}</option>
              <option value="权限规则" ${draft.type === '权限规则' ? 'selected' : ''}>${t('reqTypes')['权限规则'] || '权限规则'}</option>
              <option value="异常流" ${draft.type === '异常流' ? 'selected' : ''}>${t('reqTypes')['异常流'] || '异常流'}</option>
              <option value="UI规范" ${draft.type === 'UI规范' ? 'selected' : ''}>${t('reqTypes')['UI规范'] || 'UI规范'}</option>
            </select>
          </div>
        </div>

        <!-- 业务规约快捷模板下拉菜单与快捷插入栏 -->
        <div style="display:flex; align-items:center; justify-content:space-between; flex-shrink:0; background:#f8fafc; padding:6px 10px; border-radius:6px; border:1px solid #e2e8f0;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12px; font-weight:700; color:#475569;">💡 快速插入规约：</span>
            <button class="prd-btn-action" style="font-size:11px; padding:3px 8px; background:#fff;" onclick="window.insertVditorTemplate('rule')">📋 业务规则模版</button>
            <button class="prd-btn-action" style="font-size:11px; padding:3px 8px; background:#fff;" onclick="window.insertVditorTemplate('state-chart')">🔄 状态机流程图</button>
            <button class="prd-btn-action" style="font-size:11px; padding:3px 8px; background:#fff;" onclick="window.insertVditorTemplate('table-dict')">📊 字段数据字典表</button>
          </div>
          <div style="font-size:11px; color:#64748b;">
            ⌨️ 提示：支持按 <kbd style="background:#e2e8f0; padding:1px 4px; border-radius:3px;">Tab</kbd> / <kbd style="background:#e2e8f0; padding:1px 4px; border-radius:3px;">Shift+Tab</kbd> 多级层级缩进
          </div>
        </div>

        <!-- Vditor 嵌入容器 (支持即时渲染、多级缩进、可视化表格、Mermaid) -->
        <div style="flex:1; position:relative; min-height:360px; overflow:hidden; border-radius:6px;">
          <div id="prd-vditor-container" style="height:100%;"></div>
        </div>

        <!-- 底部绑定状态与操作栏 (单一暂存并看页面入口) -->
        <div style="display:flex; align-items:center; justify-content:space-between; flex-shrink:0; padding-top:8px; border-top:1px solid #f1f5f9;">
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="prd-btn-action" style="font-size:11.5px; padding:4px 10px; color:#2563eb;" onclick="window.rePickElementForDraft()">${t('rePickBtn')}</button>
            <span style="font-size:11px; color:#64748b; max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              ${draft.selector ? `<span style="color:#059669;">● ${t('boundComp')}:</span> <code>${escapeHtml(draft.selector)}</code>` : `<span style="color:#94a3b8;">○ ${t('unboundElementTip')}</span>`}
            </span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="prd-btn-action" style="padding:6px 14px; background:#eff6ff; color:#1d4ed8; font-weight:600; border-color:#bfdbfe;" onclick="window.minimizeEditor()" title="暂存当前草稿并折叠至右下角胶囊，随时查阅底层原型">${t('tempSaveBtn')}</button>
            <button class="prd-btn-action" style="padding:6px 14px; background:#f1f5f9;" onclick="window.closeEditorModal()">${t('cancelBtn')}</button>
            <button class="prd-btn-primary" style="padding:6px 18px;" onclick="window.saveEditorModal()">${t('saveBtn')}</button>
          </div>
        </div>
          </div>
    `;

    document.body.appendChild(editor);
    activeEditorEl = editor;

    const dragHandle = document.getElementById('prd-editor-drag-handle');
    if (dragHandle) initDraggable(editor, dragHandle);

    // 实例化 Vditor
    ensureVditorLoaded(() => {
      const container = document.getElementById('prd-vditor-container');
      if (!container) return;

      try {
        if (window.vditorInstance) {
          try {
            if (window.vditorInstance.vditor) window.vditorInstance.destroy();
          } catch (e) {}
          window.vditorInstance = null;
        }
        container.innerHTML = '';

        window.vditorInstance = new window.Vditor('prd-vditor-container', {
          mode: 'ir', // Instant Rendering 即时渲染模式 (Typora 级体验)
          lang: getVditorLang(),
          height: '100%',
          cdn: 'https://cdn.jsdelivr.net/npm/vditor@3.10.8',
          tab: '\t', // 开启 Tab 缩进
          counter: { enable: true },
          cache: { enable: false },
          toolbar: [
            'headings', 'bold', 'italic', 'strike', '|',
            'line', 'quote', 'list', 'ordered-list', 'check', '|',
            'code', 'inline-code', 'table', '|',
            'undo', 'redo', '|',
            'edit-mode', 'fullscreen'
          ],
          value: draft.desc || '',
          preview: {
            delay: 100,
            hljs: { style: 'github' },
            markdown: {
              toc: true,
              autoSpace: true
            }
          },
          after: () => {
            // Vditor 加载就绪
          }
        });
      } catch (err) {
        console.warn('Vditor init failed, fallback to textarea:', err);
        container.innerHTML = `<textarea id="prd-fallback-textarea" style="width:100%; height:100%; box-sizing:border-box; padding:10px; font-family:monospace; border:1px solid #cbd5e1; border-radius:6px;">${escapeHtml(draft.desc || '')}</textarea>`;
      }
    });
  }

  window.insertVditorTemplate = function(type) {
    let tpl = '';
    if (type === 'rule') {
      tpl = `### 1. 业务规则与流转\n- **触发条件**：用户在界面点击当前操作按钮\n- **前置校验**：必填项完整性与格式校验\n- **处理逻辑**：\n  - 弹出二次确认弹窗\n  - 提交接口执行状态流转\n  - 刷新列表数据并下发通知\n\n### 2. 异常分支处理\n- 网络超时或接口报错时 Toast 提示友好错误码`;
    } else if (type === 'state-chart') {
      tpl = `\`\`\`mermaid\ngraph TB\n    A[草稿 / 待审核] -->|运营审核通过| B[正常营业 / 履约中]\n    A -->|运营驳回| C[已下架 · 待整改]\n    B -->|业务到期或超时| D[已完成]\n\`\`\``;
    } else if (type === 'table-dict') {
      tpl = `| 字段名 | 字段类型 | 是否必填 | 枚举值 / 格式说明 | 业务口径与默认值 |\n|---|---|---|---|---|\n| orderId | String | 是 | 18位纯数字 | 订单唯一编号，系统雪花算法生成 |\n| payAmount | Decimal | 是 | >= 0.00 | 实际支付金额，单位：元 |\n| status | Enum | 是 | PENDING / SUCCESS | 订单状态，默认 PENDING |`;
    }

    // 优先插入 Vditor
    if (window.vditorInstance && typeof window.vditorInstance.getValue === 'function') {
      try {
        window.vditorInstance.focus();
        window.vditorInstance.insertValue('\n\n' + tpl + '\n\n');
        return;
      } catch (e) {
        const cur = window.vditorInstance.getValue() || '';
        window.vditorInstance.setValue(cur ? cur.trim() + '\n\n' + tpl + '\n\n' : tpl);
        return;
      }
    }

    // 兜底：若 Vditor 尚未就绪或在纯文本/离线模式下，直接操作 textarea
    let textarea = document.getElementById('prd-fallback-textarea') || document.querySelector('#prd-vditor-container textarea');
    if (!textarea) {
      const container = document.getElementById('prd-vditor-container');
      if (container) {
        container.innerHTML = `<textarea id="prd-fallback-textarea" style="width:100%; height:100%; box-sizing:border-box; padding:10px; font-family:monospace; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; outline:none; line-height:1.5;">${escapeHtml(activeDraft?.desc || '')}</textarea>`;
        textarea = document.getElementById('prd-fallback-textarea');
      }
    }
    if (textarea) {
      const start = textarea.selectionStart || textarea.value.length;
      const end = textarea.selectionEnd || textarea.value.length;
      const val = textarea.value || '';
      textarea.value = val.substring(0, start) + '\n\n' + tpl + '\n\n' + val.substring(end);
      textarea.focus();
      if (activeDraft) activeDraft.desc = textarea.value;
    }
  };

  // 12. 编辑器最小化与恢复逻辑
  window.minimizeEditor = function() {
    if (!activeDraft) return;
    const titleInput = document.getElementById('prd-modal-title');
    const typeSelect = document.getElementById('prd-modal-type');

    activeDraft.title = titleInput ? titleInput.value : activeDraft.title;
    activeDraft.type = typeSelect ? typeSelect.value : activeDraft.type;

    if (window.vditorInstance && typeof window.vditorInstance.getValue === 'function') {
      activeDraft.desc = window.vditorInstance.getValue();
    } else {
      const fallback = document.getElementById('prd-fallback-textarea');
      if (fallback) activeDraft.desc = fallback.value;
    }

    if (activeEditorEl) {
      activeEditorEl.remove();
      activeEditorEl = null;
    }

    const oldDock = document.getElementById('prd-editor-mini-dock');
    if (oldDock) oldDock.remove();

    const dock = document.createElement('div');
    dock.className = 'prd-editor-mini-dock';
    dock.id = 'prd-editor-mini-dock';
    dock.title = '点击恢复需求编辑工作台';
    dock.onclick = window.restoreEditorModal;

    const displayTitle = activeDraft.title ? activeDraft.title : (activeDraft.id ? `需求 #${activeDraft.id}` : '新建需求');

    dock.innerHTML = `
      <span style="font-size:18px;">✏️</span>
      <div style="display:flex; flex-direction:column; line-height:1.2;">
        <strong style="font-size:12px; color:#ffffff; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${t('editingDraftPrefix')}: ${escapeHtml(displayTitle)}</strong>
        <span style="font-size:10px; color:#94a3b8;">${t('draftStashedTip')}</span>
      </div>
      <button class="prd-btn-action" style="padding:4px 10px; font-size:11px; background:#2563eb; color:#ffffff; border-radius:14px; font-weight:700; margin-left:4px;">${t('restoreEditBtn')}</button>
      <button style="background:none; border:none; color:#94a3b8; font-size:16px; cursor:pointer; padding:0 4px; line-height:1;" onclick="event.stopPropagation(); window.cancelEditorFromDock()" title="${escapeHtml(t('cancelBtn'))}">&times;</button>
    `;

    document.body.appendChild(dock);
    showToast('💡 编辑器已最小化至右下角，您可随意查阅底部页面原型，点击右下角胶囊即可继续编辑！', 'info');
  };

  window.restoreEditorModal = function() {
    const dock = document.getElementById('prd-editor-mini-dock');
    if (dock) dock.remove();
    if (activeDraft) {
      renderEditorModal(activeDraft);
    }
  };

  window.cancelEditorFromDock = function() {
    if (confirm(t('discardDraftPrompt'))) {
      const dock = document.getElementById('prd-editor-mini-dock');
      if (dock) dock.remove();
      activeDraft = null;
      showToast('已取消编辑并关闭草稿', 'info');
    }
  };

  window.closeEditorModal = function() {
    if (activeEditorEl) {
      activeEditorEl.remove();
      activeEditorEl = null;
    }
    const oldDock = document.getElementById('prd-editor-mini-dock');
    if (oldDock) oldDock.remove();
    activeDraft = null;
  };

window.saveEditorModal = async function() {
    if (!activeDraft) return;

    const titleInput = document.getElementById('prd-modal-title');
    const typeSelect = document.getElementById('prd-modal-type');

    const title = titleInput ? titleInput.value.trim() : activeDraft.title;
    const desc = (window.vditorInstance && typeof window.vditorInstance.getValue === 'function') ? window.vditorInstance.getValue().trim() : ((document.getElementById('prd-fallback-textarea')?.value || activeDraft.desc || '').trim());
    const type = typeSelect ? typeSelect.value : activeDraft.type;

    if (!title) {
      alert('请输入需求名称！');
      return;
    }

    activeDraft.title = title;
    activeDraft.desc = desc;
    activeDraft.type = type;
    activeDraft.version = currentVersion;

    const backup = JSON.parse(JSON.stringify(savedPins));

    if (activeDraft.id) {
      const idx = savedPins.findIndex(p => p.id === activeDraft.id);
      if (idx !== -1) {
        savedPins[idx] = activeDraft;
      }
    } else {
      savedPins.unshift(activeDraft);
    }

    reIndexPins(savedPins);
    const isSaved = await persistData();

    if (isSaved) {
      window.closeEditorModal();
      renderPinMarkers();
      renderRightDrawerList();
      showToast('✅ 需求规约已成功保存并写入本地 JS 文件！', 'success');
    } else {
      savedPins = backup;
      reIndexPins(savedPins);
      renderPinMarkers();
      renderRightDrawerList();
      alert('❌ 保存失败：未检测到本地服务接口，无法写入本地磁盘 JS 文件！\n请先启动本地服务（./start.sh）后再试。');
      showToast('❌ 保存失败', 'error');
    }
  };

  window.rePickElementFromModal = function() {
    window.minimizeEditor();
    rePickModeActive = true;
    document.body.style.cursor = 'crosshair';
    showToast('请在页面上点击要重新绑定的新组件！', 'info');
    bindPickListeners();
  };

  // 13. 右侧抽屉列表渲染与安全管理锁模式
  let draggedPinId = null;

  window.toggleDrawerManageMode = async function() {
    if (!isDrawerManageMode) {
      const isApiOk = await checkBackendApiAvailable();
      if (!isApiOk) {
        window.showNoBackendAlertModal('reorder');
        return;
      }
    }
    isDrawerManageMode = !isDrawerManageMode;
    renderRightDrawerList();
    showToast(isDrawerManageMode ? '🔧 已开启排序与删除管理模式（可拖拽或调整序号）' : '🔒 已退出管理模式（列表已安全锁定）', 'info');
  };

  window.handleCardDragStart = function(e, id) {
    if (!isDrawerManageMode) return;
    draggedPinId = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
    setTimeout(() => {
      const card = e.target.closest('.prd-card-item');
      if (card) card.classList.add('dragging');
    }, 0);
  };

  window.handleCardDragOver = function(e) {
    if (!isDrawerManageMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const card = e.currentTarget.closest('.prd-card-item');
    if (card && !card.classList.contains('dragging')) {
      card.classList.add('drag-over');
    }
  };

  window.handleCardDragLeave = function(e) {
    const card = e.currentTarget.closest('.prd-card-item');
    if (card) card.classList.remove('drag-over');
  };

  window.handleCardDragEnd = function(e) {
    document.querySelectorAll('.prd-card-item').forEach(el => {
      el.classList.remove('dragging');
      el.classList.remove('drag-over');
    });
    draggedPinId = null;
  };

  window.handleCardDrop = async function(e, targetId) {
    if (!isDrawerManageMode) return;
    e.preventDefault();
    document.querySelectorAll('.prd-card-item').forEach(el => {
      el.classList.remove('dragging');
      el.classList.remove('drag-over');
    });
    const srcId = draggedPinId || parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!srcId || srcId === targetId) return;

    const targetIdx = savedPins.findIndex(p => p.id === targetId);
    if (targetIdx !== -1) {
      await window.reorderPinToIndex(srcId, targetIdx);
    }
  };

  window.promptChangePinOrder = async function(id) {
    const curIdx = savedPins.findIndex(p => p.id === id);
    if (curIdx === -1) return;
    const currentRank = curIdx + 1;
    const input = prompt(`【调整需求排序】\n当前需求为第 #${currentRank} 项。\n请输入新的目标序号 (1 ~ ${savedPins.length}):`, currentRank);
    if (input === null) return;
    const targetRank = parseInt(input.trim(), 10);
    if (isNaN(targetRank) || targetRank < 1 || targetRank > savedPins.length) {
      showToast(`请输入 1 到 ${savedPins.length} 之间的有效序号！`, 'warning');
      return;
    }
    if (targetRank === currentRank) return;

    await window.reorderPinToIndex(id, targetRank - 1);
  };

  window.reorderPinToIndex = async function(id, targetIdx) {
    const curIdx = savedPins.findIndex(p => p.id === id);
    if (curIdx === -1) return;
    targetIdx = Math.max(0, Math.min(savedPins.length - 1, targetIdx));
    if (curIdx === targetIdx) return;

    // 记录列表当前滚动高度，保证重绘后位置完全不跳动
    const drawerList = document.getElementById('prd-drawer-list');
    const prevScrollTop = drawerList ? drawerList.scrollTop : 0;

    const backup = JSON.parse(JSON.stringify(savedPins));
    
    // 移至上方：该项移到 targetIdx，原位置项依次往下瞬移顺延
    const [moved] = savedPins.splice(curIdx, 1);
    savedPins.splice(targetIdx, 0, moved);

    // 重新按序赋予 1..N 连续自然序号
    reIndexPins(savedPins);

    const isSaved = await persistData();
    if (isSaved) {
      renderPinMarkers();
      renderRightDrawerList();
      renderMiniRailList();

      // 瞬时锁定并恢复滚动高度
      const updatedDrawerList = document.getElementById('prd-drawer-list');
      if (updatedDrawerList) {
        updatedDrawerList.scrollTop = prevScrollTop;
      }

      // 高亮瞬移成功的目标卡片
      const movedCard = document.querySelector(`.prd-card-item:nth-child(${targetIdx + (isDrawerManageMode ? 2 : 1)})`);
      if (movedCard) {
        movedCard.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        movedCard.style.boxShadow = '0 0 0 2px #2563eb, 0 4px 14px rgba(37,99,235,0.25)';
        setTimeout(() => {
          if (movedCard) movedCard.style.boxShadow = '';
        }, 800);
      }

      showToast(`✅ 需求已调整至 #${targetIdx + 1}，后续序号已依次顺延！`, 'success');
    } else {
      savedPins = backup;
      reIndexPins(savedPins);
      renderRightDrawerList();
      renderMiniRailList();
      alert('❌ 排序保存失败：未检测到本地服务接口，无法写入本地磁盘 JS 文件！');
      showToast('❌ 排序保存失败', 'error');
    }
  };

  // 纯文本摘要提取算法（保障卡片高度 100% 绝对统一）
  function stripMarkdownSnippet(md) {
    if (!md || typeof md !== 'string') return '暂无详细业务描述';
    let text = md.replace(/```[\s\S]*?```/g, ' [图表/代码] ');
    text = text.replace(/\|[^\n]+\|/g, ' [表格] ');
    text = text.replace(/#{1,6}\s+/g, '');
    text = text.replace(/[-*]\s+/g, '');
    text = text.replace(/\d+\.\s+/g, '');
    text = text.replace(/[*_~`]/g, '');
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text.replace(/\s+/g, ' ').trim();
    return text || '暂无详细业务描述';
  }

  function renderRightDrawerList() {
    const container = document.getElementById('prd-drawer-list');
    if (!container) return;

    let filtered = savedPins.filter(p => {
      if (searchKeyword && !matchFuzzyTitle(p.title, searchKeyword)) return false;
      return true;
    });

    let headerBannerHtml = '';
    if (isDrawerManageMode) {
      headerBannerHtml = `
        <div style="background:#fff7ed; border:1px solid #fed7aa; color:#c2410c; padding:6px 12px; border-radius:6px; font-size:11px; display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-shrink:0;">
          <span style="font-weight:700;">${t('manageModeBanner')}</span>
          <button class="prd-btn-action" style="background:#ea580c; color:#fff; padding:2px 8px; font-size:11px; border:none;" onclick="window.toggleDrawerManageMode()">${t('doneManage')}</button>
        </div>
      `;
    }

    if (filtered.length === 0) {
      if (searchKeyword) {
        container.innerHTML = `
          ${headerBannerHtml}
          <div style="text-align:center; color:#94a3b8; padding:40px 10px;">
            <div style="font-size:28px; margin-bottom:6px;">🔍</div>
            <div style="font-size:13px; font-weight:600; color:#475569; margin-bottom:4px;">未搜索到匹配的需求标题</div>
            <div style="font-size:11px; color:#94a3b8; margin-bottom:12px;">关键词: "${escapeHtml(searchKeyword)}"</div>
            <button class="prd-btn-action" style="font-size:11px; padding:4px 12px;" onclick="window.clearPRDSearch()">清空搜索条件</button>
          </div>
        `;
      } else {
        container.innerHTML = `
          ${headerBannerHtml}
          <div style="text-align:center; color:#94a3b8; padding:40px 10px;">
            <div style="font-size:28px; margin-bottom:6px;">📌</div>
            <div style="font-size:12px;">当前版本 [${escapeHtml(currentVersion)}] 暂无需求点</div>
          </div>
        `;
      }
      return;
    }

    let html = headerBannerHtml;
    filtered.forEach((pin) => {
      html += `
        <div class="prd-card-item" draggable="${isDrawerManageMode ? 'true' : 'false'}" ondragstart="window.handleCardDragStart(event, ${pin.id})" ondragover="window.handleCardDragOver(event)" ondragleave="window.handleCardDragLeave(event)" ondrop="window.handleCardDrop(event, ${pin.id})" ondragend="window.handleCardDragEnd(event)" onclick="window.locateAndHighlight(${pin.id})">
          <div class="prd-card-header">
            <div class="prd-num-title">
              ${isDrawerManageMode ? '<span style="color:#94a3b8; font-size:14px; cursor:grab;" title="按住拖拽排序">⠿</span>' : ''}
              <span class="prd-pin-num-pill ${isDrawerManageMode ? 'clickable' : ''}" onclick="${isDrawerManageMode ? `event.stopPropagation(); window.promptChangePinOrder(${pin.id});` : ''}" title="${isDrawerManageMode ? `点击直接修改序号 (当前 #${pin.id})` : `#${pin.id}`}">${pin.id}</span>
              <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(pin.title || '（未命名）')}</span>
            </div>
            ${isDrawerManageMode ? `
              <div style="display:flex; align-items:center; gap:2px;">
                <button class="prd-btn-action" style="padding:1px 5px; font-size:10px; background:#eff6ff; color:#1d4ed8; border-radius:4px;" onclick="event.stopPropagation(); window.reorderPinToIndex(${pin.id}, 0)" title="${escapeHtml(t('moveToTopTip'))}">${t('moveToTopBtn')}</button>
                <button class="prd-btn-action" style="padding:1px 5px; font-size:10px; background:#f1f5f9; border-radius:4px;" onclick="event.stopPropagation(); window.promptChangePinOrder(${pin.id})" title="${escapeHtml(t('clickToReorderTip'))}">${t('moveToBtn')}</button>
                <button class="prd-btn-action" style="padding:1px 4px; font-size:10px;" onclick="event.stopPropagation(); window.movePinOrder(${pin.id}, -1)" title="${escapeHtml(t('moveUpTip'))}">▲</button>
                <button class="prd-btn-action" style="padding:1px 4px; font-size:10px;" onclick="event.stopPropagation(); window.movePinOrder(${pin.id}, 1)" title="${escapeHtml(t('moveDownTip'))}">▼</button>
              </div>
            ` : ''}
          </div>

          <div style="display:flex; gap:6px;">
            <span class="prd-tag prd-tag-type">${escapeHtml(pin.type || '业务规则')}</span>
          </div>

          <div class="prd-card-desc" title="${escapeHtml(stripMarkdownSnippet(pin.desc))}">
            ${escapeHtml(stripMarkdownSnippet(pin.desc))}
          </div>

          <div class="prd-card-footer">
            <span style="font-size:10px; color:#94a3b8;">${pin.selector ? t('boundComp') : t('unbound')}</span>
            <div style="display:flex; gap:6px;">
              <button class="prd-btn-action" onclick="event.stopPropagation(); window.locateAndHighlight(${pin.id});">${t('locateBtn')}</button>
              <button class="prd-btn-action" onclick="event.stopPropagation(); window.openEditorForPin(${pin.id});">${t('editBtn')}</button>
              ${isDrawerManageMode ? `
                <button class="prd-btn-action btn-danger" onclick="event.stopPropagation(); window.deletePinItem(${pin.id});" title="删除该需求">🗑️ 删除</button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  window.movePinOrder = async function(id, direction) {
    const idx = savedPins.findIndex(p => p.id === id);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= savedPins.length) return;
    await window.reorderPinToIndex(id, targetIdx);
  };

  window.deletePinItem = async function(id) {
    if (confirm('确认删除此项需求规约吗？')) {
      const backup = JSON.parse(JSON.stringify(savedPins));
      savedPins = savedPins.filter(p => p.id !== id);
      reIndexPins(savedPins);
      const isSaved = await persistData();
      if (isSaved) {
        renderPinMarkers();
        renderRightDrawerList();
        showToast('✅ 需求点已删除并同步至本地文件！', 'info');
      } else {
        savedPins = backup;
        reIndexPins(savedPins);
        renderPinMarkers();
        renderRightDrawerList();
        alert('❌ 删除失败：未检测到本地服务接口，无法写入本地磁盘 JS 文件！');
        showToast('❌ 删除失败', 'error');
      }
    }
  };

  // 14. 拾取元素逻辑
  function bindPickListeners() {
    document.addEventListener('mouseover', handlePickOver, true);
    document.addEventListener('mouseout', handlePickOut, true);
    document.addEventListener('click', handlePickClick, true);
  }

  function unbindPickListeners() {
    document.removeEventListener('mouseover', handlePickOver, true);
    document.removeEventListener('mouseout', handlePickOut, true);
    document.removeEventListener('click', handlePickClick, true);
    if (highlightedElement) {
      highlightedElement.classList.remove('prd-pick-hover-outline');
      highlightedElement = null;
    }
    document.body.style.cursor = 'default';
  }

  function handlePickOver(e) {
    if (e.target.closest('.prd-right-drawer, .prd-inspect-bubble, .prd-editor-modal, .prd-doc-overlay, .prd-editor-mini-dock, .prd-drawer-edge-tab')) return;
    if (highlightedElement) highlightedElement.classList.remove('prd-pick-hover-outline');
    highlightedElement = e.target;
    highlightedElement.classList.add('prd-pick-hover-outline');
  }

  function handlePickOut(e) {
    if (highlightedElement === e.target) {
      highlightedElement.classList.remove('prd-pick-hover-outline');
      highlightedElement = null;
    }
  }

  function handlePickClick(e) {
    if (e.target.closest('.prd-right-drawer, .prd-inspect-bubble, .prd-editor-modal, .prd-doc-overlay, .prd-editor-mini-dock, .prd-drawer-edge-tab')) return;
    e.preventDefault();
    e.stopPropagation();

    const selector = getElementSelector(e.target);
    unbindPickListeners();

    if (rePickModeActive && activeDraft) {
      rePickModeActive = false;
      activeDraft.selector = selector;
      const oldDock = document.getElementById('prd-editor-mini-dock');
      if (oldDock) oldDock.remove();
      renderEditorModal(activeDraft);
      showToast('组件重新绑定成功！', 'success');
    } else {
      window.openEditorForPin(null);
      if (activeDraft) {
        activeDraft.selector = selector;
        renderEditorModal(activeDraft);
      }
    }
  }

  // 15. 模式与抽屉切换
  window.togglePRDDrawer = function() {
    const drawer = document.getElementById('prd-drawer');
    const isOpen = drawer && drawer.classList.contains('open');
    if (isOpen) {
      window.setPRDMode('hide');
    } else {
      window.setPRDMode('show');
    }
  };

  window.setPRDMode = async function(mode) {
    if (mode === 'edit' || mode === 'pick') {
      const isApiOk = await checkBackendApiAvailable();
      if (!isApiOk) {
        window.showNoBackendAlertModal('add');
        return;
      }
    }
    currentMode = mode;
    const drawer = document.getElementById('prd-right-drawer') || document.getElementById('prd-drawer');
    const edgeTab = document.getElementById('prd-drawer-edge-tab');

    if (mode === 'pick' || mode === 'edit') {
      document.body.style.cursor = 'crosshair';
      bindPickListeners();
      // 打标时自动收起右侧抽屉，完全暴露底层页面组件
      if (drawer) {
        drawer.classList.remove('open', 'semi-open');
      }
      if (edgeTab) {
        edgeTab.style.display = 'flex';
        edgeTab.innerHTML = `<span class="prd-edge-text" style="color:#ef4444; font-weight:700;">📍 点击页面组件打标 (ESC退出)</span>`;
      }
      renderPinMarkers();
      showToast('📍 点击页面任意组件即可完成打标并呼出规约编辑窗', 'info');
    } else if (mode === 'show') {
      unbindPickListeners();
      if (drawer) {
        drawer.classList.remove('semi-open');
        drawer.classList.add('open');
      }
      if (edgeTab) edgeTab.style.display = 'none';
      renderPinMarkers();
      renderRightDrawerList();
    } else if (mode === 'semi') {
      unbindPickListeners();
      if (drawer) {
        drawer.classList.remove('open');
        drawer.classList.add('semi-open');
      }
      if (edgeTab) edgeTab.style.display = 'none';
      renderPinMarkers();
      renderMiniRailList();
    } else if (mode === 'hide') {
      unbindPickListeners();
      if (drawer) drawer.classList.remove('open', 'semi-open');
      if (edgeTab) {
        edgeTab.style.display = 'flex';
        edgeTab.innerHTML = `<span class="prd-edge-text">${t('edgeText')} (<span id="prd-edge-count">${savedPins.length}</span>)</span>`;
      }
      renderPinMarkers();
    }
  };

  window.toggleDrawerSemiMode = function() {
    const drawer = document.getElementById('prd-right-drawer') || document.getElementById('prd-drawer');
    if (!drawer) return;
    if (drawer.classList.contains('semi-open')) {
      window.setPRDMode('show');
    } else {
      window.setPRDMode('semi');
    }
  };

  function renderMiniRailList() {
    const miniRailContainer = document.getElementById('prd-mini-rail-pins');
    if (!miniRailContainer) return;

    let html = '';
    savedPins.forEach((pin) => {
      html += `
        <button class="prd-mini-badge-btn" data-title="#${pin.id} ${escapeHtml(pin.title)}" onclick="window.locateAndHighlight(${pin.id})">
          ${pin.id}
        </button>
      `;
    });
    miniRailContainer.innerHTML = html;
  }


  // 16. 当前页面 PRD 可视化 Markdown 文档大屏与新标签页独立打开
  let activeDocModal = null;

  window.openPRDInNewTab = function() {
    const newWin = window.open('', '_blank');
    if (!newWin) {
      alert('无法打开新窗口，请允许浏览器弹出窗口权限！');
      return;
    }

    const docTitle = `${getCurrentPageTitle()} ${t('docHeroTitleSuffix')} - ${currentVersion}`;
    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(docTitle)}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    :root {
      --prd-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      --prd-primary: #2563eb;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: var(--prd-font);
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
    }
    .prd-page-header {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 100;
    }
    .prd-header-title {
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .prd-header-actions {
      display: flex;
      gap: 10px;
    }
    .prd-btn {
      background: rgba(255,255,255,0.15);
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.2);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .prd-btn:hover {
      background: var(--prd-primary);
      border-color: var(--prd-primary);
    }
    .prd-layout {
      max-width: 1380px;
      margin: 0 auto;
      display: flex;
      gap: 28px;
      padding: 28px 20px;
    }
    .prd-toc {
      width: 280px;
      position: sticky;
      top: 76px;
      max-height: calc(100vh - 100px);
      overflow-y: auto;
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      padding: 16px 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      flex-shrink: 0;
    }
    .prd-toc-title {
      font-size: 12px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      padding: 4px 8px 8px;
      margin-bottom: 6px;
      border-bottom: 1px dashed #e2e8f0;
    }
    .prd-toc-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 6px;
      color: #475569;
      text-decoration: none;
      font-size: 13px;
      transition: all 0.15s;
    }
    .prd-toc-link:hover {
      background: #eff6ff;
      color: var(--prd-primary);
    }
    .prd-toc-badge {
      background: #ef4444;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .prd-main-doc {
      flex: 1;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      padding: 40px 48px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.04);
      overflow: hidden;
    }
    .prd-doc-hero {
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 20px;
      margin-bottom: 32px;
    }
    .prd-doc-hero h1 {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 10px 0;
    }
    .prd-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 13px;
      color: #64748b;
    }
    .prd-meta code {
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    .prd-article {
      margin-top: 36px;
      padding-top: 28px;
      border-top: 1px solid #f1f5f9;
      scroll-margin-top: 90px;
    }
    .prd-article:first-of-type {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
    }
    .prd-heading {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 14px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .prd-article-badge {
      background: #ef4444;
      color: #ffffff;
      font-size: 12px;
      font-weight: 800;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .prd-type-pill {
      font-size: 11px;
      font-weight: 600;
      background: #f1f5f9;
      color: #64748b;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .prd-selector-tag {
      font-size: 11px;
      background: #eff6ff;
      color: #1d4ed8;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: monospace;
      margin-left: auto;
    }
    .prd-content {
      font-size: 14px;
      line-height: 1.7;
      color: #334155;
    }
    .prd-content h3 { font-size: 15px; margin: 16px 0 8px; color: #0f172a; }
    .prd-content h4 { font-size: 14px; margin: 12px 0 6px; color: #1e293b; }
    .prd-content p { margin: 8px 0; }
    .prd-content ul, .prd-content ol { padding-left: 20px; margin: 8px 0; }
    .prd-content li { margin-bottom: 4px; }
    .prd-content code { background: #f1f5f9; color: #ef4444; padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 13px; }
    .prd-content pre { background: #0f172a; color: #f8fafc; padding: 14px 18px; border-radius: 8px; overflow-x: auto; margin: 12px 0; font-size: 13px; }
    .prd-content pre code { background: transparent; color: inherit; padding: 0; }
    .prd-table-responsive { width: 100%; overflow-x: auto; margin: 14px 0; border: 1px solid #e2e8f0; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 0; text-align: left; }
    th { background: #f8fafc; color: #0f172a; font-weight: 700; padding: 10px 14px; border-bottom: 2px solid #e2e8f0; border-right: 1px solid #f1f5f9; }
    td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #f8fafc; color: #334155; }
    tr:hover td { background: #f8fafc; }
    .prd-mermaid-block { margin: 16px 0; padding: 18px 14px 28px 14px; background: #ffffff !important; border: 1px solid #e2e8f0; border-radius: 10px; overflow-x: auto; text-align: center; }
    .prd-mermaid-block svg { background: #ffffff !important; }
    @media print {
      .prd-page-header, .prd-toc, .prd-btn { display: none !important; }
      .prd-layout { max-width: 100%; margin: 0; padding: 0; }
      .prd-main-doc { border: none; box-shadow: none; padding: 0; }
      .prd-article { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header class="prd-page-header">
    <div class="prd-header-title">
      <span>📑</span>
      <span>${escapeHtml(docTitle)}</span>
    </div>
    <div class="prd-header-actions">
      <button class="prd-btn" onclick="window.print()">${t('printBtn')}</button>
      <button class="prd-btn" onclick="window.close()">✕ 关闭网页</button>
    </div>
  </header>

  <div class="prd-layout">
    <aside class="prd-toc">
      <div class="prd-toc-title">${t('tocTitle')} (TOC)</div>
      ${savedPins.map(pin => `
        <a class="prd-toc-link" href="#sec-pin-${pin.id}" title="${escapeHtml(pin.title || '')}">
          <span class="prd-toc-badge">${pin.id}</span>
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(pin.title || '未命名')}</span>
        </a>
      `).join('')}
    </aside>

    <main class="prd-main-doc">
      <div class="prd-doc-hero">
        <h1>${escapeHtml(docTitle)}</h1>
        <div class="prd-meta">
          <span>📄 ${t('docMetaPage')}: <code>${pageKey}</code></span>
          <span>·</span>
          <span>🏷️ ${t('docMetaVersion')}: <strong>${escapeHtml(currentVersion)}</strong></span>
          <span>·</span>
          <span>📌 ${t('docMetaCount')}: 共 <strong>${savedPins.length}</strong> 项</span>
          <span>·</span>
          <span>⏱️ 生成时间: ${new Date().toLocaleString()}</span>
        </div>
      </div>

      <div class="prd-doc-articles">
        ${savedPins.map(pin => `
          <article class="prd-article" id="sec-pin-${pin.id}">
            <div class="prd-heading">
              <span class="prd-article-badge">${pin.id}</span>
              <span>${escapeHtml(pin.title || '（未命名需求）')}</span>
              <span class="prd-type-pill">${escapeHtml(pin.type || '业务规则')}</span>
              ${pin.selector ? `<span class="prd-selector-tag"><code>${escapeHtml(pin.selector)}</code></span>` : ''}
            </div>
            <div class="prd-content">
              ${parseMarkdown(pin.desc) || '<p style="color:#94a3b8; font-style:italic;">暂无详细描述</p>'}
            </div>
          </article>
        `).join('')}
      </div>
    </main>
  </div>

  <script>
    if (window.mermaid) {
      window.mermaid.initialize({ startOnLoad: false, theme: 'neutral', themeVariables: { background: '#ffffff', mainBkg: '#ffffff', clusterBkg: '#ffffff' }, securityLevel: 'loose', flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' } });
      document.querySelectorAll('.mermaid').forEach(async (node, idx) => {
        const code = node.textContent.trim();
        if (!code) return;
        try {
          const { svg } = await window.mermaid.render('mermaid-svg-' + idx, code);
          node.innerHTML = svg;
        } catch (e) {
          console.warn(e);
        }
      });
    }
  </script>
</body>
</html>
    `;

    newWin.document.open();
    newWin.document.write(htmlContent);
    newWin.document.close();
  };

  window.openCurrentPagePRDDoc = function() {
    if (activeDocModal) activeDocModal.remove();

    const overlay = document.createElement('div');
    overlay.className = 'prd-doc-overlay';
    overlay.id = 'prd-doc-modal-overlay';

    overlay.innerHTML = `
      <div class="prd-doc-container" onclick="event.stopPropagation()">
        <div class="prd-doc-header">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:17px; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:8px;">
              <span>📑 ${getCurrentPageTitle()}</span>
              <span style="font-size:13px; color:#64748b; font-weight:normal;">产品需求规格说明书 (PRD)</span>
            </span>
            <span class="prd-tag prd-tag-version" style="font-size:11px; padding:2px 8px;">${escapeHtml(currentVersion)}</span>
            <span style="font-size:12px; background:#e0f2fe; color:#0284c7; padding:2px 10px; border-radius:12px; font-weight:700;">
              共 ${savedPins.length} 项规格
            </span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="prd-btn-action" style="background:#2563eb; color:#fff; padding:6px 12px; border-radius:6px; font-weight:600;" onclick="window.openPRDInNewTab()" title="在新浏览器独立标签页中打开大屏文档">${t('openNewTabBtn')}</button>
            <button class="prd-btn-action" style="background:#10b981; color:#fff; padding:6px 12px; border-radius:6px; font-weight:600;" onclick="window.exportPRDMarkdown()">${t('exportMdBtn')}</button>
            <button class="prd-btn-action" style="background:#3b82f6; color:#fff; padding:6px 12px; border-radius:6px; font-weight:600;" onclick="window.exportPRDJS()">${t('exportJsBtn')}</button>
            <button class="prd-btn-action" style="background:#8b5cf6; color:#fff; padding:6px 12px; border-radius:6px; font-weight:600;" onclick="window.triggerImportJS()">${t('importVersionBtn')}</button>
            <input type="file" id="prd-file-import-input" accept=".js,.json,.txt" style="display:none;" onchange="window.handleImportJS(this)">
            <button class="prd-btn-action" style="font-size:22px; padding:4px 8px;" onclick="window.closeCurrentPagePRDDoc()">&times;</button>
          </div>
        </div>

        <div class="prd-doc-content-layout">
          <div class="prd-doc-toc">
            <div class="prd-toc-title">
              <span>${t('tocTitle')}</span>
              <span style="font-size:10px;">TOC</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:2px;">
              ${savedPins.map(pin => `
                <div class="prd-toc-item" onclick="window.docScrollToSection('sec-pin-${pin.id}', this)" title="${escapeHtml(pin.title || '')}">
                  <span class="prd-toc-num">${pin.id}.</span>
                  <span class="prd-toc-text">${escapeHtml(pin.title || '（未命名）')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="prd-doc-main-scroll" id="prd-doc-scroll-area">
            <div class="prd-doc-paper">
              <div class="prd-doc-hero">
                <h1 class="prd-doc-hero-title">
                  <span>${getCurrentPageTitle()} ${t('docHeroTitleSuffix')}</span>
                </h1>
                <div class="prd-doc-hero-meta">
                  <span>📄 ${t('docMetaPage')}: <code>${pageKey}</code></span>
                  <span>·</span>
                  <span>🏷️ 版本: <strong>${escapeHtml(currentVersion)}</strong></span>
                  <span>·</span>
                  <span>📌 ${t('docMetaCount')}: 共 <strong>${savedPins.length}</strong> 项</span>
                </div>
              </div>

              <div class="prd-md-doc">
                ${savedPins.length === 0 ? `
                  <div style="text-align:center; padding:80px 20px; color:#94a3b8;">
                    <div style="font-size:42px; margin-bottom:12px;">📄</div>
                    <div style="font-size:16px; font-weight:600;">当前版本尚未录入任何 PRD 规格</div>
                  </div>
                ` : savedPins.map(pin => `
                  <article class="prd-doc-article-section" id="sec-pin-${pin.id}">
                    <h2 class="prd-doc-sec-heading">
                      <span class="prd-doc-heading-title">${pin.id}. ${escapeHtml(pin.title || '（未命名需求）')}</span>
                      <span class="prd-doc-heading-type">（${escapeHtml(pin.type || '业务规则')}）</span>
                      ${pin.selector ? `
                        <span class="prd-doc-anchor-link" onclick="window.docJumpToElement(${pin.id})" title="在原型界面定位并高亮此元素">
                          <code>${escapeHtml(pin.selector)}</code>
                          <span class="prd-doc-anchor-icon" style="color:var(--prd-primary); cursor:pointer; margin-left:6px; font-size:11px;">🎯 定位</span>
                        </span>
                      ` : ''}
                    </h2>

                    <div class="prd-doc-sec-content">
                      ${parseMarkdown(pin.desc) || '<p style="color:#94a3b8; font-style:italic;">暂无详细描述</p>'}
                    </div>
                  </article>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeDocModal = overlay;
    window.renderMermaidInDom(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) window.closeCurrentPagePRDDoc();
    });
  };

  window.closeCurrentPagePRDDoc = function() {
    if (activeDocModal) {
      activeDocModal.remove();
      activeDocModal = null;
    }
  };

  window.docScrollToSection = function(sectionId, elem) {
    const target = document.getElementById(sectionId);
    const scrollArea = document.getElementById('prd-doc-scroll-area');
    if (target && scrollArea) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('.prd-toc-item').forEach(el => el.classList.remove('active'));
      if (elem) elem.classList.add('active');
    }
  };

  window.docJumpToElement = function(id) {
    window.closeCurrentPagePRDDoc();
    setPRDMode('show');
    window.locateAndHighlight(id);
  };

  // 17. 导出与导入 (JS / Markdown & 多版本冲突模态处理)
  window.exportPRDJS = function() {
    const dataFileName = `prd-data-${pageKey.replace('.html', '')}.js`;
    const jsContent = `/**\n * PRD 需求数据 - ${getCurrentPageTitle()} (${currentVersion})\n * 导出时间: ${new Date().toLocaleString()}\n */\nwindow.INITIAL_PRD_DATA = ${JSON.stringify(savedPins, null, 2)};\nwindow.PRD_VERSION_REGISTRY = ${JSON.stringify(versionRegistry, null, 2)};\n`;
    const blob = new Blob([jsContent], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dataFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`已成功导出 ${dataFileName}！`, 'success');
  };

  window.exportPRDMarkdown = function() {
    let md = `# ${getCurrentPageTitle()} - 产品需求规格说明书 (PRD) [${currentVersion}]\n\n`;
    md += `> **生成时间**：${new Date().toLocaleString()}  \n`;
    md += `> **关联页面**：\`${pageKey}\`  \n`;
    md += `> **规格版本**：\`${currentVersion}\`  \n\n---\n\n`;

    savedPins.forEach((pin, index) => {
      md += `## ${index + 1}. ${pin.title || '未命名需求'}\n`;
      md += `- **需求类型**：${pin.type || '业务规则'}\n`;
      md += `- **关联元素选择器**：\`${pin.selector || '--'}\`\n\n`;
      md += `### 功能逻辑与业务规约\n${pin.desc || '暂无描述'}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pageKey.replace('.html', '')}_PRD_${currentVersion}_${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Markdown PRD 文档导出成功！', 'success');
  };

  window.triggerImportJS = function() {
    let input = document.getElementById('prd-file-import-input');
    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.id = 'prd-file-import-input';
      input.accept = '.js,.json,.txt';
      input.style.display = 'none';
      input.onchange = function() { window.handleImportJS(this); };
      document.body.appendChild(input);
    }
    input.click();
  };

  window.handleImportJS = function(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        let text = e.target.result.trim();
        let parsedData = null;
        let parsedRegistry = null;

        if (text.includes('PRD_VERSION_REGISTRY')) {
          const regMatch = text.match(/PRD_VERSION_REGISTRY\s*=\s*(\{[\s\S]*?\});/);
          if (regMatch) {
            try { parsedRegistry = JSON.parse(regMatch[1]); } catch (err) {}
          }
        }

        const match = text.match(/\[[\s\S]*\]/);
        if (match) {
          try { parsedData = JSON.parse(match[0]); } catch (err) {}
        }

        if (!parsedData && parsedRegistry && parsedRegistry.versions) {
          const activeVer = parsedRegistry.activeVersion || Object.keys(parsedRegistry.versions)[0];
          parsedData = parsedRegistry.versions[activeVer];
        }

        if (Array.isArray(parsedData)) {
          let defaultVerName = currentVersion;
          const fileNameMatch = file.name.match(/(v\d+\.\d+(\.\d+)?)/i);
          if (fileNameMatch) defaultVerName = fileNameMatch[1];

          window.showImportVersionModal(parsedData, defaultVerName, file.name);
        } else {
          showToast('导入失败：文件中未检测到有效的 PRD 规格数组', 'error');
        }
      } catch (err) {
        showToast('导入解析失败，请确保是有效的 JS/JSON 数据文件', 'error');
      }
      input.value = '';
    };
    reader.readAsText(file);
  };

  // 上传版本冲突处理交互模态框
  window.showImportVersionModal = function(importedPins, defaultVer, fileName) {
    const oldModal = document.getElementById('prd-version-import-modal');
    if (oldModal) oldModal.remove();

    const overlay = document.createElement('div');
    overlay.className = 'prd-version-modal-overlay';
    overlay.id = 'prd-version-import-modal';

    const isExisting = !!versionRegistry.versions[defaultVer];

    overlay.innerHTML = `
      <div class="prd-version-modal-card" onclick="event.stopPropagation()">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:8px;">
          <strong style="font-size:15px; color:#0f172a;">📂 导入 PRD 规格版本数据</strong>
          <button style="background:none; border:none; font-size:18px; color:#94a3b8; cursor:pointer;" onclick="document.getElementById('prd-version-import-modal').remove()">&times;</button>
        </div>

        <div style="font-size:12.5px; color:#475569; display:flex; flex-direction:column; gap:8px;">
          <div>📄 导入文件: <strong style="color:#0f172a;">${escapeHtml(fileName)}</strong>（包含 <strong>${importedPins.length}</strong> 条规格）</div>
          
          <div style="display:flex; flex-direction:column; gap:4px; margin-top:4px;">
            <label style="font-weight:700; color:#334155;">指定导入版本号：</label>
            <input type="text" id="prd-import-ver-name" value="${escapeHtml(defaultVer)}" style="padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; outline:none;" oninput="window.checkImportVerConflict(this.value)">
          </div>

          <div id="prd-import-conflict-section" style="margin-top:6px; display:flex; flex-direction:column; gap:8px; background:#f8fafc; padding:10px 12px; border-radius:8px; border:1px solid #e2e8f0;">
            <div style="font-weight:700; color:#0f172a;" id="prd-import-conflict-tip">
              ${isExisting ? `⚠️ 版本 [${escapeHtml(defaultVer)}] 已存在，请选择冲突处理方式：` : '✨ 新版本，确认后将自动创建并切换。'}
            </div>
            
            <div id="prd-import-strategies" style="display:${isExisting ? 'flex' : 'none'}; flex-direction:column; gap:6px;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:12px;">
                <input type="radio" name="prd-import-strategy" value="overwrite" checked>
                <span>🔴 <b>覆盖现有版本</b>（清空旧打点，完全替换为上传文件内容）</span>
              </label>
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:12px;">
                <input type="radio" name="prd-import-strategy" value="append">
                <span>🟢 <b>追加合并</b>（保留旧打点，将上传打点追加至末尾）</span>
              </label>
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:12px;">
                <input type="radio" name="prd-import-strategy" value="new_version">
                <span>🔵 <b>另存为新版本</b>（输入新版本名称，不影响当前版本）</span>
              </label>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid #f1f5f9; padding-top:10px;">
          <button class="prd-btn-action" onclick="document.getElementById('prd-version-import-modal').remove()">${t('cancelBtn')}</button>
          <button class="prd-btn-primary" onclick="window.confirmImportVersionData()">确认导入并应用</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    window.confirmImportVersionData = async function() {
      const verInput = document.getElementById('prd-import-ver-name');
      const targetVer = verInput ? verInput.value.trim() : defaultVer;
      if (!targetVer) {
        alert('请输入版本号！');
        return;
      }

      const strategyEl = document.querySelector('input[name="prd-import-strategy"]:checked');
      const strategy = strategyEl ? strategyEl.value : 'overwrite';

      const backupRegistry = JSON.parse(JSON.stringify(versionRegistry));

      if (versionRegistry.versions[targetVer]) {
        if (strategy === 'overwrite') {
          versionRegistry.versions[targetVer] = importedPins;
        } else if (strategy === 'append') {
          versionRegistry.versions[targetVer] = versionRegistry.versions[targetVer].concat(importedPins);
        } else if (strategy === 'new_version') {
          const newName = `${targetVer}_imported`;
          versionRegistry.versions[newName] = importedPins;
          await window.switchPRDVersion(newName);
          overlay.remove();
          return;
        }
      } else {
        versionRegistry.versions[targetVer] = importedPins;
      }

      await window.switchPRDVersion(targetVer);
      overlay.remove();
      showToast(`✅ 版本 [${targetVer}] 导入并更新成功！`, 'success');
    };

    window.checkImportVerConflict = function(val) {
      const trimmed = val.trim();
      const exists = !!versionRegistry.versions[trimmed];
      const tip = document.getElementById('prd-import-conflict-tip');
      const strat = document.getElementById('prd-import-strategies');
      if (tip && strat) {
        if (exists) {
          tip.innerHTML = `⚠️ 版本 [${escapeHtml(trimmed)}] 已存在，请选择冲突处理方式：`;
          strat.style.display = 'flex';
        } else {
          tip.innerHTML = `✨ 目标版本 [${escapeHtml(trimmed)}] 为全新版本，确认后将自动创建并切换。`;
          strat.style.display = 'none';
        }
      }
    };
  };

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // 18. DOM 初始化与事件绑定 (彻底移除右上角多余胶囊，保留抽屉左边缘箭头与底部查看完整PRD)
  let isInitialized = false;
  function initDOM() {
    if (isInitialized) return;
    isInitialized = true;

    // 18.1 屏幕右边缘快捷展开/收起箭头 Tab
    const edgeTab = document.createElement('div');
    edgeTab.className = 'prd-drawer-edge-tab';
    edgeTab.id = 'prd-drawer-edge-tab';
    edgeTab.title = '点击展开/收起需求打点面板';
    edgeTab.onclick = window.togglePRDDrawer;
    edgeTab.innerHTML = `
      <span class="prd-edge-arrow" id="prd-edge-arrow">‹</span>
      <span class="prd-edge-text">${t('edgeText')} (<span id="prd-edge-count">${savedPins.length}</span>)</span>
    `;
    document.body.appendChild(edgeTab);

    // 18.2 右侧抽屉面板 (集成多版本选择器、安全管理锁模式、搜索、打点列表与完整PRD入口)
    const drawer = document.createElement('div');
    drawer.className = 'prd-right-drawer';
    drawer.id = 'prd-drawer';
    drawer.innerHTML = `
      <!-- 左边缘快捷控制把手组 (上方全收起 + 下方半收起，按钮朝内指向右侧) -->
      <div class="prd-drawer-left-handles" id="prd-drawer-left-handles">
        <div class="prd-drawer-handle-btn prd-handle-full-collapse" onclick="window.setPRDMode('hide')" title="完全收起抽屉 (Full Close)">
          <span>›</span>
        </div>
        <div class="prd-drawer-handle-btn prd-handle-semi-collapse" onclick="window.setPRDMode('semi')" title="半收起为标号竖条 (Semi Rail)">
          <span>⇥</span>
        </div>
      </div>

      <!-- 1. 全展开完整面板 (400px) -->
      <div class="prd-drawer-full-content" style="display:flex; flex-direction:column; height:100%; width:100%; overflow:hidden;">
        <!-- 抽屉头部 -->
        <div class="prd-drawer-header">
          <div style="font-size:14px; font-weight:700; color:#0f172a; display:flex; align-items:center; gap:6px;">
            <span>📋 ${getCurrentPageTitle()}</span>
            <span style="background:#e0f2fe; color:#0284c7; font-size:11px; padding:2px 8px; border-radius:10px; font-weight:700;" id="prd-drawer-count">${savedPins.length}</span>
          </div>
          <div style="display:flex; align-items:center; gap:4px;">
            <select id="prd-lang-select" onchange="window.setPRDLanguage(this.value)" style="padding:2px 4px; border:1px solid #cbd5e1; border-radius:4px; font-size:11px; outline:none; background:#fff; cursor:pointer; color:#334155; font-weight:600;" title="切换语言 (Language)">
              <option value="zh-CN" ${currentLang==='zh-CN'?'selected':''}>🇨🇳 中文</option>
              <option value="en" ${currentLang==='en'?'selected':''}>🇺🇸 EN</option>
              <option value="ja" ${currentLang==='ja'?'selected':''}>🇯🇵 日本語</option>
              <option value="ko" ${currentLang==='ko'?'selected':''}>🇰🇷 한국어</option>
            </select>
            
            <button id="prd-manage-order-btn" class="prd-btn-action" style="font-size:11px; background:#eff6ff; color:#1d4ed8; padding:3px 6px;" onclick="window.toggleDrawerManageMode()" title="${escapeHtml(t('manageOrder'))}">${isDrawerManageMode ? t('doneManage') : t('manageOrder')}</button>
            <button class="prd-btn-action" style="font-size:16px; padding:0 6px;" onclick="window.setPRDMode('hide')" title="完全收起抽屉">&times;</button>
          </div>
        </div>

        <!-- 多版本切换工具栏 -->
        <div class="prd-version-bar">
          <select class="prd-version-select" id="prd-version-select" onchange="window.handleVersionSelectChange(this.value)">
            <!-- 动态版本列表 -->
          </select>
          <button class="prd-btn-action" style="padding:3px 6px; font-size:11px;" onclick="window.promptCreateVersion()" title="新建版本">➕</button>
          <button class="prd-btn-action" style="padding:3px 6px; font-size:11px;" onclick="window.triggerImportJS()" title="上传版本数据">📂</button>
        </div>

        <!-- 搜索过滤栏 (纯标题完全模糊检索 + 快速清空) -->
        <div class="prd-drawer-filter-bar" style="padding:8px 12px; background:#fff; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; gap:6px;">
          <div style="position:relative; flex:1; display:flex; align-items:center;">
            <input type="text" id="prd-drawer-search-input" placeholder="🔍 模糊搜索需求标题 (如: 订单 / 弹窗 / 竞价)..." style="width:100%; padding:6px 28px 6px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; outline:none; background:#fff; box-sizing:border-box;" oninput="window.handlePRDSearchInput(this.value)">
            <button id="prd-search-clear-btn" style="position:absolute; right:6px; background:none; border:none; color:#94a3b8; font-size:14px; cursor:pointer; display:none; align-items:center; justify-content:center; padding:2px;" onclick="window.clearPRDSearch()" title="清空搜索">&times;</button>
          </div>
        </div>

        <!-- 需求列表主体 -->
        <div class="prd-drawer-body" id="prd-drawer-list" style="flex:1; overflow-y:auto;">
          <!-- 动态渲染卡片 -->
        </div>

        <!-- 抽屉底部操作栏 (常驻查看完整PRD与新增打点) -->
        <div class="prd-drawer-footer" style="padding:10px 14px; background:#ffffff; border-top:1px solid #e2e8f0; display:flex; gap:8px;">
          <button class="prd-btn-primary" style="flex:1;" onclick="window.setPRDMode('edit')">${t('addPinBtn')}</button>
          <button class="prd-btn-action" style="background:#f1f5f9; padding:8px 14px;" onclick="window.openCurrentPagePRDDoc()">${t('viewFullPrdBtn')}</button>
        </div>
      </div>

      <!-- 2. 半收起紧凑标号竖条 (56px Mini Rail) -->
      <div class="prd-drawer-mini-rail" style="display:none; flex-direction:column; height:100%; width:100%; background:#f8fafc; align-items:center; padding:10px 0; box-sizing:border-box; user-select:none;">
        <button class="prd-btn-action" style="width:36px; height:30px; padding:0; display:flex; align-items:center; justify-content:center; margin-bottom:8px; font-size:12px;" onclick="window.setPRDMode('show')" title="展开完整抽屉">
          ▶
        </button>
        <div style="font-size:10px; font-weight:800; color:#64748b; margin-bottom:10px; text-align:center;">
          ${escapeHtml(currentVersion)}
        </div>
        <div id="prd-mini-rail-pins" style="display:flex; flex-direction:column; align-items:center; flex:1; overflow-y:auto; overflow-x:visible; width:100%;">
          <!-- 由 renderMiniRailList 动态填充 -->
        </div>
        <button class="prd-btn-primary" style="width:36px; height:36px; padding:0; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; margin-top:8px; box-shadow:0 2px 8px rgba(37,99,235,0.4);" onclick="window.setPRDMode('edit')" title="新增打点">
          📍
        </button>
      </div>
    `;
    document.body.appendChild(drawer);

    updateVersionBarUI();
  }

  // 19. 全局 SPA 页面切换/Tab 路由点击监听与标记自适应重绘
  function triggerDelayedMarkersUpdate() {
    if (currentMode === 'hide') return;
    requestAnimationFrame(() => renderPinMarkers());
    setTimeout(renderPinMarkers, 50);
    setTimeout(renderPinMarkers, 150);
    setTimeout(renderPinMarkers, 300);
    setTimeout(renderPinMarkers, 500);
    setTimeout(renderPinMarkers, 800);
  }

  document.addEventListener('click', (e) => {
    const isNav = e.target.closest('.menu-item, .sub-menu-item, .mall-nav-item, .nav-item, [data-page], [data-target], .uc-menu-item, .tab-btn, button, a, [onclick]');
    if (isNav) {
      triggerDelayedMarkersUpdate();
    }
  }, true);

  const observer = new MutationObserver(() => {
    if (currentMode !== 'hide') {
      triggerDelayedMarkersUpdate();
    }
  });
  observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class', 'style', 'hidden'] });

  window.addEventListener('resize', () => {
    if (currentMode !== 'hide') renderPinMarkers();
  });
  window.addEventListener('scroll', () => {
    if (currentMode !== 'hide') renderPinMarkers();
  }, true);

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initDOM();
  } else {
    document.addEventListener('DOMContentLoaded', initDOM);
  }
})();
