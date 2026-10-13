import type { InboundRecord, InboundRecordFilters, InboundApply, InboundApplyFilters } from "../domain/types"

function parseDateOnly(value: string): string {
  return value.trim().split(" ")[0]?.split("T")[0] ?? ""
}

function withinDateRange(
  isoLike: string,
  start: string,
  end: string
): boolean {
  const day = parseDateOnly(isoLike)
  if (!day) return false
  const startDay = parseDateOnly(start)
  const endDay = parseDateOnly(end)
  if (startDay && day < startDay) return false
  if (endDay && day > endDay) return false
  return true
}

export function filterInboundApplies(
  rows: InboundApply[],
  filters: InboundApplyFilters
): InboundApply[] {
  const ownerKw = filters.ownerKeyword.trim().toLowerCase()
  const statusStr = filters.checkStatus.trim()

  return rows.filter((row) => {
    if (ownerKw) {
      const haystack = `${row.ownerName} ${row.ownerMobile || ""} ${row.ownerNo || ""} ${row.orderNo}`.toLowerCase()
      if (!haystack.includes(ownerKw)) {
        return false
      }
    }
    if (statusStr !== "" && String(row.checkStatus) !== statusStr) {
      return false
    }
    return true
  })
}

export function sortInboundApplies(rows: InboundApply[]): InboundApply[] {
  return [...rows].sort((a, b) => {
    return b.inboundTime.localeCompare(a.inboundTime)
  })
}

export function filterInboundRecords(
  rows: InboundRecord[],
  filters: InboundRecordFilters
): InboundRecord[] {
  const keyword = filters.orderNo.trim()
  const ownerKw = filters.ownerKeyword.trim().toLowerCase()

  return rows.filter((row) => {
    if (keyword && !row.orderNo.includes(keyword)) {
      return false
    }
    if (
      filters.inboundDateStart ||
      filters.inboundDateEnd
    ) {
      if (
        !withinDateRange(
          row.inboundDate,
          filters.inboundDateStart,
          filters.inboundDateEnd
        )
      ) {
        return false
      }
    }
    if (ownerKw) {
      const haystack = `${row.ownerName} ${row.ownerIdentifierMasked}`.toLowerCase()
      if (!haystack.includes(ownerKw)) {
        return false
      }
    }
    if (
      filters.inboundType !== "全部" &&
      row.inboundType !== filters.inboundType
    ) {
      return false
    }
    if (
      filters.warehouseName !== "全部" &&
      row.warehouseName !== filters.warehouseName
    ) {
      return false
    }
    if (filters.goodsSpec !== "全部") {
      const joined = row.goodsNames.join("，")
      if (!joined.includes(filters.goodsSpec)) {
        return false
      }
    }
    if (filters.creator !== "全部" && row.creatorDisplay !== filters.creator) {
      return false
    }
    if (filters.createdAtStart || filters.createdAtEnd) {
      if (
        !withinDateRange(
          row.createdAt,
          filters.createdAtStart,
          filters.createdAtEnd
        )
      ) {
        return false
      }
    }
    return true
  })
}

export function sortInboundRecords(rows: InboundRecord[]): InboundRecord[] {
  return [...rows].sort((a, b) => {
    const dateCmp = b.inboundDate.localeCompare(a.inboundDate)
    if (dateCmp !== 0) return dateCmp
    return b.orderNo.localeCompare(a.orderNo)
  })
}

export function paginateInboundRecords<T>(
  rows: T[],
  page: number,
  pageSize: number
): T[] {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}

export function formatInboundQuantity(amount: number): string {
  return amount.toLocaleString("zh-CN", { maximumFractionDigits: 2 })
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

