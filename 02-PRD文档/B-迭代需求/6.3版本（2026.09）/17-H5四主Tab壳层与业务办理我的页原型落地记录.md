# 6.3 · H5 四主 Tab 壳层与业务办理 / 我的页原型落地记录（增量规格）

> **版本**：V1.0 | **更新日期**：2026-11-11 | **责任人**：森云科技（Senyun Technology）  
> **6.3 本文档定位**：记录 **B 端 H5 原型**（`03-前端原型demo/B端H5`）在 **四主 Tab**（首页 / 工作台 / 业务办理 / 我的）上的交互壳层与两大 Tab 页改造，供 **合并进最新基准版** 时对照路径、菜单元数据与视觉口径。  
> **关联真源**：
> - [16-PC侧栏与权限Tab拆分口径.md](./16-PC侧栏与权限Tab拆分口径.md)（PC 侧栏；与本章 H5 工作台菜单搬迁「监管档案」互补）
> - [样式规范- H5端/05-移动端色彩与视觉系统规范.md](../../../03-前端原型demo/样式规范-%20H5端/05-移动端色彩与视觉系统规范.md)（壳层选中 **品牌蓝** `blue-600`，迭代琥珀 **不**用于 Tab）
> - 工程：`B端H5/src/data/mobileMenuData.ts` · `src/pages/{WorkspacePage,TasksManagementPage,ProfilePage}.tsx`

---

## 一、与基准版合并时要做什么（说人话）

| 顺序 | 动作 | 说明 |
| :---: | :--- | :--- |
| 0 | 打开 **[18-6.3合并最新基准版走查清单](./18-6.3合并最新基准版走查清单.md)**，按 Checkbox 逐项勾选 | 覆盖 PC 16 + H5 17 + 文档 + 构建 |
| 1 | 以本文 **第二节功能清单** 验收 H5 路由与 `mobileMenuData` 是否仍在 | 合并时勿丢 `biz-overview-supervision-entrust`、工作台 `ws-stock-flow` 等新增 id |
| 2 | **底栏角标** 现为原型 Mock（`mobile-tab-badges.ts`） | 联调后改为待办/待确认接口；合并基准版时主 PRD 或接口规格写明口径 |
| 3 | **我的** 子页（授权/手机号/隐私）当前为 `PrototypeEmptyPage` | 基准版若已有小程序「我的」三件套，替换占位路由即可 |
| 4 | 头像与登录人 Mock | `public/avatars/profile-default.jpg` + `features/profile/mock/current-user.mock.ts`；上线换真实用户接口 |
| 5 | PC 侧栏 | 仍以 **16** 为准；H5 不复制 PC 九项侧栏，只保留工作台磁贴与业务办理聚合 |

**不反向改权限 CSV**：H5 `mobileMenuData` 的 `originPath` 可与老系统路径对照，新增菜单 id 不自动等价于 CSV 新行，须产品单独开权限行时再合并基准清单。

---

## 二、功能与页面对照（SSOT 表）

### 2.1 底栏 Tab 壳层（四主 Tab）

| 项 | 路由 | 实现要点 | 主要文件 |
| :--- | :--- | :--- | :--- |
| 首页 | `/m/home` | 既有首页，未在本轮大改 | `pages/HomePage.tsx` |
| 工作台 | `/m/workspace` | 分组 5 列宫格；图标来自 `iconType` + 排序表 | `pages/WorkspacePage.tsx` |
| 业务办理 | `/m/tasks` | 四区块：内部审批 / 业务发起 / 客户需求审批 / 其他审批 | `pages/TasksManagementPage.tsx` |
| 我的 | `/m/profile` | 品牌蓝顶区渐变 + 白卡片菜单 + 版本号；**无顶 NavBar** | `pages/ProfilePage.tsx` |

**底栏交互（本轮统一）**

- 选中态：**品牌蓝** `H5_PRIMARY.text`（`text-blue-600`，对齐 PC `--primary` 近似色）
- 角标（演示）：工作台 `99+`、业务办理 `60` → `src/data/mobile-tab-badges.ts`
- 组件：`src/components/layout/BottomTabBar.tsx`

### 2.2 工作台（`/m/workspace`）

| 变更类型 | 说明 |
| :--- | :--- |
| 排序 | 各 `secondaryCategory` 下按 `WORKSPACE_ITEM_ORDER` 固定顺序（与线上一致口径） |
| 新增磁贴 | **库存流水** `ws-stock-flow` |
| 菜单搬迁 | **监管档案** 从「融资/监管」分组迁至 **用户中心** 分组（与 PC「用户中心单入口」对齐，见 16 文档 3.1） |
| 图标 | 多数字段 `iconType` 调整（如监管管理 `ShieldAlert`、证照类 `FileCheck2` 等） |
| 占位 | 去除错误 `customRoute` 自引用；未实现能力走 `GenericModulePage` / `PrototypeEmptyPage` |

### 2.3 业务办理（`/m/tasks`）

| 区块 | 展示形态 | 数据驱动 |
| :--- | :--- | :--- |
| 顶部统计 | 待确认合计 **60**、今日新增 **0**（Mock） | 常量于页面内，待接接口 |
| 内部审批 | 3×2 卡片：图标 + 角标 +「查看 >」 | `TASK_ITEM_ORDER` 含 **监管委托受理** |
| 业务发起 | 5 列宫格 8 项（**不含** 盘点发起、入库暂存登记） | 与截图线上一致宫格密度 |
| 客户需求审批 | 5 列宫格；融资/销售/采购等角标 Mock | 文案「客户融资需求」（非「线索」） |
| 其他审批 | 政策资讯 / 开锁审批 / 贷中风控处理 | 图标真源在 `mobileMenuData` |

**新增菜单元数据**

- `biz-overview-supervision-entrust` · 监管委托受理 · 内部审批 · `FileSignature`

**`mobileMenuData` 图标与名称调整（业务办理域，节选）**

- 内部审批：待处理 `ClipboardList`；我的/业务申请记录 `FileText` / `FileSpreadsheet`
- 业务发起：监管办理 `Lock`；异动 `Activity`；加工 `Cpu`
- 客户需求：入库/出库预约 `ArrowDownToLine` / `ArrowUpFromLine`；融资 `HandCoins`；尽调展示名 **融资尽调** `SearchCheck`
- 其他审批：政策资讯 `Newspaper`；开锁 `KeyRound`；贷中风控 `ShieldCheck`

**组件**：`IconRenderer` 增补 `KeyRound`。

### 2.4 我的（`/m/profile`）

| 区域 | 规格 |
| :--- | :--- |
| 顶区 | 渐变 `from-[#e8f3ff]` → 页面底 `#edf2f8`；头像 54px 圆角 |
| 登录人 Mock | 张明远 / 森云科技（供应链数字监管中心）/ 监管服务方运营 · 全量数据权限 / 手机 `159****6655` |
| 头像资源 | `/avatars/profile-default.jpg`（动漫风演示图，可替换） |
| 菜单行 | 授权管理 · 手机号（行尾脱敏）· 隐私协议 · 退出登录（确认 + Toast） |
| 版本 | 系统版本号：**V3.0** |
| 子路由 | `/m/profile/authorization` · `/m/profile/phone` · `/m/profile/privacy` → 占位页 |

**工具**：`src/lib/mask-phone.ts`（手机号脱敏）。

---

## 三、PC 原型联动（同会话已落地，合并时与 16 一并验收）

| 项 | 文件 | 说明 |
| :--- | :--- | :--- |
| 菜单目录生成 | `B端PC/scripts/generate-menu-catalog.mjs` | Hub-only：监管档案、监管管理；排除看板 Tab「链接分享记录」出侧栏 |
| 侧栏逻辑 | `B端PC/src/config/navigation.ts` | 融资/监管：监管办理 → 监管管理；Tab 路径不进侧栏 |
| 生成物 | `menu-catalog.generated.ts` | 需重新 `generate` 后与权限页对照 |

详见 [16-PC侧栏与权限Tab拆分口径.md](./16-PC侧栏与权限Tab拆分口径.md) 第四节脚本表。

---

## 四、工程文件清单（合并基准版时逐项核对）

```text
03-前端原型demo/B端H5/
├── public/avatars/profile-default.jpg          # 我的 · 默认头像
├── src/data/mobileMenuData.ts                # 全量菜单 id / iconType / 业务办理新增项
├── src/data/mobile-tab-badges.ts             # 底栏角标 Mock
├── src/components/layout/BottomTabBar.tsx    # 品牌蓝选中 + 角标
├── src/components/common/IconRenderer.tsx    # KeyRound 等
├── src/pages/WorkspacePage.tsx
├── src/pages/TasksManagementPage.tsx
├── src/pages/ProfilePage.tsx
├── src/pages/GenericModulePage.tsx           # customRoute 自引用修复
├── src/features/profile/mock/current-user.mock.ts
├── src/lib/mask-phone.ts
└── src/routes/index.tsx                      # 我的子路由三条

03-前端原型demo/B端PC/
├── scripts/generate-menu-catalog.mjs
└── src/config/navigation.ts
```

---

## 五、待回写基准版（ backlog，非阻塞原型）

| 序号 | 项 | 说明 |
| :---: | :--- | :--- |
| 1 | H5 基准 README `07-监管档案` | 路径应改为 **用户中心 → 监管档案**（16 文档 3.1 已标待改） |
| 2 | 业务办理 · 我的 | 基准版若无小程序专章，可在「B端H5 / 03-业务办理」补主 PRD **页面功能说明**（四区块 + 待确认条） |
| 3 | 待办角标接口 | 底栏 99+ / 60 与业务办理顶部 60 宜统一服务端字段，避免双轨 Mock |
| 4 | PC 三件套 | 监管档案 PC 三件套、数字仓库看板内「链接分享记录」仍见 16 第五节 backfill |

---

## 六、修订记录

| 日期 | 版本 | 说明 |
| :--- | :---: | :--- |
| 2026-11-11 | V1.0 | 初稿：H5 工作台/业务办理/我的/底栏壳层 + PC 侧栏脚本交叉索引；合并基准版核对清单 |
