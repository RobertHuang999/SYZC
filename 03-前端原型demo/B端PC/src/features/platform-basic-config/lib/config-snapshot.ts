import type { ConfigCategoryId } from "../domain/types"
import type {
  AgreementItem,
  PartnerAccessConfig,
  PartnerSubjectAccessPolicy,
  PlatformBasicConfigState,
  WarehouseOpsConfig,
} from "../domain/types"

export function cloneWarehouseOps(config: WarehouseOpsConfig): WarehouseOpsConfig {
  return {
    ...config,
    auditedRoomIds: [...config.auditedRoomIds],
  }
}

function cloneSubjectPolicy(policy: PartnerSubjectAccessPolicy): PartnerSubjectAccessPolicy {
  return { ...policy }
}

export function clonePartnerAccess(config: PartnerAccessConfig): PartnerAccessConfig {
  return {
    individual: cloneSubjectPolicy(config.individual),
    enterprise: cloneSubjectPolicy(config.enterprise),
  }
}

export function cloneAgreements(items: AgreementItem[]): AgreementItem[] {
  return items.map((item) => ({ ...item }))
}

export function cloneBulkSection(state: PlatformBasicConfigState) {
  return {
    warehouseOps: cloneWarehouseOps(state.warehouseOps),
    partnerAccess: clonePartnerAccess(state.partnerAccess),
    agreements: cloneAgreements(state.agreements),
  }
}

export type CategorySavedSnapshots = {
  "warehouse-ops": WarehouseOpsConfig
  "partner-access": PartnerAccessConfig
  agreements: AgreementItem[]
}

export function buildCategorySavedSnapshots(
  state: PlatformBasicConfigState
): CategorySavedSnapshots {
  return {
    "warehouse-ops": cloneWarehouseOps(state.warehouseOps),
    "partner-access": clonePartnerAccess(state.partnerAccess),
    agreements: cloneAgreements(state.agreements),
  }
}

export const BULK_SAVE_CATEGORIES: ConfigCategoryId[] = [
  "warehouse-ops",
  "partner-access",
  "agreements",
]

function isSubjectPolicyFieldChanged(
  baseline: PartnerSubjectAccessPolicy,
  current: PartnerSubjectAccessPolicy
) {
  return (
    baseline.certAddressRequired !== current.certAddressRequired ||
    baseline.addressDuplicatePrevent !== current.addressDuplicatePrevent
  )
}

/** 个人或企业任一「必填 / 防重复」相对已保存值有改动 → 保存前统一确认并录原因 */
export function isPartnerAccessPolicyChanged(
  baseline: PartnerAccessConfig,
  current: PartnerAccessConfig
) {
  return (
    isSubjectPolicyFieldChanged(baseline.individual, current.individual) ||
    isSubjectPolicyFieldChanged(baseline.enterprise, current.enterprise)
  )
}
