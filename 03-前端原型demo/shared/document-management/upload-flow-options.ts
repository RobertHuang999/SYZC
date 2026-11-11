export type UploadFlowStageOption = {
  value: string
  label: string
  /** PC 下拉展示文案（与 label 一致，便于 Select 渲染） */
  stageText: string
}

export type DocumentOrderType = "inbound" | "outbound" | "transfer" | "supervision"

/** 入库记录 · 上传补充资料：仅「入库发起」与「补充资料」 */
export const INBOUND_UPLOAD_FLOW_OPTIONS: UploadFlowStageOption[] = [
  {
    value: "1",
    label: "入库发起",
    stageText: "入库发起",
  },
  {
    value: "9527",
    label: "补充资料",
    stageText: "补充资料",
  },
]

/** 出库记录 · 上传补充资料：仅「出库发起」与「补充资料」 */
export const OUTBOUND_UPLOAD_FLOW_OPTIONS: UploadFlowStageOption[] = [
  {
    value: "1",
    label: "出库发起",
    stageText: "出库发起",
  },
  {
    value: "9527",
    label: "补充资料",
    stageText: "补充资料",
  },
]

/** 移库记录 · 上传补充资料：仅「移库发起」与「补充资料」 */
export const TRANSFER_UPLOAD_FLOW_OPTIONS: UploadFlowStageOption[] = [
  {
    value: "1",
    label: "移库发起",
    stageText: "移库发起",
  },
  {
    value: "9527",
    label: "补充资料",
    stageText: "补充资料",
  },
]

/** 监管管理 · 上传补充资料：仅「监管办理发起」与「补充资料」 */
export const SUPERVISION_UPLOAD_FLOW_OPTIONS: UploadFlowStageOption[] = [
  {
    value: "1",
    label: "监管办理发起",
    stageText: "监管办理发起",
  },
  {
    value: "9527",
    label: "补充资料",
    stageText: "补充资料",
  },
]

export function getUploadFlowOptions(
  orderType: DocumentOrderType,
): UploadFlowStageOption[] {
  if (orderType === "outbound") return OUTBOUND_UPLOAD_FLOW_OPTIONS
  if (orderType === "transfer") return TRANSFER_UPLOAD_FLOW_OPTIONS
  if (orderType === "supervision") return SUPERVISION_UPLOAD_FLOW_OPTIONS
  return INBOUND_UPLOAD_FLOW_OPTIONS
}

/** 时间轴节点或历史 flowType 映射为上传表单可选值（仅 1 / 9527） */
export function resolveUploadFlowType(defaultFlowType?: string | null): string {
  if (defaultFlowType === "9527") return "9527"
  return "1"
}
