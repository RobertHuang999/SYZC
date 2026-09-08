import type { DeviceWarningEvent } from "./types"
import { WARNING_STATUS } from "./status"

export type RowAction = "release" | "detail"

export type DetailHeaderAction = "back" | "release" | "frequency"

export function canManualRelease(event: DeviceWarningEvent): boolean {
  if (event.warningStatus !== WARNING_STATUS.OPEN_VALID) {
    return false
  }

  return event.manualReleaseAllowed
}

export function getRowActions(event: DeviceWarningEvent): RowAction[] {
  const actions: RowAction[] = ["detail"]

  if (canManualRelease(event)) {
    actions.unshift("release")
  }

  return actions
}

export function getDetailHeaderActions(
  event: DeviceWarningEvent
): DetailHeaderAction[] {
  const actions: DetailHeaderAction[] = ["back", "frequency"]

  if (canManualRelease(event)) {
    actions.splice(1, 0, "release")
  }

  return actions
}

export const RELEASE_CONFIRM_MESSAGE =
  "确认解除该轮次告警？提交后将归档整轮 N 次触发。"
