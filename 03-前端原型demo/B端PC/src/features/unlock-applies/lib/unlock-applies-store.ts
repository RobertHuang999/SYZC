import { useEffect, useState } from "react"
import { withResolvedCredentialExpiry } from "./credential-expiry"
import { unlockAppliesMockSeed } from "../mock/unlock-applies.mock"
import type { UnlockApply } from "../domain/types"

const STORAGE_KEY = "SYZC_PC_UNLOCK_APPLIES_V3"

let items: UnlockApply[] = loadInitial()
const listeners = new Set<() => void>()

function loadInitial(): UnlockApply[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as UnlockApply[]
  } catch {
    /* ignore */
  }
  return [...unlockAppliesMockSeed]
}

function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore */
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function getUnlockApplies(): UnlockApply[] {
  return items.map(withResolvedCredentialExpiry)
}

export function subscribeUnlockApplies(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function addUnlockApply(record: UnlockApply): void {
  items = [record, ...items]
  persist()
  notify()
}

export function updateUnlockApply(
  applyNo: string,
  updater: (item: UnlockApply) => UnlockApply
): void {
  items = items.map((item) => (item.applyNo === applyNo ? updater(item) : item))
  persist()
  notify()
}

/** 审批通过：更新状态为 APPROVED，生成凭证并追加审批记录 */
export function approveUnlockApply(applyNo: string, opinion: string = ""): void {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const nowStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const validToStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} 23:59:59`
  const pwd = Math.floor(100000 + Math.random() * 900000).toString()

  updateUnlockApply(applyNo, (item) => ({
    ...item,
    status: "APPROVED",
    eligible: false,
    finalConclusion: "通过",
    approvalRecords: [
      ...item.approvalRecords,
      {
        nodeOrder: item.approvalRecords.length + 1,
        handlerName: "当前审批人",
        handlerAccount: "auditor",
        result: "通过",
        opinion: opinion.trim() || "同意",
        processedTime: nowStr,
      },
    ],
    credential:
      item.credential.status === "NOT_GENERATED"
        ? {
            credentialNo: `CRED-${Date.now()}`,
            status: "DELIVERED",
            password: pwd,
            passwordMasked: pwd,
            validFrom: nowStr,
            validTo: validToStr,
          }
        : item.credential,
  }))
}

/** 审批驳回：更新状态为 REJECTED，记录驳回理由并追加审批记录 */
export function rejectUnlockApply(applyNo: string, reason: string): void {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const nowStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  updateUnlockApply(applyNo, (item) => ({
    ...item,
    status: "REJECTED",
    eligible: false,
    finalConclusion: "驳回",
    rejectReason: reason.trim(),
    approvalRecords: [
      ...item.approvalRecords,
      {
        nodeOrder: item.approvalRecords.length + 1,
        handlerName: "当前审批人",
        handlerAccount: "auditor",
        result: "驳回",
        opinion: reason.trim(),
        processedTime: nowStr,
      },
    ],
  }))
}

export function findUnlockApply(applyNo?: string): UnlockApply | undefined {
  if (!applyNo) return undefined
  const item = items.find((row) => row.applyNo === applyNo)
  return item ? withResolvedCredentialExpiry(item) : undefined
}

/** R07：同设备在途需审批申请（PENDING + needsApproval） */
export function findPendingUnlockApplyByDeviceCode(
  deviceCode: string
): UnlockApply | undefined {
  const pending = items.find(
    (item) =>
      item.deviceCode === deviceCode &&
      item.needsApproval &&
      item.status === "PENDING"
  )
  return pending ? withResolvedCredentialExpiry(pending) : undefined
}

export function useUnlockApplies(): UnlockApply[] {
  const [state, setState] = useState(() => [...getUnlockApplies()])

  useEffect(() => {
    return subscribeUnlockApplies(() => setState([...getUnlockApplies()]))
  }, [])

  return state
}
