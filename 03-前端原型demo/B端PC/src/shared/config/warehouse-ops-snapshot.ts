import type { WarehouseOpsConfig } from "@/features/platform-basic-config/domain/types"
import { platformBasicConfigInitialState } from "@/features/platform-basic-config/mock/platform-basic-config.mock"

const STORAGE_KEY = "SYZC_WAREHOUSE_OPS_SNAPSHOT"

export function readWarehouseOpsSnapshot(): WarehouseOpsConfig {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as WarehouseOpsConfig
    }
  } catch {
    /* ignore */
  }
  return { ...platformBasicConfigInitialState.warehouseOps, auditedRoomIds: [...platformBasicConfigInitialState.warehouseOps.auditedRoomIds] }
}

export function writeWarehouseOpsSnapshot(config: WarehouseOpsConfig) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...config,
        auditedRoomIds: [...config.auditedRoomIds],
      })
    )
  } catch {
    /* ignore */
  }
}
