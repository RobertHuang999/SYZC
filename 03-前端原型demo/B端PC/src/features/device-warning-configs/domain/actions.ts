import type { DeviceWarningConfigStatus } from "./types"

export const DEVICE_WARNING_CONFIG_STATUS_BADGE_CLASS: Record<
  DeviceWarningConfigStatus,
  string
> = {
  生效中: "border-emerald-200 bg-emerald-50 text-emerald-700",
  停用: "border-slate-200 bg-slate-50 text-slate-600",
  已失效: "border-orange-200 bg-orange-50 text-orange-700",
}

export type DeviceWarningConfigAction = "edit" | "detail" | "disable" | "enable" | "delete"

export function getDeviceWarningConfigActions(
  status: DeviceWarningConfigStatus
): DeviceWarningConfigAction[] {
  switch (status) {
    case "生效中":
      return ["edit", "detail", "disable", "delete"]
    case "停用":
      return ["edit", "detail", "enable", "delete"]
    case "已失效":
      return ["detail", "delete"]
  }
}
