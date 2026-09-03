# SYZC B 端 PC 原型

独立 Vite 工程，与同级目录 [B端H5](../B端H5/) 分开运行。

## 启动

```bash
cd B端PC
npm install
npm run dev
```

默认端口 **5173**（H5 原型为 5174）。

## 布局与目录

- **顶栏模块**：`TopModuleNav` + 各模块内容区
- **Sidebar**：仅 **仓储 / 融资监管 / 交易 / 风控 / 物联网IOT与预警 / 统计 / 结算 / 配置管理** 等模块展示；**工作中心无 Sidebar**（`shouldShowSidebar()` in `navigation.ts`）
- **工作中心 · 审批中心**：三大区块（业务管理审批 / 客户需求审批 / 其他审批）单行并排，组内子类型 Grid 均分；选中项下方最多 5 条预览 +「查看更多」（见 `AGENTS.md` §4.3）
- **未实现菜单**：`PrototypeEmptyPage` 占位（路由由权限清单 + `implemented-routes.ts` 生成）
- 业务代码：`src/features/{模块名}/`

```text
src/features/{模块名}/
  domain/       # 类型、常量、动作矩阵
  mock/         # Mock 数据
  components/   # PC 专用组件
  pages/        # 页面
```

## 6.2 已接入模块

| PRD | feature | 路由 | 说明 |
| :--- | :--- | :--- | :--- |
| 07/01 审批中心首页 | `unlock-applies` | `/工作中心/审批中心` | `ApprovalCenterPage`：三区块导航 + 子类型预览（默认待处理；开锁审核等切换预览） |
| 07/04 我的申请管理 | `unlock-applies` | `/工作中心/审批中心/我的申请管理` | Tab「我的开锁申请」+ 详情/撤回/凭证 |
| 08/开锁审核 | `unlock-applies` | `/工作中心/审批中心/其他审批/开锁审核` | 审批人列表/详情/通过驳回 |
| 06/01 开锁审批配置 | `unlock-approval-configs` | `/配置管理/业务流程管理/开锁审批` | 配置 CRUD |

## 相关文档

- 审批中心首页线框：[07/开锁审核_ASCII_审批中心入口.md](../../02-PRD文档/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核_ASCII_审批中心入口.md)
- 菜单与布局基准：[B端PC/00-菜单地图.md](../../02-PRD文档/🌟🌟🌟-最新基准版/B端PC/00-菜单地图.md) §二
- 全局原型规范：`AGENTS.md` §4.3
