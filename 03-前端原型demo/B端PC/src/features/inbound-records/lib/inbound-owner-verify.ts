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

/** 【合作方货主引用与快捷建档规则】(R03) + PA-R04b：金融类且联系手机未验证时提交前补验 */
export function needsOwnerSmsAtSubmit(
  form: Pick<
    InboundFormState,
    "partnerId" | "inboundType"
  >,
  archive?: OwnerSearchRecord
): boolean {
  if (!form.partnerId && !archive?.partnerId) {
    return false
  }
  if (!isFinancialInboundType(form.inboundType)) {
    return false
  }
  if (!archive) {
    return false
  }
  return archive.contactPhoneVerified === "UNVERIFIED"
}
