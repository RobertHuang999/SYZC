/** 平台管理 · 基础配置页 · 上线文案与规格对照 */

export const PARTNER_POLICY_INDIVIDUAL_CERT_SPEC =
  "【合作方档案证件地址必填校验规则】(P01) 仅档案保存；不影响入库/出库/仓单作业。"

export const PARTNER_POLICY_INDIVIDUAL_DUP_SPEC =
  "【证件登记地址防重复唯一校验与同步阻断规则】(P02) 个人货主池。"

export const PARTNER_POLICY_ENTERPRISE_CERT_SPEC =
  "P01 档案域必填（企业营业执照登记地址）；作业引用不因缺址拦截。"

export const PARTNER_POLICY_ENTERPRISE_DUP_SPEC =
  "P02 企业货主池，与个人分池互不混比。"

export const PARTNER_POLICY_ENTERPRISE_FOOTNOTE_USER =
  "企业货主以统一社会信用代码实名；登记地址防重复与个人货主分别校验。"

export const PARTNER_POLICY_DUP_AUDIT_SPEC =
  "【策略放宽强控变更原因审计规则】(P04)：必填改「选填」或关闭防重复时须录变更原因。"
