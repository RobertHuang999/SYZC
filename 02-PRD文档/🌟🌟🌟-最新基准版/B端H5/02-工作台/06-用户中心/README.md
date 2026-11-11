# 工作台 · 用户中心

> **上级**：[工作台](../README.md)
> **板块路径**：`B端H5/02-工作台/06-用户中心/`
> **6.3 口径**：[17-H5四主Tab壳层与业务办理我的页原型落地记录](../../../../B-迭代需求/6.3版本（2026.09）/17-H5四主Tab壳层与业务办理我的页原型落地记录.md) 2.2 节

## 功能列表（5 项）

| 序号 | 菜单 | moduleId | 原型路由 | 文档 | 端差异 |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 01 | 货主信息 | `ws-partner-owner` | `/m/module/ws-partner-owner` | [01-货主信息/](./01-货主信息/README.md) | 列表卡片 + 悬浮【+】新增；不含改址与「保存并验证」 |
| 02 | 提货人信息 | `ws-partner-pickup` | `/m/module/ws-partner-pickup` | [02-提货人信息/](./02-提货人信息/README.md) | 同上 |
| 03 | 资金方信息 | `ws-partner-funder` | `/m/module/ws-partner-funder` | [03-资金方信息/](./03-资金方信息/README.md) | 同上 |
| 04 | 服务方信息 | `ws-partner-service` | `/m/module/ws-partner-service` | [04-服务方信息/](./04-服务方信息/README.md) | 同上 |
| 05 | 监管档案 | `ws-supervision-archive` | `/m/module/ws-supervision-archive` | [05-监管档案/](./05-监管档案/README.md) | 九视图改顶部滑动标签 |

## 说明

- **监管档案搬迁**：6.3 从「融资/监管」分组迁入本分组，与 PC「用户中心单入口」对齐；
- **四子菜单与 PC 同主数据**：列表、详情、悬浮新增与轻量编辑与 PC 共用档案，H5 不提供 PC 的「保存并验证」与改址复合弹窗；
- **RBAC 四路径分别授权**，与 PC 四子菜单一致，不共用目录权限。
