import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  CheckCircle2Icon,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  HistoryIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  ONLINE_PLEDGE_ROLLBACK_SPEC_NOTE,
  ONLINE_PLEDGE_SETTLED_SPEC_NOTE,
  ONLINE_PLEDGE_SETTLED_USER_HINT,
} from "@prototype/shared/online-pledge/online-pledge-ui-labels"
import { onlinePledgeDetailAnnotations } from "../annotations/online-pledge-detail.annotations"
import { onlinePledgeDocuments } from "../documents/online-pledge-documents"
import {
  COLLATERAL_TYPE_META,
  FINANCING_STATUS_META,
  ONLINE_PLEDGE_LIST_PATH,
  PROCESSING_STAGE_LABEL,
  formatYuan,
  nowFormatted,
  onlinePledgeActionPath,
  type OnlinePledgeRecord,
} from "../domain/types"
import {
  loadOnlinePledgeRecords,
  saveOnlinePledgeRecords,
} from "./OnlinePledgeListPage"

const LIFECYCLE_STEPS = [
  { key: 1, title: "授信确认", desc: "授信核准流入" },
  { key: 2, title: "抵质押办理", desc: "标的锁定与审核签章" },
  { key: 3, title: "贷款发放", desc: "录入放款结果与回单" },
  { key: 4, title: "还款结清", desc: "解质押同步终态归档" },
]

function resolveStepIndex(record: OnlinePledgeRecord): number {
  if (record.financingStatus === "CREDIT_SUCCESS") return 1
  if (record.financingStatus === "IN_PROCESSING") return 2
  if (record.financingStatus === "LOAN_DISBURSED") return 3
  return 4
}

export function OnlinePledgeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [record, setRecord] = useState<OnlinePledgeRecord | null>(null)
  const [settleConfirmOpen, setSettleConfirmOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const list = loadOnlinePledgeRecords()
    const decoded = id ? decodeURIComponent(id) : ""
    const found =
      list.find((item) => item.id === decoded || item.applyNo === decoded) ??
      list[0] ??
      null
    setRecord(found)
  }, [id])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3000)
  }

  if (!record) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-card p-8 text-center">
          <div className="text-base font-medium">未找到对应线上监管业务单据</div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => navigate(ONLINE_PLEDGE_LIST_PATH)}
          >
            返回列表
          </Button>
        </div>
      </div>
    )
  }

  const statusMeta = FINANCING_STATUS_META[record.financingStatus]
  const collateralMeta = COLLATERAL_TYPE_META[record.collateralType]
  const activeStep = resolveStepIndex(record)
  const isSettled = record.financingStatus === "SETTLED"

  const handleSimulateSettle = () => {
    const now = nowFormatted()
    const updated: OnlinePledgeRecord = {
      ...record,
      financingStatus: "SETTLED",
      processingStage: undefined,
      handlerName: "系统事件总线",
      handledAt: now,
      version: record.version + 1,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          time: now,
          action: "解质押结清同步",
          operator: "系统事件总线",
          operatorOrg: "仓储监管中心",
          result: "已结清（终态只读）",
          remark: `关联抵质押订单 ${record.pledgeOrderNo ?? "PO-已核销"} 已完成解质押，单据自动归档锁定。`,
        },
        ...record.timeline,
      ],
    }
    const all = loadOnlinePledgeRecords().map((item) =>
      item.id === updated.id ? updated : item,
    )
    saveOnlinePledgeRecords(all)
    setRecord(updated)
    setSettleConfirmOpen(false)
    showToast("关联抵质押订单已完成解质押，单据已同步为「已结清」终态")
  }

  return (
    <PrototypeAnnotationProvider
      title={`线上监管业务详情 · ${record.applyNo}`}
      documents={onlinePledgeDocuments}
      annotations={onlinePledgeDetailAnnotations}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["online-pledge-detail-header"]}>
          <DetailPageHeader
            title="线上监管业务详情"
            number={record.applyNo}
            numberLabel="申请单号"
            onBack={() => navigate(ONLINE_PLEDGE_LIST_PATH)}
            status={
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={statusMeta.badgeClass}>
                  {statusMeta.label}
                </Badge>
                {record.financingStatus === "IN_PROCESSING" &&
                  record.processingStage && (
                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50/70 text-amber-700"
                    >
                      {PROCESSING_STAGE_LABEL[record.processingStage]}
                    </Badge>
                  )}
                <Badge variant="secondary" className="text-xs">
                  版本 v{record.version}
                </Badge>
              </div>
            }
            actions={
              <div className="flex flex-wrap items-center gap-2">
                {record.financingStatus === "CREDIT_SUCCESS" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      navigate(onlinePledgeActionPath(record.id, "initiate"))
                    }
                  >
                    发起抵质押确认
                  </Button>
                )}
                {record.financingStatus === "IN_PROCESSING" &&
                  record.processingStage !== "ORDER_GENERATED" && (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          navigate(onlinePledgeActionPath(record.id, "audit"))
                        }
                      >
                        审核任务
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(onlinePledgeActionPath(record.id, "cancel"))
                        }
                      >
                        主动撤销
                      </Button>
                    </>
                  )}
                {record.financingStatus === "IN_PROCESSING" &&
                  record.processingStage === "ORDER_GENERATED" && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        navigate(onlinePledgeActionPath(record.id, "disburse"))
                      }
                    >
                      录入放款结果
                    </Button>
                  )}
                {record.financingStatus === "LOAN_DISBURSED" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSettleConfirmOpen(true)}
                  >
                    模拟解质押结清同步
                  </Button>
                )}
              </div>
            }
          />
        </PrototypeAnnotationTarget>

        {/* 全生命周期进度条 */}
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="grid gap-3 md:grid-cols-4">
            {LIFECYCLE_STEPS.map((step) => {
              const done = step.key < activeStep || (isSettled && step.key === 4)
              const current = step.key === activeStep && !isSettled
              return (
                <div
                  key={step.key}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
                    current
                      ? "border-primary/50 bg-primary/5"
                      : done
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-border/60 bg-muted/20"
                  }`}
                >
                  <div
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      done
                        ? "bg-emerald-600 text-white"
                        : current
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? <CheckCircle2Icon className="size-4" /> : step.key}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {step.title}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {step.desc}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {isSettled && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700">
              <LockIcon className="size-4 shrink-0 text-slate-500" />
              <span>{ONLINE_PLEDGE_SETTLED_USER_HINT}</span>
            </div>
            <PrototypeSpecCallout>{ONLINE_PLEDGE_SETTLED_SPEC_NOTE}</PrototypeSpecCallout>
          </div>
        )}

        {record.lastRollbackReason && (
          <div className="space-y-2">
            <div className="rounded-lg border border-rose-200 bg-rose-50/70 px-4 py-3 text-xs text-rose-800">
              <div className="font-semibold">最近一次异常本地回退原因</div>
              <div className="mt-1 leading-relaxed">{record.lastRollbackReason}</div>
            </div>
            <PrototypeSpecCallout>{ONLINE_PLEDGE_ROLLBACK_SPEC_NOTE}</PrototypeSpecCallout>
          </div>
        )}

        {/* 1. 基本授信与申请人信息 */}
        <PrototypeAnnotationTarget annotationIds={["online-pledge-detail-credit"]}>
          <DetailSection title="基本授信与申请人信息">
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField label="申请单号" value={record.applyNo} />
              <DetailField label="产品名称" value={record.productName} />
              <DetailField label="资金方机构" value={record.funderName} />
              <DetailField
                label="需要尽调"
                value={record.needDiligence ? "是（需尽调）" : "否（免尽调）"}
              />
              <DetailField
                label="申请人类型"
                value={record.applicantType === "ENTERPRISE" ? "企业货主" : "个人货主"}
              />
              <DetailField label="申请人名称" value={record.applicantName} />
              <DetailField label="申请人标识" value={record.applicantIdentifier} />
              <DetailField label="申请时间" value={record.appliedAt} />

              {record.applicantType === "INDIVIDUAL" ? (
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
              ) : (
                <>
                  <DetailField
                    label="营业执照编号"
                    value={formatEmptyValue(record.businessLicenseNo)}
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
              )}

              <DetailField
                label="意向融资金额（元）"
                value={formatYuan(record.intendedAmountYuan)}
              />
              <DetailField
                label="意向融资期数"
                value={`${record.intendedPeriods} 期`}
              />
              <DetailField
                label="授信金额（元）"
                value={
                  <span className="font-semibold text-foreground">
                    {formatYuan(record.creditAmountYuan)}
                  </span>
                }
              />
              <DetailField
                label="授信期数"
                value={`${record.creditPeriods} 期`}
              />
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 2. 质押标的清单 */}
        <PrototypeAnnotationTarget annotationIds={["online-pledge-detail-collateral"]}>
          <DetailSection title="质押标的清单">
            <div className="mb-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField
                label="抵/质押物类型"
                value={
                  <Badge variant="outline" className={collateralMeta.badgeClass}>
                    {collateralMeta.label}
                  </Badge>
                }
              />
              <DetailField
                label="标的评估价值（元）"
                value={formatYuan(record.assessedValueYuan)}
              />
              <DetailField
                label="核定质押率（%）"
                value={
                  record.approvedPledgeRatio !== undefined
                    ? `${record.approvedPledgeRatio.toFixed(2)}%`
                    : "--"
                }
              />
              <DetailField
                label="关联抵质押订单号"
                value={formatEmptyValue(record.pledgeOrderNo)}
              />
            </div>

            {record.collateralType === "INVENTORY" ? (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="whitespace-nowrap px-3 py-2.5 font-medium">货品大类 / 品类</th>
                      <th className="whitespace-nowrap px-3 py-2.5 font-medium">规格型号</th>
                      <th className="whitespace-nowrap px-3 py-2.5 font-medium">监管仓库 / 货位</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-right font-medium">质押数量</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-right font-medium">评估单价（元）</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-right font-medium">评估货值（元）</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-center font-medium">标的可用性</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {record.inventoryItems.map((inv) => (
                      <tr key={inv.id}>
                        <td className="px-3 py-2.5 font-medium">
                          {inv.categoryName} · {inv.varietyName}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">
                          {inv.specModel}
                        </td>
                        <td className="px-3 py-2.5">
                          {inv.warehouseName} / {inv.zoneLocation}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {inv.pledgeQuantity} {inv.unit}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {formatYuan(inv.unitPriceYuan)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-medium tabular-nums">
                          {formatYuan(inv.assessedValueYuan)}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <Badge
                            variant="outline"
                            className={
                              inv.availability === "AVAILABLE"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : inv.availability === "LOCKED"
                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                  : "border-rose-200 bg-rose-50 text-rose-700"
                            }
                          >
                            {inv.availability === "AVAILABLE"
                              ? "在库可用"
                              : inv.availability === "LOCKED"
                                ? "已质押锁定"
                                : "已占用异常"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="whitespace-nowrap px-3 py-2.5 font-medium">仓单编号</th>
                      <th className="whitespace-nowrap px-3 py-2.5 font-medium">货品摘要</th>
                      <th className="whitespace-nowrap px-3 py-2.5 font-medium">监管仓库</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-right font-medium">仓单数量</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-right font-medium">评估货值（元）</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-center font-medium">仓单状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {record.receiptItems.map((wr) => (
                      <tr key={wr.id}>
                        <td className="px-3 py-2.5">
                          <Link
                            to={`/仓储/仓单管理/详情/${encodeURIComponent(wr.receiptNo)}`}
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                          >
                            {wr.receiptNo}
                            <ExternalLinkIcon className="size-3" />
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 font-medium">{wr.goodsSummary}</td>
                        <td className="px-3 py-2.5">{wr.warehouseName}</td>
                        <td className="px-3 py-2.5 text-right">{wr.quantityText}</td>
                        <td className="px-3 py-2.5 text-right font-medium tabular-nums">
                          {formatYuan(wr.assessedValueYuan)}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <Badge
                            variant="outline"
                            className={
                              wr.availability === "AVAILABLE"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                            }
                          >
                            {wr.availability === "AVAILABLE"
                              ? "有效未质押"
                              : "已质押锁定"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 3. 电子协议与存证 */}
        <DetailSection title="电子协议与存证">
          {record.evidenceHash && (
            <div className="mb-3 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">
              <ShieldCheckIcon className="size-3.5" />
              区块链防篡改存证已固化
            </div>
          )}
          <div className="mb-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <DetailField
              label="电子存证哈希"
              value={
                record.evidenceHash ? (
                  <span className="break-all text-xs text-foreground">
                    {record.evidenceHash}
                  </span>
                ) : (
                  "--（流程审核通过后生成）"
                )
              }
            />
            <DetailField
              label="最近处理人 / 处理时间"
              value={`${record.handlerName} · ${record.handledAt}`}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {record.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileTextIcon className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-foreground">
                      {att.fileName}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {att.category} · {att.fileSize}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 px-2 text-xs"
                  onClick={() => showToast(`正在安全下载附件：${att.fileName}`)}
                >
                  <DownloadIcon className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </DetailSection>

        {/* 4. 放款明细 */}
        <PrototypeAnnotationTarget annotationIds={["online-pledge-detail-disbursement"]}>
          <DetailSection title="放款明细">
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField
                label="贷款金额（元）"
                value={
                  <span className="font-semibold text-emerald-700">
                    {formatYuan(record.loanAmountYuan)}
                  </span>
                }
              />
              <DetailField
                label="贷款期数"
                value={record.loanPeriods ? `${record.loanPeriods} 期` : "--"}
              />
              <DetailField
                label="放款日期"
                value={formatEmptyValue(record.disburseDate)}
              />
              <DetailField
                label="放款凭证附件"
                value={
                  record.disburseReceiptFileName ? (
                    <button
                      type="button"
                      className="text-left text-primary hover:underline"
                      onClick={() =>
                        showToast(`正在预览回单：${record.disburseReceiptFileName}`)
                      }
                    >
                      {record.disburseReceiptFileName}
                    </button>
                  ) : (
                    "--"
                  )
                }
              />
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 5. 流转与回退日志 */}
        <DetailSection title={`流转与回退日志（共 ${record.timeline.length} 条）`}>
          <div className="space-y-3">
            {record.timeline.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col gap-1 rounded-lg border border-border/70 bg-muted/15 px-4 py-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{ev.action}</span>
                    <Badge variant="outline" className="text-[11px]">
                      {ev.result}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground">{ev.time}</span>
                </div>
                <div className="text-muted-foreground">
                  操作人：{ev.operator}（{ev.operatorOrg}）
                </div>
                {ev.remark && (
                  <div className="mt-0.5 text-foreground/90">{ev.remark}</div>
                )}
              </div>
            ))}
          </div>
        </DetailSection>

        <Dialog open={settleConfirmOpen} onOpenChange={setSettleConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认模拟解质押结清同步？</DialogTitle>
              <DialogDescription>
                模拟仓储监管侧完成【{record.applyNo}】关联抵质押订单的解质押手续，系统将自动把单据同步为「已结清」终态并全字段只读锁定。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSettleConfirmOpen(false)}
              >
                取消
              </Button>
              <Button type="button" onClick={handleSimulateSettle}>
                确认结清同步
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 max-w-sm rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
