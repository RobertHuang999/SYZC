import type { InspectionConfigRow } from "../domain/types"

let inspectionRowCounter = 0

function nextInspectionRowId(): string {
  inspectionRowCounter += 1
  return `insp-${inspectionRowCounter}`
}

export function createEmptyInspectionRow(
  defaults: Partial<Pick<InspectionConfigRow, "inspector" | "cycleDays">> = {}
): InspectionConfigRow {
  return {
    rowId: nextInspectionRowId(),
    inspector: defaults.inspector ?? "",
    cycleDays: defaults.cycleDays ?? "",
  }
}

export function createDefaultInspectionRows(): InspectionConfigRow[] {
  return [
    createEmptyInspectionRow({
      inspector: "孙巡检(仓管部)",
      cycleDays: "7",
    }),
  ]
}

export function updateInspectionRow(
  row: InspectionConfigRow,
  patch: Partial<InspectionConfigRow>
): InspectionConfigRow {
  return { ...row, ...patch }
}

export function validateInspectionRows(rows: InspectionConfigRow[]): string | null {
  const validRows = rows.filter(
    (row) => row.inspector.trim() && row.cycleDays.trim()
  )
  if (validRows.length === 0) {
    return "请至少配置一组巡检人与巡检周期"
  }

  for (const row of validRows) {
    const cycleDays = Number.parseInt(row.cycleDays, 10)
    if (!Number.isInteger(cycleDays) || cycleDays <= 0) {
      return "巡检周期必须为正整数"
    }
  }

  const inspectors = validRows.map((row) => row.inspector.trim())
  if (new Set(inspectors).size !== inspectors.length) {
    return "巡检人不可重复配置"
  }

  return null
}

export function formatInspectionRowsForDetail(
  rows: InspectionConfigRow[]
): string {
  return rows
    .filter((row) => row.inspector.trim())
    .map((row) => {
      const cycle = row.cycleDays.trim()
      return cycle
        ? `${row.inspector}（每 ${cycle} 天超期预警）`
        : row.inspector
    })
    .join("；")
}

export function parseInspectionRowsFromDetailFields(
  fields: { label: string; value: string }[]
): InspectionConfigRow[] {
  const configField = fields.find((field) => field.label.includes("巡检人"))
  if (!configField?.value.trim()) {
    return createDefaultInspectionRows()
  }

  return configField.value
    .split(/[；;]/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const match = segment.match(/^(.+?)（每\s*(\d+)\s*天/)
      if (match) {
        return createEmptyInspectionRow({
          inspector: match[1].trim(),
          cycleDays: match[2],
        })
      }
      return createEmptyInspectionRow({ inspector: segment })
    })
}
