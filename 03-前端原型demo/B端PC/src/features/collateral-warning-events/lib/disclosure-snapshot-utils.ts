import type { RiskDisclosurePublishForm } from "@/features/risk-disclosure/domain/publish-form"
import {
  buildPublishDraftFromWarning,
  type RiskDisclosurePublishDraft,
} from "../domain/publish-draft"
import { getCollateralWarningById } from "./detail-utils"

export function extractPublishDraftFromForm(
  form: RiskDisclosurePublishForm
): RiskDisclosurePublishDraft {
  const {
    sourceWarningId: _sourceWarningId,
    orderNo: _orderNo,
    disclosureTitle: _disclosureTitle,
    disclosureContent: _disclosureContent,
    ...draft
  } = form
  return draft
}

export function getPublishedSnapshotByWarningId(
  warnId: string,
  publishForm?: RiskDisclosurePublishForm | null
): RiskDisclosurePublishDraft | null {
  if (publishForm) {
    return extractPublishDraftFromForm(publishForm)
  }

  const event = getCollateralWarningById(warnId)
  if (!event) {
    return null
  }

  return buildPublishDraftFromWarning(event)
}
