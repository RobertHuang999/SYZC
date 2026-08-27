import type { DeviceWarningEvent } from "../domain/types"

type SeverityLevelDisplayProps = {
  event: Pick<DeviceWarningEvent, "severityCode" | "severityName" | "severityColor">
}

export function SeverityLevelDisplay({ event }: SeverityLevelDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block size-2.5 rounded-full"
        style={{ backgroundColor: event.severityColor }}
      />
      <span>
        {event.severityCode} {event.severityName}
      </span>
    </div>
  )
}
