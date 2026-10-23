/** 改造地图 → 业务页「改造视窗」URL 约定 */

export const PARTNER_CHANGE_REVIEW_VALUE = "partner-63"

export function isPartnerChangeReviewMode(review: string | null): boolean {
  return review === PARTNER_CHANGE_REVIEW_VALUE
}

export function buildPartnerChangePrototypeRoute(
  basePath: string,
  mapId: string
): string {
  const sep = basePath.includes("?") ? "&" : "?"
  return `${basePath}${sep}review=${PARTNER_CHANGE_REVIEW_VALUE}&mapId=${encodeURIComponent(mapId)}`
}

export function scrollToPartnerChangeMark(markId: string) {
  document
    .getElementById(`partner-change-zone-${markId}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" })
}
