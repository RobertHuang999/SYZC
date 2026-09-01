import type {
  UnlockApprovalConfig,
  UnlockApprovalConfigFilters,
} from "../domain/types"

export function filterUnlockApprovalConfigs(
  configs: UnlockApprovalConfig[],
  filters: UnlockApprovalConfigFilters
): UnlockApprovalConfig[] {
  return configs
    .filter((config) => {
      if (!filters.configName.trim()) return true
      return config.configName.includes(filters.configName.trim())
    })
    .filter((config) => {
      if (filters.status === "全部") return true
      return config.status === filters.status
    })
    .filter((config) => {
      if (!filters.configNo.trim()) return true
      return config.configNo === filters.configNo.trim()
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

export function formatTimeoutHours(hours: number): string {
  return `${hours} 小时`
}

export function formatConfigVersion(version: number): string {
  return `v${version}`
}
