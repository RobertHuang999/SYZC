import type { PartnerAccessConfig } from "../domain/types"

export function summarizePartnerAccessRelax(
  baseline: PartnerAccessConfig,
  current: PartnerAccessConfig
): string {
  const parts: string[] = []

  if (
    baseline.individual.certAddressRequired === "是" &&
    current.individual.certAddressRequired === "否"
  ) {
    parts.push("个人：证件地址由必填改为选填")
  }
  if (
    baseline.individual.addressDuplicatePrevent &&
    !current.individual.addressDuplicatePrevent
  ) {
    parts.push("个人：关闭证件地址防重复")
  }
  if (
    baseline.enterprise.certAddressRequired === "是" &&
    current.enterprise.certAddressRequired === "否"
  ) {
    parts.push("企业：证件地址由必填改为选填")
  }
  if (
    baseline.enterprise.addressDuplicatePrevent &&
    !current.enterprise.addressDuplicatePrevent
  ) {
    parts.push("企业：关闭证件地址防重复")
  }

  return parts.length > 0 ? parts.join("；") : "货主准入策略变更"
}

export function formatAuditTimestamp(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
