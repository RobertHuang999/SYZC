import type { DeviceWarningEvent, DeviceWarningFilters } from "../domain/types"

export function filterDeviceWarningEvents(
  events: DeviceWarningEvent[],
  filters: DeviceWarningFilters
): DeviceWarningEvent[] {
  const keyword = filters.keyword.trim().toLowerCase()

  return events
    .filter((event) => {
      if (
        keyword &&
        ![event.ruleName, event.deviceName, event.warningContent].some((value) =>
          value.toLowerCase().includes(keyword)
        )
      ) return false
      if (
        filters.warningTypes.length > 0 &&
        !filters.warningTypes.includes(event.warningType)
      ) return false
      if (
        filters.severityLevelIds.length > 0 &&
        !filters.severityLevelIds.includes(event.severityLevelId)
      ) return false
      if (
        filters.warningStatus !== "全部" &&
        event.warningStatus !== filters.warningStatus
      ) return false
      if (
        filters.warehouseName !== "全部" &&
        event.warehouseName !== filters.warehouseName
      ) return false
      if (
        filters.triggerFrequency === "高频（>5 次）" &&
        event.triggerCount <= 5
      ) return false

      const first = event.firstWarningTime.slice(0, 10)
      if (first < filters.firstWarningTimeStart || first > filters.firstWarningTimeEnd) {
        return false
      }
      return true
    })
    .sort(
      (a, b) =>
        new Date(b.latestWarningTime.replace(" ", "T")).getTime() -
        new Date(a.latestWarningTime.replace(" ", "T")).getTime()
    )
}
