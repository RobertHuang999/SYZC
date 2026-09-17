import type { RiskDisclosureFilters } from "./types"

export const DEFAULT_FILTERS: RiskDisclosureFilters = {
  ruleName: "",
  orderNo: "",
  ownerName: "",
  warningType: "",
}

export const PAGE_SIZE = 10

export const DISCLOSURE_STATUS_BADGE_CLASS: Record<string, string> = {
  已公示: "border-green-200 bg-green-50 text-green-700",
  已取消: "border-border bg-muted text-muted-foreground",
  未公示: "border-orange-200 bg-orange-50 text-orange-700",
}
