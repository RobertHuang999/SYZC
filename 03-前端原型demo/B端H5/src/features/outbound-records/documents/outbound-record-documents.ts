import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/02-仓储/10-出库管理-出库记录/出库记录主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/02-仓储/10-出库管理-出库记录/出库记录字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/02-仓储/10-出库管理-出库记录/出库记录业务规则规格.md?raw"

export const outboundRecordH5Documents: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格",
    content: prdMarkdown,
    category: "PRD需求规格",
  },
  {
    id: "fields",
    title: "字段清单字典",
    content: fieldsMarkdown,
    category: "字段字典清单",
  },
  {
    id: "rules",
    title: "业务规则规格",
    content: rulesMarkdown,
    category: "业务规则规格",
  },
]

export const mobileOutboundRecordDocuments = outboundRecordH5Documents
