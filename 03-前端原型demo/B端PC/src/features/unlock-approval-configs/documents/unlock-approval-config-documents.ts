import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import mockDataMarkdown from "@prototype/MOCK_DATA-开锁审批-V1.2.md?raw"
import prdMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/06-门禁开锁审批/01-审批配置/门禁开锁审批配置主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/06-门禁开锁审批/01-审批配置/门禁开锁审批配置字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/06-门禁开锁审批/01-审批配置/门禁开锁审批配置业务规则规格.md?raw"
import demoListMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/06-门禁开锁审批/01-审批配置/门禁开锁审批配置_Demo_列表页.md?raw"
import demoFormMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/06-门禁开锁审批/01-审批配置/门禁开锁审批配置_Demo_新增编辑页.md?raw"
import demoDetailMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/06-门禁开锁审批/01-审批配置/门禁开锁审批配置_Demo_详情页.md?raw"

export const unlockApprovalConfigDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "PRD文档",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "字段清单",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "业务规则规格",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
  {
    id: "demo-list",
    title: "Demo · 列表页",
    content: demoListMarkdown,
    category: "原型交互规范",
  },
  {
    id: "demo-form",
    title: "Demo · 新增/编辑页",
    content: demoFormMarkdown,
    category: "原型交互规范",
  },
  {
    id: "demo-detail",
    title: "Demo · 详情页",
    content: demoDetailMarkdown,
    category: "原型交互规范",
  },
  {
    id: "mock-data",
    title: "Mock 数据示例 V1.2",
    content: mockDataMarkdown,
    category: "原型数据",
  },
]
