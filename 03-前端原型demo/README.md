# SYZC 前端原型

本目录包含 **B 端 PC** 与 **B 端 H5** 两套独立 Vite 工程，分别存放在子文件夹中。

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

H5 模块 PRD 目录按 `mobileMenuData.ts` 板块分类维护于 `🌟🌟🌟-最新基准版/B端H5/`（`01-首页/` … `03-业务办理/`）；菜单全量见 `B端H5/01-功能清单与原型路由.md`。
