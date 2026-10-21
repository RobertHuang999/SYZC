import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import {
  AUTH_STATUS_LABELS,
  SOURCE_TYPE_LABELS,
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
} from "@prototype/B端PC/src/features/partner-archives/domain/types"
import {
  SUBJECT_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_LABELS,
  type PartnerArchivePendingAction,
} from "@prototype/B端PC/src/features/partner-archives/domain/actions"
import {
  commitPartnerArchive,
  getPartnerArchiveById,
  getPartnerDetailHeaderActions,
  maskLoginPhone,
} from "@prototype/B端PC/src/features/partner-archives/lib/detail-utils"
import {
  checkPartnerSubjectFreezeEligibility,
  maskIdNumber,
  type FreezeBlockReason,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-rules"
import {
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
  markContactPhoneVerified,
  resolveContactPhoneVerified,
  resolveContactPhoneVerifiedAt,
} from "@prototype/B端PC/src/features/partner-archives/lib/contact-phone-verify"
import { appendLinkedPartnerMenus, formatLinkedArchiveStatus } from "@prototype/B端PC/src/features/partner-archives/lib/linked-partner-archives"
import {
  isArchiveRequiredFieldsPending,
  partnerArchiveEditActionLabel,
  collectArchiveRequiredGaps,
} from "@prototype/B端PC/src/features/partner-archives/lib/archive-required-fields-pending"
import {
  PARTNER_DETAIL_PENDING_DOCS_SPEC,
  PARTNER_DETAIL_PENDING_DOCS_USER,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { partnerArchivesMock } from "@prototype/B端PC/src/features/partner-archives/mock/partner-archives.mock"
import { PartnerAppendRoleSheet } from "../components/PartnerAppendRoleSheet"
import { PartnerConfirmSheet } from "../components/PartnerConfirmSheet"
import { PartnerFreezeBlockedSheet } from "../components/PartnerFreezeBlockedSheet"
import { PartnerVerifySheet } from "../components/PartnerVerifySheet"
import {
  PARTNER_DETAIL_TAB_ITEMS,
  PARTNER_SUBJECT_FREEZE_DIALOG,
  PARTNER_SUBJECT_UNFREEZE_DIALOG,
  PARTNER_SUBJECT_UNFREEZE_SUCCESS_TOAST,
  partnerContactPhoneDetailLabel,
  type PartnerDetailTabKey,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"
import { H5_PAGE_BODY } from "@/shared/h5-ui-theme"
import { useLocation } from "react-router-dom"
import { parsePartnerArchiveMenuFromH5ListPath } from "@prototype/shared/partner-archives/partner-archive-domain"
import {
  partnerArchiveDetailRoute,
  partnerArchiveFormRoute,
  partnerArchiveListRoute,
} from "../domain/constants"

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
  const [pendingAction, setPendingAction] = useState<PartnerArchivePendingAction | null>(null)
  const [appendOpen, setAppendOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [verifyContactOpen, setVerifyContactOpen] = useState(false)
  const [blockedBlockInfo, setBlockedBlockInfo] = useState<FreezeBlockReason | null>(null)

  const handleFreezeClick = () => {
    if (!partner) return
    const check = checkPartnerSubjectFreezeEligibility(partner)
    if (!check.canFreeze) {
      setBlockedBlockInfo(check)
      return
    }
    setPendingAction("freeze")
  }

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

  const headerActions = useMemo(
    () => (partner ? getPartnerDetailHeaderActions(partner.status) : []),
    [partner],
  )

  const listRoute = partnerArchiveListRoute(partner?.archiveMenu ?? menuFromPath)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
    window.dispatchEvent(new Event("partner-archive-updated"))
  }

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

  const handleAppendRole = (targetMenus: PartnerArchiveMenuLabel[]) => {
    if (targetMenus.length === 0) return
    const detail = targetMenus
      .map((menu) => `在【${menu}】创建独立主档或关联已有主档`)
      .join("；")
    setPartner((prev) => {
      if (!prev) return prev
      return commitPartnerArchive(appendLinkedPartnerMenus(prev, targetMenus, detail))
    })
    setAppendOpen(false)
    showToast("已追加合作方档案角色")
  }

  const handleFreeze = (reason: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setPartner((prev) => {
      if (!prev) return prev
      return commitPartnerArchive({
        ...prev,
        status: "FROZEN",
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: now,
            operator: "当前用户",
            actionType: "FREEZE",
            actionName: "冻结主体",
            detail: `执行主体冻结管控，原因：${reason}`,
          },
          ...prev.auditLogs,
        ],
      })
    })
    showToast("主体已冻结")
  }

  const handleUnfreeze = (note: string) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setPartner((prev) => {
      if (!prev) return prev
      return commitPartnerArchive({
        ...prev,
        status: "NORMAL",
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: now,
            operator: "当前用户",
            actionType: "UNFREEZE",
            actionName: "解冻主体",
            detail: `解冻恢复主体正常状态，说明：${note}`,
          },
          ...prev.auditLogs,
        ],
      })
    })
    showToast(PARTNER_SUBJECT_UNFREEZE_SUCCESS_TOAST)
  }

  const confirmPendingAction = (reason: string) => {
    if (pendingAction === "freeze") handleFreeze(reason)
    if (pendingAction === "unfreeze") handleUnfreeze(reason)
    setPendingAction(null)
  }

  const completeVerifyContact = () => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setPartner((prev) => {
      if (!prev) return prev
      const next: PartnerSubject = {
        ...prev,
        updateTime: now,
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: now,
            operator: "当前用户",
            actionType: "AUDIT_SNAPSHOT",
            actionName: "联系手机核验",
            detail:
              "详情主动补验：短信二元身份确认通过，联系手机已验证（PA-R04c 已生效）",
          },
          ...prev.auditLogs,
        ],
      }
      markContactPhoneVerified(next, now)
      const idx = partnerArchivesMock.findIndex((item) => item.id === prev.id)
      if (idx >= 0) partnerArchivesMock[idx] = next
      return commitPartnerArchive(next)
    })
    setVerifyContactOpen(false)
    showToast("联系手机验证成功")
  }

  const pendingCopy =
    pendingAction === "freeze"
      ? PARTNER_SUBJECT_FREEZE_DIALOG
      : pendingAction === "unfreeze"
        ? PARTNER_SUBJECT_UNFREEZE_DIALOG
        : null

  return (
    <MobileShell>
      <div className={H5_PAGE_BODY}>
        <NavBar title="合作方详情" backTo={partnerArchiveListRoute(menuFromPath)} />

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-32 overscroll-contain">
        {needsCompletion ? (
          <div className="space-y-2">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
              {PARTNER_DETAIL_PENDING_DOCS_USER}
            </div>
            <PrototypeSpecCallout>{PARTNER_DETAIL_PENDING_DOCS_SPEC}</PrototypeSpecCallout>
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
            <p className="text-[11px] leading-relaxed text-[#232D39]/55">
              <span>身份标识：{partner.idNumberMasked}</span>
              <span className="mx-1">·</span>
              <span>合作方主体标识：{partner.partnerNo}</span>
            </p>
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
                <DetailRow label="经办人姓名" value={partner.agentName || "——"} />
              ) : null}
              {partner.archiveMenu === "提货人信息" && partner.subjectType === "ENTERPRISE" ? (
                <DetailRow
                  label="经办人身份证号"
                  value={
                    partner.agentIdNumber ? maskIdNumber(partner.agentIdNumber) : "——"
                  }
                />
              ) : null}
              <DetailRow
                label={partnerContactPhoneDetailLabel(partner.subjectType)}
                value={
                  partner.contactPhone.length >= 11
                    ? maskLoginPhone(partner.contactPhone)
                    : partner.contactPhone || "——"
                }
              />
              <DetailRow
                label="证件地址"
                value={
                  partner.certAddress.fullAddress ? (
                    partner.certAddress.fullAddress
                  ) : collectArchiveRequiredGaps(partner).includes("certAddress") ? (
                    <span className="font-medium text-amber-600">
                      待补全（未录入证件登记地址，请使用【补全资料】）
                    </span>
                  ) : (
                    "——"
                  )
                }
              />
              <DetailRow label="创建来源" value={SOURCE_TYPE_LABELS[partner.source]} />
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
                  暂无其他子菜单主档关联。可通过底栏【追加合作方档案】跨菜单创建或关联。
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
                      <DetailRow label="合作方主体标识" value={link.partnerNo} />
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
                      <span className="mx-1">·</span>
                      IP {log.ip || "——"}
                    </p>
                  </section>
                ))}
              </div>
            </PrototypeAnnotationTarget>
          )}
        </div>
      </div>
      </div>

      <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-actions"]}>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#232D39]/10 bg-white/95 px-3 py-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {resolveContactPhoneVerified(partner) === "UNVERIFIED" &&
          !(partner.status === "FROZEN" && !needsCompletion) ? (
            <button
              type="button"
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800"
              onClick={() => setVerifyContactOpen(true)}
            >
              验证联系手机
            </button>
          ) : null}
          {headerActions.includes("edit") ? (
            <Link
              to={partnerArchiveFormRoute(partner.archiveMenu, partner.id)}
              className={`rounded-lg px-3 py-2 text-xs font-medium text-white ${
                needsCompletion ? "bg-amber-600" : "bg-gray-800"
              }`}
            >
              {partnerArchiveEditActionLabel(partner)}
            </Link>
          ) : null}
          {headerActions.includes("appendRole") ? (
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white"
              onClick={() => setAppendOpen(true)}
            >
              追加合作方档案
            </button>
          ) : null}
          {headerActions.includes("freeze") ? (
            <button
              type="button"
              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white"
              onClick={handleFreezeClick}
            >
              冻结主体
            </button>
          ) : null}
          {headerActions.includes("unfreeze") ? (
            <button
              type="button"
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium"
              onClick={() => setPendingAction("unfreeze")}
            >
              解冻主体
            </button>
          ) : null}
        </div>
      </div>
      </PrototypeAnnotationTarget>

      <PartnerFreezeBlockedSheet
        open={Boolean(blockedBlockInfo)}
        onClose={() => setBlockedBlockInfo(null)}
        partner={partner ?? null}
        blockInfo={blockedBlockInfo}
      />

      <PartnerAppendRoleSheet
        partner={partner}
        open={appendOpen}
        onClose={() => setAppendOpen(false)}
        onConfirm={handleAppendRole}
      />

      {pendingCopy ? (
        <PartnerConfirmSheet
          open
          title={pendingCopy.title}
          description={pendingCopy.description}
          confirmLabel={pendingCopy.confirmLabel}
          destructive={pendingCopy.destructive}
          reasonRequired
          reasonLabel={pendingCopy.reasonLabel}
          reasonPlaceholder={pendingCopy.reasonPlaceholder}
          onClose={() => setPendingAction(null)}
          onConfirm={confirmPendingAction}
        />
      ) : null}

      {partner ? (
        <PartnerVerifySheet
          open={verifyContactOpen}
          mode="VERIFY_CONTACT"
          verifyContext="DETAIL_VERIFY"
          subjectType={partner.subjectType}
          name={partner.name}
          idNumber={partner.idNumber}
          contactPhone={partner.contactPhone}
          fullAddress={partner.certAddress.fullAddress}
          roles={partner.roles.map((r) => r.roleType)}
          agentName={partner.agentName}
          onClose={() => setVerifyContactOpen(false)}
          onConfirm={completeVerifyContact}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </MobileShell>
  )
}
