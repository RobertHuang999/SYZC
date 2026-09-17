export type RiskDisclosureSearchField =
  | "ruleName"
  | "orderNo"
  | "ownerName"
  | "warningType"

export const RISK_DISCLOSURE_SEARCH_FIELD_OPTIONS = [
  { label: "规则名称", value: "ruleName" },
  { label: "订单号", value: "orderNo" },
  { label: "货主", value: "ownerName" },
  { label: "预警类型", value: "warningType" },
] as const satisfies ReadonlyArray<{
  label: string
  value: RiskDisclosureSearchField
}>

export const RISK_DISCLOSURE_SEARCH_PLACEHOLDERS: Record<
  RiskDisclosureSearchField,
  string
> = {
  ruleName: "请输入规则名称",
  orderNo: "请输入预警订单号",
  ownerName: "请输入货主名称",
  warningType: "请输入预警类型",
}
