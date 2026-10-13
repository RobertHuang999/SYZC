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

function isSubjectPolicyRelaxed(
  baseline: PartnerSubjectAccessPolicy,
  current: PartnerSubjectAccessPolicy
) {
  const requiredRelaxed =
    baseline.certAddressRequired === "是" && current.certAddressRequired === "否"
  const duplicateRelaxed =
    baseline.addressDuplicatePrevent && !current.addressDuplicatePrevent
  return requiredRelaxed || duplicateRelaxed
}

export function isPartnerAccessRelaxed(
  baseline: PartnerAccessConfig,
  current: PartnerAccessConfig
) {
  return (
    isSubjectPolicyRelaxed(baseline.individual, current.individual) ||
    isSubjectPolicyRelaxed(baseline.enterprise, current.enterprise)
  )
}
