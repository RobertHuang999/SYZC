export type UploadFlowStageOption = {
  value: string
  label: string
  /** PC 下拉展示文案（与 label 一致，便于 Select 渲染） */
  stageText: string
  hint: string
}

/** 入库记录 · 上传补充资料：仅「入库发起」与「补充资料」 */
export const INBOUND_UPLOAD_FLOW_OPTIONS: UploadFlowStageOption[] = [
  {
    value: "1",
    label: "入库发起",
    stageText: "入库发起",
    hint: "发起入库流程随附的送货单、交接单、现场照片、过磅凭证等",
  },
  {
    value: "9527",
    label: "补充资料",
    stageText: "补充资料",
    hint: "流程完成后事后补录的发票、协议、结算单等通用补充",
  },
]

/** 出库记录 · 上传补充资料：仅「出库发起」与「补充资料」 */
export const OUTBOUND_UPLOAD_FLOW_OPTIONS: UploadFlowStageOption[] = [
  {
    value: "1",
    label: "出库发起",
    stageText: "出库发起",
    hint: "发起出库流程随附的提货委托、出场交接、过磅凭证等",
  },
  {
    value: "9527",
    label: "补充资料",
    stageText: "补充资料",
    hint: "流程完成后事后补录的运单、发票、结算单等通用补充",
  },
]

export function getUploadFlowOptions(
  orderType: "inbound" | "outbound",
): UploadFlowStageOption[] {
  return orderType === "outbound"
    ? OUTBOUND_UPLOAD_FLOW_OPTIONS
    : INBOUND_UPLOAD_FLOW_OPTIONS
}

/** 时间轴节点或历史 flowType 映射为上传表单可选值（仅 1 / 9527） */
export function resolveUploadFlowType(defaultFlowType?: string | null): string {
  if (defaultFlowType === "9527") return "9527"
  return "1"
}
