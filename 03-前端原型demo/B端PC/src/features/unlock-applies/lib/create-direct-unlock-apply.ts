import type { AccessDevicePasswordContext } from "@/features/access-control-devices/domain/types"
import { CURRENT_APPLICANT_ACCOUNT } from "../domain/constants"
import type { UnlockApply } from "../domain/types"

const APPLICANT = {
  applicantName: "张三",
  applicantAccount: CURRENT_APPLICANT_ACCOUNT,
  applicantOrg: "华东监管一部",
  applicantPhone: "13812345678",
}

const emptyConfig = {
  configNo: "—",
  configVersion: 0,
  approvalMode: "任一人通过" as const,
  approvalNodes: "免审直发",
}

let applySeq = 900

function pad(n: number, len = 2) {
  return String(n).padStart(len, "0")
}

function formatDateTime(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function generateDirectApplyNo(): string {
  applySeq += 1
  const now = new Date()
  return `UA${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(applySeq % 1000, 3)}`
}

export function createDirectLockUnlockApply(params: {
  context: AccessDevicePasswordContext
  reason: string
  remark?: string
  validFrom: string
  validTo: string
}): UnlockApply {
  const now = new Date()
  const submitTime = formatDateTime(now)
  const validFrom = params.validFrom.replace("T", " ")
  const validTo = params.validTo.replace("T", " ")
  const applyNo = generateDirectApplyNo()
  const credentialNo = `CRED-${applyNo.replace("UA", "")}`
  const expectedUseWindow = `${validFrom.slice(0, 16)} ~ ${validTo.slice(0, 16)}`

  return {
    applyNo,
    deviceName: params.context.deviceName,
    deviceCode: params.context.deviceCode,
    deviceType: "挂锁门禁",
    warehouseName: params.context.warehouseName,
    roomZone: params.context.locationDetail,
    locationDetail: params.context.locationDetail,
    reason: params.reason,
    remark: params.remark,
    expectedUseWindow,
    status: "APPROVED",
    submitTime,
    configSnapshot: emptyConfig,
    approvalRecords: [],
    finalConclusion: "免审直发",
    credential: {
      credentialNo,
      status: "DELIVERED",
      password: "856778",
      passwordMasked: "****5678",
      validFrom,
      validTo,
    },
    eligible: false,
    needsApproval: false,
    ...APPLICANT,
  }
}

export function createDirectFaceUnlockApply(params: {
  context: AccessDevicePasswordContext
  reason: string
  remark?: string
  unlockCount: number
  validFrom: string
  validTo: string
}): UnlockApply {
  const now = new Date()
  const submitTime = formatDateTime(now)
  const applyNo = generateDirectApplyNo()
  const credentialNo = `CRED-${applyNo.replace("UA", "")}`
  const validFrom = params.validFrom.replace("T", " ")
  const validTo = params.validTo.replace("T", " ")
  const expectedUseWindow = `${validFrom.slice(0, 16)} ~ ${validTo.slice(0, 16)}`

  return {
    applyNo,
    deviceName: params.context.deviceName,
    deviceCode: params.context.deviceCode,
    deviceType: "人脸门禁",
    warehouseName: params.context.warehouseName,
    roomZone: params.context.locationDetail,
    locationDetail: params.context.locationDetail,
    reason: params.reason,
    remark: params.remark,
    expectedUseWindow,
    status: "APPROVED",
    submitTime,
    configSnapshot: emptyConfig,
    approvalRecords: [],
    finalConclusion: "免审直发",
    credential: {
      credentialNo,
      status: "DELIVERED",
      password: "856778",
      passwordMasked: "856778",
      validFrom,
      validTo,
    },
    eligible: false,
    needsApproval: false,
    ...APPLICANT,
  }
}
