import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/03-预警配置/01预警等级/预警等级主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/03-预警配置/01预警等级/预警等级字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/03-预警配置/01预警等级/预警等级业务规则规格.md?raw"

export const severityLevelDocuments: PrototypeDocument[] = [
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
]
