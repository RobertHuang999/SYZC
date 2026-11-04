import type { TransferRecord, TransferRecordFilters } from "../domain/types"

export function filterTransferRecords(
  records: TransferRecord[],
  filters: TransferRecordFilters
): TransferRecord[] {
  return records.filter((r) => {
    // 移库单号
    if (filters.id.trim() && !r.id.toLowerCase().includes(filters.id.trim().toLowerCase())) {
      return false
    }
    // 移库类型
    if (filters.transferType && filters.transferType !== "ALL" && r.transferType !== filters.transferType) {
      return false
    }
    // 货主名称/标识
    if (filters.ownerNameOrIdentity.trim()) {
      const q = filters.ownerNameOrIdentity.trim().toLowerCase()
      const matchName = r.ownerName.toLowerCase().includes(q)
      const matchIdentity = r.ownerIdentity.toLowerCase().includes(q)
      if (!matchName && !matchIdentity) {
        return false
      }
    }
    // 仓库名称
    if (filters.warehouseId && filters.warehouseId !== "ALL" && r.warehouseId !== filters.warehouseId) {
      return false
    }
    // 货品名称
    if (filters.goodsName.trim()) {
      const q = filters.goodsName.trim().toLowerCase()
      const matchGoods = r.goodsList.some((g) => g.goodsName.toLowerCase().includes(q))
      if (!matchGoods) {
        return false
      }
    }
    // 制单人
    if (filters.createBy && filters.createBy !== "ALL" && r.createBy !== filters.createBy) {
      return false
    }
    // 移库日期范围
    if (filters.transferStartDate) {
      const start = new Date(filters.transferStartDate).getTime()
      const t = new Date(r.transferTime).getTime()
      if (t < start) return false
    }
    if (filters.transferEndDate) {
      const end = new Date(`${filters.transferEndDate} 23:59:59`).getTime()
      const t = new Date(r.transferTime).getTime()
      if (t > end) return false
    }
    // 制单时间范围
    if (filters.createStartDate) {
      const start = new Date(filters.createStartDate).getTime()
      const t = new Date(r.createTime).getTime()
      if (t < start) return false
    }
    if (filters.createEndDate) {
      const end = new Date(`${filters.createEndDate} 23:59:59`).getTime()
      const t = new Date(r.createTime).getTime()
      if (t > end) return false
    }

    return true
  })
}

export function sortTransferRecords(records: TransferRecord[]): TransferRecord[] {
  return [...records].sort((a, b) => {
    // 默认按移库时间倒序，其次按单号倒序
    const tA = new Date(a.transferTime).getTime()
    const tB = new Date(b.transferTime).getTime()
    if (tB !== tA) {
      return tB - tA
    }
    return b.id.localeCompare(a.id)
  })
}

export function paginateTransferRecords(
  records: TransferRecord[],
  page: number,
  pageSize: number
): TransferRecord[] {
  const start = (page - 1) * pageSize
  return records.slice(start, start + pageSize)
}

