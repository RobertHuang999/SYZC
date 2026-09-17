import type { CollateralWarningEvent } from "../domain/types"

export const COLLATERAL_WARNING_LIST_PATH =
  "/物联网IOT与预警/预警信息/押品预警信息"

export function getCollateralWarningDetailPath(warnId: string): string {
  return `${COLLATERAL_WARNING_LIST_PATH}/详情/${warnId}`
}

export function getPublishConfirmPath(warnId: string): string {
  return `${COLLATERAL_WARNING_LIST_PATH}/公示确认/${warnId}`
}

export function getPublishDetailPath(warnId: string): string {
  return `${COLLATERAL_WARNING_LIST_PATH}/公示详情/${warnId}`
}

export function getRepublishConfirmPath(warnId: string): string {
  return getPublishConfirmPath(warnId)
}

export function getBatchPublishConfirmPath(): string {
  return `${COLLATERAL_WARNING_LIST_PATH}/批量公示确认`
}

export function resolvePublishNavigation(event: CollateralWarningEvent): {
  type: "confirm" | "detail"
  path: string
} {
  if (event.publicityStatus === "已公示" || event.publicityStatus === "已取消") {
    return {
      type: "detail",
      path: getPublishDetailPath(event.eventId),
    }
  }

  return {
    type: "confirm",
    path: getPublishConfirmPath(event.eventId),
  }
}
