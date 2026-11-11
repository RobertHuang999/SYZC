import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/07-监管业务-监管管理/监管管理主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/07-监管业务-监管管理/监管管理字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/07-监管业务-监管管理/监管管理业务规则规格.md?raw"

export const supervisionManagementDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格（监管管理 V2.8）",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "字段清单（监管管理 V3.3）",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "业务规则规格（监管管理）",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
]
