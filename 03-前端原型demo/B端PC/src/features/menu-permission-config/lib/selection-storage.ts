const STORAGE_KEY = "syzc-menu-permission-config-v1"

type StoredShape = Record<string, Record<string, string[]>>

function readStore(): StoredShape {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as StoredShape
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store: StoredShape) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // 浏览器禁用本地存储时静默降级为纯内存演示
  }
}

export function loadSavedGrants(roleId: string, channelId: string): Set<string> | null {
  const store = readStore()
  const ids = store[roleId]?.[channelId]
  return Array.isArray(ids) ? new Set(ids) : null
}

export function saveGrants(roleId: string, channelId: string, granted: Set<string>) {
  const store = readStore()
  store[roleId] = { ...(store[roleId] ?? {}), [channelId]: [...granted] }
  writeStore(store)
}

export function clearSavedGrants(roleId: string, channelId: string) {
  const store = readStore()
  if (!store[roleId]) return
  const next = { ...store[roleId] }
  delete next[channelId]
  store[roleId] = next
  writeStore(store)
}
