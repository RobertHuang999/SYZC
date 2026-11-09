import type { TransferRecord, TransferRecordFilters } from "../domain/types"

/**
 * 转让记录过滤（7 项检索字段，对齐字段清单与三件套规范）
 */
export function filterTransferRecords(
  records: TransferRecord[],
  filters: TransferRecordFilters
): TransferRecord[] {
  return records.filter((item) => {
    // 1. 转让单号（模糊匹配）
    if (filters.id && !item.id.toLowerCase().includes(filters.id.trim().toLowerCase())) {
      return false
    }

    // 2. 转让日期范围
    if (filters.assignStartDate) {
      const startTime = `${filters.assignStartDate} 00:00:00`
      if (item.assignTime < startTime) return false
    }
    if (filters.assignEndDate) {
      const endTime = `${filters.assignEndDate} 23:59:59`
      if (item.assignTime > endTime) return false
    }

    // 3. 货主名称/标识（匹配转让人或接收人）
    if (filters.keyword) {
      const kw = filters.keyword.trim().toLowerCase()
      const matchSource =
        item.sourceOwner.ownerName.toLowerCase().includes(kw) ||
        item.sourceOwner.ownerIdentity.toLowerCase().includes(kw)
      const matchTarget =
        item.targetOwner.ownerName.toLowerCase().includes(kw) ||
        item.targetOwner.ownerIdentity.toLowerCase().includes(kw)
      if (!matchSource && !matchTarget) return false
    }

    // 4. 仓库名称
    if (filters.warehouseId && filters.warehouseId !== "ALL") {
      if (item.warehouseId !== filters.warehouseId && !item.warehouseName.includes(filters.warehouseId)) {
        return false
      }
    }

    // 5. 货品名称
    if (filters.goodsName && filters.goodsName !== "ALL") {
      const gkw = filters.goodsName.trim().toLowerCase()
      const matchSummary = item.goodsSummaryText.toLowerCase().includes(gkw)
      const matchGoods = item.goodsDisplayList.some((g) =>
        g.name.toLowerCase().includes(gkw)
      )
      if (!matchSummary && !matchGoods) return false
    }

    // 6. 制单人
    if (filters.createBy && filters.createBy !== "ALL") {
      if (!item.createByName.toLowerCase().includes(filters.createBy.toLowerCase())) {
        return false
      }
    }

    // 7. 制单时间范围
    if (filters.createStartDate) {
      const startTime = `${filters.createStartDate} 00:00:00`
      if (item.createTime < startTime) return false
    }
    if (filters.createEndDate) {
      const endTime = `${filters.createEndDate} 23:59:59`
      if (item.createTime > endTime) return false
    }

    return true
  })
}

/**
 * 默认按转让时间倒序排列；时间相同时按转让单号倒序排列（遵循三件套规范）
 */
export function sortTransferRecords(records: TransferRecord[]): TransferRecord[] {
  return [...records].sort((a, b) => {
    if (a.assignTime !== b.assignTime) {
      return b.assignTime.localeCompare(a.assignTime)
    }
    return b.id.localeCompare(a.id)
  })
}

/**
 * 分页截取
 */
export function paginateTransferRecords(
  records: TransferRecord[],
  page: number,
  pageSize: number
): TransferRecord[] {
  const start = (page - 1) * pageSize
  return records.slice(start, start + pageSize)
}
