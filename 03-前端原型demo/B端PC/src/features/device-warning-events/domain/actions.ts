import type { DeviceWarningEvent } from "./types"
import { WARNING_STATUS } from "./status"

export type RowAction = "release" | "detail"

export type DetailHeaderAction = "back" | "release"

export function canManualRelease(event: DeviceWarningEvent): boolean {
  if (event.warningStatus !== WARNING_STATUS.OPEN_VALID) {
    return false
  }

  return event.manualReleaseAllowed
}

export function canSelectForBatchRelease(event: DeviceWarningEvent): boolean {
  return canManualRelease(event)
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
  const actions: DetailHeaderAction[] = ["back"]

  if (canManualRelease(event)) {
    actions.push("release")
  }

  return actions
}

export const RELEASE_CONFIRM_MESSAGE =
  "确认解除该条预警？提交后状态将变为「已结案 · 有效」，并同步取消相关升级任务。"

export const BATCH_RELEASE_CONFIRM_MESSAGE =
  "确认批量解除所选预警？提交后每条记录独立归档为「已结案 · 有效」，并同步取消相关升级任务。"
