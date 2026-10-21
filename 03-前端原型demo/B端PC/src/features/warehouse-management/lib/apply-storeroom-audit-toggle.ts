import type { WarehouseOpsConfig } from "@/features/platform-basic-config/domain/types"
import {
  applyStoreroomInboundAuditToggle as applyShared,
  ALL_STOREROOM_IDS,
} from "@prototype/shared/warehouse/inbound-audit-toggle"

export function getAllStoreroomIds(): string[] {
  return [...ALL_STOREROOM_IDS]
}

export function applyStoreroomInboundAuditToggle(
  ops: WarehouseOpsConfig,
  storeroomId: string,
  enableAudit: boolean
): WarehouseOpsConfig | null {
  return applyShared(ops, storeroomId, enableAudit)
}
