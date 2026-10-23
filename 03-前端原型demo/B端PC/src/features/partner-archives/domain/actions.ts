import type { PartnerSubject, RoleStatus, SubjectStatus } from "./types"
import {
  isArchiveRequiredFieldsPending,
  partnerArchiveEditActionLabel,
} from "../lib/archive-required-fields-pending"

export const SUBJECT_STATUS_BADGE_CLASS: Record<SubjectStatus, string> = {
  NORMAL: "border-emerald-200 bg-emerald-50 text-emerald-700",
  FROZEN: "border-amber-200 bg-amber-50 text-amber-700",
}

export const SUBJECT_STATUS_LABELS: Record<SubjectStatus, string> = {
  NORMAL: "正常",
  FROZEN: "冻结",
}

export const ROLE_STATUS_BADGE_CLASS: Record<RoleStatus, string> = {
  NORMAL: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PENDING_COMPLETION: "border-sky-200 bg-sky-50 text-sky-700",
  PENDING_EFFECTIVE: "border-purple-200 bg-purple-50 text-purple-700",
  FROZEN: "border-amber-200 bg-amber-50 text-amber-700",
  INVALID: "border-slate-200 bg-slate-50 text-slate-600",
}

export type PartnerArchiveRowAction =
  | "detail"
  | "verifyContact"
  | "edit"
  | "appendRole"
  | "freeze"
  | "unfreeze"

/** 方案 A：操作位固定；待补全时由 UI 将「编辑」文案换为「补全资料」 */
export function getPartnerArchiveRowActions(
  item: PartnerSubject,
): PartnerArchiveRowAction[] {
  if (item.status === "FROZEN") {
    return ["detail", "unfreeze"]
  }
  return ["detail", "edit", "appendRole", "freeze"]
}

export { isArchiveRequiredFieldsPending, partnerArchiveEditActionLabel }

export type PartnerArchivePendingAction = "freeze" | "unfreeze" | "appendRole"

/** PC 详情页头 = 列表行操作去掉【详情】，并加【返回】；与方案 A 矩阵一致 */
export type PartnerDetailHeaderAction = "back" | Exclude<PartnerArchiveRowAction, "detail">

export function getPartnerDetailHeaderActions(
  partner: PartnerSubject,
): PartnerDetailHeaderAction[] {
  const actions: PartnerDetailHeaderAction[] = ["back"]
  for (const action of getPartnerArchiveRowActions(partner)) {
    if (action !== "detail") {
      actions.push(action)
    }
  }
  return actions
}
