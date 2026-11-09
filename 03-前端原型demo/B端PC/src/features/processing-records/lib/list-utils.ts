import type { ProcessingRecord, ProcessingRecordFilters } from "../domain/types"

/** 列表筛选过滤算法 */
export function filterProcessingRecords(
  records: ProcessingRecord[],
  filters: ProcessingRecordFilters
): ProcessingRecord[] {
  return records.filter((item) => {
    // 1. 加工单号
    if (filters.id?.trim()) {
      const keyword = filters.id.trim()
      if (!item.id.includes(keyword)) return false
    }

    // 2. 加工日期范围
    if (filters.processingTimeRange && filters.processingTimeRange[0] && filters.processingTimeRange[1]) {
      const [start, end] = filters.processingTimeRange
      const itemDate = item.processingTime.slice(0, 10)
      if (itemDate < start || itemDate > end) return false
    }

    // 3. 货主名称/标识复合搜索
    if (filters.ownerKeyword?.trim()) {
      const keyword = filters.ownerKeyword.trim().toLowerCase()
      const matchName = item.ownerName.toLowerCase().includes(keyword)
      const matchIdentity = item.ownerIdentity.toLowerCase().includes(keyword)
      if (!matchName && !matchIdentity) return false
    }

    // 4. 加工类型
    if (filters.processingType) {
      if (item.processingType !== filters.processingType) return false
    }

    // 5. 仓库名称
    if (filters.warehouseName?.trim()) {
      const keyword = filters.warehouseName.trim().toLowerCase()
      if (!item.warehouseName.toLowerCase().includes(keyword)) return false
    }

    // 6. 货品名称（投入或产出任意匹配）
    if (filters.goodsKeyword?.trim()) {
      const keyword = filters.goodsKeyword.trim().toLowerCase()
      const matchInput = item.inputGoodsGroups.some((g) =>
        g.goodsName.toLowerCase().includes(keyword)
      )
      const matchOutput = item.outputGoodsItems.some((o) =>
        o.goodsName.toLowerCase().includes(keyword)
      )
      if (!matchInput && !matchOutput) return false
    }

    // 7. 单据状态
    if (filters.status) {
      if (item.status !== filters.status) return false
    }

    // 8. 制单人
    if (filters.createBy?.trim()) {
      const keyword = filters.createBy.trim().toLowerCase()
      if (!item.createByName.toLowerCase().includes(keyword)) return false
    }

    // 9. 制单时间范围
    if (filters.createTimeRange && filters.createTimeRange[0] && filters.createTimeRange[1]) {
      const [start, end] = filters.createTimeRange
      const itemDate = item.createTime.slice(0, 10)
      if (itemDate < start || itemDate > end) return false
    }

    return true
  })
}

/** 排序：最新加工日期优先 */
export function sortProcessingRecords(records: ProcessingRecord[]): ProcessingRecord[] {
  return [...records].sort((a, b) => {
    return new Date(b.processingTime).getTime() - new Date(a.processingTime).getTime()
  })
}

/** 分页切片 */
export function paginateProcessingRecords(
  records: ProcessingRecord[],
  page: number,
  pageSize: number
): ProcessingRecord[] {
  const start = (page - 1) * pageSize
  return records.slice(start, start + pageSize)
}

/** 格式化双行时间 */
export function splitDateTime(dateTimeStr: string): { date: string; time: string } {
  if (!dateTimeStr) return { date: "--", time: "--" }
  const parts = dateTimeStr.split(" ")
  return {
    date: parts[0] || "--",
    time: parts[1] || "--",
  }
}

