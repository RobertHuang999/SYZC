import type { DeviceWarningEvent, TriggerTimelineEntry } from "../domain/types"
import { getDeviceWarningEventById } from "./detail-utils"
import { getTriggerTimelineMock } from "../mock/trigger-timeline.mock"

export function getTriggerTimelineForEvent(
  event: DeviceWarningEvent
): TriggerTimelineEntry[] {
  return getTriggerTimelineMock(event)
}

export function getTriggerTimelineByEventId(
  eventId: string | undefined
): TriggerTimelineEntry[] {
  const event = getDeviceWarningEventById(eventId)
  if (!event) {
    return []
  }

  return getTriggerTimelineForEvent(event)
}
