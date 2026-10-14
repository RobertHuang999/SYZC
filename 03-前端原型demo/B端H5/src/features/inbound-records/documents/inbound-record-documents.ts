import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/🌟🌟🌟-最新基准版/B端H5/02-工作台/01-仓储/05-入库管理/入库管理主PRD.md?raw"
import fieldsMarkdown from "@docs/🌟🌟🌟-最新基准版/B端H5/02-工作台/01-仓储/05-入库管理/入库管理字段清单.md?raw"
import rulesMarkdown from "@docs/🌟🌟🌟-最新基准版/B端H5/02-工作台/01-仓储/05-入库管理/入库管理业务规则规格.md?raw"

/** 移动端入库三件套（P01~P08；R 系列含 R11/R11b，真源见 PC 入库记录规格） */
export const inboundRecordH5Documents: PrototypeDocument[] = [
  {
    id: "prd",
    title: "主PRD规格",
    content: prdMarkdown,
    category: "PRD需求规格",
  },
  {
    id: "fields",
    title: "字段清单字典",
    content: fieldsMarkdown,
    category: "字段字典清单",
  },
  {
    id: "rules",
    title: "业务规则规格",
    content: rulesMarkdown,
    category: "业务规则规格",
  },
]
