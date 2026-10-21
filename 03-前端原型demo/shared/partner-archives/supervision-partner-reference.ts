import type { PartnerArchiveMenuLabel } from "./partner-archive-routes"

/** 监管办理制单 · 单据类型（6.3 权人引用域） */
export type SupervisionDocKind = "MORTGAGE" | "PLEDGE" | "SUPERVISION_SERVICE"

export const SUPERVISION_DOC_KIND_OPTIONS: {
  value: SupervisionDocKind
  label: string
  holderFieldLabel: string
}[] = [
  { value: "MORTGAGE", label: "抵押单", holderFieldLabel: "抵押权人" },
  { value: "PLEDGE", label: "质押单", holderFieldLabel: "质押权人" },
  {
    value: "SUPERVISION_SERVICE",
    label: "监管服务单",
    holderFieldLabel: "质权人（服务方）",
  },
]

/** 权人/质权人合作方档案归属菜单（R-PLG-14 / R-PLG-15） */
export function holderArchiveMenuForDocKind(
  kind: SupervisionDocKind,
): PartnerArchiveMenuLabel {
  return kind === "SUPERVISION_SERVICE" ? "服务方信息" : "资金方信息"
}

/** 货主固定货主信息域（R-PLG-16） */
export const SUPERVISION_OWNER_ARCHIVE_MENU: PartnerArchiveMenuLabel = "货主信息"
