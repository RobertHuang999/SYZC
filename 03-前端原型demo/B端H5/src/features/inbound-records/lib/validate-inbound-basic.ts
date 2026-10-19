import type { InboundFormState } from "../domain/form-types"
import {
  inboundTypeNameToCode,
  isManualWarehouseType,
} from "../domain/inbound-type-options"
function validationPhone(mobile: string): boolean {
  const v = mobile.trim()
  if (!v) return false
  // 支持标准 11 位手机号或系统档案回显的脱敏手机号（如 185****7112）
  return /^1\d{10}$/.test(v) || /^1\d{2}\*{4,6}\d{4}$/.test(v)
}

function validateIDCard(id: string): boolean {
  const v = id.trim()
  if (!v) return false
  // 支持标准身份证长度或已脱敏身份证
  return (v.length >= 15 && v.length <= 18) || (v.includes("*") && v.length >= 15)
}

function validateCreditCode(code: string): boolean {
  const v = code.trim()
  if (!v) return false
  // 支持标准统一社会信用代码或已脱敏信用代码
  return (v.length >= 15 && v.length <= 20) || (v.includes("*") && v.length >= 15)
}

export function validateInboundBasicStep(form: InboundFormState): string | null {
  if (!form.partnerId) {
    return "请先选择货主或通过【快速添加货主】建档"
  }
  if (!form.ownerType) {
    return "请选择货主类型"
  }
  if (!form.ownerName.trim()) {
    return "请填写货主名称"
  }

  const typeCode = inboundTypeNameToCode(form.inboundType)

  if (form.ownerType === "个人货主") {
    if (!form.ownerIdentifier.trim() || !validationPhone(form.ownerIdentifier)) {
      return "请填写正确的标识"
    }
    if (!validateIDCard(form.idCardNo || form.ownerIdentifier)) {
      return "请填写正确的货主身份证号码"
    }
  } else {
    if (!validateCreditCode(form.ownerIdentifier)) {
      return "请填写正确的公司统一社会信用代码"
    }
    if (!form.contactPhone.trim() || !validationPhone(form.contactPhone)) {
      return "请填写正确的联系电话"
    }
  }

  if (!form.inboundDate.trim()) {
    return "请选择入库日期"
  }
  if (!form.inboundType) {
    return "请选择入库类型"
  }
  // 仓单入库在 PC 转正入口拦截，H5「入库发起」为仓单转正主路径（剧本 C），不在此阻断

  const needRelated = typeCode !== "NORMAL" && typeCode !== null && typeCode !== "CD"
  if (needRelated && !form.relatedOrderNo) {
    return "请选择关联单号"
  }

  if (isManualWarehouseType(typeCode)) {
    if (!form.warehouseId) {
      return needRelated && form.relatedOrderNo
        ? "关联单号未包含仓库信息"
        : "请选择入库仓库"
    }
    if (form.storeroomIds.length === 0) {
      return needRelated && form.relatedOrderNo ? "未获取到库房信息" : "请选择入库库房"
    }
  }

  return null
}
