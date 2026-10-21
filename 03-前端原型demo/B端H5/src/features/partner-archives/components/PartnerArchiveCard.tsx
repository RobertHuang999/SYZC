import { Link } from "react-router-dom"
import {
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
} from "@prototype/B端PC/src/features/partner-archives/domain/types"
import {
  isArchiveRequiredFieldsPending,
  partnerArchiveEditActionLabel,
} from "@prototype/B端PC/src/features/partner-archives/lib/archive-required-fields-pending"
import {
  SUBJECT_STATUS_LABELS,
} from "@prototype/B端PC/src/features/partner-archives/domain/actions"
import { maskLoginPhone } from "@prototype/B端PC/src/features/partner-archives/lib/detail-utils"
import {
  CONTACT_PHONE_VERIFY_LABELS,
  resolveContactPhoneVerified,
} from "@prototype/B端PC/src/features/partner-archives/lib/contact-phone-verify"
import { partnerArchiveDetailRoute, partnerArchiveFormRoute } from "../domain/constants"

type PartnerArchiveCardProps = {
  item: PartnerSubject
}

function subjectStatusClass(status: PartnerSubject["status"]) {
  return status === "NORMAL"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-amber-50 text-amber-700 border-amber-200"
}

function verifyBadgeClass(status: ReturnType<typeof resolveContactPhoneVerified>) {
  return status === "VERIFIED"
    ? "bg-sky-50 text-sky-700 border-sky-200"
    : "bg-gray-100 text-gray-600 border-gray-200"
}

export function PartnerArchiveCard({ item }: PartnerArchiveCardProps) {
  const verifyStatus = resolveContactPhoneVerified(item)
  const linkedSummary = (item.linkedPartnerArchives ?? [])
    .map((link) => link.targetMenu)
    .slice(0, 3)
    .join("、")
  const profilePending = isArchiveRequiredFieldsPending(item)

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
          <p className="mt-0.5 text-[11px] text-[#232D39]/50">{item.partnerNo}</p>
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
              className={`inline-flex shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium ${verifyBadgeClass(verifyStatus)}`}
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

      <div className="mt-3 flex gap-2 border-t border-[#232D39]/5 pt-3">
        <Link
          to={partnerArchiveDetailRoute(item.archiveMenu, item.id)}
          className="rounded-md bg-[#232D39]/5 px-3 py-1.5 text-xs font-medium text-[#232D39]"
        >
          查看详情
        </Link>
        <Link
          to={partnerArchiveFormRoute(item.archiveMenu, item.id)}
          className="ml-auto rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white"
        >
          {partnerArchiveEditActionLabel(item)}
        </Link>
      </div>
    </div>
  )
}
