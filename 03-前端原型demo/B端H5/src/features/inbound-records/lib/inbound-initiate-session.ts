import type { InboundFormState } from "../domain/form-types"

const SESSION_KEY = "syzc.inbound.initiate.form"
const SNAPSHOT_KEY = "syzc.inbound.initiate.snapshot"

export function loadInboundInitiateForm(): InboundFormState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as InboundFormState
  } catch {
    return null
  }
}

export function saveInboundInitiateForm(form: InboundFormState): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(form))
}

export function loadInboundInitiateSnapshot(): InboundFormState | null {
  try {
    const raw = sessionStorage.getItem(SNAPSHOT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as InboundFormState
  } catch {
    return null
  }
}

export function saveInboundInitiateSnapshot(form: InboundFormState): void {
  sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(form))
}

/** 对齐 native hasSignificantChanges：基础信息变更则清空货品明细 */
export function hasSignificantBasicChange(
  current: InboundFormState,
  previous: InboundFormState | null
): boolean {
  if (!previous) return false
  const keys: (keyof InboundFormState)[] = [
    "ownerType",
    "ownerName",
    "ownerIdentifier",
    "contactPhone",
    "idCardNo",
    "inboundType",
    "relatedOrderNo",
    "warehouseId",
    "storeroomIds",
  ]
  for (const key of keys) {
    const a = current[key]
    const b = previous[key]
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.join(",") !== b.join(",")) return true
    } else if (a !== b) return true
  }
  return false
}

export function clearInboundInitiateSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SNAPSHOT_KEY)
}
