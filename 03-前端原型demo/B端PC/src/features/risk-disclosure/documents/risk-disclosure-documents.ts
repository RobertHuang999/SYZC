import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/05-风控/09-风险信息-风险公示/风险公示主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/05-风控/09-风险信息-风险公示/风险公示字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/05-风控/09-风险信息-风险公示/风险公示业务规则规格.md?raw"

export const riskDisclosureDocuments: PrototypeDocument[] = [
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
