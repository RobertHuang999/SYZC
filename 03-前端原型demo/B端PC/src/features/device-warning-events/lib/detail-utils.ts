import type { DeviceWarningEventDetail } from "../domain/types"
import { getDeviceWarningEventDetailExtension } from "../mock/device-warning-event-details.mock"
import { deviceWarningEventsMock } from "../mock/device-warning-events.mock"

export function getDeviceWarningEventById(
  eventId: string | undefined
): DeviceWarningEventDetail | null {
  if (!eventId) {
    return null
  }

  let event = deviceWarningEventsMock.find((item) => item.eventId === eventId)
  if (!event && eventId.startsWith("dev-evt-")) {
    event = deviceWarningEventsMock.find((item) => item.eventId === "evt-017") ?? deviceWarningEventsMock[0]
  }
  if (!event) {
    return null
  }

  return {
    ...event,
    ...getDeviceWarningEventDetailExtension(event),
  }
}

export function formatDetailWarningContent(event: DeviceWarningEventDetail): string {
  return `位置：${event.warehouseDetail}；设备：${event.deviceName}(${event.deviceCode})；触发：${event.triggerSummary}`
}

export function formatEmptyValue(value: string | null | undefined): string {
  if (!value) {
    return "—"
  }
  return value
}
