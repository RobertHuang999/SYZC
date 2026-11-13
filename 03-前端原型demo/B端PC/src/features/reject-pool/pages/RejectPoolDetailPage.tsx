import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  CheckCircle2Icon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  FileTextIcon,
  HistoryIcon,
  LockIcon,
  ShieldAlertIcon,
  UnlockIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import {
  REJECT_POOL_CIRCUIT_BREAKER_SPEC_NOTE,
  REJECT_POOL_CIRCUIT_BREAKER_USER_HINT,
} from "@prototype/shared/reject-pool/reject-pool-ui-labels"
import { rejectPoolDetailAnnotations } from "../annotations/reject-pool-detail.annotations"
import {
  AttachmentPreviewModal,
  ChangeRouteAssignFunderModal,
  CircuitBreakerUnlockModal,
  ReassignFunderModal,
  ReinitiateDiligenceModal,
  ReviveClueModal,
  RouteAssignModal,
  type ReviveSubmitPayload,
} from "../components/RejectPoolActionModals"
import { rejectPoolDocuments } from "../documents/reject-pool-documents"
import {
  BUSINESS_STATUS_META,
  OVERDUE_HOURS_THRESHOLD,
  REJECT_NODE_BADGE_CLASS,
  REJECT_POOL_LIST_PATH,
  formatYuan,
  isCircuitBroken,
  nextBatchNo,
  type AttachmentItem,
  type RejectPoolRecord,
  type RescheduledLogItem,
} from "../domain/types"
import {
  loadRejectPoolRecords,
  loadRescheduledLogs,
  saveRejectPoolRecords,
  saveRescheduledLogs,
} from "./RejectPoolListPage"

function nowFormatted(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function RejectPoolDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [record, setRecord] = useState<RejectPoolRecord | null>(null)
  const [copied, setCopied] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [previewAttachment, setPreviewAttachment] = useState<AttachmentItem | null>(
    null,
  )

  const [reviveOpen, setReviveOpen] = useState(false)
  const [routeAssignOpen, setRouteAssignOpen] = useState(false)
  const [reinitOpen, setReinitOpen] = useState(false)
  const [skipDiligenceOpen, setSkipDiligenceOpen] = useState(false)
  const [reassignFunderOpen, setReassignFunderOpen] = useState(false)
  const [unlockOpen, setUnlockOpen] = useState(false)

  useEffect(() => {
    const list = loadRejectPoolRecords()
    const decoded = id ? decodeURIComponent(id) : ""
    const found =
      list.find((item) => item.id === decoded || item.applyNo === decoded) ??
      list[0] ??
      null
    setRecord(found)
  }, [id])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3200)
  }

  const handleCopyNo = () => {
    if (!record) return
    void navigator.clipboard.writeText(record.applyNo)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const completeAndReturn = (
    target: RejectPoolRecord,
    actionName: string,
    targetStatusLabel: string,
    targetAssignee: string,
    toastText: string,
  ) => {
    const nextList = loadRejectPoolRecords().filter((item) => item.id !== target.id)
    saveRejectPoolRecords(nextList)

    const nextLog: RescheduledLogItem = {
      id: `log-${Date.now()}`,
      applyNo: target.applyNo,
      batchNo: nextBatchNo(target.batchNo),
      applicantName: target.applicantName,
      productName: target.productName,
      actionName,
      targetStatusLabel,
      targetAssignee,
      operatedAt: nowFormatted(),
    }
    saveRescheduledLogs([nextLog, ...loadRescheduledLogs()])

    showToast(toastText)
    window.setTimeout(() => {
      navigate(`${REJECT_POOL_LIST_PATH}?tab=${target.tabKey}`)
    }, 900)
  }

  const handleConfirmRevive = (
    target: RejectPoolRecord,
    _payload: ReviveSubmitPayload,
  ) => {
    completeAndReturn(
      target,
      "重新救活",
      "待受理",
      "客户融资需求线索分配池",
      `申请单 ${target.applyNo} 已成功救活并恢复「待受理」，即将返回被拒退回池。`,
    )
  }

  const handleConfirmRouteAssign = (
    target: RejectPoolRecord,
    _assigneeId: string,
    assigneeName: string,
  ) => {
    const statusLabel = target.needDiligence ? "待尽调" : "授信已受理"
    completeAndReturn(
      target,
      "按路由指派",
      statusLabel,
      assigneeName,
      `已指派至「${assigneeName}」，流转至「${statusLabel}」。`,
    )
  }

  const handleConfirmReinit = (
    target: RejectPoolRecord,
    _surveyorId: string,
    surveyorName: string,
  ) => {
    completeAndReturn(
      target,
      "重新发起尽调",
      "待尽调",
      surveyorName,
      `已生成新尽调批次 ${nextBatchNo(target.batchNo)}，指派给「${surveyorName}」。`,
    )
  }

  const handleConfirmSkipDiligence = (
    target: RejectPoolRecord,
    _funderId: string,
    funderName: string,
  ) => {
    completeAndReturn(
      target,
      "变更路由直分资方",
      "授信已受理",
      funderName,
      `特批免尽调生效！已推送至「${funderName}」（授信已受理）。`,
    )
  }

  const handleConfirmReassignFunder = (
    target: RejectPoolRecord,
    _funderId: string,
    funderName: string,
  ) => {
    completeAndReturn(
      target,
      "重新分配资方",
      "授信已受理",
      funderName,
      `原尽调结论有效！已生成新授信批次分配给「${funderName}」。`,
    )
  }

  const handleConfirmUnlock = (
    target: RejectPoolRecord,
    ticketNo: string,
    reason: string,
  ) => {
    const updated: RejectPoolRecord = {
      ...target,
      demoUnlocked: true,
      batchHistory: [
        {
          batchNo: target.batchNo,
          nodeName: target.rejectNodeName,
          actionResult: "线下特批解除熔断",
          operatorName: "首席风控官",
          operatorOrg: "森云风控委员会",
          operatedAt: nowFormatted(),
          reasonOrNote: `特批工单 ${ticketNo}：${reason}`,
        },
        ...target.batchHistory,
      ],
    }
    const nextList = loadRejectPoolRecords().map((item) =>
      item.id === updated.id ? updated : item,
    )
    saveRejectPoolRecords(nextList)
    setRecord(updated)
    showToast(`已完成特批解除（${ticketNo}），该单据现已恢复线上重调度权限。`)
  }

  if (!record) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-8">
        <p className="text-sm text-muted-foreground">未找到对应的被拒退回单据或该单据已重调度流出。</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate(REJECT_POOL_LIST_PATH)}
        >
          返回被拒退回记录池
        </Button>
      </div>
    )
  }

  const statusMeta = BUSINESS_STATUS_META[record.businessStatus]
  const overdue = record.stagnationHours > OVERDUE_HOURS_THRESHOLD
  const locked = isCircuitBroken(record)

  return (
    <PrototypeAnnotationProvider
      documents={rejectPoolDocuments}
      annotations={rejectPoolDetailAnnotations}
    >
      <div className="space-y-4 font-sans">
        {toastMessage && (
          <div className="fixed top-5 left-1/2 z-[60] -translate-x-1/2 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl">
            <CheckCircle2Icon className="size-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 顶栏 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-detail-header"]}>
          <DetailPageHeader
            title="被拒退回单据详情"
            number={record.applyNo}
            numberLabel="申请单号"
            onBack={() => navigate(`${REJECT_POOL_LIST_PATH}?tab=${record.tabKey}`)}
            onCopy={handleCopyNo}
            copied={copied}
            status={
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className={statusMeta.badgeClass}>
                  {statusMeta.label}
                </Badge>
                <Badge
                  variant="outline"
                  className={REJECT_NODE_BADGE_CLASS[record.rejectNodeName]}
                >
                  {record.rejectNodeName}
                </Badge>
                {overdue && (
                  <Badge
                    variant="outline"
                    className="border-rose-200 bg-rose-50 text-rose-700"
                  >
                    超期未调度 ({record.stagnationHours.toFixed(1)}h)
                  </Badge>
                )}
                {locked && (
                  <Badge
                    variant="outline"
                    className="border-rose-300 bg-rose-100 text-rose-800"
                  >
                    已熔断（被拒 {record.rejectCount} 次）
                  </Badge>
                )}
              </div>
            }
            actions={
              <div className="flex flex-wrap items-center gap-2">
                {record.tabKey === "CLUE_REJECTED" && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={locked}
                      onClick={() => setReviveOpen(true)}
                    >
                      重新救活
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={locked}
                      onClick={() => setRouteAssignOpen(true)}
                    >
                      按路由指派
                    </Button>
                  </>
                )}
                {record.tabKey === "DILIGENCE_FAILED" && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={locked}
                      onClick={() => setSkipDiligenceOpen(true)}
                    >
                      变更路由直分资方
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={locked}
                      onClick={() => setReinitOpen(true)}
                    >
                      重新发起尽调
                    </Button>
                  </>
                )}
                {record.tabKey === "CREDIT_FAILED" && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={locked}
                    onClick={() => setReassignFunderOpen(true)}
                  >
                    重新分配资方
                  </Button>
                )}
                {locked && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                    onClick={() => setUnlockOpen(true)}
                  >
                    <UnlockIcon className="size-3.5" />
                    特批解除熔断
                  </Button>
                )}
              </div>
            }
          />
        </PrototypeAnnotationTarget>

        {locked && (
          <div className="space-y-2">
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-900">
              <ShieldAlertIcon className="mt-0.5 size-4 shrink-0 text-rose-600" />
              <div className="space-y-0.5">
                <div className="font-semibold flex items-center gap-1.5">
                  <LockIcon className="size-3.5" />
                  已触发风控熔断保护，线上重调度已锁定
                </div>
                <div>{REJECT_POOL_CIRCUIT_BREAKER_USER_HINT}</div>
              </div>
            </div>
            <PrototypeSpecCallout>
              {REJECT_POOL_CIRCUIT_BREAKER_SPEC_NOTE}
            </PrototypeSpecCallout>
          </div>
        )}

        {/* 子板块 1：异常归集与重调度状态概览 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-detail-overview"]}>
          <DetailSection title="异常归集与重调度状态概览">
            <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField label="申请单号" value={record.applyNo} />
              <DetailField label="重调度批次号" value={record.batchNo} />
              <DetailField label="退回节点名称" value={record.rejectNodeName} />
              <DetailField label="融资业务状态" value={statusMeta.label} />
              <DetailField
                label="停滞时长（小时）"
                value={
                  <span className={overdue ? "font-semibold text-rose-600" : undefined}>
                    {record.stagnationHours.toFixed(1)} 小时
                    {overdue ? "（超期未调度）" : "（正常）"}
                  </span>
                }
              />
              <DetailField
                label="历史被拒次数"
                value={`${record.rejectCount} 次`}
              />
              <DetailField
                label="退回处理人"
                value={`${record.rejectHandler}（${record.rejectHandlerOrg}）`}
              />
              <DetailField label="退回时间" value={record.rejectedAt} />
            </div>

            {record.historicalRejectedFunders.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 text-xs">
                <span className="text-muted-foreground">历史曾拒资金方名单：</span>
                {record.historicalRejectedFunders.map((f) => (
                  <Badge
                    key={f}
                    variant="outline"
                    className="border-rose-200 bg-rose-50 text-rose-700"
                  >
                    *历史曾拒 · {f}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50/70 p-3.5 text-xs">
              <div className="font-semibold text-rose-800">最后被拒原因</div>
              <p className="mt-1 leading-relaxed text-rose-900">
                {record.lastRejectReason}
              </p>
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 子板块 2：融资产品与额度要素 */}
        <DetailSection title="融资产品与额度要素">
          <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField label="产品名称" value={record.productName} />
            <DetailField
              label="需要尽调"
              value={record.needDiligence ? "是" : "否"}
            />
            <DetailField
              label="意向融资金额（元）"
              value={`${formatYuan(record.intendedAmountYuan)} 元`}
            />
            <DetailField
              label="意向融资期数"
              value={`${record.intendedPeriods} 期（月）`}
            />
            <DetailField
              label="原核准授信额度（元）"
              value={
                record.approvedCreditAmountYuan
                  ? `${formatYuan(record.approvedCreditAmountYuan)} 元`
                  : "—"
              }
            />
            <DetailField
              label="原核准授信期数"
              value={
                record.approvedCreditPeriods
                  ? `${record.approvedCreditPeriods} 期（月）`
                  : "—"
              }
            />
            <DetailField label="申请时间" value={record.appliedAt} />
          </div>
        </DetailSection>

        {/* 子板块 3：申请人主体资质信息（按企业/个人动态渲染） */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-detail-applicant"]}>
          <DetailSection title="申请人主体资质信息">
            <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField
                label="申请人类型"
                value={record.applicantType === "ENTERPRISE" ? "企业货主" : "个人货主"}
              />
              <DetailField label="申请人名称" value={record.applicantName} />
              <DetailField label="申请人标识" value={record.applicantIdentifier} />
              {record.applicantType === "ENTERPRISE" ? (
                <>
                  <DetailField
                    label="营业执照"
                    value={
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewAttachment({
                            id: "license",
                            category: "营业执照",
                            fileName: record.businessLicenseFileName ?? "营业执照副本.pdf",
                            fileSize: "1.8 MB",
                            uploadedBy: record.agentName ?? "经办人",
                            uploadedAt: record.appliedAt,
                            summary: `统一社会信用代码：${record.businessLicenseNo ?? record.applicantIdentifier}`,
                          })
                        }
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <EyeIcon className="size-3.5" />
                        <span>{record.businessLicenseFileName ?? "预览营业执照"}</span>
                      </button>
                    }
                  />
                  <DetailField
                    label="经办人名称"
                    value={formatEmptyValue(record.agentName)}
                  />
                  <DetailField
                    label="经办人手机号"
                    value={formatEmptyValue(record.agentPhone)}
                  />
                  <DetailField
                    label="经办人证件号"
                    value={formatEmptyValue(record.agentIdCard)}
                  />
                </>
              ) : (
                <>
                  <DetailField
                    label="申请人电话"
                    value={formatEmptyValue(record.applicantPhone)}
                  />
                  <DetailField
                    label="申请人身份证号"
                    value={formatEmptyValue(record.applicantIdCard)}
                  />
                </>
              )}
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 子板块 4：抵/质押物标的与仓单明细 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-detail-collateral"]}>
          <DetailSection title="抵/质押物标的与仓单明细">
            <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField
                label="抵/质押物类型"
                value={
                  record.collateralType === "WAREHOUSE_RECEIPT"
                    ? "数字仓单"
                    : "现货存货"
                }
              />
              <DetailField
                label="仓单编号"
                value={
                  record.warehouseReceiptCodes?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {record.warehouseReceiptCodes.map((code) => (
                        <Link
                          key={code}
                          to={`/仓储/仓单管理/详情/${encodeURIComponent(code)}`}
                          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          <span>{code}</span>
                          <ExternalLinkIcon className="size-3.5" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    "—"
                  )
                }
              />
              <DetailField
                label="评估担保总货值（元）"
                value={`${formatYuan(
                  record.inventoryItems.reduce(
                    (sum, item) => sum + item.assessedValueYuan,
                    0,
                  ),
                )} 元`}
              />
            </div>

            <div className="mt-4 overflow-x-auto rounded-md border border-border/70">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-muted-foreground dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2.5 whitespace-nowrap">货物大类 / 品类</th>
                    <th className="px-3 py-2.5 whitespace-nowrap">规格型号</th>
                    <th className="px-3 py-2.5 whitespace-nowrap">监管仓库 / 库位</th>
                    <th className="px-3 py-2.5 text-right whitespace-nowrap">质押数量</th>
                    <th className="px-3 py-2.5 text-right whitespace-nowrap">评估单价(元)</th>
                    <th className="px-3 py-2.5 text-right whitespace-nowrap">评估小计(元)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card">
                  {record.inventoryItems.map((inv) => (
                    <tr key={inv.id} className="h-[52px]">
                      <td className="px-3 py-2 font-medium text-foreground">
                        {inv.categoryName} · {inv.varietyName}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{inv.specModel}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {inv.warehouseName}（{inv.zoneLocation}）
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {inv.pledgeQuantity} {inv.unit}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {formatYuan(inv.unitPriceYuan)}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-foreground">
                        {formatYuan(inv.assessedValueYuan)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailSection>

          {/* 子板块 5：全量附件资料 */}
          <DetailSection title="全量附件资料（申请资料 / 尽调底稿 / 驳回凭证）">
            {record.attachments.length === 0 ? (
              <div className="text-xs text-muted-foreground">暂无留存附件资料</div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {record.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/15 px-3.5 py-2.5"
                  >
                    <div className="flex min-w-0 items-start gap-2.5">
                      <FileTextIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-slate-200 bg-white text-[10px]"
                          >
                            {att.category}
                          </Badge>
                          <span className="truncate text-xs font-medium text-foreground">
                            {att.fileName}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {att.fileSize} · {att.uploadedBy} · {att.uploadedAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs text-primary"
                        onClick={() => setPreviewAttachment(att)}
                      >
                        <EyeIcon className="size-3.5" />
                        预览
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs"
                        onClick={() =>
                          showToast(`已开始下载附件：${att.fileName}`)
                        }
                      >
                        <DownloadIcon className="size-3.5" />
                        下载
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 子板块 6：多轮重调度与历次被拒履历时间轴 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-detail-timeline"]}>
          <DetailSection title="多轮重调度与历次被拒履历时间轴">
            <div className="ml-2 space-y-4 border-l-2 border-primary/25 pl-4">
              {record.batchHistory.map((item, idx) => (
                <div key={`${item.batchNo}-${idx}`} className="relative space-y-1.5">
                  <span className="absolute -left-[23px] top-1 flex size-3 items-center justify-center rounded-full border-2 border-primary bg-white" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50 text-xs font-medium text-blue-700"
                      >
                        <HistoryIcon className="mr-1 size-3" />
                        {item.batchNo}
                      </Badge>
                      <span className="text-xs font-semibold text-foreground">
                        {item.nodeName}
                      </span>
                      <span className="text-xs font-medium text-rose-700">
                        {item.actionResult}
                      </span>
                      {item.isConfidentialFunderRemark && (
                        <Badge
                          variant="outline"
                          className="border-amber-200 bg-amber-50 text-[10px] text-amber-700"
                        >
                          跨资方推送自动脱敏
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.operatedAt}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    经办人：{item.operatorName}（{item.operatorOrg}）
                  </div>
                  <div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2 text-xs text-foreground leading-relaxed">
                    {item.reasonOrNote}
                  </div>
                </div>
              ))}
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 操作弹窗复用 */}
        <ReviveClueModal
          open={reviveOpen}
          record={record}
          onOpenChange={setReviveOpen}
          onConfirm={handleConfirmRevive}
        />
        <RouteAssignModal
          open={routeAssignOpen}
          record={record}
          onOpenChange={setRouteAssignOpen}
          onConfirm={handleConfirmRouteAssign}
        />
        <ReinitiateDiligenceModal
          open={reinitOpen}
          record={record}
          onOpenChange={setReinitOpen}
          onConfirm={handleConfirmReinit}
        />
        <ChangeRouteAssignFunderModal
          open={skipDiligenceOpen}
          record={record}
          onOpenChange={setSkipDiligenceOpen}
          onConfirm={handleConfirmSkipDiligence}
        />
        <ReassignFunderModal
          open={reassignFunderOpen}
          record={record}
          onOpenChange={setReassignFunderOpen}
          onConfirm={handleConfirmReassignFunder}
        />
        <CircuitBreakerUnlockModal
          open={unlockOpen}
          record={record}
          onOpenChange={setUnlockOpen}
          onConfirm={handleConfirmUnlock}
        />
        <AttachmentPreviewModal
          open={Boolean(previewAttachment)}
          attachment={previewAttachment}
          onOpenChange={(v) => {
            if (!v) setPreviewAttachment(null)
          }}
          onDownload={(att) => showToast(`已开始下载附件：${att.fileName}`)}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}

