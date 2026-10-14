import type { MobileInboundRecord } from "../domain/types"
import {
  INBOUND_APPROVED_SEEDS,
  approvedSeedToMobileView,
} from "../../../../../shared/inbound/inbound-approved-seed"

function seedToMobileRecord(
  seed: (typeof INBOUND_APPROVED_SEEDS)[number]
): MobileInboundRecord {
  const base = approvedSeedToMobileView(seed)
  return {
    ...base,
    storageLocations:
      seed.mobileId === "m-inbound-2"
        ? [
            {
              locationName: "生鲜仓库-水果库房审核-审核分区",
              quantityLabel: "1 吨",
              qrCodeNo: "SYZC-210520-POS1",
            },
          ]
        : undefined,
  }
}

/** 与 PC 台账共用 `shared/inbound/inbound-approved-seed.ts` 真源 */
export const mobileInboundRecordsMock: MobileInboundRecord[] =
  INBOUND_APPROVED_SEEDS.map(seedToMobileRecord)

export function getMobileInboundById(id: string | undefined) {
  if (!id) return undefined
  return mobileInboundRecordsMock.find((row) => row.id === id)
}
