import type { StagingRegStatus } from "./types"

export type InboundStagingFilters = {
  regNo: string
  inboundType: string
  warehouseCascadeKeys: string[]
  status: StagingRegStatus | "全部"
  ownerKeyword: string
  inboundDateStart: string
  inboundDateEnd: string
  relatedFormalNo: string
  registrantKeyword: string
}

export const DEFAULT_INBOUND_STAGING_FILTERS: InboundStagingFilters = {
  regNo: "",
  inboundType: "全部",
  warehouseCascadeKeys: [],
  status: "全部",
  ownerKeyword: "",
  inboundDateStart: "",
  inboundDateEnd: "",
  relatedFormalNo: "",
  registrantKeyword: "",
}
