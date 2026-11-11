import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/11-移库管理-移库记录/移库记录主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/11-移库管理-移库记录/移库记录字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/11-移库管理-移库记录/移库记录业务规则规格.md?raw"

export const relocationRecordDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "移库记录主PRD（最新基准版）",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "移库记录字段清单（最新基准版）",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "移库记录业务规则规格（最新基准版）",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
]
