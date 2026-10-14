/** PC / H5 入库列表级联筛选匹配（仓库|库房、货品 fullKey） */

export function inboundWarehouseCascadeKeyMatchesRow(
  key: string,
  rowWarehouseName: string,
  rowHouseName?: string
): boolean {
  const [wh, sr] = key.split("|")
  if (!wh) return false
  if (sr) {
    if (rowHouseName) {
      return rowWarehouseName === wh && rowHouseName === sr
    }
    const combined = `${wh}-${sr}`
    return (
      rowWarehouseName === combined ||
      rowWarehouseName === `${wh}|${sr}` ||
      (rowWarehouseName.includes(wh) && rowWarehouseName.includes(sr))
    )
  }
  return (
    rowWarehouseName === wh ||
    rowWarehouseName.startsWith(`${wh}-`) ||
    rowWarehouseName.startsWith(`${wh}|`)
  )
}
