import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/10-仓储管理-入库记录/入库记录主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/10-仓储管理-入库记录/入库记录字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/10-仓储管理-入库记录/入库记录业务规则规格.md?raw"

export const inboundRecordDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格（6.3 迭代）",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "字段清单（6.3 迭代）",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "业务规则规格（6.3 迭代）",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
]
