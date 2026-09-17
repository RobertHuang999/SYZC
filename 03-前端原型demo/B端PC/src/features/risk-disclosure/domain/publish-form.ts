import type { CollateralWarningEventDetail } from "@/features/collateral-warning-events/domain/types"
import { WARNING_STATUS } from "@/features/collateral-warning-events/domain/types"
import {
  buildDisclosureTitleFromDraft,
  buildPublishDraftFromWarning,
  isAutoReleaseWarning,
  isIotWarningEvent,
  validatePublishDraft,
  type PublishDraftErrors,
  type RiskDisclosurePublishDraft,
} from "@/features/collateral-warning-events/domain/publish-draft"

export type { PublishDraftErrors as PublishFormErrors, RiskDisclosurePublishDraft }

export type RiskDisclosurePublishForm = RiskDisclosurePublishDraft & {
  sourceWarningId: string
  orderNo: string
  disclosureTitle: string
  disclosureContent: string
}

export function canEnterPublishFlow(
  event: CollateralWarningEventDetail | null,
  options?: { republish?: boolean }
): { allowed: boolean; message?: string } {
  if (!event) {
    return { allowed: false, message: "未找到对应的押品预警记录" }
  }

  if (event.warningSource === "历史") {
    return { allowed: false, message: "历史归档记录不支持发起公示" }
  }

  if (event.warningStatus !== WARNING_STATUS.CLOSED_VALID) {
    return {
      allowed: false,
      message: "仅【已结案 · 有效】的预警可发起风险公示",
    }
  }

  if (event.orderType === "监管服务") {
    return {
      allowed: false,
      message: "监管服务订单当前不支持发起风险公示",
    }
  }

  if (event.publicityStatus === "已公示" && !options?.republish) {
    return {
      allowed: false,
      message: "该预警已公示，请从行操作进入公示详情",
    }
  }

  if (event.publicityStatus === "已取消" && !options?.republish) {
    return {
      allowed: false,
      message: "该预警公示已取消，请从行操作进入公示详情",
    }
  }

  return { allowed: true }
}

export { buildPublishDraftFromWarning as buildPublishFormFromWarning }

export function validatePublishForm(
  draft: RiskDisclosurePublishDraft,
  event: CollateralWarningEventDetail
): PublishDraftErrors {
  return validatePublishDraft(draft, {
    showReleaseMethod: isAutoReleaseWarning(event),
    requireDeviceName: isIotWarningEvent(event),
    requireSituationDescription: !isAutoReleaseWarning(event),
  })
}

export { validatePublishDraft as validatePublishFormLegacy }

export function mergePublishSubmitPayload(
  event: CollateralWarningEventDetail,
  draft: RiskDisclosurePublishDraft
): RiskDisclosurePublishForm {
  return {
    sourceWarningId: event.eventId,
    orderNo: event.orderNo,
    disclosureTitle: buildDisclosureTitleFromDraft(draft, event.orderNo),
    disclosureContent: draft.warningDescription,
    ...draft,
  }
}
