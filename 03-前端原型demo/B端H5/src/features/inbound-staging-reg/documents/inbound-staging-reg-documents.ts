import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/09-仓储管理-入库暂存登记/入库暂存登记主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/09-仓储管理-入库暂存登记/入库暂存登记字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/09-仓储管理-入库暂存登记/入库暂存登记业务规则规格.md?raw"

export const inboundStagingRegH5Documents: PrototypeDocument[] = [
  { id: "prd", title: "主PRD规格", content: prdMarkdown, category: "PRD需求规格" },
  { id: "fields", title: "字段清单字典", content: fieldsMarkdown, category: "字段字典清单" },
  { id: "rules", title: "业务规则规格", content: rulesMarkdown, category: "业务规则规格" },
]
