import type { RiskDisclosurePublishForm } from "@/features/risk-disclosure/domain/publish-form"
import type { RiskDisclosurePublishDraft } from "../domain/publish-draft"

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
