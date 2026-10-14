export const INBOUND_STAGING_LIST_PATH = "/仓储/入库管理/入库暂存登记"

export const INBOUND_STAGING_FORM_PATH = `${INBOUND_STAGING_LIST_PATH}/新增`

export function inboundStagingDetailPath(id: string) {
  return `${INBOUND_STAGING_LIST_PATH}/详情/${id}`
}

export function inboundStagingEditPath(id: string) {
  return `${INBOUND_STAGING_LIST_PATH}/编辑/${id}`
}

export const H5_INBOUND_INITIATE_BASE = "/m/inbound/initiate"

export const PC_INBOUND_FORM_ADD_PATH = "/仓储/入库管理/入库记录/新增"
