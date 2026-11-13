import type { InboundFormState } from "../domain/form-types"
import {
  inboundTypeNameToCode,
  isManualWarehouseType,
} from "../domain/inbound-type-options"
import { resolveOwnerSearchRecord } from "../mock/inbound-form.mock"
import { bindInboundOwnerFromCatalog } from "./inbound-form-utils"

function validationPhone(mobile: string): boolean {
  const v = mobile.trim()
  if (!v) return false
  return /^1\d{10}$/.test(v) || /^1\d{2}\*{4,6}\d{4}$/.test(v)
}

function validateIDCard(id: string): boolean {
  const v = id.trim()
  if (!v) return false
  return (v.length >= 15 && v.length <= 18) || (v.includes("*") && v.length >= 15)
}

function validateCreditCode(code: string): boolean {
  const v = code.trim()
  if (!v) return false
  return (v.length >= 15 && v.length <= 20) || (v.includes("*") && v.length >= 15)
}

export function validateInboundBasicStep(form: InboundFormState): string | null {
  const bound = bindInboundOwnerFromCatalog(form)
  const archive = resolveOwnerSearchRecord({
    ownerType: bound.ownerType,
    ownerName: bound.ownerName,
    ownerIdentifier: bound.ownerIdentifier,
  })
  const archived = Boolean(bound.partnerId || archive)

  if (!archived) {
    return "请先选择货主或通过【快速添加货主】建档"
  }
  if (!bound.ownerType) {
    return "请选择货主类型"
  }
  if (!bound.ownerName.trim()) {
    return "请填写货主名称"
  }

  const typeCode = inboundTypeNameToCode(bound.inboundType)
  const ownerIdentifier =
    bound.ownerIdentifier.trim() || archive?.ownerIdentifier || ""
  const idCardNo = bound.idCardNo || archive?.idCardNo || ""
  const contactPhone = bound.contactPhone.trim() || archive?.contactPhone || ""

  if (bound.ownerType === "个人货主") {
    if (!validationPhone(ownerIdentifier)) {
      return "请填写正确的标识"
    }
    if (!validateIDCard(idCardNo || ownerIdentifier)) {
      return "请填写正确的货主身份证号码"
    }
  } else {
    if (!validateCreditCode(ownerIdentifier)) {
      return "请填写正确的公司统一社会信用代码"
    }
    if (!contactPhone) {
      return "请填写正确的联系电话"
    }
    if (!archived && !validationPhone(contactPhone)) {
      return "请填写正确的联系电话"
    }
  }

  if (!bound.inboundDate.trim()) {
    return "请选择入库日期"
  }
  if (!bound.inboundType) {
    return "请选择入库类型"
  }

  const needRelated =
    typeCode !== "NORMAL" && typeCode !== null && typeCode !== "CD"
  if (needRelated && !bound.relatedOrderNo) {
    return "请选择关联单号"
  }

  if (isManualWarehouseType(typeCode)) {
    if (!bound.warehouseId) {
      return needRelated && bound.relatedOrderNo
        ? "关联单号未包含仓库信息"
        : "请选择入库仓库"
    }
    if (bound.storeroomIds.length === 0) {
      return needRelated && bound.relatedOrderNo
        ? "未获取到库房信息"
        : "请选择入库库房"
    }
  }

  return null
}
