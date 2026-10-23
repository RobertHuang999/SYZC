import { Link } from "react-router-dom"
import {
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
} from "@prototype/B端PC/src/features/partner-archives/domain/types"
import {
  getPartnerArchiveRowActions,
  partnerArchiveEditActionLabel,
  SUBJECT_STATUS_LABELS,
  type PartnerArchiveRowAction,
} from "@prototype/B端PC/src/features/partner-archives/domain/actions"
import { isArchiveRequiredFieldsPending } from "@prototype/B端PC/src/features/partner-archives/lib/archive-required-fields-pending"
import { maskLoginPhone } from "@prototype/B端PC/src/features/partner-archives/lib/detail-utils"
import { resolvePartnerSubjectFreezeReason } from "@prototype/B端PC/src/features/partner-archives/lib/partner-subject-freeze-state"
import {
  canShowVerifyContactPhoneAction,
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
  resolveContactPhoneVerified,
} from "@prototype/B端PC/src/features/partner-archives/lib/contact-phone-verify"
import { partnerArchiveDetailRoute, partnerArchiveFormRoute } from "../domain/constants"

type PartnerArchiveCardProps = {
  item: PartnerSubject
  onRowAction: (action: PartnerArchiveRowAction, item: PartnerSubject) => void
}

function subjectStatusClass(status: PartnerSubject["status"]) {
  return status === "NORMAL"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-amber-50 text-amber-700 border-amber-200"
}

const actionTextClass = "shrink-0 text-blue-600 active:opacity-75"
const actionDangerTextClass = "shrink-0 text-red-600 active:opacity-75"

export function PartnerArchiveCard({ item, onRowAction }: PartnerArchiveCardProps) {
  const verifyStatus = resolveContactPhoneVerified(item)
  const showVerifyContact = canShowVerifyContactPhoneAction(item)
  const linkedSummary = (item.linkedPartnerArchives ?? [])
    .map((link) => link.targetMenu)
    .slice(0, 3)
    .join("、")
  const profilePending = isArchiveRequiredFieldsPending(item)
  const freezeReason =
    item.status === "FROZEN" ? resolvePartnerSubjectFreezeReason(item) : undefined
  const rowActions = getPartnerArchiveRowActions(item)

  return (
    <div className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            to={partnerArchiveDetailRoute(item.archiveMenu, item.id)}
            className="block text-base font-bold text-[#232D39] leading-tight hover:text-blue-600"
          >
            {item.name}
          </Link>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-medium ${subjectStatusClass(item.status)}`}
          >
            {SUBJECT_STATUS_LABELS[item.status]}
          </span>
          {profilePending && (
            <span className="rounded border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
              待补全
            </span>
          )}
        </div>
      </div>

      <dl className="mt-2.5 space-y-1.5 text-xs">
        {freezeReason ? (
          <div className="rounded-md border border-amber-100 bg-amber-50/90 px-2 py-1.5 text-[11px] leading-snug text-amber-900">
            <span className="text-[#232D39]/55">冻结原因 · </span>
            {freezeReason}
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-[#232D39]/55 shrink-0">主体类型</dt>
          <dd className="text-[#232D39] text-right">{SUBJECT_TYPE_LABELS[item.subjectType]}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-[#232D39]/55 shrink-0">身份标识</dt>
          <dd className="font-medium text-[#232D39] text-right">{item.idNumberMasked}</dd>
        </div>
        {(item.linkedPartnerArchives?.length ?? 0) > 0 && (
          <div className="flex justify-between gap-2">
            <dt className="text-[#232D39]/55 shrink-0">其他合作档案</dt>
            <dd className="text-[#232D39] text-right truncate max-w-[58%]">
              {linkedSummary}
              {(item.linkedPartnerArchives?.length ?? 0) > 3
                ? ` 等${item.linkedPartnerArchives!.length}个`
                : ""}
            </dd>
          </div>
        )}
        <div className="flex justify-between items-center gap-2">
          <dt className="text-[#232D39]/55 shrink-0">联系手机</dt>
          <dd className="flex min-w-0 flex-wrap items-center justify-end gap-1.5 text-right">
            <span className="whitespace-nowrap text-[#232D39] tabular-nums">
              {item.contactPhone.length >= 11
                ? maskLoginPhone(item.contactPhone)
                : item.contactPhone || "——"}
            </span>
            <span
              className={`inline-flex shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium ${CONTACT_PHONE_VERIFY_BADGE_CLASS[verifyStatus]}`}
            >
              {CONTACT_PHONE_VERIFY_LABELS[verifyStatus]}
            </span>
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-[#232D39]/55 shrink-0">创建人</dt>
          <dd className="text-[#232D39] text-right">{item.createdBy}</dd>
        </div>
      </dl>

      <div className="mt-2 flex flex-nowrap items-center justify-end gap-4 overflow-x-auto border-t border-[#232D39]/5 pt-2 text-xs font-medium [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {rowActions.includes("detail") ? (
          <Link
            to={partnerArchiveDetailRoute(item.archiveMenu, item.id)}
            className={actionTextClass}
          >
            详情
          </Link>
        ) : null}
        {showVerifyContact ? (
          <button
            type="button"
            className={`cursor-pointer ${actionTextClass}`}
            onClick={() => onRowAction("verifyContact", item)}
          >
            验证
          </button>
        ) : null}
        {rowActions.includes("edit") ? (
          <Link
            to={partnerArchiveFormRoute(item.archiveMenu, item.id)}
            className={actionTextClass}
          >
            {partnerArchiveEditActionLabel(item)}
          </Link>
        ) : null}
        {rowActions.includes("appendRole") ? (
          <button
            type="button"
            className={`cursor-pointer ${actionTextClass}`}
            onClick={() => onRowAction("appendRole", item)}
          >
            追加
          </button>
        ) : null}
        {rowActions.includes("freeze") ? (
          <button
            type="button"
            className={`cursor-pointer ${actionDangerTextClass}`}
            onClick={() => onRowAction("freeze", item)}
          >
            冻结
          </button>
        ) : null}
        {rowActions.includes("unfreeze") ? (
          <button
            type="button"
            className={`cursor-pointer ${actionTextClass}`}
            onClick={() => onRowAction("unfreeze", item)}
          >
            解冻
          </button>
        ) : null}
      </div>
    </div>
  )
}
