import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import type { JobQuickCreateScene } from "./quick-create-partner"

/** 嵌入式选择器 · 快捷建档场景（按 archiveMenu） */
export function quickCreateSceneForArchiveMenu(
  menu: PartnerArchiveMenuLabel,
): JobQuickCreateScene | null {
  switch (menu) {
    case "货主信息":
      return "INBOUND_OWNER"
    case "提货人信息":
      return "OUTBOUND_PICKUP_AGENT"
    case "资金方信息":
      return "SUPERVISION_FUNDER"
    case "服务方信息":
      return "SUPERVISION_SERVICE_PROVIDER"
    default:
      return null
  }
}
