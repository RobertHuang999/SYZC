import type { ConfigStatus } from "./types"

export const UNLOCK_APPROVAL_CONFIG_STATUS_BADGE_CLASS: Record<ConfigStatus, string> = {
  已启用: "border-emerald-200 bg-emerald-50 text-emerald-700",
  已停用: "border-slate-200 bg-slate-50 text-slate-600",
}

export type UnlockApprovalConfigAction = "edit" | "detail" | "disable" | "enable" | "delete"

export function getUnlockApprovalConfigActions(
  status: ConfigStatus
): UnlockApprovalConfigAction[] {
  switch (status) {
    case "已启用":
      return ["edit", "detail", "disable"]
    case "已停用":
      return ["detail", "enable", "delete"]
  }
}

export function getDetailHeaderActions(status: ConfigStatus): UnlockApprovalConfigAction[] {
  switch (status) {
    case "已启用":
      return ["edit", "disable"]
    case "已停用":
      return ["enable", "delete"]
  }
}

export const DELETE_UNLOCK_APPROVAL_CONFIG_CONFIRM = {
  title: "确认删除",
  description:
    "删除后列表将不再展示本配置，历史申请仍保留配置快照，确认删除？",
  confirmLabel: "确认删除",
} as const
