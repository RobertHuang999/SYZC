import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/15-提货单/提货单主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/15-提货单/提货单字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/15-提货单/提货单业务规则规格.md?raw"

export const deliveryOrderDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格（提货单 V1.2）",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "字段清单（提货单 V1.2）",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "业务规则规格（提货单 V1.2）",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
]

