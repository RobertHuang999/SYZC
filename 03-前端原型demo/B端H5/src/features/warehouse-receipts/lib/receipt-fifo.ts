import type { IssuanceCandidate } from "@prototype/shared/warehouse-receipts/warehouse-receipt-seed"
import { formatReceiptQuantity } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"

export type FifoGoodsLine = {
  /** 货品名称 + 计量单位，作为先入先出的圈选粒度 */
  key: string
  name: string
  unit: string
  category: string
  totalAvailable: number
  batchCount: number
  earliestInboundAt: string
}

export type FifoAllocation = {
  candidate: IssuanceCandidate
  quantity: number
}

export function candidateGoodsKey(candidate: IssuanceCandidate): string {
  return `${candidate.goodsName}|${candidate.unit}`
}

/** 把同一货主、同一仓库下的在库批次按「货品规格 + 单位」汇总，供先入先出选择 */
export function buildFifoGoodsLines(
  candidates: IssuanceCandidate[],
): FifoGoodsLine[] {
  const map = new Map<string, FifoGoodsLine>()

  for (const candidate of candidates) {
    const key = candidateGoodsKey(candidate)
    const existing = map.get(key)
    if (existing) {
      existing.totalAvailable = Number(
        (existing.totalAvailable + candidate.remainQuantity).toFixed(4),
      )
      existing.batchCount += 1
      if (candidate.inboundAt < existing.earliestInboundAt) {
        existing.earliestInboundAt = candidate.inboundAt
      }
      continue
    }
    map.set(key, {
      key,
      name: candidate.goodsName,
      unit: candidate.unit,
      category: candidate.category,
      totalAvailable: candidate.remainQuantity,
      batchCount: 1,
      earliestInboundAt: candidate.inboundAt,
    })
  }

  return [...map.values()].sort((a, b) =>
    a.earliestInboundAt < b.earliestInboundAt ? -1 : 1,
  )
}

/**
 * 先入先出自动圈选：按入库时间从早到晚依次占用批次，直到满足总开立数量。
 * 最后一批不足时按部分数量开立。
 */
export function buildFifoPlan(
  candidates: IssuanceCandidate[],
  goodsKey: string,
  totalQuantity: number,
): FifoAllocation[] {
  if (!goodsKey || !totalQuantity || totalQuantity <= 0) return []

  let remaining = totalQuantity
  const pool = candidates
    .filter((candidate) => candidateGoodsKey(candidate) === goodsKey)
    .sort((a, b) => (a.inboundAt < b.inboundAt ? -1 : 1))

  const plan: FifoAllocation[] = []
  for (const candidate of pool) {
    if (remaining <= 0) break
    const quantity = Math.min(remaining, candidate.remainQuantity)
    if (quantity <= 0) continue
    plan.push({
      candidate,
      quantity: Number(quantity.toFixed(4)),
    })
    remaining = Number((remaining - quantity).toFixed(4))
  }

  return plan
}

export function fifoPlanTotal(plan: FifoAllocation[]): number {
  return Number(
    plan.reduce((sum, item) => sum + item.quantity, 0).toFixed(4),
  )
}

/** 先入先出计划的可读摘要，如「9.0099公斤（2 个批次）」 */
export function fifoPlanSummary(plan: FifoAllocation[], unit: string): string {
  if (plan.length === 0) return "0"
  return `${formatReceiptQuantity(fifoPlanTotal(plan))}${unit}（${plan.length} 个批次）`
}
