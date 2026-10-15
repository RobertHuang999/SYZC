import {
  parseGoodsSkuDisplayName,
  stagingRegToGoodsLineDrafts,
} from "./staging-goods-display"
import type { InboundStagingReg } from "./inbound-staging.mock"
import { STAGING_DEMO_SCENE_PHOTOS } from "./staging-demo-media"
import type { StagingFormSnapshot } from "./staging-form-snapshot"

export { STAGING_DEMO_SCENE_PHOTOS } from "./staging-demo-media"

export type StagingSupplementaryImage = { name: string; url: string }
export type StagingSupplementaryDocument = { name: string; url: string; size?: string }

export type StagingLineAttachments = {
  scenePhotos: string[]
  supplementaryImages: StagingSupplementaryImage[]
  supplementaryDocuments: StagingSupplementaryDocument[]
}

export type StagingStackingRow = {
  storeroom: string
  partition: string
  location: string
  quantity: number
  status: string
}

export type StagingDetailGoodsRow = {
  id: string
  category: string
  variety: string
  spec: string
  declaredQty: number
  unit: string
  stackedQty: number
  unstackedQty: number
  remark?: string
  stackings: StagingStackingRow[]
  attachments: StagingLineAttachments
}

const EMPTY_ATTACHMENTS: StagingLineAttachments = {
  scenePhotos: [],
  supplementaryImages: [],
  supplementaryDocuments: [],
}

type LineMock = {
  lineIndex: number
  remark?: string
  stackings: StagingStackingRow[]
  attachments?: StagingLineAttachments
}

/** 原型演示：二级堆放与货品行附件（现场照片/补充资料随 SKU 行，见字段清单 2.1） */
const REG_LINE_STACKS: Record<string, LineMock[]> = {
  "reg-1": [
    {
      lineIndex: 0,
      remark: "第一批抵库电解铜，表面清洁完整",
      stackings: [
        {
          storeroom: "1号库房",
          partition: "A区 (有色金属区)",
          location: "A-01-01",
          quantity: 50.25,
          status: "已暂定垛位",
        },
      ],
      attachments: {
        scenePhotos: [STAGING_DEMO_SCENE_PHOTOS[0], STAGING_DEMO_SCENE_PHOTOS[1]],
        supplementaryImages: [],
        supplementaryDocuments: [
          {
            name: "随车磅单.pdf",
            url: STAGING_DEMO_SCENE_PHOTOS[2],
            size: "1.2MB",
          },
        ],
      },
    },
  ],
  "reg-2": [
    {
      lineIndex: 0,
      stackings: [
        {
          storeroom: "1号常温标准库房",
          partition: "A区",
          location: "A-02-03",
          quantity: 120,
          status: "已分配库位",
        },
      ],
      attachments: {
        scenePhotos: [STAGING_DEMO_SCENE_PHOTOS[0]],
        supplementaryImages: [],
        supplementaryDocuments: [],
      },
    },
  ],
  "reg-9": [
    {
      lineIndex: 0,
      remark: "热轧部分已分垛",
      stackings: [
        {
          storeroom: "1号常温标准库房",
          partition: "B区",
          location: "B-02-01",
          quantity: 45.5,
          status: "已暂定垛位",
        },
      ],
      attachments: {
        scenePhotos: [STAGING_DEMO_SCENE_PHOTOS[0], STAGING_DEMO_SCENE_PHOTOS[2]],
        supplementaryImages: [],
        supplementaryDocuments: [],
      },
    },
  ],
}

export function stagingLineHasAttachments(row: StagingDetailGoodsRow): boolean {
  const a = row.attachments
  return (
    a.scenePhotos.length > 0 ||
    a.supplementaryImages.length > 0 ||
    a.supplementaryDocuments.length > 0
  )
}

function resolveAttachments(
  reg: InboundStagingReg,
  mockLine: LineMock | undefined,
): StagingLineAttachments {
  if (reg.status === "已作废") return { ...EMPTY_ATTACHMENTS }
  if (mockLine?.attachments) {
    return {
      scenePhotos: [...mockLine.attachments.scenePhotos],
      supplementaryImages: [...(mockLine.attachments.supplementaryImages ?? [])],
      supplementaryDocuments: [...(mockLine.attachments.supplementaryDocuments ?? [])],
    }
  }
  return { ...EMPTY_ATTACHMENTS }
}

function inferStackings(
  reg: InboundStagingReg,
  lineIndex: number,
  declaredQty: number,
): StagingStackingRow[] {
  const mocks = REG_LINE_STACKS[reg.id]
  const hit = mocks?.find((m) => m.lineIndex === lineIndex)
  if (hit?.stackings.length) return hit.stackings

  if (
    lineIndex === 0 &&
    reg.locationHint &&
    reg.locationHint !== "待理货定垛" &&
    declaredQty > 0
  ) {
    return [
      {
        storeroom: reg.storeroomName ?? reg.warehouseName,
        partition: "—",
        location: reg.locationHint === "已分配库位" ? "—" : reg.locationHint,
        quantity: declaredQty,
        status: reg.locationHint === "已分配库位" ? "已分配库位" : "已暂定垛位",
      },
    ]
  }
  return []
}

function rowsFromFormSnapshot(reg: InboundStagingReg, snapshot: StagingFormSnapshot): StagingDetailGoodsRow[] {
  return snapshot.goodsLines.map((line, index) => {
    const declaredQty = Number.parseFloat(line.measureValue) || 0
    const stackings: StagingStackingRow[] = line.stackings.map((row) => ({
      storeroom: row.storeroomLabel || row.storeroomId || "—",
      partition: row.partitionLabel || row.partitionId || "—",
      location: row.locationText?.trim() || "—",
      quantity: Number.parseFloat(row.quantity) || 0,
      status: "已暂定垛位",
    }))
    const stackedQty = stackings.reduce((sum, row) => sum + row.quantity, 0)
    const unstackedQty = Math.max(0, Number((declaredQty - stackedQty).toFixed(4)))
    const scenePhotos =
      line.scenePhotoUrls?.length ? [...line.scenePhotoUrls] : [...STAGING_DEMO_SCENE_PHOTOS].slice(0, line.sitePhotoCount)

    return {
      id: line.id || `${reg.id}-g${index}`,
      category: line.category,
      variety: line.variety,
      spec: line.spec,
      declaredQty,
      unit: line.measureUnit || reg.unit,
      stackedQty: Number(stackedQty.toFixed(4)),
      unstackedQty,
      remark: line.remark || (index === 0 ? reg.remark : undefined),
      stackings,
      attachments: {
        scenePhotos,
        supplementaryImages: [],
        supplementaryDocuments: [],
      },
    }
  })
}

export function buildStagingDetailGoodsRows(reg: InboundStagingReg): StagingDetailGoodsRow[] {
  if (reg.formSnapshot?.goodsLines.length) {
    return rowsFromFormSnapshot(reg, reg.formSnapshot)
  }

  const drafts = stagingRegToGoodsLineDrafts(reg)
  const mocks = REG_LINE_STACKS[reg.id] ?? []

  return drafts.map((draft, index) => {
    const declaredQty = Number.parseFloat(draft.measureValue) || 0
    const stackings = inferStackings(reg, index, declaredQty)
    const stackedQty = stackings.reduce((sum, row) => sum + row.quantity, 0)
    const unstackedQty = Math.max(0, Number((declaredQty - stackedQty).toFixed(4)))
    const mockLine = mocks.find((m) => m.lineIndex === index)

    const fallback = parseGoodsSkuDisplayName(
      [draft.category, draft.variety, draft.spec].filter(Boolean).join("-"),
    )

    return {
      id: `${reg.id}-g${index}`,
      category: draft.category || fallback.category,
      variety: draft.variety || fallback.variety,
      spec: draft.spec || fallback.spec,
      declaredQty,
      unit: draft.measureUnit || reg.unit,
      stackedQty: Number(stackedQty.toFixed(4)),
      unstackedQty,
      remark: mockLine?.remark ?? (index === 0 ? reg.remark : undefined),
      stackings,
      attachments: resolveAttachments(reg, mockLine),
    }
  })
}
