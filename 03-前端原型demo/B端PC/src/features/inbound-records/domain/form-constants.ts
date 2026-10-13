import type { ManualInboundType, OwnerType } from "./form-types"

/** PC 手工可选 4 种；其余项展示为禁用并带引导文案（与线上下拉一致） */
export type InboundTypeOption = {
  value: ManualInboundType | "仓单入库" | "退货入库"
  label: string
  disabled?: boolean
  hint?: string
}

export const INBOUND_TYPE_OPTIONS: InboundTypeOption[] = [
  { value: "抵押入库", label: "抵押入库" },
  { value: "质押入库", label: "质押入库" },
  { value: "监管服务入库", label: "监管服务入库" },
  {
    value: "仓单入库",
    label: "仓单入库",
    disabled: true,
    hint: "请前往移动端操作入库",
  },
  {
    value: "退货入库",
    label: "退货入库",
    disabled: true,
    hint: "请前往提货单操作入库",
  },
  { value: "普通入库", label: "普通入库" },
]

export const SELECTABLE_INBOUND_TYPES: ManualInboundType[] = [
  "抵押入库",
  "质押入库",
  "监管服务入库",
  "普通入库",
]

export const OWNER_TYPES: OwnerType[] = ["企业货主", "个人货主"]

export const RELATED_ORDER_PLACEHOLDER: Record<
  "质押入库" | "抵押入库" | "监管服务入库",
  string
> = {
  质押入库: "请选择关联质押单",
  抵押入库: "请选择关联抵押单",
  监管服务入库: "请选择关联监管服务单",
}

export const RELATED_ORDER_DIALOG_TITLE: Record<
  "质押入库" | "抵押入库" | "监管服务入库",
  string
> = {
  质押入库: "选择质押货物",
  抵押入库: "选择抵押货物",
  监管服务入库: "选择监管服务货物",
}
