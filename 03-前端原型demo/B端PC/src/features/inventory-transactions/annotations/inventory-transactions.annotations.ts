import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { buildInventoryCrossExportAnnotations } from "@/features/shared/inventory-cross-export/inventory-cross-export.annotations"

const inventoryTransactionsBaseAnnotations: PrototypeAnnotation[] = [
  {
    id: "tx-list-page",
    documentRefs: {
      prd: { section: "6.1 库存流水 — 列表页（P-CKG-004）", match: "对应文档：库存流水ASCII列表页.md", element: "text" },
      rules: { section: "库存流水 业务规则规格", match: "【入库与出库单据合并模型】(R01)：", element: "text" },
    },
    number: 1,
    kind: "页面",
    title: "库存流水合并台账（P-CKG-004）",
    content:
      "仓储业务统一出入库单据合并台账与进出存全息追溯中枢。聚合入库与出库两大流向共 19 种细分业务类型，以单据时间线展开全息进出存追溯。",
    details: [
      {
        title: "流水来源与穿透",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["入库 / 出库 / 异动 / 移库等作业"] --> B["生成库存流水（只读）"]
    B --> C["从存货管理行操作【库存流水】进入<br/>筛选条件锁定只读"]
    B --> D["行操作【单据下载】→ 对应凭证多介质预览"]
    B --> E["行操作【下载记录】→ 导出记录"]`,
          },
        ],
      },
    ],
  },
  {
    id: "tx-stats-bar",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "包含功能范围", element: "row" },
      fields: { section: "五、展示、筛选与引用规则", match: "顶部常驻动态汇总看板条，随当前筛选条件实时同步重算。", element: "text" },
    },
    number: 2,
    kind: "交互",
    title: "出入动态实时看板条",
    content:
      "顶部展示当前筛选范围内的本期入库总量/笔数与出库总量/笔数，支持快速宏观核算对账。",
    details: [],
  },
  {
    id: "tx-penetrate-lock",
    documentRefs: {
      rules: { section: "4.2 存货管理穿透联动与参数锁定规则 (R04 ~ R06)", match: "【仓库视图穿透锁定】(R04)：从《存货管理》（P-CKG-001）仓库标签页点", element: "text" },
      prd: { section: "6.1 库存流水 — 列表页（P-CKG-004）", match: "对应文档：库存流水ASCII列表页.md", element: "text" },
    },
    number: 3,
    kind: "规则",
    title: "存货管理穿透与参数锁定",
    content:
      "接收从存货管理 (P-CKG-001) 行操作点击【库存流水】传参，对应字段呈现锁定只读状态，确保核对上下文不丢失。",
    details: [],
  },
  {
    id: "tx-table",
    documentRefs: {
      fields: { section: "库存流水字段清单", match: "区分出库与入库两类", element: "row" },
    },
    number: 4,
    kind: "字段",
    title: "进出存合并流水表格",
    content:
      "以红出绿入标签直观区分入库与出库流向，单据编号支持 Deep link 穿透至入库或出库详情页，变动数量与变动后结存实时呈现。",
    details: [],
  },
  {
    id: "tx-pdf-preview",
    documentRefs: {
      prd: { section: "修订记录", match: "库存流水全模块（列表、排序、穿透与文件导出）", element: "row" },
      rules: { section: "七、修订记录", match: "6.3 合入：新增【列表批量导出与行级下载记录隔离】(R19)。", element: "row" },
    },
    number: 5,
    kind: "交互",
    title: "行操作【单据下载】与【下载记录】复用出入库凭证",
    content:
      "行操作【单据下载】【下载记录】与入库记录、出库记录完全同一套：入库流向打开入库多介质凭证预览（A4 / A5 / 针式连续纸），出库流向打开出库多介质凭证预览（单价货值留空）；【下载记录】打开存货管理同款导出记录弹窗（文件名/操作人/时间/状态/下载，异步生成后行内下载）。",
    details: [],
  },
]

export const inventoryTransactionsAnnotations: PrototypeAnnotation[] =
  inventoryTransactionsBaseAnnotations.concat(buildInventoryCrossExportAnnotations(6))
