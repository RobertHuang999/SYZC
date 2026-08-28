# 强盛进销存商品管理复刻

基于目标页面 `https://pmvitamin.com/projects/QS-JXC-Project/#/product-management` 的 PC 端布局复刻，使用 React、TypeScript、Tailwind CSS 与 `lucide-react`。

## 启动

```bash
npm install
npm run dev
```

页面默认按 1280×720 设计核对，入口为 `/`。

## 结构

- `src/components/HeaderBar.tsx`：顶部状态栏、搜索、通知和用户区
- `src/components/Sidebar.tsx`：左侧导航与收起菜单
- `src/components/ProductFilters.tsx`：商品筛选区域
- `src/components/ProductTable.tsx`：商品表格、状态与分页
- `src/App.tsx`：页面状态、筛选逻辑和布局编排
