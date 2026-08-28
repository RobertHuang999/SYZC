import type { ApprovalNode, UnlockApprovalConfig, UnlockApprovalConfigDetail } from "../domain/types"
import { unlockApprovalConfigsMock } from "../mock/unlock-approval-configs.mock"

const detailExtensions: Record<
  string,
  {
    approvalNodes: ApprovalNode[]
    disableReason: string | null
    version: number
  }
> = {
  "UNLOCK-CFG-001": {
    approvalNodes: [
      { id: "node-1", sequence: 1, objectType: "指定角色", objectLabel: "仓库主管" },
      { id: "node-2", sequence: 2, objectType: "指定人员", objectLabel: "李四（监管部）" },
    ],
    disableReason: null,
    version: 1,
  },
  "UNLOCK-CFG-002": {
    approvalNodes: [
      { id: "node-1", sequence: 1, objectType: "指定人员", objectLabel: "王五（仓储部）" },
    ],
    disableReason: null,
    version: 2,
  },
  "UNLOCK-CFG-003": {
    approvalNodes: [
      { id: "node-1", sequence: 1, objectType: "指定角色", objectLabel: "风控经理" },
    ],
    disableReason: null,
    version: 1,
  },
  "UNLOCK-CFG-004": {
    approvalNodes: [
      { id: "node-1", sequence: 1, objectType: "指定角色", objectLabel: "监管经理" },
    ],
    disableReason: "仓库迁址，改走库房级规则",
    version: 1,
  },
  "UNLOCK-CFG-005": {
    approvalNodes: [
      { id: "node-1", sequence: 1, objectType: "指定人员", objectLabel: "张工（监管运营部）" },
    ],
    disableReason: null,
    version: 3,
  },
}

const defaultNodes: ApprovalNode[] = [
  { id: "node-default", sequence: 1, objectType: "指定角色", objectLabel: "仓库主管" },
]

export function getUnlockApprovalConfigDetail(
  configNo: string | undefined
): UnlockApprovalConfigDetail | undefined {
  if (!configNo) {
    return undefined
  }

  const base = unlockApprovalConfigsMock.find((item: UnlockApprovalConfig) => item.configNo === configNo)
  if (!base) {
    return undefined
  }

  const extension = detailExtensions[configNo] ?? {
    approvalNodes: defaultNodes,
    disableReason: null,
    version: base.configVersion,
  }

  return {
    ...base,
    ...extension,
  }
}

export function getUnlockApprovalConfigByNo(configNo: string | undefined) {
  if (!configNo) {
    return undefined
  }
  return unlockApprovalConfigsMock.find((item: UnlockApprovalConfig) => item.configNo === configNo)
}
