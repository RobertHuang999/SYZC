/** 与 PC 原型共用 sessionStorage 键，便于同域演示 WH-V12 */
const STORAGE_KEY = "SYZC_WAREHOUSE_OPS_SNAPSHOT"

export type YesNo = "是" | "否"
export type WarehouseScopeMode = "全部库房" | "指定库房"

export interface WarehouseOpsConfig {
  moveRequiresAudit: YesNo
  inOutRequiresAudit: YesNo
  auditScopeMode: WarehouseScopeMode
  auditedRoomIds: string[]
}

const DEFAULT_WAREHOUSE_OPS: WarehouseOpsConfig = {
  moveRequiresAudit: "是",
  inOutRequiresAudit: "是",
  auditScopeMode: "指定库房",
  auditedRoomIds: ["room-sz-1", "room-sz-2", "room-sh-a"],
}

export function readWarehouseOpsSnapshot(): WarehouseOpsConfig {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as WarehouseOpsConfig
    }
  } catch {
    /* ignore */
  }
  return {
    ...DEFAULT_WAREHOUSE_OPS,
    auditedRoomIds: [...DEFAULT_WAREHOUSE_OPS.auditedRoomIds],
  }
}
