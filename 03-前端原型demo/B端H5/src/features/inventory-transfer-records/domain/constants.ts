import type { MovingFlowTypeValue, MovingRecordItem } from "./types"

/* ---------------- 移库记录（工作台 · 移库管理） ---------------- */

export const H5_MOVING_RECORD_LIST_PATH = "/m/workspace/moving-records"

export const h5MovingRecordDetailPath = (id: string) =>
  `/m/workspace/moving-records/${encodeURIComponent(id)}`

/** 移库类型下拉（列表筛选与发起页共用；仓单移库须回仓单管理操作，不在此发起） */
export const MOVING_FLOW_TYPES: Array<{
  id: MovingFlowTypeValue
  name: string
}> = [
  { id: "NORMAL", name: "普通移库" },
  { id: "PLEDGE", name: "质押移库" },
  { id: "MORTGAGE", name: "抵押移库" },
  { id: "CD", name: "仓单移库" },
]

/** 在押货细分类型（按业务口径归并「抵押 / 质押 / 仓单 / 普通存货」） */
export function getMovingTypeText(record: MovingRecordItem): { text: string; value: string } {
  if (record.refType === 1) {
    if (record.pledgeType === 2) return { text: "仓单移库", value: "CD" }
    return record.applyType === 1
      ? { text: "抵押移库", value: "MORTGAGE" }
      : { text: "质押移库", value: "PLEDGE" }
  }
  return { text: "普通移库", value: "NORMAL" }
}

/** 审核状态（列表卡片胶囊 + 详情摘要标签） */
export const MOVING_CHECK_STATUS_MAP: Record<
  number,
  { text: string; tone: "amber" | "emerald" | "rose" | "slate" }
> = {
  1: { text: "审核中", tone: "amber" },
  2: { text: "已通过", tone: "emerald" },
  3: { text: "已驳回", tone: "rose" },
  4: { text: "已撤销", tone: "slate" },
}

/* ---------------- 货物转让（工作台 · 货物转让） ---------------- */

export const H5_TRANSFER_RECORD_LIST_PATH = "/m/workspace/transfer-records"

export const h5TransferRecordDetailPath = (id: string) =>
  `/m/workspace/transfer-records/${encodeURIComponent(id)}`

export const H5_WAREHOUSE_OPTIONS = [
  { label: "全部仓库", value: "ALL" },
  { label: "海霸王一号冷库", value: "海霸王一号冷库" },
  { label: "海霸王二号综合库", value: "海霸王二号综合库" },
  { label: "西南大宗商品保税库", value: "西南大宗商品保税库" },
  { label: "生鲜冷链储备库", value: "生鲜冷链储备库" },
]

export const H5_CREATOR_OPTIONS = [
  { label: "全部制单人", value: "ALL" },
  { label: "张明", value: "张明" },
  { label: "李华", value: "李华" },
  { label: "王建军", value: "王建军" },
]
