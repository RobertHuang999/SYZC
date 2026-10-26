import { RECEIPT_INITIATE_STORAGE_KEY } from "../domain/constants"

export type ReceiptDeductMode = "FIFO" | "CUSTOM"

export type ReceiptInitiateDraft = {
  ownerId: string
  ownerType: "ENTERPRISE" | "PERSON"
  ownerName: string
  ownerIdentifier: string
  idCardNo: string
  warehouseName: string
  /** 扣货方式：先入先出（默认）/ 自定义 */
  deductMode: ReceiptDeductMode
  /** 先入先出模式下选定的货品（货品名称 + 计量单位） */
  fifoGoodsKey: string
  /** 先入先出模式下的总开立数量（字符串便于输入小数） */
  fifoTotal: string
  /** 已勾选的在库批次 */
  selectedCandidateIds: string[]
  /** 每个批次的本次开立数量（字符串便于输入小数，不填则默认该批次可用数量） */
  allocations: Record<string, string>
  /** 企业货主办结人 */
  handledBy: string
  handledMobile: string
  handledByNo: string
  remark: string
  agreeProtocol: boolean
  faceVerified: boolean
}

export const EMPTY_RECEIPT_DRAFT: ReceiptInitiateDraft = {
  ownerId: "",
  ownerType: "ENTERPRISE",
  ownerName: "",
  ownerIdentifier: "",
  idCardNo: "",
  warehouseName: "",
  deductMode: "FIFO",
  fifoGoodsKey: "",
  fifoTotal: "",
  selectedCandidateIds: [],
  allocations: {},
  handledBy: "",
  handledMobile: "",
  handledByNo: "",
  remark: "",
  agreeProtocol: false,
  faceVerified: false,
}

export function loadReceiptDraft(): ReceiptInitiateDraft {
  try {
    const raw = window.sessionStorage.getItem(RECEIPT_INITIATE_STORAGE_KEY)
    if (!raw) return { ...EMPTY_RECEIPT_DRAFT }
    return { ...EMPTY_RECEIPT_DRAFT, ...(JSON.parse(raw) as Partial<ReceiptInitiateDraft>) }
  } catch {
    return { ...EMPTY_RECEIPT_DRAFT }
  }
}

export function saveReceiptDraft(draft: ReceiptInitiateDraft) {
  window.sessionStorage.setItem(
    RECEIPT_INITIATE_STORAGE_KEY,
    JSON.stringify(draft),
  )
}

export function patchReceiptDraft(
  patch: Partial<ReceiptInitiateDraft>,
): ReceiptInitiateDraft {
  const next = { ...loadReceiptDraft(), ...patch }
  saveReceiptDraft(next)
  return next
}

export function clearReceiptDraft() {
  window.sessionStorage.removeItem(RECEIPT_INITIATE_STORAGE_KEY)
}

/** 开立成功时生成演示用 CD 编码：CD + 19 位数字 */
export function generateReceiptCode(): string {
  const now = Date.now().toString()
  const tail = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0")
  return `CD${(now + tail).slice(0, 19)}`
}
