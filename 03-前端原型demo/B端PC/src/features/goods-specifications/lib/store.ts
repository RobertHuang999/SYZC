import { useSyncExternalStore } from "react"
import {
  MOCK_GOODS_SKUS,
  MOCK_INBOUND_COLLECT_FIELDS,
  MOCK_MAJOR_CATEGORIES,
  MOCK_SHELF_LIFE_UNIT_CONFIG,
  MOCK_SUBCATEGORIES,
} from "../mock/goods-spec.mock"
import type {
  GoodsInboundCollectConfig,
  GoodsSku,
  GoodsStatus,
  InboundCollectControlType,
  InboundCollectFieldConfig,
  MajorCategory,
  PriceTrendPoint,
  ShelfLifeUnitConfig,
  Subcategory,
} from "../domain/types"

const DEFAULT_OPERATOR = "当前用户"

let categories: MajorCategory[] = MOCK_MAJOR_CATEGORIES.map((item) => ({
  ...item,
}))
let subcategories: Subcategory[] = MOCK_SUBCATEGORIES.map((item) => ({
  ...item,
  specDimensions: [...item.specDimensions],
}))
let skus: GoodsSku[] = MOCK_GOODS_SKUS.map((item) => ({
  ...item,
  specValues: { ...item.specValues },
  inboundCollect: item.inboundCollect.map((collect) => ({ ...collect })),
  priceHistory: item.priceHistory.map((entry) => ({ ...entry })),
  priceTrend: item.priceTrend.map((point) => ({ ...point })),
}))
let inboundCollectFields: InboundCollectFieldConfig[] = MOCK_INBOUND_COLLECT_FIELDS.map(
  (item) => ({
    ...item,
    options: item.options ? [...item.options] : undefined,
  })
)
let shelfLifeUnitConfig: ShelfLifeUnitConfig = {
  ...MOCK_SHELF_LIFE_UNIT_CONFIG,
}


let revision = 0
const listeners = new Set<() => void>()

function emit() {
  revision += 1
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return revision
}

export function useGoodsSpecRevision() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

export function nowStamp(): string {
  const date = new Date()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function todayDate(): string {
  const date = new Date()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function listMajorCategories(): MajorCategory[] {
  return categories
}

export function listSubcategories(categoryId?: string): Subcategory[] {
  if (!categoryId) return subcategories
  return subcategories.filter((item) => item.categoryId === categoryId)
}

export function listSkus(subcategoryId?: string): GoodsSku[] {
  if (!subcategoryId) return skus
  return skus.filter((item) => item.subcategoryId === subcategoryId)
}

export function findMajorCategory(id: string | undefined): MajorCategory | undefined {
  if (!id) return undefined
  return categories.find((item) => item.id === id)
}

export function findSubcategory(id: string | undefined): Subcategory | undefined {
  if (!id) return undefined
  return subcategories.find((item) => item.id === id)
}

export function findSku(id: string | undefined): GoodsSku | undefined {
  if (!id) return undefined
  return skus.find((item) => item.id === id)
}

export function categoryNameOf(subcategory: Subcategory | undefined): string {
  if (!subcategory) return "—"
  return findMajorCategory(subcategory.categoryId)?.name ?? "—"
}

export function skusOfSubcategory(subcategoryId: string): GoodsSku[] {
  return skus.filter((item) => item.subcategoryId === subcategoryId)
}

export function subcategoriesOfCategory(categoryId: string): Subcategory[] {
  return subcategories.filter((item) => item.categoryId === categoryId)
}

/** 有效启用：自身、品类、大类三者全部启用 */
export function isSkuEffectivelyEnabled(sku: GoodsSku): boolean {
  if (sku.status !== "ENABLED") return false
  const subcategory = findSubcategory(sku.subcategoryId)
  if (!subcategory || subcategory.status !== "ENABLED") return false
  const category = findMajorCategory(subcategory.categoryId)
  return Boolean(category && category.status === "ENABLED")
}

export function effectiveInvalidReason(sku: GoodsSku): string | undefined {
  if (sku.status !== "ENABLED") return "货品自身已停用"
  const subcategory = findSubcategory(sku.subcategoryId)
  if (!subcategory) return "所属品类不存在"
  if (subcategory.status !== "ENABLED") return "所属品类已停用"
  const category = findMajorCategory(subcategory.categoryId)
  if (!category) return "所属大类不存在"
  if (category.status !== "ENABLED") return "所属大类已停用"
  return undefined
}

function refreshInboundFlags() {
  subcategories = subcategories.map((subcategory) => {
    const hasInboundOrders = skus.some(
      (sku) => sku.subcategoryId === subcategory.id && sku.hasInboundOrders
    )
    return hasInboundOrders === subcategory.hasInboundOrders
      ? subcategory
      : { ...subcategory, hasInboundOrders }
  })

  categories = categories.map((category) => {
    const hasInboundOrders = subcategories.some(
      (subcategory) =>
        subcategory.categoryId === category.id && subcategory.hasInboundOrders
    )
    return hasInboundOrders === category.hasInboundOrders
      ? category
      : { ...category, hasInboundOrders }
  })
}

export function isMajorCategoryNameTaken(name: string, excludeId?: string): boolean {
  const normalized = name.trim().toLocaleLowerCase()
  return categories.some(
    (item) => item.id !== excludeId && item.name.toLocaleLowerCase() === normalized
  )
}

export function isSubcategoryNameTaken(
  categoryId: string,
  name: string,
  excludeId?: string
): boolean {
  const normalized = name.trim().toLocaleLowerCase()
  return subcategories.some(
    (item) =>
      item.id !== excludeId &&
      item.categoryId === categoryId &&
      item.name.toLocaleLowerCase() === normalized
  )
}

export function isSkuCombinationTaken(
  subcategoryId: string,
  specValues: Record<string, string>,
  measureParam: string,
  measureUnit: string,
  excludeId?: string
): boolean {
  const subcategory = findSubcategory(subcategoryId)
  const dimensions = subcategory?.specDimensions ?? []
  const signature = dimensions
    .map((dimension) => (specValues[dimension] ?? "").trim())
    .join("|")
    .toLocaleLowerCase()

  return skus.some((sku) => {
    if (sku.id === excludeId || sku.subcategoryId !== subcategoryId) return false
    const skuSignature = dimensions
      .map((dimension) => (sku.specValues[dimension] ?? "").trim())
      .join("|")
      .toLocaleLowerCase()
    return (
      skuSignature === signature &&
      sku.measureParam === measureParam &&
      sku.measureUnit === measureUnit
    )
  })
}

export function createMajorCategory(name: string, operator = DEFAULT_OPERATOR): MajorCategory {
  const stamp = nowStamp()
  const record: MajorCategory = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    status: "ENABLED",
    createdBy: operator,
    createdAt: stamp,
    updatedBy: operator,
    updatedAt: stamp,
    version: 1,
    hasInboundOrders: false,
  }
  categories = [record, ...categories]
  emit()
  return record
}

export function updateMajorCategory(
  id: string,
  name: string,
  operator = DEFAULT_OPERATOR
) {
  const stamp = nowStamp()
  categories = categories.map((item) =>
    item.id === id
      ? {
          ...item,
          name: name.trim(),
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  emit()
}

export function disableMajorCategory(id: string, operator = DEFAULT_OPERATOR) {
  const category = findMajorCategory(id)
  if (!category) return
  const stamp = nowStamp()
  const snapshot: Record<string, GoodsStatus> = {}

  subcategoriesOfCategory(id).forEach((subcategory) => {
    snapshot[subcategory.id] = subcategory.status
    skusOfSubcategory(subcategory.id).forEach((sku) => {
      snapshot[sku.id] = sku.status
    })
  })

  categories = categories.map((item) =>
    item.id === id
      ? {
          ...item,
          status: "DISABLED",
          statusSnapshot: snapshot,
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )

  const subcategoryIds = new Set(subcategoriesOfCategory(id).map((item) => item.id))
  subcategories = subcategories.map((item) =>
    subcategoryIds.has(item.id)
      ? {
          ...item,
          status: "DISABLED",
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  skus = skus.map((item) =>
    subcategoryIds.has(item.subcategoryId)
      ? {
          ...item,
          status: "DISABLED",
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  emit()
}

export function enableMajorCategory(id: string, operator = DEFAULT_OPERATOR) {
  const category = findMajorCategory(id)
  if (!category) return
  const stamp = nowStamp()
  const snapshot = category.statusSnapshot ?? {}
  const subcategoryIds = new Set(subcategoriesOfCategory(id).map((item) => item.id))

  categories = categories.map((item) =>
    item.id === id
      ? {
          ...item,
          status: "ENABLED",
          statusSnapshot: undefined,
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )

  subcategories = subcategories.map((item) =>
    subcategoryIds.has(item.id)
      ? {
          ...item,
          status: snapshot[item.id] ?? item.status,
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  skus = skus.map((item) =>
    subcategoryIds.has(item.subcategoryId)
      ? {
          ...item,
          status: snapshot[item.id] ?? item.status,
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  emit()
}

export function deleteMajorCategory(id: string) {
  const subcategoryIds = new Set(subcategoriesOfCategory(id).map((item) => item.id))
  categories = categories.filter((item) => item.id !== id)
  subcategories = subcategories.filter((item) => !subcategoryIds.has(item.id))
  skus = skus.filter((item) => !subcategoryIds.has(item.subcategoryId))
  emit()
}

export function createSubcategory(
  input: { name: string; categoryId: string; specDimensions: string[] },
  operator = DEFAULT_OPERATOR
): Subcategory {
  const stamp = nowStamp()
  const record: Subcategory = {
    id: `sub-${Date.now()}`,
    name: input.name.trim(),
    categoryId: input.categoryId,
    specDimensions: input.specDimensions.map((item) => item.trim()),
    status: "ENABLED",
    createdBy: operator,
    createdAt: stamp,
    updatedBy: operator,
    updatedAt: stamp,
    version: 1,
    hasInboundOrders: false,
  }
  subcategories = [record, ...subcategories]
  emit()
  return record
}

export function updateSubcategory(
  id: string,
  input: { name: string; categoryId: string; specDimensions: string[] },
  operator = DEFAULT_OPERATOR
) {
  const stamp = nowStamp()
  const nextDimensions = input.specDimensions.map((item) => item.trim())
  subcategories = subcategories.map((item) =>
    item.id === id
      ? {
          ...item,
          name: input.name.trim(),
          categoryId: input.categoryId,
          specDimensions: nextDimensions,
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )

  skus = skus.map((sku) => {
    if (sku.subcategoryId !== id) return sku
    const nextSpecValues = nextDimensions.reduce<Record<string, string>>(
      (accumulator, dimension) => {
        const value = sku.specValues[dimension]
        if (value) accumulator[dimension] = value
        return accumulator
      },
      {}
    )
    return { ...sku, specValues: nextSpecValues, updatedBy: operator, updatedAt: stamp }
  })
  emit()
}

export function disableSubcategory(id: string, operator = DEFAULT_OPERATOR) {
  const subcategory = findSubcategory(id)
  if (!subcategory) return
  const stamp = nowStamp()
  const snapshot: Record<string, GoodsStatus> = {}
  skusOfSubcategory(id).forEach((sku) => {
    snapshot[sku.id] = sku.status
  })

  subcategories = subcategories.map((item) =>
    item.id === id
      ? {
          ...item,
          status: "DISABLED",
          statusSnapshot: snapshot,
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  skus = skus.map((item) =>
    item.subcategoryId === id
      ? {
          ...item,
          status: "DISABLED",
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  emit()
}

export function enableSubcategory(id: string, operator = DEFAULT_OPERATOR) {
  const subcategory = findSubcategory(id)
  if (!subcategory) return
  const stamp = nowStamp()
  const snapshot = subcategory.statusSnapshot ?? {}

  subcategories = subcategories.map((item) =>
    item.id === id
      ? {
          ...item,
          status: "ENABLED",
          statusSnapshot: undefined,
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  skus = skus.map((item) =>
    item.subcategoryId === id
      ? {
          ...item,
          status: snapshot[item.id] ?? item.status,
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  emit()
}

export function deleteSubcategory(id: string) {
  subcategories = subcategories.filter((item) => item.id !== id)
  skus = skus.filter((item) => item.subcategoryId !== id)
  refreshInboundFlags()
  emit()
}

export function createSku(
  input: {
    subcategoryId: string
    specValues: Record<string, string>
    measureParam: string
    measureUnit: string
    inboundCollect: GoodsInboundCollectConfig[]
  },
  operator = DEFAULT_OPERATOR
): GoodsSku {
  const stamp = nowStamp()
  const record: GoodsSku = {
    id: `sku-${Date.now()}`,
    subcategoryId: input.subcategoryId,
    specValues: { ...input.specValues },
    measureParam: input.measureParam,
    measureUnit: input.measureUnit,
    inboundCollect: input.inboundCollect.map((item) => ({ ...item })),
    status: "ENABLED",
    createdBy: operator,
    createdAt: stamp,
    updatedBy: operator,
    updatedAt: stamp,
    version: 1,
    hasInboundOrders: false,
    priceHistory: [],
    priceTrend: [],
  }
  skus = [record, ...skus]
  refreshInboundFlags()
  emit()
  return record
}

export function updateSku(
  id: string,
  input: {
    subcategoryId: string
    specValues: Record<string, string>
    measureParam: string
    measureUnit: string
    inboundCollect: GoodsInboundCollectConfig[]
  },
  operator = DEFAULT_OPERATOR
) {
  const stamp = nowStamp()
  skus = skus.map((item) =>
    item.id === id
      ? {
          ...item,
          subcategoryId: input.subcategoryId,
          specValues: { ...input.specValues },
          measureParam: input.measureParam,
          measureUnit: input.measureUnit,
          inboundCollect: input.inboundCollect.map((collect) => ({ ...collect })),
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  refreshInboundFlags()
  emit()
}

export function setSkuStatus(id: string, status: GoodsStatus, operator = DEFAULT_OPERATOR) {
  const stamp = nowStamp()
  skus = skus.map((item) =>
    item.id === id
      ? {
          ...item,
          status,
          updatedBy: operator,
          updatedAt: stamp,
          version: item.version + 1,
        }
      : item
  )
  emit()
}

export function deleteSku(id: string) {
  skus = skus.filter((item) => item.id !== id)
  refreshInboundFlags()
  emit()
}

export function setSkuPrice(id: string, price: number, operator = DEFAULT_OPERATOR) {
  const stamp = nowStamp()
  const date = todayDate()
  skus = skus.map((item) => {
    if (item.id !== id) return item
    const historyEntry = {
      id: `${id}-price-${Date.now()}`,
      price,
      unit: item.measureUnit,
      operator,
      operatedAt: stamp,
    }
    const trendPoint: PriceTrendPoint = { date, price }
    const trend = [...item.priceTrend.filter((point) => point.date !== date), trendPoint]
      .sort((left, right) => left.date.localeCompare(right.date))
      .slice(-30)

    return {
      ...item,
      price,
      priceHistory: [historyEntry, ...item.priceHistory],
      priceTrend: trend,
      updatedBy: operator,
      updatedAt: stamp,
      version: item.version + 1,
    }
  })
  emit()
}

// ==================== 入库收集项配置业务 Store (6.3) ====================

/**
 * 统计某个收集项被多少个货品引用（06 货品主档的未删除货品）。
 * 这是 07「两阶段安全删除」与「有引用锁定控件类型」的真实数据来源，
 * 不再依赖 mock 里写死的 hasDownstreamRef。
 */
export function countGoodsReferences(fieldId: string): number {
  return skus.reduce(
    (count, sku) =>
      sku.inboundCollect.some((item) => item.fieldId === fieldId)
        ? count + 1
        : count,
    0
  )
}

/** 给字段补上实时引用状态，避免各处重复计算 */
function withRefCount(field: InboundCollectFieldConfig): InboundCollectFieldConfig {
  return { ...field, hasDownstreamRef: countGoodsReferences(field.id) > 0 }
}

export function listInboundCollectFields(): InboundCollectFieldConfig[] {
  return inboundCollectFields.map(withRefCount)
}

/** 供 06 货品管理新建/编辑时勾选：只列启用中的收集项 */
export function listSelectableCollectFields(): InboundCollectFieldConfig[] {
  return inboundCollectFields
    .filter((item) => item.status === "ENABLED")
    .map(withRefCount)
}

export function findInboundCollectField(
  id?: string
): InboundCollectFieldConfig | undefined {
  if (!id) return undefined
  const field = inboundCollectFields.find((item) => item.id === id)
  return field ? withRefCount(field) : undefined
}

/** 06 侧读取字段元数据的统一入口，语义等价于按 ID 引用 07 字段池 */
export const resolveCollectField = findInboundCollectField

function computeCollectSummary(
  controlType: InboundCollectControlType,
  unitLabel?: string,
  options?: string[]
): string {
  if (controlType === "周期组合项") {
    const units: string[] = []
    if (shelfLifeUnitConfig.allowMonth) units.push("月")
    if (shelfLifeUnitConfig.allowDay) units.push("天")
    if (shelfLifeUnitConfig.allowYear) units.push("年")
    return `支持: ${units.join(" / ")}`
  }
  if (controlType === "下拉单选框") {
    if (options && options.length > 0) {
      return options.slice(0, 2).join(", ")
    }
    return "—"
  }
  if (controlType === "数字区间框" || controlType === "百分比数值框") {
    return unitLabel?.trim() || "—"
  }
  return "—"
}

export type CollectFieldInput = {
  name: string
  controlType: InboundCollectControlType
  unitLabel?: string
  options?: string[]
  placeholder?: string
  remark?: string
}

export function addInboundCollectField(
  input: CollectFieldInput,
  operator = DEFAULT_OPERATOR
): { success: boolean; error?: string; id?: string } {
  const cleanName = input.name.trim()
  if (!cleanName) {
    return { success: false, error: "收集项名称不能为空" }
  }

  // 周期组合项为保质期专属，不允许管理员自建（字段清单 6.1）
  if (input.controlType === "周期组合项") {
    return {
      success: false,
      error: "周期组合项为保质期专属控件，不支持自行新建",
    }
  }

  // R01: 收集项名称租户内唯一性校验
  const duplicate = inboundCollectFields.some(
    (item) => item.name.toLowerCase() === cleanName.toLowerCase()
  )
  if (duplicate) {
    return { success: false, error: "收集项名称已存在，请重新输入" }
  }

  const stamp = nowStamp()
  const newId = `col-${Date.now()}`
  const summary = computeCollectSummary(
    input.controlType,
    input.unitLabel,
    input.options
  )

  const newField: InboundCollectFieldConfig = {
    id: newId,
    name: cleanName,
    controlType: input.controlType,
    summary,
    unitLabel: input.unitLabel?.trim() || undefined,
    options: input.options ? [...input.options] : undefined,
    placeholder: input.placeholder?.trim() || undefined,
    remark: input.remark?.trim() || undefined,
    isCore: false,
    isShelfLife: false,
    status: "ENABLED",
    createdBy: operator,
    createdAt: stamp,
    updatedBy: operator,
    updatedAt: stamp,
    version: 1,
    hasDownstreamRef: false,
  }

  inboundCollectFields = [...inboundCollectFields, newField]
  emit()
  return { success: true, id: newId }
}

export function updateInboundCollectField(
  id: string,
  input: CollectFieldInput,
  operator = DEFAULT_OPERATOR,
  expectedVersion?: number
): { success: boolean; error?: string } {
  const current = findInboundCollectField(id)
  if (!current) {
    return { success: false, error: "收集项不存在" }
  }

  if (
    expectedVersion !== undefined &&
    current.version !== expectedVersion
  ) {
    return { success: false, error: "数据已被他人修改，请刷新后重试" }
  }

  const cleanName = input.name.trim()
  if (!cleanName) {
    return { success: false, error: "收集项名称不能为空" }
  }

  // R02: 系统核心项只允许改输入提示与备注，名称固定沿用原值
  const finalName = current.isCore ? current.name : cleanName

  // R01: 排除自身名称唯一性
  const duplicate = inboundCollectFields.some(
    (item) =>
      item.id !== id && item.name.toLowerCase() === finalName.toLowerCase()
  )
  if (duplicate) {
    return { success: false, error: "收集项名称已存在，请重新输入" }
  }

  // 周期组合项为保质期专属，不允许把普通项改成周期组合项
  if (
    input.controlType === "周期组合项" &&
    current.controlType !== "周期组合项"
  ) {
    return {
      success: false,
      error: "周期组合项为保质期专属控件，其他收集项不能改成该类型",
    }
  }

  // R02: 核心项与引用项保护，控件类型锁定为原值
  const lockedType =
    current.isCore || current.hasDownstreamRef
      ? current.controlType
      : input.controlType

  // 引用态的度量单位标签随控件类型一并锁定，避免上下游口径错位
  const finalUnitLabel =
    current.hasDownstreamRef || current.isCore
      ? current.unitLabel
      : input.unitLabel

  const summary = computeCollectSummary(
    lockedType,
    finalUnitLabel,
    input.options
  )
  const stamp = nowStamp()

  inboundCollectFields = inboundCollectFields.map((item) => {
    if (item.id !== id) return item
    return {
      ...item,
      name: finalName,
      controlType: lockedType,
      summary,
      unitLabel: finalUnitLabel?.trim() || undefined,
      options: input.options ? [...input.options] : undefined,
      placeholder: input.placeholder?.trim() || undefined,
      remark: input.remark?.trim() || undefined,
      updatedBy: operator,
      updatedAt: stamp,
      version: item.version + 1,
    }
  })

  emit()
  return { success: true }
}

export function setInboundCollectFieldStatus(
  id: string,
  nextStatus: GoodsStatus,
  operator = DEFAULT_OPERATOR
) {
  const stamp = nowStamp()
  inboundCollectFields = inboundCollectFields.map((item) => {
    if (item.id !== id) return item
    return {
      ...item,
      status: nextStatus,
      updatedBy: operator,
      updatedAt: stamp,
      version: item.version + 1,
    }
  })
  emit()
}

export type DeleteFieldResult =
  | { success: true }
  | {
      success: false
      reason: "CORE" | "ENABLED" | "HAS_REF"
      message: string
    }

/**
 * 两阶段安全删除控制（R04 / R02）
 * 1. 核心项检查：系统核心字段禁止删除
 * 2. 阶段一自身状态检查：处于启用中不可删除，提示先停用
 * 3. 阶段二下游引用检查：已被使用不可删除，提示先解绑
 */
export function deleteInboundCollectField(id: string): DeleteFieldResult {
  const field = findInboundCollectField(id)
  if (!field) {
    return { success: false, reason: "HAS_REF", message: "收集项不存在" }
  }

  // R02: 系统核心内置项保护
  if (field.isCore) {
    return {
      success: false,
      reason: "CORE",
      message: "系统核心字段，禁止删除",
    }
  }

  // R04 阶段一: 自身状态检查
  if (field.status === "ENABLED") {
    return {
      success: false,
      reason: "ENABLED",
      message: "启用状态下的收集项不可删除，请先停用。",
    }
  }

  // R04 阶段二: 后台快速探测下游引用
  if (field.hasDownstreamRef) {
    return {
      success: false,
      reason: "HAS_REF",
      message: "该收集项已被使用，不可删除！请先前往解绑。",
    }
  }

  inboundCollectFields = inboundCollectFields.filter((item) => item.id !== id)
  emit()
  return { success: true }
}

export function getShelfLifeUnitConfig(): ShelfLifeUnitConfig {
  return { ...shelfLifeUnitConfig }
}

export function updateShelfLifeUnitConfig(
  config: ShelfLifeUnitConfig
): { success: boolean; error?: string } {
  // R05: 保底强校验，至少保留一个可用单位
  if (!config.allowDay && !config.allowMonth && !config.allowYear) {
    return { success: false, error: "至少保留一个可用保质期单位" }
  }

  shelfLifeUnitConfig = { ...config }

  // 联动更新保质期项的 summary
  inboundCollectFields = inboundCollectFields.map((item) => {
    if (item.controlType !== "周期组合项") return item
    const units: string[] = []
    if (config.allowMonth) units.push("月")
    if (config.allowDay) units.push("天")
    if (config.allowYear) units.push("年")
    return {
      ...item,
      summary: `支持: ${units.join(" / ")}`,
      version: item.version + 1,
      updatedAt: nowStamp(),
    }
  })

  emit()
  return { success: true }
}

