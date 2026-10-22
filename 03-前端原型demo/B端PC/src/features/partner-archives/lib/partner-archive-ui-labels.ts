import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import type { SubjectType } from "../domain/types"
import type { ArchiveRequiredGap } from "./archive-required-fields-pending"

/** 详情页 Tab 文案（PC / H5 共用） */
export const PARTNER_DETAIL_TAB_ITEMS = [
  { key: "basic", label: "基础档案" },
  { key: "linked", label: "其他合作档案" },
  { key: "account", label: "关联客户账号" },
  { key: "logs", label: "操作审计日志" },
] as const

export type PartnerDetailTabKey = (typeof PARTNER_DETAIL_TAB_ITEMS)[number]["key"]

/** 详情「基础档案」Tab：联系电话展示名 */
export function partnerContactPhoneDetailLabel(subjectType: SubjectType): string {
  return subjectType === "INDIVIDUAL" ? "手机号" : "联系电话（经办人手机）"
}

/** 新增/编辑表单：联系电话录入项展示名（与 PC 表单一致） */
export function partnerContactPhoneFormLabel(subjectType: SubjectType): string {
  return partnerContactPhoneDetailLabel(subjectType)
}

/** 列表关键词占位（与 PC 筛选区一致） */
export const PARTNER_LIST_KEYWORD_PLACEHOLDER = "请输入主体名称或证件号码"

/** 下游合作方下拉选择器默认占位（字段清单 5.2） */
export const PARTNER_SELECTOR_DEFAULT_PLACEHOLDER = "请选择合作方主体"

/** 列表抽屉：联系手机精确匹配占位 */
export const PARTNER_LIST_CONTACT_PHONE_PLACEHOLDER = "11 位手机号精确匹配"

/** 表单首卡标题（与 PC CardTitle 一致） */
export const PARTNER_FORM_BASE_SECTION_TITLE = "基础档案资料"

/** 新增页可选跨菜单建档区块标题（与 PC CardTitle 一致） */
export const PARTNER_FORM_INITIAL_ROLES_SECTION_TITLE = "追加合作方档案角色"

/** ── 上线界面文案（字段清单口径；页面只展示 USER_*，规则编号见 SPEC_* + 标注层）── */

/** 货主信息 · 证件登记地址（是否必填由基础配置决定，由表单传入 addressRequired） */
export function partnerFormAddressUserHint(
  subjectType: SubjectType,
  addressRequired: boolean,
): string {
  const certName = subjectType === "ENTERPRISE" ? "营业执照" : "身份证"
  const align = `请填写${certName}上的登记地址，与证照保持一致。`
  const dup = "同一登记地址不能重复绑定为多个货主。"
  if (addressRequired) {
    return `${align}${dup}`
  }
  return `选填。${align}若填写，系统将校验是否与其他货主重复。`
}

export const PARTNER_FORM_ADDRESS_SPEC_NOTE_OWNER =
  "货主域档案保存走【合作方档案证件地址必填校验规则】(P01)；追加货主走【证件登记地址防重复唯一校验与同步阻断规则】(P02)，个人与企业分池比对。"

/** @deprecated 非货主菜单表单不再展示地址区 ProductFieldHint（选填项，标题已足够） */
export const PARTNER_FORM_ADDRESS_USER_HINT_OTHER =
  "选填。可按证照填写登记地址。"

export const PARTNER_FORM_ADDRESS_SPEC_NOTE_OTHER =
  "【货主准入与地址唯一联动规则】(PA-R04) 的 P01/P02 **仅货主信息域**；提货人/资金方/服务方保存不强制 P01。"

export const PARTNER_FORM_INITIAL_ROLES_USER_HINT =
  "可选在其他子菜单同步创建独立主档或建立关联；未选则仅在本菜单建档，可稍后在详情页追加。"

export const PARTNER_FORM_INITIAL_ROLES_SPEC_NOTE =
  "勾选货主时调用统一准入服务，执行【货主准入与地址唯一联动规则】(PA-R04) 与 P01/P02。"

/** @deprecated 请改用 USER_HINT + PrototypeSpecCallout */
export const PARTNER_FORM_INITIAL_ROLES_HINT = PARTNER_FORM_INITIAL_ROLES_USER_HINT

/** 快捷建档弹窗：档案最终沉淀到哪个子菜单（双端共用） */
export function partnerQuickCreateArchiveUserHint(menuLabel: string) {
  return `建档后自动沉淀至「用户中心 / 合作方档案 / ${menuLabel}」，可在档案列表与详情继续完善。`
}

export const PARTNER_QUICK_CREATE_CERT_ADDRESS_LABEL = "证件登记地址"

export const PARTNER_QUICK_CREATE_CERT_ADDRESS_USER_HINT =
  "选填。填写后将校验是否与租户内其他货主重复；不填不影响保存。"

export const PARTNER_QUICK_CREATE_CERT_ADDRESS_SPEC_NOTE =
  "入库快捷建档不走 P01；有地址时走 P02（个人/企业分池）。"

export const PARTNER_PENDING_COMPLETION_OWNER_USER_BANNER =
  "还有必填项未填齐（若已开启登记地址必填，也须补全地址）。请补全后保存。"

export const PARTNER_PENDING_COMPLETION_PICKUP_USER_BANNER =
  "本菜单必填未齐。个人须补齐姓名、身份证、手机号；企业须补齐企业名称、信用代码、经办人姓名、经办人身份证与联系电话。"

export const PARTNER_PENDING_COMPLETION_FUNDER_USER_BANNER =
  "本菜单必填未齐。请补全企业全称与统一社会信用代码。"

export const PARTNER_PENDING_COMPLETION_SPEC_NOTE =
  "待补全由 04-x 必填派生；货主/提货人按各菜单 04-x 必填矩阵；仅货主信息因【货主证件地址必填校验规则】(P01) 纳入地址缺口；提货人/资金方/服务方不因缺址进入待补全。"

/** 货主信息 · 企业主体 · 经办人姓名（选填） */
export const PARTNER_OWNER_ENTERPRISE_AGENT_USER_HINT =
  "选填。可不填经办人姓名；填写后用于详情展示，已验证企业改经办人须短信确认。"

/** @deprecated 使用 partnerPendingCompletionUserBanner(archiveMenu) */
export const PARTNER_PENDING_COMPLETION_USER_BANNER =
  PARTNER_PENDING_COMPLETION_OWNER_USER_BANNER

export function partnerPendingCompletionUserBanner(menu: PartnerArchiveMenuLabel): string {
  switch (menu) {
    case "货主信息":
      return PARTNER_PENDING_COMPLETION_OWNER_USER_BANNER
    case "提货人信息":
      return PARTNER_PENDING_COMPLETION_PICKUP_USER_BANNER
    case "资金方信息":
    case "服务方信息":
      return PARTNER_PENDING_COMPLETION_FUNDER_USER_BANNER
    default:
      return PARTNER_PENDING_COMPLETION_PICKUP_USER_BANNER
  }
}

export const PARTNER_APPEND_OWNER_MISSING_ADDRESS_USER =
  "当前未录入证件地址。确认后货主角色为「待补全」，请稍后在档案编辑页补全登记地址。"

export const PARTNER_APPEND_OWNER_MISSING_ADDRESS_SPEC =
  "待补全不受 P01 阻断追加动作；档案保存时仍走 P01。"

export const PARTNER_APPEND_OWNER_WITH_ADDRESS_USER =
  "追加货主后，若证件地址与租户内其他货主重复，将无法通过校验。"

export const PARTNER_APPEND_OWNER_WITH_ADDRESS_SPEC =
  "执行 P02 分池唯一；档案保存时另走 P01 必填。"

export function partnerFormPageTitle(
  isEdit: boolean,
  menuShortLabel: string,
  subjectName?: string,
  isPendingCompletion?: boolean,
): string {
  if (isEdit) {
    if (isPendingCompletion) {
      return subjectName
        ? `补全${menuShortLabel}档案 — ${subjectName}`
        : `补全${menuShortLabel}档案`
    }
    return subjectName ? `编辑${menuShortLabel} — ${subjectName}` : `编辑${menuShortLabel}`
  }
  return `新增${menuShortLabel}`
}

/** 表单底栏按钮（PC / H5 新增编辑页一致） */
export const PARTNER_FORM_ACTION_LABELS = {
  saveSubmit: "保存并提交",
  saveVerify: "保存并验证",
  saveEdit: "保存修改",
  saveComplete: "补全并生效",
} as const

export type PartnerVerifyMode = "CREATE" | "CHANGE_PHONE" | "VERIFY_CONTACT"
export type PartnerVerifyContext =
  | "CREATE_ARCHIVE"
  | "DETAIL_VERIFY"
  | "INBOUND_CREATE"
  | "INBOUND_SUBMIT"

export function partnerVerifyDialogCopy(
  mode: PartnerVerifyMode | undefined,
  verifyContext: PartnerVerifyContext | undefined
): { user: string; spec?: string } {
  if (mode === "CHANGE_PHONE") {
    return { user: PARTNER_VERIFY_COPY.changePhone }
  }
  if (mode === "CREATE" || verifyContext === "CREATE_ARCHIVE") {
    return {
      user: PARTNER_VERIFY_COPY.verifyCreateUser,
      spec: PARTNER_VERIFY_COPY.verifyCreateSpec,
    }
  }
  if (mode === "VERIFY_CONTACT") {
    if (verifyContext === "INBOUND_SUBMIT") {
      return {
        user: PARTNER_VERIFY_COPY.inboundSubmitUser,
        spec: PARTNER_VERIFY_COPY.inboundSubmitSpec,
      }
    }
    if (verifyContext === "DETAIL_VERIFY") {
      return {
        user: PARTNER_VERIFY_COPY.verifyDetailUser,
        spec: PARTNER_VERIFY_COPY.verifyDetailSpec,
      }
    }
    return {
      user: PARTNER_VERIFY_COPY.verifyCreateUser,
      spec: PARTNER_VERIFY_COPY.verifyCreateSpec,
    }
  }
  if (verifyContext === "INBOUND_CREATE") {
    return {
      user: PARTNER_VERIFY_COPY.inboundCreateUser,
      spec: PARTNER_VERIFY_COPY.inboundCreateSpec,
    }
  }
  return {
    user: PARTNER_VERIFY_COPY.inboundCreateLegacyUser,
    spec: PARTNER_VERIFY_COPY.inboundCreateLegacySpec,
  }
}

export const PARTNER_VERIFY_COPY = {
  changePhone:
    "检测到合作方业务联系手机号发生变更。系统已向新手机号发送验证码，请完成确认后再保存。",
  verifyDetailUser:
    "请向当前预留的业务联系手机完成短信确认。通过后更新为「已验证」，姓名与身份标识将锁定不可随意修改。",
  verifyDetailSpec: "【联系手机核验后核心身份锁定规则】(PA-R04c)。",
  verifyCreateUser:
    "请向当前预留的业务联系手机完成短信确认。通过后建档为「已验证」，姓名与身份标识将锁定。",
  verifyCreateSpec: "【联系手机核验后核心身份锁定规则】(PA-R04c)。",
  inboundSubmitUser:
    "该货主联系手机尚未验证。完成短信确认后将更新为「已验证」，并继续提交本入库单审核。",
  inboundSubmitSpec: "【联系手机核验状态与金融场景强制核验规则】(PA-R04b)。",
  inboundCreateUser:
    "请核对货主实名信息与联系方式，并向预留手机完成短信确认。",
  inboundCreateSpec: "【新货主二元身份核验与建档沉淀规则】(R03)。",
  inboundCreateLegacyUser:
    "新货主须通过预留手机号短信确认，以确保主体信息真实有效。",
  inboundCreateLegacySpec: "入库准入 R03。",
} as const

export const PARTNER_QUICK_CREATE_INBOUND_USER =
  "证件地址选填；保存后联系手机为「未验证」。普通入库可直接引用该货主；质押/仓单等金融类入库提交前须先完成手机验证。"

export const PARTNER_QUICK_CREATE_INBOUND_SPEC =
  "不走档案 P01；有地址时 P02 分池；金融节点 PA-R04b。"

export const PARTNER_QUICK_CREATE_OUTBOUND_USER =
  "仅通过本入口建档；输入框失焦不会自动创建档案。角色为提货经办人，不参与货主地址唯一校验。"

export const PARTNER_QUICK_CREATE_OUTBOUND_SPEC =
  "出库快捷建档场景；不触发 P02。"

export const PARTNER_QUICK_CREATE_SUPERVISION_FUNDER_USER =
  "仅创建企业资金方档案，挂接至「资金方信息」菜单；用于抵押/质押单抵押权人、质押权人选择。"

export const PARTNER_QUICK_CREATE_SUPERVISION_FUNDER_SPEC =
  "【抵质押权人合作方引用规则】(R-PLG-14) · 【资金方信息库内匹配规则】(FN-R01)；不走货主 P01/P02。"

export const PARTNER_QUICK_CREATE_SUPERVISION_SERVICE_USER =
  "仅创建企业服务方档案，挂接至「服务方信息」菜单；用于监管服务单质权人，界面不写「资金方」。"

export const PARTNER_QUICK_CREATE_SUPERVISION_SERVICE_SPEC =
  "【监管服务质权人合作方引用规则】(R-PLG-15) · 【服务方信息库内匹配规则】(SP-R01)。"

/** 出库制单：货主须在库有货，不提供作业页快捷新增 */
export const OUTBOUND_OWNER_PICKER_USER_HINT =
  "请从已有货主档案中选择；出库须扣减在库库存，新建货主尚无货物，本页不提供快捷建档。需新货主请先在入库等入口建档并完成入库。"

export function partnerEmbeddedPickerUserHint(menu: PartnerArchiveMenuLabel): string {
  switch (menu) {
    case "货主信息":
      return "仅列出本租户「货主信息」域、主体与货主角色均为正常的档案。"
    case "资金方信息":
      return "仅列出「资金方信息」域档案，供抵押单/质押单选择抵押权人、质押权人。"
    case "服务方信息":
      return "仅列出「服务方信息」域档案，供监管服务单选择质权人（服务方）。"
    default:
      return "仅列出当前合作方子菜单域内、主体与对应角色均为正常的档案。"
  }
}

export function partnerEmbeddedPickerSpecNote(menu: PartnerArchiveMenuLabel): string {
  switch (menu) {
    case "货主信息":
      return "【货主合作方引用规则】(R-PLG-16) · 【货主信息库内匹配与准入规则】(WH-R01) · 【合作方子菜单分视图与隐式角色规则】(PA-R12)。"
    case "资金方信息":
      return "【抵质押权人合作方引用规则】(R-PLG-14) · FN-R01 · PA-R12 域间硬隔离。"
    case "服务方信息":
      return "【监管服务质权人合作方引用规则】(R-PLG-15) · SP-R01 · 禁止与资金方域混选。"
    default:
      return "PA-R12 按 archiveMenu 过滤可选主档。"
  }
}

export const PARTNER_DETAIL_PENDING_DOCS_USER =
  "本菜单必填项尚未齐备，请通过【补全资料】补录；完善前部分下游作业仍可按各业务规则引用。"

export const PARTNER_DETAIL_PENDING_DOCS_SPEC =
  "待补全由 04-x 必填派生；货主/提货人按各菜单必填矩阵；仅货主信息因【货主证件地址必填校验规则】(P01) 纳入地址缺口。"

/** 详情字段行：当前主档待补全缺口对应 inline 提示（无缺口返回 null） */
export function partnerFieldPendingInlineHint(
  gaps: ArchiveRequiredGap[],
  field: ArchiveRequiredGap,
): string | null {
  if (!gaps.includes(field)) {
    return null
  }
  const copy: Record<ArchiveRequiredGap, string> = {
    name: "待补全（请补录主体名称）",
    idNumber: "待补全（请补录身份标识）",
    contactPhone: "待补全（请补录联系电话）",
    agentName: "待补全（请补录经办人姓名）",
    agentIdNumber: "待补全（请补录经办人身份证号）",
    certAddress: "待补全（未录入证件登记地址）",
  }
  return copy[field]
}

export type PartnerConfirmCopy = {
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
  reasonLabel: string
  reasonPlaceholder: string
}

export const PARTNER_SUBJECT_FREEZE_DIALOG: PartnerConfirmCopy = {
  title: "确认冻结主体",
  description: "冻结后本菜单暂停发起新业务，请填写冻结原因。",
  confirmLabel: "确认冻结",
  destructive: true,
  reasonLabel: "冻结原因",
  reasonPlaceholder: "请输入冻结原因（1～200 字）",
}

export const PARTNER_SUBJECT_UNFREEZE_DIALOG: PartnerConfirmCopy = {
  title: "确认解冻主体",
  description: "解冻后恢复本菜单业务发起，请填写解冻原因。",
  confirmLabel: "确认解冻",
  reasonLabel: "解冻原因",
  reasonPlaceholder: "请输入解冻原因（1～200 字）",
}

export const PARTNER_SUBJECT_FREEZE_SUCCESS_TOAST = "已冻结，本菜单暂停发起新业务"
export const PARTNER_SUBJECT_UNFREEZE_SUCCESS_TOAST = "已解冻，可正常发起业务"

/** PC/H5 列表、详情冻结/解冻成功提示（双端一致） */
export function formatPartnerSubjectStatusToast(
  partnerName: string,
  action: "freeze" | "unfreeze",
): string {
  const suffix =
    action === "freeze"
      ? PARTNER_SUBJECT_FREEZE_SUCCESS_TOAST
      : PARTNER_SUBJECT_UNFREEZE_SUCCESS_TOAST
  return `【${partnerName}】${suffix}`
}

export function getPartnerRoleRowDialogCopy(
  action: "freeze" | "unfreeze" | "remove",
): PartnerConfirmCopy {
  if (action === "freeze") {
    return {
      title: "确认冻结角色",
      description: "冻结后该角色将限制发起对应业务，同主体其他角色不受影响。",
      confirmLabel: "确认冻结",
      destructive: true,
      reasonLabel: "冻结原因",
      reasonPlaceholder: "请输入冻结原因（1～200 字）",
    }
  }
  if (action === "unfreeze") {
    return {
      title: "确认解冻角色",
      description: "解冻后该角色恢复为正常状态，可继续参与业务单据。",
      confirmLabel: "确认解冻",
      reasonLabel: "解冻原因",
      reasonPlaceholder: "请输入解冻原因（1～200 字）",
    }
  }
  return {
    title: "确认移除非货主角色",
    description: "移除后角色关系流转为失效；货主角色不可移除。",
    confirmLabel: "确认移除",
    destructive: true,
    reasonLabel: "移除角色原因",
    reasonPlaceholder: "请输入移除原因（1～200 字）",
  }
}
