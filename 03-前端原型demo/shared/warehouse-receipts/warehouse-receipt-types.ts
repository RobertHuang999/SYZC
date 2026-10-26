/** 仓单管理 · 双端共享领域类型（PC 列表/详情 与 H5 列表/详情/开立/动碰 共用） */

export type ReceiptStatus = "PENDING" | "NORMAL" | "FROZEN" | "CANCELLED"

export type ReceiptPartyType = "ENTERPRISE" | "PERSON"

export type ReceiptParty = {
  type: ReceiptPartyType
  /** 企业全称 / 个人姓名 */
  name: string
  /** 企业统一社会信用代码 / 个人脱敏手机号 */
  identifier: string
}

export type ReceiptGoodsLot = {
  id: string
  warehouseName: string
  houseName: string
  houseAudit: "审核" | "不审核"
  zoneName: string
  /** 垛位；未划分时展示「--」 */
  position: string
  /** 入库时间，YYYY-MM-DD HH:mm:ss */
  inboundAt: string
  /** 入库时填写的自定义扩展属性，如「季节: 卡夫卡」 */
  otherInfo: string[]
  /** 存货条码编号 */
  barcode: string
  /** 批次实物状态，仓单内固定为「仓单中」 */
  statusLabel: "仓单中"
  /** 该批次本次开立/在单数量 */
  quantity: number
  unit: string
}

export type ReceiptGoodsGroup = {
  id: string
  /** 大类，如「水果」 */
  category: string
  /** 品类，如「西瓜」 */
  variety: string
  /** 规格，如「超级-宁夏」 */
  spec: string
  /** 展示全称：大类-品类-规格 */
  name: string
  quantity: number
  unit: string
  lots: ReceiptGoodsLot[]
}

export type ReceiptChangeType =
  | "仓单开立"
  | "仓单补货"
  | "仓单出库"
  | "仓单移库"
  | "货物移除"
  | "持有人变更"
  | "仓单注销"

export type ReceiptChangeRecord = {
  id: string
  changedAt: string
  changeType: ReceiptChangeType
  summary: string
  operator: string
  /** 关联业务单号（出库单/移库单/质押单等） */
  relatedNo?: string
}

/** 动碰流程类型：补货/出库/移库/注销四类之间互斥（R-DWR-04） */
export type ReceiptFlowType = "仓单补货" | "仓单出库" | "仓单移库" | "仓单注销"

export type WarehouseReceipt = {
  id: string
  code: string
  owner: ReceiptParty
  holder: ReceiptParty
  warehouseName: string
  /** 仓库是否取得中仓登准入认证 */
  thirdPartyRegistered: boolean
  /** 开立时间 */
  establishedAt: string
  status: ReceiptStatus
  creatorName: string
  creatorOrg: string
  /** 列表双行展示：姓名(机构全称) */
  creatorDisplay: string
  createdAt: string
  cancelledAt?: string
  /** 当前在途未办结流程（用于演示 R-DWR-04 互斥拦截） */
  currentFlow?: ReceiptFlowType
  goodsGroups: ReceiptGoodsGroup[]
  changes: ReceiptChangeRecord[]
  remark?: string
}

export const RECEIPT_STATUS_LABEL: Record<ReceiptStatus, string> = {
  PENDING: "审批中",
  NORMAL: "正常",
  FROZEN: "冻结",
  CANCELLED: "注销",
}

export const RECEIPT_STATUS_ORDER: ReceiptStatus[] = [
  "PENDING",
  "NORMAL",
  "FROZEN",
  "CANCELLED",
]

/** 详情页状态大圆章配色（对齐 ASCII 详情页第 2 节） */
export const RECEIPT_STATUS_SEAL_COLOR: Record<
  ReceiptStatus,
  { background: string; label: string }
> = {
  PENDING: { background: "#E6A23C", label: "审批中" },
  NORMAL: { background: "#67C23A", label: "正常" },
  FROZEN: { background: "#909399", label: "冻结" },
  CANCELLED: { background: "#757575", label: "注销" },
}

/** 列表状态标签 Tone（PC 用 badge、H5 用胶囊，语义一致） */
export const RECEIPT_STATUS_TONE: Record<
  ReceiptStatus,
  { badge: string; h5: string; dot: string }
> = {
  PENDING: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    h5: "bg-amber-50 text-amber-600 border border-amber-200",
    dot: "bg-amber-500",
  },
  NORMAL: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    h5: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  FROZEN: {
    badge: "border-slate-300 bg-slate-100 text-slate-700",
    h5: "bg-slate-100 text-slate-600 border border-slate-300",
    dot: "bg-slate-500",
  },
  CANCELLED: {
    badge: "border-slate-200 bg-slate-50 text-slate-500",
    h5: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
  },
}

export function receiptStatusLabel(status: ReceiptStatus): string {
  return RECEIPT_STATUS_LABEL[status]
}

/** 正常态 8 项操作；其余三态仅详情 + 下载（R-DWR-05） */
export type ReceiptRowAction =
  | "detail"
  | "replenish"
  | "outbound"
  | "inbound"
  | "relocate"
  | "remove"
  | "cancel"
  | "download"

export const RECEIPT_NORMAL_ACTIONS: ReceiptRowAction[] = [
  "detail",
  "replenish",
  "outbound",
  "inbound",
  "relocate",
  "remove",
  "cancel",
  "download",
]

export const RECEIPT_READONLY_ACTIONS: ReceiptRowAction[] = ["detail", "download"]

export const RECEIPT_ACTION_LABEL: Record<ReceiptRowAction, string> = {
  detail: "详情",
  replenish: "仓单补货",
  outbound: "仓单出库",
  inbound: "仓单入库",
  relocate: "仓单移库",
  remove: "仓单移除",
  cancel: "注销",
  download: "下载",
}

/** 需在移动端完成人脸核验的动碰类操作（R-DWR-03） */
export const RECEIPT_MOBILE_FACE_ACTIONS: ReceiptRowAction[] = [
  "replenish",
  "outbound",
  "inbound",
  "relocate",
  "remove",
  "cancel",
]

export function receiptActionsForStatus(status: ReceiptStatus): ReceiptRowAction[] {
  return status === "NORMAL" ? RECEIPT_NORMAL_ACTIONS : RECEIPT_READONLY_ACTIONS
}

/** 四位小数以内，去掉无意义末尾 0 */
export function formatReceiptQuantity(value: number): string {
  return Number(value.toFixed(4)).toString()
}

/** 列表「货物名称」单行：大类-品类-规格-数量单位 */
export function formatReceiptGoodsLine(group: ReceiptGoodsGroup): string {
  return `${group.name}-${formatReceiptQuantity(group.quantity)}${group.unit}`
}

/** 货品总量（同单位才可累加；跨单位时返回 null） */
export function receiptTotalQuantity(
  receipt: WarehouseReceipt,
): { value: string; unit: string } | null {
  const units = new Set(receipt.goodsGroups.map((group) => group.unit))
  if (units.size !== 1) return null
  const total = receipt.goodsGroups.reduce((sum, group) => sum + group.quantity, 0)
  return { value: formatReceiptQuantity(total), unit: [...units][0] }
}

export function receiptGoodsKindCount(receipt: WarehouseReceipt): number {
  return receipt.goodsGroups.length
}

export function receiptLotCount(receipt: WarehouseReceipt): number {
  return receipt.goodsGroups.reduce((sum, group) => sum + group.lots.length, 0)
}

/** 列表持有人/存货人双行展示 */
export function partySubline(party: ReceiptParty): string {
  return party.type === "ENTERPRISE" ? `(${party.identifier})` : `(${party.identifier})`
}

/** 动碰流程在途提示文案（R-DWR-04） */
export function receiptFlowConflictMessage(flow: ReceiptFlowType): string {
  return `您还有【${flow}】正在审批中，暂无法发起新的流程！`
}
