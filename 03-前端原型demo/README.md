# SYZC 前端原型

本目录包含 **B 端 PC** 与 **B 端 H5** 两套独立 Vite 工程，分别存放在子文件夹中。


## 根目录文档导航

| 文档 / 目录 | 用途 | 备注 |
| :--- | :--- | :--- |
| [原型页面布局速查.md](./原型页面布局速查.md) | 新建/改版页面前先读的速查与检查清单 | 入口，AGENTS 4.1.1 |
| [页面布局方案-列表详情表单.md](./页面布局方案-列表详情表单.md) | 列表 / 详情 / 新增编辑三类页面骨架图 | 速查的配套骨架 |
| [原型双端标注对齐说明.md](./原型双端标注对齐说明.md) | PC / H5 标注共用正文与端差异规则 | AGENTS 4.2.1 |
| [04-UI走查与迁移/](./04-UI走查与迁移/README.md) | PC UI 走查记录与现网 UI 移植台账 | 过程档案，非业务 PRD |
| [B端PC/](./B端PC/) · [B端H5/](./B端H5/) | 两套 Vite 原型工程 | — |
| [shared/](./shared/) | PC / H5 共用组件、数据与标注 | — |
| [样式规范- PC端/](./样式规范- PC端/README.md) · [样式规范- H5端/](./样式规范- H5端/README.md) | 布局条文真源 | 速查与走查均引用 |
| [tools/](./tools/) | 截图、取数与构建辅助脚本 | 走查产物在 `tools/out/` |

---

## 部署 / 推送前（必读）

| 步骤 | 命令 | 说明 |
| :--- | :--- | :--- |
| PC 类型检查 + 打包 | `cd B端PC && npm run build` | Cloudflare 对 PC 原型使用同一命令 |
| H5 类型检查 + 打包 | `cd B端H5 && npm run build` | H5 独立站点时同样要求 |
| 根目录一键（pre-push 同款） | 在仓库根 `npm run build:prototype` | 需根目录与各子工程均已 `npm install` |

首次启用 Git 钩子：在仓库根执行 `npm install`（安装 Husky），之后每次 `git push` 会自动跑双端 build。

## B 端 PC（后台管理）

```bash
cd B端PC
npm install
npm run dev
```

- 端口：5173（默认）
- 路径：`B端PC/src/features/`
- 布局：Sidebar + 宽表

详见 [B端PC/README.md](./B端PC/README.md)

## B 端 H5（项目监管 App）

```bash
cd B端H5
npm install
npm run dev
```

- 端口：**5174**
- 路径：`B端H5/src/features/`
- 布局：NavBar + 卡片列表 + 筛选抽屉

详见 [B端H5/README.md](./B端H5/README.md)

## 模块对照

| PRD 模块 | PC feature / 路由 | H5 feature / 路由 | 6.2 PRD 目录 |
| :--- | :--- | :--- | :--- |
| 02/02 押品预警信息 | `collateral-warning-events` | `collateral-warning-events` | `02-预警信息/02押品预警信息/` |
| 02/01 设备预警信息 | `device-warning-events` | `device-warning-events` | `02-预警信息/01设备预警信息/` |
| 07/05 我的申请管理 | `unlock-applies` → `ApprovalCenterPage` | — | `07-审批中心/03-业务审批/04-我的申请管理/` |
| 08/开锁审核（其他审批·审批人） | `unlock-applies` → 列表/详情（`/工作中心/审批中心/其他审批/开锁审核`） | `unlock-applies`（`/m/approval/unlock-applies`） | `07-审批中心/05-其他审批/03-开锁审核/` |
| 07/04 开锁申请（申请人侧） | —（待建：我的申请管理 Tab） | —（待建：我的申请记录 + 详情） | `07-审批中心/04开锁申请/` |
| 02/05 仓单管理（最新基准版） | `warehouse-receipts` → `/仓储/仓单管理`、`/仓储/仓单管理/详情/:id` | `warehouse-receipts`（`/m/workspace/warehouse-receipts`、`/m/receipts/initiate`、`/m/receipts/:id/{outbound,relocate,replenish,remove,cancel,inbound}`） | `🌟🌟🌟-最新基准版/B端PC/03-仓储/05-仓单管理/` |

H5 模块 PRD 目录按 `mobileMenuData.ts` 板块分类维护于 `🌟🌟🌟-最新基准版/B端H5/`（`01-首页/` … `03-业务办理/`）；菜单全量见 `B端H5/01-功能清单与原型路由.md`。
