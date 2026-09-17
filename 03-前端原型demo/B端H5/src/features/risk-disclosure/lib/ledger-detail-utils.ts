import type { ReadonlyRiskRecord } from "@/features/readonly-risk-views/types"

const RECORD_SOURCE_WARNING: Record<string, string> = {
  "pub-h5-cw004": "cw-004",
  "pub-seed-001": "cw-003",
  "pub-seed-006": "cw-002",
}

export const CANCEL_CONFIRM_MESSAGE =
  "您正在操作取消风险公示，确认后风险公示列表将取消显示当前操作的风险内容，点击确认按钮后生效。"

export type LedgerDisclosureMeta = {
  disclosureStatus: "已公示" | "已取消"
  lastDisclosureTime: string
  lastOperator: string
  cancelReason: string | null
  operationHistory: Array<{
    action: string
    operator: string
    operatedAt: string
    remark: string | null
  }>
}

function parseOperationHistory(record: ReadonlyRiskRecord): LedgerDisclosureMeta["operationHistory"] {
  return record.sections
    .filter((section) => section.title.includes("操作") || section.title.includes("审计"))
    .flatMap((section) =>
      section.fields.map((field) => {
        const parts = field.value.split(" · ")
        if (parts.length >= 2) {
          return {
            action: field.label,
            operator: parts[0]?.trim() ?? "—",
            operatedAt: parts.slice(1).join(" · ").trim(),
            remark: null,
          }
        }

        return {
          action: field.label,
          operator: field.value,
          operatedAt: "—",
          remark: null,
        }
      })
    )
}

export function resolveSourceWarningId(recordId: string): string | null {
  return RECORD_SOURCE_WARNING[recordId] ?? null
}

export function buildLedgerDisclosureMeta(record: ReadonlyRiskRecord): LedgerDisclosureMeta {
  const lastDisclosureTime =
    record.summary.find((item) => item.label === "最近一次公示时间")?.value ??
    record.summary.find((item) => item.label === "公示时间")?.value ??
    record.summary.find((item) => item.label === "首次公示时间")?.value ??
    "—"
  const lastOperator =
    record.summary.find((item) => item.label === "最新操作人")?.value ?? "—"

  return {
    disclosureStatus: record.status === "已取消" ? "已取消" : "已公示",
    lastDisclosureTime,
    lastOperator,
    cancelReason: null,
    operationHistory: parseOperationHistory(record),
  }
}
