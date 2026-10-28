import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  AUTH_STATUS_LABELS,
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
} from "@prototype/B端PC/src/features/partner-archives/domain/types"
import { resolveCreateSourceDisplayLabel } from "@prototype/B端PC/src/features/partner-archives/lib/create-source-display"
import {
  SUBJECT_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_LABELS,
} from "@prototype/B端PC/src/features/partner-archives/domain/actions"
import {
  getPartnerArchiveById,
  maskLoginPhone,
} from "@prototype/B端PC/src/features/partner-archives/lib/detail-utils"
import {
  maskIdNumber,
  resolvePartnerIdentityDisplay,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-rules"
import { resolvePartnerSubjectFreezeReason } from "@prototype/B端PC/src/features/partner-archives/lib/partner-subject-freeze-state"
import {
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
  resolveContactPhoneVerified,
  resolveContactPhoneVerifiedAt,
} from "@prototype/B端PC/src/features/partner-archives/lib/contact-phone-verify"
import { formatLinkedArchiveStatus } from "@prototype/B端PC/src/features/partner-archives/lib/linked-partner-archives"
import {
  isArchiveRequiredFieldsPending,
  collectArchiveRequiredGaps,
} from "@prototype/B端PC/src/features/partner-archives/lib/archive-required-fields-pending"
import {
  PARTNER_PENDING_COMPLETION_SPEC_NOTE,
  partnerFieldPendingInlineHint,
  partnerPendingCompletionUserBanner,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  PARTNER_DETAIL_TAB_ITEMS,
  partnerContactPhoneDetailLabel,
  type PartnerDetailTabKey,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"
import { H5_PAGE_BODY } from "@/shared/h5-ui-theme"
import { useLocation } from "react-router-dom"
import { parsePartnerArchiveMenuFromH5ListPath } from "@prototype/shared/partner-archives/partner-archive-domain"
import { partnerArchiveDetailRoute, partnerArchiveListRoute } from "../domain/constants"

type DetailTab = PartnerDetailTabKey

const TABS = PARTNER_DETAIL_TAB_ITEMS

function badgeOutline(className: string, text: string) {
  return (
    <span className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-medium ${className}`}>
      {text}
    </span>
  )
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 text-xs">
      <span className="shrink-0 text-[#232D39]/55">{label}</span>
      <span className="text-right text-[#232D39]">{value}</span>
    </div>
  )
}

export function PartnerArchiveDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const menuFromPath =
    parsePartnerArchiveMenuFromH5ListPath(location.pathname) ?? "货主信息"
  const [mockTick, setMockTick] = useState(0)
  const [tab, setTab] = useState<DetailTab>("basic")
  const [partner, setPartner] = useState<PartnerSubject | undefined>(() =>
    getPartnerArchiveById(id),
  )
  useEffect(() => {
    const bump = () => {
      setMockTick((t) => t + 1)
      setPartner(getPartnerArchiveById(id))
    }
    window.addEventListener("partner-archive-updated", bump)
    return () => window.removeEventListener("partner-archive-updated", bump)
  }, [id])

  useEffect(() => {
    void mockTick
    setPartner(getPartnerArchiveById(id))
  }, [id, mockTick])

  const needsCompletion = useMemo(() => {
    if (!partner) return false
    return isArchiveRequiredFieldsPending(partner)
  }, [partner])

  const requiredGaps = useMemo(() => {
    if (!partner) return []
    return collectArchiveRequiredGaps(partner)
  }, [partner])

  const listRoute = partnerArchiveListRoute(partner?.archiveMenu ?? menuFromPath)

  if (!partner) {
    return (
      <MobileShell>
        <NavBar title="合作方详情" backTo={listRoute} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到合作方档案
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <div className={H5_PAGE_BODY}>
        <NavBar title="合作方详情" backTo={partnerArchiveListRoute(menuFromPath)} />

      <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-actions"]}>
        <span className="sr-only">
          H5 详情页只读无操作底栏；方案 A 与【验证】均在列表卡片 Footer 单行文字链；PC 列表操作列与详情页头均可验证。
        </span>
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-6 overscroll-contain">
        {needsCompletion && partner ? (
          <div className="space-y-2">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
              {partnerPendingCompletionUserBanner(partner.archiveMenu)}
            </div>
            <PrototypeSpecCallout>{PARTNER_PENDING_COMPLETION_SPEC_NOTE}</PrototypeSpecCallout>
          </div>
        ) : null}

        <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-header"]}>
        <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2.5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-base font-bold text-[#232D39] leading-tight">{partner.name}</p>
              {badgeOutline("border-[#232D39]/15 bg-[#232D39]/5 text-[#232D39]", SUBJECT_TYPE_LABELS[partner.subjectType])}
              {badgeOutline(SUBJECT_STATUS_BADGE_CLASS[partner.status], SUBJECT_STATUS_LABELS[partner.status])}
              {needsCompletion ? (
                badgeOutline("border-sky-200 bg-sky-50 text-sky-700", "待补全")
              ) : null}
            </div>
            <div className="space-y-0.5 text-[11px] leading-relaxed text-[#232D39]/55">
              <p>
                ID：
                <span className="whitespace-nowrap font-medium text-[#232D39]">
                  {partner.partnerNo || "——"}
                </span>
              </p>
              <p>身份标识：{resolvePartnerIdentityDisplay(partner)}</p>
            </div>
          </div>
        </section>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-tabs"]}>
        <div className="flex overflow-x-auto border-b border-[#232D39]/10 bg-white px-2 pt-1 shadow-xs no-scrollbar">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`shrink-0 px-3 py-2.5 text-xs font-medium ${
                tab === item.key
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-[#232D39]/55"
              }`}
              onClick={() => setTab(item.key)}
            >
              {item.label}
              {item.key === "linked"
                ? ` (${partner.linkedPartnerArchives?.length ?? 0})`
                : ""}
              {item.key === "account" ? ` (${partner.boundAccount ? 1 : 0})` : ""}
              {item.key === "logs" ? ` (${partner.auditLogs.length})` : ""}
            </button>
          ))}
        </div>
        </PrototypeAnnotationTarget>

        <div className="space-y-2.5">
          {tab === "basic" && (
            <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-basic"]}>
            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2">
              {partner.status === "FROZEN" ? (
                <DetailRow
                  label="冻结原因"
                  value={
                    <span className="max-w-[62%] text-right text-amber-900 leading-snug">
                      {resolvePartnerSubjectFreezeReason(partner) || "——"}
                    </span>
                  }
                />
              ) : null}
              <DetailRow
                label={partnerContactPhoneDetailLabel(partner.subjectType)}
                value={
                  partnerFieldPendingInlineHint(requiredGaps, "contactPhone") ? (
                    <span className="font-medium text-amber-600">
                      {partnerFieldPendingInlineHint(requiredGaps, "contactPhone")}
                    </span>
                  ) : partner.contactPhone.length >= 11 ? (
                    maskLoginPhone(partner.contactPhone)
                  ) : (
                    partner.contactPhone || "——"
                  )
                }
              />
              <DetailRow
                label="联系手机核验"
                value={badgeOutline(
                  CONTACT_PHONE_VERIFY_BADGE_CLASS[resolveContactPhoneVerified(partner)],
                  CONTACT_PHONE_VERIFY_LABELS[resolveContactPhoneVerified(partner)],
                )}
              />
              <DetailRow
                label="核验时间"
                value={resolveContactPhoneVerifiedAt(partner) || "——"}
              />
              {partner.subjectType === "ENTERPRISE" ? (
                <DetailRow
                  label="经办人姓名"
                  value={
                    partnerFieldPendingInlineHint(requiredGaps, "agentName") ? (
                      <span className="font-medium text-amber-600">
                        {partnerFieldPendingInlineHint(requiredGaps, "agentName")}
                      </span>
                    ) : (
                      partner.agentName || "——"
                    )
                  }
                />
              ) : null}
              {partner.subjectType === "ENTERPRISE" ? (
                <DetailRow
                  label="经办人身份证号"
                  value={
                    partnerFieldPendingInlineHint(requiredGaps, "agentIdNumber") ? (
                      <span className="font-medium text-amber-600">
                        {partnerFieldPendingInlineHint(requiredGaps, "agentIdNumber")}
                      </span>
                    ) : partner.agentIdNumber ? (
                      maskIdNumber(partner.agentIdNumber)
                    ) : (
                      "——"
                    )
                  }
                />
              ) : null}
              <DetailRow
                label="证件地址"
                value={
                  partner.certAddress.fullAddress ? (
                    partner.certAddress.fullAddress
                  ) : partnerFieldPendingInlineHint(requiredGaps, "certAddress") ? (
                    <span className="font-medium text-amber-600">
                      {partnerFieldPendingInlineHint(requiredGaps, "certAddress")}
                      {partner.status === "FROZEN"
                        ? "（请先解冻后再补全资料）"
                        : "（请返回列表卡片【补全资料】）"}
                    </span>
                  ) : (
                    "——"
                  )
                }
              />
              <DetailRow
                label="创建来源"
                value={resolveCreateSourceDisplayLabel(partner)}
              />
              <DetailRow label="创建人" value={partner.createdBy} />
              <DetailRow label="创建时间" value={partner.createTime} />
              <DetailRow
                label="更新人"
                value={
                  partner.updatedBy ? (
                    <>
                      {partner.updatedBy}
                      {partner.updatedByOrg ? (
                        <span className="text-[#232D39]/45">（{partner.updatedByOrg}）</span>
                      ) : null}
                    </>
                  ) : (
                    "——"
                  )
                }
              />
              <DetailRow label="更新时间" value={partner.updateTime || "——"} />
            </section>
            </PrototypeAnnotationTarget>
          )}

          {tab === "linked" && (
            <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-roles"]}>
              {(partner.linkedPartnerArchives?.length ?? 0) === 0 ? (
                <p className="rounded-xl border border-[#232D39]/10 bg-white p-4 text-xs text-[#232D39]/55">
                  暂无其他子菜单主档关联。可在列表卡片点【追加】跨菜单创建或关联。
                </p>
              ) : (
                <div className="space-y-2.5">
                  {partner.linkedPartnerArchives!.map((link) => (
                    <section
                      key={`${link.targetMenu}-${link.partnerId}`}
                      className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2"
                    >
                      <DetailRow label="目标菜单" value={link.targetMenu} />
                      <DetailRow label="主体名称" value={link.name} />
                      <DetailRow label="状态" value={formatLinkedArchiveStatus(link)} />
                      <Link
                        to={partnerArchiveDetailRoute(link.targetMenu, link.partnerId)}
                        className="inline-block text-xs font-medium text-blue-600"
                      >
                        查看详情
                      </Link>
                    </section>
                  ))}
                </div>
              )}
            </PrototypeAnnotationTarget>
          )}

          {tab === "account" && (
            <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-account"]}>
            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2">
              {partner.boundAccount ? (
                <>
                  <DetailRow
                    label="登录手机号"
                    value={maskLoginPhone(partner.boundAccount.loginPhone)}
                  />
                  <DetailRow
                    label="实名认证状态"
                    value={AUTH_STATUS_LABELS[partner.boundAccount.authStatus]}
                  />
                  <DetailRow label="绑定生效时间" value={partner.boundAccount.bindTime} />
                </>
              ) : (
                <p className="text-xs text-[#232D39]/55">暂未绑定 C 端客户账号</p>
              )}
            </section>
            </PrototypeAnnotationTarget>
          )}

          {tab === "logs" && (
            <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-logs"]}>
              <div className="space-y-2.5">
                {partner.auditLogs.map((log) => (
                  <section
                    key={log.id}
                    className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[#232D39]">{log.actionName}</span>
                      <span className="text-[10px] text-[#232D39]/45">{log.opTime}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#232D39]/70 leading-relaxed">{log.detail}</p>
                    <p className="mt-1 text-[10px] text-[#232D39]/45">
                      操作人：{log.operator}
                    </p>
                  </section>
                ))}
              </div>
            </PrototypeAnnotationTarget>
          )}
        </div>
      </div>
      </div>

    </MobileShell>
  )
}
