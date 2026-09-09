import type { UnlockApprovalConfig } from "@/features/unlock-approval-configs/domain/types"
import type { UnlockApplySubmitContext } from "../components/UnlockApplySubmitDialog"
import { CURRENT_APPLICANT_ACCOUNT } from "../domain/constants"
import type { ConfigSnapshot, UnlockApply } from "../domain/types"
import { generateDirectApplyNo } from "./create-direct-unlock-apply"
import {
  addUnlockApply,
  findPendingUnlockApplyByDeviceCode,
  findUnlockApply,
} from "./unlock-applies-store"

const APPLICANT = {
  applicantName: "张三",
  applicantAccount: CURRENT_APPLICANT_ACCOUNT,
  applicantOrg: "华东监管一部",
  applicantPhone: "13812345678",
}

const IDEMPOTENCY_WINDOW_MS = 60_000
const recentSubmissions = new Map<string, { applyNo: string; at: number }>()

export type SubmitUnlockApplyInput = {
  context: UnlockApplySubmitContext
  reason: string
  remark?: string
  validFrom: string
  validTo: string
  unlockCount?: number
  matchedConfig: UnlockApprovalConfig
}

export type SubmitUnlockApplyResult =
  | { ok: true; applyNo: string; idempotent: boolean }
  | { ok: false; code: "R07"; pendingApplyNo: string }

function pad(n: number, len = 2) {
  return String(n).padStart(len, "0")
}

function formatDateTime(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function buildConfigSnapshot(config: UnlockApprovalConfig): ConfigSnapshot {
  return {
    configNo: config.configNo,
    configVersion: config.configVersion,
    approvalMode: config.approvalMode,
    approvalNodes: `${config.configName} · ${config.approvalMode}`,
    timeoutHours: config.timeoutHours,
  }
}

function formatExpectedWindow(validFrom: string, validTo: string): string {
  const from = validFrom.replace("T", " ").slice(0, 16)
  const to = validTo.replace("T", " ").slice(0, 16)
  return `${from} ~ ${to}`
}

export function submitUnlockApply(
  input: SubmitUnlockApplyInput
): SubmitUnlockApplyResult {
  const { context, matchedConfig } = input

  const pending = findPendingUnlockApplyByDeviceCode(context.deviceCode)
  if (pending) {
    return { ok: false, code: "R07", pendingApplyNo: pending.applyNo }
  }

  const idempotencyKey = `${context.deviceCode}:${CURRENT_APPLICANT_ACCOUNT}`
  const recent = recentSubmissions.get(idempotencyKey)
  if (recent && Date.now() - recent.at < IDEMPOTENCY_WINDOW_MS) {
    const existing = findUnlockApply(recent.applyNo)
    if (existing?.status === "PENDING" && existing.needsApproval) {
      return { ok: true, applyNo: recent.applyNo, idempotent: true }
    }
  }

  const applyNo = generateDirectApplyNo()
  const submitTime = formatDateTime(new Date())
  const record: UnlockApply = {
    applyNo,
    deviceName: context.deviceName,
    deviceCode: context.deviceCode,
    deviceType: context.deviceType,
    warehouseName: context.warehouseName,
    roomZone: context.locationDetail,
    locationDetail: context.locationDetail,
    reason: input.reason,
    remark: input.remark,
    expectedUseWindow: formatExpectedWindow(input.validFrom, input.validTo),
    status: "PENDING",
    submitTime,
    configSnapshot: buildConfigSnapshot(matchedConfig),
    approvalRecords: [],
    credential: { status: "NOT_GENERATED" },
    eligible: true,
    needsApproval: true,
    ...APPLICANT,
  }

  addUnlockApply(record)
  recentSubmissions.set(idempotencyKey, { applyNo, at: Date.now() })
  return { ok: true, applyNo, idempotent: false }
}
