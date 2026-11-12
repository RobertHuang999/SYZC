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
  TriggerDueDiligenceModal,
  ReassignTaskModal,
  ManualRejectModal,
  AssignFunderModal,
  ViewReportModal,
} from "../components/DueDiligenceActionModals"
import { customerFinancingDueDiligenceDocuments } from "../documents/customer-financing-due-diligence-documents"
import { customerFinancingDueDiligenceDetailAnnotations } from "../annotations/customer-financing-due-diligence-detail.annotations"
import {
  DUE_DILIGENCE_LIST_PATH,
  DILIGENCE_STATUS_CONFIG,
  DUE_DILIGENCE_STORAGE_KEY,
  INITIAL_DUE_DILIGENCE_MOCK,
} from "../domain/constants"
import type { CustomerFinancingDueDiligence } from "../domain/types"
import {
  CheckCircle2Icon,
  DownloadIcon,
  FileTextIcon,
  PaperclipIcon,
  UploadCloudIcon,
} from "lucide-react"

export function CustomerFinancingDueDiligenceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [item, setItem] = useState<CustomerFinancingDueDiligence | null>(null)
  const [copied, setCopied] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 弹窗状态
  const [triggerModalOpen, setTriggerModalOpen] = useState(false)
  const [reassignModalOpen, setReassignModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [viewReportModalOpen, setViewReportModalOpen] = useState(false)

  // 加载单据
  useEffect(() => {
    let list: CustomerFinancingDueDiligence[] = INITIAL_DUE_DILIGENCE_MOCK
    try {
      const raw = localStorage.getItem(DUE_DILIGENCE_STORAGE_KEY)
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

  const handleCopyId = () => {
    if (item) {
      navigator.clipboard.writeText(item.id)
      setCopied(true)
      showToast("尽调任务单号已复制到剪贴板")
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  const updateItemInStorage = (updated: CustomerFinancingDueDiligence) => {
    setItem(updated)
    try {
      const raw = localStorage.getItem(DUE_DILIGENCE_STORAGE_KEY)
      let list: CustomerFinancingDueDiligence[] = INITIAL_DUE_DILIGENCE_MOCK
      if (raw) {
        list = JSON.parse(raw)
      }
      const next = list.map((d) => (d.id === updated.id ? updated : d))
      localStorage.setItem(DUE_DILIGENCE_STORAGE_KEY, JSON.stringify(next))
    } catch (e) {
      console.error(e)
    }
  }

  if (!item) {
    return (
      <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
        正在加载尽调任务详情...
      </div>
    )
  }

  const statusConfig = DILIGENCE_STATUS_CONFIG[item.status]

  // -------------------------------------------------------------
  // 操作处理函数
  // -------------------------------------------------------------
  const handleConfirmTrigger = (d: CustomerFinancingDueDiligence) => {
    setTriggerModalOpen(false)
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const updated: CustomerFinancingDueDiligence = {
      ...d,
      status: "IN_PROCESSING",
      processedAt: now,
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "发起智风控尽调",
          operator: d.surveyor,
          time: now,
          detail:
            "专员核对主体三要素齐全，异步调用智风控 OpenAPI，状态推进至【受理中】",
        },
        ...d.logs,
      ],
    }
    updateItemInStorage(updated)
    showToast("已发起智风控核验，单据状态变更为【受理中】")

    // 模拟 3.5 秒后回调通过
    window.setTimeout(() => {
      const callbackTime = new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19)
      const successItem: CustomerFinancingDueDiligence = {
        ...updated,
        status: "DILIGENCE_SUCCESS",
        riskConclusion: "PASS",
        riskScore: 89,
        riskDetailSummary:
          "第三方智风控网关自动回调：大数据评分89分（通过），主体资信优良，无不良司法涉诉",
        processedAt: callbackTime,
        logs: [
          {
            id: `LOG_${Date.now() + 1}`,
            action: "智风控网关回调 PASS",
            operator: "智风控平台API",
            time: callbackTime,
            detail:
              "外部大数据模型核验通过，单据自动变更为【受理成功】，移入完成标签页",
          },
          ...updated.logs,
        ],
      }
      updateItemInStorage(successItem)
      showToast(
        "【异步回调通知】智风控审核通过（PASS），单据已更新为【受理成功】！"
      )
    }, 3500)
  }

  const handleConfirmReassign = (
    d: CustomerFinancingDueDiligence,
    targetSurveyor: string,
    reason: string
  ) => {
    setReassignModalOpen(false)
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const updated: CustomerFinancingDueDiligence = {
      ...d,
      surveyor: targetSurveyor,
      processedAt: now,
      transferHistory: [
        ...(d.transferHistory || []),
        {
          fromSurveyor: d.surveyor,
          toSurveyor: targetSurveyor,
          reason: reason || "同组织专员交接",
          time: now,
        },
      ],
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "同组织任务转交",
          operator: d.surveyor,
          time: now,
          detail: `将尽调任务转交给同机构专员【${targetSurveyor}】${
            reason ? `，原因：${reason}` : ""
          }，状态保持待尽调`,
        },
        ...d.logs,
      ],
    }
    updateItemInStorage(updated)
    showToast(`任务已成功转交至【${targetSurveyor}】`)
  }

  const handleConfirmReject = (
    d: CustomerFinancingDueDiligence,
    category: string,
    detail: string
  ) => {
    setRejectModalOpen(false)
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const updated: CustomerFinancingDueDiligence = {
      ...d,
      status: "MANUAL_REJECTED",
      rejectCategory: category,
      rejectDetail: detail,
      processedAt: now,
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "现场勘验手动拒绝",
          operator: d.surveyor,
          time: now,
          detail: `专员排查异常手动拒绝，原因：【${category}】，说明：${detail}。单据标记为【申请失败】入池`,
        },
        ...d.logs,
      ],
    }
    updateItemInStorage(updated)
    showToast("尽调已手动拒绝（申请失败），已可靠投递至被拒退回池")
  }

  const handleConfirmAssignFunder = (
    d: CustomerFinancingDueDiligence,
    funderName: string,
    remark: string
  ) => {
    setAssignModalOpen(false)
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const updated: CustomerFinancingDueDiligence = {
      ...d,
      partnerFunderName: funderName,
      processedAt: now,
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "分配给合作资方",
          operator: d.surveyor,
          time: now,
          detail: `专员选派资方【${funderName}】${
            remark ? `（备注：${remark}）` : ""
          }，已推送下游客户融资授信办理`,
        },
        ...d.logs,
      ],
    }
    updateItemInStorage(updated)
    showToast(`已成功分配至【${funderName}】！`)
  }

  const handleUploadMockReport = (d: CustomerFinancingDueDiligence) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const newReport = {
      id: `ATT_${Date.now()}`,
      name: `${d.applicantName}_现场实地核查与综合尽调报告_盖章件.pdf`,
      size: "5.8 MB",
      type: "pdf",
      uploadedAt: now,
      isReport: true,
    }
    const updated: CustomerFinancingDueDiligence = {
      ...d,
      attachments: [newReport, ...d.attachments],
      logs: [
        {
          id: `LOG_${Date.now()}`,
          action: "归档盖章尽调报告",
          operator: d.surveyor,
          time: now,
          detail: `上传《${newReport.name}》，尽调报告门禁核验通过 (R04)`,
        },
        ...d.logs,
      ],
    }
    updateItemInStorage(updated)
    showToast("已成功归档正式盖章版尽调报告，门禁校验通过！")
  }

  return (
    <PrototypeAnnotationProvider
      documents={customerFinancingDueDiligenceDocuments}
      annotations={customerFinancingDueDiligenceDetailAnnotations}
    >
      <div className="space-y-6 p-6">
        {/* Toast 提示浮窗 */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background shadow-lg transition-all">
            <CheckCircle2Icon className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 顶部标题与操作条 */}
        <PrototypeAnnotationTarget annotationIds={["detail-header"]}>
          <DetailPageHeader
            title="客户融资尽调办理详情"
            number={item.id}
            numberLabel="尽调编号"
            status={
              <Badge
                variant="outline"
                className={`ml-2 text-xs ${statusConfig.badgeClass}`}
              >
                {statusConfig.label}
              </Badge>
            }
            onBack={() => navigate(DUE_DILIGENCE_LIST_PATH)}
            onCopy={handleCopyId}
            copied={copied}
            actions={
              <div className="flex items-center gap-2">
                {item.status === "PENDING_DILIGENCE" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => setTriggerModalOpen(true)}
                      className="h-8 text-xs"
                    >
                      发起尽调
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReassignModalOpen(true)}
                      className="h-8 text-xs"
                    >
                      任务转交
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRejectModalOpen(true)}
                      className="h-8 border-rose-300 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      手动拒绝
                    </Button>
                  </>
                )}

                {item.status === "DILIGENCE_SUCCESS" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => setAssignModalOpen(true)}
                      className="h-8 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                    >
                      分配给资方
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewReportModalOpen(true)}
                      className="h-8 text-xs"
                    >
                      下载尽调报告
                    </Button>
                  </>
                )}

                {(item.status === "DILIGENCE_FAILED" ||
                  item.status === "MANUAL_REJECTED") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewReportModalOpen(true)}
                    className="h-8 text-xs"
                  >
                    下载报告
                  </Button>
                )}
              </div>
            }
          />
        </PrototypeAnnotationTarget>

        {/* 1. 主体资质信息卡片 */}
        <PrototypeAnnotationTarget annotationIds={["detail-applicant-section"]}>
          <DetailSection title="主体资质与融资意向信息">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField label="申请主体全称" value={item.applicantName} />
              <DetailField label="申请人类型" value={item.applicantType} />
              <DetailField
                label="统一社会信用代码/身份证"
                value={item.applicantIdentifier}
              />
              <DetailField
                label="法定代表人姓名"
                value={item.applicantLegalPerson || "周建国"}
              />
              <DetailField label="经办人姓名" value={item.agentName} />
              <DetailField label="经办人联系电话" value={item.agentPhone} />
              <DetailField
                label="意向融资金额（元）"
                value={
                  <span className="font-semibold text-foreground">
                    ¥{item.intendedAmount.toLocaleString("zh-CN", { minimumFractionDigits: 4 })}
                  </span>
                }
              />
              <DetailField
                label="意向融资期数"
                value={`${item.intendedPeriods} 期`}
              />
              <DetailField label="质押资产大类" value={item.collateralType} />
              <DetailField label="监管仓库名称" value={item.warehouseName || "--"} />
              <DetailField label="尽调分配时间" value={item.assignedAt} />
              <DetailField label="最新处理时间" value={item.processedAt} />
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 2. 抵/质押物标的明细 */}
        <PrototypeAnnotationTarget annotationIds={["detail-collateral-section"]}>
          <DetailSection title="抵/质押物标的资产明细">
            {item.collateralType === "仓单" && item.warehouseReceiptDetails && (
              <div className="mb-4 rounded-md border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-semibold text-foreground">
                      标准电子仓单凭证：{item.warehouseReceiptDetails.receiptNo}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-blue-300 bg-blue-100 text-blue-700"
                  >
                    {item.warehouseReceiptDetails.freezeStatus}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-muted-foreground">开单仓库：</span>
                    <span className="font-medium text-foreground">
                      {item.warehouseReceiptDetails.warehouseName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">货值估价：</span>
                    <span className="font-semibold text-foreground">
                      ¥{item.warehouseReceiptDetails.estimatedValue.toLocaleString("zh-CN", { minimumFractionDigits: 4 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">凭证状态：</span>
                    <span className="font-medium text-emerald-600">
                      电子签章有效
                    </span>
                  </div>
                </div>
              </div>
            )}

            {item.inventoryDetails && item.inventoryDetails.length > 0 && (
              <div className="overflow-x-auto rounded-md border border-border/70">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2.5">货物大类</th>
                      <th className="px-3 py-2.5">品类细类</th>
                      <th className="px-3 py-2.5">规格型号</th>
                      <th className="px-3 py-2.5 text-right">在库数量</th>
                      <th className="px-3 py-2.5 text-center">计量单位</th>
                      <th className="px-3 py-2.5">存放库位</th>
                      <th className="px-3 py-2.5 text-right">申报货值（元）</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {item.inventoryDetails.map((inv) => (
                      <tr key={inv.id} className="hover:bg-muted/30">
                        <td className="px-3 py-2 text-foreground font-medium">
                          {inv.category}
                        </td>
                        <td className="px-3 py-2 text-foreground">
                          {inv.subcategory}
                        </td>
                        <td className="px-3 py-2 text-foreground">
                          {inv.specification}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {inv.quantity.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-center text-muted-foreground">
                          {inv.unit}
                        </td>
                        <td className="px-3 py-2 text-foreground">
                          {inv.warehouseLocation}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-foreground">
                          ¥{inv.declaredValue.toLocaleString("zh-CN", { minimumFractionDigits: 4 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 3. 智风控大数据核验结论 */}
        <PrototypeAnnotationTarget annotationIds={["detail-risk-section"]}>
          <DetailSection title="智风控大数据核验结论与安全签名">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField
                label="智风控最终结论"
                value={
                  item.riskConclusion ? (
                    <Badge
                      variant="outline"
                      className={`gap-1 px-2.5 py-0.5 text-xs font-semibold ${
                        item.riskConclusion === "PASS"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : item.riskConclusion === "REJECT"
                          ? "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                      }`}
                    >
                      {item.riskConclusion === "PASS"
                        ? "通过 (PASS)"
                        : item.riskConclusion === "REJECT"
                        ? "不通过 (REJECT)"
                        : "需人工复核 (REVIEW)"}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">
                      待发起/接口调用中
                    </span>
                  )
                }
              />
              <DetailField
                label="大数据信用综合得分"
                value={
                  item.riskScore ? (
                    <span className="text-base font-bold text-emerald-600">
                      {item.riskScore} 分
                    </span>
                  ) : (
                    "--"
                  )
                }
              />
              <DetailField
                label="分配合作资方机构"
                value={
                  item.partnerFunderName ? (
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {item.partnerFunderName}
                    </span>
                  ) : (
                    "暂未分配"
                  )
                }
              />
              <DetailField
                label="安全传输签名 (P02)"
                value="SSO-TOKEN 有效期 15 分钟"
              />
            </div>

            {item.riskDetailSummary && (
              <div className="mt-3 rounded-md border border-border/70 bg-card p-3 text-xs leading-relaxed text-foreground">
                <span className="font-medium text-muted-foreground">
                  模型审查摘要：
                </span>
                {item.riskDetailSummary}
              </div>
            )}

            {item.rejectCategory && (
              <div className="mt-3 rounded-md border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
                <div className="font-semibold">
                  专员手动拒绝原因：【{item.rejectCategory}】
                </div>
                <div className="mt-1 leading-relaxed">{item.rejectDetail}</div>
              </div>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 4. 现场尽调材料与报告清单 */}
        <PrototypeAnnotationTarget annotationIds={["detail-attachments-section"]}>
          <DetailSection title="现场尽调材料清单与报告归档">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  归档附件支持在线预览与安全下载
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUploadMockReport(item)}
                  className="h-7 text-xs"
                >
                  <UploadCloudIcon className="mr-1 h-3.5 w-3.5" />
                  上传盖章尽调报告
                </Button>
              </div>

              <div className="divide-y divide-border/60 rounded-md border border-border/70 bg-card">
                {item.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3 text-xs hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <PaperclipIcon className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-foreground">
                          {att.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {att.size} · 上传于 {att.uploadedAt}
                          {att.isReport && (
                            <Badge
                              variant="outline"
                              className="ml-2 border-emerald-300 bg-emerald-50 text-[10px] text-emerald-700"
                            >
                              正式尽调报告盖章件
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => showToast(`正在下载文件：${att.name}`)}
                      className="h-7 gap-1 text-xs"
                    >
                      <DownloadIcon className="h-3 w-3" />
                      下载
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 5. 审批轨迹时间轴 */}
        <PrototypeAnnotationTarget annotationIds={["detail-audit-section"]}>
          <DetailSection title="任务流转与全生命周期审计轨迹">
            <div className="space-y-3">
              {item.logs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 rounded-md border border-border/50 bg-card p-3 text-xs"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        {log.action}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {log.time}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      操作人：{log.operator}
                    </div>
                    {log.detail && (
                      <p className="text-xs leading-relaxed text-foreground/90">
                        {log.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 交互模态弹窗 */}
        <TriggerDueDiligenceModal
          open={triggerModalOpen}
          item={item}
          onClose={() => setTriggerModalOpen(false)}
          onConfirm={handleConfirmTrigger}
        />

        <ReassignTaskModal
          open={reassignModalOpen}
          item={item}
          onClose={() => setReassignModalOpen(false)}
          onConfirm={handleConfirmReassign}
        />

        <ManualRejectModal
          open={rejectModalOpen}
          item={item}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={handleConfirmReject}
        />

        <AssignFunderModal
          open={assignModalOpen}
          item={item}
          onClose={() => setAssignModalOpen(false)}
          onConfirm={handleConfirmAssignFunder}
          onUploadMockReport={handleUploadMockReport}
        />

        <ViewReportModal
          open={viewReportModalOpen}
          item={item}
          onClose={() => setViewReportModalOpen(false)}
          onDownload={(fileName) => showToast(`正在安全下载：${fileName}`)}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
