import type { RoleStatus, SubjectStatus } from "./types"

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
  | "edit"
  | "appendRole"
  | "freeze"
  | "unfreeze"

export function getPartnerArchiveRowActions(
  status: SubjectStatus
): PartnerArchiveRowAction[] {
  if (status === "FROZEN") {
    return ["detail", "edit", "unfreeze"]
  }
  return ["detail", "edit", "appendRole", "freeze"]
}

export type PartnerArchivePendingAction = "freeze" | "unfreeze" | "appendRole"
