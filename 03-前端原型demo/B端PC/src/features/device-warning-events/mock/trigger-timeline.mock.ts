import type { DeviceWarningEvent, TriggerTimelineEntry } from "../domain/types"

const CURATED_TIMELINES: Record<string, TriggerTimelineEntry[]> = {
  "evt-002": [
    {
      sequence: 1,
      triggeredAt: "2026-08-20 12:40:00",
      collectedValue: "行人入侵",
      snapshotAvailable: true,
    },
    {
      sequence: 2,
      triggeredAt: "2026-08-20 12:52:30",
      collectedValue: "行人入侵",
      snapshotAvailable: true,
    },
    {
      sequence: 3,
      triggeredAt: "2026-08-20 13:05:00",
      collectedValue: "行人入侵",
      snapshotAvailable: true,
    },
  ],
}

function parseDateTime(value: string): number {
  return new Date(value.replace(" ", "T")).getTime()
}

function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  const pad = (part: number) => String(part).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function generateTimelineEntries(
  event: DeviceWarningEvent
): TriggerTimelineEntry[] {
  const curated = CURATED_TIMELINES[event.eventId]
  if (curated) {
    return curated
  }

  const count = Math.max(1, event.triggerCount)
  const start = parseDateTime(event.firstWarningTime)
  const end = parseDateTime(event.latestWarningTime || event.firstWarningTime)
  const step = count <= 1 ? 0 : (end - start) / (count - 1)
  const snapshotAvailable = event.snapshotImageStatus === "available"

  return Array.from({ length: count }, (_, index) => ({
    sequence: index + 1,
    triggeredAt: formatDateTime(start + step * index),
    collectedValue: event.triggerSummary,
    snapshotAvailable,
  }))
}

export function getTriggerTimelineMock(
  event: DeviceWarningEvent
): TriggerTimelineEntry[] {
  return generateTimelineEntries(event)
}
