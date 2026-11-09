import type {
  BookSummaryItem,
  CheckListFilters,
  InventoryCheckRecord,
  InventoryCheckStats,
  InventoryDetailItem,
} from "../domain/types"

/** 四大异常判别：不存在 / 损坏 / 位置不符 / 数量不符 */
export function judgeRowAnomaly(
  isExist: "是" | "否" | null | undefined,
  isIntact: "是" | "否" | null | undefined,
  isLocationMatch: "是" | "否" | null | undefined,
  countedQty: number | "无需盘点" | null | undefined,
  snapshotQty: number
) {
  const notExist = isExist === "否"
  const damaged = isIntact === "否"
  const locationMismatch = isLocationMatch === "否"

  let qtyMismatch = false
  if (countedQty !== null && countedQty !== undefined && countedQty !== "无需盘点") {
    qtyMismatch = Number(countedQty) !== Number(snapshotQty)
  }

  return {
    isAnomaly: notExist || damaged || locationMismatch || qtyMismatch,
    notExist,
    damaged,
    locationMismatch,
    qtyMismatch,
  }
}

function isRowCounted(
  countedQty: number | "无需盘点" | null,
  isExist: "是" | "否" | null,
  isIntact: "是" | "否" | null,
  isLocationMatch: "是" | "否" | null
) {
  return (
    countedQty !== null &&
    isExist !== null &&
    isIntact !== null &&
    isLocationMatch !== null
  )
}

/** 库存明细模式：条码 / 分区 / 库房完成率 + 异常细分 */
export function calculateInventoryCheckStats(
  items: InventoryDetailItem[]
): InventoryCheckStats {
  let countedBarcodes = 0
  let notExistCount = 0
  let damagedCount = 0
  let locationMismatchCount = 0
  let qtyMismatchCount = 0
  let anomalyGoodsCount = 0

  const roomMap = new Map<string, { total: number; counted: number }>()
  const partitionMap = new Map<string, { total: number; counted: number }>()

  items.forEach((item) => {
    const counted = isRowCounted(
      item.countedQty,
      item.isExist,
      item.isIntact,
      item.isLocationMatch
    )
    if (counted) countedBarcodes++

    const roomKey = item.roomName || "默认库房"
    const roomStat = roomMap.get(roomKey) ?? { total: 0, counted: 0 }
    roomStat.total++
    if (counted) roomStat.counted++
    roomMap.set(roomKey, roomStat)

    const partitionKey = `${item.roomName}-${item.partitionName}`
    const partitionStat = partitionMap.get(partitionKey) ?? { total: 0, counted: 0 }
    partitionStat.total++
    if (counted) partitionStat.counted++
    partitionMap.set(partitionKey, partitionStat)

    const anomaly = judgeRowAnomaly(
      item.isExist,
      item.isIntact,
      item.isLocationMatch,
      item.countedQty,
      item.snapshotQty
    )
    if (anomaly.isAnomaly) {
      anomalyGoodsCount++
      if (anomaly.notExist) notExistCount++
      if (anomaly.damaged) damagedCount++
      if (anomaly.locationMismatch) locationMismatchCount++
      if (anomaly.qtyMismatch) qtyMismatchCount++
    }
  })

  let fullyCountedRooms = 0
  roomMap.forEach((value) => {
    if (value.total > 0 && value.counted === value.total) fullyCountedRooms++
  })

  let fullyCountedPartitions = 0
  partitionMap.forEach((value) => {
    if (value.total > 0 && value.counted === value.total) fullyCountedPartitions++
  })

  const percent = (counted: number, total: number) =>
    total > 0 ? Math.round((counted / total) * 100) : 0

  return {
    barcodeRate: {
      total: items.length,
      counted: countedBarcodes,
      percentage: percent(countedBarcodes, items.length),
    },
    partitionRate: {
      total: partitionMap.size,
      counted: fullyCountedPartitions,
      percentage: percent(fullyCountedPartitions, partitionMap.size),
    },
    roomRate: {
      total: roomMap.size,
      counted: fullyCountedRooms,
      percentage: percent(fullyCountedRooms, roomMap.size),
    },
    anomalyGoodsCount,
    anomalyBreakdown: {
      notExist: notExistCount,
      damaged: damagedCount,
      locationMismatch: locationMismatchCount,
      qtyMismatch: qtyMismatchCount,
    },
  }
}

/** 账面汇总模式：货品类型 / 库存总量 / 已盘点 / 异常细分 */
export function calculateBookSummaryStats(items: BookSummaryItem[]) {
  let goodsTypeCounted = 0
  let totalSnapshotQty = 0
  let totalCountedSnapshotQty = 0
  let anomalyCount = 0
  let notExistCount = 0
  let damagedCount = 0
  let locationMismatchCount = 0
  let qtyMismatchCount = 0

  items.forEach((item) => {
    totalSnapshotQty += item.snapshotQty
    const counted = isRowCounted(
      item.countedQty,
      item.isExist,
      item.isIntact,
      item.isLocationMatch
    )
    if (counted) {
      goodsTypeCounted++
      totalCountedSnapshotQty += item.snapshotQty
    }

    const anomaly = judgeRowAnomaly(
      item.isExist,
      item.isIntact,
      item.isLocationMatch,
      item.countedQty,
      item.snapshotQty
    )
    if (anomaly.isAnomaly) {
      anomalyCount++
      if (anomaly.notExist) notExistCount++
      if (anomaly.damaged) damagedCount++
      if (anomaly.locationMismatch) locationMismatchCount++
      if (anomaly.qtyMismatch) qtyMismatchCount++
    }
  })

  return {
    goodsTypeTotal: items.length,
    goodsTypeCounted,
    totalSnapshotQty,
    totalCountedSnapshotQty,
    anomalyCount,
    notExistCount,
    damagedCount,
    locationMismatchCount,
    qtyMismatchCount,
  }
}

/** 列表筛选：维度与 PC 一致，只改承载方式 */
export function filterCheckRecords(
  records: InventoryCheckRecord[],
  filters: CheckListFilters
): InventoryCheckRecord[] {
  const keyword = filters.keyword.trim().toLowerCase()
  const taskName = filters.taskName.trim().toLowerCase()

  return records.filter((record) => {
    if (keyword) {
      const hit =
        record.checkNo.toLowerCase().includes(keyword) ||
        record.taskName.toLowerCase().includes(keyword)
      if (!hit) return false
    }
    if (taskName && !record.taskName.toLowerCase().includes(taskName)) {
      return false
    }
    if (filters.checkType !== "ALL" && record.checkType !== filters.checkType) {
      return false
    }
    if (
      filters.warehouseName !== "ALL" &&
      record.warehouseName !== filters.warehouseName
    ) {
      return false
    }
    if (filters.status !== "ALL" && record.status !== filters.status) {
      return false
    }
    if (filters.result !== "ALL" && record.result !== filters.result) {
      return false
    }
    if (
      filters.actualUsers.length > 0 &&
      !filters.actualUsers.some((user) => record.actualUsers.includes(user))
    ) {
      return false
    }
    if (
      filters.creator !== "ALL" &&
      !record.creatorName.includes(filters.creator)
    ) {
      return false
    }
    if (filters.startDate && record.startDate < filters.startDate) {
      return false
    }
    if (filters.endDate && record.startDate > filters.endDate) {
      return false
    }
    return true
  })
}
