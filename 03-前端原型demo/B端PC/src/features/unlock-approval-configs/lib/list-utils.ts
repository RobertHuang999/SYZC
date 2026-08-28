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
      if (filters.scopeType === "全部") return true
      return config.scopeType === filters.scopeType
    })
    .filter((config) => {
      if (filters.approvalMode === "全部") return true
      return config.approvalMode === filters.approvalMode
    })
    .filter((config) => {
      if (filters.status === "全部") return true
      return config.status === filters.status
    })
    .filter((config) => {
      if (!filters.configNo.trim()) return true
      return config.configNo === filters.configNo.trim()
    })
    .filter((config) => {
      if (filters.warehouseName === "全部") return true
      return config.warehouseName === filters.warehouseName
    })
    .filter((config) => {
      if (filters.globalSwitch === "全部") return true
      return config.globalSwitch === filters.globalSwitch
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
