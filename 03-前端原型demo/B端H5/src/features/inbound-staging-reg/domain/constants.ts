export const INBOUND_STAGING_LIST_ROUTE = "/m/workspace/inbound-staging"
export const INBOUND_STAGING_DETAIL_ROUTE = "/m/workspace/inbound-staging"
export const INBOUND_STAGING_FORM_ROUTE = "/m/inbound/staging/reg"
export const INBOUND_STAGING_GOODS_ROUTE = "/m/inbound/staging/reg/goods"
export const INBOUND_STAGING_FORM_RESUME = { resumeStagingDraft: true } as const

export function inboundStagingDetailPath(id: string) {
  return `${INBOUND_STAGING_DETAIL_ROUTE}/${id}`
}

export function inboundStagingEditQuery(id: string) {
  return `${INBOUND_STAGING_FORM_ROUTE}?edit=${encodeURIComponent(id)}`
}

export const H5_INBOUND_INITIATE_ROUTE = "/m/inbound/initiate"
