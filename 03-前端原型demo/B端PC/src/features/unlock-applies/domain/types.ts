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

export type ApplyStatusFilter =
  | "全部"
  | "待审批"
  | "已处理"
  | "已通过"
  | "已驳回"
  | "已撤回"
  | "已失效"
  | "已作废"

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
  applyNo: string
  deviceKeyword: string
  warehouseName: string
  applicantKeyword: string
  reason: string
  applyStatus: ApplyStatusFilter
  submitTimeFrom: string
  submitTimeTo: string
}

export type MyUnlockApplyFilters = {
  needsApproval: "全部" | "是" | "否"
  submitTimeFrom: string
  submitTimeTo: string
  applyStatuses: UnlockApplyStatus[]
  credentialStatuses: CredentialStatus[]
  deviceName: string
  deviceCode: string
  deviceType: "全部" | "挂锁门禁" | "人脸门禁"
  warehouseName: string
  reason: string
  applicantKeyword: string
  configNo: string
}
