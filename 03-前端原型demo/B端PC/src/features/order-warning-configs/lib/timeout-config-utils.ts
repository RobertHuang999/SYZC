import type {
  OrderGoodsBatch,
  OrderType,
  TimeoutConfigRow,
  TimeoutWarningType,
} from "../domain/types"

export function getDefaultTimeoutWarningType(
  orderType: OrderType | ""
): TimeoutWarningType {
  return orderType === "监管" ? "解监管超时" : "解抵/质押超时"
}

export function getTimeoutWarningTypeOptions(
  orderType: OrderType | ""
): TimeoutWarningType[] {
  if (orderType === "监管") {
    return ["解监管超时"]
  }
  if (orderType === "抵/质押") {
    return ["解抵/质押超时"]
  }
  return ["解抵/质押超时", "解监管超时"]
}

function addDaysToDateTime(base: string, days: number): string | null {
  const match = base.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:\s(\d{2}):(\d{2}))?/
  )
  if (!match || !Number.isFinite(days) || days <= 0) {
    return null
  }

  const [, year, month, day, hour = "00", minute = "00"] = match
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  )
  date.setDate(date.getDate() + days)

  const pad = (value: number) => String(value).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function computeExpectedTriggerAt(
  pledgedAt: string,
  timeoutDays: string
): string | null {
  const days = Number.parseInt(timeoutDays, 10)
  if (!Number.isFinite(days) || days <= 0) {
    return null
  }
  return addDaysToDateTime(pledgedAt, days)
}

export function createTimeoutRowsFromBatches(
  batches: OrderGoodsBatch[],
  existingRows: TimeoutConfigRow[] = []
): TimeoutConfigRow[] {
  const existingByBatch = new Map(
    existingRows.map((row) => [row.batchId, row])
  )

  return batches.map((batch) => {
    const existing = existingByBatch.get(batch.batchId)
    const timeoutDays = existing?.timeoutDays ?? ""
    return {
      rowId: existing?.rowId ?? batch.batchId,
      batchId: batch.batchId,
      warningType: existing?.warningType ?? batch.defaultWarningType,
      qrCode: batch.qrCode,
      goodsLabel: batch.goodsLabel,
      pledgedAt: batch.pledgedAt,
      timeoutDays,
      expectedTriggerAt: computeExpectedTriggerAt(batch.pledgedAt, timeoutDays),
    }
  })
}

export function updateTimeoutRow(
  row: TimeoutConfigRow,
  patch: Partial<TimeoutConfigRow>
): TimeoutConfigRow {
  const next = { ...row, ...patch }
  return {
    ...next,
    expectedTriggerAt: computeExpectedTriggerAt(
      next.pledgedAt,
      next.timeoutDays
    ),
  }
}

export function formatTimeoutRowsForDetail(
  rows: TimeoutConfigRow[]
): { label: string; value: string }[] {
  const configured = rows.filter((row) => row.timeoutDays.trim())
  if (configured.length === 0) {
    return [{ label: "超时配置", value: "—" }]
  }

  return configured.map((row, index) => ({
    label: `批次 ${index + 1}`,
    value: `${row.warningType} · ${row.qrCode} · ${row.goodsLabel} · ${row.timeoutDays} 天${
      row.expectedTriggerAt ? ` · 预计 ${row.expectedTriggerAt}` : ""
    }`,
  }))
}

export function validateTimeoutRows(rows: TimeoutConfigRow[]): string | null {
  const configured = rows.filter((row) => row.timeoutDays.trim())
  if (configured.length === 0) {
    return "请至少配置一条二维码超时天数"
  }

  for (const row of configured) {
    const days = Number.parseInt(row.timeoutDays, 10)
    if (!Number.isFinite(days) || days <= 0) {
      return "超时天数须为正整数"
    }
  }

  return null
}
