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

/** 新增页业务角色区块说明（与 PC 表单一致） */
export const PARTNER_FORM_INITIAL_ROLES_HINT =
  "保存时将挂接所选角色；未选则仅创建主体，稍后在详情【追加角色】维护。勾选「货主」时将调用统一准入核验（PA-R04）。"

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
  description:
    "检测到个人货主证件登记地址已发生变动。依据【个人货主证件地址改址准入规则】(PA-R06a)，改址须经统一准入校验，保存后原旧地址释放出池、新地址进入活跃池，并记录不可变审计日志。请录入改址原因。",
  confirmLabel: "确认改址并保存",
  reasonLabel: "改址原因",
  reasonPlaceholder: "请输入改址原因（1～200 字，如搬迁、证件登记信息变更等）",
} as const

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
