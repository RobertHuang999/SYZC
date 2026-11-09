import type { AbnormalFormState, InStockItem } from "../domain/form-types"

export function createInitialAbnormalFormState(stock: InStockItem | null = null): AbnormalFormState {
  return {
    stockId: stock ? stock.stockId : "",
    selectedStock: stock,
    afterQty: "",
    abnormalType: "",
    reason: "",
    photos: [],
  }
}

export interface DiffCalcResult {
  beforeQty: number
  afterQty: number
  diffQty: number
  diffText: string
  trend: "INCREASE" | "DECREASE" | "EQUAL" | "INVALID"
  errorMsg?: string
}

/**
 * 试算差额 ΔQ = 异动后数量 - 异动前可用数量 (R04, R05)
 */
export function calculateAbnormalDiff(beforeQty: number, afterQtyStr: string, unit: string): DiffCalcResult {
  const trimmed = afterQtyStr.trim()
  if (!trimmed) {
    return {
      beforeQty,
      afterQty: 0,
      diffQty: 0,
      diffText: "",
      trend: "INVALID",
    }
  }

  const parsed = parseFloat(trimmed)
  if (isNaN(parsed) || parsed <= 0) {
    return {
      beforeQty,
      afterQty: parsed,
      diffQty: 0,
      diffText: "异动后数量必须大于0",
      trend: "INVALID",
      errorMsg: "异动后数量必须大于0",
    }
  }

  const diff = Number((parsed - beforeQty).toFixed(4))
  if (diff > 0) {
    return {
      beforeQty,
      afterQty: parsed,
      diffQty: diff,
      diffText: `现存量 ${parsed}${unit} ⬆ 增量 +${diff}${unit}`,
      trend: "INCREASE",
    }
  } else if (diff < 0) {
    return {
      beforeQty,
      afterQty: parsed,
      diffQty: diff,
      diffText: `现存量 ${parsed}${unit} ⬇ 减量 ${diff}${unit}`,
      trend: "DECREASE",
    }
  } else {
    return {
      beforeQty,
      afterQty: parsed,
      diffQty: 0,
      diffText: `异动后数量未发生改变，无需调整`,
      trend: "EQUAL",
      errorMsg: "异动后数量未发生改变，无需提交异动申请",
    }
  }
}

