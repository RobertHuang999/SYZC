import type {
  DeviceWarningConfig,
  DeviceWarningConfigFilters,
} from "../domain/types"

export function filterDeviceWarningConfigs(
  configs: DeviceWarningConfig[],
  filters: DeviceWarningConfigFilters
): DeviceWarningConfig[] {
  return configs
    .filter((config) => {
      if (!filters.ruleName.trim()) {
        return true
      }
      return config.ruleName.includes(filters.ruleName.trim())
    })
    .filter((config) => {
      if (filters.warningTypes.length === 0) {
        return true
      }
      return filters.warningTypes.includes(config.warningType)
    })
    .filter((config) => {
      if (filters.severityLevelIds.length === 0) {
        return true
      }
      return filters.severityLevelIds.includes(config.severityLevelId)
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

export function formatPersonTime(person: string, time: string): string {
  return `${person}/${time}`
}
