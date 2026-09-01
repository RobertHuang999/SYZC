import type { PrototypeDocument } from "@/shared/annotations/annotation.types"
import prdMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核业务规则规格.md?raw"
import demoMobileMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核_Demo_移动端.md?raw"
import demoDetailMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核_Demo_详情页.md?raw"

export const unlockApplyAuditH5Documents: PrototypeDocument[] = [
  {
    id: "audit-prd",
    title: "开锁审核主 PRD",
    content: prdMarkdown,
    category: "PRD需求规格",
    badge: "审批人侧",
  },
  {
    id: "audit-fields",
    title: "开锁审核字段清单",
    content: fieldsMarkdown,
    category: "字段字典清单",
    badge: "数据模型",
  },
  {
    id: "audit-rules",
    title: "开锁审核业务规则规格",
    content: rulesMarkdown,
    category: "业务规则规格",
    badge: "状态机与规则",
  },
  {
    id: "audit-demo-mobile",
    title: "Demo · H5 移动列表",
    content: demoMobileMarkdown,
    category: "PRD需求规格",
    badge: "Demo · 列表",
  },
  {
    id: "audit-demo-detail",
    title: "Demo · H5 详情与处理",
    content: demoDetailMarkdown,
    category: "PRD需求规格",
    badge: "Demo · 详情",
  },
]
