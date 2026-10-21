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
import { PartnerConfirmDialog } from "../components/PartnerConfirmDialog"
import { PartnerFreezeBlockedDialog } from "../components/PartnerFreezeBlockedDialog"
import { PartnerVerifyDialog } from "../components/PartnerVerifyDialog"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import {
  SUBJECT_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_LABELS,
  type PartnerArchivePendingAction,
} from "../domain/actions"
import {
  AUTH_STATUS_LABELS,
  SOURCE_TYPE_LABELS,
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
} from "../domain/types"
import {
  commitPartnerArchive,
  getPartnerArchiveById,
  getPartnerDetailHeaderActions,
  maskLoginPhone,
} from "../lib/detail-utils"
import {
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
  markContactPhoneVerified,
  resolveContactPhoneVerified,
  resolveContactPhoneVerifiedAt,
} from "../lib/contact-phone-verify"
import {
  appendLinkedPartnerMenus,
  formatLinkedArchiveStatus,
} from "../lib/linked-partner-archives"
import {
  checkPartnerSubjectFreezeEligibility,
  maskIdNumber,
  type FreezeBlockReason,
} from "../lib/partner-archive-rules"
import {
  collectArchiveRequiredGaps,
  isArchiveRequiredFieldsPending,
  partnerArchiveEditActionLabel,
} from "../lib/archive-required-fields-pending"
import { cn } from "@/lib/utils"
import {
  PARTNER_DETAIL_PENDING_DOCS_USER,
  PARTNER_DETAIL_TAB_ITEMS,
  PARTNER_SUBJECT_FREEZE_DIALOG,
  PARTNER_SUBJECT_UNFREEZE_DIALOG,
  PARTNER_SUBJECT_UNFREEZE_SUCCESS_TOAST,
  type PartnerDetailTabKey,
} from "../lib/partner-archive-ui-labels"

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
    setPartner(getPartnerArchiveById(id))
  }, [id])

  const headerActions = useMemo(
    () => (partner ? getPartnerDetailHeaderActions(partner.status) : ["back"]),
    [partner]
  )

  const needsCompletion = useMemo(() => {
    if (!partner) return false
    return isArchiveRequiredFieldsPending(partner)
  }, [partner])

  const canVerifyContactPhone = useMemo(() => {
    if (!partner) return false
    if (resolveContactPhoneVerified(partner) === "VERIFIED") {
      return false
    }
    if (partner.status === "FROZEN" && !needsCompletion) {
      return false
    }
    return true
  }, [partner, needsCompletion])

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
            actionName: "联系手机核验",
            detail: "详情主动补验：短信二元身份确认通过，联系手机已验证（PA-R04c 已生效）",
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

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handleAppendRole = (targetMenus: PartnerArchiveMenuLabel[]) => {
    if (targetMenus.length === 0) {
      return
    }
    const detail = targetMenus
      .map((menu) => `在【${menu}】创建独立主档或关联已有主档`)
      .join("；")
    setPartner((prev) => {
      if (!prev) return prev
      return commitPartnerArchive(appendLinkedPartnerMenus(prev, targetMenus, detail))
    })
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
  }

  const confirmPendingAction = (reason: string) => {
    if (pendingAction === "freeze") {
      handleFreeze(reason)
    }
    if (pendingAction === "unfreeze") {
      handleUnfreeze(reason)
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
              <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>
                  身份标识：<span>{partner.idNumberMasked}</span>
                </span>
                <span>·</span>
                <span>
                  合作方主体标识：<span>{partner.partnerNo}</span>
                </span>
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
                  冻结主体
                </Button>
              )}
              {headerActions.includes("unfreeze") && (
                <Button
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={() => setPendingAction("unfreeze")}
                >
                  解冻主体
                </Button>
              )}
            </div>
          </div>
        </PrototypeAnnotationTarget>

        {needsCompletion && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <span>{PARTNER_DETAIL_PENDING_DOCS_USER}</span>
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
                      {partner.agentName || "——"}
                    </DetailField>
                  </div>
                )}
                {partner.archiveMenu === "提货人信息" &&
                  partner.subjectType === "ENTERPRISE" && (
                    <div className="md:col-span-1">
                      <DetailField label="经办人身份证号">
                        {partner.agentIdNumber
                          ? maskIdNumber(partner.agentIdNumber)
                          : "——"}
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
                    <span>
                      {partner.contactPhone.length >= 11
                        ? maskLoginPhone(partner.contactPhone)
                        : partner.contactPhone || "——"}
                    </span>
                  </DetailField>
                </div>
                <div className="md:col-span-3">
                  <DetailField label="证件地址">
                    {partner.certAddress.fullAddress ? (
                      <span>{partner.certAddress.fullAddress}</span>
                    ) : collectArchiveRequiredGaps(partner).includes("certAddress") ? (
                      <span className="font-medium text-amber-600">
                        待补全（未录入证件登记地址，请使用页头【补全资料】）
                      </span>
                    ) : (
                      <span className="text-muted-foreground">——</span>
                    )}
                  </DetailField>
                </div>
              </div>

              <div className="h-px bg-border/40" />

              {/* 第二行：创建信息（创建来源、创建人、创建时间） */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <DetailField label="创建来源">{SOURCE_TYPE_LABELS[partner.source]}</DetailField>
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
                        <TableHead>合作方主体标识</TableHead>
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
                          <TableCell className="text-xs tabular-nums">{link.partnerNo}</TableCell>
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
                      <span className="text-xs text-muted-foreground">IP {log.ip || "——"}</span>
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
          destructive
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
          partner={partner ?? null}
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
          onConfirm={(reason) => {
            confirmPendingAction(reason)
            showToast(PARTNER_SUBJECT_UNFREEZE_SUCCESS_TOAST)
          }}
        />

        <PartnerAppendRoleDialog
          partner={partner}
          open={appendRoleOpen}
          onOpenChange={setAppendRoleOpen}
          onConfirm={handleAppendRole}
        />

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
