import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/16-货物盘点/货物盘点主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/16-货物盘点/货物盘点字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/16-货物盘点/货物盘点业务规则规格.md?raw"

export const inventoryCheckDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "货物盘点主PRD（6.3基准版）",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "货物盘点字段清单（6.3基准版）",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "货物盘点业务规则规格（6.3基准版）",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
]

