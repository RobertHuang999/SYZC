import type { InputGoodsGroup, OutputGoodsItem } from "../domain/types"

/** 计算投入货品品类数 */
export function calculateInputCategoryCount(groups: InputGoodsGroup[]): number {
  return groups.length
}

/** 计算投入货品总数量 */
export function calculateInputTotalQuantity(groups: InputGoodsGroup[]): number {
  let total = 0
  for (const group of groups) {
    for (const detail of group.details) {
      total += Number(detail.planAmount || 0)
    }
  }
  return parseFloat(total.toFixed(4))
}

/** 计算预计产出总金额 */
export function calculateExpectedOutputTotalAmount(items: OutputGoodsItem[]): {
  totalAmount: number
  hasUnpriced: boolean
} {
  let total = 0
  let hasUnpriced = false

  for (const item of items) {
    if (typeof item.price === "number" && item.price > 0) {
      total += (Number(item.expectedQty) || 0) * item.price
    } else {
      hasUnpriced = true
    }
  }

  return {
    totalAmount: parseFloat(total.toFixed(2)),
    hasUnpriced,
  }
}

/** 格式化金额（千分位，2位小数） */
export function formatCurrency(amount: number | null | undefined): string {
  if (typeof amount !== "number" || isNaN(amount)) return "--"
  return `¥${amount.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/** 格式化数字（千分位，最多 4 位小数） */
export function formatQuantity(qty: number | null | undefined): string {
  if (typeof qty !== "number" || isNaN(qty)) return "--"
  return qty.toLocaleString("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
}

