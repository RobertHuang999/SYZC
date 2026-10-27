import { useSyncExternalStore } from "react"
import {
  MOCK_GOODS_SKUS,
  MOCK_MAJOR_CATEGORIES,
  MOCK_SUBCATEGORIES,
} from "../mock/goods-spec.mock"
import type {
  GoodsInboundCollectConfig,
  GoodsSku,
  GoodsStatus,
  MajorCategory,
  PriceTrendPoint,
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
