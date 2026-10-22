import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import type { PartnerSubject, RoleType, SubjectType } from "../domain/types"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import {
  findOwnerAddressConflict,
  findPartnerByIdNumber,
  maskIdNumber,
  ownerAddressConflictMessage,
} from "./partner-archive-rules"
import { collectArchiveRequiredGaps } from "./archive-required-fields-pending"

export type JobQuickCreateScene =
  | "INBOUND_OWNER"
  | "OUTBOUND_PICKUP_AGENT"
  | "SUPERVISION_FUNDER"
  | "SUPERVISION_SERVICE_PROVIDER"

export type QuickCreatePartnerInput = {
  scene: JobQuickCreateScene
  subjectType: SubjectType
  name: string
  idNumber: string
  contactPhone: string
  agentName?: string
  province: string
  city: string
  district: string
  detailAddress: string
  verifiedOnCreate?: boolean
  createdBy?: string
}

export type QuickCreatePartnerResult =
  | { ok: true; partner: PartnerSubject }
  | { ok: false; message: string }

function sceneMeta(scene: JobQuickCreateScene): {
  roles: RoleType[]
  archiveMenu: PartnerArchiveMenuLabel
  sourceLabel: string
  auditDetail: string
} {
  if (scene === "INBOUND_OWNER") {
    return {
      roles: ["OWNER"],
      archiveMenu: "货主信息",
      sourceLabel: "入库快捷建档",
      auditDetail: "入库制单页快捷建档（默认联系手机未验证）",
    }
  }
  if (scene === "OUTBOUND_PICKUP_AGENT") {
    return {
      roles: ["PICKUP_AGENT"],
      archiveMenu: "提货人信息",
      sourceLabel: "出库快捷建档",
      auditDetail: "出库制单页【快速添加经办人】建档",
    }
  }
  if (scene === "SUPERVISION_FUNDER") {
    return {
      roles: ["FUNDER"],
      archiveMenu: "资金方信息",
      sourceLabel: "监管办理快捷建档",
      auditDetail: "监管办理页快捷建档（资金方信息域 · 企业主体）",
    }
  }
  return {
    roles: ["SERVICE_PROVIDER"],
    archiveMenu: "服务方信息",
    sourceLabel: "监管办理快捷建档",
    auditDetail: "监管办理页快捷建档（服务方信息域 · 企业主体）",
  }
}

export function quickCreatePartnerFromJob(
  input: QuickCreatePartnerInput
): QuickCreatePartnerResult {
  const trimmedId = input.idNumber.trim()
  const duplicate = findPartnerByIdNumber(partnerArchivesMock, trimmedId)
  if (duplicate) {
    return { ok: false, message: "该主体已存在，请搜索选择或通过档案详情追加角色" }
  }

  const certAddress = {
    province: input.province.trim(),
    city: input.city.trim(),
    district: input.district.trim(),
    detail: input.detailAddress.trim(),
    fullAddress: `${input.province}${input.city}${input.district}${input.detailAddress}`.trim(),
  }

  if (input.scene === "INBOUND_OWNER" && certAddress.fullAddress.trim()) {
    const conflict = findOwnerAddressConflict(
      partnerArchivesMock,
      certAddress.fullAddress,
      input.subjectType,
      undefined
    )
    if (conflict) {
      return { ok: false, message: ownerAddressConflictMessage(input.subjectType) }
    }
  }

  const now = new Date().toISOString().replace("T", " ").substring(0, 19)
  const today = now.substring(0, 10)
  const meta = sceneMeta(input.scene)
  const newId = `p-${Date.now()}`
  const pendingDraft: PartnerSubject = {
    id: "draft",
    archiveMenu: meta.archiveMenu,
    partnerNo: "",
    name: input.name.trim(),
    subjectType: input.subjectType,
    idNumber: trimmedId,
    idNumberMasked: maskIdNumber(trimmedId),
    certAddress,
    contactPhone: input.contactPhone.trim(),
    agentName: input.subjectType === "ENTERPRISE" ? input.agentName?.trim() : undefined,
    status: "NORMAL",
    roles: [],
    source: "MANUAL",
    createDate: "",
    createTime: "",
    createdBy: "",
    updateTime: "",
    associatedDocs: [],
    auditLogs: [],
  }
  const roleStatus =
    collectArchiveRequiredGaps(pendingDraft).length > 0
      ? ("PENDING_COMPLETION" as const)
      : ("NORMAL" as const)

  if (
    (input.scene === "SUPERVISION_FUNDER" ||
      input.scene === "SUPERVISION_SERVICE_PROVIDER") &&
    input.subjectType !== "ENTERPRISE"
  ) {
    return { ok: false, message: "权人主体须为企业，请填写企业资料" }
  }

  const newPartner: PartnerSubject = {
    id: newId,
    partnerNo: `PA-${Date.now()}`,
    archiveMenu: meta.archiveMenu,
    name: input.name.trim(),
    subjectType: input.subjectType,
    idNumber: trimmedId,
    idNumberMasked: maskIdNumber(trimmedId),
    certAddress,
    contactPhone: input.contactPhone.trim(),
    contactPhoneVerified: input.verifiedOnCreate ? "VERIFIED" : "UNVERIFIED",
    contactPhoneVerifiedAt: input.verifiedOnCreate ? now : undefined,
    agentName: input.subjectType === "ENTERPRISE" ? input.agentName?.trim() : undefined,
    status: "NORMAL",
    roles: meta.roles.map((roleType) => ({
      roleType,
      roleStatus,
      sourceDocType: "人工建档",
      sourceDocNo: "——",
      roleEffectiveTime: now,
    })),
    source: "MANUAL",
    createDate: today,
    createTime: now,
    createdBy: input.createdBy ?? "当前用户",
    updateTime: now,
    associatedDocs: [],
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        opTime: now,
        operator: input.createdBy ?? "当前用户",
        actionType: "CREATE",
        actionName: "创建合作方档案",
        detail: input.verifiedOnCreate
          ? `由${meta.sourceLabel}快捷创建：联系手机已验证`
          : `由${meta.sourceLabel}快捷创建：${meta.auditDetail}`,
      },
    ],
  }

  partnerArchivesMock.unshift(newPartner)
  return { ok: true, partner: newPartner }
}
