import { buildPublishDraftFromWarning } from "../domain/publish-draft"
import { getCollateralWarningById } from "./detail-utils"
import type { RiskDisclosureRecordDetail } from "@/features/risk-disclosure/domain/types"
import { getRiskDisclosureById } from "@/features/risk-disclosure/lib/detail-utils"
import {
  getRiskDisclosureRecordIdByOrderNo,
  getRiskDisclosureRecordIdBySourceWarningId,
} from "@/features/risk-disclosure/lib/disclosure-record-lookup"

function buildDisclosureMetaFromWarningEvent(
  warnId: string
): RiskDisclosureRecordDetail | null {
  const event = getCollateralWarningById(warnId)
  if (!event || event.publicityStatus !== "已公示") {
    return null
  }

  const draft = buildPublishDraftFromWarning(event)

  return {
    recordId: `cw-pub-${warnId}`,
    sourceWarningId: warnId,
    ruleName: event.ruleName ?? "未命名规则",
    orderNo: event.orderNo,
    ownerName: event.orderSnapshot.ownerCompany,
    warningType: event.warningType,
    warningContent: draft.warningDescription,
    snapshotImageStatus:
      draft.warningSnapshotImages.length > 0 ? "available" : "none",
    warningTime: draft.warningTime,
    processedTime: draft.releaseTime,
    processedBy: draft.processedBy,
    disclosureStatus: "已公示",
    lastDisclosureTime: event.processedTime ?? event.warningTime,
    lastOperator: event.processedBy ?? "合规专员（森云科技）",
    disclosureTitle: `${draft.warningType} — ${event.orderNo}`,
    disclosureContent: draft.warningDescription,
    originalWarning: {
      warningType: draft.warningType,
      warningContent: draft.warningDescription,
      warningTime: draft.warningTime,
      processedTime: draft.releaseTime,
      processedBy: draft.processedBy,
      snapshotImageStatus:
        draft.warningSnapshotImages.length > 0 ? "available" : "none",
    },
    operationHistory: [
      {
        action: "首次公示",
        operator: event.processedBy ?? "合规专员（森云科技）",
        operatedAt: event.processedTime ?? event.warningTime,
        remark: null,
      },
    ],
    cancelReason: null,
  }
}

export function getDisclosureDetailByWarningId(
  warnId: string | undefined
): RiskDisclosureRecordDetail | null {
  if (!warnId) {
    return null
  }

  const recordId =
    getRiskDisclosureRecordIdBySourceWarningId(warnId) ??
    (() => {
      const event = getCollateralWarningById(warnId)
      return event
        ? getRiskDisclosureRecordIdByOrderNo(event.orderNo)
        : null
    })()

  if (recordId) {
    const record = getRiskDisclosureById(recordId)
    if (record) {
      return {
        ...record,
        sourceWarningId: warnId,
      }
    }
  }

  return buildDisclosureMetaFromWarningEvent(warnId)
}
