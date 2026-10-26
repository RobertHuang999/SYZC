import type {
  IssuanceCandidate,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-seed"
import type {
  ReceiptGoodsGroup,
  ReceiptGoodsLot,
  WarehouseReceipt,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { findWarehouseReceiptByIdOrCode, warehouseReceiptSeed } from "@prototype/shared/warehouse-receipts/warehouse-receipt-seed"
import type { ReceiptInitiateDraft } from "./receipt-initiate-session"

const CREATED_STORAGE_KEY = "syzc-h5-created-receipts"

function formatNow(): string {
  const date = new Date()
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function loadCreatedReceipts(): WarehouseReceipt[] {
  try {
    const raw = window.sessionStorage.getItem(CREATED_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as WarehouseReceipt[]
  } catch {
    return []
  }
}

function saveCreatedReceipts(receipts: WarehouseReceipt[]) {
  window.sessionStorage.setItem(CREATED_STORAGE_KEY, JSON.stringify(receipts))
}

export function getAllMobileReceipts(): WarehouseReceipt[] {
  return [...loadCreatedReceipts(), ...warehouseReceiptSeed]
}

export function findMobileReceipt(id: string | undefined): WarehouseReceipt | undefined {
  if (!id) return undefined
  return (
    loadCreatedReceipts().find((item) => item.id === id || item.code === id) ??
    findWarehouseReceiptByIdOrCode(id)
  )
}

export function buildReceiptFromDraft(
  draft: ReceiptInitiateDraft,
  candidates: IssuanceCandidate[],
  code: string,
): WarehouseReceipt {
  const selected = candidates.filter((item) =>
    draft.selectedCandidateIds.includes(item.id),
  )
  const groupMap = new Map<string, ReceiptGoodsGroup>()

  selected.forEach((candidate) => {
    const quantity = Number(
      draft.allocations[candidate.id] ?? candidate.remainQuantity,
    )
    const existing = groupMap.get(candidate.goodsName)
    const lot: ReceiptGoodsLot = {
      id: `lot-${candidate.id}`,
      warehouseName: candidate.warehouseName,
      houseName: candidate.houseName,
      houseAudit: candidate.houseAudit,
      zoneName: candidate.zoneName,
      position: candidate.position,
      inboundAt: candidate.inboundAt,
      otherInfo: candidate.otherInfo,
      barcode: candidate.qrcodeId,
      statusLabel: "仓单中",
      quantity,
      unit: candidate.unit,
    }

    if (existing) {
      existing.quantity = Number((existing.quantity + lot.quantity).toFixed(4))
      existing.lots.push(lot)
      return
    }

    groupMap.set(candidate.goodsName, {
      id: `group-${candidate.id}`,
      category: candidate.category,
      variety: candidate.variety,
      spec: candidate.spec,
      name: candidate.goodsName,
      quantity,
      unit: candidate.unit,
      lots: [lot],
    })
  })

  const now = formatNow()
  const isEnterprise = draft.ownerType === "ENTERPRISE"
  const owner = {
    type: draft.ownerType,
    name: draft.ownerName,
    identifier: draft.ownerIdentifier,
  }

  return {
    id: `r-created-${Date.now()}`,
    code,
    owner,
    holder: owner,
    warehouseName: draft.warehouseName,
    thirdPartyRegistered:
      draft.warehouseName === "华东1号智能立体仓" ||
      draft.warehouseName === "西南大宗物资仓",
    establishedAt: now,
    status: "NORMAL",
    creatorName: "lxy",
    creatorOrg: "四川享宇科技有限公司",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: now,
    goodsGroups: [...groupMap.values()],
    changes: [
      {
        id: `c-created-${Date.now()}`,
        changedAt: now,
        changeType: "仓单开立",
        summary: `实名双因子签署完成，开立 ${[...groupMap.values()]
          .map((group) => `${group.name} ${group.quantity}${group.unit}`)
          .join("、")}。`,
        operator: isEnterprise
          ? draft.handledBy
            ? `${draft.handledBy}(经办人)`
            : "lxy(四川享宇科技有限公司)"
          : draft.ownerName,
      },
    ],
    remark: draft.remark || undefined,
  }
}

export function persistCreatedReceipt(receipt: WarehouseReceipt) {
  const existing = loadCreatedReceipts()
  saveCreatedReceipts([receipt, ...existing])
}
