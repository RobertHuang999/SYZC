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
    <span
      className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${WARNING_STATUS_BADGE_CLASS[event.warningStatus]}`}
    >
      {WARNING_STATUS_LABELS[event.warningStatus]}
    </span>
  )
}
