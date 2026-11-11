import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/11-移库管理-移库记录/移库记录主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/11-移库管理-移库记录/移库记录字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/11-移库管理-移库记录/移库记录业务规则规格.md?raw"

export const movingRecordH5Documents: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格（基准三件套）",
    content: prdMarkdown,
    category: "PRD需求规格",
  },
  {
    id: "fields",
    title: "字段清单字典（基准三件套）",
    content: fieldsMarkdown,
    category: "字段字典清单",
  },
  {
    id: "rules",
    title: "业务规则规格（基准三件套）",
    content: rulesMarkdown,
    category: "业务规则规格",
  },
]

