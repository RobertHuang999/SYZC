import type {
  CollateralDetailHeaderAction,
  CollateralRowAction,
  CollateralWarningEvent,
} from "./types"
import { WARNING_STATUS } from "./types"

function isReadOnlyHistoricalEvent(event: CollateralWarningEvent): boolean {
  return event.warningSource === "历史"
}

export function hasDisclosureHistory(event: CollateralWarningEvent): boolean {
  return event.publicityStatus === "已公示" || event.publicityStatus === "已取消"
}

export function getPublishActionLabel(event: CollateralWarningEvent): string {
  return hasDisclosureHistory(event) ? "查看公示" : "公示风险"
}

function canShowPublishAction(event: CollateralWarningEvent): boolean {
  if (event.orderType === "监管服务") {
    return false
  }
  return true
}

export function getRowActions(event: CollateralWarningEvent): CollateralRowAction[] {
  const actions: CollateralRowAction[] = ["detail"]

  if (isReadOnlyHistoricalEvent(event)) {
    return actions
  }

  if (event.warningStatus === WARNING_STATUS.OPEN_VALID) {
    if (event.warningType === "物联穿透告警") {
      actions.unshift("viewDevice")
    } else {
      actions.unshift("release")
    }
    return actions
  }

  if (
    event.warningStatus === WARNING_STATUS.CLOSED_VALID &&
    canShowPublishAction(event)
  ) {
    actions.unshift("publish")
  }

  return actions
}

export function isIotPenetrationType(event: CollateralWarningEvent): boolean {
  return event.warningType === "物联穿透告警"
}

export function isCommercialType(event: CollateralWarningEvent): boolean {
  return event.warningType !== "物联穿透告警"
}

/** RISK-PUB-B01 / B02：已结案·有效 + 从未公示 + 有效抵/质押订单；已公示/已取消过的不得再进批量候选 */
export function canSelectForBatchPublish(
  event: CollateralWarningEvent
): boolean {
  if (event.publicityStatus === "已公示" || event.publicityStatus === "已取消") {
    return false
  }

  if (isReadOnlyHistoricalEvent(event)) {
    return false
  }

  if (event.orderType === "监管服务") {
    return false
  }

  return (
    event.warningStatus === WARNING_STATUS.CLOSED_VALID &&
    event.publicityStatus === "未公示"
  )
}

export function isAlreadyPublishedForBatch(
  event: CollateralWarningEvent
): boolean {
  return hasDisclosureHistory(event)
}

export const BATCH_PUBLISH_CONFIRM_MESSAGE =
  "确认进入批量公示编辑？下一步将逐条展示与单条「公示风险」相同的公示确认表单，可分别编辑后一次性提交；每条仍独立落库，已公示过的记录不会进入候选。"

export function getDetailHeaderActions(
  event: CollateralWarningEvent
): CollateralDetailHeaderAction[] {
  const actions: CollateralDetailHeaderAction[] = ["back"]

  if (isReadOnlyHistoricalEvent(event)) {
    return actions
  }

  if (event.warningStatus === WARNING_STATUS.OPEN_VALID) {
    if (event.warningType === "物联穿透告警") {
      actions.push("viewDevice")
    } else {
      actions.push("release")
    }
    return actions
  }

  if (
    event.warningStatus === WARNING_STATUS.CLOSED_VALID &&
    canShowPublishAction(event)
  ) {
    actions.push("publish")
  }

  return actions
}
