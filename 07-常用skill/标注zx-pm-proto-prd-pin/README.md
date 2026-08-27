# 📌 PM Prototype PRD Pinning & Multi-Version Specification Engine

<div align="center">

**The Ultimate Interactive PRD Pinning, Vditor IR Markdown Editor & Multi-Version Specification Engine for HTML Prototypes.**

[![Version](https://img.shields.io/badge/version-1.0.3-blue.svg)](https://github.com/barry0-0/pm-proto-prd-pin/releases/tag/1.0.3)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![i18n](https://img.shields.io/badge/i18n-en%20%7C%20zh--CN%20%7C%20ja%20%7C%20ko-brightgreen.svg)](#-internationalization-i18n)
[![Zero-Dependency](https://img.shields.io/badge/dependencies-zero--native-orange.svg)](#-quick-start)

[English](#-english-documentation) • [简体中文](#-简体中文文档) • [日本語](#-日本語ドキュメント) • [한국어](#-한국어-문서)

</div>

---

## 📸 Interface Screenshots

| ✍️ Vditor IR Live Editor & Visual Tables | 🗂️ 3-State Drawer (Full / Semi Rail / Hidden) |
| :---: | :---: |
| ![Visual Table Editor](assets/images/screenshot_visual_table_editor.png) | ![Drawer Overview](assets/images/screenshot_drawer_overview.png) |
| **🔄 Pure-White Mermaid Statecharts** | **📑 Full Page Deliverable PRD Screen** |
| ![Mermaid Render](assets/images/screenshot_mermaid_render.png) | ![Full PRD Document](assets/images/screenshot_full_prd_document.png) |

---

# 🌐 English Documentation

## 🌟 Key Capabilities & Features

| Capability | Technical Implementation | PM & Engineering Benefit |
| :--- | :--- | :--- |
| **✍️ Vditor IR Markdown Workbench** | Integrated Vditor (Instant Rendering mode) with relative vendor loading + CDN auto-fallback | Typora-grade live authoring experience; instantaneous rendering for all components |
| **⌨️ Multi-Level Tab Indentation** | Native `Tab` and `Shift+Tab` event handlers for unordered/ordered/task lists | Effortlessly organize nested specifications (`1 -> 1.1 -> 1.1.1`) |
| **📊 Interactive Visual Table Editor** | 2D HTML cell matrix, direct cell typing, `Enter/Tab` navigation, 1-click row/col ops | Completely eliminates markdown pipe `\| col \|` syntax friction; feels like Excel/Word |
| **🔄 Pure-White Mermaid Vector Engine** | Dedicated white container with dynamic bottom viewBox compensation (+28px) | Zero clipped labels or distorted arrows on Statecharts, Sequences, and Flowcharts |
| **💡 3 Core Business Templates** | Fast-insert buttons for Business Rules, Statechart Diagrams, and Data Dictionary Tables | Rapid authoring of standardized specification clauses |
| **👀 Single-Entry Stash & Minimize** | Clean close `✕` in header + `👀 Stash & View Page` in bottom bar (`.prd-editor-mini-dock` pill) | Review underlying prototype elements without losing unsaved drafts; 1-click restore |
| **🌐 Native 4-Language i18n** | Full 115-key dynamic dictionary covering `en`, `zh-CN`, `ja`, `ko`; runtime hot-switching | Seamless multi-lingual team collaboration across global product workflows |
| **💾 Dual Persistence & Pre-Action Guard** | Pre-action API health probing on add/reorder/edit; prioritizes `POST /api/save-prd` sync | Zero data loss, instant upfront alert modal if backend is offline instead of failing at save step |
| **🗂️ 3-State Drawer & Dual Handles** | Full (400px), Semi (56px Mini Rail), Hidden (0px); dual inward-facing edge handles | Frees up 95% of prototype canvas while keeping all pins immediately accessible |
| **🔒 Reorder Safety Lock & Cascade** | Normal browsing locks order; manage mode unlocks `🔝 Top`, `🔢 Move To`, sequential cascade | Accidental reordering prevention; seamless 1 -> 2 -> 3 cascading when reordering |
| **🏷️ Multi-Version Physical Isolation** | Isolated `versionRegistry`; new versions start clean (0 pins); upload conflict resolver | No pin cross-contamination across sprint iterations |
| **📑 Full PRD Document & PDF Export** | Dedicated doc modal + new tab view with TOC outline and print styling | 1-click export to deliverable PDF or Markdown specifications |

## 🚀 Quick Start Guide

### 1. Embed into HTML Prototype
Add the following snippet before the closing `</body>` tag of your prototype:

```html
<!-- PRD Data File (Generated per page) -->
<script src="./assets/js/prd-data-merchant.js"></script>

<!-- PRD Pinning & Visual Editor Engine -->
<script src="./assets/js/prd-pin-tool.js"></script>
```

### 2. Start Local Persistence Server
```bash
# Start Node.js native zero-dependency server
node server.js
```
Access `http://localhost:3000/merchant.html` and start pinning specs!

---

# 🇨🇳 简体中文文档

## 🌟 核心特性概览

1. **✍️ Vditor IR 即时渲染 Markdown 工作台**：
   - 类似 Typora 的流式所见即所得体验，输入 Markdown 语法即刻呈现高保真排版；
   - 动态相对基准寻址，优先加载本地 `assets/vendor/vditor/` 离线文件，离线/缺失时自动降级为 CDN。
2. **⌨️ 完整支持 Tab / Shift+Tab 多级层级缩进**：
   - 在 `- 列表`、`1. 序号` 或任务清单下按 **`Tab`** 即刻向右缩进多级嵌套；
   - 按 **`Shift + Tab`** 或行首 `Backspace` 瞬间回退层级。
3. **📊 真正的交互式可视化表格直编**：
   - 零 Markdown 竖线管道符，所见即所得真实 HTML 表格；
   - 单元格支持直接打字、`Enter/Tab` 换行换格、一键增删行列。
4. **💡 三大核心业务规约模板一键插入**：
   - **「📋 业务规则模版」**：触发条件、前置校验、多级流转细则、异常分支；
   - **「🔄 状态机流程图」**：标准 Mermaid `graph TB` 状态机流转矢量图；
   - **「📊 字段数据字典表」**：字段名、类型、必填、枚举值、口径与默认值表格。
5. **👀 单一入口草稿暂存与最小化胶囊**：
   - 弹窗右上角保留极简 `✕`，底部保留 **「👀 暂存并看页面」**；
   - 点击后折叠为右下角常驻胶囊（`✏️ 编辑中: 需求名称 · 草稿已暂存`），不遮挡底层原型，一键无损恢复。
6. **🌐 全球 4 语言架构 (`zh-CN`, `en`, `ja`, `ko`)**：
   - 抽屉顶部实时切换多语言，115 个字典键全要素动态本地化；
   - Phase 0 规范强制前置确认目标语言框架。
7. **💾 REST API 双层持久化与前置服务拦截机制**：
   - **提前校验阻断**：在点击「新增打点」、「排序管理」、「编辑需求」的入口即刻探测接口，无服务时直接弹窗拦截并引导 `node server.js`，绝不拖延到保存时才报错；
   - 优先调用 `POST /api/save-prd` 写入本地磁盘 JS 文件，支持跨项目命名空间隔离。
   - 优先调用 `POST /api/save-prd` 写入本地磁盘 JS 文件；
   - 本地服务离线时自动降级为 `localStorage` 缓存与一键导出 JS 脚本。
8. **🗂️ 三态抽屉与左边缘双按钮控制组**：
   - 400px 全展开 ⇄ 56px 紧凑标号竖条 ⇄ 0px 完全收起；
   - 左侧双按钮朝内区隔（上方深色全收起 `›` + 下方亮蓝半收起 `⇥`）。
9. **🔒 排序管理安全锁与依次瞬移顺延**：
   - 日常防误触锁定，开启管理模式后支持 `🔝 置顶`、`🔢 移至`、`▲/▼`；
   - 置顶或上移时后续项自动依次向下顺延（1 -> 2 -> 3...），滚动高度毫秒级锁定。
10. **🏷️ 多版本严格物理隔离与上传冲突解决**：
    - 新建版本默认全新空白（0 打点），各版本数据完全隔离互不干扰；
    - 上传文件支持【覆盖现有】、【追加合并】、【另存新版本】三种冲突方案。

---

# 🇯🇵 日本語ドキュメント

## 🌟 主な機能と特徴

1. **✍️ Vditor IR リアルタイム Markdown ワークベンチ**：
   - Typora のような直感的な即時レンダリング体験を提供し、入力した Markdown を即座に美麗なレイアウトで表示；
   - 相対パス解決により、ローカルの `assets/vendor/vditor/` オフラインファイルを優先読み込み、CDN 自動フォールバックに対応。
2. **⌨️ Tab / Shift+Tab による多階層インデント対応**：
   - 箇条書きや番号付きリストで **`Tab`** を押すと瞬時に右へインデント（多階層ネスト作成）；
   - **`Shift + Tab`** または行頭の `Backspace` で階層を戻すことが可能。
3. **📊 インタラクティブなビジュアルテーブル直接編集**：
   - パイプ記号 (`|`) 不要で、セルを直接クリックしてタイピング可能；
   - `Enter/Tab` による快適な移動、ワンクリックで行・列を追加/削除。
4. **💡 3 つのコア業務仕様テンプレート**：
   - **「📋 業務ルールテンプレート」**、**「🔄 ステートマシンフローチャート」**、**「📊 データディクショナリテーブル」** をワンクリックで挿入。
5. **👀 シングルエントリーのドラフト一時保存・最小化カプセル**：
   - モーダル右上の閉じるボタン `✕` と下部の **「👀 一時保存して画面確認」** ボタン；
   - クリックすると右下のフローティングカプセルに最小化され、いつでもワンクリックで無損失復元。
6. **🌐 4 言語ネイティブ対応 (`ja`, `en`, `zh-CN`, `ko`)**：
   - ドロワー上部から瞬時に言語切替可能。全 115 辞書キーによる完全ローカライズ。

---

# 🇰🇷 한국어 문서

## 🌟 주요 기능 및 특징

1. **✍️ Vditor IR 실시간 렌더링 마크다운 워크벤치**：
   - Typora 스타일의 즉시 렌더링으로 마크다운 입력 즉시 고품질 레이아웃 표시；
   - 상대 경로 자동 감지 및 로컬 `assets/vendor/vditor/` 오프라인 파일 우선 로드, CDN 자동 백업 지원.
2. **⌨️ Tab / Shift+Tab 다단계 목록 들여쓰기 지원**：
   - 순서 없는 목록, 번호 매기기 목록에서 **`Tab`** 키로 손쉽게 하위 레벨 들여쓰기；
   - **`Shift + Tab`** 또는 `Backspace`로 상위 레벨로 복귀.
3. **📊 인터랙티브 비주얼 테이블 직접 편집**：
   - 파이프 기호(`|`) 작성 부담 없이 테이블 셀을 직접 클릭하여 입력；
   - `Enter/Tab` 이동 및 행/열 원클릭 추가/삭제 지원.
4. **💡 3대 핵심 비즈니스 사양 템플릿**：
   - **「📋 비즈니스 규칙 템플릿」**、**「🔄 상태 다이어그램 플로우차트」**、**「📊 데이터 사전 테이블」** 원클릭 삽입.
5. **👀 단일 진입점 임시 저장 및 최소화 캡슐**：
   - 모달 우측 상단 간결한 `✕` 닫기와 하단 **「👀 임시저장 후 화면보기」** 버튼；
   - 화면 우측 하단 플로팅 캡슐로 접히며 원클릭으로 완벽하게 편집 상태 복원.
6. **🌐 4개 국어 네이티브 다국어 지원 (`ko`, `en`, `zh-CN`, `ja`)**：
   - 드로어 상단에서 실시간 언어 전환 가능. 115개 전체 UI 키 완벽 로컬라이즈.

---

## 🛠️ Project Structure

```text
my-prototype/
├── admin.html               # Prototype Page A
├── mall.html                # Prototype Page B
├── merchant.html            # Prototype Page C
├── server.js                # Local persistence microservice (Node.js native zero-dep)
├── start.sh                 # 1-click startup script
└── assets/
    ├── vendor/              # Third-party vendor assets
    │   └── vditor/
    │       ├── index.min.js # Vditor Core (Local offline support)
    │       └── index.css    # Vditor Styles
    └── js/
        ├── prd-pin-tool.js  # Core Engine (V6 Vditor/Tab/3-State/i18n)
        ├── prd-data-admin.js# Dedicated data for admin.html
        ├── prd-data-mall.js # Dedicated data for mall.html
        └── prd-data-merchant.js
```

---

## 📄 License
MIT License. Created for Product Managers & UI/UX Engineers.
