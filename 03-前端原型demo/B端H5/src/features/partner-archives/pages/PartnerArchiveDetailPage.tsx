import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Copy } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  AUTH_STATUS_LABELS,
  ROLE_STATUS_LABELS,
  ROLE_TYPE_LABELS,
  SOURCE_TYPE_LABELS,
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
  type RoleType,
} from "@prototype/B端PC/src/features/partner-archives/domain/types"
import {
  ROLE_STATUS_BADGE_CLASS,
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
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
  markContactPhoneVerified,
  resolveContactPhoneVerified,
  resolveContactPhoneVerifiedAt,
} from "@prototype/B端PC/src/features/partner-archives/lib/contact-phone-verify"
import { buildAppendedRole, hasActiveBusinessForRole } from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-rules"
import {
  getPartnerRoleRowActions,
  PARTNER_ROLE_ROW_ACTION_LABELS,
  type PartnerRoleRowAction,
} from "@prototype/B端PC/src/features/partner-archives/lib/role-row-actions"
import { partnerArchivesMock } from "@prototype/B端PC/src/features/partner-archives/mock/partner-archives.mock"
import { PartnerAppendRoleSheet } from "../components/PartnerAppendRoleSheet"
import { PartnerConfirmSheet } from "../components/PartnerConfirmSheet"
import { PartnerVerifySheet } from "../components/PartnerVerifySheet"
import {
  PARTNER_DETAIL_TAB_ITEMS,
  PARTNER_SUBJECT_FREEZE_DIALOG,
  PARTNER_SUBJECT_UNFREEZE_DIALOG,
  PARTNER_SUBJECT_UNFREEZE_SUCCESS_TOAST,
  getPartnerRoleRowDialogCopy,
  partnerContactPhoneDetailLabel,
  type PartnerDetailTabKey,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"
import { H5_PAGE_BODY } from "@/shared/h5-ui-theme"
import {
  PARTNER_ARCHIVE_LIST_ROUTE,
  partnerArchiveEditPath,
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
  const [mockTick, setMockTick] = useState(0)
  const [tab, setTab] = useState<DetailTab>("basic")
  const [partner, setPartner] = useState<PartnerSubject | undefined>(() =>
    getPartnerArchiveById(id),
  )
  const [pendingAction, setPendingAction] = useState<PartnerArchivePendingAction | null>(null)
  const [appendOpen, setAppendOpen] = useState(false)
  const [roleRowPending, setRoleRowPending] = useState<{
    roleIndex: number
    action: Extract<PartnerRoleRowAction, "freeze" | "unfreeze" | "remove">
  } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [verifyContactOpen, setVerifyContactOpen] = useState(false)

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
    return (
      partner.roles.some((r) => r.roleStatus === "PENDING_COMPLETION") ||
      !partner.certAddress.fullAddress
    )
  }, [partner])

  const headerActions = useMemo(
    () => (partner ? getPartnerDetailHeaderActions(partner.status) : []),
    [partner],
  )

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
    window.dispatchEvent(new Event("partner-archive-updated"))
  }

  if (!partner) {
    return (
      <MobileShell>
        <NavBar title="合作方详情" backTo={PARTNER_ARCHIVE_LIST_ROUTE} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到合作方档案
        </div>
      </MobileShell>
    )
  }

  const handleAppendRole = (roleTypes: RoleType[]) => {
    if (roleTypes.length === 0) return
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setPartner((prev) => {
      if (!prev) return prev
      const appended = roleTypes.map((roleType) => buildAppendedRole(prev, roleType, now))
      return commitPartnerArchive({
        ...prev,
        roles: [...prev.roles, ...appended],
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: now,
            operator: "当前用户",
            actionType: "APPEND_ROLE",
            actionName: "追加业务角色",
            detail: appended
              .map(
                (role) =>
                  `追加【${ROLE_TYPE_LABELS[role.roleType]}】，状态为${role.roleStatus === "PENDING_COMPLETION" ? "待补全" : "正常"}`,
              )
              .join("；"),
          },
          ...prev.auditLogs,
        ],
      })
    })
    setAppendOpen(false)
    showToast("业务角色已追加")
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

  const confirmRoleRowAction = (reason: string) => {
    if (!roleRowPending) return
    const { roleIndex, action } = roleRowPending
    const targetRole = partner.roles[roleIndex]
    if (!targetRole) {
      setRoleRowPending(null)
      return
    }
    if (action === "remove" && hasActiveBusinessForRole(partner, targetRole.roleType)) {
      showToast("存在进行中的关联业务，无法移除该角色")
      setRoleRowPending(null)
      return
    }
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setPartner((prev) => {
      if (!prev) return prev
      const roles = prev.roles.map((role, index) => {
        if (index !== roleIndex) return role
        if (action === "freeze") {
          return { ...role, roleStatus: "FROZEN" as const, freezeReason: reason }
        }
        if (action === "unfreeze") {
          return { ...role, roleStatus: "NORMAL" as const, freezeReason: undefined }
        }
        return { ...role, roleStatus: "INVALID" as const, roleInvalidTime: now }
      })
      const actionName =
        action === "freeze" ? "冻结角色" : action === "unfreeze" ? "解冻角色" : "移除角色"
      return commitPartnerArchive({
        ...prev,
        roles,
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: now,
            operator: "当前用户",
            actionType: "CHANGE_ROLE_STATUS",
            actionName,
            detail: `${actionName}【${ROLE_TYPE_LABELS[targetRole.roleType]}】：${reason}`,
          },
          ...prev.auditLogs,
        ],
      })
    })
    setRoleRowPending(null)
    showToast("角色状态已更新")
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

  const roleDialogCopy = roleRowPending
    ? getPartnerRoleRowDialogCopy(roleRowPending.action)
    : null

  return (
    <MobileShell>
      <div className={H5_PAGE_BODY}>
      <NavBar title="合作方详情" backTo={PARTNER_ARCHIVE_LIST_ROUTE} />

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-32 overscroll-contain">
        {needsCompletion ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
            存在待补全信息（证件地址或角色待补全），请通过【去补全资料】完善后再发单。
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
              <span className="inline-flex flex-wrap items-center gap-1">
                合作方主体标识：{partner.partnerNo}
                <button
                  type="button"
                  className="inline-flex items-center gap-0.5 rounded border border-[#232D39]/10 px-1.5 py-0.5"
                  onClick={() => {
                    void navigator.clipboard.writeText(partner.partnerNo)
                    showToast("合作方主体标识已复制")
                  }}
                >
                  <Copy className="size-3" />
                  复制
                </button>
              </span>
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
              {item.key === "roles" ? ` (${partner.roles.length})` : ""}
              {item.key === "account" ? ` (${partner.boundAccount ? 1 : 0})` : ""}
              {item.key === "documents" ? ` (${partner.associatedDocs.length})` : ""}
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
                  ) : (
                    <span className="font-medium text-amber-600">
                      待补全（未录入证件登记地址，请使用【去补全资料】）
                    </span>
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

          {tab === "roles" && (
            <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-roles"]}>
              <div className="space-y-2.5">
                {partner.roles.map((role, index) => {
                  const rowActions = getPartnerRoleRowActions(role.roleType, role.roleStatus)
                  return (
                    <section
                      key={`${role.roleType}-${index}`}
                      className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-2"
                    >
                      <DetailRow
                        label="业务角色类型"
                        value={ROLE_TYPE_LABELS[role.roleType]}
                      />
                      <DetailRow
                        label="角色状态"
                        value={badgeOutline(
                          ROLE_STATUS_BADGE_CLASS[role.roleStatus],
                          ROLE_STATUS_LABELS[role.roleStatus],
                        )}
                      />
                      <DetailRow label="来源单据类型" value={role.sourceDocType ?? "——"} />
                      <DetailRow label="来源单据号" value={role.sourceDocNo ?? "——"} />
                      <DetailRow label="角色生效时间" value={role.roleEffectiveTime || "——"} />
                      <DetailRow label="角色失效时间" value={role.roleInvalidTime || "——"} />
                      {role.roleStatus === "FROZEN" ? (
                        <DetailRow label="冻结原因" value={role.freezeReason ?? "——"} />
                      ) : null}
                      {rowActions.length > 0 ? (
                        <div className="flex flex-wrap gap-2 border-t border-[#232D39]/5 pt-2">
                          {rowActions.map((action) =>
                            action === "complete" ? (
                              <Link
                                key={action}
                                to={partnerArchiveEditPath(partner.id)}
                                className="text-xs font-medium text-amber-600"
                              >
                                {PARTNER_ROLE_ROW_ACTION_LABELS[action]}
                              </Link>
                            ) : (
                              <button
                                key={action}
                                type="button"
                                className={`text-xs font-medium ${
                                  action === "freeze" || action === "remove"
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`}
                                onClick={() =>
                                  setRoleRowPending({
                                    roleIndex: index,
                                    action,
                                  })
                                }
                              >
                                {PARTNER_ROLE_ROW_ACTION_LABELS[action]}
                              </button>
                            ),
                          )}
                        </div>
                      ) : null}
                    </section>
                  )
                })}
              </div>
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

          {tab === "documents" && (
            <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-documents"]}>
              {partner.associatedDocs.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#232D39]/15 bg-white p-6 text-center text-xs text-[#232D39]/50">
                  暂无关联业务单据
                </p>
              ) : (
                <div className="space-y-2.5">
                  {partner.associatedDocs.map((doc) => (
                    <section
                      key={doc.id}
                      className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs space-y-1.5"
                    >
                      <DetailRow label="业务单据号" value={doc.docNo} />
                      <DetailRow label="单据类型" value={doc.docTypeName} />
                      <DetailRow label="承担业务角色" value={doc.roleName ?? "——"} />
                      <DetailRow label="业务品类/规格说明" value={doc.remark ?? "——"} />
                      <DetailRow label="单据业务日期" value={doc.bizDate} />
                      <DetailRow label="当前状态" value={doc.statusName} />
                      <DetailRow label="经办人员" value={doc.handlerName ?? "——"} />
                      <button
                        type="button"
                        className="mt-1 text-xs font-medium text-blue-600"
                        onClick={() => showToast(`原型占位：跳转 ${doc.docNo}`)}
                      >
                        查看单据
                      </button>
                    </section>
                  ))}
                </div>
              )}
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
              to={partnerArchiveEditPath(partner.id)}
              className={`rounded-lg px-3 py-2 text-xs font-medium text-white ${
                needsCompletion ? "bg-amber-600" : "bg-gray-800"
              }`}
            >
              {needsCompletion ? "去补全资料" : "编辑"}
            </Link>
          ) : null}
          {headerActions.includes("appendRole") ? (
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white"
              onClick={() => setAppendOpen(true)}
            >
              追加角色
            </button>
          ) : null}
          {headerActions.includes("freeze") ? (
            <button
              type="button"
              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white"
              onClick={() => setPendingAction("freeze")}
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

      {roleDialogCopy ? (
        <PartnerConfirmSheet
          open
          title={roleDialogCopy.title}
          description={roleDialogCopy.description}
          confirmLabel={roleDialogCopy.confirmLabel}
          destructive={roleDialogCopy.destructive}
          reasonRequired
          reasonLabel={roleDialogCopy.reasonLabel}
          reasonPlaceholder={roleDialogCopy.reasonPlaceholder}
          onClose={() => setRoleRowPending(null)}
          onConfirm={confirmRoleRowAction}
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
