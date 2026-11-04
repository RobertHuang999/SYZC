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

export type CascaderOption = {
  value: string
  label: string
  children?: CascaderOption[]
}

/** 货品三级级联选择树：大类 -> 品类 -> 规格（对齐现网源码与真实业务大宗商品） */
export const GOODS_CASCADER_OPTIONS: CascaderOption[] = [
  {
    value: "冻货",
    label: "冻货",
    children: [
      {
        value: "牛肉",
        label: "牛肉",
        children: [{ value: "36个月", label: "36个月" }],
      },
      {
        value: "鸡翅",
        label: "鸡翅",
        children: [{ value: "四川-特级-2025", label: "四川-特级-2025" }],
      },
    ],
  },
  {
    value: "橡胶",
    label: "橡胶",
    children: [
      {
        value: "天然橡胶",
        label: "天然橡胶",
        children: [{ value: "STR20", label: "STR20" }],
      },
    ],
  },
  {
    value: "水果",
    label: "水果",
    children: [
      {
        value: "西瓜",
        label: "西瓜",
        children: [{ value: "超级-宁夏", label: "超级-宁夏" }],
      },
      {
        value: "香蕉",
        label: "香蕉",
        children: [{ value: "进口-一级", label: "进口-一级" }],
      },
    ],
  },
  {
    value: "蔬菜",
    label: "蔬菜",
    children: [
      {
        value: "辣椒",
        label: "辣椒",
        children: [{ value: "云南-有机", label: "云南-有机" }],
      },
    ],
  },
  {
    value: "金属",
    label: "金属",
    children: [
      {
        value: "电解铜",
        label: "电解铜",
        children: [{ value: "阴极铜-A级", label: "阴极铜-A级" }],
      },
    ],
  },
  {
    value: "钢材",
    label: "钢材",
    children: [
      {
        value: "热轧卷板",
        label: "热轧卷板",
        children: [{ value: "Q235B-3.5*1500*C", label: "Q235B-3.5*1500*C" }],
      },
    ],
  },
  {
    value: "铝锭",
    label: "铝锭",
    children: [
      {
        value: "铝锭",
        label: "铝锭",
        children: [{ value: "AL99.70", label: "AL99.70" }],
      },
    ],
  },
]

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
