import type { ManualInboundType, InboundFormState } from "../domain/form-types"
import type { OwnerSearchRecord } from "../mock/inbound-form.mock"

export function isFinancialInboundType(
  inboundType: ManualInboundType | ""
): boolean {
  return (
    inboundType === "质押入库" ||
    inboundType === "抵押入库" ||
    inboundType === "监管服务入库"
  )
}

/** R03 + PA-R04b：提交审核前是否须弹出货主短信二元核验 */
export function needsOwnerSmsAtSubmit(
  form: Pick<
    InboundFormState,
    "isNewOwner" | "inboundType" | "ownerType" | "ownerName" | "ownerIdentifier"
  >,
  archive?: OwnerSearchRecord
): boolean {
  if (form.isNewOwner) {
    return true
  }
  if (!archive) {
    return false
  }
  if (!isFinancialInboundType(form.inboundType)) {
    return false
  }
  return archive.contactPhoneVerified === "UNVERIFIED"
}
