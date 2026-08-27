import type {
  DeviceWarningEvent,
  DeviceWarningEventFilters,
} from "../domain/types"
import { mapStatusFilterToValue } from "../domain/status"

export function formatWarningContent(event: DeviceWarningEvent): string {
  return `位置：${event.location}；设备：${event.deviceName}；触发内容：${event.triggerSummary}`
}

export function formatLatestWarningTime(value: string): string {
  const [date, time] = value.split(" ")
  if (!date || !time) {
    return value
  }

  const [, month, day] = date.split("-")
  return `${month}-${day} ${time.slice(0, 5)}`
}

export function filterDeviceWarningEvents(
  events: DeviceWarningEvent[],
  filters: DeviceWarningEventFilters
): DeviceWarningEvent[] {
  const statusValue = mapStatusFilterToValue(filters.warningStatus)

  return events
    .filter((event) => {
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

      if (statusValue !== "ALL" && event.warningStatus !== statusValue) {
        return false
      }

      if (
        filters.warehouseName !== "全部" &&
        event.warehouseName !== filters.warehouseName
      ) {
        return false
      }

      if (
        filters.triggerFrequency === "高频（>5 次）" &&
        event.triggerCount <= 5
      ) {
        return false
      }

      if (filters.firstWarningTimeStart) {
        const start = new Date(`${filters.firstWarningTimeStart}T00:00:00`)
        const eventTime = new Date(event.firstWarningTime.replace(" ", "T"))
        if (eventTime < start) {
          return false
        }
      }

      if (filters.firstWarningTimeEnd) {
        const end = new Date(`${filters.firstWarningTimeEnd}T23:59:59`)
        const eventTime = new Date(event.firstWarningTime.replace(" ", "T"))
        if (eventTime > end) {
          return false
        }
      }

      return true
    })
    .sort(
      (a, b) =>
        new Date(b.latestWarningTime.replace(" ", "T")).getTime() -
        new Date(a.latestWarningTime.replace(" ", "T")).getTime()
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
