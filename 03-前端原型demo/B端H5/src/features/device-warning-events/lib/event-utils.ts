import type { DeviceWarningEvent, DeviceWarningFilters } from "../domain/types"

export type EventLocationParts = {
  warehouse: string
  locationPath: string
  fullLocation: string
}

/** 仓库为系统引用拼接，位置为用户手动录入 */
export function resolveEventLocationParts(
  event: Pick<DeviceWarningEvent, "warehouseDetail" | "location">
): EventLocationParts {
  const warehouse = event.warehouseDetail
  const locationPath = event.location

  return {
    warehouse,
    locationPath,
    fullLocation: locationPath ? `${warehouse} / ${locationPath}` : warehouse,
  }
}

export function formatWarningContent(event: DeviceWarningEvent): string {
  const { warehouse, locationPath } = resolveEventLocationParts(event)
  return `仓库：${warehouse}；位置：${locationPath}；触发内容：${event.triggerSummary}`
}

export function filterDeviceWarningEvents(
  events: DeviceWarningEvent[],
  filters: DeviceWarningFilters
): DeviceWarningEvent[] {
  const keyword = filters.keyword.trim().toLowerCase()

  return events
    .filter((event) => {
      if (
        keyword &&
        ![
          event.ruleName,
          event.deviceName,
          event.triggerSummary,
          event.deviceCode,
          event.warehouseDetail,
          event.location,
        ].some((value) => value.toLowerCase().includes(keyword))
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
