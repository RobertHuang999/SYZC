import { STAGING_DEMO_SCENE_PHOTOS } from "./staging-demo-media"

export type StagingStackingSnapshot = {
  id: string
  storeroomId: string
  partitionId: string
  locationText: string
  quantity: string
  storeroomLabel?: string
  partitionLabel?: string
}

export type StagingGoodsLineSnapshot = {
  id: string
  skuId: string
  category: string
  variety: string
  spec: string
  specValues: Record<string, string>
  collectValues: Record<string, string>
  measureValue: string
  measureUnit: string
  measureLabel: string
  extraInfo: string
  remark: string
  stackings: StagingStackingSnapshot[]
  sitePhotoCount: number
  supplementCount: number
  scenePhotoUrls?: string[]
}

export type StagingFormSnapshot = {
  warehouseId: string
  storeroomIds: string[]
  ownerType?: string
  ownerIdentifier?: string
  contactPhone?: string
  idCardNo?: string
  relatedOrderLabel?: string
  isNewOwner?: boolean
  goodsLines: StagingGoodsLineSnapshot[]
}

export type StagingGoodsLineInput = {
  id: string
  skuId: string
  category: string
  variety: string
  spec: string
  specValues: Record<string, string>
  collectValues: Record<string, string>
  measureValue: string
  measureUnit: string
  measureLabel: string
  extraInfo: string
  remark: string
  stackings: Array<{
    id: string
    storeroomId: string
    partitionId: string
    locationText: string
    quantity: string
  }>
  sitePhotoCount: number
  supplementCount: number
}

export type StagingFormSnapshotInput = {
  warehouseId: string
  storeroomIds: string[]
  ownerType?: string
  ownerIdentifier?: string
  contactPhone?: string
  idCardNo?: string
  relatedOrderLabel?: string
  isNewOwner?: boolean
  goodsLines: StagingGoodsLineInput[]
}

export type StagingSnapshotLookup = {
  storeroomLabel: (storeroomId: string) => string
  partitionLabel: (storeroomId: string, partitionId: string) => string
}

function scenePhotoUrlsFromCount(count: number): string[] {
  if (count <= 0) return []
  const urls = [...STAGING_DEMO_SCENE_PHOTOS]
  return Array.from({ length: count }, (_, i) => urls[i % urls.length]!)
}

export function buildStagingFormSnapshot(
  form: StagingFormSnapshotInput,
  lookup: StagingSnapshotLookup,
): StagingFormSnapshot {
  return {
    warehouseId: form.warehouseId,
    storeroomIds: [...form.storeroomIds],
    ownerType: form.ownerType || undefined,
    ownerIdentifier: form.ownerIdentifier || undefined,
    contactPhone: form.contactPhone || undefined,
    idCardNo: form.idCardNo || undefined,
    relatedOrderLabel: form.relatedOrderLabel || undefined,
    isNewOwner: form.isNewOwner,
    goodsLines: form.goodsLines.map((line) => ({
      id: line.id,
      skuId: line.skuId,
      category: line.category,
      variety: line.variety,
      spec: line.spec,
      specValues: { ...line.specValues },
      collectValues: { ...line.collectValues },
      measureValue: line.measureValue,
      measureUnit: line.measureUnit,
      measureLabel: line.measureLabel,
      extraInfo: line.extraInfo,
      remark: line.remark,
      sitePhotoCount: line.sitePhotoCount,
      supplementCount: line.supplementCount,
      scenePhotoUrls: scenePhotoUrlsFromCount(line.sitePhotoCount),
      stackings: line.stackings.map((row) => ({
        ...row,
        storeroomLabel: lookup.storeroomLabel(row.storeroomId) || undefined,
        partitionLabel: lookup.partitionLabel(row.storeroomId, row.partitionId) || undefined,
      })),
    })),
  }
}

export function goodsLinesFromStagingSnapshot(snapshot: StagingFormSnapshot): StagingGoodsLineSnapshot[] {
  return snapshot.goodsLines.map((line) => ({
    ...line,
    specValues: { ...line.specValues },
    collectValues: { ...line.collectValues },
    stackings: line.stackings.map((row) => ({ ...row })),
    scenePhotoUrls: line.scenePhotoUrls?.length
      ? [...line.scenePhotoUrls]
      : scenePhotoUrlsFromCount(line.sitePhotoCount),
  }))
}

export function mapStagingSnapshotToGoodsLines<T extends StagingGoodsLineInput>(
  snapshot: StagingFormSnapshot,
  createEmptyLine: () => T,
): T[] {
  return goodsLinesFromStagingSnapshot(snapshot).map((line) => ({
    ...createEmptyLine(),
    id: line.id,
    skuId: line.skuId,
    category: line.category,
    variety: line.variety,
    spec: line.spec,
    specValues: { ...line.specValues },
    collectValues: { ...line.collectValues },
    measureValue: line.measureValue,
    measureUnit: line.measureUnit,
    measureLabel: line.measureLabel,
    extraInfo: line.extraInfo,
    remark: line.remark,
    stackings: line.stackings.map((row) => ({
      id: row.id,
      storeroomId: row.storeroomId,
      partitionId: row.partitionId,
      locationText: row.locationText,
      quantity: row.quantity,
    })),
    sitePhotoCount: line.sitePhotoCount,
    supplementCount: line.supplementCount,
  }))
}
