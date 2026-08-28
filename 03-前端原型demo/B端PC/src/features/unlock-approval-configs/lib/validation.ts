import { unlockApprovalConfigsMock } from "../mock/unlock-approval-configs.mock"
import type { ApprovalNode, UnlockApprovalConfigFormValues } from "../domain/types"
import { getUnlockApprovalConfigDetail } from "./detail-utils"

export function createEmptyApprovalNode(): ApprovalNode {
  return {
    id: `node-${crypto.randomUUID()}`,
    sequence: 1,
    objectType: "",
    objectLabel: "",
  }
}

export function createEmptyFormValues(): UnlockApprovalConfigFormValues {
  return {
    configName: "",
    scopeType: "",
    warehouseName: "",
    storeroomNames: [],
    zoneNames: [],
    warehouseFilter: "",
    selectedDeviceIds: [],
    globalSwitch: "开启",
    approvalMode: "",
    approvalNodes: [createEmptyApprovalNode()],
    timeoutHours: "",
    version: null,
  }
}

export function detailToFormValues(configNo: string): UnlockApprovalConfigFormValues {
  const detail = getUnlockApprovalConfigDetail(configNo)
  if (!detail) {
    return createEmptyFormValues()
  }

  const deviceIds = detail.deviceCodes
    .map((code) => {
      const match = [
        { id: "dev-001", code: "LK-2024-0082" },
        { id: "dev-002", code: "LK-0085" },
        { id: "dev-003", code: "FACE-01" },
      ].find((item) => item.code === code)
      return match?.id
    })
    .filter(Boolean) as string[]

  return {
    configName: detail.configName,
    scopeType: detail.scopeType,
    warehouseName: detail.warehouseName ?? "",
    storeroomNames: [...detail.storeroomNames],
    zoneNames: [...detail.zoneNames],
    warehouseFilter: detail.warehouseName ?? "",
    selectedDeviceIds: deviceIds,
    globalSwitch: detail.globalSwitch ?? "开启",
    approvalMode: detail.approvalMode,
    approvalNodes: detail.approvalNodes.map((node) => ({ ...node })),
    timeoutHours: String(detail.timeoutHours),
    version: detail.version,
  }
}

export function validateUnlockApprovalConfig(
  values: UnlockApprovalConfigFormValues,
  editingConfigNo?: string
): string | null {
  const configName = values.configName.trim()
  if (!configName) return "请输入配置名称"
  if (configName.length > 50) return "配置名称不能超过 50 个字符"

  const duplicateName = unlockApprovalConfigsMock.some(
    (config) =>
      config.configNo !== editingConfigNo &&
      config.configName.trim() === configName &&
      config.status === "已启用"
  )
  if (duplicateName) return "配置名称已存在"

  if (!values.scopeType) return "请选择适用范围类型"

  if (values.scopeType === "未绑定位置全局") {
    const enabledGlobal = unlockApprovalConfigsMock.some(
      (config) =>
        config.configNo !== editingConfigNo &&
        config.scopeType === "未绑定位置全局" &&
        config.status === "已启用"
    )
    if (enabledGlobal && values.globalSwitch === "开启") {
      return "租户内该类型仅允许 1 条已启用配置"
    }
  } else {
    if (!values.warehouseName) return "请选择适用仓库"
    if (values.scopeType === "库房" && values.storeroomNames.length === 0) {
      return "请选择适用库房"
    }
    if (values.scopeType === "分区" && values.zoneNames.length === 0) {
      return "请选择适用分区"
    }
    if (values.scopeType === "指定设备" && values.selectedDeviceIds.length === 0) {
      return "请选择适用设备"
    }
  }

  if (!values.approvalMode) return "请选择审批方式"

  if (values.approvalNodes.length === 0) {
    return "节点配置不完整"
  }

  for (const node of values.approvalNodes) {
    if (!node.objectType || !node.objectLabel.trim()) {
      return "节点配置不完整"
    }
  }

  const timeout = Number(values.timeoutHours)
  if (!Number.isInteger(timeout) || timeout <= 0) {
    return "审批超时时间须为正整数"
  }

  return null
}
