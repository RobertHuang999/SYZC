import type { WarehouseOpsConfig } from "@/features/platform-basic-config/domain/types"
import { platformBasicConfigInitialState } from "@/features/platform-basic-config/mock/platform-basic-config.mock"

const STORAGE_KEY = "SYZC_WAREHOUSE_OPS_SNAPSHOT"

/** 仓库管理编辑库房与基础配置保存后广播，供各页 refresh */
export const WAREHOUSE_OPS_SNAPSHOT_EVENT = "syzc:warehouse-ops-snapshot"

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
    window.dispatchEvent(new CustomEvent(WAREHOUSE_OPS_SNAPSHOT_EVENT))
  } catch {
    /* ignore */
  }
}
