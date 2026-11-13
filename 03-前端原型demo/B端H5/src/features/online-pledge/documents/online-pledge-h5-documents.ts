import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/04-融资管理-融资结果-线上抵质押办理/线上抵质押办理主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/04-融资管理-融资结果-线上抵质押办理/线上抵质押办理字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/04-融资监管/04-融资管理-融资结果-线上抵质押办理/线上抵质押办理业务规则规格.md?raw"

export const onlinePledgeH5Documents: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格（线上监管业务办理 V1.4）",
    content: prdMarkdown,
    category: "PRD需求规格",
  },
  {
    id: "fields",
    title: "字段清单（线上监管业务办理 V1.6）",
    content: fieldsMarkdown,
    category: "字段字典清单",
  },
  {
    id: "rules",
    title: "业务规则规格（线上监管业务办理 V1.2）",
    content: rulesMarkdown,
    category: "业务规则规格",
  },
]

