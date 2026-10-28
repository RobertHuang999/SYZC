import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import collectPrdMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/07-货品规格管理-入库收集项配置/入库收集项配置主PRD.md?raw"
import collectFieldsMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/07-货品规格管理-入库收集项配置/入库收集项配置字段清单.md?raw"
import collectRulesMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/07-货品规格管理-入库收集项配置/入库收集项配置业务规则规格.md?raw"

export const inboundCollectDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "入库收集项配置主PRD",
    content: collectPrdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "入库收集项配置字段清单",
    content: collectFieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "入库收集项配置业务规则规格",
    content: collectRulesMarkdown,
    category: "状态机与业务规则",
  },
]
