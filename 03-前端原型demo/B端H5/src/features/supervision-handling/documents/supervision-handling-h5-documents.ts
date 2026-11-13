import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/06-监管业务-监管办理/监管办理主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/06-监管业务-监管办理/监管办理字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/06-监管业务-监管办理/监管办理业务规则规格.md?raw"

export const supervisionHandlingH5Documents: PrototypeDocument[] = [
  {
    id: "prd",
    title: "监管办理 主PRD",
    content: prdMarkdown,
    category: "PRD需求规格",
  },
  {
    id: "fields",
    title: "监管办理 字段清单",
    content: fieldsMarkdown,
    category: "字段字典清单",
  },
  {
    id: "rules",
    title: "监管办理 业务规则规格",
    content: rulesMarkdown,
    category: "业务规则规格",
  },
]
