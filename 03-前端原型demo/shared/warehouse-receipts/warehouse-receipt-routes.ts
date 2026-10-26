/** 仓单管理 · 双端路由与入口常量 */

export const RECEIPT_PC_LIST_PATH = "/仓储/仓单管理"

export function receiptPcDetailPath(id: string): string {
  return `${RECEIPT_PC_LIST_PATH}/详情/${id}`
}

export const RECEIPT_H5_LIST_PATH = "/m/workspace/warehouse-receipts"

export function receiptH5DetailPath(id: string): string {
  return `${RECEIPT_H5_LIST_PATH}/${id}`
}

export const RECEIPT_H5_INITIATE_PATH = "/m/receipts/initiate"
export const RECEIPT_H5_INITIATE_GOODS_PATH = "/m/receipts/initiate/goods"
export const RECEIPT_H5_INITIATE_CONFIRM_PATH = "/m/receipts/initiate/confirm"
export const RECEIPT_H5_INITIATE_SIGN_PATH = "/m/receipts/initiate/sign"

export const RECEIPT_H5_WORKSPACE_PATH = "/m/workspace"

/** PC 端动碰操作引导的移动端路径说明 */
export const RECEIPT_H5_FLOW_HINT: Record<string, string> = {
  仓单补货: "工作台 → 仓单管理 → 更多操作 → 仓单补货",
  仓单出库: "工作台 → 仓单管理 → 更多操作 → 仓单出库",
  仓单入库: "业务办理 → 业务发起 → 入库发起（入库类型自动锁定仓单入库）",
  仓单移库: "工作台 → 仓单管理 → 更多操作 → 仓单移库",
  仓单移除: "工作台 → 仓单管理 → 更多操作 → 仓单移除",
  注销: "工作台 → 仓单管理 → 更多操作 → 注销",
  仓单注销: "工作台 → 仓单管理 → 更多操作 → 注销",
  仓单开立: "业务办理 → 业务发起 → 仓单开立",
}

export function receiptH5OpsPath(
  id: string,
  op: "outbound" | "relocate" | "replenish" | "remove" | "cancel" | "inbound",
): string {
  return `/m/receipts/${id}/${op}`
}
