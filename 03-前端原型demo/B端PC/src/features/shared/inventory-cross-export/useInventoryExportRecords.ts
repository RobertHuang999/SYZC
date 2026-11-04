import { useSyncExternalStore } from "react"
import type { ExportRecordItem } from "@/features/inventory-management/domain/types"
import {
  getInventoryExportRecordsSnapshot,
  prependInventoryExportRecord,
  subscribeInventoryExportRecords,
} from "./inventoryCrossExportStore"

export function useInventoryExportRecords(): {
  records: ExportRecordItem[]
  prependRecord: typeof prependInventoryExportRecord
} {
  const records = useSyncExternalStore(
    subscribeInventoryExportRecords,
    getInventoryExportRecordsSnapshot,
    getInventoryExportRecordsSnapshot
  )
  return { records, prependRecord: prependInventoryExportRecord }
}
