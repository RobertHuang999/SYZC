import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-融资监管/06-抵质押业务-抵质押业务办理/抵质押业务办理主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-融资监管/06-抵质押业务-抵质押业务办理/抵质押业务办理字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/03-融资监管/06-抵质押业务-抵质押业务办理/抵质押业务办理业务规则规格.md?raw"

export const supervisionHandlingDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格",
    category: "PRD需求规格",
    content: prdMarkdown,
  },
  {
    id: "fields",
    title: "字段清单字典",
    category: "字段字典清单",
    content: fieldsMarkdown,
  },
  {
    id: "rules",
    title: "业务规则规格",
    category: "业务规则规格",
    content: rulesMarkdown,
  },
]
