import type { TransferFormState } from "../domain/form-types"

/** 汇总转让货品的品类数与总数量（按一级货品分组统计） */
export function calcFormTotals(form: TransferFormState) {
  let categoryCount = 0
  let totalQuantity = 0
  let unit = "吨"

  for (const group of form.goodsGroups) {
    const activeDetails = group.details.filter((d) => d.transferAmount > 0)
    if (activeDetails.length > 0) {
      categoryCount += 1
      for (const d of activeDetails) {
        totalQuantity += Number(d.transferAmount) || 0
        if (d.unit) unit = d.unit
      }
    }
  }

  return {
    categoryCount,
    totalQuantity: Math.round(totalQuantity * 10000) / 10000,
    unit,
  }
}

export function validateTransferForm(form: TransferFormState): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!form.assignTime) {
    errors.push("请选择转让日期时间")
  }
  if (!form.sourceOwnerName) {
    errors.push("请选择转让方名称")
  }
  if (!form.sourceOwnerIdentity) {
    errors.push("请填写货主标识")
  }
  if (!form.assignReason.trim()) {
    errors.push("请填写转让原因说明")
  }

  if (form.goodsGroups.length === 0) {
    errors.push("请添加至少一种要转让的货品")
  }

  // 同仓强约束：转让货物必须位于同一仓库内部
  const warehouseIds = new Set(form.goodsGroups.map((g) => g.warehouseId))
  if (warehouseIds.size > 1) {
    errors.push("转让货物必须位于同一仓库内部，禁止跨仓库转让")
  }

  for (const group of form.goodsGroups) {
    for (const d of group.details) {
      if (d.transferAmount <= 0) {
        errors.push(`货物【${group.goodsName}】的转让数量必须大于 0`)
      }
      if (d.transferAmount > d.availableAmount) {
        errors.push(
          `货物【${group.goodsName}】的转让数量不能超过该储位可用数量 (${d.availableAmount})`
        )
      }
    }
  }

  if (!form.targetOwner.ownerName.trim()) {
    errors.push("请填写接收方姓名/全称")
  }
  if (!form.targetOwner.ownerIdentity.trim()) {
    errors.push("请填写接收方手机/信用代码")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
