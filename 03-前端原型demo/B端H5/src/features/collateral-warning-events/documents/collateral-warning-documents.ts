import type { PrototypeDocument } from "@/shared/annotations/annotation.types"
import prdMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/02-预警信息/02押品预警信息/押品预警信息主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/02-预警信息/02押品预警信息/押品预警信息字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/02-预警信息/02押品预警信息/押品预警信息业务规则规格.md?raw"

export const collateralWarningDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "押品预警信息主PRD规格",
    content: prdMarkdown,
    category: "PRD需求规格",
    badge: "v6.2.0 唯一定义",
  },
  {
    id: "fields",
    title: "押品预警信息字段清单",
    content: fieldsMarkdown,
    category: "字段字典清单",
    badge: "数据模型",
  },
  {
    id: "rules",
    title: "押品预警信息业务规则规格",
    content: rulesMarkdown,
    category: "业务规则规格",
    badge: "状态机与规则",
  },
]
