import type {
  CollateralDetailHeaderAction,
  CollateralRowAction,
  CollateralWarningEvent,
} from "./types"
import { WARNING_STATUS } from "./types"

export function getRowActions(event: CollateralWarningEvent): CollateralRowAction[] {
  const actions: CollateralRowAction[] = ["detail"]

  if (event.warningStatus === WARNING_STATUS.OPEN_VALID) {
    if (event.warningSource === "物联穿透" || event.deviceEventId) {
      actions.unshift("viewDevice")
    } else {
      actions.unshift("release")
    }
    return actions
  }

  if (
    event.warningStatus === WARNING_STATUS.CLOSED_VALID &&
    event.publicityStatus === "未公示"
  ) {
    actions.unshift("publish")
  }

  return actions
}

export function getDetailHeaderActions(
  event: CollateralWarningEvent
): CollateralDetailHeaderAction[] {
  const actions: CollateralDetailHeaderAction[] = ["back"]

  if (event.warningStatus === WARNING_STATUS.OPEN_VALID) {
    if (event.warningSource === "物联穿透" || event.deviceEventId) {
      actions.push("viewDevice")
    } else {
      actions.push("release")
    }
    return actions
  }

  if (
    event.warningStatus === WARNING_STATUS.CLOSED_VALID &&
    event.publicityStatus === "未公示"
  ) {
    actions.push("publish")
  }

  return actions
}

export function canBatchSelect(event: CollateralWarningEvent): boolean {
  return (
    event.warningStatus === WARNING_STATUS.CLOSED_VALID &&
    event.publicityStatus === "未公示"
  )
}
