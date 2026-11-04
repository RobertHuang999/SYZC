import type { PartnerAccessConfig } from "../domain/types"

function summarizeSubjectPolicyChange(
  label: "个人" | "企业",
  baseline: PartnerAccessConfig["individual"],
  current: PartnerAccessConfig["individual"]
): string[] {
  const parts: string[] = []
  if (baseline.certAddressRequired !== current.certAddressRequired) {
    parts.push(`${label}：证件地址${current.certAddressRequired === "是" ? "改为必填" : "改为选填"}`)
  }
  if (baseline.addressDuplicatePrevent !== current.addressDuplicatePrevent) {
    parts.push(
      `${label}：证件地址防重复${current.addressDuplicatePrevent ? "开启" : "关闭"}`
    )
  }
  return parts
}

export function summarizePartnerAccessChange(
  baseline: PartnerAccessConfig,
  current: PartnerAccessConfig
): string {
  const parts = [
    ...summarizeSubjectPolicyChange("个人", baseline.individual, current.individual),
    ...summarizeSubjectPolicyChange("企业", baseline.enterprise, current.enterprise),
  ]
  return parts.length > 0 ? parts.join("；") : "货主准入策略变更"
}

/** @deprecated 使用 summarizePartnerAccessChange */
export const summarizePartnerAccessRelax = summarizePartnerAccessChange

export function formatAuditTimestamp(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
