import type { WarehouseFilters, WarehouseRecord } from "../domain/types"

export function filterWarehouses(
  rows: WarehouseRecord[],
  filters: WarehouseFilters
) {
  return rows.filter((row) => {
    if (
      filters.nameKeyword.trim() &&
      !row.name.includes(filters.nameKeyword.trim())
    ) {
      return false
    }
    if (filters.zhongdeng === "是" && row.zhongdengAccess !== "YES") {
      return false
    }
    if (filters.zhongdeng === "否" && row.zhongdengAccess !== "NO") {
      return false
    }
    return true
  })
}

export function paginateWarehouses<T>(
  rows: T[],
  page: number,
  pageSize: number
) {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}
