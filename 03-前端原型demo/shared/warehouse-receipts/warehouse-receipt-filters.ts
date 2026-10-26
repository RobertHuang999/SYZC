import type { ReceiptStatus, WarehouseReceipt } from "./warehouse-receipt-types"

export type ReceiptThirdPartyFilter = "全部" | "是" | "否"

export type ReceiptFilters = {
  /** 仓单编号（前缀/模糊） */
  code: string
  /** 开立时间范围，YYYY-MM-DD */
  establishedStart: string
  establishedEnd: string
  /** 存货人/持有人/货品综合模糊搜索 */
  keyword: string
  /** 仓库名称，「全部」表示不限 */
  warehouse: string
  /** 货品大类，单选，「全部」表示不限 */
  goodsCategory: string
  /** 大类下的品类多选；空数组表示不限 */
  goodsVarieties: string[]
  thirdParty: ReceiptThirdPartyFilter
  /** 仓单状态多选；空数组表示不限 */
  statuses: ReceiptStatus[]
  /** 制单人展示串，「全部」表示不限 */
  creator: string
  /** 制单时间范围，YYYY-MM-DD */
  createdStart: string
  createdEnd: string
}

export const EMPTY_RECEIPT_FILTERS: ReceiptFilters = {
  code: "",
  establishedStart: "",
  establishedEnd: "",
  keyword: "",
  warehouse: "全部",
  goodsCategory: "全部",
  goodsVarieties: [],
  thirdParty: "全部",
  statuses: [],
  creator: "全部",
  createdStart: "",
  createdEnd: "",
}

function dayOf(value: string): string {
  return value.trim().split(" ")[0]?.split("T")[0] ?? ""
}

function inDayRange(day: string, start: string, end: string): boolean {
  if (!start && !end) return true
  if (!day) return false
  if (start && day < start) return false
  if (end && day > end) return false
  return true
}

export function matchReceiptFilters(
  receipt: WarehouseReceipt,
  filters: ReceiptFilters,
): boolean {
  const code = filters.code.trim().toLowerCase()
  if (code && !receipt.code.toLowerCase().includes(code)) return false

  if (
    !inDayRange(
      dayOf(receipt.establishedAt),
      filters.establishedStart,
      filters.establishedEnd,
    )
  ) {
    return false
  }
  if (
    !inDayRange(dayOf(receipt.createdAt), filters.createdStart, filters.createdEnd)
  ) {
    return false
  }

  if (filters.warehouse !== "全部" && receipt.warehouseName !== filters.warehouse) {
    return false
  }

  if (
    filters.thirdParty !== "全部" &&
    receipt.thirdPartyRegistered !== (filters.thirdParty === "是")
  ) {
    return false
  }

  if (filters.statuses.length > 0 && !filters.statuses.includes(receipt.status)) {
    return false
  }

  if (filters.creator !== "全部" && receipt.creatorDisplay !== filters.creator) {
    return false
  }

  if (filters.goodsCategory !== "全部") {
    const groups = receipt.goodsGroups.filter(
      (group) => group.category === filters.goodsCategory,
    )
    if (groups.length === 0) return false
    if (
      filters.goodsVarieties.length > 0 &&
      !groups.some((group) => filters.goodsVarieties.includes(group.variety))
    ) {
      return false
    }
  }

  const keyword = filters.keyword.trim().toLowerCase()
  if (!keyword) return true

  const haystack = [
    receipt.owner.name,
    receipt.owner.identifier,
    receipt.holder.name,
    receipt.holder.identifier,
    receipt.warehouseName,
    ...receipt.goodsGroups.flatMap((group) => [
      group.name,
      group.category,
      group.variety,
      group.spec,
    ]),
  ]
    .join(" ")
    .toLowerCase()

  return haystack.includes(keyword)
}

/** 列表默认按开立时间倒序 */
export function sortReceiptsByEstablishedDesc(
  receipts: WarehouseReceipt[],
): WarehouseReceipt[] {
  return [...receipts].sort((a, b) =>
    a.establishedAt < b.establishedAt ? 1 : -1,
  )
}

export function paginateReceipts<T>(rows: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}
