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
        ![event.ruleName, event.deviceName, event.warningContent, event.deviceCode].some(
          (value) => value.toLowerCase().includes(keyword)
        )
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
        filters.subTypes &&
        filters.subTypes.length > 0 &&
        !filters.subTypes.includes(event.warningSubType)
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
        filters.warningStatus !== "全部" &&
        event.warningStatus !== filters.warningStatus
      ) {
        return false
      }
      if (
        filters.warehouseName !== "全部" &&
        event.warehouseName !== filters.warehouseName
      ) {
        return false
      }

      const warningDate = event.warningTime.slice(0, 10)
      if (
        warningDate < filters.warningTimeStart ||
        warningDate > filters.warningTimeEnd
      ) {
        return false
      }
      return true
    })
    .sort(
      (a, b) =>
        new Date(b.warningTime.replace(" ", "T")).getTime() -
        new Date(a.warningTime.replace(" ", "T")).getTime()
    )
}
