import {
  MOCK_ORG_USERS,
  WAREHOUSE_REGION_OPTIONS,
} from "../domain/form-constants"
import type { AssigneeMode } from "../domain/form-constants"
import type {
  ManagerType,
  OwnershipRelation,
  WarehouseRecord,
  ZhongdengAccess,
} from "../domain/types"

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

function splitRecordAddress(address: string, fallbackRegionKey: string) {
  for (const item of WAREHOUSE_REGION_OPTIONS) {
    const prefix = `${item.province}${item.city}${item.district}`
    if (address.startsWith(prefix)) {
      return {
        regionKey: `${item.province}|${item.city}|${item.district}`,
        addressDetail: address.slice(prefix.length).trim(),
      }
    }
  }
  return { regionKey: fallbackRegionKey, addressDetail: address }
}

function personLabelsToIds(labels: string[]): string[] {
  const ids: string[] = []
  for (const label of labels) {
    const id = MOCK_ORG_USERS.find((user) => user.name === label)?.id
    if (id) ids.push(id)
  }
  return ids
}

function personIdsToLabels(ids: string[]) {
  return ids
    .map((id) => MOCK_ORG_USERS.find((user) => user.id === id)?.name ?? id)
    .filter(Boolean)
}

export function warehouseRecordToFormState(
  record: WarehouseRecord
): WarehouseFormState {
  const base = createEmptyWarehouseFormState()
  const isSupervisorRole = record.supervisorType === "按角色"
  const isRegionalRole = record.regionalManagerType === "按角色"
  const { regionKey, addressDetail } = splitRecordAddress(
    record.address,
    base.regionKey
  )

  return {
    ...base,
    name: record.name,
    regionKey,
    addressDetail,
    area: String(record.area),
    warehouseTypes: [...record.warehouseTypes],
    otherTypeName: record.otherTypeName ?? "",
    supervisorMode: isSupervisorRole ? "ROLE" : "PERSON",
    supervisorPersonIds: isSupervisorRole
      ? []
      : personLabelsToIds(record.supervisors ?? []),
    supervisorRoleNames: isSupervisorRole ? (record.supervisors ?? []) : [],
    regionalManagerMode: isRegionalRole ? "ROLE" : "PERSON",
    regionalManagerPersonIds: isRegionalRole
      ? []
      : personLabelsToIds(record.regionalManagers ?? []),
    regionalManagerRoleNames: isRegionalRole
      ? (record.regionalManagers ?? [])
      : [],
    managerType: record.managerType,
    managerName: record.managerName,
    managerIdNumber: record.managerIdNumber,
    managerPhone: record.managerPhone,
    ownership: record.ownership ?? "OWNED",
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
        : personIdsToLabels(form.supervisorPersonIds),
    regionalManagerType: form.regionalManagerMode === "ROLE" ? "按角色" : "按人",
    regionalManagers:
      form.regionalManagerMode === "ROLE"
        ? form.regionalManagerRoleNames
        : personIdsToLabels(form.regionalManagerPersonIds),
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

export function regionLabelFromKey(key: string) {
  if (!key) return ""
  const [province, city, district] = key.split("|")
  const hit = WAREHOUSE_REGION_OPTIONS.find(
    (item) =>
      item.province === province &&
      item.city === city &&
      item.district === district
  )
  if (hit) {
    return `${hit.province}${hit.city}${hit.district}`
  }
  return [province, city, district].filter(Boolean).join("")
}
