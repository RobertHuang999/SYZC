import type { OutboundFormState } from "../domain/form-types"
import type { OutboundGoodsItem, OutboundTypeName } from "../domain/types"

export function formatDateNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const min = pad(d.getMinutes())
  const ss = pad(d.getSeconds())
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}

export function createInitialFormState(): OutboundFormState {
  return {
    outboundDate: formatDateNow(),
    ownerType: "企业",
    ownerName: "",
    ownerIdentifier: "",
    contactPhone: "",
    ownerIdCard: "",
    type: "普通出库",
    relatedNo: "",
    warehouseName: "",
    notes: "",
    goodsList: [],
    pickupPersonType: "个人",
    pickupName: "",
    pickupIdCardNo: "",
    pickupPhone: "",
    pickupIdentity: "",
    pickupOperator: "",
    pickupAgentPartnerId: "",
    plateNo: "",
    sitePhotos: [],
  }
}


/** 实时试算合计栏 */
export function calcFormTotals(
  goodsList: OutboundGoodsItem[],
  type: OutboundTypeName
): {
  categoryCount: number
  totalAmount: number
  totalValueWan: number
  unit: string
} {
  if (!goodsList || goodsList.length === 0) {
    return { categoryCount: 0, totalAmount: 0, totalValueWan: 0, unit: "吨" }
  }

  const isRelated = type === "仓单出库" || type === "质押出库" || type === "抵押出库"

  if (isRelated) {
    // 关联出库：品类数按勾选行计数；总数量和价值只统计已勾选且数量有效的行 (O02)
    const selectedRows = goodsList.filter((g) => g.selected)
    const categoryCount = selectedRows.length
    let totalAmount = 0
    let totalValueYuan = 0
    let mainUnit = "吨"

    selectedRows.forEach((row) => {
      const amt = Number(row.totalOutboundAmount) || 0
      if (amt > 0) {
        totalAmount += amt
        if (row.price) {
          totalValueYuan += amt * row.price
        }
      }
      if (row.unit) mainUnit = row.unit
    })

    return {
      categoryCount,
      totalAmount: Math.round(totalAmount * 10000) / 10000,
      totalValueWan: Math.round((totalValueYuan / 10000) * 100) / 100,
      unit: mainUnit,
    }
  } else {
    // 普通出库：按货物规格去重；已选位置出库数量之和 (O01)
    const uniqueSpecs = new Set(goodsList.map((g) => g.goodsName))
    let totalAmount = 0
    let mainUnit = "吨"

    goodsList.forEach((row) => {
      if (row.locations && row.locations.length > 0) {
        row.locations.forEach((loc) => {
          totalAmount += Number(loc.outboundAmount) || 0
          if (loc.unit) mainUnit = loc.unit
        })
      } else {
        totalAmount += Number(row.totalOutboundAmount) || 0
        if (row.unit) mainUnit = row.unit
      }
    })

    return {
      categoryCount: uniqueSpecs.size,
      totalAmount: Math.round(totalAmount * 10000) / 10000,
      totalValueWan: 0,
      unit: mainUnit,
    }
  }
}

/** 检查表单脏状态（未保存离开确认） */
export function formHasDirtyFields(form: OutboundFormState): boolean {
  if (form.ownerName.trim()) return true
  if (form.relatedNo.trim()) return true
  if (form.notes.trim()) return true
  if (form.goodsList.length > 0) return true
  if (form.pickupName.trim()) return true
  if (form.sitePhotos.length > 0) return true
  return false
}

/** 提交前置校验结果 */
export interface ValidationResult {
  valid: boolean
  message?: string
}

export function validateOutboundForm(form: OutboundFormState): ValidationResult {
  if (!form.outboundDate) {
    return { valid: false, message: "请选择出库日期" }
  }

  // O04 严禁选择未来时间
  const now = new Date().getTime()
  const chosen = new Date(form.outboundDate.replace(/-/g, "/")).getTime()
  if (chosen > now + 60000) {
    return { valid: false, message: "出库日期严禁选择未来时间（O04）" }
  }

  if (!form.ownerName) {
    return { valid: false, message: "请输入/选择货主名称" }
  }

  const isRelated =
    form.type === "仓单出库" || form.type === "质押出库" || form.type === "抵押出库"

  if (isRelated && !form.relatedNo) {
    return { valid: false, message: "请选择有效关联单号（O02）" }
  }

  if (!form.goodsList || form.goodsList.length === 0) {
    return { valid: false, message: "请添加或关联出库货品（C03）" }
  }

  if (isRelated) {
    const selectedRows = form.goodsList.filter((g) => g.selected)
    if (selectedRows.length === 0) {
      return { valid: false, message: "请至少勾选一行出库货物（O02）" }
    }
    for (const row of selectedRows) {
      const amt = Number(row.totalOutboundAmount)
      if (!amt || amt <= 0) {
        return {
          valid: false,
          message: `已勾选货物【${row.goodsName}】出库数量必须大于 0（O06）`,
        }
      }
      if (row.availableAmount && amt > row.availableAmount) {
        return {
          valid: false,
          message: `货物【${row.goodsName}】出库数量不得大于可用数量（C04）`,
        }
      }
    }
  } else {
    // 普通出库
    let hasValidAmount = false
    for (const row of form.goodsList) {
      if (row.locations && row.locations.length > 0) {
        for (const loc of row.locations) {
          const amt = Number(loc.outboundAmount)
          if (amt > 0) {
            hasValidAmount = true
          }
          if (amt > loc.availableAmount) {
            return {
              valid: false,
              message: `库存位置【${loc.locationPath}】出库数量不得大于可用数量（C04）`,
            }
          }
        }
      } else {
        const amt = Number(row.totalOutboundAmount)
        if (amt > 0) hasValidAmount = true
      }
    }
    if (!hasValidAmount) {
      return { valid: false, message: "请至少在一个库存位置录入出库数量（O06）" }
    }
  }

  // 提货信息校验
  if (form.pickupPersonType === "个人") {
    if (!form.pickupName.trim()) {
      return { valid: false, message: "请填写提货人姓名" }
    }
    if (!form.pickupPhone.trim()) {
      return { valid: false, message: "请填写提货人电话" }
    }
    if (!form.pickupIdCardNo.trim()) {
      return { valid: false, message: "个人提货人请填写身份证号" }
    }
  } else {
    // 企业提货
    if (!form.pickupName.trim()) {
      return { valid: false, message: "请填写提货企业名称" }
    }
    if (!form.pickupIdentity?.trim()) {
      return { valid: false, message: "企业提货请填写统一社会信用代码" }
    }
    if (!form.pickupOperator?.trim()) {
      return { valid: false, message: "企业提货请填写经办人姓名" }
    }
    if (!form.pickupPhone.trim()) {
      return { valid: false, message: "企业提货请填写经办人电话" }
    }
  }

  // C06 现场照片缺失校验
  if (!form.sitePhotos || form.sitePhotos.length === 0) {
    return { valid: false, message: "请上传出库现场照片（C06）" }
  }

  if (form.notes && form.notes.length > 140) {
    return { valid: false, message: "备注不能超过 140 字" }
  }

  return { valid: true }
}
