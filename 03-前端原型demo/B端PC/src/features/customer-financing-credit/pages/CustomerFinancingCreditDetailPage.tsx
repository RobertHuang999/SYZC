import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import {
  DetailSection,
  DetailField,
} from "@/shared/components/DetailSection"
import {
  ApproveCreditModal,
  RejectCreditModal,
  ChangeToFailedModal,
  ChangeToSuccessModal,
} from "../components/CreditActionModals"
import { customerFinancingCreditDocuments } from "../documents/customer-financing-credit-documents"
import { customerFinancingCreditDetailAnnotations } from "../annotations/customer-financing-credit-detail.annotations"
import {
  CREDIT_STORAGE_KEY,
  INITIAL_CREDIT_MOCK,
  STATUS_META,
  formatCurrency,
} from "../domain/constants"
import type {
  CustomerFinancingCredit,
  RejectCategory,
} from "../domain/types"
import {
  CheckCircle2Icon,
  XCircleIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  LockIcon,
  ShieldCheckIcon,
  PackageIcon,
  HistoryIcon,
  BuildingIcon,
  FileCheck2Icon,
} from "lucide-react"

const CREDIT_LIST_PATH = "/融资/监管/融资管理/客户融资授信办理"

export function CustomerFinancingCreditDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [item, setItem] = useState<CustomerFinancingCredit | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // 弹窗状态
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [changeToFailedModalOpen, setChangeToFailedModalOpen] = useState(false)
  const [changeToSuccessModalOpen, setChangeToSuccessModalOpen] = useState(false)

  // 加载数据
  useEffect(() => {
    let list: CustomerFinancingCredit[] = INITIAL_CREDIT_MOCK
    try {
      const raw = localStorage.getItem(CREDIT_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed
        }
      }
    } catch (e) {
      console.error(e)
    }

    const found = list.find((d) => d.id === id) || list[0]
    setItem(found)
  }, [id])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3000)
  }

  const updateItemInStorage = (updated: CustomerFinancingCredit) => {
    setItem(updated)
    try {
      const raw = localStorage.getItem(CREDIT_STORAGE_KEY)
      let list: CustomerFinancingCredit[] = INITIAL_CREDIT_MOCK
      if (raw) {
        list = JSON.parse(raw)
      }
      const next = list.map((d) => (d.id === updated.id ? updated : d))
      localStorage.setItem(CREDIT_STORAGE_KEY, JSON.stringify(next))
    } catch (e) {
      console.error(e)
    }
  }

  // 1. 核准授信
  const handleConfirmApprove = (
    target: CustomerFinancingCredit,
    creditAmount: number,
    creditPeriods: number,
    remark?: string
  ) => {
    const nowStr = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\//g, "-")

    const updated: CustomerFinancingCredit = {
      ...target,
      status: "APPLY_SUCCESS",
      creditAmount,
      creditPeriods,
      creditRemark: remark,
      processor: "当前资方审核专员（全员共享）",
      processedAt: nowStr,
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "核准授信额度",
          operator: "当前资方审核专员",
          organization: target.funderOrgName,
          time: nowStr,
          detail: `标记申请成功：核准授信金额 ${creditAmount.toFixed(4)} 元，授信期数 ${creditPeriods} 期，已激活下游【线上监管业务办理】。`,
        },
        ...target.logs,
      ],
    }

    updateItemInStorage(updated)
    showToast("授信额度核准成功，已即刻激活下游线上抵质押办理！")
  }

  // 2. 标记失败
  const handleConfirmReject = (
    target: CustomerFinancingCredit,
    category: RejectCategory,
    detail: string
  ) => {
    const nowStr = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\//g, "-")

    const updated: CustomerFinancingCredit = {
      ...target,
      status: "APPLY_FAILED",
      rejectCategory: category,
      rejectDetail: detail,
      processor: "当前资方审核专员（全员共享）",
      processedAt: nowStr,
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "审批拒绝入池",
          operator: "当前资方审核专员",
          organization: target.funderOrgName,
          time: nowStr,
          detail: `标记申请失败：【${category}】${detail}。已写入被拒退回池 -> 授信失败标签页。`,
        },
        ...target.logs,
      ],
    }

    updateItemInStorage(updated)
    showToast("已标记授信申请失败，记录已可靠同步至被拒退回池！")
  }

  // 3. 改标为失败
  const handleConfirmChangeToFailed = (
    target: CustomerFinancingCredit,
    category: RejectCategory,
    reason: string
  ) => {
    const nowStr = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\//g, "-")

    const updated: CustomerFinancingCredit = {
      ...target,
      status: "APPLY_FAILED",
      rejectCategory: category,
      rejectDetail: reason,
      processor: "当前资方审核专员（全员共享）",
      processedAt: nowStr,
      changeRecords: [
        {
          id: `CHG_${Date.now()}`,
          operator: "当前资方审核专员",
          organization: target.funderOrgName,
          time: nowStr,
          fromStatus: "APPLY_SUCCESS",
          toStatus: "APPLY_FAILED",
          reason,
          creditAmount: target.creditAmount,
          creditPeriods: target.creditPeriods,
        },
        ...target.changeRecords,
      ],
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "改标为申请失败",
          operator: "当前资方审核专员",
          organization: target.funderOrgName,
          time: nowStr,
          detail: `资方自纠偏改标：从申请成功改为申请失败，撤销下游抵质押权限。原因：${reason}`,
        },
        ...target.logs,
      ],
    }

    updateItemInStorage(updated)
    showToast("已改标为申请失败，并同步写入被拒池！")
  }

  // 4. 改标为成功
  const handleConfirmChangeToSuccess = (
    target: CustomerFinancingCredit,
    creditAmount: number,
    creditPeriods: number,
    reason: string
  ) => {
    const nowStr = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\//g, "-")

    const updated: CustomerFinancingCredit = {
      ...target,
      status: "APPLY_SUCCESS",
      creditAmount,
      creditPeriods,
      processor: "当前资方审核专员（全员共享）",
      processedAt: nowStr,
      changeRecords: [
        {
          id: `CHG_${Date.now()}`,
          operator: "当前资方审核专员",
          organization: target.funderOrgName,
          time: nowStr,
          fromStatus: "APPLY_FAILED",
          toStatus: "APPLY_SUCCESS",
          reason,
          creditAmount,
          creditPeriods,
        },
        ...target.changeRecords,
      ],
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "改标为申请成功",
          operator: "当前资方审核专员",
          organization: target.funderOrgName,
          time: nowStr,
          detail: `资方重申改标：从申请失败改为申请成功，核准授信金额 ${creditAmount.toFixed(4)} 元，重新激活下游抵质押。原因：${reason}`,
        },
        ...target.logs,
      ],
    }

    updateItemInStorage(updated)
    showToast("已重申改标为申请成功，重新激活抵质押办理！")
  }

  if (!item) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">正在加载授信详情...</p>
      </div>
    )
  }

  const statusMeta = STATUS_META[item.status]

  return (
    <PrototypeAnnotationProvider
      documents={customerFinancingCreditDocuments}
      annotations={customerFinancingCreditDetailAnnotations}
    >
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        {/* 全局操作反馈 Toast */}
        {toastMessage && (
          <div className="fixed right-6 top-20 z-50 rounded-md bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-lg transition-all">
            {toastMessage}
          </div>
        )}

        {/* 顶部标题栏与操作 */}
        <PrototypeAnnotationTarget annotationIds={["credit-detail-header"]}>
          <DetailPageHeader
            title="客户融资授信详情"
            number={item.id}
            numberLabel="授信编号"
            onBack={() => navigate(CREDIT_LIST_PATH)}
            onCopy={() => {
              navigator.clipboard.writeText(item.id)
              setCopied(true)
              showToast("授信编号已复制到剪贴板")
              setTimeout(() => setCopied(false), 2000)
            }}
            copied={copied}
            status={
              <span
                className={`inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium ${statusMeta.className}`}
              >
                {statusMeta.label}
              </span>
            }
            actions={
              <div className="flex items-center gap-2">
                {item.status === "CREDIT_ACCEPTED" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => setApproveModalOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2Icon className="mr-1 h-3.5 w-3.5" />
                      标记申请成功
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRejectModalOpen(true)}
                      className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <XCircleIcon className="mr-1 h-3.5 w-3.5" />
                      标记申请失败
                    </Button>
                  </>
                )}

                {item.status === "APPLY_SUCCESS" && !item.isDownstreamTriggered && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setChangeToFailedModalOpen(true)}
                    className="border-amber-300 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                  >
                    <RefreshCwIcon className="mr-1 h-3.5 w-3.5" />
                    改标为失败
                  </Button>
                )}

                {item.status === "APPLY_FAILED" && !item.isRescheduledInPool && (
                  <Button
                    size="sm"
                    onClick={() => setChangeToSuccessModalOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <RefreshCwIcon className="mr-1 h-3.5 w-3.5" />
                    改标为成功
                  </Button>
                )}
              </div>
            }
          />
        </PrototypeAnnotationTarget>

        {/* 子板块 1：授信审批与额度批复要素 */}
        <DetailSection title="授信批复核心要素">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField
              label="意向融资金额"
              value={`${formatCurrency(item.intendedAmount)} 元`}
            />
            <DetailField
              label="意向融资期数"
              value={`${item.intendedPeriods} 期`}
            />
            <DetailField
              label="核准授信金额"
              value={
                item.creditAmount !== null ? (
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(item.creditAmount)} 元
                  </span>
                ) : (
                  "--"
                )
              }
            />
            <DetailField
              label="核准授信期数"
              value={
                item.creditPeriods !== null ? `${item.creditPeriods} 期` : "--"
              }
            />
            <DetailField
              label="所属资方机构"
              value={item.funderOrgName}
            />
            <DetailField
              label="授信处理人员"
              value={item.processor || "--"}
            />
            <DetailField
              label="处理完成时间"
              value={item.processedAt || "--"}
            />
            <DetailField
              label="下游抵质押状态"
              value={
                item.isDownstreamTriggered ? (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <LockIcon className="h-3 w-3" />
                    已发起并提交确认（已锁定）
                  </span>
                ) : item.status === "APPLY_SUCCESS" ? (
                  <span className="text-emerald-600">
                    已激活发起入口，等待客户提交
                  </span>
                ) : (
                  "未激活"
                )
              }
            />
          </div>

          {/* 若为失败展示拒绝原因 */}
          {item.status === "APPLY_FAILED" && (
            <div className="mt-4 rounded-md border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
              <span className="font-semibold">资方信贷审批拒绝原因快照：</span>
              <p className="mt-1">
                【分类：{item.rejectCategory}】{item.rejectDetail}
              </p>
            </div>
          )}

          {/* 授信备注说明 */}
          {item.creditRemark && (
            <div className="mt-4 rounded-md border border-border/60 bg-muted/20 p-3 text-xs">
              <span className="font-medium text-foreground">资方贷审会批复说明：</span>
              <p className="mt-1 text-muted-foreground">{item.creditRemark}</p>
            </div>
          )}
        </DetailSection>

        {/* 子板块 2：申请主体基本资质 */}
        <PrototypeAnnotationTarget annotationIds={["credit-detail-applicant"]}>
          <DetailSection title="借款主体资质信息">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField label="申请主体全称" value={item.applicantName} />
              <DetailField label="申请人类型" value={item.applicantType} />
              <DetailField
                label="统一社会信用代码 / 证件号"
                value={item.applicantIdentifier}
              />
              <DetailField
                label="法定代表人"
                value={item.applicantLegalPerson || "--"}
              />
              <DetailField label="企业业务经办人" value={item.agentName} />
              <DetailField
                label="经办人联系电话"
                value={item.agentPhone}
              />
              <DetailField label="上游申请流水号" value={item.sourceApplyNo} />
              <DetailField label="申请接入时间" value={item.appliedAt} />
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 子板块 3：前置尽调与风控专区 */}
        <PrototypeAnnotationTarget annotationIds={["credit-detail-risk"]}>
          <DetailSection title="前置尽调与风控评估专区">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField
                label="是否需要实地尽调"
                value={
                  item.needDiligence ? (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    >
                      是（已完成线下实地核验）
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    >
                      否（免尽调线上秒批产品）
                    </Badge>
                  )
                }
              />
              <DetailField
                label="智风控综合评分"
                value={
                  item.riskScore ? (
                    <span className="font-semibold text-primary">
                      {item.riskScore} 分
                    </span>
                  ) : (
                    "--"
                  )
                }
              />
              <div className="sm:col-span-2">
                <DetailField
                  label="风控审查与尽调结论摘要"
                  value={item.riskSummary || "准入审查合格"}
                />
              </div>
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 子板块 4：抵质押物标的清单 */}
        <PrototypeAnnotationTarget annotationIds={["credit-detail-collateral"]}>
          <DetailSection title="抵质押标的资产明细">
            {item.collateralType === "存货" && item.inventoryDetails && (
              <div className="overflow-x-auto rounded-md border border-border/70">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 font-medium text-muted-foreground">
                    <tr>
                      <th className="whitespace-nowrap px-3 py-2.5">货物大类</th>
                      <th className="whitespace-nowrap px-3 py-2.5">货物细类</th>
                      <th className="whitespace-nowrap px-3 py-2.5">规格型号</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-right">数量</th>
                      <th className="whitespace-nowrap px-3 py-2.5">监管库位</th>
                      <th className="whitespace-nowrap px-3 py-2.5 text-right">申报货值(元)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {item.inventoryDetails.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2">{inv.category}</td>
                        <td className="px-3 py-2 font-medium">{inv.subcategory}</td>
                        <td className="px-3 py-2">{inv.specification}</td>
                        <td className="px-3 py-2 text-right">
                          {inv.quantity} {inv.unit}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {inv.warehouseLocation}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-foreground">
                          {formatCurrency(inv.declaredValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {item.collateralType === "仓单" && item.warehouseReceiptDetails && (
              <div className="rounded-md border border-border/70 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      仓单编号：{item.warehouseReceiptDetails.receiptNo}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.warehouseReceiptDetails.freezeStatus}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/仓储/仓单管理?receiptNo=${encodeURIComponent(
                          item.warehouseReceiptDetails!.receiptNo
                        )}`
                      )
                    }
                    className="h-7 text-xs text-primary"
                  >
                    <span>穿透查看仓单档案详情</span>
                    <ExternalLinkIcon className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">开单监管仓库：</span>
                    <p className="font-medium mt-0.5">
                      {item.warehouseReceiptDetails.warehouseName}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">货值评估金额：</span>
                    <p className="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {formatCurrency(item.warehouseReceiptDetails.estimatedValue)} 元
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">质押状态：</span>
                    <p className="mt-0.5">{item.warehouseReceiptDetails.freezeStatus}</p>
                  </div>
                </div>
              </div>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 子板块 5：审批轨迹与改标历史 */}
        <PrototypeAnnotationTarget annotationIds={["credit-detail-history"]}>
          <DetailSection title="审批轨迹与改标历史">
            {/* 改标历史记录卡片（若有发生改标） */}
            {item.changeRecords && item.changeRecords.length > 0 && (
              <div className="mb-4 space-y-2">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <RefreshCwIcon className="h-3.5 w-3.5" />
                  资方历次改标自纠偏记录：
                </span>
                <div className="rounded-md border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900/60 dark:bg-amber-950/20 space-y-2">
                  {item.changeRecords.map((cr) => (
                    <div
                      key={cr.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-200/60 pb-1.5 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <span className="font-medium">
                          {cr.operator}（{cr.organization}）
                        </span>
                        <span className="mx-2 text-muted-foreground">
                          将状态由【{STATUS_META[cr.fromStatus].label}】变更为【{STATUS_META[cr.toStatus].label}】
                        </span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          改标原因：{cr.reason}
                        </p>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-1 sm:mt-0">
                        {cr.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 审计日志列表 */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {item.logs.map((log) => (
                <div key={log.id} className="relative text-xs">
                  <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-semibold text-foreground">
                      {log.action}
                    </span>
                    <span className="text-muted-foreground">
                      {log.operator} · {log.organization}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {log.time}
                    </span>
                  </div>
                  {log.detail && (
                    <p className="mt-1 text-muted-foreground text-[11px] leading-relaxed">
                      {log.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 弹窗集合 */}
        <ApproveCreditModal
          open={approveModalOpen}
          item={item}
          onClose={() => setApproveModalOpen(false)}
          onConfirm={handleConfirmApprove}
        />

        <RejectCreditModal
          open={rejectModalOpen}
          item={item}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={handleConfirmReject}
        />

        <ChangeToFailedModal
          open={changeToFailedModalOpen}
          item={item}
          onClose={() => setChangeToFailedModalOpen(false)}
          onConfirm={handleConfirmChangeToFailed}
        />

        <ChangeToSuccessModal
          open={changeToSuccessModalOpen}
          item={item}
          onClose={() => setChangeToSuccessModalOpen(false)}
          onConfirm={handleConfirmChangeToSuccess}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
