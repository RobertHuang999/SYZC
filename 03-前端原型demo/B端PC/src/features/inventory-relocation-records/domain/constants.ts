import type { RelocationFilters, RelocationType } from "./types"

export const RELOCATION_LIST_PATH = "/仓储/移库管理/移库记录"
export const RELOCATION_FORM_PATH = "/仓储/移库管理/移库记录/新增"
export const relocationDetailPath = (id: string) =>
  `/仓储/移库管理/移库记录/详情/${id}`

export const PAGE_SIZE = 10

/** 移库类型：仓单移库按业务规则置灰，引导去仓单管理操作 */
export const RELOCATION_TYPE_OPTIONS: Array<{
  value: RelocationType
  label: string
  disabled?: boolean
  hint?: string
}> = [
  { value: "普通移库", label: "普通移库" },
  { value: "质押移库", label: "质押移库" },
  { value: "抵押移库", label: "抵押移库" },
]

export const RELOCATION_TYPE_FILTER_OPTIONS = [
  { value: "ALL", label: "全部类型" },
  { value: "普通移库", label: "普通移库" },
  { value: "质押移库", label: "质押移库" },
  { value: "抵押移库", label: "抵押移库" },
  { value: "仓单移库", label: "仓单移库" },
]

export const WAREHOUSE_OPTIONS = [
  { value: "ALL", label: "全部仓库" },
  { value: "青白江大宗商品监管1号仓", label: "青白江大宗商品监管1号仓" },
  { value: "海霸王仓库", label: "海霸王仓库" },
  { value: "生鲜仓库", label: "生鲜仓库" },
]

export const GOODS_OPTIONS = [
  { value: "ALL", label: "全部货品" },
  { value: "有色金属-电解铜-国标", label: "有色金属-电解铜-国标" },
  { value: "黑色金属-热轧卷板-Q235", label: "黑色金属-热轧卷板-Q235" },
  { value: "橡胶-天然橡胶-STR20", label: "橡胶-天然橡胶-STR20" },
  { value: "水果-西瓜-超级-宁夏", label: "水果-西瓜-超级-宁夏" },
]

export const CREATOR_OPTIONS = [
  { value: "ALL", label: "全部制单人" },
  { value: "lxy", label: "lxy" },
  { value: "李晓云", label: "李晓云" },
]

export const OWNER_OPTIONS: Array<{
  id: string
  type: "企业" | "个人"
  name: string
  identifier: string
}> = [
  {
    id: "OWN-01",
    type: "企业",
    name: "四川华西大宗商品供应链管理有限公司",
    identifier: "91510100MA6XXXXXX1",
  },
  {
    id: "OWN-02",
    type: "企业",
    name: "四川建龙物资有限公司",
    identifier: "91510100MA6XXXXXXX",
  },
  {
    id: "OWN-03",
    type: "个人",
    name: "原原李",
    identifier: "185****7112",
  },
]

export const ROOM_ZONE_OPTIONS = [
  "1号金属库房-A区重载区",
  "1号金属库房-B区",
  "2号库房-常温区",
  "水果库房-西瓜分区",
  "冷冻库房-冻货分区",
]

export const DEFAULT_RELOCATION_FILTERS: RelocationFilters = {
  id: "",
  moveStartDate: "",
  moveEndDate: "",
  ownerKeyword: "",
  moveType: "ALL",
  warehouseName: "ALL",
  goodsName: "ALL",
  createBy: "ALL",
  createStartDate: "",
  createEndDate: "",
}
