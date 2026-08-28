import type { ConfigStatus } from "./types"

export const UNLOCK_APPROVAL_CONFIG_STATUS_BADGE_CLASS: Record<ConfigStatus, string> = {
  已启用: "border-emerald-200 bg-emerald-50 text-emerald-700",
  已停用: "border-slate-200 bg-slate-50 text-slate-600",
}

export type UnlockApprovalConfigAction = "edit" | "detail" | "disable" | "enable"

export function getUnlockApprovalConfigActions(
  status: ConfigStatus
): UnlockApprovalConfigAction[] {
  switch (status) {
    case "已启用":
      return ["edit", "detail", "disable"]
    case "已停用":
      return ["detail", "enable"]
  }
}

export function getDetailHeaderActions(status: ConfigStatus): UnlockApprovalConfigAction[] {
  switch (status) {
    case "已启用":
      return ["edit", "disable"]
    case "已停用":
      return ["enable"]
  }
}
