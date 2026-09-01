import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核业务规则规格.md?raw"
import demoListMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核_Demo_列表页.md?raw"
import demoDetailMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核_Demo_详情页.md?raw"
import entryAsciiMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/07-审批中心/05-其他审批/03-开锁审核/开锁审核_ASCII_审批中心入口.md?raw"

export const unlockApplyAuditDocuments: PrototypeDocument[] = [
  {
    id: "audit-prd",
    title: "开锁审核主 PRD",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "audit-fields",
    title: "开锁审核字段清单",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "audit-rules",
    title: "开锁审核业务规则规格",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
  {
    id: "audit-entry-ascii",
    title: "ASCII · 审批中心入口",
    content: entryAsciiMarkdown,
    category: "页面线框图",
  },
  {
    id: "audit-demo-list",
    title: "Demo · 开锁审核列表",
    content: demoListMarkdown,
    category: "原型交互规范",
  },
  {
    id: "audit-demo-detail",
    title: "Demo · 开锁审核详情与处理",
    content: demoDetailMarkdown,
    category: "原型交互规范",
  },
]
