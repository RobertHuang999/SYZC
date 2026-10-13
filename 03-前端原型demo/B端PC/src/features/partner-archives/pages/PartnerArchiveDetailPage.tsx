import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AlertTriangleIcon, ArrowLeftIcon, CopyIcon } from "lucide-react"
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
import { partnerArchiveDocuments } from "../documents/partner-archive-documents"
import { partnerArchiveDetailAnnotations } from "../annotations/partner-archive-detail.annotations"
import { PartnerAppendRoleDialog } from "../components/PartnerAppendRoleDialog"
import { PartnerConfirmDialog } from "../components/PartnerConfirmDialog"
import { PARTNER_ARCHIVE_LIST_PATH } from "../domain/constants"
import {
  ROLE_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_LABELS,
  type PartnerArchivePendingAction,
} from "../domain/actions"
import {
  AUTH_STATUS_LABELS,
  ROLE_TYPE_LABELS,
  ROLE_STATUS_LABELS,
  SOURCE_TYPE_LABELS,
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
  type RoleType,
} from "../domain/types"
import {
  getPartnerArchiveById,
  getPartnerDetailHeaderActions,
  maskLoginPhone,
} from "../lib/detail-utils"
import { hasActiveBusinessForRole } from "../lib/partner-archive-rules"
import {
  getPartnerRoleRowActions,
  PARTNER_ROLE_ROW_ACTION_LABELS,
  type PartnerRoleRowAction,
} from "../lib/role-row-actions"
import { cn } from "@/lib/utils"

type DetailTab = "basic" | "roles" | "account" | "documents" | "logs"

const TAB_ITEMS: { key: DetailTab; label: string }[] = [
  { key: "basic", label: "基础档案" },
  { key: "roles", label: "业务角色" },
  { key: "account", label: "关联客户账号" },
  { key: "documents", label: "关联业务单据" },
  { key: "logs", label: "操作审批日志" },
]

export function PartnerArchiveDetailPage() {
  const { id } = useParams()
  const initialPartner = useMemo(() => getPartnerArchiveById(id), [id])

  const [partner, setPartner] = useState<PartnerSubject | undefined>(initialPartner)
  const [activeTab, setActiveTab] = useState<DetailTab>("basic")
  const [pendingAction, setPendingAction] = useState<PartnerArchivePendingAction | null>(null)
  const [appendRoleOpen, setAppendRoleOpen] = useState(false)
  const [roleRowPending, setRoleRowPending] = useState<{
    roleIndex: number
    action: Extract<PartnerRoleRowAction, "freeze" | "unfreeze" | "remove">
  } | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [removeBlockedMessage, setRemoveBlockedMessage] = useState<string | null>(null)

  useEffect(() => {
    setPartner(getPartnerArchiveById(id))
  }, [id])

  const headerActions = useMemo(
    () => (partner ? getPartnerDetailHeaderActions(partner.status) : ["back"]),
    [partner]
  )

  const needsCompletion = useMemo(() => {
    if (!partner) return false
    return (
      partner.roles.some((r) => r.roleStatus === "PENDING_COMPLETION") ||
      !partner.certAddress.fullAddress
    )
  }, [partner])

  if (!partner) {
    return (
      <div className="space-y-4 p-6">
        <Link to={PARTNER_ARCHIVE_LIST_PATH}>
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

  const handleAppendRole = (roleType: RoleType) => {
    setPartner((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        roles: [
          ...prev.roles,
          {
            roleType,
            roleStatus: "NORMAL",
            sourceDocType: "人工建档",
            sourceDocNo: "——",
            roleEffectiveTime: new Date().toISOString().replace("T", " ").substring(0, 19),
          },
        ],
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: new Date().toISOString().replace("T", " ").substring(0, 19),
            operator: "当前用户",
            actionType: "APPEND_ROLE",
            actionName: "追加业务角色",
            detail: `追加【${ROLE_TYPE_LABELS[roleType]}】角色，状态为正常`,
          },
          ...prev.auditLogs,
        ],
      }
    })
  }

  const handleFreeze = (reason: string) => {
    setPartner((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        status: "FROZEN",
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: new Date().toISOString().replace("T", " ").substring(0, 19),
            operator: "当前用户",
            actionType: "FREEZE",
            actionName: "冻结主体",
            detail: `执行主体冻结管控，原因：${reason}`,
          },
          ...prev.auditLogs,
        ],
      }
    })
  }

  const handleUnfreeze = (note: string) => {
    setPartner((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        status: "NORMAL",
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: new Date().toISOString().replace("T", " ").substring(0, 19),
            operator: "当前用户",
            actionType: "UNFREEZE",
            actionName: "解冻主体",
            detail: `解冻恢复主体正常状态，说明：${note}`,
          },
          ...prev.auditLogs,
        ],
      }
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

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const confirmRoleRowAction = (reason: string) => {
    if (!roleRowPending || !partner) {
      return
    }
    const { roleIndex, action } = roleRowPending
    const targetRole = partner.roles[roleIndex]
    if (!targetRole) {
      return
    }

    if (
      action === "remove" &&
      hasActiveBusinessForRole(partner, targetRole.roleType)
    ) {
      setRemoveBlockedMessage("存在进行中的关联业务，无法移除该角色")
      setRoleRowPending(null)
      return
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 19)

    setPartner((prev) => {
      if (!prev) {
        return prev
      }
      const target = prev.roles[roleIndex]
      if (!target) {
        return prev
      }

      const roles = prev.roles.map((role, index) => {
        if (index !== roleIndex) {
          return role
        }
        if (action === "freeze") {
          return {
            ...role,
            roleStatus: "FROZEN" as const,
            freezeReason: reason,
          }
        }
        if (action === "unfreeze") {
          return {
            ...role,
            roleStatus: "NORMAL" as const,
            freezeReason: undefined,
          }
        }
        return {
          ...role,
          roleStatus: "INVALID" as const,
          roleInvalidTime: now,
        }
      })

      const actionName =
        action === "freeze"
          ? "冻结角色"
          : action === "unfreeze"
            ? "解冻角色"
            : "移除角色"

      return {
        ...prev,
        roles,
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: now,
            operator: "当前用户",
            actionType: "CHANGE_ROLE_STATUS",
            actionName,
            detail: `${actionName}【${ROLE_TYPE_LABELS[target.roleType]}】：${reason}`,
          },
          ...prev.auditLogs,
        ],
      }
    })
    setRoleRowPending(null)
  }

  const roleRowDialogCopy = !roleRowPending
    ? {
        title: "确认操作",
        description: "",
        confirmLabel: "确认",
        destructive: false,
        reasonLabel: "原因",
        reasonPlaceholder: "请输入原因（1～200 字）",
      }
    : roleRowPending.action === "freeze"
      ? {
          title: "确认冻结角色",
          description: "冻结后该角色将限制发起对应业务，同主体其他角色不受影响。",
          confirmLabel: "确认冻结",
          destructive: true,
          reasonLabel: "冻结原因",
          reasonPlaceholder: "请输入冻结原因（1～200 字）",
        }
      : roleRowPending.action === "unfreeze"
        ? {
            title: "确认解冻角色",
            description: "解冻后该角色恢复为正常状态，可继续参与业务单据。",
            confirmLabel: "确认解冻",
            destructive: false,
            reasonLabel: "解冻原因",
            reasonPlaceholder: "请输入解冻复核依据（1～200 字）",
          }
        : {
            title: "确认移除非货主角色",
            description: "移除后角色关系流转为失效；货主角色不可移除。",
            confirmLabel: "确认移除",
            destructive: true,
            reasonLabel: "移除角色原因",
            reasonPlaceholder: "请输入移除原因（1～200 字）",
          }

  return (
    <PrototypeAnnotationProvider
      title="合作方档案详情 · 原型批注"
      annotations={partnerArchiveDetailAnnotations}
      documents={partnerArchiveDocuments}
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
              </div>
              <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>
                  身份标识：<span className="font-mono">{partner.idNumberMasked}</span>
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  合作方编号：<span className="font-mono">{partner.partnerNo}</span>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="size-7"
                    onClick={() => {
                      void navigator.clipboard.writeText(partner.partnerNo)
                      showToast("合作方主体标识已复制")
                    }}
                  >
                    <CopyIcon className="size-3.5" />
                  </Button>
                </span>
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
              {headerActions.includes("back") && (
                <Link to={PARTNER_ARCHIVE_LIST_PATH}>
                  <Button variant="outline">
                    <ArrowLeftIcon />
                    返回
                  </Button>
                </Link>
              )}
              {headerActions.includes("edit") && (
                <Link to={`${PARTNER_ARCHIVE_LIST_PATH}/编辑/${partner.id}`}>
                  <Button
                    variant={needsCompletion ? "default" : "secondary"}
                    className={cn(
                      "whitespace-nowrap",
                      needsCompletion && "bg-amber-600 text-white hover:bg-amber-700"
                    )}
                  >
                    {needsCompletion ? "去补全资料" : "编辑"}
                  </Button>
                </Link>
              )}
              {headerActions.includes("appendRole") && (
                <Button className="whitespace-nowrap" onClick={() => setAppendRoleOpen(true)}>
                  追加角色
                </Button>
              )}
              {headerActions.includes("freeze") && (
                <Button
                  variant="destructive"
                  className="whitespace-nowrap"
                  onClick={() => setPendingAction("freeze")}
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

        {removeBlockedMessage && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {removeBlockedMessage}
          </div>
        )}

        {needsCompletion && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <span>
              当前主体存在待补全信息（证件登记地址未录入，关联角色限制发单）。请通过页头【去补全资料】完善档案以解除业务限制。
            </span>
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
                {tab.key === "roles" && ` (${partner.roles.length})`}
                {tab.key === "account" && ` (${partner.boundAccount ? "1" : "0"})`}
                {tab.key === "documents" && ` (${partner.associatedDocs.length})`}
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
                  <DetailField
                    label={
                      partner.subjectType === "INDIVIDUAL"
                        ? "联系电话"
                        : "联系电话（经办人）"
                    }
                  >
                    <span className="font-mono">
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
                    ) : (
                      <span className="font-medium text-amber-600">
                        待补全（未录入证件登记地址，请使用页头【去补全资料】）
                      </span>
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

        {activeTab === "roles" && (
          <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-roles"]}>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">业务角色列表</span>
                <span className="font-mono">共 {partner.roles.length} 个角色记录</span>
              </div>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">序号</TableHead>
                      <TableHead>业务角色类型</TableHead>
                      <TableHead>角色状态</TableHead>
                      <TableHead>来源单据类型</TableHead>
                      <TableHead>来源单据号</TableHead>
                      <TableHead>角色生效时间</TableHead>
                      <TableHead>角色失效时间</TableHead>
                      <TableHead>冻结原因</TableHead>
                      <TableHead className="min-w-[10.5rem] whitespace-nowrap">行操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partner.roles.map((role, index) => {
                      const rowActions = getPartnerRoleRowActions(role.roleType, role.roleStatus)
                      return (
                      <TableRow key={`${role.roleType}-${index}`}>
                        <TableCell className="text-center font-mono text-xs text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">{ROLE_TYPE_LABELS[role.roleType]}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={ROLE_STATUS_BADGE_CLASS[role.roleStatus]}
                          >
                            {ROLE_STATUS_LABELS[role.roleStatus]}
                          </Badge>
                        </TableCell>
                        <TableCell>{role.sourceDocType ?? "——"}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {role.sourceDocNo && role.sourceDocNo !== "——" ? (
                            <button
                              type="button"
                              className="text-primary hover:underline"
                              onClick={() =>
                                showToast(`原型占位：跳转至来源单据 ${role.sourceDocNo}`)
                              }
                            >
                              {role.sourceDocNo}
                            </button>
                          ) : (
                            "——"
                          )}
                        </TableCell>
                        <TableCell>
                          <DateTimeText value={role.roleEffectiveTime} />
                        </TableCell>
                        <TableCell>
                          {role.roleInvalidTime ? (
                            <DateTimeText value={role.roleInvalidTime} />
                          ) : (
                            "——"
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {role.roleStatus === "FROZEN" ? role.freezeReason ?? "——" : "——"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-0.5">
                            {rowActions.map((action) => {
                              if (action === "complete") {
                                return (
                                  <Link
                                    key={action}
                                    to={`${PARTNER_ARCHIVE_LIST_PATH}/编辑/${partner.id}`}
                                    className="shrink-0 text-sm font-medium text-amber-600 hover:underline whitespace-nowrap"
                                  >
                                    {PARTNER_ROLE_ROW_ACTION_LABELS[action]}
                                  </Link>
                                )
                              }
                              return (
                                <Button
                                  key={action}
                                  type="button"
                                  variant="link"
                                  size="sm"
                                  className={cn(
                                    "h-auto shrink-0 p-0 text-sm whitespace-nowrap",
                                    action === "freeze" || action === "remove"
                                      ? "text-destructive hover:text-destructive"
                                      : "text-primary"
                                  )}
                                  onClick={() =>
                                    setRoleRowPending({
                                      roleIndex: index,
                                      action,
                                    })
                                  }
                                >
                                  {PARTNER_ROLE_ROW_ACTION_LABELS[action]}
                                </Button>
                              )
                            })}
                            {rowActions.length === 0 && (
                              <span className="text-xs text-muted-foreground">——</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </div>
            </div>
          </PrototypeAnnotationTarget>
        )}

        {activeTab === "account" && (
          <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-account"]}>
          <DetailSection title="关联客户账号">
            {partner.boundAccount ? (
              <>
                <DetailField label="登录手机号">
                  <span className="font-mono">
                    {maskLoginPhone(partner.boundAccount.loginPhone)}
                  </span>
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

        {activeTab === "documents" && (
          <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-documents"]}>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>关联业务单据（穿透只读）：反映该主体在仓储、数字仓单、融资质押等环节的真实履约单据</span>
              <span className="font-mono">共 {partner.associatedDocs.length} 笔业务单据</span>
            </div>
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">序号</TableHead>
                    <TableHead>业务单据号</TableHead>
                    <TableHead>单据类型</TableHead>
                    <TableHead>承担业务角色</TableHead>
                    <TableHead>业务品类/规格说明</TableHead>
                    <TableHead>单据业务日期</TableHead>
                    <TableHead>当前状态</TableHead>
                    <TableHead>经办人员</TableHead>
                    <TableHead className="text-right">行操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partner.associatedDocs.map((doc, index) => {
                    const isFrozenOrReject =
                      doc.statusName.includes("冻结") ||
                      doc.statusName.includes("驳回") ||
                      doc.statusName.includes("查封")
                    const isPending =
                      doc.statusName.includes("待") ||
                      doc.statusName.includes("审核") ||
                      doc.statusName.includes("进行中") ||
                      doc.statusName.includes("审批")
                    const statusBadgeClass = isFrozenOrReject
                      ? "border-destructive/20 bg-destructive/10 text-destructive"
                      : isPending
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"

                    return (
                      <TableRow key={doc.id}>
                        <TableCell className="text-center font-mono text-xs text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-medium">
                          <button
                            type="button"
                            className="text-primary hover:underline"
                            onClick={() =>
                              showToast(`原型占位：跳转至${doc.docTypeName} ${doc.docNo}`)
                            }
                          >
                            {doc.docNo}
                          </button>
                        </TableCell>
                        <TableCell>{doc.docTypeName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            {doc.roleName ?? "货主"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {doc.remark ?? "——"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {doc.bizDate}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusBadgeClass}>
                            {doc.statusName}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{doc.handlerName}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs text-primary"
                            onClick={() =>
                              showToast(`原型占位：查看${doc.docTypeName} ${doc.docNo} 详情`)
                            }
                          >
                            查看单据
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>注：关联单据来源于仓储、仓单与转让业务流转记录</span>
              <span>显示第 1 至 {partner.associatedDocs.length} 笔（共 {partner.associatedDocs.length} 笔）</span>
            </div>
          </div>
          </PrototypeAnnotationTarget>
        )}

        {activeTab === "logs" && (
          <PrototypeAnnotationTarget annotationIds={["partner-archive-detail-logs"]}>
          <DetailSection title="操作审批日志">
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
                      <DateTimeText value={log.opTime} className="font-mono text-xs text-muted-foreground" />
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
          title="确认冻结主体"
          description="冻结后该主体名下业务角色将暂停发起新业务单据，历史在库库存进入只读风控锁定。请录入冻结原因。"
          confirmLabel="确认冻结"
          destructive
          reasonRequired
          reasonLabel="冻结原因"
          reasonPlaceholder="请输入冻结理由（1～200 字）"
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={confirmPendingAction}
        />

        <PartnerConfirmDialog
          open={pendingAction === "unfreeze"}
          title="提交解冻主体申请"
          description="解冻须风控审批终审通过后生效。请录入解冻复核依据；原型演示在确认后模拟审批通过。"
          confirmLabel="提交解冻申请"
          reasonRequired
          reasonLabel="解冻原因"
          reasonPlaceholder="请输入解冻复核依据（1～200 字）"
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={(reason) => {
            confirmPendingAction(reason)
            showToast("解冻审批已通过，主体已恢复正常")
          }}
        />

        <PartnerConfirmDialog
          open={roleRowPending !== null}
          title={roleRowDialogCopy.title}
          description={roleRowDialogCopy.description}
          confirmLabel={roleRowDialogCopy.confirmLabel}
          destructive={roleRowDialogCopy.destructive}
          reasonRequired
          reasonLabel={roleRowDialogCopy.reasonLabel}
          reasonPlaceholder={roleRowDialogCopy.reasonPlaceholder}
          onOpenChange={(open) => {
            if (!open) {
              setRoleRowPending(null)
            }
          }}
          onConfirm={confirmRoleRowAction}
        />

        <PartnerAppendRoleDialog
          partner={partner}
          open={appendRoleOpen}
          onOpenChange={setAppendRoleOpen}
          onConfirm={handleAppendRole}
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
