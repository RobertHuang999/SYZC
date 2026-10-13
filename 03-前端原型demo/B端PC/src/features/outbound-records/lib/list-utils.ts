import type { OutboundRecord, OutboundRecordFilters } from "../domain/types"

export function filterOutboundRecords(
  records: OutboundRecord[],
  filters: OutboundRecordFilters
): OutboundRecord[] {
  return records.filter((item) => {
    // 强制过滤已通过 APPROVED (O13)
    if (item.statusCode !== "APPROVED") return false

    if (filters.orderNo.trim()) {
      const q = filters.orderNo.trim()
      if (!item.id.includes(q) && !item.orderNo.includes(q)) return false
    }

    if (filters.ownerKeyword.trim()) {
      const q = filters.ownerKeyword.trim()
      const matchOwner =
        item.ownerName.includes(q) ||
        item.ownerIdentifier.includes(q) ||
        (item.ownerPhone && item.ownerPhone.includes(q))
      if (!matchOwner) return false
    }

    if (filters.type !== "全部" && item.type !== filters.type) {
      return false
    }

    if (filters.warehouseName !== "全部" && item.warehouseName !== filters.warehouseName) {
      return false
    }

    if (filters.goodsName.trim()) {
      const q = filters.goodsName.trim()
      const matchGoods =
        item.goodsSummary.includes(q) ||
        item.goodsList.some((g) => g.goodsName.includes(q))
      if (!matchGoods) return false
    }

    if (filters.createdBy !== "全部" && item.createdByName !== filters.createdBy) {
      return false
    }

    if (filters.outboundStartDate && item.outboundTime < filters.outboundStartDate) {
      return false
    }
    if (filters.outboundEndDate && item.outboundTime > `${filters.outboundEndDate} 23:59:59`) {
      return false
    }

    if (filters.createStartDate && item.createTime < filters.createStartDate) {
      return false
    }
    if (filters.createEndDate && item.createTime > `${filters.createEndDate} 23:59:59`) {
      return false
    }

    return true
  })
}

export function sortOutboundRecords(records: OutboundRecord[]): OutboundRecord[] {
  return [...records].sort((a, b) => {
    // 默认按出库日期倒序；相同时按单号倒序
    if (a.outboundTime !== b.outboundTime) {
      return b.outboundTime.localeCompare(a.outboundTime)
    }
    return b.id.localeCompare(a.id)
  })
}

export function paginateOutboundRecords(
  records: OutboundRecord[],
  page: number,
  pageSize: number
): OutboundRecord[] {
  const start = (page - 1) * pageSize
  return records.slice(start, start + pageSize)
}

export function formatOutboundQuantity(amount: number, unit = "吨"): string {
  return `${amount.toLocaleString("zh-CN", { maximumFractionDigits: 3 })} ${unit}`
}

export function formatGoodsNamesForList(names: string[]): string {
  return names.join("，")
}

export function splitDateTime(dateTimeStr: string): { date: string; time: string } {
  const parts = dateTimeStr.trim().split(" ")
  return {
    date: parts[0] || "",
    time: parts[1] || "",
  }
}

export function splitOrderNoForDisplay(orderNo: string): { head: string; tail: string } {
  if (orderNo.length > 10) {
    return {
      head: orderNo.slice(0, 10),
      tail: orderNo.slice(10),
    }
  }
  return { head: orderNo, tail: "" }
}

