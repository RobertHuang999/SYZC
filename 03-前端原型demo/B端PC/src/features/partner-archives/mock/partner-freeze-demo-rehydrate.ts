import type { PartnerSubject } from "../domain/types"
import {
  MOCK_FUNDER_FREEZE_BLOCKING_DOCS,
  MOCK_OWNER_FREEZE_BLOCKING_DOCS,
  MOCK_PICKUP_FREEZE_BLOCKING_DOCS,
  MOCK_SERVICE_FREEZE_BLOCKING_DOCS,
} from "./partner-freeze-blocking-mock-docs"

/** 【分菜单主体冻结与在途在库前置校验规则】(PA-R02) · 原型可复现阻断的主体 ID */
export const PARTNER_FREEZE_BLOCKING_DEMO_IDS = [
  "p-01",
  "p-05",
  "p-08",
  "p-10",
] as const

/** 各菜单已冻结样例（H5/PC 筛「冻结」或列表沉底可见） */
export const PARTNER_FROZEN_DEMO_IDS = ["p-12", "p-13", "p-14", "p-15"] as const

const BLOCKING_DOCS_BY_PARTNER_ID: Record<string, PartnerSubject["associatedDocs"]> = {
  "p-01": MOCK_OWNER_FREEZE_BLOCKING_DOCS,
  "p-05": MOCK_PICKUP_FREEZE_BLOCKING_DOCS,
  "p-08": MOCK_FUNDER_FREEZE_BLOCKING_DOCS,
  "p-10": MOCK_SERVICE_FREEZE_BLOCKING_DOCS,
}

/** 运行时若 associatedDocs 被清空，读档时补回 PA-R02 演示单据 */
export function withPartnerFreezeDemoData(partner: PartnerSubject): PartnerSubject {
  if (partner.status !== "NORMAL") {
    return partner
  }
  const seed = BLOCKING_DOCS_BY_PARTNER_ID[partner.id]
  if (!seed?.length) {
    return partner
  }
  if ((partner.associatedDocs?.length ?? 0) > 0) {
    return partner
  }
  return {
    ...partner,
    associatedDocs: [...seed],
  }
}

export function enrichPartnerListForFreezeDemo(list: PartnerSubject[]): PartnerSubject[] {
  return list.map((item) => withPartnerFreezeDemoData(item))
}
