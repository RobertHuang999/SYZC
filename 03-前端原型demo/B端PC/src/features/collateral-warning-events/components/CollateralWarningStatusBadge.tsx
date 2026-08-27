import { Badge } from "@/components/ui/badge"
import {
  WARNING_STATUS_BADGE_CLASS,
  WARNING_STATUS_LABELS,
} from "../domain/status"
import type { CollateralWarningEvent } from "../domain/types"

type CollateralWarningStatusBadgeProps = {
  event: Pick<CollateralWarningEvent, "warningStatus">
}

export function CollateralWarningStatusBadge({
  event,
}: CollateralWarningStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={WARNING_STATUS_BADGE_CLASS[event.warningStatus]}
    >
      {WARNING_STATUS_LABELS[event.warningStatus]}
    </Badge>
  )
}
