import type { DeviceWarningEvent } from "./types"
import { WARNING_STATUS } from "./status"

export type RowAction = "release" | "detail"

export type DetailHeaderAction = "back" | "release" | "frequency"

export function canManualRelease(event: DeviceWarningEvent): boolean {
  if (event.warningStatus !== WARNING_STATUS.OPEN_VALID) {
    return false
  }

  const summary = event.triggerSummary

  if (event.warningType === "设备物联预警" && summary.includes("离线")) {
    return true
  }

  // 非物联离线、数值恢复类和 GPS 类预警只能自动解除。
  if (summary.includes("离线") || event.warningType === "设备GPS预警") {
    return false
  }

  if (event.warningType === "设备图像识别预警") {
    return true
  }

  if (
    summary.includes("入侵") ||
    summary.includes("破坏") ||
    summary.includes("撬锁") ||
    summary.includes("拆壳") ||
    summary.includes("剪杆") ||
    summary.includes("非法开箱") ||
    summary.includes("超时")
  ) {
    return true
  }

  if (
    event.warningType === "设备物联预警" &&
    (summary.includes("℃") ||
      summary.includes("湿度") ||
      summary.includes("烟感"))
  ) {
    return false
  }

  if (event.warningType === "智能挂锁预警") {
    return (
      summary.includes("破坏") ||
      summary.includes("撬锁") ||
      summary.includes("拆壳") ||
      summary.includes("剪杆") ||
      summary.includes("非法开箱")
    )
  }

  if (event.warningType === "人脸门禁预警") {
    return summary.includes("超时") || summary.includes("失败")
  }

  return false
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
