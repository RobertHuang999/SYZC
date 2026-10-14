export {
  inboundStagingRegsMock,
  getStagingRegByNo,
  getStagingRegById,
  markStagingConverted,
  rollbackStagingReg,
  voidStagingReg,
  saveStagingReg,
  nextStagingRegNo,
  regToMinimalFormPrefill,
} from "../../../../../shared/inbound/inbound-staging.mock"

export type {
  InboundStagingReg,
  StagingInboundType,
  StagingRegStatus,
  SaveStagingRegInput,
} from "../../../../../shared/inbound/inbound-staging.mock"
