import type {
  CollateralWarningEvent,
  CollateralWarningFilters,
  WarningStatus,
} from "../domain/types"
import { mapStatusFilterToValue } from "../domain/status"

/** 列表排序：未结案（待处置 · 有效）优先，同状态内按预警时间倒序 */
const WARNING_STATUS_SORT_PRIORITY: Record<WarningStatus, number> = {
  OPEN_VALID: 0,
  OPEN_INVALID: 1,
  CLOSED_VALID: 2,
}

function compareByStatusThenTime(
  a: CollateralWarningEvent,
  b: CollateralWarningEvent
): number {
  const statusDiff =
    WARNING_STATUS_SORT_PRIORITY[a.warningStatus] -
    WARNING_STATUS_SORT_PRIORITY[b.warningStatus]
  if (statusDiff !== 0) {
    return statusDiff
  }

  return (
    new Date(b.warningTime.replace(" ", "T")).getTime() -
    new Date(a.warningTime.replace(" ", "T")).getTime()
  )
}

export function filterCollateralWarningEvents(
  events: CollateralWarningEvent[],
  filters: CollateralWarningFilters
): CollateralWarningEvent[] {
  const statusValue = mapStatusFilterToValue(filters.warningStatus)
  const keyword = filters.keyword.trim().toLowerCase()

  return events
    .filter((event) => {
      if (keyword && !event.orderNo.toLowerCase().includes(keyword)) {
        return false
      }

      if (
        filters.warningTypes.length > 0 &&
        !filters.warningTypes.includes(event.warningType)
      ) {
        return false
      }

      if (
        filters.severityLevelIds.length > 0 &&
        !filters.severityLevelIds.includes(event.severityLevelId)
      ) {
        return false
      }

      if (
        filters.warningSource !== "全部" &&
        event.warningSource !== filters.warningSource
      ) {
        return false
      }

      if (statusValue !== "ALL" && event.warningStatus !== statusValue) {
        return false
      }

      if (
        filters.publicityStatus !== "全部" &&
        event.publicityStatus !== filters.publicityStatus
      ) {
        return false
      }

      if (filters.warningTimeStart) {
        const start = new Date(`${filters.warningTimeStart}T00:00:00`)
        const eventTime = new Date(event.warningTime.replace(" ", "T"))
        if (eventTime < start) {
          return false
        }
      }

      if (filters.warningTimeEnd) {
        const end = new Date(`${filters.warningTimeEnd}T23:59:59`)
        const eventTime = new Date(event.warningTime.replace(" ", "T"))
        if (eventTime > end) {
          return false
        }
      }

      return true
    })
    .sort(compareByStatusThenTime)
}

export function hasBatchPublishCandidates(
  events: CollateralWarningEvent[]
): boolean {
  return events.some(
    (event) =>
      event.warningStatus === "CLOSED_VALID" && event.publicityStatus === "未公示"
  )
}
