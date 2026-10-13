export type ConfigCategoryId =
  | "warehouse-ops"
  | "partner-access"
  | "agreements"
  | "data-sources"
  | "iot-hardware"
  | "mail-smtp"

export type YesNo = "是" | "否"

export type WarehouseScopeMode = "全部库房" | "指定库房"

export interface WarehouseRoomNode {
  id: string
  warehouseName: string
  roomName: string
}

export interface WarehouseOpsConfig {
  moveRequiresAudit: YesNo
  inOutRequiresAudit: YesNo
  auditScopeMode: WarehouseScopeMode
  auditedRoomIds: string[]
}

export interface PartnerSubjectAccessPolicy {
  certAddressRequired: YesNo
  addressDuplicatePrevent: boolean
}

export interface PartnerAccessConfig {
  individual: PartnerSubjectAccessPolicy
  enterprise: PartnerSubjectAccessPolicy
}

export type AgreementPlacement = "登录页面" | "仓单开立页面"

export interface AgreementItem {
  id: string
  placement: AgreementPlacement | ""
  name: string
  fileName: string | null
  fileSizeMb: number | null
}

export interface CredentialFieldDef {
  key: string
  label: string
  type: "text" | "password" | "select" | "file"
  options?: { value: string; label: string }[]
}

export interface CredentialCardDef {
  id: string
  title: string
  fields: CredentialFieldDef[]
}

export type CredentialValues = Record<string, Record<string, string>>

export interface CredentialCardState {
  configured: boolean
  editing: boolean
  draft: Record<string, string>
}

export type MailEncryption = "SSL/TLS" | "STARTTLS" | "无"

export interface SmtpMailboxRow {
  id: string
  host: string
  port: string
  encryption: MailEncryption
  fromEmail: string
  authCode: string
  configured: boolean
  editing: boolean
}

export interface DuplicateAddressConflict {
  address: string
  subject1: string
  subject2: string
}

export interface PartnerAccessAuditRecord {
  id: string
  changedAt: string
  operator: string
  changeSummary: string
  reason: string
}

export interface PlatformBasicConfigState {
  warehouseOps: WarehouseOpsConfig
  partnerAccess: PartnerAccessConfig
  agreements: AgreementItem[]
  dataSourceValues: CredentialValues
  dataSourceCards: Record<string, CredentialCardState>
  iotValues: CredentialValues
  iotCards: Record<string, CredentialCardState>
  smtpRows: SmtpMailboxRow[]
}
