import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import readmeMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/05-存量改造与关联业务协同/README.md?raw"
import synergyMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/05-存量改造与关联业务协同/合作方改造-存量业务单据协同规格.md?raw"
import scopeMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/08-版本范围与里程碑.md?raw"

export const partnerStockChangeMapDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "05 存量协同索引",
    content: readmeMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "协同规格 · 附录 A",
    content: synergyMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "08 版本范围",
    content: scopeMarkdown,
    category: "状态机与业务规则",
  },
]
