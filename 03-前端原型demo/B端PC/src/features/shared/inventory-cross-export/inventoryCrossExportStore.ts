import type { ExportRecordItem } from "@/features/inventory-management/domain/types"
import { DEFAULT_EXPORT_RECORDS } from "@/features/inventory-management/domain/constants"

let records: ExportRecordItem[] = [...DEFAULT_EXPORT_RECORDS]

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeInventoryExportRecords(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getInventoryExportRecordsSnapshot(): ExportRecordItem[] {
  return records
}

export function prependInventoryExportRecord(record: ExportRecordItem) {
  records = [record, ...records]
  emit()

  if (record.status === "GENERATING") {
    window.setTimeout(() => {
      records = records.map((row) =>
        row.id === record.id
          ? {
              ...row,
              status: "SUCCESS",
              fileSize: row.crossMenuPackaged ? "1.2 MB" : "512.0 KB",
              recordCount: 1280,
            }
          : row
      )
      emit()
    }, 2200)
  }
}
