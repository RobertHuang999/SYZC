import type { SubjectType } from "../domain/types"

/** 详情页 Tab 文案（PC / H5 共用） */
export const PARTNER_DETAIL_TAB_ITEMS = [
  { key: "basic", label: "基础档案" },
  { key: "roles", label: "业务角色" },
  { key: "account", label: "关联客户账号" },
  { key: "documents", label: "关联业务单据" },
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

/** 新增页业务角色区块标题（与 PC CardTitle 一致） */
export const PARTNER_FORM_INITIAL_ROLES_SECTION_TITLE = "业务角色（首次挂接）"

/** ── 上线界面文案（字段清单口径；页面只展示 USER_*，规则编号见 SPEC_* + 标注层）── */

export function partnerFormAddressUserHint(subjectType: SubjectType): string {
  if (subjectType === "ENTERPRISE") {
    return "请填写营业执照上的登记地址，须与证照一致。勾选「货主」时，同一地址不可重复绑定多个企业货主。"
  }
  return "请填写身份证上的登记地址，须与证照一致。勾选「货主」时，同一地址不可重复绑定多个个人货主。"
}

export const PARTNER_FORM_ADDRESS_SPEC_NOTE =
  "档案保存走【合作方档案证件地址必填校验规则】(P01)；勾选货主走【证件登记地址防重复唯一校验与同步阻断规则】(P02)，个人与企业分池比对。"

export const PARTNER_FORM_INITIAL_ROLES_USER_HINT =
  "保存时将挂接所选角色；未选则仅创建主体，可稍后在详情页【追加角色】。"

export const PARTNER_FORM_INITIAL_ROLES_SPEC_NOTE =
  "勾选货主时调用统一准入服务，执行【货主准入与地址唯一联动规则】(PA-R04) 与 P01/P02。"

/** @deprecated 请改用 USER_HINT + PrototypeSpecCallout */
export const PARTNER_FORM_INITIAL_ROLES_HINT = PARTNER_FORM_INITIAL_ROLES_USER_HINT

export const PARTNER_QUICK_CREATE_CERT_ADDRESS_LABEL = "证件登记地址"

export const PARTNER_QUICK_CREATE_CERT_ADDRESS_USER_HINT =
  "选填。填写后将校验是否与租户内其他货主重复；不填不影响保存。"

export const PARTNER_QUICK_CREATE_CERT_ADDRESS_SPEC_NOTE =
  "入库快捷建档不走 P01；有地址时走 P02（个人/企业分池）。"

export const PARTNER_PENDING_COMPLETION_USER_BANNER =
  "该合作方处于「待补全」状态，请完善证件登记地址；保存通过后货主角色将变为正常。"

export const PARTNER_PENDING_COMPLETION_SPEC_NOTE =
  "对应 P01 档案域必填；缺址不阻断仓储/仓单等作业引用。"

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
  subjectName?: string,
  isPendingCompletion?: boolean,
): string {
  if (isEdit) {
    if (isPendingCompletion) {
      return subjectName ? `补全合作方档案 — ${subjectName}` : "补全合作方档案"
    }
    return subjectName ? `编辑合作方档案 — ${subjectName}` : "编辑合作方档案"
  }
  return "新增合作方档案"
}

/** 表单底栏按钮（PC / H5 新增编辑页一致） */
export const PARTNER_FORM_ACTION_LABELS = {
  saveSubmit: "保存并提交",
  saveVerify: "保存并验证",
  saveEdit: "保存修改",
  saveComplete: "补全并生效",
} as const

export const PARTNER_CHANGE_ADDRESS_DIALOG = {
  title: "确认变更证件地址",
  descriptionUser:
    "检测到证件登记地址已变更。保存后将按准入规则校验新地址，并记录改址原因；历史业务单据中的地址快照不会变更。",
  descriptionSpec:
    "【个人货主证件地址变更规则】(PA-R06a)：统一准入校验、活跃池切换、审计留痕。",
  confirmLabel: "确认改址并保存",
  reasonLabel: "改址原因",
  reasonPlaceholder: "请输入改址原因（1～200 字，如搬迁、证件登记信息变更等）",
  /** @deprecated 使用 descriptionUser */
  description:
    "检测到证件登记地址已变更。保存后将按准入规则校验新地址，并记录改址原因；历史业务单据中的地址快照不会变更。",
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

export const PARTNER_DETAIL_PENDING_DOCS_USER =
  "存在待补全角色或资料不完整，请通过【去补全资料】完善证件登记地址；完善前部分作业仍可引用该货主。"

export const PARTNER_DETAIL_PENDING_DOCS_SPEC =
  "P01 仅档案保存必填；仓储/仓单不因缺址阻断。"

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
  description:
    "冻结后该主体名下业务角色将暂停发起新业务单据，历史在库库存进入只读风控锁定。请录入冻结原因。",
  confirmLabel: "确认冻结",
  destructive: true,
  reasonLabel: "冻结原因",
  reasonPlaceholder: "请输入冻结理由（1～200 字）",
}

export const PARTNER_SUBJECT_UNFREEZE_DIALOG: PartnerConfirmCopy = {
  title: "提交解冻主体申请",
  description:
    "解冻须风控审批终审通过后生效。请录入解冻复核依据；原型演示在确认后模拟审批通过。",
  confirmLabel: "提交解冻申请",
  reasonLabel: "解冻原因",
  reasonPlaceholder: "请输入解冻复核依据（1～200 字）",
}

export const PARTNER_SUBJECT_UNFREEZE_SUCCESS_TOAST = "解冻审批已通过，主体已恢复正常"

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
      reasonPlaceholder: "请输入解冻复核依据（1～200 字）",
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
