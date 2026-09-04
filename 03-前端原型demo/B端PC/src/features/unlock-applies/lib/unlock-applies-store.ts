import { useEffect, useState } from "react"
import { withResolvedCredentialExpiry } from "./credential-expiry"
import { unlockAppliesMockSeed } from "../mock/unlock-applies.mock"
import type { UnlockApply } from "../domain/types"

const STORAGE_KEY = "SYZC_PC_UNLOCK_APPLIES"

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

export function findUnlockApply(applyNo?: string): UnlockApply | undefined {
  if (!applyNo) return undefined
  const item = items.find((row) => row.applyNo === applyNo)
  return item ? withResolvedCredentialExpiry(item) : undefined
}

export function useUnlockApplies(): UnlockApply[] {
  const [state, setState] = useState(() => [...getUnlockApplies()])

  useEffect(() => {
    return subscribeUnlockApplies(() => setState([...getUnlockApplies()]))
  }, [])

  return state
}
