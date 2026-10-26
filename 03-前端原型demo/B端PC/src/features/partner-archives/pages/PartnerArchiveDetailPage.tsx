import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import {
  partnerArchiveBaseFromPathname,
  partnerArchiveDetailPath,
  type PartnerArchiveMenuLabel,
} from "@prototype/shared/partner-archives/partner-archive-routes"
import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DateTimeText } from "@/shared/components/DateTimeText"
import { DetailField, DetailSection } from "@/shared/components/DetailSection"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { getPartnerArchiveDocuments } from "../documents/partner-archive-documents"
import { parsePartnerArchiveMenuFromPathname } from "@prototype/shared/partner-archives/partner-archive-routes"
import { partnerArchiveDetailAnnotations } from "../annotations/partner-archive-detail.annotations"
import { PartnerAppendRoleDialog } from "../components/PartnerAppendRoleDialog"
import { PartnerCompositeSaveDialog } from "../components/PartnerCompositeSaveDialog"
import { PartnerConfirmDialog } from "../components/PartnerConfirmDialog"
import { PartnerFreezeBlockedDialog } from "../components/PartnerFreezeBlockedDialog"
import { PartnerVerifyDialog } from "../components/PartnerVerifyDialog"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import {
  SUBJECT_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_LABELS,
  getPartnerDetailHeaderActions,
  type PartnerArchivePendingAction,
} from "../domain/actions"
import {
  AUTH_STATUS_LABELS,
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
} from "../domain/types"
import { resolveCreateSourceDisplayLabel } from "../lib/create-source-display"
import {
  commitPartnerArchive,
  getPartnerArchiveById,
  maskLoginPhone,
} from "../lib/detail-utils"
import {
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
  markContactPhoneVerified,
  canShowVerifyContactPhoneAction,
  resolveContactPhoneVerified,
  resolveContactPhoneVerifiedAt,
} from "../lib/contact-phone-verify"
import { formatLinkedArchiveStatus } from "../lib/linked-partner-archives"
import { usePartnerCompositeRowAppend } from "../lib/use-partner-composite-row-append"
import {
  checkPartnerSubjectFreezeEligibility,
  maskIdNumber,
  type FreezeBlockReason,
} from "../lib/partner-archive-rules"
import {
  applyPartnerSubjectFreeze,
  applyPartnerSubjectUnfreeze,
  resolvePartnerSubjectFreezeReason,
} from "../lib/partner-subject-freeze-state"
import { withPartnerFreezeDemoData } from "../mock/partner-freeze-demo-rehydrate"
import {
  collectArchiveRequiredGaps,
  isArchiveRequiredFieldsPending,
  partnerArchiveEditActionLabel,
} from "../lib/archive-required-fields-pending"
import { cn } from "@/lib/utils"
import {
  PARTNER_DETAIL_TAB_ITEMS,
  PARTNER_PENDING_COMPLETION_SPEC_NOTE,
  PARTNER_SUBJECT_FREEZE_DIALOG,
  PARTNER_SUBJECT_UNFREEZE_DIALOG,
  formatPartnerSubjectStatusToast,
  partnerFieldPendingInlineHint,
  partnerPendingCompletionUserBanner,
  type PartnerDetailTabKey,
} from "../lib/partner-archive-ui-labels"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"

type DetailTab = PartnerDetailTabKey

const TAB_ITEMS = PARTNER_DETAIL_TAB_ITEMS

export function PartnerArchiveDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const listPath = partnerArchiveBaseFromPathname(location.pathname)
  const archiveMenuLabel = parsePartnerArchiveMenuFromPathname(location.pathname)
  const archiveDocuments = useMemo(
    () => getPartnerArchiveDocuments(archiveMenuLabel),
    [archiveMenuLabel],
  )
  const initialPartner = useMemo(() => getPartnerArchiveById(id), [id])

  const [partner, setPartner] = useState<PartnerSubject | undefined>(initialPartner)
  const [activeTab, setActiveTab] = useState<DetailTab>("basic")
  const [pendingAction, setPendingAction] = useState<PartnerArchivePendingAction | null>(null)
  const [appendRoleOpen, setAppendRoleOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [verifyContactOpen, setVerifyContactOpen] = useState(false)
  const [blockedBlockInfo, setBlockedBlockInfo] = useState<FreezeBlockReason | null>(null)

  useEffect(() => {
    setPartner(getPartnerArchiveById(id))
  }, [id])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const compositeRowAppend = usePartnerCompositeRowAppend({
    getPartnerList: () => partnerArchivesMock,
    onPartnerUpdated: (next) => {
      setPartner(next)
    },
  })

  const headerActions = useMemo(
    () => (partner ? getPartnerDetailHeaderActions(partner) : ["back"]),
    [partner],
  )

  const needsCompletion = useMemo(() => {
    if (!partner) return false
    return isArchiveRequiredFieldsPending(partner)
  }, [partner])

  const requiredGaps = useMemo(() => {
    if (!partner) return []
    return collectArchiveRequiredGaps(partner)
  }, [partner])

  const canVerifyContactPhone = useMemo(() => {
    if (!partner) return false
    return canShowVerifyContactPhoneAction(partner)
  }, [partner])

  const applyContactPhoneVerified = () => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setPartner((prev) => {
      if (!prev) {
        return prev
      }
      const next: PartnerSubject = {
        ...prev,
        updateTime: now,
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: now,
            operator: "当前用户",
            actionType: "AUDIT_SNAPSHOT",
            actionName: "修改合作方档案",
            detail: "修改合作方档案：联系手机完成短信核验，状态变为已验证",
          },
          ...prev.auditLogs,
        ],
      }
      markContactPhoneVerified(next, now)
      const mockIndex = partnerArchivesMock.findIndex((item) => item.id === prev.id)
      if (mockIndex >= 0) {
        partnerArchivesMock[mockIndex] = next
      }
      return next
    })
    setVerifyContactOpen(false)
    showToast("联系手机验证成功")
  }

  if (!partner) {
    return (
      <div className="space-y-4 p-6">
        <Link to={listPath}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的合作方档案
        </div>
      </div>
    )
  }

  const handleAppendRole = (targetMenus: PartnerArchiveMenuLabel[]) => {
    if (targetMenus.length === 0 || !partner) {
      return
    }
    compositeRowAppend.submitAppendSelection(partner, targetMenus)
  }

  const handleFreezeClick = () => {
    const check = checkPartnerSubjectFreezeEligibility(withPartnerFreezeDemoData(partner))
    if (!check.canFreeze) {
      setBlockedBlockInfo(check)
      return
    }
    setPendingAction("freeze")
  }

  const confirmPendingAction = (reason: string) => {
    const name = partner.name
    if (pendingAction === "freeze") {
      setPartner((prev) => {
        if (!prev) return prev
        return commitPartnerArchive(applyPartnerSubjectFreeze(prev, reason))
      })
      showToast(formatPartnerSubjectStatusToast(name, "freeze"))
    }
    if (pendingAction === "unfreeze") {
      setPartner((prev) => {
        if (!prev) return prev
        return commitPartnerArchive(applyPartnerSubjectUnfreeze(prev, reason))
      })
      showToast(formatPartnerSubjectStatusToast(name, "unfreeze"))
    }
    setPendingAction(null)
  }

  return (
    <PrototypeAnnotationProvider
      title="合作方档案详情 · 原型批注"
      annotations={partnerArchiveDetailAnnotations}
      documents={archiveDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget
          annotationIds={["partner-archive-detail-header", "partner-archive-detail-actions"]}
        >
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">{partner.name}</h1>
                <Badge variant="outline">{SUBJECT_TYPE_LABELS[partner.subjectType]}</Badge>
                <Badge
                  variant="outline"
                  className={SUBJECT_STATUS_BADGE_CLASS[partner.status]}
                >
                  {SUBJECT_STATUS_LABELS[partner.status]}
                </Badge>
                {needsCompletion && (
                  <Badge variant="outline" className="border-sky-300 bg-sky-50 text-sky-700">
                    待补全
                  </Badge>
                )}
                <Badge variant="secondary">档案归属：{partner.archiveMenu}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                身份标识：<span>{partner.idNumberMasked}</span>
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
              {headerActions.includes("back") && (
                <Link to={listPath}>
                  <Button variant="outline">
                    <ArrowLeftIcon />
                    返回
                  </Button>
                </Link>
              )}
              {canVerifyContactPhone && (
                <Button
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={() => setVerifyContactOpen(true)}
                >
                  验证联系手机
                </Button>
              )}
              {headerActions.includes("edit") && (
                <Link to={`${listPath}/编辑/${partner.id}`}>
                  <Button
                    variant={needsCompletion ? "default" : "secondary"}
                    className={cn(
                      "whitespace-nowrap",
                      needsCompletion && "bg-amber-600 text-white hover:bg-amber-700"
                    )}
                  >
                    {partnerArchiveEditActionLabel(partner)}
                  </Button>
                </Link>
              )}
              {headerActions.includes("appendRole") && (
                <Button className="whitespace-nowrap" onClick={() => setAppendRoleOpen(true)}>
                  追加合作方档案
                </Button>
              )}
              {headerActions.includes("freeze") && (
                <Button
                  variant="destructive"
                  className="whitespace-nowrap"
                  onClick={handleFreezeClick}
                >
                  冻结
                </Button>
              )}
              {headerActions.includes("unfreeze") && (
                <Button
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={() => setPendingAction("unfreeze")}
                >
                  解冻
                </Button>
              )}
            </div>
          </div>
        </PrototypeAnnotationTarget>

        {needsCompletion && partner && (
          <div className="space-y-2">
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <span>{partnerPendingCompletionUserBanner(partner.archiveMenu)}</span>
            </div>
            <PrototypeSpecCallout>{PARTNER_PENDING_COMPLETION_SPEC_NOTE}</PrototypeSpecCallout>
          </div>
        )}

        <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-tabs"]}>
          <div className="flex flex-wrap gap-2">
            {TAB_ITEMS.map((tab) => (
              <Button
                key={tab.key}
                type="button"
                size="sm"
                variant={activeTab === tab.key ? "secondary" : "ghost"}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {tab.key === "linked" &&
                  ` (${partner.linkedPartnerArchives?.length ?? 0})`}
                {tab.key === "account" && ` (${partner.boundAccount ? "1" : "0"})`}
                {tab.key === "logs" && ` (${partner.auditLogs.length})`}
              </Button>
            ))}
          </div>
        </PrototypeAnnotationTarget>

        {activeTab === "basic" && (
          <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-basic"]}>
            <DetailSection title="基础档案">
              {/* 第一行：主体关联信息（联系电话、证件地址） */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <DetailField label="联系手机核验">
                    <Badge
                      variant="outline"
                      className={
                        CONTACT_PHONE_VERIFY_BADGE_CLASS[
                          resolveContactPhoneVerified(partner)
                        ]
                      }
                    >
                      {
                        CONTACT_PHONE_VERIFY_LABELS[
                          resolveContactPhoneVerified(partner)
                        ]
                      }
                    </Badge>
                  </DetailField>
                </div>
                <div className="md:col-span-1">
                  <DetailField label="核验时间">
                    {(() => {
                      const verifiedAt = resolveContactPhoneVerifiedAt(partner)
                      return verifiedAt ? (
                        <DateTimeText value={verifiedAt} plain />
                      ) : (
                        <span className="text-muted-foreground">——</span>
                      )
                    })()}
                  </DetailField>
                </div>
                {partner.subjectType === "ENTERPRISE" && (
                  <div className="md:col-span-1">
                    <DetailField label="经办人姓名">
                      {partnerFieldPendingInlineHint(requiredGaps, "agentName") ? (
                        <span className="font-medium text-amber-600">
                          {partnerFieldPendingInlineHint(requiredGaps, "agentName")}
                        </span>
                      ) : (
                        partner.agentName || "——"
                      )}
                    </DetailField>
                  </div>
                )}
                {partner.subjectType === "ENTERPRISE" && (
                  <div className="md:col-span-1">
                    <DetailField label="经办人身份证号">
                      {partnerFieldPendingInlineHint(requiredGaps, "agentIdNumber") ? (
                        <span className="font-medium text-amber-600">
                          {partnerFieldPendingInlineHint(requiredGaps, "agentIdNumber")}
                        </span>
                      ) : partner.agentIdNumber ? (
                        maskIdNumber(partner.agentIdNumber)
                      ) : (
                        "——"
                      )}
                    </DetailField>
                  </div>
                )}
                <div className="md:col-span-1">
                  <DetailField
                    label={
                      partner.subjectType === "INDIVIDUAL"
                        ? "手机号"
                        : "联系电话（经办人手机）"
                    }
                  >
                    {partnerFieldPendingInlineHint(requiredGaps, "contactPhone") ? (
                      <span className="font-medium text-amber-600">
                        {partnerFieldPendingInlineHint(requiredGaps, "contactPhone")}
                      </span>
                    ) : (
                      <span>
                        {partner.contactPhone.length >= 11
                          ? maskLoginPhone(partner.contactPhone)
                          : partner.contactPhone || "——"}
                      </span>
                    )}
                  </DetailField>
                </div>
                <div className="md:col-span-3">
                  <DetailField label="证件地址">
                    {partner.certAddress.fullAddress ? (
                      <span>{partner.certAddress.fullAddress}</span>
                    ) : partnerFieldPendingInlineHint(requiredGaps, "certAddress") ? (
                      <span className="font-medium text-amber-600">
                        {partnerFieldPendingInlineHint(requiredGaps, "certAddress")}
                        {partner.status === "FROZEN"
                          ? "（请先解冻后再补全资料）"
                          : "（请使用页头【补全资料】）"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">——</span>
                    )}
                  </DetailField>
                </div>
              </div>

              {partner.status === "FROZEN" ? (
                <>
                  <div className="h-px bg-border/40" />
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-4">
                      <DetailField label="冻结原因">
                        {resolvePartnerSubjectFreezeReason(partner) || "——"}
                      </DetailField>
                    </div>
                  </div>
                </>
              ) : null}

              <div className="h-px bg-border/40" />

              {/* 第二行：创建信息（创建来源、创建人、创建时间） */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <DetailField label="创建来源">
                    {resolveCreateSourceDisplayLabel(partner)}
                  </DetailField>
                </div>
                <div className="md:col-span-1">
                  <DetailField label="创建人">{partner.createdBy}</DetailField>
                </div>
                <div className="md:col-span-2">
                  <DetailField label="创建时间">
                    <DateTimeText value={partner.createTime} />
                  </DetailField>
                </div>
              </div>

              <div className="h-px bg-border/40" />

              {/* 第三行：更新信息（更新人含所在机构、更新时间） */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <DetailField label="更新人">
                    {partner.updatedBy ? (
                      <span>
                        <span className="font-medium text-foreground">{partner.updatedBy}</span>
                        {partner.updatedByOrg && (
                          <span className="text-muted-foreground ml-1.5 text-xs">
                            （{partner.updatedByOrg}）
                          </span>
                        )}
                      </span>
                    ) : (
                      "——"
                    )}
                  </DetailField>
                </div>
                <div className="md:col-span-2">
                  <DetailField label="更新时间">
                    {partner.updateTime ? <DateTimeText value={partner.updateTime} /> : "——"}
                  </DetailField>
                </div>
              </div>
            </DetailSection>
          </PrototypeAnnotationTarget>
        )}

        {activeTab === "linked" && (
          <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-roles"]}>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">其他合作档案</span>
                <span>共 {partner.linkedPartnerArchives?.length ?? 0} 条关联</span>
              </div>
              {(partner.linkedPartnerArchives?.length ?? 0) === 0 ? (
                <p className="rounded-md border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
                  暂无其他子菜单主档关联。可通过页头【追加合作方档案】跨菜单创建或关联。
                </p>
              ) : (
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">序号</TableHead>
                        <TableHead>目标菜单</TableHead>
                        <TableHead>主体名称</TableHead>
                        <TableHead>主体状态</TableHead>
                        <TableHead className="min-w-[8rem]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partner.linkedPartnerArchives!.map((link, index) => (
                        <TableRow key={`${link.targetMenu}-${link.partnerId}`}>
                          <TableCell className="text-center text-xs text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">{link.targetMenu}</TableCell>
                          <TableCell>{link.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {formatLinkedArchiveStatus(link)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link
                              to={partnerArchiveDetailPath(link.targetMenu, link.partnerId)}
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              查看详情
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </PrototypeAnnotationTarget>
        )}

        {activeTab === "account" && (
          <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-account"]}>
          <DetailSection title="关联客户账号">
            {partner.boundAccount ? (
              <>
                <DetailField label="登录手机号">
                  <span>{maskLoginPhone(partner.boundAccount.loginPhone)}</span>
                </DetailField>
                <DetailField label="实名认证状态">
                  {AUTH_STATUS_LABELS[partner.boundAccount.authStatus]}
                </DetailField>
                <DetailField label="绑定生效时间">
                  <DateTimeText value={partner.boundAccount.bindTime} />
                </DetailField>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">暂未绑定 C 端客户账号</p>
            )}
          </DetailSection>
          </PrototypeAnnotationTarget>
        )}

        {activeTab === "logs" && (
          <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-logs"]}>
          <DetailSection title="操作审计日志">
            <div className="space-y-0 rounded-md border px-5 py-4">
              {partner.auditLogs.map((log) => {
                let dotColorClass = "bg-primary"
                if (log.actionType === "CREATE" || log.actionType === "BIND_ACCOUNT") {
                  dotColorClass = "bg-emerald-500"
                } else if (log.actionType === "EDIT" || log.actionType === "APPEND_ROLE") {
                  dotColorClass = "bg-blue-500"
                } else if (log.actionType === "FREEZE" || log.actionType === "CHANGE_ROLE_STATUS") {
                  dotColorClass = "bg-amber-500"
                } else if (log.actionType === "UNFREEZE") {
                  dotColorClass = "bg-teal-500"
                } else if (log.actionType === "AUDIT_SNAPSHOT") {
                  dotColorClass = "bg-purple-500"
                }

                return (
                  <div
                    key={log.id}
                    className="relative border-l-2 border-primary/20 py-3.5 pl-5 last:pb-1"
                  >
                    <span
                      className={cn(
                        "absolute -left-[5px] top-4.5 size-2 rounded-full",
                        dotColorClass
                      )}
                    />
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <DateTimeText value={log.opTime} className="text-xs text-muted-foreground" />
                      <span className="text-muted-foreground">·</span>
                      <span className="font-medium text-foreground">{log.operator}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.actionName}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">{log.detail}</p>
                  </div>
                )
              })}
            </div>
          </DetailSection>
          </PrototypeAnnotationTarget>
        )}

        <PartnerConfirmDialog
          open={pendingAction === "freeze"}
          title={PARTNER_SUBJECT_FREEZE_DIALOG.title}
          description={PARTNER_SUBJECT_FREEZE_DIALOG.description}
          confirmLabel={PARTNER_SUBJECT_FREEZE_DIALOG.confirmLabel}
          destructive={PARTNER_SUBJECT_FREEZE_DIALOG.destructive}
          reasonRequired
          reasonLabel={PARTNER_SUBJECT_FREEZE_DIALOG.reasonLabel}
          reasonPlaceholder={PARTNER_SUBJECT_FREEZE_DIALOG.reasonPlaceholder}
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={confirmPendingAction}
        />

        <PartnerFreezeBlockedDialog
          open={Boolean(blockedBlockInfo)}
          onOpenChange={(open) => {
            if (!open) {
              setBlockedBlockInfo(null)
            }
          }}
          partner={partner}
          blockInfo={blockedBlockInfo}
        />

        <PartnerConfirmDialog
          open={pendingAction === "unfreeze"}
          title={PARTNER_SUBJECT_UNFREEZE_DIALOG.title}
          description={PARTNER_SUBJECT_UNFREEZE_DIALOG.description}
          confirmLabel={PARTNER_SUBJECT_UNFREEZE_DIALOG.confirmLabel}
          reasonRequired
          reasonLabel={PARTNER_SUBJECT_UNFREEZE_DIALOG.reasonLabel}
          reasonPlaceholder={PARTNER_SUBJECT_UNFREEZE_DIALOG.reasonPlaceholder}
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={confirmPendingAction}
        />

        <PrototypeAnnotationTarget annotationIds={["partner-archive-row-append-pa-r03a"]}>
          <PartnerAppendRoleDialog
            partner={partner}
            open={appendRoleOpen}
            onOpenChange={setAppendRoleOpen}
            onConfirm={handleAppendRole}
          />

          <PartnerCompositeSaveDialog
            open={compositeRowAppend.compositeOpen}
            mode={compositeRowAppend.compositeMode}
            flowKind="rowAppend"
            currentMenu={compositeRowAppend.rowPartner?.archiveMenu ?? archiveMenuLabel}
            plan={compositeRowAppend.compositePlan}
            appendMenus={compositeRowAppend.pendingMenus}
            failures={compositeRowAppend.compositeFailures}
            successLines={compositeRowAppend.compositeSuccessLines}
            onOpenChange={(open) => {
              compositeRowAppend.setCompositeOpen(open)
              if (!open) {
                compositeRowAppend.resetCompositeFlow()
              }
            }}
            onConfirmComposite={compositeRowAppend.confirmCompositeAppend}
            onBackToList={() => compositeRowAppend.resetCompositeFlow()}
            onViewDetail={() => compositeRowAppend.resetCompositeFlow()}
          />
        </PrototypeAnnotationTarget>

        <PartnerVerifyDialog
          open={verifyContactOpen}
          mode="VERIFY_CONTACT"
          verifyContext="DETAIL_VERIFY"
          subjectType={partner.subjectType}
          name={partner.name}
          idNumber={partner.idNumber}
          contactPhone={partner.contactPhone}
          agentName={partner.agentName}
          fullAddress={partner.certAddress.fullAddress}
          roles={partner.roles.map((role) => role.roleType)}
          onOpenChange={setVerifyContactOpen}
          onConfirm={applyContactPhoneVerified}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
