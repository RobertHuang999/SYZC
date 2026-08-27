import type { SeverityLevelFilters, SeverityLevelRecord } from "../domain/types"

export function filterSeverityLevels(
  records: SeverityLevelRecord[],
  filters: SeverityLevelFilters
): SeverityLevelRecord[] {
  return records.filter((record) => {
    if (filters.enabled === "是" && !record.enabled) {
      return false
    }
    if (filters.enabled === "否" && record.enabled) {
      return false
    }
    return true
  })
}
