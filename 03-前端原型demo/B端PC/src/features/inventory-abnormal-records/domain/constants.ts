/**
 * 货物异动 - 常量与枚举配置
 */
import type { AbnormalRecordFilters, AbnormalOrderTypeLabel, AbnormalTypeLabel } from "./types"

export const ABNORMAL_RECORD_LIST_PATH = "/仓储/货物异动/异动记录"
export const ABNORMAL_RECORD_ADD_PATH = "/仓储/货物异动/异动记录/新增"
export const abnormalRecordDetailPath = (id: string) => `/仓储/货物异动/异动记录/详情/${encodeURIComponent(id)}`

export const PAGE_SIZE = 10

export const DEFAULT_ABNORMAL_RECORD_FILTERS: AbnormalRecordFilters = {
  abnormalNo: "",
  relateNo: "",
  orderTypes: [],
  ownerKeyword: "",
  abnormalTypes: [],
  warehouseCascade: [],
  goodsKeyword: "",
  dateRange: {
    startDate: "",
    endDate: "",
  },
}

export const ORDER_TYPE_OPTIONS: AbnormalOrderTypeLabel[] = [
  "质押单",
  "抵押单",
  "监管业务单",
  "存货单",
]

export const ABNORMAL_TYPE_OPTIONS: AbnormalTypeLabel[] = [
  "盘盈",
  "盘亏",
  "损耗",
  "其他",
]

export const WAREHOUSE_OPTIONS = [
  {
    value: "海霸王仓库",
    label: "海霸王仓库",
    children: [
      { value: "冻库1审核", label: "冻库1审核" },
      { value: "库房（不审核）", label: "库房（不审核）" },
    ],
  },
  {
    value: "生鲜仓库",
    label: "生鲜仓库",
    children: [
      { value: "水果库房2", label: "水果库房2" },
      { value: "水果库房不审核", label: "水果库房不审核" },
    ],
  },
]

