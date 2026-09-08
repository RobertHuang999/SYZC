# 业务办理 · 客户需求审批

> **上级**：[业务办理](../README.md)
> **板块路径**：`B端H5/03-业务办理/03-客户需求审批/`

## 功能列表

| 序号 | 菜单 | moduleId | 原型路由 | 对应 PC 菜单 | 文档 |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 01 | 客户入库预约 | `biz-approve-customer-inbound-appoint` | `/m/module/biz-approve-customer-inbound-appoint` | 工作中心 → 审批中心 → 客户入库预约 | [01-客户入库预约/](./01-客户入库预约/README.md) |
| 02 | 客户出库预约 | `biz-approve-customer-outbound-appoint` | `/m/module/biz-approve-customer-outbound-appoint` | 工作中心 → 审批中心 → 客户出库预约 | [02-客户出库预约/](./02-客户出库预约/README.md) |
| 03 | 客户融资需求线索 | `biz-approve-customer-finance-leads` | `/m/module/biz-approve-customer-finance-leads` | 工作中心 → 审批中心 → 客户融资需求 | [03-客户融资需求线索/](./03-客户融资需求线索/README.md) |
| 04 | 尽调办理 | `biz-approve-due-diligence-sso` | `/m/module/biz-approve-due-diligence-sso` | 工作中心 → 审批中心 → 融资尽调（联登SSO） | [04-尽调办理/](./04-尽调办理/README.md) |
| 05 | 客户销售需求 | `biz-approve-customer-sales-req` | `/m/module/biz-approve-customer-sales-req` | 工作中心 → 审批中心 → 客户销售需求 | [05-客户销售需求/](./05-客户销售需求/README.md) |
| 06 | 客户采购需求 | `biz-approve-customer-procure-req` | `/m/module/biz-approve-customer-procure-req` | 工作中心 → 审批中心 → 客户采购需求 | [06-客户采购需求/](./06-客户采购需求/README.md) |

---

## 说明与映射说明

1. **预约替代需求**：客户入库预约与出库预约已在当前基准中完全替代历史废弃的「客户入库需求」与「客户出库需求」（5.4.3 版本取消）。
2. **融资线索与尽调协同**：
   - 「客户融资需求线索」为移动端商机受理入口，经由“需要尽调”快照分流；
   - 「尽调办理」为快捷唤起第三方智风控 WebApp 的单点登录（SSO）跳转入口，其系统原生单据与现场照片上传维护在 [工作台 → 融资/监管 → 05-客户融资尽调办理](../../02-工作台/02-融资监管/05-客户融资尽调办理/)。

