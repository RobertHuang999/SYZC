import type {
  BookSummaryItem,
  InventoryDetailItem,
  InventoryCheckStats,
  CheckResult,
  AnomalyHandlingStatus,
  AnomalyItemStatus,
  InventoryCheckRecord,
  CheckListFilterParams,
} from "../domain/types"

/** 判断单行是否满足四大异常指标 (R09) */
export function judgeRowAnomaly(
  isExist: '是' | '否' | null | undefined,
  isIntact: '是' | '否' | null | undefined,
  isLocationMatch: '是' | '否' | null | undefined,
  countedQty: number | '无需盘点' | null | undefined,
  snapshotQty: number
): {
  isAnomaly: boolean
  notExist: boolean
  damaged: boolean
  locationMismatch: boolean
  qtyMismatch: boolean
} {
  const notExist = isExist === '否'
  const damaged = isIntact === '否'
  const locationMismatch = isLocationMatch === '否'

  let qtyMismatch = false
  if (countedQty !== null && countedQty !== undefined && countedQty !== '无需盘点') {
    qtyMismatch = Number(countedQty) !== Number(snapshotQty)
  }

  const isAnomaly = notExist || damaged || locationMismatch || qtyMismatch

  return {
    isAnomaly,
    notExist,
    damaged,
    locationMismatch,
    qtyMismatch,
  }
}

/** 计算库存明细详情页四大看板率值 (R12) */
export function calculateInventoryCheckStats(items: InventoryDetailItem[]): InventoryCheckStats {
  const totalBarcodes = items.length
  let countedBarcodes = 0
  let notExistCount = 0
  let damagedCount = 0
  let locationMismatchCount = 0
  let qtyMismatchCount = 0
  let anomalyGoodsCount = 0

  // 统计库房与分区
  const roomMap = new Map<string, { total: number; counted: number }>()
  const partitionMap = new Map<string, { total: number; counted: number }>()

  items.forEach((item) => {
    const isCounted =
      item.countedQty !== null &&
      item.countedQty !== undefined &&
      item.isExist !== null &&
      item.isIntact !== null &&
      item.isLocationMatch !== null

    if (isCounted) {
      countedBarcodes++
    }

    // 库房聚合
    const roomKey = item.roomName || '默认库房'
    if (!roomMap.has(roomKey)) {
      roomMap.set(roomKey, { total: 0, counted: 0 })
    }
    const roomStat = roomMap.get(roomKey)!
    roomStat.total++
    if (isCounted) roomStat.counted++

    // 分区聚合
    const partKey = `${item.roomName}-${item.partitionName}`
    if (!partitionMap.has(partKey)) {
      partitionMap.set(partKey, { total: 0, counted: 0 })
    }
    const partStat = partitionMap.get(partKey)!
    partStat.total++
    if (isCounted) partStat.counted++

    // 异常判别
    const anomalyInfo = judgeRowAnomaly(
      item.isExist,
      item.isIntact,
      item.isLocationMatch,
      item.countedQty,
      item.snapshotQty
    )

    if (anomalyInfo.isAnomaly) {
      anomalyGoodsCount++
      if (anomalyInfo.notExist) notExistCount++
      if (anomalyInfo.damaged) damagedCount++
      if (anomalyInfo.locationMismatch) locationMismatchCount++
      if (anomalyInfo.qtyMismatch) qtyMismatchCount++
    }
  })

  // 库房完成数（全部条码已盘）
  let fullyCountedRooms = 0
  roomMap.forEach((v) => {
    if (v.total > 0 && v.counted === v.total) fullyCountedRooms++
  })

  // 分区完成数（全部条码已盘）
  let fullyCountedPartitions = 0
  partitionMap.forEach((v) => {
    if (v.total > 0 && v.counted === v.total) fullyCountedPartitions++
  })

  const barcodePercent = totalBarcodes > 0 ? Math.round((countedBarcodes / totalBarcodes) * 100) : 0
  const roomPercent = roomMap.size > 0 ? Math.round((fullyCountedRooms / roomMap.size) * 100) : 0
  const partPercent = partitionMap.size > 0 ? Math.round((fullyCountedPartitions / partitionMap.size) * 100) : 0

  return {
    barcodeRate: {
      total: totalBarcodes,
      counted: countedBarcodes,
      percentage: barcodePercent,
    },
    partitionRate: {
      total: partitionMap.size,
      counted: fullyCountedPartitions,
      percentage: partPercent,
    },
    roomRate: {
      total: roomMap.size,
      counted: fullyCountedRooms,
      percentage: roomPercent,
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

/** 账面汇总明细统计 */
export function calculateBookSummaryStats(items: BookSummaryItem[]) {
  const goodsTypeTotal = items.length
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
    const isCounted =
      item.countedQty !== null &&
      item.countedQty !== undefined &&
      item.isExist !== null &&
      item.isIntact !== null &&
      item.isLocationMatch !== null

    if (isCounted) {
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
    goodsTypeTotal,
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

/** 列表多条件过滤函数 */
export function filterCheckRecords(
  records: InventoryCheckRecord[],
  filters: CheckListFilterParams
): InventoryCheckRecord[] {
  return records.filter((rec) => {
    // 盘点单号（精确匹配）
    if (filters.checkNo.trim() && !rec.checkNo.toLowerCase().includes(filters.checkNo.trim().toLowerCase())) {
      return false
    }
    // 任务名称（模糊匹配）
    if (filters.taskName.trim() && !rec.taskName.toLowerCase().includes(filters.taskName.trim().toLowerCase())) {
      return false
    }
    // 盘点类型
    if (filters.checkType !== "ALL" && rec.checkType !== filters.checkType) {
      return false
    }
    // 仓库名称
    if (filters.warehouseName !== "ALL" && rec.warehouseName !== filters.warehouseName) {
      return false
    }
    // 盘点状态
    if (filters.status !== "ALL" && rec.status !== filters.status) {
      return false
    }
    // 盘点结果
    if (filters.result !== "ALL" && rec.result !== filters.result) {
      return false
    }
    // 实际盘点人员
    if (filters.actualUsers.length > 0) {
      const match = filters.actualUsers.some((u) => rec.actualUsers.includes(u))
      if (!match) return false
    }
    // 制单人
    if (filters.creator !== "ALL" && !rec.creatorName.includes(filters.creator)) {
      return false
    }
    // 盘点开始时间范围
    if (filters.startDate && rec.startDate < filters.startDate) {
      return false
    }
    if (filters.endDate && rec.startDate > filters.endDate) {
      return false
    }
    // 制单时间范围
    if (filters.createdStartTime && rec.createdTime < filters.createdStartTime) {
      return false
    }
    if (filters.createdEndTime && rec.createdTime > filters.createdEndTime) {
      return false
    }

    return true
  })
}

