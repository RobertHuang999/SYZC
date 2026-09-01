import { unlockApprovalConfigsMock } from "../mock/unlock-approval-configs.mock"
import type { ApprovalNode, UnlockApprovalConfigFormValues } from "../domain/types"
import { MOCK_DEVICES } from "../mock/reference-data.mock"
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
    selectedDeviceIds: [],
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
    .map((code) => MOCK_DEVICES.find((device) => device.code === code)?.id)
    .filter(Boolean) as string[]

  return {
    configName: detail.configName,
    selectedDeviceIds: deviceIds,
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

  if (values.selectedDeviceIds.length === 0) {
    return "请选择适用设备"
  }

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
