import type { SeverityLevelFilters } from "./types"

export const DEFAULT_SEVERITY_LEVEL_FILTERS: SeverityLevelFilters = {
  enabled: "全部",
}

export const ENABLED_FILTER_OPTIONS = ["全部", "是", "否"] as const

export const DEFAULT_LABEL_COLOR = "#409EFF"

export const SYNC_TO_ORDER_WARNING_TOOLTIP =
  "开启后：设备告警且仓库有在押订单时，订单侧同步生成预警并通知。关闭后：仅保留设备侧告警。不锁定出库、不触发业务熔断。"
