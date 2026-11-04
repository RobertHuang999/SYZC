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
  "【策略放宽强控变更原因审计规则】(P04)：修改证件是否必填或防重复后保存，须录变更原因。"

/** 防重复区：个人/企业各自开关，页内说明保持笼统 */
export const PARTNER_POLICY_DUP_EFFECT_USER =
  "某侧防重复为「开启」时，该侧同一证件地址只能绑定一家货主（个人与企业分开算）。"

export const PARTNER_POLICY_DUP_POLICY_HINT_USER =
  "个人与企业分别配置，互不影响。保存时会确认变更并填写原因；某侧若要新开启防重复，须先排查该侧重复地址。"

export const PARTNER_POLICY_DUP_SCAN_ORDER_SPEC =
  "【存量数据检测排查规则】(P03)：防重复开关开启或关闭时均可排查；由关改开须先排查且分池无冲突方可开启。"

export const PARTNER_POLICY_SAVE_DIALOG_TITLE_USER = "确认保存策略变更"

export const PARTNER_POLICY_SAVE_DIALOG_DESCRIPTION_USER =
  "您正在修改货主证件地址准入策略（是否必填、是否防重复）。请填写变更原因说明，保存后会记入「策略变更审计」。"

export const PARTNER_POLICY_SAVE_DIALOG_CONFIRM_USER = "确认保存"

export const PARTNER_POLICY_SAVE_DIALOG_REASON_PLACEHOLDER_USER =
  "例：个人开启防重复、企业暂不开启，经风控同意。"
