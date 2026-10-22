export interface StageOption {
  value: string
  label: string
  hint: string
}

/** 入库流程四阶段（与 PC 端 UploadSupplementaryModal 的阶段选项一致） */
export const INBOUND_STAGE_OPTIONS: StageOption[] = [
  {
    value: "1",
    label: "入库申请初审",
    hint: "现场随车送货单、进场交接单、实物照片等",
  },
  {
    value: "2",
    label: "过磅核验",
    hint: "现场地磅过磅单、复磅更正函、称重凭据等",
  },
  {
    value: "3",
    label: "入库终审与质检",
    hint: "SGS第三方化验单、商检证书、品质报告等",
  },
  {
    value: "9527",
    label: "事后综合补充",
    hint: "仓储费结算发票、货转协议等通用补充",
  },
]

/** 出库流程四阶段 */
export const OUTBOUND_STAGE_OPTIONS: StageOption[] = [
  {
    value: "1",
    label: "出库申请审核",
    hint: "出库申请单、提货委托书、货权人证明等",
  },
  {
    value: "2",
    label: "出场过磅核验",
    hint: "出库地磅单、出场实车交接单据等",
  },
  {
    value: "3",
    label: "出库终审放行",
    hint: "放行确认单、出库品质检验单据等",
  },
  {
    value: "9527",
    label: "事后综合补充",
    hint: "运费结算单、运单发票等通用补充",
  },
]

export function getStageOptions(orderType: "inbound" | "outbound"): StageOption[] {
  return orderType === "outbound" ? OUTBOUND_STAGE_OPTIONS : INBOUND_STAGE_OPTIONS
}
