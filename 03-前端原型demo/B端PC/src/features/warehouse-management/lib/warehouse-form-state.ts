import type {
  ManagerType,
  OwnershipRelation,
  WarehouseRecord,
  ZhongdengAccess,
} from "../domain/types"
import type { AssigneeMode } from "../domain/form-constants"

export type WarehouseFormState = {
  name: string
  regionKey: string
  addressDetail: string
  area: string
  warehouseTypes: string[]
  otherTypeName: string
  supervisorMode: AssigneeMode
  supervisorPersonIds: string[]
  supervisorRoleNames: string[]
  regionalManagerMode: AssigneeMode
  regionalManagerPersonIds: string[]
  regionalManagerRoleNames: string[]
  managerType: ManagerType
  managerName: string
  managerIdNumber: string
  managerPhone: string
  ownership: OwnershipRelation
  zhongdengAccess: ZhongdengAccess
  zhongdengId: string
  hasSiteMap: boolean
  hasRegistrationPdf: boolean
  warehousePhotoCount: number
}

export function createEmptyWarehouseFormState(): WarehouseFormState {
  return {
    name: "",
    regionKey: "广东省|深圳市|南山区",
    addressDetail: "",
    area: "",
    warehouseTypes: [],
    otherTypeName: "",
    supervisorMode: "PERSON",
    supervisorPersonIds: [],
    supervisorRoleNames: [],
    regionalManagerMode: "PERSON",
    regionalManagerPersonIds: [],
    regionalManagerRoleNames: [],
    managerType: "ENTERPRISE",
    managerName: "",
    managerIdNumber: "",
    managerPhone: "",
    ownership: "OWNED",
    zhongdengAccess: "NO",
    zhongdengId: "",
    hasSiteMap: false,
    hasRegistrationPdf: false,
    warehousePhotoCount: 0,
  }
}

export function warehouseRecordToFormState(
  record: WarehouseRecord
): WarehouseFormState {
  const base = createEmptyWarehouseFormState()
  const isSupervisorRole = record.supervisorType === "按角色"
  const isRegionalRole = record.regionalManagerType === "按角色"

  return {
    ...base,
    name: record.name,
    addressDetail: record.address,
    area: String(record.area),
    warehouseTypes: [...record.warehouseTypes],
    otherTypeName: record.otherTypeName ?? "",
    supervisorMode: isSupervisorRole ? "ROLE" : "PERSON",
    supervisorPersonIds: isSupervisorRole ? [] : (record.supervisors ?? []),
    supervisorRoleNames: isSupervisorRole ? (record.supervisors ?? []) : [],
    regionalManagerMode: isRegionalRole ? "ROLE" : "PERSON",
    regionalManagerPersonIds: isRegionalRole ? [] : (record.regionalManagers ?? []),
    regionalManagerRoleNames: isRegionalRole ? (record.regionalManagers ?? []) : [],
    managerType: record.managerType,
    managerName: record.managerName,
    managerIdNumber: record.managerIdNumber,
    managerPhone: record.managerPhone,
    ownership: record.ownership,
    zhongdengAccess: record.zhongdengAccess,
    zhongdengId: record.zhongdengId ?? "",
    hasSiteMap: record.zhongdengAccess === "YES",
    hasRegistrationPdf: record.zhongdengAccess === "YES",
    warehousePhotoCount: record.zhongdengAccess === "YES" ? 2 : 0,
  }
}

export function formStateToWarehousePayload(
  form: WarehouseFormState,
  regionLabel: string
): Partial<WarehouseRecord> {
  const parsedArea = Number(form.area)
  const address = [regionLabel, form.addressDetail.trim()].filter(Boolean).join(" ")

  return {
    name: form.name.trim(),
    address,
    area: Number.isFinite(parsedArea) && parsedArea > 0 ? parsedArea : 1,
    warehouseTypes:
      form.warehouseTypes.length > 0 ? form.warehouseTypes : ["通用/常温库"],
    otherTypeName: form.warehouseTypes.includes("其他")
      ? form.otherTypeName.trim()
      : undefined,
    supervisorType: form.supervisorMode === "ROLE" ? "按角色" : "按人",
    supervisors:
      form.supervisorMode === "ROLE"
        ? form.supervisorRoleNames
        : form.supervisorPersonIds,
    regionalManagerType: form.regionalManagerMode === "ROLE" ? "按角色" : "按人",
    regionalManagers:
      form.regionalManagerMode === "ROLE"
        ? form.regionalManagerRoleNames
        : form.regionalManagerPersonIds,
    managerType: form.managerType,
    managerName: form.managerName.trim(),
    managerIdNumber: form.managerIdNumber.trim(),
    managerPhone: form.managerPhone.trim(),
    ownership: form.ownership,
    zhongdengAccess:
      form.managerType === "INDIVIDUAL" ? "NO" : form.zhongdengAccess,
    zhongdengId:
      form.zhongdengAccess === "YES" ? form.zhongdengId.trim() : undefined,
  }
}
