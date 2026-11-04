/** 平台管理 · 基础配置页 · 上线文案与规格对照 */

/** 仓储 / 准入 / 协议顶栏：放弃当前分类未保存修改 */
export const BULK_SAVE_TOPBAR_CANCEL_USER = "取消"

export const UNSAVED_LEAVE_DIALOG_DESCRIPTION_USER =
  "您有配置内容尚未保存，若直接取消编辑，未保存内容将会丢失，请确认是否取消？"

export const UNSAVED_LEAVE_DIALOG_CONFIRM_USER = "确认取消"

export const BULK_EDIT_DISCARDED_TOAST_USER = "已取消当前分类编辑，未保存修改已丢弃"

export const PARTNER_POLICY_INDIVIDUAL_CERT_SPEC =
  "【货主证件地址必填校验规则】(P01) 仅货主信息子菜单保存；不影响入库/出库/仓单作业。"

export const PARTNER_POLICY_INDIVIDUAL_DUP_SPEC =
  "【证件登记地址防重复唯一校验与同步阻断规则】(P02) 个人货主池。"

export const PARTNER_POLICY_ENTERPRISE_CERT_SPEC =
  "【货主证件地址必填校验规则】(P01) 仅货主信息保存（企业营业执照登记地址）；作业引用不因缺址拦截。"

export const PARTNER_POLICY_ENTERPRISE_DUP_SPEC =
  "P02 企业货主池，与个人分池互不混比。"

export const PARTNER_POLICY_ENTERPRISE_FOOTNOTE_USER =
  "企业货主以统一社会信用代码实名；登记地址防重复与个人货主分别校验。"

export const PARTNER_POLICY_DUP_AUDIT_SPEC =
  "【策略放宽强控变更原因审计规则】(P04)：必填改「选填」或关闭防重复时须录变更原因。"

export const PARTNER_POLICY_DUP_SCAN_ORDER_USER =
  "开启前先点「排查历史重复地址」；还有重复就开不了。保存时会再确认一次。"

export const PARTNER_POLICY_DUP_ENABLE_DIALOG_TITLE_USER = "确认开启防重复"

export const PARTNER_POLICY_DUP_ENABLE_DIALOG_DESCRIPTION_USER =
  "开启后，同类货主不能共用同一证件地址，冲突会直接拦截。请确认已排查过，且没有重复地址。"

export const PARTNER_POLICY_DUP_ENABLE_DIALOG_CONFIRM_USER = "确认保存"

export const PARTNER_POLICY_DUP_SCAN_ORDER_SPEC =
  "【存量数据检测排查规则】(P03)：防重复开关开启或关闭时均可排查；由关改开须先排查且分池无冲突方可开启。"

/** 防重复开关旁：放宽必填或关闭防重复时保存须录原因（P04 页内说明） */
export const PARTNER_POLICY_DUP_RELAX_SAVE_USER =
  "关闭防重复，或证件地址改为不必填，保存时要写变更原因。"

export const PARTNER_POLICY_RISK_RELAX_DIALOG_TITLE_USER = "确认放宽风控"

export const PARTNER_POLICY_RISK_RELAX_DIALOG_DESCRIPTION_USER =
  "放宽后，冒用地址、虚假建档的风险会变大。请填写变更原因，会记在下方「策略变更审计」里。"

export const PARTNER_POLICY_RISK_RELAX_REASON_PLACEHOLDER_USER =
  "例：经风控审批，因存量地址重叠，暂关闭防重复。"

export const PARTNER_POLICY_INDIVIDUAL_DUP_WARNING_USER =
  "开启后，一个证件地址只能绑一个个人货主，重复会拦截。"

export const PARTNER_POLICY_ENTERPRISE_DUP_WARNING_USER =
  "开启后，企业之间同一登记地址只能对应一家企业（与个人分开校验）。"
