import type {
  OrderWarningConfig,
  OrderWarningConfigFilters,
} from "../domain/types"

export function filterOrderWarningConfigs(
  configs: OrderWarningConfig[],
  filters: OrderWarningConfigFilters
): OrderWarningConfig[] {
  return configs
    .filter((config) => {
      if (!filters.ruleName.trim()) {
        return true
      }
      return config.ruleName.includes(filters.ruleName.trim())
    })
    .filter((config) => {
      if (!filters.orderNo.trim()) {
        return true
      }
      return config.orderNo.includes(filters.orderNo.trim())
    })
    .filter((config) => {
      if (filters.orderType === "全部") {
        return true
      }
      return config.orderType === filters.orderType
    })
    .filter((config) => {
      if (filters.enabledItems.length === 0) {
        return true
      }
      return config.enabledItems.some((item) => filters.enabledItems.includes(item.type))
    })
    .filter((config) => {
      if (filters.status === "全部") {
        return true
      }
      return config.status === filters.status
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function paginateConfigs<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}
