/**
 * 线上监管业务办理（线上抵质押办理）· 共享 UI 文案与规格说明真源
 * 供 B端PC 与 B端H5 双端复用，确保口径一致
 */

export const ONLINE_PLEDGE_PAGE_TITLE = "线上监管业务办理"

export const ONLINE_PLEDGE_PAGE_USER_DESC =
  "承接授信通过的融资申请，支持双端发起抵质押信息确认、风控审核、电子存证固化及放款结果录入；审核拒绝或主动撤销在本地回退至「申请成功」，暂不流入被拒退回池。"

export const ONLINE_PLEDGE_ROLLBACK_USER_HINT =
  "审核拒绝或经办人主动撤销后，单据将直接回退至「申请成功」状态并释放标的临时锁定，可在修正后重新发起办理。"

export const ONLINE_PLEDGE_ROLLBACK_SPEC_NOTE =
  "遵循【抵质押异常本地回退机制规则】(R02)：本期暂不流向被拒退回池，回退后保留完整异常回退原因与审计日志。"

export const ONLINE_PLEDGE_INITIATE_USER_HINT =
  "请核对授信批复额度与拟质押标的明细，确认标的处于在库可用或未质押状态后提交。"

export const ONLINE_PLEDGE_INITIATE_SPEC_NOTE =
  "遵循【质押标的存续与可用性强校验规则】(R01) 与【标的物状态异常或重复质押阻断】(C01)：占用、冻结或盘点锁仓标的将被阻断发起。"

export const ONLINE_PLEDGE_DISBURSE_USER_HINT =
  "请按资方实际划拨回单录入贷款金额、贷款期数、放款日期并上传放款凭证附件（10MB 以内 PDF/JPG/PNG）。"

export const ONLINE_PLEDGE_DISBURSE_SPEC_NOTE =
  "遵循【贷款金额与授信额度强约束规则】(R03)、【贷款期数与还款周期合规规则】(R04)、【PC端与移动端双端防并发版本锁规则】(R05) 与【放款结果异步全链路回写规则】(R07)。"

export const ONLINE_PLEDGE_SETTLED_USER_HINT =
  "关联抵质押订单已完成解质押结清，本融资单据已进入终态只读归档，不可再修改或逆向流转。"

export const ONLINE_PLEDGE_SETTLED_SPEC_NOTE =
  "遵循【解质押结清同步与终态锁定规则】(R08)：单向终态锁定，保留全链路电子存证与审计导出能力。"

