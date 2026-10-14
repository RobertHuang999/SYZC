/** PC/H5 入库列表「货物名称」展示格式（对齐 R15） */

export function formatGoodsNamesForList(names: string[]): string {
  return names.join("，")
}

export function formatInboundGoodsSummary(names: string[]): string {
  if (names.length === 0) return "—"
  if (names.length === 1) return names[0]
  return `${names[0]} 等 ${names.length} 种`
}
