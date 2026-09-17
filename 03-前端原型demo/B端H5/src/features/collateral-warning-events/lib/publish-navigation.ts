import type { CollateralWarningEvent } from "../domain/types"

export const COLLATERAL_WARNING_LIST_PATH = "/m/supervision/order-warnings"

export function getCollateralWarningDetailPath(warnId: string): string {
  return `${COLLATERAL_WARNING_LIST_PATH}/${warnId}`
}

export function getPublishConfirmPath(warnId: string): string {
  return `${COLLATERAL_WARNING_LIST_PATH}/${warnId}/publish`
}

export function getPublishDetailPath(warnId: string): string {
  return `${COLLATERAL_WARNING_LIST_PATH}/${warnId}/disclosure`
}

export function getRepublishConfirmPath(warnId: string): string {
  return getPublishConfirmPath(warnId)
}

export function getBatchPublishConfirmPath(): string {
  return `${COLLATERAL_WARNING_LIST_PATH}/batch-publish`
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
