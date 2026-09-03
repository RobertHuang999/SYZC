export type DataScopeKind = "warehouse" | "order" | "org" | "task" | "function" | "all" | "custom"

export type DataScopeTag = {
  label: string
  kind: DataScopeKind
}

export type ParsedDataPermission = {
  scopes: DataScopeTag[]
  rules: string[]
}

const SCOPE_RULES: Array<{ pattern: RegExp; label: string; kind: DataScopeKind }> = [
  { pattern: /所有机构权限.*所有仓库权限|所有仓库权限.*所有机构权限/, label: "全局（机构+仓库）", kind: "all" },
  { pattern: /所有机构权限|所有仓库权限/, label: "全局", kind: "all" },
  { pattern: /订单数据权限|可见订单|抵\/质押单|订单相关/, label: "订单", kind: "order" },
  { pattern: /仓库权限|仓库 权限|仓库数据|仓库权限内的/, label: "仓库", kind: "warehouse" },
  { pattern: /机构权限|机构数据|所属机构|合作机构|数据权限内的机构|顶级机构/, label: "机构", kind: "org" },
  { pattern: /任务权限|对应任务|任务发起人|任务处理人|待处理/, label: "任务", kind: "task" },
  { pattern: /功能权限/, label: "功能权限", kind: "function" },
]

function detectScopes(text: string): DataScopeTag[] {
  const found: DataScopeTag[] = []

  for (const rule of SCOPE_RULES) {
    if (rule.pattern.test(text)) {
      found.push({ label: rule.label === "warehouse" ? "仓库" : rule.label, kind: rule.kind })
    }
  }

  const seen = new Set<DataScopeKind>()
  return found.filter((scope) => {
    if (seen.has(scope.kind)) return false
    seen.add(scope.kind)
    return true
  })
}

function cleanupRule(value: string) {
  return value
    .replace(/^[·•]\s*/, "")
    .replace(/^\d+[、.]\s*/, "")
    .replace(/[；;]+$/g, "")
    .trim()
}

function isShortScopeLabel(text: string) {
  return text.length <= 12 && !/[；;。]/.test(text) && !/^[·•]/.test(text) && !/^\d+[、.]/.test(text)
}

function splitRules(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\n+/g, " ").replace(/\s+/g, " ").trim()
  if (!normalized) return []

  if (isShortScopeLabel(normalized) && SCOPE_RULES.some((rule) => rule.pattern.test(normalized))) {
    return []
  }

  const results: string[] = []

  for (const segment of normalized.split(/[；;]/)) {
    const trimmed = segment.trim()
    if (!trimmed) continue

    const subParts = trimmed.split(/\s*(?=[·•]|\d+[、.])/).filter(Boolean)
    for (const part of subParts) {
      const cleaned = cleanupRule(part)
      if (cleaned) results.push(cleaned)
    }
  }

  if (results.length === 0 && normalized.length > 0) {
    const cleaned = cleanupRule(normalized)
    if (cleaned) results.push(cleaned)
  }

  return results
}

/** 解析 CSV「数据权限描述」字段 */
export function parseDataPermission(raw: string): ParsedDataPermission {
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\n+/g, " ").replace(/\s+/g, " ").trim()
  if (!normalized) {
    return { scopes: [], rules: [] }
  }

  const scopes = detectScopes(normalized)
  const rules = splitRules(normalized)

  if (scopes.length === 0 && rules.length === 0) {
    return {
      scopes: [{ label: normalized, kind: "custom" }],
      rules: [],
    }
  }

  return { scopes, rules }
}
