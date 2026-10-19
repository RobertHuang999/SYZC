# 工作台 · 融资/监管

> **上级**：[工作台](../README.md)
> **板块路径**：`B端H5/02-工作台/02-融资监管/`
> **6.2 结构口径**：[04-融资监管-菜单更名与监管管理口径](../../../../B-迭代需求/6.2版本（2026.08）/04-融资监管-菜单更名与监管管理口径.md)

## 功能列表

| 序号 | 菜单 | moduleId | 原型路由 | 文档 |
| :---: | :--- | :--- | :--- | :--- |
| 01 | **监管管理**（页内 Tab：抵押 / 质押 / 监管服务） | `ws-pledge-order-mgr`（主入口；`ws-supervision-order-mgr` 旧链兼容跳转） | `/m/module/ws-pledge-order-mgr` | [01-抵质押订单/](./01-抵质押订单/README.md)（文档待重命名为监管管理） |
| 02 | 客户融资授信办理 | `ws-credit-process` | `/m/module/ws-credit-process` | [03-客户融资授信办理/](./03-客户融资授信办理/README.md) |
| 03 | **线上监管业务办理** | `ws-online-pledge-process` | `/m/module/ws-online-pledge-process` | [04-线上抵质押办理/](./04-线上抵质押办理/README.md)（文档待重命名） |
| 04 | 客户融资尽调办理 | `ws-due-diligence-process` | `/m/module/ws-due-diligence-process` | [05-客户融资尽调办理/](./05-客户融资尽调办理/README.md) |
| 05 | 被拒退回记录池 | `ws-reject-pool` | `/m/module/ws-reject-pool` | [06-被拒退回记录池/](./06-被拒退回记录池/README.md) |
| 06 | 监管档案 | `ws-supervision-archive` | `/m/module/ws-supervision-archive` | [07-监管档案/](./07-监管档案/README.md) |

### 6.2 上线相对旧版 H5 菜单差异

| 调整前 | 调整后 |
| :--- | :--- |
| 独立菜单「抵质押订单」+「监管订单（当前关闭）」 | **合并为「监管管理」**，内 Tab **抵押 / 质押 / 监管服务**（与 PC 监管管理三 Tab 对齐） |
| 「线上抵质押办理」 | **线上监管业务办理** |

> **归档说明**：原 [02-监管订单/](./02-监管订单/README.md) 描述的是 **旧独立菜单** 下线口径，6.2 起第三种类型在 **监管管理 · 监管服务** Tab 运营，见 PC [监管管理主PRD](../../../B端PC/03-融资监管/07-抵质押业务-抵质押业务管理/抵质押业务管理主PRD.md)。
