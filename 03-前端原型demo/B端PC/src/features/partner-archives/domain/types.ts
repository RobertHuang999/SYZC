export type SubjectType = "INDIVIDUAL" | "ENTERPRISE" // 个人 | 企业
export type SubjectStatus = "NORMAL" | "FROZEN" // 正常 | 冻结

export type RoleType = "OWNER" | "PICKUP_AGENT" | "RECEIVER" | "FUNDER" // 货主 | 提货经办人 | 接收方 | 资金方

export type RoleStatus =
  | "NORMAL" // 正常
  | "PENDING_COMPLETION" // 待补全
  | "PENDING_EFFECTIVE" // 待生效
  | "FROZEN" // 冻结
  | "INVALID" // 失效

export type SourceType = "MANUAL" | "CLIENT_AUTH" | "DOC_SETTLEMENT" // 人工建档 | C端认证 | 单据沉淀

/** 业务联系手机短信二元核验状态（与 C 端实名认证独立） */
export type ContactPhoneVerifyStatus = "VERIFIED" | "UNVERIFIED"

export interface CertAddress {
  province: string
  city: string
  district: string
  detail: string
  fullAddress: string
}

export interface PartnerRoleItem {
  roleType: RoleType
  roleStatus: RoleStatus
  /** 来源单据类型；无来源展示 —— */
  sourceDocType?: string
  /** 来源单据号；无来源展示 —— */
  sourceDocNo?: string
  /** 角色生效时间（首次流转为正常的时刻） */
  roleEffectiveTime: string
  /** 角色失效时间；未失效展示 —— */
  roleInvalidTime?: string
  /** 冻结原因；仅冻结状态展示 */
  freezeReason?: string
}

export interface BoundAccountInfo {
  accountId: string
  /** C 端登录标识：手机号（当前仅支持手机号登录） */
  loginPhone: string
  authStatus: "AUTHENTICATED" | "AUTHENTICATING" | "UNAUTHENTICATED"
  bindTime: string
}

export interface AssociatedDocItem {
  id: string
  docType: "INBOUND" | "OUTBOUND" | "TRANSFER" | "WARRANT" | "RESERVATION"
  docTypeName: string
  docNo: string
  /** 承担业务角色：货主 | 提货经办人 | 接收方 | 资金方 | 存货人 */
  roleName?: string
  bizDate: string
  statusName: string
  /** 字段清单 §4.2：经办人员 */
  handlerName: string
  /** 业务品类/数量规格说明 */
  remark?: string
}

export interface AuditLogItem {
  id: string
  opTime: string
  operator: string
  actionType:
    | "CREATE"
    | "EDIT"
    | "FREEZE"
    | "UNFREEZE"
    | "APPEND_ROLE"
    | "CHANGE_ROLE_STATUS"
    | "BIND_ACCOUNT"
    | "AUDIT_SNAPSHOT"
  actionName: string
  detail: string
  /** 客户端 IP 地址留痕 */
  ip?: string
}

export interface PartnerSubject {
  id: string
  partnerNo: string
  name: string
  subjectType: SubjectType
  idNumber: string
  idNumberMasked: string
  certAddress: CertAddress
  contactPhone: string
  /** 联系手机核验；未填时由 source 等规则推导（见 resolveContactPhoneVerified） */
  contactPhoneVerified?: ContactPhoneVerifyStatus
  /** 最近一次短信核验通过时间；未验证展示 —— */
  contactPhoneVerifiedAt?: string
  /** 企业经办人姓名（仅企业主体） */
  agentName?: string
  status: SubjectStatus
  roles: PartnerRoleItem[]
  source: SourceType
  sourceDocNo?: string
  createDate: string
  createTime: string
  createdBy: string
  updatedBy?: string
  /** 更新人所在机构（如森云科技、华东仓储监管中心等） */
  updatedByOrg?: string
  updateTime: string
  boundAccount?: BoundAccountInfo
  associatedDocs: AssociatedDocItem[]
  auditLogs: AuditLogItem[]
}

export interface PartnerArchiveFilters {
  keyword: string
  contactPhone: string
  /** 全部 / 已验证 / 未验证 */
  contactPhoneVerified: string
  subjectType: string
  roleType: string
  subjectStatus: string
  roleStatus: string
  source: string
  createTimeStart: string
  createTimeEnd: string
}

export const AUTH_STATUS_LABELS: Record<
  BoundAccountInfo["authStatus"],
  string
> = {
  AUTHENTICATED: "已认证",
  AUTHENTICATING: "认证中",
  UNAUTHENTICATED: "未认证",
}

export const ROLE_TYPE_LABELS: Record<RoleType, string> = {
  OWNER: "货主",
  PICKUP_AGENT: "提货经办人",
  RECEIVER: "接收方",
  FUNDER: "资金方",
}

export const ROLE_STATUS_LABELS: Record<RoleStatus, string> = {
  NORMAL: "正常",
  PENDING_COMPLETION: "待补全",
  PENDING_EFFECTIVE: "待生效",
  FROZEN: "冻结",
  INVALID: "失效",
}

export const SUBJECT_TYPE_LABELS: Record<SubjectType, string> = {
  INDIVIDUAL: "个人",
  ENTERPRISE: "企业",
}

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  MANUAL: "人工建档",
  CLIENT_AUTH: "C端认证",
  DOC_SETTLEMENT: "单据沉淀",
}
