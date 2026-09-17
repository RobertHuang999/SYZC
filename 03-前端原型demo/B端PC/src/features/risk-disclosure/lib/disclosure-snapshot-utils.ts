import { getCollateralWarningById } from "@/features/collateral-warning-events/lib/detail-utils"
import {
  buildPublishDraftFromWarning,
  type RiskDisclosurePublishDraft,
} from "@/features/collateral-warning-events/domain/publish-draft"
import {
  extractPublishDraftFromForm,
  getPublishedSnapshotByWarningId,
} from "@/features/collateral-warning-events/lib/disclosure-snapshot-utils"
import type { RiskDisclosurePublishForm } from "../domain/publish-form"
import type { RiskDisclosureRecordDetail } from "../domain/types"

export function buildPublishDraftFromRecord(
  record: RiskDisclosureRecordDetail
): RiskDisclosurePublishDraft {
  return {
    warningTime: record.warningTime,
    warningType: record.warningType,
    location: "—",
    deviceName: "无关联设备",
    warningDescription: record.warningContent,
    warningSnapshotImages:
      record.snapshotImageStatus === "available"
        ? [`预警抓拍-${record.recordId}.jpg`]
        : [],
    processedBy: record.processedBy,
    releaseMethod: record.processedBy.includes("系统")
      ? "系统自动结案"
      : "人工解除",
    releaseTime: record.processedTime,
    situationDescription: "",
    sitePhotos: [],
    releaseSnapshotImages: [],
  }
}

export function getPublishedSnapshotForRecord(
  record: RiskDisclosureRecordDetail,
  publishForm?: RiskDisclosurePublishForm | null
): RiskDisclosurePublishDraft | null {
  if (publishForm) {
    return extractPublishDraftFromForm(publishForm)
  }

  if (record.sourceWarningId) {
    return getPublishedSnapshotByWarningId(record.sourceWarningId)
  }

  const event = getCollateralWarningById(
    record.sourceWarningId ?? record.recordId
  )
  if (event) {
    return buildPublishDraftFromWarning(event)
  }

  return buildPublishDraftFromRecord(record)
}

export function resolveShowReleaseMethod(
  record: RiskDisclosureRecordDetail,
  sourceWarningId?: string | null
): boolean {
  if (sourceWarningId) {
    const event = getCollateralWarningById(sourceWarningId)
    if (event) {
      return Boolean(event.processedBy?.includes("系统"))
    }
  }

  return record.processedBy.includes("系统")
}
