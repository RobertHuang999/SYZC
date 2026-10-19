/** 入库货主确认弹窗 + 货主表单字段文案（PC / H5 共用） */

export const INBOUND_OWNER_VERIFY_DIALOG = {
  title: "货主信息确认",
  description: "请认真核对货主档案信息与联系方式，确认无误后进入下一步。",
  descriptionSmsRequiredUser: "须完成手机短信验证后，方可继续下一步。",
  descriptionSmsRequiredSpec:
    "【新货主二元身份核验与建档沉淀规则】(R03) 或金融入库【联系手机核验状态与金融场景强制核验规则】(PA-R04b)。",
  /** @deprecated 使用 descriptionSmsRequiredUser */
  descriptionSmsRequired: "须完成手机短信验证后，方可继续下一步。",
  existingOwnerHint:
    "提示：该货主为系统现有在册货主，普通入库无需短信；信息核对无误后可直接确认进入下一步。",
  ownerType: "货主类型",
  ownerName: "货主名称",
  ownerIdentifier: "货主标识",
  idCardNo: "身份证号",
  contactPhone: "联系电话",
  smsCode: "短信验证码",
  smsPlaceholder: "6 位验证码",
  back: "返回修改",
  confirmNext: "确认并下一步",
} as const

export const INBOUND_FINANCIAL_OWNER_SMS_USER =
  "提交审核前须完成货主手机短信确认。"

export const INBOUND_FINANCIAL_OWNER_SMS_SPEC = "【联系手机核验状态与金融场景强制核验规则】(PA-R04b)。"

export function inboundOwnerTypeDisplay(ownerType: string): string {
  return ownerType === "个人货主" || ownerType === "个人" ? "个人" : "企业"
}

export const INBOUND_OWNER_FORM_PLACEHOLDERS = {
  ownerNamePersonal: "请输入或选择个人货主姓名",
  ownerNameEnterprise: "请输入或选择货主名称",
  ownerNameFallback: "请输入或选择货主名称",
  personalMobile: "请输入手机号码",
  personalIdCard: "请输入货主身份证号",
  enterpriseCreditCode: "请输入统一社会信用代码",
  enterpriseContact: "请输入企业联系电话",
  ownerTypeFirst: "请先选择货主类型",
} as const

export function inboundOwnerNamePlaceholder(ownerType: string | ""): string {
  if (ownerType === "企业货主") return INBOUND_OWNER_FORM_PLACEHOLDERS.ownerNameEnterprise
  if (ownerType === "个人货主") return INBOUND_OWNER_FORM_PLACEHOLDERS.ownerNamePersonal
  return INBOUND_OWNER_FORM_PLACEHOLDERS.ownerNameFallback
}
