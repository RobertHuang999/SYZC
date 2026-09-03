# 🚀 PC原型Header迭代记录与功能数据权限参考模块（同事迁移指南）

> **一句话简介**：为企业级前端原型（React + Tailwind）提供开箱即用的**Header 顶部迭代记录弹窗**和**全景功能与数据权限参考大屏**，方便产品经理、研发、测试对齐版本演进与权限底座。

---

## 🌟 效果与价值

1. **Header 右侧常驻【迭代记录】**：
   - 点击弹出优雅的模态框，按版本（V2.0、V1.5等）切换；
   - 清晰展示 PC/移动端 标识、调整类型（新增/更名/迁移/取消/结构）；
   - 展示新旧菜单路径对比、业务调整原因与来源 PRD 路径。
2. **Header 右侧常驻【功能与数据权限】**：
   - 点击跳转到全屏全景权限大屏；
   - 提供端筛选（PC/移动/全部）、变更筛选（最近变更高亮）、规划中/已取消统计弹窗；
   - 全局关键词即时搜索、模块与二级子菜单级联联动；
   - 四维全景表格：页面路径（支持点击直达对应原型页面）、操作功能按钮、行级数据可见范围、修订日志。

---

## 📁 目录清单

你可以直接把 `templates/` 目录拷贝到你的前端项目中：

```
templates/
├── types/                 # TypeScript 类型定义
│   └── index.ts
├── lib/                   # 智能解析辅助库
│   ├── parse-action-buttons.ts   # 按钮标签识别（按钮 vs 仅展示）
│   ├── parse-data-permission.ts  # 数据范围识别（机构、仓库、订单等）
│   └── record-status.ts          # 规划中/已取消状态判定
├── components/            # UI 组件
│   ├── ModalOverlay.tsx          # 模态框遮罩
│   ├── IterationRecordButton.tsx # 迭代记录按钮与弹窗
│   ├── ActionButtonList.tsx      # 按钮权限标签
│   ├── DataScopeList.tsx         # 数据范围标签
│   ├── ChangeLogCell.tsx         # 变更日志单元格
│   ├── PagePathCell.tsx          # 页面路径与原型链接
│   └── HeaderQuickActions.tsx    # Header 右侧一键嵌入组合胶囊
├── pages/                 # 页面
│   └── PermissionReferencePage.tsx # 全景功能与数据权限大屏
├── data/                  # 示例数据
│   ├── mock-data.ts              # 纯静态 Mock 数据（开箱即用）
│   ├── sample-menu-iteration-records.md # Markdown 迭代记录示例
│   └── sample-permission-records.csv    # CSV 权限表示例
└── scripts/               # 自动化生成脚本（可选）
    ├── generate-iteration-records.mjs   # Markdown → TS
    └── generate-permission-records.mjs   # CSV → TS
```

---

## ⚡ 5 分钟上手接入

### 1. 确保安装基础图标库
本项目仅依赖 `lucide-react` 图标库和 `tailwindcss`：

```bash
npm install lucide-react
```

### 2. 拷贝代码并挂载到你的 Header
将 `templates` 文件夹拷贝到你的项目（如 `src/features/system-reference`）。

在你的 `Header.tsx` 中引入 `HeaderQuickActions`：

```tsx
import { HeaderQuickActions } from "@/features/system-reference/components/HeaderQuickActions"
import { sampleIterationRecords, sampleIterationVersions } from "@/features/system-reference/data/mock-data"
import { useNavigate, useLocation } from "react-router-dom"

export function MyHeader() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="flex h-14 items-center justify-between border-b px-4 bg-white">
      <div className="font-bold text-base">你的系统名称</div>

      {/* 挂载两个快捷按钮 */}
      <HeaderQuickActions
        iterationRecords={sampleIterationRecords}
        iterationVersions={sampleIterationVersions}
        onOpenPermissions={() => navigate("/permissions")}
        isPermissionActive={location.pathname === "/permissions"}
      />
    </header>
  )
}
```

### 3. 配置权限大屏路由
在路由表（如 `App.tsx` 或路由配置）添加一条路由：

```tsx
import { Route, Routes } from "react-router-dom"
import { PermissionReferencePage } from "@/features/system-reference/pages/PermissionReferencePage"
import { samplePermissionRecords } from "@/features/system-reference/data/mock-data"

export function App() {
  return (
    <Routes>
      {/* 你的其他路由 */}

      {/* 注册全景权限参考大屏 */}
      <Route
        path="/permissions"
        element={
          <PermissionReferencePage
            records={samplePermissionRecords}
            systemName="你的系统名称"
            // 可选：将菜单路径关联到具体的原型页面路由
            routeResolver={({ level1Menu, level2Menu }) => {
              if (level1Menu === "预警配置") return "/risk/warnings"
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

## 💡 如何维护你的数据？

### 选项 A：直接修改 `mock-data.ts`（最简单）
直接打开 `templates/data/mock-data.ts`，按照里面的格式增删你的业务版本记录和页面权限即可。适合快速搭建的原型项目。

### 选项 B：使用 CSV 和 Markdown 自动同步（适合正规迭代项目）
1. 用 Excel 或飞书/腾讯文档维护 `功能与数据权限清单.csv`，导出到文档目录；
2. 用 Markdown 维护各版本的 `00-菜单迭代记录.md`；
3. 执行提供的脚本自动生成 TypeScript 数据文件：
   ```bash
   node scripts/generate-permission-records.mjs <你的CSV路径> <输出的TS文件路径>
   node scripts/generate-iteration-records.mjs <你的MD路径> <输出的TS文件路径>
   ```

---

## 🎨 常见定制说明

- **更改颜色与主题**：所有样式均采用 Tailwind CSS 类名（并天然支持 `dark:` 深色模式），你可以自由微调主色调（如 `text-primary`、`bg-primary`）。
- **不用 React Router？**：`PermissionReferencePage` 和 `PagePathCell` 的跳转支持直接传入自定义 `onNavigate` 回调或标准 `<a>` 锚点链接，兼容 Next.js、Nuxt、自研路由或 Hash 路由。
- **发送给同事**：直接将 `prototype-header-iteration-and-permission` 文件夹压缩发送给同事即可，里面已包含完整代码和本说明！
