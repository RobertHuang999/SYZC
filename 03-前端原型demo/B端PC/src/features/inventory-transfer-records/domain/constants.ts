import type { TransferRecordFilters, TransferType } from "./types"

export const TRANSFER_RECORD_LIST_PATH = "/仓储/移库管理/移库记录"
export const TRANSFER_RECORD_ADD_PATH = "/仓储/移库管理/移库记录/新增"
export const transferRecordDetailPath = (id: string) =>
  `/仓储/移库管理/移库记录/详情/${encodeURIComponent(id)}`

export const PAGE_SIZE = 10

export const DEFAULT_TRANSFER_FILTERS: TransferRecordFilters = {
  id: "",
  transferType: "ALL",
  ownerNameOrIdentity: "",
  warehouseId: "ALL",
  goodsName: "",
  createBy: "ALL",
  transferStartDate: "",
  transferEndDate: "",
  createStartDate: "",
  createEndDate: "",
}

export const TRANSFER_TYPE_OPTIONS: { label: string; value: string; disabled?: boolean }[] = [
  { label: "全部", value: "ALL" },
  { label: "质押移库", value: "PLEDGE" },
  { label: "抵押移库", value: "MORTGAGE" },
  { label: "普通移库", value: "NORMAL" },
  { label: "仓单移库", value: "RECEIPT" },
]

export const FORM_TRANSFER_TYPE_OPTIONS: {
  label: string
  value: TransferType
  disabled?: boolean
  hint?: string
}[] = [
  { label: "普通移库", value: "NORMAL" },
  {
    label: "仓单移库 (请到仓单管理操作移库)",
    value: "RECEIPT",
    disabled: true,
    hint: "遵循【移库类型来源与仓单移库置灰】(R02)，仓单移库须在仓单管理发起",
  },
  { label: "质押移库", value: "PLEDGE" },
  { label: "抵押移库", value: "MORTGAGE" },
]

export const TRANSFER_TYPE_LABEL_MAP: Record<TransferType, string> = {
  NORMAL: "普通移库",
  PLEDGE: "质押移库",
  MORTGAGE: "抵押移库",
  RECEIPT: "仓单移库",
}

