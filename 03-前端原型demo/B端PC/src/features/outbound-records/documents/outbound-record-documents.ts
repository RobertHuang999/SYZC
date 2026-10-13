import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/02-仓储/10-出库管理-出库记录/出库记录主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/02-仓储/10-出库管理-出库记录/出库记录字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/02-仓储/10-出库管理-出库记录/出库记录业务规则规格.md?raw"

export const outboundRecordDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "字段清单字典",
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
