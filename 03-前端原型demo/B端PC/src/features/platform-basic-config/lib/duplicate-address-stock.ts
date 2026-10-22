import { duplicateAddressConflictsMock } from "../mock/platform-basic-config.mock"
import type {
  DuplicateAddressOwnerPool,
  PartnerAccessConfig,
} from "../domain/types"

/** 货主准入策略卡片侧：个人 / 企业主体键 */
export type PartnerSubjectKey = "individual" | "enterprise"

export function partnerSubjectToOwnerPool(
  subject: PartnerSubjectKey
): DuplicateAddressOwnerPool {
  return subject === "individual" ? "personal" : "enterprise"
}

/** 原型 Mock：按分池判断存量排查结果是否仍有冲突组 */
export function hasDuplicateAddressConflictsInPool(pool: DuplicateAddressOwnerPool): boolean {
  return duplicateAddressConflictsMock.some((row) => row.ownerPool === pool)
}

/**
 * 【货主准入策略】保存前：防重复由关改开时，对应分池须已无冲突（P03）。
 */
export function validatePartnerDuplicateEnableOnSave(
  saved: PartnerAccessConfig,
  current: PartnerAccessConfig
): string | null {
  const subjects: { key: PartnerSubjectKey; label: string }[] = [
    { key: "individual", label: "个人货主" },
    { key: "enterprise", label: "企业货主" },
  ]

  for (const { key, label } of subjects) {
    const turningOn =
      !saved[key].addressDuplicatePrevent && current[key].addressDuplicatePrevent
    if (!turningOn) continue

    const pool = partnerSubjectToOwnerPool(key)
    if (hasDuplicateAddressConflictsInPool(pool)) {
      return `${label}仍存在历史重复证件地址，请先完成治理后再开启防重复并保存`
    }
  }

  return null
}
