/** 对齐 native `warehousing-order.vue` typeList */
export type InboundTypeCode =
  | "NORMAL"
  | "MORTGAGE"
  | "PLEDGE"
  | "CD"
  | "SUPERVISION_SERVICE"

export type InboundTypeOption = {
  id: string
  name: string
  typeCode: InboundTypeCode
  needRelated: boolean
}

export const INBOUND_TYPE_OPTIONS: InboundTypeOption[] = [
  { id: "4", name: "普通入库", typeCode: "NORMAL", needRelated: false },
  { id: "1", name: "抵押入库", typeCode: "MORTGAGE", needRelated: true },
  { id: "2", name: "质押入库", typeCode: "PLEDGE", needRelated: true },
  { id: "3", name: "仓单入库", typeCode: "CD", needRelated: true },
  {
    id: "5",
    name: "监管服务入库",
    typeCode: "SUPERVISION_SERVICE",
    needRelated: true,
  },
]

export function inboundTypeNameToCode(name: string): InboundTypeCode | null {
  return INBOUND_TYPE_OPTIONS.find((t) => t.name === name)?.typeCode ?? null
}

export function isManualWarehouseType(typeCode: InboundTypeCode | null): boolean {
  if (!typeCode) return false
  return ["NORMAL", "MORTGAGE", "PLEDGE", "SUPERVISION_SERVICE"].includes(typeCode)
}
