import type { MovingFlowTypeValue, MovingRecordType } from "./types"

/* ---------------- 移库记录（工作台 · 移库管理） ---------------- */

export const H5_MOVING_RECORD_LIST_PATH = "/m/workspace/moving-records"
export const WORKSPACE_ROUTE = "/m/workspace"

export const h5MovingRecordDetailPath = (id: string) =>
  `/m/workspace/moving-records/${encodeURIComponent(id)}`

/** 移库发起页可选的类型（仓单移库须回仓单管理操作，不作为发起选项） */
export const MOVING_FLOW_TYPES: Array<{
  id: MovingFlowTypeValue
  name: string
}> = [
  { id: "NORMAL", name: "普通移库" },
  { id: "PLEDGE", name: "质押移库" },
  { id: "MORTGAGE", name: "抵押移库" },
  { id: "CD", name: "仓单移库" },
]

/** 台账筛选的移库类型（含「仓单移库」，与 PC 字段清单一一致） */
export const MOVING_RECORD_TYPE_FILTER_OPTIONS: Array<{
  label: string
  value: MovingRecordType | "全部"
}> = [
  { label: "全部类型", value: "全部" },
  { label: "普通移库", value: "普通移库" },
  { label: "质押移库", value: "质押移库" },
  { label: "抵押移库", value: "抵押移库" },
  { label: "仓单移库", value: "仓单移库" },
]

/* ---------------- 货物转让（工作台 · 货物转让） ---------------- */

export const H5_TRANSFER_RECORD_LIST_PATH = "/m/workspace/transfer-records"

export const h5TransferRecordDetailPath = (id: string) =>
  `/m/workspace/transfer-records/${encodeURIComponent(id)}`

export const H5_WAREHOUSE_OPTIONS = [
  { label: "全部仓库", value: "ALL" },
  { label: "海霸王仓库", value: "海霸王仓库" },
  { label: "干粮仓库", value: "干粮仓库" },
  { label: "生鲜仓库", value: "生鲜仓库" },
  { label: "钢铁物流园仓库", value: "钢铁物流园仓库" },
  { label: "有色金属监管仓", value: "有色金属监管仓" },
]

export const H5_GOODS_OPTIONS = [
  { label: "全部货品", value: "ALL" },
  { label: "水果-苹果-新疆-特级", value: "水果-苹果-新疆-特级" },
  { label: "水果-香蕉-海南-1斤", value: "水果-香蕉-海南-1斤" },
  { label: "水果-西瓜-二级-云南", value: "水果-西瓜-二级-云南" },
  { label: "冻货-牛肉-36个月", value: "冻货-牛肉-36个月" },
  { label: "热轧卷板-Q235B", value: "热轧卷板-Q235B" },
  { label: "高纯阴极铜-A级", value: "高纯阴极铜-A级" },
]

export const H5_CREATOR_OPTIONS = [
  { label: "全部制单人", value: "ALL" },
  { label: "lxyl（四川享宇科技有限公司）", value: "lxyl" },
  { label: "admin（系统管理部）", value: "admin" },
  { label: "operator1（海霸王监管组）", value: "operator1" },
  { label: "陈主管（物流监管中心）", value: "陈主管" },
]
