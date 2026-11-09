import type { TransferRecordFilters } from "./types"

export const TRANSFER_RECORD_LIST_PATH = "/仓储/货物转让/转让记录"
export const TRANSFER_RECORD_ADD_PATH = "/仓储/货物转让/转让记录/新增"

export const transferRecordDetailPath = (id: string) =>
  `/仓储/货物转让/转让记录/详情/${encodeURIComponent(id)}`

/** 默认 7 项检索条件（无类型，无状态） */
export const DEFAULT_TRANSFER_FILTERS: TransferRecordFilters = {
  id: "",
  assignStartDate: "",
  assignEndDate: "",
  keyword: "",
  warehouseId: "ALL",
  goodsName: "ALL",
  createBy: "ALL",
  createStartDate: "",
  createEndDate: "",
}

export const WAREHOUSE_OPTIONS = [
  { value: "ALL", label: "全部仓库" },
  { value: "WH-HBW", label: "海霸王仓库" },
  { value: "WH-GL", label: "干粮仓库" },
  { value: "WH-SX", label: "生鲜仓库" },
  { value: "WH-GT", label: "钢铁物流园仓库" },
  { value: "WH-YS", label: "有色金属监管仓" },
]

export const GOODS_OPTIONS = [
  { value: "ALL", label: "全部货品" },
  { value: "G-APPLE", label: "水果-苹果-新疆-特级" },
  { value: "G-BANANA", label: "水果-香蕉-海南-1斤" },
  { value: "G-WATERMELON", label: "水果-西瓜-二级-云南" },
  { value: "G-BEEF", label: "冻货-牛肉-36个月" },
  { value: "G-STEEL", label: "热轧卷板-Q235B" },
  { value: "G-COPPER", label: "高纯阴极铜-A级" },
]

export const CREATOR_OPTIONS = [
  { value: "ALL", label: "全部制单人" },
  { value: "lxyl", label: "lxyl(四川享宇科技有限公司)" },
  { value: "admin", label: "admin(系统管理部)" },
  { value: "operator1", label: "operator1(海霸王监管组)" },
  { value: "chen-wh", label: "陈主管(物流监管中心)" },
]

export const PAGE_SIZE = 10
