import type { AccessDeviceFilters } from "./types"

export const PAGE_SIZE = 10

export const WAREHOUSE_OPTIONS = [
  "全部",
  "华东一号仓",
  "华南二号仓",
  "华北三号仓",
] as const

export const REASON_OPTIONS = ["出库", "入库", "移库", "参观", "其他"] as const

export const DEFAULT_ACCESS_DEVICE_FILTERS: AccessDeviceFilters = {
  displayName: "",
  deviceType: "全部",
  status: "全部",
  warehouseName: "全部",
  bindStatus: "全部",
  updatedFrom: "",
  updatedTo: "",
}
