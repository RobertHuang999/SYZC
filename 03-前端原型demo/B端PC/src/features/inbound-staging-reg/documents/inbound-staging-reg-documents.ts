import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/09-仓储管理-入库暂存登记/入库暂存登记主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/09-仓储管理-入库暂存登记/入库暂存登记字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.3版本（2026.09）/09-仓储管理-入库暂存登记/入库暂存登记业务规则规格.md?raw"

export const inboundStagingRegDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "字段清单字典",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "业务规则规格",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
]
