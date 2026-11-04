import type { TransferFormState } from "../domain/form-types"

export function calcFormTotals(form: TransferFormState) {
  if (form.transferType === "NORMAL") {
    let categoryCount = 0
    let totalQuantity = 0
    let unit = "吨"

    for (const group of form.normalGroups) {
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

  // PLEDGE / MORTGAGE
  const selectedItems = form.pledgeItems.filter(
    (item) => item.selected && Number(item.transferAmount) > 0
  )
  const categoryCount = new Set(selectedItems.map((i) => i.goodsName)).size
  let totalQuantity = 0
  let unit = "吨"
  for (const item of selectedItems) {
    totalQuantity += Number(item.transferAmount) || 0
    if (item.unit) unit = item.unit
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

  if (!form.transferTime) {
    errors.push("请选择移库日期时间")
  }
  if (!form.ownerName) {
    errors.push("请选择或输入货主名称")
  }

  if (form.transferType === "PLEDGE" || form.transferType === "MORTGAGE") {
    if (!form.relatedId.trim()) {
      errors.push("抵押/质押移库必须选择或输入关联单号")
    }
    const selected = form.pledgeItems.filter((i) => i.selected)
    if (selected.length === 0) {
      errors.push("请至少勾选一行要移库的货物")
    }
    for (const item of selected) {
      if (!item.transferAmount || item.transferAmount <= 0) {
        errors.push(`货物【${item.goodsName}】的移库数量必须大于 0`)
      }
      if (item.transferAmount > item.availableAmount) {
        errors.push(`货物【${item.goodsName}】的移库数量不能超过可用数量 (${item.availableAmount})`)
      }
      if (!item.targetRoomZone) {
        errors.push(`请为已勾选的货物【${item.goodsName}】选择移入库房/分区`)
      }
    }
  } else if (form.transferType === "NORMAL") {
    if (form.normalGroups.length === 0) {
      errors.push("请添加至少一种要移库的货品")
    }
    // 同仓强校验 (R01)
    const warehouseIds = new Set(form.normalGroups.map((g) => g.warehouseId))
    if (warehouseIds.size > 1) {
      errors.push("【同仓移库物理边界强约束】(R01)：移库仅限同一仓库内部，禁止跨仓库移库")
    }

    for (const group of form.normalGroups) {
      for (const d of group.details) {
        if (d.transferAmount <= 0) {
          errors.push(`货物【${d.goodsName}】在储位【${d.sourceRoomZone}】的移库数量必须大于 0`)
        }
        if (d.transferAmount > d.availableAmount) {
          errors.push(`货物【${d.goodsName}】的移库数量不能超过该储位可用数量 (${d.availableAmount})`)
        }
        if (!d.targetRoomZone) {
          errors.push(`请为货物【${d.goodsName}】选择目标移入库房/分区`)
        }
      }
    }
  }

  // 现场照片必传 (R08)
  if (!form.scenePhotos || form.scenePhotos.length === 0) {
    errors.push("【现场照片必传与设备抓拍】(R08)：必须上传现场移库作业照片")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

