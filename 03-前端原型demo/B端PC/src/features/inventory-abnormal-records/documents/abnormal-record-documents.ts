import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/13-货物异动-异动记录/货物异动_异动记录主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/13-货物异动-异动记录/货物异动_异动记录字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-仓储/13-货物异动-异动记录/货物异动_异动记录业务规则规格.md?raw"

export const abnormalRecordDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格（最新基准版）",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "字段清单（最新基准版）",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "业务规则规格（最新基准版）",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
]

