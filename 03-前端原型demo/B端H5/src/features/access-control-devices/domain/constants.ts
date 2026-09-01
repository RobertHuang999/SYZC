import type { AccessDeviceFilters } from "./types"

export const REASON_OPTIONS = ["出库", "入库", "移库", "参观", "其他"] as const

export const WAREHOUSE_OPTIONS = [
  "全部",
  "华东一号仓",
  "华南二号仓",
  "华北三号仓",
] as const

export const DEFAULT_ACCESS_DEVICE_FILTERS: AccessDeviceFilters = {
  keyword: "",
  deviceType: "全部",
  status: "全部",
  warehouseName: "全部",
  bindStatus: "全部",
}

export const LIST_PATH = "/m/access-control-devices"
export const DEVICE_MANAGEMENT_PATH = "/m/device-management"
export const ACCESS_DEVICE_FILTER_STORAGE_KEY = "SYZC_H5_ACCESS_DEVICE_FILTERS"

export function loadCachedAccessDeviceFilters(): AccessDeviceFilters {
  try {
    const raw = sessionStorage.getItem(ACCESS_DEVICE_FILTER_STORAGE_KEY)
    if (raw) return { ...DEFAULT_ACCESS_DEVICE_FILTERS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_ACCESS_DEVICE_FILTERS
}

export function saveCachedAccessDeviceFilters(filters: AccessDeviceFilters) {
  try {
    sessionStorage.setItem(ACCESS_DEVICE_FILTER_STORAGE_KEY, JSON.stringify(filters))
  } catch {}
}
