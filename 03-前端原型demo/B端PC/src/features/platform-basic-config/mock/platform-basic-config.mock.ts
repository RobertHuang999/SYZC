import {
  DATA_SOURCE_CARD_DEFS,
  IOT_HARDWARE_CARD_DEFS,
} from "../domain/constants"
import type {
  AgreementItem,
  CredentialCardState,
  CredentialValues,
  PartnerAccessAuditRecord,
  PlatformBasicConfigState,
  SmtpMailboxRow,
} from "../domain/types"

function buildCredentialValues(defs: { id: string; fields: { key: string }[] }[]): CredentialValues {
  const values: CredentialValues = {}
  for (const card of defs) {
    values[card.id] = {}
    for (const field of card.fields) {
      values[card.id][field.key] = "configured"
    }
  }
  return values
}

function buildCardStates(defs: { id: string }[]): Record<string, CredentialCardState> {
  return Object.fromEntries(
    defs.map((d) => [
      d.id,
      { configured: true, editing: false, draft: {} } satisfies CredentialCardState,
    ])
  )
}

const initialAgreements: AgreementItem[] = [
  {
    id: "agr-1",
    placement: "登录页面",
    name: "用户服务与隐私保护协议",
    fileName: "隐私协议_v2026.pdf",
    fileSizeMb: 1.2,
  },
  {
    id: "agr-2",
    placement: "仓单开立页面",
    name: "存货确权与数字仓单质押居间协议",
    fileName: "仓单居间协议_202609.pdf",
    fileSizeMb: 3.4,
  },
]

const initialSmtp: SmtpMailboxRow[] = [
  {
    id: "smtp-1",
    host: "smtp.qiye.aliyun.com",
    port: "465",
    encryption: "SSL/TLS",
    fromEmail: "alert@senyun.com",
    authCode: "configured",
    configured: true,
    editing: false,
  },
  {
    id: "smtp-2",
    host: "smtp.office365.com",
    port: "587",
    encryption: "STARTTLS",
    fromEmail: "notice@senyun.com",
    authCode: "configured",
    configured: true,
    editing: false,
  },
]

export const platformBasicConfigInitialState: PlatformBasicConfigState = {
  warehouseOps: {
    moveRequiresAudit: "是",
    inOutRequiresAudit: "是",
    auditScopeMode: "指定库房",
    auditedRoomIds: ["room-sz-1", "room-sz-2", "room-sh-a"],
  },
  partnerAccess: {
    individual: {
      certAddressRequired: "是",
      addressDuplicatePrevent: true,
    },
    enterprise: {
      certAddressRequired: "是",
      addressDuplicatePrevent: true,
    },
  },
  agreements: initialAgreements,
  dataSourceValues: buildCredentialValues(DATA_SOURCE_CARD_DEFS),
  dataSourceCards: buildCardStates(DATA_SOURCE_CARD_DEFS),
  iotValues: buildCredentialValues(IOT_HARDWARE_CARD_DEFS),
  iotCards: buildCardStates(IOT_HARDWARE_CARD_DEFS),
  smtpRows: initialSmtp,
}

/** 合作方准入 · 策略放宽类变更审计（页内展示最近记录，完整流水在操作日志） */
export const partnerAccessAuditLogMock: PartnerAccessAuditRecord[] = [
  {
    id: "audit-mock-1",
    changedAt: "2026-09-28 14:32:18",
    operator: "王芳（风控合规部）",
    changeSummary: "个人：关闭证件地址防重复",
    reason:
      "华东区农产品散户存在合规村集体地址重叠，经风控委 2026-09-27 纪要特批，暂关闭个人防重复，要求 2026-Q4 完成地址清洗后恢复。",
  },
  {
    id: "audit-mock-2",
    changedAt: "2026-08-15 09:05:41",
    operator: "李敏（系统管理员）",
    changeSummary: "企业：证件地址由必填改为选填",
    reason:
      "对接某保理核心企业批量建档，登记地址由营业执照 OCR 自动带出，人工重复录入影响上线进度，经产品与安全联合评估后放宽。",
  },
  {
    id: "audit-mock-3",
    changedAt: "2026-07-03 16:48:02",
    operator: "赵强（平台管理员）",
    changeSummary: "个人：证件地址由必填改为选填；企业：关闭证件地址防重复",
    reason:
      "6.2 版本割接窗口内，存量个人货主部分缺失身份证住址扫描件，先选填过渡并限期补全，同步关闭企业登记地址防重复以降低误拦截。",
  },
]

/** 原型 Mock：首组冲突主体同时含个人与企业脱敏样例行，便于默认展开区对照展示。 */
export const duplicateAddressConflictsMock = [
  {
    ownerPool: "personal" as const,
    address: "浙江省杭州市西湖区文三路100号",
    subjects: [
      {
        id: "sub-hz-p-1",
        displayLine: "张三 (330106****) · 138****0001",
      },
      {
        id: "sub-hz-p-2",
        displayLine: "李四 (330106****) · 139****0002",
      },
      {
        id: "sub-hz-p-3",
        displayLine: "陈七 (330106****) · 135****3303",
      },
      {
        id: "sub-hz-e-1",
        displayLine: "杭州森云供应链有限公司 (91330100****) · 0571****6601",
      },
      {
        id: "sub-hz-e-2",
        displayLine: "杭州森云物流科技有限公司 (91330100****) · 0571****7702",
      },
    ],
  },
  {
    ownerPool: "personal" as const,
    address: "江苏省南京市鼓楼区中山北路88号",
    subjects: [
      {
        id: "sub-nj-1",
        displayLine: "王五 (320106****) · 137****1100",
      },
      {
        id: "sub-nj-2",
        displayLine: "赵六 (320106****) · 136****2200",
      },
    ],
  },
  {
    ownerPool: "enterprise" as const,
    address: "上海市浦东新区陆家嘴环路1000号",
    subjects: [
      {
        id: "sub-sh-1",
        displayLine: "上海森云供应链有限公司 (91310000****) · 021****6601",
      },
      {
        id: "sub-sh-2",
        displayLine: "上海森云物流科技有限公司 (91310000****) · 021****7702",
      },
    ],
  },
]
