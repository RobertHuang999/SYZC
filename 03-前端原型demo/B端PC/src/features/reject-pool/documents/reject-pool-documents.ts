import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/05-融资管理-被拒退回池/被拒退回池主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/05-融资管理-被拒退回池/被拒退回池字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/05-融资管理-被拒退回池/被拒退回池业务规则规格.md?raw"

export const rejectPoolDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格（被拒退回池 V1.6）",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "字段清单（被拒退回池 V1.8）",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "业务规则规格（被拒退回池 V1.2）",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
]

