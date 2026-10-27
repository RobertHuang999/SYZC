import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import majorPrdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/09-配置管理/03-货品规格管理-大类管理/大类管理主PRD.md?raw"
import majorFieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/09-配置管理/03-货品规格管理-大类管理/大类管理字段清单.md?raw"
import majorRulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/09-配置管理/03-货品规格管理-大类管理/大类管理业务规则规格.md?raw"
import subPrdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/09-配置管理/04-货品规格管理-品类管理/品类管理主PRD.md?raw"
import subFieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/09-配置管理/04-货品规格管理-品类管理/品类管理字段清单.md?raw"
import subRulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/09-配置管理/04-货品规格管理-品类管理/品类管理业务规则规格.md?raw"
import goodsPrdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/09-配置管理/05-货品规格管理-货品管理/货品管理主PRD.md?raw"
import goodsFieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/09-配置管理/05-货品规格管理-货品管理/货品管理字段清单.md?raw"
import goodsRulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端PC/09-配置管理/05-货品规格管理-货品管理/货品管理业务规则规格.md?raw"

export const majorCategoryDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "大类管理主PRD",
    content: majorPrdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "大类管理字段清单",
    content: majorFieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "大类管理业务规则规格",
    content: majorRulesMarkdown,
    category: "状态机与业务规则",
  },
]

export const subcategoryDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "品类管理主PRD",
    content: subPrdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "品类管理字段清单",
    content: subFieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "品类管理业务规则规格",
    content: subRulesMarkdown,
    category: "状态机与业务规则",
  },
]

export const goodsDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "货品管理主PRD",
    content: goodsPrdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "货品管理字段清单",
    content: goodsFieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "货品管理业务规则规格",
    content: goodsRulesMarkdown,
    category: "状态机与业务规则",
  },
]
