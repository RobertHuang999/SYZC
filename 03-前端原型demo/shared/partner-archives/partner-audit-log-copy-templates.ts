/**
 * 合作方档案 · 操作审计日志文案子句与场景对照（后端常量注释镜像）
 *
 * 真源规则：【操作审批日志生成与防篡改规则】(PA-R07)
 * 一页纸速查：02-PRD文档/.../04-合作方档案/合作方档案-操作审计日志文案速查.md
 * 原型小红点：详情 #8 partner-archive-detail-logs · 表单 #6 partner-archive-form-actions · 列表 #4 partner-archive-row-actions
 *
 * 拼装：detail = clauses.join("；")
 */

/** 子句编号 → 模板（占位符 {name}） */
export const PARTNER_AUDIT_LOG_CLAUSE = {
  F01: "变更{fieldLabel}为【{newValue}】（原：{oldValue}）",
  F02: "变更业务联系电话为【{newPhone}】（原：{oldPhone}，短信二元核验通过）",
  F03: "变更证件登记地址为【{newFullAddress}】",
  F04: "变更证件登记地址为【{newFullAddress}】，改址原因：{reason}",
  F05: "补全证件登记地址【{fullAddress}】，主档必填项已齐备",
  F06: "更新合作方档案基础资料",
  R01: "执行主体冻结管控，原因：{reason}",
  R02: "解冻恢复主体正常状态，说明：{note}",
  D01: "{docTypeLabel} {docNo} 沉淀{targetLabel}简易信息，{summary}",
  D02: "{docTypeLabel} {docNo} 审批通过，固化{roleLabel}主体快照 (名称: {name} / 证件: {idNumber} / 地址: {addressSummary})",
  V01: "详情主动补验：短信二元身份确认通过，联系手机已验证（核心字段已锁定）",
  V02: "人工建档并短信验证成功（联系手机已验证，核心字段已锁定）",
  V03: "人工建档保存成功（联系手机未验证，金融场景提交前须补验）",
  X01: "在【{targetMenu}】创建独立主档或关联已有主档",
  E02: "确认更新企业资料：企业名称【{newName}】（原：{oldName}）；联系电话【{newPhone}】（原：{oldPhone}）",
  E03: "确认更新资金方名称：【{newName}】（原：{oldName}）",
} as const

export type PartnerAuditLogClauseId = keyof typeof PARTNER_AUDIT_LOG_CLAUSE

/** 快捷建档场景固定句（配 E01：句末可选「；保存并验证通过」） */
export const PARTNER_AUDIT_LOG_QUICK_CREATE_LINE: Record<
  "INBOUND" | "OUTBOUND_PICKUP" | "SUPERVISION_FUNDER" | "SUPERVISION_SERVICE",
  string
> = {
  INBOUND: "入库制单页快捷建档（默认联系手机未验证）",
  OUTBOUND_PICKUP: "出库制单页【快速添加经办人】建档",
  SUPERVISION_FUNDER: "监管办理页快捷建档（资金方信息域 · 企业主体）",
  SUPERVISION_SERVICE: "监管办理页快捷建档（服务方信息域 · 企业主体）",
}

/** 场景 → 徽章 actionName + 使用的子句编号（detail 由子句拼装） */
export const PARTNER_AUDIT_LOG_SCENARIO = [
  { scene: "管理端新增·未验证", actionName: "人工建档", clauses: ["V03"] as const },
  { scene: "管理端新增·保存并验证", actionName: "联系手机核验", clauses: ["V02"] as const },
  { scene: "快捷建档", actionName: "入库快捷建档|出库快捷建档|监管办理快捷建档", clauses: ["QUICK"] as const },
  { scene: "C端实名建档", actionName: "C端实名认证建档", clauses: ["CHANNEL"] as const },
  { scene: "编辑有变更", actionName: "编辑合作方档案", clauses: ["F02", "F03", "F04", "F01", "F06"] as const },
  { scene: "待补全补齐", actionName: "完善档案资料", clauses: ["F05", "F02", "F03", "F04", "F01"] as const },
  { scene: "详情补验手机", actionName: "联系手机核验", clauses: ["V01"] as const },
  { scene: "追加合作方档案", actionName: "追加合作方档案角色", clauses: ["X01"] as const },
  { scene: "冻结主体", actionName: "冻结主体", clauses: ["R01"] as const },
  { scene: "解冻主体", actionName: "解冻主体", clauses: ["R02"] as const },
  { scene: "单据静默沉淀", actionName: "单据静默沉淀", clauses: ["D01"] as const },
  { scene: "业务快照固化", actionName: "业务快照固化", clauses: ["D02"] as const },
  { scene: "企业资料确认更新", actionName: "确认更新企业资料", clauses: ["E02"] as const },
  { scene: "资金方名称确认", actionName: "确认更新资金方名称", clauses: ["E03"] as const },
] as const

/** detail 多段子句连接符 */
export const PARTNER_AUDIT_LOG_DETAIL_SEPARATOR = "；"
