import type { ReadonlyRiskRecord } from "@/features/readonly-risk-views/types"
import type { RiskDisclosureSearchField } from "../domain/list-filters"

export type RiskDisclosureListDisplay = {
  ruleName: string
  orderNo: string
  ownerName: string
  warningType: string
  summary: string
  disclosureTime: string
  operator: string
}

export function parseRiskDisclosureRecordDisplay(
  record: ReadonlyRiskRecord
): RiskDisclosureListDisplay {
  const [orderNo = record.title, typeFromSubtitle = ""] = record.subtitle
    .split("·")
    .map((part) => part.trim())
  const warningType =
    record.warningType ??
    record.summary.find((field) => field.label === "预警类型")?.value ??
    typeFromSubtitle ??
    "—"
  const summary =
    record.summary.find((field) => field.label === "公示标题与内容摘要")
      ?.value ?? record.title
  const disclosureTime =
    record.summary.find((field) => field.label === "最近一次公示时间")?.value ??
    record.summary.find((field) => field.label === "公示时间")?.value ??
    "—"
  const operator =
    record.summary.find((field) => field.label === "最新操作人")?.value ?? "—"
  const ownerName =
    record.ownerName ??
    record.summary.find((field) => field.label === "货主")?.value ??
    "—"
  const ruleName = record.ruleName ?? "—"

  return {
    ruleName,
    orderNo,
    ownerName,
    warningType,
    summary,
    disclosureTime,
    operator,
  }
}

export function matchRiskDisclosureRecordByField(
  record: ReadonlyRiskRecord,
  field: RiskDisclosureSearchField,
  keyword: string
): boolean {
  const normalized = keyword.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  const display = parseRiskDisclosureRecordDisplay(record)
  const target = display[field].toLowerCase()
  return target.includes(normalized)
}

export function getPublicityStatusClass(status: string) {
  if (status === "已公示") {
    return "bg-purple-50 text-purple-700 border border-purple-200"
  }
  if (status === "已取消") {
    return "bg-gray-100 text-gray-500 border border-gray-200"
  }
  return "bg-amber-50 text-amber-700 border border-amber-200"
}
