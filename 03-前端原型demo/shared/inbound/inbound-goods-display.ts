/** 入库制单与详情共用的货品展示口径（对齐字段清单：大类-品类-规格、计量单位只读） */

export function parseInboundGoodsName(name: string): {
  category: string
  variety: string
  spec: string
} {
  const trimmed = name.trim()
  if (!trimmed) {
    return { category: "", variety: "", spec: "" }
  }
  const parts = trimmed.split("-").map((p) => p.trim()).filter(Boolean)
  if (parts.length === 1) {
    return { category: parts[0], variety: "", spec: "" }
  }
  if (parts.length === 2) {
    return { category: parts[0], variety: parts[1], spec: "" }
  }
  return {
    category: parts[0],
    variety: parts[1],
    spec: parts.slice(2).join("-"),
  }
}

export function formatInboundGoodsLineName(parts: {
  category: string
  variety: string
  spec: string
}): string {
  return [parts.category, parts.variety, parts.spec].filter(Boolean).join("-")
}

/** 详情/列表数量展示：`182.33 吨`（数值与单位空格分隔） */
export function formatInboundQuantityLabel(amount: number, unit: string): string {
  const formatted = amount.toLocaleString("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
  return unit ? `${formatted} ${unit}` : formatted
}

export function formatCollectValuesAsOtherInfo(
  values: Record<string, string>,
  labels?: Record<string, string>
): string {
  const entries = Object.entries(values).filter(([, v]) => v.trim().length > 0)
  if (entries.length === 0) return "无：--"
  return entries
    .map(([key, value]) => {
      const label = labels?.[key] ?? key
      return `${label}：${value}`
    })
    .join(" / ")
}
