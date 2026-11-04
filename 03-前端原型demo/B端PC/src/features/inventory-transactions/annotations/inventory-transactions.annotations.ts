import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { buildInventoryCrossExportAnnotations } from "@/features/shared/inventory-cross-export/inventory-cross-export.annotations"

const inventoryTransactionsBaseAnnotations: PrototypeAnnotation[] = [
  {
    id: "tx-list-page",
    number: 1,
    kind: "页面",
    title: "库存流水合并台账（P-CKG-004）",
    content:
      "仓储业务统一出入库单据合并台账与进出存全息追溯中枢。聚合入库与出库两大流向共 19 种细分业务类型，以单据时间线展开全息进出存追溯。",
    documentRefs: {
      prd: { section: "1. 业务背景与业务痛点", match: "模块定位" },
      rules: { section: "4.1 统一单据归集与终态准入规则", match: "终态准入" },
    },
    details: [],
  },
  {
    id: "tx-stats-bar",
    number: 2,
    kind: "交互",
    title: "出入动态实时看板条",
    content:
      "顶部展示当前筛选范围内的本期入库总量/笔数与出库总量/笔数，支持快速宏观核算对账。",
    documentRefs: {
      rules: { section: "4.3 列表呈现、多维排序与超长控制规则", match: "顶部动态看板条" },
    },
    details: [],
  },
  {
    id: "tx-penetrate-lock",
    number: 3,
    kind: "规则",
    title: "存货管理穿透与参数锁定",
    content:
      "接收从存货管理 (P-CKG-001) 行操作点击【库存流水】传参，对应字段呈现锁定只读状态，确保核对上下文不丢失。",
    documentRefs: {
      rules: { section: "4.2 存货管理穿透联动与参数锁定规则", match: "穿透参数锁定" },
    },
    details: [],
  },
  {
    id: "tx-table",
    number: 4,
    kind: "字段",
    title: "进出存合并流水表格",
    content:
      "以红出绿入标签直观区分入库与出库流向，单据编号支持 Deep link 穿透至入库或出库详情页，变动数量与变动后结存实时呈现。",
    documentRefs: {
      fields: { section: "一、基础与流向识别字段", match: "流向类型" },
      rules: { section: "4.4 行操作三重凭证与穿透追溯规则", match: "单据详情穿透" },
    },
    details: [],
  },
  {
    id: "tx-pdf-preview",
    number: 5,
    kind: "交互",
    title: "单据凭证 PDF 预览与交付",
    content:
      "行操作点击【凭证下载/PDF】调出高清晰电子凭证模态框，支持直接在线验真预览与安全打印下载。",
    documentRefs: {
      rules: { section: "4.4 行操作三重凭证与穿透追溯规则", match: "单据PDF下载" },
    },
    details: [],
  },
]

export const inventoryTransactionsAnnotations: PrototypeAnnotation[] =
  inventoryTransactionsBaseAnnotations.concat(buildInventoryCrossExportAnnotations(6))
