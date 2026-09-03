---
name: prototype-header-iteration-and-permission
description: Integrate or export enterprise-grade Header Iteration Changelog (迭代记录) and System Feature & Data Scope Permission Reference (功能与数据权限参考大屏) for desktop B2B prototypes (React, Tailwind CSS, Vite, Next.js). Use when adding changelog modals, version-by-version menu diffs, RBAC action button tags, row-level data scope badges, or migrating prototype reference modules across projects.
---

# 🚀 Prototype Header: 迭代记录与功能数据权限体系 (SKILL)

在企业级 B 端系统（如供应链金融、ERP、MES、CRM、风控监管平台等）的交互原型设计中，原型不仅用于 UI 页面预览，更是**产品经理、前端开发、后端开发、测试人员及业务方对齐“系统版本演进”与“功能+操作权限+行级数据权限底座”的核心工作平台**。

本 Skill 将 PC 端原型的两大标杆基石模块——**Header 迭代记录弹窗 (`IterationRecordButton`)** 与 **功能与数据权限参考大屏 (`PermissionReferencePage`)** 标准化、解耦化，使其能够**零成本复制到任何新的前端原型或业务项目中**。

---

## 🏗️ 1. 核心架构与功能矩阵

```
┌────────────────────────────────────────────────────────────────────────┐
│ 原型系统 Header (顶部导航栏)                                            │
│                                                                        │
│ [系统 Logo]  [业务模块一]  [业务模块二] ...     [ 🕒 迭代记录 ]  [ 🔑 功能与数据权限 ] │
└───────────────────────────────────────────────────┬────────────────────┬───┘
                                                    │                    │
                        ┌───────────────────────────┴──┐                 │
                        ▼                              ▼                 │
        【1. 迭代记录模态弹窗】                        │                 │
        • 版本 Tab 切换 (V2.0, V1.5...)                │                 │
        • 多端标记 (PC / 移动 / 双端)                  │                 │
        • 变更类型徽标 (新增/更名/迁移/取消/结构)      │                 │
        • 结构化对比 (调整前路径 vs 调整后路径)        │                 │
        • 业务调整说明与关联 PRD 文档路径              │                 │
                                                       │                 │
                                                       ▼                 ▼
                                         【2. 功能与数据权限全景大屏】
                                         • 平台维度过滤 (PC / 移动 / 全部)
                                         • 状态流转过滤 (全量 / 最近变更 / 规划中 / 已取消)
                                         • 全局关键词即时搜索 (路径/按钮/权限/日志)
                                         • 模块一级分类 Tab + 二级子菜单级联联动
                                         • 四维全景表格：
                                           ① 页面与导航路径 (含原型 Deep Link 跳转)
                                           ② 功能按钮与操作权限 (自动识别操作与可见性)
                                           ③ 行级数据可见范围 (仓库/机构/订单/任务智能标签)
                                           ④ 变更说明与修订时间轴 (高亮跨系统/已废弃)
```

---

## 📦 2. 目录结构与资产清单

在本技能包的 `templates/` 目录下已准备好开箱即用的完整纯净代码包：

```
prototype-header-iteration-and-permission/
├── SKILL.md                          # 👈 当前 Agent 技能指引
├── README.md                         # 👈 人类同事专用 5 分钟上手说明
└── templates/
    ├── types/                        # TypeScript 核心类型定义
    │   └── index.ts                  # IterationRecordEntry, PermissionRecord 等
    ├── lib/                          # 智能文本解析与过滤算法
    │   ├── parse-action-buttons.ts   # 按钮/可见性标签智能分类解析
    │   ├── parse-data-permission.ts  # 数据可见范围与隔离规则解析
    │   └── record-status.ts          # 规划中/已取消/最近变更等状态判定与计数
    ├── components/                   # UI 组件
    │   ├── ModalOverlay.tsx          # 模态弹窗与 Portal 遮罩底座
    │   ├── IterationRecordButton.tsx # Header 迭代记录按钮与弹窗视图
    │   ├── ActionButtonList.tsx      # 操作权限标签芯片组 (Check / Eye)
    │   ├── DataScopeList.tsx         # 数据权限范围徽标与规则列表 (Warehouse, Org...)
    │   ├── ChangeLogCell.tsx         # 变更与修订日志单元格
    │   ├── PagePathCell.tsx          # 页面层级面包屑与原型路由深链
    │   └── HeaderQuickActions.tsx    # Header 右侧一键嵌入胶囊组合组件
    ├── pages/                        # 完整看板页面
    │   └── PermissionReferencePage.tsx # 全景功能与数据权限大屏
    ├── data/                         # 数据源模板与 Mock
    │   ├── mock-data.ts              # 开箱即用无需外部文件的 Mock 数据
    │   ├── sample-menu-iteration-records.md # Markdown 迭代记录书写模板
    │   └── sample-permission-records.csv    # CSV 功能权限表书写模板
    └── scripts/                      # 自动化构建脚本
        ├── generate-iteration-records.mjs   # Markdown → TS 自动化解析脚本
        └── generate-permission-records.mjs   # CSV → TS 自动化解析脚本
```

---

## 🛠️ 3. 依赖项与技术栈

本方案采用标准现代化前端轻量依赖，天然契合主流 React 原型工程：

```json
{
  "dependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "lucide-react": "^0.300.0 || ^1.0.0",
    "tailwindcss": ">=3.0.0 || >=4.0.0"
  }
}
```

> **提示**：样式使用标准 Tailwind CSS 原子类，内置了亮色与暗色模式适配（`dark:...`），在任何 Tailwind 启用的项目中均可自适应。

---

## 🚀 4. 快速接入指南（3 步完成）

### 步骤 1：复制模板到目标项目
将 `templates/` 目录复制到你项目的 `src/features/system-reference/`（或任意自定义目录）：

```bash
# 示例复制命令
cp -r templates/ src/features/system-reference/
```

### 步骤 2：在系统 Header 中挂载
打开现有项目的通用 Header 组件（如 `src/components/layout/Header.tsx`），在右侧操作区引入：

```tsx
import { HeaderQuickActions } from "@/features/system-reference/components/HeaderQuickActions"
import { sampleIterationRecords, sampleIterationVersions } from "@/features/system-reference/data/mock-data"
import { useNavigate, useLocation } from "react-router-dom"

export function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <span className="font-bold text-base">系统原型管理台</span>
      </div>

      {/* 右侧挂载胶囊组件 */}
      <HeaderQuickActions
        iterationRecords={sampleIterationRecords}
        iterationVersions={sampleIterationVersions}
        onOpenPermissions={() => navigate("/system-reference/permissions")}
        isPermissionActive={pathname.includes("permissions")}
      />
    </header>
  )
}
```

### 步骤 3：注册权限参考大屏路由
在路由表中注册独立页面：

```tsx
import { Route, Routes } from "react-router-dom"
import { PermissionReferencePage } from "@/features/system-reference/pages/PermissionReferencePage"
import { samplePermissionRecords } from "@/features/system-reference/data/mock-data"

export function AppRoutes() {
  return (
    <Routes>
      {/* 现有业务路由... */}
      
      {/* 注册功能与数据权限全景大屏 */}
      <Route
        path="/system-reference/permissions"
        element={
          <PermissionReferencePage
            records={samplePermissionRecords}
            systemName="供应链金融协同平台"
            // 支持自定义点击原型跳转逻辑
            routeResolver={({ level1Menu, level2Menu }) => {
              if (level1Menu === "预警配置") return "/risk/warnings"
              if (level1Menu === "智能硬件") return "/devices/doors"
              return null
            }}
          />
        }
      />
    </Routes>
  )
}
```

---

## 📊 5. 数据源维护模式（两种方式随心选）

### 模式 A：纯静态 TypeScript / JSON 维护（极简轻量）
无需任何前置脚本，直接在 `src/features/system-reference/data/` 下修改 `mock-data.ts`，适合小型项目或快速交互演示。

### 模式 B：Markdown + CSV 自动化驱动（推荐中大型项目）
产品经理（PM）在 PRD 仓库中维护：
1. **各版本菜单迭代记录**：`docs/00-菜单迭代记录.md`（标准 Markdown 表格与 Frontmatter）
2. **功能与数据权限清单**：`docs/功能与数据权限清单.csv`（Excel 导出或云文档表格导出）

在 `package.json` 中增加两条命令：
```json
{
  "scripts": {
    "generate:iterations": "node scripts/generate-iteration-records.mjs docs/00-菜单迭代记录.md src/features/system-reference/data/menu-iteration-records.ts",
    "generate:permissions": "node scripts/generate-permission-records.mjs docs/功能与数据权限清单.csv src/features/system-reference/data/permission-records.ts",
    "generate:all": "npm run generate:iterations && npm run generate:permissions"
  }
}
```
每次 PRD 更新表格后，运行一次 `npm run generate:all`，原型页面即可热更新最新权限与迭代履历！

---

## 🎨 6. 核心设计规范与业务原则

1. **专网专道与自审禁止原则（P06/R11）**：
   在工作中心或特殊审批场景下，权限清单需明确标注自审禁止约束（发起人不可审批自己的单据），并在操作按钮列明确区分“查看详情”与“去审批”。
2. **操作按钮分类体系**：
   - 具有真实交互动作的按钮（新增、编辑、删除、导出、提交）标记为 `Check` 实心芯片；
   - 仅作为目录或页面浏览展示控制的标记为 `Eye` 虚线眼睛芯片。
3. **数据权限多维解耦**：
   根据业务将行级权限按【仓库维度】（WarehouseIcon）、【机构维度】（Building2Icon）、【订单维度】（ClipboardListIcon）、【任务经办】（SlidersHorizontalIcon）做可视化色彩区隔，消除开发与业务沟通歧义。
