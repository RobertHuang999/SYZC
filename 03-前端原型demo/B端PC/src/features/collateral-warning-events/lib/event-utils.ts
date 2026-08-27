import type {
  CollateralWarningEvent,
  CollateralWarningFilters,
} from "../domain/types"
import { mapStatusFilterToValue } from "../domain/status"

export function filterCollateralWarningEvents(
  events: CollateralWarningEvent[],
  filters: CollateralWarningFilters
): CollateralWarningEvent[] {
  const statusValue = mapStatusFilterToValue(filters.warningStatus)

  return events
    .filter((event) => {
      if (
        filters.orderNo.trim() &&
        !event.orderNo.toLowerCase().includes(filters.orderNo.trim().toLowerCase())
      ) {
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
    .sort(
      (a, b) =>
        new Date(b.warningTime.replace(" ", "T")).getTime() -
        new Date(a.warningTime.replace(" ", "T")).getTime()
    )
}

export function paginateEvents<T>(
  events: T[],
  page: number,
  pageSize: number
): T[] {
  const start = (page - 1) * pageSize
  return events.slice(start, start + pageSize)
}

export function hasBatchPublishCandidates(
  events: CollateralWarningEvent[]
): boolean {
  return events.some(
    (event) =>
      event.warningStatus === "CLOSED_VALID" && event.publicityStatus === "未公示"
  )
}
