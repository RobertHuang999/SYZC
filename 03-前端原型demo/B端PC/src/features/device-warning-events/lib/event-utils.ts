import type {
  DeviceWarningEvent,
  DeviceWarningEventFilters,
} from "../domain/types"
import { mapStatusFilterToValue } from "../domain/status"

export function formatWarningContent(event: DeviceWarningEvent): string {
  return `位置：${event.location}；设备：${event.deviceName}；触发内容：${event.triggerSummary}`
}

export function formatWarningTime(value: string): string {
  return value || "—"
}

export function filterDeviceWarningEvents(
  events: DeviceWarningEvent[],
  filters: DeviceWarningEventFilters
): DeviceWarningEvent[] {
  const statusValue = mapStatusFilterToValue(filters.warningStatus)

  return events
    .filter((event) => {
      if (filters.subTypes && filters.subTypes.length > 0) {
        const matchesSubType =
          (event.subType && filters.subTypes.includes(event.subType)) ||
          filters.subTypes.some(
            (sub) =>
              event.triggerSummary.includes(sub) ||
              event.ruleName.includes(sub) ||
              (sub === "温度异常" && event.triggerSummary.includes("℃")) ||
              (sub === "湿度异常" && event.triggerSummary.includes("湿度")) ||
              (sub === "设备离线" && (event.triggerSummary.includes("离线") || event.ruleName.includes("离线"))) ||
              (sub === "正常开关锁事务" && (event.triggerSummary.includes("开锁") || event.triggerSummary.includes("关锁")))
          )
        if (!matchesSubType) {
          return false
        }
      } else if (
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
