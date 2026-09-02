export type UnlockApplyStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN"
  | "EXPIRED"
  | "VOIDED"

export type CredentialStatus =
  | "NOT_GENERATED"
  | "DELIVERED"
  | "GEN_FAILED"
  | "DELIVERY_FAILED"
  | "EXPIRED"
  | "SUPERSEDED"

export type ApprovalRecord = {
  nodeOrder: number
  handlerName: string
  handlerAccount: string
  result?: "通过" | "驳回"
  opinion?: string
  processedTime?: string
}

export type ConfigSnapshot = {
  configNo: string
  configVersion: number
  approvalMode: "任一人通过" | "按顺序审批"
  approvalNodes: string
  timeoutHours?: number
}

export type CredentialInfo = {
  credentialNo?: string
  status: CredentialStatus
  password?: string
  passwordMasked?: string
  validFrom?: string
  validTo?: string
  genFailReason?: string
  deliveryFailReason?: string
  invalidReason?: string
}

export type TransactionInfo = {
  linkStatus: "未开锁" | "已开锁" | "开锁失败" | "未匹配"
  unlockTime?: string
  transactionId?: string
}

export type UnlockApply = {
  applyNo: string
  deviceName: string
  deviceCode: string
  deviceType: "挂锁门禁" | "人脸门禁"
  warehouseName: string
  storeroomName?: string
  zoneName?: string
  roomZone: string
  locationDetail: string
  applicantName: string
  applicantAccount: string
  applicantOrg: string
  applicantPhone: string
  reason: string
  remark?: string
  expectedUseWindow?: string
  status: UnlockApplyStatus
  submitTime: string
  configSnapshot: ConfigSnapshot
  approvalRecords: ApprovalRecord[]
  finalConclusion?: string
  rejectReason?: string
  credential: CredentialInfo
  /** @deprecated 6.2 详情不展示关联事务 */
  transaction?: TransactionInfo
  eligible: boolean
  needsApproval: boolean
}

export type UnlockApplyFilters = {
  keyword: string
  status: "全部" | "待审批" | "已处理"
}

export type MyApplyBizType = "全部" | "流程申请" | "开锁审批"

/** @deprecated 旧版统一列表筛选，已拆分为 ProcessApplyFilters / UnlockTabFilters */
export type MyApplyFilters = {
  keyword: string
  bizType: MyApplyBizType
  dateFrom: string
  dateTo: string
  needsApproval: "全部" | "是" | "否"
}

export type ProcessApplyRecord = {
  id: string
  type: "流程申请"
  submitTime: string
  ownerName: string
  summary: string
  status: "审批中" | "已通过" | "已驳回"
}

export type MyApplyRecord = UnlockApply | ProcessApplyRecord

export function isUnlockApply(record: MyApplyRecord): record is UnlockApply {
  return "applyNo" in record
}
