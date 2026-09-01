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

- 布局：Sidebar + 宽表（后台管理风格）
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
| 07/01 审批中心首页 | `unlock-applies` | `/工作中心/审批中心` | `ApprovalCenterPage`：其他审批卡片 + 开锁预览 |
| 07/04 我的申请管理 | `unlock-applies` | `/工作中心/审批中心/我的申请管理` | Tab「我的开锁申请」+ 详情/撤回/凭证 |
| 08/开锁审核 | `unlock-applies` | `/工作中心/审批中心/其他审批/开锁审核` | 审批人列表/详情/通过驳回 |
| 06/01 开锁审批配置 | `unlock-approval-configs` | `/配置管理/业务流程管理/开锁审批` | 配置 CRUD |
