import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/合作方档案主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/合作方档案字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/04-合作方档案/合作方档案业务规则规格.md?raw"

export const partnerArchiveH5Documents: PrototypeDocument[] = [
  {
    id: "prd",
    title: "合作方档案主PRD",
    content: prdMarkdown,
    category: "PRD需求规格",
  },
  {
    id: "fields",
    title: "合作方档案字段清单",
    content: fieldsMarkdown,
    category: "字段字典清单",
  },
  {
    id: "rules",
    title: "合作方档案业务规则规格",
    content: rulesMarkdown,
    category: "业务规则规格",
  },
]
