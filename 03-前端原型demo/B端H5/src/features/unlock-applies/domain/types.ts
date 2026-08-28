export type UnlockApplyStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN"
  | "EXPIRED"
  | "VOIDED"

export type UnlockApply = {
  applyNo: string
  deviceName: string
  deviceCode: string
  warehouseName: string
  roomZone: string
  locationDetail: string
  applicantName: string
  applicantAccount: string
  reason: string
  remark?: string
  expectedUseWindow?: string
  status: UnlockApplyStatus
  submitTime: string
}

export type UnlockApplyFilters = {
  keyword: string
  status: "全部" | "待审批" | "已处理"
}
