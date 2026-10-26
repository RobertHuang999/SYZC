import type { ReceiptStatus } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  RECEIPT_PC_LIST_PATH,
  receiptPcDetailPath,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-routes"

export { RECEIPT_PC_LIST_PATH, receiptPcDetailPath }
export const RECEIPT_LIST_PATH = RECEIPT_PC_LIST_PATH
export const receiptDetailPath = receiptPcDetailPath

export const PAGE_SIZE = 10

/** 列表筛选与分页在离开详情后恢复（ASCII 详情页第 5 节「返回列表保留筛选条件」） */
export const RECEIPT_LIST_STATE_KEY = "syzc-warehouse-receipt-list-state"

export const WAREHOUSE_OPTIONS = [
  "生鲜仓库",
  "海霸王仓库",
  "华东1号智能立体仓",
  "西南大宗物资仓",
] as const

export const GOODS_CATEGORY_OPTIONS = [
  "水果",
  "蔬菜",
  "冻货",
  "金属",
  "钢材",
  "铝锭",
  "橡胶",
] as const

export const GOODS_VARIETY_MAP: Record<string, string[]> = {
  水果: ["西瓜", "香蕉"],
  蔬菜: ["辣椒"],
  冻货: ["牛肉", "鸡翅"],
  金属: ["电解铜"],
  钢材: ["热轧卷板"],
  铝锭: ["铝锭"],
  橡胶: ["天然橡胶"],
}

export const THIRD_PARTY_OPTIONS = ["全部", "是", "否"] as const

export const STATUS_FILTER_OPTIONS: Array<{
  value: ReceiptStatus
  label: string
}> = [
  { value: "PENDING", label: "审批中" },
  { value: "NORMAL", label: "正常" },
  { value: "FROZEN", label: "冻结" },
  { value: "CANCELLED", label: "注销" },
]

export const CREATOR_OPTIONS = [
  "lxy(四川享宇科技有限公司)",
  "王监管(华东仓储运营中心)",
  "张三(森云监管服务有限公司)",
] as const
