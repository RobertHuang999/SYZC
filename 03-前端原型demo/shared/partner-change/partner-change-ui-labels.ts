/** 6.3 存量改造 · 各菜单 PartnerChangeFieldMark 文案真源 */

export {
  INBOUND_OWNER_PARTNER_CHANGE_ZONE_USER,
  INBOUND_OWNER_PARTNER_CHANGE_ZONE_SPEC,
} from "../inbound/partner-change-ui-labels"

export const OUTBOUND_OWNER_PARTNER_CHANGE_USER =
  "货主须从合作方档案「货主信息」选择已有档案；本页不提供快捷新建货主。"

export const OUTBOUND_OWNER_PARTNER_CHANGE_SPEC =
  "【货主信息库内匹配与准入规则】(WH-R01)：货主取自合作方档案「货主信息」；出库制单只能选已有货主，不提供快捷建档。真源：05 协同 3.3 节 · 11 出库三件套 · 【货主类型与字段隔离】(O05)。"

export const OUTBOUND_PICKUP_AGENT_PARTNER_CHANGE_USER =
  "个人提货须选择「提货人信息」档案或快捷建档绑定提货经办人；选中后姓名/证号/电话只读反显。"

export const OUTBOUND_PICKUP_AGENT_PARTNER_CHANGE_SPEC =
  "【提货经办人引用与快捷建档】(O06a)：个人提货经办人从「提货人信息」域选择或快捷建档；禁止失焦后自动建档，避免出现第二套提货人台账。经办人不触发【货主准入与地址唯一联动规则】(P02)。真源：05 协同 3.3 节。"

/** 出库制单 · 个人提货经办人快捷建档按钮（对齐入库「+ 快速添加货主」） */
export const OUTBOUND_PICKUP_QUICK_CREATE_BUTTON_LABEL = "+ 快速添加提货经办人"

export const PLATFORM_OWNER_POLICY_PARTNER_CHANGE_USER =
  "以下规则仅作用于「货主信息」档案保存与作业快捷建档绑货主；入库/出库/仓单引用货主时不因缺址阻断提交。"

export const PLATFORM_OWNER_POLICY_PARTNER_CHANGE_SPEC =
  "货主准入策略 P01~P09（仅货主域）；开启【证件地址防重复】前须完成 P03 历史冲突治理。真源：02 基础配置三件套 · 04 公共规则。"

export const SUPERVISION_OWNER_PARTNER_CHANGE_USER =
  "货主须从「货主信息」域选择；保存后生单快照，主档后续变更不回写本单。"

export const SUPERVISION_OWNER_PARTNER_CHANGE_SPEC =
  "【合作方子菜单分视图与隐式角色规则】(PA-R12)：货主 → 货主信息。真源：05 第八节 · 12 融资监管引用域。"

export const SUPERVISION_HOLDER_PARTNER_CHANGE_USER =
  "权人/质权人按单据类型分域选择，列表不得跨域混选；界面称谓须与域一致（监管服务单不用「资金方」指质权人）。"

export const SUPERVISION_HOLDER_PARTNER_CHANGE_SPEC =
  "抵押/质押 → 资金方信息（抵押权人/质押权人）；监管服务 → 服务方信息（质权人）。【抵质押权人合作方引用规则】(R-PLG-14) / 【监管服务质权人合作方引用规则】(R-PLG-15)。"
