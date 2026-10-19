import type { PartnerSubject, RoleType, SubjectType } from "../domain/types"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import {
  findIndividualOwnerAddressConflict,
  findPartnerByIdNumber,
  maskIdNumber,
} from "./partner-archive-rules"

export type JobQuickCreateScene = "INBOUND_OWNER" | "OUTBOUND_PICKUP_AGENT"

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

function sceneMeta(scene: JobQuickCreateScene) {
  if (scene === "INBOUND_OWNER") {
    return {
      roles: ["OWNER"] as RoleType[],
      sourceLabel: "入库快捷建档",
      auditDetail: "入库制单页快捷建档（默认联系手机未验证）",
    }
  }
  return {
    roles: ["PICKUP_AGENT"] as RoleType[],
    sourceLabel: "出库快捷建档",
    auditDetail: "出库制单页【快速添加经办人】建档",
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

  if (input.scene === "INBOUND_OWNER" && input.subjectType === "INDIVIDUAL") {
    const conflict = findIndividualOwnerAddressConflict(
      partnerArchivesMock,
      certAddress.fullAddress,
      undefined
    )
    if (conflict) {
      return { ok: false, message: "已有相同证件地址，不能绑定为该个人货主" }
    }
  }

  const now = new Date().toISOString().replace("T", " ").substring(0, 19)
  const today = now.substring(0, 10)
  const meta = sceneMeta(input.scene)
  const newId = `p-${Date.now()}`
  const roleStatus =
    input.scene === "OUTBOUND_PICKUP_AGENT" ? ("PENDING_COMPLETION" as const) : ("NORMAL" as const)

  const newPartner: PartnerSubject = {
    id: newId,
    partnerNo: `PA-${Date.now()}`,
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
      sourceDocType: meta.sourceLabel,
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
        actionName: meta.sourceLabel,
        detail: input.verifiedOnCreate
          ? `${meta.auditDetail}；保存并验证通过`
          : meta.auditDetail,
      },
    ],
  }

  partnerArchivesMock.unshift(newPartner)
  return { ok: true, partner: newPartner }
}
