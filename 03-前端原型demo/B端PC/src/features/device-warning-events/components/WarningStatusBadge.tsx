import { Badge } from "@/components/ui/badge"
import {
  getWarningStatusLabel,
  WARNING_STATUS_BADGE_CLASS,
} from "../domain/status"
import type { DeviceWarningEvent } from "../domain/types"

type WarningStatusBadgeProps = {
  event: Pick<DeviceWarningEvent, "warningStatus" | "warningType">
}

export function WarningStatusBadge({ event }: WarningStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={WARNING_STATUS_BADGE_CLASS[event.warningStatus]}
    >
      {getWarningStatusLabel(event.warningStatus, event.warningType)}
    </Badge>
  )
}
