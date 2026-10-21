/**
 * 合作方档案 · 操作审计日志文案（详情 Tab「操作审计日志」）
 *
 * 范围：主档 **增、改、冻、解** 四类；不含单据审批/快照固化（归业务单据侧）。
 * 规则：【操作审批日志生成与防篡改规则】(PA-R07)
 * 速查：02-PRD文档/.../04-合作方档案/合作方档案-操作审计日志文案速查.md
 * 打点：详情 #8 · 表单 #6 · 列表 #4
 *
 * detail = 前缀组合句 + 变更子句 join(PARTNER_AUDIT_LOG_DETAIL_SEPARATOR)
 */

/** 详情 Tab 展示用动作徽章（四选一） */
export const PARTNER_AUDIT_ACTION_NAME = {
  CREATE: "创建合作方档案",
  UPDATE: "修改合作方档案",
  FREEZE: "冻结主体",
  UNFREEZE: "解冻主体",
} as const

/** 增 · 创建说明（选一条作 detail 主体） */
export const PARTNER_AUDIT_CREATE_LINE = {
  C01: "管理端人工创建：{verifyHint}",
  C02: "由{bizEntry}快捷创建：{note}",
  C03: "C 端实名认证通过，系统自动创建：{note}",
  C04: "由{docType} {docNo} 业务带出创建：{note}",
} as const

/** 改 · 变更子句（可多条） */
export const PARTNER_AUDIT_UPDATE_LINE = {
  M01: "变更{fieldLabel}为【{newValue}】（原：{oldValue}）",
  M02: "联系手机完成短信核验，状态变为已验证",
  M03: "补全证件登记地址【{fullAddress}】，必填项已齐备",
  M04: "变更证件登记地址为【{newFullAddress}】，改址原因：{reason}",
  M05: "在【{targetMenu}】追加独立主档或关联已有主档",
  M06: "确认更新企业资料：名称【{newName}】（原：{oldName}）；电话【{newPhone}】（原：{oldPhone}）",
} as const

/** 改 · 前缀 */
export const PARTNER_AUDIT_UPDATE_PREFIX = "修改合作方档案："

/** 冻 / 解 · 整句 */
export const PARTNER_AUDIT_STATUS_LINE = {
  S01: "冻结主体：{reason}",
  S02: "解冻主体：{note}",
} as const

export const PARTNER_AUDIT_LOG_DETAIL_SEPARATOR = "；"

/** 动作 → 徽章 + 常用组合句编号 */
export const PARTNER_AUDIT_CRUD_MAP = [
  { action: "增", actionName: PARTNER_AUDIT_ACTION_NAME.CREATE, lines: ["C01", "C02", "C03", "C04"] },
  { action: "改", actionName: PARTNER_AUDIT_ACTION_NAME.UPDATE, lines: ["M01", "M02", "M03", "M04", "M05", "M06"] },
  { action: "冻", actionName: PARTNER_AUDIT_ACTION_NAME.FREEZE, lines: ["S01"] },
  { action: "解", actionName: PARTNER_AUDIT_ACTION_NAME.UNFREEZE, lines: ["S02"] },
] as const
