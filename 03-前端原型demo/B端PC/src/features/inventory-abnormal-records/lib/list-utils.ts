import type { AbnormalRecord, AbnormalRecordFilters } from "../domain/types"

export function filterAbnormalRecords(
  records: AbnormalRecord[],
  filters: AbnormalRecordFilters
): AbnormalRecord[] {
  return records.filter((item) => {
    // 异动单号
    if (filters.abnormalNo.trim() && !item.id.includes(filters.abnormalNo.trim())) {
      return false
    }

    // 关联单据
    if (filters.relateNo.trim() && !item.relateId.includes(filters.relateNo.trim())) {
      return false
    }

    // 单据类型多选
    if (filters.orderTypes.length > 0 && !filters.orderTypes.includes(item.relateOrderType)) {
      return false
    }

    // 货主名称/标识
    if (filters.ownerKeyword.trim()) {
      const kw = filters.ownerKeyword.trim().toLowerCase()
      const matchName = item.owner.ownerName.toLowerCase().includes(kw)
      const matchIdentity = item.owner.ownerIdentity.toLowerCase().includes(kw)
      if (!matchName && !matchIdentity) return false
    }

    // 异动类型多选
    if (filters.abnormalTypes.length > 0) {
      const hasMatchedType = item.goodsLines.some((g) =>
        filters.abnormalTypes.includes(g.abnormalType)
      )
      if (!hasMatchedType) return false
    }

    // 仓库级联
    if (filters.warehouseCascade.length > 0) {
      const targetWarehouse = filters.warehouseCascade[0]
      const targetStoreroom = filters.warehouseCascade[1]
      const hasMatchedLocation = item.goodsLines.some((g) => {
        if (targetStoreroom) {
          return g.location.includes(targetWarehouse) && g.location.includes(targetStoreroom)
        }
        return g.location.includes(targetWarehouse)
      })
      if (!hasMatchedLocation) return false
    }

    // 货物
    if (filters.goodsKeyword.trim()) {
      const kw = filters.goodsKeyword.trim().toLowerCase()
      const hasMatchedGoods = item.goodsLines.some((g) => g.goodsName.toLowerCase().includes(kw))
      if (!hasMatchedGoods) return false
    }

    // 申请时间范围
    if (filters.dateRange.startDate) {
      const applyDate = item.applyTime.slice(0, 10)
      if (applyDate < filters.dateRange.startDate) return false
    }
    if (filters.dateRange.endDate) {
      const applyDate = item.applyTime.slice(0, 10)
      if (applyDate > filters.dateRange.endDate) return false
    }

    return true
  })
}

export function paginateAbnormalRecords(
  records: AbnormalRecord[],
  page: number,
  pageSize: number
): AbnormalRecord[] {
  const start = (page - 1) * pageSize
  return records.slice(start, start + pageSize)
}

