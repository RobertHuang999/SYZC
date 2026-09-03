export type ActionButtonKind = "button" | "visibility" | "text"

export type ParsedActionButton = {
  label: string
  kind: ActionButtonKind
  hint?: string
}

const VISIBILITY_PATTERNS = ["此处仅限制", "页面展示", "功能权限", "菜单可见", "入口可见"]

function classifyActionButton(label: string): ParsedActionButton {
  const trimmed = label.trim()
  if (!trimmed) {
    return { label: "", kind: "text" }
  }

  if (VISIBILITY_PATTERNS.some((pattern) => trimmed.includes(pattern))) {
    return { label: trimmed, kind: "visibility" }
  }

  const parenMatch = trimmed.match(/^(.+?)（(.+)）$/) ?? trimmed.match(/^(.+?)\((.+)\)$/)
  if (parenMatch) {
    return {
      label: parenMatch[1].trim(),
      kind: "button",
      hint: parenMatch[2].trim(),
    }
  }

  return { label: trimmed, kind: "button" }
}

/** 将功能描述/权限分类文本智能拆分为独立按钮与操作项 */
export function parseActionButtons(raw: string): ParsedActionButton[] {
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\n+/g, " ").replace(/\s+/g, " ").trim()
  if (!normalized) return []

  const items: string[] = []
  let current = ""
  let depth = 0

  for (const char of normalized) {
    if (char === "（" || char === "(") depth += 1
    if (char === "）" || char === ")") depth = Math.max(0, depth - 1)

    if ((char === "、" || char === "," || char === "；" || char === ";") && depth === 0) {
      if (current.trim()) items.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  if (current.trim()) items.push(current.trim())

  return items.map(classifyActionButton).filter((item) => item.label.length > 0)
}
